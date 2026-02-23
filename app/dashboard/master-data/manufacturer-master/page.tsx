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
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const manufacturerSchema = z.object({
  oemId: z.string().min(1, 'OEM ID is required'),
  oemName: z.string().min(1, 'OEM Name is required'),
  oemDescription: z.string().optional(),
  isActive: z.boolean(),
  createdBy: z.string().min(1, 'Created By is required'),
  createdDate: z.string().min(1, 'Created Date is required'),
  createdProcName: z.string().min(1, 'Created Proc Name is required'),
  updatedBy: z.string().optional(),
  updatedDate: z.string().optional(),
  activeFromDate: z.string().min(1, 'Active From Date is required'),
  activeToDate: z.string().optional(),
})

type ManufacturerForm = z.infer<typeof manufacturerSchema>

interface Manufacturer {
  id: string
  oemId: string
  oemName: string
  oemDescription?: string
  isActive: boolean
  createdBy: string
  createdDate: string
  createdProcName: string
  updatedBy?: string
  updatedDate?: string
  activeFromDate: string
  activeToDate?: string
}

export default function ManufacturerMasterPage() {
  const router = useRouter()
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([])
  const [filteredManufacturers, setFilteredManufacturers] = useState<Manufacturer[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingManufacturer, setEditingManufacturer] = useState<Manufacturer | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ManufacturerForm>({
    resolver: zodResolver(manufacturerSchema),
  })

  // Mock data
  useEffect(() => {
    const mockData: Manufacturer[] = [
      // 2-Wheeler Manufacturers
      {
        id: '1',
        oemId: 'OEM001',
        oemName: 'Hero MotoCorp',
        oemDescription: '2-Wheeler - Leading two-wheeler manufacturer in India',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MANUFACTURER_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '2',
        oemId: 'OEM002',
        oemName: 'Honda Motorcycle',
        oemDescription: '2-Wheeler - Japanese motorcycle manufacturer',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MANUFACTURER_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '3',
        oemId: 'OEM003',
        oemName: 'Bajaj Auto',
        oemDescription: '2-Wheeler - Indian two-wheeler and three-wheeler manufacturer',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MANUFACTURER_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '4',
        oemId: 'OEM004',
        oemName: 'TVS Motor',
        oemDescription: '2-Wheeler - Indian two-wheeler manufacturer',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MANUFACTURER_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '5',
        oemId: 'OEM005',
        oemName: 'Royal Enfield',
        oemDescription: '2-Wheeler - Premium motorcycle manufacturer',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MANUFACTURER_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '6',
        oemId: 'OEM006',
        oemName: 'Yamaha',
        oemDescription: '2-Wheeler - Japanese motorcycle manufacturer',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MANUFACTURER_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '7',
        oemId: 'OEM007',
        oemName: 'Suzuki Motorcycle',
        oemDescription: '2-Wheeler - Japanese motorcycle manufacturer',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MANUFACTURER_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      // Private Car Manufacturers
      {
        id: '8',
        oemId: 'OEM008',
        oemName: 'Maruti Suzuki',
        oemDescription: 'Private Car - Leading automobile manufacturer in India',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MANUFACTURER_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '9',
        oemId: 'OEM009',
        oemName: 'Hyundai',
        oemDescription: 'Private Car - Korean automobile manufacturer',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MANUFACTURER_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '10',
        oemId: 'OEM010',
        oemName: 'Tata Motors',
        oemDescription: 'Private Car - Indian automobile manufacturer',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MANUFACTURER_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '11',
        oemId: 'OEM011',
        oemName: 'Honda Cars',
        oemDescription: 'Private Car - Japanese automobile manufacturer',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MANUFACTURER_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '12',
        oemId: 'OEM012',
        oemName: 'Mahindra',
        oemDescription: 'Private Car - Indian automobile manufacturer',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MANUFACTURER_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '13',
        oemId: 'OEM013',
        oemName: 'Kia',
        oemDescription: 'Private Car - Korean automobile manufacturer',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MANUFACTURER_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '14',
        oemId: 'OEM014',
        oemName: 'MG Motor',
        oemDescription: 'Private Car - British automobile manufacturer',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MANUFACTURER_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '15',
        oemId: 'OEM015',
        oemName: 'Toyota',
        oemDescription: 'Private Car - Japanese automobile manufacturer',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MANUFACTURER_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      // PCV Manufacturers
      {
        id: '16',
        oemId: 'OEM016',
        oemName: 'Tata Motors (PCV)',
        oemDescription: 'PCV - Passenger Carrying Vehicle manufacturer',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MANUFACTURER_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '17',
        oemId: 'OEM017',
        oemName: 'Ashok Leyland (PCV)',
        oemDescription: 'PCV - Passenger Carrying Vehicle manufacturer',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MANUFACTURER_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '18',
        oemId: 'OEM018',
        oemName: 'Mahindra (PCV)',
        oemDescription: 'PCV - Passenger Carrying Vehicle manufacturer',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MANUFACTURER_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '19',
        oemId: 'OEM019',
        oemName: 'Force Motors (PCV)',
        oemDescription: 'PCV - Passenger Carrying Vehicle manufacturer',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MANUFACTURER_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '31',
        oemId: 'OEM031',
        oemName: 'Eicher (PCV)',
        oemDescription: 'PCV - Passenger bus manufacturer',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MANUFACTURER_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '32',
        oemId: 'OEM032',
        oemName: 'SML Isuzu (PCV)',
        oemDescription: 'PCV - Bus and commercial vehicle manufacturer',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MANUFACTURER_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '33',
        oemId: 'OEM033',
        oemName: 'Marcopolo (PCV)',
        oemDescription: 'PCV - Premium bus body builder',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MANUFACTURER_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '34',
        oemId: 'OEM034',
        oemName: 'Volvo Buses',
        oemDescription: 'PCV - Premium luxury bus manufacturer',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MANUFACTURER_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '35',
        oemId: 'OEM035',
        oemName: 'Scania (PCV)',
        oemDescription: 'PCV - Premium bus manufacturer',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MANUFACTURER_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '36',
        oemId: 'OEM036',
        oemName: 'Mercedes-Benz (PCV)',
        oemDescription: 'PCV - Luxury bus manufacturer',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MANUFACTURER_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      // GCV Manufacturers
      {
        id: '20',
        oemId: 'OEM020',
        oemName: 'Tata Motors (GCV)',
        oemDescription: 'GCV - Goods Carrying Vehicle manufacturer',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MANUFACTURER_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '21',
        oemId: 'OEM021',
        oemName: 'Ashok Leyland (GCV)',
        oemDescription: 'GCV - Goods Carrying Vehicle manufacturer',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MANUFACTURER_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '22',
        oemId: 'OEM022',
        oemName: 'Eicher Motors',
        oemDescription: 'GCV - Commercial vehicle manufacturer',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MANUFACTURER_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '23',
        oemId: 'OEM023',
        oemName: 'Bharat Benz',
        oemDescription: 'GCV - Commercial vehicle manufacturer',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MANUFACTURER_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '24',
        oemId: 'OEM024',
        oemName: 'Mahindra (GCV)',
        oemDescription: 'GCV - Goods Carrying Vehicle manufacturer',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MANUFACTURER_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      // Misc-D Manufacturers
      {
        id: '25',
        oemId: 'OEM025',
        oemName: 'Mahindra Tractors',
        oemDescription: 'Misc-D - Tractor manufacturer',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MANUFACTURER_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '26',
        oemId: 'OEM026',
        oemName: 'John Deere',
        oemDescription: 'Misc-D - Tractor and agricultural equipment manufacturer',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MANUFACTURER_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '27',
        oemId: 'OEM027',
        oemName: 'Force Motors (Ambulance)',
        oemDescription: 'Misc-D - Ambulance manufacturer',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MANUFACTURER_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '28',
        oemId: 'OEM028',
        oemName: 'Tata Motors (Ambulance)',
        oemDescription: 'Misc-D - Ambulance manufacturer',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MANUFACTURER_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '29',
        oemId: 'OEM029',
        oemName: 'JCB',
        oemDescription: 'Misc-D - Heavy Earth Movers manufacturer',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MANUFACTURER_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '30',
        oemId: 'OEM030',
        oemName: 'Caterpillar',
        oemDescription: 'Misc-D - Heavy Earth Movers and construction equipment',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MANUFACTURER_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
    ]
    setManufacturers(mockData)
  }, [])

  // Filter data based on search term
  useEffect(() => {
    let filtered = manufacturers

    if (searchTerm) {
      filtered = filtered.filter(manufacturer =>
        manufacturer.oemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        manufacturer.oemId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        manufacturer.oemDescription?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredManufacturers(filtered)
  }, [manufacturers, searchTerm])

  const handleAddManufacturer = () => {
    setEditingManufacturer(null)
    reset({
      oemId: '',
      oemName: '',
      oemDescription: '',
      isActive: true,
      createdBy: 'Current User',
      createdDate: new Date().toISOString().split('T')[0],
      createdProcName: 'PROC_MANUFACTURER_INSERT',
      updatedBy: '',
      updatedDate: '',
      activeFromDate: new Date().toISOString().split('T')[0],
      activeToDate: '',
    })
    setShowModal(true)
  }

  const handleEditManufacturer = (manufacturer: Manufacturer) => {
    setEditingManufacturer(manufacturer)
    reset({
      oemId: manufacturer.oemId,
      oemName: manufacturer.oemName,
      oemDescription: manufacturer.oemDescription || '',
      isActive: manufacturer.isActive,
      createdBy: manufacturer.createdBy,
      createdDate: manufacturer.createdDate,
      createdProcName: manufacturer.createdProcName,
      updatedBy: manufacturer.updatedBy || '',
      updatedDate: manufacturer.updatedDate || '',
      activeFromDate: manufacturer.activeFromDate,
      activeToDate: manufacturer.activeToDate || '',
    })
    setShowModal(true)
  }

  const onSubmit = (data: ManufacturerForm) => {
    if (editingManufacturer) {
      // Update existing manufacturer
      setManufacturers(prev =>
        prev.map(manufacturer =>
          manufacturer.id === editingManufacturer.id
            ? {
                ...manufacturer,
                ...data,
                updatedBy: 'Current User',
                updatedDate: new Date().toISOString().split('T')[0],
              }
            : manufacturer
        )
      )
      toast.success('Manufacturer updated successfully!')
    } else {
      // Add new manufacturer
      const newManufacturer: Manufacturer = {
        id: Date.now().toString(),
        ...data,
      }
      setManufacturers(prev => [...prev, newManufacturer])
      toast.success('Manufacturer added successfully!')
    }
    setShowModal(false)
    reset()
  }

  const handleDeleteManufacturer = (id: string) => {
    if (confirm('Are you sure you want to delete this manufacturer?')) {
      setManufacturers(prev => prev.filter(manufacturer => manufacturer.id !== id))
      toast.success('Manufacturer deleted successfully!')
    }
  }

  const totalPages = Math.ceil(filteredManufacturers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentManufacturers = filteredManufacturers.slice(startIndex, endIndex)

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
                <span className="ml-4 text-gray-900 font-medium">Manufacturer Master</span>
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
            <h1 className="text-lg font-semibold text-gray-900">Manufacturer Master</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage OEM (Original Equipment Manufacturer) information
            </p>
          </div>
        </div>
        <button
          onClick={handleAddManufacturer}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Manufacturer
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
                placeholder="Search manufacturers..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {filteredManufacturers.length} manufacturers
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
                  OEM ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  OEM Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Active Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentManufacturers.map((manufacturer) => (
                <tr key={manufacturer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {manufacturer.oemId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {manufacturer.oemName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {manufacturer.oemDescription || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      manufacturer.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {manufacturer.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {manufacturer.activeFromDate} - {manufacturer.activeToDate || 'Present'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditManufacturer(manufacturer)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteManufacturer(manufacturer.id)}
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
                  <span className="font-medium">{Math.min(endIndex, filteredManufacturers.length)}</span> of{' '}
                  <span className="font-medium">{filteredManufacturers.length}</span> results
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
                {editingManufacturer ? 'Edit Manufacturer' : 'Add New Manufacturer'}
              </h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">OEM ID *</label>
                    <input
                      {...register('oemId')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.oemId && <p className="text-red-500 text-xs mt-1">{errors.oemId.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">OEM Name *</label>
                    <input
                      {...register('oemName')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.oemName && <p className="text-red-500 text-xs mt-1">{errors.oemName.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">OEM Description</label>
                  <textarea
                    {...register('oemDescription')}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Active To Date</label>
                    <input
                      {...register('activeToDate')}
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      {...register('isActive')}
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">Is Active</label>
                  </div>
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
                    {editingManufacturer ? 'Update' : 'Add'} Manufacturer
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



