'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ShieldCheckIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const policyConfigSchema = z.object({
  productName: z.string().min(1, 'Product name is required'),
  productCategory: z.string().min(1, 'Product category is required'),
  insuranceType: z.string().min(1, 'Insurance type is required'),
  minAge: z.number().min(0, 'Minimum age must be positive'),
  maxAge: z.number().min(0, 'Maximum age must be positive'),
  minSumAssured: z.number().min(0, 'Minimum sum assured must be positive'),
  maxSumAssured: z.number().min(0, 'Maximum sum assured must be positive'),
  policyTerm: z.number().min(1, 'Policy term must be at least 1 year'),
  premiumPaymentMode: z.array(z.string()).min(1, 'At least one payment mode is required'),
  features: z.array(z.string()).optional(),
  exclusions: z.array(z.string()).optional(),
  isActive: z.boolean(),
})

type PolicyConfigForm = z.infer<typeof policyConfigSchema>

interface PolicyConfig {
  id: string
  productName: string
  productCategory: string
  insuranceType: string
  minAge: number
  maxAge: number
  minSumAssured: number
  maxSumAssured: number
  policyTerm: number
  premiumPaymentMode: string[]
  features: string[]
  exclusions: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

const PRODUCT_CATEGORIES = [
  'Motor Insurance',
  'Health Insurance',
  'Life Insurance',
  'Home Insurance',
  'Travel Insurance',
  'Business Insurance',
  'Marine Insurance',
  'Crop Insurance',
  'Cyber Insurance',
  'Pet Insurance',
]

const INSURANCE_TYPES = [
  'Individual',
  'Group',
  'Family Floater',
  'Corporate',
  'SME',
  'Retail',
]

const PAYMENT_MODES = [
  'Monthly',
  'Quarterly',
  'Half Yearly',
  'Yearly',
  'Single Premium',
  'Limited Pay',
]

const COMMON_FEATURES = [
  'Cashless Treatment',
  'Pre-existing Disease Cover',
  'Maternity Cover',
  'Accidental Death Benefit',
  'Critical Illness Cover',
  'Income Replacement',
  'Waiver of Premium',
  'Guaranteed Returns',
  'Flexible Premium Payment',
  'Rider Benefits',
]

const COMMON_EXCLUSIONS = [
  'Pre-existing Diseases',
  'Suicide within 1 year',
  'War and Terrorism',
  'Nuclear Hazards',
  'Drug Abuse',
  'Self-inflicted Injuries',
  'Adventure Sports',
  'Pregnancy Complications',
  'Mental Health Conditions',
  'Cosmetic Surgery',
]

export default function PolicyConfigurator() {
  const [configs, setConfigs] = useState<PolicyConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingConfig, setEditingConfig] = useState<PolicyConfig | null>(null)
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [selectedExclusions, setSelectedExclusions] = useState<string[]>([])
  const [selectedPaymentModes, setSelectedPaymentModes] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PolicyConfigForm>({
    resolver: zodResolver(policyConfigSchema),
    defaultValues: {
      premiumPaymentMode: [],
      features: [],
      exclusions: [],
      isActive: true,
    },
  })

  useEffect(() => {
    fetchPolicyConfigs()
  }, [])

