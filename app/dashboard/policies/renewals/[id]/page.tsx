'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
  ArrowLeftIcon,
  UserIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  CurrencyRupeeIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  PencilIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface RenewalDetails {
  id: string
  policyNumber: string
  customerName: string
  customerType: 'INDIVIDUAL' | 'CORPORATE'
  policyType: string
  currentPremium: number
  renewalPremium: number
  expiryDate: string
  renewalDate: string
  status: 'PENDING' | 'IN_PROGRESS' | 'APPROVED' | 'REJECTED' | 'EXPIRED'
  daysToExpiry: number
  assignedTo: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  renewalStage: string
  contactInfo: {
    email: string
    phone: string
    address: string
    city: string
    state: string
    pincode: string
  }
  documents: {
    policyDocument: { status: boolean; uploadDate?: string; fileName?: string }
    kycDocuments: { status: boolean; uploadDate?: string; fileName?: string }
    additionalDocuments: { status: boolean; uploadDate?: string; fileName?: string }
  }
  timeline: Array<{
    date: string
    action: string
    description: string
    user: string
    status: 'completed' | 'pending' | 'failed'
  }>
  contactHistory: Array<{
    date: string
    type: 'CALL' | 'EMAIL' | 'SMS' | 'MEETING'
    description: string
    outcome: string
    nextAction?: string
  }>
  lastContactDate: string
  contactAttempts: number
}

