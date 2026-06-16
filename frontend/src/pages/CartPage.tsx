import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { formatPrice } from '@/lib/utils'

export function CartPage() {
  const { items, subtotal, isLoading, fetchCart, updateQuantity, removeItem } = useCartStore()


  useEffect(() => { fetchCart() }, [fetchCart])

  if (isLoading) return <Spinner className="py-20" />

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">Add some products to get started</p>
        <Button asChild><Link to="/products">Browse Products</Link></Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 border rounded-lg p-4">
              <img
                src={item.product.image_url || 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=100'}
                alt={item.product.name}
                className="w-20 h-20 object-cover rounded-md"
              />
              <div className="flex-1">
                <Link to={`/products/${item.product.id}`} className="font-medium hover:text-agro-700">{item.product.name}</Link>
                <p className="text-sm text-muted-foreground">{formatPrice(item.product.price)} each</p>
                <div className="flex items-center gap-2 mt-2">
                  <button className="p-1 border rounded hover:bg-gray-100" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="px-2 text-sm font-medium">{item.quantity}</span>
                  <button className="p-1 border rounded hover:bg-gray-100" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                    <Plus className="h-3 w-3" />
                  </button>
                  <button className="p-1 text-red-500 hover:bg-red-50 rounded ml-auto" onClick={() => removeItem(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="text-right font-medium">{formatPrice(item.product.price * item.quantity)}</div>
            </div>
          ))}
        </div>

        <div className="border rounded-lg p-6 h-fit space-y-4">
          <h2 className="text-lg font-semibold">Order Summary</h2>
          <div className="flex justify-between text-sm"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
          <div className="flex justify-between text-sm"><span>Shipping</span><span className="text-agro-600">Calculated at checkout</span></div>
          <div className="border-t pt-4 flex justify-between font-bold text-lg">
            <span>Total</span><span>{formatPrice(subtotal)}</span>
          </div>
          <Button className="w-full bg-agro-600 hover:bg-agro-700" size="lg" asChild>
            <Link to="/checkout">Proceed to Checkout</Link>
          </Button>
          <Button variant="outline" className="w-full" asChild><Link to="/products">Continue Shopping</Link></Button>
        </div>
      </div>
    </div>
  )
}
