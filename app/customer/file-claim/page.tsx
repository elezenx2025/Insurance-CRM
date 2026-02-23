'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLocation } from '@/contexts/LocationContext'
import { 
  DocumentTextIcon, 
  CameraIcon,
  PaperClipIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  PhoneIcon
} from '@heroicons/react/24/outline'

export default function FileClaim() {
  const { location, region } = useLocation()
  const [step, setStep] = useState(1)
  const [claimData, setClaimData] = useState({
    policyId: '',
    claimType: '',
    incidentDate: '',
    incidentTime: '',
    location: '',
    description: '',
    estimatedAmount: '',
    contactPhone: '',
    contactEmail: '',
    documents: [] as File[]
  })

  const claimTypes = [
    {
      id: 'auto-accident',
      name: 'Auto Accident',
      description: 'Vehicle collision or accident',
      icon: '🚗'
    },
    {
      id: 'auto-theft',
      name: 'Auto Theft',
      description: 'Vehicle stolen or vandalized',
      icon: '🔒'
    },
    {
      id: 'home-damage',
      name: 'Home Damage',
      description: 'Property damage or burglary',
      icon: '🏠'
    },
    {
      id: 'health-medical',
      name: 'Health/Medical',
      description: 'Medical expenses and treatment',
      icon: '🏥'
    },
    {
      id: 'travel',
      name: 'Travel',
      description: 'Travel-related incidents',
      icon: '✈️'
    },
    {
      id: 'other',
      name: 'Other',
      description: 'Other types of claims',
      icon: '📋'
    }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setClaimData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setClaimData(prev => ({
      ...prev,
      documents: [...prev.documents, ...files]
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(3)
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

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">File a New Claim</h1>
        <p className="text-gray-600 mt-2">Report an incident and get the support you need</p>
        {location && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <MapPinIcon className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-sm text-blue-900">
                Filing claim for {location.city}, {location.state}
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
              Claim Details
            </span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-200 mx-4">
            <div className={`h-full ${step > 1 ? 'bg-blue-600' : 'bg-gray-200'}`} />
          </div>
          <div className="flex items-center space-x-2">
            {getStepIcon(2)}
            <span className={`text-sm font-medium ${step >= 2 ? 'text-blue-600' : 'text-gray-500'}`}>
              Documents & Evidence
            </span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-200 mx-4">
            <div className={`h-full ${step > 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
          </div>
          <div className="flex items-center space-x-2">
            {getStepIcon(3)}
            <span className={`text-sm font-medium ${step >= 3 ? 'text-blue-600' : 'text-gray-500'}`}>
              Confirmation
            </span>
          </div>
        </div>
      </div>

      {/* Step 1: Claim Details */}
      {step === 1 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Claim Information</h2>
          
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Policy ID *
                </label>
                <input
                  type="text"
                  name="policyId"
                  value={claimData.policyId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your policy ID"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Claim Type *
                </label>
                <select
                  name="claimType"
                  value={claimData.claimType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select claim type</option>
                  {claimTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.icon} {type.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Incident Date *
                </label>
                <input
                  type="date"
                  name="incidentDate"
                  value={claimData.incidentDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Incident Time *
                </label>
                <input
                  type="time"
                  name="incidentTime"
                  value={claimData.incidentTime}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Incident Location *
              </label>
              <input
                type="text"
                name="location"
                value={claimData.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter the location where the incident occurred"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={claimData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Provide a detailed description of the incident"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Claim Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">
                    {location?.currencySymbol || '₹'}
                  </span>
                  <input
                    type="number"
                    name="estimatedAmount"
                    value={claimData.estimatedAmount}
                    onChange={handleInputChange}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Phone *
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={claimData.contactPhone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your contact number"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next: Upload Documents
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Step 2: Documents & Evidence */}
      {step === 2 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Upload Supporting Documents</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Documents
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <PaperClipIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  Upload photos, receipts, police reports, or other supporting documents
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  Choose Files
                </label>
              </div>
            </div>

            {claimData.documents.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Uploaded Documents</h3>
                <div className="space-y-2">
                  {claimData.documents.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-900">{file.name}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">Important Notes</h4>
                  <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                    <li>• Upload clear photos of damage or incident</li>
                    <li>• Include any police reports or official documents</li>
                    <li>• Keep receipts for any immediate expenses</li>
                    <li>• Maximum file size: 10MB per file</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit Claim
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Confirmation */}
      {step === 3 && (
        <div className="text-center">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Claim Submitted Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Your claim has been submitted and assigned claim ID: <strong>CLM-{Date.now().toString().slice(-6)}</strong>
            </p>
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">What happens next?</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• You'll receive a confirmation email within 24 hours</li>
                  <li>• A claims adjuster will contact you within 2-3 business days</li>
                  <li>• You can track your claim status in your dashboard</li>
                </ul>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/customer/claims"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View My Claims
                </Link>
                <Link
                  href="/customer"
                  className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Go to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


