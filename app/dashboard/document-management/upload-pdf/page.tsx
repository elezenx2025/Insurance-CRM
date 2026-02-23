'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon, DocumentIcon, CloudArrowUpIcon, EyeIcon, TrashIcon } from '@heroicons/react/24/outline'

export default function UploadPDFPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [dragActive, setDragActive] = useState(false)

  const handleBack = () => {
    router.push('/dashboard/document-management')
  }

  const handleFileSelect = (files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files)
      const pdfFiles = fileArray.filter(file => file.type === 'application/pdf')
      
      if (pdfFiles.length !== fileArray.length) {
        alert('Only PDF files are allowed. Non-PDF files have been filtered out.')
      }
      
      setUploadedFiles(prev => [...prev, ...pdfFiles])
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files)
  }

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
      handleFileSelect(e.dataTransfer.files)
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const viewPDF = (file: File) => {
    const url = URL.createObjectURL(file)
    window.open(`/dashboard/document-management/pdf-viewer?url=${encodeURIComponent(url)}&name=${encodeURIComponent(file.name)}`, '_blank')
  }

  const downloadPDF = (file: File) => {
    const url = URL.createObjectURL(file)
    const link = document.createElement('a')
    link.href = url
    link.download = file.name
    link.click()
    URL.revokeObjectURL(url)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Document Management
          </button>
          
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <CloudArrowUpIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Upload PDF Documents</h1>
              <p className="text-gray-600">Upload and view PDF documents directly in the application</p>
            </div>
          </div>
        </div>

        {/* Upload Area */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload PDF Files</h2>
          
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              Drag and drop PDF files here, or click to select
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Supports PDF files up to 10MB each
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Select PDF Files
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,application/pdf"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Uploaded Files ({uploadedFiles.length})
            </h2>
            
            <div className="space-y-3">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <DocumentIcon className="h-8 w-8 text-red-500" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{file.name}</h3>
                      <p className="text-xs text-gray-600">
                        {formatFileSize(file.size)} • PDF Document
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => viewPDF(file)}
                      className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md"
                    >
                      <EyeIcon className="h-4 w-4 mr-1" />
                      View
                    </button>
                    <button
                      onClick={() => downloadPDF(file)}
                      className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md"
                    >
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download
                    </button>
                    <button
                      onClick={() => removeFile(index)}
                      className="flex items-center px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md"
                    >
                      <TrashIcon className="h-4 w-4 mr-1" />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <h3 className="text-sm font-medium text-blue-900 mb-2">How to Use</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Upload your PDF files using drag & drop or the select button</li>
            <li>• Click "View" to open the PDF in the built-in viewer</li>
            <li>• Use zoom controls and other features in the PDF viewer</li>
            <li>• Download files directly to your computer</li>
            <li>• Remove files from the list if needed</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

