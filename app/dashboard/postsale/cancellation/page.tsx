'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon, XMarkIcon, ExclamationTriangleIcon, DocumentIcon, BanknotesIcon, PlusIcon, EyeIcon, PencilIcon, ClockIcon, UserIcon, DocumentTextIcon, CheckCircleIcon, CurrencyRupeeIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface PendingCancellation {
  id: string
  cancellationNumber: string
  policyNumber: string
  customerName: string
  policyType: string
  premiumPaid: number
  refundAmount: number
  submittedDate: string
  currentStage: string
  stageNumber: number
  totalStages: number
  pendingReason: string
  daysInCurrentStage: number
  assignedTo: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
}

export default function CancellationPage() {
  const router = useRouter()
  
  const [pendingCancellations] = useState<PendingCancellation[]>([
    {
      id: '1',
      cancellationNumber: 'CAN/2025/001',
      policyNumber: 'POL/MTR/2024/567',
      customerName: 'Sanjay Mehta',
      policyType: 'MOTOR',
      premiumPaid: 28000,
      refundAmount: 18500,
      submittedDate: '2025-10-06',
      currentStage: 'Premium Calculation',
      stageNumber: 2,
      totalStages: 5,
      pendingReason: 'Calculating pro-rata premium deduction based on policy usage period',
      daysInCurrentStage: 5,
      assignedTo: 'Finance Officer - Ms. Neha Kapoor',
      priority: 'MEDIUM'
    },
    {
      id: '2',
      cancellationNumber: 'CAN/2025/002',
      policyNumber: 'POL/HLT/2023/890',
      customerName: 'Ritu Sharma',
      policyType: 'HEALTH',
      premiumPaid: 52000,
      refundAmount: 32000,
      submittedDate: '2025-10-02',
      currentStage: 'Insurance Company Approval',
      stageNumber: 3,
      totalStages: 5,
      pendingReason: 'Pending approval from insurance company underwriting team',
      daysInCurrentStage: 9,
      assignedTo: 'Claims Officer - Mr. Arun Verma',
      priority: 'HIGH'
    },
    {
      id: '3',
      cancellationNumber: 'CAN/2025/003',
      policyNumber: 'POL/FIR/2022/234',
      customerName: 'Alpha Corp Ltd',
      policyType: 'FIRE',
      premiumPaid: 450000,
      refundAmount: 125000,
      submittedDate: '2025-09-25',
      currentStage: 'Refund Processing',
      stageNumber: 4,
      totalStages: 5,
      pendingReason: 'Bank account verification pending - Awaiting customer to confirm account details',
      daysInCurrentStage: 16,
      assignedTo: 'Finance Officer - Ms. Neha Kapoor',
      priority: 'CRITICAL'
    },
    {
      id: '4',
      cancellationNumber: 'CAN/2025/004',
      policyNumber: 'POL/LIF/2024/112',
      customerName: 'Manish Gupta',
      policyType: 'LIFE',
      premiumPaid: 75000,
      refundAmount: 68000,
      submittedDate: '2025-10-10',
      currentStage: 'Cancellation Request',
      stageNumber: 1,
      totalStages: 5,
      pendingReason: 'Verifying cancellation reason and policy terms compliance',
      daysInCurrentStage: 1,
      assignedTo: 'Policy Admin - Mr. Suresh Reddy',
      priority: 'LOW'
    }
  ])

  const handleBack = () => {
    router.push('/dashboard/postsale')
  }

  const cancellationProcesses = [
    {
      id: 'policy-cancellation',
      title: 'Policy Cancellation',
      description: 'Request policy cancellation with premium deduction and refund processing',
      href: '/dashboard/cancellation',
      icon: XMarkIcon,
      color: 'red'
    }
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      red: 'bg-red-50 border-red-200 text-red-600'
    }
    return colors[color as keyof typeof colors] || colors.red
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
    if (days >= 14) return 'text-red-600'
    if (days >= 7) return 'text-orange-600'
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
              href="/dashboard/cancellation"
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              New Cancellation Request
            </Link>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Policy Cancellation Dashboard</h1>
          <p className="text-gray-600 mt-2">
              Manage policy cancellation requests and track refund processing at every stage
          </p>
          </div>
        </div>

        {/* Cancellation Warning */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <div className="flex items-start">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-3 mt-0.5" />
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

        {/* Cancellation Process Overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Cancellation Process Overview</h2>
          <p className="text-sm text-gray-600 mb-6">
            Complete workflow for policy cancellation and refund processing
          </p>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <DocumentTextIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xs font-semibold text-gray-900">Step 1</h3>
              <p className="text-xs text-gray-600 mt-1">Cancellation Request</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-2">
                <BanknotesIcon className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xs font-semibold text-gray-900">Step 2</h3>
              <p className="text-xs text-gray-600 mt-1">Premium Calculation</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-2">
                <DocumentIcon className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xs font-semibold text-gray-900">Step 3</h3>
              <p className="text-xs text-gray-600 mt-1">Insurance Approval</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-teal-100 rounded-full flex items-center justify-center mb-2">
                <CurrencyRupeeIcon className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-xs font-semibold text-gray-900">Step 4</h3>
              <p className="text-xs text-gray-600 mt-1">Refund Processing</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-2">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xs font-semibold text-gray-900">Step 5</h3>
              <p className="text-xs text-gray-600 mt-1">Completion</p>
            </div>
          </div>
        </div>

        {/* Pending Cancellations - Detailed Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Pending Cancellations - Detailed Status</h2>
              <p className="text-sm text-gray-600 mt-1">
                Track cancellation progress with current stage, reason for pending, and refund status
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <ClockIcon className="h-5 w-5" />
              <span className="font-semibold">{pendingCancellations.length} cancellations in progress</span>
            </div>
          </div>

          <div className="space-y-4">
            {pendingCancellations.map((cancellation) => (
              <div key={cancellation.id} className="border border-gray-200 rounded-lg p-4 hover:border-red-300 transition-colors">
                {/* Header Row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-base font-semibold text-gray-900">{cancellation.cancellationNumber}</h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(cancellation.priority)}`}>
                        {cancellation.priority}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Customer:</span>
                        <span className="ml-2 font-medium text-gray-900">{cancellation.customerName}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Policy:</span>
                        <span className="ml-2 font-medium text-gray-900">{cancellation.policyNumber}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Premium Paid:</span>
                        <span className="ml-2 font-medium text-gray-900">{formatCurrency(cancellation.premiumPaid)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Refund Amount:</span>
                        <span className="ml-2 font-medium text-green-600">{formatCurrency(cancellation.refundAmount)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">Current Stage:</span>
                      <span className="text-sm font-semibold text-red-600">{cancellation.currentStage}</span>
                      <span className="text-xs text-gray-500">(Step {cancellation.stageNumber} of {cancellation.totalStages})</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{getStageProgress(cancellation.stageNumber, cancellation.totalStages)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getStageProgress(cancellation.stageNumber, cancellation.totalStages)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Pending Reason */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                  <div className="flex items-start space-x-2">
                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-yellow-900">Reason for Pending:</p>
                      <p className="text-sm text-yellow-800 mt-1">{cancellation.pendingReason}</p>
                    </div>
                  </div>
                </div>

                {/* Footer Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <UserIcon className="h-4 w-4" />
                      <span>{cancellation.assignedTo}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="h-4 w-4" />
                      <span>Submitted: {cancellation.submittedDate}</span>
                    </div>
                    <div className={`flex items-center space-x-1 font-medium ${getDaysColor(cancellation.daysInCurrentStage)}`}>
                      <span>{cancellation.daysInCurrentStage} days in current stage</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toast.success(`Viewing details for ${cancellation.cancellationNumber}`)}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                      <EyeIcon className="h-4 w-4 mr-1" />
                      View Details
                    </button>
                    <button
                      onClick={() => toast.success(`Processing cancellation ${cancellation.cancellationNumber}`)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
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

        {/* Cancellation Processes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {cancellationProcesses.map((process) => (
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
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                    {process.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {process.description}
                  </p>
                  <div className="mt-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
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
              <span>Direct submission to insurance company for cancellation processing</span>
            </div>
            <div className="flex items-start">
              <span className="mr-2">•</span>
              <span>Automatic premium calculation and deduction</span>
            </div>
            <div className="flex items-start">
              <span className="mr-2">•</span>
              <span>Refund processing to registered bank account</span>
            </div>
            <div className="flex items-start">
              <span className="mr-2">•</span>
              <span>Automatic generation of cancellation certificate</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
