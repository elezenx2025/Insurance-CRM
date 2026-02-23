'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon, DocumentIcon, UserIcon, BuildingOfficeIcon, CheckCircleIcon, ExclamationTriangleIcon, ClipboardDocumentListIcon, ShieldCheckIcon, PlusIcon, XMarkIcon, ClockIcon, EyeIcon, PencilIcon, DocumentTextIcon, CurrencyRupeeIcon, DocumentArrowUpIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface PendingClaim {
  id: string
  claimNumber: string
  customerName: string
  policyNumber: string
  claimType: string
  claimAmount: number
  submittedDate: string
  currentStage: string
  stageNumber: number
  totalStages: number
  pendingReason: string
  daysInCurrentStage: number
  assignedTo: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
}

export default function ClaimsPage() {
  const router = useRouter()
  
  const [pendingClaims] = useState<PendingClaim[]>([
    {
      id: '1',
      claimNumber: 'CLM/2025/001',
      customerName: 'Rajesh Kumar',
      policyNumber: 'POL/MTR/2024/145',
      claimType: 'MOTOR - Accident',
      claimAmount: 85000,
      submittedDate: '2025-10-05',
      currentStage: 'Surveyor Assessment',
      stageNumber: 3,
      totalStages: 6,
      pendingReason: 'Waiting for surveyor report - Site visit scheduled for tomorrow',
      daysInCurrentStage: 5,
      assignedTo: 'Surveyor - Mr. Amit Verma',
      priority: 'HIGH'
    },
    {
      id: '2',
      claimNumber: 'CLM/2025/002',
      customerName: 'Priya Sharma',
      policyNumber: 'POL/HLT/2024/089',
      claimType: 'HEALTH - Hospitalization',
      claimAmount: 125000,
      submittedDate: '2025-10-01',
      currentStage: 'Document Verification',
      stageNumber: 2,
      totalStages: 6,
      pendingReason: 'Missing medical bills and discharge summary documents',
      daysInCurrentStage: 9,
      assignedTo: 'Claims Officer - Ms. Sunita Reddy',
      priority: 'CRITICAL'
    },
    {
      id: '3',
      claimNumber: 'CLM/2025/003',
      customerName: 'Tech Solutions Pvt Ltd',
      policyNumber: 'POL/FIR/2023/234',
      claimType: 'FIRE - Property Damage',
      claimAmount: 2500000,
      submittedDate: '2025-09-28',
      currentStage: 'Insurance Company Approval',
      stageNumber: 5,
      totalStages: 6,
      pendingReason: 'Under review by underwriting team - High value claim requires senior approval',
      daysInCurrentStage: 12,
      assignedTo: 'Senior Underwriter - Mr. Deepak Singh',
      priority: 'CRITICAL'
    },
    {
      id: '4',
      claimNumber: 'CLM/2025/004',
      customerName: 'Amit Patel',
      policyNumber: 'POL/LIF/2022/456',
      claimType: 'LIFE - Critical Illness',
      claimAmount: 500000,
      submittedDate: '2025-10-08',
      currentStage: 'Medical Assessment',
      stageNumber: 4,
      totalStages: 6,
      pendingReason: 'Awaiting medical reports from specialist doctor',
      daysInCurrentStage: 2,
      assignedTo: 'Medical Examiner - Dr. Kavita Mehta',
      priority: 'MEDIUM'
    },
    {
      id: '5',
      claimNumber: 'CLM/2025/005',
      customerName: 'Sunita Verma',
      policyNumber: 'POL/MAR/2024/178',
      claimType: 'MARINE - Cargo Loss',
      claimAmount: 750000,
      submittedDate: '2025-10-10',
      currentStage: 'Claim Registration',
      stageNumber: 1,
      totalStages: 6,
      pendingReason: 'Completing initial documentation and claim number assignment',
      daysInCurrentStage: 1,
      assignedTo: 'Claims Coordinator - Mr. Rahul Joshi',
      priority: 'LOW'
    },
    {
      id: '6',
      claimNumber: 'CLM/2025/006',
      customerName: 'Kavita Desai',
      policyNumber: 'POL/HLT/2023/567',
      claimType: 'HEALTH - Surgery',
      claimAmount: 340000,
      submittedDate: '2025-09-25',
      currentStage: 'Document Verification',
      stageNumber: 2,
      totalStages: 6,
      pendingReason: 'Hospital final bill not yet submitted by customer',
      daysInCurrentStage: 15,
      assignedTo: 'Claims Officer - Mr. Anil Kumar',
      priority: 'HIGH'
    }
  ])

  const handleBack = () => {
    router.push('/dashboard/postsale')
  }

  const claimsProcesses = [
    {
      id: 'intimation',
      title: 'Claim Intimation',
      description: 'Submit claim intimation request to insurance company',
      href: '/dashboard/claims/intimation',
      icon: ClipboardDocumentListIcon,
      color: 'blue'
    },
    {
      id: 'surveyor-assessment',
      title: 'Surveyor Assessment',
      description: 'Submit surveyor assessment back flow from insurance company',
      href: '/dashboard/claims/surveyor-assessment',
      icon: DocumentIcon,
      color: 'green'
    },
    {
      id: 'insurance-approval',
      title: 'Insurance Company Approval',
      description: 'Submit insurance company approval back flow',
      href: '/dashboard/claims/insurance-approval',
      icon: ShieldCheckIcon,
      color: 'purple'
    },
    {
      id: 'supplementary-claim',
      title: 'Supplementary Claim',
      description: 'Submit supplementary claim request to insurance company',
      href: '/dashboard/claims/supplementary-claim',
      icon: PlusIcon,
      color: 'orange'
    },
    {
      id: 'settlement',
      title: 'Claim Settlement',
      description: 'Process claim settlement with insurance company',
      href: '/dashboard/claims/settlement',
      icon: CheckCircleIcon,
      color: 'emerald'
    }
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 text-blue-600',
      green: 'bg-green-50 border-green-200 text-green-600',
      purple: 'bg-purple-50 border-purple-200 text-purple-600',
      orange: 'bg-orange-50 border-orange-200 text-orange-600',
      emerald: 'bg-emerald-50 border-emerald-200 text-emerald-600'
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
              href="/dashboard/claims/intimation"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              New Claim Intimation
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Claims Management Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Manage insurance claims and track processing status at every stage
              </p>
            </div>
          </div>
        </div>

        {/* Claims Process Overview - 6 Steps */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Claims Process Overview</h2>
          <p className="text-sm text-gray-600 mb-6">
            Complete workflow from claim initiation to settlement
          </p>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <DocumentTextIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xs font-semibold text-gray-900">Step 1</h3>
              <p className="text-xs text-gray-600 mt-1">Claim Registration</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-2">
                <DocumentArrowUpIcon className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xs font-semibold text-gray-900">Step 2</h3>
              <p className="text-xs text-gray-600 mt-1">Document Verification</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-2">
                <UserIcon className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xs font-semibold text-gray-900">Step 3</h3>
              <p className="text-xs text-gray-600 mt-1">Surveyor Assessment</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-teal-100 rounded-full flex items-center justify-center mb-2">
                <ExclamationTriangleIcon className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-xs font-semibold text-gray-900">Step 4</h3>
              <p className="text-xs text-gray-600 mt-1">Medical Assessment</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-indigo-100 rounded-full flex items-center justify-center mb-2">
                <CheckCircleIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xs font-semibold text-gray-900">Step 5</h3>
              <p className="text-xs text-gray-600 mt-1">Insurance Approval</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-2">
                <CurrencyRupeeIcon className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xs font-semibold text-gray-900">Step 6</h3>
              <p className="text-xs text-gray-600 mt-1">Claim Settlement</p>
            </div>
          </div>
        </div>

        {/* Pending Claims with Detailed Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Pending Claims - Detailed Status</h2>
              <p className="text-sm text-gray-600 mt-1">
                Track claim progress with current stage, reason for pending, and assigned personnel
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <ClockIcon className="h-5 w-5" />
              <span className="font-semibold">{pendingClaims.length} claims in progress</span>
            </div>
          </div>

          <div className="space-y-4">
            {pendingClaims.map((claim) => (
              <div key={claim.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                {/* Header Row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-base font-semibold text-gray-900">{claim.claimNumber}</h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(claim.priority)}`}>
                        {claim.priority}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Customer:</span>
                        <span className="ml-2 font-medium text-gray-900">{claim.customerName}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Policy:</span>
                        <span className="ml-2 font-medium text-gray-900">{claim.policyNumber}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Type:</span>
                        <span className="ml-2 font-medium text-gray-900">{claim.claimType}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Amount:</span>
                        <span className="ml-2 font-medium text-gray-900">{formatCurrency(claim.claimAmount)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">Current Stage:</span>
                      <span className="text-sm font-semibold text-blue-600">{claim.currentStage}</span>
                      <span className="text-xs text-gray-500">(Step {claim.stageNumber} of {claim.totalStages})</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{getStageProgress(claim.stageNumber, claim.totalStages)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getStageProgress(claim.stageNumber, claim.totalStages)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Pending Reason and Details */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                  <div className="flex items-start space-x-2">
                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-yellow-900">Reason for Pending:</p>
                      <p className="text-sm text-yellow-800 mt-1">{claim.pendingReason}</p>
                    </div>
                  </div>
                </div>

                {/* Footer Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <UserIcon className="h-4 w-4" />
                      <span>{claim.assignedTo}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="h-4 w-4" />
                      <span>Submitted: {claim.submittedDate}</span>
                    </div>
                    <div className={`flex items-center space-x-1 font-medium ${getDaysColor(claim.daysInCurrentStage)}`}>
                      <span>{claim.daysInCurrentStage} days in current stage</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toast.success(`Viewing details for ${claim.claimNumber}`)}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                      <EyeIcon className="h-4 w-4 mr-1" />
                      View Details
                    </button>
                    <button
                      onClick={() => toast.success(`Updating claim ${claim.claimNumber}`)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                      <PencilIcon className="h-4 w-4 mr-1" />
                      Update
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Claims Processes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {claimsProcesses.map((process) => (
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
              <span>All claims processes support both API integration and manual processing</span>
            </div>
            <div className="flex items-start">
              <span className="mr-2">•</span>
              <span>Real-time communication with insurance companies</span>
            </div>
            <div className="flex items-start">
              <span className="mr-2">•</span>
              <span>Automatic status updates and notifications</span>
            </div>
            <div className="flex items-start">
              <span className="mr-2">•</span>
              <span>Document management and verification</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
