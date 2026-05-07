'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { type Item } from '@/lib/store'
import { IndianRupee, User, Check } from 'lucide-react'

interface ItemCardProps {
  item: Item
}

const categoryColors: Record<string, string> = {
  Electronics: 'bg-chart-1/10 text-chart-1',
  Tools: 'bg-chart-2/10 text-chart-2',
  Outdoor: 'bg-chart-3/10 text-chart-3',
  Kitchen: 'bg-chart-4/10 text-chart-4',
  Garden: 'bg-chart-5/10 text-chart-5',
}

export function ItemCard({ item }: ItemCardProps) {
  const [imageError, setImageError] = useState(false)

  const placeholderImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" font-family="sans-serif" font-size="16" fill="%239ca3af" text-anchor="middle" dy=".3em"%3ENo image%3C/text%3E%3C/svg%3E'

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200">
      {/* Image Section - Reduced Height */}
      <div className="aspect-[4/3] bg-secondary relative overflow-hidden">
        {/* Image or Placeholder */}
        {item.image && !imageError ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-muted mx-auto mb-2 flex items-center justify-center">
                <span className="text-2xl">{item.name.charAt(0)}</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <Badge className={categoryColors[item.category] || 'bg-secondary text-secondary-foreground'}>
            {item.category}
          </Badge>
        </div>

        {/* Status Indicator - Available Now */}
        {item.available && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-primary/90 text-primary-foreground px-2.5 py-1 rounded-full text-xs font-medium">
            <Check className="h-3 w-3" />
            Available Now
          </div>
        )}

        {/* Unavailable Overlay */}
        {!item.available && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
            <Badge variant="secondary" className="text-sm font-medium">Currently Unavailable</Badge>
          </div>
        )}
      </div>

      {/* Content Section */}
      <CardContent className="p-4">
        {/* Item Name - Prominent */}
        <h3 className="text-base font-bold text-foreground leading-tight mb-2">
          {item.name}
        </h3>

        {/* Status Indicators */}
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline" className="text-xs font-medium">
            <Check className="h-2.5 w-2.5 mr-1" />
            Verified Owner
          </Badge>
          <Badge variant="secondary" className="text-xs font-medium">
            Deposit ₹{item.deposit}
          </Badge>
        </div>

        {/* Description - Secondary */}
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
          {item.description}
        </p>

        {/* Price and Owner */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-1">
            <span className="text-2xl font-bold text-primary">₹{item.pricePerDay}</span>
            <span className="text-xs text-muted-foreground">/day</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <User className="h-3 w-3" />
            <span className="truncate">{item.owner}</span>
          </div>
        </div>
      </CardContent>

      {/* Action Button */}
      <CardFooter className="p-4 pt-0">
        <Link href={`/item/${item.id}`} className="w-full">
          <Button 
            variant={item.available ? 'default' : 'secondary'} 
            className="w-full"
            disabled={!item.available}
          >
            {item.available ? 'View Details' : 'Unavailable'}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
