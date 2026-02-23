'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon, FolderIcon, DocumentIcon, TagIcon, PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline'

export default function DocumentOrganizePage() {
  const router = useRouter()
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([])
  const [newCategory, setNewCategory] = useState('')
  const [newTag, setNewTag] = useState('')

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
    const allDocIds = mockDocuments.map(doc => doc.id)
    setSelectedDocuments(allDocIds)
  }

  const handleDeselectAll = () => {
    setSelectedDocuments([])
  }

  const handleCreateCategory = () => {
    if (newCategory.trim()) {
      console.log('Creating category:', newCategory)
      setNewCategory('')
      alert(`Category "${newCategory}" created successfully!`)
    }
  }

  const handleCreateTag = () => {
    if (newTag.trim()) {
      console.log('Creating tag:', newTag)
      setNewTag('')
      alert(`Tag "${newTag}" created successfully!`)
    }
  }

  const handleMoveToCategory = (categoryId: string) => {
    if (selectedDocuments.length === 0) {
      alert('Please select documents to move')
      return
    }
    console.log('Moving documents to category:', categoryId)
    alert(`Moved ${selectedDocuments.length} documents to category`)
    setSelectedDocuments([])
  }

  const handleAddTag = (tagId: string) => {
    if (selectedDocuments.length === 0) {
      alert('Please select documents to tag')
      return
    }
    console.log('Adding tag to documents:', tagId)
    alert(`Added tag to ${selectedDocuments.length} documents`)
    setSelectedDocuments([])
  }

  const mockDocuments = [
    {
      id: '1',
      name: 'Policy Document - POL-001.pdf',
      category: 'Policy',
      tags: ['urgent', 'legal'],
      size: '2.3 MB',
      date: '2024-01-15'
    },
    {
      id: '2',
      name: 'KYC Document - John Doe.pdf',
      category: 'KYC',
      tags: ['verified'],
      size: '1.8 MB',
      date: '2024-01-14'
    },
    {
      id: '3',
      name: 'Claim Document - CLM-001.pdf',
      category: 'Claim',
      tags: ['pending'],
      size: '3.2 MB',
      date: '2024-01-13'
    }
  ]

  const categories = [
    { id: 'policy', name: 'Policy Documents', count: 1247 },
    { id: 'kyc', name: 'KYC Documents', count: 2156 },
    { id: 'claim', name: 'Claim Documents', count: 342 },
    { id: 'legal', name: 'Legal Documents', count: 89 },
    { id: 'financial', name: 'Financial Documents', count: 156 }
  ]

  const tags = [
    { id: 'urgent', name: 'Urgent', color: 'red' },
    { id: 'verified', name: 'Verified', color: 'green' },
    { id: 'pending', name: 'Pending', color: 'yellow' },
    { id: 'legal', name: 'Legal', color: 'blue' },
    { id: 'confidential', name: 'Confidential', color: 'purple' }
  ]

  const getTagColor = (color: string) => {
    const colors = {
      red: 'bg-red-100 text-red-800',
      green: 'bg-green-100 text-green-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      blue: 'bg-blue-100 text-blue-800',
      purple: 'bg-purple-100 text-purple-800'
    }
    return colors[color as keyof typeof colors] || 'bg-gray-100 text-gray-800'
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
          <h1 className="text-2xl font-bold text-gray-900">Organize Documents</h1>
          <p className="text-gray-600 mt-2">
            Organize and categorize your documents for better management
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Categories */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Categories</h3>
              <button
                onClick={() => document.getElementById('categoryModal')?.classList.remove('hidden')}
                className="text-blue-600 hover:text-blue-700"
              >
                <PlusIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleMoveToCategory(category.id)}
                >
                  <div className="flex items-center">
                    <FolderIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{category.name}</p>
                      <p className="text-xs text-gray-500">{category.count} documents</p>
                    </div>
                  </div>
                  {selectedDocuments.length > 0 && (
                    <span className="text-xs text-blue-600">Move here</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Tags</h3>
              <button
                onClick={() => document.getElementById('tagModal')?.classList.remove('hidden')}
                className="text-blue-600 hover:text-blue-700"
              >
                <PlusIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleAddTag(tag.id)}
                >
                  <div className="flex items-center">
                    <TagIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTagColor(tag.color)}`}>
                      {tag.name}
                    </span>
                  </div>
                  {selectedDocuments.length > 0 && (
                    <span className="text-xs text-blue-600">Add tag</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Documents</h3>
              <div className="flex space-x-2">
                <button
                  onClick={handleSelectAll}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  Select All
                </button>
                <button
                  onClick={handleDeselectAll}
                  className="text-xs text-gray-600 hover:text-gray-700"
                >
                  Deselect All
                </button>
              </div>
            </div>
            <div className="space-y-3">
              {mockDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedDocuments.includes(doc.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => handleDocumentSelection(doc.id)}
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedDocuments.includes(doc.id)}
                      onChange={() => handleDocumentSelection(doc.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3"
                    />
                    <DocumentIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-500">{doc.category}</span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-500">{doc.size}</span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-500">{doc.date}</span>
                      </div>
                      <div className="flex space-x-1 mt-1">
                        {doc.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Create Category Modal */}
        <div id="categoryModal" className="hidden fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
          <div className="relative p-8 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Create Category</h3>
              <button
                onClick={() => document.getElementById('categoryModal')?.classList.add('hidden')}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Enter category name..."
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => document.getElementById('categoryModal')?.classList.add('hidden')}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCategory}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Create Tag Modal */}
        <div id="tagModal" className="hidden fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
          <div className="relative p-8 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Create Tag</h3>
              <button
                onClick={() => document.getElementById('tagModal')?.classList.add('hidden')}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tag Name</label>
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Enter tag name..."
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => document.getElementById('tagModal')?.classList.add('hidden')}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTag}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}




