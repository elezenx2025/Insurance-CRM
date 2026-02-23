'use client'

import { useState } from 'react'
import { getStates, getCitiesByState, validateMobileNumber } from '@/lib/master-data'

export default function SimpleInsuranceQuotesPage() {
  const [states] = useState(getStates())
  const [cities, setCities] = useState(getCitiesByState(''))
  const [selectedState, setSelectedState] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [phone, setPhone] = useState('')
  const [mobileError, setMobileError] = useState('')
  const [customerData, setCustomerData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  })

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stateId = e.target.value
    const state = states.find(s => s.id === stateId)
    
    setSelectedState(stateId)
    setSelectedCity('')
    
    if (state) {
      setCities(getCitiesByState(stateId))
      setCustomerData(prev => ({
        ...prev,
        state: state.name,
        city: '',
        zipCode: ''
      }))
    }
  }

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityId = e.target.value
    const city = cities.find(c => c.id === cityId)
    
    setSelectedCity(cityId)
    
    if (city) {
      setCustomerData(prev => ({
        ...prev,
        city: city.name,
        zipCode: city.pincode || ''
      }))
    }
  }

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const cleanedValue = value.replace(/\D/g, '')
    
    if (cleanedValue.length <= 10) {
      setPhone(cleanedValue)
      setCustomerData(prev => ({
        ...prev,
        phone: cleanedValue
      }))
      
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCustomerData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Insurance Quotation - Customer Information
          </h1>
          
          <div className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={customerData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter first name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={customerData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter last name"
                  required
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={customerData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter email address"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <div>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm font-medium">
                      +91
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      value={phone}
                      onChange={handleMobileChange}
                      className="flex-1 border border-gray-300 rounded-r-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="9876543210"
                      maxLength={10}
                      required
                    />
                  </div>
                  {mobileError && (
                    <p className="text-red-600 text-xs mt-1">{mobileError}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Enter 10-digit mobile number (starts with 6, 7, 8, or 9)
                  </p>
                </div>
              </div>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth *
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={customerData.dateOfBirth}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <textarea
                name="address"
                value={customerData.address}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter complete address"
                required
              />
            </div>

            {/* Location - State and City */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <select
                  value={selectedState}
                  onChange={handleStateChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state.id} value={state.id}>
                      {state.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {states.length} states available
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <select
                  value={selectedCity}
                  onChange={handleCityChange}
                  disabled={!selectedState}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  required
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {selectedState ? `${cities.length} cities available` : 'Select state first'}
                </p>
              </div>
            </div>

            {/* Debug Information */}
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Debug Information:</h3>
              <div className="text-sm text-blue-800 space-y-1">
                <p><strong>Selected State:</strong> {selectedState || 'None'}</p>
                <p><strong>Selected City:</strong> {selectedCity || 'None'}</p>
                <p><strong>Phone:</strong> {phone || 'None'} (Length: {phone.length})</p>
                <p><strong>Mobile Error:</strong> {mobileError || 'None'}</p>
                <p><strong>States Available:</strong> {states.length}</p>
                <p><strong>Cities Available:</strong> {cities.length}</p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <button
                type="button"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                onClick={() => {
                  alert('Form submitted! Check console for data.')
                  console.log('Customer Data:', customerData)
                }}
              >
                Continue to Policy Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}












