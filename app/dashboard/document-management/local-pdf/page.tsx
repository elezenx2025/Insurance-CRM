'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon, DocumentIcon, ExclamationTriangleIcon, CheckCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline'

export default function LocalPDFPage() {
  const router = useRouter()
  const [showSolution, setShowSolution] = useState(false)

  const handleBack = () => {
    router.push('/dashboard/document-management')
  }

  const solutions = [
    {
      title: "Method 1: Direct File Upload",
      description: "Use the web-based upload system instead of Chrome extension",
      steps: [
        "Go to Document Management → Upload PDF Files",
        "Drag and drop your PDF file directly into the browser",
        "Click 'View' to open the PDF in the built-in viewer",
        "No Chrome extension needed!"
      ],
      icon: CheckCircleIcon,
      color: "green"
    },
    {
      title: "Method 2: Rename File (Quick Fix)",
      description: "Remove special characters from filename",
      steps: [
        "Rename your file from 'Claim Document - CLM-001 (5).pdf'",
        "To: 'ClaimDocument-CLM-001-5.pdf'",
        "Remove spaces, parentheses, and special characters",
        "Try opening the renamed file"
      ],
      icon: InformationCircleIcon,
      color: "blue"
    },
    {
      title: "Method 3: Copy to Application Folder",
      description: "Move file to a location the application can access",
      steps: [
        "Copy your PDF file to the project's public folder",
        "Navigate to: C:\\Users\\user\\InsuranceCRM\\public\\",
        "Paste your PDF file there",
        "Access via: http://localhost:3000/your-filename.pdf"
      ],
      icon: DocumentIcon,
      color: "purple"
    }
  ]

  const getIconColor = (color: string) => {
    switch (color) {
      case 'green': return 'text-green-600'
      case 'blue': return 'text-blue-600'
      case 'purple': return 'text-purple-600'
      default: return 'text-gray-600'
    }
  }

  const getBgColor = (color: string) => {
    switch (color) {
      case 'green': return 'bg-green-50 border-green-200'
      case 'blue': return 'bg-blue-50 border-blue-200'
      case 'purple': return 'bg-purple-50 border-purple-200'
      default: return 'bg-gray-50 border-gray-200'
    }
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
            <div className="bg-red-100 p-3 rounded-lg mr-4">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Chrome Extension PDF Error Fix</h1>
              <p className="text-gray-600">Solutions for the Chrome extension PDF viewing error</p>
            </div>
          </div>
        </div>

        {/* Error Explanation */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <div className="flex items-start">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-3 mt-0.5" />
            <div>
              <h3 className="text-lg font-medium text-red-900 mb-2">Chrome Extension Error</h3>
              <p className="text-red-800 mb-3">
                The error <code className="bg-red-100 px-2 py-1 rounded text-sm">chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/file:///C:/Users/user/Downloads/Claim%20Document%20-%20CLM-001%20(5).pdf</code> occurs because:
              </p>
              <ul className="text-red-800 space-y-1 text-sm">
                <li>• Chrome extensions have security restrictions with local files</li>
                <li>• Special characters in filenames (spaces, parentheses) cause issues</li>
                <li>• Local file paths are not accessible through web extensions</li>
                <li>• The extension cannot process files with certain naming patterns</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Solutions */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Solutions</h2>
          
          {solutions.map((solution, index) => {
            const IconComponent = solution.icon
            return (
              <div key={index} className={`rounded-lg border p-6 ${getBgColor(solution.color)}`}>
                <div className="flex items-start">
                  <IconComponent className={`h-6 w-6 mr-4 mt-1 ${getIconColor(solution.color)}`} />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{solution.title}</h3>
                    <p className="text-gray-700 mb-4">{solution.description}</p>
                    
                    <div className="space-y-2">
                      {solution.steps.map((step, stepIndex) => (
                        <div key={stepIndex} className="flex items-start">
                          <span className="flex-shrink-0 w-6 h-6 bg-white border border-gray-300 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 mr-3 mt-0.5">
                            {stepIndex + 1}
                          </span>
                          <span className="text-sm text-gray-700">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => router.push('/dashboard/document-management/upload-pdf')}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <DocumentIcon className="h-8 w-8 text-blue-600 mr-4" />
              <div className="text-left">
                <h4 className="font-medium text-gray-900">Upload PDF Files</h4>
                <p className="text-sm text-gray-600">Use the web-based upload system</p>
              </div>
            </button>
            
            <button
              onClick={() => {
                navigator.clipboard.writeText('ClaimDocument-CLM-001-5.pdf')
                alert('Suggested filename copied to clipboard!')
              }}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <CheckCircleIcon className="h-8 w-8 text-green-600 mr-4" />
              <div className="text-left">
                <h4 className="font-medium text-gray-900">Get Suggested Filename</h4>
                <p className="text-sm text-gray-600">Copy a Chrome-extension-friendly filename</p>
              </div>
            </button>
          </div>
        </div>

        {/* Additional Help */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <div className="flex items-start">
            <InformationCircleIcon className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-1">Need More Help?</h4>
              <p className="text-sm text-blue-800">
                If you continue to have issues, try using the web-based PDF upload system which completely bypasses Chrome extension limitations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

