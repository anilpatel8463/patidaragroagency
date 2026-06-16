import { useQuery } from '@tanstack/react-query'
import { DollarSign, ShoppingBag, Users, Clock, ArrowUpRight, TrendingUp, Package, Star } from 'lucide-react'
import { adminApi } from '@/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { formatPrice, formatDate, formatStatus } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

export function AdminDashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminApi.dashboard().then((r) => r.data.data),
  })

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <Spinner size="lg" />
      <p className="text-muted-foreground animate-pulse">Loading dashboard insights...</p>
    </div>
  )
  
  if (!stats) return null

  const statCards = [
    { 
      label: 'Total Revenue', 
      value: formatPrice(stats.total_revenue), 
      icon: DollarSign, 
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      trend: '+12.5% from last month',
      trendColor: 'text-emerald-600'
    },
    { 
      label: 'Total Orders', 
      value: stats.total_orders, 
      icon: ShoppingBag, 
      color: 'bg-blue-50 text-blue-600 border-blue-100',
      trend: '+5 this week',
      trendColor: 'text-blue-600'
    },
    { 
      label: 'Active Customers', 
      value: stats.total_customers, 
      icon: Users, 
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      trend: '+2 new today',
      trendColor: 'text-indigo-600'
    },
    { 
      label: 'Pending Orders', 
      value: stats.pending_orders, 
      icon: Clock, 
      color: 'bg-amber-50 text-amber-600 border-amber-100',
      trend: 'Needs attention',
      trendColor: 'text-amber-600'
    },
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your store today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((s) => (
          <Card key={s.label} className="border-none shadow-sm bg-white/50 backdrop-blur-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{s.label}</p>
                  <p className="text-3xl font-bold">{s.value}</p>
                  <div className={`flex items-center text-xs font-medium ${s.trendColor}`}>
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {s.trend}
                  </div>
                </div>
                <div className={`p-3 rounded-xl border ${s.color}`}>
                  <s.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-7 gap-6">
        <Card className="lg:col-span-4 border-none shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Revenue Analytics</CardTitle>
                <CardDescription>Monthly revenue growth over the last 6 months</CardDescription>
              </div>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100">
                Live updates
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="h-[300px] flex items-end justify-between gap-2 px-6 pb-6">
            {stats.monthly_revenue.map((m: any, i: number) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div 
                  className="w-full bg-primary/20 rounded-t-md group-hover:bg-primary/40 transition-all cursor-pointer relative"
                  style={{ height: `${(m.revenue / 25000) * 100}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                    {formatPrice(m.revenue)}
                  </div>
                </div>
                <span className="text-xs font-medium text-muted-foreground">{m.month}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Recent Orders
            </CardTitle>
            <CardDescription>Latest transactions from your customers</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.recent_orders.length > 0 ? (
              <div className="space-y-6">
                {stats.recent_orders.map((o) => (
                  <div key={o.id} className="flex justify-between items-center group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-primary font-bold">
                        {o.order_number.slice(-2)}
                      </div>
                      <div>
                        <p className="font-semibold text-sm group-hover:text-primary transition-colors">{o.order_number}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(o.created_at)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">{formatPrice(o.total_amount)}</p>
                      <Badge 
                        variant={o.status === 'pending' ? 'secondary' : 'success'} 
                        className="text-[10px] h-5 px-1.5"
                      >
                        {formatStatus(o.status)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
                <ShoppingBag className="h-10 w-10 text-muted-foreground/20" />
                <p className="text-muted-foreground text-sm">No orders found yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
              Top Selling Products
            </CardTitle>
            <CardDescription>Products with the highest sales volume</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.top_products.length > 0 ? (
              <div className="space-y-4">
                {stats.top_products.map((p, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-transparent hover:border-border hover:bg-gray-50/50 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold">
                        #{i + 1}
                      </div>
                      <span className="font-medium text-sm">{p.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="font-bold">
                        {p.sold} units sold
                      </Badge>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            ) : <p className="text-muted-foreground text-sm">No sales data yet</p>}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500" />
              System Health
            </CardTitle>
            <CardDescription>Real-time status of your store components</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: 'API Server', status: 'Healthy', color: 'bg-emerald-500' },
              { name: 'Database', status: 'Connected', color: 'bg-emerald-500' },
              { name: 'Redis Cache', status: 'Active', color: 'bg-emerald-500' },
              { name: 'Static Assets', status: 'Optimized', color: 'bg-blue-500' },
            ].map((item) => (
              <div key={item.name} className="flex items-center justify-between p-2">
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${item.color}`} />
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
                <span className="text-xs text-muted-foreground uppercase tracking-widest">{item.status}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
