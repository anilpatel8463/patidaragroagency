# Patidar Agro Solution - E-Commerce Platform

A modern, production-ready agriculture e-commerce web application where farmers and customers can purchase agriculture products online.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite, TypeScript, Tailwind CSS, Shadcn/UI |
| State | Zustand, TanStack Query |
| Backend | FastAPI, SQLAlchemy 2.0, Pydantic v2 |
| Database | PostgreSQL 16 |
| Cache | Redis 7 |
| Auth | JWT + bcrypt |
| Payments | Stripe Checkout + Webhooks |
| Deploy | Docker Compose |

## Features

### Customer
- Browse, search, filter, and sort products
- Product details with reviews and ratings
- Shopping cart and wishlist
- Stripe checkout and payment
- Order tracking with delivery timeline
- Profile management
- Coupon codes

### Admin
- Dashboard with sales analytics
- Product and category management
- Order and delivery status management
- Customer management
- Review moderation
- Coupon management

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 20+ (for local frontend dev)
- Python 3.12+ (for local backend dev)

### With Docker (Recommended)

```bash
# Clone and start all services
docker compose up --build

# Access:
# Frontend: http://localhost
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/api/docs
```

### Local Development

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Start PostgreSQL and Redis (or use Docker for just DB)
docker compose up db redis -d

cp .env.example .env
python seed.py
uvicorn app.main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
# Open http://localhost:5173
```

## Default Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@agrosolution.com | admin123 |
| Customer | customer@agrosolution.com | customer123 |

## Stripe Setup

1. Create a [Stripe account](https://stripe.com) and get test API keys
2. Add keys to `.env` files (root, backend, frontend)
3. For webhooks in development:
   ```bash
   stripe listen --forward-to localhost:8000/api/payments/webhook
   ```
4. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

## Project Structure

```
patidar-agro-solution/
├── backend/
│   ├── app/
│   │   ├── api/routes/     # API endpoints
│   │   ├── core/           # Config, security, deps
│   │   ├── models/         # SQLAlchemy models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Business logic
│   │   └── main.py
│   ├── alembic/            # DB migrations
│   ├── seed.py             # Sample data
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/            # API client
│   │   ├── components/     # UI components
│   │   ├── pages/          # Route pages
│   │   ├── store/          # Zustand stores
│   │   └── types/          # TypeScript types
│   └── package.json
├── docs/                   # Architecture & API docs
├── docker-compose.yml
└── README.md
```

## API Documentation

- Swagger UI: http://localhost:8000/api/docs
- ReDoc: http://localhost:8000/api/redoc
- See [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md) for full reference

## Order Status Flow

```
Pending → Confirmed → Packed → Shipped → Out For Delivery → Delivered
```

## Environment Variables

See `.env.example` files in root, backend, and frontend directories.

## License

Proprietary - Patidar Agro Solution
