'use client'

import { Fragment, useState, useEffect, useCallback } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { UserCircleIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon, ClockIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'
import toast from 'react-hot-toast'

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void
}

// Client-side date component to avoid hydration issues
function CurrentDate() {
  const [date, setDate] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const updateDate = () => {
      setDate(new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }))
    }
    updateDate()
    // Update every minute to keep date current
    const interval = setInterval(updateDate, 60000)
    return () => clearInterval(interval)
  }, [])

  if (!mounted) {
    return <span className="text-xs text-gray-600">--/--/----</span>
  }

  return <span className="text-xs text-gray-600">{date}</span>
}

// Session timer component
function SessionTimer({ onLogout }: { onLogout: () => void }) {
  const [timeLeft, setTimeLeft] = useState(30 * 60) // 30 minutes in seconds
  const [lastActivity, setLastActivity] = useState(Date.now())
  const [mounted, setMounted] = useState(false)

  const resetTimer = useCallback(() => {
    setLastActivity(Date.now())
    setTimeLeft(30 * 60)
  }, [])

  const handleActivity = useCallback(() => {
    resetTimer()
  }, [resetTimer])

  useEffect(() => {
    setMounted(true)
    
    // Activity event listeners
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true)
    })

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true)
      })
    }
  }, [handleActivity])

  useEffect(() => {
    if (!mounted) return

    const timer = setInterval(() => {
      const now = Date.now()
      const timeSinceActivity = Math.floor((now - lastActivity) / 1000)
      const remaining = Math.max(0, (30 * 60) - timeSinceActivity)
      
      setTimeLeft(remaining)
      
      if (remaining <= 0) {
        toast.error('Session expired due to inactivity')
        onLogout()
        return
      }
      
      // Warning at 5 minutes
      if (remaining === 5 * 60) {
        toast('⚠️ Session will expire in 5 minutes', {
          icon: '⚠️',
          style: {
            background: '#fbbf24',
            color: '#92400e',
          },
        })
      }
      
      // Warning at 1 minute
      if (remaining === 60) {
        toast('⚠️ Session will expire in 1 minute', {
          icon: '⚠️',
          style: {
            background: '#f59e0b',
            color: '#92400e',
          },
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [lastActivity, mounted, onLogout])

  if (!mounted) {
    return <span className="text-xs text-gray-600">--:--</span>
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const isWarning = timeLeft <= 5 * 60 // Last 5 minutes
  
  return (
    <div className="flex items-center space-x-1">
      <ClockIcon className={clsx("h-3 w-3", isWarning ? "text-red-500" : "text-gray-600")} />
      <span className={clsx("text-xs font-mono", isWarning ? "text-red-500 font-semibold" : "text-gray-600")}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  )
}

export function Header({ setSidebarOpen }: HeaderProps) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      // Clear localStorage first
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken')
        localStorage.removeItem('user')
        localStorage.removeItem('customer_token')
        localStorage.removeItem('customer_data')
      }

      // Call logout API to clear server-side cookies
      await fetch('/api/auth/logout', {
        method: 'POST',
      })
      
      toast.success('Logged out successfully')
      router.push('/portal')
    } catch (error) {
      toast.error('Error logging out')
      // Even if API fails, still redirect to portal since localStorage is cleared
      router.push('/portal')
    }
  }

  const handleMobileMenuClick = () => {
    console.log('Mobile menu button clicked - opening sidebar')
    toast.success('Opening mobile menu...')
    setSidebarOpen(true)
  }

  return (
    <div className="relative z-10 flex-shrink-0 flex h-16 bg-gray-100 shadow">
      <button
        type="button"
        className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden hover:bg-gray-50 hover:text-gray-700 cursor-pointer"
        onClick={handleMobileMenuClick}
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>
      
      <div className="flex-1 px-4 flex justify-between">
        {/* Application Name */}
        <div className="flex-1 flex items-center justify-center lg:justify-start">
          <div className="flex items-center space-x-3">
            <img
              src="/elezenx-logo.svg"
              alt="ELEZENX Tech Solutions"
              className="h-12 w-auto"
            />
            <h1 className="text-xl font-bold text-black">
              Policy Assurance Administrator System
            </h1>
          </div>
        </div>

        {/* Agent Details - Center */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="flex-shrink-0">
                <img
                  className="h-8 w-8 rounded-full"
                  src="/agent-avatar.svg"
                  alt="Agent"
                />
              </div>
              <div className="text-sm">
                <p className="font-medium text-black">Sameer Saxena</p>
                <p className="text-gray-700">Senior Insurance Agent</p>
              </div>
            </div>
            <div className="hidden xl:block">
              <div className="text-xs text-gray-600">
                <p>Agent ID: AGT-001</p>
                <p>License: #INS-2024-001</p>
              </div>
              </div>
              <div className="hidden xl:block">
                <div className="text-xs text-gray-600 space-y-1">
                  <p><CurrentDate /></p>
                  <SessionTimer onLogout={handleLogout} />
                </div>
              </div>
          </div>
        </div>

        {/* Mobile Agent Details */}
        <div className="lg:hidden flex items-center">
          <div className="flex items-center space-x-2">
            <div className="flex-shrink-0">
                <img
                  className="h-6 w-6 rounded-full"
                  src="/agent-avatar.svg"
                  alt="Agent"
                />
            </div>
            <div className="text-xs">
              <p className="font-medium text-black">J. Smith</p>
              <p className="text-gray-700">Agent</p>
            </div>
          </div>
        </div>
        
        <div className="ml-4 flex items-center md:ml-6">
          {/* Notifications */}
          <button
            type="button"
            className="bg-gray-200 p-1 rounded-full text-gray-600 hover:text-gray-800 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <span className="sr-only">View notifications</span>
            <BellIcon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Profile dropdown */}
          <Menu as="div" className="ml-3 relative">
            <div>
              <Menu.Button className="max-w-xs bg-gray-200 flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 hover:bg-gray-300">
                <span className="sr-only">Open user menu</span>
                <UserCircleIcon className="h-8 w-8 text-gray-600" />
                <span className="ml-2 text-black">Admin User</span>
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={clsx(
                        active ? 'bg-secondary-100' : '',
                        'block px-4 py-2 text-sm text-secondary-700'
                      )}
                    >
                      <div className="flex items-center">
                        <UserCircleIcon className="h-4 w-4 mr-2" />
                        Your Profile
                      </div>
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="/dashboard/settings"
                      className={clsx(
                        active ? 'bg-secondary-100' : '',
                        'block px-4 py-2 text-sm text-secondary-700'
                      )}
                    >
                      <div className="flex items-center">
                        <Cog6ToothIcon className="h-4 w-4 mr-2" />
                        Settings
                      </div>
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleLogout}
                      className={clsx(
                        active ? 'bg-secondary-100' : '',
                        'block w-full text-left px-4 py-2 text-sm text-secondary-700'
                      )}
                    >
                      <div className="flex items-center">
                        <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                        Sign out
                      </div>
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </div>
  )
}

