import uuid
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.payment import Payment, PaymentRecordStatus
from app.models.order import Order, PaymentStatus
from app.schemas.common import ResponseModel
from app.services.payment_service import create_checkout_session, handle_webhook_event

router = APIRouter(prefix="/payments", tags=["Payments"])


@router.post("/create-checkout-session")
def create_session(
    data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    order_id = data.get("order_id")
    if not order_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="order_id required")
    result = create_checkout_session(db, uuid.UUID(order_id), current_user.id)
    return ResponseModel(data=result)


@router.post("/webhook")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature", "")
    result = handle_webhook_event(db, payload, sig_header)
    return result


@router.get("/verify/{session_id}")
def verify_payment(session_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    payment = db.query(Payment).filter(Payment.stripe_session_id == session_id).first()
    if not payment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payment not found")
    order = db.query(Order).filter(Order.id == payment.order_id, Order.user_id == current_user.id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return ResponseModel(data={
        "payment_status": payment.status.value,
        "order_status": order.order_status.value,
        "order_id": str(order.id),
        "order_number": order.order_number,
    })
