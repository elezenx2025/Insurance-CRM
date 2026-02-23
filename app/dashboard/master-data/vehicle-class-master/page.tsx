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
  TruckIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const vehicleClassSchema = z.object({
  vehClassId: z.string().min(1, 'Vehicle Class ID is required'),
  vehClassName: z.string().min(1, 'Vehicle Class Name is required'),
  vehClassDescription: z.string().min(1, 'Description is required'),
  isActive: z.boolean().default(true),
  createdBy: z.string().min(1, 'Created By is required'),
  createdProcName: z.string().min(1, 'Created Proc Name is required'),
  activeFromDate: z.string().min(1, 'Active From Date is required'),
  activeToDate: z.string().min(1, 'Active To Date is required'),
})

type VehicleClassForm = z.infer<typeof vehicleClassSchema>

interface VehicleClass {
  id: string
  vehClassId: string
  vehClassName: string
  vehClassDescription: string
  isActive: boolean
  createdBy: string
  createdDate: string
  createdProcName: string
  updatedBy?: string
  updatedDate?: string
  activeFromDate: string
  activeToDate: string
}

export default function VehicleClassMaster() {
  const [vehicleClasses, setVehicleClasses] = useState<VehicleClass[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingClass, setEditingClass] = useState<VehicleClass | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('ALL')

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(vehicleClassSchema),
    defaultValues: {
      isActive: true,
      createdBy: 'Admin',
      createdProcName: 'PROC_VEHCLASS_INSERT',
    },
  })

  useEffect(() => {
    fetchVehicleClasses()
  }, [])

  const fetchVehicleClasses = async () => {
    try {
      setLoading(true)
      // Mock data - replace with actual API call
      const mockData: VehicleClass[] = [
        {
          id: '1',
          vehClassId: 'VEHCLS001',
          vehClassName: 'Private',
          vehClassDescription: 'Private vehicles for personal use including cars, two-wheelers, and other personal vehicles',
          isActive: true,
          createdBy: 'Admin',
          createdDate: '2024-01-15T10:30:00Z',
          createdProcName: 'PROC_VEHCLASS_INSERT',
          updatedBy: 'Admin',
          updatedDate: '2024-01-15T10:30:00Z',
          activeFromDate: '2024-01-01',
          activeToDate: '2025-12-31',
        },
        {
          id: '2',
          vehClassId: 'VEHCLS002',
          vehClassName: 'Commercial',
          vehClassDescription: 'Commercial vehicles used for business purposes including goods carriers, passenger vehicles, and heavy vehicles',
          isActive: true,
          createdBy: 'Admin',
          createdDate: '2024-01-15T10:30:00Z',
          createdProcName: 'PROC_VEHCLASS_INSERT',
          updatedBy: 'Admin',
          updatedDate: '2024-01-15T10:30:00Z',
          activeFromDate: '2024-01-01',
          activeToDate: '2025-12-31',
        },
      ]
      setVehicleClasses(mockData)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching vehicle classes:', error)
      toast.error('Failed to fetch vehicle classes')
      setLoading(false)
    }
  }

  const onSubmit = async (data: VehicleClassForm) => {
    try {
      if (editingClass) {
        const updatedClass = {
          ...editingClass,
          ...data,
          updatedBy: 'Admin',
          updatedDate: new Date().toISOString(),
        }
        setVehicleClasses(vehicleClasses.map((vc) => (vc.id === updatedClass.id ? updatedClass : vc)))
        toast.success('Vehicle Class updated successfully!')
      } else {
        const newClass: VehicleClass = {
          id: String(vehicleClasses.length + 1),
          ...data,
          createdDate: new Date().toISOString(),
          updatedDate: new Date().toISOString(),
        }
        setVehicleClasses([...vehicleClasses, newClass])
        toast.success('Vehicle Class created successfully!')
      }

      setShowModal(false)
      reset()
      setEditingClass(null)
    } catch (error) {
      console.error('Error saving vehicle class:', error)
      toast.error('Failed to save vehicle class')
    }
  }

  const openAddModal = () => {
    reset({
      isActive: true,
      createdBy: 'Admin',
      createdProcName: 'PROC_VEHCLASS_INSERT',
      activeFromDate: new Date().toISOString().split('T')[0],
      activeToDate: '2025-12-31',
    })
    setEditingClass(null)
    setShowModal(true)
  }

  const openEditModal = (vehicleClass: VehicleClass) => {
    setEditingClass(vehicleClass)
    setValue('vehClassId', vehicleClass.vehClassId)
    setValue('vehClassName', vehicleClass.vehClassName)
    setValue('vehClassDescription', vehicleClass.vehClassDescription)
    setValue('isActive', vehicleClass.isActive)
    setValue('createdBy', vehicleClass.createdBy)
    setValue('createdProcName', vehicleClass.createdProcName)
    setValue('activeFromDate', vehicleClass.activeFromDate)
    setValue('activeToDate', vehicleClass.activeToDate)
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this vehicle class?')) {
      try {
        setVehicleClasses(vehicleClasses.filter((vc) => vc.id !== id))
        toast.success('Vehicle Class deleted successfully')
      } catch (error) {
        console.error('Error deleting vehicle class:', error)
        toast.error('Failed to delete vehicle class')
      }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  // Filter data
  const filteredClasses = vehicleClasses.filter((vc) => {
    const matchesSearch =
      vc.vehClassName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vc.vehClassId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vc.vehClassDescription.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      filterStatus === 'ALL' ||
      (filterStatus === 'ACTIVE' && vc.isActive) ||
      (filterStatus === 'INACTIVE' && !vc.isActive)

    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vehicle Class Master</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage vehicle class types and classifications.
          </p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary btn-md">
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Vehicle Class
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
                placeholder="Search vehicle classes..."
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

      {/* Vehicle Classes Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-head">VehClass ID</th>
                <th className="table-head">VehClass Name</th>
                <th className="table-head">Description</th>
                <th className="table-head">Status</th>
                <th className="table-head">Created By</th>
                <th className="table-head">Created Date</th>
                <th className="table-head">Active From</th>
                <th className="table-head">Active To</th>
                <th className="table-head">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {filteredClasses.length === 0 ? (
                <tr>
                  <td colSpan={9} className="table-cell text-center py-8 text-gray-500">
                    No vehicle classes found
                  </td>
                </tr>
              ) : (
                filteredClasses.map((vehicleClass) => (
                  <tr key={vehicleClass.id} className="table-row">
                    <td className="table-cell">
                      <span className="text-sm font-mono text-gray-600">{vehicleClass.vehClassId}</span>
                    </td>
                    <td className="table-cell">
                      <div className="font-medium text-gray-900">{vehicleClass.vehClassName}</div>
                    </td>
                    <td className="table-cell">
                      <div className="text-sm text-gray-600 max-w-xs truncate">
                        {vehicleClass.vehClassDescription}
                      </div>
                    </td>
                    <td className="table-cell">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          vehicleClass.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {vehicleClass.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className="text-sm">{vehicleClass.createdBy}</span>
                    </td>
                    <td className="table-cell">
                      <span className="text-sm">{formatDate(vehicleClass.createdDate)}</span>
                    </td>
                    <td className="table-cell">
                      <span className="text-sm">{vehicleClass.activeFromDate}</span>
                    </td>
                    <td className="table-cell">
                      <span className="text-sm">{vehicleClass.activeToDate}</span>
                    </td>
                    <td className="table-cell">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditModal(vehicleClass)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(vehicleClass.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <TrashIcon className="h-5 w-5" />
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

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-3xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingClass ? 'Edit Vehicle Class' : 'Add Vehicle Class'}
              </h3>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      VehClass ID *
                    </label>
                    <input
                      type="text"
                      {...register('vehClassId')}
                      className="input"
                      placeholder="e.g., VEHCLS001"
                    />
                    {errors.vehClassId && (
                      <p className="text-red-600 text-xs mt-1">{errors.vehClassId.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      VehClass Name *
                    </label>
                    <input
                      type="text"
                      {...register('vehClassName')}
                      className="input"
                      placeholder="e.g., Private, Commercial"
                    />
                    {errors.vehClassName && (
                      <p className="text-red-600 text-xs mt-1">{errors.vehClassName.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      {...register('vehClassDescription')}
                      className="input"
                      rows={3}
                      placeholder="Enter vehicle class description"
                    />
                    {errors.vehClassDescription && (
                      <p className="text-red-600 text-xs mt-1">
                        {errors.vehClassDescription.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Created By *
                    </label>
                    <input
                      type="text"
                      {...register('createdBy')}
                      className="input"
                      placeholder="Enter creator name"
                    />
                    {errors.createdBy && (
                      <p className="text-red-600 text-xs mt-1">{errors.createdBy.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Created Proc Name *
                    </label>
                    <input
                      type="text"
                      {...register('createdProcName')}
                      className="input"
                      placeholder="e.g., PROC_VEHCLASS_INSERT"
                    />
                    {errors.createdProcName && (
                      <p className="text-red-600 text-xs mt-1">{errors.createdProcName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Active From Date *
                    </label>
                    <input
                      type="date"
                      {...register('activeFromDate')}
                      className="input"
                    />
                    {errors.activeFromDate && (
                      <p className="text-red-600 text-xs mt-1">{errors.activeFromDate.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Active To Date *
                    </label>
                    <input
                      type="date"
                      {...register('activeToDate')}
                      className="input"
                    />
                    {errors.activeToDate && (
                      <p className="text-red-600 text-xs mt-1">{errors.activeToDate.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('isActive')}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">Active</label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      setEditingClass(null)
                      reset()
                    }}
                    className="btn btn-secondary btn-md"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-md">
                    {editingClass ? 'Update Vehicle Class' : 'Create Vehicle Class'}
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
