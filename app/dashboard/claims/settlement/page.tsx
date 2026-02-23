'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeftIcon, DocumentIcon, UserIcon, BuildingOfficeIcon, CheckCircleIcon, ExclamationTriangleIcon, BanknotesIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { ContextualDocumentManager } from '@/components/documents/ContextualDocumentManager'
import toast from 'react-hot-toast'

const settlementSchema = z.object({
  claimId: z.string().min(1, 'Claim ID is required'),
  settlementId: z.string().min(1, 'Settlement ID is required'),
  // Settlement details
  settlementAmount: z.number().min(0, 'Settlement amount must be positive'),
  settlementType: z.enum(['FULL_SETTLEMENT', 'PARTIAL_SETTLEMENT', 'EX_GRATIA']),
  settlementMethod: z.enum(['BANK_TRANSFER', 'CHEQUE', 'DD', 'NEFT', 'RTGS']),
  // Bank details
  beneficiaryName: z.string().min(1, 'Beneficiary name is required'),
  bankName: z.string().min(1, 'Bank name is required'),
  accountNumber: z.string().min(1, 'Account number is required'),
  ifscCode: z.string().min(1, 'IFSC code is required'),
  // Settlement process
  settlementDate: z.string(),
  settlementStatus: z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED']),
  // API integration status
  apiIntegrationEnabled: z.boolean().default(false),
  insuranceCompanyResponse: z.string().optional()
})

type SettlementFormData = z.infer<typeof settlementSchema>

