'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLocation } from '@/contexts/LocationContext'
import { 
  BellIcon, 
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  PlusIcon,
  EyeIcon,
  PaperClipIcon
} from '@heroicons/react/24/outline'

export default function MyClaims() {
  const { location } = useLocation()
  const [claims, setClaims] = useState([
    {
      id: 'CLM-001',
      type: 'Auto Claim',
      status: 'Approved',
      amount: 2500,
      submittedDate: '2024-01-15',
      approvedDate: '2024-01-20',
      policyId: 'POL-001',
      description: 'Vehicle damage from accident',
      documents: ['Accident Report', 'Repair Estimate', 'Photos']
    },
    {
      id: 'CLM-002',
      type: 'Home Claim',
      status: 'Under Review',
      amount: 1500,
      submittedDate: '2024-02-10',
      policyId: 'POL-002',
      description: 'Water damage from pipe burst',
      documents: ['Damage Photos', 'Repair Quote']
    },
    {
      id: 'CLM-003',
      type: 'Health Claim',
      status: 'Denied',
      amount: 800,
      submittedDate: '2024-01-05',
      policyId: 'POL-003',
      description: 'Medical expenses for surgery',
      documents: ['Medical Bills', 'Doctor Certificate'],
      reason: 'Pre-existing condition not covered'
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'text-green-600 bg-green-100'
      case 'Under Review': return 'text-yellow-600 bg-yellow-100'
      case 'Pending': return 'text-blue-600 bg-blue-100'
      case 'Denied': return 'text-red-600 bg-red-100'
      case 'Settled': return 'text-purple-600 bg-purple-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'Under Review': return <ClockIcon className="h-5 w-5 text-yellow-500" />
      case 'Pending': return <ClockIcon className="h-5 w-5 text-blue-500" />
      case 'Denied': return <XCircleIcon className="h-5 w-5 text-red-500" />
      case 'Settled': return <CheckCircleIcon className="h-5 w-5 text-purple-500" />
      default: return <ClockIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Claims</h1>
          <p className="text-gray-600 mt-1">Track and manage your insurance claims</p>
        </div>
        <Link
          href="/customer/file-claim"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <PlusIcon className="h-4 w-4" />
          <span>File New Claim</span>
        </Link>
      </div>

      {/* Claims Cards */}
      <div className="space-y-6">
        {claims.map((claim) => (
          <div key={claim.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <BellIcon className="h-12 w-12 text-orange-600 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{claim.type}</h3>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(claim.status)}`}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(claim.status)}
                        <span>{claim.status}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Claim ID: <span className="font-medium">{claim.id}</span></p>
                      <p className="text-sm text-gray-600">Policy ID: <span className="font-medium">{claim.policyId}</span></p>
                      <p className="text-sm text-gray-600">Submitted: <span className="font-medium">{formatDate(claim.submittedDate)}</span></p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        Amount: <span className="font-medium">
                          {location?.currencySymbol || '₹'}{claim.amount}
                        </span>
                      </p>
                      {claim.approvedDate && (
                        <p className="text-sm text-gray-600">Approved: <span className="font-medium">{formatDate(claim.approvedDate)}</span></p>
                      )}
                      {claim.reason && (
                        <p className="text-sm text-red-600">Reason: <span className="font-medium">{claim.reason}</span></p>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Description:</strong> {claim.description}
                    </p>
                  </div>

                  {/* Documents */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Attached Documents:</h4>
                    <div className="flex flex-wrap gap-2">
                      {claim.documents.map((doc, index) => (
                        <div key={index} className="flex items-center space-x-1 px-2 py-1 bg-gray-50 text-gray-700 text-xs rounded-md">
                          <PaperClipIcon className="h-3 w-3" />
                          <span>{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end space-y-3">
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    {location?.currencySymbol || '₹'}{claim.amount}
                  </p>
                  <p className="text-sm text-gray-600">Claim Amount</p>
                </div>
                
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <EyeIcon className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <DocumentTextIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {claims.length === 0 && (
        <div className="text-center py-12">
          <BellIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No claims found</h3>
          <p className="text-gray-600 mb-6">You haven't filed any claims yet.</p>
          <Link
            href="/customer/file-claim"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            File Your First Claim
          </Link>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Claim Process</h4>
            <p className="text-sm text-gray-600 mb-3">
              Learn about our claim process and what documents you need.
            </p>
            <Link href="/help/claims" className="text-blue-600 hover:text-blue-700 text-sm">
              View Claim Guide →
            </Link>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Contact Support</h4>
            <p className="text-sm text-gray-600 mb-3">
              Get help with your claims or speak to our support team.
            </p>
            <Link href="/contact" className="text-blue-600 hover:text-blue-700 text-sm">
              Contact Us →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
