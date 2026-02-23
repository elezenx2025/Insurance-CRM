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
  MapIcon,
  FlagIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const stateSchema = z.object({
  name: z.string().min(1, 'State name is required'),
  code: z.string().min(2, 'State code is required').max(3, 'State code must be 2-3 characters'),
  countryId: z.string().min(1, 'Country is required'),
  countryName: z.string().min(1, 'Country name is required'),
  isActive: z.boolean().default(true),
})

type StateForm = z.infer<typeof stateSchema>

interface State {
  id: string
  name: string
  code: string
  countryId: string
  countryName: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface Country {
  id: string
  name: string
  code: string
}

const COUNTRIES: Country[] = [
  { id: '1', name: 'India', code: 'IN' },
  { id: '2', name: 'United States', code: 'US' },
  { id: '3', name: 'United Kingdom', code: 'GB' },
  { id: '4', name: 'Canada', code: 'CA' },
  { id: '5', name: 'Australia', code: 'AU' },
  { id: '6', name: 'Germany', code: 'DE' },
  { id: '7', name: 'France', code: 'FR' },
  { id: '8', name: 'Japan', code: 'JP' },
  { id: '9', name: 'China', code: 'CN' },
  { id: '10', name: 'UAE', code: 'AE' },
  { id: '11', name: 'Saudi Arabia', code: 'SA' },
  { id: '12', name: 'Singapore', code: 'SG' },
  { id: '13', name: 'Malaysia', code: 'MY' },
]

export default function StateMaster() {
  const [states, setStates] = useState<State[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingState, setEditingState] = useState<State | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCountry, setFilterCountry] = useState('ALL')
  const [filterStatus, setFilterStatus] = useState('ALL')

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(stateSchema),
    defaultValues: {
      isActive: true,
    },
  })

  const selectedCountryId = watch('countryId')

  useEffect(() => {
    fetchStates()
  }, [])

  useEffect(() => {
    if (selectedCountryId) {
      const selectedCountry = COUNTRIES.find(c => c.id === selectedCountryId)
      if (selectedCountry) {
        setValue('countryName', selectedCountry.name)
      }
    }
  }, [selectedCountryId, setValue])

  const fetchStates = async () => {
    try {
      setLoading(true)
      // Mock data - replace with actual API call
      const mockStates: State[] = [
        // India States
        { id: '1', name: 'Andhra Pradesh', code: 'AP', countryId: '1', countryName: 'India', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '2', name: 'Arunachal Pradesh', code: 'AR', countryId: '1', countryName: 'India', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '3', name: 'Assam', code: 'AS', countryId: '1', countryName: 'India', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '4', name: 'Bihar', code: 'BR', countryId: '1', countryName: 'India', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '5', name: 'Chhattisgarh', code: 'CG', countryId: '1', countryName: 'India', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '6', name: 'Delhi', code: 'DL', countryId: '1', countryName: 'India', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '7', name: 'Goa', code: 'GA', countryId: '1', countryName: 'India', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '8', name: 'Gujarat', code: 'GJ', countryId: '1', countryName: 'India', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '9', name: 'Haryana', code: 'HR', countryId: '1', countryName: 'India', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '10', name: 'Himachal Pradesh', code: 'HP', countryId: '1', countryName: 'India', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '11', name: 'Jammu and Kashmir', code: 'JK', countryId: '1', countryName: 'India', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '12', name: 'Jharkhand', code: 'JH', countryId: '1', countryName: 'India', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '13', name: 'Karnataka', code: 'KA', countryId: '1', countryName: 'India', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '14', name: 'Kerala', code: 'KL', countryId: '1', countryName: 'India', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '15', name: 'Madhya Pradesh', code: 'MP', countryId: '1', countryName: 'India', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '16', name: 'Maharashtra', code: 'MH', countryId: '1', countryName: 'India', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '17', name: 'Manipur', code: 'MN', countryId: '1', countryName: 'India', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '18', name: 'Meghalaya', code: 'ML', countryId: '1', countryName: 'India', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '19', name: 'Mizoram', code: 'MZ', countryId: '1', countryName: 'India', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '20', name: 'Nagaland', code: 'NL', countryId: '1', countryName: 'India', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '21', name: 'Odisha', code: 'OR', countryId: '1', countryName: 'India', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '22', name: 'Punjab', code: 'PB', countryId: '1', countryName: 'India', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '23', name: 'Rajasthan', code: 'RJ', countryId: '1', countryName: 'India', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '24', name: 'Sikkim', code: 'SK', countryId: '1', countryName: 'India', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '25', name: 'Tamil Nadu', code: 'TN', countryId: '1', countryName: 'India', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '26', name: 'Telangana', code: 'TG', countryId: '1', countryName: 'India', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '27', name: 'Tripura', code: 'TR', countryId: '1', countryName: 'India', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '28', name: 'Uttar Pradesh', code: 'UP', countryId: '1', countryName: 'India', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '29', name: 'Uttarakhand', code: 'UK', countryId: '1', countryName: 'India', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '30', name: 'West Bengal', code: 'WB', countryId: '1', countryName: 'India', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        
        // US States
        { id: '31', name: 'Alabama', code: 'AL', countryId: '2', countryName: 'United States', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '32', name: 'Alaska', code: 'AK', countryId: '2', countryName: 'United States', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '33', name: 'Arizona', code: 'AZ', countryId: '2', countryName: 'United States', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '34', name: 'California', code: 'CA', countryId: '2', countryName: 'United States', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '35', name: 'Florida', code: 'FL', countryId: '2', countryName: 'United States', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '36', name: 'New York', code: 'NY', countryId: '2', countryName: 'United States', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '37', name: 'Texas', code: 'TX', countryId: '2', countryName: 'United States', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        
        // UK Regions
        { id: '38', name: 'England', code: 'ENG', countryId: '3', countryName: 'United Kingdom', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '39', name: 'Scotland', code: 'SCT', countryId: '3', countryName: 'United Kingdom', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '40', name: 'Wales', code: 'WLS', countryId: '3', countryName: 'United Kingdom', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '41', name: 'Northern Ireland', code: 'NIR', countryId: '3', countryName: 'United Kingdom', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        
        // Canada Provinces
        { id: '42', name: 'Ontario', code: 'ON', countryId: '4', countryName: 'Canada', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '43', name: 'Quebec', code: 'QC', countryId: '4', countryName: 'Canada', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '44', name: 'British Columbia', code: 'BC', countryId: '4', countryName: 'Canada', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        
        // Australia States
        { id: '45', name: 'New South Wales', code: 'NSW', countryId: '5', countryName: 'Australia', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '46', name: 'Victoria', code: 'VIC', countryId: '5', countryName: 'Australia', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '47', name: 'Queensland', code: 'QLD', countryId: '5', countryName: 'Australia', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        
        // Germany States
        { id: '48', name: 'Bavaria', code: 'BY', countryId: '6', countryName: 'Germany', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '49', name: 'North Rhine-Westphalia', code: 'NW', countryId: '6', countryName: 'Germany', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '50', name: 'Baden-Württemberg', code: 'BW', countryId: '6', countryName: 'Germany', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        
        // France Regions
        { id: '51', name: 'Île-de-France', code: 'IDF', countryId: '7', countryName: 'France', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '52', name: 'Provence-Alpes-Côte d\'Azur', code: 'PAC', countryId: '7', countryName: 'France', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        
        // Japan Prefectures
        { id: '53', name: 'Tokyo', code: 'TK', countryId: '8', countryName: 'Japan', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '54', name: 'Osaka', code: 'OS', countryId: '8', countryName: 'Japan', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '55', name: 'Kyoto', code: 'KY', countryId: '8', countryName: 'Japan', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        
        // China Provinces
        { id: '56', name: 'Beijing', code: 'BJ', countryId: '9', countryName: 'China', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '57', name: 'Shanghai', code: 'SH', countryId: '9', countryName: 'China', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '58', name: 'Guangdong', code: 'GD', countryId: '9', countryName: 'China', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        
        // UAE Emirates
        { id: '59', name: 'Dubai', code: 'DU', countryId: '10', countryName: 'UAE', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '60', name: 'Abu Dhabi', code: 'AD', countryId: '10', countryName: 'UAE', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        
        // Saudi Arabia Provinces
        { id: '61', name: 'Riyadh', code: 'RY', countryId: '11', countryName: 'Saudi Arabia', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '62', name: 'Mecca', code: 'MK', countryId: '11', countryName: 'Saudi Arabia', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        
        // Singapore
        { id: '63', name: 'Singapore', code: 'SG', countryId: '12', countryName: 'Singapore', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        
        // Malaysia States
        { id: '64', name: 'Kuala Lumpur', code: 'KL', countryId: '13', countryName: 'Malaysia', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { id: '65', name: 'Selangor', code: 'SL', countryId: '13', countryName: 'Malaysia', isActive: true, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
      ]

      // Apply filters
      let filteredStates = mockStates
      if (searchTerm) {
        filteredStates = filteredStates.filter(
          (state) =>
            state.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            state.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            state.countryName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }
      if (filterCountry !== 'ALL') {
        filteredStates = filteredStates.filter((state) => state.countryId === filterCountry)
      }
      if (filterStatus !== 'ALL') {
        filteredStates = filteredStates.filter((state) => 
          filterStatus === 'ACTIVE' ? state.isActive : !state.isActive
        )
      }

      setStates(filteredStates)
    } catch (error) {
      console.error('Error fetching states:', error)
      toast.error('Failed to fetch states')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: StateForm) => {
    try {
      if (editingState) {
        // Update existing state
        const updatedState = { 
          ...editingState, 
          ...data,
          updatedAt: new Date().toISOString() 
        }
        setStates(states.map((s) => (s.id === updatedState.id ? updatedState : s)))
        toast.success('State updated successfully!')
      } else {
        // Create new state
        const newState: State = {
          id: String(states.length + 1),
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        setStates([...states, newState])
        toast.success('State created successfully!')
      }

      setShowModal(false)
      reset()
      setEditingState(null)
    } catch (error) {
      console.error('Error saving state:', error)
      toast.error('Failed to save state')
    }
  }

  const openAddModal = () => {
    setEditingState(null)
    reset({
      name: '',
      code: '',
      countryId: '',
      countryName: '',
      isActive: true,
    })
    setShowModal(true)
  }

  const openEditModal = (state: State) => {
    setEditingState(state)
    setValue('name', state.name)
    setValue('code', state.code)
    setValue('countryId', state.countryId)
    setValue('countryName', state.countryName)
    setValue('isActive', state.isActive)
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this state?')) {
      try {
        setStates(states.filter((s) => s.id !== id))
        toast.success('State deleted successfully')
      } catch (error) {
        console.error('Error deleting state:', error)
        toast.error('Failed to delete state')
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
          <h1 className="text-2xl font-bold text-gray-900">State Master</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage state/province information for different countries.
          </p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary btn-md">
          <PlusIcon className="h-5 w-5 mr-2" />
          Add State
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
                placeholder="Search states..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterCountry}
              onChange={(e) => setFilterCountry(e.target.value)}
              className="input"
            >
              <option value="ALL">All Countries</option>
              {COUNTRIES.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name}
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

      {/* States Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-head">State ID</th>
                <th className="table-head">State Code</th>
                <th className="table-head">State Name</th>
                <th className="table-head">Country</th>
                <th className="table-head">Status</th>
                <th className="table-head">Created</th>
                <th className="table-head">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {states.length === 0 ? (
                <tr>
                  <td colSpan={7} className="table-cell text-center py-8 text-gray-500">
                    No states found
                  </td>
                </tr>
              ) : (
                states.map((state) => (
                  <tr key={state.id} className="table-row">
                    <td className="table-cell">
                      <span className="text-sm font-mono text-gray-600">{state.id}</span>
                    </td>
                    <td className="table-cell">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-semibold">
                        {state.code}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="font-medium">{state.name}</div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center">
                        <span className="text-sm">{state.countryName}</span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        state.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {state.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className="text-sm">{formatDate(state.createdAt)}</span>
                    </td>
                    <td className="table-cell">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditModal(state)}
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
                          onClick={() => handleDelete(state.id)}
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

      {/* State Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingState ? 'Edit State' : 'Add State'}
              </h3>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State Name *
                    </label>
                    <input
                      type="text"
                      {...register('name')}
                      className="input"
                      placeholder="Enter state name"
                    />
                    {errors.name && (
                      <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State Code *
                    </label>
                    <input
                      type="text"
                      {...register('code')}
                      className="input"
                      placeholder="e.g., MH, CA, NY"
                      maxLength={3}
                    />
                    {errors.code && (
                      <p className="text-red-600 text-xs mt-1">{errors.code.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country *
                    </label>
                    <select
                      {...register('countryId')}
                      className="input"
                    >
                      <option value="">Select Country</option>
                      {COUNTRIES.map((country) => (
                        <option key={country.id} value={country.id}>
                          {country.name} ({country.code})
                        </option>
                      ))}
                    </select>
                    {errors.countryId && (
                      <p className="text-red-600 text-xs mt-1">{errors.countryId.message}</p>
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
                      setEditingState(null)
                      reset()
                    }}
                    className="btn btn-secondary btn-md"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-md">
                    {editingState ? 'Update State' : 'Create State'}
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












