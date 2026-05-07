'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Shield, Users, Lock, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login, user } = useAuth()
  const router = useRouter()

  // Redirect if already logged in
  if (user) {
    router.push('/dashboard')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const success = await login(email, password)
    
    if (success) {
      router.push('/dashboard')
    } else {
      setError('Invalid credentials. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Community Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/5 to-primary/10 flex-col items-center justify-center px-8 py-12">
        <div className="max-w-md text-center space-y-8">
          {/* Illustration */}
          <div className="flex justify-center">
            <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/30 flex items-center justify-center">
              <div className="text-6xl">🏘️</div>
            </div>
          </div>

          {/* Brand Name */}
          <h1 className="text-3xl font-bold text-foreground">NeighbourNet</h1>

          {/* Headline */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-primary text-balance">
              Borrow. Share. Connect.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Join your trusted community network and access shared resources with verified neighbors you know and trust.
            </p>
          </div>

          {/* Community Highlights */}
          <div className="space-y-3 pt-8 border-t border-border/40">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">
                <span className="font-semibold">Verified Community Access</span>
                <span className="text-muted-foreground block text-xs mt-1">Only verified residents can join</span>
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Lock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">
                <span className="font-semibold">Secure Deposit-Based Sharing</span>
                <span className="text-muted-foreground block text-xs mt-1">Trust through accountability</span>
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">
                <span className="font-semibold">Hyperlocal Resource Network</span>
                <span className="text-muted-foreground block text-xs mt-1">Share with your neighbors</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm space-y-6">
          {/* Logo */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground">NeighbourNet</h1>
            <p className="text-primary font-semibold text-base mt-3">Borrow. Share. Connect.</p>
          </div>

          {/* Login Card */}
          <Card className="border border-border shadow-sm">
            <CardHeader className="space-y-1 pb-5">
              <CardTitle className="text-2xl">Welcome back</CardTitle>
              <CardDescription>
                Sign in to your community account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      minLength={4}
                    />
                  </Field>
                </FieldGroup>

                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>

              {/* Signup Button */}
              <div className="pt-4 border-t border-border">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push('/signup')}
                >
                  New to NeighbourNet? Create your account
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Mobile Trust Indicators */}
          <div className="lg:hidden space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-primary" />
              <span>Verified Community Access</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-4 w-4 text-primary" />
              <span>Secure Deposit-Based Sharing</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4 text-primary" />
              <span>Hyperlocal Resource Network</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
