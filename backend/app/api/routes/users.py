import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from app.db.session import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.wishlist import WishlistItem, RecentlyViewed
from app.models.product import Product
from app.schemas.auth import UserResponse
from app.schemas.user import ProfileUpdate
from app.schemas.common import ResponseModel, MessageResponse
from app.api.routes.products import enrich_product

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/profile", response_model=ResponseModel[UserResponse])
def get_profile(current_user: User = Depends(get_current_user)):
    return ResponseModel(data=UserResponse.model_validate(current_user))


@router.put("/profile", response_model=ResponseModel[UserResponse])
def update_profile(data: ProfileUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(current_user, field, value)
    db.commit()
    db.refresh(current_user)
    return ResponseModel(data=UserResponse.model_validate(current_user))


@router.get("/wishlist", response_model=ResponseModel[list])
def get_wishlist(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    items = db.query(WishlistItem).options(joinedload(WishlistItem.product)).filter(
        WishlistItem.user_id == current_user.id
    ).all()
    return ResponseModel(data=[enrich_product(i.product, db) for i in items if i.product])


@router.post("/wishlist/{product_id}", response_model=MessageResponse)
def add_to_wishlist(product_id: uuid.UUID, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    existing = db.query(WishlistItem).filter(
        WishlistItem.user_id == current_user.id, WishlistItem.product_id == product_id
    ).first()
    if existing:
        return MessageResponse(message="Already in wishlist")
    db.add(WishlistItem(user_id=current_user.id, product_id=product_id))
    db.commit()
    return MessageResponse(message="Added to wishlist")


@router.delete("/wishlist/{product_id}", response_model=MessageResponse)
def remove_from_wishlist(product_id: uuid.UUID, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db.query(WishlistItem).filter(
        WishlistItem.user_id == current_user.id, WishlistItem.product_id == product_id
    ).delete()
    db.commit()
    return MessageResponse(message="Removed from wishlist")


@router.get("/recently-viewed", response_model=ResponseModel[list])
def recently_viewed(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    items = db.query(RecentlyViewed).options(joinedload(RecentlyViewed.product)).filter(
        RecentlyViewed.user_id == current_user.id
    ).order_by(RecentlyViewed.viewed_at.desc()).limit(10).all()
    return ResponseModel(data=[enrich_product(i.product, db) for i in items if i.product])
