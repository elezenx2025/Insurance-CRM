'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon, MagnifyingGlassIcon, ExclamationTriangleIcon, DocumentIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

interface PolicyData {
  policyNumber: string
  insuredName: string
  companyName?: string
  chassisNumber?: string
  registrationNumber?: string
  mobileNumber: string
  panNumber: string
  odDuration?: string
  tpDuration?: string
  ncb?: string
  vb64Status: string
  previousClaimHistory: string[]
  policyType: 'motor' | 'health' | 'life'
}

interface ClaimIntimationData {
  accidentDate: string
  accidentPlace: string
  vehicleRunningCondition: boolean
  needVehicleTowing: boolean
  firRegistered: boolean
  majorCasualty: boolean
  thirdPartyImpacted: boolean
}

export default function EnhancedClaimsPage() {
  const router = useRouter()
  const [policyType, setPolicyType] = useState<'motor' | 'health' | 'life'>('motor')
  const [searchType, setSearchType] = useState<'policy' | 'chassis' | 'registration' | 'mobile' | 'company' | 'pan'>('policy')
  const [searchValue, setSearchValue] = useState('')
  const [searchResults, setSearchResults] = useState<PolicyData[]>([])
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyData | null>(null)
  const [claimIntimationData, setClaimIntimationData] = useState<ClaimIntimationData>({
    accidentDate: '',
    accidentPlace: '',
    vehicleRunningCondition: false,
    needVehicleTowing: false,
    firRegistered: false,
    majorCasualty: false,
    thirdPartyImpacted: false
  })
  const [isSearching, setIsSearching] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  const handleBack = () => {
    router.push('/dashboard')
  }

  const handleSearch = async () => {
    if (!searchValue.trim()) {
      alert('Please enter a search value')
      return
    }

    setIsSearching(true)
    
    // Mock search results based on policy type
    const mockResults: PolicyData[] = [
      {
        policyNumber: 'POL-001',
        insuredName: 'John Smith',
        companyName: 'ABC Corp',
        chassisNumber: 'CH123456789',
        registrationNumber: 'MH01AB1234',
        mobileNumber: '9876543210',
        panNumber: 'ABCDE1234F',
        odDuration: '2024-01-01 to 2025-01-01',
        tpDuration: '2024-01-01 to 2025-01-01',
        ncb: '20%',
        vb64Status: 'Verified',
        previousClaimHistory: ['Claim-001 (2023-06-15)'],
        policyType: policyType
      }
    ]

    setTimeout(() => {
      setSearchResults(mockResults)
      setIsSearching(false)
    }, 1000)
  }

  const handlePolicySelection = (policy: PolicyData) => {
    setSelectedPolicy(policy)
    setCurrentStep(2)
  }

  const handleClaimIntimationSubmit = () => {
    if (!claimIntimationData.accidentDate || !claimIntimationData.accidentPlace) {
      alert('Please fill in all mandatory fields')
      return
    }

    // Simulate API call to insurance company
    alert('Claim intimation submitted to insurance company successfully!')
    router.push('/dashboard/claims/intimation')
  }

  const getSearchPlaceholder = () => {
    switch (searchType) {
      case 'policy': return 'Enter Policy Number'
      case 'chassis': return 'Enter Chassis Number'
      case 'registration': return 'Enter Registration Number'
      case 'mobile': return 'Enter Mobile Number'
      case 'company': return 'Enter Company Name'
      case 'pan': return 'Enter PAN Number'
      default: return 'Enter search value'
    }
  }

  const getSearchOptions = () => {
    if (policyType === 'motor') {
      return [
        { value: 'policy', label: 'Policy Number' },
        { value: 'chassis', label: 'Chassis Number' },
        { value: 'registration', label: 'Registration Number' },
        { value: 'mobile', label: 'Mobile Number' },
        { value: 'company', label: 'Company Name' },
        { value: 'pan', label: 'PAN Number' }
      ]
    } else {
      return [
        { value: 'policy', label: 'Policy Number' },
        { value: 'mobile', label: 'Mobile Number' },
        { value: 'company', label: 'Company Name' },
        { value: 'pan', label: 'PAN Number' }
      ]
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Dashboard
            </button>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Enhanced Claims Process</h1>
          <p className="text-gray-600 mt-2">
            Claims intimation with advanced search and type-specific workflows
          </p>
        </div>

        {/* Step 1: Policy Type Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Step 1: Select Policy Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { type: 'motor', label: 'Motor', description: 'Motor vehicle insurance claims' },
              { type: 'health', label: 'Health', description: 'Health insurance claims' },
              { type: 'life', label: 'Life', description: 'Life insurance claims' }
            ].map(({ type, label, description }) => (
              <button
                key={type}
                onClick={() => setPolicyType(type as 'motor' | 'health' | 'life')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  policyType === type
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h3 className="font-semibold">{label}</h3>
                <p className="text-sm text-gray-600 mt-1">{description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Policy Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Step 2: Search Policy</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search By
              </label>
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value as any)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {getSearchOptions().map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Value
              </label>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={getSearchPlaceholder()}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center justify-center"
              >
                {isSearching ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                    Search
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Search Results</h2>
            <div className="space-y-4">
              {searchResults.map((policy, index) => (
                <div
                  key={index}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedPolicy?.policyNumber === policy.policyNumber
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handlePolicySelection(policy)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{policy.policyNumber}</h3>
                      <p className="text-sm text-gray-600">{policy.insuredName}</p>
                      {policy.companyName && (
                        <p className="text-sm text-gray-600">Company: {policy.companyName}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {policy.vb64Status}
                      </span>
                    </div>
                  </div>
                  
                  {policyType === 'motor' && (
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Chassis:</span>
                        <span className="ml-1">{policy.chassisNumber}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Registration:</span>
                        <span className="ml-1">{policy.registrationNumber}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">OD Duration:</span>
                        <span className="ml-1">{policy.odDuration}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">TP Duration:</span>
                        <span className="ml-1">{policy.tpDuration}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">NCB:</span>
                        <span className="ml-1">{policy.ncb}</span>
                      </div>
                    </div>
                  )}
                  
                  {policy.previousClaimHistory.length > 0 && (
                    <div className="mt-2">
                      <span className="text-sm text-gray-500">Previous Claims:</span>
                      <div className="text-sm text-gray-700">
                        {policy.previousClaimHistory.map((claim, idx) => (
                          <span key={idx} className="block">{claim}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Claim Intimation (Motor Only) */}
        {selectedPolicy && policyType === 'motor' && currentStep === 2 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Step 3: Motor Claim Intimation</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-yellow-900">Mandatory Information Required</h3>
                  <p className="text-sm text-yellow-800 mt-1">
                    Please provide the following mandatory information for claim intimation:
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Accident Date *
                </label>
                <input
                  type="date"
                  value={claimIntimationData.accidentDate}
                  onChange={(e) => setClaimIntimationData(prev => ({ ...prev, accidentDate: e.target.value }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Accident Place *
                </label>
                <input
                  type="text"
                  value={claimIntimationData.accidentPlace}
                  onChange={(e) => setClaimIntimationData(prev => ({ ...prev, accidentPlace: e.target.value }))}
                  placeholder="Enter accident location"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Additional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="vehicleRunning"
                      checked={claimIntimationData.vehicleRunningCondition}
                      onChange={(e) => setClaimIntimationData(prev => ({ ...prev, vehicleRunningCondition: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="vehicleRunning" className="ml-2 block text-sm text-gray-900">
                      Vehicle is under running condition
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="needTowing"
                      checked={claimIntimationData.needVehicleTowing}
                      onChange={(e) => setClaimIntimationData(prev => ({ ...prev, needVehicleTowing: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="needTowing" className="ml-2 block text-sm text-gray-900">
                      Need for vehicle towing
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="firRegistered"
                      checked={claimIntimationData.firRegistered}
                      onChange={(e) => setClaimIntimationData(prev => ({ ...prev, firRegistered: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="firRegistered" className="ml-2 block text-sm text-gray-900">
                      FIR registered
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="majorCasualty"
                      checked={claimIntimationData.majorCasualty}
                      onChange={(e) => setClaimIntimationData(prev => ({ ...prev, majorCasualty: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="majorCasualty" className="ml-2 block text-sm text-gray-900">
                      Major casualty
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="thirdPartyImpacted"
                      checked={claimIntimationData.thirdPartyImpacted}
                      onChange={(e) => setClaimIntimationData(prev => ({ ...prev, thirdPartyImpacted: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="thirdPartyImpacted" className="ml-2 block text-sm text-gray-900">
                      Third party impacted
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex space-x-4">
              <button
                onClick={handleClaimIntimationSubmit}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Submit Claim Intimation
              </button>
              
              <button
                onClick={() => {
                  setSelectedPolicy(null)
                  setCurrentStep(1)
                  setSearchResults([])
                  setSearchValue('')
                }}
                className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Start Over
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Health/Life Claim Intimation */}
        {selectedPolicy && (policyType === 'health' || policyType === 'life') && currentStep === 2 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Step 3: {policyType.toUpperCase()} Claim Intimation</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h3 className="font-medium text-blue-900 mb-2">Selected Policy Details</h3>
              <div className="text-sm text-blue-800">
                <p><strong>Policy Number:</strong> {selectedPolicy.policyNumber}</p>
                <p><strong>Insured Name:</strong> {selectedPolicy.insuredName}</p>
                <p><strong>Policy Type:</strong> {policyType.toUpperCase()}</p>
                {selectedPolicy.previousClaimHistory.length > 0 && (
                  <div>
                    <p><strong>Previous Claims:</strong></p>
                    <ul className="list-disc list-inside ml-4">
                      {selectedPolicy.previousClaimHistory.map((claim, idx) => (
                        <li key={idx}>{claim}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={() => router.push('/dashboard/claims/intimation')}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Continue to Claim Intimation
              </button>
              
              <button
                onClick={() => {
                  setSelectedPolicy(null)
                  setCurrentStep(1)
                  setSearchResults([])
                  setSearchValue('')
                }}
                className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Start Over
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}






