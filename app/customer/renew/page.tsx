'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useLocation } from '@/contexts/LocationContext'
import { 
  ShieldCheckIcon, 
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline'

export default function RenewPolicy() {
  const { location } = useLocation()
  const searchParams = useSearchParams()
  const policyId = searchParams.get('policy')
  
  const [step, setStep] = useState(1)
  const [selectedPolicy, setSelectedPolicy] = useState<any>(null)
  const [renewalData, setRenewalData] = useState({
    paymentMethod: '',
    agreeTerms: false
  })

  const policies = [
    {
      id: 'POL-001',
      type: 'Auto Insurance',
      currentPremium: 1200,
      renewalPremium: 1150,
      discount: 50,
      expiryDate: '2024-12-15',
      coverage: 'Comprehensive',
      benefits: ['Roadside Assistance', 'Zero Depreciation', 'Engine Protection']
    },
    {
      id: 'POL-002',
      type: 'Home Insurance', 
      currentPremium: 800,
      renewalPremium: 750,
      discount: 50,
      expiryDate: '2024-08-20',
      coverage: 'Fire & Theft',
      benefits: ['Natural Disaster Coverage', 'Personal Belongings', 'Liability Protection']
    }
  ]

  const [availablePolicies, setAvailablePolicies] = useState(policies)

  useEffect(() => {
    if (policyId) {
      const policy = policies.find(p => p.id === policyId)
      if (policy) {
        setSelectedPolicy(policy)
        setStep(2)
      }
    }
  }, [policyId])

  const handlePolicySelect = (policy: any) => {
    setSelectedPolicy(policy)
    setStep(2)
  }

  const handleRenewalSubmit = () => {
    setStep(3)
  }

  const getStepIcon = (stepNumber: number) => {
    if (stepNumber < step) {
      return <CheckCircleIcon className="h-6 w-6 text-green-500" />
    } else if (stepNumber === step) {
      return <ClockIcon className="h-6 w-6 text-blue-500" />
    } else {
      return <div className="h-6 w-6 rounded-full border-2 border-gray-300" />
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Renew Your Policy</h1>
        <p className="text-gray-600 mt-2">Extend your insurance coverage with our competitive rates</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStepIcon(1)}
            <span className={`text-sm font-medium ${step >= 1 ? 'text-blue-600' : 'text-gray-500'}`}>
              Select Policy
            </span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-200 mx-4">
            <div className={`h-full ${step > 1 ? 'bg-blue-600' : 'bg-gray-200'}`} />
          </div>
          <div className="flex items-center space-x-2">
            {getStepIcon(2)}
            <span className={`text-sm font-medium ${step >= 2 ? 'text-blue-600' : 'text-gray-500'}`}>
              Review & Pay
            </span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-200 mx-4">
            <div className={`h-full ${step > 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
          </div>
          <div className="flex items-center space-x-2">
            {getStepIcon(3)}
            <span className={`text-sm font-medium ${step >= 3 ? 'text-blue-600' : 'text-gray-500'}`}>
              Confirmation
            </span>
          </div>
        </div>
      </div>

      {/* Step 1: Policy Selection */}
      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Select Policy to Renew</h2>
          <div className="grid gap-6">
            {availablePolicies.map((policy) => (
              <div key={policy.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <ShieldCheckIcon className="h-12 w-12 text-blue-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{policy.type}</h3>
                      <p className="text-sm text-gray-600">Policy ID: {policy.id}</p>
                      <p className="text-sm text-gray-600">Expires: {policy.expiryDate}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      {location?.currencySymbol || '₹'}{policy.renewalPremium}
                    </p>
                    <p className="text-sm text-green-600">
                      Save {location?.currencySymbol || '₹'}{policy.discount}
                    </p>
                    <p className="text-sm text-gray-600">Annual Premium</p>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Coverage</h4>
                    <p className="text-sm text-gray-600">{policy.coverage}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Benefits</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {policy.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => handlePolicySelect(policy)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Renew This Policy
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Review & Payment */}
      {step === 2 && selectedPolicy && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Review & Payment</h2>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Policy Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Policy Type:</span>
                  <span className="font-medium">{selectedPolicy.type}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Policy ID:</span>
                  <span className="font-medium">{selectedPolicy.id}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Current Premium:</span>
                  <span className="font-medium">
                    {location?.currencySymbol || '₹'}{selectedPolicy.currentPremium}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Renewal Premium:</span>
                  <span className="font-medium">
                    {location?.currencySymbol || '₹'}{selectedPolicy.renewalPremium}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-t pt-2">
                  <span className="text-gray-600">Discount:</span>
                  <span className="font-medium text-green-600">
                    -{location?.currencySymbol || '₹'}{selectedPolicy.discount}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-t pt-2">
                  <span className="text-gray-600 font-semibold">Total Amount:</span>
                  <span className="font-bold text-lg">
                    {location?.currencySymbol || '₹'}{selectedPolicy.renewalPremium}
                  </span>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Payment Method</h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit"
                      className="mr-3"
                      onChange={(e) => setRenewalData({...renewalData, paymentMethod: e.target.value})}
                    />
                    <CreditCardIcon className="h-5 w-5 mr-2" />
                    Credit/Debit Card
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="netbanking"
                      className="mr-3"
                      onChange={(e) => setRenewalData({...renewalData, paymentMethod: e.target.value})}
                    />
                    Net Banking
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      className="mr-3"
                      onChange={(e) => setRenewalData({...renewalData, paymentMethod: e.target.value})}
                    />
                    UPI
                  </label>
                </div>
                
                <div className="mt-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-3"
                      onChange={(e) => setRenewalData({...renewalData, agreeTerms: e.target.checked})}
                    />
                    <span className="text-sm text-gray-600">
                      I agree to the <Link href="/terms" className="text-blue-600 hover:underline">Terms & Conditions</Link>
                    </span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleRenewalSubmit}
                disabled={!renewalData.paymentMethod || !renewalData.agreeTerms}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Complete Renewal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Confirmation */}
      {step === 3 && (
        <div className="text-center">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Renewal Successful!</h2>
            <p className="text-gray-600 mb-6">
              Your policy has been renewed successfully. You will receive a confirmation email shortly.
            </p>
            <div className="space-y-4">
              <Link
                href="/customer"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block"
              >
                Go to Dashboard
              </Link>
              <Link
                href="/customer/policies"
                className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors inline-block ml-4"
              >
                View My Policies
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
