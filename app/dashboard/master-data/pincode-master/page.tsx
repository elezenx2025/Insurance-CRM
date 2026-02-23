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
  MapPinIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const pincodeSchema = z.object({
  pincode: z.string().min(1, 'Pincode is required'),
  cityId: z.string().min(1, 'City is required'),
  cityName: z.string().min(1, 'City name is required'),
  stateId: z.string().min(1, 'State is required'),
  stateName: z.string().min(1, 'State name is required'),
  countryId: z.string().min(1, 'Country is required'),
  countryName: z.string().min(1, 'Country name is required'),
  area: z.string().optional(),
  isActive: z.boolean().default(true),
})

type PincodeForm = z.infer<typeof pincodeSchema>

interface Pincode {
  id: string
  pincode: string
  cityId: string
  cityName: string
  stateId: string
  stateName: string
  countryId: string
  countryName: string
  area?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface City {
  id: string
  name: string
  stateId: string
  stateName: string
  countryId: string
  countryName: string
}

const CITIES: City[] = [
  // India Cities
  { id: '1', name: 'Mumbai', stateId: '1', stateName: 'Maharashtra', countryId: '1', countryName: 'India' },
  { id: '2', name: 'Pune', stateId: '1', stateName: 'Maharashtra', countryId: '1', countryName: 'India' },
  { id: '3', name: 'New Delhi', stateId: '2', stateName: 'Delhi', countryId: '1', countryName: 'India' },
  { id: '4', name: 'Bangalore', stateId: '3', stateName: 'Karnataka', countryId: '1', countryName: 'India' },
  { id: '5', name: 'Chennai', stateId: '4', stateName: 'Tamil Nadu', countryId: '1', countryName: 'India' },
  { id: '6', name: 'Ahmedabad', stateId: '5', stateName: 'Gujarat', countryId: '1', countryName: 'India' },
  { id: '7', name: 'Kolkata', stateId: '6', stateName: 'West Bengal', countryId: '1', countryName: 'India' },
  { id: '8', name: 'Lucknow', stateId: '7', stateName: 'Uttar Pradesh', countryId: '1', countryName: 'India' },
  { id: '9', name: 'Jaipur', stateId: '8', stateName: 'Rajasthan', countryId: '1', countryName: 'India' },
  { id: '10', name: 'Chandigarh', stateId: '9', stateName: 'Punjab', countryId: '1', countryName: 'India' },
  
  // US Cities
  { id: '11', name: 'Los Angeles', stateId: '11', stateName: 'California', countryId: '2', countryName: 'United States' },
  { id: '12', name: 'New York City', stateId: '12', stateName: 'New York', countryId: '2', countryName: 'United States' },
  { id: '13', name: 'Houston', stateId: '13', stateName: 'Texas', countryId: '2', countryName: 'United States' },
  
  // UK Cities
  { id: '14', name: 'London', stateId: '15', stateName: 'England', countryId: '3', countryName: 'United Kingdom' },
  { id: '15', name: 'Manchester', stateId: '15', stateName: 'England', countryId: '3', countryName: 'United Kingdom' },
  
  // Canada Cities
  { id: '16', name: 'Toronto', stateId: '17', stateName: 'Ontario', countryId: '4', countryName: 'Canada' },
  { id: '17', name: 'Montreal', stateId: '18', stateName: 'Quebec', countryId: '4', countryName: 'Canada' },
  
  // Australia Cities
  { id: '18', name: 'Sydney', stateId: '19', stateName: 'New South Wales', countryId: '5', countryName: 'Australia' },
  { id: '19', name: 'Melbourne', stateId: '20', stateName: 'Victoria', countryId: '5', countryName: 'Australia' },
]

export default function PincodeMaster() {
  const [pincodes, setPincodes] = useState<Pincode[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingPincode, setEditingPincode] = useState<Pincode | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCity, setFilterCity] = useState('ALL')
  const [filterStatus, setFilterStatus] = useState('ALL')

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(pincodeSchema),
    defaultValues: {
      isActive: true,
    },
  })

  const selectedCityId = watch('cityId')

  useEffect(() => {
    fetchPincodes()
  }, [])

  useEffect(() => {
    if (selectedCityId) {
      const selectedCity = CITIES.find(c => c.id === selectedCityId)
      if (selectedCity) {
        setValue('cityName', selectedCity.name)
        setValue('stateId', selectedCity.stateId)
        setValue('stateName', selectedCity.stateName)
        setValue('countryId', selectedCity.countryId)
        setValue('countryName', selectedCity.countryName)
      }
    }
  }, [selectedCityId, setValue])

  const fetchPincodes = async () => {
    try {
      setLoading(true)
      // Mock data - replace with actual API call
      const mockPincodes: Pincode[] = [
        // India Pincodes
        { id: '1', pincode: '400001', cityId: '1', cityName: 'Mumbai', stateId: '1', stateName: 'Maharashtra', countryId: '1', countryName: 'India', area: 'Fort', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '2', pincode: '400002', cityId: '1', cityName: 'Mumbai', stateId: '1', stateName: 'Maharashtra', countryId: '1', countryName: 'India', area: 'CST', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '3', pincode: '400003', cityId: '1', cityName: 'Mumbai', stateId: '1', stateName: 'Maharashtra', countryId: '1', countryName: 'India', area: 'Marine Lines', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '4', pincode: '411001', cityId: '2', cityName: 'Pune', stateId: '1', stateName: 'Maharashtra', countryId: '1', countryName: 'India', area: 'Pune Station', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '5', pincode: '411002', cityId: '2', cityName: 'Pune', stateId: '1', stateName: 'Maharashtra', countryId: '1', countryName: 'India', area: 'Shivajinagar', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '6', pincode: '110001', cityId: '3', cityName: 'New Delhi', stateId: '2', stateName: 'Delhi', countryId: '1', countryName: 'India', area: 'Connaught Place', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '7', pincode: '110002', cityId: '3', cityName: 'New Delhi', stateId: '2', stateName: 'Delhi', countryId: '1', countryName: 'India', area: 'Rajiv Chowk', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '8', pincode: '560001', cityId: '4', cityName: 'Bangalore', stateId: '3', stateName: 'Karnataka', countryId: '1', countryName: 'India', area: 'Bangalore GPO', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '9', pincode: '560002', cityId: '4', cityName: 'Bangalore', stateId: '3', stateName: 'Karnataka', countryId: '1', countryName: 'India', area: 'MG Road', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '10', pincode: '600001', cityId: '5', cityName: 'Chennai', stateId: '4', stateName: 'Tamil Nadu', countryId: '1', countryName: 'India', area: 'Chennai GPO', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '11', pincode: '380001', cityId: '6', cityName: 'Ahmedabad', stateId: '5', stateName: 'Gujarat', countryId: '1', countryName: 'India', area: 'Ahmedabad GPO', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '12', pincode: '700001', cityId: '7', cityName: 'Kolkata', stateId: '6', stateName: 'West Bengal', countryId: '1', countryName: 'India', area: 'Kolkata GPO', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '13', pincode: '226001', cityId: '8', cityName: 'Lucknow', stateId: '7', stateName: 'Uttar Pradesh', countryId: '1', countryName: 'India', area: 'Lucknow GPO', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '14', pincode: '302001', cityId: '9', cityName: 'Jaipur', stateId: '8', stateName: 'Rajasthan', countryId: '1', countryName: 'India', area: 'Jaipur GPO', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '15', pincode: '160001', cityId: '10', cityName: 'Chandigarh', stateId: '9', stateName: 'Punjab', countryId: '1', countryName: 'India', area: 'Chandigarh GPO', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        
        // US ZIP Codes
        { id: '16', pincode: '90001', cityId: '11', cityName: 'Los Angeles', stateId: '11', stateName: 'California', countryId: '2', countryName: 'United States', area: 'Downtown LA', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '17', pincode: '90002', cityId: '11', cityName: 'Los Angeles', stateId: '11', stateName: 'California', countryId: '2', countryName: 'United States', area: 'East LA', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '18', pincode: '10001', cityId: '12', cityName: 'New York City', stateId: '12', stateName: 'New York', countryId: '2', countryName: 'United States', area: 'Manhattan', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '19', pincode: '10002', cityId: '12', cityName: 'New York City', stateId: '12', stateName: 'New York', countryId: '2', countryName: 'United States', area: 'Lower East Side', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '20', pincode: '77001', cityId: '13', cityName: 'Houston', stateId: '13', stateName: 'Texas', countryId: '2', countryName: 'United States', area: 'Downtown Houston', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        
        // UK Postal Codes
        { id: '21', pincode: 'SW1A 1AA', cityId: '14', cityName: 'London', stateId: '15', stateName: 'England', countryId: '3', countryName: 'United Kingdom', area: 'Westminster', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '22', pincode: 'SW1A 2AA', cityId: '14', cityName: 'London', stateId: '15', stateName: 'England', countryId: '3', countryName: 'United Kingdom', area: 'Westminster', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '23', pincode: 'M1 1AA', cityId: '15', cityName: 'Manchester', stateId: '15', stateName: 'England', countryId: '3', countryName: 'United Kingdom', area: 'Manchester City Centre', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        
        // Canada Postal Codes
        { id: '24', pincode: 'M1A 1A1', cityId: '16', cityName: 'Toronto', stateId: '17', stateName: 'Ontario', countryId: '4', countryName: 'Canada', area: 'Downtown Toronto', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '25', pincode: 'H1A 1A1', cityId: '17', cityName: 'Montreal', stateId: '18', stateName: 'Quebec', countryId: '4', countryName: 'Canada', area: 'Downtown Montreal', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        
        // Australia Postal Codes
        { id: '26', pincode: '2000', cityId: '18', cityName: 'Sydney', stateId: '19', stateName: 'New South Wales', countryId: '5', countryName: 'Australia', area: 'Sydney CBD', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '27', pincode: '3000', cityId: '19', cityName: 'Melbourne', stateId: '20', stateName: 'Victoria', countryId: '5', countryName: 'Australia', area: 'Melbourne CBD', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
      ]

      // Apply filters
      let filteredPincodes = mockPincodes
      if (searchTerm) {
        filteredPincodes = filteredPincodes.filter(
          (pincode) =>
            pincode.pincode.includes(searchTerm) ||
            pincode.cityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pincode.stateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pincode.countryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (pincode.area && pincode.area.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      }
      if (filterCity !== 'ALL') {
        filteredPincodes = filteredPincodes.filter((pincode) => pincode.cityId === filterCity)
      }
      if (filterStatus !== 'ALL') {
        filteredPincodes = filteredPincodes.filter((pincode) => 
          filterStatus === 'ACTIVE' ? pincode.isActive : !pincode.isActive
        )
      }

      setPincodes(filteredPincodes)
    } catch (error) {
      console.error('Error fetching pincodes:', error)
      toast.error('Failed to fetch pincodes')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: PincodeForm) => {
    try {
      if (editingPincode) {
        const updatedPincode = { 
          ...editingPincode, 
          ...data,
          updatedAt: new Date().toISOString() 
        }
        setPincodes(pincodes.map((p) => (p.id === updatedPincode.id ? updatedPincode : p)))
        toast.success('Pincode updated successfully!')
      } else {
        const newPincode: Pincode = {
          id: String(pincodes.length + 1),
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        setPincodes([...pincodes, newPincode])
        toast.success('Pincode created successfully!')
      }

      setShowModal(false)
      reset()
      setEditingPincode(null)
    } catch (error) {
      console.error('Error saving pincode:', error)
      toast.error('Failed to save pincode')
    }
  }

  const openAddModal = () => {
    setEditingPincode(null)
    reset({
      pincode: '',
      cityId: '',
      cityName: '',
      stateId: '',
      stateName: '',
      countryId: '',
      countryName: '',
      area: '',
      isActive: true,
    })
    setShowModal(true)
  }

  const openEditModal = (pincode: Pincode) => {
    setEditingPincode(pincode)
    setValue('pincode', pincode.pincode)
    setValue('cityId', pincode.cityId)
    setValue('cityName', pincode.cityName)
    setValue('stateId', pincode.stateId)
    setValue('stateName', pincode.stateName)
    setValue('countryId', pincode.countryId)
    setValue('countryName', pincode.countryName)
    setValue('area', pincode.area || '')
    setValue('isActive', pincode.isActive)
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this pincode?')) {
      try {
        setPincodes(pincodes.filter((p) => p.id !== id))
        toast.success('Pincode deleted successfully')
      } catch (error) {
        console.error('Error deleting pincode:', error)
        toast.error('Failed to delete pincode')
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
          <h1 className="text-2xl font-bold text-gray-900">Pincode Master</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage postal codes and pincodes for different cities and countries.
          </p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary btn-md">
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Pincode
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
                placeholder="Search pincodes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
              className="input"
            >
              <option value="ALL">All Cities</option>
              {CITIES.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name} ({city.countryName})
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

      {/* Pincodes Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-head">Pincode</th>
                <th className="table-head">Area</th>
                <th className="table-head">City</th>
                <th className="table-head">State</th>
                <th className="table-head">Country</th>
                <th className="table-head">Status</th>
                <th className="table-head">Created</th>
                <th className="table-head">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {pincodes.length === 0 ? (
                <tr>
                  <td colSpan={8} className="table-cell text-center py-8 text-gray-500">
                    No pincodes found
                  </td>
                </tr>
              ) : (
                pincodes.map((pincode) => (
                  <tr key={pincode.id} className="table-row">
                    <td className="table-cell">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-mono">
                        {pincode.pincode}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className="text-sm">{pincode.area || '-'}</span>
                    </td>
                    <td className="table-cell">
                      <span className="text-sm">{pincode.cityName}</span>
                    </td>
                    <td className="table-cell">
                      <span className="text-sm">{pincode.stateName}</span>
                    </td>
                    <td className="table-cell">
                      <span className="text-sm">{pincode.countryName}</span>
                    </td>
                    <td className="table-cell">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        pincode.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {pincode.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className="text-sm">{formatDate(pincode.createdAt)}</span>
                    </td>
                    <td className="table-cell">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditModal(pincode)}
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
                          onClick={() => handleDelete(pincode.id)}
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

      {/* Pincode Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingPincode ? 'Edit Pincode' : 'Add Pincode'}
              </h3>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      {...register('pincode')}
                      className="input"
                      placeholder="Enter pincode/postal code"
                    />
                    {errors.pincode && (
                      <p className="text-red-600 text-xs mt-1">{errors.pincode.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Area
                    </label>
                    <input
                      type="text"
                      {...register('area')}
                      className="input"
                      placeholder="Enter area name"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <select
                      {...register('cityId')}
                      className="input"
                    >
                      <option value="">Select City</option>
                      {CITIES.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.name} ({city.stateName}, {city.countryName})
                        </option>
                      ))}
                    </select>
                    {errors.cityId && (
                      <p className="text-red-600 text-xs mt-1">{errors.cityId.message}</p>
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
                      setEditingPincode(null)
                      reset()
                    }}
                    className="btn btn-secondary btn-md"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-md">
                    {editingPincode ? 'Update Pincode' : 'Create Pincode'}
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












