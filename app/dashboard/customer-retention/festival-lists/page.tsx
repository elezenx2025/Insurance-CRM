'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon, CalendarIcon, GiftIcon, StarIcon, HeartIcon } from '@heroicons/react/24/outline'

export default function FestivalListsPage() {
  const router = useRouter()

  const handleBack = () => {
    router.push('/dashboard/customer-retention')
  }

  const mockFestivals = [
    {
      id: '1',
      name: 'Diwali',
      date: '2024-11-01',
      type: 'National',
      status: 'Upcoming',
      campaigns: 3,
      customers: 1250,
      offers: ['Premium Discount 15%', 'Free Add-on Coverage', 'Cashback on Renewal']
    },
    {
      id: '2',
      name: 'Holi',
      date: '2024-03-25',
      type: 'National',
      status: 'Completed',
      campaigns: 2,
      customers: 890,
      offers: ['Colorful Coverage', 'Festival Bonus', 'Special Discount']
    },
    {
      id: '3',
      name: 'Eid',
      date: '2024-04-10',
      type: 'Religious',
      status: 'Upcoming',
      campaigns: 1,
      customers: 650,
      offers: ['Blessing Coverage', 'Community Discount', 'Charity Initiative']
    },
    {
      id: '4',
      name: 'Christmas',
      date: '2024-12-25',
      type: 'Religious',
      status: 'Upcoming',
      campaigns: 4,
      customers: 2100,
      offers: ['Gift Coverage', 'Holiday Bonus', 'Family Discount', 'Santa Special']
    },
    {
      id: '5',
      name: 'New Year',
      date: '2025-01-01',
      type: 'National',
      status: 'Upcoming',
      campaigns: 2,
      customers: 1800,
      offers: ['New Year New Coverage', 'Resolution Discount', 'Fresh Start Bonus']
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Upcoming':
        return 'bg-blue-100 text-blue-800'
      case 'Active':
        return 'bg-green-100 text-green-800'
      case 'Completed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'National':
        return 'bg-purple-100 text-purple-800'
      case 'Religious':
        return 'bg-orange-100 text-orange-800'
      case 'Regional':
        return 'bg-pink-100 text-pink-800'
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
          <h1 className="text-2xl font-bold text-gray-900">Festival Lists & Campaigns</h1>
          <p className="text-gray-600 mt-2">
            Manage festival-based marketing campaigns and customer engagement
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CalendarIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Festivals</p>
                <p className="text-2xl font-bold text-gray-900">15</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <GiftIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <StarIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">6,690</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <HeartIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Engagement Rate</p>
                <p className="text-2xl font-bold text-gray-900">78%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Festival List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Festival Campaigns</h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage festival-based marketing campaigns and special offers
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Festival
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Campaigns
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customers
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Special Offers
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockFestivals.map((festival) => (
                  <tr key={festival.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {festival.name.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{festival.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{festival.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(festival.type)}`}>
                        {festival.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(festival.status)}`}>
                        {festival.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{festival.campaigns}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{festival.customers.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="space-y-1">
                          {festival.offers.map((offer, index) => (
                            <div key={index} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                              {offer}
                            </div>
                          ))}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Campaign Performance */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Festivals</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                <div className="flex items-center">
                  <StarIcon className="h-5 w-5 text-yellow-600 mr-3" />
                  <span className="text-sm font-medium text-gray-900">Diwali</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">1,250 customers</div>
                  <div className="text-xs text-gray-500">3 campaigns</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                <div className="flex items-center">
                  <GiftIcon className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-sm font-medium text-gray-900">Christmas</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">2,100 customers</div>
                  <div className="text-xs text-gray-500">4 campaigns</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                <div className="flex items-center">
                  <HeartIcon className="h-5 w-5 text-purple-600 mr-3" />
                  <span className="text-sm font-medium text-gray-900">New Year</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">1,800 customers</div>
                  <div className="text-xs text-gray-500">2 campaigns</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Statistics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="text-sm font-medium text-blue-900">Total Campaigns</span>
                </div>
                <span className="text-sm font-bold text-blue-900">12</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <GiftIcon className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-sm font-medium text-green-900">Active Campaigns</span>
                </div>
                <span className="text-sm font-bold text-green-900">8</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center">
                  <StarIcon className="h-5 w-5 text-purple-600 mr-3" />
                  <span className="text-sm font-medium text-purple-900">Engagement Rate</span>
                </div>
                <span className="text-sm font-bold text-purple-900">78%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}








