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
  TruckIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const vehicleTypeSchema = z.object({
  vehicleTypeId: z.string().min(1, 'Vehicle Type ID is required'),
  vehicleClassId: z.string().min(1, 'Vehicle Class ID is required'),
  vehicleClassName: z.string().min(1, 'Vehicle Class Name is required'),
  vehicleTypeName: z.string().min(1, 'Vehicle Type Name is required'),
  vehicleSubTypeId: z.string().min(1, 'Vehicle Sub-Type ID is required'),
  vehicleSubTypeName: z.string().min(1, 'Vehicle Sub-Type Name is required'),
  vehicleTypeDescription: z.string().optional(),
  vehicleSubTypeDescription: z.string().optional(),
  isActive: z.boolean(),
  createdBy: z.string().min(1, 'Created By is required'),
  createdDate: z.string().min(1, 'Created Date is required'),
  createdProcName: z.string().min(1, 'Created Proc Name is required'),
  updatedBy: z.string().optional(),
  updatedDate: z.string().optional(),
  activeFromDate: z.string().min(1, 'Active From Date is required'),
  activeToDate: z.string().optional(),
})

type VehicleTypeForm = z.infer<typeof vehicleTypeSchema>

interface VehicleType {
  id: string
  vehicleTypeId: string
  vehicleClassId: string
  vehicleClassName: string
  vehicleTypeName: string
  vehicleSubTypeId: string
  vehicleSubTypeName: string
  vehicleTypeDescription?: string
  vehicleSubTypeDescription?: string
  isActive: boolean
  createdBy: string
  createdDate: string
  createdProcName: string
  updatedBy?: string
  updatedDate?: string
  activeFromDate: string
  activeToDate?: string
}

