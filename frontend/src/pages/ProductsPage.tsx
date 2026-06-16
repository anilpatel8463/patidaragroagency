import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { SlidersHorizontal, Grid3X3 } from 'lucide-react'
import { productApi, categoryApi } from '@/api'
import { ProductCard } from '@/components/product/ProductCard'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')

  const page = Number(searchParams.get('page') || 1)
  const category = searchParams.get('category') || ''
  const sort = searchParams.get('sort') || 'newest'

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.list().then((r) => r.data.data),
  })

  const { data, isLoading } = useQuery({
    queryKey: ['products', page, searchParams.get('search'), category, sort],
    queryFn: () =>
      productApi.list({
        page,
        limit: 12,
        search: searchParams.get('search') || undefined,
        category: category || undefined,
        sort,
      }).then((r) => r.data.data),
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams)
    if (search) params.set('search', search)
    else params.delete('search')
    params.set('page', '1')
    setSearchParams(params)
  }

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value) params.set(key, value)
    else params.delete(key)
    params.set('page', '1')
    setSearchParams(params)
  }

  const activeCategoryName = categories?.find((c) => c.slug === category)?.name

  return (
    <div>
      <section className="relative py-14 md:py-20 bg-gradient-to-br from-agro-800 via-agro-700 to-agro-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1200"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative">
          <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold tracking-wider uppercase bg-white/10 text-agro-200 rounded-full backdrop-blur-sm">
            Our Collection
          </span>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-2">
            {activeCategoryName || 'All Products'}
          </h1>
          <p className="text-agro-200">
            {data ? `${data.total} premium products` : 'Browse our agriculture collection'}
            {searchParams.get('search') && ` matching "${searchParams.get('search')}"`}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-72 shrink-0">
            <div className="card-premium p-6 sticky top-24 space-y-6">
              <div className="flex items-center gap-2 text-agro-900 font-semibold">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </div>

              <form onSubmit={handleSearch}>
                <Input
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="rounded-xl bg-agro-50/50 border-agro-100"
                />
              </form>

              <div>
                <h3 className="text-sm font-semibold text-agro-900 mb-3 uppercase tracking-wider">Categories</h3>
                <div className="space-y-1">
                  <button
                    onClick={() => updateParam('category', '')}
                    className={cn(
                      'block text-sm w-full text-left px-3 py-2 rounded-xl transition-colors',
                      !category ? 'bg-agro-600 text-white font-medium' : 'hover:bg-agro-50 text-muted-foreground'
                    )}
                  >
                    All Categories
                  </button>
                  {categories?.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => updateParam('category', cat.slug || '')}
                      className={cn(
                        'flex justify-between text-sm w-full text-left px-3 py-2 rounded-xl transition-colors',
                        category === cat.slug ? 'bg-agro-600 text-white font-medium' : 'hover:bg-agro-50 text-muted-foreground'
                      )}
                    >
                      <span>{cat.name}</span>
                      <span className={cn('text-xs', category === cat.slug ? 'text-agro-200' : 'text-muted-foreground')}>
                        {cat.product_count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-agro-900 mb-3 uppercase tracking-wider">Sort By</h3>
                <Select value={sort} onChange={(e) => updateParam('sort', e.target.value)} className="rounded-xl">
                  <option value="newest">Newest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name">Name A-Z</option>
                </Select>
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Grid3X3 className="h-4 w-4" />
                {data ? `${data.total} products found` : 'Loading...'}
              </p>
            </div>

            {isLoading ? (
              <Spinner className="py-20" />
            ) : data && data.items.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                  {data.items.map((p) => <ProductCard key={p.id} product={p} />)}
                </div>
                {data.pages > 1 && (
                  <div className="flex justify-center gap-3 mt-10">
                    <Button
                      variant="outline"
                      className="rounded-full"
                      disabled={page <= 1}
                      onClick={() => { const p = new URLSearchParams(searchParams); p.set('page', String(page - 1)); setSearchParams(p) }}
                    >
                      Previous
                    </Button>
                    <span className="flex items-center px-4 text-sm font-medium">
                      Page {page} of {data.pages}
                    </span>
                    <Button
                      variant="outline"
                      className="rounded-full"
                      disabled={page >= data.pages}
                      onClick={() => { const p = new URLSearchParams(searchParams); p.set('page', String(page + 1)); setSearchParams(p) }}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-24 card-premium">
                <p className="text-lg font-medium text-agro-900 mb-2">No products found</p>
                <p className="text-muted-foreground mb-6">Try adjusting your filters or search terms</p>
                <Button className="rounded-full btn-primary-glow" onClick={() => { setSearch(''); setSearchParams({}) }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
