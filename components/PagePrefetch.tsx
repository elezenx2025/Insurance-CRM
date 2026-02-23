'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface PagePrefetchProps {
  pages: string[]
}

export function PagePrefetch({ pages }: PagePrefetchProps) {
  const router = useRouter()

  useEffect(() => {
    // Prefetch pages after component mounts
    const timer = setTimeout(() => {
      pages.forEach(page => {
        router.prefetch(page)
      })
    }, 1000) // Wait 1 second before prefetching

    return () => clearTimeout(timer)
  }, [pages, router])

  return null // This component doesn't render anything
}






