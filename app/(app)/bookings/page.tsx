'use client'

import { useState, useEffect } from 'react'
import { getBookings, type Booking } from '@/lib/store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Empty } from '@/components/ui/empty'
import { Calendar, IndianRupee, Clock, CheckCircle, Package } from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])

  useEffect(() => {
    setBookings(getBookings().reverse())
  }, [])

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'Confirmed':
        return (
          <Badge className="bg-primary text-primary-foreground">
            <CheckCircle className="h-3 w-3 mr-1" />
            Confirmed
          </Badge>
        )
      case 'Pending':
        return (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case 'Completed':
        return (
          <Badge variant="outline">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Bookings</h1>
        <p className="text-muted-foreground mt-1">
          Track all your item rentals and bookings.
        </p>
      </div>

      {bookings.length === 0 ? (
        <Card>
          <CardContent className="py-16">
            <Empty
              icon={Calendar}
              title="No bookings yet"
              description="Browse the dashboard to find items to rent from your community."
            />
            <div className="flex justify-center mt-6">
              <Link href="/dashboard">
                <Button>Browse Items</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map(booking => (
            <Card key={booking.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  {/* Item Preview */}
                  <div className="w-full md:w-48 h-32 md:h-auto bg-secondary flex items-center justify-center shrink-0">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                      <Package className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="flex-1 p-4 md:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-lg text-foreground">{booking.itemName}</h3>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {format(new Date(booking.startDate), 'MMM d')} - {format(new Date(booking.endDate), 'MMM d, yyyy')}
                          </span>
                        </div>
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-border">
                      <div>
                        <p className="text-xs text-muted-foreground">Rental Cost</p>
                        <p className="font-medium text-foreground flex items-center">
                          <IndianRupee className="h-3 w-3" />{booking.totalPrice}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Deposit</p>
                        <p className="font-medium text-foreground flex items-center">
                          <IndianRupee className="h-3 w-3" />{booking.deposit}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Total Paid</p>
                        <p className="font-semibold text-primary flex items-center">
                          <IndianRupee className="h-3 w-3" />{booking.totalPrice + booking.deposit}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Booked</p>
                        <p className="font-medium text-foreground">
                          {formatDistanceToNow(new Date(booking.bookedAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Info Card */}
      {bookings.length > 0 && (
        <Card className="bg-secondary/50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                <IndianRupee className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">About Deposits</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Security deposits are fully refundable once you return the item in good condition. 
                  The owner will release the deposit after inspection.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
