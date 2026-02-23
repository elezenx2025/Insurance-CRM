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
  MagnifyingGlassIcon,
  FunnelIcon,
  GlobeAltIcon,
  FlagIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const countrySchema = z.object({
  name: z.string().min(1, 'Country name is required'),
  code: z.string().min(2, 'Country code is required').max(3, 'Country code must be 2-3 characters'),
  phoneCode: z.string().min(1, 'Phone code is required'),
  currency: z.string().min(1, 'Currency is required'),
  currencySymbol: z.string().min(1, 'Currency symbol is required'),
  flag: z.string().optional(),
  isActive: z.boolean().default(true),
})

type CountryForm = z.infer<typeof countrySchema>

interface Country {
  id: string
  name: string
  code: string
  phoneCode: string
  currency: string
  currencySymbol: string
  flag?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

const CURRENCIES = [
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM' },
]

export default function CountryMaster() {
  const [countries, setCountries] = useState<Country[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCountry, setEditingCountry] = useState<Country | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('ALL')

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(countrySchema),
    defaultValues: {
      isActive: true,
    },
  })

  useEffect(() => {
    fetchCountries()
  }, [])

  const fetchCountries = async () => {
    try {
      setLoading(true)
      // Mock data - replace with actual API call
      const mockCountries: Country[] = [
        {
          id: '1',
          name: 'India',
          code: 'IN',
          phoneCode: '+91',
          currency: 'INR',
          currencySymbol: '₹',
          flag: '🇮🇳',
          isActive: true,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
        {
          id: '2',
          name: 'United States',
          code: 'US',
          phoneCode: '+1',
          currency: 'USD',
          currencySymbol: '$',
          flag: '🇺🇸',
          isActive: true,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
        {
          id: '3',
          name: 'United Kingdom',
          code: 'GB',
          phoneCode: '+44',
          currency: 'GBP',
          currencySymbol: '£',
          flag: '🇬🇧',
          isActive: true,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
        {
          id: '4',
          name: 'Canada',
          code: 'CA',
          phoneCode: '+1',
          currency: 'CAD',
          currencySymbol: 'C$',
          flag: '🇨🇦',
          isActive: true,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
        {
          id: '5',
          name: 'Australia',
          code: 'AU',
          phoneCode: '+61',
          currency: 'AUD',
          currencySymbol: 'A$',
          flag: '🇦🇺',
          isActive: true,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
        {
          id: '6',
          name: 'Germany',
          code: 'DE',
          phoneCode: '+49',
          currency: 'EUR',
          currencySymbol: '€',
          flag: '🇩🇪',
          isActive: true,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
        {
          id: '7',
          name: 'France',
          code: 'FR',
          phoneCode: '+33',
          currency: 'EUR',
          currencySymbol: '€',
          flag: '🇫🇷',
          isActive: true,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
        {
          id: '8',
          name: 'Japan',
          code: 'JP',
          phoneCode: '+81',
          currency: 'JPY',
          currencySymbol: '¥',
          flag: '🇯🇵',
          isActive: true,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
        {
          id: '9',
          name: 'China',
          code: 'CN',
          phoneCode: '+86',
          currency: 'CNY',
          currencySymbol: '¥',
          flag: '🇨🇳',
          isActive: true,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
        {
          id: '10',
          name: 'UAE',
          code: 'AE',
          phoneCode: '+971',
          currency: 'AED',
          currencySymbol: 'د.إ',
          flag: '🇦🇪',
          isActive: true,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
        {
          id: '11',
          name: 'Saudi Arabia',
          code: 'SA',
          phoneCode: '+966',
          currency: 'SAR',
          currencySymbol: '﷼',
          flag: '🇸🇦',
          isActive: true,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
        {
          id: '12',
          name: 'Singapore',
          code: 'SG',
          phoneCode: '+65',
          currency: 'SGD',
          currencySymbol: 'S$',
          flag: '🇸🇬',
          isActive: true,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
        {
          id: '13',
          name: 'Malaysia',
          code: 'MY',
          phoneCode: '+60',
          currency: 'MYR',
          currencySymbol: 'RM',
          flag: '🇲🇾',
          isActive: true,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
      ]

      // Apply filters
      let filteredCountries = mockCountries
      if (searchTerm) {
        filteredCountries = filteredCountries.filter(
          (country) =>
            country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            country.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            country.phoneCode.includes(searchTerm) ||
            country.currency.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }
      if (filterStatus !== 'ALL') {
        filteredCountries = filteredCountries.filter((country) => 
          filterStatus === 'ACTIVE' ? country.isActive : !country.isActive
        )
      }

      setCountries(filteredCountries)
    } catch (error) {
      console.error('Error fetching countries:', error)
      toast.error('Failed to fetch countries')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: CountryForm) => {
    try {
      if (editingCountry) {
        // Update existing country
        const updatedCountry = { 
          ...editingCountry, 
          ...data,
          updatedAt: new Date().toISOString() 
        }
        setCountries(countries.map((c) => (c.id === updatedCountry.id ? updatedCountry : c)))
        toast.success('Country updated successfully!')
      } else {
        // Create new country
        const newCountry: Country = {
          id: String(countries.length + 1),
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        setCountries([...countries, newCountry])
        toast.success('Country created successfully!')
      }

      setShowModal(false)
      reset()
      setEditingCountry(null)
    } catch (error) {
      console.error('Error saving country:', error)
      toast.error('Failed to save country')
    }
  }

  const openAddModal = () => {
    setEditingCountry(null)
    reset({
      name: '',
      code: '',
      phoneCode: '',
      currency: '',
      currencySymbol: '',
      flag: '',
      isActive: true,
    })
    setShowModal(true)
  }

  const openEditModal = (country: Country) => {
    setEditingCountry(country)
    setValue('name', country.name)
    setValue('code', country.code)
    setValue('phoneCode', country.phoneCode)
    setValue('currency', country.currency)
    setValue('currencySymbol', country.currencySymbol)
    setValue('flag', country.flag || '')
    setValue('isActive', country.isActive)
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this country?')) {
      try {
        setCountries(countries.filter((c) => c.id !== id))
        toast.success('Country deleted successfully')
      } catch (error) {
        console.error('Error deleting country:', error)
        toast.error('Failed to delete country')
      }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
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
          <h1 className="text-2xl font-bold text-gray-900">Country Master</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage country information including codes, currencies, and phone codes.
          </p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary btn-md">
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Country
        </button>
      </div>

      {/* Search and filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Countries Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-head">Flag</th>
                <th className="table-head">Country</th>
                <th className="table-head">Code</th>
                <th className="table-head">Phone Code</th>
                <th className="table-head">Currency</th>
                <th className="table-head">Status</th>
                <th className="table-head">Created</th>
                <th className="table-head">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {countries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="table-cell text-center py-8 text-gray-500">
                    No countries found
                  </td>
                </tr>
              ) : (
                countries.map((country) => (
                  <tr key={country.id} className="table-row">
                    <td className="table-cell">
                      <span className="text-2xl">{country.flag}</span>
                    </td>
                    <td className="table-cell">
                      <div className="font-medium">{country.name}</div>
                    </td>
                    <td className="table-cell">
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm font-mono">
                        {country.code}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-mono">
                        {country.phoneCode}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center">
                        <span className="text-lg mr-1">{country.currencySymbol}</span>
                        <span className="text-sm">{country.currency}</span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        country.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {country.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className="text-sm">{formatDate(country.createdAt)}</span>
                    </td>
                    <td className="table-cell">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditModal(country)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => toast('View details coming soon', { icon: 'ℹ️' })}
                          className="text-green-600 hover:text-green-900"
                          title="View"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(country.id)}
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

      {/* Country Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingCountry ? 'Edit Country' : 'Add Country'}
              </h3>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country Name *
                    </label>
                    <input
                      type="text"
                      {...register('name')}
                      className="input"
                      placeholder="Enter country name"
                    />
                    {errors.name && (
                      <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country Code *
                    </label>
                    <input
                      type="text"
                      {...register('code')}
                      className="input"
                      placeholder="e.g., IN, US, GB"
                      maxLength={3}
                    />
                    {errors.code && (
                      <p className="text-red-600 text-xs mt-1">{errors.code.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Code *
                    </label>
                    <input
                      type="text"
                      {...register('phoneCode')}
                      className="input"
                      placeholder="e.g., +91, +1, +44"
                    />
                    {errors.phoneCode && (
                      <p className="text-red-600 text-xs mt-1">{errors.phoneCode.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Currency *
                    </label>
                    <select
                      {...register('currency')}
                      className="input"
                    >
                      <option value="">Select Currency</option>
                      {CURRENCIES.map((currency) => (
                        <option key={currency.code} value={currency.code}>
                          {currency.code} - {currency.name}
                        </option>
                      ))}
                    </select>
                    {errors.currency && (
                      <p className="text-red-600 text-xs mt-1">{errors.currency.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Currency Symbol *
                    </label>
                    <input
                      type="text"
                      {...register('currencySymbol')}
                      className="input"
                      placeholder="e.g., ₹, $, €"
                    />
                    {errors.currencySymbol && (
                      <p className="text-red-600 text-xs mt-1">{errors.currencySymbol.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Flag Emoji
                    </label>
                    <input
                      type="text"
                      {...register('flag')}
                      className="input"
                      placeholder="e.g., 🇮🇳, 🇺🇸, 🇬🇧"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('isActive')}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Active
                  </label>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      setEditingCountry(null)
                      reset()
                    }}
                    className="btn btn-secondary btn-md"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-md">
                    {editingCountry ? 'Update Country' : 'Create Country'}
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












