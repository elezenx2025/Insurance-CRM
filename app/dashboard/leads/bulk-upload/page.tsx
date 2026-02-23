'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeftIcon,
  DocumentArrowUpIcon,
  DocumentIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'
import BulkUploadModal from '@/components/bulk-upload/BulkUploadModal'

interface UploadResult {
  success: boolean
  message: string
  data?: any
  errors?: string[]
}

export default function LeadsBulkUploadPage() {
  const router = useRouter()
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadHistory, setUploadHistory] = useState([
    {
      id: '1',
      fileName: 'leads_batch_1.xlsx',
      uploadedAt: '2024-01-15T10:30:00Z',
      status: 'completed',
      recordsProcessed: 300,
      recordsSuccessful: 285,
      recordsFailed: 15,
      errors: ['Row 12: Invalid phone number format', 'Row 45: Missing required field', 'Row 78: Duplicate lead']
    },
    {
      id: '2',
      fileName: 'leads_batch_2.xlsx',
      uploadedAt: '2024-01-14T14:20:00Z',
      status: 'completed',
      recordsProcessed: 250,
      recordsSuccessful: 250,
      recordsFailed: 0,
      errors: []
    }
  ])

  const handleUpload = async (file: File): Promise<UploadResult> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock upload result
    const mockResult: UploadResult = {
      success: true,
      message: 'Leads uploaded successfully',
      data: {
        recordsProcessed: 300,
        recordsSuccessful: 285,
        recordsFailed: 15
      },
      errors: ['Row 12: Invalid phone number format', 'Row 45: Missing required field', 'Row 78: Duplicate lead']
    }

    // Add to upload history
    const newUpload = {
      id: Date.now().toString(),
      fileName: file.name,
      uploadedAt: new Date().toISOString(),
      status: mockResult.success ? 'completed' : 'failed',
      recordsProcessed: mockResult.data?.recordsProcessed || 0,
      recordsSuccessful: mockResult.data?.recordsSuccessful || 0,
      recordsFailed: mockResult.data?.recordsFailed || 0,
      errors: mockResult.errors || []
    }
    setUploadHistory(prev => [newUpload, ...prev])

    return mockResult
  }

  const downloadTemplate = () => {
    try {
      const link = document.createElement('a')
      link.href = '/templates/lead-bulk-upload-template.csv'
      link.download = 'lead-bulk-upload-template.csv'
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error downloading template:', error)
      alert('Template download failed. Please try again.')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'failed':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
      default:
        return <DocumentIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="mb-6">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            <li>
              <button onClick={() => router.push('/dashboard')} className="text-gray-400 hover:text-gray-500">
                Dashboard
              </button>
            </li>
            <li>
              <div className="flex items-center">
                <span className="text-gray-400">/</span>
                <button onClick={() => router.push('/dashboard/leads')} className="ml-4 text-gray-400 hover:text-gray-500">
                  Leads
                </button>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="text-gray-400">/</span>
                <span className="ml-4 text-gray-900 font-medium">Bulk Upload</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      {/* Page header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/dashboard/leads')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Leads
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Leads Bulk Upload</h1>
            <p className="mt-1 text-sm text-gray-600">
              Upload multiple leads at once using Excel files
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <DocumentArrowUpIcon className="h-4 w-4 mr-2" />
          Upload Leads
        </button>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Upload Instructions</h3>
        <div className="space-y-3 text-sm text-blue-800">
          <div className="flex items-start">
            <span className="font-semibold mr-2">1.</span>
            <span>Download the template file to see the required format</span>
          </div>
          <div className="flex items-start">
            <span className="font-semibold mr-2">2.</span>
            <span>Fill in the lead data following the template structure</span>
          </div>
          <div className="flex items-start">
            <span className="font-semibold mr-2">3.</span>
            <span>Save the file as Excel format (.xlsx)</span>
          </div>
          <div className="flex items-start">
            <span className="font-semibold mr-2">4.</span>
            <span>Upload the file using the upload button</span>
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={downloadTemplate}
            className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-white hover:bg-blue-50"
          >
            <DocumentIcon className="h-4 w-4 mr-2" />
            Download Template
          </button>
        </div>
      </div>

      {/* Upload History */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Upload History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  File Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Upload Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Records
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Success Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {uploadHistory.map((upload) => (
                <tr key={upload.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <DocumentIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <div className="text-sm font-medium text-gray-900">{upload.fileName}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(upload.uploadedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(upload.status)}
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(upload.status)}`}>
                        {upload.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div>Total: {upload.recordsProcessed}</div>
                      <div className="text-green-600">Success: {upload.recordsSuccessful}</div>
                      <div className="text-red-600">Failed: {upload.recordsFailed}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {upload.recordsProcessed > 0 
                      ? `${Math.round((upload.recordsSuccessful / upload.recordsProcessed) * 100)}%`
                      : '0%'
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        View Details
                      </button>
                      {upload.errors.length > 0 && (
                        <button className="text-red-600 hover:text-red-900">
                          View Errors
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      <BulkUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload Leads"
        description="Upload an Excel file containing lead data. The file should follow the template format."
        acceptedFileTypes={['.csv', '.xlsx', '.xls']}
        maxFileSize={10}
        onUpload={handleUpload}
        templateUrl="/templates/lead-bulk-upload-template.csv"
      />
    </div>
  )
}
