'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon, PencilIcon, TrashIcon, PhoneIcon, EnvelopeIcon, CalendarIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

// Sample lead data - in a real app, this would come from an API
const sampleLead = {
  id: 'LEAD-101',
  leadType: 'INDIVIDUAL',
  firstName: 'Rohit',
  lastName: 'Sharma',
  mobileNumber: '9876543210',
  emailAddress: 'rohit.sharma@email.com',
  source: 'Website',
  productInterest: 'Health Insurance',
  estimatedValue: 50000,
  status: 'NEW',
  createdAt: '2025-01-15',
  lastContact: '2025-01-15',
  notes: 'Interested in comprehensive health coverage for family',
  address: '123 Main Street, Mumbai',
  city: 'Mumbai',
  state: 'Maharashtra',
  pincode: '400001',
  country: 'India'
}

type PageParams = { params: Promise<{ id: string }> }

export default function LeadViewPage({ params }: PageParams) {
  const router = useRouter()
  const [resolvedParams, setResolvedParams] = React.useState<{ id: string } | null>(null)

  React.useEffect(() => {
    let isMounted = true
    params.then(value => {
      if (isMounted) {
        setResolvedParams(value)
      }
    })
    return () => {
      isMounted = false
    }
  }, [params])

  if (!resolvedParams) {
    return <div className="p-6">Loading lead...</div>
  }

  const leadId = resolvedParams.id

  const handleEdit = () => {
    router.push(`/dashboard/presale/lead-generation/edit/${leadId}`)
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this lead?')) {
      toast.success('Lead deleted successfully')
      router.push('/dashboard/presale/lead-generation')
    }
  }

  const handleBack = () => {
    router.push('/dashboard/presale/lead-generation')
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Leads
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lead Details</h1>
            <p className="text-gray-600">View lead information</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleEdit}
            className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100"
          >
            <PencilIcon className="h-4 w-4 mr-2" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100"
          >
            <TrashIcon className="h-4 w-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Lead Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Lead ID</label>
              <p className="mt-1 text-sm text-gray-900">{sampleLead.id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Lead Type</label>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {sampleLead.leadType}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <p className="mt-1 text-sm text-gray-900">{sampleLead.firstName} {sampleLead.lastName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
              <div className="flex items-center mt-1">
                <PhoneIcon className="h-4 w-4 text-gray-400 mr-2" />
                <p className="text-sm text-gray-900">{sampleLead.mobileNumber}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <div className="flex items-center mt-1">
                <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-2" />
                <p className="text-sm text-gray-900">{sampleLead.emailAddress}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {sampleLead.status}
              </span>
            </div>
          </div>
        </div>

        {/* Lead Source & Interest */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Lead Source & Interest</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Source</label>
              <p className="mt-1 text-sm text-gray-900">{sampleLead.source}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Product Interest</label>
              <p className="mt-1 text-sm text-gray-900">{sampleLead.productInterest}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Estimated Value</label>
              <p className="mt-1 text-sm text-gray-900">₹{sampleLead.estimatedValue?.toLocaleString()}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Created Date</label>
              <div className="flex items-center mt-1">
                <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                <p className="text-sm text-gray-900">{sampleLead.createdAt}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Contact</label>
              <div className="flex items-center mt-1">
                <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                <p className="text-sm text-gray-900">{sampleLead.lastContact}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <p className="mt-1 text-sm text-gray-900">{sampleLead.address}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <p className="mt-1 text-sm text-gray-900">{sampleLead.city}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">State</label>
                <p className="mt-1 text-sm text-gray-900">{sampleLead.state}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Pincode</label>
                <p className="mt-1 text-sm text-gray-900">{sampleLead.pincode}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Country</label>
                <p className="mt-1 text-sm text-gray-900">{sampleLead.country}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Notes & Comments */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Notes & Comments</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Lead Notes</label>
              <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                {sampleLead.notes}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Follow-up Required</label>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Yes
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Lead Timeline */}
      <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Lead Timeline</h2>
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="h-3 w-3 bg-green-500 rounded-full mr-4"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">Lead Created</p>
              <p className="text-xs text-gray-500">{sampleLead.createdAt}</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 bg-blue-500 rounded-full mr-4"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">Initial Contact Made</p>
              <p className="text-xs text-gray-500">{sampleLead.lastContact}</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 bg-gray-300 rounded-full mr-4"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">Follow-up Scheduled</p>
              <p className="text-xs text-gray-500">Pending</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

