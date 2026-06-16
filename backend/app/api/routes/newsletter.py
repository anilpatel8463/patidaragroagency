from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.newsletter import NewsletterSubscriber
from app.schemas.user import NewsletterSubscribe
from app.schemas.common import MessageResponse

router = APIRouter(prefix="/newsletter", tags=["Newsletter"])


@router.post("/subscribe", response_model=MessageResponse)
def subscribe(data: NewsletterSubscribe, db: Session = Depends(get_db)):
    existing = db.query(NewsletterSubscriber).filter(NewsletterSubscriber.email == data.email).first()
    if existing:
        if existing.is_active:
            return MessageResponse(message="Already subscribed")
        existing.is_active = True
        db.commit()
        return MessageResponse(message="Resubscribed successfully")
    db.add(NewsletterSubscriber(email=data.email))
    db.commit()
    return MessageResponse(message="Subscribed successfully")
