'use client'

import { useState } from 'react'
import { 
  DocumentIcon, 
  PlusIcon, 
  EyeIcon, 
  TrashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface Document {
  id: string
  name: string
  type: 'policy' | 'kyc' | 'claim'
  category: string
  status: 'required' | 'uploaded' | 'pending' | 'approved'
  uploadedAt?: string
  uploadedBy?: string
  fileSize?: string
  description?: string
}

interface ContextualDocumentManagerProps {
  processType: 'new-policy' | 'renewal' | 'rollover' | 'self-renewal' | 'claim-intimation' | 'surveyor-assessment' | 'supplementary-claim' | 'settlement' | 'nilEndorsement' | 'nonNilEndorsement' | 'policyCancellation' | '64vbVerification' | 'insuranceApproval'
  policyId?: string
  claimId?: string
  customerId?: string
}

export function ContextualDocumentManager({ 
  processType, 
  policyId, 
  claimId, 
  customerId 
}: ContextualDocumentManagerProps) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  // Define document requirements based on process type
  const getDocumentRequirements = () => {
    const requirements: { [key: string]: Document[] } = {
      'new-policy': [
        { id: 'kyc-1', name: 'Identity Proof', type: 'kyc', category: 'Identity Documents', status: 'required', description: 'Aadhaar Card, PAN Card, or Passport' },
        { id: 'kyc-2', name: 'Address Proof', type: 'kyc', category: 'Address Documents', status: 'required', description: 'Utility bill, Bank statement, or Rental agreement' },
        { id: 'kyc-3', name: 'Income Proof', type: 'kyc', category: 'Financial Documents', status: 'required', description: 'Salary certificate, Bank statements, or ITR' },
        { id: 'kyc-4', name: 'Medical Certificate', type: 'kyc', category: 'Medical Documents', status: 'required', description: 'Medical examination report if applicable' }
      ],
      'renewal': [
        { id: 'policy-1', name: 'Previous Policy Document', type: 'policy', category: 'Policy Documents', status: 'required', description: 'Copy of the previous policy document' },
        { id: 'kyc-1', name: 'Updated KYC Documents', type: 'kyc', category: 'KYC Documents', status: 'required', description: 'Updated identity and address proof if changed' },
        { id: 'policy-2', name: 'Renewal Application', type: 'policy', category: 'Application Documents', status: 'required', description: 'Signed renewal application form' }
      ],
      'rollover': [
        { id: 'policy-1', name: 'Current Policy Document', type: 'policy', category: 'Policy Documents', status: 'required', description: 'Current policy document to be rolled over' },
        { id: 'kyc-1', name: 'Updated KYC Documents', type: 'kyc', category: 'KYC Documents', status: 'required', description: 'Updated KYC documents for rollover' },
        { id: 'policy-2', name: 'Rollover Application', type: 'policy', category: 'Application Documents', status: 'required', description: 'Rollover application form' }
      ],
      'self-renewal': [
        { id: 'policy-1', name: 'Policy Document', type: 'policy', category: 'Policy Documents', status: 'required', description: 'Current policy document for self-renewal' },
        { id: 'kyc-1', name: 'KYC Verification', type: 'kyc', category: 'KYC Documents', status: 'required', description: 'KYC documents for verification' }
      ],
      'claim-intimation': [
        { id: 'claim-1', name: 'Claim Intimation Form', type: 'claim', category: 'Claim Forms', status: 'required', description: 'Completed claim intimation form' },
        { id: 'kyc-1', name: 'Policyholder KYC', type: 'kyc', category: 'KYC Documents', status: 'required', description: 'Policyholder identity and address proof' },
        { id: 'claim-2', name: 'Incident Report', type: 'claim', category: 'Incident Documents', status: 'required', description: 'Police report or incident report' }
      ],
      'surveyor-assessment': [
        { id: 'claim-1', name: 'Surveyor Report', type: 'claim', category: 'Assessment Documents', status: 'required', description: 'Surveyor assessment report' },
        { id: 'claim-2', name: 'Damage Photographs', type: 'claim', category: 'Evidence Documents', status: 'required', description: 'Photographs of damage/incident' },
        { id: 'kyc-1', name: 'Verification Documents', type: 'kyc', category: 'Verification Documents', status: 'required', description: 'Additional verification documents' }
      ],
      'supplementary-claim': [
        { id: 'claim-1', name: 'Supplementary Claim Form', type: 'claim', category: 'Claim Forms', status: 'required', description: 'Supplementary claim application' },
        { id: 'claim-2', name: 'Additional Evidence', type: 'claim', category: 'Evidence Documents', status: 'required', description: 'Additional supporting documents' },
        { id: 'kyc-1', name: 'Updated KYC', type: 'kyc', category: 'KYC Documents', status: 'required', description: 'Updated KYC if required' }
      ],
      'settlement': [
        { id: 'claim-1', name: 'Settlement Agreement', type: 'claim', category: 'Settlement Documents', status: 'required', description: 'Settlement agreement document' },
        { id: 'claim-2', name: 'Payment Authorization', type: 'claim', category: 'Payment Documents', status: 'required', description: 'Payment authorization form' },
        { id: 'kyc-1', name: 'Final KYC Verification', type: 'kyc', category: 'Verification Documents', status: 'required', description: 'Final KYC verification documents' }
      ],
      'nilEndorsement': [
        { id: 'endorsement-1', name: 'Endorsement Application', type: 'policy', category: 'Endorsement Documents', status: 'required', description: 'NIL endorsement application form' },
        { id: 'policy-1', name: 'Policy Document', type: 'policy', category: 'Policy Documents', status: 'required', description: 'Current policy document' },
        { id: 'kyc-1', name: 'Correction Documents', type: 'kyc', category: 'Correction Documents', status: 'required', description: 'Documents supporting the correction' }
      ],
      'nonNilEndorsement': [
        { id: 'endorsement-1', name: 'Endorsement Application', type: 'policy', category: 'Endorsement Documents', status: 'required', description: 'Non-NIL endorsement application form' },
        { id: 'policy-1', name: 'Policy Document', type: 'policy', category: 'Policy Documents', status: 'required', description: 'Current policy document' },
        { id: 'kyc-1', name: 'Updated KYC Documents', type: 'kyc', category: 'KYC Documents', status: 'required', description: 'Updated KYC documents if required' },
        { id: 'payment-1', name: 'Premium Payment Proof', type: 'policy', category: 'Payment Documents', status: 'required', description: 'Proof of additional premium payment' }
      ],
      'policyCancellation': [
        { id: 'cancellation-1', name: 'Cancellation Application', type: 'policy', category: 'Cancellation Documents', status: 'required', description: 'Policy cancellation application form' },
        { id: 'policy-1', name: 'Policy Document', type: 'policy', category: 'Policy Documents', status: 'required', description: 'Current policy document' },
        { id: 'kyc-1', name: 'Policyholder KYC', type: 'kyc', category: 'KYC Documents', status: 'required', description: 'Policyholder identity and address proof' },
        { id: 'bank-1', name: 'Bank Details', type: 'kyc', category: 'Bank Documents', status: 'required', description: 'Bank account details for refund' }
      ],
      '64vbVerification': [
        { id: 'verification-1', name: '64VB Verification Form', type: 'policy', category: 'Verification Documents', status: 'required', description: '64VB verification application form' },
        { id: 'policy-1', name: 'Policy Document', type: 'policy', category: 'Policy Documents', status: 'required', description: 'Current policy document' },
        { id: 'payment-1', name: 'Payment Reconciliation Proof', type: 'policy', category: 'Payment Documents', status: 'required', description: 'Proof of payment reconciliation' },
        { id: 'kyc-1', name: 'Verification KYC', type: 'kyc', category: 'KYC Documents', status: 'required', description: 'KYC documents for verification' }
      ],
      'insuranceApproval': [
        { id: 'approval-1', name: 'Approval Application', type: 'claim', category: 'Approval Documents', status: 'required', description: 'Insurance company approval application' },
        { id: 'claim-1', name: 'Claim Documents', type: 'claim', category: 'Claim Documents', status: 'required', description: 'Supporting claim documents' },
        { id: 'assessment-1', name: 'Assessment Report', type: 'claim', category: 'Assessment Documents', status: 'required', description: 'Surveyor assessment report' }
      ]
    }

    return requirements[processType] || []
  }

  const documentRequirements = getDocumentRequirements()

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'required':
        return <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />
      case 'uploaded':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'pending':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
      case 'approved':
        return <CheckCircleIcon className="h-5 w-5 text-blue-500" />
      default:
        return <ExclamationTriangleIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'required':
        return 'bg-orange-50 text-orange-700 border-orange-200'
      case 'uploaded':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'approved':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const handleUpload = (category: string) => {
    setSelectedCategory(category)
    setShowUploadModal(true)
  }

  const handleFileUpload = (file: File) => {
    // Mock file upload logic
    const newDocument: Document = {
      id: `doc-${Date.now()}`,
      name: file.name,
      type: documentRequirements.find(d => d.category === selectedCategory)?.type || 'kyc',
      category: selectedCategory,
      status: 'uploaded',
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'Current User',
      fileSize: `${(file.size / 1024).toFixed(1)} KB`,
      description: documentRequirements.find(d => d.category === selectedCategory)?.description || ''
    }

    setDocuments(prev => [...prev, newDocument])
    setShowUploadModal(false)
  }

  const handleDeleteDocument = (documentId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== documentId))
  }

  const getProcessTitle = () => {
    const titles: { [key: string]: string } = {
      'new-policy': 'New Policy Documents',
      'renewal': 'Policy Renewal Documents',
      'rollover': 'Policy Rollover Documents',
      'self-renewal': 'Self-Renewal Documents',
      'claim-intimation': 'Claim Intimation Documents',
      'surveyor-assessment': 'Surveyor Assessment Documents',
      'supplementary-claim': 'Supplementary Claim Documents',
      'settlement': 'Settlement Documents',
      'nilEndorsement': 'NIL Endorsement Documents',
      'nonNilEndorsement': 'Non-NIL Endorsement Documents',
      'policyCancellation': 'Policy Cancellation Documents',
      '64vbVerification': '64VB Verification Documents',
      'insuranceApproval': 'Insurance Approval Documents'
    }
    return titles[processType] || 'Document Management'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{getProcessTitle()}</h2>
            <p className="text-sm text-gray-600 mt-1">
              Upload and manage documents required for {processType.replace('-', ' ')} process
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500">
              Process: <span className="font-medium">{processType.replace('-', ' ').toUpperCase()}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Document Requirements */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-base font-semibold text-gray-900">Required Documents</h3>
          <p className="text-sm text-gray-600 mt-1">
            The following documents are required for this process
          </p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {documentRequirements.map((requirement) => (
              <div key={requirement.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(requirement.status)}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{requirement.name}</h4>
                    <p className="text-xs text-gray-600">{requirement.description}</p>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                      {requirement.category}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(requirement.status)}`}>
                    {requirement.status.toUpperCase()}
                  </span>
                  <button
                    onClick={() => handleUpload(requirement.category)}
                    className="inline-flex items-center px-3 py-1 border border-blue-300 rounded-md text-xs font-medium text-blue-700 bg-white hover:bg-blue-50"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Upload
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Uploaded Documents */}
      {documents.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-base font-semibold text-gray-900">Uploaded Documents</h3>
            <p className="text-sm text-gray-600 mt-1">
              Documents that have been uploaded for this process
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {documents.map((document) => (
                <div key={document.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <DocumentIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{document.name}</h4>
                      <p className="text-xs text-gray-600">
                        {document.fileSize} • Uploaded by {document.uploadedBy} • {new Date(document.uploadedAt!).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(document.status)}`}>
                      {document.status.toUpperCase()}
                    </span>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteDocument(document.id)}
                      className="p-1 text-red-400 hover:text-red-600"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Upload Document - {selectedCategory}
              </h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      Click to upload or drag and drop
                    </span>
                    <span className="mt-1 block text-xs text-gray-500">
                      PDF, DOC, DOCX, JPG, PNG up to 10MB
                    </span>
                  </label>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        handleFileUpload(file)
                      }
                    }}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


