'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { addItem } from '@/lib/store'
import { useNotification } from '@/lib/notification-context'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Package, IndianRupee, Loader2, CheckCircle, X } from 'lucide-react'
import Image from 'next/image'

const categories = ['Electronics', 'Tools', 'Outdoor', 'Kitchen', 'Garden', 'Sports', 'Books', 'Other']

const placeholderImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" font-family="sans-serif" font-size="16" fill="%239ca3af" text-anchor="middle" dy=".3em"%3ENo image selected%3C/text%3E%3C/svg%3E'

export default function ListItemPage() {
  const { user } = useAuth()
  const { addNotification } = useNotification()
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    pricePerDay: '',
    deposit: '',
    category: '',
    available: true,
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImagePreview(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))

    addItem({
      name: formData.name,
      description: formData.description,
      pricePerDay: parseInt(formData.pricePerDay),
      deposit: parseInt(formData.deposit),
      category: formData.category,
      available: formData.available,
      owner: user?.name || 'Anonymous',
      image: imagePreview || placeholderImage,
    })

    setIsSubmitting(false)
    setIsSuccess(true)
    addNotification('Item listed successfully! It is now visible to the community.', 'success')
  }

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="text-center">
          <CardContent className="pt-12 pb-8">
            <div className="w-20 h-20 rounded-full bg-primary/10 mx-auto mb-6 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Item Listed!</h1>
            <p className="text-muted-foreground mb-6">
              Your item <span className="font-medium text-foreground">{formData.name}</span> is now available for your community to rent.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => router.push('/dashboard')}>
                View on Dashboard
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsSuccess(false)
                  setFormData({
                    name: '',
                    description: '',
                    pricePerDay: '',
                    deposit: '',
                    category: '',
                    available: true,
                  })
                  setImagePreview(null)
                }}
              >
                List Another Item
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">List an Item</h1>
        <p className="text-muted-foreground mt-1">
          Share your belongings with the community and earn while they sit idle.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Item Details
          </CardTitle>
          <CardDescription>
            Fill in the details about the item you want to share.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <Field>
              <FieldLabel htmlFor="image">Item Image</FieldLabel>
              <div className="space-y-3">
                {/* Preview */}
                <div className="relative aspect-[4/3] bg-secondary rounded-lg overflow-hidden border-2 border-dashed border-border">
                  {imagePreview ? (
                    <>
                      <img
                        src={imagePreview}
                        alt="Item preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 bg-destructive rounded-full p-1 text-destructive-foreground hover:bg-destructive/90 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <div className="w-12 h-12 rounded-lg bg-muted mx-auto mb-2 flex items-center justify-center">
                          <Package className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium">No image selected</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Upload Input */}
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">
                  Upload a clear image of your item. Supported formats: JPG, PNG, GIF (Max 5MB)
                </p>
              </div>
            </Field>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Item Name</FieldLabel>
                <Input
                  id="name"
                  placeholder="e.g., DSLR Camera, Power Drill"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Textarea
                  id="description"
                  placeholder="Describe your item, its condition, and any special instructions..."
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="category">Category</FieldLabel>
                <Select 
                  value={formData.category} 
                  onValueChange={value => setFormData(prev => ({ ...prev, category: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="pricePerDay">Price per Day</FieldLabel>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="pricePerDay"
                      type="number"
                      placeholder="100"
                      className="pl-9"
                      value={formData.pricePerDay}
                      onChange={e => setFormData(prev => ({ ...prev, pricePerDay: e.target.value }))}
                      min="1"
                      required
                    />
                  </div>
                </Field>

                <Field>
                  <FieldLabel htmlFor="deposit">Security Deposit</FieldLabel>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="deposit"
                      type="number"
                      placeholder="500"
                      className="pl-9"
                      value={formData.deposit}
                      onChange={e => setFormData(prev => ({ ...prev, deposit: e.target.value }))}
                      min="0"
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Refundable deposit (typically 500-1000)</p>
                </Field>
              </div>

              <Field>
                <div className="flex items-center justify-between">
                  <div>
                    <FieldLabel htmlFor="available">Available Now</FieldLabel>
                    <p className="text-sm text-muted-foreground">Toggle off if item is currently in use</p>
                  </div>
                  <Switch
                    id="available"
                    checked={formData.available}
                    onCheckedChange={checked => setFormData(prev => ({ ...prev, available: checked }))}
                  />
                </div>
              </Field>
            </FieldGroup>

            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Listing Item...
                </>
              ) : (
                'List Item'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
