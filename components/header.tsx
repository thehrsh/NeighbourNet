'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Home, Package, PlusCircle, Calendar, MessageSquare, Menu, X, Shield, User } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'My Bookings', href: '/bookings', icon: Calendar },
  { name: 'List Item', href: '/list-item', icon: PlusCircle },
  { name: 'Requests', href: '/requests', icon: MessageSquare },
]

export function Header() {
  const pathname = usePathname()
  const { user } = useAuth()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Package className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-lg text-foreground">NeighbourNet</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-1">
              {navigation.map(item => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground flex items-center gap-1">
                {user?.name}
                <Shield className="h-4 w-4 text-primary" />
              </p>
              <p className="text-xs text-muted-foreground">{user?.apartmentName}, {user?.block}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => router.push('/profile')}>
              <User className="h-5 w-5" />
            </Button>
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-secondary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <div className="px-4 py-4 space-y-2">
            {navigation.map(item => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
            <div className="pt-4 border-t border-border">
              <Button variant="ghost" className="w-full justify-start gap-3 mb-2" onClick={() => {
                router.push('/profile')
                setMobileMenuOpen(false)
              }}>
                <User className="h-5 w-5" />
                View Profile
              </Button>
              <div className="px-3 py-2">
                <p className="text-sm font-medium text-foreground flex items-center gap-1">
                  {user?.name}
                  <Shield className="h-4 w-4 text-primary" />
                </p>
                <p className="text-xs text-muted-foreground">{user?.apartmentName}, {user?.block}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
