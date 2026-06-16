import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Settings, Shield, Globe, Bell, CreditCard } from 'lucide-react'

export function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">System Settings</h2>
        <p className="text-muted-foreground">Configure global preferences for your agro commerce platform.</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="space-y-1">
          {[
            { label: 'General', icon: Settings, active: true },
            { label: 'Security', icon: Shield },
            { label: 'Localization', icon: Globe },
            { label: 'Notifications', icon: Bell },
            { label: 'Payments', icon: CreditCard },
          ].map((tab) => (
            <button key={tab.label} className={`flex items-center gap-3 px-4 py-2.5 w-full text-left rounded-xl text-sm font-medium transition-colors ${tab.active ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="lg:col-span-3 space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>General Configuration</CardTitle>
              <CardDescription>Basic store identity and contact information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Store Name</Label>
                  <Input defaultValue="Patidar Agro Solution" />
                </div>
                <div className="space-y-2">
                  <Label>Support Email</Label>
                  <Input defaultValue="support@agrosolution.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Tax ID / GST Number</Label>
                <Input defaultValue="GSTIN27AABCP1234F1Z5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm pb-2">
             <div className="p-6 flex items-center justify-between border-t mt-4">
                <p className="text-sm text-muted-foreground italic font-medium">Changes here will be applied globally across the storefront.</p>
                <Button>Save Settings</Button>
             </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
