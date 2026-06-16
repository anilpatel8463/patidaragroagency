# Database Schema

## Entity Relationship Diagram

```
users ─────────────┬──────────── orders ──────── order_items ──── products
  │                │              │                              │
  │                │              └──── payments                   │
  │                │              └──── order_status_history      │
  │                │                                              │
  │                ├──── cart_items ──────────────────────────────┘
  │                ├──── reviews ──────────────────────────────────┘
  │                ├──── wishlist_items ─────────────────────────┘
  │                └──── recently_viewed ─────────────────────────┘
  │
categories ──────── products
coupons
newsletter_subscribers
```

## Tables

### users
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| full_name | VARCHAR(255) | NOT NULL |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| password_hash | VARCHAR(255) | NOT NULL |
| phone | VARCHAR(20) | |
| address | TEXT | |
| city | VARCHAR(100) | |
| state | VARCHAR(100) | |
| pincode | VARCHAR(10) | |
| role | ENUM(customer, admin) | DEFAULT customer |
| is_active | BOOLEAN | DEFAULT true |
| created_at | TIMESTAMP | DEFAULT now() |
| updated_at | TIMESTAMP | |

### categories
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| name | VARCHAR(100) | UNIQUE, NOT NULL |
| description | TEXT | |
| image_url | VARCHAR(500) | |
| slug | VARCHAR(120) | UNIQUE |
| is_active | BOOLEAN | DEFAULT true |
| created_at | TIMESTAMP | DEFAULT now() |

### products
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| name | VARCHAR(255) | NOT NULL |
| description | TEXT | |
| price | DECIMAL(10,2) | NOT NULL |
| compare_price | DECIMAL(10,2) | |
| stock | INTEGER | DEFAULT 0 |
| image_url | VARCHAR(500) | |
| images | JSONB | |
| sku | VARCHAR(50) | UNIQUE |
| category_id | UUID | FK → categories.id |
| is_featured | BOOLEAN | DEFAULT false |
| is_active | BOOLEAN | DEFAULT true |
| weight | VARCHAR(50) | |
| unit | VARCHAR(20) | |
| created_at | TIMESTAMP | DEFAULT now() |
| updated_at | TIMESTAMP | |

### cart_items
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| user_id | UUID | FK → users.id |
| product_id | UUID | FK → products.id |
| quantity | INTEGER | DEFAULT 1 |
| created_at | TIMESTAMP | DEFAULT now() |
| UNIQUE(user_id, product_id) | | |

### orders
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| user_id | UUID | FK → users.id |
| order_number | VARCHAR(20) | UNIQUE |
| total_amount | DECIMAL(10,2) | NOT NULL |
| discount_amount | DECIMAL(10,2) | DEFAULT 0 |
| shipping_address | JSONB | NOT NULL |
| payment_status | ENUM | pending/paid/failed/refunded |
| order_status | ENUM | pending/confirmed/packed/shipped/out_for_delivery/delivered/cancelled |
| tracking_number | VARCHAR(50) | UNIQUE |
| coupon_code | VARCHAR(50) | |
| notes | TEXT | |
| estimated_delivery | DATE | |
| created_at | TIMESTAMP | DEFAULT now() |
| updated_at | TIMESTAMP | |

### order_items
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| order_id | UUID | FK → orders.id |
| product_id | UUID | FK → products.id |
| product_name | VARCHAR(255) | NOT NULL |
| quantity | INTEGER | NOT NULL |
| unit_price | DECIMAL(10,2) | NOT NULL |
| total_price | DECIMAL(10,2) | NOT NULL |

### order_status_history
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| order_id | UUID | FK → orders.id |
| status | VARCHAR(50) | NOT NULL |
| note | TEXT | |
| created_at | TIMESTAMP | DEFAULT now() |

### payments
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| order_id | UUID | FK → orders.id |
| stripe_session_id | VARCHAR(255) | |
| stripe_payment_intent | VARCHAR(255) | |
| amount | DECIMAL(10,2) | NOT NULL |
| currency | VARCHAR(3) | DEFAULT INR |
| status | ENUM | pending/paid/failed/refunded |
| created_at | TIMESTAMP | DEFAULT now() |

### reviews
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| user_id | UUID | FK → users.id |
| product_id | UUID | FK → products.id |
| rating | INTEGER | CHECK 1-5 |
| title | VARCHAR(200) | |
| comment | TEXT | |
| is_approved | BOOLEAN | DEFAULT false |
| created_at | TIMESTAMP | DEFAULT now() |
| UNIQUE(user_id, product_id) | | |

### coupons
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| code | VARCHAR(50) | UNIQUE |
| discount_type | ENUM | percentage/fixed |
| discount_value | DECIMAL(10,2) | |
| min_order_amount | DECIMAL(10,2) | DEFAULT 0 |
| max_uses | INTEGER | |
| used_count | INTEGER | DEFAULT 0 |
| is_active | BOOLEAN | DEFAULT true |
| expires_at | TIMESTAMP | |
| created_at | TIMESTAMP | DEFAULT now() |

### wishlist_items
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| user_id | UUID | FK → users.id |
| product_id | UUID | FK → products.id |
| created_at | TIMESTAMP | DEFAULT now() |
| UNIQUE(user_id, product_id) | | |

### recently_viewed
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| user_id | UUID | FK → users.id |
| product_id | UUID | FK → products.id |
| viewed_at | TIMESTAMP | DEFAULT now() |

### newsletter_subscribers
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| email | VARCHAR(255) | UNIQUE |
| is_active | BOOLEAN | DEFAULT true |
| subscribed_at | TIMESTAMP | DEFAULT now() |

## Indexes

- `idx_products_category` ON products(category_id)
- `idx_products_featured` ON products(is_featured) WHERE is_featured = true
- `idx_orders_user` ON orders(user_id)
- `idx_orders_status` ON orders(order_status)
- `idx_orders_tracking` ON orders(tracking_number)
- `idx_reviews_product` ON reviews(product_id)
- `idx_cart_user` ON cart_items(user_id)
