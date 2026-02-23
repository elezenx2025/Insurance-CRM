'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { LocationData, InsuranceRegion, getLocationByCoordinates, getInsuranceRegion, getLocalAgents, getRegionalPricing } from '@/lib/geolocation'

interface LocationContextType {
  location: LocationData | null
  region: InsuranceRegion | null
  localAgents: any[]
  isLoading: boolean
  error: string | null
  requestLocation: () => void
  setLocation: (location: LocationData) => void
  getPricing: (policyType: string) => any
}

const LocationContext = createContext<LocationContextType | undefined>(undefined)

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<LocationData | null>(null)
  const [region, setRegion] = useState<InsuranceRegion | null>(null)
  const [localAgents, setLocalAgents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser')
      return
    }

    setIsLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        const locationData = getLocationByCoordinates(latitude, longitude)
        
        if (locationData) {
          setLocation(locationData)
          const regionData = getInsuranceRegion(locationData.region)
          setRegion(regionData)
          
          if (regionData) {
            const agents = getLocalAgents(regionData.id)
            setLocalAgents(agents)
          }
        }
        setIsLoading(false)
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location'
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out'
            break
        }
        setError(errorMessage)
        setIsLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    )
  }

  const getPricing = (policyType: string) => {
    if (!region) return null
    return getRegionalPricing(region.id, policyType)
  }

  // Auto-request location on mount
  useEffect(() => {
    requestLocation()
  }, [])

  const value: LocationContextType = {
    location,
    region,
    localAgents,
    isLoading,
    error,
    requestLocation,
    setLocation,
    getPricing
  }

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  )
}

export function useLocation() {
  const context = useContext(LocationContext)
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider')
  }
  return context
}


