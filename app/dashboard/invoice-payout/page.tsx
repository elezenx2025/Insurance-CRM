'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeftIcon, 
  DocumentCheckIcon, 
  CloudArrowUpIcon, 
  CurrencyDollarIcon, 
  CreditCardIcon, 
  BuildingLibraryIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  PencilIcon,
  UserIcon,
  CalendarIcon,
  CheckCircleIcon,
  CurrencyRupeeIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface PendingInvoicePayoutItem {
  id: string
  itemNumber: string
  agentName: string
  insuranceCompany: string
  itemType: 'DATA_APPROVAL' | 'INVOICE_UPLOAD' | 'INVOICE_SETTLEMENT' | 'PAYMENT_APPROVAL' | 'BANK_INTEGRATION'
  amount: number
  submittedDate: string
  currentStage: string
  stageNumber: number
  totalStages: number
  pendingReason: string
  daysInCurrentStage: number
  assignedTo: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
}

export default function InvoicePayoutPage() {
  const router = useRouter()

  const [pendingItems] = useState<PendingInvoicePayoutItem[]>([
    {
      id: '1',
      itemNumber: 'DA/2025/10/001',
      agentName: 'Shree Insurance Brokers',
      insuranceCompany: 'ICICI Lombard',
      itemType: 'DATA_APPROVAL',
      amount: 2450000,
      submittedDate: '2025-10-01',
      currentStage: 'Checker Review',
      stageNumber: 2,
      totalStages: 3,
      pendingReason: 'Monthly business data submitted by maker - awaiting checker verification',
      daysInCurrentStage: 11,
      assignedTo: 'Checker - Mr. Ramesh Kulkarni',
      priority: 'CRITICAL'
    },
    {
      id: '2',
      itemNumber: 'INV/2025/456',
      agentName: 'Apex Insurance Services',
      insuranceCompany: 'HDFC ERGO',
      itemType: 'INVOICE_UPLOAD',
      amount: 875000,
      submittedDate: '2025-10-08',
      currentStage: 'Digital Signature Pending',
      stageNumber: 2,
      totalStages: 4,
      pendingReason: 'Invoice generated - waiting for authorized signatory digital signature',
      daysInCurrentStage: 4,
      assignedTo: 'Invoice Manager - Ms. Priya Nair',
      priority: 'HIGH'
    },
    {
      id: '3',
      itemNumber: 'SETT/2025/234',
      agentName: 'Prime Advisors Pvt Ltd',
      insuranceCompany: 'SBI General Insurance',
      itemType: 'INVOICE_SETTLEMENT',
      amount: 1250000,
      submittedDate: '2025-10-05',
      currentStage: 'Insurer Payment Processing',
      stageNumber: 3,
      totalStages: 4,
      pendingReason: 'Invoice submitted to insurance company - awaiting payment confirmation via API',
      daysInCurrentStage: 6,
      assignedTo: 'Settlement Officer - Mr. Anil Deshmukh',
      priority: 'HIGH'
    },
    {
      id: '4',
      itemNumber: 'PAY/2025/789',
      agentName: 'Global Insurance Network',
      insuranceCompany: 'Bajaj Allianz',
      itemType: 'PAYMENT_APPROVAL',
      amount: 3420000,
      submittedDate: '2025-10-09',
      currentStage: 'Level 2 Approval',
      stageNumber: 2,
      totalStages: 3,
      pendingReason: 'Level 1 approved - awaiting Level 2 authorization from senior finance manager',
      daysInCurrentStage: 3,
      assignedTo: 'Finance Manager - Ms. Sunita Reddy',
      priority: 'MEDIUM'
    },
    {
      id: '5',
      itemNumber: 'BANK/2025/112',
      agentName: 'United Brokers Association',
      insuranceCompany: 'Multiple',
      itemType: 'BANK_INTEGRATION',
      amount: 5680000,
      submittedDate: '2025-10-10',
      currentStage: 'Bank API Processing',
      stageNumber: 1,
      totalStages: 2,
      pendingReason: 'Payment batch created - connecting to bank API for fund distribution',
      daysInCurrentStage: 2,
      assignedTo: 'Payment Admin - Mr. Vijay Kumar',
      priority: 'HIGH'
    },
  ])

  const invoicePayoutModules = [
    {
      id: 'data-approval',
      title: 'Data Approval',
      description: 'Monthly business data approval with maker-checker concept',
      href: '/dashboard/invoice-payout/data-approval',
      icon: DocumentCheckIcon,
      color: 'blue'
    },
    {
      id: 'invoice-upload',
      title: 'Invoice Upload',
      description: 'Invoice management for agents and insurance intermediaries',
      href: '/dashboard/invoice-payout/invoice-upload',
      icon: CloudArrowUpIcon,
      color: 'green'
    },
    {
      id: 'invoice-settlement',
      title: 'Invoice Settlement',
      description: 'Invoice settlement with insurance companies',
      href: '/dashboard/invoice-payout/invoice-settlement',
      icon: CurrencyDollarIcon,
      color: 'purple'
    },
    {
      id: 'payment-approval',
      title: 'Payment Approval',
      description: 'Payment approval system with 2-level authorization',
      href: '/dashboard/invoice-payout/payment-approval',
      icon: CreditCardIcon,
      color: 'orange'
    },
    {
      id: 'bank-integration',
      title: 'Bank Integration',
      description: 'Automated bank payment distribution system',
      href: '/dashboard/invoice-payout/bank-integration',
      icon: BuildingLibraryIcon,
      color: 'red'
    }
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 text-blue-600',
      green: 'bg-green-50 border-green-200 text-green-600',
      purple: 'bg-purple-50 border-purple-200 text-purple-600',
      orange: 'bg-orange-50 border-orange-200 text-orange-600',
      red: 'bg-red-50 border-red-200 text-red-600'
    }
    return colors[color as keyof typeof colors] || colors.blue
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

  const getItemTypeColor = (type: string) => {
    switch (type) {
      case 'DATA_APPROVAL':
        return 'bg-blue-100 text-blue-800'
      case 'INVOICE_UPLOAD':
        return 'bg-green-100 text-green-800'
      case 'INVOICE_SETTLEMENT':
        return 'bg-purple-100 text-purple-800'
      case 'PAYMENT_APPROVAL':
        return 'bg-orange-100 text-orange-800'
      case 'BANK_INTEGRATION':
        return 'bg-red-100 text-red-800'
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
        <h1 className="text-3xl font-bold text-gray-900">Invoice & Payout Management Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Comprehensive invoice and payout management system with automated workflows
        </p>
      </div>

      {/* Business Summary Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Invoices</p>
              <p className="text-2xl font-bold text-gray-900">1,245</p>
              <div className="flex items-center mt-2">
                <CheckCircleIcon className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">89% processed</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DocumentCheckIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
              <p className="text-2xl font-bold text-gray-900">87</p>
              <div className="flex items-center mt-2">
                <ClockIcon className="w-4 h-4 text-orange-500 mr-1" />
                <span className="text-sm text-orange-600">Needs attention</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <ClockIcon className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month Payout</p>
              <p className="text-2xl font-bold text-gray-900">₹18.5Cr</p>
              <div className="flex items-center mt-2">
                <svg className="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-green-600">+12% vs last month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CurrencyRupeeIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Processing Time</p>
              <p className="text-2xl font-bold text-gray-900">4.2 days</p>
              <div className="flex items-center mt-2">
                <CheckCircleIcon className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">-0.8 days improved</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <CalendarIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* System Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">System Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { step: 1, title: 'Data Approval', description: 'Monthly data review' },
            { step: 2, title: 'Invoice Upload', description: 'Invoice creation' },
            { step: 3, title: 'Settlement', description: 'Invoice processing' },
            { step: 4, title: 'Payment Approval', description: 'Payment authorization' },
            { step: 5, title: 'Bank Integration', description: 'Fund distribution' }
          ].map(({ step, title, description }) => (
            <div key={step} className="text-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mx-auto mb-2">
                {step}
              </div>
              <h3 className="text-sm font-medium text-gray-900">{title}</h3>
              <p className="text-xs text-gray-500">{description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Invoice & Payout Items */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Pending Items - Detailed Status</h2>
            <p className="text-sm text-gray-600 mt-1">
              Track approvals, invoices, settlements, and payments with current progress
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
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getItemTypeColor(item.itemType)}`}>
                        {item.itemType.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Agent:</span>
                        <span className="ml-2 font-medium text-gray-900">{item.agentName}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Insurer:</span>
                        <span className="ml-2 font-medium text-gray-900">{item.insuranceCompany}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Amount:</span>
                        <span className="ml-2 font-medium text-gray-900">{formatCurrency(item.amount)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Submitted:</span>
                        <span className="ml-2 font-medium text-gray-900">{item.submittedDate}</span>
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
                    <div className={`flex items-center space-x-1 font-medium ${getDaysColor(item.daysInCurrentStage)}`}>
                      <ClockIcon className="h-4 w-4" />
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

        {/* Invoice & Payout Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {invoicePayoutModules.map((module) => (
            <Link
              key={module.id}
              href={module.href}
              className="group block p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:border-gray-200"
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${getColorClasses(module.color)}`}>
                  <module.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {module.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {module.description}
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

        {/* System Benefits */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">System Benefits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-start">
                <span className="mr-2">•</span>
                <span>Automated monthly business data processing and approval</span>
              </div>
              <div className="flex items-start">
                <span className="mr-2">•</span>
                <span>Digital signature support for invoice authentication</span>
              </div>
              <div className="flex items-start">
                <span className="mr-2">•</span>
                <span>Email and API integration for seamless communication</span>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-start">
                <span className="mr-2">•</span>
                <span>2-level approval process ensuring financial accuracy</span>
              </div>
              <div className="flex items-start">
                <span className="mr-2">•</span>
                <span>Bank API integration for automated payment distribution</span>
              </div>
              <div className="flex items-start">
                <span className="mr-2">•</span>
                <span>Comprehensive audit trails and compliance tracking</span>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}