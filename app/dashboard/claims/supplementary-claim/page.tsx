'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeftIcon, DocumentIcon, UserIcon, BuildingOfficeIcon, CheckCircleIcon, ExclamationTriangleIcon, PlusIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { ContextualDocumentManager } from '@/components/documents/ContextualDocumentManager'
import toast from 'react-hot-toast'

const supplementaryClaimSchema = z.object({
  originalClaimId: z.string().min(1, 'Original claim ID is required'),
  supplementaryClaimId: z.string().min(1, 'Supplementary claim ID is required'),
  // Supplementary claim details
  supplementaryReason: z.string().min(1, 'Supplementary reason is required'),
  additionalAmount: z.number().min(0, 'Additional amount must be positive'),
  supplementaryDescription: z.string().min(1, 'Supplementary description is required'),
  // Supporting documents
  supportingDocuments: z.array(z.string()).optional(),
  // API integration status
  apiIntegrationEnabled: z.boolean().default(false),
  insuranceCompanyResponse: z.string().optional()
})

type SupplementaryClaimFormData = z.infer<typeof supplementaryClaimSchema>

export default function SupplementaryClaimPage() {
  const router = useRouter()
  const [showDocuments, setShowDocuments] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiResponse, setApiResponse] = useState<any>(null)

  const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(supplementaryClaimSchema),
    defaultValues: {
      apiIntegrationEnabled: false
    }
  })

  const apiIntegrationEnabled = watch('apiIntegrationEnabled')

  const handleBack = () => {
    router.push('/dashboard/postsale/claims')
  }

  const handleDocuments = () => {
    setShowDocuments(true)
  }

  const onSubmit = async (data: SupplementaryClaimFormData) => {
    setIsSubmitting(true)
    try {
      if (data.apiIntegrationEnabled) {
        // Mock API call to insurance company
        await new Promise(resolve => setTimeout(resolve, 3000))
        const mockResponse = {
          supplementaryClaimId: 'SUPP-' + Date.now().toString().slice(-6),
          status: 'SUBMITTED',
          referenceNumber: 'REF-' + Date.now().toString().slice(-8),
          message: 'Supplementary claim submitted successfully to insurance company',
          nextSteps: ['Insurance Company Review', 'Additional Assessment', 'Settlement Process']
        }
        setApiResponse(mockResponse)
        setValue('insuranceCompanyResponse', JSON.stringify(mockResponse))
        toast.success('Supplementary claim submitted to insurance company successfully!')
      } else {
        // Manual process
        await new Promise(resolve => setTimeout(resolve, 2000))
        toast.success('Supplementary claim recorded for manual processing!')
      }
      setCurrentStep(4)
    } catch (error) {
      toast.error('Failed to submit supplementary claim')
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
          <h1 className="text-2xl font-bold text-gray-900">Supplementary Claim</h1>
          <p className="text-gray-600 mt-2">
            Submit supplementary claim request to insurance company with API integration
          </p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between">
            {[
              { step: 1, title: 'Claim Details', description: 'Enter claim information' },
              { step: 2, title: 'Supplementary Details', description: 'Enter supplementary information' },
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
          {/* Step 1: Claim Details */}
          {currentStep === 1 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Original Claim Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Original Claim ID *
                  </label>
                  <input
                    type="text"
                    {...register('originalClaimId')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter original claim ID"
                  />
                  {errors.originalClaimId && <p className="text-red-500 text-xs mt-1">{errors.originalClaimId.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Supplementary Claim ID *
                  </label>
                  <input
                    type="text"
                    {...register('supplementaryClaimId')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter supplementary claim ID"
                  />
                  {errors.supplementaryClaimId && <p className="text-red-500 text-xs mt-1">{errors.supplementaryClaimId.message}</p>}
                </div>
              </div>

              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-900 mb-2">Supplementary Claim Guidelines</h3>
                <div className="space-y-2 text-sm text-blue-800">
                  <div className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Supplementary claims are for additional damages discovered after the original claim</span>
                  </div>
                  <div className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Must be submitted within 30 days of discovery of additional damage</span>
                  </div>
                  <div className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Requires supporting documentation and evidence</span>
                  </div>
                  <div className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Subject to insurance company review and approval</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Supplementary Details */}
          {currentStep === 2 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Supplementary Claim Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Supplementary Reason *
                  </label>
                  <select
                    {...register('supplementaryReason')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Supplementary Reason</option>
                    <option value="ADDITIONAL_DAMAGE">Additional Damage Discovered</option>
                    <option value="HIDDEN_DAMAGE">Hidden Damage Found</option>
                    <option value="DELAYED_SYMPTOMS">Delayed Symptoms Appeared</option>
                    <option value="MEDICAL_COMPLICATIONS">Medical Complications</option>
                    <option value="REPAIR_COST_INCREASE">Repair Cost Increase</option>
                    <option value="REPLACEMENT_COST_INCREASE">Replacement Cost Increase</option>
                    <option value="ADDITIONAL_EVIDENCE">Additional Evidence Found</option>
                    <option value="EXPERT_OPINION">Expert Opinion Required</option>
                  </select>
                  {errors.supplementaryReason && <p className="text-red-500 text-xs mt-1">{errors.supplementaryReason.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Amount (₹) *
                  </label>
                  <input
                    type="number"
                    {...register('additionalAmount', { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter additional amount claimed"
                  />
                  {errors.additionalAmount && <p className="text-red-500 text-xs mt-1">{errors.additionalAmount.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Supplementary Description *
                  </label>
                  <textarea
                    {...register('supplementaryDescription')}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Provide detailed description of the supplementary claim..."
                  />
                  {errors.supplementaryDescription && <p className="text-red-500 text-xs mt-1">{errors.supplementaryDescription.message}</p>}
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-yellow-900 mb-2">Important Notes</h3>
                  <div className="space-y-2 text-sm text-yellow-800">
                    <div className="flex items-start">
                      <ExclamationCircleIcon className="h-4 w-4 mr-2 mt-0.5" />
                      <span>Supplementary claims are subject to insurance company review and may require additional documentation</span>
                    </div>
                    <div className="flex items-start">
                      <ExclamationCircleIcon className="h-4 w-4 mr-2 mt-0.5" />
                      <span>Processing time may be longer than original claims due to additional verification requirements</span>
                    </div>
                    <div className="flex items-start">
                      <ExclamationCircleIcon className="h-4 w-4 mr-2 mt-0.5" />
                      <span>Insurance company may request additional assessment or expert opinion</span>
                    </div>
                  </div>
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
                    <PlusIcon className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">API Integration with Insurance Company</h3>
                      <p className="text-xs text-gray-500">Submit supplementary claim directly to insurance company</p>
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
                        <span className="font-medium">https://api.insurance.com/supplementary-claims</span>
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
                        <span className="font-medium">48-72 hours</span>
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
                    Manage Supplementary Claim Documents
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
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Supplementary Claim Submitted Successfully!</h3>
                  <p className="text-gray-600 mb-6">
                    Your supplementary claim has been submitted to the insurance company.
                  </p>
                  <div className="space-y-2 mb-6">
                    <p className="text-sm text-gray-500">Supplementary Claim ID: {apiResponse.supplementaryClaimId}</p>
                    <p className="text-sm text-gray-500">Reference Number: {apiResponse.referenceNumber}</p>
                    <p className="text-sm text-gray-500">Status: {apiResponse.status}</p>
                    <p className="text-sm text-gray-500">Original Claim ID: {watch('originalClaimId')}</p>
                    <p className="text-sm text-gray-500">Supplementary Reason: {watch('supplementaryReason')}</p>
                    <p className="text-sm text-gray-500">Additional Amount: ₹{watch('additionalAmount')?.toLocaleString()}</p>
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
                      Submit Another Supplementary Claim
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-yellow-900 mb-2">Supplementary Claim Summary</h3>
                    <div className="space-y-2 text-sm text-yellow-800">
                      <div className="flex justify-between">
                        <span>Original Claim ID:</span>
                        <span>{watch('originalClaimId')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Supplementary Claim ID:</span>
                        <span>{watch('supplementaryClaimId')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Supplementary Reason:</span>
                        <span>{watch('supplementaryReason')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Additional Amount:</span>
                        <span>₹{watch('additionalAmount')?.toLocaleString()}</span>
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
                {currentStep === 3 ? 'Submit Supplementary Claim' : 'Next'}
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
                {isSubmitting ? 'Submitting...' : 'Submit Supplementary Claim'}
              </button>
            </div>
          )}
        </form>

        {/* Contextual Document Manager */}
        {showDocuments && (
          <ContextualDocumentManager 
            processType="supplementary-claim"
            customerId="CUST-001"
          />
        )}
      </div>
    </div>
  )
}