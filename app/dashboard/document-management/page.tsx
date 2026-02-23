'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon, DocumentIcon, UserIcon, ExclamationTriangleIcon, CloudArrowUpIcon, EyeIcon, TrashIcon, PencilIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'

export default function DocumentManagementPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [showSearchModal, setShowSearchModal] = useState<boolean>(false)
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false)
  const [showSecurityModal, setShowSecurityModal] = useState<boolean>(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<number>(0)

  const handleBack = () => {
    router.push('/dashboard')
  }

  const documentCategories = [
    {
      id: 'policy',
      name: 'Policy Documents',
      description: 'Manage policy-related documents',
      icon: DocumentIcon,
      color: 'blue',
      count: 1247
    },
    {
      id: 'kyc',
      name: 'KYC Documents',
      description: 'Manage customer KYC documents',
      icon: UserIcon,
      color: 'green',
      count: 2156
    },
    {
      id: 'claim',
      name: 'Claim Documents',
      description: 'Manage claim-related documents',
      icon: ExclamationTriangleIcon,
      color: 'red',
      count: 342
    }
  ]

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
      case 'green':
        return 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
      case 'red':
        return 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
    }
  }

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId)
  }

  const handleDocumentAction = (action: string, category: string) => {
    console.log(`${action} documents for ${category}`)
    
    switch (action) {
      case 'upload':
        handleBulkUpload(category)
        break
      case 'bulk-upload':
        handleBulkUpload(category)
        break
      case 'view':
        handleViewDocuments(category)
        break
      case 'search':
        handleSearchDocuments()
        break
      case 'organize':
        handleOrganizeDocuments()
        break
      case 'export':
        handleExportDocuments(category)
        break
      case 'archive':
        handleArchiveDocuments()
        break
      case 'security':
        handleSecuritySettings()
        break
      default:
        console.log(`Action ${action} not implemented yet`)
    }
  }

  const handleBulkUpload = (category: string) => {
    setShowUploadModal(true)
    console.log(`Opening bulk upload for ${category} documents`)
  }

  const handleViewDocuments = (category: string) => {
    console.log(`Viewing ${category} documents`)
    // Navigate to document viewer or open in new tab
    window.open(`/dashboard/document-management/viewer?category=${category}`, '_blank')
  }

  const handleViewPDF = (documentId: string, documentName: string) => {
    console.log(`Viewing PDF document: ${documentName}`)
    // Navigate to PDF viewer
    window.open(`/dashboard/document-management/pdf-viewer?id=${documentId}&name=${encodeURIComponent(documentName)}`, '_blank')
  }

  const handleSearchDocuments = () => {
    setShowSearchModal(true)
    console.log('Opening search functionality')
  }

  const handleOrganizeDocuments = () => {
    console.log('Opening document organization tools')
    // Navigate to organization page
    router.push('/dashboard/document-management/organize')
  }

  const handleExportDocuments = (category: string) => {
    console.log(`Exporting ${category} documents`)
    // Simulate file download
    const link = document.createElement('a')
    link.href = '#'
    link.download = `${category}-documents-export.csv`
    link.click()
  }

  const handleArchiveDocuments = () => {
    console.log('Opening archive management')
    // Navigate to archive page
    router.push('/dashboard/document-management/archive')
  }

  const handleSecuritySettings = () => {
    setShowSecurityModal(true)
    console.log('Opening security settings')
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
              Back to Dashboard
            </button>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Document Management</h1>
          <p className="text-gray-600 mt-2">
            Centralized document management system for all business processes
          </p>
        </div>

        {/* Document Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {documentCategories.map((category) => {
            const IconComponent = category.icon
            return (
              <div
                key={category.id}
                className={`p-6 rounded-lg border-2 transition-all cursor-pointer ${
                  selectedCategory === category.id || selectedCategory === 'all'
                    ? getColorClasses(category.color)
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleCategoryClick(category.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-lg ${
                      category.color === 'blue' ? 'bg-blue-100' :
                      category.color === 'green' ? 'bg-green-100' :
                      'bg-red-100'
                    }`}>
                      <IconComponent className={`h-6 w-6 ${
                        category.color === 'blue' ? 'text-blue-600' :
                        category.color === 'green' ? 'text-green-600' :
                        'text-red-600'
                      }`} />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{category.count}</div>
                    <div className="text-sm text-gray-500">documents</div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDocumentAction('upload', category.id)
                    }}
                    className="flex-1 bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    <CloudArrowUpIcon className="h-4 w-4 inline mr-1" />
                    Upload
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDocumentAction('view', category.id)
                    }}
                    className="flex-1 bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    <EyeIcon className="h-4 w-4 inline mr-1" />
                    View
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Sample Documents */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Sample Documents</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex items-center space-x-3">
                <DocumentIcon className="h-5 w-5 text-red-500" />
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Claim Document - CLM-001</h4>
                  <p className="text-xs text-gray-600">PDF • 2.3 MB • Claim Documents</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleViewPDF('CLM-001', 'Claim Document - CLM-001')}
                  className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md"
                >
                  <EyeIcon className="h-4 w-4 mr-1" />
                  View PDF
                </button>
                <button
                  onClick={() => {
                    const link = document.createElement('a')
                    link.href = '/sample-claim-document.pdf'
                    link.download = 'Claim Document - CLM-001.pdf'
                    link.click()
                  }}
                  className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md"
                >
                  <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Document Management Actions */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Document Management Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => handleDocumentAction('bulk-upload', 'all')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-center">
                <CloudArrowUpIcon className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <h4 className="font-medium text-gray-900">Bulk Upload</h4>
                  <p className="text-sm text-gray-600">Upload multiple documents at once</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => router.push('/dashboard/document-management/upload-pdf')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-center">
                <DocumentIcon className="h-5 w-5 text-red-600 mr-3" />
                <div>
                  <h4 className="font-medium text-gray-900">Upload PDF Files</h4>
                  <p className="text-sm text-gray-600">Upload and view PDF documents directly</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => router.push('/dashboard/document-management/local-pdf')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-center">
                <svg className="h-5 w-5 text-orange-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <h4 className="font-medium text-gray-900">Fix Chrome Extension Error</h4>
                  <p className="text-sm text-gray-600">Troubleshoot PDF viewing issues</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleDocumentAction('search', 'all')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-center">
                <svg className="h-5 w-5 text-green-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <div>
                  <h4 className="font-medium text-gray-900">Search Documents</h4>
                  <p className="text-sm text-gray-600">Find documents by keywords or filters</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleDocumentAction('organize', 'all')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-center">
                <PencilIcon className="h-5 w-5 text-purple-600 mr-3" />
                <div>
                  <h4 className="font-medium text-gray-900">Organize Documents</h4>
                  <p className="text-sm text-gray-600">Categorize and organize document structure</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleDocumentAction('export', 'all')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-center">
                <svg className="h-5 w-5 text-orange-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div>
                  <h4 className="font-medium text-gray-900">Export Documents</h4>
                  <p className="text-sm text-gray-600">Export documents in various formats</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleDocumentAction('archive', 'all')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-center">
                <svg className="h-5 w-5 text-gray-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8l6 6 6-6" />
                </svg>
                <div>
                  <h4 className="font-medium text-gray-900">Archive Documents</h4>
                  <p className="text-sm text-gray-600">Archive old or inactive documents</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleDocumentAction('security', 'all')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-center">
                <svg className="h-5 w-5 text-red-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <div>
                  <h4 className="font-medium text-gray-900">Security Settings</h4>
                  <p className="text-sm text-gray-600">Manage document access and permissions</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Documents */}
        <div className="bg-white shadow rounded-lg p-6 mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Documents</h3>
          <div className="space-y-3">
            {[
              { name: 'Policy Document - POL-001.pdf', category: 'Policy', date: '2024-01-15', size: '2.3 MB' },
              { name: 'KYC Document - John Doe.pdf', category: 'KYC', date: '2024-01-14', size: '1.8 MB' },
              { name: 'Claim Document - CLM-001.pdf', category: 'Claim', date: '2024-01-13', size: '3.2 MB' },
              { name: 'Policy Document - POL-002.pdf', category: 'Policy', date: '2024-01-12', size: '2.1 MB' },
              { name: 'KYC Document - Jane Smith.pdf', category: 'KYC', date: '2024-01-11', size: '1.9 MB' }
            ].map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center">
                  <DocumentIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                    <p className="text-xs text-gray-500">{doc.category} • {doc.date} • {doc.size}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="text-gray-400 hover:text-gray-600">
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <button className="text-gray-400 hover:text-gray-600">
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button className="text-gray-400 hover:text-red-600">
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search Modal */}
        {showSearchModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
            <div className="relative p-8 border w-full max-w-2xl shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Search Documents</h3>
                <button
                  onClick={() => setShowSearchModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search Query</label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter keywords to search documents..."
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
                    <select className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                      <option value="">All Types</option>
                      <option value="policy">Policy Documents</option>
                      <option value="kyc">KYC Documents</option>
                      <option value="claim">Claim Documents</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                    <select className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                      <option value="">All Dates</option>
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                      <option value="year">This Year</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowSearchModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      console.log('Searching for:', searchQuery)
                      setShowSearchModal(false)
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
            <div className="relative p-8 border w-full max-w-4xl shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Upload Documents</h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-6">
                {/* Document Association */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-blue-900 mb-3">Document Association</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
                      <select className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                        <option value="">Select Document Type</option>
                        <option value="policy">Policy Documents</option>
                        <option value="kyc">KYC Documents</option>
                        <option value="claim">Claim Documents</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Related To</label>
                      <select className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                        <option value="">Select Related Item</option>
                        <option value="POL-001">Policy POL-001</option>
                        <option value="POL-002">Policy POL-002</option>
                        <option value="CUST-001">Customer CUST-001</option>
                        <option value="CUST-002">Customer CUST-002</option>
                        <option value="CLM-001">Claim CLM-001</option>
                        <option value="CLM-002">Claim CLM-002</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Document Category</label>
                      <select className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                        <option value="">Select Category</option>
                        <option value="main">Main Document</option>
                        <option value="supporting">Supporting Document</option>
                        <option value="verification">Verification Document</option>
                        <option value="legal">Legal Document</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* File Upload Area */}
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors"
                  onDragOver={(e) => {
                    e.preventDefault()
                    e.currentTarget.classList.add('border-blue-400', 'bg-blue-50')
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault()
                    e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50')
                  }}
                  onDrop={(e) => {
                    e.preventDefault()
                    e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50')
                    
                    const files = Array.from(e.dataTransfer.files)
                    if (files.length > 0) {
                      // Validate file sizes (max 10MB each)
                      const validFiles = files.filter(file => {
                        if (file.size > 10 * 1024 * 1024) {
                          alert(`File ${file.name} is too large. Maximum size is 10MB.`)
                          return false
                        }
                        return true
                      })
                      
                      // Validate file types
                      const allowedTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png']
                      const typeValidFiles = validFiles.filter(file => {
                        const extension = '.' + file.name.split('.').pop()?.toLowerCase()
                        if (!allowedTypes.includes(extension)) {
                          alert(`File ${file.name} has unsupported format. Allowed: PDF, DOC, DOCX, JPG, PNG`)
                          return false
                        }
                        return true
                      })
                      
                      setSelectedFiles(prev => [...prev, ...typeValidFiles])
                      console.log('Dropped files:', typeValidFiles.map(f => f.name))
                      
                      if (typeValidFiles.length > 0) {
                        console.log(`Successfully added ${typeValidFiles.length} valid file(s) via drag & drop`)
                      }
                    }
                  }}
                >
                  <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">Drag and drop files here, or click to select files</p>
                  <p className="text-xs text-gray-500">Supports PDF, DOC, DOCX, JPG, PNG files (Max 10MB per file)</p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    className="hidden"
                    id="fileInput"
                    onChange={(e) => {
                      const files = e.target.files
                      if (files && files.length > 0) {
                        const fileArray = Array.from(files)
                        
                        // Validate file sizes (max 10MB each)
                        const validFiles = fileArray.filter(file => {
                          if (file.size > 10 * 1024 * 1024) {
                            alert(`File ${file.name} is too large. Maximum size is 10MB.`)
                            return false
                          }
                          return true
                        })
                        
                        // Validate file types
                        const allowedTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png']
                        const typeValidFiles = validFiles.filter(file => {
                          const extension = '.' + file.name.split('.').pop()?.toLowerCase()
                          if (!allowedTypes.includes(extension)) {
                            alert(`File ${file.name} has unsupported format. Allowed: PDF, DOC, DOCX, JPG, PNG`)
                            return false
                          }
                          return true
                        })
                        
                        setSelectedFiles(typeValidFiles)
                        console.log('Selected files:', typeValidFiles.map(f => f.name))
                        
                        if (typeValidFiles.length > 0) {
                          console.log(`Successfully selected ${typeValidFiles.length} valid file(s) for upload`)
                        }
                      }
                    }}
                  />
                  <label 
                    htmlFor="fileInput"
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer inline-block"
                  >
                    Select Files
                  </label>
                </div>

                {/* Selected Files Display */}
                {selectedFiles.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Selected Files ({selectedFiles.length})</h4>
                    <div className="space-y-2">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                          <div className="flex items-center">
                            <DocumentIcon className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">{file.name}</span>
                            <span className="text-xs text-gray-500 ml-2">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                          </div>
                          <button
                            onClick={() => {
                              const newFiles = selectedFiles.filter((_, i) => i !== index)
                              setSelectedFiles(newFiles)
                            }}
                            className="text-red-600 hover:text-red-800"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Document Details */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Document Description</label>
                  <textarea
                    rows={3}
                    placeholder="Enter a description for the documents being uploaded..."
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Upload Options */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Upload Options</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                      <span className="ml-2 text-sm text-gray-700">Auto-categorize documents based on content</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                      <span className="ml-2 text-sm text-gray-700">Generate thumbnails for image documents</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                      <span className="ml-2 text-sm text-gray-700">Extract text for search indexing</span>
                    </label>
                  </div>
                </div>

                {/* Upload Progress */}
                {uploadProgress > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-900">Uploading Documents...</span>
                      <span className="text-sm text-blue-700">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                          <button
                            onClick={async () => {
                              if (selectedFiles.length === 0) {
                                alert('Please select files to upload')
                                return
                              }
                              
                              console.log('Uploading documents with association...')
                              console.log('Files to upload:', selectedFiles.map(f => f.name))
                              
                              try {
                              // Simulate upload progress
                              setUploadProgress(0)
                                
                                // Simulate upload process for each file
                                for (let i = 0; i < selectedFiles.length; i++) {
                                  const fileProgress = ((i + 1) / selectedFiles.length) * 100
                                  setUploadProgress(fileProgress)
                                  
                                  // Simulate individual file upload delay
                                  await new Promise(resolve => setTimeout(resolve, 500))
                                  
                                  console.log(`Uploaded file ${i + 1}/${selectedFiles.length}: ${selectedFiles[i].name}`)
                                }
                                
                                // Upload completed
                                setUploadProgress(100)
                                setTimeout(() => {
                                    setShowUploadModal(false)
                                    setSelectedFiles([])
                                    setUploadProgress(0)
                                  alert(`Successfully uploaded ${selectedFiles.length} document(s)!`)
                                }, 500)
                                
                              } catch (error) {
                                console.error('Upload failed:', error)
                                alert('Upload failed. Please try again.')
                                setUploadProgress(0)
                              }
                            }}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={uploadProgress > 0 && uploadProgress < 100}
                          >
                            {uploadProgress > 0 && uploadProgress < 100 ? 'Uploading...' : 'Upload Documents'}
                          </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Modal */}
        {showSecurityModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
            <div className="relative p-8 border w-full max-w-2xl shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
                <button
                  onClick={() => setShowSecurityModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Access Permissions</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                      <span className="ml-2 text-sm text-gray-700">Allow public access to policy documents</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                      <span className="ml-2 text-sm text-gray-700">Require authentication for KYC documents</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                      <span className="ml-2 text-sm text-gray-700">Encrypt sensitive claim documents</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Document Retention Policy</label>
                  <select className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    <option value="1">1 Year</option>
                    <option value="3">3 Years</option>
                    <option value="5">5 Years</option>
                    <option value="7">7 Years</option>
                    <option value="permanent">Permanent</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowSecurityModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      console.log('Saving security settings...')
                      setShowSecurityModal(false)
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Save Settings
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
