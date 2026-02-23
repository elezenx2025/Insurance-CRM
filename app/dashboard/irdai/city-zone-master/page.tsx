'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  ArrowLeftIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  BuildingLibraryIcon,
  MapPinIcon,
  TruckIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const cityZoneSchema = z.object({
  cityZoneName: z.string().min(1, 'City zone name is required'),
  motorSegmentId: z.string().min(1, 'Motor segment is required'),
  zoneId: z.string().min(1, 'Zone is required'),
  cityZoneDescription: z.string().min(1, 'Description is required'),
  isActive: z.boolean().default(true),
  activeFromDate: z.string().min(1, 'Active from date is required'),
  activeToDate: z.string().optional(),
})

type CityZoneForm = z.infer<typeof cityZoneSchema>

interface MotorSegment {
  id: string
  motorSegmentName: 'Private' | 'Commercial'
}

interface Zone {
  id: string
  motorSegmentId: string
  zoneName: string
}

interface City {
  id: string
  cityName: string
  state: string
  zone?: 'A' | 'B' | 'C'
  category?: 'metropolitan' | 'state_capital' | 'other'
}

interface CityZone {
  id: string
  cityZoneName: string
  motorSegmentId: string
  motorSegmentName: 'Private' | 'Commercial'
  zoneId: string
  zoneName: string
  cityZoneDescription: string
  isActive: boolean
  createdBy: string
  createdDate: string
  createdProcName: string
  updatedBy?: string
  updatedDate?: string
  activeFromDate: string
  activeToDate?: string
}

