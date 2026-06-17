from pydantic import BaseModel, Field
import uuid
from datetime import datetime, date
from decimal import Decimal
from typing import Optional


class ShippingAddress(BaseModel):
    full_name: str
    phone: str
    address: str
    city: str
    state: str
    pincode: str


class OrderCreate(BaseModel):
    shipping_address: ShippingAddress
    coupon_code: Optional[str] = None
    notes: Optional[str] = None
    payment_method: str = "cod"


class OrderItemResponse(BaseModel):
    id: uuid.UUID
    product_id: uuid.UUID
    product_name: str
    quantity: int
    unit_price: Decimal
    total_price: Decimal

    model_config = {"from_attributes": True}


class StatusHistoryResponse(BaseModel):
    status: str
    note: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class OrderResponse(BaseModel):
    id: uuid.UUID
    order_number: str
    total_amount: Decimal
    discount_amount: Decimal
    shipping_address: dict
    payment_status: str
    order_status: str
    tracking_number: Optional[str] = None
    coupon_code: Optional[str] = None
    payment_method: str
    notes: Optional[str] = None
    estimated_delivery: Optional[date] = None
    items: list[OrderItemResponse] = []
    status_history: list[StatusHistoryResponse] = []
    created_at: datetime

    model_config = {"from_attributes": True}


class OrderStatusUpdate(BaseModel):
    status: str
    note: Optional[str] = None


class TrackingResponse(BaseModel):
    tracking_number: Optional[str] = None
    order_number: str
    order_status: str
    estimated_delivery: Optional[date] = None
    timeline: list[StatusHistoryResponse]
    shipping_address: dict
