'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon, ArchiveBoxIcon, DocumentIcon, EyeIcon, ArrowDownTrayIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export default function DocumentArchivePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([])

  const handleBack = () => {
    router.push('/dashboard/document-management')
  }

  const handleDocumentSelection = (docId: string) => {
    setSelectedDocuments(prev => 
      prev.includes(docId) 
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    )
  }

  const handleSelectAll = () => {
    const allDocIds = archivedDocuments.map(doc => doc.id)
    setSelectedDocuments(allDocIds)
  }

  const handleDeselectAll = () => {
    setSelectedDocuments([])
  }

  const handleRestoreDocuments = () => {
    if (selectedDocuments.length === 0) {
      alert('Please select documents to restore')
      return
    }
    console.log('Restoring documents:', selectedDocuments)
    alert(`Restored ${selectedDocuments.length} documents`)
    setSelectedDocuments([])
  }

  const handlePermanentDelete = () => {
    if (selectedDocuments.length === 0) {
      alert('Please select documents to delete')
      return
    }
    if (confirm(`Are you sure you want to permanently delete ${selectedDocuments.length} documents? This action cannot be undone.`)) {
      console.log('Permanently deleting documents:', selectedDocuments)
      alert(`Permanently deleted ${selectedDocuments.length} documents`)
      setSelectedDocuments([])
    }
  }

  const handleViewDocument = (doc: any) => {
    console.log('Viewing archived document:', doc.name)
    alert(`Opening archived document: ${doc.name}`)
  }

  const handleDownloadDocument = (doc: any) => {
    console.log('Downloading archived document:', doc.name)
    const link = document.createElement('a')
    link.href = '#'
    link.download = doc.name
    link.click()
  }

  const archivedDocuments = [
    {
      id: '1',
      name: 'Old Policy Document - POL-001.pdf',
      originalCategory: 'Policy',
      archivedDate: '2024-01-10',
      archivedBy: 'Admin User',
      size: '2.3 MB',
      reason: 'Policy expired'
    },
    {
      id: '2',
      name: 'Outdated KYC Document - John Doe.pdf',
      originalCategory: 'KYC',
      archivedDate: '2024-01-08',
      archivedBy: 'System',
      size: '1.8 MB',
      reason: 'KYC updated'
    },
    {
      id: '3',
      name: 'Resolved Claim Document - CLM-001.pdf',
      originalCategory: 'Claim',
      archivedDate: '2024-01-05',
      archivedBy: 'Admin User',
      size: '3.2 MB',
      reason: 'Claim settled'
    },
    {
      id: '4',
      name: 'Legacy Policy Document - POL-002.pdf',
      originalCategory: 'Policy',
      archivedDate: '2024-01-03',
      archivedBy: 'System',
      size: '2.1 MB',
      reason: 'Policy replaced'
    }
  ]

  const filteredDocuments = archivedDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.originalCategory.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || doc.reason.toLowerCase().includes(filterStatus.toLowerCase())
    return matchesSearch && matchesFilter
  })

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
              Back to Document Management
            </button>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Document Archive</h1>
          <p className="text-gray-600 mt-2">
            Manage archived documents - restore or permanently delete them
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search Archived Documents</label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by document name or category..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Reason</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Reasons</option>
                <option value="expired">Expired</option>
                <option value="updated">Updated</option>
                <option value="settled">Settled</option>
                <option value="replaced">Replaced</option>
              </select>
            </div>
          </div>
        </div>

        {/* Actions */}
        {selectedDocuments.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ArchiveBoxIcon className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-900">
                  {selectedDocuments.length} document(s) selected
                </span>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleRestoreDocuments}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                  Restore Selected
                </button>
                <button
                  onClick={handlePermanentDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Delete Permanently
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Documents List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Archived Documents ({filteredDocuments.length})
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={handleSelectAll}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Select All
                </button>
                <button
                  onClick={handleDeselectAll}
                  className="text-sm text-gray-600 hover:text-gray-700"
                >
                  Deselect All
                </button>
              </div>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredDocuments.length === 0 ? (
              <div className="p-6 text-center">
                <ArchiveBoxIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No archived documents found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchQuery ? 'Try adjusting your search criteria.' : 'No documents have been archived yet.'}
                </p>
              </div>
            ) : (
              filteredDocuments.map((doc) => (
                <div key={doc.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedDocuments.includes(doc.id)}
                        onChange={() => handleDocumentSelection(doc.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-4"
                      />
                      <div className="flex-shrink-0">
                        <DocumentIcon className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="ml-4">
                        <h4 className="text-sm font-medium text-gray-900">{doc.name}</h4>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-gray-500">Category: {doc.originalCategory}</span>
                          <span className="text-xs text-gray-500">Size: {doc.size}</span>
                          <span className="text-xs text-gray-500">Archived: {doc.archivedDate}</span>
                          <span className="text-xs text-gray-500">By: {doc.archivedBy}</span>
                        </div>
                        <div className="mt-1">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            Reason: {doc.reason}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewDocument(doc)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="View Document"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDownloadDocument(doc)}
                        className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                        title="Download Document"
                      >
                        <ArrowDownTrayIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Archive Statistics */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center">
              <ArchiveBoxIcon className="h-8 w-8 text-gray-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Archived</p>
                <p className="text-2xl font-semibold text-gray-900">{archivedDocuments.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center">
              <DocumentIcon className="h-8 w-8 text-blue-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Policy Documents</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {archivedDocuments.filter(doc => doc.originalCategory === 'Policy').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center">
              <DocumentIcon className="h-8 w-8 text-green-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">KYC Documents</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {archivedDocuments.filter(doc => doc.originalCategory === 'KYC').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center">
              <DocumentIcon className="h-8 w-8 text-red-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Claim Documents</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {archivedDocuments.filter(doc => doc.originalCategory === 'Claim').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}




