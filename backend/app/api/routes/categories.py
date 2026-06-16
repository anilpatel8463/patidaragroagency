import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.category import Category
from app.models.product import Product
from app.schemas.category import CategoryResponse
from app.schemas.common import ResponseModel

router = APIRouter(prefix="/categories", tags=["Categories"])


@router.get("", response_model=ResponseModel[list[CategoryResponse]])
def list_categories(db: Session = Depends(get_db)):
    categories = db.query(Category).filter(Category.is_active == True).all()
    result = []
    for cat in categories:
        resp = CategoryResponse.model_validate(cat)
        resp.product_count = db.query(func.count(Product.id)).filter(
            Product.category_id == cat.id, Product.is_active == True
        ).scalar()
        result.append(resp)
    return ResponseModel(data=result)


@router.get("/{category_id}", response_model=ResponseModel[CategoryResponse])
def get_category(category_id: uuid.UUID, db: Session = Depends(get_db)):
    category = db.query(Category).filter(Category.id == category_id, Category.is_active == True).first()
    if not category:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
    resp = CategoryResponse.model_validate(category)
    resp.product_count = db.query(func.count(Product.id)).filter(
        Product.category_id == category.id, Product.is_active == True
    ).scalar()
    return ResponseModel(data=resp)
