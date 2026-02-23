'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

// Sample quotation data - in a real app, this would come from an API
const getQuotationData = (id: string) => {
  const quotations = {
    'Q-1001': {
      id: 'Q-1001',
      customerName: 'Rohit Sharma',
      customerId: 'CUST-001',
      leadId: 'LEAD-101',
      leadName: 'Rohit Sharma',
      mobile: '9876543210',
      pan: 'ABCDE1234F',
      aadhaar: '1234 5678 9012',
      insuranceType: 'Health',
      status: 'pending',
      createdAt: '2025-05-01',
      email: 'rohit.sharma@email.com',
      address: '123 Main Street, Mumbai',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      policyDetails: {
        sumAssured: '₹5,00,000',
        premium: '₹12,000',
        term: '1 Year',
        coverage: ['Hospitalization', 'Surgery', 'Medicines', 'Emergency Care']
      }
    },
    'Q-1002': {
      id: 'Q-1002',
      customerName: 'Priya Verma',
      customerId: 'CUST-002',
      leadId: 'LEAD-102',
      leadName: 'Priya Verma',
      mobile: '9988776655',
      pan: 'PQRSV5678L',
      aadhaar: '2345 6789 0123',
      insuranceType: 'Motor',
      status: 'pending',
      createdAt: '2025-06-12',
      email: 'priya.verma@email.com',
      address: '456 Park Avenue, Delhi',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001',
      policyDetails: {
        sumAssured: '₹8,00,000',
        premium: '₹15,000',
        term: '1 Year',
        coverage: ['Third Party Liability', 'Own Damage', 'Personal Accident', 'Roadside Assistance'],
        vehicleDetails: {
          make: 'Honda City',
          model: 'VX',
          year: '2023',
          registrationNumber: 'DL-01-AB-1234',
          engineNumber: 'H123456789',
          chassisNumber: 'CH123456789'
        }
      }
    },
    'Q-1004': {
      id: 'Q-1004',
      customerName: 'Meera Iyer',
      customerId: 'CUST-004',
      leadId: 'LEAD-104',
      leadName: 'Meera Iyer',
      mobile: '9090909090',
      insuranceType: 'Fire',
      status: 'pending',
      createdAt: '2025-06-28',
      email: 'meera.iyer@email.com',
      address: '789 Business Complex, Chennai',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600001',
      policyDetails: {
        sumAssured: '₹50,00,000',
        premium: '₹25,000',
        term: '1 Year',
        coverage: ['Fire Damage', 'Lightning', 'Explosion', 'Riot & Strike'],
        propertyDetails: {
          propertyType: 'Commercial Building',
          constructionType: 'RCC',
          builtUpArea: '5000 sq ft',
          location: 'Chennai Industrial Area'
        }
      }
    }
  }
  
  return quotations[id as keyof typeof quotations] || quotations['Q-1001']
}

type PageParams = { params: Promise<{ id: string }> }

