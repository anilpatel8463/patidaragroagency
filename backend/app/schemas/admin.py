from pydantic import BaseModel, ConfigDict
from decimal import Decimal
from typing import Optional
from datetime import datetime
import uuid


class DashboardStats(BaseModel):
    total_sales: Decimal
    total_revenue: Decimal
    total_orders: int
    total_customers: int
    pending_orders: int
    recent_orders: list
    top_products: list
    monthly_revenue: list


class NewsletterSubscriberResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    email: str
    is_active: bool
    subscribed_at: datetime
