'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeftIcon, DocumentIcon, UserIcon, BuildingOfficeIcon, CheckCircleIcon, ExclamationTriangleIcon, ShieldCheckIcon, ClockIcon } from '@heroicons/react/24/outline'
import { ContextualDocumentManager } from '@/components/documents/ContextualDocumentManager'
import toast from 'react-hot-toast'

const verification64VBSchema = z.object({
  policyNumber: z.string().min(1, 'Policy number is required'),
  verificationId: z.string().min(1, 'Verification ID is required'),
  // Policy details
  policyHolderName: z.string().min(1, 'Policy holder name is required'),
  policyType: z.string().min(1, 'Policy type is required'),
  premiumAmount: z.number().min(0, 'Premium amount must be positive'),
  // Payment reconciliation
  paymentReconciled: z.boolean().default(false),
  reconciliationDate: z.string(),
  reconciliationAmount: z.number().min(0, 'Reconciliation amount must be positive'),
  // Verification details
  verificationStatus: z.enum(['PENDING', 'VERIFIED', 'REJECTED']).default('PENDING'),
  verificationDate: z.string(),
  verifiedBy: z.string().min(1, 'Verified by is required'),
  // API integration status
  apiIntegrationEnabled: z.boolean().default(false),
  insuranceCompanyResponse: z.string().optional()
})

type Verification64VBFormData = z.infer<typeof verification64VBSchema>

