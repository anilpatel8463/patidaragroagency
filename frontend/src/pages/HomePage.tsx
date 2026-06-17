import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowRight, Truck, Shield, Leaf, Award, Users, Package,
  TrendingUp, CheckCircle2, Star, Sprout, Droplets, Quote,
} from 'lucide-react'
import { productApi, categoryApi } from '@/api'
import { ProductCard } from '@/components/product/ProductCard'
import { SectionHeader } from '@/components/ui/section-header'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/context/LanguageContext'

const HERO_IMG = 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&q=80'

const whyChooseUs = [
  { icon: Shield, title: 'Quality Assured', desc: '100% genuine products sourced from certified manufacturers with quality guarantees.', color: 'from-agro-500 to-agro-600' },
  { icon: Truck, title: 'Fast Delivery', desc: 'Swift doorstep delivery across India with real-time order tracking.', color: 'from-emerald-500 to-teal-600' },
  { icon: Award, title: 'Expert Guidance', desc: 'Agriculture specialists available to help you choose the right products.', color: 'from-lime-500 to-agro-600' },
  { icon: CheckCircle2, title: 'Customer Satisfaction', desc: '10,000+ happy farmers trust us for their agricultural needs.', color: 'from-green-600 to-agro-700' },
]

const testimonials = [
  { name: 'Rajesh Patel', role: 'Wheat Farmer, Gujarat', text: 'Best quality seeds and fertilizers. My crop yield increased by 30% in just one season!', avatar: 'RP', rating: 5 },
  { name: 'Priya Sharma', role: 'Organic Farmer, MP', text: 'Great organic products at reasonable prices. The delivery is always on time and packaging is excellent.', avatar: 'PS', rating: 5 },
  { name: 'Amit Kumar', role: 'Agriculturist, Rajasthan', text: 'Excellent customer service and genuine products. Patidar Agro is now my go-to for all farming supplies.', avatar: 'AK', rating: 5 },
]

const blogPosts = [
  {
    title: '10 Essential Tips for Monsoon Crop Planning',
    excerpt: 'Prepare your fields for maximum yield with these expert monsoon farming strategies.',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600',
    date: 'Mar 15, 2026',
    tag: 'Farming Tips',
  },
  {
    title: 'Organic vs Chemical Fertilizers: A Complete Guide',
    excerpt: 'Understand the benefits of each approach and choose what works best for your soil.',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600',
    date: 'Mar 10, 2026',
    tag: 'Organic',
  },
  {
    title: 'How to Choose the Right Seeds for Your Region',
    excerpt: 'Climate-specific seed selection can dramatically improve your harvest quality.',
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600',
    date: 'Mar 5, 2026',
    tag: 'Seeds',
  },
]

const categoryIcons: Record<string, typeof Sprout> = {
  seeds: Sprout,
  fertilizers: Droplets,
  pesticides: Leaf,
  'tools-equipment': Package,
  irrigation: Droplets,
  organic: Leaf,
}

