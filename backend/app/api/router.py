from fastapi import APIRouter
from app.api.routes import auth, products, categories, cart, orders, payments, reviews, users, coupons, newsletter, admin

api_router = APIRouter(prefix="/api")

api_router.include_router(auth.router)
api_router.include_router(products.router)
api_router.include_router(categories.router)
api_router.include_router(cart.router)
api_router.include_router(orders.router)
api_router.include_router(payments.router)
api_router.include_router(reviews.router)
api_router.include_router(users.router)
api_router.include_router(coupons.router)
api_router.include_router(newsletter.router)
api_router.include_router(admin.router)
