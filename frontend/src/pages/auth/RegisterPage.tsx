import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Leaf } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function RegisterPage() {
  const [form, setForm] = useState({ full_name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const { register, isLoading } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) {
      setError('Passwords do not match')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    try {
      await register(form.full_name, form.email, form.password)
      navigate('/dashboard')
    } catch {
      setError('Registration failed. Email may already be in use.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-agro-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2"><Leaf className="h-10 w-10 text-agro-600" /></div>
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>Join Agro Solution today</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}
            <div><Label>Full Name</Label><Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required /></div>
            <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
            <div><Label>Password</Label><Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></div>
            <div><Label>Confirm Password</Label><Input type="password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} required /></div>
            <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? 'Creating...' : 'Create Account'}</Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Already have an account? <Link to="/login" className="text-agro-600 hover:underline font-medium">Sign In</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
