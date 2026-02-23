'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon, CurrencyDollarIcon, EnvelopeIcon, CheckCircleIcon, XMarkIcon, ClockIcon, ExclamationTriangleIcon, DocumentIcon } from '@heroicons/react/24/outline'

interface SettlementData {
  id: string
  invoiceNumber: string
  companyName: string
  amount: number
  status: 'pending' | 'sent' | 'acknowledged' | 'settled' | 'disputed'
  method: 'email' | 'api'
  sentDate: string
  acknowledgedDate?: string
  settledDate?: string
  disputeReason?: string
  settlementAmount?: number
}

export default function InvoiceSettlementPage() {
  const router = useRouter()
  const [settlements, setSettlements] = useState<SettlementData[]>([])
  const [selectedMethod, setSelectedMethod] = useState<'email' | 'api'>('email')
  const [showSettlementModal, setShowSettlementModal] = useState(false)
  const [selectedSettlement, setSelectedSettlement] = useState<SettlementData | null>(null)

  const handleBack = () => {
    router.push('/dashboard/invoice-payout')
  }

  const handleSendSettlement = (settlementId: string) => {
    setSettlements(prev => prev.map(settlement => 
      settlement.id === settlementId 
        ? { 
            ...settlement, 
            status: 'sent',
            sentDate: new Date().toISOString().split('T')[0]
          }
        : settlement
    ))
  }

  const handleAcknowledgeSettlement = (settlementId: string) => {
    setSettlements(prev => prev.map(settlement => 
      settlement.id === settlementId 
        ? { 
            ...settlement, 
            status: 'acknowledged',
            acknowledgedDate: new Date().toISOString().split('T')[0]
          }
        : settlement
    ))
  }

  const handleSettleInvoice = (settlementId: string, settlementAmount: number) => {
    setSettlements(prev => prev.map(settlement => 
      settlement.id === settlementId 
        ? { 
            ...settlement, 
            status: 'settled',
            settledDate: new Date().toISOString().split('T')[0],
            settlementAmount: settlementAmount
          }
        : settlement
    ))
  }

  const handleDisputeSettlement = (settlementId: string, reason: string) => {
    setSettlements(prev => prev.map(settlement => 
      settlement.id === settlementId 
        ? { 
            ...settlement, 
            status: 'disputed',
            disputeReason: reason
          }
        : settlement
    ))
  }

  const handleCreateSettlement = () => {
    const newSettlement: SettlementData = {
      id: `SET${Date.now()}`,
      invoiceNumber: `INV-${Date.now()}`,
      companyName: 'Insurance Company',
      amount: Math.floor(Math.random() * 200000) + 50000,
      status: 'pending',
      method: selectedMethod,
      sentDate: new Date().toISOString().split('T')[0]
    }
    setSettlements(prev => [...prev, newSettlement])
    setShowSettlementModal(false)
  }

  const handleExportData = () => {
    const csvContent = [
      'Settlement ID,Invoice Number,Company,Amount,Status,Method,Sent Date,Processed Date',
      ...settlements.map(settlement => [
        settlement.id,
        settlement.invoiceNumber,
        settlement.companyName,
        settlement.amount,
        settlement.status,
        settlement.method,
        settlement.sentDate,
        (settlement as any).processedDate || ''
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `settlements-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleSendEmail = (settlementId: string) => {
    const settlement = settlements.find(s => s.id === settlementId)
    if (settlement) {
      // Simulate email sending
      alert(`Email sent to ${settlement.companyName} for settlement ${settlement.invoiceNumber}`)
      // In real implementation, this would integrate with email service
    }
  }

  // Mock data
  useEffect(() => {
    const mockSettlements: SettlementData[] = [
      {
        id: 'SET001',
        invoiceNumber: 'INV-2024-001',
        companyName: 'ABC Insurance Co.',
        amount: 125000,
        status: 'sent',
        method: 'email',
        sentDate: '2024-01-15',
        acknowledgedDate: '2024-01-16'
      },
      {
        id: 'SET002',
        invoiceNumber: 'INV-2024-002',
        companyName: 'XYZ Insurance Co.',
        amount: 85000,
        status: 'settled',
        method: 'api',
        sentDate: '2024-01-14',
        acknowledgedDate: '2024-01-15',
        settledDate: '2024-01-17',
        settlementAmount: 85000
      },
      {
        id: 'SET003',
        invoiceNumber: 'INV-2024-003',
        companyName: 'DEF Insurance Co.',
        amount: 200000,
        status: 'disputed',
        method: 'email',
        sentDate: '2024-01-13',
        disputeReason: 'Amount discrepancy in premium calculation'
      }
    ]
    setSettlements(mockSettlements)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'settled': return 'bg-green-100 text-green-800'
      case 'disputed': return 'bg-red-100 text-red-800'
      case 'acknowledged': return 'bg-blue-100 text-blue-800'
      case 'sent': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'settled': return <CheckCircleIcon className="h-4 w-4" />
      case 'disputed': return <XMarkIcon className="h-4 w-4" />
      case 'acknowledged': return <DocumentIcon className="h-4 w-4" />
      case 'sent': return <EnvelopeIcon className="h-4 w-4" />
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
          <h1 className="text-2xl font-bold text-gray-900">Invoice Settlement</h1>
          <p className="text-gray-600 mt-2">
            Invoice settlement with insurance companies via email or API integration
          </p>
        </div>

        {/* Settlement Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Email Integration</h3>
            <div className="space-y-2 text-sm text-blue-800">
              <div className="flex items-start">
                <span className="mr-2">•</span>
                <span>Automated email sending to insurance companies</span>
              </div>
              <div className="flex items-start">
                <span className="mr-2">•</span>
                <span>Email reply integration for status updates</span>
              </div>
              <div className="flex items-start">
                <span className="mr-2">•</span>
                <span>Automatic data integration from email responses</span>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-sm font-medium text-green-900 mb-2">API Integration</h3>
            <div className="space-y-2 text-sm text-green-800">
              <div className="flex items-start">
                <span className="mr-2">•</span>
                <span>Direct API communication with insurance companies</span>
              </div>
              <div className="flex items-start">
                <span className="mr-2">•</span>
                <span>Real-time status updates and acknowledgments</span>
              </div>
              <div className="flex items-start">
                <span className="mr-2">•</span>
                <span>Automated settlement processing</span>
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
                  Settlement Method
                </label>
                <select
                  value={selectedMethod}
                  onChange={(e) => setSelectedMethod(e.target.value as 'email' | 'api')}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="email">Email Integration</option>
                  <option value="api">API Integration</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowSettlementModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Create Settlement
              </button>
              <button
                onClick={handleExportData}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Export Data
              </button>
            </div>
          </div>
        </div>

        {/* Automation Info */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <div className="flex items-start">
            <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 mr-3 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-yellow-900 mb-2">Automation Features</h3>
              <div className="space-y-2 text-sm text-yellow-800">
                <div className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Email replies are automatically integrated with application data</span>
                </div>
                <div className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>API responses provide real-time status updates</span>
                </div>
                <div className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Dispute handling and resolution tracking</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Settlements Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Settlement Management</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
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
                {settlements.map((settlement) => (
                  <tr key={settlement.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{settlement.invoiceNumber}</div>
                        <div className="text-sm text-gray-500">Sent: {settlement.sentDate}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{settlement.companyName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">₹{settlement.amount.toLocaleString()}</div>
                      {settlement.settlementAmount && (
                        <div className="text-sm text-green-600">
                          Settled: ₹{settlement.settlementAmount.toLocaleString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        settlement.method === 'email' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {settlement.method === 'email' ? 'Email' : 'API'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(settlement.status)}`}>
                        {getStatusIcon(settlement.status)}
                        <span className="ml-1">{settlement.status}</span>
                      </span>
                      {settlement.disputeReason && (
                        <div className="text-xs text-red-600 mt-1">
                          {settlement.disputeReason}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {settlement.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleSendSettlement(settlement.id)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Send Settlement
                          </button>
                          <button
                            onClick={() => handleSendEmail(settlement.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Send Email
                          </button>
                        </div>
                      )}
                      {settlement.status === 'sent' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleAcknowledgeSettlement(settlement.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Acknowledge
                          </button>
                          <button
                            onClick={() => setSelectedSettlement(settlement)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Settle
                          </button>
                        </div>
                      )}
                      {settlement.status === 'acknowledged' && (
                        <button
                          onClick={() => setSelectedSettlement(settlement)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Complete Settlement
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Settlement Modal */}
        {showSettlementModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Create Settlement</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Settlement Method
                    </label>
                    <select
                      value={selectedMethod}
                      onChange={(e) => setSelectedMethod(e.target.value as 'email' | 'api')}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="email">Email Integration</option>
                      <option value="api">API Integration</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowSettlementModal(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateSettlement}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Create Settlement
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settlement Details Modal */}
        {selectedSettlement && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Settlement Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Settlement Amount
                    </label>
                    <input
                      type="number"
                      placeholder="Enter settlement amount"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dispute Reason (if applicable)
                    </label>
                    <textarea
                      placeholder="Enter dispute reason"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setSelectedSettlement(null)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      const amount = 150000 // Mock amount
                      handleSettleInvoice(selectedSettlement.id, amount)
                      setSelectedSettlement(null)
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Complete Settlement
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
