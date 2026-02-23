'use client'

import { useState, useEffect } from 'react'
import { 
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { getStates, getCitiesByState, validateMobileNumber, formatMobileNumber } from '@/lib/master-data'

export default function CustomerProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [states, setStates] = useState(getStates())
  const [cities, setCities] = useState(getCitiesByState(''))
  const [selectedState, setSelectedState] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [mobileError, setMobileError] = useState('')
  
  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+91-9876543210',
    dateOfBirth: '1985-06-15',
    address: '123 Main Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    zipCode: '400001',
    country: 'India',
    emergencyContact: {
      name: 'Jane Doe',
      phone: '+91-9876543211',
      relationship: 'Spouse'
    }
  })

  const [formData, setFormData] = useState(profile)

  useEffect(() => {
    // Initialize state and city based on profile data
    const state = states.find(s => s.name === profile.state)
    if (state) {
      setSelectedState(state.id)
      setCities(getCitiesByState(state.id))
      const city = state.cities.find(c => c.name === profile.city)
      if (city) {
        setSelectedCity(city.id)
      }
    }
  }, [profile.state, profile.city, states])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stateId = e.target.value
    const state = states.find(s => s.id === stateId)
    
    setSelectedState(stateId)
    setSelectedCity('')
    
    if (state) {
      setCities(getCitiesByState(stateId))
      setFormData(prev => ({
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
      setFormData(prev => ({
        ...prev,
        city: city.name,
        zipCode: city.pincode || ''
      }))
    }
  }

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const cleanedValue = value.replace(/\D/g, '') // Remove non-digits
    
    // Limit to 10 digits
    if (cleanedValue.length <= 10) {
      setFormData(prev => ({
        ...prev,
        phone: cleanedValue
      }))
      
      // Validate mobile number
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

  const handleSave = () => {
    setProfile(formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData(profile)
    setIsEditing(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">Manage your personal information and preferences</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <PencilIcon className="h-4 w-4" />
          <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
        </button>
      </div>

      {/* Profile Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-6 mb-8">
          <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center">
            <UserIcon className="h-10 w-10 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {isEditing ? (
                <div className="flex space-x-2">
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded px-2 py-1"
                  />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded px-2 py-1"
                  />
                </div>
              ) : (
                `${profile.firstName} ${profile.lastName}`
              )}
            </h2>
            <p className="text-gray-600">Customer since {formatDate('2023-01-15')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{profile.email}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              {isEditing ? (
                <div>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      +91
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleMobileChange}
                      className="flex-1 border border-gray-300 rounded-r-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="9876543210"
                      maxLength={10}
                    />
                  </div>
                  {mobileError && (
                    <p className="text-red-600 text-xs mt-1">{mobileError}</p>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <PhoneIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{formatMobileNumber(profile.phone)}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              {isEditing ? (
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{formatDate(profile.dateOfBirth)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Address Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <MapPinIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{profile.address}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                {isEditing ? (
                  <select
                    value={selectedState}
                    onChange={handleStateChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state.id} value={state.id}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="text-gray-900">{profile.state}</span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                {isEditing ? (
                  <select
                    value={selectedCity}
                    onChange={handleCityChange}
                    disabled={!selectedState}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  >
                    <option value="">Select City</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="text-gray-900">{profile.city}</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <span className="text-gray-900">{profile.zipCode}</span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <span className="text-gray-900">{profile.country}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="emergencyContact.name"
                  value={formData.emergencyContact.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <span className="text-gray-900">{profile.emergencyContact.name}</span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="emergencyContact.phone"
                  value={formData.emergencyContact.phone}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <span className="text-gray-900">{profile.emergencyContact.phone}</span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
              {isEditing ? (
                <input
                  type="text"
                  name="emergencyContact.relationship"
                  value={formData.emergencyContact.relationship}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <span className="text-gray-900">{profile.emergencyContact.relationship}</span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="mt-8 flex justify-end space-x-4">
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <XMarkIcon className="h-4 w-4" />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <CheckIcon className="h-4 w-4" />
              <span>Save Changes</span>
            </button>
          </div>
        )}
      </div>

      {/* Account Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Change Password</h4>
              <p className="text-sm text-gray-600">Update your account password</p>
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Change Password
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-600">Add an extra layer of security</p>
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Enable 2FA
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Email Notifications</h4>
              <p className="text-sm text-gray-600">Manage your notification preferences</p>
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Manage Notifications
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
