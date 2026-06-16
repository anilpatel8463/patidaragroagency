import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingCart, User, Search, Menu, X, Leaf, Heart, ChevronDown, Phone, LogOut } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { categoryApi } from '@/api'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { isAuthenticated, user, logout } = useAuthStore()
  const { itemCount } = useCartStore()
  const navigate = useNavigate()
  const location = useLocation()

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.list().then((r) => r.data.data),
  })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setCategoriesOpen(false)
  }, [location.pathname])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
    }
  }

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/about', label: 'About Us' },
    { to: '/contact', label: 'Contact' },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <>
      <div className="hidden md:block bg-agro-900 text-agro-100 text-xs">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <p className="flex items-center gap-2">
            <Phone className="h-3.5 w-3.5" />
            +91 98765 43210 &nbsp;|&nbsp; Free delivery on orders above ₹999
          </p>
          <p>Trusted by 10,000+ farmers across India</p>
        </div>
      </div>

      <header
        className={cn(
          'sticky top-0 z-50 transition-all duration-300',
          scrolled
            ? 'glass shadow-soft border-b border-agro-100/50'
            : 'bg-white/95 backdrop-blur-md border-b border-transparent'
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 lg:h-[72px] items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="p-1.5 rounded-xl bg-gradient-to-br from-agro-500 to-agro-700 shadow-glow group-hover:scale-105 transition-transform">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="font-display font-bold text-agro-900 text-lg leading-tight block">Patidar Agro</span>
                <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-agro-600">Solution</span>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive(link.to)
                      ? 'bg-agro-100 text-agro-800'
                      : 'text-muted-foreground hover:text-agro-700 hover:bg-agro-50'
                  )}
                >
                  {link.label}
                </Link>
              ))}

              <div
                className="relative"
                onMouseEnter={() => setCategoriesOpen(true)}
                onMouseLeave={() => setCategoriesOpen(false)}
              >
                <button
                  className={cn(
                    'flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    categoriesOpen ? 'bg-agro-100 text-agro-800' : 'text-muted-foreground hover:text-agro-700 hover:bg-agro-50'
                  )}
                >
                  Categories <ChevronDown className={cn('h-4 w-4 transition-transform', categoriesOpen && 'rotate-180')} />
                </button>
                {categoriesOpen && categories && categories.length > 0 && (
                  <div className="absolute top-full left-0 pt-2 w-56 animate-fade-in">
                    <div className="glass rounded-2xl p-2 shadow-card-hover">
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          to={`/products?category=${cat.slug}`}
                          className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm hover:bg-agro-50 transition-colors"
                        >
                          <span className="font-medium text-agro-900">{cat.name}</span>
                          <span className="text-xs text-muted-foreground">{cat.product_count}</span>
                        </Link>
                      ))}
                      <Link
                        to="/products"
                        className="block px-3 py-2.5 mt-1 text-sm font-semibold text-agro-600 hover:bg-agro-50 rounded-xl"
                      >
                        View All Products →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link
                to="/track"
                className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-agro-700 hover:bg-agro-50 transition-all"
              >
                Track Order
              </Link>
            </nav>

            <form onSubmit={handleSearch} className="hidden xl:flex flex-1 max-w-xs mx-2">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search seeds, fertilizers..."
                  className="pl-10 rounded-full bg-agro-50/80 border-agro-100 focus:bg-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>

            <div className="flex items-center gap-1">
              {isAuthenticated && (
                <>
                  <Link
                    to="/wishlist"
                    className="hidden sm:flex p-2.5 rounded-full hover:bg-agro-50 text-muted-foreground hover:text-agro-700 transition-colors"
                  >
                    <Heart className="h-5 w-5" />
                  </Link>
                  <Link
                    to="/cart"
                    className="relative p-2.5 rounded-full hover:bg-agro-50 text-muted-foreground hover:text-agro-700 transition-colors"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {itemCount > 0 && (
                      <span className="absolute top-0.5 right-0.5 h-5 w-5 rounded-full bg-agro-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                        {itemCount}
                      </span>
                    )}
                  </Link>
                </>
              )}

              {isAuthenticated ? (
                <div className="hidden sm:flex items-center gap-1 ml-1">
                  {user?.role === 'admin' && (
                    <Button variant="outline" size="sm" className="rounded-full border-agro-200" asChild>
                      <Link to="/admin">Admin</Link>
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" className="rounded-full" asChild>
                    <Link to="/dashboard">
                      <User className="h-4 w-4 mr-1.5" />
                      {user?.full_name?.split(' ')[0]}
                    </Link>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full text-rose-500 hover:text-rose-600 hover:bg-rose-50" 
                    onClick={() => {
                      logout()
                      navigate('/')
                    }}
                    title="Sign Out"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2 ml-1">
                  <Button variant="ghost" size="sm" className="rounded-full" asChild>
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button size="sm" className="rounded-full btn-primary-glow" asChild>
                    <Link to="/register">Get Started</Link>
                  </Button>
                </div>
              )}

              <button
                className="lg:hidden p-2.5 rounded-full hover:bg-agro-50"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {mobileOpen && (
            <nav className="lg:hidden py-4 border-t border-agro-100 space-y-1 animate-fade-in">
              <form onSubmit={handleSearch} className="mb-4 px-1">
                <Input placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="rounded-full" />
              </form>
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    'block px-3 py-2.5 rounded-xl text-sm font-medium',
                    isActive(link.to) ? 'bg-agro-100 text-agro-800' : 'hover:bg-agro-50'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link to="/track" className="block px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-agro-50">Track Order</Link>
              {categories && categories.length > 0 && (
                <div className="pt-2 border-t border-agro-100 mt-2">
                  <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Categories</p>
                  {categories.map((cat) => (
                    <Link key={cat.id} to={`/products?category=${cat.slug}`} className="block px-3 py-2 text-sm hover:bg-agro-50 rounded-xl">
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
              {isAuthenticated ? (
                <div className="pt-2 border-t border-agro-100 mt-2">
                  <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-agro-50">
                    <User className="h-4 w-4" />
                    <span>My Dashboard</span>
                  </Link>
                  <button 
                    onClick={() => {
                      logout()
                      navigate('/')
                    }}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-50 transition-all"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 pt-4 px-1">
                  <Button variant="outline" className="flex-1" asChild><Link to="/login">Login</Link></Button>
                  <Button className="flex-1 btn-primary-glow" asChild><Link to="/register">Register</Link></Button>
                </div>
              )}
            </nav>
          )}
        </div>
      </header>
    </>
  )
}
