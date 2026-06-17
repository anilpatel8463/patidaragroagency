import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { orderApi } from '@/api'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { formatPrice, formatDate, formatStatus } from '@/lib/utils'

export function OrdersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => orderApi.list().then((r) => r.data.data),
  })

  if (isLoading) return <Spinner className="py-20" />

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      {data && data.items.length > 0 ? (
        <div className="space-y-4">
          {data.items.map((order) => (
            <div key={order.id} className="border rounded-lg p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <p className="font-semibold">{order.order_number}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(order.created_at)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={order.payment_status === 'paid' ? 'success' : 'warning'}>
                    {formatStatus(order.payment_status)}
                  </Badge>
                  <Badge variant="secondary">{formatStatus(order.order_status)}</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{order.items.length} item(s)</p>
                  <p className="font-bold text-lg">{formatPrice(order.total_amount)}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/track/${order.tracking_number || order.order_number}`}>Track</Link>
                  </Button>
                  <Button size="sm" asChild><Link to={`/orders/${order.id}`}>Details</Link></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-12">No orders yet.</p>
      )}
    </div>
  )
}
