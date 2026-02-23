'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  ArrowLeftIcon, 
  DocumentIcon, 
  UserIcon, 
  BuildingOfficeIcon, 
  CheckCircleIcon,
  TruckIcon,
  MapPinIcon,
  CurrencyRupeeIcon,
  ShieldCheckIcon,
  PlusIcon,
  MinusIcon,
  MagnifyingGlassIcon,
  UserPlusIcon,
  IdentificationIcon,
  PhoneIcon,
  CreditCardIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { INDIAN_CITIES } from '@/data/indian-cities'

const quotationSchema = z.object({
  customerType: z.enum(['INDIVIDUAL', 'CORPORATE']),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  companyName: z.string().optional(),
  registrationNumber: z.string().optional(),
  email: z.string().email(),
  phone: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  pincode: z.string(),
  policyType: z.string(),
  policyFor: z.string().optional(),
  vehicleClass: z.string().optional(),
  vehicleType: z.string().optional(),
  oem: z.string().optional(),
  modelName: z.string().optional(),
  variant: z.string().optional(),
  fuelType: z.string().optional(),
  yearOfManufacture: z.string().optional(),
  registrationCity: z.string().optional(),
  exShowroomPrice: z.number().optional(),
  policyTerm: z.string().optional(),
  quotationDate: z.string().optional(),
  validityPeriod: z.number().optional(),
  previousNCB: z.string().optional(),
  claimAvailed: z.string().optional(),
  // Previous policy details (for Rollover flows)
  previousODPolicyNumber: z.string().optional(),
  previousODInsurer: z.string().optional(),
  previousODPolicyFrom: z.string().optional(),
  previousODPolicyTo: z.string().optional(),
  previousTPPolicyNumber: z.string().optional(),
  previousTPInsurer: z.string().optional(),
  previousTPPolicyFrom: z.string().optional(),
  previousTPPolicyTo: z.string().optional(),
  previousPremiumPaid: z.number().optional(),
  selectedAddons: z.array(z.string()).optional()
})

type QuotationFormData = z.infer<typeof quotationSchema>

interface CustomerData {
  id: string
  customerId: string
  name: string
  email: string
  phone: string
  panNumber?: string
  policyNumber?: string
  customerType: 'INDIVIDUAL' | 'CORPORATE'
  address?: string
  city?: string
  state?: string
  pincode?: string
  dateOfBirth?: string
  gender?: string
  companyName?: string
  registrationNumber?: string
}