  const fetchPolicyConfigs = async () => {
    try {
      setLoading(true)
      // Mock data - replace with actual API call
      const mockConfigs: PolicyConfig[] = [
        {
          id: '1',
          productName: 'Comprehensive Motor Insurance',
          productCategory: 'Motor Insurance',
          insuranceType: 'Individual',
          minAge: 18,
          maxAge: 70,
          minSumAssured: 100000,
          maxSumAssured: 10000000,
          policyTerm: 1,
          premiumPaymentMode: ['Yearly'],
          features: ['Cashless Treatment', 'Accidental Death Benefit', 'Rider Benefits'],
          exclusions: ['War and Terrorism', 'Nuclear Hazards', 'Drug Abuse'],
          isActive: true,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
        {
          id: '2',
          productName: 'Family Health Insurance',
          productCategory: 'Health Insurance',
          insuranceType: 'Family Floater',
          minAge: 0,
          maxAge: 80,
          minSumAssured: 200000,
          maxSumAssured: 5000000,
          policyTerm: 1,
          premiumPaymentMode: ['Monthly', 'Yearly'],
          features: ['Cashless Treatment', 'Pre-existing Disease Cover', 'Maternity Cover'],
          exclusions: ['Pre-existing Diseases', 'Cosmetic Surgery', 'Mental Health Conditions'],
          isActive: true,
          createdAt: '2024-01-20T14:15:00Z',
          updatedAt: '2024-01-20T14:15:00Z',
        },
        {
          id: '3',
          productName: 'Term Life Insurance',
          productCategory: 'Life Insurance',
          insuranceType: 'Individual',
          minAge: 18,
          maxAge: 65,
          minSumAssured: 500000,
          maxSumAssured: 50000000,
          policyTerm: 20,
          premiumPaymentMode: ['Monthly', 'Quarterly', 'Yearly'],
          features: ['Accidental Death Benefit', 'Critical Illness Cover', 'Income Replacement'],
          exclusions: ['Suicide within 1 year', 'War and Terrorism', 'Drug Abuse'],
          isActive: true,
          createdAt: '2024-02-01T09:45:00Z',
          updatedAt: '2024-02-01T09:45:00Z',
        },
      ]

      setConfigs(mockConfigs)
    } catch (error) {
      console.error('Error fetching policy configs:', error)
      toast.error('Failed to fetch policy configurations')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: PolicyConfigForm) => {
    try {
      const formData = {
        ...data,
        features: selectedFeatures,
        exclusions: selectedExclusions,
        premiumPaymentMode: selectedPaymentModes,
      }

      if (editingConfig) {
        // Update existing config
        const updatedConfig = { ...editingConfig, ...formData, updatedAt: new Date().toISOString() }
        setConfigs(configs.map((c) => (c.id === updatedConfig.id ? updatedConfig : c)))
        toast.success('Policy configuration updated successfully!')
      } else {
        // Create new config
        const newConfig: PolicyConfig = {
          id: String(configs.length + 1),
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        setConfigs([...configs, newConfig])
        toast.success('Policy configuration created successfully!')
      }

      setShowModal(false)
      reset()
      setEditingConfig(null)
      setSelectedFeatures([])
      setSelectedExclusions([])
      setSelectedPaymentModes([])
    } catch (error) {
      console.error('Error saving policy config:', error)
      toast.error('Failed to save policy configuration')
    }
  }

  const openAddModal = () => {
    setEditingConfig(null)
    reset({
      productName: '',
      productCategory: '',
      insuranceType: '',
      minAge: 0,
      maxAge: 0,
      minSumAssured: 0,
      maxSumAssured: 0,
      policyTerm: 1,
      premiumPaymentMode: [],
      features: [],
      exclusions: [],
      isActive: true,
    })
    setSelectedFeatures([])
    setSelectedExclusions([])
    setSelectedPaymentModes([])
    setShowModal(true)
  }

  const openEditModal = (config: PolicyConfig) => {
    setEditingConfig(config)
    reset(config)
    setSelectedFeatures(config.features)
    setSelectedExclusions(config.exclusions)
    setSelectedPaymentModes(config.premiumPaymentMode)
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this policy configuration?')) {
      try {
        setConfigs(configs.filter((c) => c.id !== id))
        toast.success('Policy configuration deleted successfully')
      } catch (error) {
        console.error('Error deleting config:', error)
        toast.error('Failed to delete policy configuration')
      }
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const toggleFeature = (feature: string) => {
    setSelectedFeatures(prev =>
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    )
  }

  const toggleExclusion = (exclusion: string) => {
    setSelectedExclusions(prev =>
      prev.includes(exclusion)
        ? prev.filter(e => e !== exclusion)
        : [...prev, exclusion]
    )
  }

  const togglePaymentMode = (mode: string) => {
    setSelectedPaymentModes(prev =>
      prev.includes(mode)
        ? prev.filter(m => m !== mode)
        : [...prev, mode]
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Policy Configurator</h1>
          <p className="mt-1 text-sm text-gray-600">
            Configure insurance product parameters and policy rules.
          </p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary btn-md">
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Policy Config
        </button>
      </div>

      {/* Policy Configurations Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-head">Product Name</th>
                <th className="table-head">Category</th>
                <th className="table-head">Type</th>
                <th className="table-head">Age Range</th>
                <th className="table-head">Sum Assured</th>
                <th className="table-head">Term</th>
                <th className="table-head">Status</th>
                <th className="table-head">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {configs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="table-cell text-center py-8 text-gray-500">
                    No policy configurations found
                  </td>
                </tr>
              ) : (
                configs.map((config) => (
                  <tr key={config.id} className="table-row">
                    <td className="table-cell font-medium">{config.productName}</td>
                    <td className="table-cell">{config.productCategory}</td>
                    <td className="table-cell">{config.insuranceType}</td>
                    <td className="table-cell">{config.minAge} - {config.maxAge} years</td>
                    <td className="table-cell">
                      {formatCurrency(config.minSumAssured)} - {formatCurrency(config.maxSumAssured)}
                    </td>
                    <td className="table-cell">{config.policyTerm} year(s)</td>
                    <td className="table-cell">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        config.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {config.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditModal(config)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => toast('View details coming soon')}
                          className="text-green-600 hover:text-green-900"
                          title="View"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(config.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Policy Config Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingConfig ? 'Edit Policy Configuration' : 'Add Policy Configuration'}
              </h3>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      {...register('productName')}
                      className="input"
                      placeholder="Enter product name"
                    />
                    {errors.productName && (
                      <p className="text-red-600 text-xs mt-1">{errors.productName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Category *
                    </label>
                    <select
                      {...register('productCategory')}
                      className="input"
                    >
                      <option value="">Select Category</option>
                      {PRODUCT_CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    {errors.productCategory && (
                      <p className="text-red-600 text-xs mt-1">{errors.productCategory.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Insurance Type *
                    </label>
                    <select
                      {...register('insuranceType')}
                      className="input"
                    >
                      <option value="">Select Type</option>
                      {INSURANCE_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    {errors.insuranceType && (
                      <p className="text-red-600 text-xs mt-1">{errors.insuranceType.message}</p>
                    )}
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        {...register('isActive')}
                        className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                      />
                      <span className="ml-2 text-sm text-gray-700">Active</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Age *
                    </label>
                    <input
                      type="number"
                      {...register('minAge', { valueAsNumber: true })}
                      className="input"
                      placeholder="18"
                    />
                    {errors.minAge && (
                      <p className="text-red-600 text-xs mt-1">{errors.minAge.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Maximum Age *
                    </label>
                    <input
                      type="number"
                      {...register('maxAge', { valueAsNumber: true })}
                      className="input"
                      placeholder="70"
                    />
                    {errors.maxAge && (
                      <p className="text-red-600 text-xs mt-1">{errors.maxAge.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Sum Assured (₹) *
                    </label>
                    <input
                      type="number"
                      {...register('minSumAssured', { valueAsNumber: true })}
                      className="input"
                      placeholder="100000"
                    />
                    {errors.minSumAssured && (
                      <p className="text-red-600 text-xs mt-1">{errors.minSumAssured.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Maximum Sum Assured (₹) *
                    </label>
                    <input
                      type="number"
                      {...register('maxSumAssured', { valueAsNumber: true })}
                      className="input"
                      placeholder="10000000"
                    />
                    {errors.maxSumAssured && (
                      <p className="text-red-600 text-xs mt-1">{errors.maxSumAssured.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Policy Term (Years) *
                    </label>
                    <input
                      type="number"
                      {...register('policyTerm', { valueAsNumber: true })}
                      className="input"
                      placeholder="1"
                    />
                    {errors.policyTerm && (
                      <p className="text-red-600 text-xs mt-1">{errors.policyTerm.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Premium Payment Modes *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {PAYMENT_MODES.map((mode) => (
                      <label key={mode} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedPaymentModes.includes(mode)}
                          onChange={() => togglePaymentMode(mode)}
                          className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-700">{mode}</span>
                      </label>
                    ))}
                  </div>
                  {errors.premiumPaymentMode && (
                    <p className="text-red-600 text-xs mt-1">{errors.premiumPaymentMode.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Features
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {COMMON_FEATURES.map((feature) => (
                      <label key={feature} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedFeatures.includes(feature)}
                          onChange={() => toggleFeature(feature)}
                          className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-700">{feature}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Exclusions
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {COMMON_EXCLUSIONS.map((exclusion) => (
                      <label key={exclusion} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedExclusions.includes(exclusion)}
                          onChange={() => toggleExclusion(exclusion)}
                          className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-700">{exclusion}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      setEditingConfig(null)
                      reset()
                    }}
                    className="btn btn-secondary btn-md"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-md">
                    {editingConfig ? 'Update Configuration' : 'Create Configuration'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


















