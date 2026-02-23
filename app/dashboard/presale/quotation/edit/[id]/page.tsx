'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon, CheckIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

// Sample quotation data - in a real app, this would come from an API
const getQuotationData = (id: string) => {
  const quotations = {
    'Q-1001': {
      customerName: 'Rohit Sharma',
      mobile: '9876543210',
      email: 'rohit.sharma@email.com',
      address: '123 Main Street, Mumbai',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      insuranceType: 'Health',
      sumAssured: '500000',
      premium: '12000'
    },
    'Q-1002': {
      customerName: 'Priya Verma',
      mobile: '9988776655',
      email: 'priya.verma@email.com',
      address: '456 Park Avenue, Delhi',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001',
      insuranceType: 'Motor',
      sumAssured: '800000',
      premium: '15000'
    },
    'Q-1004': {
      customerName: 'Meera Iyer',
      mobile: '9090909090',
      email: 'meera.iyer@email.com',
      address: '789 Business Complex, Chennai',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600001',
      insuranceType: 'Fire',
      sumAssured: '5000000',
      premium: '25000'
    }
  }
  
  return quotations[id as keyof typeof quotations] || quotations['Q-1001']
}

type PageParams = { params: Promise<{ id: string }> }

export default function QuotationEditPage({ params }: PageParams) {
  const router = useRouter()
  const [resolvedParams, setResolvedParams] = React.useState<{ id: string } | null>(null)
  const [formData, setFormData] = useState(getQuotationData('Q-1001'))

  React.useEffect(() => {
    let isMounted = true
    params.then(value => {
      if (isMounted) {
        setResolvedParams(value)
        setFormData(getQuotationData(value.id))
      }
    })
    return () => {
      isMounted = false
    }
  }, [params])

  if (!resolvedParams) {
    return <div className="p-6">Loading quotation...</div>
  }

  const quotationId = resolvedParams.id

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Quotation updated successfully')
    router.push('/dashboard/presale/quotation')
  }

  const handleBack = () => {
    router.push('/dashboard/presale/quotation')
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
            Back to Quotations
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Quotation</h1>
            <p className="text-gray-600">Update quotation information</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                <input
                  type="text"
                  value={formData.mobile}
                  onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Policy Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Policy Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Type</label>
                <select
                  value={formData.insuranceType}
                  onChange={(e) => setFormData({...formData, insuranceType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Health">Health</option>
                  <option value="Motor">Motor</option>
                  <option value="Life">Life</option>
                  <option value="Fire">Fire</option>
                  <option value="Marine">Marine</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sum Assured (₹)</label>
                <input
                  type="number"
                  value={formData.sumAssured}
                  onChange={(e) => setFormData({...formData, sumAssured: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Premium (₹)</label>
                <input
                  type="number"
                  value={formData.premium}
                  onChange={(e) => setFormData({...formData, premium: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={handleBack}
            className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            <CheckIcon className="h-4 w-4 mr-2" />
            Update Quotation
          </button>
        </div>
      </form>
    </div>
  )
}
