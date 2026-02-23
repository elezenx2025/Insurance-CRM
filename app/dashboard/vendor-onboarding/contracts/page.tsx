'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon, CalendarIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface Contract {
  id: string
  vendorName: string
  contractFor: string
  contractPeriodFrom: string
  contractPeriodTo: string
  status: string
  daysRemaining: number
  contactPerson: string
  email: string
  mobile: string
}

export default function ContractManagementPage() {
  const router = useRouter()
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  useEffect(() => {
    fetchContracts()
  }, [])

  const fetchContracts = async () => {
    try {
      // Calculate days remaining
      const calculateDaysRemaining = (endDate: string) => {
        const today = new Date()
        const end = new Date(endDate)
        const diffTime = end.getTime() - today.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays
      }

      const getContractStatus = (daysRemaining: number) => {
        if (daysRemaining < 0) return 'Expired'
        if (daysRemaining <= 30) return 'Expiring Soon'
        if (daysRemaining <= 90) return 'Active - Renewal Due'
        return 'Active'
      }

      // Mock data with dynamic dates
      const today = new Date()
      const currentYear = today.getFullYear()
      const currentMonth = today.getMonth()

      const mockContracts: Contract[] = [
        {
          id: '1',
          vendorName: 'TeleConnect Solutions Pvt Ltd',
          contractFor: 'Calling Solution',
          contractPeriodFrom: `${currentYear}-01-01`,
          contractPeriodTo: `${currentYear + 1}-12-31`,
          status: '',
          daysRemaining: 0,
          contactPerson: 'Rajesh Kumar',
          email: 'rajesh@teleconnect.com',
          mobile: '9876543210'
        },
        {
          id: '2',
          vendorName: 'SMS Gateway India',
          contractFor: 'SMS',
          contractPeriodFrom: `${currentYear}-03-01`,
          contractPeriodTo: `${currentYear + 1}-02-28`,
          status: '',
          daysRemaining: 0,
          contactPerson: 'Priya Sharma',
          email: 'priya@smsgateway.in',
          mobile: '9876543211'
        },
        {
          id: '3',
          vendorName: 'WhatsApp Business Solutions',
          contractFor: 'WhatsApp',
          contractPeriodFrom: `${currentYear}-02-15`,
          contractPeriodTo: `${currentYear + 1}-02-14`,
          status: '',
          daysRemaining: 0,
          contactPerson: 'Amit Patel',
          email: 'amit@whatsappbiz.com',
          mobile: '9876543212'
        },
        {
          id: '4',
          vendorName: 'MailChimp India Services',
          contractFor: 'Bulk Email',
          contractPeriodFrom: `${currentYear}-01-15`,
          contractPeriodTo: new Date(currentYear, currentMonth, today.getDate() + 25).toISOString().split('T')[0],
          status: '',
          daysRemaining: 0,
          contactPerson: 'Sneha Reddy',
          email: 'sneha@mailchimp.in',
          mobile: '9876543213'
        },
        {
          id: '5',
          vendorName: 'SecureNet Solutions',
          contractFor: 'Cyber Security',
          contractPeriodFrom: `${currentYear}-06-01`,
          contractPeriodTo: `${currentYear + 1}-05-31`,
          status: '',
          daysRemaining: 0,
          contactPerson: 'Vikram Singh',
          email: 'vikram@securenet.com',
          mobile: '9876543214'
        },
      ]

      // Calculate days remaining and status for each contract
      const processedContracts = mockContracts.map(contract => {
        const daysRemaining = calculateDaysRemaining(contract.contractPeriodTo)
        return {
          ...contract,
          daysRemaining,
          status: getContractStatus(daysRemaining)
        }
      })

      setContracts(processedContracts)
      setLoading(false)
    } catch (error) {
      toast.error('Failed to fetch contracts')
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800'
      case 'Active - Renewal Due':
        return 'bg-yellow-100 text-yellow-800'
      case 'Expiring Soon':
        return 'bg-orange-100 text-orange-800'
      case 'Expired':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />
      case 'Expiring Soon':
      case 'Active - Renewal Due':
        return <ExclamationTriangleIcon className="h-5 w-5 text-orange-600" />
      case 'Expired':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
      default:
        return null
    }
  }

  const filteredContracts = contracts.filter(contract => {
    if (filterStatus === 'ALL') return true
    return contract.status === filterStatus
  })

  const handleDownloadContract = (contract: Contract) => {
    try {
      // Create contract document content
      const contractContent = `
VENDOR CONTRACT AGREEMENT
===============================

Vendor Details:
--------------
Vendor Name: ${contract.vendorName}
Contact Person: ${contract.contactPerson}
Email: ${contract.email}
Mobile: ${contract.mobile}

Contract Information:
-------------------
Service Type: ${contract.contractFor}
Contract Start Date: ${new Date(contract.contractPeriodFrom).toLocaleDateString('en-IN')}
Contract End Date: ${new Date(contract.contractPeriodTo).toLocaleDateString('en-IN')}
Contract Status: ${contract.status}
Days Remaining: ${contract.daysRemaining} days

This is an auto-generated contract summary document.
Generated on: ${new Date().toLocaleString('en-IN')}

===============================
Insurance CRM - Vendor Management System
      `

      // Create blob and download
      const blob = new Blob([contractContent], { type: 'text/plain' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `Contract_${contract.vendorName.replace(/\s+/g, '_')}_${contract.contractFor}.txt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      toast.success('Contract downloaded successfully!')
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Failed to download contract')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/dashboard/vendor-onboarding')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Vendor Onboarding
          </button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Contract Management</h1>
          <p className="text-gray-600 mt-2">
            Monitor and manage vendor contracts and renewals
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Contracts</p>
                <p className="text-2xl font-bold text-gray-900">{contracts.length}</p>
              </div>
              <CalendarIcon className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {contracts.filter(c => c.status === 'Active' || c.status === 'Active - Renewal Due').length}
                </p>
              </div>
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Expiring Soon</p>
                <p className="text-2xl font-bold text-orange-600">
                  {contracts.filter(c => c.status === 'Expiring Soon').length}
                </p>
              </div>
              <ExclamationTriangleIcon className="h-8 w-8 text-orange-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Expired</p>
                <p className="text-2xl font-bold text-red-600">
                  {contracts.filter(c => c.status === 'Expired').length}
                </p>
              </div>
              <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Contracts</option>
              <option value="Active">Active</option>
              <option value="Active - Renewal Due">Renewal Due</option>
              <option value="Expiring Soon">Expiring Soon</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
        </div>

        {/* Contracts Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendor Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contract Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Days Remaining
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
                {filteredContracts.map((contract) => (
                  <tr key={contract.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{contract.vendorName}</div>
                      <div className="text-sm text-gray-500">{contract.contactPerson}</div>
                      <div className="text-sm text-gray-500">{contract.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {contract.contractFor}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>{new Date(contract.contractPeriodFrom).toLocaleDateString('en-IN')}</div>
                      <div className="text-gray-500">to {new Date(contract.contractPeriodTo).toLocaleDateString('en-IN')}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(contract.status)}
                        <span className={`ml-2 text-sm font-medium ${
                          contract.daysRemaining < 0 ? 'text-red-600' :
                          contract.daysRemaining <= 30 ? 'text-orange-600' :
                          contract.daysRemaining <= 90 ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>
                          {contract.daysRemaining < 0 
                            ? `Expired ${Math.abs(contract.daysRemaining)} days ago`
                            : `${contract.daysRemaining} days`
                          }
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(contract.status)}`}>
                        {contract.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => {
                            setSelectedContract(contract)
                            setShowDetailsModal(true)
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </button>
                        <button
                        onClick={() => toast('Renew contract functionality coming soon')}
                          className="text-green-600 hover:text-green-900"
                        >
                          Renew
                        </button>
                        <button
                          onClick={() => handleDownloadContract(contract)}
                          className="text-purple-600 hover:text-purple-900"
                        >
                          Download
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Contract Details Modal */}
        {showDetailsModal && selectedContract && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
            <div className="relative mx-auto p-8 border w-full max-w-3xl shadow-lg rounded-lg bg-white">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Contract Details</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Vendor Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-blue-500">
                    Vendor Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Vendor Name</label>
                      <p className="text-base text-gray-900">{selectedContract.vendorName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Service Type</label>
                      <p className="text-base text-gray-900">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {selectedContract.contractFor}
                        </span>
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Contact Person</label>
                      <p className="text-base text-gray-900">{selectedContract.contactPerson}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-base text-gray-900">{selectedContract.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Mobile</label>
                      <p className="text-base text-gray-900">{selectedContract.mobile}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <p className="text-base">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedContract.status)}`}>
                          {selectedContract.status}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contract Period */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-green-500">
                    Contract Period
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Start Date</label>
                      <p className="text-base text-gray-900">
                        {new Date(selectedContract.contractPeriodFrom).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">End Date</label>
                      <p className="text-base text-gray-900">
                        {new Date(selectedContract.contractPeriodTo).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Days Remaining</label>
                      <p className={`text-base font-semibold ${
                        selectedContract.daysRemaining < 0 ? 'text-red-600' :
                        selectedContract.daysRemaining <= 30 ? 'text-orange-600' :
                        selectedContract.daysRemaining <= 90 ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {selectedContract.daysRemaining < 0 
                          ? `Expired ${Math.abs(selectedContract.daysRemaining)} days ago`
                          : `${selectedContract.daysRemaining} days`
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contract Timeline */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-purple-500">
                    Contract Timeline
                  </h3>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">
                        {new Date(selectedContract.contractPeriodFrom).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <span className="text-sm font-medium text-gray-900">Today</span>
                      <span className="text-sm text-gray-600">
                        {new Date(selectedContract.contractPeriodTo).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className={`h-4 rounded-full ${
                          selectedContract.daysRemaining < 0 ? 'bg-red-500' :
                          selectedContract.daysRemaining <= 30 ? 'bg-orange-500' :
                          selectedContract.daysRemaining <= 90 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ 
                          width: `${Math.min(100, Math.max(0, 
                            ((new Date().getTime() - new Date(selectedContract.contractPeriodFrom).getTime()) / 
                            (new Date(selectedContract.contractPeriodTo).getTime() - new Date(selectedContract.contractPeriodFrom).getTime())) * 100
                          ))}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex justify-end space-x-3">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                onClick={() => toast('Renew contract functionality coming soon')}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Renew Contract
                </button>
                <button
                  onClick={() => {
                    handleDownloadContract(selectedContract)
                    setShowDetailsModal(false)
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

