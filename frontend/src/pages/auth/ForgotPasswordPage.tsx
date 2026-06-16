import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Leaf } from 'lucide-react'
import { authApi } from '@/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await authApi.forgotPassword(email)
    setSent(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-agro-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2"><Leaf className="h-10 w-10 text-agro-600" /></div>
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>Enter your email to receive a reset link</CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">If an account exists with that email, a reset link has been sent.</p>
              <Button asChild variant="outline"><Link to="/login">Back to Login</Link></Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
              <Button type="submit" className="w-full">Send Reset Link</Button>
              <p className="text-center text-sm"><Link to="/login" className="text-agro-600 hover:underline">Back to Login</Link></p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
