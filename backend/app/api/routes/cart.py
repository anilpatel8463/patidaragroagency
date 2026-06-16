import uuid
from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from app.db.session import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.cart import CartItem
from app.models.product import Product
from app.schemas.cart import CartItemCreate, CartItemUpdate, CartItemResponse, CartSummary
from app.schemas.common import ResponseModel, MessageResponse
from app.api.routes.products import enrich_product

router = APIRouter(prefix="/cart", tags=["Cart"])


@router.get("", response_model=ResponseModel[CartSummary])
def get_cart(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    items = db.query(CartItem).options(joinedload(CartItem.product).joinedload(Product.category)).filter(
        CartItem.user_id == current_user.id
    ).all()
    result_items = []
    subtotal = Decimal("0")
    for item in items:
        resp = CartItemResponse(
            id=item.id,
            product_id=item.product_id,
            quantity=item.quantity,
            product=enrich_product(item.product, db),
            created_at=item.created_at,
        )
        result_items.append(resp)
        subtotal += item.product.price * item.quantity
    return ResponseModel(data=CartSummary(items=result_items, subtotal=subtotal, item_count=len(result_items)))


@router.post("", response_model=ResponseModel[CartItemResponse])
def add_to_cart(data: CartItemCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == data.product_id, Product.is_active == True).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    if product.stock < data.quantity:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Insufficient stock")

    existing = db.query(CartItem).filter(
        CartItem.user_id == current_user.id, CartItem.product_id == data.product_id
    ).first()
    if existing:
        existing.quantity += data.quantity
        db.commit()
        db.refresh(existing)
        item = existing
    else:
        item = CartItem(user_id=current_user.id, product_id=data.product_id, quantity=data.quantity)
        db.add(item)
        db.commit()
        db.refresh(item)

    item = db.query(CartItem).options(joinedload(CartItem.product).joinedload(Product.category)).filter(
        CartItem.id == item.id
    ).first()
    return ResponseModel(data=CartItemResponse(
        id=item.id, product_id=item.product_id, quantity=item.quantity,
        product=enrich_product(item.product, db), created_at=item.created_at,
    ))


@router.put("/{item_id}", response_model=ResponseModel[CartItemResponse])
def update_cart_item(
    item_id: uuid.UUID, data: CartItemUpdate,
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db),
):
    item = db.query(CartItem).options(joinedload(CartItem.product)).filter(
        CartItem.id == item_id, CartItem.user_id == current_user.id
    ).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart item not found")
    if item.product.stock < data.quantity:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Insufficient stock")
    item.quantity = data.quantity
    db.commit()
    db.refresh(item)
    return ResponseModel(data=CartItemResponse(
        id=item.id, product_id=item.product_id, quantity=item.quantity,
        product=enrich_product(item.product, db), created_at=item.created_at,
    ))


@router.delete("/{item_id}", response_model=MessageResponse)
def remove_cart_item(item_id: uuid.UUID, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    item = db.query(CartItem).filter(CartItem.id == item_id, CartItem.user_id == current_user.id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart item not found")
    db.delete(item)
    db.commit()
    return MessageResponse(message="Item removed from cart")


@router.delete("", response_model=MessageResponse)
def clear_cart(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db.query(CartItem).filter(CartItem.user_id == current_user.id).delete()
    db.commit()
    return MessageResponse(message="Cart cleared")
