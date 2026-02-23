'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentArrowUpIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  DocumentTextIcon,
  UserIcon,
  CurrencyRupeeIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const claimSchema = z.object({
  claimNumber: z.string().min(1, 'Claim number is required'),
  policyId: z.string().min(1, 'Policy is required'),
  customerId: z.string().min(1, 'Customer is required'),
  claimType: z.enum(['AUTO_ACCIDENT', 'PROPERTY_DAMAGE', 'THEFT', 'MEDICAL', 'DEATH', 'DISABILITY', 'OTHER']),
  description: z.string().min(1, 'Description is required'),
  amount: z.number().min(0, 'Amount must be positive'),
  status: z.enum(['PENDING', 'UNDER_REVIEW', 'APPROVED', 'DENIED', 'SETTLED', 'CLOSED']),
})

type ClaimForm = z.infer<typeof claimSchema>

interface Claim {
  id: string
  claimNumber: string
  policyId: string
  policy: {
    policyNumber: string
    policyType: string
  }
  customerId: string
  customer: {
    firstName: string
    lastName: string
  }
  claimType: string
  description: string
  amount: number
  status: string
  submittedAt: string
  processedAt?: string
  createdAt: string
}

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
  const [claims, setClaims] = useState<Claim[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingClaim, setEditingClaim] = useState<Claim | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 10
  
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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClaimForm>({
    resolver: zodResolver(claimSchema),
  })

  useEffect(() => {
    fetchClaims()
  }, [currentPage, searchTerm, filterStatus])

  const fetchClaims = async () => {
    try {
      setLoading(true)
      // Mock data - replace with actual API call
      const mockClaims: Claim[] = [
        {
          id: '1',
          claimNumber: 'CLM-2024-001',
          policyId: '1',
          policy: { policyNumber: 'POL-2024-001', policyType: 'AUTO' },
          customerId: '1',
          customer: { firstName: 'Rajesh', lastName: 'Kumar' },
          claimType: 'AUTO_ACCIDENT',
          description: 'Vehicle collision with another car',
          amount: 75000,
          status: 'UNDER_REVIEW',
          submittedAt: '2024-01-15T00:00:00Z',
          createdAt: '2024-01-15T00:00:00Z',
        },
        {
          id: '2',
          claimNumber: 'CLM-2024-002',
          policyId: '2',
          policy: { policyNumber: 'POL-2024-002', policyType: 'HOME' },
          customerId: '2',
          customer: { firstName: 'Priya', lastName: 'Sharma' },
          claimType: 'PROPERTY_DAMAGE',
          description: 'Water damage from burst pipe',
          amount: 125000,
          status: 'APPROVED',
          submittedAt: '2024-01-20T00:00:00Z',
          processedAt: '2024-01-25T00:00:00Z',
          createdAt: '2024-01-20T00:00:00Z',
        },
        {
          id: '3',
          claimNumber: 'CLM-2024-003',
          policyId: '3',
          policy: { policyNumber: 'POL-2024-003', policyType: 'LIFE' },
          customerId: '3',
          customer: { firstName: 'Amit', lastName: 'Patel' },
          claimType: 'THEFT',
          description: 'Stolen personal belongings',
          amount: 85000,
          status: 'PENDING',
          submittedAt: '2024-02-01T00:00:00Z',
          createdAt: '2024-02-01T00:00:00Z',
        },
      ]

      // Apply filters
      let filteredClaims = mockClaims
      if (searchTerm) {
        filteredClaims = filteredClaims.filter(
          (claim) =>
            claim.claimNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            `${claim.customer.firstName} ${claim.customer.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            claim.policy.policyNumber.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }
      if (filterStatus !== 'ALL') {
        filteredClaims = filteredClaims.filter((claim) => claim.status === filterStatus)
      }

      // Pagination
      const startIndex = (currentPage - 1) * itemsPerPage
      const endIndex = startIndex + itemsPerPage
      const paginatedClaims = filteredClaims.slice(startIndex, endIndex)

      setClaims(paginatedClaims)
      setTotalPages(Math.ceil(filteredClaims.length / itemsPerPage))
      setLoading(false)
    } catch (error) {
      toast.error('Error fetching claims')
      setLoading(false)
    }
  }

  const onSubmit = async (data: ClaimForm) => {
    try {
      if (editingClaim) {
        // Update existing claim
        const response = await fetch(`/api/claims/${editingClaim.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        
        if (response.ok) {
          toast.success('Claim updated successfully')
        } else {
          toast.error('Error updating claim')
        }
      } else {
        // Create new claim
        const response = await fetch('/api/claims', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        
        if (response.ok) {
          toast.success('Claim created successfully')
        } else {
          toast.error('Error creating claim')
        }
      }

      setShowModal(false)
      setEditingClaim(null)
      reset()
      fetchClaims()
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  const handleEdit = (claim: Claim) => {
    setEditingClaim(claim)
    reset({
      claimNumber: claim.claimNumber,
      policyId: claim.policyId,
      customerId: claim.customerId,
      claimType: claim.claimType as any,
      description: claim.description,
      amount: claim.amount,
      status: claim.status as any,
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this claim?')) {
      try {
        const response = await fetch(`/api/claims/${id}`, {
          method: 'DELETE',
        })
        
        if (response.ok) {
          toast.success('Claim deleted successfully')
          fetchClaims()
        } else {
          toast.error('Error deleting claim')
        }
      } catch (error) {
        toast.error('An error occurred')
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-success-100 text-success-800'
      case 'PENDING':
        return 'bg-warning-100 text-warning-800'
      case 'UNDER_REVIEW':
        return 'bg-blue-100 text-blue-800'
      case 'DENIED':
        return 'bg-danger-100 text-danger-800'
      case 'SETTLED':
        return 'bg-green-100 text-green-800'
      case 'CLOSED':
        return 'bg-secondary-100 text-secondary-800'
      default:
        return 'bg-secondary-100 text-secondary-800'
    }
  }

  const getClaimTypeLabel = (type: string) => {
    switch (type) {
      case 'AUTO_ACCIDENT':
        return 'Auto Accident'
      case 'PROPERTY_DAMAGE':
        return 'Property Damage'
      case 'THEFT':
        return 'Theft'
      case 'MEDICAL':
        return 'Medical'
      case 'DEATH':
        return 'Death'
      case 'DISABILITY':
        return 'Disability'
      case 'OTHER':
        return 'Other'
      default:
        return type
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
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
    <div className="space-y-6">
      {/* Back to Dashboard Button */}
      <div>
        <button
          onClick={() => window.location.href = '/dashboard'}
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
          <h1 className="text-2xl font-bold text-secondary-900">Claims Management Dashboard</h1>
          <p className="mt-1 text-sm text-secondary-600">
            Manage insurance claims and track processing status at every stage.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingClaim(null)
            reset()
            setShowModal(true)
          }}
          className="btn btn-primary btn-md"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Claim
        </button>
      </div>

      {/* Claims Process Overview */}
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
              <ExclamationCircleIcon className="h-6 w-6 text-teal-600" />
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
                  <ExclamationCircleIcon className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
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

      {/* Filters and search */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
              <input
                type="text"
                placeholder="Search claims, customers, or policies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="APPROVED">Approved</option>
              <option value="DENIED">Denied</option>
              <option value="SETTLED">Settled</option>
              <option value="CLOSED">Closed</option>
            </select>
            <button className="btn btn-secondary btn-md">
              <FunnelIcon className="h-4 w-4 mr-2" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Claims table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-head">Claim Number</th>
                <th className="table-head">Customer</th>
                <th className="table-head">Policy</th>
                <th className="table-head">Type</th>
                <th className="table-head">Amount</th>
                <th className="table-head">Status</th>
                <th className="table-head">Submitted</th>
                <th className="table-head">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {loading ? (
                <tr>
                  <td colSpan={8} className="table-cell text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                  </td>
                </tr>
              ) : claims.length === 0 ? (
                <tr>
                  <td colSpan={8} className="table-cell text-center py-8 text-secondary-500">
                    No claims found
                  </td>
                </tr>
              ) : (
                claims.map((claim) => (
                  <tr key={claim.id} className="table-row">
                    <td className="table-cell font-medium">{claim.claimNumber}</td>
                    <td className="table-cell">
                      {claim.customer.firstName} {claim.customer.lastName}
                    </td>
                    <td className="table-cell">
                      <div>
                        <div className="font-medium">{claim.policy.policyNumber}</div>
                        <div className="text-xs text-secondary-500">{claim.policy.policyType}</div>
                      </div>
                    </td>
                    <td className="table-cell">{getClaimTypeLabel(claim.claimType)}</td>
                    <td className="table-cell">{formatCurrency(claim.amount)}</td>
                    <td className="table-cell">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(claim.status)}`}>
                        {claim.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="table-cell">{formatDate(claim.submittedAt)}</td>
                    <td className="table-cell">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(claim)}
                          className="text-primary-600 hover:text-primary-900"
                          title="Edit claim"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(claim.id)}
                          className="text-danger-600 hover:text-danger-900"
                          title="Delete claim"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                        <button
                          className="text-secondary-600 hover:text-secondary-900"
                          title="View details"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-secondary-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="btn btn-secondary btn-sm"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="btn btn-secondary btn-sm"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-secondary-700">
                  Showing page <span className="font-medium">{currentPage}</span> of{' '}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-secondary-300 bg-white text-sm font-medium text-secondary-500 hover:bg-secondary-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-secondary-300 bg-white text-sm font-medium text-secondary-500 hover:bg-secondary-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-secondary-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-secondary-900 mb-4">
                {editingClaim ? 'Edit Claim' : 'Add New Claim'}
              </h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700">Claim Number</label>
                  <input
                    {...register('claimNumber')}
                    type="text"
                    className="input mt-1"
                  />
                  {errors.claimNumber && (
                    <p className="text-danger-600 text-xs mt-1">{errors.claimNumber.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700">Policy</label>
                  <select {...register('policyId')} className="input mt-1">
                    <option value="">Select Policy</option>
                    <option value="1">POL-2024-001 (John Doe - Auto)</option>
                    <option value="2">POL-2024-002 (Jane Smith - Home)</option>
                    <option value="3">POL-2024-003 (Bob Johnson - Life)</option>
                  </select>
                  {errors.policyId && (
                    <p className="text-danger-600 text-xs mt-1">{errors.policyId.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700">Customer</label>
                  <select {...register('customerId')} className="input mt-1">
                    <option value="">Select Customer</option>
                    <option value="1">John Doe</option>
                    <option value="2">Jane Smith</option>
                    <option value="3">Bob Johnson</option>
                  </select>
                  {errors.customerId && (
                    <p className="text-danger-600 text-xs mt-1">{errors.customerId.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700">Claim Type</label>
                  <select {...register('claimType')} className="input mt-1">
                    <option value="">Select Type</option>
                    <option value="AUTO_ACCIDENT">Auto Accident</option>
                    <option value="PROPERTY_DAMAGE">Property Damage</option>
                    <option value="THEFT">Theft</option>
                    <option value="MEDICAL">Medical</option>
                    <option value="DEATH">Death</option>
                    <option value="DISABILITY">Disability</option>
                    <option value="OTHER">Other</option>
                  </select>
                  {errors.claimType && (
                    <p className="text-danger-600 text-xs mt-1">{errors.claimType.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700">Description</label>
                  <textarea
                    {...register('description')}
                    rows={3}
                    className="input mt-1"
                  />
                  {errors.description && (
                    <p className="text-danger-600 text-xs mt-1">{errors.description.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700">Amount</label>
                  <input
                    {...register('amount', { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    className="input mt-1"
                  />
                  {errors.amount && (
                    <p className="text-danger-600 text-xs mt-1">{errors.amount.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700">Status</label>
                  <select {...register('status')} className="input mt-1">
                    <option value="">Select Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="UNDER_REVIEW">Under Review</option>
                    <option value="APPROVED">Approved</option>
                    <option value="DENIED">Denied</option>
                    <option value="SETTLED">Settled</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                  {errors.status && (
                    <p className="text-danger-600 text-xs mt-1">{errors.status.message}</p>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn btn-secondary btn-md"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-md">
                    {editingClaim ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

