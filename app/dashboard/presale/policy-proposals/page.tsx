'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DocumentTextIcon,
  CalendarIcon,
  UserIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  TruckIcon,
  MapPinIcon,
  CurrencyRupeeIcon,
  ShieldCheckIcon,
  PlusIcon,
  MinusIcon,
  DocumentIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface PolicyProposal {
  id: string
  proposalNumber?: string
  customerId?: string
  customerInfo: {
    customerType: string
    firstName?: string
    lastName?: string
    companyName?: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    pincode: string
  }
  policyDetails: {
    policyType: string
    oem?: string
    modelName?: string
    variant?: string
    yearOfManufacture?: string
    registrationCity?: string
    exShowroomPrice?: number
    policyTerm: number | string
    quotationDate: string
  }
  selectedQuote?: {
    companyName: string
    totalPremium: number
    status?: string
    convertedAt?: string
    policyNumber?: string
  }
  selectedAddOns: string[]
  kycStatus: 'pending' | 'verified' | 'rejected'
  panValidation: {
    isValid: boolean
    panNumber: string
    name: string
  }
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'CONVERTED'
  policyNumber?: string
  needsCustomerInfo?: boolean // Flag for Rollover proposals that need Customer Information
  createdAt: string
  updatedAt: string
}

export default function PolicyProposalsPage() {
  const router = useRouter()
  const [proposals, setProposals] = useState<PolicyProposal[]>([])
  const [filteredProposals, setFilteredProposals] = useState<PolicyProposal[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [mobileSearch, setMobileSearch] = useState('')
  const [icSearch, setIcSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [loading, setLoading] = useState(true)
  
  // Dropdown + single input search
  const [searchKey, setSearchKey] = useState<'CUSTOMER_ID' | 'CUSTOMER_NAME' | 'POLICY_TYPE' | 'QUOTE_ID' | 'MOBILE' | 'INSURANCE_COMPANY'>('CUSTOMER_ID')
  const [searchKeyValue, setSearchKeyValue] = useState('')
  
  // Workflow state variables
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedProposal, setSelectedProposal] = useState<PolicyProposal | null>(null)
  const [showOTPModal, setShowOTPModal] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [enteredOTP, setEnteredOTP] = useState('')
  const [showKYCForm, setShowKYCForm] = useState(false)
  const [showProposalForm, setShowProposalForm] = useState(false)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'completed' | 'failed'>('pending')
  const [showPolicyCertificate, setShowPolicyCertificate] = useState(false)
  const [issuedPolicy, setIssuedPolicy] = useState<any>(null)
  const [testMode, setTestMode] = useState(false)
  
  // Previous Policy Details form state (for Rollover proposals)
  const [previousPolicyFormData, setPreviousPolicyFormData] = useState({
    previousODPolicyNumber: '',
    previousODInsurer: '',
    previousODPolicyFrom: '',
    previousODPolicyTo: '',
    previousTPPolicyNumber: '',
    previousTPInsurer: '',
    previousTPPolicyFrom: '',
    previousTPPolicyTo: '',
    previousPremiumPaid: 0
  })

  // Customer Information form state (for proposals)
  const [customerInfoFormData, setCustomerInfoFormData] = useState({
    customerType: 'INDIVIDUAL' as 'INDIVIDUAL' | 'CORPORATE',
    firstName: '',
    lastName: '',
    companyName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  })

  // Initialize previous policy and customer info forms when proposal is selected
  useEffect(() => {
    if (selectedProposal) {
      // Initialize Previous Policy Details if needed
      if (needsPreviousPolicyDetailsForProposal(selectedProposal)) {
        setPreviousPolicyFormData({
          previousODPolicyNumber: (selectedProposal as any).previousODPolicyNumber || '',
          previousODInsurer: (selectedProposal as any).previousODInsurer || '',
          previousODPolicyFrom: (selectedProposal as any).previousODPolicyFrom || '',
          previousODPolicyTo: (selectedProposal as any).previousODPolicyTo || '',
          previousTPPolicyNumber: (selectedProposal as any).previousTPPolicyNumber || '',
          previousTPInsurer: (selectedProposal as any).previousTPInsurer || '',
          previousTPPolicyFrom: (selectedProposal as any).previousTPPolicyFrom || '',
          previousTPPolicyTo: (selectedProposal as any).previousTPPolicyTo || '',
          previousPremiumPaid: (selectedProposal as any).previousPremiumPaid || 0
        })
      }
      
      // Initialize Customer Information
      if (selectedProposal.customerInfo) {
        setCustomerInfoFormData({
          customerType: (selectedProposal.customerInfo.customerType as 'INDIVIDUAL' | 'CORPORATE') || 'INDIVIDUAL',
          firstName: selectedProposal.customerInfo.firstName || '',
          lastName: selectedProposal.customerInfo.lastName || '',
          companyName: selectedProposal.customerInfo.companyName || '',
          email: selectedProposal.customerInfo.email || '',
          phone: selectedProposal.customerInfo.phone || '',
          address: selectedProposal.customerInfo.address || '',
          city: selectedProposal.customerInfo.city || '',
          state: selectedProposal.customerInfo.state || '',
          pincode: selectedProposal.customerInfo.pincode || ''
        })
      }
    }
  }, [selectedProposal])

  // KYC form state
  const [kycFormData, setKycFormData] = useState({
    ckycNumber: '',
    panNumber: '',
    panFile: null as File | null,
    panFilePreview: '',
    panValidation: {
      isValid: false,
      error: ''
    }
  })
  
  // Proposal form state
  const [proposalFormData, setProposalFormData] = useState({
    // Other Vehicle Details
    chassisNumber: '',
    engineNumber: '',
    electricalAccessories: '',
    electricalAccessoriesValue: '',
    nonElectricalAccessories: '',
    nonElectricalAccessoriesValue: '',
    // Discounts
    discountAntiTheft: false,
    discountAntiTheftPrice: '',
    discountHandicapped: false,
    discountVoluntary: false,
    discountAAMembership: false,
    discountAAMembershipNo: '',
    discountGeoExtension: false,
    discountGeoCountries: [] as string[],
    // Liability Details
    liabilityCompulsoryPA: false,
    liabilityTPPDExtension: false,
    liabilityDriverCover: false,
    liabilityCleanerCover: false,
    // Nomination Details
    nomineeName: '',
    nomineeRelationship: '',
    nomineeContactNo: '',
    nomineeEmail: '',
    nomineeSex: '',
    nomineeDOB: '',
    // Payment
    paymentMode: '',
    additionalInfo: '',
    declarationAccepted: false
  })
  
  // Mock data for workflow
  const [addOns] = useState([
    { id: '1', name: 'Zero Depreciation', premium: 5000 },
    { id: '2', name: 'Engine Protection', premium: 3000 },
    { id: '3', name: 'Roadside Assistance', premium: 2000 },
    { id: '4', name: 'Key Replacement', premium: 1500 },
    { id: '5', name: 'Consumables Cover', premium: 2500 }
  ])
  
  const [insuranceCompanies] = useState([
    { id: '1', name: 'Bajaj Allianz', logo: '/logos/placeholder-logo.svg' },
    { id: '2', name: 'ICICI Lombard', logo: '/logos/placeholder-logo.svg' },
    { id: '3', name: 'HDFC Ergo', logo: '/logos/placeholder-logo.svg' },
    { id: '4', name: 'Tata AIG', logo: '/logos/placeholder-logo.svg' },
    { id: '5', name: 'Reliance General', logo: '/logos/placeholder-logo.svg' }
  ])

  // Country options for Geo Extension
  const [countryOptions] = useState([
    'India', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Japan', 'Singapore', 'UAE', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Bahrain', 'Oman', 'Thailand', 'Malaysia', 'Indonesia', 'Philippines', 'Vietnam', 'South Korea', 'China', 'Hong Kong', 'Taiwan', 'New Zealand', 'South Africa', 'Brazil', 'Argentina', 'Chile', 'Mexico', 'Russia', 'Turkey', 'Egypt', 'Nigeria', 'Kenya', 'Morocco', 'Tunisia', 'Algeria', 'Ghana', 'Ethiopia', 'Uganda', 'Tanzania', 'Zambia', 'Zimbabwe', 'Botswana', 'Namibia', 'Mauritius', 'Seychelles', 'Madagascar', 'Reunion', 'Comoros', 'Mayotte', 'Djibouti', 'Eritrea', 'Somalia', 'Sudan', 'South Sudan', 'Central African Republic', 'Chad', 'Niger', 'Mali', 'Burkina Faso', 'Senegal', 'Gambia', 'Guinea-Bissau', 'Guinea', 'Sierra Leone', 'Liberia', 'Ivory Coast', 'Ghana', 'Togo', 'Benin', 'Cameroon', 'Equatorial Guinea', 'Gabon', 'Republic of the Congo', 'Democratic Republic of the Congo', 'Angola', 'Zambia', 'Malawi', 'Mozambique', 'Madagascar', 'Mauritius', 'Seychelles', 'Comoros', 'Mayotte', 'Reunion', 'Saint Helena', 'Ascension Island', 'Tristan da Cunha', 'Bouvet Island', 'South Georgia and the South Sandwich Islands', 'Falkland Islands', 'British Antarctic Territory', 'British Indian Ocean Territory', 'Pitcairn Islands', 'Turks and Caicos Islands', 'Cayman Islands', 'Bermuda', 'Anguilla', 'Montserrat', 'British Virgin Islands', 'Saint Kitts and Nevis', 'Antigua and Barbuda', 'Dominica', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Grenada', 'Barbados', 'Trinidad and Tobago', 'Guyana', 'Suriname', 'French Guiana', 'Venezuela', 'Colombia', 'Panama', 'Costa Rica', 'Nicaragua', 'Honduras', 'El Salvador', 'Guatemala', 'Belize', 'Jamaica', 'Haiti', 'Dominican Republic', 'Cuba', 'Bahamas', 'Cayman Islands', 'Turks and Caicos Islands', 'British Virgin Islands', 'US Virgin Islands', 'Puerto Rico', 'Saint Kitts and Nevis', 'Antigua and Barbuda', 'Dominica', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Grenada', 'Barbados', 'Trinidad and Tobago', 'Guyana', 'Suriname', 'French Guiana', 'Venezuela', 'Colombia', 'Panama', 'Costa Rica', 'Nicaragua', 'Honduras', 'El Salvador', 'Guatemala', 'Belize', 'Jamaica', 'Haiti', 'Dominican Republic', 'Cuba', 'Bahamas', 'Cayman Islands', 'Turks and Caicos Islands', 'British Virgin Islands', 'US Virgin Islands', 'Puerto Rico'
  ])

  // New search fields
  const [customerIdSearch, setCustomerIdSearch] = useState('')
  const [customerNameSearch, setCustomerNameSearch] = useState('')
  const [policyTypeSearch, setPolicyTypeSearch] = useState('')

  // Load proposals from localStorage
  useEffect(() => {
    const loadProposals = () => {
      try {
        // Load draft proposals (only pending ones for display)
        let savedProposals = JSON.parse(localStorage.getItem('policyDrafts') || '[]')

        // Migration: normalize old proposals (missing selectedQuote/customerInfo/policyDetails)
        // Also handle proposals with different statuses (DRAFT, PENDING, etc.)
        const migrated = savedProposals.map((p: any) => {
          const hasSelectedQuote = !!p.selectedQuote
          const needsCustomer = !p.customerInfo
          const needsPolicy = !p.policyDetails
          
          // If proposal already has all required fields, return as-is
          if (hasSelectedQuote && !needsCustomer && !needsPolicy) return p
          
          // Build from legacy fields when present
          const normalized = { ...p }
          
          // Ensure status exists (default to DRAFT if missing)
          if (!normalized.status) {
            normalized.status = 'DRAFT'
          }
          
          // Handle selectedQuote
          if (!hasSelectedQuote && (p.selectedCompany || p.quotedPremium)) {
            normalized.selectedQuote = {
              companyName: p.selectedCompany || 'N/A',
              totalPremium: p.quotedPremium || 0,
              status: 'PENDING'
            }
          }
          
          // Handle customerInfo
          if (needsCustomer) {
            normalized.customerInfo = {
              customerType: p.customerType || p.customerInfo?.customerType || 'INDIVIDUAL',
              companyName: (p.customerInfo && p.customerInfo.companyName) || p.companyName || '',
              firstName: p.customerInfo?.firstName || p.firstName || '',
              lastName: p.customerInfo?.lastName || p.lastName || '',
              email: p.customerInfo?.email || p.email || '',
              phone: p.customerInfo?.phone || p.phone || '',
              address: p.customerInfo?.address || p.address || '',
              city: p.customerInfo?.city || p.city || '',
              state: p.customerInfo?.state || p.state || '',
              pincode: p.customerInfo?.pincode || p.pincode || '',
              customerId: p.customerInfo?.customerId || p.customerId
            }
          }
          
          // Handle policyDetails
          if (needsPolicy) {
            normalized.policyDetails = {
              policyType: p.policyType || p.policyDetails?.policyType || 'GEN_MOTOR',
              policyFor: p.policyFor || p.policyDetails?.policyFor,
              vehicleClass: p.vehicleClass || p.policyDetails?.vehicleClass,
              vehicleType: p.vehicleType || p.policyDetails?.vehicleType,
              oem: p.oem || p.policyDetails?.oem,
              modelName: p.modelName || p.policyDetails?.modelName,
              variant: p.variant || p.policyDetails?.variant,
              yearOfManufacture: p.yearOfManufacture || p.policyDetails?.yearOfManufacture,
              registrationCity: p.registrationCity || p.policyDetails?.registrationCity,
              exShowroomPrice: p.exShowroomPrice || p.policyDetails?.exShowroomPrice,
              policyTerm: p.policyDetails?.policyTerm || p.policyTerm || 1,
              quotationDate: p.quotationDate || p.policyDetails?.quotationDate || p.createdAt
            }
          }
          
          // Ensure createdAt and updatedAt exist
          if (!normalized.createdAt) {
            normalized.createdAt = new Date().toISOString()
          }
          if (!normalized.updatedAt) {
            normalized.updatedAt = normalized.createdAt
          }
          
          return normalized
        })

        // Persist migration if anything changed
        if (JSON.stringify(savedProposals) !== JSON.stringify(migrated)) {
          localStorage.setItem('policyDrafts', JSON.stringify(migrated))
          savedProposals = migrated
        }
        
        // Separate converted and non-converted proposals
        // Include all statuses except CONVERTED (DRAFT, PENDING, SUBMITTED, APPROVED, REJECTED)
        // Sort from latest to oldest
        const pendingProposals = savedProposals
          .filter((p: any) => {
            const status = p.status || 'DRAFT'
            return status !== 'CONVERTED'
          })
          .sort((a: any, b: any) => {
            const dateA = new Date(a.createdAt || a.updatedAt || 0).getTime()
            const dateB = new Date(b.createdAt || b.updatedAt || 0).getTime()
            return dateB - dateA
          })
        
        // Also include CONVERTED proposals from policyDrafts (not just issuedPolicies)
        const convertedProposalsFromDrafts = savedProposals
          .filter((p: any) => p.status === 'CONVERTED')
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        
        // Load issued policies for search functionality only
        const issuedPolicies = JSON.parse(localStorage.getItem('issuedPolicies') || '[]')
        
        // Convert issued policies to proposal format (for search results)
        const convertedPoliciesFromIssued = issuedPolicies.map((policy: any) => ({
          id: policy.policyNumber || policy.certificateNumber || 'POL' + Date.now(),
          customerInfo: {
            customerType: policy.customerType,
            firstName: policy.firstName,
            lastName: policy.lastName,
            companyName: policy.companyName,
            email: policy.email,
            phone: policy.mobile || policy.mobileNumber || '',
            address: policy.address,
            city: policy.city,
            state: policy.state,
            pincode: policy.pincode
          },
          policyDetails: {
            policyType: policy.policyType || 'GEN_MOTOR',
            oem: policy.oem,
            modelName: policy.modelName,
            variant: policy.variantName,
            yearOfManufacture: policy.yearOfManufacture,
            registrationCity: policy.registrationCity,
            exShowroomPrice: policy.idv,
            policyTerm: 1,
            quotationDate: policy.issueDate || policy.paymentDate || new Date().toISOString()
          },
          selectedQuote: {
            companyName: policy.selectedInsuranceCompany || policy.insuranceCompany,
            totalPremium: policy.quotedPremium || policy.premium,
            status: 'ACTIVE',
            convertedAt: policy.issueDate || policy.paymentDate,
            policyNumber: policy.policyNumber
          },
          selectedAddOns: [],
          kycStatus: 'verified' as const,
          panValidation: {
            isValid: true,
            panNumber: policy.panNumber || 'VERIFIED',
            name: policy.customerType === 'INDIVIDUAL' 
              ? `${policy.firstName} ${policy.lastName}`
              : policy.companyName
          },
          status: 'CONVERTED' as const,
          policyNumber: policy.policyNumber,
          createdAt: policy.submittedDate || policy.issueDate || new Date().toISOString(),
          updatedAt: policy.issueDate || policy.paymentDate || new Date().toISOString()
        }))
        
        // Combine all converted policies (from drafts + from issuedPolicies)
        // Remove duplicates based on policyNumber or id
        const allConvertedPolicies = [...convertedProposalsFromDrafts]
        convertedPoliciesFromIssued.forEach((cp: any) => {
          // Only add if not already in convertedProposalsFromDrafts
          if (!convertedProposalsFromDrafts.find((p: any) => p.policyNumber === cp.policyNumber || p.id === cp.id)) {
            allConvertedPolicies.push(cp)
          }
        })
        
        // Store converted policies separately (for search functionality)
        sessionStorage.setItem('convertedPolicies', JSON.stringify(allConvertedPolicies))
        
        // Show all non-converted proposals by default (DRAFT, PENDING, SUBMITTED, APPROVED, REJECTED)
        // But keep converted proposals available for filtering
        const statusBreakdown = savedProposals.reduce((acc: any, p: any) => {
          const status = p.status || 'UNKNOWN'
          acc[status] = (acc[status] || 0) + 1
          return acc
        }, {})
        
        console.log('📋 Loaded proposals:', {
          total: savedProposals.length,
          pending: pendingProposals.length,
          converted: allConvertedPolicies.length,
          byStatus: statusBreakdown,
          visible: pendingProposals.map((p: any) => ({
            id: p.id,
            status: p.status || 'UNKNOWN',
            customer: p.customerInfo?.firstName || p.customerInfo?.companyName || 'N/A'
          }))
        })
        
        setProposals(pendingProposals)
        setFilteredProposals(pendingProposals)
      } catch (error) {
        console.error('Error loading proposals:', error)
        toast.error('Failed to load proposals')
      } finally {
        setLoading(false)
      }
    }

    loadProposals()
  }, [])

  // Filter proposals based on search terms and status
  useEffect(() => {
    // Start with only pending proposals
    let filtered = proposals

    // If searching or filtering for CONVERTED status, include converted policies
    const hasActiveSearch = searchTerm || mobileSearch || icSearch || statusFilter === 'CONVERTED' || searchKeyValue
    
    if (hasActiveSearch) {
      // Load converted policies from session storage for search
      const convertedPolicies = JSON.parse(sessionStorage.getItem('convertedPolicies') || '[]')
      const allProposalsForSearch = [...proposals, ...convertedPolicies]
      
      filtered = allProposalsForSearch
      
      // Filter by quote ID search
      if (searchTerm) {
        filtered = filtered.filter(proposal => 
          proposal.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          proposal.customerInfo.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          proposal.customerInfo.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          proposal.customerInfo.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          proposal.customerInfo.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          proposal.policyNumber?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }

      // Filter by mobile number search
      if (mobileSearch) {
        filtered = filtered.filter(proposal => 
          (proposal.customerInfo.phone || '').includes(mobileSearch)
        )
      }

      // Filter by insurance company search
      if (icSearch) {
        filtered = filtered.filter(proposal => 
          proposal.selectedQuote?.companyName?.toLowerCase().includes(icSearch.toLowerCase())
        )
      }

      // Dropdown-based filtering
      if (searchKeyValue) {
        const needle = searchKeyValue.toLowerCase()
        filtered = filtered.filter((proposal: any) => {
          if (searchKey === 'CUSTOMER_ID') {
            return (proposal.customerId || '').toLowerCase().includes(needle)
          }
          if (searchKey === 'CUSTOMER_NAME') {
            const fullName = `${proposal.customerInfo?.firstName || ''} ${proposal.customerInfo?.lastName || ''}`.trim().toLowerCase()
            const company = (proposal.customerInfo?.companyName || '').toLowerCase()
            return fullName.includes(needle) || company.includes(needle)
          }
          if (searchKey === 'POLICY_TYPE') {
            return (proposal.policyDetails?.policyType || '').toLowerCase().includes(needle)
          }
          if (searchKey === 'QUOTE_ID') {
            return (proposal.id || '').toLowerCase().includes(needle)
          }
          if (searchKey === 'MOBILE') {
            return (proposal.customerInfo?.phone || '').toLowerCase().includes(needle)
          }
          if (searchKey === 'INSURANCE_COMPANY') {
            return (proposal.selectedQuote?.companyName || '').toLowerCase().includes(needle)
          }
          return true
        })
      }

      // Filter by status
      if (statusFilter !== 'ALL') {
        filtered = filtered.filter(proposal => proposal.status === statusFilter)
      }
    }

    // Sort from latest to oldest
    filtered = filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    setFilteredProposals(filtered)
    setCurrentPage(1)
  }, [searchTerm, mobileSearch, icSearch, statusFilter, proposals, searchKey, searchKeyValue])

  // Pagination
  const totalPages = Math.ceil(filteredProposals.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProposals = filteredProposals.slice(startIndex, endIndex)

  // Handle delete proposal with double confirmation
  const handleDeleteProposal = (id: string) => {
    const firstConfirm = confirm('Delete this proposal?')
    if (!firstConfirm) return

    const secondConfirm = confirm('This action is PERMANENT and cannot be undone. Once deleted, this proposal cannot be retrieved from anywhere. Do you want to permanently delete it?')
    if (!secondConfirm) return

      const updatedProposals = proposals.filter(p => p.id !== id)
      setProposals(updatedProposals)
      localStorage.setItem('policyDrafts', JSON.stringify(updatedProposals))
    toast.success('Proposal permanently deleted')
  }

  // Helper function to check if Previous Policy Details are needed for a proposal
  // Condition 1: Policy Term = SAOD AND (1 < vehicle age < 3 years with current year)
  // Condition 2: Policy Term = 1/2/3 Year Comprehensive AND (vehicle age > 300 days AND < 1 year with current year)
  const needsPreviousPolicyDetailsForProposal = (proposal: PolicyProposal): boolean => {
    const policyDetails = proposal.policyDetails
    if (!policyDetails) return false
    
    const policyType = policyDetails.policyType
    // Check multiple locations for policyFor, vehicleClass, and vehicleType
    const policyFor = (proposal as any).policyDetails?.policyFor || (proposal as any).policyFor
    const vehicleClass = (proposal as any).policyDetails?.vehicleClass || (proposal as any).vehicleClass
    const vehicleType = (proposal as any).policyDetails?.vehicleType || (proposal as any).vehicleType
    const yearOfManufacture = policyDetails.yearOfManufacture
    const policyTerm = policyDetails.policyTerm
    
    // Debug logging
    console.log('Checking Previous Policy Details for proposal:', {
      policyType,
      policyFor,
      vehicleClass,
      vehicleType,
      yearOfManufacture,
      policyTerm
    })
    
    // Check if all required fields are present
    if (
      policyType === 'GEN_MOTOR' &&
      policyFor === 'ROLLOVER' &&
      vehicleClass === 'PRIVATE' &&
      (vehicleType === 'PRIVATE' || vehicleType === 'PRIVATE CAR') &&
      yearOfManufacture
    ) {
      const currentDate = new Date()
      const currentYear = currentDate.getFullYear()
      const yomYear = parseInt(yearOfManufacture, 10)
      if (!Number.isNaN(yomYear)) {
        // Calculate vehicle age in days and years (as decimal for precise calculation)
        const yomDate = new Date(yomYear, 0, 1) // January 1st of YOM year
        const ageInMilliseconds = currentDate.getTime() - yomDate.getTime()
        const ageInDays = ageInMilliseconds / (1000 * 60 * 60 * 24)
        const ageInYears = ageInDays / 365.25 // Account for leap years
        
        const termStr = typeof policyTerm === 'string' ? policyTerm : String(policyTerm)
        
        // Condition 1: Policy Term = SAOD AND (1 < vehicle age < 3 years with current year)
        if (ageInYears > 1 && ageInYears < 3 && termStr === 'SAOD') {
          return true
        }
        
        // Condition 2: Policy Term = 1/2/3 Year Comprehensive AND (vehicle age > 300 days AND < 1 year with current year)
        // 300 days = 300/365.25 ≈ 0.822 years
        if (ageInDays > 300 && ageInYears < 1 && ['COMP_1', 'COMP_2', 'COMP_3'].includes(termStr)) {
          return true
        }
      }
    }
    return false
  }

  const handleViewProposal = (proposal: PolicyProposal) => {
    // If proposal is converted to policy, show the policy certificate
    if (proposal.status === 'CONVERTED' && proposal.policyNumber) {
      // Create policy data object for certificate display
      const policyData = {
        policyNumber: proposal.policyNumber,
        certificateNumber: proposal.policyNumber.replace('POL', 'CERT'),
        customerName: (proposal.customerInfo?.customerType || (proposal as any)?.customerType) === 'INDIVIDUAL' 
          ? `${proposal.customerInfo.firstName} ${proposal.customerInfo.lastName}`
          : proposal.customerInfo.companyName,
        insuranceCompany: proposal.selectedQuote?.companyName || 'N/A',
        premiumAmount: proposal.selectedQuote?.totalPremium || 0,
        startDate: new Date(proposal.selectedQuote?.convertedAt || proposal.updatedAt).toLocaleDateString(),
        endDate: new Date(new Date(proposal.selectedQuote?.convertedAt || proposal.updatedAt).setFullYear(
          new Date(proposal.selectedQuote?.convertedAt || (proposal as any).updatedAt).getFullYear() + ((proposal as any).policyDetails?.policyTerm || 1)
        )).toLocaleDateString(),
        vehicleDetails: {
          oem: (proposal as any).policyDetails?.oem,
          model: (proposal as any).policyDetails?.modelName,
          variant: (proposal as any).policyDetails?.variant,
          year: (proposal as any).policyDetails?.yearOfManufacture,
          registrationCity: (proposal as any).policyDetails?.registrationCity
        },
        nomineeDetails: {
          name: 'As per records',
          relationship: 'As per records',
          dob: 'As per records'
        },
        paymentMode: 'Completed',
        addOns: proposal.selectedAddOns
      }
      
      setIssuedPolicy(policyData)
      setSelectedProposal(proposal)
      setShowPolicyCertificate(true)
      setCurrentStep(6)
      toast.success('Viewing converted policy certificate')
      return
    }
    
    // For pending proposals, check if Previous Policy Details are needed first
    setSelectedProposal(proposal)
    
    // Always check if Previous Policy Details are needed first
    const needsPrevDetails = needsPreviousPolicyDetailsForProposal(proposal)
    console.log('needsPreviousPolicyDetailsForProposal result:', needsPrevDetails)
    
    if (needsPrevDetails) {
      // Check if Previous Policy Details are already filled
      const prevODPolicyNumber = (proposal as any).previousODPolicyNumber?.trim()
      const prevODInsurer = (proposal as any).previousODInsurer?.trim()
      const prevODPolicyFrom = (proposal as any).previousODPolicyFrom?.trim()
      const prevODPolicyTo = (proposal as any).previousODPolicyTo?.trim()
      const prevTPPolicyNumber = (proposal as any).previousTPPolicyNumber?.trim()
      const prevTPInsurer = (proposal as any).previousTPInsurer?.trim()
      const prevTPPolicyFrom = (proposal as any).previousTPPolicyFrom?.trim()
      const prevTPPolicyTo = (proposal as any).previousTPPolicyTo?.trim()
      const prevPremiumPaid = (proposal as any).previousPremiumPaid
      
      const hasPrevPolicyDetails = prevODPolicyNumber && prevODInsurer && prevODPolicyFrom && prevODPolicyTo &&
        prevTPPolicyNumber && prevTPInsurer && prevTPPolicyFrom && prevTPPolicyTo &&
        prevPremiumPaid !== undefined && prevPremiumPaid !== null && !Number.isNaN(prevPremiumPaid)
      
      console.log('hasPrevPolicyDetails:', hasPrevPolicyDetails)
      
      if (!hasPrevPolicyDetails) {
        setCurrentStep(-1) // Step -1 for Previous Policy Details
        toast.success('Viewing proposal details – please fill Previous Policy Details first')
        return
      }
    }
    
    // Then check Customer Information (only if Previous Policy Details are not needed OR already filled)
    setCurrentStep(0) // Step 0 for Customer Information
    toast.success('Viewing proposal details – please confirm customer information first')
  }

  const handleEditProposal = (proposal: PolicyProposal) => {
    // Check if proposal is already converted to policy
    if (proposal.status === 'CONVERTED') {
      toast.error('This quote has already been converted to a policy and is no longer valid.')
      return
    }
    
    // Check if the selected quote is already converted
    if (proposal.selectedQuote?.status === 'CONVERTED') {
      toast.error('This quote has already been converted to a policy and is no longer valid.')
      return
    }
    
    setSelectedProposal(proposal)
    
    // For Rollover proposals that need Customer Information, start at step 0 (Customer Information)
    if (proposal.needsCustomerInfo) {
      const email = proposal.customerInfo?.email?.trim()
      const phone = proposal.customerInfo?.phone?.trim()
      const address = proposal.customerInfo?.address?.trim()
      const city = proposal.customerInfo?.city?.trim()
      const state = proposal.customerInfo?.state?.trim()
      const pincode = proposal.customerInfo?.pincode?.trim()
      const firstName = proposal.customerInfo?.firstName?.trim()
      const lastName = proposal.customerInfo?.lastName?.trim()
      const companyName = proposal.customerInfo?.companyName?.trim()
      
      const hasCustomerInfo = email && phone && address && city && state && pincode &&
        (proposal.customerInfo?.customerType === 'INDIVIDUAL' ? (firstName && lastName) : companyName)
      
      if (!hasCustomerInfo) {
        setCurrentStep(0) // Start at Customer Information step
        return
      }
    }
    
    setCurrentStep(1)
    // Navigate to the appropriate step based on proposal status
    if (proposal.kycStatus === 'verified' && proposal.selectedQuote) {
      setCurrentStep(5) // Go to payment step
    } else if (proposal.selectedQuote) {
      setCurrentStep(4) // Go to proposal form step
    } else {
      setCurrentStep(2) // Go to quotes step
    }
  }

  // Workflow handler functions
  const handleStartWorkflow = (proposal: PolicyProposal) => {
    // Check if proposal is already converted to policy
    if (proposal.status === 'CONVERTED') {
      toast.error('This quote has already been converted to a policy and is no longer valid.')
      return
    }
    
    // Check if the selected quote is already converted
    if (proposal.selectedQuote?.status === 'CONVERTED') {
      toast.error('This quote has already been converted to a policy and is no longer valid.')
      return
    }
    
    setSelectedProposal(proposal)
    
    // For Rollover proposals that need Customer Information, start at step 0 (Customer Information)
    if (proposal.needsCustomerInfo) {
      const email = proposal.customerInfo?.email?.trim()
      const phone = proposal.customerInfo?.phone?.trim()
      const address = proposal.customerInfo?.address?.trim()
      const city = proposal.customerInfo?.city?.trim()
      const state = proposal.customerInfo?.state?.trim()
      const pincode = proposal.customerInfo?.pincode?.trim()
      const firstName = proposal.customerInfo?.firstName?.trim()
      const lastName = proposal.customerInfo?.lastName?.trim()
      const companyName = proposal.customerInfo?.companyName?.trim()
      
      const hasCustomerInfo = email && phone && address && city && state && pincode &&
        (proposal.customerInfo?.customerType === 'INDIVIDUAL' ? (firstName && lastName) : companyName)
      
      if (!hasCustomerInfo) {
        setCurrentStep(0) // Start at Customer Information step
        return
      }
    }
    
    setCurrentStep(1)
    // Navigate to the appropriate step based on proposal status
    if (proposal.kycStatus === 'verified' && proposal.selectedQuote) {
      setCurrentStep(5) // Go to payment step
    } else if (proposal.selectedQuote) {
      setCurrentStep(4) // Go to proposal form step
    } else {
      setCurrentStep(2) // Go to quotes step
    }
  }

  const handleSendOTP = async () => {
    if (!selectedProposal) return
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    setOtpCode(otp)
    
    try {
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'otpVerification',
          to: selectedProposal.customerInfo.email,
          data: {
            customerName: (selectedProposal.customerInfo?.customerType || (selectedProposal as any)?.customerType) === 'INDIVIDUAL' 
              ? `${selectedProposal.customerInfo.firstName} ${selectedProposal.customerInfo.lastName}`
              : selectedProposal.customerInfo.companyName,
            otpCode: otp
          }
        })
      })
      
      if (response.ok) {
        setShowOTPModal(true)
        toast.success(`OTP sent to ${selectedProposal.customerInfo.email}`)
      } else {
        toast.error('Failed to send OTP')
      }
    } catch (error) {
      console.error('Error sending OTP:', error)
      toast.error('Failed to send OTP')
    }
  }

  const handleOTPVerification = () => {
    if (enteredOTP === otpCode) {
      toast.success('OTP verified successfully!')
      setShowOTPModal(false)
      setShowKYCForm(true)
      setCurrentStep(3)
    } else {
      toast.error('Invalid OTP. Please try again.')
    }
  }

  // PAN validation function
  const validatePAN = (pan: string) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
    return panRegex.test(pan)
  }

  // Handle PAN file upload
  const handlePANFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
      if (!allowedTypes.includes(file.type)) {
        setKycFormData(prev => ({
          ...prev,
          panValidation: { isValid: false, error: 'Please upload a valid file (JPG, PNG, or PDF)' }
        }))
        return
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        setKycFormData(prev => ({
          ...prev,
          panValidation: { isValid: false, error: 'File size must be less than 10MB' }
        }))
        return
      }

      setKycFormData(prev => ({
        ...prev,
        panFile: file,
        panFilePreview: URL.createObjectURL(file),
        panValidation: { isValid: true, error: '' }
      }))
    }
  }

  const handleKYCVerification = () => {
    // Validate PAN number if provided
    if (kycFormData.panNumber && !validatePAN(kycFormData.panNumber)) {
      setKycFormData(prev => ({
        ...prev,
        panValidation: { isValid: false, error: 'Invalid PAN number format' }
      }))
      return
    }

    // Check if either CKYC or PAN is provided
    if (!kycFormData.ckycNumber && !kycFormData.panNumber) {
      toast.error('Please provide either CKYC number or PAN number')
      return
    }

    toast.success('KYC verification completed!')
    setShowKYCForm(false)
    setCurrentStep(2)
  }

  // Handle Other Vehicle Details submission
  const handleOtherVehicleDetailsSubmission = () => {
    // Validate required fields
    if (!proposalFormData.chassisNumber || !proposalFormData.engineNumber) {
      toast.error('Please fill all required fields (Chassis Number and Engine Number)')
      return
    }

    toast.success('Other Vehicle Details submitted successfully!')
    setCurrentStep(3)
  }

  // Handle Liability Details submission
  const handleLiabilityDetailsSubmission = () => {
    toast.success('Liability Details submitted successfully!')
    setCurrentStep(4)
  }

  // Handle Nomination Details submission
  const handleNominationDetailsSubmission = () => {
    // Basic required field validation
    if (
      !proposalFormData.nomineeName ||
      !proposalFormData.nomineeRelationship ||
      !proposalFormData.nomineeContactNo ||
      !proposalFormData.nomineeEmail ||
      !proposalFormData.nomineeSex ||
      !proposalFormData.nomineeDOB
    ) {
      toast.error('Please fill all required nomination fields')
      return
    }

    // Nominee Name: only alphabets and spaces allowed (no numbers or special characters)
    const namePattern = /^[A-Za-z\s]+$/
    if (!namePattern.test(proposalFormData.nomineeName.trim())) {
      toast.error('Nominee Name should contain only letters and spaces (no numbers or special characters)')
      return
    }

    // Mobile Number: validate as per country geography
    // For now, enforce a 10-digit numeric mobile for India-style numbers
    const mobilePattern = /^[0-9]{10}$/
    if (!mobilePattern.test(proposalFormData.nomineeContactNo.trim())) {
      toast.error('Please enter a valid 10-digit mobile number for Nominee Contact Number')
      return
    }

    // Email address: standard email format validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(proposalFormData.nomineeEmail.trim())) {
      toast.error('Please enter a valid email address for Nominee Email')
      return
    }

    toast.success('Nomination Details submitted successfully!')
    setCurrentStep(5)
  }

  const handleProposalFormSubmission = () => {
    // Validate required fields
    if (!proposalFormData.paymentMode || !proposalFormData.declarationAccepted) {
      toast.error('Please fill all required fields and accept the declaration')
      return
    }

    toast.success('Proposal form submitted successfully!')
    setShowProposalForm(false)
    setShowPaymentForm(true)
    setCurrentStep(5)
  }

  const handlePaymentProcessing = async (paymentData: any) => {
    setPaymentStatus('processing')
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      setPaymentStatus('completed')
      toast.success('Payment processed successfully!')
      
      // Proceed to policy issuance
      await handlePolicyIssuance()
      
    } catch (error) {
      setPaymentStatus('failed')
      toast.error('Payment processing failed')
    }
  }

  const handlePolicyIssuance = async () => {
    if (!selectedProposal) return
    
    try {
      toast('Processing policy issuance with insurance company...', { icon: 'ℹ️' })
      
      // Prepare comprehensive policy data for insurance company API
      const comprehensivePolicyData = {
        // Customer Information
        customerInfo: {
          customerType: selectedProposal.customerInfo?.customerType || (selectedProposal as any)?.customerType,
          firstName: selectedProposal.customerInfo.firstName,
          lastName: selectedProposal.customerInfo.lastName,
          companyName: selectedProposal.customerInfo.companyName,
          email: selectedProposal.customerInfo.email,
          phone: selectedProposal.customerInfo.phone,
          address: selectedProposal.customerInfo.address,
          city: selectedProposal.customerInfo.city,
          state: selectedProposal.customerInfo.state,
          pincode: selectedProposal.customerInfo.pincode
        },
        // KYC Information
        kycInfo: {
          ckycNumber: kycFormData.ckycNumber,
          panNumber: kycFormData.panNumber,
          panFileUploaded: !!kycFormData.panFile
        },
        // Vehicle Details
        vehicleDetails: {
          oem: selectedProposal.policyDetails?.oem,
          model: selectedProposal.policyDetails?.modelName,
          variant: selectedProposal.policyDetails?.variant,
          year: selectedProposal.policyDetails?.yearOfManufacture,
          registrationCity: selectedProposal.policyDetails?.registrationCity,
          chassisNumber: proposalFormData.chassisNumber,
          engineNumber: proposalFormData.engineNumber,
          electricalAccessories: proposalFormData.electricalAccessories,
          electricalAccessoriesValue: proposalFormData.electricalAccessoriesValue,
          nonElectricalAccessories: proposalFormData.nonElectricalAccessories,
          nonElectricalAccessoriesValue: proposalFormData.nonElectricalAccessoriesValue
        },
        // Discounts
        discounts: {
          antiTheft: proposalFormData.discountAntiTheft,
          antiTheftPrice: proposalFormData.discountAntiTheftPrice,
          handicapped: proposalFormData.discountHandicapped,
          voluntary: proposalFormData.discountVoluntary,
          aaMembership: proposalFormData.discountAAMembership,
          aaMembershipNo: proposalFormData.discountAAMembershipNo,
          geoExtension: proposalFormData.discountGeoExtension,
          geoCountries: proposalFormData.discountGeoCountries
        },
        // Liability Details
        liabilityDetails: {
          compulsoryPA: proposalFormData.liabilityCompulsoryPA,
          tppdExtension: proposalFormData.liabilityTPPDExtension,
          driverCover: proposalFormData.liabilityDriverCover,
          cleanerCover: proposalFormData.liabilityCleanerCover
        },
        // Nomination Details
        nomineeDetails: {
          name: proposalFormData.nomineeName,
          relationship: proposalFormData.nomineeRelationship,
          contactNo: proposalFormData.nomineeContactNo,
          email: proposalFormData.nomineeEmail,
          sex: proposalFormData.nomineeSex,
          dob: proposalFormData.nomineeDOB
        },
        // Policy Information
        policyInfo: {
          policyType: selectedProposal.policyDetails?.policyType,
          policyTerm: selectedProposal.policyDetails?.policyTerm,
          premiumAmount: selectedProposal.selectedQuote?.totalPremium,
          insuranceCompany: selectedProposal.selectedQuote?.companyName,
          selectedAddOns: selectedProposal.selectedAddOns
        },
        // Payment Information
        paymentInfo: {
          paymentMode: proposalFormData.paymentMode,
          additionalInfo: proposalFormData.additionalInfo,
          declarationAccepted: proposalFormData.declarationAccepted
        }
      }
      
      // Mock API call to insurance company
      await new Promise(resolve => setTimeout(resolve, 4000))
      
      // Mock policy issuance response
      const policyNumber = `POL${Date.now().toString().slice(-8)}`
      const certificateNumber = `CERT${Date.now().toString().slice(-10)}`
      
      const policyData = {
        policyNumber,
        certificateNumber,
        customerName: (selectedProposal.customerInfo?.customerType || (selectedProposal as any)?.customerType) === 'INDIVIDUAL' 
          ? `${selectedProposal.customerInfo.firstName} ${selectedProposal.customerInfo.lastName}`
          : selectedProposal.customerInfo.companyName,
        insuranceCompany: selectedProposal.selectedQuote?.companyName,
        premiumAmount: selectedProposal.selectedQuote?.totalPremium,
        startDate: new Date().toLocaleDateString(),
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + (selectedProposal.policyDetails?.policyTerm || 1))).toLocaleDateString(),
        vehicleDetails: {
          oem: selectedProposal.policyDetails?.oem,
          model: selectedProposal.policyDetails?.modelName,
          variant: selectedProposal.policyDetails?.variant,
          year: selectedProposal.policyDetails?.yearOfManufacture,
          registrationCity: selectedProposal.policyDetails?.registrationCity,
          chassisNumber: proposalFormData.chassisNumber,
          engineNumber: proposalFormData.engineNumber
        },
        nomineeDetails: {
          name: proposalFormData.nomineeName,
          relationship: proposalFormData.nomineeRelationship,
          contactNo: proposalFormData.nomineeContactNo,
          email: proposalFormData.nomineeEmail,
          sex: proposalFormData.nomineeSex,
          dob: proposalFormData.nomineeDOB
        },
        paymentMode: proposalFormData.paymentMode,
        addOns: selectedProposal.selectedAddOns,
        // Include all collected data
        comprehensiveData: comprehensivePolicyData
      }
      
      setIssuedPolicy(policyData)
      
      // Update proposal status to CONVERTED and invalidate the quote
      if (selectedProposal) {
        const updatedProposal = {
          ...selectedProposal,
          status: 'CONVERTED' as const,
          policyNumber: policyNumber,
          certificateNumber: certificateNumber,
          policyIssuedDate: new Date().toISOString(),
          selectedQuote: selectedProposal.selectedQuote ? {
            ...selectedProposal.selectedQuote,
            status: 'CONVERTED',
            convertedAt: new Date().toISOString(),
            policyNumber: policyNumber
          } : undefined
        }
        
        // Update the proposal in localStorage
        const existingProposals = JSON.parse(localStorage.getItem('policyDrafts') || '[]')
        const updatedProposals = existingProposals.map((p: any) => 
          p.id === selectedProposal.id ? updatedProposal : p
        )
        localStorage.setItem('policyDrafts', JSON.stringify(updatedProposals))
        
        // Update the proposals state
        setProposals(updatedProposals)
        setSelectedProposal(updatedProposal)
        
        toast.success(`Quote converted to policy! Policy Number: ${policyNumber}`)
      }
      
      // Send policy issued email
      const emailResponse = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'policyIssued',
          to: selectedProposal.customerInfo.email,
          data: policyData
        })
      })

      if (emailResponse.ok) {
        toast.success(`Policy issued successfully! Policy Number: ${policyNumber}. Email sent to ${selectedProposal.customerInfo.email}`)
      } else {
        toast.success(`Policy issued successfully! Policy Number: ${policyNumber}`)
      }
      
      // Show policy certificate
      setShowPaymentForm(false)
      setShowPolicyCertificate(true)
      setCurrentStep(6)
      
    } catch (error) {
      toast.error('Failed to issue policy')
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'DRAFT': { color: 'bg-blue-100 text-blue-800', text: 'Draft' },
      'SUBMITTED': { color: 'bg-purple-100 text-purple-800', text: 'Submitted' },
      'APPROVED': { color: 'bg-green-100 text-green-800', text: 'Approved' },
      'REJECTED': { color: 'bg-red-100 text-red-800', text: 'Rejected' },
      'CONVERTED': { color: 'bg-emerald-100 text-emerald-800', text: 'Converted to Policy' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['DRAFT']
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.text}
      </span>
    )
  }


  const getKYCStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircleIcon className="h-3 w-3 mr-1" />
          Verified
        </span>
      case 'pending':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <ClockIcon className="h-3 w-3 mr-1" />
          Pending
        </span>
      case 'rejected':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
          Rejected
        </span>
      default:
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {status}
        </span>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading proposals...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Policy Proposals Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Manage pending proposals (latest to oldest). Converted policies are available in <span className="font-semibold">Reports & MIS</span>.
              </p>
            </div>
            <button
              onClick={() => router.push('/dashboard/presale/quotation')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              New Quotation
            </button>
          </div>
        </div>

        {/* Latest Pending Proposals */}
        {proposals.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Latest Pending Proposals</h2>
              <span className="text-sm text-gray-600">
                Showing only pending proposals (not converted)
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {proposals
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 6)
                .map((proposal, index) => {
                  // Generate customer ID and proposal number if not exists
                  const customerId = proposal.customerId || `CUST${(index + 1).toString().padStart(5, '0')}`
                  const proposalNumber = proposal.proposalNumber || `PROP/2025/${(index + 1).toString().padStart(4, '0')}`
                  
                  return (
                <div key={proposal.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      {(() => {
                        const p: any = proposal as any
                        const customerType = proposal.customerInfo?.customerType || p.customerType || (p.companyName ? 'CORPORATE' : 'INDIVIDUAL')
                        return customerType === 'INDIVIDUAL' ? (
                          <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                        ) : (
                          <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mr-2" />
                        )
                      })()}
                      <span className="text-sm font-medium text-gray-900">
                        {(() => {
                          const p: any = proposal as any
                          const customerType = proposal.customerInfo?.customerType || p.customerType || (p.companyName ? 'CORPORATE' : 'INDIVIDUAL')
                          if (customerType === 'INDIVIDUAL') {
                            const first = proposal.customerInfo?.firstName || p.firstName || ''
                            const last = proposal.customerInfo?.lastName || p.lastName || ''
                            return `${first} ${last}`.trim() || 'Customer'
                          }
                          return proposal.customerInfo?.companyName || p.companyName || 'Corporate Customer'
                        })()}
                      </span>
                    </div>
                    {getStatusBadge(proposal.status)}
                  </div>
                  <div className="space-y-1 mb-2">
                    <div className="text-xs text-gray-500">
                      <span className="font-medium">Customer ID:</span> {customerId}
                    </div>
                    <div className="text-xs text-blue-600 font-medium">
                      <span className="text-gray-500 font-normal">Proposal #:</span> {proposalNumber}
                    </div>
                  </div>
                          <div className="text-sm text-gray-600 mb-2">
                            {proposal.selectedQuote?.companyName || 'No quote selected'}
                            {proposal.status === 'CONVERTED' && (
                              <span className="ml-2 px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full">
                                Policy Issued
                              </span>
                            )}
                          </div>
                          <div className="text-sm font-medium text-gray-900 mb-2">
                            ₹{proposal.selectedQuote?.totalPremium?.toLocaleString() || 'N/A'}
                            {proposal.policyNumber && (
                              <div className="text-xs text-emerald-600 mt-1">
                                Policy: {proposal.policyNumber}
                              </div>
                            )}
                          </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{new Date(proposal.createdAt).toLocaleDateString()}</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewProposal(proposal)}
                        className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                      >
                        {proposal.status === 'CONVERTED' ? 'View Policy' : 'View'}
                      </button>
                      {proposal.status !== 'CONVERTED' && (
                        <>
                          <button
                            onClick={() => handleEditProposal(proposal)}
                            className="text-green-600 hover:text-green-800 text-xs"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleStartWorkflow(proposal)}
                            className="text-purple-600 hover:text-purple-800 text-xs font-medium"
                          >
                            Continue
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                  )
                })}
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Search Proposals</h2>
            <div className="text-xs text-gray-500 bg-blue-50 px-3 py-1 rounded-full">
              💡 Search or filter to find converted policies
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            {/* Dropdown: Search Field */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Search Field</label>
              <select
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value as any)}
                className="w-full pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              >
                <option value="CUSTOMER_ID">Customer ID</option>
                <option value="CUSTOMER_NAME">Customer Name</option>
                <option value="POLICY_TYPE">Policy Type</option>
                <option value="QUOTE_ID">Quote ID</option>
                <option value="MOBILE">Mobile Number</option>
                <option value="INSURANCE_COMPANY">Insurance Company</option>
              </select>
            </div>

            {/* Input for selected field */}
            <div className="relative">
              <label className="block text-xs font-medium text-gray-700 mb-1">Search Value</label>
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={
                  searchKey === 'CUSTOMER_ID' ? 'e.g., CUST001' :
                  searchKey === 'CUSTOMER_NAME' ? 'e.g., Sushant Mishra' :
                  searchKey === 'POLICY_TYPE' ? 'e.g., GEN_MOTOR / Health' :
                  searchKey === 'QUOTE_ID' ? 'e.g., PROP-123456' :
                  searchKey === 'MOBILE' ? 'e.g., 9876543210' :
                  'e.g., HDFC Ergo'
                }
                value={searchKeyValue}
                onChange={(e) => setSearchKeyValue(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              >
                <option value="ALL">All</option>
                        <option value="DRAFT">Draft</option>
                        <option value="SUBMITTED">Submitted</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                <option value="CONVERTED">Converted</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <span>
                Showing {currentProposals.length} of {filteredProposals.length} 
                {statusFilter === 'CONVERTED' ? ' converted policies' : 
                 (searchTerm || mobileSearch || icSearch || customerIdSearch || customerNameSearch || policyTypeSearch) ? ' results' : ' pending proposals'}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Total pending proposals: {proposals.length}
              </div>
              {(searchTerm || mobileSearch || icSearch || searchKeyValue || statusFilter !== 'ALL') && (
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setMobileSearch('')
                    setIcSearch('')
                    setSearchKey('CUSTOMER_ID')
                    setSearchKeyValue('')
                    setStatusFilter('ALL')
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Reset filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Workflow Section - Show when proposal is selected */}
        {selectedProposal && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <ShieldCheckIcon className="h-6 w-6 text-blue-600 mr-3" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Policy Workflow</h2>
                  <p className="text-sm text-gray-600">
                    {(selectedProposal.customerInfo?.customerType || (selectedProposal as any)?.customerType) === 'INDIVIDUAL' 
                      ? `${selectedProposal.customerInfo?.firstName || (selectedProposal as any)?.firstName || ''} ${selectedProposal.customerInfo?.lastName || (selectedProposal as any)?.lastName || ''}`.trim()
                      : (selectedProposal.customerInfo?.companyName || (selectedProposal as any)?.companyName || 'Customer')} - {selectedProposal.id}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={testMode}
                    onChange={(e) => setTestMode(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-600">Test Mode</span>
                </label>
                <button
                  onClick={() => {
                    setSelectedProposal(null)
                    setCurrentStep(1)
                    setShowOTPModal(false)
                    setShowKYCForm(false)
                    setShowProposalForm(false)
                    setShowPaymentForm(false)
                    setShowPolicyCertificate(false)
                  }}
                  className="text-gray-500 hover:text-gray-700 p-1"
                >
                  <ArrowLeftIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Workflow Steps */}
            <div className="flex items-center justify-center mb-6 overflow-x-auto">
              {(() => {
                // Check if Previous Policy Details are needed
                const needsPrevPolicy = selectedProposal ? needsPreviousPolicyDetailsForProposal(selectedProposal) : false
                // If needed, show Step -1 (Previous Policy Details), then Step 0 (Customer Information), etc.
                // Otherwise, start with Step 0 (Customer Information)
                const steps = needsPrevPolicy ? [-1, 0, 1, 2, 3, 4, 5, 6] : [0, 1, 2, 3, 4, 5, 6]
                return steps.map((step) => (
                  <div key={step} className="flex items-center flex-shrink-0">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium ${
                        step < currentStep
                          ? 'bg-green-500 text-white'
                          : step === currentStep
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      {step < currentStep ? <CheckCircleIcon className="h-5 w-5" /> : step === -1 ? 'PPD' : step}
                    </div>
                    <div className="ml-2 text-xs text-center min-w-0">
                      <div className="font-medium">
                        {step === -1 && 'Previous Policy Details'}
                        {step === 0 && 'Customer Information'}
                        {step === 1 && 'KYC Verification'}
                        {step === 2 && 'Other Vehicle Details'}
                        {step === 3 && 'Liability Details'}
                        {step === 4 && 'Nomination Details'}
                        {step === 5 && 'Payment & Declaration'}
                        {step === 6 && 'Policy Issuance'}
                      </div>
                    </div>
                    {step < 6 && (
                      <div
                        className={`w-8 h-0.5 mx-2 ${
                          step < currentStep ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      />
                    )}
                  </div>
                ))
              })()}
            </div>

            {/* Step Content */}
            <div className="bg-gray-50 rounded-lg p-4">
              {/* Step -1: Previous Policy Details (for specific Rollover proposals) */}
              {currentStep === -1 && needsPreviousPolicyDetailsForProposal(selectedProposal!) && (
                <div>
                  <h3 className="text-md font-semibold text-gray-900 mb-3">Previous Policy Details</h3>
                  <p className="text-sm text-gray-600 mb-4">Please provide previous Own Damage (OD) and Third Party (TP) policy details for rollover issuance.</p>
                  
                  <div className="bg-white rounded-lg p-4 border">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Previous OD Policy Number *
                        </label>
                        <input
                          type="text"
                          value={previousPolicyFormData.previousODPolicyNumber}
                          onChange={(e) => setPreviousPolicyFormData(prev => ({ ...prev, previousODPolicyNumber: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter previous OD policy number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Previous OD Insurance Company *
                        </label>
                        <select
                          value={previousPolicyFormData.previousODInsurer}
                          onChange={(e) => setPreviousPolicyFormData(prev => ({ ...prev, previousODInsurer: e.target.value }))}
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
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Previous OD Policy Period (From) *
                        </label>
                        <input
                          type="date"
                          value={previousPolicyFormData.previousODPolicyFrom}
                          onChange={(e) => setPreviousPolicyFormData(prev => ({ ...prev, previousODPolicyFrom: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Previous OD Policy Period (To) *
                        </label>
                        <input
                          type="date"
                          value={previousPolicyFormData.previousODPolicyTo}
                          onChange={(e) => setPreviousPolicyFormData(prev => ({ ...prev, previousODPolicyTo: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Previous TP Policy Number *
                        </label>
                        <input
                          type="text"
                          value={previousPolicyFormData.previousTPPolicyNumber}
                          onChange={(e) => setPreviousPolicyFormData(prev => ({ ...prev, previousTPPolicyNumber: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter previous TP policy number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Previous TP Insurance Company *
                        </label>
                        <select
                          value={previousPolicyFormData.previousTPInsurer}
                          onChange={(e) => setPreviousPolicyFormData(prev => ({ ...prev, previousTPInsurer: e.target.value }))}
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
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Previous TP Policy Period (From) *
                        </label>
                        <input
                          type="date"
                          value={previousPolicyFormData.previousTPPolicyFrom}
                          onChange={(e) => setPreviousPolicyFormData(prev => ({ ...prev, previousTPPolicyFrom: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Previous TP Policy Period (To) *
                        </label>
                        <input
                          type="date"
                          value={previousPolicyFormData.previousTPPolicyTo}
                          onChange={(e) => setPreviousPolicyFormData(prev => ({ ...prev, previousTPPolicyTo: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Previous Premium Paid (₹) *
                        </label>
                        <input
                          type="number"
                          value={previousPolicyFormData.previousPremiumPaid}
                          onChange={(e) => setPreviousPolicyFormData(prev => ({ ...prev, previousPremiumPaid: parseFloat(e.target.value) || 0 }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter previous premium paid"
                          min={0}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between">
                    <button
                      onClick={() => {
                        setSelectedProposal(null)
                        setCurrentStep(0)
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        // Validate required fields
                        const missing: string[] = []
                        if (!previousPolicyFormData.previousODPolicyNumber.trim()) missing.push('Previous OD Policy Number')
                        if (!previousPolicyFormData.previousODInsurer.trim()) missing.push('Previous OD Insurance Company')
                        if (!previousPolicyFormData.previousODPolicyFrom.trim()) missing.push('Previous OD Policy Period (From)')
                        if (!previousPolicyFormData.previousODPolicyTo.trim()) missing.push('Previous OD Policy Period (To)')
                        if (!previousPolicyFormData.previousTPPolicyNumber.trim()) missing.push('Previous TP Policy Number')
                        if (!previousPolicyFormData.previousTPInsurer.trim()) missing.push('Previous TP Insurance Company')
                        if (!previousPolicyFormData.previousTPPolicyFrom.trim()) missing.push('Previous TP Policy Period (From)')
                        if (!previousPolicyFormData.previousTPPolicyTo.trim()) missing.push('Previous TP Policy Period (To)')
                        if (previousPolicyFormData.previousPremiumPaid === 0 || Number.isNaN(previousPolicyFormData.previousPremiumPaid)) {
                          missing.push('Previous Premium Paid')
                        }
                        
                        if (missing.length > 0) {
                          toast.error(`Please fill required fields: ${missing.join(', ')}`)
                          return
                        }
                        
                        // Update proposal with previous policy details
                        if (selectedProposal) {
                          const proposals = JSON.parse(localStorage.getItem('policyDrafts') || '[]')
                          const proposalIndex = proposals.findIndex((p: PolicyProposal) => p.id === selectedProposal.id)
                          
                          if (proposalIndex !== -1) {
                            proposals[proposalIndex] = {
                              ...proposals[proposalIndex],
                              ...previousPolicyFormData
                            }
                            proposals[proposalIndex].updatedAt = new Date().toISOString()
                            localStorage.setItem('policyDrafts', JSON.stringify(proposals))
                            
                            // Update selected proposal
                            setSelectedProposal(proposals[proposalIndex])
                          }
                        }
                        
                        toast.success('Previous Policy Details saved!')
                        setCurrentStep(0) // Move to Customer Information step
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                    >
                      Save & Continue to Customer Information
                    </button>
                  </div>
                </div>
              )}

              {/* Step 0: Customer Information (first step for all proposals, or second if Previous Policy Details shown) */}
              {currentStep === 0 && (
                <div>
                  <h3 className="text-md font-semibold text-gray-900 mb-3">Customer Information</h3>
                  <p className="text-sm text-gray-600 mb-4">Please provide customer details to proceed with policy issuance.</p>
                  
                  <div className="bg-white rounded-lg p-4 border">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Customer Type *
                      </label>
                      <select
                        value={customerInfoFormData.customerType}
                        onChange={(e) => setCustomerInfoFormData(prev => ({ ...prev, customerType: e.target.value as 'INDIVIDUAL' | 'CORPORATE' }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="INDIVIDUAL">Individual</option>
                        <option value="CORPORATE">Corporate</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {customerInfoFormData.customerType === 'INDIVIDUAL' ? (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              First Name *
                            </label>
                            <input
                              type="text"
                              value={customerInfoFormData.firstName}
                              onChange={(e) => setCustomerInfoFormData(prev => ({ ...prev, firstName: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter first name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Last Name *
                            </label>
                            <input
                              type="text"
                              value={customerInfoFormData.lastName}
                              onChange={(e) => setCustomerInfoFormData(prev => ({ ...prev, lastName: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter last name"
                            />
                          </div>
                        </>
                      ) : (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Company Name *
                          </label>
                          <input
                            type="text"
                            value={customerInfoFormData.companyName}
                            onChange={(e) => setCustomerInfoFormData(prev => ({ ...prev, companyName: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter company name"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={customerInfoFormData.email}
                          onChange={(e) => setCustomerInfoFormData(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter email"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone *
                        </label>
                        <input
                          type="tel"
                          value={customerInfoFormData.phone}
                          onChange={(e) => setCustomerInfoFormData(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter phone number"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address *
                        </label>
                        <input
                          type="text"
                          value={customerInfoFormData.address}
                          onChange={(e) => setCustomerInfoFormData(prev => ({ ...prev, address: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter address"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          value={customerInfoFormData.city}
                          onChange={(e) => setCustomerInfoFormData(prev => ({ ...prev, city: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter city"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          value={customerInfoFormData.state}
                          onChange={(e) => setCustomerInfoFormData(prev => ({ ...prev, state: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter state"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pincode *
                        </label>
                        <input
                          type="text"
                          value={customerInfoFormData.pincode}
                          onChange={(e) => setCustomerInfoFormData(prev => ({ ...prev, pincode: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter pincode"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between">
                    <button
                      onClick={() => {
                        setSelectedProposal(null)
                        setCurrentStep(1)
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        // Validate required fields
                        const missing: string[] = []
                        if (!customerInfoFormData.email) missing.push('Email')
                        if (!customerInfoFormData.phone) missing.push('Phone')
                        if (!customerInfoFormData.address) missing.push('Address')
                        if (!customerInfoFormData.city) missing.push('City')
                        if (!customerInfoFormData.state) missing.push('State')
                        if (!customerInfoFormData.pincode) missing.push('Pincode')
                        
                        if (customerInfoFormData.customerType === 'INDIVIDUAL') {
                          if (!customerInfoFormData.firstName) missing.push('First Name')
                          if (!customerInfoFormData.lastName) missing.push('Last Name')
                        } else {
                          if (!customerInfoFormData.companyName) missing.push('Company Name')
                        }
                        
                        if (missing.length > 0) {
                          toast.error(`Please fill required fields: ${missing.join(', ')}`)
                          return
                        }
                        
                        // Update proposal with customer information
                        if (selectedProposal) {
                          const proposals = JSON.parse(localStorage.getItem('policyDrafts') || '[]')
                          const proposalIndex = proposals.findIndex((p: PolicyProposal) => p.id === selectedProposal.id)
                          
                          if (proposalIndex !== -1) {
                            proposals[proposalIndex].customerInfo = {
                              ...proposals[proposalIndex].customerInfo,
                              ...customerInfoFormData
                            }
                            proposals[proposalIndex].needsCustomerInfo = false // Mark as completed
                            proposals[proposalIndex].updatedAt = new Date().toISOString()
                            localStorage.setItem('policyDrafts', JSON.stringify(proposals))
                            
                            // Update selected proposal
                            setSelectedProposal(proposals[proposalIndex])
                          }
                        }
                        
                        toast.success('Customer information saved!')
                        setCurrentStep(1) // Move to KYC step
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                    >
                      Save & Continue to KYC
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div>
                  <h3 className="text-md font-semibold text-gray-900 mb-3">KYC Verification</h3>
                  <p className="text-sm text-gray-600 mb-4">Please provide CKYC number or PAN number and upload PAN copy for verification.</p>
                  
                  <div className="bg-white rounded-lg p-4 border">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CKYC Number
                        </label>
                        <input
                          type="text"
                          value={kycFormData.ckycNumber}
                          onChange={(e) => setKycFormData(prev => ({ ...prev, ckycNumber: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter CKYC number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          PAN Number
                        </label>
                        <input
                          type="text"
                          value={kycFormData.panNumber}
                          onChange={(e) => setKycFormData(prev => ({ 
                            ...prev, 
                            panNumber: e.target.value.toUpperCase(),
                            panValidation: { isValid: validatePAN(e.target.value.toUpperCase()), error: '' }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter PAN number (e.g., ABCDE1234F)"
                          maxLength={10}
                        />
                        {kycFormData.panNumber && !kycFormData.panValidation.isValid && (
                          <p className="text-red-500 text-xs mt-1">Invalid PAN format</p>
                      )}
                    </div>
                  </div>
                  
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload PAN Card Copy <span className="text-red-500">*</span>
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={handlePANFileUpload}
                          className="hidden"
                          id="pan-upload"
                        />
                        <label htmlFor="pan-upload" className="cursor-pointer">
                          <div className="text-center">
                            <DocumentIcon className="mx-auto h-8 w-8 text-gray-400" />
                            <p className="text-sm text-gray-600 mt-2">Click to upload PAN Card</p>
                            <p className="text-xs text-gray-500">PDF, JPG, PNG (Max 10MB)</p>
                      </div>
                        </label>
                        {kycFormData.panFilePreview && (
                          <div className="mt-2">
                            <p className="text-sm text-green-600">File uploaded: {kycFormData.panFile?.name}</p>
                    </div>
                        )}
                        {kycFormData.panValidation.error && (
                          <p className="text-red-500 text-xs mt-1">{kycFormData.panValidation.error}</p>
                        )}
                    </div>
                  </div>
                  
                    <div className="mt-4 bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Note:</strong> Either CKYC number or PAN number is required. PAN copy upload is mandatory for verification.
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between">
                    <button
                      onClick={() => {
                        setSelectedProposal(null)
                        setCurrentStep(1)
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 text-sm"
                    >
                      Cancel
                    </button>
                    <div className="flex space-x-2">
                      {(process.env.NODE_ENV === 'development' || testMode) && (
                      <button
                          onClick={() => {
                            toast.success('KYC verification bypassed for testing!')
                            setCurrentStep(2)
                          }}
                          className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 text-sm"
                        >
                          Skip KYC (Test Mode)
                      </button>
                      )}
                      <button
                        onClick={handleKYCVerification}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                      >
                        Verify KYC
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div>
                  <h3 className="text-md font-semibold text-gray-900 mb-3">Other Vehicle Details</h3>
                  <p className="text-sm text-gray-600 mb-4">Please provide additional vehicle information for policy issuance.</p>
                  
                    <div className="bg-white rounded-lg p-4 border">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Chassis Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={proposalFormData.chassisNumber}
                          onChange={(e) => setProposalFormData(prev => ({ ...prev, chassisNumber: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter chassis number"
                        />
                          </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Engine Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={proposalFormData.engineNumber}
                          onChange={(e) => setProposalFormData(prev => ({ ...prev, engineNumber: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter engine number"
                        />
                        </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Electrical Accessories
                        </label>
                        <input
                          type="text"
                          value={proposalFormData.electricalAccessories}
                          onChange={(e) => setProposalFormData(prev => ({ ...prev, electricalAccessories: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., Music System, GPS"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Electrical Accessories Value
                        </label>
                        <input
                          type="number"
                          value={proposalFormData.electricalAccessoriesValue}
                          onChange={(e) => setProposalFormData(prev => ({ ...prev, electricalAccessoriesValue: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="₹0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Non-Electrical Accessories
                        </label>
                        <input
                          type="text"
                          value={proposalFormData.nonElectricalAccessories}
                          onChange={(e) => setProposalFormData(prev => ({ ...prev, nonElectricalAccessories: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., Seat Covers, Floor Mats"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Non-Electrical Accessories Value
                        </label>
                        <input
                          type="number"
                          value={proposalFormData.nonElectricalAccessoriesValue}
                          onChange={(e) => setProposalFormData(prev => ({ ...prev, nonElectricalAccessoriesValue: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="₹0"
                        />
                        </div>
                      </div>
                      
                    {/* Discounts Section */}
                    <div className="mt-6 border-t pt-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Discounts</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={proposalFormData.discountAntiTheft}
                              onChange={(e) => setProposalFormData(prev => ({ ...prev, discountAntiTheft: e.target.checked }))}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 text-sm font-medium text-gray-700">
                              Anti-theft Device
                            </label>
                          </div>
                          {proposalFormData.discountAntiTheft && (
                            <div className="ml-6">
                              <input
                                type="number"
                                value={proposalFormData.discountAntiTheftPrice}
                                onChange={(e) => setProposalFormData(prev => ({ ...prev, discountAntiTheftPrice: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Anti-theft price (₹)"
                              />
                        </div>
                      )}
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={proposalFormData.discountHandicapped}
                              onChange={(e) => setProposalFormData(prev => ({ ...prev, discountHandicapped: e.target.checked }))}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 text-sm font-medium text-gray-700">
                              Handicapped
                            </label>
                    </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={proposalFormData.discountVoluntary}
                              onChange={(e) => setProposalFormData(prev => ({ ...prev, discountVoluntary: e.target.checked }))}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 text-sm font-medium text-gray-700">
                              Voluntary
                            </label>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={proposalFormData.discountAAMembership}
                              onChange={(e) => setProposalFormData(prev => ({ ...prev, discountAAMembership: e.target.checked }))}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 text-sm font-medium text-gray-700">
                              AA Membership
                            </label>
                          </div>
                          {proposalFormData.discountAAMembership && (
                            <div className="ml-6">
                              <input
                                type="text"
                                value={proposalFormData.discountAAMembershipNo}
                                onChange={(e) => setProposalFormData(prev => ({ ...prev, discountAAMembershipNo: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="AA Membership Number"
                              />
                            </div>
                          )}
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={proposalFormData.discountGeoExtension}
                              onChange={(e) => setProposalFormData(prev => ({ ...prev, discountGeoExtension: e.target.checked }))}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 text-sm font-medium text-gray-700">
                              Geo Extension
                            </label>
                          </div>
                          {proposalFormData.discountGeoExtension && (
                            <div className="ml-6">
                              <select
                                multiple
                                value={proposalFormData.discountGeoCountries}
                                onChange={(e) => setProposalFormData(prev => ({ 
                                  ...prev, 
                                  discountGeoCountries: Array.from(e.target.selectedOptions, option => option.value)
                                }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                size={4}
                              >
                                {countryOptions.map(country => (
                                  <option key={country} value={country}>{country}</option>
                                ))}
                              </select>
                              <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple countries</p>
                    </div>
                  )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 text-sm"
                    >
                      Back
                    </button>
                      <button
                      onClick={handleOtherVehicleDetailsSubmission}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                      >
                      Continue to Liability Details
                      </button>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div>
                  <h3 className="text-md font-semibold text-gray-900 mb-3">Liability Details</h3>
                  <p className="text-sm text-gray-600 mb-4">Please select the required liability coverage options.</p>
                  
                  <div className="bg-white rounded-lg p-4 border">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center">
                          <ShieldCheckIcon className="h-5 w-5 text-blue-600 mr-3" />
                      <div>
                            <h4 className="text-sm font-medium text-gray-900">Compulsory Personal Accident</h4>
                            <p className="text-xs text-gray-500">Mandatory coverage for personal accident</p>
                      </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            checked={proposalFormData.liabilityCompulsoryPA}
                            onChange={(e) => setProposalFormData(prev => ({ ...prev, liabilityCompulsoryPA: e.target.checked }))}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                          />
                          <span className="text-sm text-gray-600">Included</span>
                        </div>
                    </div>
                    
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center">
                          <TruckIcon className="h-5 w-5 text-green-600 mr-3" />
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">TPPD Extension</h4>
                            <p className="text-xs text-gray-500">Third Party Property Damage Extension</p>
                      </div>
                      </div>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            checked={proposalFormData.liabilityTPPDExtension}
                            onChange={(e) => setProposalFormData(prev => ({ ...prev, liabilityTPPDExtension: e.target.checked }))}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                          />
                          <span className="text-sm text-gray-600">Selected</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center">
                          <UserIcon className="h-5 w-5 text-purple-600 mr-3" />
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Driver Cover</h4>
                            <p className="text-xs text-gray-500">Coverage for the driver</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            checked={proposalFormData.liabilityDriverCover}
                            onChange={(e) => setProposalFormData(prev => ({ ...prev, liabilityDriverCover: e.target.checked }))}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                          />
                          <span className="text-sm text-gray-600">Selected</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center">
                          <UserIcon className="h-5 w-5 text-orange-600 mr-3" />
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Cleaner Cover</h4>
                            <p className="text-xs text-gray-500">Coverage for the cleaner/helper</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            checked={proposalFormData.liabilityCleanerCover}
                            onChange={(e) => setProposalFormData(prev => ({ ...prev, liabilityCleanerCover: e.target.checked }))}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                          />
                          <span className="text-sm text-gray-600">Selected</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-blue-900 mb-2">Coverage Summary</h4>
                      <div className="text-sm text-blue-800">
                        <p>• Compulsory Personal Accident: {proposalFormData.liabilityCompulsoryPA ? 'Included' : 'Not Selected'}</p>
                        <p>• TPPD Extension: {proposalFormData.liabilityTPPDExtension ? 'Selected' : 'Not Selected'}</p>
                        <p>• Driver Cover: {proposalFormData.liabilityDriverCover ? 'Selected' : 'Not Selected'}</p>
                        <p>• Cleaner Cover: {proposalFormData.liabilityCleanerCover ? 'Selected' : 'Not Selected'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 text-sm"
                    >
                      Back
                    </button>
                        <button
                      onClick={handleLiabilityDetailsSubmission}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                      >
                      Continue to Nomination Details
                      </button>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div>
                  <h3 className="text-md font-semibold text-gray-900 mb-3">Nomination Details</h3>
                  <p className="text-sm text-gray-600 mb-4">Please provide nominee information for policy benefits.</p>
                  
                  <div className="bg-white rounded-lg p-4 border">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nominee Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={proposalFormData.nomineeName}
                          onChange={(e) => setProposalFormData(prev => ({ ...prev, nomineeName: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter nominee full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Relationship <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={proposalFormData.nomineeRelationship}
                          onChange={(e) => setProposalFormData(prev => ({ ...prev, nomineeRelationship: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Relationship</option>
                          <option value="spouse">Spouse</option>
                          <option value="child">Child</option>
                          <option value="parent">Parent</option>
                          <option value="sibling">Sibling</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contact Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          value={proposalFormData.nomineeContactNo}
                          onChange={(e) => setProposalFormData(prev => ({ ...prev, nomineeContactNo: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter contact number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={proposalFormData.nomineeEmail}
                          onChange={(e) => setProposalFormData(prev => ({ ...prev, nomineeEmail: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter email address"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Sex <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={proposalFormData.nomineeSex}
                          onChange={(e) => setProposalFormData(prev => ({ ...prev, nomineeSex: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Sex</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date of Birth <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={proposalFormData.nomineeDOB}
                          onChange={(e) => setProposalFormData(prev => ({ ...prev, nomineeDOB: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-blue-900 mb-2">Nominee Information Summary</h4>
                      <div className="text-sm text-blue-800">
                        <p><strong>Name:</strong> {proposalFormData.nomineeName || 'Not provided'}</p>
                        <p><strong>Relationship:</strong> {proposalFormData.nomineeRelationship || 'Not selected'}</p>
                        <p><strong>Contact:</strong> {proposalFormData.nomineeContactNo || 'Not provided'}</p>
                        <p><strong>Email:</strong> {proposalFormData.nomineeEmail || 'Not provided'}</p>
                        <p><strong>Sex:</strong> {proposalFormData.nomineeSex || 'Not selected'}</p>
                        <p><strong>DOB:</strong> {proposalFormData.nomineeDOB || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between">
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 text-sm"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleNominationDetailsSubmission}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                      <div>
                  <h3 className="text-md font-semibold text-gray-900 mb-3">Payment & Declaration</h3>
                  <p className="text-sm text-gray-600 mb-4">Complete payment and accept declaration to proceed with policy issuance.</p>
                  
                  <div className="bg-white rounded-lg p-4 border">
                    {/* Payment Mode Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Payment Mode <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={proposalFormData.paymentMode}
                          onChange={(e) => setProposalFormData(prev => ({ ...prev, paymentMode: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Payment Mode</option>
                          <option value="online">Online Payment</option>
                          <option value="cheque">Cheque</option>
                          <option value="dd">Demand Draft</option>
                          <option value="cash">Cash</option>
                        </select>
                    </div>

                    {/* Payment Summary */}
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-900 mb-3">Payment Summary</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Insurance Company</p>
                            <p className="font-medium">{selectedProposal.selectedQuote?.companyName}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Premium Amount</p>
                            <p className="font-medium">₹{selectedProposal.selectedQuote?.totalPremium.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">GST (18%)</p>
                            <p className="font-medium">₹{Math.round((selectedProposal.selectedQuote?.totalPremium || 0) * 0.18).toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Total Amount</p>
                            <p className="font-medium text-lg">₹{Math.round((selectedProposal.selectedQuote?.totalPremium || 0) * 1.18).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Information */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Information (Optional)
                      </label>
                      <textarea
                        value={proposalFormData.additionalInfo}
                        onChange={(e) => setProposalFormData(prev => ({ ...prev, additionalInfo: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Any additional information or special requirements..."
                      />
                    </div>

                    {/* Declaration */}
                    <div className="mb-6">
                      <label className="flex items-start">
                        <input
                          type="checkbox"
                          checked={proposalFormData.declarationAccepted}
                          onChange={(e) => setProposalFormData(prev => ({ ...prev, declarationAccepted: e.target.checked }))}
                          className="mt-1 mr-3"
                        />
                        <span className="text-sm text-gray-700">
                          I hereby declare that all the information provided in this proposal form is true and correct to the best of my knowledge. 
                          I understand that any false or misleading information may result in the rejection of my proposal or cancellation of the policy. 
                          <span className="text-red-500">*</span>
                        </span>
                      </label>
                    </div>

                    {/* Policy Summary */}
                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                      <h5 className="font-medium text-blue-900 mb-2">Policy Summary</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-blue-700">Insurance Company:</span>
                          <p className="font-medium">{selectedProposal?.selectedQuote?.companyName}</p>
                        </div>
                        <div>
                          <span className="text-blue-700">Total Premium:</span>
                          <p className="font-medium">₹{selectedProposal?.selectedQuote?.totalPremium.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-blue-700">Policy Type:</span>
                          <p className="font-medium">{selectedProposal?.policyDetails?.policyType || '—'}</p>
                        </div>
                        <div>
                          <span className="text-blue-700">Policy Term:</span>
                          <p className="font-medium">{selectedProposal?.policyDetails?.policyTerm || '—'} year(s)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between">
                    <button
                      onClick={() => setCurrentStep(4)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 text-sm"
                    >
                      Back
                    </button>
                    <div className="flex space-x-2">
                      {(process.env.NODE_ENV === 'development' || testMode) && (
                        <button
                          onClick={() => {
                            toast.success('Payment and declaration bypassed for testing!')
                            setCurrentStep(6)
                            handlePolicyIssuance()
                          }}
                          className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 text-sm"
                        >
                          Skip Payment (Test Mode)
                        </button>
                      )}
                      <button
                        onClick={() => {
                          if (!proposalFormData.paymentMode || !proposalFormData.declarationAccepted) {
                            toast.error('Please select payment mode and accept declaration')
                            return
                          }
                          handlePaymentProcessing({ method: proposalFormData.paymentMode, type: 'online' })
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                      >
                        Process Payment
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 6 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-md font-semibold text-gray-900">Policy Issuance</h3>
                    <button
                      onClick={() => {
                        setSelectedProposal(null)
                        setCurrentStep(1)
                        setShowPolicyCertificate(false)
                        setIssuedPolicy(null)
                      }}
                      className="text-gray-500 hover:text-gray-700 p-1"
                      title="Close Policy Certificate"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="bg-white rounded-lg p-4 border">
                    <div className="text-center py-8">
                      <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
                      <h4 className="text-xl font-bold text-green-600 mb-2">Policy Issued Successfully!</h4>
                      <p className="text-gray-600 mb-4">Your insurance policy has been issued and certificate has been sent to your email.</p>
                      
                      {issuedPolicy && (
                        <div className="bg-gray-50 rounded-lg p-4 mt-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Policy Number</p>
                              <p className="font-medium">{issuedPolicy.policyNumber}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Certificate Number</p>
                              <p className="font-medium">{issuedPolicy.certificateNumber}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Insurance Company</p>
                              <p className="font-medium">{issuedPolicy.insuranceCompany}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Premium Amount</p>
                              <p className="font-medium">₹{issuedPolicy.premiumAmount.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Nominee</p>
                              <p className="font-medium">{issuedPolicy.nomineeDetails?.name} ({issuedPolicy.nomineeDetails?.relationship})</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Payment Mode</p>
                              <p className="font-medium">{issuedPolicy.paymentMode}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-center space-x-4">
                    <button
                      onClick={() => window.print()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                    >
                      Print Certificate
                    </button>
                    <button
                      onClick={() => {
                        setSelectedProposal(null)
                        setCurrentStep(1)
                        setShowPolicyCertificate(false)
                        setIssuedPolicy(null)
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 text-sm"
                    >
                      New Quotation
                    </button>
                    <button
                      onClick={() => {
                        setSelectedProposal(null)
                        setCurrentStep(1)
                        setShowPolicyCertificate(false)
                        setIssuedPolicy(null)
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Proposals Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          {currentProposals.length === 0 ? (
            <div className="text-center py-12">
              <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No proposals found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== 'ALL' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by creating a new quotation.'
                }
              </p>
              {!searchTerm && statusFilter === 'ALL' && (
                <div className="mt-6">
                  <button
                    onClick={() => router.push('/dashboard/presale/quotation')}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    New Quotation
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Proposal Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Policy Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Premium
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        KYC Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentProposals.map((proposal, index) => {
                      // Generate customer ID and proposal number if not exists
                      const customerId = proposal.customerId || `CUST${(startIndex + index + 1).toString().padStart(5, '0')}`
                      const proposalNumber = proposal.proposalNumber || `PROP/2025/${(startIndex + index + 1).toString().padStart(4, '0')}`
                      
                      return (
                      <tr key={proposal.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {customerId}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-blue-600">
                            {proposalNumber}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {(proposal.customerInfo?.customerType || (proposal as any)?.customerType) === 'INDIVIDUAL' ? (
                                <UserIcon className="h-10 w-10 text-gray-400" />
                              ) : (
                                <BuildingOfficeIcon className="h-10 w-10 text-gray-400" />
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {(() => {
                                  const p: any = proposal as any
                                  const ci: any = proposal.customerInfo || {}
                                  const ctype = ci.customerType || p.customerType
                                  if (ctype === 'INDIVIDUAL') {
                                    const first = ci.firstName || p.firstName || ''
                                    const last = ci.lastName || p.lastName || ''
                                    return `${first} ${last}`.trim() || 'Customer'
                                  }
                                  return ci.companyName || p.companyName || 'Corporate Customer'
                                })()}
                              </div>
                              <div className="text-sm text-gray-500">
                                {proposal.customerInfo?.email || (proposal as any)?.email || '—'}
                              </div>
                              <div className="text-xs text-gray-400">
                                Phone: {proposal.customerInfo?.phone || (proposal as any)?.phone || '—'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {(proposal as any).policyDetails?.policyType || '—'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {(proposal as any).policyDetails?.oem && (proposal as any).policyDetails?.modelName && (
                              `${(proposal as any).policyDetails?.oem} ${(proposal as any).policyDetails?.modelName}`
                            )}
                          </div>
                          <div className="text-xs text-gray-400">
                            Term: {(proposal as any).policyDetails?.policyTerm || '—'} year(s)
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            ₹{proposal.selectedQuote?.totalPremium?.toLocaleString() || 'N/A'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {proposal.selectedQuote?.companyName || 'No quote selected'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getKYCStatusBadge(proposal.kycStatus)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(proposal.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            {new Date(proposal.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleViewProposal(proposal)}
                              className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                              title={proposal.status === 'CONVERTED' ? 'View Policy Certificate' : 'View Proposal'}
                            >
                              <EyeIcon className="h-4 w-4 mr-1" />
                              <span className="text-xs">
                                {proposal.status === 'CONVERTED' ? 'View Policy' : 'View'}
                              </span>
                            </button>
                            {proposal.status !== 'CONVERTED' ? (
                              <>
                                <button
                                  onClick={() => handleEditProposal(proposal)}
                                  className="text-green-600 hover:text-green-900"
                                  title="Edit Proposal"
                                >
                                  <PencilIcon className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleStartWorkflow(proposal)}
                                  className="text-purple-600 hover:text-purple-900"
                                  title="Continue Workflow"
                                >
                                  <ArrowRightIcon className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProposal(proposal.id)}
                                  className="text-red-600 hover:text-red-900"
                                  title="Delete Proposal"
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </button>
                              </>
                            ) : (
                              <span className="text-emerald-600 text-xs font-medium flex items-center">
                                <CheckCircleIcon className="h-4 w-4 mr-1" />
                                Policy Issued
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                        <span className="font-medium">{Math.min(endIndex, filteredProposals.length)}</span> of{' '}
                        <span className="font-medium">{filteredProposals.length}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          Previous
                        </button>
                        {[...Array(totalPages)].map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentPage(index + 1)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === index + 1
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {index + 1}
                          </button>
                        ))}
                        <button
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* OTP Verification Modal */}
        {showOTPModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">OTP Verification</h3>
                <p className="text-sm text-gray-600 mb-4">
                  A 6-digit verification code has been sent to {selectedProposal?.customerInfo.email}
                </p>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={enteredOTP}
                    onChange={(e) => setEnteredOTP(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg tracking-widest"
                    placeholder="000000"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowOTPModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  {(process.env.NODE_ENV === 'development' || testMode) && (
                    <button
                      onClick={() => {
                        toast.success('OTP bypassed for testing!')
                        setShowOTPModal(false)
                        setShowKYCForm(true)
                        setCurrentStep(3)
                      }}
                      className="px-4 py-2 text-sm font-medium text-orange-700 bg-orange-100 rounded-md hover:bg-orange-200"
                    >
                      Skip OTP (Test Mode)
                    </button>
                  )}
                  <button
                    onClick={handleOTPVerification}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Verify OTP
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* KYC Form Modal */}
        {showKYCForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900">KYC Verification</h3>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      selectedProposal?.kycStatus === 'verified' ? 'bg-green-100 text-green-800' :
                      selectedProposal?.kycStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedProposal?.kycStatus === 'verified' ? 'Verified' :
                       selectedProposal?.kycStatus === 'rejected' ? 'Rejected' : 'Pending'}
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-4">
                    Please upload the required documents for KYC verification. All documents should be clear and readable.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Identity Proof */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Identity Proof (PAN Card) <span className="text-red-500">*</span>
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      <div className="text-center">
                        <DocumentIcon className="mx-auto h-8 w-8 text-gray-400" />
                        <p className="text-sm text-gray-600">Click to upload PAN Card</p>
                        <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max 10MB)</p>
                      </div>
                    </div>
                  </div>

                  {/* Address Proof */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Address Proof <span className="text-red-500">*</span>
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      <div className="text-center">
                        <DocumentIcon className="mx-auto h-8 w-8 text-gray-400" />
                        <p className="text-sm text-gray-600">Click to upload</p>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle RC */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Vehicle Registration Certificate <span className="text-red-500">*</span>
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      <div className="text-center">
                        <DocumentIcon className="mx-auto h-8 w-8 text-gray-400" />
                        <p className="text-sm text-gray-600">Click to upload</p>
                      </div>
                    </div>
                  </div>

                  {/* Income Proof */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Income Proof (Optional)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      <div className="text-center">
                        <DocumentIcon className="mx-auto h-8 w-8 text-gray-400" />
                        <p className="text-sm text-gray-600">Click to upload</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowKYCForm(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  {(process.env.NODE_ENV === 'development' || testMode) && (
                    <button
                      type="button"
                      onClick={() => {
                        toast.success('KYC bypassed for testing!')
                        setShowKYCForm(false)
                        setShowProposalForm(true)
                        setCurrentStep(4)
                      }}
                      className="px-4 py-2 text-sm font-medium text-orange-700 bg-orange-100 rounded-md hover:bg-orange-200"
                    >
                      Skip KYC (Test Mode)
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleKYCVerification}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Verify KYC
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Form Modal */}
        {showPaymentForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Processing</h3>
                
                {/* Payment Status */}
                <div className="mb-6">
                  <div className={`p-4 rounded-lg ${
                    paymentStatus === 'pending' ? 'bg-blue-50 border border-blue-200' :
                    paymentStatus === 'processing' ? 'bg-yellow-50 border border-yellow-200' :
                    paymentStatus === 'completed' ? 'bg-green-50 border border-green-200' :
                    'bg-red-50 border border-red-200'
                  }`}>
                    <div className="flex items-center">
                      {paymentStatus === 'pending' && (
                        <>
                          <ClockIcon className="h-5 w-5 text-blue-600 mr-2" />
                          <span className="text-blue-800">Payment Pending</span>
                        </>
                      )}
                      {paymentStatus === 'processing' && (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-600 mr-2"></div>
                          <span className="text-yellow-800">Processing Payment...</span>
                        </>
                      )}
                      {paymentStatus === 'completed' && (
                        <>
                          <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                          <span className="text-green-800">Payment Completed</span>
                        </>
                      )}
                      {paymentStatus === 'failed' && (
                        <>
                          <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2" />
                          <span className="text-red-800">Payment Failed</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Payment Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Insurance Company:</span>
                      <span className="font-medium">{selectedProposal?.selectedQuote?.companyName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Premium Amount:</span>
                      <span className="font-medium">₹{selectedProposal?.selectedQuote?.totalPremium.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">GST (18%):</span>
                      <span className="font-medium">₹{Math.round((selectedProposal?.selectedQuote?.totalPremium || 0) * 0.18).toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total Amount:</span>
                        <span>₹{Math.round((selectedProposal?.selectedQuote?.totalPremium || 0) * 1.18).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Methods */}
                {paymentStatus === 'pending' && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-900">Select Payment Method</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        onClick={() => handlePaymentProcessing({ method: 'online', type: 'card' })}
                        className="p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-blue-600 font-semibold">💳</span>
                          </div>
                          <div className="text-left">
                            <div className="font-medium">Credit/Debit Card</div>
                            <div className="text-sm text-gray-500">Visa, Mastercard, RuPay</div>
                          </div>
                        </div>
                      </button>
                      
                      <button
                        onClick={() => handlePaymentProcessing({ method: 'online', type: 'upi' })}
                        className="p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-purple-600 font-semibold">📱</span>
                          </div>
                          <div className="text-left">
                            <div className="font-medium">UPI</div>
                            <div className="text-sm text-gray-500">PhonePe, GPay, Paytm</div>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                {/* Test Mode Payment */}
                {(process.env.NODE_ENV === 'development' || testMode) && paymentStatus === 'pending' && (
                  <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <h4 className="text-sm font-medium text-orange-900 mb-2">Test Mode</h4>
                    <button
                      onClick={() => handlePaymentProcessing({ method: 'test', type: 'bypass' })}
                      className="w-full px-4 py-2 text-sm font-medium text-orange-700 bg-orange-100 rounded-md hover:bg-orange-200"
                    >
                      Skip Payment (Test Mode)
                    </button>
                  </div>
                )}

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPaymentForm(false)
                      setCurrentStep(4)
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Back to Proposal Form
                  </button>
                  {paymentStatus === 'failed' && (
                    <button
                      onClick={() => setPaymentStatus('pending')}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      Retry Payment
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
