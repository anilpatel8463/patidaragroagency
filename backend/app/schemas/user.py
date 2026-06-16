from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from app.schemas.product import ProductResponse


class ProfileUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=2, max_length=255)
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None


class NewsletterSubscribe(BaseModel):
    email: EmailStr
