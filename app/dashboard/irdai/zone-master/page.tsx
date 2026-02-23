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
  MapPinIcon,
  TruckIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const zoneSchema = z.object({
  motorSegmentId: z.string().min(1, 'Motor segment is required'),
  zoneName: z.string().min(1, 'Zone name is required'),
  zoneDescription: z.string().min(1, 'Description is required'),
  isActive: z.boolean().default(true),
  activeFromDate: z.string().min(1, 'Active from date is required'),
  activeToDate: z.string().optional(),
})

type ZoneForm = z.infer<typeof zoneSchema>

interface MotorSegment {
  id: string
  motorSegmentName: 'Private' | 'Commercial'
}

interface Zone {
  id: string
  motorSegmentId: string
  motorSegmentName: 'Private' | 'Commercial'
  zoneName: string
  zoneDescription: string
  isActive: boolean
  createdBy: string
  createdDate: string
  createdProcName: string
  updatedBy?: string
  updatedDate?: string
  activeFromDate: string
  activeToDate?: string
}

export default function ZoneMasterPage() {
  const router = useRouter()
  const [zones, setZones] = useState<Zone[]>([])
  const [motorSegments, setMotorSegments] = useState<MotorSegment[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingZone, setEditingZone] = useState<Zone | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [filterSegment, setFilterSegment] = useState('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedSegment, setSelectedSegment] = useState<string>('')
  const itemsPerPage = 10

  const handleBack = () => {
    router.push('/dashboard/irdai')
  }

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(zoneSchema),
  })

  const watchedSegmentId = watch('motorSegmentId')

  useEffect(() => {
    fetchMotorSegments()
    fetchZones()
  }, [currentPage, searchTerm, filterStatus, filterSegment])

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
      setLoading(true)
      // Mock data - replace with actual API call
      const mockZones: Zone[] = [
        {
          id: '1',
          motorSegmentId: '1',
          motorSegmentName: 'Private',
          zoneName: 'Zone A',
          zoneDescription: 'Private vehicle zone A - Metropolitan cities and high-density areas',
          isActive: true,
          createdBy: 'Admin',
          createdDate: '2024-01-15T00:00:00Z',
          createdProcName: 'SP_CREATE_ZONE_MASTER',
          updatedBy: 'Admin',
          updatedDate: '2024-01-20T00:00:00Z',
          activeFromDate: '2024-01-01',
          activeToDate: '2024-12-31',
        },
        {
          id: '2',
          motorSegmentId: '1',
          motorSegmentName: 'Private',
          zoneName: 'Zone B',
          zoneDescription: 'Private vehicle zone B - Tier 2 cities and suburban areas',
          isActive: true,
          createdBy: 'Admin',
          createdDate: '2024-01-15T00:00:00Z',
          createdProcName: 'SP_CREATE_ZONE_MASTER',
          activeFromDate: '2024-01-01',
          activeToDate: '2024-12-31',
        },
        {
          id: '3',
          motorSegmentId: '2',
          motorSegmentName: 'Commercial',
          zoneName: 'Zone A',
          zoneDescription: 'Commercial vehicle zone A - Heavy traffic metropolitan areas',
          isActive: true,
          createdBy: 'Admin',
          createdDate: '2024-01-15T00:00:00Z',
          createdProcName: 'SP_CREATE_ZONE_MASTER',
          activeFromDate: '2024-01-01',
          activeToDate: '2024-12-31',
        },
        {
          id: '4',
          motorSegmentId: '2',
          motorSegmentName: 'Commercial',
          zoneName: 'Zone B',
          zoneDescription: 'Commercial vehicle zone B - Moderate traffic urban areas',
          isActive: true,
          createdBy: 'Admin',
          createdDate: '2024-01-15T00:00:00Z',
          createdProcName: 'SP_CREATE_ZONE_MASTER',
          activeFromDate: '2024-01-01',
          activeToDate: '2024-12-31',
        },
        {
          id: '5',
          motorSegmentId: '2',
          motorSegmentName: 'Commercial',
          zoneName: 'Zone C',
          zoneDescription: 'Commercial vehicle zone C - Rural and low traffic areas',
          isActive: true,
          createdBy: 'Admin',
          createdDate: '2024-01-15T00:00:00Z',
          createdProcName: 'SP_CREATE_ZONE_MASTER',
          activeFromDate: '2024-01-01',
          activeToDate: '2024-12-31',
        },
      ]

      // Apply filters
      let filteredZones = mockZones
      if (searchTerm) {
        filteredZones = filteredZones.filter(
          (zone) =>
            zone.zoneName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            zone.zoneDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
            zone.motorSegmentName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }
      if (filterStatus !== 'ALL') {
        filteredZones = filteredZones.filter((zone) => 
          filterStatus === 'ACTIVE' ? zone.isActive : !zone.isActive
        )
      }
      if (filterSegment !== 'ALL') {
        filteredZones = filteredZones.filter((zone) => zone.motorSegmentId === filterSegment)
      }

      // Pagination
      const startIndex = (currentPage - 1) * itemsPerPage
      const endIndex = startIndex + itemsPerPage
      const paginatedZones = filteredZones.slice(startIndex, endIndex)

      setZones(paginatedZones)
      setTotalPages(Math.ceil(filteredZones.length / itemsPerPage))
      setLoading(false)
    } catch (error) {
      toast.error('Error fetching zones')
      setLoading(false)
    }
  }

  const getAvailableZones = (segmentId: string) => {
    const segment = motorSegments.find(s => s.id === segmentId)
    if (!segment) return []
    
    if (segment.motorSegmentName === 'Private') {
      return [
        'Zone A - 8 Metropolitan Cities (Delhi, Mumbai, Chennai, Kolkata, Pune, Ahmedabad, Bangalore, Hyderabad)',
        'Zone B - Rest of India'
      ]
    } else {
      return [
        'Zone A - 4 Metropolitan Cities (Delhi, Mumbai, Chennai, Kolkata)',
        'Zone B - All State Capitals',
        'Zone C - Rest of India'
      ]
    }
  }

  const onSubmit = async (data: ZoneForm) => {
    try {
      if (editingZone) {
        // Update existing zone (mock implementation with state update)
        console.log('Updating zone:', editingZone.id, data)
        const selectedSegment = motorSegments.find(s => s.id === data.motorSegmentId)
        
        // Update the local state immediately
        setZones(prevZones => 
          prevZones.map(zone => 
            zone.id === editingZone.id 
              ? {
                  ...zone,
                  motorSegmentId: data.motorSegmentId,
                  motorSegmentName: selectedSegment?.motorSegmentName || zone.motorSegmentName,
                  zoneName: data.zoneName,
                  zoneDescription: data.zoneDescription,
                  isActive: data.isActive,
                  activeFromDate: data.activeFromDate,
                  activeToDate: data.activeToDate || '',
                  updatedBy: 'Current User',
                  updatedDate: new Date().toISOString(),
                }
              : zone
          )
        )
        
        toast.success(`Zone ZN-${editingZone.id.padStart(3, '0')} updated successfully`)
        
        // Log the update data for debugging
        console.log('Updated data:', {
          ...data,
          motorSegmentName: selectedSegment?.motorSegmentName,
          updatedBy: 'Current User',
          updatedDate: new Date().toISOString(),
        })
      } else {
        // Create new zone (mock implementation)
        const newId = (Math.max(...zones.map(z => parseInt(z.id))) + 1).toString()
        console.log('Creating new zone:', newId, data)
        
        const selectedSegment = motorSegments.find(s => s.id === data.motorSegmentId)
        
        // Add new zone to state
        const newZone: Zone = {
          id: newId,
          motorSegmentId: data.motorSegmentId,
          motorSegmentName: selectedSegment?.motorSegmentName || 'Private',
          zoneName: data.zoneName,
          zoneDescription: data.zoneDescription,
          isActive: data.isActive,
          createdBy: 'Current User',
          createdDate: new Date().toISOString(),
          createdProcName: 'SP_CREATE_ZONE_MASTER',
          activeFromDate: data.activeFromDate,
          activeToDate: data.activeToDate || '',
        }
        
        setZones(prevZones => [...prevZones, newZone])
        
        toast.success(`Zone ZN-${newId.padStart(3, '0')} created successfully`)
      }

      setShowModal(false)
      setEditingZone(null)
      reset()
    } catch (error) {
      console.error('Error in onSubmit:', error)
      toast.error('An error occurred while processing the request')
    }
  }

  const handleEdit = (zone: Zone) => {
    setEditingZone(zone)
    setSelectedSegment(zone.motorSegmentId)
    reset({
      motorSegmentId: zone.motorSegmentId,
      zoneName: zone.zoneName,
      zoneDescription: zone.zoneDescription,
      isActive: zone.isActive,
      activeFromDate: zone.activeFromDate,
      activeToDate: zone.activeToDate || '',
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this zone?')) {
      try {
        // Mock delete implementation with state update
        console.log('Deleting zone:', id)
        
        // Remove from local state immediately
        setZones(prevZones => 
          prevZones.filter(zone => zone.id !== id)
        )
        
        toast.success(`Zone ZN-${id.padStart(3, '0')} deleted successfully`)
      } catch (error) {
        console.error('Error in handleDelete:', error)
        toast.error('An error occurred while deleting the zone')
      }
    }
  }

  const getZoneIcon = (zoneName: string) => {
    const zoneColors = {
      'Zone A': 'text-red-600',
      'Zone B': 'text-yellow-600',
      'Zone C': 'text-green-600',
    }
    return (
      <MapPinIcon className={`h-5 w-5 ${zoneColors[zoneName as keyof typeof zoneColors] || 'text-gray-600'}`} />
    )
  }

  const getSegmentIcon = (segmentName: string) => {
    return segmentName === 'Private' ? (
      <TruckIcon className="h-4 w-4 text-blue-600" />
    ) : (
      <BuildingOfficeIcon className="h-4 w-4 text-orange-600" />
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
                <span className="ml-4 text-gray-900 font-medium">Zone Master</span>
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
            <h1 className="text-2xl font-bold text-secondary-900">IRDAI Zone Master</h1>
            <p className="mt-1 text-sm text-secondary-600">
              Manage insurance zones based on motor segments (Private: A, B | Commercial: A, B, C).
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setEditingZone(null)
            setSelectedSegment('')
            reset()
            setShowModal(true)
          }}
          className="btn btn-primary btn-md"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Zone
        </button>
      </div>

      {/* Filters and search */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
              <input
                type="text"
                placeholder="Search zones..."
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

      {/* Zones table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-head">Zone ID</th>
                <th className="table-head">Motor Segment</th>
                <th className="table-head">Zone Name</th>
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
                  <td colSpan={9} className="table-cell text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                  </td>
                </tr>
              ) : zones.length === 0 ? (
                <tr>
                  <td colSpan={9} className="table-cell text-center py-8 text-secondary-500">
                    No zones found
                  </td>
                </tr>
              ) : (
                zones.map((zone) => (
                  <tr key={zone.id} className="table-row">
                    <td className="table-cell font-medium">ZN-{zone.id.padStart(3, '0')}</td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        {getSegmentIcon(zone.motorSegmentName)}
                        <span className="font-medium">{zone.motorSegmentName}</span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        {getZoneIcon(zone.zoneName)}
                        <span className="font-medium">{zone.zoneName}</span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="max-w-xs truncate" title={zone.zoneDescription}>
                        {zone.zoneDescription}
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        zone.isActive 
                          ? 'bg-success-100 text-success-800' 
                          : 'bg-danger-100 text-danger-800'
                      }`}>
                        {zone.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="table-cell">{zone.createdBy}</td>
                    <td className="table-cell">{formatDate(zone.createdDate)}</td>
                    <td className="table-cell">
                      <div className="text-xs">
                        <div>From: {zone.activeFromDate}</div>
                        {zone.activeToDate && <div>To: {zone.activeToDate}</div>}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(zone)}
                          className="text-primary-600 hover:text-primary-900"
                          title="Edit zone"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(zone.id)}
                          className="text-danger-600 hover:text-danger-900"
                          title="Delete zone"
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
                {editingZone ? 'Edit Zone' : 'Add New Zone'}
              </h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                  <label className="block text-sm font-medium text-secondary-700">Zone Name</label>
                  <select {...register('zoneName')} className="input mt-1">
                    <option value="">Select Zone</option>
                    {getAvailableZones(watchedSegmentId || selectedSegment).map((zone) => (
                      <option key={zone} value={zone}>
                        {zone}
                      </option>
                    ))}
                  </select>
                  {errors.zoneName && (
                    <p className="text-danger-600 text-xs mt-1">{errors.zoneName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700">Description</label>
                  <textarea
                    {...register('zoneDescription')}
                    rows={3}
                    className="input mt-1"
                    placeholder="Enter zone description"
                  />
                  {errors.zoneDescription && (
                    <p className="text-danger-600 text-xs mt-1">{errors.zoneDescription.message}</p>
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
                    {editingZone ? 'Update' : 'Create'}
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
