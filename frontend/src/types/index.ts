export interface User {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  role: 'customer' | 'admin';
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  slug?: string;
  is_active: boolean;
  product_count?: number;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  compare_price?: number;
  stock: number;
  image_url?: string;
  images?: string[];
  sku?: string;
  category_id?: string;
  category?: { id: string; name: string; slug?: string };
  is_featured: boolean;
  is_active: boolean;
  weight?: string;
  unit?: string;
  avg_rating?: number;
  review_count?: number;
  created_at: string;
}

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: Product;
  created_at: string;
}

export interface CartSummary {
  items: CartItem[];
  subtotal: number;
  item_count: number;
}

export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface StatusHistory {
  status: string;
  note?: string;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  total_amount: number;
  discount_amount: number;
  shipping_address: Record<string, string>;
  payment_status: string;
  order_status: string;
  tracking_number?: string;
  coupon_code?: string;
  notes?: string;
  estimated_delivery?: string;
  items: OrderItem[];
  status_history: StatusHistory[];
  created_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  title?: string;
  comment?: string;
  is_approved: boolean;
  user_name?: string;
  created_at: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface DashboardStats {
  total_sales: number;
  total_revenue: number;
  total_orders: number;
  total_customers: number;
  pending_orders: number;
  recent_orders: Array<{
    id: string;
    order_number: string;
    total_amount: number;
    status: string;
    created_at: string;
  }>;
  top_products: Array<{ name: string; sold: number }>;
  monthly_revenue: unknown[];
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  min_order_amount: number;
  is_active: boolean;
  expires_at?: string;
}

export interface TrackingInfo {
  tracking_number: string;
  order_number: string;
  order_status: string;
  estimated_delivery?: string;
  timeline: StatusHistory[];
  shipping_address: Record<string, string>;
}
