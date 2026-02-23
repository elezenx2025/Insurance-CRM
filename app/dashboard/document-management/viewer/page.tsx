'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeftIcon, DocumentIcon, EyeIcon, ArrowDownTrayIcon, TrashIcon, PencilIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline'

function DocumentViewerContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const category = searchParams.get('category') || 'all'
  
  const [documents, setDocuments] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [loading, setLoading] = useState(true)

  const handleBack = () => {
    router.push('/dashboard/document-management')
  }

  useEffect(() => {
    // Simulate loading documents based on category
    setLoading(true)
    setTimeout(() => {
      const mockDocuments = getMockDocuments(category)
      setDocuments(mockDocuments)
      setLoading(false)
    }, 1000)
  }, [category])

  const getMockDocuments = (cat: string) => {
    const baseDocs = [
      {
        id: 1,
        name: 'Policy Document - POL-001.pdf',
        type: 'policy',
        size: '2.3 MB',
        date: '2024-01-15',
        status: 'active',
        description: 'Main policy document for policy POL-001',
        relatedTo: 'POL-001',
        relatedType: 'Policy'
      },
      {
        id: 2,
        name: 'KYC Document - John Doe.pdf',
        type: 'kyc',
        size: '1.8 MB',
        date: '2024-01-14',
        status: 'active',
        description: 'Identity proof for John Doe',
        relatedTo: 'CUST-001',
        relatedType: 'Customer'
      },
      {
        id: 3,
        name: 'Claim Document - CLM-001.pdf',
        type: 'claim',
        size: '3.2 MB',
        date: '2024-01-13',
        status: 'active',
        description: 'Claim intimation document',
        relatedTo: 'CLM-001',
        relatedType: 'Claim'
      },
      {
        id: 4,
        name: 'Policy Document - POL-002.pdf',
        type: 'policy',
        size: '2.1 MB',
        date: '2024-01-12',
        status: 'active',
        description: 'Policy document for policy POL-002',
        relatedTo: 'POL-002',
        relatedType: 'Policy'
      },
      {
        id: 5,
        name: 'KYC Document - Jane Smith.pdf',
        type: 'kyc',
        size: '1.9 MB',
        date: '2024-01-11',
        status: 'active',
        description: 'Address proof for Jane Smith',
        relatedTo: 'CUST-002',
        relatedType: 'Customer'
      }
    ]

    if (cat === 'all') return baseDocs
    return baseDocs.filter(doc => doc.type === cat)
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterType === 'all' || doc.status === filterType
    return matchesSearch && matchesFilter
  })

  const getCategoryTitle = () => {
    switch (category) {
      case 'policy': return 'Policy Documents'
      case 'kyc': return 'KYC Documents'
      case 'claim': return 'Claim Documents'
      default: return 'All Documents'
    }
  }

  const getCategoryDescription = () => {
    switch (category) {
      case 'policy': return 'View and manage policy-related documents'
      case 'kyc': return 'View and manage customer KYC documents'
      case 'claim': return 'View and manage claim-related documents'
      default: return 'View and manage all documents'
    }
  }

  const handleViewDocument = (doc: any) => {
    console.log('Viewing document:', doc.name)
    // Implement document viewing logic
    alert(`Opening document: ${doc.name}`)
  }

  const handleDownloadDocument = (doc: any) => {
    console.log('Downloading document:', doc.name)
    // Simulate download
    const link = document.createElement('a')
    link.href = '#'
    link.download = doc.name
    link.click()
  }

  const handleDeleteDocument = (doc: any) => {
    if (confirm(`Are you sure you want to delete ${doc.name}?`)) {
      setDocuments(prev => prev.filter(d => d.id !== doc.id))
      console.log('Deleted document:', doc.name)
    }
  }

  const handleEditDocument = (doc: any) => {
    console.log('Editing document:', doc.name)
    // Implement edit functionality
    alert(`Edit functionality for ${doc.name} will be implemented`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading documents...</p>
        </div>
      </div>
    )
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
              Back to Document Management
            </button>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{getCategoryTitle()}</h1>
          <p className="text-gray-600 mt-2">{getCategoryDescription()}</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search Documents</label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by document name or description..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort by</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="date">Date</option>
                <option value="name">Name</option>
                <option value="size">Size</option>
                <option value="type">Type</option>
              </select>
            </div>
          </div>
        </div>

        {/* Documents List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Documents ({filteredDocuments.length})
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredDocuments.length === 0 ? (
              <div className="p-6 text-center">
                <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No documents found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchQuery ? 'Try adjusting your search criteria.' : 'No documents available for this category.'}
                </p>
              </div>
            ) : (
              filteredDocuments.map((doc) => (
                <div key={doc.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <DocumentIcon className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="ml-4">
                        <h4 className="text-sm font-medium text-gray-900">{doc.name}</h4>
                        <p className="text-sm text-gray-500">{doc.description}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-gray-400">Size: {doc.size}</span>
                          <span className="text-xs text-gray-400">Date: {doc.date}</span>
                          <span className="text-xs text-gray-400">
                            Related to: {doc.relatedTo} ({doc.relatedType})
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            doc.status === 'active' ? 'bg-green-100 text-green-800' :
                            doc.status === 'archived' ? 'bg-gray-100 text-gray-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {doc.status}
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
                      <button
                        onClick={() => handleEditDocument(doc)}
                        className="p-2 text-gray-400 hover:text-yellow-600 transition-colors"
                        title="Edit Document"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteDocument(doc)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete Document"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DocumentViewerPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading documents...</p>
          </div>
        </div>
      }
    >
      <DocumentViewerContent />
    </Suspense>
  )
}