export default function QuotationPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1) // Start with customer search
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [idvValue, setIdvValue] = useState(0)
  const [insuranceQuotes, setInsuranceQuotes] = useState<any[]>([])
  const [loadingQuotes, setLoadingQuotes] = useState(false)
  const [selectedQuote, setSelectedQuote] = useState<string | null>(null)
  
  // Customer search state
  const [searchType, setSearchType] = useState<'customer_id' | 'customer_name' | 'mobile' | 'pan' | 'policy' | 'new_quotation'>('new_quotation')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<CustomerData[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerData | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  const { register, handleSubmit, watch, formState: { errors }, setValue, reset } = useForm<QuotationFormData>({
    resolver: zodResolver(quotationSchema),
    defaultValues: {
      customerType: 'INDIVIDUAL',
      validityPeriod: 30,
      selectedAddons: []
    }
  })

  // Restore customer info and draft from session on load
React.useEffect(() => {
    try {
      const savedCustomer = sessionStorage.getItem('selectedCustomer')
      if (savedCustomer) {
        const c = JSON.parse(savedCustomer)
        setSelectedCustomer(c)
        setValue('customerType', c.customerType || 'INDIVIDUAL')
        if (c.customerType === 'INDIVIDUAL') {
          const parts = (c.name || '').split(' ')
          setValue('firstName', parts[0] || '')
          setValue('lastName', parts.slice(1).join(' ') || '')
        } else {
          setValue('companyName', c.companyName || c.name || '')
        }
        setValue('email', c.email || '')
        setValue('phone', c.phone || '')
        setValue('city', c.city || '')
        setValue('state', c.state || '')
      }

      const draft = sessionStorage.getItem('quotationCustomerDraft')
      if (draft) {
        const d = JSON.parse(draft)
        const keys = ['customerType','firstName','lastName','companyName','registrationNumber','email','phone','address','city','state','pincode'] as const
        keys.forEach((k) => {
          if (d[k] !== undefined) setValue(k as any, d[k] as any, { shouldDirty: false })
        })
      }
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [])

  // Persist customer info draft while typing
React.useEffect(() => {
    const sub = watch((values) => {
      try {
        const snapshot = {
          customerType: values.customerType,
          firstName: values.firstName,
          lastName: values.lastName,
          companyName: values.companyName,
          registrationNumber: values.registrationNumber,
          email: values.email,
          phone: values.phone,
          address: values.address,
          city: values.city,
          state: values.state,
          pincode: values.pincode
        }
        sessionStorage.setItem('quotationCustomerDraft', JSON.stringify(snapshot))
      } catch {}
    })
    return () => sub.unsubscribe()
}, [watch, setValue])

  // If a corporate inputs page requests returning to a specific step, honor it
  React.useEffect(() => {
    try {
      const step = sessionStorage.getItem('forceQuotationStep')
      if (step) {
        const num = parseInt(step, 10)
        if (!Number.isNaN(num)) setCurrentStep(num)
        sessionStorage.removeItem('forceQuotationStep')
      }
    } catch {}
  }, [])

  // Auto-fetch quotes when entering step 6
  React.useEffect(() => {
    if (currentStep === 6 && insuranceQuotes.length === 0) {
      fetchInsuranceQuotes()
    }
  }, [currentStep])

  const customerType = watch('customerType')
  const policyType = watch('policyType')
  const policyFor = watch('policyFor')
  const vehicleClass = watch('vehicleClass')
  const vehicleType = watch('vehicleType')
  const yearOfManufacture = watch('yearOfManufacture')
  const oem = watch('oem')
  const modelName = watch('modelName')
  const state = watch('state')
  const policyTerm = watch('policyTerm')

  // Helper function to check if Previous Policy Details are needed
  // Must be defined after watch() declarations
  // Previous Policy Details should appear BEFORE Customer Information when:
  // Condition 1: Policy Term = SAOD AND (1 < vehicle age < 3 years with current year)
  // Condition 2: Policy Term = 1/2/3 Year Comprehensive AND (vehicle age > 300 days AND < 1 year with current year)
  const needsPreviousPolicyDetails = () => {
    const policyForVal = watch('policyFor')
    const vehicleClassVal = watch('vehicleClass')
    const vehicleTypeVal = watch('vehicleType')
    const policyTermVal = watch('policyTerm')
    const yomStr = watch('yearOfManufacture')
    const policyTypeVal = watch('policyType')
    
    // Check base conditions first
    if (
      policyTypeVal === 'GEN_MOTOR' &&
      policyForVal === 'ROLLOVER' &&
      vehicleClassVal === 'PRIVATE' &&
      vehicleTypeVal === 'PRIVATE' &&
      yomStr &&
      policyTermVal
    ) {
      const currentDate = new Date()
      const currentYear = currentDate.getFullYear()
      const yomYear = parseInt(yomStr, 10)
      if (!Number.isNaN(yomYear)) {
        // Calculate vehicle age in years (as decimal for precise calculation)
        const yomDate = new Date(yomYear, 0, 1) // January 1st of YOM year
        const ageInMilliseconds = currentDate.getTime() - yomDate.getTime()
        const ageInDays = ageInMilliseconds / (1000 * 60 * 60 * 24)
        const ageInYears = ageInDays / 365.25 // Account for leap years
        
        // Condition 1: Policy Term = SAOD AND (1 < vehicle age < 3 years with current year)
        if (ageInYears > 1 && ageInYears < 3 && policyTermVal === 'SAOD') {
          console.log('Previous Policy Details needed: SAOD with age', ageInYears.toFixed(2), 'years')
          return true
        }
        
        // Condition 2: Policy Term = 1/2/3 Year Comprehensive AND (vehicle age > 300 days AND < 1 year with current year)
        // 300 days = 300/365.25 ≈ 0.822 years
        if (ageInDays > 300 && ageInYears < 1 && ['COMP_1', 'COMP_2', 'COMP_3'].includes(policyTermVal)) {
          console.log('Previous Policy Details needed: Comprehensive with age', ageInDays.toFixed(0), 'days (', ageInYears.toFixed(2), 'years)')
          return true
        }
      }
    }
    return false
  }

  // Step 3 (Previous Policy Details) should only appear when coming from "Issue Policy Now" or "Save as Proposal"
  // It should NOT appear during the normal quotation flow
  // This is handled in handleIssuePolicyNow() and in the policy-proposals page

  const handleBack = () => {
    router.push('/dashboard/presale')
  }

  const onSubmit = async (data: QuotationFormData) => {
    // Don't auto-submit, user must select a quote first
    if (currentStep < 5) {
      nextStep()
      return
    }

    // Validate corporate-only policy types
    if (data.customerType === 'INDIVIDUAL' && isCorporateOnlyPolicyType(data.policyType)) {
      toast.error('This policy type is only available for corporate customers. Please change customer type to Corporate or select a different policy type.')
      return
    }
    
    // Validate quote selection
    if (!selectedQuote) {
      toast.error('Please select an insurance company quote to proceed')
      return
    }
    
    setIsSubmitting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      const selectedCompany = insuranceQuotes.find(q => q.id === selectedQuote)

      // Persist as draft proposal (demo-friendly save)
      try {
        const drafts = JSON.parse(localStorage.getItem('policyDrafts') || '[]')
        const now = new Date().toISOString()
        const form = { ...watch() }
        const proposal = {
          id: `PROP-${Date.now()}`,
          customerInfo: {
            customerType: form.customerType,
            firstName: form.firstName,
            lastName: form.lastName,
            companyName: form.companyName,
            email: form.email,
            phone: form.phone,
            address: form.address,
            city: form.city,
            state: form.state,
            pincode: form.pincode
          },
          policyDetails: {
            policyType: form.policyType,
            oem: form.oem,
            modelName: form.modelName,
            variant: form.variant,
            yearOfManufacture: form.yearOfManufacture,
            registrationCity: form.registrationCity,
            exShowroomPrice: form.exShowroomPrice,
            policyTerm: Number(form.policyTerm) || 1,
            quotationDate: form.quotationDate || now
          },
          selectedQuote: selectedCompany ? {
            companyName: selectedCompany.company,
            totalPremium: selectedCompany.totalPremium,
            status: 'PENDING'
          } : undefined,
          selectedAddOns: form.selectedAddons || [],
          kycStatus: 'pending',
          panValidation: {
            isValid: false,
            panNumber: '',
            name: form.customerType === 'INDIVIDUAL'
              ? `${form.firstName || ''} ${form.lastName || ''}`.trim()
              : form.companyName
          },
          status: 'DRAFT',
          createdAt: now,
          updatedAt: now
        }
        localStorage.setItem('policyDrafts', JSON.stringify([proposal, ...drafts]))
      } catch (e) {
        console.error('Failed to save draft proposal:', e)
      }

      toast.success(`Quotation saved with ${selectedCompany?.company}!`)
      router.push('/dashboard/presale/policy-proposals')
    } catch (error) {
      toast.error('Failed to generate quotation')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Save as Proposal (for later processing)
  const handleSaveAsProposal = async () => {
    if (!selectedQuote) {
      toast.error('Please select an insurance company quote')
      return
    }

    // Validate corporate-only policy types
    const formData = watch()
    if (formData.customerType === 'INDIVIDUAL' && isCorporateOnlyPolicyType(formData.policyType)) {
      toast.error('This policy type is only available for corporate customers. Please change customer type to Corporate or select a different policy type.')
      return
    }
    
    setIsSubmitting(true)
    try {
      const selectedCompany = insuranceQuotes.find(q => q.id === selectedQuote)
      const customerName = watch('customerType') === 'INDIVIDUAL' 
        ? `${watch('firstName')} ${watch('lastName')}`
        : watch('companyName')
      
      // Check if this is Gen-Motor Rollover and if Customer Information is missing
      const isRolloverNeedsCustomerInfo = formData.policyType === 'GEN_MOTOR' && formData.policyFor === 'ROLLOVER'
      const email = watch('email')?.trim()
      const phone = watch('phone')?.trim()
      const address = watch('address')?.trim()
      const city = watch('city')?.trim()
      const stateVal = watch('state')?.trim()
      const pincode = watch('pincode')?.trim()
      const firstName = watch('firstName')?.trim()
      const lastName = watch('lastName')?.trim()
      const companyName = watch('companyName')?.trim()
      
      const customerTypeVal = watch('customerType')
      const hasCustomerInfo = email && phone && address && city && stateVal && pincode &&
        (customerTypeVal === 'INDIVIDUAL' ? (firstName && lastName) : companyName)
      
      // Always save as proposal, regardless of whether it's new or existing customer
      const proposalData = {
        id: `PROPOSAL-${Date.now().toString().slice(-6)}`,
        proposalNumber: `PROP-${Date.now().toString().slice(-6)}`,
        customerId: selectedCustomer?.id || `CUST-${Date.now().toString().slice(-6)}`,
        customerInfo: {
          customerType: watch('customerType'),
          firstName: watch('firstName'),
          lastName: watch('lastName'),
          companyName: watch('companyName'),
          email: watch('email'),
          phone: watch('phone'),
          address: watch('address'),
          city: watch('city'),
          state: watch('state'),
          pincode: watch('pincode')
        },
        policyDetails: {
          policyType: watch('policyType'),
          policyFor: watch('policyFor'),
          vehicleClass: watch('vehicleClass'),
          vehicleType: watch('vehicleType'),
          oem: watch('oem'),
          modelName: watch('modelName'),
          variant: watch('variant'),
          yearOfManufacture: watch('yearOfManufacture'),
          registrationCity: watch('registrationCity'),
          exShowroomPrice: watch('exShowroomPrice'),
          policyTerm: watch('policyTerm') || 'COMP_1', // Store as string to match form values (SAOD, COMP_1, etc.)
          quotationDate: new Date().toISOString()
        },
        selectedQuote: {
          companyName: selectedCompany?.company || '',
          totalPremium: selectedCompany?.totalPremium || 0,
          status: 'PENDING'
        },
        selectedAddOns: watch('selectedAddons') || [],
        kycStatus: 'pending' as const,
        panValidation: {
          isValid: false,
          panNumber: '',
          name: customerName
        },
        status: 'DRAFT' as const,
        // Flag to indicate Customer Information is needed for Rollover proposals
        needsCustomerInfo: isRolloverNeedsCustomerInfo && !hasCustomerInfo,
        // Save previous policy details if filled
        previousODPolicyNumber: watch('previousODPolicyNumber'),
        previousODInsurer: watch('previousODInsurer'),
        previousODPolicyFrom: watch('previousODPolicyFrom'),
        previousODPolicyTo: watch('previousODPolicyTo'),
        previousTPPolicyNumber: watch('previousTPPolicyNumber'),
        previousTPInsurer: watch('previousTPInsurer'),
        previousTPPolicyFrom: watch('previousTPPolicyFrom'),
        previousTPPolicyTo: watch('previousTPPolicyTo'),
        previousPremiumPaid: watch('previousPremiumPaid'),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      // Save proposal to localStorage (using the same key as policy proposals page)
      const proposals = JSON.parse(localStorage.getItem('policyDrafts') || '[]')
      proposals.push(proposalData)
      localStorage.setItem('policyDrafts', JSON.stringify(proposals))
      
      toast.success('Proposal saved successfully! Redirecting to proposals dashboard...')
      
      // Small delay to show success message
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Navigate to policy proposals dashboard
      router.push('/dashboard/presale/policy-proposals')
    } catch (error) {
      console.error('Error in handleSaveAsProposal:', error)
      toast.error('Failed to save proposal. Please try again.')
      setIsSubmitting(false)
    }
  }

  // Issue Policy Now (collect additional details)
  const handleIssuePolicyNow = async () => {
    if (!selectedQuote) {
      toast.error('Please select an insurance company quote')
      return
    }

    // Validate corporate-only policy types
    const formData = watch()
    if (formData.customerType === 'INDIVIDUAL' && isCorporateOnlyPolicyType(formData.policyType)) {
      toast.error('This policy type is only available for corporate customers. Please change customer type to Corporate or select a different policy type.')
      return
    }
    
    // For Gen-Motor Rollover: Check if Customer Information (and any required previous policy details) are missing
    // If missing, navigate to Customer Information step first
    if (formData.policyType === 'GEN_MOTOR' && formData.policyFor === 'ROLLOVER') {
      const email = watch('email')?.trim()
      const phone = watch('phone')?.trim()
      const address = watch('address')?.trim()
      const city = watch('city')?.trim()
      const stateVal = watch('state')?.trim()
      const pincode = watch('pincode')?.trim()
      const firstName = watch('firstName')?.trim()
      const lastName = watch('lastName')?.trim()
      const companyName = watch('companyName')?.trim()
      
      const customerTypeVal = watch('customerType')
      const missingCustomerFields: string[] = []
      
      if (!email) missingCustomerFields.push('Email')
      if (!phone) missingCustomerFields.push('Phone')
      if (!address) missingCustomerFields.push('Address')
      if (!city) missingCustomerFields.push('City')
      if (!stateVal) missingCustomerFields.push('State')
      if (!pincode) missingCustomerFields.push('Pincode')
      
      if (customerTypeVal === 'INDIVIDUAL') {
        if (!firstName) missingCustomerFields.push('First Name')
        if (!lastName) missingCustomerFields.push('Last Name')
      } else {
        if (!companyName) missingCustomerFields.push('Company Name')
      }

      // Check if Previous Policy Details are required for this Rollover Private Car case
      // Use the same logic as needsPreviousPolicyDetails() function
      const needsPrevPolicyDetails = needsPreviousPolicyDetails()

      const missingPrevFields: string[] = []
      if (needsPrevPolicyDetails) {
        const prevODPolicyNumber = watch('previousODPolicyNumber')?.trim()
        const prevODInsurer = watch('previousODInsurer')?.trim()
        const prevODPolicyFrom = watch('previousODPolicyFrom')?.trim()
        const prevODPolicyTo = watch('previousODPolicyTo')?.trim()
        const prevTPPolicyNumber = watch('previousTPPolicyNumber')?.trim()
        const prevTPInsurer = watch('previousTPInsurer')?.trim()
        const prevTPPolicyFrom = watch('previousTPPolicyFrom')?.trim()
        const prevTPPolicyTo = watch('previousTPPolicyTo')?.trim()
        const prevPremiumPaid = watch('previousPremiumPaid')

        if (!prevODPolicyNumber) missingPrevFields.push('Previous OD Policy Number')
        if (!prevODInsurer) missingPrevFields.push('Previous OD Insurance Company')
        if (!prevODPolicyFrom) missingPrevFields.push('Previous OD Policy Period (From)')
        if (!prevODPolicyTo) missingPrevFields.push('Previous OD Policy Period (To)')
        if (!prevTPPolicyNumber) missingPrevFields.push('Previous TP Policy Number')
        if (!prevTPInsurer) missingPrevFields.push('Previous TP Insurance Company')
        if (!prevTPPolicyFrom) missingPrevFields.push('Previous TP Policy Period (From)')
        if (!prevTPPolicyTo) missingPrevFields.push('Previous TP Policy Period (To)')
        if (prevPremiumPaid === undefined || prevPremiumPaid === null || Number.isNaN(prevPremiumPaid)) {
          missingPrevFields.push('Previous Premium Paid')
        }
      }

      // If Previous Policy Details are needed but not filled, show Previous Policy Details page first
      if (missingPrevFields.length > 0) {
        // Set a flag to indicate we're in "Issue Policy Now" flow
        sessionStorage.setItem('issuePolicyFlow', 'true')
        setCurrentStep(3) // Navigate to Previous Policy Details step
        setIsSubmitting(false)
        return
      }
      
      // If Customer Information is missing, show Customer Information page
      if (missingCustomerFields.length > 0) {
        setCurrentStep(4) // Navigate to Customer Information step
        setIsSubmitting(false)
        return
      }
    }
    
    // If we reach here, all required fields are filled, proceed with policy issuance
    setIsSubmitting(true)
    try {
      const selectedCompany = insuranceQuotes.find(q => q.id === selectedQuote)
      const customerName = watch('customerType') === 'INDIVIDUAL' 
        ? `${watch('firstName')} ${watch('lastName')}`
        : watch('companyName')
      
      // Check if this is a new quotation (not from existing customer)
      const isNewQuotation = !selectedCustomer
      
      // Show loading toast
      const loadingToast = toast.loading('Preparing your policy details...')
      
      // Send verification email
      const response = await fetch('/api/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: watch('email'),
          customerName: customerName,
          insuranceCompany: selectedCompany?.company,
          premium: selectedCompany?.totalPremium
        })
      })

      const result = await response.json()
      
      if (!result.success) {
        toast.dismiss(loadingToast)
        toast.error('Failed to send verification email')
        setIsSubmitting(false)
        return
      }

      toast.dismiss(loadingToast)
      toast.success('Verification code sent! Redirecting...')
      
      // Store quotation data and navigate to verification page
      const quotationData = {
        ...watch(),
        selectedInsuranceCompany: selectedCompany?.company,
        selectedQuoteId: selectedQuote,
        quotedPremium: selectedCompany?.totalPremium,
        idv: idvValue,
        verificationCode: result.code, // In production, don't pass this
        action: 'ISSUE_POLICY',
        isNewQuotation: isNewQuotation
      }
      
      // Store in sessionStorage
      sessionStorage.setItem('pendingQuotation', JSON.stringify(quotationData))
      
      // Clear the issue policy flow flag
      sessionStorage.removeItem('issuePolicyFlow')
      
      // Small delay to show success message
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Navigate to verification page
      router.push('/dashboard/presale/email-verification')
    } catch (error) {
      console.error('Error in handleIssuePolicyNow:', error)
      toast.dismiss()
      toast.error('Failed to send verification email. Please try again.')
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    // Handle Gen-Motor Rollover flow
    if (currentStep === 2 && policyType === 'GEN_MOTOR' && policyFor === 'ROLLOVER') {
      const vClass = watch('vehicleClass')
      const vType = watch('vehicleType')
      const term = watch('policyTerm')
      const yomStr = watch('yearOfManufacture')
      
      // Note: Previous Policy Details will be shown AFTER selecting "Save as Proposal" or "Issue Policy Now"
      // Not during the quotation flow itself
      
      // Special case: Liability-only terms – skip Add-ons and go directly to Quotes
      if (vClass === 'PRIVATE' && vType === 'PRIVATE' && yomStr && (term === 'LIAB_1' || term === 'LIAB_3')) {
        const currentYear = new Date().getFullYear()
        const yomYear = parseInt(yomStr, 10)
        if (!Number.isNaN(yomYear)) {
          const age = currentYear - yomYear
          // Treat "greater than three years" as age > 3
          if (age > 3) {
            setCurrentStep(6) // Directly show quote comparison (Step 6 now)
            return
          }
        }
      }

      // Default Rollover behaviour: go to Add-ons
      setCurrentStep(5) // Go to Add-ons (Step 5 now)
      return
    }

    // Require Policy Type on Policy Details step
    if (currentStep === 2) {
      const policy = watch('policyType')
      const customerTypeVal = watch('customerType')
      if (!policy) {
        toast.error('Please select a Policy Type before continuing')
        return
      }
      // Validate Plan Type for Health Individual
      if (policy === 'HEALTH' && customerTypeVal === 'INDIVIDUAL') {
        const planType = watch('policyFor')
        if (!planType || (planType !== 'Individual' && planType !== 'Family Floater')) {
          toast.error('Please select a Plan Type (Individual or Family Floater) before continuing')
          return
        }
      }
    }
    
    // Step 3: Previous Policy Details validation (only shown when coming from "Issue Policy Now" or "Save as Proposal")
    if (currentStep === 3) {
      // Check if we're in the "Issue Policy Now" flow
      const isIssuePolicyFlow = sessionStorage.getItem('issuePolicyFlow') === 'true'
      
      if (needsPreviousPolicyDetails()) {
        const prevODPolicyNumber = watch('previousODPolicyNumber')?.trim()
        const prevODInsurer = watch('previousODInsurer')?.trim()
        const prevODPolicyFrom = watch('previousODPolicyFrom')?.trim()
        const prevODPolicyTo = watch('previousODPolicyTo')?.trim()
        const prevTPPolicyNumber = watch('previousTPPolicyNumber')?.trim()
        const prevTPInsurer = watch('previousTPInsurer')?.trim()
        const prevTPPolicyFrom = watch('previousTPPolicyFrom')?.trim()
        const prevTPPolicyTo = watch('previousTPPolicyTo')?.trim()
        const prevPremiumPaid = watch('previousPremiumPaid')

        const missing: string[] = []
        if (!prevODPolicyNumber) missing.push('Previous OD Policy Number')
        if (!prevODInsurer) missing.push('Previous OD Insurance Company')
        if (!prevODPolicyFrom) missing.push('Previous OD Policy Period (From)')
        if (!prevODPolicyTo) missing.push('Previous OD Policy Period (To)')
        if (!prevTPPolicyNumber) missing.push('Previous TP Policy Number')
        if (!prevTPInsurer) missing.push('Previous TP Insurance Company')
        if (!prevTPPolicyFrom) missing.push('Previous TP Policy Period (From)')
        if (!prevTPPolicyTo) missing.push('Previous TP Policy Period (To)')
        if (prevPremiumPaid === undefined || prevPremiumPaid === null || Number.isNaN(prevPremiumPaid)) {
          missing.push('Previous Premium Paid')
        }

        if (missing.length > 0) {
          toast.error(`Please fill required fields: ${missing.join(', ')}`)
          return
        }
      }
      
      // After Previous Policy Details are filled, go to Customer Information
      setCurrentStep(4) // Go to Customer Information
      return
    }
    
    // Step 4: Customer Information validation
    if (currentStep === 4) {
      const cType = watch('customerType')
      const email = watch('email')?.trim()
      const phone = watch('phone')?.trim()
      const address = watch('address')?.trim()
      const city = watch('city')?.trim()
      const stateVal = watch('state')?.trim()
      const pincode = watch('pincode')?.trim()
      const firstName = watch('firstName')?.trim()
      const lastName = watch('lastName')?.trim()
      const companyName = watch('companyName')?.trim()
      const registrationNumber = watch('registrationNumber')?.trim()

      const missing: string[] = []
      if (!email) missing.push('Email')
      if (!phone) missing.push('Phone')
      if (!address) missing.push('Address')
      if (!city) missing.push('City')
      if (!stateVal) missing.push('State')
      if (!pincode) missing.push('Pincode')
      if (cType === 'INDIVIDUAL') {
        if (!firstName) missing.push('First Name')
        if (!lastName) missing.push('Last Name')
      } else {
        if (!companyName) missing.push('Company Name')
        // Registration Number can vary across corporate customers; do not block on it
      }

      if (missing.length > 0) {
        toast.error(`Please fill required fields: ${missing.join(', ')}`)
        return
      }
    }
    // When moving from Customer Information (step 4) to next,
    // redirect to appropriate flow pages based on policy type
    try {
      const selectedPolicyType = watch('policyType') as string
      const customerTypeVal = watch('customerType') as string
      const corporateRoutes: Record<string, string> = {
        'HEALTH_GMC': '/dashboard/presale/quotation/corporate/health-gmc',
        'LIFE_GTLI': '/dashboard/presale/quotation/corporate/life-gtli',
        'LIFE_GPA': '/dashboard/presale/quotation/corporate/life-gpa'
      }
      if (currentStep === 4 && corporateRoutes[selectedPolicyType]) {
        router.push(corporateRoutes[selectedPolicyType])
        return
      }
      // Route Health Individual to Health Individual Inputs page
      if (currentStep === 4 && selectedPolicyType === 'HEALTH' && customerTypeVal === 'INDIVIDUAL') {
        // Save plan type to session for Health Individual Inputs page
        const planType = watch('policyFor')
        try {
          const draft = sessionStorage.getItem('quotationCustomerDraft') || '{}'
          const draftData = JSON.parse(draft)
          draftData.policyFor = planType
          sessionStorage.setItem('quotationCustomerDraft', JSON.stringify(draftData))
        } catch {}
        router.push('/dashboard/presale/quotation/health/individual-inputs')
        return
      }
    } catch {}

    if (currentStep < 6) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Calculate addon premium
  const calculateAddonPremium = () => {
    const addons = watch('selectedAddons') || []
    const addonPrices: Record<string, number> = {
      'ZERO_DEP': 2500,
      'ENGINE_PROTECT': 1800,
      'ROADSIDE': 500,
      'RTI': 3200,
      'CONSUMABLE': 1200,
      'NCB_PROTECT': 800
    }
    return addons.reduce((total, addon) => total + (addonPrices[addon] || 0), 0)
  }

  // Fetch insurance quotes from multiple companies
  const fetchInsuranceQuotes = async () => {
    setLoadingQuotes(true)
    try {
      // Simulate API calls to multiple insurance companies
      // In production, replace with actual API integrations
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const exShowroom = watch('exShowroomPrice') || 500000
      const addonPremium = calculateAddonPremium()
      const baseIDV = Math.round(exShowroom * 0.95) // 95% of ex-showroom for new vehicle
      
      setIdvValue(baseIDV)
      
      // Mock quotes from different insurance companies
      const quotes = [
        {
          id: 'HDFC_ERGO',
          company: 'HDFC ERGO',
          logo: '🏢',
          basePremium: Math.round(baseIDV * 0.025),
          addonPremium: addonPremium,
          totalPremium: Math.round(baseIDV * 0.025) + addonPremium,
          idv: baseIDV,
          rating: 4.5,
          claimSettlementRatio: 98.5,
          networkGarages: 6500,
          features: ['Cashless Claims', '24/7 Support', 'Quick Settlement'],
          coverages: [
            'Own Damage Cover',
            'Third Party Liability',
            'Personal Accident Cover (₹15 Lakh)',
            'Legal Liability to Paid Driver',
            'Depreciation on Parts'
          ]
        },
        {
          id: 'ICICI_LOMBARD',
          company: 'ICICI Lombard',
          logo: '🏦',
          basePremium: Math.round(baseIDV * 0.023),
          addonPremium: addonPremium,
          totalPremium: Math.round(baseIDV * 0.023) + addonPremium,
          idv: baseIDV,
          rating: 4.6,
          claimSettlementRatio: 97.8,
          networkGarages: 7200,
          features: ['Instant Policy', 'Mobile App', 'Paperless Claims'],
          coverages: [
            'Own Damage Cover',
            'Third Party Liability',
            'Personal Accident Cover (₹15 Lakh)',
            'Legal Liability to Paid Driver',
            'Depreciation on Parts'
          ]
        },
        {
          id: 'BAJAJ_ALLIANZ',
          company: 'Bajaj Allianz',
          logo: '🛡️',
          basePremium: Math.round(baseIDV * 0.027),
          addonPremium: addonPremium,
          totalPremium: Math.round(baseIDV * 0.027) + addonPremium,
          idv: baseIDV,
          rating: 4.4,
          claimSettlementRatio: 96.5,
          networkGarages: 5800,
          features: ['Easy Renewal', 'Spot Survey', 'Quick Claim'],
          coverages: [
            'Own Damage Cover',
            'Third Party Liability',
            'Personal Accident Cover (₹15 Lakh)',
            'Legal Liability to Paid Driver',
            'Depreciation on Parts'
          ]
        },
        {
          id: 'TATA_AIG',
          company: 'Tata AIG',
          logo: '🚗',
          basePremium: Math.round(baseIDV * 0.024),
          addonPremium: addonPremium,
          totalPremium: Math.round(baseIDV * 0.024) + addonPremium,
          idv: baseIDV,
          rating: 4.3,
          claimSettlementRatio: 95.2,
          networkGarages: 4500,
          features: ['Digital Claims', 'Video Survey', 'Fast Processing'],
          coverages: [
            'Own Damage Cover',
            'Third Party Liability',
            'Personal Accident Cover (₹15 Lakh)',
            'Legal Liability to Paid Driver',
            'Depreciation on Parts'
          ]
        },
        {
          id: 'RELIANCE_GENERAL',
          company: 'Reliance General',
          logo: '⚡',
          basePremium: Math.round(baseIDV * 0.026),
          addonPremium: addonPremium,
          totalPremium: Math.round(baseIDV * 0.026) + addonPremium,
          idv: baseIDV,
          rating: 4.2,
          claimSettlementRatio: 94.8,
          networkGarages: 5200,
          features: ['Online Claims', 'SMS Alerts', 'Customer Portal'],
          coverages: [
            'Own Damage Cover',
            'Third Party Liability',
            'Personal Accident Cover (₹15 Lakh)',
            'Legal Liability to Paid Driver',
            'Depreciation on Parts'
          ]
        }
      ]
      
      setInsuranceQuotes(quotes)
    } catch (error) {
      console.error('Error fetching quotes:', error)
      toast.error('Failed to fetch insurance quotes')
    } finally {
      setLoadingQuotes(false)
    }
  }

  // Update IDV and refetch quotes
  const updateIDV = async (newIDV: number) => {
    setIdvValue(newIDV)
    await fetchInsuranceQuotes()
  }

  // Get available add-ons based on Vehicle Class and Vehicle Type
  const getAvailableAddons = () => {
    const vClass = watch('vehicleClass')
    const vType = watch('vehicleType')
    
    const allAddons = [
      { id: 'ZERO_DEP', name: 'Zero Depreciation', description: 'Full claim value without depreciation on parts', price: 2500, vehicleClass: ['PRIVATE'], vehicleType: ['PRIVATE', '2-WHEELER'] },
      { id: 'ENGINE_PROTECT', name: 'Engine Protection', description: 'Covers engine damage from water, oil leakage', price: 1800, vehicleClass: ['PRIVATE'], vehicleType: ['PRIVATE', '2-WHEELER'] },
      { id: 'ROADSIDE', name: 'Roadside Assistance', description: '24/7 emergency towing and support', price: 500, vehicleClass: ['PRIVATE', 'COMMERCIAL'], vehicleType: ['PRIVATE', '2-WHEELER', 'PCV', 'GCV'] },
      { id: 'RTI', name: 'Return to Invoice', description: 'Get invoice value in case of total loss/theft', price: 3200, vehicleClass: ['PRIVATE'], vehicleType: ['PRIVATE', '2-WHEELER'] },
      { id: 'CONSUMABLE', name: 'Consumable Cover', description: 'Covers engine oil, nuts, bolts, screws, etc.', price: 1200, vehicleClass: ['PRIVATE'], vehicleType: ['PRIVATE', '2-WHEELER'] },
      { id: 'NCB_PROTECT', name: 'NCB Protection', description: 'Protect your No Claim Bonus even after claim', price: 800, vehicleClass: ['PRIVATE'], vehicleType: ['PRIVATE', '2-WHEELER'] },
      { id: 'PASSENGER_COVER', name: 'Passenger Assist Cover', description: 'Personal accident cover for all passengers', price: 1500, vehicleClass: ['PRIVATE', 'COMMERCIAL'], vehicleType: ['PRIVATE', 'PCV'] },
      { id: 'LEGAL_LIABILITY', name: 'Legal Liability to Paid Driver', description: 'Covers legal liability towards paid driver', price: 600, vehicleClass: ['PRIVATE'], vehicleType: ['PRIVATE'] },
      { id: 'HELMET_COVER', name: 'Helmet Cover', description: 'Covers helmet replacement after accident', price: 300, vehicleClass: ['PRIVATE'], vehicleType: ['2-WHEELER'] },
      { id: 'PILLION_COVER', name: 'Pillion Passenger Cover', description: 'Personal accident cover for pillion passenger', price: 400, vehicleClass: ['PRIVATE'], vehicleType: ['2-WHEELER'] },
      { id: 'UNNAMED_PASSENGER', name: 'Medical Expenses for Unnamed Passengers', description: 'Covers medical expenses for unnamed passengers', price: 2000, vehicleClass: ['COMMERCIAL'], vehicleType: ['PCV'] },
      { id: 'FIBER_TANK', name: 'Fiber Glass Tank Cover', description: 'Covers fiber glass fuel tank', price: 1000, vehicleClass: ['COMMERCIAL'], vehicleType: ['GCV', 'PCV'] },
      { id: 'BREAKDOWN_ASSIST', name: 'Breakdown Assistance', description: 'Emergency breakdown support for commercial vehicles', price: 1500, vehicleClass: ['COMMERCIAL'], vehicleType: ['GCV', 'MISC-D'] }
    ]
    
    return allAddons.filter(addon => 
      addon.vehicleClass.includes(vClass || '') && addon.vehicleType.includes(vType || '')
    )
  }

  const steps = [
    { number: 1, title: 'Customer Search', description: 'Search existing customer or create new' },
    { number: 2, title: 'Policy Details', description: 'Vehicle and policy information' },
    { number: 3, title: 'Previous Policy Details', description: 'Previous policy information (if applicable)' },
    { number: 4, title: 'Customer Information', description: 'Personal or company details' },
    { number: 5, title: 'Add-ons Selection', description: 'Optional coverage' },
    { number: 6, title: 'Compare Quotes', description: 'Insurance company quotes' }
  ]

  // Customer search functions
  const getCustomerDatabase = (): CustomerData[] => {
    try {
      const issuedPolicies = JSON.parse(localStorage.getItem('issuedPolicies') || '[]')
      const pendingPolicies = JSON.parse(localStorage.getItem('policyDrafts') || '[]')
      
      const customers: CustomerData[] = []

      // Add issued policies
      issuedPolicies.forEach((policy: any, index: number) => {
        const customerName = policy.customerType === 'CORPORATE' 
          ? (policy.companyName || policy.firstName || 'Unknown Company')
          : `${policy.firstName || ''} ${policy.lastName || ''}`.trim() || 'Unknown Customer'

        customers.push({
          id: `issued_${index}`,
          customerId: policy.customerId || `CUST${String(index + 1).padStart(3, '0')}`,
          name: customerName,
          email: policy.email || `customer${index + 1}@email.com`,
          phone: policy.phone || policy.mobile || `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
          panNumber: policy.panNumber || policy.pan,
          policyNumber: policy.policyNumber || policy.certificateNumber,
          customerType: policy.customerType || 'INDIVIDUAL',
          address: policy.address,
          city: policy.city,
          state: policy.state,
          pincode: policy.pincode || policy.zipCode,
          dateOfBirth: policy.dateOfBirth || policy.dob,
          gender: policy.gender,
          companyName: policy.companyName,
          registrationNumber: policy.registrationNumber || policy.gstNumber
        })
      })

      // Add pending policies
      pendingPolicies.forEach((policy: any, index: number) => {
        const customerName = policy.customerInfo?.customerType === 'CORPORATE' 
          ? (policy.customerInfo?.companyName || 'Unknown Company')
          : `${policy.customerInfo?.firstName || ''} ${policy.customerInfo?.lastName || ''}`.trim() || 'Unknown Customer'

        customers.push({
          id: `pending_${index}`,
          customerId: `PEND${String(index + 1).padStart(3, '0')}`,
          name: customerName,
          email: policy.customerInfo?.email || `customer${index + 1}@email.com`,
          phone: policy.customerInfo?.phone || `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
          panNumber: `PAN${String(index + 1).padStart(7, '0')}`,
          policyNumber: policy.id,
          customerType: policy.customerInfo?.customerType || 'INDIVIDUAL',
          address: policy.customerInfo?.address,
          city: policy.customerInfo?.city,
          state: policy.customerInfo?.state,
          pincode: policy.customerInfo?.pincode,
          dateOfBirth: policy.customerInfo?.dateOfBirth,
          gender: policy.customerInfo?.gender,
          companyName: policy.customerInfo?.companyName
        })
      })

      if (customers.length === 0) {
        customers.push(
          {
            id: 'mock_1',
            customerId: 'CUST001',
            name: 'Rajesh Kumar',
            email: 'rajesh.kumar@email.com',
            phone: '+91 98765 43210',
            panNumber: 'ABCDE1234F',
            policyNumber: 'POL/2024/001',
            customerType: 'INDIVIDUAL',
            address: '123 MG Road',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001',
            dateOfBirth: '1985-06-15',
            gender: 'Male'
          },
          {
            id: 'mock_2',
            customerId: 'CUST002',
            name: 'Priya Sharma',
            email: 'priya.sharma@email.com',
            phone: '+91 87654 32109',
            panNumber: 'FGHIJ5678K',
            policyNumber: 'POL/2024/002',
            customerType: 'INDIVIDUAL',
            address: '456 Park Street',
            city: 'Delhi',
            state: 'Delhi',
            pincode: '110001',
            dateOfBirth: '1990-03-22',
            gender: 'Female'
          }
        )
      }

      return customers
    } catch (error) {
      console.error('Error loading customer data:', error)
      return []
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim() || searchType === 'new_quotation') return

    setIsSearching(true)
    try {
      const customerDatabase = getCustomerDatabase()
      await new Promise(resolve => setTimeout(resolve, 600))

      let results: CustomerData[] = []
      switch (searchType) {
        case 'customer_id':
          results = customerDatabase.filter(c => c.customerId.toLowerCase().includes(searchQuery.toLowerCase()))
          break
        case 'customer_name':
          results = customerDatabase.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
          break
        case 'mobile':
          results = customerDatabase.filter(c => c.phone.replace(/\s+/g, '').includes(searchQuery.replace(/\s+/g, '')))
          break
        case 'pan':
          results = customerDatabase.filter(c => (c.panNumber || '').toLowerCase().includes(searchQuery.toLowerCase()))
          break
        case 'policy':
          results = customerDatabase.filter(c => (c.policyNumber || '').toLowerCase().includes(searchQuery.toLowerCase()))
          break
      }

      setSearchResults(results)

      if (results.length === 0) {
        const availableData = customerDatabase.length > 0 
          ? `Available customers: ${customerDatabase.slice(0, 3).map(c => c.name).join(', ')}${customerDatabase.length > 3 ? '...' : ''}`
          : 'No customer data found. Please create some policies first.'
        toast.error(`No customers found matching your search criteria. ${availableData}`)
      } else {
        toast.success(`Found ${results.length} customer(s) from ${customerDatabase.length} total records`)
      }
    } catch (error) {
      console.error('Search error:', error)
      toast.error('Error searching customers')
    } finally {
      setIsSearching(false)
    }
  }

  const handleSelectCustomer = (customer: CustomerData) => {
    setSelectedCustomer(customer)
    setValue('customerType', customer.customerType)
    setValue('email', customer.email)
    setValue('phone', customer.phone)

    if (customer.customerType === 'INDIVIDUAL') {
      const nameParts = customer.name.split(' ')
      setValue('firstName', nameParts[0] || '')
      setValue('lastName', nameParts.slice(1).join(' ') || '')
      setValue('dateOfBirth', customer.dateOfBirth || '')
      setValue('gender', customer.gender || '')
    } else {
      setValue('companyName', customer.companyName || customer.name)
      setValue('registrationNumber', customer.registrationNumber || '')
    }

    setValue('address', customer.address || '')
    setValue('city', customer.city || '')
    setValue('state', customer.state || '')
    setValue('pincode', customer.pincode || '')

    toast.success(`Selected customer: ${customer.name}`)
    try {
      sessionStorage.setItem('selectedCustomer', JSON.stringify({
        customerId: customer.customerId,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        city: customer.city,
        state: customer.state,
        companyName: customer.companyName,
        customerType: customer.customerType
      }))
    } catch {}
    setCurrentStep(2) // Move to policy details
  }

  const handleNewQuotation = () => {
    setSelectedCustomer(null)
    setCurrentStep(2) // Move to policy details
    try { sessionStorage.removeItem('selectedCustomer') } catch {}
    toast('Starting new quotation process - This will be saved as a lead', {
      icon: 'ℹ️',
      style: { background: '#3b82f6', color: '#ffffff' },
    })
  }

  const handleReset = () => {
    setSearchQuery('')
    setSearchResults([])
    setSelectedCustomer(null)
    setSearchType('new_quotation')
    toast.success('Search form has been reset')
  }

  // Save quotation as lead (when not converted to policy)
  const saveQuotationAsLead = (quotationData: any) => {
    try {
      const leads = JSON.parse(localStorage.getItem('leads') || '[]')
      const leadId = `LEAD-${Date.now().toString().slice(-6)}`
      
      const lead = {
        id: leadId,
        leadId: leadId,
        customerType: quotationData.customerType,
        firstName: quotationData.firstName,
        lastName: quotationData.lastName,
        companyName: quotationData.companyName,
        email: quotationData.email,
        phone: quotationData.phone,
        address: quotationData.address,
        city: quotationData.city,
        state: quotationData.state,
        pincode: quotationData.pincode,
        policyType: quotationData.policyType,
        quotationData: quotationData,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        source: 'QUOTATION_FORM'
      }
      
      leads.push(lead)
      localStorage.setItem('leads', JSON.stringify(leads))
      
      toast.success(`Quotation saved as lead: ${leadId}`)
      return leadId
    } catch (error) {
      console.error('Error saving lead:', error)
      toast.error('Failed to save lead')
      return null
    }
  }

  // Convert lead to customer (when policy is issued)
  const convertLeadToCustomer = (leadId: string, policyData: any) => {
    try {
      const leads = JSON.parse(localStorage.getItem('leads') || '[]')
      const customers = JSON.parse(localStorage.getItem('issuedPolicies') || '[]')
      
      const leadIndex = leads.findIndex((lead: any) => lead.id === leadId)
      if (leadIndex === -1) {
        toast.error('Lead not found')
        return false
      }
      
      const lead = leads[leadIndex]
      const customerId = `CUST-${Date.now().toString().slice(-6)}`
      
      const customer = {
        id: customerId,
        customerId: customerId,
        customerType: lead.customerType,
        firstName: lead.firstName,
        lastName: lead.lastName,
        companyName: lead.companyName,
        email: lead.email,
        phone: lead.phone,
        address: lead.address,
        city: lead.city,
        state: lead.state,
        pincode: lead.pincode,
        policyType: lead.policyType,
        policyNumber: policyData.policyNumber,
        certificateNumber: policyData.certificateNumber,
        premiumAmount: policyData.premiumAmount,
        coverageAmount: policyData.coverageAmount,
        policyTerm: policyData.policyTerm,
        status: 'ACTIVE',
        issuedAt: new Date().toISOString(),
        createdAt: lead.createdAt,
        updatedAt: new Date().toISOString(),
        convertedFromLead: leadId
      }
      
      // Add to customers
      customers.push(customer)
      localStorage.setItem('issuedPolicies', JSON.stringify(customers))
      
      // Update lead status
      leads[leadIndex].status = 'CONVERTED'
      leads[leadIndex].convertedToCustomer = customerId
      leads[leadIndex].convertedAt = new Date().toISOString()
      leads[leadIndex].updatedAt = new Date().toISOString()
      localStorage.setItem('leads', JSON.stringify(leads))
      
      toast.success(`Lead ${leadId} converted to customer ${customerId}`)
      return true
    } catch (error) {
      console.error('Error converting lead to customer:', error)
      toast.error('Failed to convert lead to customer')
      return false
    }
  }

  const getSearchIcon = (type: string) => {
    switch (type) {
      case 'customer_id': return <IdentificationIcon className="h-5 w-5" />
      case 'customer_name': return <UserIcon className="h-5 w-5" />
      case 'mobile': return <PhoneIcon className="h-5 w-5" />
      case 'pan': return <CreditCardIcon className="h-5 w-5" />
      case 'policy': return <DocumentTextIcon className="h-5 w-5" />
      case 'new_quotation': return <UserPlusIcon className="h-5 w-5" />
      default: return <MagnifyingGlassIcon className="h-5 w-5" />
    }
  }

  // Manufacturers by vehicle type
  const manufacturers = {
    '2-WHEELER': [
      { id: 'HERO', name: 'Hero MotoCorp', type: '2-WHEELER' },
      { id: 'HONDA_2W', name: 'Honda Motorcycle', type: '2-WHEELER' },
      { id: 'BAJAJ', name: 'Bajaj Auto', type: '2-WHEELER' },
      { id: 'TVS', name: 'TVS Motor', type: '2-WHEELER' },
      { id: 'ROYAL_ENFIELD', name: 'Royal Enfield', type: '2-WHEELER' },
      { id: 'YAMAHA', name: 'Yamaha', type: '2-WHEELER' },
      { id: 'SUZUKI_2W', name: 'Suzuki Motorcycle', type: '2-WHEELER' }
    ],
    'PRIVATE': [
      { id: 'MARUTI', name: 'Maruti Suzuki', type: 'PRIVATE' },
      { id: 'HYUNDAI', name: 'Hyundai', type: 'PRIVATE' },
      { id: 'TATA', name: 'Tata Motors', type: 'PRIVATE' },
      { id: 'HONDA', name: 'Honda Cars', type: 'PRIVATE' },
      { id: 'MAHINDRA', name: 'Mahindra', type: 'PRIVATE' },
      { id: 'KIA', name: 'Kia', type: 'PRIVATE' },
      { id: 'MG', name: 'MG Motor', type: 'PRIVATE' },
      { id: 'TOYOTA', name: 'Toyota', type: 'PRIVATE' }
    ],
    'PCV': [
      { id: 'TATA_PCV', name: 'Tata Motors (PCV)', type: 'PCV' },
      { id: 'ASHOK_LEYLAND_PCV', name: 'Ashok Leyland (PCV)', type: 'PCV' },
      { id: 'MAHINDRA_PCV', name: 'Mahindra (PCV)', type: 'PCV' },
      { id: 'FORCE_PCV', name: 'Force Motors (PCV)', type: 'PCV' },
      { id: 'EICHER_PCV', name: 'Eicher (PCV)', type: 'PCV' },
      { id: 'SML_ISUZU_PCV', name: 'SML Isuzu (PCV)', type: 'PCV' },
      { id: 'MARCOPOLO_PCV', name: 'Marcopolo (PCV)', type: 'PCV' },
      { id: 'VOLVO_PCV', name: 'Volvo Buses', type: 'PCV' },
      { id: 'SCANIA_PCV', name: 'Scania (PCV)', type: 'PCV' },
      { id: 'MERCEDES_PCV', name: 'Mercedes-Benz (PCV)', type: 'PCV' }
    ],
    'GCV': [
      { id: 'TATA_GCV', name: 'Tata Motors (GCV)', type: 'GCV' },
      { id: 'ASHOK_LEYLAND_GCV', name: 'Ashok Leyland (GCV)', type: 'GCV' },
      { id: 'EICHER', name: 'Eicher Motors', type: 'GCV' },
      { id: 'BHARAT_BENZ', name: 'Bharat Benz', type: 'GCV' },
      { id: 'MAHINDRA_GCV', name: 'Mahindra (GCV)', type: 'GCV' }
    ],
    'MISC-D': [
      { id: 'MAHINDRA_TRACTOR', name: 'Mahindra Tractors', type: 'MISC-D' },
      { id: 'JOHN_DEERE', name: 'John Deere', type: 'MISC-D' },
      { id: 'FORCE_AMBULANCE', name: 'Force Motors (Ambulance)', type: 'MISC-D' },
      { id: 'TATA_AMBULANCE', name: 'Tata Motors (Ambulance)', type: 'MISC-D' },
      { id: 'JCB', name: 'JCB (Heavy Earth Movers)', type: 'MISC-D' },
      { id: 'CATERPILLAR', name: 'Caterpillar', type: 'MISC-D' }
    ]
  }

  // Models by manufacturer
  const models: Record<string, Array<{id: string, name: string}>> = {
    // 2-Wheeler Models
    'HERO': [
      { id: 'SPLENDOR', name: 'Splendor Plus' },
      { id: 'HF_DELUXE', name: 'HF Deluxe' },
      { id: 'PASSION', name: 'Passion Pro' }
    ],
    'HONDA_2W': [
      { id: 'ACTIVA', name: 'Activa' },
      { id: 'SHINE', name: 'Shine' },
      { id: 'CB_SHINE', name: 'CB Shine' }
    ],
    'BAJAJ': [
      { id: 'PULSAR', name: 'Pulsar' },
      { id: 'PLATINA', name: 'Platina' },
      { id: 'CT', name: 'CT 100' }
    ],
    // Private Car Models
    'MARUTI': [
      { id: 'SWIFT', name: 'Swift' },
      { id: 'BALENO', name: 'Baleno' },
      { id: 'DZIRE', name: 'Dzire' },
      { id: 'ALTO', name: 'Alto' },
      { id: 'WAGON_R', name: 'Wagon R' },
      { id: 'BREZZA', name: 'Brezza' },
      { id: 'ERTIGA', name: 'Ertiga' },
      { id: 'CIAZ', name: 'Ciaz' }
    ],
    'HYUNDAI': [
      { id: 'I20', name: 'i20' },
      { id: 'CRETA', name: 'Creta' },
      { id: 'VENUE', name: 'Venue' },
      { id: 'VERNA', name: 'Verna' },
      { id: 'GRAND_I10', name: 'Grand i10 Nios' },
      { id: 'ALCAZAR', name: 'Alcazar' },
      { id: 'AURA', name: 'Aura' }
    ],
    'TATA': [
      { id: 'NEXON', name: 'Nexon' },
      { id: 'HARRIER', name: 'Harrier' },
      { id: 'PUNCH', name: 'Punch' },
      { id: 'SAFARI', name: 'Safari' },
      { id: 'ALTROZ', name: 'Altroz' },
      { id: 'TIAGO', name: 'Tiago' },
      { id: 'TIGOR', name: 'Tigor' }
    ],
    'HONDA': [
      { id: 'CITY', name: 'City' },
      { id: 'AMAZE', name: 'Amaze' },
      { id: 'ELEVATE', name: 'Elevate' },
      { id: 'CIVIC', name: 'Civic' }
    ],
    'MAHINDRA': [
      { id: 'SCORPIO', name: 'Scorpio' },
      { id: 'XUV700', name: 'XUV700' },
      { id: 'XUV300', name: 'XUV300' },
      { id: 'THAR', name: 'Thar' },
      { id: 'BOLERO', name: 'Bolero' },
      { id: 'SCORPIO_N', name: 'Scorpio N' }
    ],
    'KIA': [
      { id: 'SELTOS', name: 'Seltos' },
      { id: 'SONET', name: 'Sonet' },
      { id: 'CARENS', name: 'Carens' },
      { id: 'EV6', name: 'EV6' }
    ],
    'MG': [
      { id: 'HECTOR', name: 'Hector' },
      { id: 'ASTOR', name: 'Astor' },
      { id: 'ZS_EV', name: 'ZS EV' },
      { id: 'GLOSTER', name: 'Gloster' }
    ],
    'TOYOTA': [
      { id: 'FORTUNER', name: 'Fortuner' },
      { id: 'INNOVA', name: 'Innova Crysta' },
      { id: 'GLANZA', name: 'Glanza' },
      { id: 'URBAN_CRUISER', name: 'Urban Cruiser Hyryder' },
      { id: 'CAMRY', name: 'Camry' }
    ],
    // PCV Models (Passenger Carrying Vehicles)
    'TATA_PCV': [
      { id: 'STARBUS', name: 'Starbus' },
      { id: 'STARBUS_ULTRA', name: 'Starbus Ultra' },
      { id: 'STARBUS_HYBRID', name: 'Starbus Hybrid' },
      { id: 'ULTRA_URBAN', name: 'Ultra Urban' },
      { id: 'ULTRA_STAFF', name: 'Ultra Staff Bus' },
      { id: 'LP_410', name: 'LP 410' },
      { id: 'LP_710', name: 'LP 710' },
      { id: 'WINGER', name: 'Winger' },
      { id: 'MAGIC', name: 'Magic' },
      { id: 'MAGIC_EXPRESS', name: 'Magic Express' }
    ],
    'ASHOK_LEYLAND_PCV': [
      { id: 'LYNX', name: 'Lynx' },
      { id: 'VIKING', name: 'Viking' },
      { id: 'CHEETAH', name: 'Cheetah' },
      { id: 'PANTHER', name: 'Panther' },
      { id: 'VESTIBULE', name: 'Vestibule' },
      { id: 'MITR', name: 'MiTR' },
      { id: 'AVIA', name: 'Avia' },
      { id: 'OPTARE', name: 'Optare' },
      { id: 'STAG', name: 'Stag' },
      { id: 'DOST_PLUS', name: 'Dost Plus' }
    ],
    'MAHINDRA_PCV': [
      { id: 'TOURISTER', name: 'Tourister' },
      { id: 'TOURISTER_COSMO', name: 'Tourister Cosmo' },
      { id: 'TOURISTER_EXECUTIVE', name: 'Tourister Executive' },
      { id: 'SUPRO_MAXITRUCK', name: 'Supro Maxitruck' },
      { id: 'SUPRO_MINITRUCK', name: 'Supro Minitruck' },
      { id: 'SUPRO_PASSENGER', name: 'Supro Passenger' },
      { id: 'ALFA_LOAD', name: 'Alfa Load' },
      { id: 'ALFA_PASSENGER', name: 'Alfa Passenger' }
    ],
    'FORCE_PCV': [
      { id: 'TRAVELLER', name: 'Traveller' },
      { id: 'TRAVELLER_26', name: 'Traveller 26 Seater' },
      { id: 'TRAVELLER_3350', name: 'Traveller 3350' },
      { id: 'TRAVELLER_3700', name: 'Traveller 3700' },
      { id: 'URBANIA', name: 'Urbania' },
      { id: 'CITILINE', name: 'Citiline' },
      { id: 'MINIDOR', name: 'Minidor' },
      { id: 'TEMPO_TRAVELLER', name: 'Tempo Traveller' }
    ],
    'EICHER_PCV': [
      { id: 'SKYLINE', name: 'Skyline' },
      { id: 'SKYLINE_PRO', name: 'Skyline Pro' },
      { id: 'STARLINE', name: 'Starline' },
      { id: 'SKYLINE_PRO_3008', name: 'Skyline Pro 3008' },
      { id: 'SKYLINE_PRO_3009', name: 'Skyline Pro 3009' },
      { id: 'STARLINE_LUXURY', name: 'Starline Luxury' }
    ],
    'SML_ISUZU_PCV': [
      { id: 'SARTAJ', name: 'Sartaj' },
      { id: 'SARTAJ_GS', name: 'Sartaj GS' },
      { id: 'SARTAJ_HS', name: 'Sartaj HS' },
      { id: 'EXECUTIVE', name: 'Executive' },
      { id: 'STAFF_BUS', name: 'Staff Bus' },
      { id: 'SCHOOL_BUS', name: 'School Bus' }
    ],
    'MARCOPOLO_PCV': [
      { id: 'PARADISO', name: 'Paradiso' },
      { id: 'PARADISO_G7', name: 'Paradiso G7' },
      { id: 'VIALE', name: 'Viale' },
      { id: 'VIALE_BRT', name: 'Viale BRT' },
      { id: 'TORINO', name: 'Torino' }
    ],
    'VOLVO_PCV': [
      { id: 'VOLVO_9400', name: 'Volvo 9400' },
      { id: 'VOLVO_9600', name: 'Volvo 9600' },
      { id: 'VOLVO_9700', name: 'Volvo 9700' },
      { id: 'VOLVO_B7R', name: 'Volvo B7R' },
      { id: 'VOLVO_B9R', name: 'Volvo B9R' },
      { id: 'VOLVO_B11R', name: 'Volvo B11R' }
    ],
    'SCANIA_PCV': [
      { id: 'METROLINK', name: 'Metrolink' },
      { id: 'METROLINK_HD', name: 'Metrolink HD' },
      { id: 'METROLINK_CNG', name: 'Metrolink CNG' },
      { id: 'TOURING_HD', name: 'Touring HD' },
      { id: 'TOURING_HD_13', name: 'Touring HD 13' }
    ],
    'MERCEDES_PCV': [
      { id: 'MERCEDES_OF_1623', name: 'OF 1623' },
      { id: 'MERCEDES_OF_1626', name: 'OF 1626' },
      { id: 'MERCEDES_OF_917', name: 'OF 917' },
      { id: 'MERCEDES_CITARO', name: 'Citaro' },
      { id: 'MERCEDES_TOURISMO', name: 'Tourismo' }
    ],
    // GCV Models
    'TATA_GCV': [
      { id: 'ACE', name: 'Ace' },
      { id: 'PRIMA', name: 'Prima' },
      { id: 'SIGNA', name: 'Signa' }
    ],
    'ASHOK_LEYLAND_GCV': [
      { id: 'DOST', name: 'Dost' },
      { id: 'PARTNER', name: 'Partner' }
    ],
    'EICHER': [
      { id: 'PRO_2000', name: 'Pro 2000' },
      { id: 'PRO_3000', name: 'Pro 3000' }
    ],
    // Misc-D Models
    'MAHINDRA_TRACTOR': [
      { id: 'YUVO', name: 'Yuvo' },
      { id: 'ARJUN', name: 'Arjun' }
    ],
    'JOHN_DEERE': [
      { id: '5000_SERIES', name: '5000 Series' },
      { id: '3000_SERIES', name: '3000 Series' }
    ],
    'JCB': [
      { id: 'EXCAVATOR', name: 'Excavator' },
      { id: 'BACKHOE', name: 'Backhoe Loader' }
    ]
  }

  // Variants by model
  const variants: Record<string, Array<{id: string, name: string}>> = {
    // 2-Wheeler Variants
    'SPLENDOR': [
      { id: 'PLUS_BS6', name: 'Plus BS6' },
      { id: 'PLUS_XTEC', name: 'Plus Xtec' }
    ],
    'ACTIVA': [
      { id: '6G_STD', name: '6G Standard' },
      { id: '6G_DLX', name: '6G Deluxe' }
    ],
    'PULSAR': [
      { id: '150_NEON', name: '150 Neon' },
      { id: 'NS200', name: 'NS200' }
    ],
    // Private Car Variants - Maruti Suzuki
    'SWIFT': [
      { id: 'LXI', name: 'LXI' },
      { id: 'VXI', name: 'VXI' },
      { id: 'ZXI', name: 'ZXI' },
      { id: 'ZXI_PLUS', name: 'ZXI Plus' }
    ],
    'BALENO': [
      { id: 'SIGMA', name: 'Sigma' },
      { id: 'DELTA', name: 'Delta' },
      { id: 'ZETA', name: 'Zeta' },
      { id: 'ALPHA', name: 'Alpha' }
    ],
    'DZIRE': [
      { id: 'LXI', name: 'LXI' },
      { id: 'VXI', name: 'VXI' },
      { id: 'ZXI', name: 'ZXI' },
      { id: 'ZXI_PLUS', name: 'ZXI Plus' }
    ],
    'ALTO': [
      { id: 'STD', name: 'Standard' },
      { id: 'LXI', name: 'LXI' },
      { id: 'VXI', name: 'VXI' }
    ],
    'WAGON_R': [
      { id: 'LXI', name: 'LXI' },
      { id: 'VXI', name: 'VXI' },
      { id: 'ZXI', name: 'ZXI' }
    ],
    'BREZZA': [
      { id: 'LXI', name: 'LXI' },
      { id: 'VXI', name: 'VXI' },
      { id: 'ZXI', name: 'ZXI' },
      { id: 'ZXI_PLUS', name: 'ZXI Plus' }
    ],
    'ERTIGA': [
      { id: 'LXI', name: 'LXI' },
      { id: 'VXI', name: 'VXI' },
      { id: 'ZXI', name: 'ZXI' },
      { id: 'ZXI_PLUS', name: 'ZXI Plus' }
    ],
    'CIAZ': [
      { id: 'SIGMA', name: 'Sigma' },
      { id: 'DELTA', name: 'Delta' },
      { id: 'ZETA', name: 'Zeta' },
      { id: 'ALPHA', name: 'Alpha' }
    ],
    // Hyundai Variants
    'I20': [
      { id: 'MAGNA', name: 'Magna' },
      { id: 'SPORTZ', name: 'Sportz' },
      { id: 'ASTA', name: 'Asta' },
      { id: 'ASTA_O', name: 'Asta(O)' }
    ],
    'CRETA': [
      { id: 'E', name: 'E' },
      { id: 'EX', name: 'EX' },
      { id: 'S', name: 'S' },
      { id: 'SX', name: 'SX' },
      { id: 'SX_O', name: 'SX(O)' }
    ],
    'VENUE': [
      { id: 'E', name: 'E' },
      { id: 'S', name: 'S' },
      { id: 'SX', name: 'SX' },
      { id: 'SX_O', name: 'SX(O)' }
    ],
    'VERNA': [
      { id: 'EX', name: 'EX' },
      { id: 'S', name: 'S' },
      { id: 'SX', name: 'SX' },
      { id: 'SX_O', name: 'SX(O)' }
    ],
    'GRAND_I10': [
      { id: 'ERA', name: 'Era' },
      { id: 'MAGNA', name: 'Magna' },
      { id: 'SPORTZ', name: 'Sportz' },
      { id: 'ASTA', name: 'Asta' }
    ],
    'ALCAZAR': [
      { id: 'PRESTIGE', name: 'Prestige' },
      { id: 'PLATINUM', name: 'Platinum' },
      { id: 'SIGNATURE', name: 'Signature' }
    ],
    'AURA': [
      { id: 'E', name: 'E' },
      { id: 'S', name: 'S' },
      { id: 'SX', name: 'SX' },
      { id: 'SX_O', name: 'SX(O)' }
    ],
    // Tata Variants
    'NEXON': [
      { id: 'XE', name: 'XE' },
      { id: 'XM', name: 'XM' },
      { id: 'XZ', name: 'XZ' },
      { id: 'XZ_PLUS', name: 'XZ Plus' },
      { id: 'XZ_PLUS_LUX', name: 'XZ Plus Lux' }
    ],
    'HARRIER': [
      { id: 'XE', name: 'XE' },
      { id: 'XM', name: 'XM' },
      { id: 'XZ', name: 'XZ' },
      { id: 'XZ_PLUS', name: 'XZ Plus' }
    ],
    'PUNCH': [
      { id: 'PURE', name: 'Pure' },
      { id: 'ADVENTURE', name: 'Adventure' },
      { id: 'ACCOMPLISHED', name: 'Accomplished' },
      { id: 'CREATIVE', name: 'Creative' }
    ],
    'SAFARI': [
      { id: 'XE', name: 'XE' },
      { id: 'XM', name: 'XM' },
      { id: 'XZ', name: 'XZ' },
      { id: 'XZ_PLUS', name: 'XZ Plus' }
    ],
    'ALTROZ': [
      { id: 'XE', name: 'XE' },
      { id: 'XM', name: 'XM' },
      { id: 'XZ', name: 'XZ' },
      { id: 'XZ_PLUS', name: 'XZ Plus' }
    ],
    'TIAGO': [
      { id: 'XE', name: 'XE' },
      { id: 'XM', name: 'XM' },
      { id: 'XT', name: 'XT' },
      { id: 'XZ', name: 'XZ' }
    ],
    'TIGOR': [
      { id: 'XE', name: 'XE' },
      { id: 'XM', name: 'XM' },
      { id: 'XZ', name: 'XZ' },
      { id: 'XZ_PLUS', name: 'XZ Plus' }
    ],
    // Honda Variants
    'CITY': [
      { id: 'V', name: 'V' },
      { id: 'VX', name: 'VX' },
      { id: 'ZX', name: 'ZX' }
    ],
    'AMAZE': [
      { id: 'E', name: 'E' },
      { id: 'S', name: 'S' },
      { id: 'VX', name: 'VX' }
    ],
    'ELEVATE': [
      { id: 'V', name: 'V' },
      { id: 'VX', name: 'VX' },
      { id: 'ZX', name: 'ZX' }
    ],
    'CIVIC': [
      { id: 'V', name: 'V' },
      { id: 'VX', name: 'VX' },
      { id: 'ZX', name: 'ZX' }
    ],
    // Mahindra Variants
    'SCORPIO': [
      { id: 'S3', name: 'S3' },
      { id: 'S5', name: 'S5' },
      { id: 'S7', name: 'S7' },
      { id: 'S9', name: 'S9' },
      { id: 'S11', name: 'S11' }
    ],
    'XUV700': [
      { id: 'MX', name: 'MX' },
      { id: 'AX3', name: 'AX3' },
      { id: 'AX5', name: 'AX5' },
      { id: 'AX7', name: 'AX7' }
    ],
    'XUV300': [
      { id: 'W4', name: 'W4' },
      { id: 'W6', name: 'W6' },
      { id: 'W8', name: 'W8' },
      { id: 'W8_O', name: 'W8(O)' }
    ],
    'THAR': [
      { id: 'AX_OPT', name: 'AX Opt' },
      { id: 'LX', name: 'LX' },
      { id: 'AX', name: 'AX' }
    ],
    'BOLERO': [
      { id: 'B4', name: 'B4' },
      { id: 'B6', name: 'B6' },
      { id: 'B6_O', name: 'B6(O)' }
    ],
    'SCORPIO_N': [
      { id: 'Z2', name: 'Z2' },
      { id: 'Z4', name: 'Z4' },
      { id: 'Z6', name: 'Z6' },
      { id: 'Z8', name: 'Z8' },
      { id: 'Z8_L', name: 'Z8 L' }
    ],
    // Kia Variants
    'SELTOS': [
      { id: 'HTE', name: 'HTE' },
      { id: 'HTK', name: 'HTK' },
      { id: 'HTK_PLUS', name: 'HTK Plus' },
      { id: 'HTX', name: 'HTX' },
      { id: 'GTX', name: 'GTX' },
      { id: 'GTX_PLUS', name: 'GTX Plus' }
    ],
    'SONET': [
      { id: 'HTE', name: 'HTE' },
      { id: 'HTK', name: 'HTK' },
      { id: 'HTK_PLUS', name: 'HTK Plus' },
      { id: 'HTX', name: 'HTX' },
      { id: 'GTX_PLUS', name: 'GTX Plus' }
    ],
    'CARENS': [
      { id: 'PREMIUM', name: 'Premium' },
      { id: 'PRESTIGE', name: 'Prestige' },
      { id: 'PRESTIGE_PLUS', name: 'Prestige Plus' },
      { id: 'LUXURY', name: 'Luxury' },
      { id: 'LUXURY_PLUS', name: 'Luxury Plus' }
    ],
    'EV6': [
      { id: 'GT_LINE', name: 'GT Line' },
      { id: 'GT_LINE_AWD', name: 'GT Line AWD' }
    ],
    // MG Variants
    'HECTOR': [
      { id: 'STYLE', name: 'Style' },
      { id: 'SUPER', name: 'Super' },
      { id: 'SMART', name: 'Smart' },
      { id: 'SHARP', name: 'Sharp' }
    ],
    'ASTOR': [
      { id: 'STYLE', name: 'Style' },
      { id: 'SUPER', name: 'Super' },
      { id: 'SMART', name: 'Smart' },
      { id: 'SHARP', name: 'Sharp' }
    ],
    'ZS_EV': [
      { id: 'EXCITE', name: 'Excite' },
      { id: 'EXCLUSIVE', name: 'Exclusive' }
    ],
    'GLOSTER': [
      { id: 'SUPER', name: 'Super' },
      { id: 'SMART', name: 'Smart' },
      { id: 'SAVVY', name: 'Savvy' }
    ],
    // Toyota Variants
    'FORTUNER': [
      { id: '4X2_MT', name: '4x2 MT' },
      { id: '4X2_AT', name: '4x2 AT' },
      { id: '4X4_MT', name: '4x4 MT' },
      { id: 'LEGENDER', name: 'Legender' }
    ],
    'INNOVA': [
      { id: 'GX', name: 'GX' },
      { id: 'VX', name: 'VX' },
      { id: 'ZX', name: 'ZX' }
    ],
    'GLANZA': [
      { id: 'E', name: 'E' },
      { id: 'S', name: 'S' },
      { id: 'G', name: 'G' }
    ],
    'URBAN_CRUISER': [
      { id: 'S', name: 'S' },
      { id: 'G', name: 'G' },
      { id: 'V', name: 'V' }
    ],
    'CAMRY': [
      { id: 'HYBRID', name: 'Hybrid' }
    ],
    // PCV Variants (Passenger Carrying Vehicles)
    // Tata PCV Variants
    'STARBUS': [
      { id: 'ULTRA_AC_SLEEPER', name: 'Ultra AC Sleeper' },
      { id: 'ULTRA_AC_SEATER', name: 'Ultra AC Seater' },
      { id: 'ULTRA_NON_AC', name: 'Ultra Non-AC' },
      { id: 'ULTRA_MIDI', name: 'Ultra Midi' }
    ],
    'STARBUS_ULTRA': [
      { id: 'AC_LUXURY', name: 'AC Luxury' },
      { id: 'AC_STANDARD', name: 'AC Standard' }
    ],
    'STARBUS_HYBRID': [
      { id: 'HYBRID_AC', name: 'Hybrid AC' }
    ],
    'ULTRA_URBAN': [
      { id: 'AC_CITY', name: 'AC City Bus' },
      { id: 'NON_AC_CITY', name: 'Non-AC City Bus' }
    ],
    'ULTRA_STAFF': [
      { id: 'AC_32_SEATER', name: 'AC 32 Seater' },
      { id: 'NON_AC_40_SEATER', name: 'Non-AC 40 Seater' }
    ],
    'LP_410': [
      { id: 'STAFF_BUS', name: 'Staff Bus' },
      { id: 'SCHOOL_BUS', name: 'School Bus' }
    ],
    'LP_710': [
      { id: 'STAFF_BUS', name: 'Staff Bus' },
      { id: 'SCHOOL_BUS', name: 'School Bus' }
    ],
    'WINGER': [
      { id: 'AC_13_SEATER', name: 'AC 13 Seater' },
      { id: 'AC_15_SEATER', name: 'AC 15 Seater' },
      { id: 'NON_AC_17_SEATER', name: 'Non-AC 17 Seater' }
    ],
    'MAGIC': [
      { id: 'DIESEL', name: 'Diesel' },
      { id: 'CNG', name: 'CNG' }
    ],
    'MAGIC_EXPRESS': [
      { id: 'DIESEL', name: 'Diesel' },
      { id: 'CNG', name: 'CNG' }
    ],
    // Ashok Leyland PCV Variants
    'LYNX': [
      { id: 'AC_VARIANT', name: 'AC Variant' },
      { id: 'NON_AC_VARIANT', name: 'Non-AC Variant' },
      { id: 'SCHOOL_BUS', name: 'School Bus' }
    ],
    'VIKING': [
      { id: 'AC_SLEEPER', name: 'AC Sleeper' },
      { id: 'AC_SEATER', name: 'AC Seater' },
      { id: 'NON_AC', name: 'Non-AC' }
    ],
    'CHEETAH': [
      { id: 'AC_LUXURY', name: 'AC Luxury' },
      { id: 'AC_STANDARD', name: 'AC Standard' }
    ],
    'PANTHER': [
      { id: 'AC_CITY', name: 'AC City Bus' },
      { id: 'NON_AC_CITY', name: 'Non-AC City Bus' }
    ],
    'VESTIBULE': [
      { id: 'AC_PREMIUM', name: 'AC Premium' },
      { id: 'AC_STANDARD', name: 'AC Standard' }
    ],
    'MITR': [
      { id: 'SCHOOL_BUS', name: 'School Bus' },
      { id: 'STAFF_BUS', name: 'Staff Bus' }
    ],
    'AVIA': [
      { id: 'AC_VARIANT', name: 'AC Variant' },
      { id: 'NON_AC_VARIANT', name: 'Non-AC Variant' }
    ],
    'OPTARE': [
      { id: 'CITY_BUS', name: 'City Bus' }
    ],
    'STAG': [
      { id: 'AC_LUXURY', name: 'AC Luxury' },
      { id: 'AC_STANDARD', name: 'AC Standard' }
    ],
    'DOST_PLUS': [
      { id: 'STAFF_CARRIER', name: 'Staff Carrier' }
    ],
    // Mahindra PCV Variants
    'TOURISTER': [
      { id: 'AC_STANDARD', name: 'AC Standard' },
      { id: 'NON_AC', name: 'Non-AC' }
    ],
    'TOURISTER_COSMO': [
      { id: 'AC_LUXURY', name: 'AC Luxury' }
    ],
    'TOURISTER_EXECUTIVE': [
      { id: 'AC_PREMIUM', name: 'AC Premium' }
    ],
    'SUPRO_MAXITRUCK': [
      { id: 'PASSENGER_CARRIER', name: 'Passenger Carrier' }
    ],
    'SUPRO_MINITRUCK': [
      { id: 'PASSENGER_CARRIER', name: 'Passenger Carrier' }
    ],
    'SUPRO_PASSENGER': [
      { id: 'VX_8_SEATER', name: 'VX 8 Seater' },
      { id: 'VX_9_SEATER', name: 'VX 9 Seater' }
    ],
    'ALFA_LOAD': [
      { id: 'PASSENGER_VARIANT', name: 'Passenger Variant' }
    ],
    'ALFA_PASSENGER': [
      { id: 'DI', name: 'DI' },
      { id: 'DX', name: 'DX' }
    ],
    // Force PCV Variants
    'TRAVELLER': [
      { id: 'AC_13_SEATER', name: 'AC 13 Seater' },
      { id: 'AC_17_SEATER', name: 'AC 17 Seater' },
      { id: 'NON_AC_20_SEATER', name: 'Non-AC 20 Seater' }
    ],
    'TRAVELLER_26': [
      { id: 'AC_26_SEATER', name: 'AC 26 Seater' },
      { id: 'NON_AC_26_SEATER', name: 'Non-AC 26 Seater' }
    ],
    'TRAVELLER_3350': [
      { id: 'AC_VARIANT', name: 'AC Variant' },
      { id: 'NON_AC_VARIANT', name: 'Non-AC Variant' }
    ],
    'TRAVELLER_3700': [
      { id: 'AC_LUXURY', name: 'AC Luxury' },
      { id: 'AC_STANDARD', name: 'AC Standard' }
    ],
    'URBANIA': [
      { id: 'AC_PREMIUM', name: 'AC Premium' },
      { id: 'AC_STANDARD', name: 'AC Standard' }
    ],
    'CITILINE': [
      { id: 'CITY_BUS', name: 'City Bus' }
    ],
    'MINIDOR': [
      { id: 'SCHOOL_BUS', name: 'School Bus' },
      { id: 'STAFF_BUS', name: 'Staff Bus' }
    ],
    'TEMPO_TRAVELLER': [
      { id: 'AC_12_SEATER', name: 'AC 12 Seater' },
      { id: 'AC_14_SEATER', name: 'AC 14 Seater' }
    ],
    // Eicher PCV Variants
    'SKYLINE': [
      { id: 'AC_SLEEPER', name: 'AC Sleeper' },
      { id: 'AC_SEATER', name: 'AC Seater' }
    ],
    'SKYLINE_PRO': [
      { id: 'AC_LUXURY', name: 'AC Luxury' },
      { id: 'AC_STANDARD', name: 'AC Standard' }
    ],
    'STARLINE': [
      { id: 'AC_PREMIUM', name: 'AC Premium' },
      { id: 'NON_AC', name: 'Non-AC' }
    ],
    'SKYLINE_PRO_3008': [
      { id: 'AC_VARIANT', name: 'AC Variant' }
    ],
    'SKYLINE_PRO_3009': [
      { id: 'AC_VARIANT', name: 'AC Variant' }
    ],
    'STARLINE_LUXURY': [
      { id: 'AC_LUXURY', name: 'AC Luxury' }
    ],
    // SML Isuzu PCV Variants
    'SARTAJ': [
      { id: 'AC_STANDARD', name: 'AC Standard' },
      { id: 'NON_AC', name: 'Non-AC' }
    ],
    'SARTAJ_GS': [
      { id: 'AC_VARIANT', name: 'AC Variant' }
    ],
    'SARTAJ_HS': [
      { id: 'AC_LUXURY', name: 'AC Luxury' }
    ],
    'EXECUTIVE': [
      { id: 'AC_PREMIUM', name: 'AC Premium' }
    ],
    'STAFF_BUS': [
      { id: 'AC_32_SEATER', name: 'AC 32 Seater' },
      { id: 'NON_AC_40_SEATER', name: 'Non-AC 40 Seater' }
    ],
    'SCHOOL_BUS': [
      { id: 'STANDARD', name: 'Standard' },
      { id: 'DELUXE', name: 'Deluxe' }
    ],
    // Marcopolo PCV Variants
    'PARADISO': [
      { id: 'AC_SLEEPER', name: 'AC Sleeper' },
      { id: 'AC_SEATER', name: 'AC Seater' }
    ],
    'PARADISO_G7': [
      { id: 'AC_LUXURY', name: 'AC Luxury' }
    ],
    'VIALE': [
      { id: 'CITY_BUS', name: 'City Bus' }
    ],
    'VIALE_BRT': [
      { id: 'BRT_STANDARD', name: 'BRT Standard' }
    ],
    'TORINO': [
      { id: 'AC_PREMIUM', name: 'AC Premium' }
    ],
    // Volvo PCV Variants
    'VOLVO_9400': [
      { id: 'AC_SLEEPER', name: 'AC Sleeper' },
      { id: 'AC_SEATER', name: 'AC Seater' }
    ],
    'VOLVO_9600': [
      { id: 'AC_LUXURY', name: 'AC Luxury' }
    ],
    'VOLVO_9700': [
      { id: 'AC_PREMIUM', name: 'AC Premium' }
    ],
    'VOLVO_B7R': [
      { id: 'AC_STANDARD', name: 'AC Standard' }
    ],
    'VOLVO_B9R': [
      { id: 'AC_LUXURY', name: 'AC Luxury' }
    ],
    'VOLVO_B11R': [
      { id: 'AC_PREMIUM', name: 'AC Premium' }
    ],
    // Scania PCV Variants
    'METROLINK': [
      { id: 'CITY_BUS', name: 'City Bus' }
    ],
    'METROLINK_HD': [
      { id: 'CITY_BUS_HD', name: 'City Bus HD' }
    ],
    'METROLINK_CNG': [
      { id: 'CNG_CITY_BUS', name: 'CNG City Bus' }
    ],
    'TOURING_HD': [
      { id: 'AC_LUXURY', name: 'AC Luxury' }
    ],
    'TOURING_HD_13': [
      { id: 'AC_PREMIUM', name: 'AC Premium' }
    ],
    // Mercedes PCV Variants
    'MERCEDES_OF_1623': [
      { id: 'AC_STANDARD', name: 'AC Standard' },
      { id: 'NON_AC', name: 'Non-AC' }
    ],
    'MERCEDES_OF_1626': [
      { id: 'AC_LUXURY', name: 'AC Luxury' }
    ],
    'MERCEDES_OF_917': [
      { id: 'STAFF_BUS', name: 'Staff Bus' },
      { id: 'SCHOOL_BUS', name: 'School Bus' }
    ],
    'MERCEDES_CITARO': [
      { id: 'CITY_BUS', name: 'City Bus' }
    ],
    'MERCEDES_TOURISMO': [
      { id: 'AC_PREMIUM', name: 'AC Premium' },
      { id: 'AC_LUXURY', name: 'AC Luxury' }
    ],
    // GCV Variants
    'ACE': [
      { id: 'GOLD', name: 'Gold' },
      { id: 'MEGA', name: 'Mega' }
    ],
    'PRIMA': [
      { id: 'LX_4225', name: 'LX 4225' },
      { id: 'LX_2528', name: 'LX 2528' }
    ],
    'DOST': [
      { id: 'STRONG', name: 'Strong' },
      { id: 'LITE', name: 'Lite' }
    ],
    // Misc-D Variants
    'YUVO': [
      { id: 'TECH_PLUS', name: 'Tech Plus' },
      { id: 'NXT', name: 'NXT' }
    ],
    '5000_SERIES': [
      { id: '5050D', name: '5050D' },
      { id: '5075E', name: '5075E' }
    ],
    'EXCAVATOR': [
      { id: 'JS_205', name: 'JS 205' },
      { id: 'JS_140', name: 'JS 140' }
    ]
  }

  // Indian States from State Master
  const states = [
    { id: '1', name: 'Andhra Pradesh' },
    { id: '2', name: 'Arunachal Pradesh' },
    { id: '3', name: 'Assam' },
    { id: '4', name: 'Bihar' },
    { id: '5', name: 'Chhattisgarh' },
    { id: '6', name: 'Delhi' },
    { id: '7', name: 'Goa' },
    { id: '8', name: 'Gujarat' },
    { id: '9', name: 'Haryana' },
    { id: '10', name: 'Himachal Pradesh' },
    { id: '11', name: 'Jammu and Kashmir' },
    { id: '12', name: 'Jharkhand' },
    { id: '13', name: 'Karnataka' },
    { id: '14', name: 'Kerala' },
    { id: '15', name: 'Madhya Pradesh' },
    { id: '16', name: 'Maharashtra' },
    { id: '17', name: 'Manipur' },
    { id: '18', name: 'Meghalaya' },
    { id: '19', name: 'Mizoram' },
    { id: '20', name: 'Nagaland' },
    { id: '21', name: 'Odisha' },
    { id: '22', name: 'Punjab' },
    { id: '23', name: 'Rajasthan' },
    { id: '24', name: 'Sikkim' },
    { id: '25', name: 'Tamil Nadu' },
    { id: '26', name: 'Telangana' },
    { id: '27', name: 'Tripura' },
    { id: '28', name: 'Uttar Pradesh' },
    { id: '29', name: 'Uttarakhand' },
    { id: '30', name: 'West Bengal' }
  ]

  // Get cities by state ID from City Master
  const getAvailableCities = () => {
    const selectedState = watch('state')
    if (!selectedState) return []
    return INDIAN_CITIES.filter(city => city.stateId === selectedState)
  }


  const getAvailableManufacturers = () => {
    if (!vehicleType) return []
    return manufacturers[vehicleType as keyof typeof manufacturers] || []
  }

  const getAvailableModels = () => {
    if (!oem) return []
    return models[oem] || []
  }

  const getAvailableVariants = () => {
    if (!modelName) return []
    return variants[modelName] || []
  }

  // Policy type restrictions for corporate customers only
  const getCorporateOnlyPolicyTypes = () => {
    return ['HEALTH_GMC', 'LIFE_GTLI', 'LIFE_GPA']
  }

  // Check if selected policy type requires corporate customer
  const isCorporateOnlyPolicyType = (policyType: string) => {
    return getCorporateOnlyPolicyTypes().includes(policyType)
  }

  // Get available policy types - always show all policy types
  const getAvailablePolicyTypes = () => {
    return [
      { value: 'LIFE', label: 'Life' },
      { value: 'LIFE_GTLI', label: 'Life-GTLI (Corporate Only)' },
      { value: 'LIFE_GPA', label: 'Life-GPA (Corporate Only)' },
      { value: 'HEALTH', label: 'Health' },
      { value: 'HEALTH_GMC', label: 'Health-GMC (Corporate Only)' },
      { value: 'GEN_LIABILITY', label: 'Gen-Liability' },
      { value: 'GEN_FIRE', label: 'Gen-Fire' },
      { value: 'GEN_MOTOR', label: 'Gen-Motor' },
      { value: 'GEN_MARINE', label: 'Gen-Marine' },
      { value: 'GEN_MISC', label: 'Gen-Misc' },
      { value: 'GEN_ENGG', label: 'Gen-Engg' },
      { value: 'GEN_PROPERTY', label: 'Gen-Property' },
      { value: 'GEN_MBD', label: 'Gen-MBD' },
      { value: 'GEN_TRAVEL', label: 'Gen-Travel' }
    ]
  }

  // Get available customer types based on selected policy type
  const getAvailableCustomerTypes = () => {
    const selectedPolicyType = watch('policyType')
    
    if (isCorporateOnlyPolicyType(selectedPolicyType)) {
      // If corporate-only policy type is selected, only show Corporate option
      return [
        { value: 'CORPORATE', label: 'Corporate', disabled: false }
      ]
    } else {
      // For other policy types, show both options
      return [
        { value: 'INDIVIDUAL', label: 'Individual', disabled: false },
        { value: 'CORPORATE', label: 'Corporate', disabled: false }
      ]
    }
  }

  const getPolicyTermOptions = () => {
    // NEW CONDITION: Gen-Motor, Rollover – policy term options based on Year of Manufacture (YOM)
    if (policyType === 'GEN_MOTOR' && policyFor === 'ROLLOVER' && yearOfManufacture) {
      const currentYear = new Date().getFullYear()
      const yomYear = parseInt(yearOfManufacture, 10)

      if (!Number.isNaN(yomYear)) {
        const vehicleAge = currentYear - yomYear

        // 1. If YOM is less than 3 years old from current year → only Standalone Own Damage (SAOD)
        if (vehicleAge < 3) {
          return [
            { value: 'SAOD', label: 'Standalone Own Damage (SAOD)' }
          ]
        }

        // 2. If YOM is greater than or equal to 3 years from current year
        //    → show specified comprehensive and liability options
        return [
          { value: 'COMP_1', label: '1 Year Comprehensive' },
          { value: 'COMP_2', label: '2 Year Comprehensive' },
          { value: 'COMP_3', label: '3 Year Comprehensive' },
          { value: 'LIAB_1', label: '1 Year Liability' },
          { value: 'LIAB_3', label: '3 Years Liability' }
        ]
      }
    }

    // Condition 1: Gen-Motor, New, Private, 2-Wheeler
    if (policyType === 'GEN_MOTOR' && policyFor === 'NEW' && vehicleClass === 'PRIVATE' && vehicleType === '2-WHEELER') {
      return [
        { value: 'BUNDLED_1_5', label: 'Bundled 1+5' },
        { value: 'COMPREHENSIVE_5_5', label: 'Comprehensive 5+5' },
        { value: 'ONLY_LIABILITY', label: 'Only Liability' }
      ]
    }
    
    // Condition 2: Gen-Motor, New, Private, Private Car
    if (policyType === 'GEN_MOTOR' && policyFor === 'NEW' && vehicleClass === 'PRIVATE' && vehicleType === 'PRIVATE') {
      return [
        { value: 'BUNDLED_1_3', label: 'Bundled 1+3' },
        { value: 'COMPREHENSIVE_3_3', label: 'Comprehensive 3+3' },
        { value: 'ONLY_LIABILITY', label: 'Only Liability' }
      ]
    }
    
    // Condition 3: Gen-Motor, New, Commercial, PCV/GCV/Misc-D
    if (policyType === 'GEN_MOTOR' && policyFor === 'NEW' && vehicleClass === 'COMMERCIAL' && 
        (vehicleType === 'PCV' || vehicleType === 'GCV' || vehicleType === 'MISC-D')) {
      return [
        { value: 'COMPREHENSIVE_1_1', label: 'Comprehensive 1+1' },
        { value: 'ONLY_LIABILITY', label: 'Only Liability' }
      ]
    }
    
    // Default policy terms for other cases
    return [
      { value: '1', label: '1 Year' },
      { value: '2', label: '2 Years' },
      { value: '3', label: '3 Years' }
    ]
  }

  const handleIdvChange = (delta: number) => {
    setIdvValue((prev) => Math.max(0, prev + delta))
  }

  const handleToggleAddon = (addon: string) => {
    const current = watch('selectedAddons') || []
    const updated = current.includes(addon)
      ? current.filter((a: string) => a !== addon)
      : [...current, addon]
    setValue('selectedAddons', updated as any)
  }

  const handleResubmitQuotes = async () => {
    setLoadingQuotes(true)
    try {
      await fetchInsuranceQuotes()
      toast.success('Re-fetched quotes with updated IDV and add-ons')
    } catch (e) {
      toast.error('Failed to refresh quotes')
    } finally {
      setLoadingQuotes(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to Pre-Sales
              </button>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Insurance Quotation</h1>
          </div>

          {/* Progress Steps */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      currentStep >= step.number 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {currentStep > step.number ? (
                        <CheckCircleIcon className="h-6 w-6" />
                      ) : (
                        <span className="font-semibold">{step.number}</span>
                      )}
                    </div>
                    <div className="mt-2 text-center">
                      <p className="text-sm font-medium text-gray-900">{step.title}</p>
                      <p className="text-xs text-gray-500">{step.description}</p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`h-1 flex-1 mx-4 ${
                      currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Step 1: Customer Search */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Customer Search & Selection</h2>

                {/* Search Type Selection */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                  {[
                    { value: 'customer_id', label: 'Customer ID' },
                    { value: 'customer_name', label: 'Customer Name' },
                    { value: 'mobile', label: 'Mobile Number' },
                    { value: 'pan', label: 'PAN Number' },
                    { value: 'policy', label: 'Policy Number' },
                    { value: 'new_quotation', label: 'New Quotation' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setSearchType(option.value as any)
                        setSearchQuery('')
                        setSearchResults([])
                        if (option.value === 'new_quotation') handleNewQuotation()
                      }}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        searchType === option.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        {getSearchIcon(option.value)}
                        <span className="text-sm font-medium">{option.label}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Search Input */}
                {searchType !== 'new_quotation' && (
                  <div className="space-y-4">
                    <div className="flex space-x-4 mb-6">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder={
                            searchType === 'customer_id' ? 'Enter Customer ID (e.g., CUST001)' :
                            searchType === 'customer_name' ? 'Enter Customer Name (e.g., Rajesh, Priya, Amit)' :
                            searchType === 'mobile' ? 'Enter Mobile Number' :
                            searchType === 'pan' ? 'Enter PAN Number' :
                            searchType === 'policy' ? 'Enter Policy Number' :
                            'Enter search term'
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleSearch}
                        disabled={!searchQuery.trim() || isSearching}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        {isSearching ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                            <span>Searching...</span>
                          </>
                        ) : (
                          <>
                            <MagnifyingGlassIcon className="h-4 w-4" />
                            <span>Search</span>
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={handleReset}
                        className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center space-x-2"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>Reset</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <h3 className="text-sm font-medium text-gray-900">Search Results ({searchResults.length} found)</h3>
                    </div>
                    <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                      {searchResults.map((customer) => (
                        <div
                          key={customer.id}
                          className="p-4 hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleSelectCustomer(customer)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              {customer.customerType === 'INDIVIDUAL' ? (
                                <UserIcon className="h-10 w-10 text-gray-400" />
                              ) : (
                                <BuildingOfficeIcon className="h-10 w-10 text-gray-400" />
                              )}
                              <div>
                                <h4 className="text-sm font-medium text-gray-900">{customer.name}</h4>
                                <p className="text-sm text-gray-500">ID: {customer.customerId}</p>
                                <p className="text-sm text-gray-500">{customer.phone}</p>
                                {customer.panNumber && (
                                  <p className="text-sm text-gray-500">PAN: {customer.panNumber}</p>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                customer.customerType === 'INDIVIDUAL' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-purple-100 text-purple-800'
                              }`}>
                                {customer.customerType}
                              </span>
                              {customer.policyNumber && (
                                <p className="text-sm text-gray-500 mt-1">Policy: {customer.policyNumber}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Policy Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              {/* Back to Search Button and Selected Customer Info */}
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <ArrowLeftIcon className="h-4 w-4 mr-2" />
                  Back to Customer Search
                </button>
                {selectedCustomer && (
                  <div className="text-sm text-gray-600">
                    Selected Customer: <span className="font-medium">{selectedCustomer.name}</span>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Policy Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Policy Type *
                  </label>
                  <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-xs text-blue-800">
                      <span className="font-medium">Note:</span> Policy types marked as "(Corporate Only)" will automatically set the customer type to Corporate when selected.
                    </p>
                  </div>
                  <select
                    {...register('policyType')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => {
                      const selectedPolicyType = e.target.value
                      const currentCustomerType = watch('customerType')
                      
                      // If corporate-only policy type is selected, automatically set customer type to Corporate
                      if (isCorporateOnlyPolicyType(selectedPolicyType)) {
                        if (currentCustomerType !== 'CORPORATE') {
                          setValue('customerType', 'CORPORATE')
                          toast('Customer type automatically changed to Corporate for this policy type', {
                            icon: 'ℹ️',
                            style: { background: '#3b82f6', color: '#ffffff' },
                          })
                        }
                      }
                      
                      // Update the form value
                      setValue('policyType', selectedPolicyType)

                    // Clear customer info when policy type changes
                    const clearKeys: Array<keyof QuotationFormData> = [
                      'firstName','lastName','companyName','registrationNumber','email','phone','address','city','state','pincode'
                    ] as any
                    clearKeys.forEach((k) => setValue(k as any, '' as any, { shouldDirty: false }))
                    setSelectedCustomer(null)
                    try {
                      sessionStorage.removeItem('selectedCustomer')
                      sessionStorage.removeItem('quotationCustomerDraft')
                    } catch {}
                    }}
                  >
                    <option value="">Select Policy Type</option>
                    {getAvailablePolicyTypes().map((policy) => (
                      <option key={policy.value} value={policy.value}>
                        {policy.label}
                      </option>
                    ))}
                  </select>
                  {errors.policyType && <p className="text-red-500 text-xs mt-1">{errors.policyType.message}</p>}
                </div>

                {policyType === 'HEALTH' && customerType === 'INDIVIDUAL' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Plan Type *
                    </label>
                    <select
                      {...register('policyFor')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Plan Type</option>
                      <option value="Individual">Individual</option>
                      <option value="Family Floater">Family Floater</option>
                    </select>
                    {errors.policyFor && <p className="text-red-500 text-xs mt-1">{errors.policyFor.message}</p>}
                  </div>
                )}

                {policyType === 'GEN_MOTOR' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Policy For *
                      </label>
                      <select
                        {...register('policyFor')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select</option>
                        <option value="NEW">New</option>
                        <option value="RENEWAL">Renewal</option>
                        <option value="ROLLOVER">Rollover</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vehicle Class *
                      </label>
                      <select
                        {...register('vehicleClass')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Vehicle Class</option>
                        <option value="PRIVATE">Private</option>
                        <option value="COMMERCIAL">Commercial</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vehicle Type *
                      </label>
                      <select
                        {...register('vehicleType')}
                        onChange={(e) => {
                          setValue('vehicleType', e.target.value)
                          setValue('oem', '')
                          setValue('modelName', '')
                          setValue('variant', '')
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Vehicle Type</option>
                        {vehicleClass === 'PRIVATE' && (
                          <>
                            <option value="2-WHEELER">2-Wheeler</option>
                            <option value="PRIVATE">Private Car</option>
                          </>
                        )}
                        {vehicleClass === 'COMMERCIAL' && (
                          <>
                            <option value="PCV">PCV (Passenger Carrying Vehicle)</option>
                            <option value="GCV">GCV (Goods Carrying Vehicle)</option>
                            <option value="MISC-D">Misc-D (Tractor/Ambulance)</option>
                          </>
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        OEM (Manufacturer) *
                      </label>
                      <select
                        {...register('oem')}
                        onChange={(e) => {
                          setValue('oem', e.target.value)
                          setValue('modelName', '')
                          setValue('variant', '')
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={!vehicleType}
                      >
                        <option value="">Select Manufacturer</option>
                        {getAvailableManufacturers().map((mfr) => (
                          <option key={mfr.id} value={mfr.id}>
                            {mfr.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Model Name *
                      </label>
                      <select
                        {...register('modelName')}
                        onChange={(e) => {
                          setValue('modelName', e.target.value)
                          setValue('variant', '')
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={!oem}
                      >
                        <option value="">Select Model</option>
                        {getAvailableModels().map((model) => (
                          <option key={model.id} value={model.id}>
                            {model.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Variant *
                      </label>
                      <select
                        {...register('variant')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={!modelName}
                      >
                        <option value="">Select Variant</option>
                        {getAvailableVariants().map((variant) => (
                          <option key={variant.id} value={variant.id}>
                            {variant.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fuel Type *
                      </label>
                      <select
                        {...register('fuelType')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Fuel Type</option>
                        <option value="PETROL">Petrol</option>
                        <option value="DIESEL">Diesel</option>
                        <option value="HYBRID">Hybrid</option>
                        <option value="CNG">CNG</option>
                        <option value="ELECTRIC">Electric</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Year of Manufacture *
                      </label>
                      <select
                        {...register('yearOfManufacture')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => {
                          setValue('yearOfManufacture', e.target.value)
                          // For Rollover, reset Policy Term when YOM changes since options depend on YOM
                          if (policyFor === 'ROLLOVER') {
                            setValue('policyTerm', '')
                          }
                        }}
                      >
                        <option value="">Select Year</option>
                        {(() => {
                          const currentYear = new Date().getFullYear()
                          const years = policyFor === 'NEW' 
                            ? [currentYear, currentYear - 1]  // Only current and previous year for new vehicles
                            : [currentYear, currentYear - 1, currentYear - 2, currentYear - 3, currentYear - 4, currentYear - 5]
                          return years.map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))
                        })()}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Registration City *
                      </label>
                      <select
                        {...register('registrationCity')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select City</option>
                        {INDIAN_CITIES.map((city) => (
                          <option key={city.cityId} value={city.name}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ex-Showroom Price *
                      </label>
                      <input
                        type="number"
                        {...register('exShowroomPrice', { valueAsNumber: true })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter price"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Policy Term *
                      </label>
                      <select
                        {...register('policyTerm')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={
                          policyType === 'GEN_MOTOR' && 
                          (!vehicleClass || !vehicleType || (policyFor === 'ROLLOVER' && !yearOfManufacture))
                        }
                      >
                        <option value="">Select Policy Term</option>
                        {getPolicyTermOptions().map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {policyType === 'GEN_MOTOR' && policyFor === 'ROLLOVER' && !yearOfManufacture && (
                        <p className="text-xs text-gray-500 mt-1">Please select Year of Manufacture first</p>
                      )}
                    </div>

                    {policyFor === 'ROLLOVER' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Previous NCB (%) *
                          </label>
                          <select
                            {...register('previousNCB')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select NCB</option>
                            <option value="0">0%</option>
                            <option value="20">20%</option>
                            <option value="25">25%</option>
                            <option value="35">35%</option>
                            <option value="45">45%</option>
                            <option value="50">50%</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Any Claim Availed? *
                          </label>
                          <div className="flex space-x-4">
                            <label className="flex items-center">
                              <input
                                type="radio"
                                {...register('claimAvailed')}
                                value="YES"
                                className="mr-2"
                              />
                              Yes
                            </label>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                {...register('claimAvailed')}
                                value="NO"
                                className="mr-2"
                              />
                              No
                            </label>
                          </div>
                        </div>
                      </>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quotation Date *
                      </label>
                      <input
                        type="date"
                        {...register('quotationDate')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quote Validity (Days) *
                      </label>
                      <input
                        type="number"
                        {...register('validityPeriod', { valueAsNumber: true })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue={30}
                      />
                    </div>
                  </>
                )}
              </div>

              {policyType === 'GEN_MOTOR' && (
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      reset({
                        customerType: 'INDIVIDUAL',
                        policyType: '',
                        validityPeriod: 30
                      })
                    }}
                    className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Reset
                  </button>
                </div>
              )}
              </div>
            </div>
          )}

          {/* Step 3: Previous Policy Details (only shown after selecting "Issue Policy Now" or "Save as Proposal") */}
          {currentStep === 3 && needsPreviousPolicyDetails() && selectedQuote && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Previous Policy Details</h2>
              <p className="text-sm text-gray-600 mb-4">
                Please provide previous Own Damage (OD) and Third Party (TP) policy details for rollover issuance.
              </p>
              
              <div className="border border-yellow-200 bg-yellow-50 rounded-md p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Previous OD Policy Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Previous OD Policy Number *
                      </label>
                      <input
                        type="text"
                        {...register('previousODPolicyNumber')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter previous OD policy number"
                      />
                    </div>
                    {/* Previous OD Insurer */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Previous OD Insurance Company *
                      </label>
                      <select
                        {...register('previousODInsurer')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Insurance Company</option>
                        <option value="HDFC ERGO">HDFC ERGO</option>
                        <option value="ICICI Lombard">ICICI Lombard</option>
                        <option value="Bajaj Allianz">Bajaj Allianz</option>
                        <option value="Tata AIG">Tata AIG</option>
                        <option value="Reliance General">Reliance General</option>
                        <option value="New India Assurance">New India Assurance</option>
                        <option value="Oriental Insurance">Oriental Insurance</option>
                        <option value="United India Insurance">United India Insurance</option>
                        <option value="National Insurance">National Insurance</option>
                        <option value="Future Generali">Future Generali</option>
                        <option value="IFFCO Tokio">IFFCO Tokio</option>
                        <option value="Royal Sundaram">Royal Sundaram</option>
                        <option value="SBI General Insurance">SBI General Insurance</option>
                        <option value="Kotak General Insurance">Kotak General Insurance</option>
                        <option value="Liberty General Insurance">Liberty General Insurance</option>
                        <option value="Cholamandalam MS">Cholamandalam MS</option>
                        <option value="Magma HDI">Magma HDI</option>
                        <option value="Shriram General Insurance">Shriram General Insurance</option>
                        <option value="Universal Sompo">Universal Sompo</option>
                        <option value="Bharti AXA">Bharti AXA</option>
                      </select>
                    </div>
                    {/* Previous OD Policy Period */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Previous OD Policy Period (From) *
                      </label>
                      <input
                        type="date"
                        {...register('previousODPolicyFrom')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Previous OD Policy Period (To) *
                      </label>
                      <input
                        type="date"
                        {...register('previousODPolicyTo')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    {/* Previous TP Policy Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Previous TP Policy Number *
                      </label>
                      <input
                        type="text"
                        {...register('previousTPPolicyNumber')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter previous TP policy number"
                      />
                    </div>
                    {/* Previous TP Insurer */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Previous TP Insurance Company *
                      </label>
                      <select
                        {...register('previousTPInsurer')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Insurance Company</option>
                        <option value="HDFC ERGO">HDFC ERGO</option>
                        <option value="ICICI Lombard">ICICI Lombard</option>
                        <option value="Bajaj Allianz">Bajaj Allianz</option>
                        <option value="Tata AIG">Tata AIG</option>
                        <option value="Reliance General">Reliance General</option>
                        <option value="New India Assurance">New India Assurance</option>
                        <option value="Oriental Insurance">Oriental Insurance</option>
                        <option value="United India Insurance">United India Insurance</option>
                        <option value="National Insurance">National Insurance</option>
                        <option value="Future Generali">Future Generali</option>
                        <option value="IFFCO Tokio">IFFCO Tokio</option>
                        <option value="Royal Sundaram">Royal Sundaram</option>
                        <option value="SBI General Insurance">SBI General Insurance</option>
                        <option value="Kotak General Insurance">Kotak General Insurance</option>
                        <option value="Liberty General Insurance">Liberty General Insurance</option>
                        <option value="Cholamandalam MS">Cholamandalam MS</option>
                        <option value="Magma HDI">Magma HDI</option>
                        <option value="Shriram General Insurance">Shriram General Insurance</option>
                        <option value="Universal Sompo">Universal Sompo</option>
                        <option value="Bharti AXA">Bharti AXA</option>
                      </select>
                    </div>
                    {/* Previous TP Policy Period */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Previous TP Policy Period (From) *
                      </label>
                      <input
                        type="date"
                        {...register('previousTPPolicyFrom')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Previous TP Policy Period (To) *
                      </label>
                      <input
                        type="date"
                        {...register('previousTPPolicyTo')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    {/* Previous Premium Paid */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Previous Premium Paid (₹) *
                      </label>
                      <input
                        type="number"
                        {...register('previousPremiumPaid', { valueAsNumber: true })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter previous premium paid"
                        min={0}
                      />
                    </div>
                  </div>
                </div>
            </div>
          )}

          {/* Step 4: Customer Information */}
          {currentStep === 4 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
              
              {/* Customer Type - Full Width */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Type *
                </label>
                {isCorporateOnlyPolicyType(watch('policyType')) && (
                  <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-xs text-blue-800">
                      <span className="font-medium">Note:</span> This policy type requires Corporate customer type only.
                    </p>
                  </div>
                )}
                <select
                  {...register('customerType')}
                  className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => {
                    const newCustomerType = e.target.value
                    const currentPolicyType = watch('policyType')
                    
                    // If switching to individual and current policy type is corporate-only, clear it
                    if (newCustomerType === 'INDIVIDUAL' && isCorporateOnlyPolicyType(currentPolicyType)) {
                      setValue('policyType', '')
                      toast('Policy type cleared. Corporate-only policy types are not available for individual customers.', {
                        icon: '⚠️',
                        style: { background: '#f59e0b', color: '#ffffff' },
                      })
                    }
                    
                    // Update the form value
                    setValue('customerType', newCustomerType as 'INDIVIDUAL' | 'CORPORATE')
                  }}
                >
                  {getAvailableCustomerTypes().map((customerType) => (
                    <option 
                      key={customerType.value} 
                      value={customerType.value}
                      disabled={customerType.disabled}
                    >
                      {customerType.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {customerType === 'INDIVIDUAL' ? (
                  <>
                    {/* First Name and Last Name in same row */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        {...register('firstName')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter first name"
                      />
                      {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        {...register('lastName')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter last name"
                      />
                      {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
                    </div>

                    {/* Date of Birth and Gender in same row */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        {...register('dateOfBirth')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gender
                      </label>
                      <select
                        {...register('gender')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>

                    {/* Mobile Number and Email in same row */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        {...register('phone')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="10-digit mobile number"
                        maxLength={10}
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        {...register('email')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="your.email@example.com"
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>

                    {/* Address and Pincode in same row */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address *
                      </label>
                      <textarea
                        {...register('address')}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter complete address"
                      />
                      {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        {...register('pincode')}
                        maxLength={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="6-digit pincode"
                      />
                      {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode.message}</p>}
                    </div>

                    {/* State and City in same row */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State *
                      </label>
                      <select
                        {...register('state')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select State</option>
                        {states.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                      {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <select
                        {...register('city')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={!state}
                      >
                        <option value="">Select City</option>
                        {getAvailableCities().map((c) => (
                          <option key={c.cityId} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                      {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        {...register('companyName')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter company name"
                      />
                      {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName.message}</p>}
                    </div>

                    {/* Address and Pincode in same row */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address *
                      </label>
                      <textarea
                        {...register('address')}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter complete company address"
                      />
                      {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        {...register('pincode')}
                        maxLength={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="6-digit pincode"
                      />
                      {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State *
                      </label>
                      <select
                        {...register('state')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select State</option>
                        {states.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                      {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <select
                        {...register('city')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={!state}
                      >
                        <option value="">Select City</option>
                        {getAvailableCities().map((c) => (
                          <option key={c.cityId} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                      {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                    </div>

                    {/* Contact Person Name and Designation in same row */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Person Name *
                      </label>
                      <input
                        type="text"
                        {...register('firstName')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter contact person name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Designation *
                      </label>
                      <input
                        type="text"
                        {...register('lastName')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Manager, Director"
                      />
                    </div>

                    {/* Contact Person Mobile and Email in same row */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Person Mobile *
                      </label>
                      <input
                        type="tel"
                        {...register('phone')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="10-digit mobile number"
                        maxLength={10}
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Person Email *
                      </label>
                      <input
                        type="email"
                        {...register('email')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="email@company.com"
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>

                    {/* Website URL and Registration Number in same row */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website URL
                      </label>
                      <input
                        type="url"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://www.company.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Registration Number *
                      </label>
                      <input
                        type="text"
                        {...register('dateOfBirth')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Company Registration Number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company PAN *
                      </label>
                      <input
                        type="text"
                        {...register('gender')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                        placeholder="AAACN1234C"
                        maxLength={10}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company GST No *
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                        placeholder="22AAAAA0000A1Z5"
                        maxLength={15}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Step 5: Add-ons Selection */}
          {currentStep === 5 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Add-ons (Optional)</h2>
              <p className="text-sm text-gray-600 mb-4">
                Select additional coverages for your {watch('vehicleClass')} - {watch('vehicleType')} vehicle
              </p>
              
              {getAvailableAddons().length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <ShieldCheckIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No add-ons available for this vehicle type</p>
                  <p className="text-sm text-gray-500 mt-2">You can proceed to compare quotes</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {getAvailableAddons().map((addon) => (
                    <label key={addon.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-start space-x-3">
                          <input 
                            type="checkbox" 
                            checked={(watch('selectedAddons') || []).includes(addon.id)}
                            className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            onChange={(e) => {
                              const addons = watch('selectedAddons') || []
                              if (e.target.checked) {
                                setValue('selectedAddons', [...addons, addon.id])
                              } else {
                                setValue('selectedAddons', addons.filter(a => a !== addon.id))
                              }
                            }}
                          />
                          <div>
                            <h3 className="font-medium text-gray-900">{addon.name}</h3>
                            <p className="text-xs text-gray-500 mt-1">{addon.description}</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-blue-600 ml-7">+ ₹{addon.price.toLocaleString()}</p>
                    </label>
                  ))}
                </div>
              )}

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Selected Add-ons</p>
                    <p className="text-xs text-gray-600 mt-1">{(watch('selectedAddons') || []).length} add-on(s) selected</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Additional Premium</p>
                    <p className="text-lg font-bold text-blue-600">₹{calculateAddonPremium()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Compare Quotes */}
          {currentStep === 6 && (
            <div className="space-y-6">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-6 text-white">
                <h2 className="text-2xl font-bold mb-4">Insurance Quote Comparison</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="opacity-90">Vehicle</p>
                    <p className="font-semibold">{watch('oem')} {watch('modelName')}</p>
                  </div>
                  <div>
                    <p className="opacity-90">Policy Type</p>
                    <p className="font-semibold">{watch('policyType')}</p>
                  </div>
                  <div>
                    <p className="opacity-90">Customer</p>
                    <p className="font-semibold">{watch('customerType') === 'INDIVIDUAL' ? `${watch('firstName')} ${watch('lastName')}` : watch('companyName')}</p>
                  </div>
                  <div>
                    <p className="opacity-90">Policy Term</p>
                    <p className="font-semibold">{watch('policyTerm')}</p>
                  </div>
                </div>
              </div>

              {/* Three-column layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Previous info + IDV and Add-ons */}
                <div className="lg:col-span-3 space-y-6">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Selected Details</h3>
                    <div className="text-sm text-gray-700 space-y-2">
                      <div className="flex justify-between"><span>Vehicle</span><span className="font-medium">{watch('oem')} {watch('modelName')}</span></div>
                      <div className="flex justify-between"><span>Fuel</span><span className="font-medium">{watch('fuelType')}</span></div>
                      <div className="flex justify-between"><span>City</span><span className="font-medium">{watch('city')}</span></div>
                      <div className="flex justify-between"><span>Policy</span><span className="font-medium">{watch('policyType')}</span></div>
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm font-medium text-gray-900 mb-2">Insured Declared Value (IDV)</p>
                      <div className="flex items-center space-x-2">
                        <button type="button" onClick={() => handleIdvChange(-5000)} className="px-2 py-1 border rounded">-</button>
                        <input
                          type="number"
                          value={idvValue}
                          onChange={(e) => setIdvValue(Math.max(0, Number(e.target.value) || 0))}
                          className="w-full px-2 py-1 border rounded"
                        />
                        <button type="button" onClick={() => handleIdvChange(5000)} className="px-2 py-1 border rounded">+</button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Selected Add-ons</h3>
                    <div className="space-y-2 text-sm">
                      {['Zero Depreciation', 'Engine Protect', 'Roadside Assistance', 'Return to Invoice'].map((addon) => (
                        <label key={addon} className="flex items-center justify-between">
                          <span className="text-gray-700">{addon}</span>
                          <input
                            type="checkbox"
                            checked={(watch('selectedAddons') || []).includes(addon)}
                            onChange={() => handleToggleAddon(addon)}
                          />
                        </label>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={handleResubmitQuotes}
                      disabled={loadingQuotes}
                      className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loadingQuotes ? 'Refreshing quotes…' : 'Recalculate Quotes'}
                    </button>
                  </div>
                </div>

                {/* Middle: Quotes list */}
                <div className="lg:col-span-6 space-y-4">
                  {loadingQuotes && (
                    <div className="p-4 text-sm text-blue-800 bg-blue-50 border border-blue-200 rounded">Fetching latest quotes…</div>
                  )}
                  {insuranceQuotes.length === 0 && !loadingQuotes && (
                    <div className="p-4 text-sm text-gray-700 bg-gray-50 border rounded">No quotes yet. Click "Recalculate Quotes" to fetch.</div>
                  )}
                  {insuranceQuotes.map((q) => (
                    <label key={q.id} className={`block border rounded-lg p-4 cursor-pointer hover:shadow ${selectedQuote === q.id ? 'ring-2 ring-blue-500' : 'border-gray-200'}`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{q.company}</p>
                          <p className="text-xs text-gray-500">IDV considered: ₹{(idvValue || 0).toLocaleString('en-IN')}</p>
                          <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-700">
                            <div><span className="text-gray-500">Own Damage:</span> ₹{q.odPremium}</div>
                            <div><span className="text-gray-500">Third Party:</span> ₹{q.tpPremium}</div>
                            <div><span className="text-gray-500">Add-ons:</span> ₹{q.addonPremium}</div>
                            <div className="font-medium"><span className="text-gray-500">Total:</span> ₹{q.totalPremium}</div>
                          </div>
                        </div>
                        <input type="radio" name="quote" checked={selectedQuote === q.id} onChange={() => setSelectedQuote(q.id)} />
                      </div>
                    </label>
                  ))}
                </div>

                {/* Right: Product information */}
                <div className="lg:col-span-3 space-y-6">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Product Information</h3>
                    <div className="text-sm text-gray-700 space-y-2">
                      <div className="flex justify-between"><span>Coverage</span><span className="font-medium">Comprehensive</span></div>
                      <div className="flex justify-between"><span>NCB</span><span className="font-medium">{watch('previousNCB') || 'N/A'}</span></div>
                      <div className="flex justify-between"><span>Claims Availed</span><span className="font-medium">{watch('claimAvailed') || 'No'}</span></div>
                      <div className="flex justify-between"><span>Validity</span><span className="font-medium">{watch('validityPeriod')} days</span></div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Actions</h3>
                    <button type="button" onClick={handleSaveAsProposal} disabled={!selectedQuote || isSubmitting} className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:opacity-50 mb-2">Save as Proposal</button>
                    <button type="button" onClick={handleIssuePolicyNow} disabled={!selectedQuote || isSubmitting} className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50">Issue Policy Now</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Previous
              </button>
            )}
            {/* Special case: Step 4 (Customer Information) with selected quote (came from Quote Comparison) - show "Continue to Policy Issuance" */}
            {currentStep === 4 && selectedQuote && policyType === 'GEN_MOTOR' && policyFor === 'ROLLOVER' ? (
              <button
                type="button"
                onClick={handleIssuePolicyNow}
                disabled={isSubmitting}
                className="ml-auto px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Processing...' : 'Continue to Policy Issuance'}
              </button>
            ) : currentStep < 6 ? (
              <button
                type="button"
                onClick={nextStep}
                className="ml-auto px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <div className="ml-auto flex items-center space-x-3">
                <button
                  type="button"
                  onClick={handleSaveAsProposal}
                  disabled={isSubmitting || !selectedQuote}
                  className="px-6 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Saving...' : '💾 Save as Proposal'}
                </button>
                <button
                  type="button"
                  onClick={handleIssuePolicyNow}
                  disabled={isSubmitting || !selectedQuote}
                  className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Processing...' : '✓ Issue Policy Now'}
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}