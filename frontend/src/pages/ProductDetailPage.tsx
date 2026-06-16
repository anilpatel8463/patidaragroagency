import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Star, ShoppingCart, Heart, Minus, Plus, Truck, Shield } from 'lucide-react'
import { productApi } from '@/api'
import { ProductCard } from '@/components/product/ProductCard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Spinner } from '@/components/ui/spinner'
import { Select } from '@/components/ui/select'
import { formatPrice } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import { reviewApi, userApi } from '@/api'

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [quantity, setQuantity] = useState(1)
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' })
  const { isAuthenticated } = useAuthStore()
  const { addItem } = useCartStore()
  const navigate = useNavigate()

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.get(id!).then((r) => r.data.data),
    enabled: !!id,
  })

  const { data: reviews, refetch: refetchReviews } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => productApi.reviews(id!).then((r) => r.data.data),
    enabled: !!id,
  })

  const { data: related } = useQuery({
    queryKey: ['related', id],
    queryFn: () => productApi.related(id!).then((r) => r.data.data),
    enabled: !!id,
  })

  const handleAddToCart = async () => {
    if (!isAuthenticated) { navigate('/login'); return }
    await addItem(id!, quantity)
  }

  const handleWishlist = async () => {
    if (!isAuthenticated) { navigate('/login'); return }
    await userApi.addToWishlist(id!)
  }

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault()
    await reviewApi.create({ product_id: id!, ...reviewForm })
    setReviewForm({ rating: 5, title: '', comment: '' })
    refetchReviews()
  }

  if (isLoading) return <Spinner className="py-20" />
  if (!product) return <div className="container mx-auto px-4 py-20 text-center">Product not found</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-16">
        <div className="rounded-lg overflow-hidden bg-agro-50 aspect-square">
          <img
            src={product.image_url || 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600'}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div>
          {product.category && <Badge variant="secondary" className="mb-2">{product.category.name}</Badge>}
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          {product.avg_rating && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">{[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={`h-4 w-4 ${s <= Math.round(product.avg_rating!) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
              ))}</div>
              <span className="text-sm text-muted-foreground">{product.avg_rating} ({product.review_count} reviews)</span>
            </div>
          )}
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-3xl font-bold text-agro-700">{formatPrice(product.price)}</span>
            {product.compare_price && (
              <span className="text-lg text-muted-foreground line-through">{formatPrice(product.compare_price)}</span>
            )}
          </div>
          <p className="text-muted-foreground mb-6 leading-relaxed">{product.description}</p>

          <div className="flex items-center gap-4 mb-6 text-sm">
            <span className={product.stock > 0 ? 'text-agro-600 font-medium' : 'text-red-600 font-medium'}>
              {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
            </span>
            {product.weight && <span className="text-muted-foreground">| {product.weight}</span>}
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border rounded-md">
              <button className="p-2 hover:bg-gray-100" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus className="h-4 w-4" /></button>
              <span className="px-4 font-medium">{quantity}</span>
              <button className="p-2 hover:bg-gray-100" onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}><Plus className="h-4 w-4" /></button>
            </div>
            <Button size="lg" className="flex-1" disabled={product.stock === 0} onClick={handleAddToCart}>
              <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
            </Button>
            <Button size="lg" variant="outline" onClick={handleWishlist}>
              <Heart className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground"><Truck className="h-4 w-4" /> Free delivery above ₹999</div>
            <div className="flex items-center gap-2 text-muted-foreground"><Shield className="h-4 w-4" /> 100% genuine products</div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        {reviews && reviews.length > 0 ? (
          <div className="space-y-4 mb-8">
            {reviews.map((r) => (
              <div key={r.id} className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">{[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`h-3.5 w-3.5 ${s <= r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                  ))}</div>
                  <span className="font-medium text-sm">{r.user_name}</span>
                </div>
                {r.title && <p className="font-medium text-sm mb-1">{r.title}</p>}
                <p className="text-sm text-muted-foreground">{r.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground mb-8">No reviews yet. Be the first to review!</p>
        )}

        {isAuthenticated && (
          <form onSubmit={handleReview} className="border rounded-lg p-6 space-y-4 max-w-lg">
            <h3 className="font-semibold">Write a Review</h3>
            <div>
              <Label>Rating</Label>
              <Select value={String(reviewForm.rating)} onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}>
                {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Stars</option>)}
              </Select>
            </div>
            <div><Label>Title</Label><Input value={reviewForm.title} onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })} /></div>
            <div><Label>Comment</Label><Textarea value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} /></div>
            <Button type="submit">Submit Review</Button>
          </form>
        )}
      </section>

      {/* Related */}
      {related && related.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  )
}
