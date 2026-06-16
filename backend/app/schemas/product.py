from pydantic import BaseModel, Field
import uuid
from datetime import datetime
from decimal import Decimal
from typing import Optional


class ProductBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    price: Decimal = Field(..., gt=0)
    compare_price: Optional[Decimal] = None
    stock: int = Field(default=0, ge=0)
    image_url: Optional[str] = None
    images: Optional[list[str]] = []
    sku: Optional[str] = None
    category_id: Optional[uuid.UUID] = None
    is_featured: bool = False
    is_active: bool = True
    weight: Optional[str] = None
    unit: Optional[str] = None


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[Decimal] = None
    compare_price: Optional[Decimal] = None
    stock: Optional[int] = None
    image_url: Optional[str] = None
    images: Optional[list[str]] = None
    sku: Optional[str] = None
    category_id: Optional[uuid.UUID] = None
    is_featured: Optional[bool] = None
    is_active: Optional[bool] = None
    weight: Optional[str] = None
    unit: Optional[str] = None


class CategoryBrief(BaseModel):
    id: uuid.UUID
    name: str
    slug: Optional[str] = None

    model_config = {"from_attributes": True}


class ProductResponse(BaseModel):
    id: uuid.UUID
    name: str
    description: Optional[str] = None
    price: Decimal
    compare_price: Optional[Decimal] = None
    stock: int
    image_url: Optional[str] = None
    images: Optional[list[str]] = []
    sku: Optional[str] = None
    category_id: Optional[uuid.UUID] = None
    category: Optional[CategoryBrief] = None
    is_featured: bool
    is_active: bool
    weight: Optional[str] = None
    unit: Optional[str] = None
    avg_rating: Optional[float] = None
    review_count: Optional[int] = 0
    created_at: datetime

    model_config = {"from_attributes": True}
