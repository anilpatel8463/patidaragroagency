import uuid
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session, joinedload
from app.db.session import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.order import Order
from app.schemas.order import OrderCreate, OrderResponse, TrackingResponse, StatusHistoryResponse
from app.schemas.common import ResponseModel, PaginatedResponse
from app.services.order_service import create_order_from_cart
import math

router = APIRouter(prefix="/orders", tags=["Orders"])


def serialize_order(order: Order) -> OrderResponse:
    return OrderResponse.model_validate(order)


@router.post("", response_model=ResponseModel[OrderResponse])
def create_order(data: OrderCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    order = create_order_from_cart(db, current_user.id, data)
    order = db.query(Order).options(
        joinedload(Order.items), joinedload(Order.status_history)
    ).filter(Order.id == order.id).first()
    return ResponseModel(data=serialize_order(order), message="Order created successfully")


@router.get("", response_model=ResponseModel[PaginatedResponse[OrderResponse]])
def list_orders(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(Order).options(
        joinedload(Order.items), joinedload(Order.status_history)
    ).filter(Order.user_id == current_user.id).order_by(Order.created_at.desc())
    total = query.count()
    orders = query.offset((page - 1) * limit).limit(limit).all()
    return ResponseModel(data=PaginatedResponse(
        items=[serialize_order(o) for o in orders],
        total=total, page=page, limit=limit, pages=math.ceil(total / limit) if total else 0,
    ))


@router.get("/track/{tracking_number}", response_model=ResponseModel[TrackingResponse])
def track_order(tracking_number: str, db: Session = Depends(get_db)):
    order = db.query(Order).options(joinedload(Order.status_history)).filter(
        or_(
            Order.tracking_number == tracking_number,
            Order.order_number == tracking_number
        )
    ).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tracking number not found")
    return ResponseModel(data=TrackingResponse(
        tracking_number=order.tracking_number,
        order_number=order.order_number,
        order_status=order.order_status.value,
        estimated_delivery=order.estimated_delivery,
        timeline=[StatusHistoryResponse.model_validate(h) for h in order.status_history],
        shipping_address=order.shipping_address,
    ))


@router.get("/{order_id}", response_model=ResponseModel[OrderResponse])
def get_order(order_id: uuid.UUID, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    order = db.query(Order).options(
        joinedload(Order.items), joinedload(Order.status_history)
    ).filter(Order.id == order_id, Order.user_id == current_user.id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return ResponseModel(data=serialize_order(order))
