import stripe
import uuid
from decimal import Decimal
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.core.config import get_settings
from app.models.order import Order, PaymentStatus
from app.models.payment import Payment, PaymentRecordStatus
from app.services.order_service import fulfill_order_payment

settings = get_settings()
stripe.api_key = settings.STRIPE_SECRET_KEY


def create_checkout_session(db: Session, order_id: uuid.UUID, user_id: uuid.UUID) -> dict:
    order = db.query(Order).filter(Order.id == order_id, Order.user_id == user_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    if order.payment_status == PaymentStatus.paid:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Order already paid")

    line_items = []
    for item in order.items:
        line_items.append({
            "price_data": {
                "currency": "inr",
                "product_data": {"name": item.product_name},
                "unit_amount": int(item.unit_price * 100),
            },
            "quantity": item.quantity,
        })

    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=line_items,
            mode="payment",
            success_url=f"{settings.FRONTEND_URL}/checkout/success?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{settings.FRONTEND_URL}/checkout/cancel?order_id={order.id}",
            metadata={"order_id": str(order.id), "user_id": str(user_id)},
        )
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    payment = Payment(
        order_id=order.id,
        stripe_session_id=session.id,
        amount=order.total_amount,
        currency="inr",
        status=PaymentRecordStatus.pending,
    )
    db.add(payment)
    db.commit()

    return {"session_id": session.id, "url": session.url}


def handle_webhook_event(db: Session, payload: bytes, sig_header: str) -> dict:
    try:
        event = stripe.Webhook.construct_event(payload, sig_header, settings.STRIPE_WEBHOOK_SECRET)
    except (ValueError, stripe.error.SignatureVerificationError):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid webhook signature")

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        order_id = session.get("metadata", {}).get("order_id")
        if order_id:
            payment = db.query(Payment).filter(Payment.stripe_session_id == session["id"]).first()
            if payment:
                payment.status = PaymentRecordStatus.paid
                payment.stripe_payment_intent = session.get("payment_intent")
                db.commit()
            fulfill_order_payment(db, uuid.UUID(order_id))

    elif event["type"] == "checkout.session.expired":
        session = event["data"]["object"]
        payment = db.query(Payment).filter(Payment.stripe_session_id == session["id"]).first()
        if payment:
            payment.status = PaymentRecordStatus.failed
            db.commit()

    return {"status": "success"}
