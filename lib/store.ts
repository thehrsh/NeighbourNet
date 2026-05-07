export interface Item {
  id: string
  name: string
  description: string
  pricePerDay: number
  deposit: number
  category: string
  available: boolean
  owner: string
  image: string
}

export interface Booking {
  id: string
  itemId: string
  itemName: string
  startDate: string
  endDate: string
  totalPrice: number
  deposit: number
  status: 'Confirmed' | 'Pending' | 'Completed'
  bookedAt: string
}

export interface Reply {
  id: string
  requesterName: string
  responderName: string
  message: string
  createdAt: string
}

export interface Request {
  id: string
  description: string
  status: 'Open' | 'Fulfilled'
  createdAt: string
  requesterName?: string
  replies: Reply[]
}

export interface User {
  email: string
  name: string
  community: string
  apartmentName: string
  block: string
  flatNumber: string
}

const STORAGE_KEYS = {
  ITEMS: 'neighbournet_items',
  BOOKINGS: 'neighbournet_bookings',
  REQUESTS: 'neighbournet_requests',
  USER: 'neighbournet_user',
}

const defaultItems: Item[] = [
  {
    id: '1',
    name: 'DSLR Camera',
    description: 'Canon EOS 1500D with 18-55mm lens. Perfect for photography enthusiasts and events.',
    pricePerDay: 350,
    deposit: 1000,
    category: 'Electronics',
    available: true,
    owner: 'Priya Sharma',
    image: '/items/camera.jpg',
  },
  {
    id: '2',
    name: 'Projector',
    description: 'Epson Home Cinema projector with 1080p resolution. Great for movie nights and presentations.',
    pricePerDay: 200,
    deposit: 800,
    category: 'Electronics',
    available: true,
    owner: 'Amit Patel',
    image: '/items/projector.jpg',
  },
  {
    id: '3',
    name: 'Drill Machine',
    description: 'Bosch power drill with multiple bits. Ideal for home improvement projects.',
    pricePerDay: 100,
    deposit: 500,
    category: 'Tools',
    available: true,
    owner: 'Rajesh Kumar',
    image: '/items/drill.jpg',
  },
  {
    id: '4',
    name: 'Camping Tent',
    description: '4-person waterproof tent with easy setup. Perfect for weekend getaways.',
    pricePerDay: 250,
    deposit: 700,
    category: 'Outdoor',
    available: true,
    owner: 'Sneha Gupta',
    image: '/items/tent.jpg',
  },
  {
    id: '5',
    name: 'Pressure Cooker',
    description: 'Large 8L Prestige pressure cooker. Great for big family gatherings.',
    pricePerDay: 50,
    deposit: 300,
    category: 'Kitchen',
    available: false,
    owner: 'Meera Reddy',
    image: '/items/cooker.jpg',
  },
  {
    id: '6',
    name: 'Lawn Mower',
    description: 'Electric lawn mower with adjustable height. Keep your garden pristine.',
    pricePerDay: 150,
    deposit: 600,
    category: 'Garden',
    available: true,
    owner: 'Vikram Singh',
    image: '/items/mower.jpg',
  },
]

export function getItems(): Item[] {
  if (typeof window === 'undefined') return defaultItems
  const stored = localStorage.getItem(STORAGE_KEYS.ITEMS)
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(defaultItems))
    return defaultItems
  }
  return JSON.parse(stored)
}

export function addItem(item: Omit<Item, 'id'>): Item {
  const items = getItems()
  const newItem: Item = {
    ...item,
    id: Date.now().toString(),
  }
  items.push(newItem)
  localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items))
  return newItem
}

export function getItemById(id: string): Item | undefined {
  return getItems().find(item => item.id === id)
}

export function updateItemAvailability(id: string, available: boolean): void {
  const items = getItems()
  const index = items.findIndex(item => item.id === id)
  if (index !== -1) {
    items[index].available = available
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items))
  }
}

export function getItemsByOwner(ownerName: string): Item[] {
  return getItems().filter(item => item.owner === ownerName)
}

export function getBookings(): Booking[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(STORAGE_KEYS.BOOKINGS)
  return stored ? JSON.parse(stored) : []
}

export function addBooking(booking: Omit<Booking, 'id' | 'bookedAt'>): Booking {
  const bookings = getBookings()
  const newBooking: Booking = {
    ...booking,
    id: Date.now().toString(),
    bookedAt: new Date().toISOString(),
  }
  bookings.push(newBooking)
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings))
  return newBooking
}

export function getBookingsByUser(): Booking[] {
  // In a real app, we'd track the current user and filter by them
  // For now, return all bookings
  return getBookings()
}

export function getActiveBookingsCount(): number {
  return getBookings().filter(b => b.status === 'Confirmed' || b.status === 'Pending').length
}

export function getRequests(): Request[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(STORAGE_KEYS.REQUESTS)
  return stored ? JSON.parse(stored) : []
}

export function addRequest(description: string, requesterName: string = 'Community Member'): Request {
  const requests = getRequests()
  const newRequest: Request = {
    id: Date.now().toString(),
    description,
    status: 'Open',
    createdAt: new Date().toISOString(),
    requesterName,
    replies: [],
  }
  requests.push(newRequest)
  localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests))
  return newRequest
}

export function addReply(requestId: string, message: string, responderName: string = 'Community Member'): Reply | null {
  const requests = getRequests()
  const request = requests.find(r => r.id === requestId)
  
  if (!request) return null
  
  const newReply: Reply = {
    id: Date.now().toString(),
    requesterName: request.requesterName || 'Community Member',
    responderName,
    message,
    createdAt: new Date().toISOString(),
  }
  
  request.replies.push(newReply)
  localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests))
  return newReply
}

export function getUser(): User | null {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem(STORAGE_KEYS.USER)
  return stored ? JSON.parse(stored) : null
}

export function setUser(user: User): void {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
}

export function logout(): void {
  localStorage.removeItem(STORAGE_KEYS.USER)
}

export function isLoggedIn(): boolean {
  return getUser() !== null
}