export default function Verification64VBPage() {
  const router = useRouter()
  const [showDocuments, setShowDocuments] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiResponse, setApiResponse] = useState<any>(null)

  const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(verification64VBSchema),
    defaultValues: {
      apiIntegrationEnabled: false,
      paymentReconciled: false,
      verificationStatus: 'PENDING'
    }
  })

  const apiIntegrationEnabled = watch('apiIntegrationEnabled')
  const paymentReconciled = watch('paymentReconciled')
  const verificationStatus = watch('verificationStatus')

  const handleBack = () => {
    router.push('/dashboard/postsale')
  }

  const handleDocuments = () => {
    setShowDocuments(true)
  }

  const onSubmit = async (data: Verification64VBFormData) => {
    setIsSubmitting(true)
    try {
      if (data.apiIntegrationEnabled) {
        // Mock API call to insurance company
        await new Promise(resolve => setTimeout(resolve, 3000))
        const mockResponse = {
          verificationId: '64VB-' + Date.now().toString().slice(-6),
          status: 'SUBMITTED',
          referenceNumber: 'REF-' + Date.now().toString().slice(-8),
          message: '64VB verification request submitted successfully to insurance company',
          nextSteps: ['Insurance Company Review', 'Payment Verification', 'Policy Status Update', 'Verification Certificate Generation']
        }
        setApiResponse(mockResponse)
        setValue('insuranceCompanyResponse', JSON.stringify(mockResponse))
        toast.success('64VB verification request submitted to insurance company successfully!')
      } else {
        // Manual process
        await new Promise(resolve => setTimeout(resolve, 2000))
        toast.success('64VB verification request recorded for manual processing!')
      }
      setCurrentStep(4)
    } catch (error) {
      toast.error('Failed to submit 64VB verification request')
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
              Back to Post-Sales
            </button>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">64VB Verification</h1>
          <p className="text-gray-600 mt-2">
            Verify policy payment reconciliation and update policy status to 64VB verified
          </p>
        </div>

        {/* 64VB Verification Info */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-green-900 mb-2">64VB Verification Information</h3>
          <div className="space-y-2 text-sm text-green-800">
            <div className="flex items-start">
              <span className="mr-2">•</span>
              <span>64VB verification is required for policies whose payment has been reconciled by insurance companies</span>
            </div>
            <div className="flex items-start">
              <span className="mr-2">•</span>
              <span>Policy status will be updated to 64VB verified upon successful verification</span>
            </div>
            <div className="flex items-start">
              <span className="mr-2">•</span>
              <span>Verification can be done manually or through integrated APIs with insurance companies</span>
            </div>
            <div className="flex items-start">
              <span className="mr-2">•</span>
              <span>Verification certificate will be generated upon successful completion</span>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between">
            {[
              { step: 1, title: 'Policy Details', description: 'Enter policy information' },
              { step: 2, title: 'Payment Reconciliation', description: 'Verify payment reconciliation' },
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
                    Verification ID *
                  </label>
                  <input
                    type="text"
                    {...register('verificationId')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter verification ID"
                  />
                  {errors.verificationId && <p className="text-red-500 text-xs mt-1">{errors.verificationId.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Policy Holder Name *
                  </label>
                  <input
                    type="text"
                    {...register('policyHolderName')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter policy holder name"
                  />
                  {errors.policyHolderName && <p className="text-red-500 text-xs mt-1">{errors.policyHolderName.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Policy Type *
                  </label>
                  <select
                    {...register('policyType')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Policy Type</option>
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
                  {errors.policyType && <p className="text-red-500 text-xs mt-1">{errors.policyType.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Premium Amount (₹) *
                  </label>
                  <input
                    type="number"
                    {...register('premiumAmount', { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter premium amount"
                  />
                  {errors.premiumAmount && <p className="text-red-500 text-xs mt-1">{errors.premiumAmount.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Verification Date *
                  </label>
                  <input
                    type="date"
                    {...register('verificationDate')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.verificationDate && <p className="text-red-500 text-xs mt-1">{errors.verificationDate.message}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Payment Reconciliation */}
          {currentStep === 2 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Reconciliation</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <ShieldCheckIcon className="h-5 w-5 text-green-600 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Payment Reconciliation Status</h3>
                      <p className="text-xs text-gray-500">Verify if payment has been reconciled by insurance company</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={paymentReconciled}
                      onChange={(e) => setValue('paymentReconciled', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-600">Payment Reconciled</span>
                  </div>
                </div>

                {paymentReconciled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reconciliation Date *
                      </label>
                      <input
                        type="date"
                        {...register('reconciliationDate')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.reconciliationDate && <p className="text-red-500 text-xs mt-1">{errors.reconciliationDate.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reconciliation Amount (₹) *
                      </label>
                      <input
                        type="number"
                        {...register('reconciliationAmount', { valueAsNumber: true })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter reconciliation amount"
                      />
                      {errors.reconciliationAmount && <p className="text-red-500 text-xs mt-1">{errors.reconciliationAmount.message}</p>}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Verified By *
                  </label>
                  <input
                    type="text"
                    {...register('verifiedBy')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter verifier name"
                  />
                  {errors.verifiedBy && <p className="text-red-500 text-xs mt-1">{errors.verifiedBy.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Verification Status *
                  </label>
                  <select
                    {...register('verificationStatus')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="VERIFIED">Verified</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                  {errors.verificationStatus && <p className="text-red-500 text-xs mt-1">{errors.verificationStatus.message}</p>}
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-900 mb-2">Verification Summary</h3>
                  <div className="space-y-2 text-sm text-blue-800">
                    <div className="flex justify-between">
                      <span>Policy Number:</span>
                      <span>{watch('policyNumber')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Policy Holder:</span>
                      <span>{watch('policyHolderName')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Policy Type:</span>
                      <span>{watch('policyType')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Premium Amount:</span>
                      <span>₹{watch('premiumAmount')?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Reconciled:</span>
                      <span>{paymentReconciled ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Verification Status:</span>
                      <span className="font-medium">{watch('verificationStatus')}</span>
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
                      <p className="text-xs text-gray-500">Submit 64VB verification request directly to insurance company</p>
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
                        <span className="font-medium">https://api.insurance.com/64vb-verification</span>
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
                    Manage Verification Documents
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
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">64VB Verification Request Submitted Successfully!</h3>
                  <p className="text-gray-600 mb-6">
                    Your 64VB verification request has been submitted to the insurance company.
                  </p>
                  <div className="space-y-2 mb-6">
                    <p className="text-sm text-gray-500">Verification ID: {apiResponse.verificationId}</p>
                    <p className="text-sm text-gray-500">Reference Number: {apiResponse.referenceNumber}</p>
                    <p className="text-sm text-gray-500">Status: {apiResponse.status}</p>
                    <p className="text-sm text-gray-500">Policy Number: {watch('policyNumber')}</p>
                    <p className="text-sm text-gray-500">Verification Status: {watch('verificationStatus')}</p>
                    <p className="text-sm text-gray-500">Verified By: {watch('verifiedBy')}</p>
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
                      Submit Another Verification
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-yellow-900 mb-2">64VB Verification Summary</h3>
                    <div className="space-y-2 text-sm text-yellow-800">
                      <div className="flex justify-between">
                        <span>Policy Number:</span>
                        <span>{watch('policyNumber')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Verification ID:</span>
                        <span>{watch('verificationId')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Policy Holder:</span>
                        <span>{watch('policyHolderName')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Policy Type:</span>
                        <span>{watch('policyType')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Premium Amount:</span>
                        <span>₹{watch('premiumAmount')?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Payment Reconciled:</span>
                        <span>{paymentReconciled ? 'Yes' : 'No'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Verification Status:</span>
                        <span>{watch('verificationStatus')}</span>
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
                {currentStep === 3 ? 'Submit Verification' : 'Next'}
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
                {isSubmitting ? 'Submitting...' : 'Submit 64VB Verification Request'}
              </button>
            </div>
          )}
        </form>

        {/* Contextual Document Manager */}
        {showDocuments && (
          <ContextualDocumentManager 
            processType="64vbVerification"
            customerId="CUST-001"
          />
        )}
      </div>
    </div>
  )
}
