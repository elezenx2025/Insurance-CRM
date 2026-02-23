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
  TruckIcon,
  BuildingOfficeIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

const motorSegmentSchema = z.object({
  motorSegmentName: z.enum(['Private', 'Commercial']),
  motorSegmentDescription: z.string().min(1, 'Description is required'),
  isActive: z.boolean().default(true),
  activeFromDate: z.string().min(1, 'Active from date is required'),
  activeToDate: z.string().optional(),
})

type MotorSegmentForm = z.infer<typeof motorSegmentSchema>

interface MotorSegment {
  id: string
  motorSegmentName: 'Private' | 'Commercial'
  motorSegmentDescription: string
  isActive: boolean
  createdBy: string
  createdDate: string
  createdProcName: string
  updatedBy?: string
  updatedDate?: string
  activeFromDate: string
  activeToDate?: string
}

export default function MotorSegmentPage() {
  const router = useRouter()
  const [motorSegments, setMotorSegments] = useState<MotorSegment[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingSegment, setEditingSegment] = useState<MotorSegment | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 10

  const handleBack = () => {
    router.push('/dashboard/irdai')
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(motorSegmentSchema),
  })

  useEffect(() => {
    fetchMotorSegments()
  }, [currentPage, searchTerm, filterStatus])

  const fetchMotorSegments = async () => {
    try {
      setLoading(true)
      // Mock data - replace with actual API call
      const mockSegments: MotorSegment[] = [
        {
          id: '1',
          motorSegmentName: 'Private',
          motorSegmentDescription: 'Private motor vehicles including cars, two-wheelers, and personal vehicles',
          isActive: true,
          createdBy: 'Admin',
          createdDate: '2024-01-15T00:00:00Z',
          createdProcName: 'SP_CREATE_MOTOR_SEGMENT',
          updatedBy: 'Admin',
          updatedDate: '2024-01-20T00:00:00Z',
          activeFromDate: '2024-01-01',
          activeToDate: '2024-12-31',
        },
        {
          id: '2',
          motorSegmentName: 'Commercial',
          motorSegmentDescription: 'Commercial motor vehicles including trucks, buses, taxis, and goods carriers',
          isActive: true,
          createdBy: 'Admin',
          createdDate: '2024-01-15T00:00:00Z',
          createdProcName: 'SP_CREATE_MOTOR_SEGMENT',
          activeFromDate: '2024-01-01',
          activeToDate: '2024-12-31',
        },
      ]

      // Apply filters
      let filteredSegments = mockSegments
      if (searchTerm) {
        filteredSegments = filteredSegments.filter(
          (segment) =>
            segment.motorSegmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            segment.motorSegmentDescription.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }
      if (filterStatus !== 'ALL') {
        filteredSegments = filteredSegments.filter((segment) => 
          filterStatus === 'ACTIVE' ? segment.isActive : !segment.isActive
        )
      }

      // Pagination
      const startIndex = (currentPage - 1) * itemsPerPage
      const endIndex = startIndex + itemsPerPage
      const paginatedSegments = filteredSegments.slice(startIndex, endIndex)

      setMotorSegments(paginatedSegments)
      setTotalPages(Math.ceil(filteredSegments.length / itemsPerPage))
      setLoading(false)
    } catch (error) {
      toast.error('Error fetching motor segments')
      setLoading(false)
    }
  }

  const onSubmit = async (data: MotorSegmentForm) => {
    try {
      if (editingSegment) {
        // Update existing segment (mock implementation with state update)
        console.log('Updating motor segment:', editingSegment.id, data)
        
        // Update the local state immediately
        setMotorSegments(prevSegments => 
          prevSegments.map(segment => 
            segment.id === editingSegment.id 
              ? {
                  ...segment,
                  motorSegmentName: data.motorSegmentName,
                  motorSegmentDescription: data.motorSegmentDescription,
                  isActive: data.isActive,
                  activeFromDate: data.activeFromDate,
                  activeToDate: data.activeToDate || '',
                  updatedBy: 'Current User',
                  updatedDate: new Date().toISOString(),
                }
              : segment
          )
        )
        
        toast.success(`Motor segment MS-${editingSegment.id.padStart(3, '0')} updated successfully`)
      } else {
        // Create new segment (mock implementation)
        const newId = (Math.max(...motorSegments.map(ms => parseInt(ms.id))) + 1).toString()
        console.log('Creating new motor segment:', newId, data)
        
        // Add new segment to state
        const newSegment: MotorSegment = {
          id: newId,
          motorSegmentName: data.motorSegmentName,
          motorSegmentDescription: data.motorSegmentDescription,
          isActive: data.isActive,
          createdBy: 'Current User',
          createdDate: new Date().toISOString(),
          createdProcName: 'SP_CREATE_MOTOR_SEGMENT',
          activeFromDate: data.activeFromDate,
          activeToDate: data.activeToDate || '',
        }
        
        setMotorSegments(prevSegments => [...prevSegments, newSegment])
        
        toast.success(`Motor segment MS-${newId.padStart(3, '0')} created successfully`)
      }

      setShowModal(false)
      setEditingSegment(null)
      reset()
    } catch (error) {
      console.error('Error in onSubmit:', error)
      toast.error('An error occurred while processing the request')
    }
  }

  const handleEdit = (segment: MotorSegment) => {
    setEditingSegment(segment)
    reset({
      motorSegmentName: segment.motorSegmentName,
      motorSegmentDescription: segment.motorSegmentDescription,
      isActive: segment.isActive,
      activeFromDate: segment.activeFromDate,
      activeToDate: segment.activeToDate || '',
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this motor segment?')) {
      try {
        // Mock delete implementation with state update
        console.log('Deleting motor segment:', id)
        
        // Remove from local state immediately
        setMotorSegments(prevSegments => 
          prevSegments.filter(segment => segment.id !== id)
        )
        
        toast.success(`Motor segment MS-${id.padStart(3, '0')} deleted successfully`)
      } catch (error) {
        console.error('Error in handleDelete:', error)
        toast.error('An error occurred while deleting the motor segment')
      }
    }
  }

  const getSegmentIcon = (segmentName: string) => {
    return segmentName === 'Private' ? (
      <TruckIcon className="h-5 w-5 text-blue-600" />
    ) : (
      <BuildingOfficeIcon className="h-5 w-5 text-orange-600" />
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
                <span className="ml-4 text-gray-900 font-medium">Motor Segment</span>
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
            <h1 className="text-2xl font-bold text-secondary-900">IRDAI Motor Segment</h1>
            <p className="mt-1 text-sm text-secondary-600">
              Manage motor insurance segments (Private and Commercial).
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setEditingSegment(null)
            reset()
            setShowModal(true)
          }}
          className="btn btn-primary btn-md"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Motor Segment
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
                placeholder="Search motor segments..."
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
            <button className="btn btn-secondary btn-md">
              <FunnelIcon className="h-4 w-4 mr-2" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Motor Segments table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-head">Segment ID</th>
                <th className="table-head">Segment Name</th>
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
                  <td colSpan={8} className="table-cell text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                  </td>
                </tr>
              ) : motorSegments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="table-cell text-center py-8 text-secondary-500">
                    No motor segments found
                  </td>
                </tr>
              ) : (
                motorSegments.map((segment) => (
                  <tr key={segment.id} className="table-row">
                    <td className="table-cell font-medium">MS-{segment.id.padStart(3, '0')}</td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        {getSegmentIcon(segment.motorSegmentName)}
                        <span className="font-medium">{segment.motorSegmentName}</span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="max-w-xs truncate" title={segment.motorSegmentDescription}>
                        {segment.motorSegmentDescription}
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        segment.isActive 
                          ? 'bg-success-100 text-success-800' 
                          : 'bg-danger-100 text-danger-800'
                      }`}>
                        {segment.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="table-cell">{segment.createdBy}</td>
                    <td className="table-cell">{formatDate(segment.createdDate)}</td>
                    <td className="table-cell">
                      <div className="text-xs">
                        <div>From: {segment.activeFromDate}</div>
                        {segment.activeToDate && <div>To: {segment.activeToDate}</div>}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(segment)}
                          className="text-primary-600 hover:text-primary-900"
                          title="Edit segment"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(segment.id)}
                          className="text-danger-600 hover:text-danger-900"
                          title="Delete segment"
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
                {editingSegment ? 'Edit Motor Segment' : 'Add New Motor Segment'}
              </h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700">Motor Segment Name</label>
                  <select {...register('motorSegmentName')} className="input mt-1">
                    <option value="">Select Segment</option>
                    <option value="Private">Private</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                  {errors.motorSegmentName && (
                    <p className="text-danger-600 text-xs mt-1">{errors.motorSegmentName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700">Description</label>
                  <textarea
                    {...register('motorSegmentDescription')}
                    rows={3}
                    className="input mt-1"
                    placeholder="Enter segment description"
                  />
                  {errors.motorSegmentDescription && (
                    <p className="text-danger-600 text-xs mt-1">{errors.motorSegmentDescription.message}</p>
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
                    {editingSegment ? 'Update' : 'Create'}
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
