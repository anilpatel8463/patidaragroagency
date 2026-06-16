# Agro Solution - System Architecture

## Overview

Agro Solution is a full-stack agriculture e-commerce platform enabling farmers and customers to browse, purchase, and track agricultural products online.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client (Browser)                          │
│              React 19 + Vite + TypeScript + Tailwind             │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS / REST API
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Nginx (Reverse Proxy)                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
          ┌──────────────────┼──────────────────┐
          ▼                  ▼                  ▼
┌─────────────────┐  ┌─────────────┐  ┌─────────────────┐
│  FastAPI App    │  │   Redis     │  │   PostgreSQL    │
│  (Uvicorn)      │  │  Cache/     │  │   Primary DB    │
│                 │  │  Sessions   │  │                 │
└────────┬────────┘  └─────────────┘  └─────────────────┘
         │
         ▼
┌─────────────────┐
│  Stripe API     │
│  (Payments)     │
└─────────────────┘
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite, TypeScript, Tailwind CSS, Shadcn/UI |
| State | Zustand (client), TanStack Query (server) |
| Backend | FastAPI, SQLAlchemy 2.0, Pydantic v2 |
| Database | PostgreSQL 16 |
| Cache | Redis 7 |
| Auth | JWT (access + refresh tokens), bcrypt |
| Payments | Stripe Checkout + Webhooks |
| Migrations | Alembic |
| Container | Docker Compose |

## Module Structure

### Backend Modules
- **core** - Config, security, dependencies, rate limiting
- **models** - SQLAlchemy ORM models
- **schemas** - Pydantic request/response schemas
- **api** - Route handlers grouped by domain
- **services** - Business logic (orders, payments, email, PDF)
- **utils** - Helpers (email, PDF generation)

### Frontend Modules
- **pages** - Route-level page components
- **components** - Reusable UI (layout, product, admin)
- **api** - Axios client + API functions
- **store** - Zustand stores (auth, cart)
- **hooks** - Custom React hooks
- **types** - TypeScript interfaces

## Authentication Flow

```
1. User submits login/register form
2. Frontend POST /api/auth/login or /api/auth/register
3. Backend validates credentials, returns JWT access + refresh tokens
4. Frontend stores tokens in memory + localStorage
5. Axios interceptor attaches Bearer token to requests
6. Protected routes check auth state via Zustand
7. Token refresh via POST /api/auth/refresh before expiry
8. Role-based access: customer vs admin middleware
```

## Stripe Payment Workflow

```
1. User completes cart → Checkout page
2. Frontend POST /api/orders (creates order with status=pending)
3. Frontend POST /api/payments/create-checkout-session
4. Backend creates Stripe Checkout Session, returns session URL
5. User redirected to Stripe hosted checkout
6. On success → Stripe redirects to /checkout/success?session_id=xxx
7. Stripe webhook POST /api/payments/webhook
   - checkout.session.completed → mark order paid, reduce inventory
8. Frontend polls or fetches order status on success page
```

## Delivery Tracking Workflow

```
Order Status Flow:
  pending → confirmed → packed → shipped → out_for_delivery → delivered

1. Admin updates order status via /api/admin/orders/{id}/status
2. System generates tracking_number on "shipped" status
3. Customer views tracking at /track or /orders/{id}
4. Timeline built from order_status_history records
5. Estimated delivery = shipped_date + 3-5 business days
```

## Security

- JWT with short-lived access tokens (30 min) + refresh tokens (7 days)
- bcrypt password hashing (12 rounds)
- Rate limiting via slowapi (100 req/min default)
- Pydantic input validation on all endpoints
- CORS restricted to frontend origin
- CSRF token for state-changing operations
- Role-based access control (customer, admin)
- Environment variables for all secrets
- Stripe webhook signature verification

## Caching Strategy

- Redis caches product listings (TTL 5 min)
- Category list cached (TTL 10 min)
- Session data stored in Redis
- Cache invalidation on product/category mutations
