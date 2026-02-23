'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  PlusIcon,
  ArrowLeftIcon,
  DocumentTextIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  PencilIcon,
  UserIcon,
  CalendarIcon,
  CurrencyRupeeIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface PendingPolicyItem {
  id: string
  policyNumber: string
  customerName: string
  policyType: string
  actionType: 'NEW_ISSUANCE' | 'RENEWAL' | 'ENDORSEMENT' | 'VERIFICATION'
  premium: number
  submittedDate: string
  expiryDate?: string
  currentStage: string
  stageNumber: number
  totalStages: number
  pendingReason: string
  daysInCurrentStage: number
  assignedTo: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
}

export default function PoliciesPage() {
  const router = useRouter()

  const [pendingPolicies] = useState<PendingPolicyItem[]>([
    {
      id: '1',
      policyNumber: 'POL/NEW/2025/234',
      customerName: 'Arjun Mehta',
      policyType: 'MOTOR - Comprehensive',
      actionType: 'NEW_ISSUANCE',
      premium: 45000,
      submittedDate: '2025-10-10',
      currentStage: 'Document Verification',
      stageNumber: 2,
      totalStages: 4,
      pendingReason: 'Awaiting RC copy and previous insurance policy documents',
      daysInCurrentStage: 2,
      assignedTo: 'Policy Officer - Ms. Sneha Iyer',
      priority: 'HIGH'
    },
    {
      id: '2',
      policyNumber: 'POL/RNW/2025/567',
      customerName: 'Ramesh Industries Ltd',
      policyType: 'FIRE Insurance',
      actionType: 'RENEWAL',
      premium: 325000,
      submittedDate: '2025-09-28',
      expiryDate: '2025-10-25',
      currentStage: 'Renewal Processing',
      stageNumber: 3,
      totalStages: 4,
      pendingReason: 'Waiting for updated property valuation report from surveyor',
      daysInCurrentStage: 13,
      assignedTo: 'Sr. Policy Manager - Mr. Vikram Rao',
      priority: 'CRITICAL'
    },
    {
      id: '3',
      policyNumber: 'POL/END/2025/089',
      customerName: 'Neha Kapoor',
      policyType: 'HEALTH - GMC',
      actionType: 'ENDORSEMENT',
      premium: 125000,
      submittedDate: '2025-10-08',
      currentStage: 'Endorsement Review',
      stageNumber: 2,
      totalStages: 3,
      pendingReason: 'Customer requested to add 2 more family members - medical history pending',
      daysInCurrentStage: 4,
      assignedTo: 'Policy Executive - Ms. Priya Sharma',
      priority: 'MEDIUM'
    },
    {
      id: '4',
      policyNumber: 'POL/VER/2025/445',
      customerName: 'TechCorp Solutions',
      policyType: 'LIABILITY - Professional Indemnity',
      actionType: 'VERIFICATION',
      premium: 550000,
      submittedDate: '2025-10-11',
      currentStage: 'Risk Assessment',
      stageNumber: 1,
      totalStages: 3,
      pendingReason: 'Underwriter reviewing company financials and past claims history',
      daysInCurrentStage: 1,
      assignedTo: 'Underwriter - Mr. Aditya Kulkarni',
      priority: 'HIGH'
    },
    {
      id: '5',
      policyNumber: 'POL/NEW/2025/235',
      customerName: 'Anjali Deshmukh',
      policyType: 'LIFE - Term Plan',
      actionType: 'NEW_ISSUANCE',
      premium: 85000,
      submittedDate: '2025-10-05',
      currentStage: 'Medical Underwriting',
      stageNumber: 2,
      totalStages: 4,
      pendingReason: 'Medical examination scheduled - awaiting test results',
      daysInCurrentStage: 6,
      assignedTo: 'Medical Underwriter - Dr. Rajiv Nair',
      priority: 'MEDIUM'
    },
  ])

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

  const getActionTypeColor = (type: string) => {
    switch (type) {
      case 'NEW_ISSUANCE':
        return 'bg-blue-100 text-blue-800'
      case 'RENEWAL':
        return 'bg-green-100 text-green-800'
      case 'ENDORSEMENT':
        return 'bg-purple-100 text-purple-800'
      case 'VERIFICATION':
        return 'bg-orange-100 text-orange-800'
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

      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Policy Management Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage insurance policies - issuance, renewals, endorsements, and verifications
          </p>
        </div>
        <Link
          href="/dashboard/policies/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New Policy
        </Link>
      </div>

      {/* Business Summary Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Policies</p>
              <p className="text-2xl font-bold text-gray-900">2,845</p>
              <div className="flex items-center mt-2">
                <svg className="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-green-600">+15% vs last month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Renewals</p>
              <p className="text-2xl font-bold text-gray-900">128</p>
              <div className="flex items-center mt-2">
                <ClockIcon className="w-4 h-4 text-orange-500 mr-1" />
                <span className="text-sm text-orange-600">Due this month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <ClockIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">New Issuances</p>
              <p className="text-2xl font-bold text-gray-900">67</p>
              <div className="flex items-center mt-2">
                <svg className="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-green-600">This month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <DocumentTextIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Premium</p>
              <p className="text-2xl font-bold text-gray-900">₹12.5Cr</p>
              <div className="flex items-center mt-2">
                <svg className="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-green-600">+22% vs last month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <CurrencyRupeeIcon className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Policy Management Process */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Policy Management Process</h2>
        <p className="text-sm text-gray-600 mb-6">
          Complete lifecycle from policy issuance to renewals and endorsements
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-2">
              <DocumentTextIcon className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xs font-semibold text-gray-900">Step 1</h3>
            <p className="text-xs text-gray-600 mt-1">Application & KYC</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-2">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xs font-semibold text-gray-900">Step 2</h3>
            <p className="text-xs text-gray-600 mt-1">Underwriting & Approval</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-2">
              <CurrencyRupeeIcon className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xs font-semibold text-gray-900">Step 3</h3>
            <p className="text-xs text-gray-600 mt-1">Payment & Policy Issuance</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-2">
              <CalendarIcon className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-xs font-semibold text-gray-900">Step 4</h3>
            <p className="text-xs text-gray-600 mt-1">Policy Certificate</p>
          </div>
        </div>
      </div>

      {/* Pending Policy Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Pending Policy Actions - Detailed Status</h2>
            <p className="text-sm text-gray-600 mt-1">
              Track policy issuances, renewals, endorsements, and verifications with current status
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <ClockIcon className="h-5 w-5" />
            <span className="font-semibold">{pendingPolicies.length} actions pending</span>
          </div>
        </div>

        <div className="space-y-4">
          {pendingPolicies.map((policy) => (
            <div key={policy.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
              {/* Header Row */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-base font-semibold text-gray-900">{policy.policyNumber}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(policy.priority)}`}>
                      {policy.priority}
                    </span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getActionTypeColor(policy.actionType)}`}>
                      {policy.actionType.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Customer:</span>
                      <span className="ml-2 font-medium text-gray-900">{policy.customerName}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Policy Type:</span>
                      <span className="ml-2 font-medium text-gray-900">{policy.policyType}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Premium:</span>
                      <span className="ml-2 font-medium text-gray-900">{formatCurrency(policy.premium)}</span>
                    </div>
                    {policy.expiryDate && (
                      <div>
                        <span className="text-gray-500">Expiry:</span>
                        <span className="ml-2 font-medium text-red-600">{policy.expiryDate}</span>
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
                    <span className="text-sm font-semibold text-blue-600">{policy.currentStage}</span>
                    <span className="text-xs text-gray-500">(Step {policy.stageNumber} of {policy.totalStages})</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{getStageProgress(policy.stageNumber, policy.totalStages)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getStageProgress(policy.stageNumber, policy.totalStages)}%` }}
                  ></div>
                </div>
              </div>

              {/* Pending Reason */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                <div className="flex items-start space-x-2">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-yellow-900">Reason for Pending:</p>
                    <p className="text-sm text-yellow-800 mt-1">{policy.pendingReason}</p>
                  </div>
                </div>
              </div>

              {/* Footer Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <UserIcon className="h-4 w-4" />
                    <span>{policy.assignedTo}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ClockIcon className="h-4 w-4" />
                    <span>Submitted: {policy.submittedDate}</span>
                  </div>
                  <div className={`flex items-center space-x-1 font-medium ${getDaysColor(policy.daysInCurrentStage)}`}>
                    <span>{policy.daysInCurrentStage} days in current stage</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toast.success(`Viewing details for ${policy.policyNumber}`)}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <EyeIcon className="h-4 w-4 mr-1" />
                    View Details
                  </button>
                  <button
                    onClick={() => toast.success(`Processing ${policy.policyNumber}`)}
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/dashboard/policies/new"
          className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <DocumentTextIcon className="h-8 w-8 text-blue-600 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">New Policy Issuance</h3>
          <p className="text-sm text-gray-600">Issue new insurance policies for customers</p>
        </Link>

        <Link
          href="/dashboard/policies/renewal"
          className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <ClockIcon className="h-8 w-8 text-green-600 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Policy Renewals</h3>
          <p className="text-sm text-gray-600">Manage and process policy renewals</p>
        </Link>

        <Link
          href="/dashboard/postsale/endorsement"
          className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <PencilIcon className="h-8 w-8 text-purple-600 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Policy Endorsements</h3>
          <p className="text-sm text-gray-600">Modify existing policy details</p>
        </Link>
      </div>
    </div>
  )
}
