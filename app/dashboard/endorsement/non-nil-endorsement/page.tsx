'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeftIcon, DocumentIcon, UserIcon, BuildingOfficeIcon, CheckCircleIcon, ExclamationTriangleIcon, CreditCardIcon, PencilIcon } from '@heroicons/react/24/outline'
import { ContextualDocumentManager } from '@/components/documents/ContextualDocumentManager'
import toast from 'react-hot-toast'

const nonNilEndorsementSchema = z.object({
  policyNumber: z.string().min(1, 'Policy number is required'),
  endorsementId: z.string().min(1, 'Endorsement ID is required'),
  // Endorsement details
  endorsementType: z.enum(['NON_NIL']).default('NON_NIL'),
  changeType: z.enum(['COVERAGE_INCREASE', 'COVERAGE_DECREASE', 'PREMIUM_INCREASE', 'PREMIUM_DECREASE', 'BENEFICIARY_CHANGE', 'NOMINEE_CHANGE', 'OTHER']),
  changeDescription: z.string().min(1, 'Change description is required'),
  // Policy holder details
  policyHolderName: z.string().min(1, 'Policy holder name is required'),
  currentValue: z.string().min(1, 'Current value is required'),
  newValue: z.string().min(1, 'New value is required'),
  // Premium calculation
  additionalPremium: z.number().min(0, 'Additional premium must be positive'),
  premiumPaymentMethod: z.enum(['CARD', 'NETBANKING', 'UPI', 'CHEQUE', 'DD']),
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

type NonNilEndorsementFormData = z.infer<typeof nonNilEndorsementSchema>

export default function NonNilEndorsementPage() {
  const router = useRouter()
  const [showDocuments, setShowDocuments] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiResponse, setApiResponse] = useState<any>(null)

  const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(nonNilEndorsementSchema),
    defaultValues: {
      endorsementType: 'NON_NIL',
      apiIntegrationEnabled: false,
      kycRequired: false
    }
  })

  const apiIntegrationEnabled = watch('apiIntegrationEnabled')
  const changeType = watch('changeType')
  const kycRequired = watch('kycRequired')
  const additionalPremium = watch('additionalPremium')

  const handleBack = () => {
    router.push('/dashboard/endorsement')
  }

  const handleDocuments = () => {
    setShowDocuments(true)
  }

  const onSubmit = async (data: NonNilEndorsementFormData) => {
    setIsSubmitting(true)
    try {
      if (data.apiIntegrationEnabled) {
        // Mock API call to insurance company
        await new Promise(resolve => setTimeout(resolve, 3000))
        const mockResponse = {
          endorsementId: 'END-NON-NIL-' + Date.now().toString().slice(-6),
          status: 'SUBMITTED',
          referenceNumber: 'REF-' + Date.now().toString().slice(-8),
          message: 'Non-NIL endorsement request submitted successfully to insurance company',
          nextSteps: ['Insurance Company Review', 'Premium Payment Processing', 'Endorsement Certificate Generation', 'Policy Update']
        }
        setApiResponse(mockResponse)
        setValue('insuranceCompanyResponse', JSON.stringify(mockResponse))
        toast.success('Non-NIL endorsement request submitted to insurance company successfully!')
      } else {
        // Manual process
        await new Promise(resolve => setTimeout(resolve, 2000))
        toast.success('Non-NIL endorsement request recorded for manual processing!')
      }
      setCurrentStep(5)
    } catch (error) {
      toast.error('Failed to submit Non-NIL endorsement request')
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (currentStep < 5) {
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
              Back to Endorsement
            </button>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Non-NIL Endorsement</h1>
          <p className="text-gray-600 mt-2">
            Request Non-NIL endorsement for policy changes with premium payment
          </p>
        </div>

        {/* Non-NIL Endorsement Info */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-orange-900 mb-2">Non-NIL Endorsement Information</h3>
          <div className="space-y-2 text-sm text-orange-800">
            <div className="flex items-start">
              <span className="mr-2">•</span>
              <span>Non-NIL endorsements involve changes to policy data and may require premium payment</span>
            </div>
            <div className="flex items-start">
              <span className="mr-2">•</span>
              <span>Common changes include coverage increase/decrease, premium adjustments, beneficiary changes</span>
            </div>
            <div className="flex items-start">
              <span className="mr-2">•</span>
              <span>KYC documents may be required depending on the type of change</span>
            </div>
            <div className="flex items-start">
              <span className="mr-2">•</span>
              <span>Premium payment through integrated payment gateway</span>
            </div>
            <div className="flex items-start">
              <span className="mr-2">•</span>
              <span>Insurance company will issue an endorsement certificate upon approval</span>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between">
            {[
              { step: 1, title: 'Policy Details', description: 'Enter policy information' },
              { step: 2, title: 'Change Details', description: 'Enter change information' },
              { step: 3, title: 'Premium Payment', description: 'Process premium payment' },
              { step: 4, title: 'API Integration', description: 'Submit to insurance company' },
              { step: 5, title: 'Confirmation', description: 'Review and confirm' }
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
                {step < 5 && <div className="ml-8 h-0.5 w-16 bg-gray-200" />}
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
                    Endorsement ID *
                  </label>
                  <input
                    type="text"
                    {...register('endorsementId')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter endorsement ID"
                  />
                  {errors.endorsementId && <p className="text-red-500 text-xs mt-1">{errors.endorsementId.message}</p>}
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
                    Endorsement Date *
                  </label>
                  <input
                    type="date"
                    {...register('endorsementDate')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.endorsementDate && <p className="text-red-500 text-xs mt-1">{errors.endorsementDate.message}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Change Details */}
          {currentStep === 2 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Change Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Change Type *
                  </label>
                  <select
                    {...register('changeType')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Change Type</option>
                    <option value="COVERAGE_INCREASE">Coverage Increase</option>
                    <option value="COVERAGE_DECREASE">Coverage Decrease</option>
                    <option value="PREMIUM_INCREASE">Premium Increase</option>
                    <option value="PREMIUM_DECREASE">Premium Decrease</option>
                    <option value="BENEFICIARY_CHANGE">Beneficiary Change</option>
                    <option value="NOMINEE_CHANGE">Nominee Change</option>
                    <option value="OTHER">Other Change</option>
                  </select>
                  {errors.changeType && <p className="text-red-500 text-xs mt-1">{errors.changeType.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Value *
                  </label>
                  <input
                    type="text"
                    {...register('currentValue')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter current value"
                  />
                  {errors.currentValue && <p className="text-red-500 text-xs mt-1">{errors.currentValue.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Value *
                  </label>
                  <input
                    type="text"
                    {...register('newValue')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter new value"
                  />
                  {errors.newValue && <p className="text-red-500 text-xs mt-1">{errors.newValue.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Change Description *
                  </label>
                  <textarea
                    {...register('changeDescription')}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Provide detailed description of the change..."
                  />
                  {errors.changeDescription && <p className="text-red-500 text-xs mt-1">{errors.changeDescription.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Endorsement Reason *
                  </label>
                  <textarea
                    {...register('endorsementReason')}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter reason for endorsement..."
                  />
                  {errors.endorsementReason && <p className="text-red-500 text-xs mt-1">{errors.endorsementReason.message}</p>}
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <DocumentIcon className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">KYC Documents Required</h3>
                      <p className="text-xs text-gray-500">Additional KYC documents may be required for this change</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={kycRequired}
                      onChange={(e) => setValue('kycRequired', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-600">KYC Required</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Premium Payment */}
          {currentStep === 3 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Premium Payment</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Premium (₹) *
                  </label>
                  <input
                    type="number"
                    {...register('additionalPremium', { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter additional premium amount"
                  />
                  {errors.additionalPremium && <p className="text-red-500 text-xs mt-1">{errors.additionalPremium.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method *
                  </label>
                  <select
                    {...register('premiumPaymentMethod')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Payment Method</option>
                    <option value="CARD">Credit/Debit Card</option>
                    <option value="NETBANKING">Net Banking</option>
                    <option value="UPI">UPI</option>
                    <option value="CHEQUE">Cheque</option>
                    <option value="DD">Demand Draft</option>
                  </select>
                  {errors.premiumPaymentMethod && <p className="text-red-500 text-xs mt-1">{errors.premiumPaymentMethod.message}</p>}
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-900 mb-2">Premium Payment Summary</h3>
                  <div className="space-y-2 text-sm text-blue-800">
                    <div className="flex justify-between">
                      <span>Additional Premium:</span>
                      <span>₹{additionalPremium?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST (18%):</span>
                      <span>₹{((additionalPremium || 0) * 0.18).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-medium border-t pt-2">
                      <span>Total Amount:</span>
                      <span>₹{((additionalPremium || 0) * 1.18).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <CreditCardIcon className="h-5 w-5 text-yellow-700 mr-3" />
                  <p className="text-sm text-yellow-800">
                    Payment will be processed through integrated payment gateway. You will be redirected to the payment page.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: API Integration */}
          {currentStep === 4 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">API Integration</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <PencilIcon className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">API Integration with Insurance Company</h3>
                      <p className="text-xs text-gray-500">Submit Non-NIL endorsement request directly to insurance company</p>
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
                        <span className="font-medium">https://api.insurance.com/endorsements/non-nil</span>
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
                    Manage Endorsement Documents
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Confirmation */}
          {currentStep === 5 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Confirmation</h2>
              {apiResponse ? (
                <div className="text-center">
                  <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Non-NIL Endorsement Request Submitted Successfully!</h3>
                  <p className="text-gray-600 mb-6">
                    Your Non-NIL endorsement request has been submitted to the insurance company.
                  </p>
                  <div className="space-y-2 mb-6">
                    <p className="text-sm text-gray-500">Endorsement ID: {apiResponse.endorsementId}</p>
                    <p className="text-sm text-gray-500">Reference Number: {apiResponse.referenceNumber}</p>
                    <p className="text-sm text-gray-500">Status: {apiResponse.status}</p>
                    <p className="text-sm text-gray-500">Policy Number: {watch('policyNumber')}</p>
                    <p className="text-sm text-gray-500">Change Type: {watch('changeType')}</p>
                    <p className="text-sm text-gray-500">Policy Holder: {watch('policyHolderName')}</p>
                    <p className="text-sm text-gray-500">Additional Premium: ₹{watch('additionalPremium')?.toLocaleString()}</p>
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
                      Submit Another Endorsement
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-yellow-900 mb-2">Non-NIL Endorsement Summary</h3>
                    <div className="space-y-2 text-sm text-yellow-800">
                      <div className="flex justify-between">
                        <span>Policy Number:</span>
                        <span>{watch('policyNumber')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Endorsement ID:</span>
                        <span>{watch('endorsementId')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Change Type:</span>
                        <span>{watch('changeType')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Policy Holder:</span>
                        <span>{watch('policyHolderName')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Current Value:</span>
                        <span>{watch('currentValue')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>New Value:</span>
                        <span>{watch('newValue')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Additional Premium:</span>
                        <span>₹{watch('additionalPremium')?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>KYC Required:</span>
                        <span>{kycRequired ? 'Yes' : 'No'}</span>
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
          {currentStep < 5 && (
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
                {currentStep === 4 ? 'Submit Endorsement' : 'Next'}
              </button>
            </div>
          )}

          {/* Submit Button for Step 4 */}
          {currentStep === 4 && (
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Non-NIL Endorsement Request'}
              </button>
            </div>
          )}
        </form>

        {/* Contextual Document Manager */}
        {showDocuments && (
          <ContextualDocumentManager 
            processType="nonNilEndorsement"
            customerId="CUST-001"
          />
        )}
      </div>
    </div>
  )
}
