import uuid
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy import func, or_, desc, asc
from sqlalchemy.orm import Session, joinedload
from app.db.session import get_db
from app.core.deps import get_optional_user
from app.models.product import Product
from app.models.review import Review
from app.models.category import Category
from app.models.wishlist import RecentlyViewed
from app.models.user import User
from app.schemas.product import ProductResponse
from app.schemas.common import ResponseModel, PaginatedResponse
from app.schemas.review import ReviewResponse
import math

router = APIRouter(prefix="/products", tags=["Products"])


def enrich_product(product: Product, db: Session) -> ProductResponse:
    avg_rating = db.query(func.avg(Review.rating)).filter(
        Review.product_id == product.id, Review.is_approved == True
    ).scalar()
    review_count = db.query(func.count(Review.id)).filter(
        Review.product_id == product.id, Review.is_approved == True
    ).scalar()
    resp = ProductResponse.model_validate(product)
    resp.avg_rating = round(float(avg_rating), 1) if avg_rating else None
    resp.review_count = review_count or 0
    return resp


@router.get("", response_model=ResponseModel[PaginatedResponse[ProductResponse]])
def list_products(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    category: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    sort: Optional[str] = "newest",
    in_stock: Optional[bool] = None,
    db: Session = Depends(get_db),
):
    query = db.query(Product).options(joinedload(Product.category)).filter(Product.is_active == True)

    if search:
        query = query.filter(or_(Product.name.ilike(f"%{search}%"), Product.description.ilike(f"%{search}%")))
    if category:
        query = query.join(Category).filter(Category.slug == category)
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    if max_price is not None:
        query = query.filter(Product.price <= max_price)
    if in_stock:
        query = query.filter(Product.stock > 0)

    sort_map = {
        "newest": desc(Product.created_at),
        "price_asc": asc(Product.price),
        "price_desc": desc(Product.price),
        "name": asc(Product.name),
    }
    query = query.order_by(sort_map.get(sort, desc(Product.created_at)))

    total = query.count()
    products = query.offset((page - 1) * limit).limit(limit).all()
    items = [enrich_product(p, db) for p in products]

    return ResponseModel(data=PaginatedResponse(
        items=items, total=total, page=page, limit=limit, pages=math.ceil(total / limit) if total else 0
    ))


@router.get("/featured", response_model=ResponseModel[list[ProductResponse]])
def featured_products(db: Session = Depends(get_db)):
    products = db.query(Product).options(joinedload(Product.category)).filter(
        Product.is_active == True, Product.is_featured == True
    ).limit(8).all()
    return ResponseModel(data=[enrich_product(p, db) for p in products])


@router.get("/best-sellers", response_model=ResponseModel[list[ProductResponse]])
def best_sellers(db: Session = Depends(get_db)):
    from app.models.order import OrderItem
    top = db.query(
        OrderItem.product_id, func.sum(OrderItem.quantity).label("total_sold")
    ).group_by(OrderItem.product_id).order_by(desc("total_sold")).limit(8).all()
    product_ids = [t[0] for t in top]
    if not product_ids:
        products = db.query(Product).filter(Product.is_active == True).limit(8).all()
    else:
        products = db.query(Product).options(joinedload(Product.category)).filter(
            Product.id.in_(product_ids), Product.is_active == True
        ).all()
    return ResponseModel(data=[enrich_product(p, db) for p in products])


@router.get("/{product_id}", response_model=ResponseModel[ProductResponse])
def get_product(
    product_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user),
):
    product = db.query(Product).options(joinedload(Product.category)).filter(
        Product.id == product_id, Product.is_active == True
    ).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    if current_user:
        existing = db.query(RecentlyViewed).filter(
            RecentlyViewed.user_id == current_user.id, RecentlyViewed.product_id == product_id
        ).first()
        if existing:
            db.delete(existing)
        db.add(RecentlyViewed(user_id=current_user.id, product_id=product_id))
        db.commit()

    return ResponseModel(data=enrich_product(product, db))


@router.get("/{product_id}/related", response_model=ResponseModel[list[ProductResponse]])
def related_products(product_id: uuid.UUID, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    related = db.query(Product).options(joinedload(Product.category)).filter(
        Product.category_id == product.category_id,
        Product.id != product_id,
        Product.is_active == True,
    ).limit(4).all()
    return ResponseModel(data=[enrich_product(p, db) for p in related])


@router.get("/{product_id}/reviews", response_model=ResponseModel[list[ReviewResponse]])
def product_reviews(product_id: uuid.UUID, db: Session = Depends(get_db)):
    reviews = db.query(Review).filter(
        Review.product_id == product_id, Review.is_approved == True
    ).order_by(desc(Review.created_at)).all()
    result = []
    for r in reviews:
        resp = ReviewResponse.model_validate(r)
        resp.user_name = r.user.full_name if r.user else "Anonymous"
        result.append(resp)
    return ResponseModel(data=result)
