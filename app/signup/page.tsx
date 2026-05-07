'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Package, Shield, CheckCircle2, Loader2 } from 'lucide-react'

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    apartmentName: '',
    block: '',
    flatNumber: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { signup, user } = useAuth()
  const router = useRouter()

  // Redirect if already logged in
  if (user) {
    router.push('/dashboard')
    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (!formData.name || !formData.email || !formData.password || !formData.apartmentName || !formData.block || !formData.flatNumber) {
      setError('Please fill in all fields.')
      return
    }

    setIsLoading(true)

    const success = await signup(
      formData.email,
      formData.password,
      formData.name,
      formData.apartmentName,
      formData.block,
      formData.flatNumber
    )

    if (success) {
      router.push('/dashboard')
    } else {
      setError('Failed to create account. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl space-y-8">
          {/* Logo & Title */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center">
                <Package className="h-9 w-9 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground">Join NeighbourNet</h1>
            <p className="mt-2 text-muted-foreground">
              Connect and share resources with your community
            </p>
          </div>

          {/* Signup Card */}
          <Card className="border-border shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl">Create your account</CardTitle>
              <CardDescription>
                Verify your community residence to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information Section */}
                <div className="space-y-1 pb-4 border-b border-border">
                  <h3 className="font-semibold text-sm text-foreground">Personal Information</h3>
                </div>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="name">Full Name</FieldLabel>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={4}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      minLength={4}
                    />
                  </Field>
                </FieldGroup>

                {/* Community Verification Section */}
                <div className="space-y-1 pb-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm text-foreground">Community Verification</h3>
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="apartmentName">Apartment / Hostel Name</FieldLabel>
                    <Input
                      id="apartmentName"
                      name="apartmentName"
                      type="text"
                      placeholder="e.g., Green Valley Apartments"
                      value={formData.apartmentName}
                      onChange={handleChange}
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="block">Block / Wing</FieldLabel>
                    <Input
                      id="block"
                      name="block"
                      type="text"
                      placeholder="e.g., A, B, North Wing"
                      value={formData.block}
                      onChange={handleChange}
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="flatNumber">Flat / Room Number</FieldLabel>
                    <Input
                      id="flatNumber"
                      name="flatNumber"
                      type="text"
                      placeholder="e.g., 101, 202"
                      value={formData.flatNumber}
                      onChange={handleChange}
                      required
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
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Benefits */}
          <div className="bg-secondary/50 border border-secondary rounded-lg p-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Verified Community Access</p>
                  <p className="text-xs text-muted-foreground">Only verified residents can connect and share</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Safe Resource Sharing</p>
                  <p className="text-xs text-muted-foreground">Deposit system ensures trust and responsibility</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Community Connection</p>
                  <p className="text-xs text-muted-foreground">Build stronger bonds with your neighbors</p>
                </div>
              </div>
            </div>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Already a member?{' '}
              <a href="/" className="text-primary font-medium hover:underline">
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-muted-foreground border-t border-border">
        <p>NeighbourNet - Building stronger communities together</p>
      </footer>
    </div>
  )
}
