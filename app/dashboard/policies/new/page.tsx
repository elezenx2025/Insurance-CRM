'use client'

import { useEffect, useMemo, useState } from 'react'
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
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  UserPlusIcon,
  IdentificationIcon,
  PhoneIcon,
  CreditCardIcon,
  DocumentTextIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { ContextualDocumentManager } from '@/components/documents/ContextualDocumentManager'
import toast from 'react-hot-toast'

const policySchema = z.object({
  customerType: z.enum(['INDIVIDUAL', 'CORPORATE']),
  // Individual fields
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  // Corporate fields
  companyName: z.string().optional(),
  registrationNumber: z.string().optional(),
  // Common fields (default empty to align with RHF defaults)
  email: z.string().email().default(''),
  phone: z.string().default(''),
  address: z.string().default(''),
  city: z.string().default(''),
  state: z.string().default(''),
  pincode: z.string().default(''),
  // Policy details
  policyType: z.string().optional(),
  coverageAmount: z.number().optional().default(0),
  premiumAmount: z.number().optional().default(0),
  policyTerm: z.number().optional().default(0),
  // KYC status
  identityVerified: z.boolean().default(false),
  addressVerified: z.boolean().default(false),
  incomeVerified: z.boolean().default(false),
  medicalVerified: z.boolean().default(false),
  // Product-specific fields
  medicalHistory: z.string().optional(),
  familyMembers: z.number().optional(),
  hospitalNetwork: z.string().optional(),
  annualIncome: z.number().optional(),
  vehicleRegNumber: z.string().optional(),
  vehicleMakeModel: z.string().optional(),
  manufacturingYear: z.number().optional(),
  engineNumber: z.string().optional(),
  chassisNumber: z.string().optional(),
  claimsHistory: z.string().optional(),
  occupation: z.string().optional(),
  sumAssured: z.number().optional(),
  smokingStatus: z.string().optional(),
  nomineeName: z.string().optional(),
  propertyType: z.string().optional(),
  propertyValue: z.number().optional(),
  propertyAddress: z.string().optional(),
  constructionType: z.string().optional(),
  fireSafetyEquipment: z.string().optional(),
  previousClaims: z.string().optional()
})

type PolicyFormData = z.infer<typeof policySchema>

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

