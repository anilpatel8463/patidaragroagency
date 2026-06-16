from pydantic import BaseModel, Field
import uuid
from datetime import datetime
from typing import Optional


class CategoryBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    image_url: Optional[str] = None
    slug: Optional[str] = None
    is_active: bool = True


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    slug: Optional[str] = None
    is_active: Optional[bool] = None


class CategoryResponse(BaseModel):
    id: uuid.UUID
    name: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    slug: Optional[str] = None
    is_active: bool
    product_count: Optional[int] = 0
    created_at: datetime

    model_config = {"from_attributes": True}
