import api from './client'
import type {
  ApiResponse, User, Product, Category, CartSummary, Order,
  PaginatedResponse, Review, DashboardStats, Coupon, TrackingInfo,
} from '@/types'

export const authApi = {
  register: (data: { full_name: string; email: string; password: string }) =>
    api.post<ApiResponse<{ access_token: string; refresh_token: string }>>('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post<ApiResponse<{ access_token: string; refresh_token: string }>>('/auth/login', data),
  me: () => api.get<ApiResponse<User>>('/auth/me'),
  changePassword: (data: { current_password: string; new_password: string }) =>
    api.put('/auth/change-password', data),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
}

export const productApi = {
  list: (params?: Record<string, unknown>) =>
    api.get<ApiResponse<PaginatedResponse<Product>>>('/products', { params }),
  get: (id: string) => api.get<ApiResponse<Product>>(`/products/${id}`),
  featured: () => api.get<ApiResponse<Product[]>>('/products/featured'),
  bestSellers: () => api.get<ApiResponse<Product[]>>('/products/best-sellers'),
  related: (id: string) => api.get<ApiResponse<Product[]>>(`/products/${id}/related`),
  reviews: (id: string) => api.get<ApiResponse<Review[]>>(`/products/${id}/reviews`),
}

export const categoryApi = {
  list: () => api.get<ApiResponse<Category[]>>('/categories'),
  get: (id: string) => api.get<ApiResponse<Category>>(`/categories/${id}`),
}

export const cartApi = {
  get: () => api.get<ApiResponse<CartSummary>>('/cart'),
  add: (product_id: string, quantity: number = 1) =>
    api.post('/cart', { product_id, quantity }),
  update: (itemId: string, quantity: number) =>
    api.put(`/cart/${itemId}`, { quantity }),
  remove: (itemId: string) => api.delete(`/cart/${itemId}`),
  clear: () => api.delete('/cart'),
}

export const orderApi = {
  create: (data: { shipping_address: Record<string, string>; coupon_code?: string; notes?: string; payment_method?: string }) =>
    api.post<ApiResponse<Order>>('/orders', data),
  list: (page = 1) => api.get<ApiResponse<PaginatedResponse<Order>>>('/orders', { params: { page } }),
  get: (id: string) => api.get<ApiResponse<Order>>(`/orders/${id}`),
  track: (trackingNumber: string) =>
    api.get<ApiResponse<TrackingInfo>>(`/orders/track/${trackingNumber}`),
}

export const paymentApi = {
  createSession: (orderId: string) =>
    api.post<ApiResponse<{ session_id: string; url: string }>>('/payments/create-checkout-session', { order_id: orderId }),
  verify: (sessionId: string) => api.get(`/payments/verify/${sessionId}`),
}

export const reviewApi = {
  create: (data: { product_id: string; rating: number; title?: string; comment?: string }) =>
    api.post('/reviews', data),
}

export const userApi = {
  getProfile: () => api.get<ApiResponse<User>>('/users/profile'),
  updateProfile: (data: Partial<User>) => api.put<ApiResponse<User>>('/users/profile', data),
  getWishlist: () => api.get<ApiResponse<Product[]>>('/users/wishlist'),
  addToWishlist: (productId: string) => api.post(`/users/wishlist/${productId}`),
  removeFromWishlist: (productId: string) => api.delete(`/users/wishlist/${productId}`),
  recentlyViewed: () => api.get<ApiResponse<Product[]>>('/users/recently-viewed'),
}

export const couponApi = {
  validate: (code: string, order_amount: number) =>
    api.post<ApiResponse<{ valid: boolean; discount_amount: number; message: string }>>('/coupons/validate', { code, order_amount }),
}

export const newsletterApi = {
  subscribe: (email: string) => api.post('/newsletter/subscribe', { email }),
}

export const adminApi = {
  dashboard: () => api.get<ApiResponse<DashboardStats>>('/admin/dashboard'),
  products: {
    list: (page = 1) => api.get<ApiResponse<PaginatedResponse<Product>>>('/admin/products', { params: { page } }),
    create: (data: Partial<Product>) => api.post('/admin/products', data),
    update: (id: string, data: Partial<Product>) => api.put(`/admin/products/${id}`, data),
    delete: (id: string) => api.delete(`/admin/products/${id}`),
  },
  categories: {
    list: () => api.get<ApiResponse<Category[]>>('/admin/categories'),
    create: (data: Partial<Category>) => api.post('/admin/categories', data),
    update: (id: string, data: Partial<Category>) => api.put(`/admin/categories/${id}`, data),
    delete: (id: string) => api.delete(`/admin/categories/${id}`),
  },
  orders: {
    list: (page = 1, status?: string) =>
      api.get<ApiResponse<PaginatedResponse<Order>>>('/admin/orders', { params: { page, status } }),
    updateStatus: (id: string, status: string, note?: string) =>
      api.put(`/admin/orders/${id}/status`, { status, note }),
  },
  customers: {
    list: (page = 1) => api.get<ApiResponse<PaginatedResponse<User>>>('/admin/customers', { params: { page } }),
  },
  reviews: {
    list: () => api.get<ApiResponse<Review[]>>('/admin/reviews'),
    approve: (id: string) => api.put(`/admin/reviews/${id}/approve`),
  },
  coupons: {
    list: () => api.get<ApiResponse<Coupon[]>>('/admin/coupons'),
    create: (data: Partial<Coupon>) => api.post('/admin/coupons', data),
    update: (id: string, data: Partial<Coupon>) => api.put(`/admin/coupons/${id}`, data),
    delete: (id: string) => api.delete(`/admin/coupons/${id}`),
  },
  newsletters: {
    list: (page = 1) => api.get<ApiResponse<PaginatedResponse<any>>>('/admin/newsletters', { params: { page } }),
    delete: (id: string) => api.delete(`/admin/newsletters/${id}`),
  },
}
