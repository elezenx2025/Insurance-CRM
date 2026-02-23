'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon, EnvelopeIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function EmailVerificationPage() {
  const router = useRouter()
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', ''])
  const [quotationData, setQuotationData] = useState<any>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes

  useEffect(() => {
    // Load quotation data from session
    const data = sessionStorage.getItem('pendingQuotation')
    if (!data) {
      toast.error('No pending quotation found')
      router.push('/dashboard/presale/quotation')
      return
    }
    setQuotationData(JSON.parse(data))

    // Start countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          toast.error('Verification code expired')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0]
    if (!/^\d*$/.test(value)) return

    const newCode = [...verificationCode]
    newCode[index] = value
    setVerificationCode(newCode)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handleVerify = async () => {
    const enteredCode = verificationCode.join('')
    
    if (enteredCode.length !== 6) {
      toast.error('Please enter complete 6-digit code')
      return
    }

    setIsVerifying(true)
    try {
      // Verify code
      if (enteredCode !== quotationData.verificationCode) {
        toast.error('Invalid verification code')
        setIsVerifying(false)
        return
      }

      toast.success('Email verified successfully!')
      
      // Navigate based on action
      if (quotationData.action === 'SAVE_PROPOSAL') {
        // Check if this is a new quotation (should be saved as lead)
        if (quotationData.isNewQuotation) {
          // Save as lead for new quotations
          try {
            const leads = JSON.parse(localStorage.getItem('leads') || '[]')
            const leadId = `LEAD-${Date.now().toString().slice(-6)}`
            const now = new Date().toISOString()
            
            const lead = {
              id: leadId,
              leadId: leadId,
              customerType: quotationData.customerType,
              firstName: quotationData.firstName,
              lastName: quotationData.lastName,
              companyName: quotationData.companyName,
              email: quotationData.email,
              phone: quotationData.phone || quotationData.mobile || '',
              address: quotationData.address || '',
              city: quotationData.city || '',
              state: quotationData.state || '',
              pincode: quotationData.pincode || '',
              policyType: quotationData.policyType,
              quotationData: quotationData,
              status: 'PENDING',
              createdAt: now,
              updatedAt: now,
              source: 'QUOTATION_FORM'
            }
            
            leads.push(lead)
            localStorage.setItem('leads', JSON.stringify(leads))
            
            toast.success(`Quotation saved as lead: ${leadId}`)
            sessionStorage.removeItem('pendingQuotation')
            router.push('/dashboard/presale/lead-generation')
            return
          } catch (e) {
            console.error('Failed saving lead:', e)
            toast.error('Failed to save lead')
            return
          }
        }
        
        // For existing customers, save as proposal
        try {
          const drafts = JSON.parse(localStorage.getItem('policyDrafts') || '[]')
          const now = new Date().toISOString()
          const proposal = {
            id: `PROP-${Date.now()}`,
            customerInfo: {
              customerType: quotationData.customerType,
              firstName: quotationData.firstName,
              lastName: quotationData.lastName,
              companyName: quotationData.companyName,
              email: quotationData.email,
              phone: quotationData.phone || quotationData.mobile || '',
              address: quotationData.address || '',
              city: quotationData.city || '',
              state: quotationData.state || '',
              pincode: quotationData.pincode || ''
            },
            policyDetails: {
              policyType: quotationData.policyType,
              oem: quotationData.oem,
              modelName: quotationData.modelName,
              variant: quotationData.variant,
              yearOfManufacture: quotationData.yearOfManufacture,
              registrationCity: quotationData.registrationCity,
              exShowroomPrice: quotationData.idv,
              policyTerm: quotationData.policyTerm || 1,
              quotationDate: quotationData.quotationDate || now
            },
            selectedQuote: {
              companyName: quotationData.selectedInsuranceCompany,
              totalPremium: quotationData.quotedPremium,
              status: 'PENDING'
            },
            selectedAddOns: quotationData.selectedAddons || [],
            kycStatus: 'pending',
            panValidation: {
              isValid: false,
              panNumber: quotationData.panNumber || '',
              name: quotationData.customerType === 'INDIVIDUAL' 
                ? `${quotationData.firstName || ''} ${quotationData.lastName || ''}`.trim()
                : quotationData.companyName
            },
            status: 'DRAFT',
            createdAt: now,
            updatedAt: now
          }
          localStorage.setItem('policyDrafts', JSON.stringify([proposal, ...drafts]))
        } catch (e) {
          console.error('Failed saving proposal draft:', e)
        }

        // Save proposal and go to proposals dashboard
        await new Promise(resolve => setTimeout(resolve, 1000))
        toast.success(`Proposal saved with ${quotationData.selectedInsuranceCompany}!`)
        sessionStorage.removeItem('pendingQuotation')
        router.push('/dashboard/presale/policy-proposals')
      } else if (quotationData.action === 'ISSUE_POLICY') {
        // Go to policy issuance page
        toast.success('Proceeding to policy issuance...')
        router.push('/dashboard/presale/policy-issuance')
      }
    } catch (error) {
      toast.error('Verification failed')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleSkip = () => {
    if (!confirm('Are you sure you want to skip email verification? (Development mode only)')) {
      return
    }

    toast.success('Verification skipped (Development mode)')
    
    // Navigate based on action
    if (quotationData?.action === 'SAVE_PROPOSAL') {
      // Check if this is a new quotation (should be saved as lead)
      if (quotationData.isNewQuotation) {
        // Save as lead for new quotations
        try {
          const leads = JSON.parse(localStorage.getItem('leads') || '[]')
          const leadId = `LEAD-${Date.now().toString().slice(-6)}`
          const now = new Date().toISOString()
          
          const lead = {
            id: leadId,
            leadId: leadId,
            customerType: quotationData.customerType,
            firstName: quotationData.firstName,
            lastName: quotationData.lastName,
            companyName: quotationData.companyName,
            email: quotationData.email,
            phone: quotationData.phone || quotationData.mobile || '',
            address: quotationData.address || '',
            city: quotationData.city || '',
            state: quotationData.state || '',
            pincode: quotationData.pincode || '',
            policyType: quotationData.policyType,
            quotationData: quotationData,
            status: 'PENDING',
            createdAt: now,
            updatedAt: now,
            source: 'QUOTATION_FORM'
          }
          
          leads.push(lead)
          localStorage.setItem('leads', JSON.stringify(leads))
          
          toast.success(`Quotation saved as lead: ${leadId}`)
          sessionStorage.removeItem('pendingQuotation')
          router.push('/dashboard/presale/lead-generation')
          return
        } catch (e) {
          console.error('Failed saving lead (skip):', e)
          toast.error('Failed to save lead')
          return
        }
      }
      
      // For existing customers, save as proposal
      try {
        const drafts = JSON.parse(localStorage.getItem('policyDrafts') || '[]')
        const now = new Date().toISOString()
        const proposal = {
          id: `PROP-${Date.now()}`,
          customerInfo: {
            customerType: quotationData.customerType,
            firstName: quotationData.firstName,
            lastName: quotationData.lastName,
            companyName: quotationData.companyName,
            email: quotationData.email,
            phone: quotationData.phone || quotationData.mobile || '',
            address: quotationData.address || '',
            city: quotationData.city || '',
            state: quotationData.state || '',
            pincode: quotationData.pincode || ''
          },
          policyDetails: {
            policyType: quotationData.policyType,
            oem: quotationData.oem,
            modelName: quotationData.modelName,
            variant: quotationData.variant,
            yearOfManufacture: quotationData.yearOfManufacture,
            registrationCity: quotationData.registrationCity,
            exShowroomPrice: quotationData.idv,
            policyTerm: quotationData.policyTerm || 1,
            quotationDate: quotationData.quotationDate || now
          },
          selectedQuote: {
            companyName: quotationData.selectedInsuranceCompany,
            totalPremium: quotationData.quotedPremium,
            status: 'PENDING'
          },
          selectedAddOns: quotationData.selectedAddons || [],
          kycStatus: 'pending',
          panValidation: {
            isValid: false,
            panNumber: quotationData.panNumber || '',
            name: quotationData.customerType === 'INDIVIDUAL' 
              ? `${quotationData.firstName || ''} ${quotationData.lastName || ''}`.trim()
              : quotationData.companyName
          },
          status: 'DRAFT',
          createdAt: now,
          updatedAt: now
        }
        localStorage.setItem('policyDrafts', JSON.stringify([proposal, ...drafts]))
      } catch (e) {
        console.error('Failed saving proposal draft (skip):', e)
      }

      sessionStorage.removeItem('pendingQuotation')
      router.push('/dashboard/presale/policy-proposals')
    } else if (quotationData?.action === 'ISSUE_POLICY') {
      router.push('/dashboard/presale/policy-issuance')
    }
  }

  const handleResend = async () => {
    toast.loading('Resending verification code...')
    try {
      const response = await fetch('/api/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: quotationData.email,
          customerName: quotationData.customerType === 'INDIVIDUAL' 
            ? `${quotationData.firstName} ${quotationData.lastName}`
            : quotationData.companyName,
          insuranceCompany: quotationData.selectedInsuranceCompany,
          premium: quotationData.quotedPremium
        })
      })

      const result = await response.json()
      
      if (result.success) {
        // Update stored code
        const updatedData = { ...quotationData, verificationCode: result.code }
        sessionStorage.setItem('pendingQuotation', JSON.stringify(updatedData))
        setQuotationData(updatedData)
        
        toast.dismiss()
        toast.success('New verification code sent!')
        setTimeLeft(600) // Reset timer
        setVerificationCode(['', '', '', '', '', ''])
      } else {
        toast.dismiss()
        toast.error('Failed to resend code')
      }
    } catch (error) {
      toast.dismiss()
      toast.error('Failed to resend code')
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!quotationData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Email Verification</h1>
          <p className="text-gray-600 mt-2">Please verify your email address to proceed</p>
        </div>

        {/* Verification Card */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
          {/* Email Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 rounded-full p-4">
              <EnvelopeIcon className="h-12 w-12 text-blue-600" />
            </div>
          </div>

          {/* Info */}
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Check Your Email</h2>
            <p className="text-gray-600">
              We've sent a 6-digit verification code to
            </p>
            <p className="text-blue-600 font-semibold mt-1">{quotationData.email}</p>
            <p className="text-sm text-gray-500 mt-4">
              Insurance Company: <span className="font-semibold">{quotationData.selectedInsuranceCompany}</span>
            </p>
            <p className="text-sm text-gray-500">
              Premium: <span className="font-semibold text-blue-600">₹{quotationData.quotedPremium?.toLocaleString()}</span>
            </p>
          </div>

          {/* Code Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
              Enter Verification Code
            </label>
            <div className="flex justify-center space-x-3">
              {verificationCode.map((digit, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                />
              ))}
            </div>
          </div>

          {/* Timer */}
          <div className="text-center mb-6">
            <p className="text-sm text-gray-600">
              Code expires in: <span className={`font-semibold ${timeLeft < 60 ? 'text-red-600' : 'text-gray-900'}`}>
                {formatTime(timeLeft)}
              </span>
            </p>
          </div>

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            disabled={isVerifying || verificationCode.join('').length !== 6}
            className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors mb-3"
          >
            {isVerifying ? 'Verifying...' : 'Verify & Continue'}
          </button>

          {/* Resend Code */}
          <div className="text-center mb-4">
            <button
              onClick={handleResend}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Didn't receive code? Resend
            </button>
          </div>

          {/* Skip Option (Development) */}
          <div className="pt-4 border-t border-gray-200">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <span className="text-yellow-600 text-lg">⚠️</span>
                <div>
                  <p className="text-sm font-medium text-yellow-900">Development Mode</p>
                  <p className="text-xs text-yellow-700 mt-1">
                    You can skip email verification for testing purposes
                  </p>
                  <button
                    onClick={handleSkip}
                    className="mt-2 text-xs text-yellow-700 hover:text-yellow-900 font-semibold underline"
                  >
                    Skip Verification →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Having trouble? Contact support at support@elezenx.com</p>
        </div>
      </div>
    </div>
  )
}






