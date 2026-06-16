import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Star, Eye } from 'lucide-react'
import type { Product } from '@/types'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { QuickViewModal } from './QuickViewModal'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import { useNavigate } from 'react-router-dom'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [quickView, setQuickView] = useState(false)
  const { isAuthenticated } = useAuthStore()
  const { addItem } = useCartStore()
  const navigate = useNavigate()

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    await addItem(product.id)
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setQuickView(true)
  }

  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0

  return (
    <>
      <Link to={`/products/${product.id}`} className="group block">
        <article className="card-premium-hover overflow-hidden h-full flex flex-col">
          <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-agro-50 to-earth-50">
            <img
              src={product.image_url || 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400'}
              alt={product.name}
              className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-agro-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {discount > 0 && (
              <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-500 border-0 shadow-md">
                {discount}% OFF
              </Badge>
            )}
            {product.stock === 0 && (
              <Badge className="absolute top-3 right-3" variant="secondary">Sold Out</Badge>
            )}

            <div className="absolute inset-x-0 bottom-0 p-3 flex gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <Button
                size="sm"
                variant="secondary"
                className="flex-1 glass text-agro-900 hover:bg-white h-9"
                onClick={handleQuickView}
              >
                <Eye className="h-3.5 w-3.5 mr-1" /> Quick View
              </Button>
              <Button
                size="sm"
                className="flex-1 btn-primary-glow h-9"
                disabled={product.stock === 0}
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-3.5 w-3.5 mr-1" /> Add
              </Button>
            </div>
          </div>

          <div className="p-4 md:p-5 flex flex-col flex-1">
            {product.category && (
              <p className="text-xs font-semibold text-agro-600 uppercase tracking-wider mb-1.5">
                {product.category.name}
              </p>
            )}
            <h3 className="font-semibold text-sm md:text-base line-clamp-2 mb-2 group-hover:text-agro-700 transition-colors leading-snug">
              {product.name}
            </h3>
            {product.avg_rating ? (
              <div className="flex items-center gap-1 mb-3">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`h-3.5 w-3.5 ${s <= Math.round(product.avg_rating!) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">({product.review_count})</span>
              </div>
            ) : (
              <div className="mb-3 h-3.5" />
            )}
            <div className="mt-auto flex items-center justify-between">
              <div>
                <span className="font-bold text-lg text-agro-800">{formatPrice(product.price)}</span>
                {product.compare_price && (
                  <span className="text-xs text-muted-foreground line-through ml-2">
                    {formatPrice(product.compare_price)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </article>
      </Link>

      {quickView && <QuickViewModal product={product} onClose={() => setQuickView(false)} />}
    </>
  )
}