export default function QuotationViewPage({ params }: PageParams) {
  const router = useRouter()
  const [resolvedParams, setResolvedParams] = React.useState<{ id: string } | null>(null)
  const [sampleQuotation, setSampleQuotation] = React.useState(getQuotationData('Q-1001'))

  React.useEffect(() => {
    let isMounted = true
    params.then(value => {
      if (isMounted) {
        setResolvedParams(value)
        setSampleQuotation(getQuotationData(value.id))
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
  const panValue = 'pan' in sampleQuotation ? sampleQuotation.pan : 'N/A'
  const aadhaarValue = 'aadhaar' in sampleQuotation ? sampleQuotation.aadhaar : 'N/A'
  const vehicleDetails =
    'vehicleDetails' in sampleQuotation.policyDetails ? sampleQuotation.policyDetails.vehicleDetails : null
  const propertyDetails =
    'propertyDetails' in sampleQuotation.policyDetails ? sampleQuotation.policyDetails.propertyDetails : null

  const handleEdit = () => {
    router.push(`/dashboard/presale/quotation/edit/${quotationId}`)
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this quotation?')) {
      toast.success('Quotation deleted successfully')
      router.push('/dashboard/presale/quotation')
    }
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
            <h1 className="text-2xl font-bold text-gray-900">Quotation Details</h1>
            <p className="text-gray-600">View quotation information</p>
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
        {/* Customer Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Customer Name</label>
              <p className="mt-1 text-sm text-gray-900">{sampleQuotation.customerName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Customer ID</label>
              <p className="mt-1 text-sm text-gray-900">{sampleQuotation.customerId}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Lead ID</label>
              <p className="mt-1 text-sm text-gray-900">{sampleQuotation.leadId}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
              <p className="mt-1 text-sm text-gray-900">{sampleQuotation.mobile}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-sm text-gray-900">{sampleQuotation.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">PAN Number</label>
              <p className="mt-1 text-sm text-gray-900">{panValue}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Aadhaar Number</label>
              <p className="mt-1 text-sm text-gray-900">{aadhaarValue}</p>
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <p className="mt-1 text-sm text-gray-900">{sampleQuotation.address}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <p className="mt-1 text-sm text-gray-900">{sampleQuotation.city}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">State</label>
              <p className="mt-1 text-sm text-gray-900">{sampleQuotation.state}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Pincode</label>
              <p className="mt-1 text-sm text-gray-900">{sampleQuotation.pincode}</p>
            </div>
          </div>
        </div>

        {/* Policy Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Policy Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Insurance Type</label>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {sampleQuotation.insuranceType}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Sum Assured</label>
              <p className="mt-1 text-sm text-gray-900">{sampleQuotation.policyDetails.sumAssured}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Premium</label>
              <p className="mt-1 text-sm text-gray-900">{sampleQuotation.policyDetails.premium}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Term</label>
              <p className="mt-1 text-sm text-gray-900">{sampleQuotation.policyDetails.term}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                {sampleQuotation.status}
              </span>
            </div>
          </div>
        </div>

        {/* Coverage Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Coverage Details</h2>
          <div className="space-y-2">
            {sampleQuotation.policyDetails.coverage.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="h-2 w-2 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-900">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Vehicle Details for Motor Insurance */}
        {sampleQuotation.insuranceType === 'Motor' && vehicleDetails && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Make & Model</label>
                <p className="mt-1 text-sm text-gray-900">
                  {vehicleDetails.make} {vehicleDetails.model}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Year of Manufacture</label>
                <p className="mt-1 text-sm text-gray-900">{vehicleDetails.year}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Registration Number</label>
                <p className="mt-1 text-sm text-gray-900">{vehicleDetails.registrationNumber}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Engine Number</label>
                <p className="mt-1 text-sm text-gray-900">{vehicleDetails.engineNumber}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Chassis Number</label>
                <p className="mt-1 text-sm text-gray-900">{vehicleDetails.chassisNumber}</p>
              </div>
            </div>
          </div>
        )}

        {/* Property Details for Fire Insurance */}
        {sampleQuotation.insuranceType === 'Fire' && propertyDetails && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Property Type</label>
                <p className="mt-1 text-sm text-gray-900">{propertyDetails.propertyType}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Construction Type</label>
                <p className="mt-1 text-sm text-gray-900">{propertyDetails.constructionType}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Built-up Area</label>
                <p className="mt-1 text-sm text-gray-900">{propertyDetails.builtUpArea}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <p className="mt-1 text-sm text-gray-900">{propertyDetails.location}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quotation Timeline */}
      <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quotation Timeline</h2>
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="h-3 w-3 bg-blue-500 rounded-full mr-4"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">Quotation Created</p>
              <p className="text-xs text-gray-500">{sampleQuotation.createdAt}</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 bg-gray-300 rounded-full mr-4"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">Pending Review</p>
              <p className="text-xs text-gray-500">Awaiting customer response</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
