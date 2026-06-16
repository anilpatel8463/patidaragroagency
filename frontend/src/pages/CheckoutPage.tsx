import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { orderApi, couponApi } from '@/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatPrice } from '@/lib/utils'

export function CheckoutPage() {
  const navigate = useNavigate()
  const { items, subtotal, fetchCart } = useCartStore()
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [couponMessage, setCouponMessage] = useState('')
  const [address, setAddress] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    pincode: user?.pincode || '',
  })
  const [notes, setNotes] = useState('')

  const handleApplyCoupon = async () => {
    if (!couponCode) return
    try {
      const { data } = await couponApi.validate(couponCode, subtotal)
      const result = data.data
      setCouponMessage(result.message)
      if (result.valid) setDiscount(result.discount_amount)
      else setDiscount(0)
    } catch {
      setCouponMessage('Invalid coupon')
      setDiscount(0)
    }
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data: orderData } = await orderApi.create({
        shipping_address: address,
        coupon_code: discount > 0 ? couponCode : undefined,
        notes: notes || undefined,
        payment_method: 'cod',
      })
      const order = orderData.data
      await fetchCart()
      navigate(`/checkout/success?order_id=${order.id}`)
    } catch {
      setLoading(false)
    }
  }

  const total = subtotal - discount

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <form onSubmit={handleCheckout}>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader><CardTitle>Shipping Address</CardTitle></CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2"><Label>Full Name</Label><Input value={address.full_name} onChange={(e) => setAddress({ ...address, full_name: e.target.value })} required /></div>
                <div><Label>Phone</Label><Input value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} required /></div>
                <div><Label>Pincode</Label><Input value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} required /></div>
                <div className="md:col-span-2"><Label>Address</Label><Textarea value={address.address} onChange={(e) => setAddress({ ...address, address: e.target.value })} required /></div>
                <div><Label>City</Label><Input value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} required /></div>
                <div><Label>State</Label><Input value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} required /></div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Order Notes (Optional)</CardTitle></CardHeader>
              <CardContent><Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Special instructions..." /></CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="truncate mr-2">{item.product.name} x{item.quantity}</span>
                    <span className="shrink-0">{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="border-t pt-3 space-y-2">
                  <div className="flex justify-between text-sm"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                  {discount > 0 && <div className="flex justify-between text-sm text-agro-600"><span>Discount</span><span>-{formatPrice(discount)}</span></div>}
                  <div className="flex justify-between font-bold text-lg border-t pt-2"><span>Total</span><span>{formatPrice(total)}</span></div>
                </div>

                <div className="flex gap-2">
                  <Input placeholder="Coupon code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
                  <Button type="button" variant="outline" onClick={handleApplyCoupon}>Apply</Button>
                </div>
                {couponMessage && <p className="text-xs text-muted-foreground">{couponMessage}</p>}

                <Button type="submit" className="w-full bg-agro-600 hover:bg-agro-700" size="lg" disabled={loading}>
                  {loading ? 'Processing...' : 'Place Order (Cash on Delivery)'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
