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
  DocumentArrowUpIcon,
  CloudArrowDownIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const dataUploadSchema = z.object({
  dataType: z.string().min(1, 'Data type is required'),
  file: z.any().refine((file) => file && file.length > 0, 'File is required'),
  description: z.string().min(1, 'Description is required'),
})

type DataUploadForm = z.infer<typeof dataUploadSchema>

interface MasterDataItem {
  id: string
  type: string
  name: string
  description: string
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING'
  uploadedBy: string
  uploadedAt: string
  recordCount: number
}

const DATA_TYPES = [
  'Insurance Companies',
  'Product Categories',
  'Policy Types',
  'Coverage Types',
  'Premium Rates',
  'Commission Structure',
  'State-wise Regulations',
  'City-wise Pincodes',
  'Bank Details',
  'Payment Gateways',
  'User Roles',
  'Permissions',
  'Training Modules',
  'Certificate Templates',
]

export default function MasterDataManagement() {
  const [dataItems, setDataItems] = useState<MasterDataItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('ALL')
  const [filterStatus, setFilterStatus] = useState('ALL')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DataUploadForm>({
    resolver: zodResolver(dataUploadSchema),
  })

  useEffect(() => {
    fetchMasterData()
  }, [])

  const fetchMasterData = async () => {
    try {
      setLoading(true)
      // Mock data - replace with actual API call
      const mockData: MasterDataItem[] = [
        {
          id: '1',
          type: 'Insurance Companies',
          name: 'Insurance_Companies_Master.csv',
          description: 'Complete list of registered insurance companies in India',
          status: 'ACTIVE',
          uploadedBy: 'Admin User',
          uploadedAt: '2024-01-15T10:30:00Z',
          recordCount: 67,
        },
        {
          id: '2',
          type: 'Product Categories',
          name: 'Product_Categories_Master.json',
          description: 'Insurance product categories and subcategories',
          status: 'ACTIVE',
          uploadedBy: 'Admin User',
          uploadedAt: '2024-01-20T14:15:00Z',
          recordCount: 45,
        },
        {
          id: '3',
          type: 'Premium Rates',
          name: 'Premium_Rates_2024.xlsx',
          description: 'Current premium rates for all insurance products',
          status: 'PENDING',
          uploadedBy: 'Admin User',
          uploadedAt: '2024-02-01T09:45:00Z',
          recordCount: 1250,
        },
        {
          id: '4',
          type: 'State-wise Regulations',
          name: 'State_Regulations_Master.csv',
          description: 'State-specific insurance regulations and compliance requirements',
          status: 'ACTIVE',
          uploadedBy: 'Admin User',
          uploadedAt: '2024-01-10T16:20:00Z',
          recordCount: 36,
        },
        {
          id: '5',
          type: 'Bank Details',
          name: 'Bank_Details_Master.csv',
          description: 'Bank details for payment processing and settlements',
          status: 'ACTIVE',
          uploadedBy: 'Admin User',
          uploadedAt: '2024-01-05T11:30:00Z',
          recordCount: 89,
        },
      ]

      // Apply filters
      let filteredData = mockData
      if (searchTerm) {
        filteredData = filteredData.filter(
          (item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }
      if (filterType !== 'ALL') {
        filteredData = filteredData.filter((item) => item.type === filterType)
      }
      if (filterStatus !== 'ALL') {
        filteredData = filteredData.filter((item) => item.status === filterStatus)
      }

      setDataItems(filteredData)
    } catch (error) {
      console.error('Error fetching master data:', error)
      toast.error('Failed to fetch master data')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: DataUploadForm) => {
    try {
      // Simulate file upload
      const formData = new FormData()
      formData.append('dataType', data.dataType)
      formData.append('file', data.file[0])
      formData.append('description', data.description)

      // Simulate API call
      setTimeout(() => {
        toast.success('Master data uploaded successfully!')
        setShowUploadModal(false)
        reset()
        fetchMasterData()
      }, 1000)
    } catch (error) {
      console.error('Error uploading data:', error)
      toast.error('Failed to upload master data')
    }
  }

  const handleDownload = (item: MasterDataItem) => {
    toast.success(`Downloading ${item.name}...`)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this master data item?')) {
      try {
        setDataItems(dataItems.filter((item) => item.id !== id))
        toast.success('Master data item deleted successfully')
      } catch (error) {
        console.error('Error deleting data:', error)
        toast.error('Failed to delete master data item')
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800'
      case 'INACTIVE':
        return 'bg-red-100 text-red-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-secondary-100 text-secondary-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
          <h1 className="text-2xl font-bold text-gray-900">Master Data Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Upload and manage master data files for the insurance system.
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="btn btn-primary btn-md"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Upload Data
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
                placeholder="Search master data..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input"
            >
              <option value="ALL">All Types</option>
              {DATA_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
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
              <option value="PENDING">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Master Data Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-head">Type</th>
                <th className="table-head">File Name</th>
                <th className="table-head">Description</th>
                <th className="table-head">Status</th>
                <th className="table-head">Records</th>
                <th className="table-head">Uploaded By</th>
                <th className="table-head">Uploaded At</th>
                <th className="table-head">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {dataItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="table-cell text-center py-8 text-gray-500">
                    No master data found
                  </td>
                </tr>
              ) : (
                dataItems.map((item) => (
                  <tr key={item.id} className="table-row">
                    <td className="table-cell font-medium">{item.type}</td>
                    <td className="table-cell">{item.name}</td>
                    <td className="table-cell">{item.description}</td>
                    <td className="table-cell">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="table-cell">{item.recordCount.toLocaleString('en-IN')}</td>
                    <td className="table-cell">{item.uploadedBy}</td>
                    <td className="table-cell">{formatDate(item.uploadedAt)}</td>
                    <td className="table-cell">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDownload(item)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Download"
                        >
                          <CloudArrowDownIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => toast('Edit functionality coming soon')}
                          className="text-green-600 hover:text-green-900"
                          title="Edit"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
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

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Upload Master Data
              </h3>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data Type *
                  </label>
                  <select
                    {...register('dataType')}
                    className="input"
                  >
                    <option value="">Select Data Type</option>
                    {DATA_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.dataType && (
                    <p className="text-red-600 text-xs mt-1">{errors.dataType.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    File *
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            type="file"
                            className="sr-only"
                            accept=".csv,.xlsx,.xls,.json"
                            {...register('file')}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">CSV, XLSX, JSON up to 10MB</p>
                    </div>
                  </div>
                  {errors.file && (
                    <p className="text-red-600 text-xs mt-1">{(errors.file as any)?.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    {...register('description')}
                    rows={3}
                    className="input"
                    placeholder="Describe the data being uploaded..."
                  ></textarea>
                  {errors.description && (
                    <p className="text-red-600 text-xs mt-1">{errors.description.message}</p>
                  )}
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUploadModal(false)
                      reset()
                    }}
                    className="btn btn-secondary btn-md"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-md">
                    Upload Data
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


















