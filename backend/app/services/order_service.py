import uuid
import random
import string
from datetime import date, timedelta
from decimal import Decimal
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.order import Order, OrderItem, OrderStatusHistory, OrderStatus, PaymentStatus
from app.models.cart import CartItem
from app.models.product import Product
from app.models.coupon import Coupon, DiscountType
from app.schemas.order import OrderCreate


def generate_order_number() -> str:
    return "AGR" + "".join(random.choices(string.digits, k=8))


def generate_tracking_number() -> str:
    return "TRK" + "".join(random.choices(string.ascii_uppercase + string.digits, k=10))


def calculate_coupon_discount(coupon: Coupon, order_amount: Decimal) -> Decimal:
    if coupon.discount_type == DiscountType.percentage:
        return (order_amount * coupon.discount_value / 100).quantize(Decimal("0.01"))
    return min(coupon.discount_value, order_amount)


def create_order_from_cart(db: Session, user_id: uuid.UUID, data: OrderCreate) -> Order:
    cart_items = db.query(CartItem).filter(CartItem.user_id == user_id).all()
    if not cart_items:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cart is empty")

    subtotal = Decimal("0")
    order_items_data = []

    for item in cart_items:
        product = db.query(Product).filter(Product.id == item.product_id, Product.is_active == True).first()
        if not product:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Product not available")
        if product.stock < item.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient stock for {product.name}",
            )
        item_total = product.price * item.quantity
        subtotal += item_total
        order_items_data.append({
            "product": product,
            "quantity": item.quantity,
            "unit_price": product.price,
            "total_price": item_total,
        })

    discount = Decimal("0")
    coupon_code = None
    if data.coupon_code:
        coupon = db.query(Coupon).filter(
            Coupon.code == data.coupon_code.upper(),
            Coupon.is_active == True,
        ).first()
        if coupon:
            if coupon.expires_at and coupon.expires_at < __import__("datetime").datetime.now(__import__("datetime").timezone.utc):
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Coupon expired")
            if coupon.max_uses and coupon.used_count >= coupon.max_uses:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Coupon usage limit reached")
            if subtotal < coupon.min_order_amount:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Minimum order amount is {coupon.min_order_amount}",
                )
            discount = calculate_coupon_discount(coupon, subtotal)
            coupon_code = coupon.code
            coupon.used_count += 1

    order = Order(
        user_id=user_id,
        order_number=generate_order_number(),
        total_amount=subtotal - discount,
        discount_amount=discount,
        shipping_address=data.shipping_address.model_dump(),
        payment_status=PaymentStatus.pending,
        order_status=OrderStatus.pending,
        coupon_code=coupon_code,
        payment_method=data.payment_method,
        notes=data.notes,
    )
    db.add(order)
    db.flush()

    for item_data in order_items_data:
        db.add(OrderItem(
            order_id=order.id,
            product_id=item_data["product"].id,
            product_name=item_data["product"].name,
            quantity=item_data["quantity"],
            unit_price=item_data["unit_price"],
            total_price=item_data["total_price"],
        ))

    db.add(OrderStatusHistory(order_id=order.id, status=OrderStatus.pending.value, note="Order placed"))

    for item in cart_items:
        db.delete(item)

    db.commit()
    db.refresh(order)
    return order


def fulfill_order_payment(db: Session, order_id: uuid.UUID) -> Order:
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    order.payment_status = PaymentStatus.paid
    order.order_status = OrderStatus.confirmed
    db.add(OrderStatusHistory(order_id=order.id, status=OrderStatus.confirmed.value, note="Payment confirmed"))

    for item in order.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if product:
            product.stock = max(0, product.stock - item.quantity)

    db.commit()
    db.refresh(order)
    return order


def update_order_status(db: Session, order_id: uuid.UUID, new_status: str, note: str | None = None) -> Order:
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    try:
        status_enum = OrderStatus(new_status)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid order status")

    order.order_status = status_enum

    if status_enum == OrderStatus.shipped and not order.tracking_number:
        order.tracking_number = generate_tracking_number()
        order.estimated_delivery = date.today() + timedelta(days=5)

    db.add(OrderStatusHistory(order_id=order.id, status=new_status, note=note))
    db.commit()
    db.refresh(order)
    return order
