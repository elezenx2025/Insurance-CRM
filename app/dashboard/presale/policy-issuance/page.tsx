'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  ArrowLeftIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  CurrencyRupeeIcon,
  CheckCircleIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const policyIssuanceSchema = z.object({
  // KYC
  panCard: z.any().optional(),
  panNumber: z.string().optional(),
  
  // Vehicle Details
  chassisNumber: z.string().min(1, 'Chassis number is required'),
  engineNumber: z.string().min(1, 'Engine number is required'),
  electricalAccessories: z.string().optional(),
  electricalAccessoriesPrice: z.string().optional(), // Changed to string to allow empty
  nonElectricalAccessories: z.string().optional(),
  nonElectricalAccessoriesPrice: z.string().optional(), // Changed to string to allow empty
  
  // Discounts
  hasAntiTheftDevice: z.boolean().default(false),
  antiTheftPrice: z.number().optional(),
  hasHandicappedDiscount: z.boolean().default(false),
  hasVoluntaryDeductible: z.boolean().default(false),
  hasAAMembership: z.boolean().default(false),
  aaMembershipNo: z.string().optional(),
  hasGeoExtension: z.boolean().default(false),
  geoExtensionCountries: z.array(z.string()).optional(),
  
  // Liability Details
  compulsoryPA: z.number().default(1500000), // ₹15 Lakh
  hasTPPDExtension: z.boolean().default(false),
  hasDriverCover: z.boolean().default(false),
  hasCleanerCover: z.boolean().default(false),
  
  // Nomination Details
  nomineeName: z.string().min(1, 'Nominee name is required'),
  nomineeDOB: z.string().min(1, 'Nominee date of birth is required'),
  nomineeRelation: z.string().min(1, 'Nominee relation is required'),
  nomineeMobile: z.string().min(10, 'Valid mobile number is required'),
  nomineeEmail: z.string().email('Valid email is required')
})

type PolicyIssuanceForm = z.infer<typeof policyIssuanceSchema>

