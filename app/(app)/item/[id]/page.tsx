'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { getItemById, addBooking, updateItemAvailability, type Item } from '@/lib/store'
import { useNotification } from '@/lib/notification-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar } from '@/components/ui/calendar'
import { 
  ArrowLeft, 
  IndianRupee, 
  User, 
  CalendarIcon, 
  Shield, 
  CheckCircle,
  Loader2 
} from 'lucide-react'
import Link from 'next/link'
import { format, differenceInDays, addDays } from 'date-fns'
import type { DateRange } from 'react-day-picker'

export default function ItemDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [item, setItem] = useState<Item | null>(null)
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [isBooking, setIsBooking] = useState(false)
  const [bookingConfirmed, setBookingConfirmed] = useState(false)
  const { addNotification } = useNotification()
  const router = useRouter()

  useEffect(() => {
    const foundItem = getItemById(id)
    setItem(foundItem || null)
  }, [id])

  if (!item) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <h2 className="text-lg font-medium text-foreground mb-2">Item not found</h2>
          <Link href="/dashboard">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const numDays = dateRange?.from && dateRange?.to 
    ? differenceInDays(dateRange.to, dateRange.from) + 1 
    : 0
  const totalPrice = numDays * item.pricePerDay
  const totalAmount = totalPrice + item.deposit

  const handleBooking = async () => {
    if (!dateRange?.from || !dateRange?.to) return

    setIsBooking(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    addBooking({
      itemId: item.id,
      itemName: item.name,
      startDate: dateRange.from.toISOString(),
      endDate: dateRange.to.toISOString(),
      totalPrice,
      deposit: item.deposit,
      status: 'Confirmed',
    })

    updateItemAvailability(item.id, false)
    
    setIsBooking(false)
    setBookingConfirmed(true)
    addNotification('Booking confirmed! Check My Bookings for details.', 'success')
  }

  if (bookingConfirmed) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="text-center">
          <CardContent className="pt-12 pb-8">
            <div className="w-20 h-20 rounded-full bg-primary/10 mx-auto mb-6 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Booking Confirmed!</h1>
            <p className="text-muted-foreground mb-6">
              Your booking for <span className="font-medium text-foreground">{item.name}</span> has been confirmed.
            </p>
            
            <div className="bg-secondary rounded-lg p-4 mb-6 text-left">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Rental Period</p>
                  <p className="font-medium text-foreground">
                    {dateRange?.from && format(dateRange.from, 'MMM d')} - {dateRange?.to && format(dateRange.to, 'MMM d, yyyy')}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Duration</p>
                  <p className="font-medium text-foreground">{numDays} day{numDays !== 1 ? 's' : ''}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Rental Cost</p>
                  <p className="font-medium text-foreground flex items-center">
                    <IndianRupee className="h-3 w-3" />{totalPrice}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Deposit (Refundable)</p>
                  <p className="font-medium text-foreground flex items-center">
                    <IndianRupee className="h-3 w-3" />{item.deposit}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/bookings">
                <Button>View My Bookings</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Item Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Item Image/Placeholder */}
          <div className="aspect-video bg-secondary rounded-xl flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                <span className="text-5xl font-semibold text-muted-foreground">{item.name.charAt(0)}</span>
              </div>
            </div>
          </div>

          {/* Item Info */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <Badge className="mb-2">{item.category}</Badge>
                <h1 className="text-2xl font-bold text-foreground">{item.name}</h1>
              </div>
              <div className="text-right">
                <div className="flex items-center text-2xl font-bold text-primary">
                  <IndianRupee className="h-6 w-6" />
                  {item.pricePerDay}
                </div>
                <p className="text-sm text-muted-foreground">per day</p>
              </div>
            </div>
            <p className="text-muted-foreground">{item.description}</p>
          </div>

          {/* Owner Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{item.owner}</p>
                  <p className="text-sm text-muted-foreground">Community Member</p>
                </div>
                <div className="ml-auto flex items-center gap-1 text-primary">
                  <Shield className="h-4 w-4" />
                  <span className="text-sm">Verified</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Deposit Info */}
          <Card className="bg-accent/20 border-accent">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-accent-foreground" />
                <div>
                  <p className="font-medium text-accent-foreground">
                    Refundable Deposit: <IndianRupee className="h-4 w-4 inline" />{item.deposit}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Deposit will be returned after item is returned in good condition.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Card */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Book This Item
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Select Rental Dates</p>
                <div className="border border-border rounded-lg p-2">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={1}
                    disabled={{ before: new Date() }}
                    className="mx-auto"
                  />
                </div>
              </div>

              {dateRange?.from && dateRange?.to && (
                <div className="space-y-3 pt-4 border-t border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      <IndianRupee className="h-3 w-3 inline" />{item.pricePerDay} x {numDays} days
                    </span>
                    <span className="font-medium flex items-center">
                      <IndianRupee className="h-3 w-3" />{totalPrice}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Refundable Deposit</span>
                    <span className="font-medium flex items-center">
                      <IndianRupee className="h-3 w-3" />{item.deposit}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold pt-2 border-t border-border">
                    <span>Total</span>
                    <span className="text-primary flex items-center">
                      <IndianRupee className="h-4 w-4" />{totalAmount}
                    </span>
                  </div>
                </div>
              )}

              <Button 
                className="w-full" 
                size="lg"
                disabled={!dateRange?.from || !dateRange?.to || isBooking || !item.available}
                onClick={handleBooking}
              >
                {isBooking ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Booking...
                  </>
                ) : !item.available ? (
                  'Currently Unavailable'
                ) : (
                  'Book Now'
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                You won&apos;t be charged yet. This is a simulated booking.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
