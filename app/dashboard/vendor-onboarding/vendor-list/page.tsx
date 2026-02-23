'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon, PencilIcon, EyeIcon, TrashIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface Vendor {
  id: string
  vendorName: string
  contactPersonName: string
  email: string
  mobileNo: string
  city: string
  state: string
  contractFor: string
  contractPeriodFrom: string
  contractPeriodTo: string
  status: string
}

export default function VendorListPage() {
  const router = useRouter()
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [filterService, setFilterService] = useState('ALL')

  useEffect(() => {
    fetchVendors()
  }, [])

  const fetchVendors = async () => {
    try {
      // Mock data
      const mockVendors: Vendor[] = [
        {
          id: '1',
          vendorName: 'TeleConnect Solutions Pvt Ltd',
          contactPersonName: 'Rajesh Kumar',
          email: 'rajesh@teleconnect.com',
          mobileNo: '9876543210',
          city: 'Mumbai',
          state: 'Maharashtra',
          contractFor: 'Calling Solution',
          contractPeriodFrom: '2024-01-01',
          contractPeriodTo: '2025-12-31',
          status: 'Active'
        },
        {
          id: '2',
          vendorName: 'SMS Gateway India',
          contactPersonName: 'Priya Sharma',
          email: 'priya@smsgateway.in',
          mobileNo: '9876543211',
          city: 'Bangalore',
          state: 'Karnataka',
          contractFor: 'SMS',
          contractPeriodFrom: '2024-03-01',
          contractPeriodTo: '2025-02-28',
          status: 'Active'
        },
        {
          id: '3',
          vendorName: 'WhatsApp Business Solutions',
          contactPersonName: 'Amit Patel',
          email: 'amit@whatsappbiz.com',
          mobileNo: '9876543212',
          city: 'Ahmedabad',
          state: 'Gujarat',
          contractFor: 'WhatsApp',
          contractPeriodFrom: '2024-02-15',
          contractPeriodTo: '2025-02-14',
          status: 'Active'
        },
        {
          id: '4',
          vendorName: 'MailChimp India Services',
          contactPersonName: 'Sneha Reddy',
          email: 'sneha@mailchimp.in',
          mobileNo: '9876543213',
          city: 'Hyderabad',
          state: 'Telangana',
          contractFor: 'Bulk Email',
          contractPeriodFrom: '2024-01-15',
          contractPeriodTo: '2024-12-31',
          status: 'Expiring Soon'
        },
      ]
      
      setVendors(mockVendors)
      setLoading(false)
    } catch (error) {
      toast.error('Failed to fetch vendors')
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this vendor?')) {
      toast.success('Vendor deleted successfully')
      fetchVendors()
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800'
      case 'Expiring Soon':
        return 'bg-orange-100 text-orange-800'
      case 'Expired':
        return 'bg-red-100 text-red-800'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/dashboard/vendor-onboarding')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Vendor Onboarding
          </button>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vendor List</h1>
            <p className="text-gray-600 mt-2">
              View and manage all registered vendors
            </p>
          </div>
          <button
            onClick={() => router.push('/dashboard/vendor-onboarding/add-vendor')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Vendor
          </button>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Filter by Service:</label>
            <select
              value={filterService}
              onChange={(e) => setFilterService(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Services</option>
              <option value="Calling Solution">Calling Solution</option>
              <option value="SMS">SMS</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Bulk Email">Bulk Email</option>
              <option value="Networking">Networking</option>
              <option value="Cyber Security">Cyber Security</option>
              <option value="Audit">Audit</option>
            </select>
          </div>
        </div>

        {/* Vendors Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendor Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Person
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contract Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{vendor.vendorName}</div>
                      <div className="text-sm text-gray-500">{vendor.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{vendor.contactPersonName}</div>
                      <div className="text-sm text-gray-500">{vendor.mobileNo}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {vendor.city}, {vendor.state}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {vendor.contractFor}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>{new Date(vendor.contractPeriodFrom).toLocaleDateString('en-IN')}</div>
                      <div className="text-gray-500">to {new Date(vendor.contractPeriodTo).toLocaleDateString('en-IN')}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(vendor.status)}`}>
                        {vendor.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => router.push(`/dashboard/vendor-onboarding/vendor-details/${vendor.id}`)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View details"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => router.push(`/dashboard/vendor-onboarding/edit-vendor/${vendor.id}`)}
                          className="text-green-600 hover:text-green-900"
                          title="Edit vendor"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(vendor.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete vendor"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
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




