'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon, DocumentCheckIcon, CheckCircleIcon, XMarkIcon, ClockIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

interface BusinessData {
  agentId: string
  agentName: string
  policiesIssued: number
  totalPremium: number
  motorPolicies64VB: number
  motorPremium64VB: number
  ownDamagePremium: number
  thirdPartyPremium: number
  status: 'pending' | 'approved' | 'rejected'
  approvalLevel: number
  submittedBy: string
  submittedDate: string
  approvedBy?: string
  approvedDate?: string
  financeApprovedBy?: string
  financeApprovedDate?: string
}

export default function FinanceDataReviewPage() {
  const router = useRouter()
  const [businessData, setBusinessData] = useState<BusinessData[]>([])
  const [selectedMonth, setSelectedMonth] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleBack = () => {
    router.push('/dashboard/finance')
  }

  const handleFinanceApprove = (agentId: string) => {
    setBusinessData(prev => prev.map(item => 
      item.agentId === agentId 
        ? { 
            ...item, 
            status: 'approved', 
            financeApprovedBy: 'Finance Manager',
            financeApprovedDate: new Date().toISOString().split('T')[0]
          }
        : item
    ))
  }

  const handleFinanceReject = (agentId: string) => {
    setBusinessData(prev => prev.map(item => 
      item.agentId === agentId 
        ? { 
            ...item, 
            status: 'rejected',
            financeApprovedBy: 'Finance Manager',
            financeApprovedDate: new Date().toISOString().split('T')[0]
          }
        : item
    ))
  }

  const handleExportData = () => {
    const csvContent = [
      'Agent ID,Agent Name,Policies Issued,Total Premium,Motor 64VB Policies,Motor 64VB Premium,Own Damage Premium,Third Party Premium,Status,Finance Approval',
      ...businessData.map(item => [
        item.agentId,
        item.agentName,
        item.policiesIssued,
        item.totalPremium,
        item.motorPolicies64VB,
        item.motorPremium64VB,
        item.ownDamagePremium,
        item.thirdPartyPremium,
        item.status,
        item.financeApprovedBy || 'Pending'
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `finance-data-review-${selectedMonth || 'all'}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Mock data
  useEffect(() => {
    const mockData: BusinessData[] = [
      {
        agentId: 'AGT001',
        agentName: 'John Smith',
        policiesIssued: 25,
        totalPremium: 1250000,
        motorPolicies64VB: 15,
        motorPremium64VB: 750000,
        ownDamagePremium: 450000,
        thirdPartyPremium: 300000,
        status: 'pending',
        approvalLevel: 2,
        submittedBy: 'John Smith',
        submittedDate: '2024-01-15',
        approvedBy: 'Manager A',
        approvedDate: '2024-01-16'
      },
      {
        agentId: 'AGT002',
        agentName: 'Sarah Johnson',
        policiesIssued: 18,
        totalPremium: 980000,
        motorPolicies64VB: 12,
        motorPremium64VB: 580000,
        ownDamagePremium: 350000,
        thirdPartyPremium: 230000,
        status: 'pending',
        approvalLevel: 2,
        submittedBy: 'Sarah Johnson',
        submittedDate: '2024-01-14',
        approvedBy: 'Manager A',
        approvedDate: '2024-01-16'
      },
      {
        agentId: 'AGT003',
        agentName: 'Mike Wilson',
        policiesIssued: 32,
        totalPremium: 1680000,
        motorPolicies64VB: 22,
        motorPremium64VB: 920000,
        ownDamagePremium: 550000,
        thirdPartyPremium: 370000,
        status: 'approved',
        approvalLevel: 2,
        submittedBy: 'Mike Wilson',
        submittedDate: '2024-01-13',
        approvedBy: 'Manager B',
        approvedDate: '2024-01-15',
        financeApprovedBy: 'Finance Manager',
        financeApprovedDate: '2024-01-17'
      }
    ]
    setBusinessData(mockData)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-yellow-100 text-yellow-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircleIcon className="h-4 w-4" />
      case 'rejected': return <XMarkIcon className="h-4 w-4" />
      default: return <ClockIcon className="h-4 w-4" />
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
              Back to Finance
            </button>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Finance Data Review</h1>
          <p className="text-gray-600 mt-2">
            Review and approve business data from operations team
          </p>
        </div>

        {/* Finance Review Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Finance Department Review Process</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <div className="flex items-start">
                <span className="mr-2">•</span>
                <span>Review business data approved by operations team</span>
              </div>
              <div className="flex items-start">
                <span className="mr-2">•</span>
                <span>Verify financial accuracy and compliance</span>
              </div>
            </div>
            <div>
              <div className="flex items-start">
                <span className="mr-2">•</span>
                <span>Approve data for payment processing</span>
              </div>
              <div className="flex items-start">
                <span className="mr-2">•</span>
                <span>Generate financial reports and summaries</span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Month
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Month</option>
                  <option value="2024-01">January 2024</option>
                  <option value="2024-02">February 2024</option>
                  <option value="2024-03">March 2024</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleExportData}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Export Data
              </button>
            </div>
          </div>
        </div>

        {/* Business Data Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Business Data Review</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Agent Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Policies Issued
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Premium
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    64VB Motor Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Finance Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {businessData.map((data) => (
                  <tr key={data.agentId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{data.agentName}</div>
                        <div className="text-sm text-gray-500">ID: {data.agentId}</div>
                        <div className="text-sm text-gray-500">Submitted: {data.submittedDate}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{data.policiesIssued}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">₹{data.totalPremium.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div>Policies: {data.motorPolicies64VB}</div>
                        <div>Premium: ₹{data.motorPremium64VB.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">
                          OD: ₹{data.ownDamagePremium.toLocaleString()} | TP: ₹{data.thirdPartyPremium.toLocaleString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(data.status)}`}>
                        {getStatusIcon(data.status)}
                        <span className="ml-1">{data.status}</span>
                      </span>
                      <div className="text-xs text-gray-500 mt-1">
                        Operations: {data.approvedBy} ({data.approvedDate})
                      </div>
                      {data.financeApprovedBy && (
                        <div className="text-xs text-green-600 mt-1">
                          Finance: {data.financeApprovedBy} ({data.financeApprovedDate})
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {data.status === 'pending' && data.approvalLevel >= 2 && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleFinanceApprove(data.agentId)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleFinanceReject(data.agentId)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {data.status === 'approved' && data.financeApprovedBy && (
                        <span className="text-green-600">Finance Approved</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="text-sm font-medium text-gray-500">Total Agents</div>
            <div className="text-2xl font-bold text-gray-900">{businessData.length}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="text-sm font-medium text-gray-500">Total Premium</div>
            <div className="text-2xl font-bold text-gray-900">
              ₹{businessData.reduce((sum, data) => sum + data.totalPremium, 0).toLocaleString()}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="text-sm font-medium text-gray-500">Finance Approved</div>
            <div className="text-2xl font-bold text-green-600">
              {businessData.filter(data => data.financeApprovedBy).length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="text-sm font-medium text-gray-500">Pending Review</div>
            <div className="text-2xl font-bold text-yellow-600">
              {businessData.filter(data => data.status === 'pending' && data.approvalLevel >= 2).length}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}






