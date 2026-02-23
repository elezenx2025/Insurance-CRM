'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function KYCPage() {
  const router = useRouter()

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
                <span className="ml-4 text-gray-900 font-medium">KYC Documents</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      {/* Page header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">KYC Documents</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage KYC verification documents for customers
            </p>
          </div>
        </div>
      </div>

      {/* KYC Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">KYC Document Requirements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">Identity Proof</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Aadhaar Card</li>
              <li>• PAN Card</li>
              <li>• Driving License</li>
              <li>• Passport</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">Address Proof</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Bank Statement</li>
              <li>• Utility Bill</li>
              <li>• Rental Agreement</li>
              <li>• Property Documents</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Coming Soon */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
        <div className="text-6xl mb-4">📄</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">KYC Document Management</h3>
        <p className="text-gray-600 mb-4">
          Document upload and management functionality will be available soon.
        </p>
        <button
          onClick={() => router.push('/dashboard')}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Dashboard
        </button>
      </div>
    </div>
  )
}