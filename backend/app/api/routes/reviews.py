import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.review import Review
from app.models.product import Product
from app.schemas.review import ReviewCreate, ReviewUpdate, ReviewResponse
from app.schemas.common import ResponseModel, MessageResponse

router = APIRouter(prefix="/reviews", tags=["Reviews"])


@router.post("", response_model=ResponseModel[ReviewResponse])
def create_review(data: ReviewCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == data.product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    existing = db.query(Review).filter(
        Review.user_id == current_user.id, Review.product_id == data.product_id
    ).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You already reviewed this product")
    review = Review(
        user_id=current_user.id,
        product_id=data.product_id,
        rating=data.rating,
        title=data.title,
        comment=data.comment,
        is_approved=True,
    )
    db.add(review)
    db.commit()
    db.refresh(review)
    resp = ReviewResponse.model_validate(review)
    resp.user_name = current_user.full_name
    return ResponseModel(data=resp, message="Review submitted")


@router.put("/{review_id}", response_model=ResponseModel[ReviewResponse])
def update_review(
    review_id: uuid.UUID, data: ReviewUpdate,
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db),
):
    review = db.query(Review).filter(Review.id == review_id, Review.user_id == current_user.id).first()
    if not review:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Review not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(review, field, value)
    db.commit()
    db.refresh(review)
    resp = ReviewResponse.model_validate(review)
    resp.user_name = current_user.full_name
    return ResponseModel(data=resp)


@router.delete("/{review_id}", response_model=MessageResponse)
def delete_review(review_id: uuid.UUID, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    review = db.query(Review).filter(Review.id == review_id, Review.user_id == current_user.id).first()
    if not review:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Review not found")
    db.delete(review)
    db.commit()
    return MessageResponse(message="Review deleted")
