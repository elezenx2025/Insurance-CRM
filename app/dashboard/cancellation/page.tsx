'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeftIcon, DocumentIcon, UserIcon, BuildingOfficeIcon, CheckCircleIcon, ExclamationTriangleIcon, XMarkIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { ContextualDocumentManager } from '@/components/documents/ContextualDocumentManager'
import toast from 'react-hot-toast'

const cancellationSchema = z.object({
  policyNumber: z.string().min(1, 'Policy number is required'),
  cancellationId: z.string().min(1, 'Cancellation ID is required'),
  // Policy holder details
  policyHolderName: z.string().min(1, 'Policy holder name is required'),
  policyHolderEmail: z.string().email('Valid email is required'),
  policyHolderPhone: z.string().min(1, 'Phone number is required'),
  // Cancellation details
  cancellationReason: z.enum(['VOLUNTARY', 'NON_PAYMENT', 'FRAUD', 'MISREPRESENTATION', 'OTHER']),
  cancellationDescription: z.string().min(1, 'Cancellation description is required'),
  cancellationDate: z.string(),
  // Premium calculation
  totalPremiumPaid: z.number().min(0, 'Total premium paid must be positive'),
  premiumUsedPeriod: z.number().min(0, 'Premium used period must be positive'),
  premiumDeduction: z.number().min(0, 'Premium deduction must be positive'),
  refundAmount: z.number().min(0, 'Refund amount must be positive'),
  // Bank details for refund
  bankName: z.string().min(1, 'Bank name is required'),
  accountNumber: z.string().min(1, 'Account number is required'),
  ifscCode: z.string().min(1, 'IFSC code is required'),
  // API integration status
  apiIntegrationEnabled: z.boolean().default(false),
  insuranceCompanyResponse: z.string().optional()
})

type CancellationFormData = z.infer<typeof cancellationSchema>