export default function PolicyIssuancePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [quotationData, setQuotationData] = useState<any>(null)
  const [panFile, setPanFile] = useState<File | null>(null)
  const [panPreview, setPanPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<PolicyIssuanceForm>({
    resolver: zodResolver(policyIssuanceSchema) as Resolver<PolicyIssuanceForm>,
    defaultValues: {
      hasAntiTheftDevice: false,
      hasHandicappedDiscount: false,
      hasVoluntaryDeductible: false,
      hasAAMembership: false,
      hasGeoExtension: false,
      hasTPPDExtension: false,
      hasDriverCover: false,
      hasCleanerCover: false,
      compulsoryPA: 1500000
    }
  })

  const hasAntiTheft = watch('hasAntiTheftDevice')
  const hasAAMembership = watch('hasAAMembership')
  const hasGeoExtension = watch('hasGeoExtension')

  useEffect(() => {
    // Load quotation data from session
    const data = sessionStorage.getItem('pendingQuotation')
    if (!data) {
      toast.error('No quotation data found')
      router.push('/dashboard/presale/quotation')
      return
    }
    setQuotationData(JSON.parse(data))
  }, [router])

  const handlePanUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'].includes(file.type)) {
      toast.error('Please upload JPG, PNG, or PDF file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB')
      return
    }

    setPanFile(file)
    
    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPanPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setPanPreview(null)
    }

    toast.success('PAN card uploaded successfully')
  }

  const validatePAN = (pan: string): boolean => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
    return panRegex.test(pan)
  }

  const handleSkipKYC = () => {
    if (!confirm('Skip KYC verification? (Development mode only)')) {
      return
    }
    toast.success('KYC skipped (Development mode)')
    setCurrentStep(2)
  }

  const handleKYCNext = () => {
    const panNumber = watch('panNumber')
    
    if (!panFile && !panNumber) {
      toast.error('Please upload PAN card or enter PAN number')
      return
    }

    if (panNumber && !validatePAN(panNumber)) {
      toast.error('Invalid PAN format. Format: ABCDE1234F')
      return
    }

    toast.success('KYC verified successfully')
    setCurrentStep(2)
  }

  const onSubmit = async (data: PolicyIssuanceForm) => {
    setIsSubmitting(true)
    try {
      // Combine quotation data with policy issuance data
      const policyData = {
        ...quotationData,
        ...data,
        status: 'PENDING_PAYMENT',
        submittedDate: new Date().toISOString()
      }

      // Save to session for payment page
      sessionStorage.setItem('pendingPolicy', JSON.stringify(policyData))
      
      toast.success('Policy details submitted! Proceeding to payment...')
      
      // Navigate to payment page
      router.push('/dashboard/presale/payment')
    } catch (error) {
      toast.error('Failed to submit policy details')
    } finally {
      setIsSubmitting(false)
    }
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
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Quotation
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Policy Issuance</h1>
          <p className="text-gray-600 mt-2">Complete the following steps to issue your policy</p>
        </div>

        {/* Quotation Summary */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-6 text-white mb-6">
          <h2 className="text-xl font-bold mb-4">Quotation Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="opacity-90">Customer</p>
              <p className="font-semibold">
                {quotationData.customerType === 'INDIVIDUAL' 
                  ? `${quotationData.firstName} ${quotationData.lastName}`
                  : quotationData.companyName}
              </p>
            </div>
            <div>
              <p className="opacity-90">Vehicle</p>
              <p className="font-semibold">{quotationData.oem} {quotationData.modelName}</p>
            </div>
            <div>
              <p className="opacity-90">Insurance Company</p>
              <p className="font-semibold">{quotationData.selectedInsuranceCompany}</p>
            </div>
            <div>
              <p className="opacity-90">Premium</p>
              <p className="font-semibold text-yellow-300">₹{quotationData.quotedPremium?.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                {currentStep > 1 ? '✓' : '1'}
              </div>
              <span className="ml-2 font-medium">KYC</span>
            </div>
            <div className="w-16 h-1 bg-gray-300"></div>
            <div className={`flex items-center ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="ml-2 font-medium">Policy Details</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Step 1: KYC */}
          {currentStep === 1 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Step 1: KYC Verification</h2>
              
              <div className="space-y-6">
                {/* PAN Card Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload PAN Card *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                    <input
                      type="file"
                      id="pan-upload"
                      accept="image/*,.pdf"
                      onChange={handlePanUpload}
                      className="hidden"
                    />
                    <label htmlFor="pan-upload" className="cursor-pointer">
                      {panPreview ? (
                        <div>
                          <img src={panPreview} alt="PAN Card" className="max-h-48 mx-auto rounded-lg mb-3" />
                          <p className="text-sm text-green-600 font-medium">✓ PAN Card uploaded</p>
                        </div>
                      ) : panFile ? (
                        <div>
                          <DocumentTextIcon className="h-16 w-16 text-blue-600 mx-auto mb-3" />
                          <p className="text-sm text-green-600 font-medium">✓ {panFile.name}</p>
                        </div>
                      ) : (
                        <div>
                          <CloudArrowUpIcon className="h-16 w-16 text-gray-400 mx-auto mb-3" />
                          <p className="text-sm text-gray-600 font-medium">Click to upload PAN Card</p>
                          <p className="text-xs text-gray-500 mt-1">JPG, PNG, or PDF (Max 5MB)</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* PAN Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PAN Number *
                  </label>
                  <input
                    type="text"
                    {...register('panNumber')}
                    maxLength={10}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                    placeholder="ABCDE1234F"
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase()
                      setValue('panNumber', value)
                      
                      if (value.length === 10) {
                        if (validatePAN(value)) {
                          toast.success('Valid PAN format')
                        } else {
                          toast.error('Invalid PAN format')
                        }
                      }
                    }}
                  />
                  {errors.panNumber && <p className="text-red-500 text-xs mt-1">{errors.panNumber.message}</p>}
                  <p className="text-xs text-gray-500 mt-1">Format: 5 letters, 4 digits, 1 letter (e.g., ABCDE1234F)</p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4">
                  <button
                    type="button"
                    onClick={handleSkipKYC}
                    className="px-4 py-2 text-sm font-medium text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-md hover:bg-yellow-100"
                  >
                    ⚠️ Skip KYC (Dev Mode)
                  </button>
                  <button
                    type="button"
                    onClick={handleKYCNext}
                    className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Verify & Continue
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Policy Details */}
          {currentStep === 2 && quotationData.customerType === 'INDIVIDUAL' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Step 2: Policy Details</h2>
              
              <div className="space-y-8">
                {/* Other Vehicle Details Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">
                    Other Vehicle Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Chassis Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Chassis Number *
                      </label>
                      <input
                        type="text"
                        {...register('chassisNumber')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                        placeholder="e.g., MA3ERLF1S00123456"
                      />
                      {errors.chassisNumber && <p className="text-red-500 text-xs mt-1">{errors.chassisNumber.message}</p>}
                    </div>

                    {/* Engine Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Engine Number *
                      </label>
                      <input
                        type="text"
                        {...register('engineNumber')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                        placeholder="e.g., K10BXXXXXXX"
                      />
                      {errors.engineNumber && <p className="text-red-500 text-xs mt-1">{errors.engineNumber.message}</p>}
                    </div>

                    {/* Electrical Accessories */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Electrical Accessories
                      </label>
                      <input
                        type="text"
                        {...register('electricalAccessories')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Music System, GPS"
                      />
                    </div>

                    {/* Electrical Accessories Price */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Electrical Accessories Price (Optional)
                      </label>
                      <input
                        type="text"
                        {...register('electricalAccessoriesPrice')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="₹ 0"
                      />
                    </div>

                    {/* Non-Electrical Accessories */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Non-Electrical Accessories
                      </label>
                      <input
                        type="text"
                        {...register('nonElectricalAccessories')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Seat Covers, Floor Mats"
                      />
                    </div>

                    {/* Non-Electrical Accessories Price */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Non-Electrical Accessories Price (Optional)
                      </label>
                      <input
                        type="text"
                        {...register('nonElectricalAccessoriesPrice')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="₹ 0"
                      />
                    </div>
                  </div>
                </div>

                {/* Discounts Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-green-600">
                    Discounts
                  </h3>
                  <div className="space-y-4">
                    {/* Anti-theft Device */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <label className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          {...register('hasAntiTheftDevice')}
                          className="mt-1 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <span className="font-medium text-gray-900">Anti-theft Device</span>
                          <p className="text-xs text-gray-500 mt-1">Get discount for ARAI approved anti-theft device</p>
                        </div>
                      </label>
                      {hasAntiTheft && (
                        <div className="mt-3 ml-8">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Anti-Theft Device Price *
                          </label>
                          <input
                            type="number"
                            {...register('antiTheftPrice', { valueAsNumber: true })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="₹ 0"
                          />
                        </div>
                      )}
                    </div>

                    {/* Handicapped Discount */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <label className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          {...register('hasHandicappedDiscount')}
                          className="mt-1 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <span className="font-medium text-gray-900">Handicapped Discount</span>
                          <p className="text-xs text-gray-500 mt-1">Special discount for differently-abled persons</p>
                        </div>
                      </label>
                    </div>

                    {/* Voluntary Deductible */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <label className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          {...register('hasVoluntaryDeductible')}
                          className="mt-1 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <span className="font-medium text-gray-900">Voluntary Deductible</span>
                          <p className="text-xs text-gray-500 mt-1">Opt for voluntary deductible to reduce premium</p>
                        </div>
                      </label>
                    </div>

                    {/* AA Membership */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <label className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          {...register('hasAAMembership')}
                          className="mt-1 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <span className="font-medium text-gray-900">AA Membership</span>
                          <p className="text-xs text-gray-500 mt-1">Automobile Association membership discount</p>
                        </div>
                      </label>
                      {hasAAMembership && (
                        <div className="mt-3 ml-8">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            AA Membership Number *
                          </label>
                          <input
                            type="text"
                            {...register('aaMembershipNo')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter AA membership number"
                          />
                        </div>
                      )}
                    </div>

                    {/* Geographical Extension */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <label className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          {...register('hasGeoExtension')}
                          className="mt-1 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <span className="font-medium text-gray-900">Geographical Extension</span>
                          <p className="text-xs text-gray-500 mt-1">Extend coverage to neighboring countries</p>
                        </div>
                      </label>
                      {hasGeoExtension && (
                        <div className="mt-3 ml-8">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Countries (Multiple) *
                          </label>
                          <select
                            multiple
                            size={5}
                            {...register('geoExtensionCountries')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="Nepal">Nepal</option>
                            <option value="Bhutan">Bhutan</option>
                            <option value="Bangladesh">Bangladesh</option>
                            <option value="Pakistan">Pakistan</option>
                            <option value="Sri Lanka">Sri Lanka</option>
                            <option value="Maldives">Maldives</option>
                          </select>
                          <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple countries</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Liability Details Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-purple-600">
                    Liability Details
                  </h3>
                  <div className="space-y-4">
                    {/* Compulsory PA */}
                    <div className="border border-gray-200 rounded-lg p-4 bg-blue-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium text-gray-900">Compulsory Personal Accident Cover</span>
                          <p className="text-xs text-gray-600 mt-1">Mandatory cover for owner-driver</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-blue-600">₹15,00,000</p>
                          <p className="text-xs text-gray-500">Included</p>
                        </div>
                      </div>
                    </div>

                    {/* TPPD Extension */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <label className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          {...register('hasTPPDExtension')}
                          className="mt-1 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <span className="font-medium text-gray-900">TPPD Extension</span>
                          <p className="text-xs text-gray-500 mt-1">Third Party Property Damage extension coverage</p>
                        </div>
                      </label>
                    </div>

                    {/* Driver Cover */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <label className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          {...register('hasDriverCover')}
                          className="mt-1 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <span className="font-medium text-gray-900">Driver Cover</span>
                          <p className="text-xs text-gray-500 mt-1">Personal accident cover for paid driver</p>
                        </div>
                      </label>
                    </div>

                    {/* Cleaner Cover */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <label className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          {...register('hasCleanerCover')}
                          className="mt-1 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <span className="font-medium text-gray-900">Cleaner Cover</span>
                          <p className="text-xs text-gray-500 mt-1">Personal accident cover for cleaner</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Nomination Details Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-orange-600">
                    Nomination Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nominee Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nominee Name *
                      </label>
                      <input
                        type="text"
                        {...register('nomineeName')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter nominee full name"
                      />
                      {errors.nomineeName && <p className="text-red-500 text-xs mt-1">{errors.nomineeName.message}</p>}
                    </div>

                    {/* Nominee Date of Birth */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nominee Date of Birth *
                      </label>
                      <input
                        type="date"
                        {...register('nomineeDOB')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        max={new Date().toISOString().split('T')[0]}
                      />
                      {errors.nomineeDOB && <p className="text-red-500 text-xs mt-1">{errors.nomineeDOB.message}</p>}
                    </div>

                    {/* Nominee Relation */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nominee Relation *
                      </label>
                      <select
                        {...register('nomineeRelation')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Relation</option>
                        <option value="Spouse">Spouse</option>
                        <option value="Father">Father</option>
                        <option value="Mother">Mother</option>
                        <option value="Son">Son</option>
                        <option value="Daughter">Daughter</option>
                        <option value="Brother">Brother</option>
                        <option value="Sister">Sister</option>
                        <option value="Father-in-law">Father-in-law</option>
                        <option value="Mother-in-law">Mother-in-law</option>
                        <option value="Son-in-law">Son-in-law</option>
                        <option value="Daughter-in-law">Daughter-in-law</option>
                        <option value="Grandfather">Grandfather</option>
                        <option value="Grandmother">Grandmother</option>
                        <option value="Grandson">Grandson</option>
                        <option value="Granddaughter">Granddaughter</option>
                        <option value="Uncle">Uncle</option>
                        <option value="Aunt">Aunt</option>
                        <option value="Nephew">Nephew</option>
                        <option value="Niece">Niece</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.nomineeRelation && <p className="text-red-500 text-xs mt-1">{errors.nomineeRelation.message}</p>}
                    </div>

                    {/* Nominee Mobile Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nominee Mobile Number *
                      </label>
                      <input
                        type="tel"
                        {...register('nomineeMobile')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter 10-digit mobile number"
                        maxLength={10}
                      />
                      {errors.nomineeMobile && <p className="text-red-500 text-xs mt-1">{errors.nomineeMobile.message}</p>}
                    </div>

                    {/* Nominee Email */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nominee Email *
                      </label>
                      <input
                        type="email"
                        {...register('nomineeEmail')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter nominee email address"
                      />
                      {errors.nomineeEmail && <p className="text-red-500 text-xs mt-1">{errors.nomineeEmail.message}</p>}
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Policy Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Base Premium</span>
                      <span className="font-semibold">₹{quotationData.quotedPremium?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">IDV</span>
                      <span className="font-semibold">₹{quotationData.idv?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t-2 border-gray-300">
                      <span className="font-bold text-gray-900">Total Premium</span>
                      <span className="font-bold text-blue-600 text-lg">₹{quotationData.quotedPremium?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-400"
                  >
                    {isSubmitting ? 'Issuing Policy...' : 'Issue Policy'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

