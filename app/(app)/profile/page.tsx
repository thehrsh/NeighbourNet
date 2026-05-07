'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { getItemsByOwner, getBookings, getRequests, type Item } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LogoutDialog } from '@/components/logout-dialog'
import { Shield, Mail, Home, Building2, DoorOpen, Package, Calendar, MessageSquare, LogOut, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [listedItems, setListedItems] = useState<Item[]>([])
  const [bookingsCount, setBookingsCount] = useState(0)
  const [requestsCount, setRequestsCount] = useState(0)

  useEffect(() => {
    if (!user) {
      router.push('/')
      return
    }

    const items = getItemsByOwner(user.name)
    const bookings = getBookings()
    const requests = getRequests()

    setListedItems(items)
    setBookingsCount(bookings.length)
    setRequestsCount(requests.length)
  }, [user, router])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await new Promise(resolve => setTimeout(resolve, 600))
    logout()
    router.push('/')
  }

  if (!user) return null

  const listedCount = listedItems.length
  const activeBookingsCount = getBookings().filter(b => b.status === 'Confirmed' || b.status === 'Pending').length

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="border border-border">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between gap-6 flex-col sm:flex-row">
            <div className="flex-1 space-y-6">
              {/* Verification Badge */}
              <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-lg w-fit">
                <Shield className="h-5 w-5" />
                <span className="font-semibold text-sm">Verified Community Member</span>
              </div>

              {/* User Info */}
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Full Name</p>
                  <p className="text-xl font-bold text-foreground mt-1">{user.name}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <Mail className="h-4 w-4" />
                      <span className="text-xs uppercase font-semibold">Email</span>
                    </div>
                    <p className="text-sm text-foreground">{user.email}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <Building2 className="h-4 w-4" />
                      <span className="text-xs uppercase font-semibold">Apartment</span>
                    </div>
                    <p className="text-sm text-foreground">{user.apartmentName}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <Home className="h-4 w-4" />
                      <span className="text-xs uppercase font-semibold">Block/Wing</span>
                    </div>
                    <p className="text-sm text-foreground">{user.block}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <DoorOpen className="h-4 w-4" />
                      <span className="text-xs uppercase font-semibold">Flat/Room Number</span>
                    </div>
                    <p className="text-sm text-foreground">{user.flatNumber}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 w-full sm:w-auto">
              <div className="bg-secondary rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-foreground">{listedCount}</p>
                <p className="text-xs text-muted-foreground mt-2 font-medium">Items Listed</p>
              </div>
              <div className="bg-secondary rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-foreground">{activeBookingsCount}</p>
                <p className="text-xs text-muted-foreground mt-2 font-medium">Active Bookings</p>
              </div>
              <div className="bg-secondary rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-foreground">{requestsCount}</p>
                <p className="text-xs text-muted-foreground mt-2 font-medium">Requests Posted</p>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <div className="mt-6 pt-6 border-t border-border">
            <Button
              variant="destructive"
              className="gap-2"
              onClick={() => setShowLogoutConfirm(true)}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/dashboard">
          <Card className="border border-border hover:border-primary hover:shadow-md transition-all cursor-pointer h-full">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold mb-2">My Listed Items</p>
                  <p className="text-2xl font-bold text-foreground">{listedCount}</p>
                </div>
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-primary font-medium">
                View <ArrowRight className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/bookings">
          <Card className="border border-border hover:border-primary hover:shadow-md transition-all cursor-pointer h-full">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold mb-2">My Bookings</p>
                  <p className="text-2xl font-bold text-foreground">{activeBookingsCount}</p>
                </div>
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-primary font-medium">
                View <ArrowRight className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/requests">
          <Card className="border border-border hover:border-primary hover:shadow-md transition-all cursor-pointer h-full">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold mb-2">My Requests</p>
                  <p className="text-2xl font-bold text-foreground">{requestsCount}</p>
                </div>
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-primary font-medium">
                View <ArrowRight className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* My Listed Items Section */}
      {listedCount > 0 && (
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Recently Listed Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {listedItems.slice(0, 3).map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-sm text-muted-foreground">₹{item.pricePerDay}/day • {item.category}</p>
                  </div>
                  <Badge variant={item.available ? 'default' : 'secondary'}>
                    {item.available ? 'Available' : 'Unavailable'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Logout Confirmation Dialog */}
      <LogoutDialog
        isOpen={showLogoutConfirm}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
        isLoading={isLoggingOut}
      />
    </div>
  )
}
