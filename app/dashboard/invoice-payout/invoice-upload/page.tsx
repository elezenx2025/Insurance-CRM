'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon, CloudArrowUpIcon, DocumentIcon, PencilIcon, CheckCircleIcon, XMarkIcon, ClockIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

interface InvoiceData {
  id: string
  invoiceNumber: string
  type: 'agent-to-insurance' | 'agent-to-intermediary'
  fromAgent: string
  toCompany: string
  amount: number
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'sent'
  approvalLevel: number
  digitalSignature: boolean
  submittedDate: string
  approvedBy?: string
  approvedDate?: string
  sentDate?: string
}

export default function InvoiceUploadPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [invoices, setInvoices] = useState<InvoiceData[]>([])
  const [selectedType, setSelectedType] = useState<'agent-to-insurance' | 'agent-to-intermediary'>('agent-to-insurance')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [digitalSignature, setDigitalSignature] = useState(false)

  const handleBack = () => {
    router.push('/dashboard/invoice-payout')
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  const handleDigitalSignature = () => {
    setDigitalSignature(!digitalSignature)
  }

  const handleApprove = (invoiceId: string) => {
    setInvoices(prev => prev.map(invoice => 
      invoice.id === invoiceId 
        ? { 
            ...invoice, 
            status: 'approved', 
            approvalLevel: invoice.approvalLevel + 1,
            approvedBy: 'Current User',
            approvedDate: new Date().toISOString().split('T')[0]
          }
        : invoice
    ))
  }

  const handleReject = (invoiceId: string) => {
    setInvoices(prev => prev.map(invoice => 
      invoice.id === invoiceId 
        ? { 
            ...invoice, 
            status: 'rejected',
            approvedBy: 'Current User',
            approvedDate: new Date().toISOString().split('T')[0]
          }
        : invoice
    ))
  }

  const handleSendInvoice = (invoiceId: string) => {
    setInvoices(prev => prev.map(invoice => 
      invoice.id === invoiceId 
        ? { 
            ...invoice, 
            status: 'sent',
            sentDate: new Date().toISOString().split('T')[0]
          }
        : invoice
    ))
  }

  const handleCreateInvoice = () => {
    const newInvoice: InvoiceData = {
      id: `INV${Date.now()}`,
      invoiceNumber: `INV-${Date.now()}`,
      type: selectedType,
      fromAgent: 'Current Agent',
      toCompany: selectedType === 'agent-to-insurance' ? 'Insurance Company' : 'Insurance Intermediary',
      amount: Math.floor(Math.random() * 100000) + 50000,
      status: 'draft',
      approvalLevel: 0,
      digitalSignature: digitalSignature,
      submittedDate: new Date().toISOString().split('T')[0]
    }
    setInvoices(prev => [...prev, newInvoice])
    setShowUploadModal(false)
  }

  // Mock data
  useState(() => {
    const mockInvoices: InvoiceData[] = [
      {
        id: 'INV001',
        invoiceNumber: 'INV-2024-001',
        type: 'agent-to-insurance',
        fromAgent: 'John Smith',
        toCompany: 'ABC Insurance Co.',
        amount: 125000,
        status: 'pending',
        approvalLevel: 1,
        digitalSignature: true,
        submittedDate: '2024-01-15'
      },
      {
        id: 'INV002',
        invoiceNumber: 'INV-2024-002',
        type: 'agent-to-intermediary',
        fromAgent: 'Sarah Johnson',
        toCompany: 'XYZ Intermediary',
        amount: 85000,
        status: 'approved',
        approvalLevel: 2,
        digitalSignature: true,
        submittedDate: '2024-01-14',
        approvedBy: 'Manager A',
        approvedDate: '2024-01-16'
      },
      {
        id: 'INV003',
        invoiceNumber: 'INV-2024-003',
        type: 'agent-to-insurance',
        fromAgent: 'Mike Wilson',
        toCompany: 'DEF Insurance Co.',
        amount: 200000,
        status: 'sent',
        approvalLevel: 2,
        digitalSignature: true,
        submittedDate: '2024-01-13',
        approvedBy: 'Manager B',
        approvedDate: '2024-01-15',
        sentDate: '2024-01-17'
      }
    ]
    setInvoices(mockInvoices)
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'sent': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircleIcon className="h-4 w-4" />
      case 'rejected': return <XMarkIcon className="h-4 w-4" />
      case 'sent': return <CloudArrowUpIcon className="h-4 w-4" />
      case 'pending': return <ClockIcon className="h-4 w-4" />
      default: return <DocumentIcon className="h-4 w-4" />
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
          <h1 className="text-2xl font-bold text-gray-900">Invoice Upload</h1>
          <p className="text-gray-600 mt-2">
            Invoice management for agents and insurance intermediaries with digital signatures
          </p>
        </div>

        {/* Invoice Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Agent to Insurance Company</h3>
            <div className="space-y-2 text-sm text-blue-800">
              <div className="flex items-start">
                <span className="mr-2">•</span>
                <span>Invoices from agents to insurance companies</span>
              </div>
              <div className="flex items-start">
                <span className="mr-2">•</span>
                <span>Digital signature support for authentication</span>
              </div>
              <div className="flex items-start">
                <span className="mr-2">•</span>
                <span>Email or API integration for delivery</span>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-sm font-medium text-green-900 mb-2">Agent to Insurance Intermediary</h3>
            <div className="space-y-2 text-sm text-green-800">
              <div className="flex items-start">
                <span className="mr-2">•</span>
                <span>Invoices from agents to insurance intermediaries</span>
              </div>
              <div className="flex items-start">
                <span className="mr-2">•</span>
                <span>Maker-checker approval process</span>
              </div>
              <div className="flex items-start">
                <span className="mr-2">•</span>
                <span>Automated processing workflows</span>
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
                  Invoice Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as 'agent-to-insurance' | 'agent-to-intermediary')}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="agent-to-insurance">Agent to Insurance Company</option>
                  <option value="agent-to-intermediary">Agent to Insurance Intermediary</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Create New Invoice
              </button>
              <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
                Upload Template
              </button>
            </div>
          </div>
        </div>

        {/* Digital Signature Info */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <div className="flex items-start">
            <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 mr-3 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-yellow-900 mb-2">Digital Signature Requirements</h3>
              <div className="space-y-2 text-sm text-yellow-800">
                <div className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>All invoices must be digitally signed for authentication</span>
                </div>
                <div className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Digital signatures ensure invoice integrity and authenticity</span>
                </div>
                <div className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Signature verification is required before approval</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Invoice Management</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Digital Signature
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
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</div>
                        <div className="text-sm text-gray-500">From: {invoice.fromAgent}</div>
                        <div className="text-sm text-gray-500">To: {invoice.toCompany}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        invoice.type === 'agent-to-insurance' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {invoice.type === 'agent-to-insurance' ? 'Agent → Insurance' : 'Agent → Intermediary'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">₹{invoice.amount.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        invoice.digitalSignature 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {invoice.digitalSignature ? 'Signed' : 'Not Signed'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                        {getStatusIcon(invoice.status)}
                        <span className="ml-1">{invoice.status}</span>
                      </span>
                      <div className="text-xs text-gray-500 mt-1">
                        Level: {invoice.approvalLevel}/2
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {invoice.status === 'pending' && invoice.approvalLevel < 2 && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApprove(invoice.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(invoice.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {invoice.status === 'approved' && invoice.approvalLevel >= 2 && (
                        <button
                          onClick={() => handleSendInvoice(invoice.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Send Invoice
                        </button>
                      )}
                      {invoice.status === 'sent' && (
                        <span className="text-green-600">Sent</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Invoice</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Invoice Type
                    </label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value as 'agent-to-insurance' | 'agent-to-intermediary')}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="agent-to-insurance">Agent to Insurance Company</option>
                      <option value="agent-to-intermediary">Agent to Insurance Intermediary</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Upload Invoice File
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileUpload}
                      accept=".pdf,.doc,.docx"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="digitalSignature"
                      checked={digitalSignature}
                      onChange={handleDigitalSignature}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="digitalSignature" className="ml-2 block text-sm text-gray-900">
                      Add Digital Signature
                    </label>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateInvoice}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Create Invoice
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
