"""Seed database with sample data for development."""
from decimal import Decimal
from app.db.session import SessionLocal, engine, Base
from app.models import *
from app.models.user import UserRole
from app.models.coupon import DiscountType
from app.core.security import get_password_hash

SAMPLE_CATEGORIES = [
    {"name": "Seeds", "description": "High-quality seeds for all crops", "slug": "seeds", "image_url": "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400"},
    {"name": "Fertilizers", "description": "Organic and chemical fertilizers", "slug": "fertilizers", "image_url": "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400"},
    {"name": "Pesticides", "description": "Crop protection solutions", "slug": "pesticides", "image_url": "https://images.unsplash.com/photo-1574943321395-75717e46db30?w=400"},
    {"name": "Tools & Equipment", "description": "Farming tools and machinery", "slug": "tools-equipment", "image_url": "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400"},
    {"name": "Irrigation", "description": "Drip and sprinkler systems", "slug": "irrigation", "image_url": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400"},
    {"name": "Organic Products", "description": "Certified organic farming products", "slug": "organic", "image_url": "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400"},
]

SAMPLE_PRODUCTS = [
    {"name": "Hybrid Tomato Seeds", "description": "High-yield hybrid tomato seeds, disease resistant. Pack of 50g.", "price": "149.00", "stock": 500, "category": "seeds", "is_featured": True, "image_url": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500", "unit": "pack", "weight": "50g"},
    {"name": "Wheat Seeds Premium", "description": "Premium quality wheat seeds for maximum yield. 5kg pack.", "price": "899.00", "stock": 200, "category": "seeds", "is_featured": True, "image_url": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500", "unit": "pack", "weight": "5kg"},
    {"name": "Organic NPK Fertilizer", "description": "Balanced NPK 19:19:19 organic fertilizer for all crops.", "price": "599.00", "stock": 300, "category": "fertilizers", "is_featured": True, "image_url": "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=500", "unit": "bag", "weight": "25kg"},
    {"name": "Vermicompost", "description": "100% organic vermicompost for soil enrichment.", "price": "299.00", "stock": 400, "category": "fertilizers", "is_featured": False, "image_url": "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=500", "unit": "bag", "weight": "10kg"},
    {"name": "Neem Oil Pesticide", "description": "Natural neem oil based pesticide, safe for organic farming.", "price": "349.00", "stock": 250, "category": "pesticides", "is_featured": True, "image_url": "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=500", "unit": "bottle", "weight": "1L"},
    {"name": "Garden Sprayer", "description": "16L battery operated garden sprayer with adjustable nozzle.", "price": "2499.00", "stock": 50, "category": "tools-equipment", "is_featured": True, "image_url": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500", "unit": "piece", "weight": "3kg"},
    {"name": "Drip Irrigation Kit", "description": "Complete drip irrigation kit for 1 acre farmland.", "price": "4999.00", "stock": 30, "category": "irrigation", "is_featured": True, "image_url": "https://images.unsplash.com/photo-1508808789028-45521ae84ceb?w=500", "unit": "kit", "weight": "15kg"},
    {"name": "Organic Cow Manure", "description": "Well-decomposed organic cow manure, enriched with nutrients.", "price": "199.00", "stock": 600, "category": "organic", "is_featured": False, "image_url": "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=500", "unit": "bag", "weight": "20kg"},
    {"name": "Chilli Seeds Hybrid", "description": "High-yield hybrid chilli seeds, spicy variety.", "price": "129.00", "stock": 350, "category": "seeds", "is_featured": False, "image_url": "https://images.unsplash.com/photo-1588252391490-30250df7a3c0?w=500", "unit": "pack", "weight": "25g"},
    {"name": "Hand Trowel Set", "description": "Stainless steel hand trowel set with ergonomic grip.", "price": "449.00", "stock": 100, "category": "tools-equipment", "is_featured": False, "image_url": "https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?w=500", "unit": "set", "weight": "500g"},
    {"name": "Urea Fertilizer", "description": "46% nitrogen urea fertilizer for rapid plant growth.", "price": "349.00", "stock": 500, "category": "fertilizers", "is_featured": False, "image_url": "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=500", "unit": "bag", "weight": "50kg"},
    {"name": "Bio Pesticide Spray", "description": "Eco-friendly bio pesticide for pest control.", "price": "499.00", "stock": 180, "category": "pesticides", "is_featured": False, "image_url": "https://images.unsplash.com/photo-1587334206574-35113d8d955f?w=500", "unit": "bottle", "weight": "500ml"},
]


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        admin = db.query(User).filter(User.email == "admin@agrosolution.com").first()
        if not admin:
            admin = User(
                full_name="Admin User",
                email="admin@agrosolution.com",
                password_hash=get_password_hash("admin123"),
                role=UserRole.admin,
            )
            db.add(admin)

        customer = db.query(User).filter(User.email == "customer@agrosolution.com").first()
        if not customer:
            customer = User(
                full_name="Demo Customer",
                email="customer@agrosolution.com",
                password_hash=get_password_hash("customer123"),
                phone="9876543210",
                address="123 Farm Road",
                city="Indore",
                state="Madhya Pradesh",
                pincode="452001",
            )
            db.add(customer)
        db.flush()

        cat_map = {}
        for cat_data in SAMPLE_CATEGORIES:
            cat = db.query(Category).filter(Category.slug == cat_data["slug"]).first()
            if not cat:
                cat = Category(**cat_data)
                db.add(cat)
                db.flush()
            cat_map[cat_data["slug"]] = cat.id

        for item in SAMPLE_PRODUCTS:
            prod_data = item.copy()
            cat_slug = prod_data.pop("category")
            price = Decimal(prod_data.pop("price"))
            product = db.query(Product).filter(Product.name == prod_data["name"]).first()
            if not product:
                product = Product(
                    **prod_data,
                    price=price,
                    category_id=cat_map[cat_slug],
                    sku=f"SKU-{prod_data['name'][:3].upper()}-{abs(hash(prod_data['name'])) % 10000:04d}",
                )
                db.add(product)
            else:
                product.image_url = prod_data["image_url"]
                product.description = prod_data["description"]
                product.price = price
                product.stock = prod_data["stock"]
                product.unit = prod_data["unit"]
                product.weight = prod_data["weight"]
                product.is_featured = prod_data["is_featured"]

        if not db.query(Coupon).filter(Coupon.code == "WELCOME10").first():
            db.add(Coupon(
                code="WELCOME10",
                discount_type=DiscountType.percentage,
                discount_value=Decimal("10"),
                min_order_amount=Decimal("500"),
                max_uses=100,
            ))
        if not db.query(Coupon).filter(Coupon.code == "FLAT100").first():
            db.add(Coupon(
                code="FLAT100",
                discount_type=DiscountType.fixed,
                discount_value=Decimal("100"),
                min_order_amount=Decimal("1000"),
                max_uses=50,
            ))

        db.commit()
        print("Database seeded successfully!")
        print("Admin: admin@agrosolution.com / admin123")
        print("Customer: customer@agrosolution.com / customer123")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
