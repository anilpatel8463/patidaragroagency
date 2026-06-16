from pydantic import BaseModel, Field
import uuid
from datetime import datetime
from typing import Optional


class ReviewCreate(BaseModel):
    product_id: uuid.UUID
    rating: int = Field(..., ge=1, le=5)
    title: Optional[str] = Field(None, max_length=200)
    comment: Optional[str] = None


class ReviewUpdate(BaseModel):
    rating: Optional[int] = Field(None, ge=1, le=5)
    title: Optional[str] = None
    comment: Optional[str] = None


class ReviewResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    product_id: uuid.UUID
    rating: int
    title: Optional[str] = None
    comment: Optional[str] = None
    is_approved: bool
    user_name: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}
