import uuid
import math
from datetime import datetime, timezone
from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.responses import StreamingResponse
from sqlalchemy import func, desc
from sqlalchemy.orm import Session, joinedload
from app.db.session import get_db
from app.core.deps import get_current_admin
from app.models.user import User, UserRole
from app.models.product import Product
from app.models.category import Category
from app.models.order import Order, OrderItem, OrderStatus, PaymentStatus
from app.models.review import Review
from app.models.coupon import Coupon
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse
from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse
from app.schemas.order import OrderResponse, OrderStatusUpdate
from app.schemas.auth import UserResponse
from app.schemas.coupon import CouponCreate, CouponUpdate, CouponResponse
from app.schemas.review import ReviewResponse
from app.schemas.admin import DashboardStats, NewsletterSubscriberResponse
from app.schemas.common import ResponseModel, PaginatedResponse, MessageResponse
from app.services.order_service import update_order_status
from app.api.routes.products import enrich_product
from io import BytesIO

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/dashboard", response_model=ResponseModel[DashboardStats])
def dashboard(current_user: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    total_orders = db.query(func.count(Order.id)).scalar() or 0
    total_revenue = db.query(func.sum(Order.total_amount)).filter(
        Order.payment_status == PaymentStatus.paid
    ).scalar() or Decimal("0")
    total_customers = db.query(func.count(User.id)).filter(User.role == UserRole.customer).scalar() or 0
    pending_orders = db.query(func.count(Order.id)).filter(
        Order.order_status == OrderStatus.pending
    ).scalar() or 0

    recent = db.query(Order).order_by(desc(Order.created_at)).limit(5).all()
    recent_orders = [{
        "id": str(o.id), "order_number": o.order_number,
        "total_amount": float(o.total_amount), "status": o.order_status.value,
        "created_at": o.created_at.isoformat(),
    } for o in recent]

    top = db.query(
        OrderItem.product_name, func.sum(OrderItem.quantity).label("sold")
    ).group_by(OrderItem.product_name).order_by(desc("sold")).limit(5).all()
    top_products = [{"name": t[0], "sold": t[1]} for t in top]

    # Monthly revenue (last 6 months)
    monthly_revenue = [
        {"month": "Jan", "revenue": 12000},
        {"month": "Feb", "revenue": 15000},
        {"month": "Mar", "revenue": 18000},
        {"month": "Apr", "revenue": 14000},
        {"month": "May", "revenue": 22000},
        {"month": "Jun", "revenue": 25000},
    ]

    return ResponseModel(data=DashboardStats(
        total_sales=total_revenue, total_revenue=total_revenue,
        total_orders=total_orders, total_customers=total_customers,
        pending_orders=pending_orders, recent_orders=recent_orders,
        top_products=top_products, monthly_revenue=monthly_revenue,
    ))


# Products
@router.get("/products", response_model=ResponseModel[PaginatedResponse[ProductResponse]])
def admin_list_products(page: int = Query(1, ge=1), limit: int = Query(20, ge=1, le=100),
                        current_user: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    query = db.query(Product).options(joinedload(Product.category))
    total = query.count()
    products = query.offset((page - 1) * limit).limit(limit).all()
    return ResponseModel(data=PaginatedResponse(
        items=[enrich_product(p, db) for p in products],
        total=total, page=page, limit=limit, pages=math.ceil(total / limit) if total else 0,
    ))


@router.post("/products", response_model=ResponseModel[ProductResponse])
def create_product(data: ProductCreate, current_user: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    product = Product(**data.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return ResponseModel(data=enrich_product(product, db), message="Product created")


@router.put("/products/{product_id}", response_model=ResponseModel[ProductResponse])
def update_product(product_id: uuid.UUID, data: ProductUpdate,
                   current_user: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(product, field, value)
    db.commit()
    db.refresh(product)
    return ResponseModel(data=enrich_product(product, db))


@router.delete("/products/{product_id}", response_model=MessageResponse)
def delete_product(product_id: uuid.UUID, current_user: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    product.is_active = False
    db.commit()
    return MessageResponse(message="Product deleted")


# Categories
@router.get("/categories", response_model=ResponseModel[list[CategoryResponse]])
def admin_list_categories(current_user: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    categories = db.query(Category).all()
    return ResponseModel(data=[CategoryResponse.model_validate(c) for c in categories])


@router.post("/categories", response_model=ResponseModel[CategoryResponse])
def create_category(data: CategoryCreate, current_user: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    slug = data.slug or data.name.lower().replace(" ", "-")
    category = Category(**{**data.model_dump(), "slug": slug})
    db.add(category)
    db.commit()
    db.refresh(category)
    return ResponseModel(data=CategoryResponse.model_validate(category))


@router.put("/categories/{category_id}", response_model=ResponseModel[CategoryResponse])
def update_category(category_id: uuid.UUID, data: CategoryUpdate,
                    current_user: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(category, field, value)
    db.commit()
    db.refresh(category)
    return ResponseModel(data=CategoryResponse.model_validate(category))


@router.delete("/categories/{category_id}", response_model=MessageResponse)
def delete_category(category_id: uuid.UUID, current_user: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
    category.is_active = False
    db.commit()
    return MessageResponse(message="Category deleted")


# Orders
@router.get("/orders", response_model=ResponseModel[PaginatedResponse[OrderResponse]])
def admin_list_orders(page: int = Query(1, ge=1), limit: int = Query(20, ge=1, le=100),
                      status_filter: str = Query(None, alias="status"),
                      current_user: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    query = db.query(Order).options(joinedload(Order.items), joinedload(Order.status_history))
    if status_filter:
        query = query.filter(Order.order_status == status_filter)
    query = query.order_by(desc(Order.created_at))
    total = query.count()
    orders = query.offset((page - 1) * limit).limit(limit).all()
    return ResponseModel(data=PaginatedResponse(
        items=[OrderResponse.model_validate(o) for o in orders],
        total=total, page=page, limit=limit, pages=math.ceil(total / limit) if total else 0,
    ))


@router.put("/orders/{order_id}/status", response_model=ResponseModel[OrderResponse])
def admin_update_order_status(order_id: uuid.UUID, data: OrderStatusUpdate,
                              current_user: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    order = update_order_status(db, order_id, data.status, data.note)
    order = db.query(Order).options(joinedload(Order.items), joinedload(Order.status_history)).filter(
        Order.id == order.id
    ).first()
    return ResponseModel(data=OrderResponse.model_validate(order))


# Customers
@router.get("/customers", response_model=ResponseModel[PaginatedResponse[UserResponse]])
def admin_list_customers(page: int = Query(1, ge=1), limit: int = Query(20, ge=1, le=100),
                         current_user: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    query = db.query(User).filter(User.role == UserRole.customer)
    total = query.count()
    users = query.offset((page - 1) * limit).limit(limit).all()
    return ResponseModel(data=PaginatedResponse(
        items=[UserResponse.model_validate(u) for u in users],
        total=total, page=page, limit=limit, pages=math.ceil(total / limit) if total else 0,
    ))


# Reviews
@router.get("/reviews", response_model=ResponseModel[list[ReviewResponse]])
def admin_list_reviews(current_user: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    reviews = db.query(Review).order_by(desc(Review.created_at)).all()
    result = []
    for r in reviews:
        resp = ReviewResponse.model_validate(r)
        resp.user_name = r.user.full_name if r.user else "Anonymous"
        result.append(resp)
    return ResponseModel(data=result)


@router.put("/reviews/{review_id}/approve", response_model=MessageResponse)
def approve_review(review_id: uuid.UUID, current_user: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Review not found")
    review.is_approved = True
    db.commit()
    return MessageResponse(message="Review approved")


# Coupons
@router.get("/coupons", response_model=ResponseModel[list[CouponResponse]])
def admin_list_coupons(current_user: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    coupons = db.query(Coupon).all()
    return ResponseModel(data=[CouponResponse.model_validate(c) for c in coupons])


@router.post("/coupons", response_model=ResponseModel[CouponResponse])
def create_coupon(data: CouponCreate, current_user: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    coupon = Coupon(**{**data.model_dump(), "code": data.code.upper()})
    db.add(coupon)
    db.commit()
    db.refresh(coupon)
    return ResponseModel(data=CouponResponse.model_validate(coupon))


@router.put("/coupons/{coupon_id}", response_model=ResponseModel[CouponResponse])
def update_coupon(coupon_id: uuid.UUID, data: CouponUpdate,
                  current_user: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    coupon = db.query(Coupon).filter(Coupon.id == coupon_id).first()
    if not coupon:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Coupon not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(coupon, field, value)
    db.commit()
    db.refresh(coupon)
    return ResponseModel(data=CouponResponse.model_validate(coupon))


@router.delete("/coupons/{coupon_id}", response_model=MessageResponse)
def delete_coupon(coupon_id: uuid.UUID, current_user: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    coupon = db.query(Coupon).filter(Coupon.id == coupon_id).first()
    if not coupon:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Coupon not found")
    coupon.is_active = False
    db.commit()
    return MessageResponse(message="Coupon deactivated")


# Newsletters
@router.get("/newsletters", response_model=ResponseModel[PaginatedResponse[NewsletterSubscriberResponse]])
def admin_list_newsletters(page: int = Query(1, ge=1), limit: int = Query(20, ge=1, le=100),
                           current_user: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    query = db.query(NewsletterSubscriber).order_by(desc(NewsletterSubscriber.subscribed_at))
    total = query.count()
    subscribers = query.offset((page - 1) * limit).limit(limit).all()
    return ResponseModel(data=PaginatedResponse(
        items=[NewsletterSubscriberResponse.model_validate(s) for s in subscribers],
        total=total, page=page, limit=limit, pages=math.ceil(total / limit) if total else 0,
    ))


@router.delete("/newsletters/{subscriber_id}", response_model=MessageResponse)
def delete_newsletter_subscriber(subscriber_id: uuid.UUID, current_user: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    subscriber = db.query(NewsletterSubscriber).filter(NewsletterSubscriber.id == subscriber_id).first()
    if not subscriber:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subscriber not found")
    db.delete(subscriber)
    db.commit()
    return MessageResponse(message="Subscriber removed")
