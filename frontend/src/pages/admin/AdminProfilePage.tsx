import { useAuthStore } from '@/store/authStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Mail, Shield, Camera } from 'lucide-react'

export function AdminProfilePage() {
  const { user } = useAuthStore()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Admin Profile</h2>
        <p className="text-muted-foreground">Manage your personal account settings and security preferences.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <Card className="md:col-span-1 border-none shadow-sm h-fit">
          <CardContent className="pt-8">
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className="h-32 w-32 rounded-3xl bg-gradient-to-tr from-primary to-emerald-400 flex items-center justify-center text-white font-bold text-4xl shadow-xl">
                  {user?.full_name?.charAt(0)}
                </div>
                <button className="absolute -bottom-2 -right-2 p-2 bg-white rounded-xl shadow-lg border border-gray-100 text-gray-500 hover:text-primary transition-colors">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <h3 className="mt-4 font-bold text-xl">{user?.full_name}</h3>
              <p className="text-sm text-muted-foreground">Super Administrator</p>
              <div className="mt-6 w-full space-y-3">
                 <div className="p-3 bg-gray-50 rounded-xl flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm truncate">{user?.email}</span>
                 </div>
                 <div className="p-3 bg-gray-50 rounded-xl flex items-center gap-3">
                    <Shield className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm font-semibold text-emerald-700 uppercase tracking-tighter">Verified Official</span>
                 </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your display name and email address.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input defaultValue={user?.full_name} />
              </div>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input defaultValue={user?.email} disabled />
                <p className="text-[10px] text-muted-foreground">Email change requires administrative approval.</p>
              </div>
              <Button>Save Profile</Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Secure your account with a strong password.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <Input type="password" />
                </div>
                <div className="space-y-2">
                  <Label>Confirm Password</Label>
                  <Input type="password" />
                </div>
              </div>
              <Button variant="secondary">Update Password</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
