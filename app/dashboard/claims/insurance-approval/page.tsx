'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeftIcon, DocumentIcon, UserIcon, BuildingOfficeIcon, CheckCircleIcon, ExclamationTriangleIcon, ShieldCheckIcon, ClockIcon } from '@heroicons/react/24/outline'
import { ContextualDocumentManager } from '@/components/documents/ContextualDocumentManager'
import toast from 'react-hot-toast'

const approvalSchema = z.object({
  claimId: z.string().min(1, 'Claim ID is required'),
  assessmentId: z.string().min(1, 'Assessment ID is required'),
  // Approval details
  approvalStatus: z.enum(['APPROVED', 'REJECTED', 'PENDING', 'CONDITIONAL_APPROVAL']),
  approvedAmount: z.number(),
  rejectionReason: z.string().optional(),
  conditions: z.string().optional(),
  // Insurance company details
  insuranceCompany: z.string(),
  approverName: z.string(),
  approverDesignation: z.string(),
  approvalDate: z.string(),
  // API integration status
  apiIntegrationEnabled: z.boolean().default(false),
  insuranceCompanyResponse: z.string().optional()
})

type ApprovalFormData = z.infer<typeof approvalSchema>

export default function InsuranceApprovalPage() {
  const router = useRouter()
  const [showDocuments, setShowDocuments] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiResponse, setApiResponse] = useState<any>(null)

  const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(approvalSchema),
    defaultValues: {
      apiIntegrationEnabled: false
    }
  })

  const apiIntegrationEnabled = watch('apiIntegrationEnabled')
  const approvalStatus = watch('approvalStatus')

  const handleBack = () => {
    router.push('/dashboard/postsale/claims')
  }

  const handleDocuments = () => {
    setShowDocuments(true)
  }

  const onSubmit = async (data: ApprovalFormData) => {
    setIsSubmitting(true)
    try {
      if (data.apiIntegrationEnabled) {
        // Mock API call to insurance company
        await new Promise(resolve => setTimeout(resolve, 3000))
        const mockResponse = {
          approvalId: 'APPROVAL-' + Date.now().toString().slice(-6),
          status: 'SUBMITTED',
          referenceNumber: 'REF-' + Date.now().toString().slice(-8),
          message: 'Insurance company approval submitted successfully',
          nextSteps: ['Supplementary Claim', 'Settlement Process', 'Document Verification']
        }
        setApiResponse(mockResponse)
        setValue('insuranceCompanyResponse', JSON.stringify(mockResponse))
        toast.success('Insurance company approval submitted successfully!')
      } else {
        // Manual process
        await new Promise(resolve => setTimeout(resolve, 2000))
        toast.success('Insurance company approval recorded for manual processing!')
      }
      setCurrentStep(4)
    } catch (error) {
      toast.error('Failed to submit insurance company approval')
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
          <h1 className="text-2xl font-bold text-gray-900">Insurance Company Approval</h1>
          <p className="text-gray-600 mt-2">
            Submit insurance company approval back flow with API integration
          </p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between">
            {[
              { step: 1, title: 'Approval Details', description: 'Enter approval information' },
              { step: 2, title: 'Decision Details', description: 'Record approval decision' },
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
          {/* Step 1: Approval Details */}
          {currentStep === 1 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Approval Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Claim ID *
                  </label>
                  <input
                    type="text"
                    {...register('claimId')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter claim ID"
                  />
                  {errors.claimId && <p className="text-red-500 text-xs mt-1">{errors.claimId.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assessment ID *
                  </label>
                  <input
                    type="text"
                    {...register('assessmentId')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter assessment ID"
                  />
                  {errors.assessmentId && <p className="text-red-500 text-xs mt-1">{errors.assessmentId.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Insurance Company *
                  </label>
                  <select
                    {...register('insuranceCompany')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Insurance Company</option>
                    <option value="LIC">Life Insurance Corporation of India</option>
                    <option value="SBI_LIFE">SBI Life Insurance</option>
                    <option value="HDFC_LIFE">HDFC Life Insurance</option>
                    <option value="ICICI_PRUDENTIAL">ICICI Prudential Life Insurance</option>
                    <option value="BAJAJ_ALLIANZ">Bajaj Allianz Life Insurance</option>
                    <option value="TATA_AIG">Tata AIG Life Insurance</option>
                    <option value="MAX_LIFE">Max Life Insurance</option>
                    <option value="KOTAK_LIFE">Kotak Life Insurance</option>
                  </select>
                  {errors.insuranceCompany && <p className="text-red-500 text-xs mt-1">{errors.insuranceCompany.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Approver Name *
                  </label>
                  <input
                    type="text"
                    {...register('approverName')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter approver name"
                  />
                  {errors.approverName && <p className="text-red-500 text-xs mt-1">{errors.approverName.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Approver Designation *
                  </label>
                  <input
                    type="text"
                    {...register('approverDesignation')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter approver designation"
                  />
                  {errors.approverDesignation && <p className="text-red-500 text-xs mt-1">{errors.approverDesignation.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Approval Date *
                  </label>
                  <input
                    type="date"
                    {...register('approvalDate')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.approvalDate && <p className="text-red-500 text-xs mt-1">{errors.approvalDate.message}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Decision Details */}
          {currentStep === 2 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Approval Decision</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Approval Status *
                  </label>
                  <select
                    {...register('approvalStatus')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Approval Status</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="PENDING">Pending</option>
                    <option value="CONDITIONAL_APPROVAL">Conditional Approval</option>
                  </select>
                  {errors.approvalStatus && <p className="text-red-500 text-xs mt-1">{errors.approvalStatus.message}</p>}
                </div>

                {approvalStatus === 'APPROVED' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Approved Amount (₹) *
                    </label>
                    <input
                      type="number"
                      {...register('approvedAmount', { valueAsNumber: true })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.approvedAmount && <p className="text-red-500 text-xs mt-1">{errors.approvedAmount.message}</p>}
                  </div>
                )}

                {approvalStatus === 'REJECTED' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rejection Reason *
                    </label>
                    <textarea
                      {...register('rejectionReason')}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter rejection reason..."
                    />
                    {errors.rejectionReason && <p className="text-red-500 text-xs mt-1">{errors.rejectionReason.message}</p>}
                  </div>
                )}

                {approvalStatus === 'CONDITIONAL_APPROVAL' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Conditions *
                    </label>
                    <textarea
                      {...register('conditions')}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter approval conditions..."
                    />
                    {errors.conditions && <p className="text-red-500 text-xs mt-1">{errors.conditions.message}</p>}
                  </div>
                )}

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-900 mb-2">Approval Summary</h3>
                  <div className="space-y-2 text-sm text-blue-800">
                    <div className="flex justify-between">
                      <span>Claim ID:</span>
                      <span>{watch('claimId')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Assessment ID:</span>
                      <span>{watch('assessmentId')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Insurance Company:</span>
                      <span>{watch('insuranceCompany')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Approver:</span>
                      <span>{watch('approverName')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Approval Date:</span>
                      <span>{watch('approvalDate')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="font-medium">{watch('approvalStatus')}</span>
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
                    <ShieldCheckIcon className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">API Integration with Insurance Company</h3>
                      <p className="text-xs text-gray-500">Submit approval decision directly to insurance company</p>
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
                        <span className="font-medium">https://api.insurance.com/approvals</span>
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
                    Manage Approval Documents
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
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Insurance Company Approval Submitted Successfully!</h3>
                  <p className="text-gray-600 mb-6">
                    Your insurance company approval has been submitted.
                  </p>
                  <div className="space-y-2 mb-6">
                    <p className="text-sm text-gray-500">Approval ID: {apiResponse.approvalId}</p>
                    <p className="text-sm text-gray-500">Reference Number: {apiResponse.referenceNumber}</p>
                    <p className="text-sm text-gray-500">Status: {apiResponse.status}</p>
                    <p className="text-sm text-gray-500">Claim ID: {watch('claimId')}</p>
                    <p className="text-sm text-gray-500">Assessment ID: {watch('assessmentId')}</p>
                    <p className="text-sm text-gray-500">Approval Status: {watch('approvalStatus')}</p>
                    {watch('approvedAmount') && <p className="text-sm text-gray-500">Approved Amount: ₹{watch('approvedAmount')?.toLocaleString()}</p>}
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
                      Submit Another Approval
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-yellow-900 mb-2">Approval Summary</h3>
                    <div className="space-y-2 text-sm text-yellow-800">
                      <div className="flex justify-between">
                        <span>Claim ID:</span>
                        <span>{watch('claimId')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Assessment ID:</span>
                        <span>{watch('assessmentId')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Insurance Company:</span>
                        <span>{watch('insuranceCompany')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Approver:</span>
                        <span>{watch('approverName')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Approval Status:</span>
                        <span>{watch('approvalStatus')}</span>
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
                {currentStep === 3 ? 'Submit Approval' : 'Next'}
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
                {isSubmitting ? 'Submitting...' : 'Submit Insurance Company Approval'}
              </button>
            </div>
          )}
        </form>

        {/* Contextual Document Manager */}
        {showDocuments && (
          <ContextualDocumentManager 
            processType="insuranceApproval"
            customerId="CUST-001"
          />
        )}
      </div>
    </div>
  )
}
