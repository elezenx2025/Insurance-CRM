'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeftIcon, DocumentIcon, UserIcon, BuildingOfficeIcon, CheckCircleIcon, ExclamationTriangleIcon, CloudArrowUpIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { ContextualDocumentManager } from '@/components/documents/ContextualDocumentManager'
import toast from 'react-hot-toast'

const intimationSchema = z.object({
  policyNumber: z.string().min(1, 'Policy number is required'),
  customerType: z.enum(['INDIVIDUAL', 'CORPORATE']),
  // Individual fields
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  // Corporate fields
  companyName: z.string().optional(),
  registrationNumber: z.string().optional(),
  // Common fields
  email: z.string().email(),
  phone: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  pincode: z.string(),
  // Claim details
  claimType: z.string(),
  incidentDate: z.string(),
  incidentLocation: z.string(),
  incidentDescription: z.string(),
  estimatedLoss: z.number(),
  // API integration status
  apiIntegrationEnabled: z.boolean().default(false),
  insuranceCompanyResponse: z.string().optional()
})

type IntimationFormData = z.infer<typeof intimationSchema>

export default function ClaimIntimationPage() {
  const router = useRouter()
  const [showDocuments, setShowDocuments] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiResponse, setApiResponse] = useState<any>(null)
  const [policyType, setPolicyType] = useState<'motor' | 'health' | 'life'>('motor')
  const [searchType, setSearchType] = useState<'policy' | 'chassis' | 'registration' | 'mobile' | 'company' | 'pan'>('policy')
  const [searchValue, setSearchValue] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [selectedPolicy, setSelectedPolicy] = useState<any>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [claimIntimationData, setClaimIntimationData] = useState({
    accidentDate: '',
    accidentPlace: '',
    vehicleRunningCondition: false,
    needVehicleTowing: false,
    firRegistered: false,
    majorCasualty: false,
    thirdPartyImpacted: false
  })

  const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(intimationSchema),
    defaultValues: {
      customerType: 'INDIVIDUAL',
      apiIntegrationEnabled: false
    }
  })

  const customerType = watch('customerType')
  const apiIntegrationEnabled = watch('apiIntegrationEnabled')

  const handleBack = () => {
    router.push('/dashboard/postsale/claims')
  }

  const handleSearch = async () => {
    if (!searchValue.trim()) {
      alert('Please enter a search value')
      return
    }

    setIsSearching(true)
    
    // Mock search results based on policy type
    const mockResults = [
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

  const handlePolicySelection = (policy: any) => {
    setSelectedPolicy(policy)
    setValue('policyNumber', policy.policyNumber)
    setCurrentStep(2)
  }

  const handleClaimIntimationSubmit = () => {
    if (policyType === 'motor') {
      if (!claimIntimationData.accidentDate || !claimIntimationData.accidentPlace) {
        alert('Please fill in all mandatory fields for motor claims')
        return
      }
    }
    
    // Simulate API call to insurance company
    alert('Claim intimation submitted to insurance company successfully!')
    setCurrentStep(3)
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

  const handleDocuments = () => {
    setShowDocuments(true)
  }

  const onSubmit = async (data: IntimationFormData) => {
    setIsSubmitting(true)
    try {
      if (data.apiIntegrationEnabled) {
        // Mock API call to insurance company
        await new Promise(resolve => setTimeout(resolve, 3000))
        const mockResponse = {
          claimId: 'CLM-' + Date.now().toString().slice(-6),
          status: 'SUBMITTED',
          referenceNumber: 'REF-' + Date.now().toString().slice(-8),
          message: 'Claim intimation submitted successfully to insurance company',
          nextSteps: ['Surveyor Assessment', 'Document Verification', 'Approval Process']
        }
        setApiResponse(mockResponse)
        setValue('insuranceCompanyResponse', JSON.stringify(mockResponse))
        toast.success('Claim intimation submitted to insurance company successfully!')
      } else {
        // Manual process
        await new Promise(resolve => setTimeout(resolve, 2000))
        toast.success('Claim intimation recorded for manual processing!')
      }
      setCurrentStep(4)
    } catch (error) {
      toast.error('Failed to submit claim intimation')
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const getStepStatus = (step: number) => {
    if (step < currentStep) return 'completed'
    if (step === currentStep) return 'current'
    return 'upcoming'
  }

  const getStepIcon = (step: number) => {
    const status = getStepStatus(step)
    if (status === 'completed') return <CheckCircleIcon className="h-5 w-5 text-green-500" />
    if (status === 'current') return <ExclamationTriangleIcon className="h-5 w-5 text-blue-500" />
    return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
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
              Back to Claims
            </button>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Claim Intimation</h1>
          <p className="text-gray-600 mt-2">
            Submit claim intimation request to insurance company with API integration
          </p>
        </div>

        {/* Step 1: Policy Type Selection */}
        {currentStep === 1 && (
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
        )}

        {/* Step 2: Policy Search */}
        {currentStep === 1 && (
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
                    'Search'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && currentStep === 1 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Search Results</h2>
            <div className="space-y-4">
              {searchResults.map((policy, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-all"
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
                        {policy.previousClaimHistory.map((claim: string, idx: number) => (
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

        {/* Display Selected Policy Data */}
        {selectedPolicy && currentStep === 2 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Selected Policy Information</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-blue-800"><strong>Policy Number:</strong> {selectedPolicy.policyNumber}</p>
                  <p className="text-sm text-blue-800"><strong>Insured Name:</strong> {selectedPolicy.insuredName}</p>
                  {selectedPolicy.companyName && (
                    <p className="text-sm text-blue-800"><strong>Company Name:</strong> {selectedPolicy.companyName}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-blue-800"><strong>64VB Status:</strong> {selectedPolicy.vb64Status}</p>
                  {policyType === 'motor' && (
                    <>
                      <p className="text-sm text-blue-800"><strong>Chassis Number:</strong> {selectedPolicy.chassisNumber}</p>
                      <p className="text-sm text-blue-800"><strong>Registration Number:</strong> {selectedPolicy.registrationNumber}</p>
                    </>
                  )}
                </div>
              </div>
              
              {policyType === 'motor' && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-blue-800"><strong>OD Duration:</strong> {selectedPolicy.odDuration}</p>
                    <p className="text-sm text-blue-800"><strong>TP Duration:</strong> {selectedPolicy.tpDuration}</p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-800"><strong>NCB:</strong> {selectedPolicy.ncb}</p>
                  </div>
                </div>
              )}
              
              {selectedPolicy.previousClaimHistory.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-blue-800"><strong>Previous Claim History:</strong></p>
                  <ul className="text-sm text-blue-800 ml-4">
                    {selectedPolicy.previousClaimHistory.map((claim: string, idx: number) => (
                      <li key={idx} className="list-disc">{claim}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Motor Claim Intimation Form */}
        {selectedPolicy && policyType === 'motor' && currentStep === 2 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Motor Claim Intimation - Mandatory Information</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-yellow-900">Mandatory Information Required</h3>
                  <p className="text-sm text-yellow-800 mt-1">
                    Please provide the following mandatory information for motor claim intimation:
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

        {/* Health/Life Claim Intimation */}
        {selectedPolicy && (policyType === 'health' || policyType === 'life') && currentStep === 2 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{policyType.toUpperCase()} Claim Intimation</h2>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <h3 className="font-medium text-green-900 mb-2">Policy Information Retrieved</h3>
              <div className="text-sm text-green-800">
                <p><strong>Policy Number:</strong> {selectedPolicy.policyNumber}</p>
                <p><strong>Insured Name:</strong> {selectedPolicy.insuredName}</p>
                <p><strong>Policy Type:</strong> {policyType.toUpperCase()}</p>
                <p><strong>64VB Status:</strong> {selectedPolicy.vb64Status}</p>
                {selectedPolicy.previousClaimHistory.length > 0 && (
                  <div>
                    <p><strong>Previous Claims:</strong></p>
                    <ul className="list-disc list-inside ml-4">
                      {selectedPolicy.previousClaimHistory.map((claim: string, idx: number) => (
                        <li key={idx}>{claim}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={() => setCurrentStep(3)}
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

        {/* Progress Steps */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between">
            {[
              { step: 1, title: 'Policy Details', description: 'Verify policy information' },
              { step: 2, title: 'Claim Information', description: 'Enter claim details' },
              { step: 3, title: 'API Integration', description: 'Submit to insurance company' },
              { step: 4, title: 'Confirmation', description: 'Review and confirm' }
            ].map(({ step, title, description }) => (
              <div key={step} className="flex items-center">
                <div className="flex items-center">
                  {getStepIcon(step)}
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${
                      getStepStatus(step) === 'current' ? 'text-blue-600' : 
                      getStepStatus(step) === 'completed' ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {title}
                    </p>
                    <p className="text-xs text-gray-500">{description}</p>
                  </div>
                </div>
                {step < 4 && <div className="ml-8 h-0.5 w-16 bg-gray-200" />}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Step 1: Policy Details */}
          {currentStep === 1 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Policy Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Policy Number *
                  </label>
                  <input
                    type="text"
                    {...register('policyNumber')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter policy number"
                  />
                  {errors.policyNumber && <p className="text-red-500 text-xs mt-1">{errors.policyNumber.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Type
                  </label>
                  <select
                    {...register('customerType')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="INDIVIDUAL">Individual</option>
                    <option value="CORPORATE">Corporate</option>
                  </select>
                </div>

                {customerType === 'INDIVIDUAL' ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        {...register('firstName')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        {...register('lastName')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        {...register('dateOfBirth')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gender
                      </label>
                      <select
                        {...register('gender')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        {...register('companyName')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Registration Number
                      </label>
                      <input
                        type="text"
                        {...register('registrationNumber')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    {...register('phone')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <textarea
                    {...register('address')}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    {...register('city')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    {...register('state')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    {...register('pincode')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode.message}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Claim Information */}
          {currentStep === 2 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Claim Details</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Claim Type *
                    </label>
                    <select
                      {...register('claimType')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Claim Type</option>
                      <option value="DEATH">Death Claim</option>
                      <option value="MATURITY">Maturity Claim</option>
                      <option value="SURRENDER">Surrender Claim</option>
                      <option value="ACCIDENT">Accident Claim</option>
                      <option value="LIFE">Life</option>
                      <option value="LIFE_GTLI">Life-GTLI</option>
                      <option value="LIFE_GPA">Life-GPA</option>
                      <option value="HEALTH">Health</option>
                      <option value="HEALTH_GMC">Health-GMC</option>
                      <option value="GEN_LIABILITY">Gen-Liability</option>
                      <option value="GEN_FIRE">Gen–Fire</option>
                      <option value="GEN_MOTOR">Gen–Motor</option>
                      <option value="GEN_MARINE">Gen–Marine</option>
                      <option value="GEN_MISC">Gen–Misc</option>
                      <option value="GEN_ENGG">Gen–Engg</option>
                      <option value="GEN_PROPERTY">Gen–Property</option>
                      <option value="GEN_MBD">Gen–MBD</option>
                      <option value="GEN_TRAVEL">Gen–Travel</option>
                    </select>
                    {errors.claimType && <p className="text-red-500 text-xs mt-1">{errors.claimType.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Incident Date *
                    </label>
                    <input
                      type="date"
                      {...register('incidentDate')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.incidentDate && <p className="text-red-500 text-xs mt-1">{errors.incidentDate.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Incident Location *
                    </label>
                    <input
                      type="text"
                      {...register('incidentLocation')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter incident location"
                    />
                    {errors.incidentLocation && <p className="text-red-500 text-xs mt-1">{errors.incidentLocation.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Loss (₹) *
                    </label>
                    <input
                      type="number"
                      {...register('estimatedLoss', { valueAsNumber: true })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.estimatedLoss && <p className="text-red-500 text-xs mt-1">{errors.estimatedLoss.message}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Incident Description *
                  </label>
                  <textarea
                    {...register('incidentDescription')}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Provide detailed description of the incident..."
                  />
                  {errors.incidentDescription && <p className="text-red-500 text-xs mt-1">{errors.incidentDescription.message}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: API Integration */}
          {currentStep === 3 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">API Integration</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <CloudArrowUpIcon className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">API Integration with Insurance Company</h3>
                      <p className="text-xs text-gray-500">Submit claim intimation directly to insurance company</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={apiIntegrationEnabled}
                      onChange={(e) => setValue('apiIntegrationEnabled', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-600">Enable API Integration</span>
                  </div>
                </div>

                {apiIntegrationEnabled ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-green-900 mb-2">API Integration Enabled</h3>
                    <div className="space-y-2 text-sm text-green-800">
                      <div className="flex justify-between">
                        <span>Integration Status:</span>
                        <span className="font-medium">Active</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Insurance Company:</span>
                        <span className="font-medium">Integrated</span>
                      </div>
                      <div className="flex justify-between">
                        <span>API Endpoint:</span>
                        <span className="font-medium">https://api.insurance.com/claims</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Response Time:</span>
                        <span className="font-medium">~3 seconds</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-yellow-900 mb-2">Manual Processing</h3>
                    <div className="space-y-2 text-sm text-yellow-800">
                      <div className="flex justify-between">
                        <span>Processing Mode:</span>
                        <span className="font-medium">Manual</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Next Steps:</span>
                        <span className="font-medium">Manual submission required</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimated Time:</span>
                        <span className="font-medium">24-48 hours</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleDocuments}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Manage Claim Documents
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {currentStep === 4 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Confirmation</h2>
              {apiResponse ? (
                <div className="text-center">
                  <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Claim Intimation Submitted Successfully!</h3>
                  <p className="text-gray-600 mb-6">
                    Your claim intimation has been submitted to the insurance company.
                  </p>
                  <div className="space-y-2 mb-6">
                    <p className="text-sm text-gray-500">Claim ID: {apiResponse.claimId}</p>
                    <p className="text-sm text-gray-500">Reference Number: {apiResponse.referenceNumber}</p>
                    <p className="text-sm text-gray-500">Status: {apiResponse.status}</p>
                    <p className="text-sm text-gray-500">Policy Number: {watch('policyNumber')}</p>
                    <p className="text-sm text-gray-500">Claim Type: {watch('claimType')}</p>
                    <p className="text-sm text-gray-500">Estimated Loss: ₹{watch('estimatedLoss')?.toLocaleString()}</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">Next Steps:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      {apiResponse.nextSteps.map((step: string, index: number) => (
                        <li key={index} className="flex items-center">
                          <span className="mr-2">{index + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-center space-x-4">
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentStep(1)
                        setApiResponse(null)
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Submit Another Claim
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-yellow-900 mb-2">Claim Intimation Summary</h3>
                    <div className="space-y-2 text-sm text-yellow-800">
                      <div className="flex justify-between">
                        <span>Policy Number:</span>
                        <span>{watch('policyNumber')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Customer:</span>
                        <span>{customerType === 'INDIVIDUAL' ? `${watch('firstName')} ${watch('lastName')}` : watch('companyName')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Claim Type:</span>
                        <span>{watch('claimType')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Incident Date:</span>
                        <span>{watch('incidentDate')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimated Loss:</span>
                        <span>₹{watch('estimatedLoss')?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>API Integration:</span>
                        <span>{apiIntegrationEnabled ? 'Enabled' : 'Manual Processing'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          {currentStep < 4 && (
            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {currentStep === 3 ? 'Submit Claim' : 'Next'}
              </button>
            </div>
          )}

          {/* Submit Button for Step 3 */}
          {currentStep === 3 && (
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Claim Intimation'}
              </button>
            </div>
          )}
        </form>

        {/* Contextual Document Manager */}
        {showDocuments && (
          <ContextualDocumentManager 
            processType="claim-intimation"
            customerId="CUST-001"
          />
        )}
      </div>
    </div>
  )
}