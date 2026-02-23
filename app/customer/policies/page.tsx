'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLocation } from '@/contexts/LocationContext'
import { 
  DocumentTextIcon, 
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  EyeIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'

export default function MyPolicies() {
  const { location } = useLocation()
  const [policies, setPolicies] = useState([
    {
      id: 'POL-001',
      type: 'Auto Insurance',
      status: 'Active',
      expiryDate: '2024-12-15',
      premium: 1200,
      coverage: 'Comprehensive',
      vehicleNumber: 'ABC-1234',
      canRenew: true,
      startDate: '2023-12-15',
      benefits: ['Roadside Assistance', 'Zero Depreciation', 'Engine Protection']
    },
    {
      id: 'POL-002',
      type: 'Home Insurance',
      status: 'Active',
      expiryDate: '2024-08-20',
      premium: 800,
      coverage: 'Fire & Theft',
      propertyAddress: '123 Main Street, City',
      canRenew: false,
      startDate: '2023-08-20',
      benefits: ['Natural Disaster Coverage', 'Personal Belongings', 'Liability Protection']
    },
    {
      id: 'POL-003',
      type: 'Health Insurance',
      status: 'Expired',
      expiryDate: '2024-01-10',
      premium: 2000,
      coverage: 'Individual Health',
      memberCount: 1,
      canRenew: true,
      startDate: '2023-01-10',
      benefits: ['Hospitalization Coverage', 'Pre & Post Hospitalization', 'Day Care Procedures']
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-600 bg-green-100'
      case 'Pending': return 'text-yellow-600 bg-yellow-100'
      case 'Expired': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active': return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'Pending': return <ClockIcon className="h-5 w-5 text-yellow-500" />
      case 'Expired': return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
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
          <h1 className="text-2xl font-bold text-gray-900">My Policies</h1>
          <p className="text-gray-600 mt-1">Manage and view all your insurance policies</p>
        </div>
        <Link
          href="/customer/buy"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Buy New Policy
        </Link>
      </div>

      {/* Policy Cards */}
      <div className="space-y-6">
        {policies.map((policy) => (
          <div key={policy.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <ShieldCheckIcon className="h-12 w-12 text-blue-600 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{policy.type}</h3>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(policy.status)}`}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(policy.status)}
                        <span>{policy.status}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Policy ID: <span className="font-medium">{policy.id}</span></p>
                      <p className="text-sm text-gray-600">Coverage: <span className="font-medium">{policy.coverage}</span></p>
                      <p className="text-sm text-gray-600">Start Date: <span className="font-medium">{formatDate(policy.startDate)}</span></p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Expiry Date: <span className="font-medium">{formatDate(policy.expiryDate)}</span></p>
                      <p className="text-sm text-gray-600">
                        Annual Premium: <span className="font-medium">
                          {location?.currencySymbol || '₹'}{policy.premium}
                        </span>
                      </p>
                      {policy.vehicleNumber && (
                        <p className="text-sm text-gray-600">Vehicle: <span className="font-medium">{policy.vehicleNumber}</span></p>
                      )}
                      {policy.propertyAddress && (
                        <p className="text-sm text-gray-600">Property: <span className="font-medium">{policy.propertyAddress}</span></p>
                      )}
                      {policy.memberCount && (
                        <p className="text-sm text-gray-600">Members: <span className="font-medium">{policy.memberCount}</span></p>
                      )}
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Coverage Benefits:</h4>
                    <div className="flex flex-wrap gap-2">
                      {policy.benefits.map((benefit, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end space-y-3">
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    {location?.currencySymbol || '₹'}{policy.premium}
                  </p>
                  <p className="text-sm text-gray-600">Annual Premium</p>
                </div>
                
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <EyeIcon className="h-5 w-5" />
                  </button>
                  {policy.canRenew && (
                    <Link
                      href={`/customer/renew?policy=${policy.id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <ArrowPathIcon className="h-4 w-4" />
                      <span>Renew</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {policies.length === 0 && (
        <div className="text-center py-12">
          <ShieldCheckIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No policies found</h3>
          <p className="text-gray-600 mb-6">You don't have any insurance policies yet.</p>
          <Link
            href="/customer/buy"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Buy Your First Policy
          </Link>
        </div>
      )}
    </div>
  )
}
