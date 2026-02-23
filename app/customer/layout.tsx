'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LocationProvider } from '@/contexts/LocationContext'
import { 
  HomeIcon, 
  DocumentTextIcon, 
  CreditCardIcon,
  UserIcon,
  ShieldCheckIcon,
  BellIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  TruckIcon,
  CurrencyDollarIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline'

function AuthenticatedCustomerLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [customer, setCustomer] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('customer_token')
        const customerData = localStorage.getItem('customer_data')
        
        if (token && customerData) {
          setIsAuthenticated(true)
          setCustomer(JSON.parse(customerData))
        } else {
          // No valid authentication - redirect to login
          setIsAuthenticated(false)
          setCustomer(null)
          router.push('/customer/login')
        }
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('customer_token')
      localStorage.removeItem('customer_data')
    }
    setIsAuthenticated(false)
    setCustomer(null)
    router.push('/portal')
  }

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render if not authenticated (redirect will happen)
  if (!isAuthenticated) {
    return null
  }

  const navigation = [
    { name: 'Dashboard', href: '/customer', icon: HomeIcon, current: pathname === '/customer' },
    { name: 'My Policies', href: '/customer/policies', icon: DocumentTextIcon, current: pathname === '/customer/policies' },
    { name: 'Insurance Quotes', href: '/customer/insurance-quotes', icon: CurrencyDollarIcon, current: pathname === '/customer/insurance-quotes' },
    { name: 'Policy Details', href: '/customer/policy-details', icon: TruckIcon, current: pathname === '/customer/policy-details' },
    { name: 'Buy New Policy', href: '/customer/buy', icon: CreditCardIcon, current: pathname === '/customer/buy' },
    { name: 'Renew Policy', href: '/customer/renew', icon: ShieldCheckIcon, current: pathname === '/customer/renew' },
    { name: 'Claims', href: '/customer/claims', icon: BellIcon, current: pathname === '/customer/claims' },
    { name: 'File Claim', href: '/customer/file-claim', icon: ClipboardDocumentListIcon, current: pathname === '/customer/file-claim' },
    { name: 'Profile', href: '/customer/profile', icon: UserIcon, current: pathname === '/customer/profile' },
  ]

  return (
    <LocationProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-18">
              <div className="flex items-center">
                <Link href="/customer" className="flex items-center">
                  <img
                    src="/elezenx-logo1.svg"
                    alt="ELEZENX Tech Solutions"
                    className="h-24 w-auto"
                  />
                  <span className="ml-2 text-xl font-bold text-gray-900">PAAS</span>
                </Link>
              </div>
              
              <div className="flex items-center space-x-4">
                <button className="p-2 text-gray-400 hover:text-gray-500">
                  <BellIcon className="h-6 w-6" />
                </button>
                <div className="flex items-center space-x-2">
                  <UserIcon className="h-6 w-6 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">{customer?.name || 'Customer'}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <div className={`${sidebarOpen ? 'block' : 'hidden'} lg:block w-64 bg-white shadow-sm`}>
            <nav className="mt-5 px-2">
              <div className="space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${
                      item.current
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } group flex items-center px-2 py-2 text-sm font-medium border-l-4`}
                  >
                    <item.icon
                      className={`${
                        item.current ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                      } mr-3 h-5 w-5`}
                    />
                    {item.name}
                  </Link>
                ))}
              </div>
            </nav>
          </div>

          {/* Main content */}
          <main className="flex-1">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </LocationProvider>
  )
}

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthenticatedCustomerLayout>
      {children}
    </AuthenticatedCustomerLayout>
  )
}
