'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeftIcon, DocumentIcon, EyeIcon, ArrowDownTrayIcon, TrashIcon, PencilIcon, MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline'

function PDFViewerContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const documentId = searchParams.get('id') || 'CLM-001'
  const documentName = searchParams.get('name') || 'Claim Document - CLM-001'
  const documentUrl = searchParams.get('url') || null
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [zoom, setZoom] = useState(100)
  const [showControls, setShowControls] = useState(true)

  useEffect(() => {
    // Simulate loading document
    setLoading(true)
    setTimeout(() => {
      // Use provided URL or fallback to sample document
      if (documentUrl) {
        setPdfUrl(documentUrl)
      } else {
        setPdfUrl('/sample-claim-document.pdf')
      }
      setLoading(false)
    }, 1000)
  }, [documentId, documentUrl])

  const handleBack = () => {
    router.push('/dashboard/document-management')
  }

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement('a')
      link.href = pdfUrl
      link.download = `${documentName}.pdf`
      link.click()
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50))
  }

  const handleResetZoom = () => {
    setZoom(100)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading document...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <DocumentIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Document</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={handleBack}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to Documents
              </button>
              <div className="flex items-center">
                <DocumentIcon className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">{documentName}</h1>
                  <p className="text-sm text-gray-600">Document ID: {documentId}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Zoom Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleZoomOut}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                  title="Zoom Out"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="text-sm text-gray-600 min-w-[3rem] text-center">{zoom}%</span>
                <button
                  onClick={handleZoomIn}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                  title="Zoom In"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
                <button
                  onClick={handleResetZoom}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                >
                  Reset
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleDownload}
                  className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                >
                  <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                  Download
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                >
                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print
                </button>
                <button
                  onClick={() => setShowControls(!showControls)}
                  className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                >
                  {showControls ? 'Hide Controls' : 'Show Controls'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 overflow-hidden">
        {pdfUrl ? (
          <div className="h-screen">
            <iframe
              src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1&zoom=${zoom}`}
              className="w-full h-full border-0"
              title={documentName}
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <DocumentIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No document URL available</p>
            </div>
          </div>
        )}
      </div>

      {/* Document Info Panel */}
      {showControls && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-900">Document Info</h3>
            <button
              onClick={() => setShowControls(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <div>
              <span className="font-medium">Document ID:</span> {documentId}
            </div>
            <div>
              <span className="font-medium">Type:</span> Claim Document
            </div>
            <div>
              <span className="font-medium">Status:</span> 
              <span className="ml-1 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active
              </span>
            </div>
            <div>
              <span className="font-medium">Last Modified:</span> {new Date().toLocaleDateString()}
            </div>
            <div>
              <span className="font-medium">File Size:</span> 2.3 MB
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function PDFViewerPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading document...</p>
          </div>
        </div>
      }
    >
      <PDFViewerContent />
    </Suspense>
  )
}
