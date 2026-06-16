import { Link } from 'react-router-dom'
import { XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CheckoutCancelPage() {
  return (
    <div className="container mx-auto px-4 py-20 text-center max-w-lg">
      <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
      <h1 className="text-3xl font-bold mb-2">Payment Cancelled</h1>
      <p className="text-muted-foreground mb-6">Your payment was not completed. Your cart items are still saved.</p>
      <div className="flex gap-4 justify-center">
        <Button asChild><Link to="/cart">Return to Cart</Link></Button>
        <Button variant="outline" asChild><Link to="/products">Continue Shopping</Link></Button>
      </div>
    </div>
  )
}