export function HomePage() {
  const { t } = useTranslation()
  const { data: bestSellers } = useQuery({
    queryKey: ['best-sellers'],
    queryFn: () => productApi.bestSellers().then((r) => r.data.data),
  })

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.list().then((r) => r.data.data),
  })

  const stats = [
    { icon: Users, value: '10,000+', label: 'Happy Farmers' },
    { icon: Package, value: categories ? `${categories.reduce((a, c) => a + (c.product_count || 0), 0)}+` : '500+', label: 'Products Available' },
    { icon: TrendingUp, value: '15+', label: 'Years Experience' },
    { icon: Award, value: '98%', label: 'Satisfaction Rate' },
  ]

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="Agriculture farmland" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-hero-pattern" />
          <div className="absolute inset-0 bg-gradient-to-t from-agro-950/80 via-transparent to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10 py-20">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark text-agro-200 text-sm font-medium mb-6 animate-fade-up opacity-0-start">
              <Leaf className="h-4 w-4 text-agro-400" />
              India&apos;s Trusted Agriculture Marketplace
            </span>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6 animate-fade-up opacity-0-start animate-delay-100">
              {t('home.heroTitle')}
            </h1>
            <p className="text-lg md:text-xl text-agro-100/90 mb-8 max-w-xl leading-relaxed animate-fade-up opacity-0-start animate-delay-200">
              {t('home.heroSub')}
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-up opacity-0-start animate-delay-300">
              <Button size="lg" className="rounded-full px-8 h-12 text-base btn-primary-glow" asChild>
                <Link to="/products">{t('home.shopNow')} <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-base border-white/30 text-white hover:bg-white/10 bg-white/5 backdrop-blur-sm" asChild>
                <Link to="/about">Our Story</Link>
              </Button>
            </div>

            <div className="flex flex-wrap gap-6 mt-12 animate-fade-up opacity-0-start animate-delay-400">
              {['Genuine Products', 'Free Delivery ₹999+', 'Expert Support'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-agro-200 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-agro-400" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="hidden lg:block absolute bottom-12 right-8 animate-fade-up opacity-0-start animate-delay-500">
          <div className="glass rounded-2xl p-5 shadow-card-hover max-w-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-agro-100">
                <TrendingUp className="h-5 w-5 text-agro-600" />
              </div>
              <div>
                <p className="font-bold text-agro-900 text-lg">30% Yield Boost</p>
                <p className="text-xs text-muted-foreground">Average farmer improvement</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative -mt-8 z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="card-premium p-6 text-center animate-fade-up opacity-0-start"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="inline-flex p-3 rounded-2xl bg-agro-50 text-agro-600 mb-3">
                  <stat.icon className="h-6 w-6" />
                </div>
                <p className="font-display text-2xl md:text-3xl font-bold text-agro-900">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories && categories.length > 0 && (
        <section className="section-padding bg-gradient-to-b from-white to-agro-50/50">
          <div className="container mx-auto px-4">
            <SectionHeader
              badge="Categories"
              title="Shop by Category"
              subtitle="Explore our wide range of premium agriculture products organized for your convenience"
            />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
              {categories.map((cat) => {
                const Icon = categoryIcons[cat.slug || ''] || Sprout
                return (
                  <Link
                    key={cat.id}
                    to={`/products?category=${cat.slug}`}
                    className="group card-premium-hover p-5 text-center"
                  >
                    <div className="relative mx-auto w-20 h-20 mb-4 rounded-2xl overflow-hidden bg-gradient-to-br from-agro-100 to-agro-50 group-hover:from-agro-200 group-hover:to-agro-100 transition-all duration-300">
                      {cat.image_url ? (
                        <img src={cat.image_url} alt={cat.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <Icon className="h-8 w-8 text-agro-600 group-hover:scale-110 transition-transform" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold text-sm text-agro-900 group-hover:text-agro-600 transition-colors">{cat.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{cat.product_count} products</p>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}


      {/* Why Choose Us */}
      <section className="section-padding bg-agro-950 relative overflow-hidden">
        <div className="container mx-auto px-4 relative">
          <SectionHeader
            badge="Why Choose Us"
            title="Trusted by Farmers Nationwide"
            subtitle="We're committed to providing the highest quality agriculture products with exceptional service"
            className="[&_h2]:text-white [&_p]:text-agro-300 [&_span]:bg-agro-800 [&_span]:text-agro-300"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((item) => (
              <div
                key={item.title}
                className="glass-dark rounded-2xl p-6 hover:bg-agro-900/40 transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${item.color} mb-4 shadow-glow group-hover:scale-110 transition-transform`}>
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-white text-lg mb-2">{item.title}</h3>
                <p className="text-agro-300 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      {bestSellers && bestSellers.length > 0 && (
        <section className="section-padding bg-gradient-to-b from-agro-50/50 to-white">
          <div className="container mx-auto px-4">
            <SectionHeader
              badge="Best Sellers"
              title="Farmer Favorites"
              subtitle="Our most popular products loved by the farming community"
            />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {bestSellers.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="section-padding">
        <div className="container mx-auto px-4">
          <SectionHeader
            badge="Testimonials"
            title="Success Stories from Our Farmers"
            subtitle="Real experiences from farmers who transformed their harvest with our products"
          />
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="card-premium-hover p-8 relative">
                <Quote className="absolute top-6 right-6 h-10 w-10 text-agro-100" />
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6 relative z-10">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-agro-400 to-agro-600 flex items-center justify-center text-white font-bold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-agro-900">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog */}
      <section className="section-padding bg-agro-50/80">
        <div className="container mx-auto px-4">
          <SectionHeader
            badge="Blog & News"
            title="Agricultural Insights"
            subtitle="Expert tips, guides, and updates to help you farm smarter"
          />
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {blogPosts.map((post) => (
              <article key={post.title} className="card-premium-hover overflow-hidden group">
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-semibold text-agro-600 bg-agro-100 px-2.5 py-1 rounded-full">{post.tag}</span>
                    <span className="text-xs text-muted-foreground">{post.date}</span>
                  </div>
                  <h3 className="font-semibold text-lg text-agro-900 mb-2 group-hover:text-agro-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{post.excerpt}</p>
                  <Link to="/about" className="text-sm font-semibold text-agro-600 hover:text-agro-700 inline-flex items-center gap-1">
                    Read More <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container mx-auto px-4">
          <div className="relative rounded-3xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200"
              alt="Farm field"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-agro-900/95 to-agro-800/80" />
            <div className="relative px-8 py-16 md:py-20 md:px-16 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
                  Ready to Transform Your Farm?
                </h2>
                <p className="text-agro-200 text-lg max-w-lg">
                  Join thousands of farmers who trust Patidar Agro Solution for premium products and expert support.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                <Button size="lg" className="rounded-full px-8 btn-primary-glow" asChild>
                  <Link to="/products">Start Shopping</Link>
                </Button>
                <Button size="lg" variant="outline" className="rounded-full px-8 border-white/30 text-white hover:bg-white/10" asChild>
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
