'use client'

import { useState, useRef } from 'react'
import {
  DocumentIcon,
  DocumentArrowUpIcon,
  EyeIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'

interface Document {
  id: string
  name: string
  type: string
  size: number
  uploadedAt: string
  url: string
  category: string
}

interface DocumentManagerProps {
  documents: Document[]
  onUpload: (file: File, category: string) => Promise<boolean>
  onDelete: (documentId: string) => Promise<boolean>
  onView: (document: Document) => void
  onDownload: (document: Document) => void
  categories: string[]
  maxFileSize?: number // in MB
  acceptedTypes?: string[]
}

export default function DocumentManager({
  documents,
  onUpload,
  onDelete,
  onView,
  onDownload,
  categories,
  maxFileSize = 10,
  acceptedTypes = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx']
}: DocumentManagerProps) {
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(categories[0] || '')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (file: File) => {
    setUploading(true)
    setUploadError(null)

    try {
      const success = await onUpload(file, selectedCategory)
      if (success) {
        setShowUploadModal(false)
        setSelectedCategory(categories[0] || '')
      } else {
        setUploadError('Failed to upload document')
      }
    } catch (error) {
      setUploadError('An error occurred during upload')
    } finally {
      setUploading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size
      if (file.size > maxFileSize * 1024 * 1024) {
        setUploadError(`File size exceeds ${maxFileSize}MB limit`)
        return
      }

      // Validate file type
      const fileExtension = file.name.split('.').pop()?.toLowerCase()
      if (!acceptedTypes.includes(`.${fileExtension}`)) {
        setUploadError(`File type .${fileExtension} is not supported`)
        return
      }

      handleFileUpload(file)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '📄'
    if (type.includes('image')) return '🖼️'
    if (type.includes('word') || type.includes('document')) return '📝'
    return '📎'
  }

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
        <button
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <DocumentArrowUpIcon className="h-4 w-4 mr-2" />
          Upload Document
        </button>
      </div>

      {/* Documents List */}
      {documents.length === 0 ? (
        <div className="text-center py-8">
          <DocumentIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No documents uploaded yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <div key={doc.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="text-2xl">{getFileIcon(doc.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(doc.size)}</p>
                    <p className="text-xs text-gray-500">{doc.category}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(doc.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-1 ml-2">
                  <button
                    onClick={() => onView(doc)}
                    className="p-1 text-gray-400 hover:text-blue-600"
                    title="View"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDownload(doc)}
                    className="p-1 text-gray-400 hover:text-green-600"
                    title="Download"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(doc.id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                    title="Delete"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Upload Document</h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    File
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={acceptedTypes.join(',')}
                    onChange={handleFileSelect}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Accepted types: {acceptedTypes.join(', ')} (Max {maxFileSize}MB)
                  </p>
                </div>

                {uploadError && (
                  <div className="p-3 bg-red-50 rounded-md">
                    <div className="flex items-center">
                      <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2" />
                      <p className="text-sm text-red-800">{uploadError}</p>
                    </div>
                  </div>
                )}

                {uploading && (
                  <div className="p-3 bg-blue-50 rounded-md">
                    <div className="flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-blue-600 mr-2" />
                      <p className="text-sm text-blue-800">Uploading...</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
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








