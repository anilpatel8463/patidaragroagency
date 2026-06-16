# Frontend Routing Plan

## Public Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | HomePage | Hero, featured, categories, testimonials |
| `/products` | ProductListingPage | Product grid with filters |
| `/products/:id` | ProductDetailPage | Product details, reviews, add to cart |
| `/about` | AboutPage | About us |
| `/contact` | ContactPage | Contact form |
| `/track` | TrackingPage | Enter tracking number |
| `/track/:trackingNumber` | TrackingPage | View shipment timeline |
| `/login` | LoginPage | Email login |
| `/register` | RegisterPage | Customer registration |
| `/forgot-password` | ForgotPasswordPage | Password reset request |

## Protected Customer Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/dashboard` | DashboardPage | Order summary, recent purchases |
| `/orders` | OrdersPage | Order history |
| `/orders/:id` | OrderDetailPage | Order details + tracking |
| `/profile` | ProfilePage | Edit profile, change password |
| `/wishlist` | WishlistPage | Saved products |
| `/cart` | CartPage | Shopping cart |
| `/checkout` | CheckoutPage | Shipping + payment |
| `/checkout/success` | CheckoutSuccessPage | Payment success |
| `/checkout/cancel` | CheckoutCancelPage | Payment cancelled |

## Admin Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/admin` | AdminDashboardPage | Sales analytics |
| `/admin/products` | AdminProductsPage | Product CRUD |
| `/admin/products/new` | AdminProductFormPage | Create product |
| `/admin/products/:id/edit` | AdminProductFormPage | Edit product |
| `/admin/categories` | AdminCategoriesPage | Category management |
| `/admin/orders` | AdminOrdersPage | Order management |
| `/admin/orders/:id` | AdminOrderDetailPage | Order + delivery management |
| `/admin/customers` | AdminCustomersPage | Customer list |
| `/admin/coupons` | AdminCouponsPage | Coupon management |
| `/admin/reviews` | AdminReviewsPage | Review moderation |

## Route Guards

- `PublicRoute` - Redirects authenticated users away from login/register
- `ProtectedRoute` - Requires authentication, redirects to /login
- `AdminRoute` - Requires admin role, redirects to /dashboard

## Layout Structure

```
App
├── PublicLayout (Header + Footer)
│   ├── Home, Products, About, Contact, Track
│   └── Auth pages (no header footer variant)
├── CustomerLayout (Header + Sidebar + Footer)
│   ├── Dashboard, Orders, Profile, Wishlist
│   └── Cart, Checkout
└── AdminLayout (Admin Sidebar + Topbar)
    └── All /admin/* routes
```

## State Management

| Store | Purpose |
|-------|---------|
| authStore (Zustand) | User, tokens, login/logout |
| cartStore (Zustand) | Cart items, totals (synced with API) |
| TanStack Query | Server state: products, orders, categories |

## API Client

Axios instance with:
- Base URL from env
- Request interceptor: attach JWT
- Response interceptor: handle 401, refresh token
