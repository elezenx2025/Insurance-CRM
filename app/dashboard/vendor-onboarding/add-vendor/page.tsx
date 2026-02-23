'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeftIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

// Import Indian states and cities
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Chandigarh', 'Puducherry'
]

const CITIES_BY_STATE: { [key: string]: string[] } = {
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur'],
  'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'],
  'Delhi': ['New Delhi', 'Central Delhi', 'South Delhi', 'North Delhi'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Khammam'],
  'West Bengal': ['Kolkata', 'Asansol', 'Siliguri', 'Durgapur'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Meerut', 'Varanasi'],
  'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam'],
}

const vendorSchema = z.object({
  vendorName: z.string().min(1, 'Vendor name is required'),
  address: z.string().min(1, 'Address is required'),
  state: z.string().min(1, 'State is required'),
  city: z.string().min(1, 'City is required'),
  pincode: z.string()
    .min(6, 'Pincode must be 6 digits')
    .max(6, 'Pincode must be 6 digits')
    .regex(/^[0-9]+$/, 'Pincode should contain only digits'),
  contactPersonName: z.string().min(1, 'Contact person name is required'),
  email: z.string().email('Invalid email address'),
  mobileNo: z.string()
    .min(10, 'Mobile number must be 10 digits')
    .max(10, 'Mobile number must be 10 digits')
    .regex(/^[0-9]+$/, 'Mobile number should contain only digits'),
  phoneNo: z.string().optional(),
  companyUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  companyPan: z.string()
    .length(10, 'PAN must be 10 characters')
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format'),
  companyRegistrationNo: z.string().min(1, 'Registration number is required'),
  companyGst: z.string()
    .length(15, 'GST must be 15 characters')
    .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GST format'),
  contractPeriodFrom: z.string().min(1, 'Contract start date is required'),
  contractPeriodTo: z.string().min(1, 'Contract end date is required'),
  contractFor: z.string().min(1, 'Contract type is required'),
})

type VendorForm = z.infer<typeof vendorSchema>

