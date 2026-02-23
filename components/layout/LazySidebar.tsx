'use client'

import dynamic from 'next/dynamic'
import { ComponentType } from 'react'

interface SidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

// Lazy load the Sidebar component
const LazySidebar = dynamic(
  () => import('./Sidebar'),
  {
    loading: () => (
      <div className="w-64 bg-white shadow-lg flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    ),
    ssr: false
  }
) as ComponentType<SidebarProps>

export { LazySidebar as Sidebar }


