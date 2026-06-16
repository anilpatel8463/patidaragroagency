import { useQuery } from '@tanstack/react-query'
import { Heart } from 'lucide-react'
import { userApi } from '@/api'
import { ProductCard } from '@/components/product/ProductCard'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Link } from 'react-router-dom'

export function WishlistPage() {
  const { data: products, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => userApi.getWishlist().then((r) => r.data.data),
  })

  if (isLoading) return <Spinner className="py-20" />

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
      {products && products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      ) : (
        <div className="text-center py-20">
          <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Your wishlist is empty</h2>
          <p className="text-muted-foreground mb-6">Save products you love for later</p>
          <Button asChild><Link to="/products">Browse Products</Link></Button>
        </div>
      )}
    </div>
  )
}
