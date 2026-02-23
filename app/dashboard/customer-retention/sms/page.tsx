'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon, ChatBubbleLeftRightIcon, PhoneIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

export default function SMSPage() {
  const router = useRouter()
  const [message, setMessage] = useState('')
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])

  const handleBack = () => {
    router.push('/dashboard/customer-retention')
  }

  const mockCustomers = [
    {
      id: '1',
      name: 'John Doe',
      phone: '+91 98765 43210',
      policyNumber: 'POL-001',
      status: 'Active'
    },
    {
      id: '2',
      name: 'Jane Smith',
      phone: '+91 98765 43211',
      policyNumber: 'POL-002',
      status: 'Active'
    },
    {
      id: '3',
      name: 'Bob Wilson',
      phone: '+91 98765 43212',
      policyNumber: 'POL-003',
      status: 'Expired'
    }
  ]

  const handleCustomerSelect = (customerId: string) => {
    setSelectedCustomers(prev => 
      prev.includes(customerId) 
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    )
  }

  const handleSendSMS = () => {
    if (selectedCustomers.length === 0) {
      alert('Please select at least one customer')
      return
    }
    if (!message.trim()) {
      alert('Please enter a message')
      return
    }
    
    // Mock SMS sending
    alert(`SMS sent to ${selectedCustomers.length} customer(s)`)
    setMessage('')
    setSelectedCustomers([])
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
          <h1 className="text-2xl font-bold text-gray-900">SMS Campaign</h1>
          <p className="text-gray-600 mt-2">
            Send SMS messages to customers for renewal reminders and updates
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* SMS Composer */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Compose SMS</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your SMS message here..."
                  maxLength={160}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {message.length}/160 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quick Templates
                </label>
                <div className="space-y-2">
                  <button
                    onClick={() => setMessage("Dear Customer, your policy is expiring soon. Please renew to continue coverage. Contact us for assistance.")}
                    className="w-full text-left p-2 text-sm text-blue-600 hover:bg-blue-50 rounded border border-blue-200"
                  >
                    Renewal Reminder
                  </button>
                  <button
                    onClick={() => setMessage("Thank you for choosing our insurance services. We appreciate your trust in us.")}
                    className="w-full text-left p-2 text-sm text-green-600 hover:bg-green-50 rounded border border-green-200"
                  >
                    Thank You Message
                  </button>
                  <button
                    onClick={() => setMessage("Your claim has been processed successfully. You will receive the payment within 3-5 business days.")}
                    className="w-full text-left p-2 text-sm text-purple-600 hover:bg-purple-50 rounded border border-purple-200"
                  >
                    Claim Update
                  </button>
                </div>
              </div>

              <button
                onClick={handleSendSMS}
                disabled={selectedCustomers.length === 0 || !message.trim()}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Send SMS ({selectedCustomers.length} recipients)
              </button>
            </div>
          </div>

          {/* Customer Selection */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Customers</h2>
            
            <div className="space-y-3">
              {mockCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedCustomers.includes(customer.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleCustomerSelect(customer.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedCustomers.includes(customer.id)}
                        onChange={() => handleCustomerSelect(customer.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                        <div className="text-sm text-gray-500">{customer.phone}</div>
                        <div className="text-xs text-gray-400">{customer.policyNumber}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        customer.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {customer.status}
                      </span>
                      <PhoneIcon className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center text-sm text-gray-600">
                <CheckCircleIcon className="h-4 w-4 mr-2" />
                {selectedCustomers.length} customer(s) selected
              </div>
            </div>
          </div>
        </div>

        {/* SMS History */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent SMS Campaigns</h2>
            <p className="text-sm text-gray-600 mt-1">
              Track your SMS communication history
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Renewal Reminder Campaign</div>
                    <div className="text-sm text-gray-500">Sent to 25 customers on Jan 15, 2024</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="text-green-600">Delivered: 23</span> | 
                  <span className="text-red-600 ml-2">Failed: 2</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <ChatBubbleLeftRightIcon className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Thank You Campaign</div>
                    <div className="text-sm text-gray-500">Sent to 15 customers on Jan 10, 2024</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="text-green-600">Delivered: 15</span> | 
                  <span className="text-red-600 ml-2">Failed: 0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}








