from pydantic import BaseModel, Field
import uuid
from datetime import datetime
from decimal import Decimal
from app.schemas.product import ProductResponse


class CartItemCreate(BaseModel):
    product_id: uuid.UUID
    quantity: int = Field(default=1, ge=1)


class CartItemUpdate(BaseModel):
    quantity: int = Field(..., ge=1)


class CartItemResponse(BaseModel):
    id: uuid.UUID
    product_id: uuid.UUID
    quantity: int
    product: ProductResponse
    created_at: datetime

    model_config = {"from_attributes": True}


class CartSummary(BaseModel):
    items: list[CartItemResponse]
    subtotal: Decimal
    item_count: int
