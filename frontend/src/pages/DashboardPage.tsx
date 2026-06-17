import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Package, ShoppingBag, Heart, User, Settings } from 'lucide-react'
import { orderApi, productApi } from '@/api'
import { useAuthStore } from '@/store/authStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { ProductCard } from '@/components/product/ProductCard'
import { formatPrice, formatDate, formatStatus } from '@/lib/utils'

export function DashboardPage() {
  const { user } = useAuthStore()
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders', 1],
    queryFn: () => orderApi.list(1).then((r) => r.data.data),
  })

  const { data: products, isLoading: loadingProducts } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => productApi.featured().then((r) => r.data.data),
  })

  const quickLinks = [
    { to: '/orders', icon: ShoppingBag, label: 'My Orders' },
    { to: '/wishlist', icon: Heart, label: 'Wishlist' },
    { to: '/profile', icon: User, label: 'Profile' },
    { to: '/cart', icon: Package, label: 'Cart' },
  ]

  if (user?.role === 'admin') {
    quickLinks.push({ to: '/admin', icon: Settings, label: 'Admin Panel' })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Welcome, {user?.full_name?.split(' ')[0]}!</h1>
      <p className="text-muted-foreground mb-8">Manage your orders and account</p>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
        {quickLinks.map((link) => (
          <Link key={link.to} to={link.to}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="flex flex-col items-center py-6">
                <link.icon className="h-8 w-8 text-agro-600 mb-2" />
                <span className="font-medium text-sm">{link.label}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Orders</CardTitle>
          <Button variant="outline" size="sm" asChild><Link to="/orders">View All</Link></Button>
        </CardHeader>
        <CardContent>
          {isLoading ? <Spinner /> : orders && orders.items.length > 0 ? (
            <div className="space-y-4">
              {orders.items.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div>
                    <p className="font-medium">{order.order_number}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(order.created_at)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(order.total_amount)}</p>
                    <Badge variant={order.order_status === 'delivered' ? 'success' : 'secondary'}>
                      {formatStatus(order.order_status)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No orders yet. <Link to="/products" className="text-agro-600 hover:underline">Start shopping</Link></p>
          )}
        </CardContent>
      </Card>

      <div className="mt-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-agro-900">Recommended Products</h2>
            <p className="text-muted-foreground mt-1">Handpicked quality products for your farm</p>
          </div>
          <Button variant="outline" className="rounded-full border-agro-200 hover:bg-agro-50 w-fit" asChild>
            <Link to="/products">Browse All Products</Link>
          </Button>
        </div>
        {loadingProducts ? (
          <Spinner className="py-12" />
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {products.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">No recommended products available at this time.</p>
        )}
      </div>
    </div>
  )
}
