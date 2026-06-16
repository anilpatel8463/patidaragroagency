import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '@/api'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatPrice, formatDate, formatStatus, cn } from '@/lib/utils'
import { ArrowLeft, Printer, Package, Truck, CheckCircle, Mail, Phone, CreditCard, ShoppingBag } from 'lucide-react'

const ORDER_STATUSES = ['pending', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled']

export function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: order, isLoading } = useQuery({
    queryKey: ['admin-order', id],
    queryFn: () => adminApi.orders.list(1).then((r) => r.data.data.items.find(o => o.id === id)),
    enabled: !!id,
  })

  const updateMutation = useMutation({
    mutationFn: (status: string) => adminApi.orders.updateStatus(id!, status),
    onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['admin-order', id] })
    },
  })

  if (isLoading) return <Spinner className="py-20" />
  if (!order) return <div className="p-20 text-center">Order not found</div>

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200'
      case 'confirmed': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'delivered': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
      case 'cancelled': return 'bg-rose-100 text-rose-700 border-rose-200'
      default: return 'bg-slate-100 text-slate-700 border-slate-200'
    }
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/admin/orders')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold tracking-tight">{order.order_number}</h2>
              <Badge variant="outline" className={cn("border-none text-[10px] uppercase font-bold", getStatusColor(order.order_status))}>
                {formatStatus(order.order_status)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">Placed on {formatDate(order.created_at)}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => window.print()}>
            <Printer className="h-4 w-4" /> Print Invoice
          </Button>
          <Select 
            value={order.order_status} 
            onChange={(e) => updateMutation.mutate(e.target.value)}
            className="w-40"
          >
            {ORDER_STATUSES.map(s => <option key={s} value={s}>{formatStatus(s)}</option>)}
          </Select>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-bold">Order Items</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-gray-100">
                {order.items.map((item) => (
                  <div key={item.id} className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                        <ShoppingBag className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{item.product_name}</p>
                        <p className="text-xs text-muted-foreground">{item.quantity} x {formatPrice(item.unit_price)}</p>
                      </div>
                    </div>
                    <p className="font-bold text-gray-900">{formatPrice(item.total_price)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 border-t pt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatPrice(order.total_amount + (order.discount_amount || 0))}</span>
                </div>
                {order.discount_amount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-emerald-600 font-medium">Discount ({order.coupon_code})</span>
                    <span className="text-emerald-600 font-medium">-{formatPrice(order.discount_amount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t mt-2">
                  <span>Total Amount</span>
                  <span className="text-primary">{formatPrice(order.total_amount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Delivery Address</h4>
                  <div className="space-y-1">
                    <p className="font-bold text-gray-900">{order.shipping_address.full_name}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{order.shipping_address.address}</p>
                    <p className="text-sm text-gray-600">{order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}</p>
                    <p className="text-sm font-medium pt-2 text-gray-900 leading-none flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5" /> {order.shipping_address.phone}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Order Timeline</h4>
                  <div className="space-y-4">
                    {order.status_history?.map((history, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="relative flex flex-col items-center">
                          <div className={cn("h-4 w-4 rounded-full flex items-center justify-center", i === 0 ? "bg-primary" : "bg-gray-200")}>
                            {i === 0 && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                          </div>
                          {i < order.status_history.length - 1 && <div className="w-0.5 h-full bg-gray-100 -mb-4 mt-1" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900 uppercase tracking-tight">{formatStatus(history.status)}</p>
                          <p className="text-[10px] text-muted-foreground">{formatDate(history.created_at)}</p>
                          {history.note && <p className="text-[10px] italic text-gray-400 mt-0.5">"{history.note}"</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer & Payment Info */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Customer Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-agro-100 flex items-center justify-center text-agro-700 font-bold uppercase">
                  {(order.user?.full_name || 'Guest')[0]}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{order.user?.full_name || 'Guest Customer'}</p>
                  <p className="text-xs text-muted-foreground">{order.user?.email || 'No email provided'}</p>
                </div>
              </div>
              <div className="pt-4 border-t space-y-3">
                 <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2"><CreditCard className="h-4 w-4" /> Payment</span>
                    <Badge variant={order.payment_status === 'paid' ? 'success' : 'warning'} className="uppercase text-[10px] font-bold tracking-wider">
                       {order.payment_status}
                    </Badge>
                 </div>
                 <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2"><CheckCircle className="h-4 w-4" /> Method</span>
                    <span className="font-bold uppercase text-[10px] tracking-widest text-gray-900 bg-gray-50 px-2 py-1 rounded">{order.payment_method || 'Online'}</span>
                 </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-primary/5 border border-primary/10">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full gap-2">
                 <Truck className="h-4 w-4" /> Send Update
              </Button>
              <Button className="w-full gap-2" variant="outline">
                 <Mail className="h-4 w-4" /> Contact Customer
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
