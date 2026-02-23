'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  CalendarIcon,
  ChartBarIcon,
  MapIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  GiftIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  PencilIcon,
  UserIcon,
  PhoneIcon,
  CurrencyRupeeIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface PendingRetentionActivity {
  id: string
  activityNumber: string
  customerName: string
  policyNumber: string
  activityType: 'RENEWAL' | 'SMS_CAMPAIGN' | 'WHATSAPP_CAMPAIGN' | 'EMAIL_CAMPAIGN' | 'TELEMATICS' | 'FESTIVAL_OFFER'
  insuranceType: string
  policyValue: number
  dueDate: string
  currentStage: string
  stageNumber: number
  totalStages: number
  pendingReason: string
  daysUntilDue: number
  assignedTo: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
}

export default function CustomerRetentionPage() {
  const router = useRouter()

  const [pendingActivities] = useState<PendingRetentionActivity[]>([
    {
      id: '1',
      activityNumber: 'RNW/2025/678',
      customerName: 'Mukesh Ambani Enterprises',
      policyNumber: 'POL/FIRE/2024/9876',
      activityType: 'RENEWAL',
      insuranceType: 'FIRE',
      policyValue: 8500000,
      dueDate: '2025-10-20',
      currentStage: 'Renewal Reminder Sent',
      stageNumber: 2,
      totalStages: 4,
      pendingReason: 'Customer contacted via email & SMS - awaiting confirmation for renewal meeting',
      daysUntilDue: 7,
      assignedTo: 'Retention Manager - Mr. Prakash Joshi',
      priority: 'CRITICAL'
    },
    {
      id: '2',
      activityNumber: 'SMS/2025/345',
      customerName: 'Health Policy Segment - 150 customers',
      policyNumber: 'CAMPAIGN/BULK/001',
      activityType: 'SMS_CAMPAIGN',
      insuranceType: 'HEALTH',
      policyValue: 4500000,
      dueDate: '2025-10-15',
      currentStage: 'Campaign Approval',
      stageNumber: 1,
      totalStages: 3,
      pendingReason: 'Campaign content approved - awaiting manager authorization to send bulk SMS',
      daysUntilDue: 2,
      assignedTo: 'Campaign Manager - Ms. Neha Kapoor',
      priority: 'HIGH'
    },
    {
      id: '3',
      activityNumber: 'WA/2025/234',
      customerName: 'Motor Insurance - Premium Customers',
      policyNumber: 'CAMPAIGN/WA/012',
      activityType: 'WHATSAPP_CAMPAIGN',
      insuranceType: 'MOTOR',
      policyValue: 3200000,
      dueDate: '2025-10-18',
      currentStage: 'Message Scheduling',
      stageNumber: 2,
      totalStages: 3,
      pendingReason: 'WhatsApp template approved by Meta - scheduling bulk messages for 80 customers',
      daysUntilDue: 5,
      assignedTo: 'Digital Marketing - Mr. Rohit Sharma',
      priority: 'MEDIUM'
    },
    {
      id: '4',
      activityNumber: 'TEL/2025/156',
      customerName: 'Fleet Management Solutions Ltd',
      policyNumber: 'POL/MOTOR/2024/4532',
      activityType: 'TELEMATICS',
      insuranceType: 'MOTOR',
      policyValue: 1250000,
      dueDate: '2025-10-16',
      currentStage: 'Data Analysis',
      stageNumber: 2,
      totalStages: 3,
      pendingReason: 'Analyzing vehicle telematics data for safe driving discount eligibility',
      daysUntilDue: 3,
      assignedTo: 'Telematics Analyst - Ms. Anjali Verma',
      priority: 'MEDIUM'
    },
    {
      id: '5',
      activityNumber: 'FEST/2025/089',
      customerName: 'Diwali Special - All Active Customers',
      policyNumber: 'CAMPAIGN/FESTIVAL/DIW25',
      activityType: 'FESTIVAL_OFFER',
      insuranceType: 'MULTIPLE',
      policyValue: 15000000,
      dueDate: '2025-10-22',
      currentStage: 'Offer Design',
      stageNumber: 1,
      totalStages: 4,
      pendingReason: 'Designing Diwali festival offers - awaiting approval from senior management',
      daysUntilDue: 9,
      assignedTo: 'Marketing Head - Mr. Vikram Malhotra',
      priority: 'HIGH'
    },
  ])

  const modules = [
    {
      id: 1,
      name: 'Renewal Tracking',
      description: 'Track and manage policy renewals',
      icon: CalendarIcon,
      color: 'bg-blue-500',
      href: '/dashboard/customer-retention/renewal-tracking',
      stats: '12 due this month'
    },
    {
      id: 2,
      name: 'Conversion Reports',
      description: 'View lead conversion analytics',
      icon: ChartBarIcon,
      color: 'bg-green-500',
      href: '/dashboard/customer-retention/conversion-reports',
      stats: '68% conversion rate'
    },
    {
      id: 3,
      name: 'Telematic Solution',
      description: 'Monitor vehicle telematics data',
      icon: MapIcon,
      color: 'bg-purple-500',
      href: '/dashboard/customer-retention/telematic',
      stats: '45 vehicles tracked'
    },
    {
      id: 4,
      name: 'SMS Integration',
      description: 'Send SMS notifications to customers',
      icon: DevicePhoneMobileIcon,
      color: 'bg-orange-500',
      href: '/dashboard/customer-retention/sms',
      stats: '234 sent today'
    },
    {
      id: 5,
      name: 'WhatsApp Integration',
      description: 'Connect with customers via WhatsApp',
      icon: ChatBubbleLeftRightIcon,
      color: 'bg-teal-500',
      href: '/dashboard/customer-retention/whatsapp',
      stats: '89% read rate'
    },
    {
      id: 6,
      name: 'Bulk Email',
      description: 'Send bulk emails to customer segments',
      icon: EnvelopeIcon,
      color: 'bg-indigo-500',
      href: '/dashboard/customer-retention/bulk-email',
      stats: '1.2K subscribers'
    },
    {
      id: 7,
      name: 'Festival Lists',
      description: 'Manage festival campaigns and offers',
      icon: GiftIcon,
      color: 'bg-pink-500',
      href: '/dashboard/customer-retention/festival-lists',
      stats: '5 upcoming festivals'
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

  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case 'RENEWAL':
        return 'bg-blue-100 text-blue-800'
      case 'SMS_CAMPAIGN':
        return 'bg-orange-100 text-orange-800'
      case 'WHATSAPP_CAMPAIGN':
        return 'bg-teal-100 text-teal-800'
      case 'EMAIL_CAMPAIGN':
        return 'bg-indigo-100 text-indigo-800'
      case 'TELEMATICS':
        return 'bg-purple-100 text-purple-800'
      case 'FESTIVAL_OFFER':
        return 'bg-pink-100 text-pink-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStageProgress = (stageNumber: number, totalStages: number) => {
    return Math.round((stageNumber / totalStages) * 100)
  }

  const getDaysColor = (days: number) => {
    if (days <= 3) return 'text-red-600'
    if (days <= 7) return 'text-orange-600'
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
        <h1 className="text-3xl font-bold text-gray-900">Customer Retention Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Comprehensive tools and features to retain and engage your customers
        </p>
      </div>

      {/* Business Summary Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Customers</p>
              <p className="text-2xl font-bold text-gray-900">1,234</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-green-600">↑ 12.5%</span>
            <span className="text-sm text-gray-500 ml-2">vs last month</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Renewal Rate</p>
              <p className="text-2xl font-bold text-gray-900">87.5%</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-green-600">↑ 5.2%</span>
            <span className="text-sm text-gray-500 ml-2">vs last month</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Engagement Rate</p>
              <p className="text-2xl font-bold text-gray-900">73.2%</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-green-600">↑ 8.1%</span>
            <span className="text-sm text-gray-500 ml-2">vs last month</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Retention</p>
              <p className="text-2xl font-bold text-gray-900">24 months</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-green-600">↑ 3 months</span>
            <span className="text-sm text-gray-500 ml-2">vs last year</span>
          </div>
        </div>
      </div>

      {/* Pending Retention Activities */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Pending Retention Activities - Detailed Status</h2>
            <p className="text-sm text-gray-600 mt-1">
              Track renewals, campaigns, and engagement activities with current progress and deadlines
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <ClockIcon className="h-5 w-5" />
            <span className="font-semibold">{pendingActivities.length} activities pending</span>
          </div>
        </div>

        <div className="space-y-4">
          {pendingActivities.map((activity) => (
            <div key={activity.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
              {/* Header Row */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-base font-semibold text-gray-900">{activity.activityNumber}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(activity.priority)}`}>
                      {activity.priority}
                    </span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getActivityTypeColor(activity.activityType)}`}>
                      {activity.activityType.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Customer:</span>
                      <span className="ml-2 font-medium text-gray-900">{activity.customerName}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Policy/Campaign:</span>
                      <span className="ml-2 font-medium text-gray-900">{activity.policyNumber}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Value:</span>
                      <span className="ml-2 font-medium text-gray-900">{formatCurrency(activity.policyValue)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Due Date:</span>
                      <span className={`ml-2 font-medium ${activity.daysUntilDue <= 3 ? 'text-red-600' : 'text-gray-900'}`}>
                        {activity.dueDate}
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
                    <span className="text-sm font-semibold text-blue-600">{activity.currentStage}</span>
                    <span className="text-xs text-gray-500">(Step {activity.stageNumber} of {activity.totalStages})</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{getStageProgress(activity.stageNumber, activity.totalStages)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getStageProgress(activity.stageNumber, activity.totalStages)}%` }}
                  ></div>
                </div>
              </div>

              {/* Pending Reason */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                <div className="flex items-start space-x-2">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-yellow-900">Activity Status:</p>
                    <p className="text-sm text-yellow-800 mt-1">{activity.pendingReason}</p>
                  </div>
                </div>
              </div>

              {/* Footer Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <UserIcon className="h-4 w-4" />
                    <span>{activity.assignedTo}</span>
                  </div>
                  <div className={`flex items-center space-x-1 font-medium ${getDaysColor(activity.daysUntilDue)}`}>
                    <ClockIcon className="h-4 w-4" />
                    <span>{activity.daysUntilDue} days until due</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toast.success(`Viewing details for ${activity.activityNumber}`)}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <EyeIcon className="h-4 w-4 mr-1" />
                    View Details
                  </button>
                  <button
                    onClick={() => toast.success(`Processing ${activity.activityNumber}`)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    <PencilIcon className="h-4 w-4 mr-1" />
                    Take Action
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => router.push('/dashboard/customer-retention/renewal-tracking')}
            className="bg-white border border-blue-200 rounded-lg p-4 hover:bg-blue-50 transition-colors text-left group"
          >
            <div className="flex items-center">
              <CalendarIcon className="h-5 w-5 text-blue-600 mr-3" />
              <div>
                <div className="font-medium text-gray-900 group-hover:text-blue-600">Check Renewals</div>
                <div className="text-sm text-gray-500">12 policies due soon</div>
              </div>
            </div>
          </button>
          
          <button
            onClick={() => router.push('/dashboard/customer-retention/bulk-email')}
            className="bg-white border border-blue-200 rounded-lg p-4 hover:bg-blue-50 transition-colors text-left group"
          >
            <div className="flex items-center">
              <EnvelopeIcon className="h-5 w-5 text-indigo-600 mr-3" />
              <div>
                <div className="font-medium text-gray-900 group-hover:text-indigo-600">Send Campaign</div>
                <div className="text-sm text-gray-500">1.2K active subscribers</div>
              </div>
            </div>
          </button>
          
          <button
            onClick={() => router.push('/dashboard/customer-retention/conversion-reports')}
            className="bg-white border border-blue-200 rounded-lg p-4 hover:bg-blue-50 transition-colors text-left group"
          >
            <div className="flex items-center">
              <ChartBarIcon className="h-5 w-5 text-green-600 mr-3" />
              <div>
                <div className="font-medium text-gray-900 group-hover:text-green-600">View Analytics</div>
                <div className="text-sm text-gray-500">68% conversion rate</div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
