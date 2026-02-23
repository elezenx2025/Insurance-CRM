'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon, DocumentCheckIcon, UserIcon, ChartBarIcon, CheckCircleIcon, XMarkIcon, ClockIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

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
}

export default function DataApprovalPage() {
  const router = useRouter()
  const [businessData, setBusinessData] = useState<BusinessData[]>([])
  const [selectedMonth, setSelectedMonth] = useState('')
  const [approvalLevel, setApprovalLevel] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedAgents, setSelectedAgents] = useState<string[]>([])

  const handleBack = () => {
    router.push('/dashboard/invoice-payout')
  }

  const handleApprove = (agentId: string) => {
    setBusinessData(prev => prev.map(item => 
      item.agentId === agentId 
        ? { 
            ...item, 
            status: 'approved', 
            approvalLevel: item.approvalLevel + 1,
            approvedBy: 'Current User',
            approvedDate: new Date().toISOString().split('T')[0]
          }
        : item
    ))
  }

  const handleReject = (agentId: string) => {
    setBusinessData(prev => prev.map(item => 
      item.agentId === agentId 
        ? { 
            ...item, 
            status: 'rejected',
            approvedBy: 'Current User',
            approvedDate: new Date().toISOString().split('T')[0]
          }
        : item
    ))
  }

  const handleSubmitToFinance = () => {
    const approvedData = businessData.filter(item => item.status === 'approved' && item.approvalLevel >= 2)
    if (approvedData.length > 0) {
      alert(`Submitted ${approvedData.length} approved records to Finance Department`)
    } else {
      alert('No records ready for Finance Department submission')
    }
  }

  const handleAgentSelection = (agentId: string) => {
    setSelectedAgents(prev => 
      prev.includes(agentId) 
        ? prev.filter(id => id !== agentId)
        : [...prev, agentId]
    )
  }

  const handleSelectAll = () => {
    const approvedAgents = businessData
      .filter(item => item.status === 'approved' && item.approvalLevel >= 2)
      .map(item => item.agentId)
    
    if (selectedAgents.length === approvedAgents.length && approvedAgents.length > 0) {
      // If all are selected, deselect all
      setSelectedAgents([])
    } else {
      // Otherwise, select all approved
      setSelectedAgents(approvedAgents)
    }
  }

  const handleExportData = () => {
    const dataToExport = businessData.filter(item => selectedAgents.includes(item.agentId))
    if (dataToExport.length === 0) {
      alert('Please select agents to export')
      return
    }
    
    const csvContent = [
      'Agent ID,Agent Name,Policies Issued,Total Premium,Motor 64VB Policies,Motor 64VB Premium,Own Damage Premium,Third Party Premium,Status',
      ...dataToExport.map(item => [
        item.agentId,
        item.agentName,
        item.policiesIssued,
        item.totalPremium,
        item.motorPolicies64VB,
        item.motorPremium64VB,
        item.ownDamagePremium,
        item.thirdPartyPremium,
        item.status
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `business-data-${selectedMonth || 'all'}.csv`
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
        approvalLevel: 1,
        submittedBy: 'John Smith',
        submittedDate: '2024-01-15'
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
        status: 'approved',
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
        status: 'pending',
        approvalLevel: 1,
        submittedBy: 'Mike Wilson',
        submittedDate: '2024-01-16'
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
              Back to Invoice & Payout
            </button>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Data Approval</h1>
          <p className="text-gray-600 mt-2">
            Monthly business data approval with maker-checker concept
          </p>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Approval Level
                </label>
                <select
                  value={approvalLevel}
                  onChange={(e) => setApprovalLevel(Number(e.target.value))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={1}>Level 1 - Business Operations</option>
                  <option value={2}>Level 2 - Senior Management</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleSelectAll}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                {selectedAgents.length === businessData.filter(item => item.status === 'approved' && item.approvalLevel >= 2).length && businessData.filter(item => item.status === 'approved' && item.approvalLevel >= 2).length > 0 ? 'Deselect All' : 'Select All Approved'}
              </button>
              <button
                onClick={handleExportData}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Export Selected Data
              </button>
              <button
                onClick={handleSubmitToFinance}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Submit to Finance
              </button>
            </div>
          </div>
        </div>

        {/* Approval Process Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Approval Process</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <div className="flex items-start">
                <span className="mr-2">•</span>
                <span>Level 1: Business Operations Team - Initial data review and validation</span>
              </div>
              <div className="flex items-start">
                <span className="mr-2">•</span>
                <span>Level 2: Senior Management - Final approval before Finance Department</span>
              </div>
            </div>
            <div>
              <div className="flex items-start">
                <span className="mr-2">•</span>
                <span>All data must be verified for accuracy and completeness</span>
              </div>
              <div className="flex items-start">
                <span className="mr-2">•</span>
                <span>64VB verification status must be confirmed for Motor policies</span>
              </div>
            </div>
          </div>
        </div>

        {/* Business Data Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Monthly Business Data</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedAgents.length === businessData.filter(item => item.status === 'approved' && item.approvalLevel >= 2).length && businessData.filter(item => item.status === 'approved' && item.approvalLevel >= 2).length > 0}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </th>
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
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {businessData.map((data) => (
                  <tr key={data.agentId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {data.status === 'approved' && data.approvalLevel >= 2 && (
                        <input
                          type="checkbox"
                          checked={selectedAgents.includes(data.agentId)}
                          onChange={() => handleAgentSelection(data.agentId)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{data.agentName}</div>
                        <div className="text-sm text-gray-500">ID: {data.agentId}</div>
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
                        Level: {data.approvalLevel}/2
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {data.status === 'pending' && data.approvalLevel < 2 && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApprove(data.agentId)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(data.agentId)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {data.status === 'approved' && data.approvalLevel >= 2 && (
                        <span className="text-green-600">Ready for Finance</span>
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
            <div className="text-sm font-medium text-gray-500">Approved Records</div>
            <div className="text-2xl font-bold text-green-600">
              {businessData.filter(data => data.status === 'approved').length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="text-sm font-medium text-gray-500">Pending Approval</div>
            <div className="text-2xl font-bold text-yellow-600">
              {businessData.filter(data => data.status === 'pending').length}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
