'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon, ChartBarIcon, CalendarIcon, UserIcon } from '@heroicons/react/24/outline'

export default function RenewalTrackingPage() {
  const router = useRouter()

  const handleBack = () => {
    router.push('/dashboard/customer-retention')
  }

  const mockData = [
    {
      id: '1',
      customerName: 'John Doe',
      policyNumber: 'POL-001',
      policyType: 'Motor Insurance',
      expiryDate: '2024-12-31',
      renewalStatus: 'Pending',
      lastContact: '2024-01-15',
      premiumAmount: 15000,
      agentName: 'Agent Smith'
    },
    {
      id: '2',
      customerName: 'Jane Smith',
      policyNumber: 'POL-002',
      policyType: 'Health Insurance',
      expiryDate: '2024-11-30',
      renewalStatus: 'Contacted',
      lastContact: '2024-01-20',
      premiumAmount: 25000,
      agentName: 'Agent Johnson'
    },
    {
      id: '3',
      customerName: 'Bob Wilson',
      policyNumber: 'POL-003',
      policyType: 'Life Insurance',
      expiryDate: '2024-10-15',
      renewalStatus: 'Renewed',
      lastContact: '2024-01-10',
      premiumAmount: 35000,
      agentName: 'Agent Brown'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Renewed':
        return 'bg-green-100 text-green-800'
      case 'Contacted':
        return 'bg-yellow-100 text-yellow-800'
      case 'Pending':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
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
              Back to Dashboard
            </button>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Renewal Tracking</h1>
          <p className="text-gray-600 mt-2">
            Track and manage policy renewals and customer retention
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Policies</p>
                <p className="text-2xl font-bold text-gray-900">1,247</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CalendarIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Renewed</p>
                <p className="text-2xl font-bold text-gray-900">892</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <UserIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">245</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Expired</p>
                <p className="text-2xl font-bold text-gray-900">110</p>
              </div>
            </div>
          </div>
        </div>

        {/* Renewal Tracking Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Policy Renewal Tracking</h2>
            <p className="text-sm text-gray-600 mt-1">
              Monitor policy renewals and customer retention status
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Policy Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiry Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Premium
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Agent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Contact
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.customerName}</div>
                        <div className="text-sm text-gray-500">{item.policyNumber}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.policyType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.expiryDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.renewalStatus)}`}>
                        {item.renewalStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">₹{item.premiumAmount.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.agentName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.lastContact}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}








