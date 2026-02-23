import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory cache for development
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export function getCachedData(key: string) {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }
  return null
}

export function setCachedData(key: string, data: any) {
  cache.set(key, { data, timestamp: Date.now() })
}

export function createCacheKey(pathname: string, searchParams: URLSearchParams) {
  const params = Array.from(searchParams.entries())
    .sort()
    .map(([key, value]) => `${key}=${value}`)
    .join('&')
  return `${pathname}${params ? `?${params}` : ''}`
}

export function withCache(handler: Function) {
  return async (req: NextRequest) => {
    const url = new URL(req.url)
    const cacheKey = createCacheKey(url.pathname, url.searchParams)
    
    // Check cache first
    const cached = getCachedData(cacheKey)
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          'Cache-Control': 'public, max-age=300', // 5 minutes
          'X-Cache': 'HIT'
        }
      })
    }
    
    // Execute handler
    const result = await handler(req)
    
    // Cache the result
    if (result.ok) {
      const data = await result.json()
      setCachedData(cacheKey, data)
      
      return NextResponse.json(data, {
        headers: {
          'Cache-Control': 'public, max-age=300',
          'X-Cache': 'MISS'
        }
      })
    }
    
    return result
  }
}


