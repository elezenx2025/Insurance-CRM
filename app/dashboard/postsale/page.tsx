'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  DocumentTextIcon,
  CogIcon,
  XMarkIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  ChartBarIcon,
  DocumentIcon,
  EyeIcon,
  PencilIcon,
  UserIcon,
  CurrencyRupeeIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface PostSaleModule {
  id: string
  title: string
  description: string
  icon: React.ComponentType<any>
  path: string
  status: 'active' | 'inactive' | 'maintenance'
  lastUpdated: string
  usage: number
}

interface PendingPostSaleItem {
  id: string
  requestNumber: string
  customerName: string
  policyNumber: string
  serviceType: 'CLAIM' | 'ENDORSEMENT' | 'CANCELLATION' | '64VB_VERIFICATION'
  insuranceType: string
  requestAmount?: number
  submittedDate: string
  currentStage: string
  stageNumber: number
  totalStages: number
  pendingReason: string
  daysInCurrentStage: number
  assignedTo: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
}

export default function PostSalePage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const [pendingItems] = useState<PendingPostSaleItem[]>([
    {
      id: '1',
      requestNumber: 'CLM/2025/1234',
      customerName: 'Suresh Patil',
      policyNumber: 'POL/MOTOR/2024/7856',
      serviceType: 'CLAIM',
      insuranceType: 'MOTOR',
      requestAmount: 145000,
      submittedDate: '2025-10-08',
      currentStage: 'Surveyor Assessment',
      stageNumber: 3,
      totalStages: 6,
      pendingReason: 'Surveyor inspection scheduled for Oct 14 - awaiting damage assessment report',
      daysInCurrentStage: 4,
      assignedTo: 'Claims Officer - Mr. Karthik Nair',
      priority: 'HIGH'
    },
    {
      id: '2',
      requestNumber: 'END/2025/456',
      customerName: 'Lakshmi Reddy',
      policyNumber: 'POL/HEALTH/2024/3421',
      serviceType: 'ENDORSEMENT',
      insuranceType: 'HEALTH',
      submittedDate: '2025-10-10',
      currentStage: 'Document Verification',
      stageNumber: 2,
      totalStages: 4,
      pendingReason: 'Adding spouse to policy - awaiting spouse medical reports and Aadhar copy',
      daysInCurrentStage: 2,
      assignedTo: 'Policy Servicing - Ms. Anita Joshi',
      priority: 'MEDIUM'
    },
    {
      id: '3',
      requestNumber: 'CAN/2025/789',
      customerName: 'Rajiv Kumar',
      policyNumber: 'POL/LIFE/2023/9012',
      serviceType: 'CANCELLATION',
      insuranceType: 'LIFE',
      requestAmount: 285000,
      submittedDate: '2025-09-30',
      currentStage: 'Refund Calculation',
      stageNumber: 3,
      totalStages: 5,
      pendingReason: 'Calculating surrender value - awaiting approval from senior underwriter',
      daysInCurrentStage: 11,
      assignedTo: 'Policy Manager - Mr. Vinay Sharma',
      priority: 'CRITICAL'
    },
    {
      id: '4',
      requestNumber: '64VB/2025/234',
      customerName: 'Global Manufacturing Ltd',
      policyNumber: 'POL/FIRE/2024/5543',
      serviceType: '64VB_VERIFICATION',
      insuranceType: 'FIRE',
      submittedDate: '2025-10-11',
      currentStage: 'Compliance Review',
      stageNumber: 1,
      totalStages: 3,
      pendingReason: 'Verifying 64VB compliance documents and fire safety certificates',
      daysInCurrentStage: 1,
      assignedTo: 'Compliance Officer - Ms. Divya Menon',
      priority: 'HIGH'
    },
    {
      id: '5',
      requestNumber: 'CLM/2025/1235',
      customerName: 'Pooja Gupta',
      policyNumber: 'POL/HEALTH/2024/6677',
      serviceType: 'CLAIM',
      insuranceType: 'HEALTH',
      requestAmount: 87000,
      submittedDate: '2025-10-06',
      currentStage: 'Hospital Bill Verification',
      stageNumber: 2,
      totalStages: 6,
      pendingReason: 'Validating hospital bills and treatment records - contacted hospital for clarification',
      daysInCurrentStage: 5,
      assignedTo: 'Claims Analyst - Mr. Rohit Desai',
      priority: 'MEDIUM'
    },
  ])

  const modules: PostSaleModule[] = [
    {
      id: 'claims',
      title: 'Claims Management',
      description: 'Process and manage insurance claims with comprehensive tracking and API integration',
      icon: DocumentTextIcon,
      path: '/dashboard/postsale/claims',
      status: 'active',
      lastUpdated: '2024-01-15',
      usage: 85
    },
    {
      id: 'endorsement',
      title: 'Policy Endorsement',
      description: 'Handle policy modifications, amendments, and endorsement processing',
      icon: CogIcon,
      path: '/dashboard/postsale/endorsement',
      status: 'active',
      lastUpdated: '2024-01-12',
      usage: 72
    },
    {
      id: 'cancellation',
      title: 'Policy Cancellation',
      description: 'Process policy cancellations and refund calculations',
      icon: XMarkIcon,
      path: '/dashboard/postsale/cancellation',
      status: 'active',
      lastUpdated: '2024-01-10',
      usage: 45
    },
    {
      id: '64vb-verify',
      title: '64VB Verification',
      description: 'Verify and process 64VB compliance and documentation',
      icon: CheckCircleIcon,
      path: '/dashboard/postsale/64vb-verify',
      status: 'active',
      lastUpdated: '2024-01-08',
      usage: 63
    }
  ]

  const filteredModules = modules.filter(module => {
    const matchesSearch = module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         module.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || module.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon className="h-4 w-4" />
      case 'inactive':
        return <ClockIcon className="h-4 w-4" />
      case 'maintenance':
        return <ExclamationTriangleIcon className="h-4 w-4" />
      default:
        return <ClockIcon className="h-4 w-4" />
    }
  }

  const getUsageColor = (usage: number) => {
    if (usage >= 80) return 'bg-green-500'
    if (usage >= 60) return 'bg-yellow-500'
    if (usage >= 40) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) { // 1 crore or more
      const crores = amount / 10000000
      return `₹${crores.toFixed(1)}Cr`
    } else if (amount >= 1000000) { // 10 lakh or more
      const millions = amount / 1000000
      return `₹${millions.toFixed(1)}M`
    } else if (amount >= 100000) { // 1 lakh or more
      const lakhs = amount / 100000
      return `₹${lakhs.toFixed(1)}L`
    } else if (amount >= 1000) { // 1 thousand or more
      const thousands = amount / 1000
      return `₹${thousands.toFixed(1)}K`
    } else {
      return `₹${amount.toLocaleString('en-IN')}`
    }
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

  const getServiceTypeColor = (type: string) => {
    switch (type) {
      case 'CLAIM':
        return 'bg-red-100 text-red-800'
      case 'ENDORSEMENT':
        return 'bg-blue-100 text-blue-800'
      case 'CANCELLATION':
        return 'bg-orange-100 text-orange-800'
      case '64VB_VERIFICATION':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
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
    <div className="space-y-6">
      {/* Back to Dashboard Button */}
      <div>
        <button
          onClick={() => router.push('/dashboard')}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>
      </div>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Post-Sale Services Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Comprehensive post-sale insurance services and policy management tools
        </p>
      </div>

      {/* Business Summary Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Claims</p>
                <p className="text-2xl font-bold text-gray-900">324</p>
                <div className="flex items-center mt-2">
                  <ClockIcon className="w-4 h-4 text-orange-500 mr-1" />
                  <span className="text-sm text-orange-600">89 pending</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <DocumentTextIcon className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Endorsements</p>
                <p className="text-2xl font-bold text-gray-900">156</p>
                <div className="flex items-center mt-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">45 completed</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <CogIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cancellations</p>
                <p className="text-2xl font-bold text-gray-900">78</p>
                <div className="flex items-center mt-2">
                  <ClockIcon className="w-4 h-4 text-orange-500 mr-1" />
                  <span className="text-sm text-orange-600">23 pending</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <XMarkIcon className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">64VB Verifications</p>
                <p className="text-2xl font-bold text-gray-900">42</p>
                <div className="flex items-center mt-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">38 verified</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Pending Post-Sale Service Requests */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Pending Service Requests - Detailed Status</h2>
              <p className="text-sm text-gray-600 mt-1">
                Track claims, endorsements, cancellations, and verifications with current progress
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <ClockIcon className="h-5 w-5" />
              <span className="font-semibold">{pendingItems.length} requests pending</span>
            </div>
          </div>

          <div className="space-y-4">
            {pendingItems.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                {/* Header Row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-base font-semibold text-gray-900">{item.requestNumber}</h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getServiceTypeColor(item.serviceType)}`}>
                        {item.serviceType.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Customer:</span>
                        <span className="ml-2 font-medium text-gray-900">{item.customerName}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Policy:</span>
                        <span className="ml-2 font-medium text-gray-900">{item.policyNumber}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Type:</span>
                        <span className="ml-2 font-medium text-gray-900">{item.insuranceType}</span>
                      </div>
                      {item.requestAmount && (
                        <div>
                          <span className="text-gray-500">Amount:</span>
                          <span className="ml-2 font-medium text-gray-900">{formatCurrency(item.requestAmount)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">Current Stage:</span>
                      <span className="text-sm font-semibold text-blue-600">{item.currentStage}</span>
                      <span className="text-xs text-gray-500">(Step {item.stageNumber} of {item.totalStages})</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{getStageProgress(item.stageNumber, item.totalStages)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getStageProgress(item.stageNumber, item.totalStages)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Pending Reason */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                  <div className="flex items-start space-x-2">
                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-yellow-900">Reason for Pending:</p>
                      <p className="text-sm text-yellow-800 mt-1">{item.pendingReason}</p>
                    </div>
                  </div>
                </div>

                {/* Footer Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <UserIcon className="h-4 w-4" />
                      <span>{item.assignedTo}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="h-4 w-4" />
                      <span>Submitted: {item.submittedDate}</span>
                    </div>
                    <div className={`flex items-center space-x-1 font-medium ${getDaysColor(item.daysInCurrentStage)}`}>
                      <span>{item.daysInCurrentStage} days in current stage</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toast.success(`Viewing details for ${item.requestNumber}`)}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                      <EyeIcon className="h-4 w-4 mr-1" />
                      View Details
                    </button>
                    <button
                      onClick={() => toast.success(`Processing ${item.requestNumber}`)}
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

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Service Modules</h2>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <DocumentIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search modules..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          {/* Modules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredModules.map((module) => {
              const IconComponent = module.icon
              return (
                <div
                  key={module.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => router.push(module.path)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-3 rounded-lg mr-4">
                          <IconComponent className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                          <div className="flex items-center mt-1">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(module.status)}`}>
                              {getStatusIcon(module.status)}
                              <span className="ml-1 capitalize">{module.status}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <ArrowRightIcon className="h-5 w-5 text-gray-400" />
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {module.description}
                    </p>

                    <div className="space-y-3">
                      {/* Usage Bar */}
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-medium text-gray-500">Usage</span>
                          <span className="text-xs font-medium text-gray-900">{module.usage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getUsageColor(module.usage)}`}
                            style={{ width: `${module.usage}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Last Updated */}
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>Last Updated</span>
                        <span>{new Date(module.lastUpdated).toLocaleDateString('en-IN')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 rounded-b-lg">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(module.path)
                      }}
                      className="w-full text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors flex items-center justify-center"
                    >
                      Access Module
                      <ArrowRightIcon className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* No Results */}
          {filteredModules.length === 0 && (
            <div className="text-center py-12">
              <DocumentIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No modules found</h3>
              <p className="text-gray-600">
                Try adjusting your search criteria or filter settings.
              </p>
            </div>
          )}
        </div>
    </div>
  )
}
