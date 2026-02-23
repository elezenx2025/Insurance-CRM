'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon, CreditCardIcon, CheckCircleIcon, PrinterIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function PaymentPage() {
  const router = useRouter()
  const [policyData, setPolicyData] = useState<any>(null)
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD')
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [policyCertificate, setPolicyCertificate] = useState<any>(null)

  useEffect(() => {
    // Load policy data from session
    const data = sessionStorage.getItem('pendingPolicy')
    if (!data) {
      toast.error('No pending policy found')
      router.push('/dashboard/presale/quotation')
      return
    }
    setPolicyData(JSON.parse(data))
  }, [router])

  const processPayment = async () => {
    setIsProcessing(true)
    try {
      toast.loading('Processing payment...')
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.dismiss()
      toast.success('Payment successful!')
      
      // Send to Insurance Company API (simulated)
      toast.loading('Sending details to Insurance Company...')
      await sendToInsuranceCompany()
      
      toast.dismiss()
      toast.success('Policy issued successfully!')
      
      setPaymentSuccess(true)
    } catch (error) {
      toast.dismiss()
      toast.error('Payment failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const sendToInsuranceCompany = async () => {
    // Simulate API call to Insurance Company
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Generate policy certificate
    const certificate = {
      policyNumber: 'POL' + Date.now(),
      certificateNumber: 'CERT' + Date.now(),
      issueDate: new Date().toISOString(),
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      insuranceCompany: policyData.selectedInsuranceCompany,
      customerName: policyData.customerType === 'INDIVIDUAL' 
        ? `${policyData.firstName} ${policyData.lastName}`
        : policyData.companyName,
      vehicleDetails: {
        make: policyData.oem,
        model: policyData.modelName,
        variant: policyData.variantName,
        registrationNumber: policyData.registrationNumber || 'To be registered',
        chassisNumber: policyData.chassisNumber,
        engineNumber: policyData.engineNumber
      },
      premium: policyData.quotedPremium,
      idv: policyData.idv,
      coverageType: policyData.policyTerm,
      status: 'ACTIVE'
    }
    
    setPolicyCertificate(certificate)
    
    // Send certificate to customer email
    await sendCertificateEmail(certificate)
    
    // Save to backend (simulated)
    const finalPolicyData = {
      ...policyData,
      ...certificate,
      status: 'POLICY_ISSUED',
      paymentMethod: paymentMethod,
      paymentDate: new Date().toISOString()
    }
    
    // Store in localStorage for dashboard
    const existingPolicies = JSON.parse(localStorage.getItem('issuedPolicies') || '[]')
    existingPolicies.push(finalPolicyData)
    localStorage.setItem('issuedPolicies', JSON.stringify(existingPolicies))
    
    // Clear session
    sessionStorage.removeItem('pendingPolicy')
    sessionStorage.removeItem('pendingQuotation')
  }

  const sendCertificateEmail = async (certificate: any) => {
    // Simulate sending email with certificate
    console.log('='.repeat(60))
    console.log('📧 POLICY CERTIFICATE EMAIL (Development Mode)')
    console.log('='.repeat(60))
    console.log('To:', policyData.email)
    console.log('Customer:', certificate.customerName)
    console.log('Policy Number:', certificate.policyNumber)
    console.log('Certificate Number:', certificate.certificateNumber)
    console.log('Insurance Company:', certificate.insuranceCompany)
    console.log('Premium:', `₹${certificate.premium.toLocaleString()}`)
    console.log('Valid From:', new Date(certificate.issueDate).toLocaleDateString())
    console.log('Valid Until:', new Date(certificate.expiryDate).toLocaleDateString())
    console.log('='.repeat(60))
    console.log('✅ Certificate email would be sent in production')
    console.log('='.repeat(60))
    
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  const handlePrint = () => {
    window.print()
  }

  const handleViewDashboard = () => {
    router.push('/dashboard/presale/policy-proposals')
  }

  if (!policyData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (paymentSuccess && policyCertificate) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="mx-auto h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircleIcon className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Policy Issued Successfully!</h1>
            <p className="text-gray-600">Your insurance policy has been issued and activated</p>
          </div>

          {/* Policy Certificate */}
          <div className="bg-white rounded-lg shadow-lg border-2 border-green-500 p-8 mb-6 print:shadow-none">
            <div className="text-center mb-6 pb-6 border-b-2 border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Insurance Policy Certificate</h2>
              <p className="text-sm text-gray-600">{policyCertificate.insuranceCompany}</p>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-sm text-gray-600">Policy Number</p>
                <p className="text-lg font-bold text-blue-600">{policyCertificate.policyNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Certificate Number</p>
                <p className="text-lg font-bold text-blue-600">{policyCertificate.certificateNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Issue Date</p>
                <p className="font-semibold">{new Date(policyCertificate.issueDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Expiry Date</p>
                <p className="font-semibold">{new Date(policyCertificate.expiryDate).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="border-t-2 border-gray-200 pt-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-4">Insured Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-semibold">{policyCertificate.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold">{policyData.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Mobile</p>
                  <p className="font-semibold">{policyData.mobile || policyData.mobileNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-semibold">{policyData.address}</p>
                </div>
              </div>
            </div>

            <div className="border-t-2 border-gray-200 pt-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-4">Vehicle Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Make & Model</p>
                  <p className="font-semibold">{policyCertificate.vehicleDetails.make} {policyCertificate.vehicleDetails.model}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Variant</p>
                  <p className="font-semibold">{policyCertificate.vehicleDetails.variant}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Chassis Number</p>
                  <p className="font-semibold">{policyCertificate.vehicleDetails.chassisNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Engine Number</p>
                  <p className="font-semibold">{policyCertificate.vehicleDetails.engineNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Registration Number</p>
                  <p className="font-semibold">{policyCertificate.vehicleDetails.registrationNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">IDV</p>
                  <p className="font-semibold">₹{policyCertificate.idv.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="border-t-2 border-gray-200 pt-6">
              <h3 className="font-bold text-gray-900 mb-4">Premium Details</h3>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Total Premium Paid</span>
                  <span className="text-2xl font-bold text-blue-600">₹{policyCertificate.premium.toLocaleString()}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">Coverage Type: {policyCertificate.coverageType}</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t-2 border-gray-200 text-center">
              <p className="text-sm text-gray-600">This is a computer-generated certificate and does not require a signature.</p>
              <p className="text-sm text-gray-600 mt-1">For queries, contact: support@elezenx.com</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center space-x-4 mb-6 print:hidden">
            <button
              onClick={handlePrint}
              className="flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PrinterIcon className="h-5 w-5 mr-2" />
              Print Certificate
            </button>
            <button
              onClick={handleViewDashboard}
              className="flex items-center px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
            >
              View All Policies
            </button>
          </div>

          {/* Email Confirmation */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center print:hidden">
            <p className="text-sm font-medium text-green-900">
              📧 Policy certificate has been sent to <span className="font-bold">{policyData.email}</span>
            </p>
            <p className="text-xs text-green-700 mt-1">Please check your inbox and spam folder</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Payment</h1>
          <p className="text-gray-600 mt-2">Complete your payment to issue the policy</p>
        </div>

        {/* Policy Summary */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-6 text-white mb-6">
          <h2 className="text-xl font-bold mb-4">Policy Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="opacity-90">Customer</p>
              <p className="font-semibold">
                {policyData.customerType === 'INDIVIDUAL' 
                  ? `${policyData.firstName} ${policyData.lastName}`
                  : policyData.companyName}
              </p>
            </div>
            <div>
              <p className="opacity-90">Vehicle</p>
              <p className="font-semibold">{policyData.oem} {policyData.modelName}</p>
            </div>
            <div>
              <p className="opacity-90">Insurance Company</p>
              <p className="font-semibold">{policyData.selectedInsuranceCompany}</p>
            </div>
            <div>
              <p className="opacity-90">Total Premium</p>
              <p className="font-semibold text-yellow-300 text-lg">₹{policyData.quotedPremium?.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Payment Method</h2>
          
          <div className="space-y-3">
            {/* Credit/Debit Card */}
            <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
              <input
                type="radio"
                name="paymentMethod"
                value="CREDIT_CARD"
                checked={paymentMethod === 'CREDIT_CARD'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="h-4 w-4 text-blue-600"
              />
              <CreditCardIcon className="h-6 w-6 text-gray-600 ml-3 mr-3" />
              <div>
                <p className="font-semibold text-gray-900">Credit / Debit Card</p>
                <p className="text-sm text-gray-600">Visa, Mastercard, Rupay</p>
              </div>
            </label>

            {/* Net Banking */}
            <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
              <input
                type="radio"
                name="paymentMethod"
                value="NET_BANKING"
                checked={paymentMethod === 'NET_BANKING'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="h-4 w-4 text-blue-600"
              />
              <span className="text-2xl ml-3 mr-3">🏦</span>
              <div>
                <p className="font-semibold text-gray-900">Net Banking</p>
                <p className="text-sm text-gray-600">All major banks supported</p>
              </div>
            </label>

            {/* UPI */}
            <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
              <input
                type="radio"
                name="paymentMethod"
                value="UPI"
                checked={paymentMethod === 'UPI'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="h-4 w-4 text-blue-600"
              />
              <span className="text-2xl ml-3 mr-3">📱</span>
              <div>
                <p className="font-semibold text-gray-900">UPI</p>
                <p className="text-sm text-gray-600">Google Pay, PhonePe, Paytm</p>
              </div>
            </label>

            {/* Wallet */}
            <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
              <input
                type="radio"
                name="paymentMethod"
                value="WALLET"
                checked={paymentMethod === 'WALLET'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="h-4 w-4 text-blue-600"
              />
              <span className="text-2xl ml-3 mr-3">💳</span>
              <div>
                <p className="font-semibold text-gray-900">Wallet</p>
                <p className="text-sm text-gray-600">Paytm, PhonePe, Amazon Pay</p>
              </div>
            </label>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Base Premium</span>
              <span className="font-semibold">₹{policyData.quotedPremium?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">GST (18%)</span>
              <span className="font-semibold">₹{Math.round(policyData.quotedPremium * 0.18).toLocaleString()}</span>
            </div>
            <div className="border-t-2 border-gray-300 pt-3 flex justify-between">
              <span className="text-lg font-bold text-gray-900">Total Amount</span>
              <span className="text-2xl font-bold text-blue-600">₹{Math.round(policyData.quotedPremium * 1.18).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Pay Button */}
        <button
          onClick={processPayment}
          disabled={isProcessing}
          className="w-full py-4 px-6 bg-green-600 text-white text-lg font-bold rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isProcessing ? 'Processing Payment...' : `Pay ₹${Math.round(policyData.quotedPremium * 1.18).toLocaleString()}`}
        </button>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            🔒 Your payment is secure and encrypted
          </p>
        </div>
      </div>
    </div>
  )
}






