import { useState } from 'react'
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { SectionHeader } from '@/components/ui/section-header'

const contactInfo = [
  { icon: MapPin, title: 'Visit Us', text: '123 Farm Road, Indore, Madhya Pradesh 452001', sub: 'India' },
  { icon: Phone, title: 'Call Us', text: '+91 8463881716', sub: 'Mon-Sat, 9AM-6PM' },
  { icon: Mail, title: 'Email Us', text: 'info@agrosolution.com', sub: 'We reply within 24 hours' },
  { icon: Clock, title: 'Working Hours', text: 'Monday - Saturday', sub: '9:00 AM - 6:00 PM IST' },
]

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div>
      <section className="relative py-20 md:py-28 bg-agro-950 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200"
            alt="Farm landscape"
            className="h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-agro-950/80 to-agro-900/90" />
        </div>
        <div className="container mx-auto px-4 relative text-center">
          <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-wider uppercase bg-agro-800 text-agro-300 rounded-full">
            Get in Touch
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">We&apos;d Love to Hear From You</h1>
          <p className="text-agro-300 text-lg max-w-xl mx-auto">
            Have questions about our products or need farming advice? Our team is here to help.
          </p>
        </div>
      </section>

      <section className="section-padding -mt-8 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-4">
              {contactInfo.map((item) => (
                <div key={item.title} className="card-premium p-5 flex gap-4 hover:shadow-card-hover transition-shadow">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-agro-100 to-agro-50 h-fit">
                    <item.icon className="h-5 w-5 text-agro-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-agro-900 mb-0.5">{item.title}</h3>
                    <p className="text-sm font-medium">{item.text}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.sub}</p>
                  </div>
                </div>
              ))}

              <div className="card-premium p-5 bg-gradient-to-br from-agro-600 to-agro-700 text-white border-0">
                <MessageCircle className="h-8 w-8 mb-3 opacity-80" />
                <h3 className="font-semibold text-lg mb-1">Need Quick Help?</h3>
                <p className="text-agro-100 text-sm mb-3">Chat with our agriculture experts for product recommendations.</p>
                <p className="text-sm font-medium">+91 8463881716</p>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="card-premium p-8 md:p-10">
                <h2 className="font-display text-2xl font-bold text-agro-900 mb-2">Send Us a Message</h2>
                <p className="text-muted-foreground mb-8">Fill out the form and we&apos;ll get back to you within 24 hours.</p>

                {submitted ? (
                  <div className="text-center py-16">
                    <div className="inline-flex p-4 rounded-full bg-agro-100 mb-4">
                      <Send className="h-8 w-8 text-agro-600" />
                    </div>
                    <p className="font-display text-xl font-bold text-agro-900 mb-2">Message Sent!</p>
                    <p className="text-muted-foreground">Thank you for reaching out. We&apos;ll respond shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                      <div><Label>Full Name</Label><Input required placeholder="Your name" className="rounded-xl" /></div>
                      <div><Label>Email Address</Label><Input type="email" required placeholder="you@email.com" className="rounded-xl" /></div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-5">
                      <div><Label>Phone Number</Label><Input placeholder="+91 98765 43210" className="rounded-xl" /></div>
                      <div><Label>Subject</Label><Input required placeholder="How can we help?" className="rounded-xl" /></div>
                    </div>
                    <div><Label>Message</Label><Textarea rows={5} required placeholder="Tell us about your farming needs..." className="rounded-xl" /></div>
                    <Button type="submit" size="lg" className="rounded-full px-8 btn-primary-glow">
                      Send Message <Send className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="container mx-auto px-4">
          <SectionHeader
            badge="Location"
            title="Find Us on the Map"
            subtitle="Visit our store in Indore, Madhya Pradesh"
          />
          <div className="card-premium overflow-hidden rounded-3xl h-[400px]">
            <iframe
              title="Patidar Agro Solution Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117716.45774725374!2d75.8069082!3d22.7195687!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fd4f3c4e5b8d%3A0x4b8f8c8c8c8c8c8c!2sIndore%2C%20Madhya%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
