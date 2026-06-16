from datetime import datetime, timezone
from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.coupon import Coupon, DiscountType
from app.schemas.coupon import CouponValidate, CouponValidateResponse
from app.schemas.common import ResponseModel
from app.services.order_service import calculate_coupon_discount

router = APIRouter(prefix="/coupons", tags=["Coupons"])


@router.post("/validate", response_model=ResponseModel[CouponValidateResponse])
def validate_coupon(data: CouponValidate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    coupon = db.query(Coupon).filter(Coupon.code == data.code.upper(), Coupon.is_active == True).first()
    if not coupon:
        return ResponseModel(data=CouponValidateResponse(valid=False, message="Invalid coupon code"))
    if coupon.expires_at and coupon.expires_at < datetime.now(timezone.utc):
        return ResponseModel(data=CouponValidateResponse(valid=False, message="Coupon has expired"))
    if coupon.max_uses and coupon.used_count >= coupon.max_uses:
        return ResponseModel(data=CouponValidateResponse(valid=False, message="Coupon usage limit reached"))
    if data.order_amount < coupon.min_order_amount:
        return ResponseModel(data=CouponValidateResponse(
            valid=False, message=f"Minimum order amount is ₹{coupon.min_order_amount}"
        ))
    discount = calculate_coupon_discount(coupon, data.order_amount)
    return ResponseModel(data=CouponValidateResponse(
        valid=True, discount_amount=discount, message=f"Coupon applied! You save ₹{discount}"
    ))