export default function PolicyCancellationPage() {
  const router = useRouter()
  const [showDocuments, setShowDocuments] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiResponse, setApiResponse] = useState<any>(null)

  const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(cancellationSchema),
    defaultValues: {
      apiIntegrationEnabled: false
    }
  })

  const apiIntegrationEnabled = watch('apiIntegrationEnabled')
  const cancellationReason = watch('cancellationReason')
  const totalPremiumPaid = watch('totalPremiumPaid')
  const premiumUsedPeriod = watch('premiumUsedPeriod')
  const premiumDeduction = watch('premiumDeduction')

  const handleBack = () => {
    router.push('/dashboard/postsale')
  }

  const handleDocuments = () => {
    setShowDocuments(true)
  }

  const calculateRefund = () => {
    const total = totalPremiumPaid || 0
    const deduction = premiumDeduction || 0
    const refund = total - deduction
    setValue('refundAmount', Math.max(0, refund))
  }

  const onSubmit = async (data: CancellationFormData) => {
    setIsSubmitting(true)
    try {
      if (data.apiIntegrationEnabled) {
        // Mock API call to insurance company
        await new Promise(resolve => setTimeout(resolve, 3000))
        const mockResponse = {
          cancellationId: 'CANCEL-' + Date.now().toString().slice(-6),
          status: 'SUBMITTED',
          referenceNumber: 'REF-' + Date.now().toString().slice(-8),
          message: 'Policy cancellation request submitted successfully to insurance company',
          nextSteps: ['Insurance Company Review', 'Premium Calculation', 'Refund Processing', 'Cancellation Certificate Generation']
        }
        setApiResponse(mockResponse)
        setValue('insuranceCompanyResponse', JSON.stringify(mockResponse))
        toast.success('Policy cancellation request submitted to insurance company successfully!')
      } else {
        // Manual process
        await new Promise(resolve => setTimeout(resolve, 2000))
        toast.success('Policy cancellation request recorded for manual processing!')
      }
      setCurrentStep(4)
    } catch (error) {
      toast.error('Failed to submit policy cancellation request')
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
          <h1 className="text-2xl font-bold text-gray-900">Policy Cancellation</h1>
          <p className="text-gray-600 mt-2">
            Request policy cancellation with premium deduction and refund processing
          </p>
        </div>

        {/* Cancellation Warning */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <ExclamationCircleIcon className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-900 mb-2">Important Cancellation Information</h3>
              <div className="space-y-2 text-sm text-red-800">
                <div className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Policy cancellation is irreversible and will terminate all coverage</span>
                </div>
                <div className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Premium deduction will be calculated based on the period used</span>
                </div>
                <div className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Refund amount will be processed to the registered bank account</span>
                </div>
                <div className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Insurance company will issue a cancellation certificate</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between">
            {[
              { step: 1, title: 'Policy Details', description: 'Enter policy information' },
              { step: 2, title: 'Cancellation Details', description: 'Enter cancellation information' },
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
                    Cancellation ID *
                  </label>
                  <input
                    type="text"
                    {...register('cancellationId')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter cancellation ID"
                  />
                  {errors.cancellationId && <p className="text-red-500 text-xs mt-1">{errors.cancellationId.message}</p>}
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
                    Email Address *
                  </label>
                  <input
                    type="email"
                    {...register('policyHolderEmail')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter email address"
                  />
                  {errors.policyHolderEmail && <p className="text-red-500 text-xs mt-1">{errors.policyHolderEmail.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    {...register('policyHolderPhone')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter phone number"
                  />
                  {errors.policyHolderPhone && <p className="text-red-500 text-xs mt-1">{errors.policyHolderPhone.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cancellation Date *
                  </label>
                  <input
                    type="date"
                    {...register('cancellationDate')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.cancellationDate && <p className="text-red-500 text-xs mt-1">{errors.cancellationDate.message}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Cancellation Details */}
          {currentStep === 2 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Cancellation Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cancellation Reason *
                  </label>
                  <select
                    {...register('cancellationReason')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Cancellation Reason</option>
                    <option value="VOLUNTARY">Voluntary Cancellation</option>
                    <option value="NON_PAYMENT">Non-Payment of Premium</option>
                    <option value="FRAUD">Fraud</option>
                    <option value="MISREPRESENTATION">Misrepresentation</option>
                    <option value="OTHER">Other Reason</option>
                  </select>
                  {errors.cancellationReason && <p className="text-red-500 text-xs mt-1">{errors.cancellationReason.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cancellation Description *
                  </label>
                  <textarea
                    {...register('cancellationDescription')}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Provide detailed description of the cancellation reason..."
                  />
                  {errors.cancellationDescription && <p className="text-red-500 text-xs mt-1">{errors.cancellationDescription.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Premium Paid (₹) *
                    </label>
                    <input
                      type="number"
                      {...register('totalPremiumPaid', { valueAsNumber: true })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => {
                        register('totalPremiumPaid', { valueAsNumber: true }).onChange(e)
                        calculateRefund()
                      }}
                    />
                    {errors.totalPremiumPaid && <p className="text-red-500 text-xs mt-1">{errors.totalPremiumPaid.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Premium Used Period (Days) *
                    </label>
                    <input
                      type="number"
                      {...register('premiumUsedPeriod', { valueAsNumber: true })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.premiumUsedPeriod && <p className="text-red-500 text-xs mt-1">{errors.premiumUsedPeriod.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Premium Deduction (₹) *
                    </label>
                    <input
                      type="number"
                      {...register('premiumDeduction', { valueAsNumber: true })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => {
                        register('premiumDeduction', { valueAsNumber: true }).onChange(e)
                        calculateRefund()
                      }}
                    />
                    {errors.premiumDeduction && <p className="text-red-500 text-xs mt-1">{errors.premiumDeduction.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Refund Amount (₹) *
                    </label>
                    <input
                      type="number"
                      {...register('refundAmount', { valueAsNumber: true })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      readOnly
                    />
                    {errors.refundAmount && <p className="text-red-500 text-xs mt-1">{errors.refundAmount.message}</p>}
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-900 mb-2">Refund Calculation Summary</h3>
                  <div className="space-y-2 text-sm text-blue-800">
                    <div className="flex justify-between">
                      <span>Total Premium Paid:</span>
                      <span>₹{totalPremiumPaid?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Premium Deduction:</span>
                      <span>₹{premiumDeduction?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex justify-between font-medium border-t pt-2">
                      <span>Refund Amount:</span>
                      <span>₹{watch('refundAmount')?.toLocaleString() || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bank Name *
                    </label>
                    <input
                      type="text"
                      {...register('bankName')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter bank name"
                    />
                    {errors.bankName && <p className="text-red-500 text-xs mt-1">{errors.bankName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Number *
                    </label>
                    <input
                      type="text"
                      {...register('accountNumber')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter account number"
                    />
                    {errors.accountNumber && <p className="text-red-500 text-xs mt-1">{errors.accountNumber.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      IFSC Code *
                    </label>
                    <input
                      type="text"
                      {...register('ifscCode')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter IFSC code"
                    />
                    {errors.ifscCode && <p className="text-red-500 text-xs mt-1">{errors.ifscCode.message}</p>}
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
                    <XMarkIcon className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">API Integration with Insurance Company</h3>
                      <p className="text-xs text-gray-500">Submit cancellation request directly to insurance company</p>
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
                        <span className="font-medium">https://api.insurance.com/cancellations</span>
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
                        <span className="font-medium">5-7 business days</span>
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
                    Manage Cancellation Documents
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
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Policy Cancellation Request Submitted Successfully!</h3>
                  <p className="text-gray-600 mb-6">
                    Your policy cancellation request has been submitted to the insurance company.
                  </p>
                  <div className="space-y-2 mb-6">
                    <p className="text-sm text-gray-500">Cancellation ID: {apiResponse.cancellationId}</p>
                    <p className="text-sm text-gray-500">Reference Number: {apiResponse.referenceNumber}</p>
                    <p className="text-sm text-gray-500">Status: {apiResponse.status}</p>
                    <p className="text-sm text-gray-500">Policy Number: {watch('policyNumber')}</p>
                    <p className="text-sm text-gray-500">Cancellation Reason: {watch('cancellationReason')}</p>
                    <p className="text-sm text-gray-500">Refund Amount: ₹{watch('refundAmount')?.toLocaleString()}</p>
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
                      Submit Another Cancellation
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-yellow-900 mb-2">Cancellation Summary</h3>
                    <div className="space-y-2 text-sm text-yellow-800">
                      <div className="flex justify-between">
                        <span>Policy Number:</span>
                        <span>{watch('policyNumber')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cancellation ID:</span>
                        <span>{watch('cancellationId')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cancellation Reason:</span>
                        <span>{watch('cancellationReason')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Policy Holder:</span>
                        <span>{watch('policyHolderName')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Premium Paid:</span>
                        <span>₹{watch('totalPremiumPaid')?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Premium Deduction:</span>
                        <span>₹{watch('premiumDeduction')?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Refund Amount:</span>
                        <span>₹{watch('refundAmount')?.toLocaleString()}</span>
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
                {currentStep === 3 ? 'Submit Cancellation' : 'Next'}
              </button>
            </div>
          )}

          {/* Submit Button for Step 3 */}
          {currentStep === 3 && (
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Policy Cancellation Request'}
              </button>
            </div>
          )}
        </form>

        {/* Contextual Document Manager */}
        {showDocuments && (
          <ContextualDocumentManager 
            processType="policyCancellation"
            customerId="CUST-001"
          />
        )}
      </div>
    </div>
  )
}
