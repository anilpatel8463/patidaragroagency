import { Link } from 'react-router-dom'
import { Leaf, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { newsletterApi } from '@/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTranslation } from '@/context/LanguageContext'

const quickLinks = [
  { to: '/products', label: 'Shop Products' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
  { to: '/track', label: 'Track Order' },
]

const categories = [
  { to: '/products?category=seeds', label: 'Seeds' },
  { to: '/products?category=fertilizers', label: 'Fertilizers' },
  { to: '/products?category=pesticides', label: 'Pesticides' },
  { to: '/products?category=tools-equipment', label: 'Tools' },
]

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Youtube, href: '#', label: 'YouTube' },
]

export function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const { t } = useTranslation()

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await newsletterApi.subscribe(email)
      setSubscribed(true)
      setEmail('')
    } catch {
      setSubscribed(true)
    }
  }

  return (
    <footer className="relative bg-agro-950 text-agro-100 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-agro-900/50 to-agro-950 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-agro-500/50 to-transparent" />

      <div className="relative border-b border-agro-800/50">
        <div className="container mx-auto px-4 py-12">
          <div className="glass-dark rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">
                {t('footer.newsletterTitle')}
              </h3>
              <p className="text-agro-300 text-sm md:text-base">
                {t('footer.newsletterSub')}
              </p>
            </div>
            {subscribed ? (
              <p className="text-agro-400 font-medium whitespace-nowrap">{t('footer.subscribed')}</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex w-full md:w-auto gap-2 min-w-[300px]">
                <Input
                  type="email"
                  placeholder={t('footer.emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-agro-900/80 border-agro-700 text-white placeholder:text-agro-500 rounded-full flex-1"
                />
                <Button type="submit" className="rounded-full btn-primary-glow shrink-0 px-6">
                  {t('footer.subscribe')} <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="relative container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="p-1.5 rounded-xl bg-agro-600">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="font-display font-bold text-white text-xl">Patidar Agro Solution</span>
            </div>
            <p className="text-agro-300 text-sm leading-relaxed mb-6 max-w-sm">
              Your trusted partner for premium agriculture products. Empowering farmers with quality seeds, fertilizers, tools, and expert guidance.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="p-2.5 rounded-full bg-agro-800/80 hover:bg-agro-600 text-agro-300 hover:text-white transition-all duration-300 hover:-translate-y-0.5"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-agro-300 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block">
                    {link.label === 'Shop Products' ? t('nav.products') : link.label === 'About Us' ? t('nav.about') : link.label === 'Contact' ? t('nav.contact') : t('nav.trackOrder')}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">{t('footer.categories')}</h3>
            <ul className="space-y-2.5">
              {categories.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-agro-300 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">{t('footer.contactUs')}</h3>
            <ul className="space-y-3 text-sm text-agro-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-agro-500" />
                123 Farm Road, Indore, MP 452001
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-agro-500" />
                +91 84638 81716
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-agro-500" />
                info@agrosolution.com
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-agro-800/80 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-agro-500">
          <p>&copy; {new Date().getFullYear()} {t('footer.rights')}</p>
          <div className="flex gap-6">
            <Link to="/about" className="hover:text-agro-300 transition-colors">Privacy Policy</Link>
            <Link to="/about" className="hover:text-agro-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
