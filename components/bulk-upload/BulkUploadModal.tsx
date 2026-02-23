'use client'

import { useState, useRef } from 'react'
import {
  XMarkIcon,
  DocumentArrowUpIcon,
  DocumentIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CloudArrowUpIcon,
} from '@heroicons/react/24/outline'

interface BulkUploadModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description: string
  acceptedFileTypes: string[]
  maxFileSize: number // in MB
  onUpload: (file: File) => Promise<UploadResult>
  templateUrl?: string
}

interface UploadResult {
  success: boolean
  message: string
  data?: any
  errors?: string[]
}

export default function BulkUploadModal({
  isOpen,
  onClose,
  title,
  description,
  acceptedFileTypes,
  maxFileSize,
  onUpload,
  templateUrl
}: BulkUploadModalProps) {
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFile = (file: File) => {
    // Validate file type
    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    if (!acceptedFileTypes.includes(`.${fileExtension}`)) {
      setUploadResult({
        success: false,
        message: 'Invalid file type',
        errors: [`File type .${fileExtension} is not supported. Accepted types: ${acceptedFileTypes.join(', ')}`]
      })
      return
    }

    // Validate file size
    if (file.size > maxFileSize * 1024 * 1024) {
      setUploadResult({
        success: false,
        message: 'File too large',
        errors: [`File size exceeds ${maxFileSize}MB limit`]
      })
      return
    }

    setSelectedFile(file)
    setUploadResult(null)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setUploading(true)
    try {
      const result = await onUpload(selectedFile)
      setUploadResult(result)
    } catch (error) {
      setUploadResult({
        success: false,
        message: 'Upload failed',
        errors: ['An error occurred during upload']
      })
    } finally {
      setUploading(false)
    }
  }

  const handleClose = () => {
    setSelectedFile(null)
    setUploadResult(null)
    setUploading(false)
    onClose()
  }

  const downloadTemplate = () => {
    if (templateUrl) {
      const link = document.createElement('a')
      link.href = templateUrl
      link.download = 'template.xlsx'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-6">{description}</p>

          {/* Template Download */}
          {templateUrl && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <DocumentIcon className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm text-blue-800">
                  Download the template file to see the required format
                </span>
                <button
                  onClick={downloadTemplate}
                  className="ml-auto text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Download Template
                </button>
              </div>
            </div>
          )}

          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-blue-500 bg-blue-50'
                : selectedFile
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {selectedFile ? (
              <div className="space-y-4">
                <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Choose different file
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <CloudArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Drag and drop your file here, or click to browse
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Accepted formats: {acceptedFileTypes.join(', ')} (Max {maxFileSize}MB)
                  </p>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <DocumentArrowUpIcon className="h-4 w-4 mr-2" />
                  Choose File
                </button>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedFileTypes.join(',')}
            onChange={handleFileInput}
            className="hidden"
          />

          {/* Upload Result */}
          {uploadResult && (
            <div className={`mt-6 p-4 rounded-lg ${
              uploadResult.success ? 'bg-green-50' : 'bg-red-50'
            }`}>
              <div className="flex items-start">
                {uploadResult.success ? (
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                ) : (
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className={`text-sm font-medium ${
                    uploadResult.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {uploadResult.message}
                  </p>
                  {uploadResult.errors && uploadResult.errors.length > 0 && (
                    <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                      {uploadResult.errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading...' : 'Upload File'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}








