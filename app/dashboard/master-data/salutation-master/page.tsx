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
  UserIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const salutationSchema = z.object({
  salutationId: z.string().min(1, 'Salutation ID is required'),
  salutationName: z.string().min(1, 'Salutation Name is required'),
  salutationDescription: z.string().optional(),
  isActive: z.boolean(),
  createdBy: z.string().min(1, 'Created By is required'),
  createdDate: z.string().min(1, 'Created Date is required'),
  createdProcName: z.string().min(1, 'Created Proc Name is required'),
  updatedBy: z.string().optional(),
  updatedDate: z.string().optional(),
  activeFromDate: z.string().min(1, 'Active From Date is required'),
  activeToDate: z.string().optional(),
})

type SalutationForm = z.infer<typeof salutationSchema>

interface Salutation {
  id: string
  salutationId: string
  salutationName: string
  salutationDescription?: string
  isActive: boolean
  createdBy: string
  createdDate: string
  createdProcName: string
  updatedBy?: string
  updatedDate?: string
  activeFromDate: string
  activeToDate?: string
}

export default function SalutationMasterPage() {
  const router = useRouter()
  const [salutations, setSalutations] = useState<Salutation[]>([])
  const [filteredSalutations, setFilteredSalutations] = useState<Salutation[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingSalutation, setEditingSalutation] = useState<Salutation | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SalutationForm>({
    resolver: zodResolver(salutationSchema),
  })

  // Mock data
  useEffect(() => {
    const mockData: Salutation[] = [
      {
        id: '1',
        salutationId: 'SAL001',
        salutationName: 'Mr.',
        salutationDescription: 'Mister - for adult males',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_SALUTATION_INSERT',
        updatedBy: 'Admin',
        updatedDate: '2024-01-15',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '2',
        salutationId: 'SAL002',
        salutationName: 'Mrs.',
        salutationDescription: 'Missus - for married females',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_SALUTATION_INSERT',
        updatedBy: 'Admin',
        updatedDate: '2024-01-15',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '3',
        salutationId: 'SAL003',
        salutationName: 'Ms.',
        salutationDescription: 'Miss - for unmarried females',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_SALUTATION_INSERT',
        updatedBy: 'Admin',
        updatedDate: '2024-01-15',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '4',
        salutationId: 'SAL004',
        salutationName: 'Dr.',
        salutationDescription: 'Doctor - for medical professionals',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_SALUTATION_INSERT',
        updatedBy: 'Admin',
        updatedDate: '2024-01-15',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '5',
        salutationId: 'SAL005',
        salutationName: 'Prof.',
        salutationDescription: 'Professor - for academic professionals',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_SALUTATION_INSERT',
        updatedBy: 'Admin',
        updatedDate: '2024-01-15',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
    ]
    setSalutations(mockData)
  }, [])

  // Filter data based on search term
  useEffect(() => {
    let filtered = salutations

    if (searchTerm) {
      filtered = filtered.filter(salutation =>
        salutation.salutationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        salutation.salutationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        salutation.salutationDescription?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredSalutations(filtered)
  }, [salutations, searchTerm])

  const handleAddSalutation = () => {
    setEditingSalutation(null)
    reset({
      salutationId: '',
      salutationName: '',
      salutationDescription: '',
      isActive: true,
      createdBy: 'Current User',
      createdDate: new Date().toISOString().split('T')[0],
      createdProcName: 'PROC_SALUTATION_INSERT',
      updatedBy: '',
      updatedDate: '',
      activeFromDate: new Date().toISOString().split('T')[0],
      activeToDate: '',
    })
    setShowModal(true)
  }

  const handleEditSalutation = (salutation: Salutation) => {
    setEditingSalutation(salutation)
    reset({
      salutationId: salutation.salutationId,
      salutationName: salutation.salutationName,
      salutationDescription: salutation.salutationDescription || '',
      isActive: salutation.isActive,
      createdBy: salutation.createdBy,
      createdDate: salutation.createdDate,
      createdProcName: salutation.createdProcName,
      updatedBy: salutation.updatedBy || '',
      updatedDate: salutation.updatedDate || '',
      activeFromDate: salutation.activeFromDate,
      activeToDate: salutation.activeToDate || '',
    })
    setShowModal(true)
  }

  const onSubmit = (data: SalutationForm) => {
    if (editingSalutation) {
      // Update existing salutation
      setSalutations(prev =>
        prev.map(salutation =>
          salutation.id === editingSalutation.id
            ? {
                ...salutation,
                ...data,
                updatedBy: 'Current User',
                updatedDate: new Date().toISOString().split('T')[0],
              }
            : salutation
        )
      )
      toast.success('Salutation updated successfully!')
    } else {
      // Add new salutation
      const newSalutation: Salutation = {
        id: Date.now().toString(),
        ...data,
      }
      setSalutations(prev => [...prev, newSalutation])
      toast.success('Salutation added successfully!')
    }
    setShowModal(false)
    reset()
  }

  const handleDeleteSalutation = (id: string) => {
    if (confirm('Are you sure you want to delete this salutation?')) {
      setSalutations(prev => prev.filter(salutation => salutation.id !== id))
      toast.success('Salutation deleted successfully!')
    }
  }

  const totalPages = Math.ceil(filteredSalutations.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentSalutations = filteredSalutations.slice(startIndex, endIndex)

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
                <span className="ml-4 text-gray-900 font-medium">Salutation Master</span>
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
            <h1 className="text-lg font-semibold text-gray-900">Salutation Master</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage salutation titles for customer names
            </p>
          </div>
        </div>
        <button
          onClick={handleAddSalutation}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Salutation
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
                placeholder="Search salutations..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {filteredSalutations.length} salutations
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
                  Salutation ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Salutation Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
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
              {currentSalutations.map((salutation) => (
                <tr key={salutation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {salutation.salutationId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {salutation.salutationName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {salutation.salutationDescription || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      salutation.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {salutation.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditSalutation(salutation)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSalutation(salutation.id)}
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
                  <span className="font-medium">{Math.min(endIndex, filteredSalutations.length)}</span> of{' '}
                  <span className="font-medium">{filteredSalutations.length}</span> results
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
                {editingSalutation ? 'Edit Salutation' : 'Add New Salutation'}
              </h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Salutation ID *</label>
                    <input
                      {...register('salutationId')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.salutationId && <p className="text-red-500 text-xs mt-1">{errors.salutationId.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Salutation Name *</label>
                    <input
                      {...register('salutationName')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.salutationName && <p className="text-red-500 text-xs mt-1">{errors.salutationName.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salutation Description</label>
                  <textarea
                    {...register('salutationDescription')}
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
                    {editingSalutation ? 'Update' : 'Add'} Salutation
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



