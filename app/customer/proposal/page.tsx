'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLocation } from '@/contexts/LocationContext'
import { 
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  MapPinIcon,
  CurrencyRupeeIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline'
import EmailVerification from '@/components/EmailVerification'

interface ProposalData {
  quote: {
    id: string
    insuranceCompany: string
    premium: number
    coverage: number
    addOns: string[]
    features: string[]
    rating: number
  }
  addons: string[]
  totalPremium: number
}

interface PolicyCertificate {
  policyNumber: string
  certificateUrl: string
  issuedDate: string
  expiryDate: string
  status: 'issued' | 'pending' | 'failed'
}

export default function ProposalPage() {
  const { location } = useLocation()
  const router = useRouter()
  const [proposalData, setProposalData] = useState<ProposalData | null>(null)
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [policyCertificate, setPolicyCertificate] = useState<PolicyCertificate | null>(null)
  const [customerDetails, setCustomerDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    nomineeName: '',
    nomineeRelation: '',
    nomineePhone: '',
    nomineeEmail: ''
  })

  useEffect(() => {
    // Get proposal data from session storage
    const storedData = sessionStorage.getItem('proposalData')
    if (storedData) {
      setProposalData(JSON.parse(storedData))
    } else {
      // Redirect to quotes page if no data
      router.push('/customer/insurance-quotes')
    }
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setCustomerDetails(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleEmailVerificationSuccess = () => {
    setStep(2)
  }

  const handleProposalSubmit = async () => {
    setIsLoading(true)
    
    try {
      // Simulate API call to insurance company for policy issuance
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Mock policy certificate data
      const certificate: PolicyCertificate = {
        policyNumber: `POL-${Date.now().toString().slice(-8)}`,
        certificateUrl: '/documents/policy-certificate.pdf',
        issuedDate: new Date().toISOString().split('T')[0],
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'issued'
      }
      
      setPolicyCertificate(certificate)
      setStep(3)
      
      // Simulate sending policy certificate to customer email
      await sendPolicyCertificateEmail(customerDetails.email, certificate)
      
    } catch (error) {
      console.error('Policy issuance failed:', error)
      // Handle error - show error message
    } finally {
      setIsLoading(false)
    }
  }

  const sendPolicyCertificateEmail = async (email: string, certificate: PolicyCertificate) => {
    // Simulate sending email
    console.log(`Sending policy certificate to ${email}`)
    console.log(`Policy Number: ${certificate.policyNumber}`)
    console.log(`Certificate URL: ${certificate.certificateUrl}`)
    
    // In real implementation, this would call an email service API
    // await emailService.sendPolicyCertificate(email, certificate)
  }

  const downloadCertificate = () => {
    if (policyCertificate) {
      // In real implementation, this would download the actual PDF
      const link = document.createElement('a')
      link.href = policyCertificate.certificateUrl
      link.download = `policy-certificate-${policyCertificate.policyNumber}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  if (!proposalData) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="text-gray-500">Loading proposal data...</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Link
            href="/customer/insurance-quotes"
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Quotes
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Policy Proposal</h1>
        <p className="text-gray-600 mt-2">Complete your policy application and get instant coverage</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
              step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {step > 1 ? <CheckCircleIcon className="h-5 w-5" /> : '1'}
            </div>
            <span className={`text-sm font-medium ${step >= 1 ? 'text-blue-600' : 'text-gray-500'}`}>
              Email Verification
            </span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-200 mx-4">
            <div className={`h-full ${step > 1 ? 'bg-blue-600' : 'bg-gray-200'}`} />
          </div>
          <div className="flex items-center space-x-2">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
              step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {step > 2 ? <CheckCircleIcon className="h-5 w-5" /> : '2'}
            </div>
            <span className={`text-sm font-medium ${step >= 2 ? 'text-blue-600' : 'text-gray-500'}`}>
              Customer Details
            </span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-200 mx-4">
            <div className={`h-full ${step > 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
          </div>
          <div className="flex items-center space-x-2">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
              step >= 3 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {step >= 3 ? <CheckCircleIcon className="h-5 w-5" /> : '3'}
            </div>
            <span className={`text-sm font-medium ${step >= 3 ? 'text-green-600' : 'text-gray-500'}`}>
              Policy Issued
            </span>
          </div>
        </div>
      </div>

      {/* Step 1: Email Verification */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-blue-900 mb-4">Selected Insurance Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-blue-800"><strong>Insurance Company:</strong> {proposalData.quote.insuranceCompany}</p>
                <p className="text-sm text-blue-800"><strong>Coverage Amount:</strong> {location?.currencySymbol || '₹'}{proposalData.quote.coverage.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-blue-800"><strong>Total Premium:</strong> {location?.currencySymbol || '₹'}{proposalData.totalPremium.toLocaleString()}</p>
                <p className="text-sm text-blue-800"><strong>Add-ons:</strong> {proposalData.addons.length} selected</p>
              </div>
            </div>
          </div>

          <EmailVerification
            email="customer@example.com" // In real app, this would come from user data
            onVerificationSuccess={handleEmailVerificationSuccess}
            onBack={() => router.push('/customer/insurance-quotes')}
          />
        </div>
      )}

      {/* Step 2: Customer Details Form */}
      {step === 2 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Customer Details</h2>
          
          <form className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={customerDetails.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={customerDetails.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={customerDetails.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={customerDetails.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={customerDetails.dateOfBirth}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Address Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Address Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <textarea
                    name="address"
                    value={customerDetails.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={customerDetails.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={customerDetails.state}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={customerDetails.zipCode}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Nominee Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Nominee Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nominee Name *
                  </label>
                  <input
                    type="text"
                    name="nomineeName"
                    value={customerDetails.nomineeName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Relationship *
                  </label>
                  <select
                    name="nomineeRelation"
                    value={customerDetails.nomineeRelation}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Relationship</option>
                    <option value="spouse">Spouse</option>
                    <option value="parent">Parent</option>
                    <option value="child">Child</option>
                    <option value="sibling">Sibling</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nominee Phone *
                  </label>
                  <input
                    type="tel"
                    name="nomineePhone"
                    value={customerDetails.nomineePhone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nominee Email *
                  </label>
                  <input
                    type="email"
                    name="nomineeEmail"
                    value={customerDetails.nomineeEmail}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Terms and Conditions</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p>• I confirm that all information provided is accurate and complete.</p>
                <p>• I understand that any false information may result in policy cancellation.</p>
                <p>• I agree to the terms and conditions of the insurance policy.</p>
                <p>• I consent to the processing of my personal data for policy issuance.</p>
                <p>• I authorize the insurance company to verify the information provided.</p>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleProposalSubmit}
                disabled={isLoading}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin inline" />
                    Processing...
                  </>
                ) : (
                  'Submit Proposal'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Step 3: Policy Issued */}
      {step === 3 && policyCertificate && (
        <div className="text-center">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircleIcon className="h-12 w-12 text-green-600" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Policy Successfully Issued!</h2>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-green-900 mb-4">Policy Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-green-800"><strong>Policy Number:</strong> {policyCertificate.policyNumber}</p>
                  <p className="text-sm text-green-800"><strong>Insurance Company:</strong> {proposalData.quote.insuranceCompany}</p>
                </div>
                <div>
                  <p className="text-sm text-green-800"><strong>Issued Date:</strong> {new Date(policyCertificate.issuedDate).toLocaleDateString()}</p>
                  <p className="text-sm text-green-800"><strong>Expiry Date:</strong> {new Date(policyCertificate.expiryDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-blue-900 mb-2">What happens next?</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Policy certificate has been sent to your email address</li>
                <li>• Your policy is now active and you're covered</li>
                <li>• You can download your policy certificate anytime</li>
                <li>• Keep your policy number safe for future reference</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={downloadCertificate}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                Download Certificate
              </button>
              <Link
                href="/customer"
                className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

