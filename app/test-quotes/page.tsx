'use client'

import { useState } from 'react'
import { getStates, getCitiesByState, validateMobileNumber } from '@/lib/master-data'

export default function TestQuotesPage() {
  const [states] = useState(getStates())
  const [cities, setCities] = useState(getCitiesByState(''))
  const [selectedState, setSelectedState] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [phone, setPhone] = useState('')
  const [mobileError, setMobileError] = useState('')

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stateId = e.target.value
    setSelectedState(stateId)
    setSelectedCity('')
    if (stateId) {
      setCities(getCitiesByState(stateId))
    }
  }

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const cleanedValue = value.replace(/\D/g, '')
    
    if (cleanedValue.length <= 10) {
      setPhone(cleanedValue)
      
      if (cleanedValue.length === 10) {
        if (validateMobileNumber(cleanedValue)) {
          setMobileError('')
        } else {
          setMobileError('Invalid mobile number. Must start with 6, 7, 8, or 9')
        }
      } else if (cleanedValue.length > 0) {
        setMobileError('Mobile number must be 10 digits')
      } else {
        setMobileError('')
      }
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Test Insurance Quotes Features</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Customer Information Test</h2>
        
        {/* Phone Number with +91 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
              +91
            </span>
            <input
              type="tel"
              value={phone}
              onChange={handleMobileChange}
              className="flex-1 border border-gray-300 rounded-r-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="9876543210"
              maxLength={10}
            />
          </div>
          {mobileError && (
            <p className="text-red-600 text-xs mt-1">{mobileError}</p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            Current value: {phone} (Length: {phone.length})
          </p>
        </div>

        {/* State Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State *
          </label>
          <select
            value={selectedState}
            onChange={handleStateChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state.id} value={state.id}>
                {state.name}
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-500 mt-1">
            Total states available: {states.length}
          </p>
        </div>

        {/* City Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City *
          </label>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            disabled={!selectedState}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          >
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-500 mt-1">
            Cities for selected state: {cities.length}
          </p>
        </div>

        {/* Debug Info */}
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h3 className="font-semibold mb-2">Debug Information:</h3>
          <p>Selected State: {selectedState}</p>
          <p>Selected City: {selectedCity}</p>
          <p>Phone: {phone}</p>
          <p>Mobile Error: {mobileError || 'None'}</p>
        </div>
      </div>
    </div>
  )
}