export default function NewPolicyPage() {
  const router = useRouter()
  const [showDocuments, setShowDocuments] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchType, setSearchType] = useState<'customer_id' | 'customer_name' | 'mobile' | 'pan' | 'policy' | 'new_case'>('new_case')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<CustomerData[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerData | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [showProductSelection, setShowProductSelection] = useState(false)

  const { register, handleSubmit, watch, formState: { errors }, setValue, resetField } = useForm<PolicyFormData>({
    resolver: zodResolver(policySchema) as any,
    defaultValues: {
      customerType: 'INDIVIDUAL',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      coverageAmount: 0,
      premiumAmount: 0,
      policyTerm: 0,
      identityVerified: false,
      addressVerified: false,
      incomeVerified: false,
      medicalVerified: false
    }
  })

  const customerType = watch('customerType')
  const identityVerified = watch('identityVerified')
  const addressVerified = watch('addressVerified')
  const incomeVerified = watch('incomeVerified')
  const medicalVerified = watch('medicalVerified')

  const issuedPolicies: any[] = useMemo(() => {
    try {
      if (typeof window === 'undefined') return []
      return JSON.parse(localStorage.getItem('issuedPolicies') || '[]')
    } catch {
      return []
    }
  }, [])

  const getCustomerDatabase = (): CustomerData[] => {
    try {
      const pendingPolicies = [
        {
          policyNumber: 'POL/NEW/2025/234',
          customerName: 'Arjun Mehta',
          policyType: 'MOTOR',
          email: 'arjun.mehta@email.com',
          phone: '+91 98765 43210',
          customerType: 'INDIVIDUAL'
        },
        {
          policyNumber: 'POL/RNW/2025/567',
          customerName: 'Ramesh Industries Ltd',
          policyType: 'FIRE',
          email: 'info@rameshindustries.com',
          phone: '+91 87654 32109',
          customerType: 'CORPORATE'
        },
        {
          policyNumber: 'POL/END/2025/089',
          customerName: 'Neha Kapoor',
          policyType: 'HEALTH',
          email: 'neha.kapoor@email.com',
          phone: '+91 76543 21098',
          customerType: 'INDIVIDUAL'
        },
        {
          policyNumber: 'POL/VER/2025/445',
          customerName: 'TechCorp Solutions',
          policyType: 'LIABILITY',
          email: 'admin@techcorp.com',
          phone: '+91 65432 10987',
          customerType: 'CORPORATE'
        }
      ]

      const customers: CustomerData[] = []

      issuedPolicies.forEach((policy, index) => {
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

      pendingPolicies.forEach((policy: any, index: number) => {
        customers.push({
          id: `pending_${index}`,
          customerId: `PEND${String(index + 1).padStart(3, '0')}`,
          name: policy.customerName,
          email: policy.email,
          phone: policy.phone,
          panNumber: `PAN${String(index + 1).padStart(7, '0')}`,
          policyNumber: policy.policyNumber,
          customerType: policy.customerType,
          address: `Address ${index + 1}`,
          city: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai'][index] || 'Mumbai',
          state: ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu'][index] || 'Maharashtra',
          pincode: `${400001 + index}`,
          dateOfBirth: policy.customerType === 'INDIVIDUAL' ? '1985-01-01' : undefined,
          gender: policy.customerType === 'INDIVIDUAL' ? 'Male' : undefined,
          companyName: policy.customerType === 'CORPORATE' ? policy.customerName : undefined
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

  const handleBack = () => {
    router.push('/dashboard/policies')
  }

  const handleKYCDocuments = () => {
    setShowDocuments(true)
  }

  const handleSearch = async () => {
    if (!searchQuery.trim() || searchType === 'new_case') return

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
    setShowProductSelection(true)

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
  }

  const handleNewCase = () => {
    setSelectedCustomer(null)
    setShowProductSelection(true)
    setCurrentStep(0)
    toast('Please select a product type for new customer registration', {
      icon: 'ℹ️',
      style: { background: '#3b82f6', color: '#ffffff' },
    })
  }

  const handleProductSelection = (productType: 'HEALTH' | 'MOTOR' | 'LIFE' | 'FIRE') => {
    setValue('policyType', productType)
    setCurrentStep(1)
    setShowProductSelection(false)
    toast.success(`Selected product: ${productType}. Please fill customer information.`)
  }

  const handleReset = () => {
    setSearchQuery('')
    setSearchResults([])
    setSelectedCustomer(null)
    setShowProductSelection(false)
    setSearchType('new_case')
    resetField('policyType')
    toast.success('Search form has been reset')
  }

  const onSubmit = async (data: PolicyFormData) => {
    setIsSubmitting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1200))
      toast.success('Policy application submitted successfully!')
      setCurrentStep(5)
    } catch (error) {
      toast.error('Failed to submit policy application')
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const getStepStatus = (step: number) => {
    if (step < currentStep) return 'completed'
    if (step === currentStep) return 'current'
    return 'upcoming'
  }

  const getStepIcon = (step: number) => {
    const status = getStepStatus(step)
    if (status === 'completed') return <CheckCircleIcon className="h-5 w-5 text-green-500" />
    if (status === 'current') return <ExclamationTriangleIcon className="h-5 w-5 text-blue-500" />
    return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
  }

  const getSearchIcon = (type: string) => {
    switch (type) {
      case 'customer_id': return <IdentificationIcon className="h-5 w-5" />
      case 'customer_name': return <UserIcon className="h-5 w-5" />
      case 'mobile': return <PhoneIcon className="h-5 w-5" />
      case 'pan': return <CreditCardIcon className="h-5 w-5" />
      case 'policy': return <DocumentTextIcon className="h-5 w-5" />
      case 'new_case': return <UserPlusIcon className="h-5 w-5" />
      default: return <MagnifyingGlassIcon className="h-5 w-5" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Modern Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleBack}
              className="group flex items-center px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg border border-slate-200 transition-all duration-200 hover:shadow-sm"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Policies
            </button>
            {selectedCustomer && (
              <div className="flex items-center space-x-3 px-4 py-2 bg-white rounded-lg border border-slate-200 shadow-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-slate-700">
                  Selected: <span className="text-slate-900 font-semibold">{selectedCustomer.name}</span>
                </span>
          </div>
            )}
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <DocumentIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">New Policy Application</h1>
                <p className="text-slate-600 mt-1">
            {currentStep === 0 
              ? 'Search for existing customer or create new case'
              : 'Create a new policy with complete customer information and KYC verification'}
          </p>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Search Step */}
        {currentStep === 0 && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <MagnifyingGlassIcon className="h-4 w-4 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Customer Search & Selection</h2>
              </div>

              {/* Modern Search Type Selection */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                {[
                  { value: 'customer_id', label: 'Customer ID', color: 'from-blue-500 to-blue-600' },
                  { value: 'customer_name', label: 'Customer Name', color: 'from-green-500 to-green-600' },
                  { value: 'mobile', label: 'Mobile Number', color: 'from-purple-500 to-purple-600' },
                  { value: 'pan', label: 'PAN Number', color: 'from-orange-500 to-orange-600' },
                  { value: 'policy', label: 'Policy Number', color: 'from-red-500 to-red-600' },
                  { value: 'new_case', label: 'New Case', color: 'from-indigo-500 to-indigo-600' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSearchType(option.value as any)
                      setSearchQuery('')
                      setSearchResults([])
                      if (option.value === 'new_case') handleNewCase()
                    }}
                    className={`group relative p-6 rounded-xl border-2 transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                      searchType === option.value
                        ? `border-transparent bg-gradient-to-r ${option.color} text-white shadow-lg`
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-3">
                      <div className={`p-3 rounded-lg ${
                        searchType === option.value 
                          ? 'bg-white/20' 
                          : 'bg-slate-100 group-hover:bg-slate-200'
                      }`}>
                      {getSearchIcon(option.value)}
                    </div>
                      <span className="text-sm font-semibold text-center leading-tight">{option.label}</span>
                    </div>
                    {searchType === option.value && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                        <CheckCircleIcon className="h-3 w-3 text-green-500" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Modern Search Input */}
              {searchType !== 'new_case' && (
                <div className="space-y-6">
                  <div className="relative">
                    <div className="flex space-x-4">
                      <div className="flex-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
                        </div>
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
                          className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900 placeholder-slate-400"
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      />
                        {searchQuery && (
                          <button
                            onClick={() => setSearchQuery('')}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        )}
                    </div>
                    <button
                      onClick={handleSearch}
                      disabled={!searchQuery.trim() || isSearching}
                        className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed flex items-center space-x-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:shadow-none"
                    >
                      {isSearching ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                          <span>Searching...</span>
                        </>
                      ) : (
                        <>
                            <MagnifyingGlassIcon className="h-5 w-5" />
                          <span>Search</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleReset}
                        className="px-6 py-4 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 flex items-center space-x-2 font-semibold transition-all duration-200 hover:shadow-md"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>Reset</span>
                    </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Modern Search Results */}
              {searchResults.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-slate-900">Search Results</h3>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                        {searchResults.length} found
                      </span>
                  </div>
                  </div>
                  <div className="divide-y divide-slate-200 max-h-96 overflow-y-auto">
                    {searchResults.map((customer) => (
                      <div
                        key={customer.id}
                        className="p-6 hover:bg-slate-50 cursor-pointer transition-all duration-200 group"
                        onClick={() => handleSelectCustomer(customer)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`p-3 rounded-xl ${
                              customer.customerType === 'INDIVIDUAL' 
                                ? 'bg-blue-100 text-blue-600' 
                                : 'bg-purple-100 text-purple-600'
                            }`}>
                            {customer.customerType === 'INDIVIDUAL' ? (
                                <UserIcon className="h-6 w-6" />
                              ) : (
                                <BuildingOfficeIcon className="h-6 w-6" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                                {customer.name}
                              </h4>
                              <div className="flex items-center space-x-4 mt-1">
                                <p className="text-sm text-slate-600">ID: <span className="font-medium">{customer.customerId}</span></p>
                                <p className="text-sm text-slate-600">{customer.phone}</p>
                              {customer.panNumber && (
                                  <p className="text-sm text-slate-600">PAN: <span className="font-medium">{customer.panNumber}</span></p>
                              )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                              customer.customerType === 'INDIVIDUAL' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-purple-100 text-purple-800'
                            }`}>
                              {customer.customerType}
                            </span>
                            {customer.policyNumber && (
                              <p className="text-sm text-slate-500 mt-2">Policy: {customer.policyNumber}</p>
                            )}
                            <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-blue-600 text-sm font-medium">Click to select →</span>
                            </div>
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

        {/* Modern Product Selection */}
        {showProductSelection && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <DocumentIcon className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
              {selectedCustomer ? `Product Selection for ${selectedCustomer.name}` : 'Select Product Type for New Customer'}
            </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { 
                  type: 'HEALTH', 
                  name: 'Health Insurance', 
                  description: 'Comprehensive health coverage',
                  color: 'from-green-500 to-emerald-600',
                  icon: '🏥'
                },
                { 
                  type: 'MOTOR', 
                  name: 'Motor Insurance', 
                  description: 'Vehicle protection & coverage',
                  color: 'from-blue-500 to-cyan-600',
                  icon: '🚗'
                },
                { 
                  type: 'LIFE', 
                  name: 'Life Insurance', 
                  description: 'Financial security for family',
                  color: 'from-purple-500 to-violet-600',
                  icon: '🛡️'
                },
                { 
                  type: 'FIRE', 
                  name: 'Fire Insurance', 
                  description: 'Property & asset protection',
                  color: 'from-red-500 to-rose-600',
                  icon: '🔥'
                }
              ].map((product) => (
                <button
                  key={product.type}
                  onClick={() => handleProductSelection(product.type as 'HEALTH' | 'MOTOR' | 'LIFE' | 'FIRE')}
                  className={`group relative p-6 rounded-2xl bg-gradient-to-br ${product.color} text-white hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl`}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-3">{product.icon}</div>
                    <h3 className="text-lg font-bold mb-2">{product.name}</h3>
                    <p className="text-sm opacity-90">{product.description}</p>
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Modern Progress Steps */}
        {currentStep > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
            <div className="flex items-center justify-between">
              {[
                { step: 1, title: 'Customer Info', description: 'Collect customer information', icon: '👤' },
                { step: 2, title: 'KYC Verification', description: 'Verify KYC documents', icon: '📋' },
                { step: 3, title: 'Policy Details', description: 'Complete policy application', icon: '📄' },
                { step: 4, title: 'Payment', description: 'Process premium payment', icon: '💳' },
                { step: 5, title: 'Generate Policy', description: 'Generate policy document', icon: '✅' }
              ].map(({ step, title, description, icon }) => {
                const status = getStepStatus(step)
                const isCompleted = status === 'completed'
                const isCurrent = status === 'current'
                const isUpcoming = status === 'upcoming'
                
                return (
              <div key={step} className="flex items-center">
                <div className="flex items-center">
                      <div className={`relative w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-200 ${
                        isCompleted 
                          ? 'bg-green-500 text-white shadow-lg' 
                          : isCurrent 
                            ? 'bg-blue-500 text-white shadow-lg ring-4 ring-blue-200' 
                            : 'bg-slate-200 text-slate-500'
                      }`}>
                        {isCompleted ? (
                          <CheckCircleIcon className="h-6 w-6" />
                        ) : (
                          <span>{icon}</span>
                        )}
                      </div>
                      <div className="ml-4">
                        <p className={`text-sm font-semibold ${
                          isCurrent ? 'text-blue-600' : 
                          isCompleted ? 'text-green-600' : 'text-slate-500'
                    }`}>
                      {title}
                    </p>
                        <p className="text-xs text-slate-500">{description}</p>
                  </div>
                </div>
                    {step < 5 && (
                      <div className={`ml-8 h-1 w-16 rounded-full transition-all duration-200 ${
                        isCompleted ? 'bg-green-500' : 'bg-slate-200'
                      }`} />
                    )}
              </div>
                )
              })}
          </div>
        </div>
        )}

        {/* Form Steps - Only show when currentStep > 0 */}
        {currentStep > 0 && (
          <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
            {/* Back to Search Button */}
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => { setCurrentStep(0); setSelectedCustomer(null); setShowProductSelection(false) }}
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

          {/* Step 1: Customer Information */}
          {currentStep === 1 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <UserIcon className="h-4 w-4 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {selectedCustomer ? 'Verify Customer Information' : 'Customer Information'}
                  </h2>
                </div>
                {selectedCustomer && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <CheckCircleIcon className="h-4 w-4 text-white" />
                      </div>
                      <p className="text-sm text-blue-800 font-medium">
                        Customer information has been pre-filled from existing records. Please verify and update if necessary.
                      </p>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-3">Customer Type</label>
                  <select
                    {...register('customerType')}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900"
                  >
                    <option value="INDIVIDUAL">Individual</option>
                    <option value="CORPORATE">Corporate</option>
                  </select>
                </div>

                {customerType === 'INDIVIDUAL' ? (
                  <>
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700 mb-3">First Name *</label>
                      <input
                        type="text"
                        {...register('firstName')}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900" 
                          placeholder="Enter first name"
                      />
                        {errors.firstName && <p className="text-red-500 text-sm mt-2 flex items-center">
                          <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                          {errors.firstName.message}
                        </p>}
                    </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700 mb-3">Last Name *</label>
                      <input
                        type="text"
                        {...register('lastName')}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900" 
                          placeholder="Enter last name"
                      />
                        {errors.lastName && <p className="text-red-500 text-sm mt-2 flex items-center">
                          <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                          {errors.lastName.message}
                        </p>}
                    </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700 mb-3">Date of Birth</label>
                      <input
                        type="date"
                        {...register('dateOfBirth')}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900" 
                      />
                    </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700 mb-3">Gender</label>
                      <select
                        {...register('gender')}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900"
                      >
                        <option value="">Select Gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700 mb-3">Company Name *</label>
                      <input
                        type="text"
                        {...register('companyName')}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900" 
                          placeholder="Enter company name"
                      />
                        {errors.companyName && <p className="text-red-500 text-sm mt-2 flex items-center">
                          <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                          {errors.companyName.message}
                        </p>}
                    </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700 mb-3">Registration Number</label>
                      <input
                        type="text"
                        {...register('registrationNumber')}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900" 
                          placeholder="Enter registration number"
                      />
                    </div>
                  </>
                )}

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-3">Email Address *</label>
                  <input
                    type="email"
                    {...register('email')}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900" 
                      placeholder="Enter email address"
                  />
                    {errors.email && <p className="text-red-500 text-sm mt-2 flex items-center">
                      <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                      {errors.email.message}
                    </p>}
                </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-3">Phone Number *</label>
                  <input
                    type="tel"
                    {...register('phone')}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900" 
                      placeholder="Enter phone number"
                  />
                    {errors.phone && <p className="text-red-500 text-sm mt-2 flex items-center">
                      <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                      {errors.phone.message}
                    </p>}
                </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-3">Address *</label>
                  <textarea
                    {...register('address')}
                    rows={3}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900 resize-none" 
                      placeholder="Enter complete address"
                  />
                    {errors.address && <p className="text-red-500 text-sm mt-2 flex items-center">
                      <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                      {errors.address.message}
                    </p>}
                </div>

                  {/* Product-Specific Information */}
                  {watch('policyType') && (
                    <div className="md:col-span-2">
                      <div className="border-t border-slate-200 pt-8">
                        <div className="flex items-center space-x-3 mb-6">
                          <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <DocumentIcon className="h-4 w-4 text-white" />
                          </div>
                          <h3 className="text-xl font-bold text-slate-900">{watch('policyType')} Specific Information</h3>
                        </div>

                        {watch('policyType') === 'HEALTH' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Medical History</label>
                              <textarea {...register('medicalHistory')} rows={3} placeholder="Any pre-existing medical conditions" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Family Members to Cover</label>
                              <input type="number" {...register('familyMembers', { valueAsNumber: true })} min={1} max={10} placeholder="Number of family members" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Hospital Network</label>
                              <select {...register('hospitalNetwork')} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Select Network</option>
                                <option value="Apollo">Apollo Hospitals</option>
                                <option value="Fortis">Fortis Healthcare</option>
                                <option value="Max">Max Healthcare</option>
                                <option value="Any">Any Network</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Annual Income</label>
                              <input type="number" {...register('annualIncome', { valueAsNumber: true })} placeholder="Annual income in ₹" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                          </div>
                        )}

                        {watch('policyType') === 'MOTOR' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Registration Number *</label>
                              <input type="text" {...register('vehicleRegNumber')} placeholder="e.g., MH01AB1234" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Make & Model</label>
                              <input type="text" {...register('vehicleMakeModel')} placeholder="e.g., Maruti Swift VDI" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Manufacturing Year</label>
                              <input type="number" {...register('manufacturingYear', { valueAsNumber: true })} min={1990} max={2099} placeholder="e.g., 2020" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Engine Number</label>
                              <input type="text" {...register('engineNumber')} placeholder="Engine number" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Chassis Number</label>
                              <input type="text" {...register('chassisNumber')} placeholder="Chassis number" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Previous Claims History</label>
                              <select {...register('claimsHistory')} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Select History</option>
                                <option value="none">No Claims</option>
                                <option value="1-2">1-2 Claims</option>
                                <option value="3-5">3-5 Claims</option>
                                <option value="more">More than 5 Claims</option>
                              </select>
                            </div>
                          </div>
                        )}

                        {watch('policyType') === 'LIFE' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Occupation *</label>
                              <select {...register('occupation')} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Select Occupation</option>
                                <option value="Government">Government Employee</option>
                                <option value="Private">Private Sector</option>
                                <option value="Business">Business Owner</option>
                                <option value="Professional">Professional</option>
                                <option value="Student">Student</option>
                                <option value="Retired">Retired</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Annual Income *</label>
                              <input type="number" {...register('annualIncome', { valueAsNumber: true })} placeholder="Annual income in ₹" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Sum Assured Required</label>
                              <input type="number" {...register('sumAssured', { valueAsNumber: true })} placeholder="Desired sum assured in ₹" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Policy Term (Years)</label>
                              <select {...register('policyTerm', { valueAsNumber: true })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Select Term</option>
                                <option value={10}>10 Years</option>
                                <option value={15}>15 Years</option>
                                <option value={20}>20 Years</option>
                                <option value={25}>25 Years</option>
                                <option value={30}>30 Years</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Smoking Status</label>
                              <select {...register('smokingStatus')} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Select Status</option>
                                <option value="non-smoker">Non-Smoker</option>
                                <option value="smoker">Smoker</option>
                                <option value="ex-smoker">Ex-Smoker</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Nominee Name</label>
                              <input type="text" {...register('nomineeName')} placeholder="Nominee full name" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                          </div>
                        )}

                        {watch('policyType') === 'FIRE' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Property Type *</label>
                              <select {...register('propertyType')} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Select Property Type</option>
                                <option value="residential">Residential</option>
                                <option value="commercial">Commercial</option>
                                <option value="industrial">Industrial</option>
                                <option value="warehouse">Warehouse</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Property Value *</label>
                              <input type="number" {...register('propertyValue', { valueAsNumber: true })} placeholder="Property value in ₹" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Property Address</label>
                              <textarea {...register('propertyAddress')} rows={2} placeholder="Complete property address" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Construction Type</label>
                              <select {...register('constructionType')} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Select Type</option>
                                <option value="pucca">Pucca (Concrete)</option>
                                <option value="semi-pucca">Semi-Pucca</option>
                                <option value="kutcha">Kutcha</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Fire Safety Equipment</label>
                              <select {...register('fireSafetyEquipment')} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Select Equipment</option>
                                <option value="none">No Equipment</option>
                                <option value="basic">Basic (Fire Extinguisher)</option>
                                <option value="advanced">Advanced (Sprinkler System)</option>
                                <option value="comprehensive">Comprehensive System</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Previous Claims</label>
                              <select {...register('previousClaims')} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Select History</option>
                                <option value="none">No Previous Claims</option>
                                <option value="1-2">1-2 Claims</option>
                                <option value="3-5">3-5 Claims</option>
                                <option value="more">More than 5 Claims</option>
                              </select>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-3">City *</label>
                  <input
                    type="text"
                    {...register('city')}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900" 
                      placeholder="Enter city"
                  />
                    {errors.city && <p className="text-red-500 text-sm mt-2 flex items-center">
                      <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                      {errors.city.message}
                    </p>}
                </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-3">State *</label>
                  <input
                    type="text"
                    {...register('state')}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900" 
                      placeholder="Enter state"
                  />
                    {errors.state && <p className="text-red-500 text-sm mt-2 flex items-center">
                      <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                      {errors.state.message}
                    </p>}
                </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-3">Pincode *</label>
                  <input
                    type="text"
                    {...register('pincode')}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900" 
                      placeholder="Enter pincode"
                  />
                    {errors.pincode && <p className="text-red-500 text-sm mt-2 flex items-center">
                      <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                      {errors.pincode.message}
                    </p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: KYC Verification */}
          {currentStep === 2 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <DocumentIcon className="h-4 w-4 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">KYC Verification</h2>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-6 border-2 border-slate-200 rounded-xl hover:border-slate-300 transition-all duration-200">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <UserIcon className="h-6 w-6 text-blue-600" />
                      </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900">Identity Proof Verification</h3>
                        <p className="text-sm text-slate-600">Aadhaar Card, PAN Card, or Passport</p>
                    </div>
                  </div>
                    <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={identityVerified}
                      onChange={(e) => setValue('identityVerified', e.target.checked)}
                        className="h-5 w-5 text-blue-600 focus:ring-4 focus:ring-blue-500/20 border-2 border-slate-300 rounded transition-all duration-200" 
                    />
                      <span className="text-sm font-medium text-slate-700">Verified</span>
                  </div>
                </div>

                  <div className="flex items-center justify-between p-6 border-2 border-slate-200 rounded-xl hover:border-slate-300 transition-all duration-200">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <BuildingOfficeIcon className="h-6 w-6 text-green-600" />
                      </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900">Address Proof Verification</h3>
                        <p className="text-sm text-slate-600">Utility bill, Bank statement, or Rental agreement</p>
                    </div>
                  </div>
                    <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={addressVerified}
                      onChange={(e) => setValue('addressVerified', e.target.checked)}
                        className="h-5 w-5 text-blue-600 focus:ring-4 focus:ring-blue-500/20 border-2 border-slate-300 rounded transition-all duration-200" 
                    />
                      <span className="text-sm font-medium text-slate-700">Verified</span>
                  </div>
                </div>

                  <div className="flex items-center justify-between p-6 border-2 border-slate-200 rounded-xl hover:border-slate-300 transition-all duration-200">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <DocumentIcon className="h-6 w-6 text-purple-600" />
                      </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900">Income Proof Verification</h3>
                        <p className="text-sm text-slate-600">Salary certificate, Bank statements, or ITR</p>
                    </div>
                  </div>
                    <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={incomeVerified}
                      onChange={(e) => setValue('incomeVerified', e.target.checked)}
                        className="h-5 w-5 text-blue-600 focus:ring-4 focus:ring-blue-500/20 border-2 border-slate-300 rounded transition-all duration-200" 
                    />
                      <span className="text-sm font-medium text-slate-700">Verified</span>
                  </div>
                </div>

                  <div className="flex items-center justify-between p-6 border-2 border-slate-200 rounded-xl hover:border-slate-300 transition-all duration-200">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                        <DocumentIcon className="h-6 w-6 text-orange-600" />
                      </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900">Medical Certificate</h3>
                        <p className="text-sm text-slate-600">Medical examination report if applicable</p>
                    </div>
                  </div>
                    <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={medicalVerified}
                      onChange={(e) => setValue('medicalVerified', e.target.checked)}
                        className="h-5 w-5 text-blue-600 focus:ring-4 focus:ring-blue-500/20 border-2 border-slate-300 rounded transition-all duration-200" 
                    />
                      <span className="text-sm font-medium text-slate-700">Verified</span>
                  </div>
                </div>

                  <div className="mt-8">
                  <button
                    type="button"
                    onClick={handleKYCDocuments}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                  >
                    Manage KYC Documents
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Policy Details */}
          {currentStep === 3 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-violet-600 rounded-lg flex items-center justify-center">
                    <DocumentIcon className="h-4 w-4 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Policy Details</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-3">Policy Type *</label>
                  <select
                    {...register('policyType')}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900"
                  >
                    <option value="">Select Policy Type</option>
                    <option value="LIFE">Life</option>
                    <option value="LIFE_GTLI">Life-GTLI</option>
                    <option value="LIFE_GPA">Life-GPA</option>
                    <option value="HEALTH">Health</option>
                    <option value="HEALTH_GMC">Health-GMC</option>
                    <option value="GEN_LIABILITY">Gen-Liability</option>
                    <option value="GEN_FIRE">Gen–Fire</option>
                    <option value="GEN_MOTOR">Gen–Motor</option>
                    <option value="GEN_MARINE">Gen–Marine</option>
                    <option value="GEN_MISC">Gen–Misc</option>
                    <option value="GEN_ENGG">Gen–Engg</option>
                    <option value="GEN_PROPERTY">Gen–Property</option>
                    <option value="GEN_MBD">Gen–MBD</option>
                    <option value="GEN_TRAVEL">Gen–Travel</option>
                  </select>
                    {errors.policyType && <p className="text-red-500 text-sm mt-2 flex items-center">
                      <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                      {errors.policyType.message}
                    </p>}
                </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-3">Coverage Amount (₹) *</label>
                  <input
                    type="number"
                    {...register('coverageAmount', { valueAsNumber: true })}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900" 
                      placeholder="Enter coverage amount"
                  />
                    {errors.coverageAmount && <p className="text-red-500 text-sm mt-2 flex items-center">
                      <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                      {errors.coverageAmount.message}
                    </p>}
                </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-3">Premium Amount (₹) *</label>
                  <input
                    type="number"
                    {...register('premiumAmount', { valueAsNumber: true })}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900" 
                      placeholder="Enter premium amount"
                  />
                    {errors.premiumAmount && <p className="text-red-500 text-sm mt-2 flex items-center">
                      <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                      {errors.premiumAmount.message}
                    </p>}
                </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-3">Policy Term (Years) *</label>
                  <input
                    type="number"
                    {...register('policyTerm', { valueAsNumber: true })}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900" 
                      placeholder="Enter policy term"
                  />
                    {errors.policyTerm && <p className="text-red-500 text-sm mt-2 flex items-center">
                      <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                      {errors.policyTerm.message}
                    </p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Payment */}
          {currentStep === 4 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <CreditCardIcon className="h-4 w-4 text-white" />
                    </div>
                  <h2 className="text-2xl font-bold text-slate-900">Premium Payment</h2>
                    </div>
                <div className="space-y-8">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4">Payment Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-base">
                        <span className="text-slate-700">Premium Amount:</span>
                        <span className="font-semibold text-slate-900">₹{watch('premiumAmount') || 0}</span>
                    </div>
                      <div className="flex justify-between text-base">
                        <span className="text-slate-700">GST (18%):</span>
                        <span className="font-semibold text-slate-900">₹{((watch('premiumAmount') || 0) * 0.18).toFixed(2)}</span>
                  </div>
                      <div className="flex justify-between text-lg font-bold border-t border-blue-200 pt-3">
                        <span className="text-slate-900">Total Amount:</span>
                        <span className="text-blue-900">₹{((watch('premiumAmount') || 0) * 1.18).toFixed(2)}</span>
                </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-3">Payment Method</label>
                    <select className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900">
                    <option value="CARD">Credit/Debit Card</option>
                    <option value="NETBANKING">Net Banking</option>
                    <option value="UPI">UPI</option>
                    <option value="CHEQUE">Cheque</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Success */}
          {currentStep === 5 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <CheckCircleIcon className="h-12 w-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Policy Application Submitted!</h2>
                <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
                  Your policy application has been submitted successfully. You will receive a confirmation email shortly with all the details.
                </p>
                <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-6 rounded-2xl border border-slate-200 max-w-md mx-auto">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 font-medium">Policy Number:</span>
                      <span className="text-slate-900 font-bold">POL-{Date.now().toString().slice(-6)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 font-medium">Application ID:</span>
                      <span className="text-slate-900 font-bold">APP-{Date.now().toString().slice(-8)}</span>
                    </div>
                  </div>
              </div>
            </div>
          )}

            {/* Modern Navigation Buttons */}
          {currentStep < 5 && (
              <div className="flex justify-between items-center bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                  className="flex items-center px-6 py-3 border-2 border-slate-200 rounded-xl text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold"
              >
                  <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Previous
              </button>
                <div className="text-sm text-slate-500">
                  Step {currentStep} of 5
                </div>
              <button
                type="button"
                onClick={nextStep}
                  className="flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
              >
                {currentStep === 4 ? 'Submit Application' : 'Next'}
                  {currentStep !== 4 && <ArrowLeftIcon className="h-4 w-4 ml-2 rotate-180" />}
              </button>
            </div>
          )}

          {/* Submit Button for Step 4 */}
          {currentStep === 4 && (
              <div className="flex justify-end bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <button
                type="submit"
                disabled={isSubmitting}
                  className="flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="h-5 w-5 mr-2" />
                      Submit Application
                    </>
                  )}
              </button>
            </div>
          )}
        </form>
        )}

        {/* Contextual Document Manager */}
        {showDocuments && (
          <ContextualDocumentManager processType="new-policy" customerId="CUST-001" />
        )}
      </div>
    </div>
  )
}