'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeftIcon, DocumentIcon, UserIcon, BuildingOfficeIcon, CheckCircleIcon, ExclamationTriangleIcon, PencilIcon } from '@heroicons/react/24/outline'
import { ContextualDocumentManager } from '@/components/documents/ContextualDocumentManager'
import toast from 'react-hot-toast'

const nilEndorsementSchema = z.object({
  policyNumber: z.string().min(1, 'Policy number is required'),
  endorsementId: z.string().min(1, 'Endorsement ID is required'),
  // Endorsement details
  endorsementType: z.enum(['NIL']).default('NIL'),
  changeType: z.enum(['NAME_CORRECTION', 'ADDRESS_CORRECTION', 'PHONE_CORRECTION', 'EMAIL_CORRECTION', 'BENEFICIARY_CORRECTION', 'NOMINEE_CORRECTION', 'OTHER']),
  changeDescription: z.string().min(1, 'Change description is required'),
  // Policy holder details
  policyHolderName: z.string().min(1, 'Policy holder name is required'),
  currentValue: z.string().min(1, 'Current value is required'),
  newValue: z.string().min(1, 'New value is required'),
  // NIL endorsement - no premium changes
  premiumImpact: z.enum(['NO_CHANGE']).default('NO_CHANGE'),
  // KYC requirements
  kycRequired: z.boolean().default(false),
  kycDocuments: z.array(z.string()).optional(),
  // Endorsement process
  endorsementDate: z.string(),
  endorsementReason: z.string().min(1, 'Endorsement reason is required'),
  // API integration status
  apiIntegrationEnabled: z.boolean().default(false),
  insuranceCompanyResponse: z.string().optional()
})

type NilEndorsementFormData = z.infer<typeof nilEndorsementSchema>

