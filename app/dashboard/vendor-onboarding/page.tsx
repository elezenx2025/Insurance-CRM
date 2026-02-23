'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  BuildingOfficeIcon,
  DocumentTextIcon,
  ListBulletIcon,
  PlusCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  PencilIcon,
  UserIcon,
  CalendarIcon,
  CheckCircleIcon,
  CurrencyRupeeIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface PendingVendorItem {
  id: string
  vendorNumber: string
  vendorName: string
  vendorType: 'SMS_SERVICE' | 'WHATSAPP_SERVICE' | 'TELEMATICS' | 'BANKING_API' | 'EMAIL_SERVICE' | 'NETWORKING' | 'CYBERSECURITY' | 'AUDIT_SERVICE'
  contractValue: number
  submittedDate: string
  contractExpiry?: string
  currentStage: string
  stageNumber: number
  totalStages: number
  pendingReason: string
  daysInCurrentStage: number
  assignedTo: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
}

export default function VendorOnboardingPage() {
  const router = useRouter()

  const [pendingVendors] = useState<PendingVendorItem[]>([
    {
      id: '1',
      vendorNumber: 'VEN/NEW/2025/034',
      vendorName: 'TechComm Solutions Pvt Ltd',
      vendorType: 'SMS_SERVICE',
      contractValue: 850000,
      submittedDate: '2025-10-08',
      currentStage: 'Contract Negotiation',
      stageNumber: 3,
      totalStages: 5,
      pendingReason: 'Negotiating SMS rates and API SLA terms - awaiting vendor revised quotation',
      daysInCurrentStage: 4,
      assignedTo: 'Procurement Manager - Mr. Suresh Patel',
      priority: 'HIGH'
    },
    {
      id: '2',
      vendorNumber: 'VEN/API/2025/012',
      vendorName: 'SecureBank API Gateway',
      vendorType: 'BANKING_API',
      contractValue: 2500000,
      submittedDate: '2025-10-05',
      currentStage: 'API Testing',
      stageNumber: 4,
      totalStages: 5,
      pendingReason: 'API integration testing in sandbox environment - verifying payment gateway functionality',
      daysInCurrentStage: 6,
      assignedTo: 'IT Manager - Ms. Meera Krishnan',
      priority: 'CRITICAL'
    },
    {
      id: '3',
      vendorNumber: 'VEN/RNW/2024/445',
      vendorName: 'CyberShield Security Services',
      vendorType: 'CYBERSECURITY',
      contractValue: 1200000,
      submittedDate: '2025-09-28',
      contractExpiry: '2025-11-15',
      currentStage: 'Contract Renewal Review',
      stageNumber: 2,
      totalStages: 4,
      pendingReason: 'Reviewing performance metrics and pricing for annual contract renewal',
      daysInCurrentStage: 14,
      assignedTo: 'IT Security Head - Mr. Rajesh Kumar',
      priority: 'CRITICAL'
    },
    {
      id: '4',
      vendorNumber: 'VEN/NEW/2025/035',
      vendorName: 'Fleet Track Telematics India',
      vendorType: 'TELEMATICS',
      contractValue: 650000,
      submittedDate: '2025-10-10',
      currentStage: 'Document Verification',
      stageNumber: 2,
      totalStages: 5,
      pendingReason: 'Verifying vendor GST registration, PAN card, and company incorporation documents',
      daysInCurrentStage: 2,
      assignedTo: 'Compliance Officer - Ms. Priya Sharma',
      priority: 'MEDIUM'
    },
    {
      id: '5',
      vendorNumber: 'VEN/NEW/2025/036',
      vendorName: 'Digital Mail Solutions',
      vendorType: 'EMAIL_SERVICE',
      contractValue: 450000,
      submittedDate: '2025-10-11',
      currentStage: 'Vendor Profile Creation',
      stageNumber: 1,
      totalStages: 5,
      pendingReason: 'Initial vendor registration - awaiting complete vendor profile and banking details',
      daysInCurrentStage: 1,
      assignedTo: 'Vendor Admin - Mr. Anil Desai',
      priority: 'LOW'
    },
  ])

  const modules = [
    {
      id: 1,
      name: 'Add New Vendor',
      description: 'Onboard new vendors with API kits and contracts',
      icon: PlusCircleIcon,
      color: 'bg-blue-500',
      href: '/dashboard/vendor-onboarding/add-vendor',
      stats: 'Quick Setup'
    },
    {
      id: 2,
      name: 'Vendor List',
      description: 'View and manage all registered vendors',
      icon: ListBulletIcon,
      color: 'bg-green-500',
      href: '/dashboard/vendor-onboarding/vendor-list',
      stats: '12 Active Vendors'
    },
    {
      id: 3,
      name: 'Contract Management',
      description: 'Manage vendor contracts and renewals',
      icon: DocumentTextIcon,
      color: 'bg-purple-500',
      href: '/dashboard/vendor-onboarding/contracts',
      stats: '3 Expiring Soon'
    },
    {
      id: 4,
      name: 'API Configuration',
      description: 'Configure and test vendor API integrations',
      icon: BuildingOfficeIcon,
      color: 'bg-orange-500',
      href: '/dashboard/vendor-onboarding/api-config',
      stats: '8 APIs Active'
    },
  ]

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

  const getVendorTypeColor = (type: string) => {
    switch (type) {
      case 'SMS_SERVICE':
        return 'bg-orange-100 text-orange-800'
      case 'WHATSAPP_SERVICE':
        return 'bg-teal-100 text-teal-800'
      case 'TELEMATICS':
        return 'bg-purple-100 text-purple-800'
      case 'BANKING_API':
        return 'bg-red-100 text-red-800'
      case 'EMAIL_SERVICE':
        return 'bg-indigo-100 text-indigo-800'
      case 'NETWORKING':
        return 'bg-blue-100 text-blue-800'
      case 'CYBERSECURITY':
        return 'bg-pink-100 text-pink-800'
      case 'AUDIT_SERVICE':
        return 'bg-gray-100 text-gray-800'
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
        <h1 className="text-3xl font-bold text-gray-900">Vendor Onboarding Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Manage vendor registrations, API integrations, and contract management
        </p>
      </div>

      {/* Business Summary Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Vendors</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <BuildingOfficeIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-green-600">↑ 2 new this month</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active APIs</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-green-600">All operational</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Contracts Expiring</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <ClockIcon className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-orange-600">Within 30 days</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Approvals</p>
              <p className="text-2xl font-bold text-gray-900">2</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <ClockIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-gray-500">Awaiting review</span>
          </div>
        </div>
      </div>

      {/* Pending Vendor Onboarding Items */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Pending Vendor Onboarding - Detailed Status</h2>
            <p className="text-sm text-gray-600 mt-1">
              Track new vendor registrations, API integrations, and contract renewals
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <ClockIcon className="h-5 w-5" />
            <span className="font-semibold">{pendingVendors.length} items pending</span>
          </div>
        </div>

        <div className="space-y-4">
          {pendingVendors.map((vendor) => (
            <div key={vendor.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
              {/* Header Row */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-base font-semibold text-gray-900">{vendor.vendorNumber}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(vendor.priority)}`}>
                      {vendor.priority}
                    </span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getVendorTypeColor(vendor.vendorType)}`}>
                      {vendor.vendorType.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Vendor Name:</span>
                      <span className="ml-2 font-medium text-gray-900">{vendor.vendorName}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Contract Value:</span>
                      <span className="ml-2 font-medium text-gray-900">{formatCurrency(vendor.contractValue)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Submitted:</span>
                      <span className="ml-2 font-medium text-gray-900">{vendor.submittedDate}</span>
                    </div>
                    {vendor.contractExpiry && (
                      <div>
                        <span className="text-gray-500">Expiry:</span>
                        <span className="ml-2 font-medium text-red-600">{vendor.contractExpiry}</span>
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
                    <span className="text-sm font-semibold text-blue-600">{vendor.currentStage}</span>
                    <span className="text-xs text-gray-500">(Step {vendor.stageNumber} of {vendor.totalStages})</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{getStageProgress(vendor.stageNumber, vendor.totalStages)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getStageProgress(vendor.stageNumber, vendor.totalStages)}%` }}
                  ></div>
                </div>
              </div>

              {/* Pending Reason */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                <div className="flex items-start space-x-2">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-yellow-900">Status:</p>
                    <p className="text-sm text-yellow-800 mt-1">{vendor.pendingReason}</p>
                  </div>
                </div>
              </div>

              {/* Footer Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <UserIcon className="h-4 w-4" />
                    <span>{vendor.assignedTo}</span>
                  </div>
                  <div className={`flex items-center space-x-1 font-medium ${getDaysColor(vendor.daysInCurrentStage)}`}>
                    <ClockIcon className="h-4 w-4" />
                    <span>{vendor.daysInCurrentStage} days in current stage</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toast.success(`Viewing details for ${vendor.vendorNumber}`)}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <EyeIcon className="h-4 w-4 mr-1" />
                    View Details
                  </button>
                  <button
                    onClick={() => toast.success(`Processing ${vendor.vendorNumber}`)}
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

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {modules.map((module) => {
          const IconComponent = module.icon
          return (
            <div
              key={module.id}
              onClick={() => router.push(module.href)}
              className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className={`${module.color} p-3 rounded-lg mr-4 group-hover:scale-110 transition-transform`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {module.name}
                    </h3>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {module.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{module.stats}</span>
                  <svg 
                    className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Info */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendor Integration Services</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <h4 className="font-medium text-gray-900 mb-2">Communication Services</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Telematic/Calling Solution</li>
              <li>• SMS Integration</li>
              <li>• WhatsApp Integration</li>
              <li>• Bulk Email Solution</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <h4 className="font-medium text-gray-900 mb-2">Technical Services</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Networking Solutions</li>
              <li>• Cyber Security</li>
              <li>• API Integration</li>
              <li>• Cloud Services</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <h4 className="font-medium text-gray-900 mb-2">Compliance Services</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Audit Services</li>
              <li>• Compliance Monitoring</li>
              <li>• Document Management</li>
              <li>• Contract Management</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
