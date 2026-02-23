'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useLocation } from '@/contexts/LocationContext'
import { 
  TruckIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  MapPinIcon,
  CalendarIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline'
import { 
  getOEMs, 
  getModelsByOEM, 
  getVariantsByModel, 
  getValidYears, 
  getStates, 
  getCitiesByState,
  validateMobileNumber,
  formatMobileNumber
} from '@/lib/master-data'

export default function PolicyDetailsPage() {
  const { location } = useLocation()
  const searchParams = useSearchParams()
  const policyId = searchParams.get('policy')
  
  const [step, setStep] = useState(1)
  const [states, setStates] = useState(getStates())
  const [cities, setCities] = useState(getCitiesByState(''))
  const [oems, setOems] = useState(getOEMs())
  const [models, setModels] = useState<any[]>([])
  const [variants, setVariants] = useState<any[]>([])
  const [selectedState, setSelectedState] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedOEM, setSelectedOEM] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [selectedVariant, setSelectedVariant] = useState('')
  const [mobileError, setMobileError] = useState('')
  const [isNewVehicle, setIsNewVehicle] = useState(true)
  
  const [policyData, setPolicyData] = useState({
    // Customer Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    
    // Vehicle Information
    vehicleType: 'new', // 'new' or 'rollover'
    oemId: '',
    oemName: '',
    modelId: '',
    modelName: '',
    variantId: '',
    variantName: '',
    yearOfManufacture: '',
    registrationNumber: '',
    chassisNumber: '',
    engineNumber: '',
    fuelType: '',
    cubicCapacity: '',
    seatingCapacity: '',
    
    // Policy Information
    policyType: 'comprehensive',
    coverageAmount: '',
    addOns: [],
    
    // Registration Information
    registrationDate: '',
    registrationCity: '',
    registrationState: '',
    
    // Previous Policy Information (for rollover)
    previousPolicyNumber: '',
    previousInsuranceCompany: '',
    ncbPercentage: '0',
    claimHistory: 'no'
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setPolicyData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stateId = e.target.value
    const state = states.find(s => s.id === stateId)
    
    setSelectedState(stateId)
    setSelectedCity('')
    
    if (state) {
      setCities(getCitiesByState(stateId))
      setPolicyData(prev => ({
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
      setPolicyData(prev => ({
        ...prev,
        city: city.name,
        zipCode: city.pincode || ''
      }))
    }
  }

  const handleOEMChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const oemId = e.target.value
    const oem = oems.find(o => o.id === oemId)
    
    setSelectedOEM(oemId)
    setSelectedModel('')
    setSelectedVariant('')
    
    if (oem) {
      const oemModels = getModelsByOEM(oemId)
      setModels(oemModels)
      setVariants([])
      setPolicyData(prev => ({
        ...prev,
        oemId: oem.id,
        oemName: oem.name,
        modelId: '',
        modelName: '',
        variantId: '',
        variantName: ''
      }))
    }
  }

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const modelId = e.target.value
    const model = models.find(m => m.id === modelId)
    
    setSelectedModel(modelId)
    setSelectedVariant('')
    
    if (model) {
      const modelVariants = getVariantsByModel(modelId)
      setVariants(modelVariants)
      setPolicyData(prev => ({
        ...prev,
        modelId: model.id,
        modelName: model.name,
        variantId: '',
        variantName: ''
      }))
    }
  }

  const handleVariantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const variantId = e.target.value
    const variant = variants.find(v => v.id === variantId)
    
    setSelectedVariant(variantId)
    
    if (variant) {
      setPolicyData(prev => ({
        ...prev,
        variantId: variant.id,
        variantName: variant.name,
        fuelType: variant.fuelType,
        cubicCapacity: variant.cubicCapacity.toString(),
        seatingCapacity: variant.seatingCapacity.toString()
      }))
    }
  }

  const handleVehicleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const vehicleType = e.target.value
    setIsNewVehicle(vehicleType === 'new')
    setPolicyData(prev => ({
      ...prev,
      vehicleType,
      yearOfManufacture: ''
    }))
  }

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const cleanedValue = value.replace(/\D/g, '') // Remove non-digits
    
    // Limit to 10 digits
    if (cleanedValue.length <= 10) {
      setPolicyData(prev => ({
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

  const getValidYearsForVehicle = () => {
    return getValidYears(isNewVehicle)
  }

  const getStepIcon = (stepNumber: number) => {
    if (stepNumber < step) {
      return <CheckCircleIcon className="h-6 w-6 text-green-500" />
    } else if (stepNumber === step) {
      return <ClockIcon className="h-6 w-6 text-blue-500" />
    } else {
      return <div className="h-6 w-6 rounded-full border-2 border-gray-300" />
    }
  }

  const handleNext = () => {
    setStep(step + 1)
  }

  const handlePrevious = () => {
    setStep(step - 1)
  }

  const handleSubmit = () => {
    // Handle form submission
    console.log('Policy data submitted:', policyData)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Link
            href="/customer"
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Policy Details</h1>
        <p className="text-gray-600 mt-2">Complete your policy information</p>
        {location && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <MapPinIcon className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-sm text-blue-900">
                Policy for {location.city}, {location.state}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStepIcon(1)}
            <span className={`text-sm font-medium ${step >= 1 ? 'text-blue-600' : 'text-gray-500'}`}>
              Customer Info
            </span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-200 mx-4">
            <div className={`h-full ${step > 1 ? 'bg-blue-600' : 'bg-gray-200'}`} />
          </div>
          <div className="flex items-center space-x-2">
            {getStepIcon(2)}
            <span className={`text-sm font-medium ${step >= 2 ? 'text-blue-600' : 'text-gray-500'}`}>
              Vehicle Details
            </span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-200 mx-4">
            <div className={`h-full ${step > 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
          </div>
          <div className="flex items-center space-x-2">
            {getStepIcon(3)}
            <span className={`text-sm font-medium ${step >= 3 ? 'text-blue-600' : 'text-gray-500'}`}>
              Review & Submit
            </span>
          </div>
        </div>
      </div>

      {/* Step 1: Customer Information */}
      {step === 1 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Customer Information</h2>
          
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={policyData.firstName}
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
                  value={policyData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter last name"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={policyData.email}
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
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      +91
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      value={policyData.phone}
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
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth *
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={policyData.dateOfBirth}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <textarea
                name="address"
                value={policyData.address}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter complete address"
                required
              />
            </div>

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
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next: Vehicle Details
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Step 2: Vehicle Details */}
      {step === 2 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Vehicle Details</h2>
          
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Type *
              </label>
              <select
                name="vehicleType"
                value={policyData.vehicleType}
                onChange={handleVehicleTypeChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="new">New Vehicle</option>
                <option value="rollover">Rollover (Existing Vehicle)</option>
              </select>
              <p className="text-sm text-gray-500 mt-1">
                {isNewVehicle 
                  ? 'For new vehicles, year of manufacture will be limited to current and previous year only.'
                  : 'For rollover vehicles, year of manufacture can be current year and up to 13 years back.'
                }
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OEM (Manufacturer) *
                </label>
                <select
                  value={selectedOEM}
                  onChange={handleOEMChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select OEM</option>
                  {oems.map((oem) => (
                    <option key={oem.id} value={oem.id}>
                      {oem.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Model *
                </label>
                <select
                  value={selectedModel}
                  onChange={handleModelChange}
                  disabled={!selectedOEM}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  required
                >
                  <option value="">Select Model</option>
                  {models.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Variant *
                </label>
                <select
                  value={selectedVariant}
                  onChange={handleVariantChange}
                  disabled={!selectedModel}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  required
                >
                  <option value="">Select Variant</option>
                  {variants.map((variant) => (
                    <option key={variant.id} value={variant.id}>
                      {variant.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedVariant && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fuel Type
                  </label>
                  <input
                    type="text"
                    value={policyData.fuelType}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    readOnly
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cubic Capacity (CC)
                  </label>
                  <input
                    type="text"
                    value={policyData.cubicCapacity}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    readOnly
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seating Capacity
                  </label>
                  <input
                    type="text"
                    value={policyData.seatingCapacity}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    readOnly
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year of Manufacture *
              </label>
              <select
                name="yearOfManufacture"
                value={policyData.yearOfManufacture}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Year</option>
                {getValidYearsForVehicle().map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Number *
                </label>
                <input
                  type="text"
                  name="registrationNumber"
                  value={policyData.registrationNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., MH-12-AB-1234"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Date *
                </label>
                <input
                  type="date"
                  name="registrationDate"
                  value={policyData.registrationDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chassis Number *
                </label>
                <input
                  type="text"
                  name="chassisNumber"
                  value={policyData.chassisNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter chassis number"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Engine Number *
                </label>
                <input
                  type="text"
                  name="engineNumber"
                  value={policyData.engineNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter engine number"
                  required
                />
              </div>
            </div>

            {!isNewVehicle && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-yellow-800 mb-4">Previous Policy Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Previous Policy Number *
                    </label>
                    <input
                      type="text"
                      name="previousPolicyNumber"
                      value={policyData.previousPolicyNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter previous policy number"
                      required={!isNewVehicle}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Previous Insurance Company *
                    </label>
                    <input
                      type="text"
                      name="previousInsuranceCompany"
                      value={policyData.previousInsuranceCompany}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter insurance company name"
                      required={!isNewVehicle}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      NCB Percentage
                    </label>
                    <select
                      name="ncbPercentage"
                      value={policyData.ncbPercentage}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="0">0% (No Claims)</option>
                      <option value="20">20% (1 Year NCB)</option>
                      <option value="25">25% (2 Years NCB)</option>
                      <option value="35">35% (3 Years NCB)</option>
                      <option value="45">45% (4 Years NCB)</option>
                      <option value="50">50% (5+ Years NCB)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Claim History
                    </label>
                    <select
                      name="claimHistory"
                      value={policyData.claimHistory}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="no">No Claims</option>
                      <option value="yes">Has Claims</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between">
              <button
                type="button"
                onClick={handlePrevious}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next: Review & Submit
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Step 3: Review & Submit */}
      {step === 3 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Review & Submit</h2>
          
          <div className="space-y-6">
            {/* Customer Information Summary */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Customer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-blue-800"><strong>Name:</strong> {policyData.firstName} {policyData.lastName}</p>
                  <p className="text-sm text-blue-800"><strong>Email:</strong> {policyData.email}</p>
                  <p className="text-sm text-blue-800"><strong>Phone:</strong> {formatMobileNumber(policyData.phone)}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-800"><strong>DOB:</strong> {policyData.dateOfBirth}</p>
                  <p className="text-sm text-blue-800"><strong>Address:</strong> {policyData.address}</p>
                  <p className="text-sm text-blue-800"><strong>Location:</strong> {policyData.city}, {policyData.state} - {policyData.zipCode}</p>
                </div>
              </div>
            </div>

            {/* Vehicle Information Summary */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-green-900 mb-4">Vehicle Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-green-800"><strong>Vehicle Type:</strong> {isNewVehicle ? 'New Vehicle' : 'Rollover Vehicle'}</p>
                  <p className="text-sm text-green-800"><strong>OEM:</strong> {policyData.oemName}</p>
                  <p className="text-sm text-green-800"><strong>Model:</strong> {policyData.modelName}</p>
                  <p className="text-sm text-green-800"><strong>Variant:</strong> {policyData.variantName}</p>
                </div>
                <div>
                  <p className="text-sm text-green-800"><strong>Year of Manufacture:</strong> {policyData.yearOfManufacture}</p>
                  <p className="text-sm text-green-800"><strong>Registration Number:</strong> {policyData.registrationNumber}</p>
                  <p className="text-sm text-green-800"><strong>Fuel Type:</strong> {policyData.fuelType}</p>
                  <p className="text-sm text-green-800"><strong>Engine CC:</strong> {policyData.cubicCapacity} CC</p>
                </div>
              </div>
            </div>

            {/* Previous Policy Information (if applicable) */}
            {!isNewVehicle && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-yellow-900 mb-4">Previous Policy Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-yellow-800"><strong>Previous Policy Number:</strong> {policyData.previousPolicyNumber}</p>
                    <p className="text-sm text-yellow-800"><strong>Previous Insurance Company:</strong> {policyData.previousInsuranceCompany}</p>
                  </div>
                  <div>
                    <p className="text-sm text-yellow-800"><strong>NCB Percentage:</strong> {policyData.ncbPercentage}%</p>
                    <p className="text-sm text-yellow-800"><strong>Claim History:</strong> {policyData.claimHistory === 'no' ? 'No Claims' : 'Has Claims'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Terms and Conditions */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Terms and Conditions</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p>• I confirm that all information provided is accurate and complete.</p>
                <p>• I understand that any false information may result in policy cancellation.</p>
                <p>• I agree to the terms and conditions of the insurance policy.</p>
                <p>• I consent to the processing of my personal data for policy issuance.</p>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={handlePrevious}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Submit Policy Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

