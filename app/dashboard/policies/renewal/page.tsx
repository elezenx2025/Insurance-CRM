'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeftIcon, DocumentIcon, UserIcon, BuildingOfficeIcon, CheckCircleIcon, ExclamationTriangleIcon, MagnifyingGlassIcon, EyeIcon, PencilIcon, ClockIcon } from '@heroicons/react/24/outline'
import { ContextualDocumentManager } from '@/components/documents/ContextualDocumentManager'
import toast from 'react-hot-toast'

const renewalSchema = z.object({
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
  kycDocumentVerified: z.boolean().default(false),
  premiumCalculated: z.boolean().default(false),
  renewalProcessed: z.boolean().default(false)
})

type RenewalFormData = z.infer<typeof renewalSchema>

interface PendingPolicy {
  id: string
  policyNumber: string
  customerName: string
  policyType: string
  submittedDate: string
  expiryDate: string
  premium: number
  status: string
  daysUntilExpiry: number
}

export default function PolicyRenewalPage() {
  const router = useRouter()
  const [showDocuments, setShowDocuments] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [existingPolicy, setExistingPolicy] = useState<any>(null)
  const [pendingPolicies, setPendingPolicies] = useState<PendingPolicy[]>([
    {
      id: '1',
      policyNumber: 'POL/2024/001',
      customerName: 'Rajesh Kumar',
      policyType: 'HEALTH',
      submittedDate: '2024-10-05',
      expiryDate: '2025-11-15',
      premium: 28500,
      status: 'Pending Renewal',
      daysUntilExpiry: 33
    },
    {
      id: '2',
      policyNumber: 'POL/2024/002',
      customerName: 'Priya Sharma',
      policyType: 'MOTOR',
      submittedDate: '2024-09-28',
      expiryDate: '2025-10-25',
      premium: 15600,
      status: 'Pending Renewal',
      daysUntilExpiry: 12
    },
    {
      id: '3',
      policyNumber: 'POL/2024/003',
      customerName: 'Tech Solutions Pvt Ltd',
      policyType: 'FIRE',
      submittedDate: '2024-10-01',
      expiryDate: '2025-11-30',
      premium: 125000,
      status: 'Pending Renewal',
      daysUntilExpiry: 48
    },
    {
      id: '4',
      policyNumber: 'POL/2024/004',
      customerName: 'Amit Patel',
      policyType: 'LIFE',
      submittedDate: '2024-09-20',
      expiryDate: '2025-10-20',
      premium: 45000,
      status: 'Pending Renewal',
      daysUntilExpiry: 7
    },
    {
      id: '5',
      policyNumber: 'POL/2024/005',
      customerName: 'Sunita Verma',
      policyType: 'MARINE',
      submittedDate: '2024-10-08',
      expiryDate: '2025-12-10',
      premium: 89000,
      status: 'Pending Renewal',
      daysUntilExpiry: 58
    }
  ])

  const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(renewalSchema),
    defaultValues: {
      customerType: 'INDIVIDUAL',
      policyDocumentVerified: false,
      kycDocumentVerified: false,
      premiumCalculated: false,
      renewalProcessed: false
    }
  })

  const customerType = watch('customerType')
  const policyDocumentVerified = watch('policyDocumentVerified')
  const kycDocumentVerified = watch('kycDocumentVerified')
  const premiumCalculated = watch('premiumCalculated')
  const renewalProcessed = watch('renewalProcessed')

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
        status: 'Active'
      }
      setExistingPolicy(mockPolicy)
      toast.success('Policy found successfully!')
    } catch (error) {
      toast.error('Policy not found. Please check the policy number.')
    }
  }

  const handleViewPolicy = (policy: PendingPolicy) => {
    toast.success(`Viewing policy: ${policy.policyNumber}`)
    // In a real app, this would open a modal or navigate to a detailed view
    setValue('policyNumber', policy.policyNumber)
    setExistingPolicy({
      policyNumber: policy.policyNumber,
      customerName: policy.customerName,
      policyType: policy.policyType,
      coverageAmount: policy.premium * 20,
      premiumAmount: policy.premium,
      expiryDate: policy.expiryDate,
      status: policy.status
    })
  }

  const handleEditPolicy = (policy: PendingPolicy) => {
    toast.success(`Editing policy: ${policy.policyNumber}`)
    // Load the policy data into the form and move to step 2
    setValue('policyNumber', policy.policyNumber)
    setExistingPolicy({
      policyNumber: policy.policyNumber,
      customerName: policy.customerName,
      policyType: policy.policyType,
      coverageAmount: policy.premium * 20,
      premiumAmount: policy.premium,
      expiryDate: policy.expiryDate,
      status: policy.status
    })
    setCurrentStep(2)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getUrgencyColor = (days: number) => {
    if (days <= 7) return 'text-red-600 bg-red-50'
    if (days <= 30) return 'text-orange-600 bg-orange-50'
    return 'text-green-600 bg-green-50'
  }

  const onSubmit = async (data: RenewalFormData) => {
    setIsSubmitting(true)
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('Policy renewal submitted successfully!')
      setCurrentStep(5)
    } catch (error) {
      toast.error('Failed to submit policy renewal')
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
          <h1 className="text-2xl font-bold text-gray-900">Policy Renewal</h1>
          <p className="text-gray-600 mt-2">
            Renew an existing policy with updated information and document verification
          </p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between">
            {[
              { step: 1, title: 'Policy Search', description: 'Find existing policy details' },
              { step: 2, title: 'Document Verification', description: 'Verify policy and KYC documents' },
              { step: 3, title: 'Update Information', description: 'Update customer information if needed' },
              { step: 4, title: 'Premium Calculation', description: 'Calculate renewal premium' },
              { step: 5, title: 'Process Renewal', description: 'Generate renewed policy document' }
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
          {/* Step 1: Policy Search */}
          {currentStep === 1 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Search Existing Policy</h2>
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
                    <h3 className="text-sm font-medium text-green-900 mb-2">Policy Found</h3>
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
                        <span className="text-gray-600">Status:</span>
                        <span className="ml-2 font-medium text-green-600">{existingPolicy.status}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Pending Policies List */}
          {currentStep === 1 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Pending Policies for Renewal</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Policies approaching expiry that need to be renewed
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <ClockIcon className="h-5 w-5" />
                  <span>{pendingPolicies.length} policies pending</span>
                </div>
              </div>

              {pendingPolicies.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Policy Number
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Policy Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Expiry Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Premium
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Days Until Expiry
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pendingPolicies.map((policy) => (
                        <tr key={policy.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{policy.policyNumber}</div>
                            <div className="text-xs text-gray-500">Submitted: {policy.submittedDate}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{policy.customerName}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {policy.policyType}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {policy.expiryDate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(policy.premium)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getUrgencyColor(policy.daysUntilExpiry)}`}>
                              {policy.daysUntilExpiry} days
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              {policy.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                type="button"
                                onClick={() => handleViewPolicy(policy)}
                                className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                title="View Policy"
                              >
                                <EyeIcon className="h-4 w-4 mr-1" />
                                View
                              </button>
                              <button
                                type="button"
                                onClick={() => handleEditPolicy(policy)}
                                className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                title="Edit Policy"
                              >
                                <PencilIcon className="h-4 w-4 mr-1" />
                                Edit
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No pending policies</h3>
                  <p className="mt-1 text-sm text-gray-500">All policies are up to date.</p>
                </div>
              )}
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
                      <h3 className="text-sm font-medium text-gray-900">KYC Document Updates</h3>
                      <p className="text-xs text-gray-500">Updated identity and address proof</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={kycDocumentVerified}
                      onChange={(e) => setValue('kycDocumentVerified', e.target.checked)}
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

          {/* Step 3: Update Information */}
          {currentStep === 3 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Update Customer Information</h2>
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
                        First Name
                      </label>
                      <input
                        type="text"
                        {...register('firstName')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        {...register('lastName')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
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
                        Company Name
                      </label>
                      <input
                        type="text"
                        {...register('companyName')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
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

          {/* Step 4: Premium Calculation */}
          {currentStep === 4 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Premium Calculation</h2>
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

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-900">Renewal Premium Summary</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Base Premium:</span>
                      <span>₹{watch('premiumAmount') || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Renewal Discount (5%):</span>
                      <span>-₹{((watch('premiumAmount') || 0) * 0.05).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>GST (18%):</span>
                      <span>₹{(((watch('premiumAmount') || 0) * 0.95) * 0.18).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-medium border-t pt-2">
                      <span>Total Renewal Premium:</span>
                      <span>₹{(((watch('premiumAmount') || 0) * 0.95) * 1.18).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <BuildingOfficeIcon className="h-5 w-5 text-green-600 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Premium Calculation Complete</h3>
                      <p className="text-xs text-gray-500">Renewal premium has been calculated</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={premiumCalculated}
                      onChange={(e) => setValue('premiumCalculated', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-600">Calculated</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Success */}
          {currentStep === 5 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center">
              <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Policy Renewal Successful!</h2>
              <p className="text-gray-600 mb-6">
                Your policy has been renewed successfully. You will receive a confirmation email shortly.
              </p>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Renewed Policy Number: {watch('policyNumber')}</p>
                <p className="text-sm text-gray-500">Renewal Date: {watch('renewalDate')}</p>
                <p className="text-sm text-gray-500">New Expiry Date: {new Date(new Date(watch('renewalDate')).getTime() + (watch('policyTerm') || 1) * 365 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
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
                {currentStep === 4 ? 'Process Renewal' : 'Next'}
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
                {isSubmitting ? 'Processing...' : 'Submit Renewal'}
              </button>
            </div>
          )}
        </form>

        {/* Contextual Document Manager */}
        {showDocuments && (
          <ContextualDocumentManager 
            processType="renewal"
            customerId="CUST-001"
          />
        )}
      </div>
    </div>
  )
}