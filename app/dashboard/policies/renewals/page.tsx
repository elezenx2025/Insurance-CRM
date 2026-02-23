'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarIcon,
  CurrencyRupeeIcon,
  UserIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface RenewalPolicy {
  id: string
  policyNumber: string
  customerName: string
  customerType: 'INDIVIDUAL' | 'CORPORATE'
  policyType: string
  currentPremium: number
  renewalPremium: number
  expiryDate: string
  renewalDate: string
  status: 'PENDING' | 'IN_PROGRESS' | 'APPROVED' | 'REJECTED' | 'EXPIRED'
  daysToExpiry: number
  assignedTo: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  renewalStage: string
  documents: {
    policyDocument: boolean
    kycDocuments: boolean
    additionalDocuments: boolean
  }
  lastContactDate: string
  contactAttempts: number
}

export default function PolicyRenewalsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL')
  const [selectedPolicies, setSelectedPolicies] = useState<string[]>([])

  const [renewalPolicies] = useState<RenewalPolicy[]>([
    {
      id: '1',
      policyNumber: 'POL/RNW/2025/001',
      customerName: 'Rajesh Kumar',
      customerType: 'INDIVIDUAL',
      policyType: 'MOTOR - Comprehensive',
      currentPremium: 45000,
      renewalPremium: 47250,
      expiryDate: '2025-11-15',
      renewalDate: '2025-11-15',
      status: 'PENDING',
      daysToExpiry: 19,
      assignedTo: 'Priya Sharma',
      priority: 'HIGH',
      renewalStage: 'Customer Contact',
      documents: {
        policyDocument: true,
        kycDocuments: true,
        additionalDocuments: false
      },
      lastContactDate: '2025-10-25',
      contactAttempts: 2
    },
    {
      id: '2',
      policyNumber: 'POL/RNW/2025/002',
      customerName: 'TechCorp Solutions Pvt Ltd',
      customerType: 'CORPORATE',
      policyType: 'FIRE Insurance',
      currentPremium: 325000,
      renewalPremium: 341250,
      expiryDate: '2025-10-30',
      renewalDate: '2025-10-30',
      status: 'IN_PROGRESS',
      daysToExpiry: 3,
      assignedTo: 'Vikram Rao',
      priority: 'CRITICAL',
      renewalStage: 'Premium Calculation',
      documents: {
        policyDocument: true,
        kycDocuments: true,
        additionalDocuments: true
      },
      lastContactDate: '2025-10-26',
      contactAttempts: 1
    },
    {
      id: '3',
      policyNumber: 'POL/RNW/2025/003',
      customerName: 'Sunita Patel',
      customerType: 'INDIVIDUAL',
      policyType: 'HEALTH - Individual',
      currentPremium: 25000,
      renewalPremium: 26250,
      expiryDate: '2025-12-01',
      renewalDate: '2025-12-01',
      status: 'APPROVED',
      daysToExpiry: 35,
      assignedTo: 'Amit Singh',
      priority: 'MEDIUM',
      renewalStage: 'Payment Processing',
      documents: {
        policyDocument: true,
        kycDocuments: true,
        additionalDocuments: true
      },
      lastContactDate: '2025-10-27',
      contactAttempts: 1
    },
    {
      id: '4',
      policyNumber: 'POL/RNW/2025/004',
      customerName: 'Global Industries Ltd',
      customerType: 'CORPORATE',
      policyType: 'LIABILITY - Professional Indemnity',
      currentPremium: 550000,
      renewalPremium: 577500,
      expiryDate: '2025-10-28',
      renewalDate: '2025-10-28',
      status: 'EXPIRED',
      daysToExpiry: -1,
      assignedTo: 'Neha Kapoor',
      priority: 'CRITICAL',
      renewalStage: 'Expired - Grace Period',
      documents: {
        policyDocument: true,
        kycDocuments: false,
        additionalDocuments: false
      },
      lastContactDate: '2025-10-20',
      contactAttempts: 5
    },
    {
      id: '5',
      policyNumber: 'POL/RNW/2025/005',
      customerName: 'Arjun Mehta',
      customerType: 'INDIVIDUAL',
      policyType: 'MOTOR - Third Party',
      currentPremium: 15000,
      renewalPremium: 15750,
      expiryDate: '2025-11-20',
      renewalDate: '2025-11-20',
      status: 'REJECTED',
      daysToExpiry: 24,
      assignedTo: 'Sneha Iyer',
      priority: 'LOW',
      renewalStage: 'Rejected - Customer Declined',
      documents: {
        policyDocument: true,
        kycDocuments: true,
        additionalDocuments: false
      },
      lastContactDate: '2025-10-24',
      contactAttempts: 3
    }
  ])

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`
    } else if (amount >= 1000000) {
      return `₹${(amount / 1000000).toFixed(1)}M`
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`
    } else {
      return `₹${amount.toLocaleString()}`
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800'
      case 'APPROVED': return 'bg-green-100 text-green-800'
      case 'REJECTED': return 'bg-red-100 text-red-800'
      case 'EXPIRED': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'bg-green-100 text-green-800'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800'
      case 'HIGH': return 'bg-orange-100 text-orange-800'
      case 'CRITICAL': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDaysToExpiryColor = (days: number) => {
    if (days < 0) return 'text-red-600 font-bold'
    if (days <= 7) return 'text-red-600 font-semibold'
    if (days <= 30) return 'text-orange-600 font-medium'
    return 'text-green-600'
  }

  const filteredPolicies = renewalPolicies.filter(policy => {
    const matchesSearch = policy.policyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.policyType.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'ALL' || policy.status === statusFilter
    const matchesPriority = priorityFilter === 'ALL' || policy.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  const handleSelectPolicy = (policyId: string) => {
    setSelectedPolicies(prev => 
      prev.includes(policyId) 
        ? prev.filter(id => id !== policyId)
        : [...prev, policyId]
    )
  }

  const handleSelectAll = () => {
    if (selectedPolicies.length === filteredPolicies.length) {
      setSelectedPolicies([])
    } else {
      setSelectedPolicies(filteredPolicies.map(p => p.id))
    }
  }

  const handleBulkAction = (action: string) => {
    if (selectedPolicies.length === 0) {
      toast.error('Please select policies to perform bulk action')
      return
    }
    
    switch (action) {
      case 'contact':
        toast.success(`Initiated contact for ${selectedPolicies.length} policies`)
        break
      case 'remind':
        toast.success(`Sent reminders for ${selectedPolicies.length} policies`)
        break
      case 'export':
        toast.success(`Exported ${selectedPolicies.length} policies`)
        break
      default:
        toast(`Bulk action: ${action}`)
    }
    setSelectedPolicies([])
  }

  const statusCounts = {
    ALL: renewalPolicies.length,
    PENDING: renewalPolicies.filter(p => p.status === 'PENDING').length,
    IN_PROGRESS: renewalPolicies.filter(p => p.status === 'IN_PROGRESS').length,
    APPROVED: renewalPolicies.filter(p => p.status === 'APPROVED').length,
    REJECTED: renewalPolicies.filter(p => p.status === 'REJECTED').length,
    EXPIRED: renewalPolicies.filter(p => p.status === 'EXPIRED').length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Policy Renewals</h1>
                <p className="text-sm text-gray-600">Manage and track policy renewals</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href="/dashboard/policies/renewal"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                New Renewal
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div
              key={status}
              className={`bg-white rounded-lg shadow p-4 cursor-pointer transition-colors ${
                statusFilter === status ? 'ring-2 ring-blue-500' : 'hover:bg-gray-50'
              }`}
              onClick={() => setStatusFilter(status)}
            >
              <div className="text-2xl font-bold text-gray-900">{count}</div>
              <div className="text-sm text-gray-600 capitalize">
                {status.replace('_', ' ').toLowerCase()}
              </div>
            </div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search policies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="ALL">All Priorities</option>
                  <option value="CRITICAL">Critical</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </div>
              
              {selectedPolicies.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {selectedPolicies.length} selected
                  </span>
                  <button
                    onClick={() => handleBulkAction('contact')}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    Contact
                  </button>
                  <button
                    onClick={() => handleBulkAction('remind')}
                    className="px-3 py-1 bg-orange-600 text-white text-sm rounded hover:bg-orange-700"
                  >
                    Remind
                  </button>
                  <button
                    onClick={() => handleBulkAction('export')}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                  >
                    Export
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedPolicies.length === filteredPolicies.length && filteredPolicies.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Policy Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Premium
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiry
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPolicies.map((policy) => (
                  <tr key={policy.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedPolicies.includes(policy.id)}
                        onChange={() => handleSelectPolicy(policy.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {policy.policyNumber}
                        </div>
                        <div className="text-sm text-gray-500">{policy.policyType}</div>
                        <div className="flex items-center mt-1 space-x-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(policy.priority)}`}>
                            {policy.priority}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {policy.customerType === 'INDIVIDUAL' ? (
                          <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                        ) : (
                          <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mr-2" />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {policy.customerName}
                          </div>
                          <div className="text-sm text-gray-500">{policy.customerType}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(policy.renewalPremium)}
                        </div>
                        <div className="text-sm text-gray-500">
                          Current: {formatCurrency(policy.currentPremium)}
                        </div>
                        {policy.renewalPremium > policy.currentPremium && (
                          <div className="text-xs text-green-600">
                            +{formatCurrency(policy.renewalPremium - policy.currentPremium)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(policy.expiryDate).toLocaleDateString()}
                        </div>
                        <div className={`text-sm ${getDaysToExpiryColor(policy.daysToExpiry)}`}>
                          {policy.daysToExpiry < 0 
                            ? `Expired ${Math.abs(policy.daysToExpiry)} days ago`
                            : `${policy.daysToExpiry} days left`
                          }
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(policy.status)}`}>
                        {policy.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {policy.renewalStage}
                        </div>
                        <div className="text-sm text-gray-500">
                          Assigned: {policy.assignedTo}
                        </div>
                        <div className="text-xs text-gray-500">
                          Last contact: {new Date(policy.lastContactDate).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => router.push(`/dashboard/policies/renewals/${policy.id}`)}
                          className="p-1 text-gray-400 hover:text-blue-600"
                          title="View Details"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => router.push(`/dashboard/policies/renewal?edit=${policy.id}`)}
                          className="p-1 text-gray-400 hover:text-green-600"
                          title="Edit Renewal"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                        onClick={() => toast(`Downloading documents for ${policy.policyNumber}`)}
                          className="p-1 text-gray-400 hover:text-purple-600"
                          title="Download Documents"
                        >
                          <ArrowDownTrayIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPolicies.length === 0 && (
            <div className="text-center py-12">
              <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No renewals found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}










