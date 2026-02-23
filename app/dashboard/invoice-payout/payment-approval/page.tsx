'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon, CreditCardIcon, UserIcon, CheckCircleIcon, XMarkIcon, ClockIcon, ExclamationTriangleIcon, DocumentTextIcon } from '@heroicons/react/24/outline'

interface PaymentData {
  id: string
  agentId: string
  agentName: string
  amount: number
  status: 'pending' | 'level1-approved' | 'level2-approved' | 'rejected' | 'paid'
  approvalLevel: number
  submittedBy: string
  submittedDate: string
  level1ApprovedBy?: string
  level1ApprovedDate?: string
  level2ApprovedBy?: string
  level2ApprovedDate?: string
  paidDate?: string
  rejectionReason?: string
}

export default function PaymentApprovalPage() {
  const router = useRouter()
  const [payments, setPayments] = useState<PaymentData[]>([])
  const [currentUserRole, setCurrentUserRole] = useState<'level1' | 'level2'>('level1')
  const [showRejectionModal, setShowRejectionModal] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<PaymentData | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')

  const handleBack = () => {
    router.push('/dashboard/invoice-payout')
  }

  const handleApprove = (paymentId: string) => {
    setPayments(prev => prev.map(payment => {
      if (payment.id === paymentId) {
        const newLevel = payment.approvalLevel + 1
        const newStatus = newLevel === 1 ? 'level1-approved' : 'level2-approved'
        return {
          ...payment,
          status: newStatus,
          approvalLevel: newLevel,
          [`level${newLevel}ApprovedBy`]: 'Current User',
          [`level${newLevel}ApprovedDate`]: new Date().toISOString().split('T')[0]
        }
      }
      return payment
    }))
  }

  const handleReject = (paymentId: string) => {
    setPayments(prev => prev.map(payment => 
      payment.id === paymentId 
        ? { 
            ...payment, 
            status: 'rejected',
            rejectionReason: rejectionReason
          }
        : payment
    ))
    setShowRejectionModal(false)
    setSelectedPayment(null)
    setRejectionReason('')
  }

  const handleProcessPayment = (paymentId: string) => {
    setPayments(prev => prev.map(payment => 
      payment.id === paymentId 
        ? { 
            ...payment, 
            status: 'paid',
            paidDate: new Date().toISOString().split('T')[0]
          }
        : payment
    ))
  }

  const handleOpenRejectionModal = (payment: PaymentData) => {
    setSelectedPayment(payment)
    setShowRejectionModal(true)
  }

  // Mock data
  useEffect(() => {
    const mockPayments: PaymentData[] = [
      {
        id: 'PAY001',
        agentId: 'AGT001',
        agentName: 'John Smith',
        amount: 125000,
        status: 'pending',
        approvalLevel: 0,
        submittedBy: 'John Smith',
        submittedDate: '2024-01-15'
      },
      {
        id: 'PAY002',
        agentId: 'AGT002',
        agentName: 'Sarah Johnson',
        amount: 85000,
        status: 'level1-approved',
        approvalLevel: 1,
        submittedBy: 'Sarah Johnson',
        submittedDate: '2024-01-14',
        level1ApprovedBy: 'Manager A',
        level1ApprovedDate: '2024-01-16'
      },
      {
        id: 'PAY003',
        agentId: 'AGT003',
        agentName: 'Mike Wilson',
        amount: 200000,
        status: 'level2-approved',
        approvalLevel: 2,
        submittedBy: 'Mike Wilson',
        submittedDate: '2024-01-13',
        level1ApprovedBy: 'Manager A',
        level1ApprovedDate: '2024-01-15',
        level2ApprovedBy: 'Senior Manager B',
        level2ApprovedDate: '2024-01-17'
      },
      {
        id: 'PAY004',
        agentId: 'AGT004',
        agentName: 'Lisa Brown',
        amount: 150000,
        status: 'paid',
        approvalLevel: 2,
        submittedBy: 'Lisa Brown',
        submittedDate: '2024-01-12',
        level1ApprovedBy: 'Manager A',
        level1ApprovedDate: '2024-01-14',
        level2ApprovedBy: 'Senior Manager B',
        level2ApprovedDate: '2024-01-16',
        paidDate: '2024-01-18'
      }
    ]
    setPayments(mockPayments)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'level2-approved': return 'bg-blue-100 text-blue-800'
      case 'level1-approved': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircleIcon className="h-4 w-4" />
      case 'rejected': return <XMarkIcon className="h-4 w-4" />
      case 'level2-approved': return <CheckCircleIcon className="h-4 w-4" />
      case 'level1-approved': return <CheckCircleIcon className="h-4 w-4" />
      default: return <ClockIcon className="h-4 w-4" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Paid'
      case 'rejected': return 'Rejected'
      case 'level2-approved': return 'Level 2 Approved'
      case 'level1-approved': return 'Level 1 Approved'
      default: return 'Pending'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Invoice & Payout
            </button>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Approval</h1>
          <p className="text-gray-600 mt-2">
            Payment approval system handled by Finance Department with 2-level authorization
          </p>
        </div>

        {/* Approval Process Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Finance Department Payment Approval</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <div className="flex items-start">
                <span className="mr-2">•</span>
                <span>Level 1: Finance Operations Team - Initial payment review and validation</span>
              </div>
              <div className="flex items-start">
                <span className="mr-2">•</span>
                <span>Level 2: Finance Manager - Final approval before payment processing</span>
              </div>
            </div>
            <div>
              <div className="flex items-start">
                <span className="mr-2">•</span>
                <span>All payments require Finance Department approval for security</span>
              </div>
              <div className="flex items-start">
                <span className="mr-2">•</span>
                <span>Automated workflows ensure timely processing</span>
              </div>
            </div>
          </div>
        </div>

        {/* User Role Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current User Role
              </label>
              <select
                value={currentUserRole}
                onChange={(e) => setCurrentUserRole(e.target.value as 'level1' | 'level2')}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="level1">Level 1 - Finance Operations</option>
                <option value="level2">Level 2 - Finance Manager</option>
              </select>
            </div>
            <div className="text-sm text-gray-600">
              You can approve payments at your level and below
            </div>
          </div>
        </div>

        {/* Payment Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="text-sm font-medium text-gray-500">Total Payments</div>
            <div className="text-2xl font-bold text-gray-900">{payments.length}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="text-sm font-medium text-gray-500">Total Amount</div>
            <div className="text-2xl font-bold text-gray-900">
              ₹{payments.reduce((sum, payment) => sum + payment.amount, 0).toLocaleString()}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="text-sm font-medium text-gray-500">Pending Approval</div>
            <div className="text-2xl font-bold text-yellow-600">
              {payments.filter(payment => payment.status === 'pending' || payment.status === 'level1-approved').length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="text-sm font-medium text-gray-500">Paid</div>
            <div className="text-2xl font-bold text-green-600">
              {payments.filter(payment => payment.status === 'paid').length}
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Payment Approval Management</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Agent Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Approval Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{payment.agentName}</div>
                        <div className="text-sm text-gray-500">ID: {payment.agentId}</div>
                        <div className="text-sm text-gray-500">Submitted: {payment.submittedDate}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">₹{payment.amount.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {getStatusIcon(payment.status)}
                        <span className="ml-1">{getStatusText(payment.status)}</span>
                      </span>
                      {payment.rejectionReason && (
                        <div className="text-xs text-red-600 mt-1">
                          {payment.rejectionReason}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{payment.approvalLevel}/2</div>
                      {payment.level1ApprovedBy && (
                        <div className="text-xs text-gray-500">
                          L1: {payment.level1ApprovedBy} ({payment.level1ApprovedDate})
                        </div>
                      )}
                      {payment.level2ApprovedBy && (
                        <div className="text-xs text-gray-500">
                          L2: {payment.level2ApprovedBy} ({payment.level2ApprovedDate})
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {payment.status === 'pending' && currentUserRole === 'level1' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApprove(payment.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleOpenRejectionModal(payment)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {payment.status === 'level1-approved' && currentUserRole === 'level2' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApprove(payment.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleOpenRejectionModal(payment)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {payment.status === 'level2-approved' && (
                        <button
                          onClick={() => handleProcessPayment(payment.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Process Payment
                        </button>
                      )}
                      {payment.status === 'paid' && (
                        <span className="text-green-600">Paid on {payment.paidDate}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Rejection Modal */}
        {showRejectionModal && selectedPayment && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Reject Payment</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rejection Reason
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Enter reason for rejection"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      rows={4}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => {
                      setShowRejectionModal(false)
                      setSelectedPayment(null)
                      setRejectionReason('')
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleReject(selectedPayment.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Reject Payment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