export default function NilEndorsementPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm({
    resolver: zodResolver(nilEndorsementSchema),
    defaultValues: {
      endorsementType: 'NIL',
      premiumImpact: 'NO_CHANGE',
      kycRequired: false,
      apiIntegrationEnabled: false
    }
  })

  const watchedValues = watch()

  const handleBack = () => {
    router.push('/dashboard/endorsement')
  }

  const onSubmit = async (data: NilEndorsementFormData) => {
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('NIL Endorsement submitted successfully!')
      router.push('/dashboard/endorsement')
    } catch (error) {
      toast.error('Failed to submit endorsement')
    } finally {
      setIsSubmitting(false)
    }
  }

  const steps = [
    { id: 1, name: 'Policy Details', description: 'Enter policy information' },
    { id: 2, name: 'Endorsement Details', description: 'Enter correction details' },
    { id: 3, name: 'Documents', description: 'Upload required documents' },
    { id: 4, name: 'Review & Submit', description: 'Review and submit endorsement' }
  ]

  const changeTypes = [
    { value: 'NAME_CORRECTION', label: 'Name Correction' },
    { value: 'ADDRESS_CORRECTION', label: 'Address Correction' },
    { value: 'PHONE_CORRECTION', label: 'Phone Number Correction' },
    { value: 'EMAIL_CORRECTION', label: 'Email Correction' },
    { value: 'BENEFICIARY_CORRECTION', label: 'Beneficiary Correction' },
    { value: 'NOMINEE_CORRECTION', label: 'Nominee Correction' },
    { value: 'OTHER', label: 'Other Correction' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Endorsements
          </button>
          
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <PencilIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">NIL Endorsement</h1>
              <p className="text-gray-600">Request policy corrections with no premium payment</p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  currentStep >= step.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step.id}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step.name}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Step 1: Policy Details */}
          {currentStep === 1 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Policy Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Policy Number *
                  </label>
                  <input
                    {...register('policyNumber')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter policy number"
                  />
                  {errors.policyNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.policyNumber.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Endorsement ID *
                  </label>
                  <input
                    {...register('endorsementId')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter endorsement ID"
                  />
                  {errors.endorsementId && (
                    <p className="text-red-500 text-sm mt-1">{errors.endorsementId.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Policy Holder Name *
                  </label>
                  <input
                    {...register('policyHolderName')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter policy holder name"
                  />
                  {errors.policyHolderName && (
                    <p className="text-red-500 text-sm mt-1">{errors.policyHolderName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Endorsement Date *
                  </label>
                  <input
                    {...register('endorsementDate')}
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.endorsementDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.endorsementDate.message}</p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Next: Endorsement Details
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Endorsement Details */}
          {currentStep === 2 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Endorsement Details</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type of Correction *
                  </label>
                  <select
                    {...register('changeType')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select correction type</option>
                    {changeTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {errors.changeType && (
                    <p className="text-red-500 text-sm mt-1">{errors.changeType.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Value *
                    </label>
                    <input
                      {...register('currentValue')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter current value"
                    />
                    {errors.currentValue && (
                      <p className="text-red-500 text-sm mt-1">{errors.currentValue.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Value *
                    </label>
                    <input
                      {...register('newValue')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter new value"
                    />
                    {errors.newValue && (
                      <p className="text-red-500 text-sm mt-1">{errors.newValue.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Change Description *
                  </label>
                  <textarea
                    {...register('changeDescription')}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe the correction in detail"
                  />
                  {errors.changeDescription && (
                    <p className="text-red-500 text-sm mt-1">{errors.changeDescription.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Endorsement Reason *
                  </label>
                  <textarea
                    {...register('endorsementReason')}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Explain why this correction is needed"
                  />
                  {errors.endorsementReason && (
                    <p className="text-red-500 text-sm mt-1">{errors.endorsementReason.message}</p>
                  )}
                </div>
              </div>

              {/* NIL Endorsement Notice */}
              <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                  <h3 className="text-sm font-medium text-green-800">NIL Endorsement</h3>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  This is a NIL endorsement with no premium impact. No additional payment is required.
                </p>
              </div>

              <div className="mt-6 flex space-x-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Next: Documents
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Documents */}
          {currentStep === 3 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Required Documents</h2>
              
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-2">Document Requirements</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Policy document (original or copy)</li>
                    <li>• Identity proof of policy holder</li>
                    <li>• Address proof (if address correction)</li>
                    <li>• Supporting documents for the correction</li>
                  </ul>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    KYC Required
                  </label>
                  <div className="flex items-center">
                    <input
                      {...register('kycRequired')}
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Additional KYC verification required
                    </span>
                  </div>
                </div>

                <ContextualDocumentManager
                  processType="nilEndorsement"
                  customerId="CUST-001"
                />
              </div>

              <div className="mt-6 flex space-x-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Next: Review & Submit
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Review & Submit */}
          {currentStep === 4 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Review & Submit</h2>
              
              <div className="space-y-6">
                {/* Policy Details Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Policy Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Policy Number:</span>
                      <span className="ml-2 font-medium">{watchedValues.policyNumber}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Endorsement ID:</span>
                      <span className="ml-2 font-medium">{watchedValues.endorsementId}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Policy Holder:</span>
                      <span className="ml-2 font-medium">{watchedValues.policyHolderName}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Endorsement Date:</span>
                      <span className="ml-2 font-medium">{watchedValues.endorsementDate}</span>
                    </div>
                  </div>
                </div>

                {/* Endorsement Details Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Endorsement Details</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Correction Type:</span>
                      <span className="ml-2 font-medium">
                        {changeTypes.find(t => t.value === watchedValues.changeType)?.label}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Current Value:</span>
                      <span className="ml-2 font-medium">{watchedValues.currentValue}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">New Value:</span>
                      <span className="ml-2 font-medium">{watchedValues.newValue}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Description:</span>
                      <span className="ml-2 font-medium">{watchedValues.changeDescription}</span>
                    </div>
                  </div>
                </div>

                {/* Premium Impact Notice */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                    <h3 className="font-medium text-green-900">NIL Endorsement Confirmed</h3>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    No premium changes required. This correction will be processed without any additional payment.
                  </p>
                </div>

                {/* API Integration Status */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-blue-900">API Integration</h3>
                      <p className="text-sm text-blue-700">
                        {watchedValues.apiIntegrationEnabled 
                          ? 'Enabled - Will be submitted to insurance company automatically'
                          : 'Disabled - Manual processing required'
                        }
                      </p>
                    </div>
                    <label className="flex items-center">
                      <input
                        {...register('apiIntegrationEnabled')}
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Enable API Integration</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex space-x-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  Previous
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit NIL Endorsement'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