export default function VehicleTypeMasterPage() {
  const router = useRouter()
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([])
  const [filteredVehicleTypes, setFilteredVehicleTypes] = useState<VehicleType[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingVehicleType, setEditingVehicleType] = useState<VehicleType | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VehicleTypeForm>({
    resolver: zodResolver(vehicleTypeSchema),
  })

  // Mock data
  useEffect(() => {
      const mockData: VehicleType[] = [
        // Private Car Types
        {
          id: '1',
          vehicleTypeId: 'VT001',
          vehicleClassId: 'VEHCLS001',
          vehicleClassName: 'Private',
          vehicleTypeName: 'Private Car',
          vehicleSubTypeId: 'VST001',
          vehicleSubTypeName: 'Hatchback',
          vehicleTypeDescription: 'Private passenger vehicles',
          vehicleSubTypeDescription: 'Small passenger cars with rear door',
          isActive: true,
          createdBy: 'Admin',
          createdDate: '2024-01-01',
          createdProcName: 'PROC_VEHICLE_TYPE_INSERT',
          updatedBy: 'Admin',
          updatedDate: '2024-01-15',
          activeFromDate: '2024-01-01',
          activeToDate: '2025-12-31',
        },
        {
          id: '2',
          vehicleTypeId: 'VT001',
          vehicleClassId: 'VEHCLS001',
          vehicleClassName: 'Private',
          vehicleTypeName: 'Private Car',
          vehicleSubTypeId: 'VST002',
          vehicleSubTypeName: 'Sedan',
          vehicleTypeDescription: 'Private passenger vehicles',
          vehicleSubTypeDescription: 'Four-door passenger cars',
          isActive: true,
          createdBy: 'Admin',
          createdDate: '2024-01-01',
          createdProcName: 'PROC_VEHICLE_TYPE_INSERT',
          updatedBy: 'Admin',
          updatedDate: '2024-01-15',
          activeFromDate: '2024-01-01',
          activeToDate: '2025-12-31',
        },
        {
          id: '3',
          vehicleTypeId: 'VT001',
          vehicleClassId: 'VEHCLS001',
          vehicleClassName: 'Private',
          vehicleTypeName: 'Private Car',
          vehicleSubTypeId: 'VST003',
          vehicleSubTypeName: 'SUV',
          vehicleTypeDescription: 'Private passenger vehicles',
          vehicleSubTypeDescription: 'Sport Utility Vehicles',
          isActive: true,
          createdBy: 'Admin',
          createdDate: '2024-01-01',
          createdProcName: 'PROC_VEHICLE_TYPE_INSERT',
          updatedBy: 'Admin',
          updatedDate: '2024-01-15',
          activeFromDate: '2024-01-01',
          activeToDate: '2025-12-31',
        },
        // Two Wheeler Types
        {
          id: '4',
          vehicleTypeId: 'VT002',
          vehicleClassId: 'VEHCLS001',
          vehicleClassName: 'Private',
          vehicleTypeName: 'Two Wheeler',
          vehicleSubTypeId: 'VST004',
          vehicleSubTypeName: 'Motorcycle',
          vehicleTypeDescription: 'Two-wheeled motor vehicles',
          vehicleSubTypeDescription: 'Motorcycles with engine capacity above 50cc',
          isActive: true,
          createdBy: 'Admin',
          createdDate: '2024-01-01',
          createdProcName: 'PROC_VEHICLE_TYPE_INSERT',
          updatedBy: 'Admin',
          updatedDate: '2024-01-15',
          activeFromDate: '2024-01-01',
          activeToDate: '2025-12-31',
        },
        {
          id: '5',
          vehicleTypeId: 'VT002',
          vehicleClassId: 'VEHCLS001',
          vehicleClassName: 'Private',
          vehicleTypeName: 'Two Wheeler',
          vehicleSubTypeId: 'VST005',
          vehicleSubTypeName: 'Scooter',
          vehicleTypeDescription: 'Two-wheeled motor vehicles',
          vehicleSubTypeDescription: 'Scooters with step-through design',
          isActive: true,
          createdBy: 'Admin',
          createdDate: '2024-01-01',
          createdProcName: 'PROC_VEHICLE_TYPE_INSERT',
          updatedBy: 'Admin',
          updatedDate: '2024-01-15',
          activeFromDate: '2024-01-01',
          activeToDate: '2025-12-31',
        },
        // Commercial Vehicle Types - NEW
        {
          id: '6',
          vehicleTypeId: 'VEHTYPE001',
          vehicleClassId: 'VEHCLS002',
          vehicleClassName: 'Commercial',
          vehicleTypeName: 'PCV',
          vehicleSubTypeId: 'VST006',
          vehicleSubTypeName: 'Passenger Carrying Vehicles',
          vehicleTypeDescription: 'Vehicles designed for carrying passengers',
          vehicleSubTypeDescription: 'Buses, coaches, minibuses, and other passenger transport vehicles',
          isActive: true,
          createdBy: 'Admin',
          createdDate: '2024-01-01',
          createdProcName: 'PROC_VEHICLE_TYPE_INSERT',
          updatedBy: 'Admin',
          updatedDate: '2024-01-15',
          activeFromDate: '2024-01-01',
          activeToDate: '2025-12-31',
        },
        {
          id: '7',
          vehicleTypeId: 'VEHTYPE002',
          vehicleClassId: 'VEHCLS002',
          vehicleClassName: 'Commercial',
          vehicleTypeName: 'GCV',
          vehicleSubTypeId: 'VST007',
          vehicleSubTypeName: 'Good Carrying Vehicles',
          vehicleTypeDescription: 'Vehicles designed for transporting goods and cargo',
          vehicleSubTypeDescription: 'Trucks, lorries, tempos, and other goods transport vehicles',
          isActive: true,
          createdBy: 'Admin',
          createdDate: '2024-01-01',
          createdProcName: 'PROC_VEHICLE_TYPE_INSERT',
          updatedBy: 'Admin',
          updatedDate: '2024-01-15',
          activeFromDate: '2024-01-01',
          activeToDate: '2025-12-31',
        },
        {
          id: '8',
          vehicleTypeId: 'VEHTYPE003',
          vehicleClassId: 'VEHCLS002',
          vehicleClassName: 'Commercial',
          vehicleTypeName: 'Misc-D',
          vehicleSubTypeId: 'VST008',
          vehicleSubTypeName: 'Miscellaneous D Vehicles',
          vehicleTypeDescription: 'Miscellaneous special purpose vehicles',
          vehicleSubTypeDescription: 'Tractors, ambulances, heavy earth movers, and other special vehicles',
          isActive: true,
          createdBy: 'Admin',
          createdDate: '2024-01-01',
          createdProcName: 'PROC_VEHICLE_TYPE_INSERT',
          updatedBy: 'Admin',
          updatedDate: '2024-01-15',
          activeFromDate: '2024-01-01',
          activeToDate: '2025-12-31',
        },
      ]
    setVehicleTypes(mockData)
  }, [])

  // Filter data based on search term
  useEffect(() => {
    let filtered = vehicleTypes

    if (searchTerm) {
      filtered = filtered.filter(vehicleType =>
        vehicleType.vehicleTypeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicleType.vehicleSubTypeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicleType.vehicleTypeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicleType.vehicleSubTypeId.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredVehicleTypes(filtered)
  }, [vehicleTypes, searchTerm])

  const handleAddVehicleType = () => {
    setEditingVehicleType(null)
    reset({
      vehicleTypeId: '',
      vehicleTypeName: '',
      vehicleSubTypeId: '',
      vehicleSubTypeName: '',
      vehicleTypeDescription: '',
      vehicleSubTypeDescription: '',
      isActive: true,
      createdBy: 'Current User',
      createdDate: new Date().toISOString().split('T')[0],
      createdProcName: 'PROC_VEHICLE_TYPE_INSERT',
      updatedBy: '',
      updatedDate: '',
      activeFromDate: new Date().toISOString().split('T')[0],
      activeToDate: '',
    })
    setShowModal(true)
  }

  const handleEditVehicleType = (vehicleType: VehicleType) => {
    setEditingVehicleType(vehicleType)
    reset({
      vehicleTypeId: vehicleType.vehicleTypeId,
      vehicleClassId: vehicleType.vehicleClassId,
      vehicleClassName: vehicleType.vehicleClassName,
      vehicleTypeName: vehicleType.vehicleTypeName,
      vehicleSubTypeId: vehicleType.vehicleSubTypeId,
      vehicleSubTypeName: vehicleType.vehicleSubTypeName,
      vehicleTypeDescription: vehicleType.vehicleTypeDescription || '',
      vehicleSubTypeDescription: vehicleType.vehicleSubTypeDescription || '',
      isActive: vehicleType.isActive,
      createdBy: vehicleType.createdBy,
      createdDate: vehicleType.createdDate,
      createdProcName: vehicleType.createdProcName,
      updatedBy: vehicleType.updatedBy || '',
      updatedDate: vehicleType.updatedDate || '',
      activeFromDate: vehicleType.activeFromDate,
      activeToDate: vehicleType.activeToDate || '',
    })
    setShowModal(true)
  }

  const onSubmit = (data: VehicleTypeForm) => {
    if (editingVehicleType) {
      // Update existing vehicle type
      setVehicleTypes(prev =>
        prev.map(vehicleType =>
          vehicleType.id === editingVehicleType.id
            ? {
                ...vehicleType,
                ...data,
                updatedBy: 'Current User',
                updatedDate: new Date().toISOString().split('T')[0],
              }
            : vehicleType
        )
      )
      toast.success('Vehicle Type updated successfully!')
    } else {
      // Add new vehicle type
      const newVehicleType: VehicleType = {
        id: Date.now().toString(),
        ...data,
      }
      setVehicleTypes(prev => [...prev, newVehicleType])
      toast.success('Vehicle Type added successfully!')
    }
    setShowModal(false)
    reset()
  }

  const handleDeleteVehicleType = (id: string) => {
    if (confirm('Are you sure you want to delete this vehicle type?')) {
      setVehicleTypes(prev => prev.filter(vehicleType => vehicleType.id !== id))
      toast.success('Vehicle Type deleted successfully!')
    }
  }

  const totalPages = Math.ceil(filteredVehicleTypes.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentVehicleTypes = filteredVehicleTypes.slice(startIndex, endIndex)

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
                <button onClick={() => router.push('/dashboard/master-data')} className="ml-4 text-gray-400 hover:text-gray-500">
                  Master Data
                </button>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="text-gray-400">/</span>
                <span className="ml-4 text-gray-900 font-medium">Vehicle Type Master</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      {/* Page header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/dashboard/master-data')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Vehicle Type Master</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage vehicle types and sub-types
            </p>
          </div>
        </div>
        <button
          onClick={handleAddVehicleType}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Vehicle Type
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search vehicle types..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {filteredVehicleTypes.length} vehicle types
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle Type ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle Class ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sub-Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sub-Type Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentVehicleTypes.map((vehicleType) => (
                <tr key={vehicleType.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                    {vehicleType.vehicleTypeId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                    {vehicleType.vehicleClassId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                    {vehicleType.vehicleClassName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {vehicleType.vehicleTypeName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {vehicleType.vehicleSubTypeName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {vehicleType.vehicleTypeDescription || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {vehicleType.vehicleSubTypeDescription || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      vehicleType.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {vehicleType.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditVehicleType(vehicleType)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteVehicleType(vehicleType.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(endIndex, filteredVehicleTypes.length)}</span> of{' '}
                  <span className="font-medium">{filteredVehicleTypes.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === page
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingVehicleType ? 'Edit Vehicle Type' : 'Add New Vehicle Type'}
              </h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type ID *</label>
                    <input
                      {...register('vehicleTypeId')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., VEHTYPE001"
                    />
                    {errors.vehicleTypeId && <p className="text-red-500 text-xs mt-1">{errors.vehicleTypeId.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Class ID *</label>
                    <input
                      {...register('vehicleClassId')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., VEHCLS002"
                    />
                    {errors.vehicleClassId && <p className="text-red-500 text-xs mt-1">{errors.vehicleClassId.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Class Name *</label>
                    <input
                      {...register('vehicleClassName')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Commercial"
                    />
                    {errors.vehicleClassName && <p className="text-red-500 text-xs mt-1">{errors.vehicleClassName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type Name *</label>
                    <input
                      {...register('vehicleTypeName')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., PCV, GCV, Misc-D"
                    />
                    {errors.vehicleTypeName && <p className="text-red-500 text-xs mt-1">{errors.vehicleTypeName.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Sub-Type ID *</label>
                    <input
                      {...register('vehicleSubTypeId')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.vehicleSubTypeId && <p className="text-red-500 text-xs mt-1">{errors.vehicleSubTypeId.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Sub-Type Name *</label>
                    <input
                      {...register('vehicleSubTypeName')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.vehicleSubTypeName && <p className="text-red-500 text-xs mt-1">{errors.vehicleSubTypeName.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type Description</label>
                  <textarea
                    {...register('vehicleTypeDescription')}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Sub-Type Description</label>
                  <textarea
                    {...register('vehicleSubTypeDescription')}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Created By *</label>
                    <input
                      {...register('createdBy')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.createdBy && <p className="text-red-500 text-xs mt-1">{errors.createdBy.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Created Date *</label>
                    <input
                      {...register('createdDate')}
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.createdDate && <p className="text-red-500 text-xs mt-1">{errors.createdDate.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Created Proc Name *</label>
                    <input
                      {...register('createdProcName')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.createdProcName && <p className="text-red-500 text-xs mt-1">{errors.createdProcName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Updated By</label>
                    <input
                      {...register('updatedBy')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Updated Date</label>
                    <input
                      {...register('updatedDate')}
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Active From Date *</label>
                    <input
                      {...register('activeFromDate')}
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.activeFromDate && <p className="text-red-500 text-xs mt-1">{errors.activeFromDate.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Active To Date</label>
                    <input
                      {...register('activeToDate')}
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    {...register('isActive')}
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">Is Active</label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    {editingVehicleType ? 'Update' : 'Add'} Vehicle Type
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



