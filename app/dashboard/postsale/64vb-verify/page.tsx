'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon, ShieldCheckIcon, ClockIcon, DocumentIcon, CheckCircleIcon, PlusIcon, EyeIcon, PencilIcon, DocumentTextIcon, BanknotesIcon, ExclamationTriangleIcon, UserIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface PendingVerification {
  id: string
  policyNumber: string
  customerName: string
  policyType: string
  premiumAmount: number
  submittedDate: string
  currentStage: string
  stageNumber: number
  totalStages: number
  pendingReason: string
  daysInCurrentStage: number
  assignedTo: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
}

export default function Verification64VBPage() {
  const router = useRouter()
  
  const [pendingVerifications] = useState<PendingVerification[]>([
    {
      id: '1',
      policyNumber: 'POL/MTR/2024/256',
      customerName: 'Ramesh Singh',
      policyType: 'MOTOR',
      premiumAmount: 32000,
      submittedDate: '2025-10-08',
      currentStage: 'Payment Reconciliation',
      stageNumber: 2,
      totalStages: 4,
      pendingReason: 'Awaiting payment confirmation from insurance company banking system',
      daysInCurrentStage: 3,
      assignedTo: 'Finance Officer - Ms. Meera Shah',
      priority: 'HIGH'
    },
    {
      id: '2',
      policyNumber: 'POL/HLT/2024/178',
      customerName: 'Anjali Mehta',
      policyType: 'HEALTH',
      premiumAmount: 45000,
      submittedDate: '2025-10-05',
      currentStage: 'API Integration',
      stageNumber: 3,
      totalStages: 4,
      pendingReason: 'Pending API response from insurance company verification service',
      daysInCurrentStage: 6,
      assignedTo: 'IT Team - Mr. Suresh Kumar',
      priority: 'CRITICAL'
    },
    {
      id: '3',
      policyNumber: 'POL/FIR/2023/445',
      customerName: 'Global Enterprises Ltd',
      policyType: 'FIRE',
      premiumAmount: 285000,
      submittedDate: '2025-10-09',
      currentStage: 'Policy Details Verification',
      stageNumber: 1,
      totalStages: 4,
      pendingReason: 'Verifying policy details match with insurance company records',
      daysInCurrentStage: 2,
      assignedTo: 'Policy Admin - Mr. Raj Malhotra',
      priority: 'MEDIUM'
    },
    {
      id: '4',
      policyNumber: 'POL/LIF/2024/089',
      customerName: 'Neha Gupta',
      policyType: 'LIFE',
      premiumAmount: 52000,
      submittedDate: '2025-10-01',
      currentStage: 'Payment Reconciliation',
      stageNumber: 2,
      totalStages: 4,
      pendingReason: 'Bank statement verification pending - Multiple payment entries found',
      daysInCurrentStage: 10,
      assignedTo: 'Finance Officer - Ms. Meera Shah',
      priority: 'CRITICAL'
    }
  ])

  const handleBack = () => {
    router.push('/dashboard/postsale')
  }

  const verificationProcesses = [
    {
      id: '64vb-verification',
      title: '64VB Verification',
      description: 'Verify policy payment reconciliation and update policy status to 64VB verified',
      href: '/dashboard/64vb-verification',
      icon: ShieldCheckIcon,
      color: 'green'
    }
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      green: 'bg-green-50 border-green-200 text-green-600'
    }
    return colors[color as keyof typeof colors] || colors.green
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
    if (days >= 7) return 'text-red-600'
    if (days >= 4) return 'text-orange-600'
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
              href="/dashboard/64vb-verification"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              New 64VB Verification
            </Link>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">64VB Verification Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Verify policy payment reconciliation and track verification status at every stage
            </p>
          </div>
        </div>

        {/* 64VB Verification Info */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
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

        {/* Verification Process Overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">64VB Verification Process</h2>
          <p className="text-sm text-gray-600 mb-6">
            Complete workflow for payment reconciliation and 64VB verification
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
                <BanknotesIcon className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xs font-semibold text-gray-900">Step 2</h3>
              <p className="text-xs text-gray-600 mt-1">Payment Reconciliation</p>
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

        {/* Pending Verifications - Detailed Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Pending 64VB Verifications - Detailed Status</h2>
              <p className="text-sm text-gray-600 mt-1">
                Track verification progress with current stage, reason for pending, and assigned personnel
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <ClockIcon className="h-5 w-5" />
              <span className="font-semibold">{pendingVerifications.length} verifications in progress</span>
            </div>
          </div>

          <div className="space-y-4">
            {pendingVerifications.map((verification) => (
              <div key={verification.id} className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
                {/* Header Row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-base font-semibold text-gray-900">{verification.policyNumber}</h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(verification.priority)}`}>
                        {verification.priority}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Customer:</span>
                        <span className="ml-2 font-medium text-gray-900">{verification.customerName}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Policy Type:</span>
                        <span className="ml-2 font-medium text-gray-900">{verification.policyType}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Premium:</span>
                        <span className="ml-2 font-medium text-gray-900">{formatCurrency(verification.premiumAmount)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">Current Stage:</span>
                      <span className="text-sm font-semibold text-green-600">{verification.currentStage}</span>
                      <span className="text-xs text-gray-500">(Step {verification.stageNumber} of {verification.totalStages})</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{getStageProgress(verification.stageNumber, verification.totalStages)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getStageProgress(verification.stageNumber, verification.totalStages)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Pending Reason */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                  <div className="flex items-start space-x-2">
                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-yellow-900">Reason for Pending:</p>
                      <p className="text-sm text-yellow-800 mt-1">{verification.pendingReason}</p>
                    </div>
                  </div>
                </div>

                {/* Footer Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <UserIcon className="h-4 w-4" />
                      <span>{verification.assignedTo}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="h-4 w-4" />
                      <span>Submitted: {verification.submittedDate}</span>
                    </div>
                    <div className={`flex items-center space-x-1 font-medium ${getDaysColor(verification.daysInCurrentStage)}`}>
                      <span>{verification.daysInCurrentStage} days in current stage</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toast.success(`Viewing details for ${verification.policyNumber}`)}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                      <EyeIcon className="h-4 w-4 mr-1" />
                      View Details
                    </button>
                    <button
                      onClick={() => toast.success(`Processing verification for ${verification.policyNumber}`)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors"
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

        {/* Verification Processes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {verificationProcesses.map((process) => (
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
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                    {process.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {process.description}
                  </p>
                  <div className="mt-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
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
              <span>Direct submission to insurance company for 64VB verification</span>
            </div>
            <div className="flex items-start">
              <span className="mr-2">•</span>
              <span>Automatic payment reconciliation verification</span>
            </div>
            <div className="flex items-start">
              <span className="mr-2">•</span>
              <span>Policy status update to 64VB verified</span>
            </div>
            <div className="flex items-start">
              <span className="mr-2">•</span>
              <span>Automatic generation of verification certificate</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
