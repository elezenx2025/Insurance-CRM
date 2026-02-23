'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeftIcon, DocumentIcon, UserIcon, BuildingOfficeIcon, CheckCircleIcon, ExclamationTriangleIcon, DocumentTextIcon, EyeIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const proposalSchema = z.object({
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
  // Proposal details
  policyType: z.string(),
  coverageAmount: z.number(),
  premiumAmount: z.number(),
  policyTerm: z.number(),
  proposalDate: z.string(),
  // Additional proposal fields
  riskAssessment: z.string(),
  specialConditions: z.string().optional(),
  exclusions: z.string().optional(),
  benefits: z.string().optional()
})

type ProposalFormData = z.infer<typeof proposalSchema>

export default function PolicyProposalPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [proposalGenerated, setProposalGenerated] = useState(false)

  const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm<ProposalFormData>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      customerType: 'INDIVIDUAL'
    }
  })

  const customerType = watch('customerType')
  const coverageAmount = watch('coverageAmount')
  const premiumAmount = watch('premiumAmount')
  const policyTerm = watch('policyTerm')

  const handleBack = () => {
    router.push('/dashboard/presale')
  }

  const onSubmit = async (data: ProposalFormData) => {
    setIsSubmitting(true)
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('Policy proposal generated successfully!')
      setProposalGenerated(true)
      setCurrentStep(5)
    } catch (error) {
      toast.error('Failed to generate policy proposal')
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
              Back to Pre-Sales
            </button>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Policy Proposal</h1>
          <p className="text-gray-600 mt-2">
            Create detailed policy proposals for potential customers
          </p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between">
            {[
              { step: 1, title: 'Customer Info', description: 'Collect customer information' },
              { step: 2, title: 'Policy Details', description: 'Define policy terms and coverage' },
              { step: 3, title: 'Risk Assessment', description: 'Assess risk factors and conditions' },
              { step: 4, title: 'Proposal Terms', description: 'Define benefits and exclusions' },
              { step: 5, title: 'Generate Proposal', description: 'Create and finalize proposal' }
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
          {/* Step 1: Customer Information */}
          {currentStep === 1 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          {/* Step 2: Policy Details */}
          {currentStep === 2 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Policy Details</h2>
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
                    Proposal Date *
                  </label>
                  <input
                    type="date"
                    {...register('proposalDate')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.proposalDate && <p className="text-red-500 text-xs mt-1">{errors.proposalDate.message}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Risk Assessment */}
          {currentStep === 3 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Risk Assessment Level *
                  </label>
                  <select
                    {...register('riskAssessment')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Risk Level</option>
                    <option value="LOW">Low Risk</option>
                    <option value="MEDIUM">Medium Risk</option>
                    <option value="HIGH">High Risk</option>
                    <option value="VERY_HIGH">Very High Risk</option>
                  </select>
                  {errors.riskAssessment && <p className="text-red-500 text-xs mt-1">{errors.riskAssessment.message}</p>}
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-yellow-900 mb-2">Risk Assessment Guidelines</h3>
                  <div className="space-y-2 text-sm text-yellow-800">
                    <div className="flex justify-between">
                      <span>Low Risk:</span>
                      <span>Standard premium rates apply</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Medium Risk:</span>
                      <span>10-20% premium loading</span>
                    </div>
                    <div className="flex justify-between">
                      <span>High Risk:</span>
                      <span>20-50% premium loading</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Very High Risk:</span>
                      <span>50%+ premium loading or rejection</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Conditions (if any)
                  </label>
                  <textarea
                    {...register('specialConditions')}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter any special conditions or requirements..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Proposal Terms */}
          {currentStep === 4 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Proposal Terms</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Policy Benefits *
                  </label>
                  <textarea
                    {...register('benefits')}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe the key benefits of this policy..."
                  />
                  {errors.benefits && <p className="text-red-500 text-xs mt-1">{errors.benefits.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Policy Exclusions
                  </label>
                  <textarea
                    {...register('exclusions')}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="List any exclusions or limitations..."
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-900 mb-2">Proposal Summary</h3>
                  <div className="space-y-2 text-sm text-blue-800">
                    <div className="flex justify-between">
                      <span>Customer:</span>
                      <span>{customerType === 'INDIVIDUAL' ? `${watch('firstName')} ${watch('lastName')}` : watch('companyName')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Policy Type:</span>
                      <span>{watch('policyType')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Coverage Amount:</span>
                      <span>₹{coverageAmount?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Premium Amount:</span>
                      <span>₹{premiumAmount?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Policy Term:</span>
                      <span>{policyTerm} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Risk Level:</span>
                      <span>{watch('riskAssessment')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Generate Proposal */}
          {currentStep === 5 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Generate Policy Proposal</h2>
              {proposalGenerated ? (
                <div className="text-center">
                  <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Proposal Generated Successfully!</h3>
                  <p className="text-gray-600 mb-6">
                    The policy proposal has been generated and is ready for review.
                  </p>
                  <div className="space-y-2 mb-6">
                    <p className="text-sm text-gray-500">Proposal Number: PRO-{Date.now().toString().slice(-6)}</p>
                    <p className="text-sm text-gray-500">Generated Date: {new Date().toLocaleDateString()}</p>
                    <p className="text-sm text-gray-500">Customer: {customerType === 'INDIVIDUAL' ? `${watch('firstName')} ${watch('lastName')}` : watch('companyName')}</p>
                    <p className="text-sm text-gray-500">Policy Type: {watch('policyType')}</p>
                    <p className="text-sm text-gray-500">Coverage Amount: ₹{watch('coverageAmount')?.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Premium Amount: ₹{watch('premiumAmount')?.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Risk Assessment: {watch('riskAssessment')}</p>
                  </div>
                  <div className="flex justify-center space-x-4">
                    <button
                      type="button"
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      <EyeIcon className="h-4 w-4 mr-2" />
                      View Proposal
                    </button>
                    <button
                      type="button"
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      <DocumentTextIcon className="h-4 w-4 mr-2" />
                      Download PDF
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentStep(1)
                        setProposalGenerated(false)
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Create Another Proposal
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-yellow-900 mb-2">Proposal Summary</h3>
                    <div className="space-y-2 text-sm text-yellow-800">
                      <div className="flex justify-between">
                        <span>Customer:</span>
                        <span>{customerType === 'INDIVIDUAL' ? `${watch('firstName')} ${watch('lastName')}` : watch('companyName')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Email:</span>
                        <span>{watch('email')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Policy Type:</span>
                        <span>{watch('policyType')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Coverage Amount:</span>
                        <span>₹{watch('coverageAmount')?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Premium Amount:</span>
                        <span>₹{watch('premiumAmount')?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Policy Term:</span>
                        <span>{watch('policyTerm')} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Risk Assessment:</span>
                        <span>{watch('riskAssessment')}</span>
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
                {currentStep === 4 ? 'Generate Proposal' : 'Next'}
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
                {isSubmitting ? 'Generating...' : 'Generate Proposal'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
