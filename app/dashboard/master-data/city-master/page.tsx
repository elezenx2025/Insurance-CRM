'use client'

import { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { INDIAN_CITIES } from '@/data/indian-cities'

const citySchema = z.object({
  cityId: z.string().min(1, 'City ID is required'),
  cityCode: z.string().min(2, 'City code is required').max(10, 'City code must be 2-10 characters'),
  name: z.string().min(1, 'City name is required'),
  stateId: z.string().min(1, 'State is required'),
  stateName: z.string().min(1, 'State name is required'),
  countryId: z.string().min(1, 'Country is required'),
  countryName: z.string().min(1, 'Country name is required'),
  isActive: z.boolean().default(true),
})

type CityForm = z.infer<typeof citySchema>

interface City {
  id: string
  cityId: string
  cityCode: string
  name: string
  stateId: string
  stateName: string
  countryId: string
  countryName: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface State {
  id: string
  name: string
  countryId: string
  countryName: string
}

const STATES: State[] = [
  // India States (matching State Master IDs)
  { id: '1', name: 'Andhra Pradesh', countryId: '1', countryName: 'India' },
  { id: '2', name: 'Arunachal Pradesh', countryId: '1', countryName: 'India' },
  { id: '3', name: 'Assam', countryId: '1', countryName: 'India' },
  { id: '4', name: 'Bihar', countryId: '1', countryName: 'India' },
  { id: '5', name: 'Chhattisgarh', countryId: '1', countryName: 'India' },
  { id: '6', name: 'Delhi', countryId: '1', countryName: 'India' },
  { id: '7', name: 'Goa', countryId: '1', countryName: 'India' },
  { id: '8', name: 'Gujarat', countryId: '1', countryName: 'India' },
  { id: '9', name: 'Haryana', countryId: '1', countryName: 'India' },
  { id: '10', name: 'Himachal Pradesh', countryId: '1', countryName: 'India' },
  { id: '11', name: 'Jammu and Kashmir', countryId: '1', countryName: 'India' },
  { id: '12', name: 'Jharkhand', countryId: '1', countryName: 'India' },
  { id: '13', name: 'Karnataka', countryId: '1', countryName: 'India' },
  { id: '14', name: 'Kerala', countryId: '1', countryName: 'India' },
  { id: '15', name: 'Madhya Pradesh', countryId: '1', countryName: 'India' },
  { id: '16', name: 'Maharashtra', countryId: '1', countryName: 'India' },
  { id: '17', name: 'Manipur', countryId: '1', countryName: 'India' },
  { id: '18', name: 'Meghalaya', countryId: '1', countryName: 'India' },
  { id: '19', name: 'Mizoram', countryId: '1', countryName: 'India' },
  { id: '20', name: 'Nagaland', countryId: '1', countryName: 'India' },
  { id: '21', name: 'Odisha', countryId: '1', countryName: 'India' },
  { id: '22', name: 'Punjab', countryId: '1', countryName: 'India' },
  { id: '23', name: 'Rajasthan', countryId: '1', countryName: 'India' },
  { id: '24', name: 'Sikkim', countryId: '1', countryName: 'India' },
  { id: '25', name: 'Tamil Nadu', countryId: '1', countryName: 'India' },
  { id: '26', name: 'Telangana', countryId: '1', countryName: 'India' },
  { id: '27', name: 'Tripura', countryId: '1', countryName: 'India' },
  { id: '28', name: 'Uttar Pradesh', countryId: '1', countryName: 'India' },
  { id: '29', name: 'Uttarakhand', countryId: '1', countryName: 'India' },
  { id: '30', name: 'West Bengal', countryId: '1', countryName: 'India' },
]

export default function CityMaster() {
  const [cities, setCities] = useState<City[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCity, setEditingCity] = useState<City | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterState, setFilterState] = useState('ALL')
  const [filterStatus, setFilterStatus] = useState('ALL')

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(citySchema),
    defaultValues: {
      isActive: true,
    },
  })

  const selectedStateId = watch('stateId')

  // Define fetchCities function first
  const fetchCities = useCallback(async () => {
    try {
      setLoading(true)
      // Use comprehensive Indian cities data
      const mockCities: City[] = INDIAN_CITIES

      // Apply filters
      let filteredCities = mockCities
      if (searchTerm) {
        filteredCities = filteredCities.filter(
          (city) =>
            city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            city.stateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            city.countryName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }
      if (filterState !== 'ALL') {
        filteredCities = filteredCities.filter((city) => city.stateId === filterState)
      }
      if (filterStatus !== 'ALL') {
        filteredCities = filteredCities.filter((city) => 
          filterStatus === 'ACTIVE' ? city.isActive : !city.isActive
        )
      }

      setCities(filteredCities)
    } catch (error) {
      console.error('Error fetching cities:', error)
      toast.error('Failed to fetch cities')
    } finally {
      setLoading(false)
    }
  }, [searchTerm, filterState, filterStatus])

  // Re-fetch cities when filters change
  useEffect(() => {
    fetchCities()
  }, [fetchCities])

  useEffect(() => {
    if (selectedStateId) {
      const selectedState = STATES.find(s => s.id === selectedStateId)
      if (selectedState) {
        setValue('stateName', selectedState.name)
        setValue('countryId', selectedState.countryId)
        setValue('countryName', selectedState.countryName)
      }
    }
  }, [selectedStateId, setValue])

  const onSubmit = async (data: CityForm) => {
    try {
      if (editingCity) {
        const updatedCity = { 
          ...editingCity, 
          ...data,
          updatedAt: new Date().toISOString() 
        }
        setCities(cities.map((c) => (c.id === updatedCity.id ? updatedCity : c)))
        toast.success('City updated successfully!')
      } else {
        const newCity: City = {
          id: String(cities.length + 1),
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        setCities([...cities, newCity])
        toast.success('City created successfully!')
      }

      setShowModal(false)
      reset()
      setEditingCity(null)
    } catch (error) {
      console.error('Error saving city:', error)
      toast.error('Failed to save city')
    }
  }

  const openAddModal = () => {
    setEditingCity(null)
    reset({
      name: '',
      stateId: '',
      stateName: '',
      countryId: '',
      countryName: '',
      isActive: true,
    })
    setShowModal(true)
  }

  const openEditModal = (city: City) => {
    setEditingCity(city)
    setValue('cityId', city.cityId)
    setValue('cityCode', city.cityCode)
    setValue('name', city.name)
    setValue('stateId', city.stateId)
    setValue('stateName', city.stateName)
    setValue('countryId', city.countryId)
    setValue('countryName', city.countryName)
    setValue('isActive', city.isActive)
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this city?')) {
      try {
        setCities(cities.filter((c) => c.id !== id))
        toast.success('City deleted successfully')
      } catch (error) {
        console.error('Error deleting city:', error)
        toast.error('Failed to delete city')
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
          <h1 className="text-2xl font-bold text-gray-900">City Master</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage city information for different states and countries.
          </p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary btn-md">
          <PlusIcon className="h-5 w-5 mr-2" />
          Add City
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
                placeholder="Search cities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterState}
              onChange={(e) => setFilterState(e.target.value)}
              className="input"
            >
              <option value="ALL">All States</option>
              {STATES.map((state) => (
                <option key={state.id} value={state.id}>
                  {state.name} ({state.countryName})
                </option>
              ))}
            </select>
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

      {/* Cities Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-head">City ID</th>
                <th className="table-head">City Code</th>
                <th className="table-head">City Name</th>
                <th className="table-head">State</th>
                <th className="table-head">Country</th>
                <th className="table-head">Status</th>
                <th className="table-head">Created</th>
                <th className="table-head">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {cities.length === 0 ? (
                <tr>
                  <td colSpan={8} className="table-cell text-center py-8 text-gray-500">
                    No cities found
                  </td>
                </tr>
              ) : (
                cities.map((city) => (
                  <tr key={city.id} className="table-row">
                    <td className="table-cell">
                      <span className="text-sm font-mono text-gray-600">{city.cityId}</span>
                    </td>
                    <td className="table-cell">
                      <span className="text-sm font-semibold text-blue-600">{city.cityCode}</span>
                    </td>
                    <td className="table-cell">
                      <div className="font-medium">{city.name}</div>
                    </td>
                    <td className="table-cell">
                      <span className="text-sm">{city.stateName}</span>
                    </td>
                    <td className="table-cell">
                      <span className="text-sm">{city.countryName}</span>
                    </td>
                    <td className="table-cell">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        city.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {city.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className="text-sm">{formatDate(city.createdAt)}</span>
                    </td>
                    <td className="table-cell">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditModal(city)}
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
                          onClick={() => handleDelete(city.id)}
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

      {/* City Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingCity ? 'Edit City' : 'Add City'}
              </h3>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City ID *
                    </label>
                    <input
                      type="text"
                      {...register('cityId')}
                      className="input"
                      placeholder="e.g., CITY001"
                    />
                    {errors.cityId && (
                      <p className="text-red-600 text-xs mt-1">{errors.cityId.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City Code *
                    </label>
                    <input
                      type="text"
                      {...register('cityCode')}
                      className="input"
                      placeholder="e.g., MUM"
                    />
                    {errors.cityCode && (
                      <p className="text-red-600 text-xs mt-1">{errors.cityCode.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City Name *
                    </label>
                    <input
                      type="text"
                      {...register('name')}
                      className="input"
                      placeholder="Enter city name"
                    />
                    {errors.name && (
                      <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <select
                      {...register('stateId')}
                      className="input"
                    >
                      <option value="">Select State</option>
                      {STATES.map((state) => (
                        <option key={state.id} value={state.id}>
                          {state.name} ({state.countryName})
                        </option>
                      ))}
                    </select>
                    {errors.stateId && (
                      <p className="text-red-600 text-xs mt-1">{errors.stateId.message}</p>
                    )}
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
                      setEditingCity(null)
                      reset()
                    }}
                    className="btn btn-secondary btn-md"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-md">
                    {editingCity ? 'Update City' : 'Create City'}
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












