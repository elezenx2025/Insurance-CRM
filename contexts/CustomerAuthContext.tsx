'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface CustomerAuthContextType {
  isAuthenticated: boolean
  customer: any | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined)

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [customer, setCustomer] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for existing session on mount
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('customer_token')
        const customerData = localStorage.getItem('customer_data')
        
        if (token && customerData) {
          setIsAuthenticated(true)
          setCustomer(JSON.parse(customerData))
        }
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call - in real app, this would call your backend
      if (email === 'customer@demo.com' && password === 'demo123') {
        const customerData = {
          id: 'CUST-001',
          name: 'John Doe',
          email: 'customer@demo.com',
          phone: '+1 (555) 123-4567'
        }
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('customer_token', 'demo_token_123')
          localStorage.setItem('customer_data', JSON.stringify(customerData))
        }
        
        setIsAuthenticated(true)
        setCustomer(customerData)
        return true
      }
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('customer_token')
      localStorage.removeItem('customer_data')
    }
    setIsAuthenticated(false)
    setCustomer(null)
    router.push('/portal')
  }

  return (
    <CustomerAuthContext.Provider value={{
      isAuthenticated,
      customer,
      login,
      logout,
      isLoading
    }}>
      {children}
    </CustomerAuthContext.Provider>
  )
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext)
  if (context === undefined) {
    throw new Error('useCustomerAuth must be used within a CustomerAuthProvider')
  }
  return context
}