export default function AddVendorPage() {
  const router = useRouter()
  const [selectedState, setSelectedState] = useState('')
  const [agreementFiles, setAgreementFiles] = useState<File[]>([])
  const [apiKitFiles, setApiKitFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<VendorForm>({
    resolver: zodResolver(vendorSchema),
  })

  const handleBack = () => {
    router.push('/dashboard/vendor-onboarding')
  }

  const handleAgreementUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAgreementFiles(Array.from(e.target.files))
    }
  }

  const handleApiKitUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setApiKitFiles(Array.from(e.target.files))
    }
  }

  const onSubmit = async (data: VendorForm) => {
    try {
      setIsSubmitting(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      console.log('Vendor Data:', data)
      console.log('Agreement Files:', agreementFiles)
      console.log('API Kit Files:', apiKitFiles)
      
      toast.success('Vendor onboarded successfully!')
      router.push('/dashboard/vendor-onboarding/vendor-list')
    } catch (error) {
      toast.error('Failed to onboard vendor')
    } finally {
      setIsSubmitting(false)
    }
  }

  const availableCities = selectedState ? CITIES_BY_STATE[selectedState] || [] : []

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Vendor Onboarding
          </button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add New Vendor</h1>
          <p className="text-gray-600 mt-2">
            Complete vendor onboarding with API kit and contract details
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Company Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b-2 border-blue-500">
              Company Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Vendor Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vendor Name *
                </label>
                <input
                  type="text"
                  {...register('vendorName')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter vendor company name"
                />
                {errors.vendorName && (
                  <p className="text-red-600 text-xs mt-1">{errors.vendorName.message}</p>
                )}
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <textarea
                  {...register('address')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter complete address"
                />
                {errors.address && (
                  <p className="text-red-600 text-xs mt-1">{errors.address.message}</p>
                )}
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <select
                  {...register('state')}
                  onChange={(e) => {
                    setSelectedState(e.target.value)
                    setValue('city', '')
                    register('state').onChange(e)
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select State</option>
                  {INDIAN_STATES.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                {errors.state && (
                  <p className="text-red-600 text-xs mt-1">{errors.state.message}</p>
                )}
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <select
                  {...register('city')}
                  disabled={!selectedState}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                >
                  <option value="">Select City</option>
                  {availableCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                {errors.city && (
                  <p className="text-red-600 text-xs mt-1">{errors.city.message}</p>
                )}
              </div>

              {/* Pincode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pincode *
                </label>
                <input
                  type="text"
                  {...register('pincode')}
                  maxLength={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter 6-digit pincode"
                />
                {errors.pincode && (
                  <p className="text-red-600 text-xs mt-1">{errors.pincode.message}</p>
                )}
              </div>

              {/* Company URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company URL
                </label>
                <input
                  type="url"
                  {...register('companyUrl')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://www.company.com"
                />
                {errors.companyUrl && (
                  <p className="text-red-600 text-xs mt-1">{errors.companyUrl.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b-2 border-green-500">
              Contact Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Person Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Person Name *
                </label>
                <input
                  type="text"
                  {...register('contactPersonName')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter contact person name"
                />
                {errors.contactPersonName && (
                  <p className="text-red-600 text-xs mt-1">{errors.contactPersonName.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  {...register('email')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="contact@company.com"
                />
                {errors.email && (
                  <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Mobile No */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile No *
                </label>
                <input
                  type="tel"
                  {...register('mobileNo')}
                  maxLength={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="10-digit mobile number"
                />
                {errors.mobileNo && (
                  <p className="text-red-600 text-xs mt-1">{errors.mobileNo.message}</p>
                )}
              </div>

              {/* Phone No */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone No
                </label>
                <input
                  type="tel"
                  {...register('phoneNo')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Landline number (optional)"
                />
                {errors.phoneNo && (
                  <p className="text-red-600 text-xs mt-1">{errors.phoneNo.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Legal & Compliance */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b-2 border-purple-500">
              Legal & Compliance Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Company PAN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company PAN *
                </label>
                <input
                  type="text"
                  {...register('companyPan')}
                  maxLength={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                  placeholder="ABCDE1234F"
                />
                {errors.companyPan && (
                  <p className="text-red-600 text-xs mt-1">{errors.companyPan.message}</p>
                )}
              </div>

              {/* Company Registration No */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Registration No *
                </label>
                <input
                  type="text"
                  {...register('companyRegistrationNo')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter registration number"
                />
                {errors.companyRegistrationNo && (
                  <p className="text-red-600 text-xs mt-1">{errors.companyRegistrationNo.message}</p>
                )}
              </div>

              {/* Company GST */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company GST *
                </label>
                <input
                  type="text"
                  {...register('companyGst')}
                  maxLength={15}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                  placeholder="29ABCDE1234F1Z5"
                />
                {errors.companyGst && (
                  <p className="text-red-600 text-xs mt-1">{errors.companyGst.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contract Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b-2 border-orange-500">
              Contract Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contract Period From */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contract Period From *
                </label>
                <input
                  type="date"
                  {...register('contractPeriodFrom')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.contractPeriodFrom && (
                  <p className="text-red-600 text-xs mt-1">{errors.contractPeriodFrom.message}</p>
                )}
              </div>

              {/* Contract Period To */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contract Period To *
                </label>
                <input
                  type="date"
                  {...register('contractPeriodTo')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.contractPeriodTo && (
                  <p className="text-red-600 text-xs mt-1">{errors.contractPeriodTo.message}</p>
                )}
              </div>

              {/* Contract For */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contract For *
                </label>
                <select
                  {...register('contractFor')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Service Type</option>
                  <option value="Calling Solution">Calling Solution</option>
                  <option value="SMS">SMS</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Bulk Email">Bulk Email</option>
                  <option value="Networking">Networking</option>
                  <option value="Cyber Security">Cyber Security</option>
                  <option value="Audit">Audit</option>
                </select>
                {errors.contractFor && (
                  <p className="text-red-600 text-xs mt-1">{errors.contractFor.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Document Uploads */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b-2 border-teal-500">
              Document Uploads
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Agreement Copy Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Agreement Copy & Related Documents
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-400 transition-colors">
                  <div className="space-y-1 text-center">
                    <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                        <span>Upload files</span>
                        <input
                          type="file"
                          multiple
                          accept=".pdf,.doc,.docx"
                          onChange={handleAgreementUpload}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PDF, DOC up to 10MB each</p>
                  </div>
                </div>
                {agreementFiles.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700">Selected files:</p>
                    <ul className="text-sm text-gray-600">
                      {agreementFiles.map((file, index) => (
                        <li key={index}>• {file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* API Kit Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Webhook or API Kit
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-400 transition-colors">
                  <div className="space-y-1 text-center">
                    <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                        <span>Upload files</span>
                        <input
                          type="file"
                          multiple
                          accept=".json,.xml,.zip,.pdf"
                          onChange={handleApiKitUpload}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">JSON, XML, ZIP, PDF up to 10MB</p>
                  </div>
                </div>
                {apiKitFiles.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700">Selected files:</p>
                    <ul className="text-sm text-gray-600">
                      {apiKitFiles.map((file, index) => (
                        <li key={index}>• {file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Onboard Vendor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}




