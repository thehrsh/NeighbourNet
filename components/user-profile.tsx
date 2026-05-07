'use client'

import { useAuth } from '@/lib/auth-context'
import { Card } from '@/components/ui/card'
import { Shield, MapPin, Home } from 'lucide-react'

export function UserProfile() {
  const { user } = useAuth()

  if (!user) {
    return null
  }

  return (
    <Card className="border-border shadow-sm">
      <div className="p-6 space-y-4">
        {/* Header with verification badge */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{user.name}</h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 rounded-full">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-primary">Verified</span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border" />

        {/* Community Information */}
        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase">Community</p>
            <p className="text-sm text-foreground mt-1">{user.community}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Home className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs font-medium text-muted-foreground uppercase">Apartment</p>
              </div>
              <p className="text-sm text-foreground">{user.apartmentName}</p>
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase">Block</p>
              <p className="text-sm text-foreground">{user.block}</p>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs font-medium text-muted-foreground uppercase">Flat / Room</p>
            </div>
            <p className="text-sm text-foreground">{user.flatNumber}</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
