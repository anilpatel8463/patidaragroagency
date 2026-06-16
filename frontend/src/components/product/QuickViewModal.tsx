import { Link } from 'react-router-dom'
import { X, Star, ShoppingCart } from 'lucide-react'
import type { Product } from '@/types'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import { useNavigate } from 'react-router-dom'

interface QuickViewModalProps {
  product: Product | null
  onClose: () => void
}

export function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const { isAuthenticated } = useAuthStore()
  const { addItem } = useCartStore()
  const navigate = useNavigate()

  if (!product) return null

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      onClose()
      navigate('/login')
      return
    }
    await addItem(product.id)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-agro-950/60 backdrop-blur-sm animate-fade-in" />
      <div
        className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-agro-50 shadow-md transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="grid md:grid-cols-2 gap-0">
          <div className="relative aspect-square md:aspect-auto md:min-h-[320px] bg-agro-50 rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none overflow-hidden">
            <img
              src={product.image_url || 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600'}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="p-6 md:p-8 flex flex-col">
            {product.category && (
              <Badge variant="secondary" className="w-fit mb-2">{product.category.name}</Badge>
            )}
            <h3 className="font-display text-2xl font-bold text-agro-900 mb-2">{product.name}</h3>
            {product.avg_rating && (
              <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`h-4 w-4 ${s <= Math.round(product.avg_rating!) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                ))}
                <span className="text-sm text-muted-foreground ml-1">({product.review_count} reviews)</span>
              </div>
            )}
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-2xl font-bold text-agro-700">{formatPrice(product.price)}</span>
              {product.compare_price && (
                <span className="text-sm text-muted-foreground line-through">{formatPrice(product.compare_price)}</span>
              )}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1 line-clamp-4">
              {product.description || 'Premium quality agriculture product for your farming needs.'}
            </p>
            <p className={`text-sm font-medium mb-4 ${product.stock > 0 ? 'text-agro-600' : 'text-red-500'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </p>
            <div className="flex gap-3">
              <Button className="flex-1 btn-primary-glow" disabled={product.stock === 0} onClick={handleAddToCart}>
                <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
              </Button>
              <Button variant="outline" asChild>
                <Link to={`/products/${product.id}`} onClick={onClose}>View Details</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
