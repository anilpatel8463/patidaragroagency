# API Documentation

Base URL: `http://localhost:8000/api`

## Authentication (`/api/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | Public | Register new customer |
| POST | `/auth/login` | Public | Login, returns JWT tokens |
| POST | `/auth/refresh` | Public | Refresh access token |
| POST | `/auth/forgot-password` | Public | Request password reset |
| POST | `/auth/reset-password` | Public | Reset password with token |
| GET | `/auth/me` | User | Get current user profile |
| PUT | `/auth/change-password` | User | Change password |

## Products (`/api/products`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/products` | Public | List products (filter, search, sort, paginate) |
| GET | `/products/{id}` | Public | Get product details |
| GET | `/products/featured` | Public | Featured products |
| GET | `/products/best-sellers` | Public | Best selling products |
| GET | `/products/{id}/related` | Public | Related products |
| GET | `/products/{id}/reviews` | Public | Product reviews |

Query params for list: `page`, `limit`, `search`, `category`, `min_price`, `max_price`, `sort`, `in_stock`

## Categories (`/api/categories`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/categories` | Public | List all categories |
| GET | `/categories/{id}` | Public | Get category with products |

## Cart (`/api/cart`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/cart` | User | Get cart items |
| POST | `/cart` | User | Add item to cart |
| PUT | `/cart/{item_id}` | User | Update quantity |
| DELETE | `/cart/{item_id}` | User | Remove item |
| DELETE | `/cart` | User | Clear cart |

## Orders (`/api/orders`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/orders` | User | Create order from cart |
| GET | `/orders` | User | List user orders |
| GET | `/orders/{id}` | User | Get order details |
| GET | `/orders/track/{tracking_number}` | Public | Track order by number |

## Payments (`/api/payments`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/payments/create-checkout-session` | User | Create Stripe session |
| POST | `/payments/webhook` | Stripe | Webhook handler |
| GET | `/payments/verify/{session_id}` | User | Verify payment status |

## Reviews (`/api/reviews`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/reviews` | User | Create review |
| PUT | `/reviews/{id}` | User | Update own review |
| DELETE | `/reviews/{id}` | User | Delete own review |

## Users (`/api/users`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/users/profile` | User | Get profile |
| PUT | `/users/profile` | User | Update profile |
| GET | `/users/wishlist` | User | Get wishlist |
| POST | `/users/wishlist/{product_id}` | User | Add to wishlist |
| DELETE | `/users/wishlist/{product_id}` | User | Remove from wishlist |
| GET | `/users/recently-viewed` | User | Recently viewed products |

## Coupons (`/api/coupons`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/coupons/validate` | User | Validate coupon code |

## Newsletter (`/api/newsletter`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/newsletter/subscribe` | Public | Subscribe to newsletter |

## Admin (`/api/admin`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/admin/dashboard` | Admin | Analytics dashboard |
| GET | `/admin/products` | Admin | List all products |
| POST | `/admin/products` | Admin | Create product |
| PUT | `/admin/products/{id}` | Admin | Update product |
| DELETE | `/admin/products/{id}` | Admin | Delete product |
| GET | `/admin/categories` | Admin | List categories |
| POST | `/admin/categories` | Admin | Create category |
| PUT | `/admin/categories/{id}` | Admin | Update category |
| DELETE | `/admin/categories/{id}` | Admin | Delete category |
| GET | `/admin/orders` | Admin | List all orders |
| PUT | `/admin/orders/{id}/status` | Admin | Update order status |
| GET | `/admin/customers` | Admin | List customers |
| GET | `/admin/reviews` | Admin | List reviews |
| PUT | `/admin/reviews/{id}/approve` | Admin | Approve review |
| GET | `/admin/coupons` | Admin | List coupons |
| POST | `/admin/coupons` | Admin | Create coupon |
| PUT | `/admin/coupons/{id}` | Admin | Update coupon |
| DELETE | `/admin/coupons/{id}` | Admin | Delete coupon |
| GET | `/admin/orders/{id}/invoice` | Admin | Generate PDF invoice |

## Response Format

```json
{
  "success": true,
  "data": {},
  "message": "Optional message"
}
```

Error format:
```json
{
  "success": false,
  "detail": "Error message",
  "errors": []
}
```

## Pagination

```json
{
  "items": [],
  "total": 100,
  "page": 1,
  "limit": 20,
  "pages": 5
}
```
