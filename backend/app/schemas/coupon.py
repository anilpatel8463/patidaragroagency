from pydantic import BaseModel, Field
import uuid
from datetime import datetime
from decimal import Decimal
from typing import Optional


class CouponValidate(BaseModel):
    code: str
    order_amount: Decimal


class CouponResponse(BaseModel):
    id: uuid.UUID
    code: str
    discount_type: str
    discount_value: Decimal
    min_order_amount: Decimal
    is_active: bool
    expires_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class CouponCreate(BaseModel):
    code: str = Field(..., min_length=3, max_length=50)
    discount_type: str
    discount_value: Decimal = Field(..., gt=0)
    min_order_amount: Decimal = Field(default=0, ge=0)
    max_uses: Optional[int] = None
    expires_at: Optional[datetime] = None


class CouponUpdate(BaseModel):
    discount_value: Optional[Decimal] = None
    min_order_amount: Optional[Decimal] = None
    max_uses: Optional[int] = None
    is_active: Optional[bool] = None
    expires_at: Optional[datetime] = None


class CouponValidateResponse(BaseModel):
    valid: bool
    discount_amount: Decimal = Decimal("0")
    message: str