export default function ClaimSettlementPage() {
  const router = useRouter()
  const [showDocuments, setShowDocuments] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiResponse, setApiResponse] = useState<any>(null)
  const [settlementPhase, setSettlementPhase] = useState<'SEND' | 'RECEIVE'>('SEND')

  const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(settlementSchema),
    defaultValues: {
      apiIntegrationEnabled: false,
      settlementStatus: 'PENDING'
    }
  })

  const apiIntegrationEnabled = watch('apiIntegrationEnabled')
  const settlementType = watch('settlementType')
  const settlementMethod = watch('settlementMethod')

  const handleBack = () => {
    router.push('/dashboard/postsale/claims')
  }

  const handleDocuments = () => {
    setShowDocuments(true)
  }

  const onSubmit = async (data: SettlementFormData) => {
    setIsSubmitting(true)
    try {
      if (data.apiIntegrationEnabled) {
        // Mock API call to insurance company
        await new Promise(resolve => setTimeout(resolve, 3000))
        const mockResponse = {
          settlementId: 'SETT-' + Date.now().toString().slice(-6),
          status: 'SUBMITTED',
          referenceNumber: 'REF-' + Date.now().toString().slice(-8),
          message: settlementPhase === 'SEND' 
            ? 'Settlement data sent to insurance company successfully'
            : 'Final settlement data received from insurance company successfully',
          nextSteps: settlementPhase === 'SEND' 
            ? ['Insurance Company Processing', 'Settlement Execution', 'Confirmation']
            : ['Settlement Confirmation', 'Payment Processing', 'Document Generation']
        }
        setApiResponse(mockResponse)
        setValue('insuranceCompanyResponse', JSON.stringify(mockResponse))
        toast.success(settlementPhase === 'SEND' 
          ? 'Settlement data sent to insurance company successfully!'
          : 'Final settlement data received from insurance company successfully!'
        )
      } else {
        // Manual process
        await new Promise(resolve => setTimeout(resolve, 2000))
        toast.success(settlementPhase === 'SEND' 
          ? 'Settlement data recorded for manual processing!'
          : 'Final settlement data recorded for manual processing!'
        )
      }
      setCurrentStep(4)
    } catch (error) {
      toast.error('Failed to process settlement')
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
          <h1 className="text-2xl font-bold text-gray-900">Claim Settlement</h1>
          <p className="text-gray-600 mt-2">
            Process claim settlement with insurance company API integration
          </p>
        </div>

        {/* Settlement Phase Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Settlement Phase</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setSettlementPhase('SEND')}
              className={`p-4 border rounded-lg text-left transition-colors ${
                settlementPhase === 'SEND' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <ArrowPathIcon className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Send Settlement Data</h3>
                  <p className="text-xs text-gray-500">Send settlement data to insurance company</p>
                </div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setSettlementPhase('RECEIVE')}
              className={`p-4 border rounded-lg text-left transition-colors ${
                settlementPhase === 'RECEIVE' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <BanknotesIcon className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Receive Final Settlement</h3>
                  <p className="text-xs text-gray-500">Receive final settlement data from insurance company</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between">
            {[
              { step: 1, title: 'Settlement Details', description: 'Enter settlement information' },
              { step: 2, title: 'Payment Details', description: 'Enter payment information' },
              { step: 3, title: 'API Integration', description: settlementPhase === 'SEND' ? 'Send to insurance company' : 'Receive from insurance company' },
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
          {/* Step 1: Settlement Details */}
          {currentStep === 1 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Settlement Information</h2>
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
                    Settlement ID *
                  </label>
                  <input
                    type="text"
                    {...register('settlementId')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter settlement ID"
                  />
                  {errors.settlementId && <p className="text-red-500 text-xs mt-1">{errors.settlementId.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Settlement Amount (₹) *
                  </label>
                  <input
                    type="number"
                    {...register('settlementAmount', { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter settlement amount"
                  />
                  {errors.settlementAmount && <p className="text-red-500 text-xs mt-1">{errors.settlementAmount.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Settlement Type *
                  </label>
                  <select
                    {...register('settlementType')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Settlement Type</option>
                    <option value="FULL_SETTLEMENT">Full Settlement</option>
                    <option value="PARTIAL_SETTLEMENT">Partial Settlement</option>
                    <option value="EX_GRATIA">Ex-Gratia</option>
                  </select>
                  {errors.settlementType && <p className="text-red-500 text-xs mt-1">{errors.settlementType.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Settlement Method *
                  </label>
                  <select
                    {...register('settlementMethod')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Settlement Method</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                    <option value="CHEQUE">Cheque</option>
                    <option value="DD">Demand Draft</option>
                    <option value="NEFT">NEFT</option>
                    <option value="RTGS">RTGS</option>
                  </select>
                  {errors.settlementMethod && <p className="text-red-500 text-xs mt-1">{errors.settlementMethod.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Settlement Date *
                  </label>
                  <input
                    type="date"
                    {...register('settlementDate')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.settlementDate && <p className="text-red-500 text-xs mt-1">{errors.settlementDate.message}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Payment Details */}
          {currentStep === 2 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Beneficiary Name *
                  </label>
                  <input
                    type="text"
                    {...register('beneficiaryName')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter beneficiary name"
                  />
                  {errors.beneficiaryName && <p className="text-red-500 text-xs mt-1">{errors.beneficiaryName.message}</p>}
                </div>
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

              <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-blue-900 mb-2">Settlement Summary</h3>
                <div className="space-y-2 text-sm text-blue-800">
                  <div className="flex justify-between">
                    <span>Claim ID:</span>
                    <span>{watch('claimId')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Settlement ID:</span>
                    <span>{watch('settlementId')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Settlement Amount:</span>
                    <span>₹{watch('settlementAmount')?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Settlement Type:</span>
                    <span>{watch('settlementType')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Settlement Method:</span>
                    <span>{watch('settlementMethod')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Beneficiary:</span>
                    <span>{watch('beneficiaryName')}</span>
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
                    <BanknotesIcon className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {settlementPhase === 'SEND' ? 'Send Settlement Data to Insurance Company' : 'Receive Final Settlement from Insurance Company'}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {settlementPhase === 'SEND' 
                          ? 'Submit settlement data directly to insurance company'
                          : 'Receive final settlement data from insurance company'
                        }
                      </p>
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
                        <span className="font-medium">
                          {settlementPhase === 'SEND' 
                            ? 'https://api.insurance.com/settlements/send'
                            : 'https://api.insurance.com/settlements/receive'
                          }
                        </span>
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
                    Manage Settlement Documents
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
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {settlementPhase === 'SEND' 
                      ? 'Settlement Data Sent Successfully!'
                      : 'Final Settlement Received Successfully!'
                    }
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {settlementPhase === 'SEND' 
                      ? 'Your settlement data has been sent to the insurance company.'
                      : 'Final settlement data has been received from the insurance company.'
                    }
                  </p>
                  <div className="space-y-2 mb-6">
                    <p className="text-sm text-gray-500">Settlement ID: {apiResponse.settlementId}</p>
                    <p className="text-sm text-gray-500">Reference Number: {apiResponse.referenceNumber}</p>
                    <p className="text-sm text-gray-500">Status: {apiResponse.status}</p>
                    <p className="text-sm text-gray-500">Claim ID: {watch('claimId')}</p>
                    <p className="text-sm text-gray-500">Settlement Amount: ₹{watch('settlementAmount')?.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Settlement Type: {watch('settlementType')}</p>
                    <p className="text-sm text-gray-500">Beneficiary: {watch('beneficiaryName')}</p>
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
                      Process Another Settlement
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-yellow-900 mb-2">Settlement Summary</h3>
                    <div className="space-y-2 text-sm text-yellow-800">
                      <div className="flex justify-between">
                        <span>Claim ID:</span>
                        <span>{watch('claimId')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Settlement ID:</span>
                        <span>{watch('settlementId')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Settlement Amount:</span>
                        <span>₹{watch('settlementAmount')?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Settlement Type:</span>
                        <span>{watch('settlementType')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Beneficiary:</span>
                        <span>{watch('beneficiaryName')}</span>
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
                {currentStep === 3 ? 'Process Settlement' : 'Next'}
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
                {isSubmitting ? 'Processing...' : settlementPhase === 'SEND' ? 'Send Settlement Data' : 'Receive Final Settlement'}
              </button>
            </div>
          )}
        </form>

        {/* Contextual Document Manager */}
        {showDocuments && (
          <ContextualDocumentManager 
            processType="settlement"
            customerId="CUST-001"
          />
        )}
      </div>
    </div>
  )
}