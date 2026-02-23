// Geolocation utilities and types
export interface LocationData {
  latitude: number
  longitude: number
  city: string
  state: string
  country: string
  zipCode: string
  timezone: string
  region: string
  currency: string
  currencySymbol: string
}

export interface InsuranceRegion {
  id: string
  name: string
  state: string
  city: string
  zipCode: string
  riskLevel: 'low' | 'medium' | 'high'
  averagePremium: number
  localAgents: number
  coverageOptions: string[]
}

// Sample regional data
export const insuranceRegions: InsuranceRegion[] = [
  {
    id: 'nyc-metro',
    name: 'New York Metro Area',
    state: 'NY',
    city: 'New York',
    zipCode: '10001',
    riskLevel: 'high',
    averagePremium: 1500,
    localAgents: 45,
    coverageOptions: ['Comprehensive Auto', 'High-Value Home', 'Business Insurance', 'Cyber Liability']
  },
  {
    id: 'california-bay',
    name: 'San Francisco Bay Area',
    state: 'CA',
    city: 'San Francisco',
    zipCode: '94102',
    riskLevel: 'high',
    averagePremium: 1800,
    localAgents: 32,
    coverageOptions: ['Earthquake Insurance', 'Tech Business Coverage', 'Auto Insurance', 'Renters Insurance']
  },
  {
    id: 'texas-houston',
    name: 'Houston Metro',
    state: 'TX',
    city: 'Houston',
    zipCode: '77001',
    riskLevel: 'medium',
    averagePremium: 1200,
    localAgents: 28,
    coverageOptions: ['Hurricane Coverage', 'Oil & Gas Business', 'Auto Insurance', 'Flood Insurance']
  },
  {
    id: 'florida-miami',
    name: 'Miami-Dade County',
    state: 'FL',
    city: 'Miami',
    zipCode: '33101',
    riskLevel: 'high',
    averagePremium: 1600,
    localAgents: 35,
    coverageOptions: ['Hurricane Insurance', 'Flood Coverage', 'Auto Insurance', 'Boat Insurance']
  },
  {
    id: 'illinois-chicago',
    name: 'Chicago Metro',
    state: 'IL',
    city: 'Chicago',
    zipCode: '60601',
    riskLevel: 'medium',
    averagePremium: 1100,
    localAgents: 40,
    coverageOptions: ['Auto Insurance', 'Home Insurance', 'Business Insurance', 'Winter Coverage']
  },
  {
    id: 'mumbai-metro',
    name: 'Mumbai Metropolitan Region',
    state: 'Maharashtra',
    city: 'Mumbai',
    zipCode: '400001',
    riskLevel: 'medium',
    averagePremium: 25000,
    localAgents: 50,
    coverageOptions: ['Motor Insurance', 'Health Insurance', 'Life Insurance', 'Home Insurance', 'Travel Insurance']
  }
]

export function getLocationByCoordinates(lat: number, lng: number): LocationData | null {
  // This would typically use a reverse geocoding API
  // For demo purposes, we'll simulate based on coordinates
  if (lat >= 40.7 && lat <= 40.8 && lng >= -74.0 && lng <= -73.9) {
    return {
      latitude: lat,
      longitude: lng,
      city: 'New York',
      state: 'NY',
      country: 'US',
      zipCode: '10001',
      timezone: 'America/New_York',
      region: 'nyc-metro',
      currency: 'USD',
      currencySymbol: '$'
    }
  }
  
  if (lat >= 37.7 && lat <= 37.8 && lng >= -122.5 && lng <= -122.4) {
    return {
      latitude: lat,
      longitude: lng,
      city: 'San Francisco',
      state: 'CA',
      country: 'US',
      zipCode: '94102',
      timezone: 'America/Los_Angeles',
      region: 'california-bay',
      currency: 'USD',
      currencySymbol: '$'
    }
  }
  
  if (lat >= 29.7 && lat <= 29.8 && lng >= -95.4 && lng <= -95.3) {
    return {
      latitude: lat,
      longitude: lng,
      city: 'Houston',
      state: 'TX',
      country: 'US',
      zipCode: '77001',
      timezone: 'America/Chicago',
      region: 'texas-houston',
      currency: 'USD',
      currencySymbol: '$'
    }
  }
  
  // Default fallback - assuming Indian location for demo
  return {
    latitude: lat,
    longitude: lng,
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'IN',
    zipCode: '400001',
    timezone: 'Asia/Kolkata',
    region: 'mumbai-metro',
    currency: 'INR',
    currencySymbol: '₹'
  }
}

export function getInsuranceRegion(regionId: string): InsuranceRegion | null {
  return insuranceRegions.find(region => region.id === regionId) || null
}

export function getLocalAgents(regionId: string) {
  const region = getInsuranceRegion(regionId)
  if (!region) return []
  
  // Generate sample local agents
  const agents = []
  for (let i = 1; i <= Math.min(region.localAgents, 10); i++) {
    agents.push({
      id: `agent-${regionId}-${i}`,
      name: `Agent ${i}`,
      email: `agent${i}@${region.city.toLowerCase().replace(' ', '')}insurance.com`,
      phone: `+1-555-${String(i).padStart(3, '0')}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      rating: (4 + Math.random()).toFixed(1),
      specialties: region.coverageOptions.slice(0, Math.floor(Math.random() * 3) + 2),
      experience: Math.floor(Math.random() * 15) + 5,
      location: `${region.city}, ${region.state}`
    })
  }
  
  return agents
}

export function getRegionalPricing(regionId: string, policyType: string) {
  const region = getInsuranceRegion(regionId)
  if (!region) return null
  
  const basePricing = {
    'auto': 800,
    'home': 600,
    'health': 2000,
    'business': 1200,
    'life': 500
  }
  
  const basePrice = basePricing[policyType as keyof typeof basePricing] || 1000
  const riskMultiplier = region.riskLevel === 'high' ? 1.3 : region.riskLevel === 'medium' ? 1.1 : 0.9
  
  return {
    basePrice,
    regionalPrice: Math.round(basePrice * riskMultiplier),
    savings: Math.round(basePrice * (1 - riskMultiplier)),
    riskLevel: region.riskLevel,
    regionName: region.name
  }
}
