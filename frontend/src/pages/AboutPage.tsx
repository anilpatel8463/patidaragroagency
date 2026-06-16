import { Link } from 'react-router-dom'
import { Target, Eye, Users, Leaf, ArrowRight, Award } from 'lucide-react'
import { SectionHeader } from '@/components/ui/section-header'
import { Button } from '@/components/ui/button'

const values = [
  { icon: Target, title: 'Our Mission', desc: 'To empower farmers with quality agriculture products and expert guidance for sustainable, profitable farming.' },
  { icon: Eye, title: 'Our Vision', desc: 'To become India\'s most trusted agriculture e-commerce platform, connecting farmers with the best products.' },
  { icon: Users, title: 'Our Team', desc: 'A dedicated team of agriculture experts, technologists, and customer support professionals.' },
  { icon: Award, title: 'Our Promise', desc: '100% genuine products, fair pricing, and exceptional service — every single order.' },
]

export function AboutPage() {
  return (
    <div>
      <section className="relative py-20 md:py-28 bg-agro-950 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200" alt="Farm" className="h-full w-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-b from-agro-950/90 to-agro-900/95" />
        </div>
        <div className="container mx-auto px-4 relative text-center">
          <div className="inline-flex p-3 rounded-2xl bg-agro-600 mb-6">
            <Leaf className="h-8 w-8 text-white" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">About Patidar Agro Solution</h1>
          <p className="text-agro-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Dedicated to providing premium agriculture products to farmers across India since our founding.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-wider uppercase bg-agro-100 text-agro-700 rounded-full">Our Story</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-agro-900 mb-6">Growing Together Since Day One</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Founded with a vision to revolutionize agriculture commerce in India, Patidar Agro Solution bridges the gap between quality agricultural product manufacturers and farmers.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                From high-yield seeds to organic fertilizers, from crop protection solutions to modern farming tools — we offer a comprehensive range of products backed by expert advice and reliable delivery.
              </p>
              <Button className="rounded-full btn-primary-glow" asChild>
                <Link to="/products">Explore Products <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800"
                alt="Wheat field"
                className="rounded-3xl shadow-card-hover w-full aspect-[4/3] object-cover"
              />
              <div className="absolute -bottom-6 -left-6 card-premium p-5 hidden md:block">
                <p className="font-display text-3xl font-bold text-agro-700">15+</p>
                <p className="text-sm text-muted-foreground">Years of Excellence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-agro-50/80">
        <div className="container mx-auto px-4">
          <SectionHeader badge="Our Values" title="What Drives Us" subtitle="The principles that guide everything we do" />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="card-premium-hover p-8 text-center">
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-agro-100 to-agro-50 text-agro-600 mb-4">
                  <v.icon className="h-7 w-7" />
                </div>
                <h3 className="font-semibold text-lg text-agro-900 mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
