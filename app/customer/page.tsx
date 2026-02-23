'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLocation } from '@/contexts/LocationContext'
import { 
  DocumentTextIcon, 
  ShieldCheckIcon, 
  CreditCardIcon,
  BellIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'

export default function CustomerDashboard() {
  const { location, region, localAgents, isLoading, error, requestLocation } = useLocation()
  const [customerData, setCustomerData] = useState({
    name: 'John Doe',
    policies: [
      {
        id: 'POL-001',
        type: 'Auto Insurance',
        status: 'Active',
        expiryDate: '2024-12-15',
        premium: 1200,
        canRenew: true
      },
      {
        id: 'POL-002', 
        type: 'Home Insurance',
        status: 'Active',
        expiryDate: '2024-08-20',
        premium: 800,
        canRenew: false
      }
    ],
    claims: [
      {
        id: 'CLM-001',
        type: 'Auto Claim',
        status: 'Approved',
        amount: 2500,
        date: '2024-01-15'
      }
    ]
  })

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

  return (
    <div className="space-y-6">
      {/* Location Status */}
      {isLoading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
            <span className="text-blue-800">Detecting your location...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ExclamationCircleIcon className="h-5 w-5 text-yellow-600 mr-3" />
              <div>
                <p className="text-yellow-800 font-medium">Location Access Required</p>
                <p className="text-yellow-700 text-sm">{error}</p>
              </div>
            </div>
            <button
              onClick={requestLocation}
              className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Location Info */}
      {location && region && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <MapPinIcon className="h-8 w-8 text-blue-600" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Serving {location.city}, {location.state}
                </h2>
                <p className="text-gray-600">
                  {region.name} • Risk Level: {region.riskLevel.charAt(0).toUpperCase() + region.riskLevel.slice(1)}
                </p>
                <p className="text-sm text-gray-500">
                  {localAgents.length} local agents available • Average premium: ${region.averagePremium}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Regional Coverage</div>
              <div className="flex flex-wrap gap-1 mt-1">
                {region.coverageOptions.slice(0, 3).map((option, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    {option}
                  </span>
                ))}
                {region.coverageOptions.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    +{region.coverageOptions.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {customerData.name}!
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your insurance policies and renewals
              {location && (
                <span className="ml-2 text-blue-600">• Serving {location.city}, {location.state}</span>
              )}
            </p>
          </div>
          <div className="flex space-x-3">
            <Link
              href="/customer/renew"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Renew Policy
            </Link>
            <Link
              href="/customer/buy"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Buy New Policy
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/customer/renew" className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <ShieldCheckIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Renew Policy</h3>
              <p className="text-gray-600">Extend your existing coverage</p>
            </div>
          </div>
        </Link>

        <Link href="/customer/buy" className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <CreditCardIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Buy New Policy</h3>
              <p className="text-gray-600">Get comprehensive coverage</p>
            </div>
          </div>
        </Link>

        <Link href="/customer/claims" className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <BellIcon className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">File Claim</h3>
              <p className="text-gray-600">Submit a new claim</p>
            </div>
          </div>
        </Link>
      </div>

      {/* My Policies */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">My Policies</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {customerData.policies.map((policy) => (
            <div key={policy.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <DocumentTextIcon className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{policy.type}</h3>
                    <p className="text-sm text-gray-600">Policy ID: {policy.id}</p>
                    <p className="text-sm text-gray-600">Expires: {policy.expiryDate}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(policy.status)}`}>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(policy.status)}
                      <span>{policy.status}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      {location?.currencySymbol || '₹'}{policy.premium}
                    </p>
                    <p className="text-sm text-gray-600">Annual Premium</p>
                  </div>
                  {policy.canRenew && (
                    <Link
                      href={`/customer/renew?policy=${policy.id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Renew
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Claims */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Claims</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {customerData.claims.map((claim) => (
            <div key={claim.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <BellIcon className="h-8 w-8 text-orange-600" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{claim.type}</h3>
                    <p className="text-sm text-gray-600">Claim ID: {claim.id}</p>
                    <p className="text-sm text-gray-600">Date: {claim.date}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(claim.status)}`}>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(claim.status)}
                      <span>{claim.status}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      {location?.currencySymbol || '₹'}{claim.amount}
                    </p>
                    <p className="text-sm text-gray-600">Claim Amount</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Local Agents Section */}
      {localAgents.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Local Agents in Your Area</h2>
              <div className="flex items-center text-sm text-gray-600">
                <UserGroupIcon className="h-4 w-4 mr-1" />
                {localAgents.length} agents available
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {localAgents.slice(0, 6).map((agent) => (
                <div key={agent.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900">{agent.name}</h3>
                      <p className="text-sm text-gray-600">{agent.location}</p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm font-medium ml-1">{agent.rating}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Experience:</span> {agent.experience} years
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Phone:</span> {agent.phone}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {agent.specialties.slice(0, 2).map((specialty: string, index: number) => (
                        <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                          {specialty}
                        </span>
                      ))}
                      {agent.specialties.length > 2 && (
                        <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded">
                          +{agent.specialties.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <button className="w-full bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors">
                      Contact Agent
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {localAgents.length > 6 && (
              <div className="mt-4 text-center">
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All {localAgents.length} Local Agents →
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
