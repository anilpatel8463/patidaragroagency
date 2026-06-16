import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { orderApi } from '@/api'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { formatPrice, formatDate, formatStatus } from '@/lib/utils'

const statusSteps = ['pending', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered']

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => orderApi.get(id!).then((r) => r.data.data),
    enabled: !!id,
  })

  if (isLoading) return <Spinner className="py-20" />
  if (!order) return <div className="container mx-auto px-4 py-20 text-center">Order not found</div>

  const currentStep = statusSteps.indexOf(order.order_status)

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">{order.order_number}</h1>
          <p className="text-sm text-muted-foreground">{formatDate(order.created_at)}</p>
        </div>
        <div className="flex gap-2">
          <Badge variant={order.payment_status === 'paid' ? 'success' : 'warning'}>{formatStatus(order.payment_status)}</Badge>
          <Badge variant="secondary">{formatStatus(order.order_status)}</Badge>
        </div>
      </div>

      {/* Timeline */}
      <div className="mb-8">
        <h2 className="font-semibold mb-4">Order Status</h2>
        <div className="flex items-center justify-between relative">
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200" />
          {statusSteps.map((step, i) => (
            <div key={step} className="relative flex flex-col items-center z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                i <= currentStep ? 'bg-agro-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {i + 1}
              </div>
              <span className="text-xs mt-1 text-center hidden sm:block max-w-[60px]">{formatStatus(step)}</span>
            </div>
          ))}
        </div>
      </div>

      {order.tracking_number && (
        <div className="bg-agro-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-muted-foreground">Tracking Number</p>
          <p className="font-mono font-medium">{order.tracking_number}</p>
          {order.estimated_delivery && <p className="text-sm mt-1">Est. Delivery: {formatDate(order.estimated_delivery)}</p>}
          <Button variant="outline" size="sm" className="mt-2" asChild>
            <Link to={`/track/${order.tracking_number}`}>Track Shipment</Link>
          </Button>
        </div>
      )}

      <div className="border rounded-lg p-4 mb-6">
        <h2 className="font-semibold mb-3">Items</h2>
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between py-2 border-b last:border-0">
            <div>
              <p className="font-medium text-sm">{item.product_name}</p>
              <p className="text-xs text-muted-foreground">Qty: {item.quantity} x {formatPrice(item.unit_price)}</p>
            </div>
            <p className="font-medium text-sm">{formatPrice(item.total_price)}</p>
          </div>
        ))}
        <div className="flex justify-between pt-3 font-bold">
          <span>Total</span><span>{formatPrice(order.total_amount)}</span>
        </div>
      </div>

      <div className="border rounded-lg p-4">
        <h2 className="font-semibold mb-2">Shipping Address</h2>
        <p className="text-sm">{order.shipping_address.full_name}</p>
        <p className="text-sm text-muted-foreground">{order.shipping_address.address}</p>
        <p className="text-sm text-muted-foreground">{order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}</p>
        <p className="text-sm text-muted-foreground">Phone: {order.shipping_address.phone}</p>
      </div>
    </div>
  )
}
