'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { type User, getUser, setUser as storeUser, logout as storeLogout } from './store'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string, name: string, apartmentName: string, block: string, flatNumber: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = getUser()
    setUser(storedUser)
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Simple validation - accept any email/password combo
    if (email && password.length >= 4) {
      const storedUser = getUser()
      // Check if user exists
      if (storedUser && storedUser.email === email) {
        setUser(storedUser)
        return true
      }
      return false
    }
    return false
  }

  const signup = async (email: string, password: string, name: string, apartmentName: string, block: string, flatNumber: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Validation
    if (email && password.length >= 4 && name && apartmentName && block && flatNumber) {
      const newUser: User = {
        email,
        name,
        community: 'Verified Community',
        apartmentName,
        block,
        flatNumber,
      }
      storeUser(newUser)
      setUser(newUser)
      return true
    }
    return false
  }

  const logout = () => {
    storeLogout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