export default function RenewalDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const renewalId = params.id as string

  // Mock data - in real app, fetch based on renewalId
  const [renewalDetails] = useState<RenewalDetails>({
    id: renewalId,
    policyNumber: 'POL/RNW/2025/001',
    customerName: 'Rajesh Kumar',
    customerType: 'INDIVIDUAL',
    policyType: 'MOTOR - Comprehensive',
    currentPremium: 45000,
    renewalPremium: 47250,
    expiryDate: '2025-11-15',
    renewalDate: '2025-11-15',
    status: 'PENDING',
    daysToExpiry: 19,
    assignedTo: 'Priya Sharma',
    priority: 'HIGH',
    renewalStage: 'Customer Contact',
    contactInfo: {
      email: 'rajesh.kumar@email.com',
      phone: '+91 98765 43210',
      address: '123 MG Road, Sector 15',
      city: 'Gurgaon',
      state: 'Haryana',
      pincode: '122001'
    },
    documents: {
      policyDocument: { 
        status: true, 
        uploadDate: '2025-10-20', 
        fileName: 'policy_document.pdf' 
      },
      kycDocuments: { 
        status: true, 
        uploadDate: '2025-10-20', 
        fileName: 'kyc_documents.pdf' 
      },
      additionalDocuments: { 
        status: false 
      }
    },
    timeline: [
      {
        date: '2025-10-27',
        action: 'Renewal Initiated',
        description: 'Renewal process started for policy',
        user: 'System',
        status: 'completed'
      },
      {
        date: '2025-10-26',
        action: 'Premium Calculated',
        description: 'New premium calculated based on current rates',
        user: 'Priya Sharma',
        status: 'completed'
      },
      {
        date: '2025-10-25',
        action: 'Customer Contacted',
        description: 'Initial contact made via phone call',
        user: 'Priya Sharma',
        status: 'completed'
      },
      {
        date: '2025-10-28',
        action: 'Document Verification',
        description: 'Pending additional documents from customer',
        user: 'Priya Sharma',
        status: 'pending'
      }
    ],
    contactHistory: [
      {
        date: '2025-10-25',
        type: 'CALL',
        description: 'Initial renewal discussion',
        outcome: 'Customer interested, requested quote',
        nextAction: 'Send renewal quote via email'
      },
      {
        date: '2025-10-26',
        type: 'EMAIL',
        description: 'Sent renewal quote and documents checklist',
        outcome: 'Email delivered successfully',
        nextAction: 'Follow up in 2 days'
      }
    ],
    lastContactDate: '2025-10-26',
    contactAttempts: 2
  })

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`
    } else if (amount >= 1000000) {
      return `₹${(amount / 1000000).toFixed(1)}M`
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`
    } else {
      return `₹${amount.toLocaleString()}`
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800'
      case 'APPROVED': return 'bg-green-100 text-green-800'
      case 'REJECTED': return 'bg-red-100 text-red-800'
      case 'EXPIRED': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'bg-green-100 text-green-800'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800'
      case 'HIGH': return 'bg-orange-100 text-orange-800'
      case 'CRITICAL': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDaysToExpiryColor = (days: number) => {
    if (days < 0) return 'text-red-600 font-bold'
    if (days <= 7) return 'text-red-600 font-semibold'
    if (days <= 30) return 'text-orange-600 font-medium'
    return 'text-green-600'
  }

  const handleAction = (action: string) => {
    switch (action) {
      case 'contact':
        toast.success('Contact initiated')
        break
      case 'approve':
        toast.success('Renewal approved')
        break
      case 'reject':
        toast.error('Renewal rejected')
        break
      case 'edit':
        router.push(`/dashboard/policies/renewal?edit=${renewalId}`)
        break
      default:
        toast(`Action: ${action}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Renewal Details - {renewalDetails.policyNumber}
                </h1>
                <p className="text-sm text-gray-600">{renewalDetails.customerName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleAction('contact')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <PhoneIcon className="h-4 w-4 mr-2" />
                Contact
              </button>
              <button
                onClick={() => handleAction('edit')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <PencilIcon className="h-4 w-4 mr-2" />
                Edit
              </button>
              <button
                onClick={() => handleAction('approve')}
                className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-green-700"
              >
                <CheckCircleIcon className="h-4 w-4 mr-2" />
                Approve
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Policy Overview */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Policy Overview</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Policy Information</h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-500">Policy Number:</span>
                        <p className="font-medium">{renewalDetails.policyNumber}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Policy Type:</span>
                        <p className="font-medium">{renewalDetails.policyType}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Expiry Date:</span>
                        <p className={`font-medium ${getDaysToExpiryColor(renewalDetails.daysToExpiry)}`}>
                          {new Date(renewalDetails.expiryDate).toLocaleDateString()}
                          <span className="ml-2 text-sm">
                            ({renewalDetails.daysToExpiry < 0 
                              ? `Expired ${Math.abs(renewalDetails.daysToExpiry)} days ago`
                              : `${renewalDetails.daysToExpiry} days left`
                            })
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Premium Details</h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-500">Current Premium:</span>
                        <p className="font-medium">{formatCurrency(renewalDetails.currentPremium)}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Renewal Premium:</span>
                        <p className="font-medium text-green-600">
                          {formatCurrency(renewalDetails.renewalPremium)}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Difference:</span>
                        <p className={`font-medium ${
                          renewalDetails.renewalPremium > renewalDetails.currentPremium 
                            ? 'text-red-600' 
                            : 'text-green-600'
                        }`}>
                          {renewalDetails.renewalPremium > renewalDetails.currentPremium ? '+' : ''}
                          {formatCurrency(renewalDetails.renewalPremium - renewalDetails.currentPremium)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Customer Information</h3>
              </div>
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  {renewalDetails.customerType === 'INDIVIDUAL' ? (
                    <UserIcon className="h-12 w-12 text-gray-400" />
                  ) : (
                    <BuildingOfficeIcon className="h-12 w-12 text-gray-400" />
                  )}
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-gray-900">{renewalDetails.customerName}</h4>
                    <p className="text-sm text-gray-500 mb-4">{renewalDetails.customerType}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm">{renewalDetails.contactInfo.email}</span>
                        </div>
                        <div className="flex items-center">
                          <PhoneIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm">{renewalDetails.contactInfo.phone}</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-start">
                          <MapPinIcon className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                          <div className="text-sm">
                            <p>{renewalDetails.contactInfo.address}</p>
                            <p>{renewalDetails.contactInfo.city}, {renewalDetails.contactInfo.state}</p>
                            <p>{renewalDetails.contactInfo.pincode}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Renewal Timeline</h3>
              </div>
              <div className="p-6">
                <div className="flow-root">
                  <ul className="-mb-8">
                    {renewalDetails.timeline.map((event, eventIdx) => (
                      <li key={eventIdx}>
                        <div className="relative pb-8">
                          {eventIdx !== renewalDetails.timeline.length - 1 ? (
                            <span
                              className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                              aria-hidden="true"
                            />
                          ) : null}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                                event.status === 'completed' 
                                  ? 'bg-green-500' 
                                  : event.status === 'pending'
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500'
                              }`}>
                                {event.status === 'completed' ? (
                                  <CheckCircleIcon className="h-5 w-5 text-white" />
                                ) : event.status === 'pending' ? (
                                  <ClockIcon className="h-5 w-5 text-white" />
                                ) : (
                                  <XCircleIcon className="h-5 w-5 text-white" />
                                )}
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{event.action}</p>
                                <p className="text-sm text-gray-500">{event.description}</p>
                                <p className="text-xs text-gray-400">by {event.user}</p>
                              </div>
                              <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                {new Date(event.date).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Status</h3>
                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-gray-500">Current Status:</span>
                    <div className="mt-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(renewalDetails.status)}`}>
                        {renewalDetails.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Priority:</span>
                    <div className="mt-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(renewalDetails.priority)}`}>
                        {renewalDetails.priority}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Current Stage:</span>
                    <p className="font-medium">{renewalDetails.renewalStage}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Assigned To:</span>
                    <p className="font-medium">{renewalDetails.assignedTo}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Documents</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {Object.entries(renewalDetails.documents).map(([key, doc]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </p>
                          {doc.fileName && (
                            <p className="text-xs text-gray-500">{doc.fileName}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {doc.status ? (
                          <CheckCircleIcon className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircleIcon className="h-5 w-5 text-red-500" />
                        )}
                        {doc.status && (
                          <button className="p-1 text-gray-400 hover:text-blue-600">
                            <ArrowDownTrayIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact History */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Contact History</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {renewalDetails.contactHistory.map((contact, idx) => (
                    <div key={idx} className="border-l-2 border-blue-200 pl-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">
                          {contact.type}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(contact.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{contact.description}</p>
                      <p className="text-sm text-green-600 mt-1">Outcome: {contact.outcome}</p>
                      {contact.nextAction && (
                        <p className="text-sm text-blue-600 mt-1">Next: {contact.nextAction}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}










