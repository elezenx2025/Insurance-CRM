'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon, BuildingLibraryIcon, CreditCardIcon, CheckCircleIcon, XMarkIcon, ClockIcon, ExclamationTriangleIcon, DocumentTextIcon, ArrowPathIcon } from '@heroicons/react/24/outline'

interface BankTransaction {
  id: string
  agentId: string
  agentName: string
  bankAccount: string
  amount: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  transactionId?: string
  submittedDate: string
  processedDate?: string
  failureReason?: string
  bankResponse?: string
}

interface BankAccount {
  agentId: string
  agentName: string
  accountNumber: string
  bankName: string
  ifscCode: string
  accountType: 'savings' | 'current'
  isVerified: boolean
  lastVerified: string
}

export default function BankIntegrationPage() {
  const router = useRouter()
  const [transactions, setTransactions] = useState<BankTransaction[]>([])
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([])
  const [selectedBank, setSelectedBank] = useState('all')
  const [showVerificationModal, setShowVerificationModal] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null)

  const handleBack = () => {
    router.push('/dashboard/invoice-payout')
  }

  const handleProcessTransaction = (transactionId: string) => {
    setTransactions(prev => prev.map(transaction => 
      transaction.id === transactionId 
        ? { 
            ...transaction, 
            status: 'processing',
            transactionId: `TXN${Date.now()}`
          }
        : transaction
    ))

    // Simulate bank processing
    setTimeout(() => {
      setTransactions(prev => prev.map(transaction => 
        transaction.id === transactionId 
          ? { 
              ...transaction, 
              status: 'completed',
              processedDate: new Date().toISOString().split('T')[0],
              bankResponse: 'Transaction successful'
            }
          : transaction
      ))
    }, 3000)
  }

  const handleVerifyAccount = (accountId: string) => {
    setBankAccounts(prev => prev.map(account => 
      account.agentId === accountId 
        ? { 
            ...account, 
            isVerified: true,
            lastVerified: new Date().toISOString().split('T')[0]
          }
        : account
    ))
    setShowVerificationModal(false)
    setSelectedAccount(null)
  }

  const handleOpenVerificationModal = (account: BankAccount) => {
    setSelectedAccount(account)
    setShowVerificationModal(true)
  }

  const handleBulkProcess = () => {
    const pendingTransactions = transactions.filter(t => t.status === 'pending')
    pendingTransactions.forEach(transaction => {
      handleProcessTransaction(transaction.id)
    })
  }

  // Mock data
  useEffect(() => {
    const mockTransactions: BankTransaction[] = [
      {
        id: 'TXN001',
        agentId: 'AGT001',
        agentName: 'John Smith',
        bankAccount: '****1234',
        amount: 125000,
        status: 'pending',
        submittedDate: '2024-01-15'
      },
      {
        id: 'TXN002',
        agentId: 'AGT002',
        agentName: 'Sarah Johnson',
        bankAccount: '****5678',
        amount: 85000,
        status: 'processing',
        transactionId: 'TXN20240116001',
        submittedDate: '2024-01-14'
      },
      {
        id: 'TXN003',
        agentId: 'AGT003',
        agentName: 'Mike Wilson',
        bankAccount: '****9012',
        amount: 200000,
        status: 'completed',
        transactionId: 'TXN20240115001',
        submittedDate: '2024-01-13',
        processedDate: '2024-01-17',
        bankResponse: 'Transaction successful'
      },
      {
        id: 'TXN004',
        agentId: 'AGT004',
        agentName: 'Lisa Brown',
        bankAccount: '****3456',
        amount: 150000,
        status: 'failed',
        submittedDate: '2024-01-12',
        failureReason: 'Insufficient funds',
        bankResponse: 'Transaction failed - insufficient funds'
      }
    ]

    const mockBankAccounts: BankAccount[] = [
      {
        agentId: 'AGT001',
        agentName: 'John Smith',
        accountNumber: '1234567890',
        bankName: 'HDFC Bank',
        ifscCode: 'HDFC0001234',
        accountType: 'savings',
        isVerified: true,
        lastVerified: '2024-01-10'
      },
      {
        agentId: 'AGT002',
        agentName: 'Sarah Johnson',
        accountNumber: '2345678901',
        bankName: 'ICICI Bank',
        ifscCode: 'ICIC0002345',
        accountType: 'current',
        isVerified: false,
        lastVerified: '2024-01-05'
      },
      {
        agentId: 'AGT003',
        agentName: 'Mike Wilson',
        accountNumber: '3456789012',
        bankName: 'SBI Bank',
        ifscCode: 'SBIN0003456',
        accountType: 'savings',
        isVerified: true,
        lastVerified: '2024-01-12'
      },
      {
        agentId: 'AGT004',
        agentName: 'Lisa Brown',
        accountNumber: '4567890123',
        bankName: 'Axis Bank',
        ifscCode: 'AXIS0004567',
        accountType: 'savings',
        isVerified: false,
        lastVerified: '2024-01-08'
      }
    ]

    setTransactions(mockTransactions)
    setBankAccounts(mockBankAccounts)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      default: return 'bg-yellow-100 text-yellow-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon className="h-4 w-4" />
      case 'failed': return <XMarkIcon className="h-4 w-4" />
      case 'processing': return <ArrowPathIcon className="h-4 w-4" />
      default: return <ClockIcon className="h-4 w-4" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed'
      case 'failed': return 'Failed'
      case 'processing': return 'Processing'
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
          <h1 className="text-2xl font-bold text-gray-900">Bank Integration</h1>
          <p className="text-gray-600 mt-2">
            Automated bank payment distribution system with API integration
          </p>
        </div>

        {/* Bank Integration Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Bank Integration Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <div className="flex items-start">
                <span className="mr-2">•</span>
                <span>Automated payment distribution to agent bank accounts</span>
              </div>
              <div className="flex items-start">
                <span className="mr-2">•</span>
                <span>Bank API integration for real-time transaction processing</span>
              </div>
            </div>
            <div>
              <div className="flex items-start">
                <span className="mr-2">•</span>
                <span>Account verification and validation</span>
              </div>
              <div className="flex items-start">
                <span className="mr-2">•</span>
                <span>Transaction tracking and status monitoring</span>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="text-sm font-medium text-gray-500">Total Transactions</div>
            <div className="text-2xl font-bold text-gray-900">{transactions.length}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="text-sm font-medium text-gray-500">Total Amount</div>
            <div className="text-2xl font-bold text-gray-900">
              ₹{transactions.reduce((sum, transaction) => sum + transaction.amount, 0).toLocaleString()}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="text-sm font-medium text-gray-500">Completed</div>
            <div className="text-2xl font-bold text-green-600">
              {transactions.filter(t => t.status === 'completed').length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="text-sm font-medium text-gray-500">Pending</div>
            <div className="text-2xl font-bold text-yellow-600">
              {transactions.filter(t => t.status === 'pending').length}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Status
                </label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Transactions</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleBulkProcess}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Process All Pending
              </button>
              <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
                Export Data
              </button>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Bank Transactions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Agent Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bank Account
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{transaction.agentName}</div>
                        <div className="text-sm text-gray-500">ID: {transaction.agentId}</div>
                        <div className="text-sm text-gray-500">Submitted: {transaction.submittedDate}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{transaction.bankAccount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">₹{transaction.amount.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                        {getStatusIcon(transaction.status)}
                        <span className="ml-1">{getStatusText(transaction.status)}</span>
                      </span>
                      {transaction.failureReason && (
                        <div className="text-xs text-red-600 mt-1">
                          {transaction.failureReason}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{transaction.transactionId || 'N/A'}</div>
                      {transaction.processedDate && (
                        <div className="text-xs text-gray-500">
                          Processed: {transaction.processedDate}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {transaction.status === 'pending' && (
                        <button
                          onClick={() => handleProcessTransaction(transaction.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Process
                        </button>
                      )}
                      {transaction.status === 'processing' && (
                        <span className="text-blue-600">Processing...</span>
                      )}
                      {transaction.status === 'completed' && (
                        <span className="text-green-600">Completed</span>
                      )}
                      {transaction.status === 'failed' && (
                        <button
                          onClick={() => handleProcessTransaction(transaction.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Retry
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bank Accounts Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Bank Account Verification</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Agent Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bank Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Account Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Verification Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bankAccounts.map((account) => (
                  <tr key={account.agentId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{account.agentName}</div>
                        <div className="text-sm text-gray-500">ID: {account.agentId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">{account.bankName}</div>
                        <div className="text-sm text-gray-500">Account: {account.accountNumber}</div>
                        <div className="text-sm text-gray-500">IFSC: {account.ifscCode}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        account.accountType === 'savings' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {account.accountType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        account.isVerified 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {account.isVerified ? 'Verified' : 'Not Verified'}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">
                        Last verified: {account.lastVerified}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {!account.isVerified && (
                        <button
                          onClick={() => handleOpenVerificationModal(account)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Verify
                        </button>
                      )}
                      {account.isVerified && (
                        <span className="text-green-600">Verified</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Verification Modal */}
        {showVerificationModal && selectedAccount && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Verify Bank Account</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Agent Name
                    </label>
                    <div className="text-sm text-gray-900">{selectedAccount.agentName}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bank Name
                    </label>
                    <div className="text-sm text-gray-900">{selectedAccount.bankName}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account Number
                    </label>
                    <div className="text-sm text-gray-900">{selectedAccount.accountNumber}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      IFSC Code
                    </label>
                    <div className="text-sm text-gray-900">{selectedAccount.ifscCode}</div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                      <div className="text-sm text-yellow-800">
                        <p className="font-medium">Verification Process</p>
                        <p>This will verify the bank account details with the bank's API to ensure accuracy and validity.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => {
                      setShowVerificationModal(false)
                      setSelectedAccount(null)
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleVerifyAccount(selectedAccount.agentId)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Verify Account
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






