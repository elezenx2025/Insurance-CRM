'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeftIcon, DocumentIcon, UserIcon, BuildingOfficeIcon, CheckCircleIcon, ExclamationTriangleIcon, MagnifyingGlassIcon, CreditCardIcon } from '@heroicons/react/24/outline'
import { ContextualDocumentManager } from '@/components/documents/ContextualDocumentManager'
import toast from 'react-hot-toast'

const selfRenewalSchema = z.object({
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
  // Policy details
  policyType: z.string(),
  coverageAmount: z.number(),
  premiumAmount: z.number(),
  policyTerm: z.number(),
  renewalDate: z.string(),
  // Document verification status
  policyDocumentVerified: z.boolean().default(false),
  kycVerified: z.boolean().default(false),
  premiumPaymentVerified: z.boolean().default(false),
  selfRenewalProcessed: z.boolean().default(false)
})

type SelfRenewalFormData = z.infer<typeof selfRenewalSchema>

export default function SelfRenewalPage() {
  const router = useRouter()
  const [showDocuments, setShowDocuments] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [existingPolicy, setExistingPolicy] = useState<any>(null)

  const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(selfRenewalSchema),
    defaultValues: {
      customerType: 'INDIVIDUAL',
      policyDocumentVerified: false,
      kycVerified: false,
      premiumPaymentVerified: false,
      selfRenewalProcessed: false
    }
  })

  const customerType = watch('customerType')
  const policyDocumentVerified = watch('policyDocumentVerified')
  const kycVerified = watch('kycVerified')
  const premiumPaymentVerified = watch('premiumPaymentVerified')
  const selfRenewalProcessed = watch('selfRenewalProcessed')

  const handleBack = () => {
    router.push('/dashboard/policies')
  }

  const handlePolicyDocuments = () => {
    setShowDocuments(true)
  }

  const searchPolicy = async (policyNumber: string) => {
    try {
      // Mock API call to search for existing policy
      await new Promise(resolve => setTimeout(resolve, 1000))
      const mockPolicy = {
        policyNumber,
        customerName: 'John Doe',
        policyType: 'Life Insurance',
        coverageAmount: 500000,
        premiumAmount: 25000,
        expiryDate: '2024-12-31',
        status: 'Active',
        autoRenewalEnabled: true
      }
      setExistingPolicy(mockPolicy)
      toast.success('Policy found successfully!')
    } catch (error) {
      toast.error('Policy not found. Please check the policy number.')
    }
  }

  const onSubmit = async (data: SelfRenewalFormData) => {
    setIsSubmitting(true)
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('Self-renewal processed successfully!')
      setCurrentStep(5)
    } catch (error) {
      toast.error('Failed to process self-renewal')
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
              Back to Policies
            </button>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Self-Renewal</h1>
          <p className="text-gray-600 mt-2">
            Self-renew your policy with automatic processing and payment
          </p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between">
            {[
              { step: 1, title: 'Policy Review', description: 'Review policy details' },
              { step: 2, title: 'Document Verification', description: 'Verify policy and KYC documents' },
              { step: 3, title: 'Payment Processing', description: 'Process premium payment' },
              { step: 4, title: 'Self-Renewal', description: 'Process self-renewal' },
              { step: 5, title: 'Complete', description: 'Generate renewed policy' }
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
          {/* Step 1: Policy Review */}
          {currentStep === 1 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Policy Review</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Policy Number *
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      {...register('policyNumber')}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter policy number"
                    />
                    <button
                      type="button"
                      onClick={() => searchPolicy(watch('policyNumber'))}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                    >
                      <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                      Search
                    </button>
                  </div>
                  {errors.policyNumber && <p className="text-red-500 text-xs mt-1">{errors.policyNumber.message}</p>}
                </div>

                {existingPolicy && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-green-900 mb-2">Policy Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Customer:</span>
                        <span className="ml-2 font-medium">{existingPolicy.customerName}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Policy Type:</span>
                        <span className="ml-2 font-medium">{existingPolicy.policyType}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Coverage:</span>
                        <span className="ml-2 font-medium">₹{existingPolicy.coverageAmount.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Premium:</span>
                        <span className="ml-2 font-medium">₹{existingPolicy.premiumAmount.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Expiry Date:</span>
                        <span className="ml-2 font-medium">{existingPolicy.expiryDate}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Auto-Renewal:</span>
                        <span className="ml-2 font-medium text-green-600">{existingPolicy.autoRenewalEnabled ? 'Enabled' : 'Disabled'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Document Verification */}
          {currentStep === 2 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Document Verification</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <DocumentIcon className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Policy Document Verification</h3>
                      <p className="text-xs text-gray-500">Current policy document and terms</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={policyDocumentVerified}
                      onChange={(e) => setValue('policyDocumentVerified', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-600">Verified</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <UserIcon className="h-5 w-5 text-green-600 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">KYC Verification</h3>
                      <p className="text-xs text-gray-500">Identity and address verification</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={kycVerified}
                      onChange={(e) => setValue('kycVerified', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-600">Verified</span>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handlePolicyDocuments}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Manage Policy Documents
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Payment Processing */}
          {currentStep === 3 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Premium Payment</h2>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-900">Payment Summary</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Premium Amount:</span>
                      <span>₹{watch('premiumAmount') || existingPolicy?.premiumAmount || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Self-Renewal Discount (10%):</span>
                      <span>-₹{((watch('premiumAmount') || existingPolicy?.premiumAmount || 0) * 0.10).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>GST (18%):</span>
                      <span>₹{(((watch('premiumAmount') || existingPolicy?.premiumAmount || 0) * 0.90) * 0.18).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-medium border-t pt-2">
                      <span>Total Amount:</span>
                      <span>₹{(((watch('premiumAmount') || existingPolicy?.premiumAmount || 0) * 0.90) * 1.18).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="AUTO_DEBIT">Auto Debit (Recommended)</option>
                    <option value="CARD">Credit/Debit Card</option>
                    <option value="NETBANKING">Net Banking</option>
                    <option value="UPI">UPI</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <CreditCardIcon className="h-5 w-5 text-green-600 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Payment Processed</h3>
                      <p className="text-xs text-gray-500">Premium payment has been processed</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={premiumPaymentVerified}
                      onChange={(e) => setValue('premiumPaymentVerified', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-600">Verified</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Self-Renewal Processing */}
          {currentStep === 4 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Self-Renewal Processing</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      Coverage Amount (₹) *
                    </label>
                    <input
                      type="number"
                      {...register('coverageAmount', { valueAsNumber: true })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.coverageAmount && <p className="text-red-500 text-xs mt-1">{errors.coverageAmount.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Premium Amount (₹) *
                    </label>
                    <input
                      type="number"
                      {...register('premiumAmount', { valueAsNumber: true })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.premiumAmount && <p className="text-red-500 text-xs mt-1">{errors.premiumAmount.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Policy Term (Years) *
                    </label>
                    <input
                      type="number"
                      {...register('policyTerm', { valueAsNumber: true })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.policyTerm && <p className="text-red-500 text-xs mt-1">{errors.policyTerm.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Renewal Date *
                    </label>
                    <input
                      type="date"
                      {...register('renewalDate')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.renewalDate && <p className="text-red-500 text-xs mt-1">{errors.renewalDate.message}</p>}
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-yellow-900 mb-2">Self-Renewal Benefits</h3>
                  <div className="space-y-2 text-sm text-yellow-800">
                    <div className="flex justify-between">
                      <span>Automatic Processing:</span>
                      <span className="font-medium">No manual intervention required</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Renewal Discount:</span>
                      <span className="font-medium">10% discount on premium</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Continuous Coverage:</span>
                      <span className="font-medium">No gap in insurance coverage</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Auto Payment:</span>
                      <span className="font-medium">Automatic premium deduction</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <BuildingOfficeIcon className="h-5 w-5 text-green-600 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Self-Renewal Processed</h3>
                      <p className="text-xs text-gray-500">Self-renewal has been processed successfully</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selfRenewalProcessed}
                      onChange={(e) => setValue('selfRenewalProcessed', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-600">Processed</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Success */}
          {currentStep === 5 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center">
              <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Self-Renewal Successful!</h2>
              <p className="text-gray-600 mb-6">
                Your policy has been automatically renewed. You will receive a confirmation email shortly.
              </p>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Policy Number: {watch('policyNumber')}</p>
                <p className="text-sm text-gray-500">Renewal Date: {watch('renewalDate')}</p>
                <p className="text-sm text-gray-500">New Expiry Date: {new Date(new Date(watch('renewalDate')).getTime() + (watch('policyTerm') || 1) * 365 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                <p className="text-sm text-gray-500">Auto-Renewal: Enabled for next year</p>
              </div>
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
                {currentStep === 4 ? 'Process Self-Renewal' : 'Next'}
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
                {isSubmitting ? 'Processing...' : 'Submit Self-Renewal'}
              </button>
            </div>
          )}
        </form>

        {/* Contextual Document Manager */}
        {showDocuments && (
          <ContextualDocumentManager 
            processType="self-renewal"
            customerId="CUST-001"
          />
        )}
      </div>
    </div>
  )
}