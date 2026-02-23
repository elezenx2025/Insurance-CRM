'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon, PencilIcon, DocumentTextIcon, CreditCardIcon, CheckCircleIcon, PlusIcon, EyeIcon, ClockIcon, ExclamationTriangleIcon, UserIcon, DocumentIcon, BanknotesIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface PendingEndorsement {
  id: string
  endorsementNumber: string
  policyNumber: string
  customerName: string
  endorsementType: string
  premiumImpact: number
  submittedDate: string
  currentStage: string
  stageNumber: number
  totalStages: number
  pendingReason: string
  daysInCurrentStage: number
  assignedTo: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
}

export default function EndorsementPage() {
  const router = useRouter()
  
  const [pendingEndorsements] = useState<PendingEndorsement[]>([
    {
      id: '1',
      endorsementNumber: 'END/2025/001',
      policyNumber: 'POL/MTR/2024/123',
      customerName: 'Vikram Patel',
      endorsementType: 'NIL - Address Change',
      premiumImpact: 0,
      submittedDate: '2025-10-07',
      currentStage: 'Endorsement Details',
      stageNumber: 2,
      totalStages: 4,
      pendingReason: 'Waiting for customer to upload new address proof documents',
      daysInCurrentStage: 4,
      assignedTo: 'Endorsement Officer - Ms. Priya Sharma',
      priority: 'MEDIUM'
    },
    {
      id: '2',
      endorsementNumber: 'END/2025/002',
      policyNumber: 'POL/HLT/2023/456',
      customerName: 'Deepika Rao',
      endorsementType: 'Non-NIL - Coverage Increase',
      premiumImpact: 15000,
      submittedDate: '2025-10-03',
      currentStage: 'API Integration',
      stageNumber: 3,
      totalStages: 4,
      pendingReason: 'Awaiting API response from insurance company for premium calculation',
      daysInCurrentStage: 8,
      assignedTo: 'IT Team - Mr. Rajesh Kumar',
      priority: 'HIGH'
    },
    {
      id: '3',
      endorsementNumber: 'END/2025/003',
      policyNumber: 'POL/FIR/2024/789',
      customerName: 'Metro Industries',
      endorsementType: 'Non-NIL - Add Beneficiary',
      premiumImpact: 8500,
      submittedDate: '2025-10-09',
      currentStage: 'Policy Details',
      stageNumber: 1,
      totalStages: 4,
      pendingReason: 'Verifying beneficiary KYC documents and relationship proof',
      daysInCurrentStage: 2,
      assignedTo: 'Policy Admin - Mr. Anil Singh',
      priority: 'LOW'
    },
    {
      id: '4',
      endorsementNumber: 'END/2025/004',
      policyNumber: 'POL/LIF/2022/234',
      customerName: 'Kavita Malhotra',
      endorsementType: 'NIL - Name Correction',
      premiumImpact: 0,
      submittedDate: '2025-09-28',
      currentStage: 'API Integration',
      stageNumber: 3,
      totalStages: 4,
      pendingReason: 'Insurance company API timeout - Retrying submission',
      daysInCurrentStage: 13,
      assignedTo: 'IT Team - Mr. Rajesh Kumar',
      priority: 'CRITICAL'
    }
  ])

  const handleBack = () => {
    router.push('/dashboard/postsale')
  }

  const endorsementProcesses = [
    {
      id: 'nil-endorsement',
      title: 'NIL Endorsement',
      description: 'Request NIL endorsement for policy corrections with no premium payment',
      href: '/dashboard/endorsement/nil-endorsement',
      icon: PencilIcon,
      color: 'blue'
    },
    {
      id: 'non-nil-endorsement',
      title: 'Non-NIL Endorsement',
      description: 'Request Non-NIL endorsement for policy changes with premium payment',
      href: '/dashboard/endorsement/non-nil-endorsement',
      icon: CreditCardIcon,
      color: 'orange'
    }
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 text-blue-600',
      orange: 'bg-orange-50 border-orange-200 text-orange-600'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'LOW':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStageProgress = (stageNumber: number, totalStages: number) => {
    return Math.round((stageNumber / totalStages) * 100)
  }

  const getDaysColor = (days: number) => {
    if (days >= 10) return 'text-red-600'
    if (days >= 5) return 'text-orange-600'
    return 'text-gray-600'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Post-Sales
            </button>
            <Link
              href="/dashboard/endorsement/nil-endorsement"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              New Endorsement Request
            </Link>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Policy Endorsement Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Manage policy endorsements and track processing status at every stage
            </p>
          </div>
        </div>

        {/* Endorsement Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-sm font-medium text-blue-900 mb-2">NIL Endorsement</h3>
            <div className="space-y-2 text-sm text-blue-800">
              <div className="flex items-start">
                <span className="mr-2">•</span>
                <span>Corrections in issued policy with no premium payment</span>
              </div>
              <div className="flex items-start">
                <span className="mr-2">•</span>
                <span>Common corrections include name, address, phone, email</span>
              </div>
              <div className="flex items-start">
                <span className="mr-2">•</span>
                <span>Insurance company issues endorsement certificate</span>
              </div>
              <div className="flex items-start">
                <span className="mr-2">•</span>
                <span>Processing time: 3-5 business days</span>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <h3 className="text-sm font-medium text-orange-900 mb-2">Non-NIL Endorsement</h3>
            <div className="space-y-2 text-sm text-orange-800">
              <div className="flex items-start">
                <span className="mr-2">•</span>
                <span>Changes to policy data requiring premium payment</span>
              </div>
              <div className="flex items-start">
                <span className="mr-2">•</span>
                <span>Coverage increase/decrease, beneficiary changes</span>
              </div>
              <div className="flex items-start">
                <span className="mr-2">•</span>
                <span>KYC documents may be required</span>
              </div>
              <div className="flex items-start">
                <span className="mr-2">•</span>
                <span>Premium payment through integrated payment gateway</span>
              </div>
            </div>
          </div>
        </div>

        {/* Endorsement Process Overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Endorsement Process Overview</h2>
          <p className="text-sm text-gray-600 mb-6">
            Complete workflow for policy endorsement processing
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <DocumentTextIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xs font-semibold text-gray-900">Step 1</h3>
              <p className="text-xs text-gray-600 mt-1">Policy Details</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-2">
                <PencilIcon className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xs font-semibold text-gray-900">Step 2</h3>
              <p className="text-xs text-gray-600 mt-1">Endorsement Details</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-2">
                <DocumentIcon className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xs font-semibold text-gray-900">Step 3</h3>
              <p className="text-xs text-gray-600 mt-1">API Integration</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-2">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xs font-semibold text-gray-900">Step 4</h3>
              <p className="text-xs text-gray-600 mt-1">Confirmation</p>
            </div>
          </div>
        </div>

        {/* Pending Endorsements - Detailed Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Pending Endorsements - Detailed Status</h2>
              <p className="text-sm text-gray-600 mt-1">
                Track endorsement progress with current stage, reason for pending, and assigned personnel
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <ClockIcon className="h-5 w-5" />
              <span className="font-semibold">{pendingEndorsements.length} endorsements in progress</span>
            </div>
          </div>

          <div className="space-y-4">
            {pendingEndorsements.map((endorsement) => (
              <div key={endorsement.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                {/* Header Row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-base font-semibold text-gray-900">{endorsement.endorsementNumber}</h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(endorsement.priority)}`}>
                        {endorsement.priority}
                      </span>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {endorsement.endorsementType}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Customer:</span>
                        <span className="ml-2 font-medium text-gray-900">{endorsement.customerName}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Policy:</span>
                        <span className="ml-2 font-medium text-gray-900">{endorsement.policyNumber}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Premium Impact:</span>
                        <span className={`ml-2 font-medium ${endorsement.premiumImpact > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                          {endorsement.premiumImpact > 0 ? `+${formatCurrency(endorsement.premiumImpact)}` : 'NIL'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">Current Stage:</span>
                      <span className="text-sm font-semibold text-blue-600">{endorsement.currentStage}</span>
                      <span className="text-xs text-gray-500">(Step {endorsement.stageNumber} of {endorsement.totalStages})</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{getStageProgress(endorsement.stageNumber, endorsement.totalStages)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getStageProgress(endorsement.stageNumber, endorsement.totalStages)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Pending Reason */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                  <div className="flex items-start space-x-2">
                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-yellow-900">Reason for Pending:</p>
                      <p className="text-sm text-yellow-800 mt-1">{endorsement.pendingReason}</p>
                    </div>
                  </div>
                </div>

                {/* Footer Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <UserIcon className="h-4 w-4" />
                      <span>{endorsement.assignedTo}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="h-4 w-4" />
                      <span>Submitted: {endorsement.submittedDate}</span>
                    </div>
                    <div className={`flex items-center space-x-1 font-medium ${getDaysColor(endorsement.daysInCurrentStage)}`}>
                      <span>{endorsement.daysInCurrentStage} days in current stage</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toast.success(`Viewing details for ${endorsement.endorsementNumber}`)}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                      <EyeIcon className="h-4 w-4 mr-1" />
                      View Details
                    </button>
                    <button
                      onClick={() => toast.success(`Processing endorsement ${endorsement.endorsementNumber}`)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                      <PencilIcon className="h-4 w-4 mr-1" />
                      Process
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Endorsement Processes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {endorsementProcesses.map((process) => (
            <Link
              key={process.id}
              href={process.href}
              className="group block p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:border-gray-200"
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${getColorClasses(process.color)}`}>
                  <process.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {process.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {process.description}
                  </p>
                  <div className="mt-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      API Integration Available
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* API Integration Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-sm font-medium text-blue-900 mb-2">API Integration Features</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <div className="flex items-start">
              <span className="mr-2">•</span>
              <span>Direct submission to insurance company for endorsement processing</span>
            </div>
            <div className="flex items-start">
              <span className="mr-2">•</span>
              <span>Automatic premium calculation for Non-NIL endorsements</span>
            </div>
            <div className="flex items-start">
              <span className="mr-2">•</span>
              <span>Integrated payment gateway for premium payments</span>
            </div>
            <div className="flex items-start">
              <span className="mr-2">•</span>
              <span>Automatic generation of endorsement certificates</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
