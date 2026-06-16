import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import { paymentApi } from '@/api'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

export function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [orderInfo, setOrderInfo] = useState<{ order_number?: string; order_id?: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (sessionId) {
      paymentApi.verify(sessionId).then((r) => {
        setOrderInfo(r.data.data)
        setLoading(false)
      }).catch(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [sessionId])

  if (loading) return <Spinner className="py-20" />

  return (
    <div className="container mx-auto px-4 py-20 text-center max-w-lg">
      <CheckCircle className="h-16 w-16 text-agro-600 mx-auto mb-4" />
      <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
      <p className="text-muted-foreground mb-2">Thank you for your order.</p>
      {orderInfo?.order_number && (
        <p className="font-medium mb-6">Order Number: {orderInfo.order_number}</p>
      )}
      <div className="flex gap-4 justify-center">
        {orderInfo?.order_id && (
          <Button asChild><Link to={`/orders/${orderInfo.order_id}`}>View Order</Link></Button>
        )}
        <Button variant="outline" asChild><Link to="/products">Continue Shopping</Link></Button>
      </div>
    </div>
  )
}