export default function CityZoneMasterPage() {
  const router = useRouter()
  const [cityZones, setCityZones] = useState<CityZone[]>([])
  const [motorSegments, setMotorSegments] = useState<MotorSegment[]>([])
  const [zones, setZones] = useState<Zone[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCityZone, setEditingCityZone] = useState<CityZone | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [filterSegment, setFilterSegment] = useState('ALL')
  const [filterZone, setFilterZone] = useState('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedSegment, setSelectedSegment] = useState<string>('')
  const itemsPerPage = 10

  const handleBack = () => {
    router.push('/dashboard/irdai')
  }

  // Helper functions for localStorage persistence
  const saveCityZonesToStorage = (cityZonesList: CityZone[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cityZones', JSON.stringify(cityZonesList))
    }
  }

  const loadCityZonesFromStorage = (): CityZone[] | null => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cityZones')
      return saved ? JSON.parse(saved) : null
    }
    return null
  }

  const resetCityZonesData = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cityZones')
      fetchCityZones()
      toast.success('Data reset to initial values')
    }
  }

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(cityZoneSchema),
  })

  const watchedSegmentId = watch('motorSegmentId')
  const watchedCityName = watch('cityZoneName')

  useEffect(() => {
    fetchMotorSegments()
    fetchZones()
    fetchCities()
    fetchCityZones()
  }, [currentPage, searchTerm, filterStatus, filterSegment, filterZone])

  // Auto-assign zone based on city and motor segment selection
  useEffect(() => {
    if (watchedCityName && watchedSegmentId) {
      const segment = motorSegments.find(s => s.id === watchedSegmentId)
      if (segment) {
        const suggestedZone = getZoneForCity(watchedCityName, segment.motorSegmentName)
        if (suggestedZone) {
          const availableZones = getAvailableZones(watchedSegmentId)
          const matchingZone = availableZones.find(z => z.zoneName.includes(`Zone ${suggestedZone}`))
          if (matchingZone) {
            // Auto-set the zone field
            reset(prev => ({
              ...prev,
              zoneId: matchingZone.id
            }))
          }
        }
      }
    }
  }, [watchedCityName, watchedSegmentId, motorSegments, zones, reset])

  const fetchMotorSegments = async () => {
    try {
      // Mock data - replace with actual API call
      const mockSegments: MotorSegment[] = [
        { id: '1', motorSegmentName: 'Private' },
        { id: '2', motorSegmentName: 'Commercial' },
      ]
      setMotorSegments(mockSegments)
    } catch (error) {
      toast.error('Error fetching motor segments')
    }
  }

  const fetchZones = async () => {
    try {
      // Mock data - replace with actual API call
      const mockZones: Zone[] = [
        { id: '1', motorSegmentId: '1', zoneName: 'Zone A' },
        { id: '2', motorSegmentId: '1', zoneName: 'Zone B' },
        { id: '3', motorSegmentId: '2', zoneName: 'Zone A' },
        { id: '4', motorSegmentId: '2', zoneName: 'Zone B' },
        { id: '5', motorSegmentId: '2', zoneName: 'Zone C' },
      ]
      setZones(mockZones)
    } catch (error) {
      toast.error('Error fetching zones')
    }
  }

  const fetchCities = async () => {
    try {
      // Mock data - replace with actual API call
      const mockCities: City[] = [
        // Private Zone A - 8 Metropolitan Cities
        { id: '1', cityName: 'New Delhi', state: 'Delhi', zone: 'A', category: 'metropolitan' },
        { id: '2', cityName: 'Mumbai', state: 'Maharashtra', zone: 'A', category: 'metropolitan' },
        { id: '3', cityName: 'Chennai', state: 'Tamil Nadu', zone: 'A', category: 'metropolitan' },
        { id: '4', cityName: 'Kolkata', state: 'West Bengal', zone: 'A', category: 'metropolitan' },
        { id: '5', cityName: 'Pune', state: 'Maharashtra', zone: 'A', category: 'metropolitan' },
        { id: '6', cityName: 'Ahmedabad', state: 'Gujarat', zone: 'A', category: 'metropolitan' },
        { id: '7', cityName: 'Bangalore', state: 'Karnataka', zone: 'A', category: 'metropolitan' },
        { id: '8', cityName: 'Hyderabad', state: 'Telangana', zone: 'A', category: 'metropolitan' },
        
        // Commercial Zone B - State Capitals (not already in Zone A)
        { id: '9', cityName: 'Jaipur', state: 'Rajasthan', zone: 'B', category: 'state_capital' },
        { id: '10', cityName: 'Lucknow', state: 'Uttar Pradesh', zone: 'B', category: 'state_capital' },
        { id: '11', cityName: 'Bhopal', state: 'Madhya Pradesh', zone: 'B', category: 'state_capital' },
        { id: '12', cityName: 'Gandhinagar', state: 'Gujarat', zone: 'B', category: 'state_capital' },
        { id: '13', cityName: 'Chandigarh', state: 'Punjab/Haryana', zone: 'B', category: 'state_capital' },
        { id: '14', cityName: 'Thiruvananthapuram', state: 'Kerala', zone: 'B', category: 'state_capital' },
        { id: '15', cityName: 'Panaji', state: 'Goa', zone: 'B', category: 'state_capital' },
        { id: '16', cityName: 'Shimla', state: 'Himachal Pradesh', zone: 'B', category: 'state_capital' },
        { id: '17', cityName: 'Dehradun', state: 'Uttarakhand', zone: 'B', category: 'state_capital' },
        { id: '18', cityName: 'Ranchi', state: 'Jharkhand', zone: 'B', category: 'state_capital' },
        { id: '19', cityName: 'Raipur', state: 'Chhattisgarh', zone: 'B', category: 'state_capital' },
        { id: '20', cityName: 'Patna', state: 'Bihar', zone: 'B', category: 'state_capital' },
        { id: '21', cityName: 'Dispur', state: 'Assam', zone: 'B', category: 'state_capital' },
        { id: '22', cityName: 'Bhubaneswar', state: 'Odisha', zone: 'B', category: 'state_capital' },
        
        // Zone C - Rest of India (Sample cities)
        { id: '23', cityName: 'Indore', state: 'Madhya Pradesh', zone: 'C', category: 'other' },
        { id: '24', cityName: 'Surat', state: 'Gujarat', zone: 'C', category: 'other' },
        { id: '25', cityName: 'Kanpur', state: 'Uttar Pradesh', zone: 'C', category: 'other' },
        { id: '26', cityName: 'Nagpur', state: 'Maharashtra', zone: 'C', category: 'other' },
        { id: '27', cityName: 'Visakhapatnam', state: 'Andhra Pradesh', zone: 'C', category: 'other' },
        { id: '28', cityName: 'Vadodara', state: 'Gujarat', zone: 'C', category: 'other' },
        { id: '29', cityName: 'Coimbatore', state: 'Tamil Nadu', zone: 'C', category: 'other' },
        { id: '30', cityName: 'Agra', state: 'Uttar Pradesh', zone: 'C', category: 'other' },
      ]
      setCities(mockCities)
    } catch (error) {
      toast.error('Error fetching cities')
    }
  }

  const fetchCityZones = async () => {
    try {
      setLoading(true)
      
      // Try to load from localStorage first
      let allCityZones = loadCityZonesFromStorage()
      
      if (!allCityZones) {
        // Initial mock data - only used if no saved data exists
        const mockCityZones: CityZone[] = [
        {
          id: '1',
          cityZoneName: 'Mumbai',
          motorSegmentId: '1',
          motorSegmentName: 'Private',
          zoneId: '1',
          zoneName: 'Zone A',
          cityZoneDescription: 'Mumbai city zone for private vehicles - Metropolitan area with high traffic density',
          isActive: true,
          createdBy: 'Admin',
          createdDate: '2024-01-15T00:00:00Z',
          createdProcName: 'SP_CREATE_CITY_ZONE_MASTER',
          updatedBy: 'Admin',
          updatedDate: '2024-01-20T00:00:00Z',
          activeFromDate: '2024-01-01',
          activeToDate: '2024-12-31',
        },
        {
          id: '2',
          cityZoneName: 'Delhi',
          motorSegmentId: '1',
          motorSegmentName: 'Private',
          zoneId: '1',
          zoneName: 'Zone A',
          cityZoneDescription: 'Delhi city zone for private vehicles - National capital region with heavy traffic',
          isActive: true,
          createdBy: 'Admin',
          createdDate: '2024-01-15T00:00:00Z',
          createdProcName: 'SP_CREATE_CITY_ZONE_MASTER',
          activeFromDate: '2024-01-01',
          activeToDate: '2024-12-31',
        },
        {
          id: '3',
          cityZoneName: 'Pune',
          motorSegmentId: '1',
          motorSegmentName: 'Private',
          zoneId: '2',
          zoneName: 'Zone B',
          cityZoneDescription: 'Pune city zone for private vehicles - Tier 2 city with moderate traffic',
          isActive: true,
          createdBy: 'Admin',
          createdDate: '2024-01-15T00:00:00Z',
          createdProcName: 'SP_CREATE_CITY_ZONE_MASTER',
          activeFromDate: '2024-01-01',
          activeToDate: '2024-12-31',
        },
        {
          id: '4',
          cityZoneName: 'Mumbai',
          motorSegmentId: '2',
          motorSegmentName: 'Commercial',
          zoneId: '3',
          zoneName: 'Zone A',
          cityZoneDescription: 'Mumbai city zone for commercial vehicles - Heavy commercial traffic area',
          isActive: true,
          createdBy: 'Admin',
          createdDate: '2024-01-15T00:00:00Z',
          createdProcName: 'SP_CREATE_CITY_ZONE_MASTER',
          activeFromDate: '2024-01-01',
          activeToDate: '2024-12-31',
        },
        {
          id: '5',
          cityZoneName: 'Jaipur',
          motorSegmentId: '2',
          motorSegmentName: 'Commercial',
          zoneId: '4',
          zoneName: 'Zone B - All State Capitals',
          cityZoneDescription: 'Jaipur city zone for commercial vehicles - State capital with moderate commercial traffic',
          isActive: true,
          createdBy: 'Admin',
          createdDate: '2024-01-15T00:00:00Z',
          createdProcName: 'SP_CREATE_CITY_ZONE_MASTER',
          activeFromDate: '2024-01-01',
          activeToDate: '2024-12-31',
        },
      ]
        
        // Save initial data to localStorage
        allCityZones = mockCityZones
        saveCityZonesToStorage(allCityZones)
      }

      // Apply filters
      let filteredCityZones = allCityZones
      if (searchTerm) {
        filteredCityZones = filteredCityZones.filter(
          (cityZone) =>
            cityZone.cityZoneName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cityZone.cityZoneDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cityZone.motorSegmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cityZone.zoneName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }
      if (filterStatus !== 'ALL') {
        filteredCityZones = filteredCityZones.filter((cityZone) => 
          filterStatus === 'ACTIVE' ? cityZone.isActive : !cityZone.isActive
        )
      }
      if (filterSegment !== 'ALL') {
        filteredCityZones = filteredCityZones.filter((cityZone) => cityZone.motorSegmentId === filterSegment)
      }
      if (filterZone !== 'ALL') {
        filteredCityZones = filteredCityZones.filter((cityZone) => cityZone.zoneId === filterZone)
      }

      // Pagination
      const startIndex = (currentPage - 1) * itemsPerPage
      const endIndex = startIndex + itemsPerPage
      const paginatedCityZones = filteredCityZones.slice(startIndex, endIndex)

      setCityZones(paginatedCityZones)
      setTotalPages(Math.ceil(filteredCityZones.length / itemsPerPage))
      setLoading(false)
    } catch (error) {
      toast.error('Error fetching city zones')
      setLoading(false)
    }
  }

  const getAvailableZones = (segmentId: string) => {
    return zones.filter(zone => zone.motorSegmentId === segmentId)
  }

  const getZoneForCity = (cityName: string, motorSegmentName: 'Private' | 'Commercial') => {
    const city = cities.find(c => c.cityName === cityName)
    if (!city) return null

    if (motorSegmentName === 'Private') {
      // Private: Zone A for 8 metropolitan cities, Zone B for rest
      return city.category === 'metropolitan' ? 'A' : 'B'
    } else {
      // Commercial: Zone A for 4 metros, Zone B for state capitals, Zone C for rest
      if (city.category === 'metropolitan' && 
          ['New Delhi', 'Mumbai', 'Chennai', 'Kolkata'].includes(city.cityName)) {
        return 'A'
      } else if (city.category === 'state_capital' || 
                 (city.category === 'metropolitan' && 
                  !['New Delhi', 'Mumbai', 'Chennai', 'Kolkata'].includes(city.cityName))) {
        return 'B'
      } else {
        return 'C'
      }
    }
  }

  const onSubmit = async (data: CityZoneForm) => {
    try {
      if (editingCityZone) {
        // Update existing city zone (mock implementation with state update)
        console.log('Updating city zone:', editingCityZone.id, data)
        
        // Find the selected zone and motor segment names for display
        const selectedZone = zones.find(z => z.id === data.zoneId)
        const selectedSegment = motorSegments.find(s => s.id === data.motorSegmentId)
        
        // Update the local state and localStorage immediately
        const allCityZones = loadCityZonesFromStorage() || []
        const updatedAllCityZones = allCityZones.map(cityZone => 
          cityZone.id === editingCityZone.id 
            ? {
                ...cityZone,
                cityZoneName: data.cityZoneName,
                motorSegmentId: data.motorSegmentId,
                motorSegmentName: selectedSegment?.motorSegmentName || cityZone.motorSegmentName,
                zoneId: data.zoneId,
                zoneName: selectedZone?.zoneName || cityZone.zoneName,
                cityZoneDescription: data.cityZoneDescription,
                isActive: data.isActive,
                activeFromDate: data.activeFromDate,
                activeToDate: data.activeToDate || '',
                updatedBy: 'Current User',
                updatedDate: new Date().toISOString(),
              }
            : cityZone
        )
        
        // Save to localStorage
        saveCityZonesToStorage(updatedAllCityZones)
        
        // Update the displayed state (this will be refreshed by fetchCityZones)
        fetchCityZones()
        
        // Simulate successful update
        toast.success(`City zone CZ-${editingCityZone.id.padStart(3, '0')} updated successfully`)
        
        // Log the update data for debugging
        console.log('Updated data:', {
          ...data,
          zoneName: selectedZone?.zoneName,
          motorSegmentName: selectedSegment?.motorSegmentName,
          updatedBy: 'Current User',
          updatedDate: new Date().toISOString(),
        })
      } else {
        // Create new city zone (mock implementation)
        const newId = (Math.max(...cityZones.map(cz => parseInt(cz.id))) + 1).toString()
        console.log('Creating new city zone:', newId, data)
        
        // Find the selected zone and motor segment names
        const selectedZone = zones.find(z => z.id === data.zoneId)
        const selectedSegment = motorSegments.find(s => s.id === data.motorSegmentId)
        
        // Add new city zone to state
        const newCityZone: CityZone = {
          id: newId,
          cityZoneName: data.cityZoneName,
          motorSegmentId: data.motorSegmentId,
          motorSegmentName: selectedSegment?.motorSegmentName || 'Private',
          zoneId: data.zoneId,
          zoneName: selectedZone?.zoneName || 'Zone A',
          cityZoneDescription: data.cityZoneDescription,
          isActive: data.isActive,
          createdBy: 'Current User',
          createdDate: new Date().toISOString(),
          createdProcName: 'SP_CREATE_CITY_ZONE_MASTER',
          activeFromDate: data.activeFromDate,
          activeToDate: data.activeToDate || '',
        }
        
        // Add to localStorage
        const allCityZones = loadCityZonesFromStorage() || []
        const updatedAllCityZones = [...allCityZones, newCityZone]
        saveCityZonesToStorage(updatedAllCityZones)
        
        // Refresh the displayed data
        fetchCityZones()
        
        toast.success(`City zone CZ-${newId.padStart(3, '0')} created successfully`)
      }

      setShowModal(false)
      setEditingCityZone(null)
      reset()
    } catch (error) {
      console.error('Error in onSubmit:', error)
      toast.error('An error occurred while processing the request')
    }
  }

  const handleEdit = (cityZone: CityZone) => {
    setEditingCityZone(cityZone)
    setSelectedSegment(cityZone.motorSegmentId)
    reset({
      cityZoneName: cityZone.cityZoneName,
      motorSegmentId: cityZone.motorSegmentId,
      zoneId: cityZone.zoneId,
      cityZoneDescription: cityZone.cityZoneDescription,
      isActive: cityZone.isActive,
      activeFromDate: cityZone.activeFromDate,
      activeToDate: cityZone.activeToDate || '',
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this city zone?')) {
      try {
        // Mock delete implementation with state update
        console.log('Deleting city zone:', id)
        
        // Remove from localStorage
        const allCityZones = loadCityZonesFromStorage() || []
        const updatedAllCityZones = allCityZones.filter(cityZone => cityZone.id !== id)
        saveCityZonesToStorage(updatedAllCityZones)
        
        // Refresh the displayed data
        fetchCityZones()
        
        toast.success(`City zone CZ-${id.padStart(3, '0')} deleted successfully`)
      } catch (error) {
        console.error('Error in handleDelete:', error)
        toast.error('An error occurred while deleting the city zone')
      }
    }
  }

  const getSegmentIcon = (segmentName: string) => {
    return segmentName === 'Private' ? (
      <TruckIcon className="h-4 w-4 text-blue-600" />
    ) : (
      <BuildingOfficeIcon className="h-4 w-4 text-orange-600" />
    )
  }

  const getZoneIcon = (zoneName: string) => {
    const zoneColors = {
      'Zone A': 'text-red-600',
      'Zone B': 'text-yellow-600',
      'Zone C': 'text-green-600',
    }
    return (
      <MapPinIcon className={`h-4 w-4 ${zoneColors[zoneName as keyof typeof zoneColors] || 'text-gray-600'}`} />
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="mb-6">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            <li>
              <button onClick={() => router.push('/dashboard')} className="text-gray-400 hover:text-gray-500">
                Dashboard
              </button>
            </li>
            <li>
              <div className="flex items-center">
                <span className="text-gray-400">/</span>
                <button onClick={() => router.push('/dashboard/irdai')} className="ml-4 text-gray-400 hover:text-gray-500">
                  IRDAI Master
                </button>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="text-gray-400">/</span>
                <span className="ml-4 text-gray-900 font-medium">City Zone Master</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      {/* Page header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">IRDAI City Zone Master</h1>
            <p className="mt-1 text-sm text-secondary-600">
              Manage city-wise zone assignments based on motor segments and zones.
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setEditingCityZone(null)
              setSelectedSegment('')
              reset()
              setShowModal(true)
            }}
            className="btn btn-primary btn-md"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add City Zone
          </button>
          <button
            onClick={resetCityZonesData}
            className="btn btn-secondary btn-md"
            title="Reset data to initial values (clears all changes)"
          >
            Reset Data
          </button>
        </div>
      </div>

      {/* Filters and search */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
              <input
                type="text"
                placeholder="Search city zones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterSegment}
              onChange={(e) => setFilterSegment(e.target.value)}
              className="input"
            >
              <option value="ALL">All Segments</option>
              {motorSegments.map((segment) => (
                <option key={segment.id} value={segment.id}>
                  {segment.motorSegmentName}
                </option>
              ))}
            </select>
            <select
              value={filterZone}
              onChange={(e) => setFilterZone(e.target.value)}
              className="input"
            >
              <option value="ALL">All Zones</option>
              {zones.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.zoneName}
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
            <button className="btn btn-secondary btn-md">
              <FunnelIcon className="h-4 w-4 mr-2" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* City Zones table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-head">City Zone ID</th>
                <th className="table-head">City Name</th>
                <th className="table-head">Motor Segment</th>
                <th className="table-head">Zone</th>
                <th className="table-head">Description</th>
                <th className="table-head">Status</th>
                <th className="table-head">Created By</th>
                <th className="table-head">Created Date</th>
                <th className="table-head">Active Period</th>
                <th className="table-head">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {loading ? (
                <tr>
                  <td colSpan={10} className="table-cell text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                  </td>
                </tr>
              ) : cityZones.length === 0 ? (
                <tr>
                  <td colSpan={10} className="table-cell text-center py-8 text-secondary-500">
                    No city zones found
                  </td>
                </tr>
              ) : (
                cityZones.map((cityZone) => (
                  <tr key={cityZone.id} className="table-row">
                    <td className="table-cell font-medium">CZ-{cityZone.id.padStart(3, '0')}</td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        <BuildingLibraryIcon className="h-4 w-4 text-purple-600" />
                        <span className="font-medium">{cityZone.cityZoneName}</span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        {getSegmentIcon(cityZone.motorSegmentName)}
                        <span className="font-medium">{cityZone.motorSegmentName}</span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        {getZoneIcon(cityZone.zoneName)}
                        <span className="font-medium">{cityZone.zoneName}</span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="max-w-xs truncate" title={cityZone.cityZoneDescription}>
                        {cityZone.cityZoneDescription}
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        cityZone.isActive 
                          ? 'bg-success-100 text-success-800' 
                          : 'bg-danger-100 text-danger-800'
                      }`}>
                        {cityZone.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="table-cell">{cityZone.createdBy}</td>
                    <td className="table-cell">{formatDate(cityZone.createdDate)}</td>
                    <td className="table-cell">
                      <div className="text-xs">
                        <div>From: {cityZone.activeFromDate}</div>
                        {cityZone.activeToDate && <div>To: {cityZone.activeToDate}</div>}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(cityZone)}
                          className="text-primary-600 hover:text-primary-900"
                          title="Edit city zone"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cityZone.id)}
                          className="text-danger-600 hover:text-danger-900"
                          title="Delete city zone"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                        <button
                          className="text-secondary-600 hover:text-secondary-900"
                          title="View details"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-secondary-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="btn btn-secondary btn-sm"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="btn btn-secondary btn-sm"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-secondary-700">
                  Showing page <span className="font-medium">{currentPage}</span> of{' '}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-secondary-300 bg-white text-sm font-medium text-secondary-500 hover:bg-secondary-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-secondary-300 bg-white text-sm font-medium text-secondary-500 hover:bg-secondary-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-secondary-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-secondary-900 mb-4">
                {editingCityZone ? 'Edit City Zone' : 'Add New City Zone'}
              </h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700">City Zone Name</label>
                  <select {...register('cityZoneName')} className="input mt-1">
                    <option value="">Select City</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.cityName}>
                        {city.cityName}
                      </option>
                    ))}
                  </select>
                  {errors.cityZoneName && (
                    <p className="text-danger-600 text-xs mt-1">{errors.cityZoneName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700">Motor Segment</label>
                  <select 
                    {...register('motorSegmentId')} 
                    className="input mt-1"
                    onChange={(e) => setSelectedSegment(e.target.value)}
                  >
                    <option value="">Select Motor Segment</option>
                    {motorSegments.map((segment) => (
                      <option key={segment.id} value={segment.id}>
                        {segment.motorSegmentName}
                      </option>
                    ))}
                  </select>
                  {errors.motorSegmentId && (
                    <p className="text-danger-600 text-xs mt-1">{errors.motorSegmentId.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700">Zone</label>
                  <select {...register('zoneId')} className="input mt-1">
                    <option value="">Select Zone</option>
                    {getAvailableZones(watchedSegmentId || selectedSegment).map((zone) => (
                      <option key={zone.id} value={zone.id}>
                        {zone.zoneName}
                      </option>
                    ))}
                  </select>
                  {errors.zoneId && (
                    <p className="text-danger-600 text-xs mt-1">{errors.zoneId.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700">Description</label>
                  <textarea
                    {...register('cityZoneDescription')}
                    rows={3}
                    className="input mt-1"
                    placeholder="Enter city zone description"
                  />
                  {errors.cityZoneDescription && (
                    <p className="text-danger-600 text-xs mt-1">{errors.cityZoneDescription.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700">Active From Date</label>
                  <input
                    {...register('activeFromDate')}
                    type="date"
                    className="input mt-1"
                  />
                  {errors.activeFromDate && (
                    <p className="text-danger-600 text-xs mt-1">{errors.activeFromDate.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700">Active To Date (Optional)</label>
                  <input
                    {...register('activeToDate')}
                    type="date"
                    className="input mt-1"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    {...register('isActive')}
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-secondary-900">
                    Is Active
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn btn-secondary btn-md"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-md">
                    {editingCityZone ? 'Update' : 'Create'}
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
