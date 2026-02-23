'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon, MagnifyingGlassIcon, DocumentIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

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

export default function EnhancedEndorsementPage() {
  const router = useRouter()
  const [policyType, setPolicyType] = useState<'motor' | 'health' | 'life'>('motor')
  const [searchType, setSearchType] = useState<'policy' | 'chassis' | 'registration' | 'mobile' | 'company' | 'pan'>('policy')
  const [searchValue, setSearchValue] = useState('')
  const [searchResults, setSearchResults] = useState<PolicyData[]>([])
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyData | null>(null)
  const [endorsementType, setEndorsementType] = useState<'nil' | 'non-nil'>('nil')
  const [isSearching, setIsSearching] = useState(false)

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
  }

  const handleEndorsementTypeSelection = (type: 'nil' | 'non-nil') => {
    setEndorsementType(type)
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
          <h1 className="text-2xl font-bold text-gray-900">Enhanced Endorsement Process</h1>
          <p className="text-gray-600 mt-2">
            Policy endorsement with advanced search and type-specific workflows
          </p>
        </div>

        {/* Step 1: Policy Type Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Step 1: Select Policy Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { type: 'motor', label: 'Motor', description: 'Motor vehicle insurance policies' },
              { type: 'health', label: 'Health', description: 'Health insurance policies' },
              { type: 'life', label: 'Life', description: 'Life insurance policies' }
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

        {/* Step 3: Endorsement Type Selection */}
        {selectedPolicy && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Step 3: Select Endorsement Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => handleEndorsementTypeSelection('nil')}
                className={`p-6 rounded-lg border-2 transition-all ${
                  endorsementType === 'nil'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h3 className="font-semibold text-lg">NIL Endorsement</h3>
                <p className="text-sm mt-2">Corrections in issued policy with no premium payment</p>
                <ul className="text-xs mt-2 space-y-1">
                  <li>• Name corrections</li>
                  <li>• Address corrections</li>
                  <li>• Phone/Email corrections</li>
                  <li>• Bank details corrections</li>
                </ul>
              </button>
              
              <button
                onClick={() => handleEndorsementTypeSelection('non-nil')}
                className={`p-6 rounded-lg border-2 transition-all ${
                  endorsementType === 'non-nil'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h3 className="font-semibold text-lg">Non-NIL Endorsement</h3>
                <p className="text-sm mt-2">Changes requiring premium payment</p>
                <ul className="text-xs mt-2 space-y-1">
                  <li>• Coverage increase/decrease</li>
                  <li>• Beneficiary changes</li>
                  <li>• Policy modifications</li>
                  <li>• KYC may be required</li>
                </ul>
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Process Endorsement */}
        {selectedPolicy && endorsementType && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Step 4: Process Endorsement</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h3 className="font-medium text-blue-900 mb-2">Selected Policy Details</h3>
              <div className="text-sm text-blue-800">
                <p><strong>Policy Number:</strong> {selectedPolicy.policyNumber}</p>
                <p><strong>Insured Name:</strong> {selectedPolicy.insuredName}</p>
                <p><strong>Policy Type:</strong> {policyType.toUpperCase()}</p>
                <p><strong>Endorsement Type:</strong> {endorsementType.toUpperCase()}</p>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  if (endorsementType === 'nil') {
                    router.push('/dashboard/endorsement/nil-endorsement')
                  } else {
                    router.push('/dashboard/endorsement/non-nil-endorsement')
                  }
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Continue to {endorsementType === 'nil' ? 'NIL' : 'Non-NIL'} Endorsement
              </button>
              
              <button
                onClick={() => {
                  setSelectedPolicy(null)
                  setEndorsementType('nil')
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






