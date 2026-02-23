'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  UserPlusIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ArrowLeftIcon,
  PlusIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  UserIcon,
  EyeIcon,
  PencilIcon,
  CurrencyRupeeIcon,
  PhoneIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface PendingItem {
  id: string
  itemNumber: string
  customerName: string
  contactInfo: string
  itemType: 'LEAD' | 'QUOTATION' | 'PROPOSAL'
  insuranceType: string
  estimatedPremium: number
  submittedDate: string
  currentStage: string
  stageNumber: number
  totalStages: number
  pendingReason: string
  daysInCurrentStage: number
  assignedTo: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
}

export default function PresalePage() {
  const router = useRouter()

  const [pendingItems] = useState<PendingItem[]>([
    {
      id: '1',
      itemNumber: 'LEAD/2025/045',
      customerName: 'Rohit Sharma',
      contactInfo: '+91 98765 43210',
      itemType: 'LEAD',
      insuranceType: 'MOTOR',
      estimatedPremium: 35000,
      submittedDate: '2025-10-08',
      currentStage: 'Lead Qualification',
      stageNumber: 1,
      totalStages: 4,
      pendingReason: 'Awaiting customer response for requirements gathering call',
      daysInCurrentStage: 3,
      assignedTo: 'Sales Agent - Mr. Anil Kumar',
      priority: 'HIGH'
    },
    {
      id: '2',
      itemNumber: 'QUOT/2025/089',
      customerName: 'Priyanka Reddy',
      contactInfo: 'priyanka.r@email.com',
      itemType: 'QUOTATION',
      insuranceType: 'HEALTH',
      estimatedPremium: 48000,
      submittedDate: '2025-10-05',
      currentStage: 'Quote Preparation',
      stageNumber: 2,
      totalStages: 4,
      pendingReason: 'Waiting for medical history details from customer',
      daysInCurrentStage: 6,
      assignedTo: 'Quote Specialist - Ms. Sunita Verma',
      priority: 'MEDIUM'
    },
    {
      id: '3',
      itemNumber: 'PROP/2025/034',
      customerName: 'Tech Innovations Pvt Ltd',
      contactInfo: 'cfo@techinnovations.com',
      itemType: 'PROPOSAL',
      insuranceType: 'FIRE',
      estimatedPremium: 425000,
      submittedDate: '2025-09-28',
      currentStage: 'Proposal Review',
      stageNumber: 3,
      totalStages: 4,
      pendingReason: 'Customer requested additional coverage options - preparing revised proposal',
      daysInCurrentStage: 13,
      assignedTo: 'Senior Consultant - Mr. Rajesh Patel',
      priority: 'CRITICAL'
    },
    {
      id: '4',
      itemNumber: 'LEAD/2025/046',
      customerName: 'Kavita Desai',
      contactInfo: '+91 99887 76655',
      itemType: 'LEAD',
      insuranceType: 'LIFE',
      estimatedPremium: 65000,
      submittedDate: '2025-10-10',
      currentStage: 'Lead Qualification',
      stageNumber: 1,
      totalStages: 4,
      pendingReason: 'Initial contact scheduled for tomorrow',
      daysInCurrentStage: 1,
      assignedTo: 'Sales Agent - Ms. Meera Shah',
      priority: 'LOW'
    },
    {
      id: '5',
      itemNumber: 'QUOT/2025/090',
      customerName: 'Global Enterprises',
      contactInfo: 'procurement@global.com',
      itemType: 'QUOTATION',
      insuranceType: 'MARINE',
      estimatedPremium: 850000,
      submittedDate: '2025-10-02',
      currentStage: 'Quote Preparation',
      stageNumber: 2,
      totalStages: 4,
      pendingReason: 'Awaiting cargo value documentation from customer',
      daysInCurrentStage: 9,
      assignedTo: 'Marine Specialist - Mr. Deepak Singh',
      priority: 'HIGH'
    },
  ])

  const presaleModules = [
    {
      id: 'lead-generation',
      title: 'Lead Generation',
      description: 'Manage and track sales leads from various sources',
      icon: UserPlusIcon,
      href: '/dashboard/presale/lead-generation',
      color: 'bg-blue-500',
    },
    {
      id: 'quotation',
      title: 'Quotation Management',
      description: 'Create and manage insurance quotations',
      icon: DocumentTextIcon,
      href: '/dashboard/presale/quotation',
      color: 'bg-green-500',
    },
    {
      id: 'proposal',
      title: 'Proposal Management',
      description: 'Generate and track insurance proposals',
      icon: ChartBarIcon,
      href: '/dashboard/presale/proposal',
      color: 'bg-purple-500',
    },
  ]

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

  const getStageProgress = (stageNumber: number, totalStages: number) => {
    return Math.round((stageNumber / totalStages) * 100)
  }

  const getDaysColor = (days: number) => {
    if (days >= 10) return 'text-red-600'
    if (days >= 5) return 'text-orange-600'
    return 'text-gray-600'
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'LEAD':
        return 'bg-blue-100 text-blue-800'
      case 'QUOTATION':
        return 'bg-green-100 text-green-800'
      case 'PROPOSAL':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
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

      {/* Page header with New Lead button */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pre-Sale Management Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage leads, quotations, and proposals before policy issuance
          </p>
        </div>
        <Link
          href="/dashboard/presale/lead-generation"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New Lead
        </Link>
      </div>

      {/* Business Summary Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Leads</p>
              <p className="text-2xl font-bold text-gray-900">145</p>
              <div className="flex items-center mt-2">
                <svg className="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-green-600">+18% vs last month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <UserPlusIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Quotations</p>
              <p className="text-2xl font-bold text-gray-900">89</p>
              <div className="flex items-center mt-2">
                <svg className="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-green-600">+12% vs last month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DocumentTextIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Proposals</p>
              <p className="text-2xl font-bold text-gray-900">34</p>
              <div className="flex items-center mt-2">
                <svg className="w-4 h-4 text-orange-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-orange-600">+8% vs last month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <ChartBarIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">68.5%</p>
              <div className="flex items-center mt-2">
                <svg className="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-green-600">+5.2% vs last month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <CurrencyRupeeIcon className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Pre-Sale Process Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Pre-Sale Process Overview</h2>
        <p className="text-sm text-gray-600 mb-6">
          Complete workflow from lead generation to policy issuance
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-2">
              <UserPlusIcon className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xs font-semibold text-gray-900">Step 1</h3>
            <p className="text-xs text-gray-600 mt-1">Lead Generation</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-2">
              <DocumentTextIcon className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xs font-semibold text-gray-900">Step 2</h3>
            <p className="text-xs text-gray-600 mt-1">Quotation Preparation</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-2">
              <ChartBarIcon className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xs font-semibold text-gray-900">Step 3</h3>
            <p className="text-xs text-gray-600 mt-1">Proposal Submission</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-2">
              <DocumentTextIcon className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-xs font-semibold text-gray-900">Step 4</h3>
            <p className="text-xs text-gray-600 mt-1">Customer Acknowledgement</p>
          </div>
        </div>
      </div>

      {/* Pending Pre-Sale Items */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Pending Pre-Sale Items - Detailed Status</h2>
            <p className="text-sm text-gray-600 mt-1">
              Track leads, quotes, and proposals with current stage and pending reasons
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <ClockIcon className="h-5 w-5" />
            <span className="font-semibold">{pendingItems.length} items pending</span>
          </div>
        </div>

        <div className="space-y-4">
          {pendingItems.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
              {/* Header Row */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-base font-semibold text-gray-900">{item.itemNumber}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(item.priority)}`}>
                      {item.priority}
                    </span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(item.itemType)}`}>
                      {item.itemType}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Customer:</span>
                      <span className="ml-2 font-medium text-gray-900">{item.customerName}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Contact:</span>
                      <span className="ml-2 font-medium text-gray-900">{item.contactInfo}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Insurance Type:</span>
                      <span className="ml-2 font-medium text-gray-900">{item.insuranceType}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Est. Premium:</span>
                      <span className="ml-2 font-medium text-gray-900">{formatCurrency(item.estimatedPremium)}</span>
                    </div>
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
                    onClick={() => toast.success(`Viewing details for ${item.itemNumber}`)}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <EyeIcon className="h-4 w-4 mr-1" />
                    View Details
                  </button>
                  <button
                    onClick={() => toast.success(`Processing ${item.itemNumber}`)}
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

      {/* Pre-Sale Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {presaleModules.map((module) => {
          const IconComponent = module.icon
          return (
            <div
              key={module.id}
              onClick={() => router.push(module.href)}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <div className="flex items-center mb-4">
                <div className={`${module.color} p-3 rounded-lg mr-4`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                    {module.title}
                  </h3>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                {module.description}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
