import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { userApi, authApi } from '@/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function ProfilePage() {
  const { user, fetchUser, logout } = useAuthStore()
  const navigate = useNavigate()
  const [profile, setProfile] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    pincode: user?.pincode || '',
  })
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' })
  const [message, setMessage] = useState('')

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    await userApi.updateProfile(profile)
    await fetchUser()
    setMessage('Profile updated successfully')
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwords.new !== passwords.confirm) {
      setMessage('Passwords do not match')
      return
    }
    await authApi.changePassword({ current_password: passwords.current, new_password: passwords.new })
    setPasswords({ current: '', new: '', confirm: '' })
    setMessage('Password changed successfully')
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <Button 
          variant="outline" 
          className="text-rose-500 border-rose-200 hover:bg-rose-50 hover:text-rose-600"
          onClick={() => {
            logout()
            navigate('/')
          }}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
      {message && <div className="bg-agro-50 text-agro-700 p-3 rounded-md mb-4 text-sm">{message}</div>}

      <Card className="mb-6">
        <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div><Label>Email</Label><Input value={user?.email || ''} disabled /></div>
            <div><Label>Full Name</Label><Input value={profile.full_name} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} /></div>
            <div><Label>Phone</Label><Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} /></div>
            <div><Label>Address</Label><Input value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>City</Label><Input value={profile.city} onChange={(e) => setProfile({ ...profile, city: e.target.value })} /></div>
              <div><Label>State</Label><Input value={profile.state} onChange={(e) => setProfile({ ...profile, state: e.target.value })} /></div>
            </div>
            <div><Label>Pincode</Label><Input value={profile.pincode} onChange={(e) => setProfile({ ...profile, pincode: e.target.value })} /></div>
            <Button type="submit">Save Changes</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Change Password</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div><Label>Current Password</Label><Input type="password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} required /></div>
            <div><Label>New Password</Label><Input type="password" value={passwords.new} onChange={(e) => setPasswords({ ...passwords, new: e.target.value })} required /></div>
            <div><Label>Confirm New Password</Label><Input type="password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} required /></div>
            <Button type="submit">Change Password</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
