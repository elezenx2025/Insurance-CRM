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
  DocumentTextIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const addonSchema = z.object({
  addonId: z.string().min(1, 'Add-on ID is required'),
  addonName: z.string().min(1, 'Add-on Name is required'),
  vehicleTypeId: z.string().min(1, 'Vehicle Type ID is required'),
  vehicleCarrierTypeId: z.string().min(1, 'Vehicle Carrier Type ID is required'),
  addonDescription: z.string().optional(),
  isActive: z.boolean(),
  createdBy: z.string().min(1, 'Created By is required'),
  createdDate: z.string().min(1, 'Created Date is required'),
  createdProcName: z.string().min(1, 'Created Proc Name is required'),
  updatedBy: z.string().optional(),
  updatedDate: z.string().optional(),
  activeFromDate: z.string().min(1, 'Active From Date is required'),
  activeToDate: z.string().optional(),
})

type AddonForm = z.infer<typeof addonSchema>

interface Addon {
  id: string
  addonId: string
  addonName: string
  vehicleTypeId: string
  vehicleCarrierTypeId: string
  addonDescription?: string
  isActive: boolean
  createdBy: string
  createdDate: string
  createdProcName: string
  updatedBy?: string
  updatedDate?: string
  activeFromDate: string
  activeToDate?: string
}

export default function AddonMasterPage() {
  const router = useRouter()
  const [addons, setAddons] = useState<Addon[]>([])
  const [filteredAddons, setFilteredAddons] = useState<Addon[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingAddon, setEditingAddon] = useState<Addon | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddonForm>({
    resolver: zodResolver(addonSchema),
  })

  // Mock data
  useEffect(() => {
    const mockData: Addon[] = [
      {
        id: '1',
        addonId: 'ADD001',
        addonName: 'Zero Depreciation Cover',
        vehicleTypeId: 'VT001',
        vehicleCarrierTypeId: 'VCT001',
        addonDescription: 'Covers the full cost of replacement of parts without depreciation',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_ADDON_INSERT',
        updatedBy: 'Admin',
        updatedDate: '2024-01-15',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '2',
        addonId: 'ADD002',
        addonName: 'Engine Protection Cover',
        vehicleTypeId: 'VT001',
        vehicleCarrierTypeId: 'VCT001',
        addonDescription: 'Covers engine damage due to water ingression or oil leakage',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_ADDON_INSERT',
        updatedBy: 'Admin',
        updatedDate: '2024-01-15',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '3',
        addonId: 'ADD003',
        addonName: 'Roadside Assistance',
        vehicleTypeId: 'VT001',
        vehicleCarrierTypeId: 'VCT001',
        addonDescription: '24/7 roadside assistance for breakdowns and emergencies',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_ADDON_INSERT',
        updatedBy: 'Admin',
        updatedDate: '2024-01-15',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '4',
        addonId: 'ADD004',
        addonName: 'Personal Accident Cover',
        vehicleTypeId: 'VT001',
        vehicleCarrierTypeId: 'VCT001',
        addonDescription: 'Personal accident cover for driver and passengers',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_ADDON_INSERT',
        updatedBy: 'Admin',
        updatedDate: '2024-01-15',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '5',
        addonId: 'ADD005',
        addonName: 'Key Replacement Cover',
        vehicleTypeId: 'VT001',
        vehicleCarrierTypeId: 'VCT001',
        addonDescription: 'Covers the cost of replacement of lost or stolen keys',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_ADDON_INSERT',
        updatedBy: 'Admin',
        updatedDate: '2024-01-15',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '6',
        addonId: 'ADD006',
        addonName: 'Return to Invoice Cover',
        vehicleTypeId: 'VT001',
        vehicleCarrierTypeId: 'VCT001',
        addonDescription: 'Covers the difference between IDV and invoice value in case of total loss or theft',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_ADDON_INSERT',
        updatedBy: 'Admin',
        updatedDate: '2024-01-15',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '7',
        addonId: 'ADD007',
        addonName: 'Consumable Cover',
        vehicleTypeId: 'VT001',
        vehicleCarrierTypeId: 'VCT001',
        addonDescription: 'Covers cost of consumables like engine oil, nuts, bolts, screws, washers, grease, etc.',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_ADDON_INSERT',
        updatedBy: 'Admin',
        updatedDate: '2024-01-15',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '8',
        addonId: 'ADD008',
        addonName: 'Tyre Protection Cover',
        vehicleTypeId: 'VT001',
        vehicleCarrierTypeId: 'VCT001',
        addonDescription: 'Covers damage to tyres and tubes due to accidents or punctures',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_ADDON_INSERT',
        updatedBy: 'Admin',
        updatedDate: '2024-01-15',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '9',
        addonId: 'ADD009',
        addonName: 'NCB Protection Cover',
        vehicleTypeId: 'VT001',
        vehicleCarrierTypeId: 'VCT001',
        addonDescription: 'Protects No Claim Bonus even after making a claim during the policy period',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_ADDON_INSERT',
        updatedBy: 'Admin',
        updatedDate: '2024-01-15',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '10',
        addonId: 'ADD010',
        addonName: 'Daily Allowance Cover',
        vehicleTypeId: 'VT001',
        vehicleCarrierTypeId: 'VCT001',
        addonDescription: 'Provides daily cash allowance when vehicle is under repair after an accident',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_ADDON_INSERT',
        updatedBy: 'Admin',
        updatedDate: '2024-01-15',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '11',
        addonId: 'ADD011',
        addonName: 'Loss of Personal Belongings',
        vehicleTypeId: 'VT001',
        vehicleCarrierTypeId: 'VCT001',
        addonDescription: 'Covers loss or damage to personal belongings kept in the vehicle during an accident',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_ADDON_INSERT',
        updatedBy: 'Admin',
        updatedDate: '2024-01-15',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '12',
        addonId: 'ADD012',
        addonName: 'Electrical Accessories Cover',
        vehicleTypeId: 'VT001',
        vehicleCarrierTypeId: 'VCT001',
        addonDescription: 'Covers damage to electrical accessories like music system, GPS, etc.',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_ADDON_INSERT',
        updatedBy: 'Admin',
        updatedDate: '2024-01-15',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '13',
        addonId: 'ADD013',
        addonName: 'Non-Electrical Accessories Cover',
        vehicleTypeId: 'VT001',
        vehicleCarrierTypeId: 'VCT001',
        addonDescription: 'Covers damage to non-electrical accessories like seat covers, floor mats, etc.',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_ADDON_INSERT',
        updatedBy: 'Admin',
        updatedDate: '2024-01-15',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '14',
        addonId: 'ADD014',
        addonName: 'Emergency Medical Expenses',
        vehicleTypeId: 'VT001',
        vehicleCarrierTypeId: 'VCT001',
        addonDescription: 'Covers immediate medical expenses for driver and passengers after an accident',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_ADDON_INSERT',
        updatedBy: 'Admin',
        updatedDate: '2024-01-15',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '15',
        addonId: 'ADD015',
        addonName: 'Passenger Assist Cover',
        vehicleTypeId: 'VT001',
        vehicleCarrierTypeId: 'VCT001',
        addonDescription: 'Provides personal accident cover for all passengers in the vehicle',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_ADDON_INSERT',
        updatedBy: 'Admin',
        updatedDate: '2024-01-15',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '16',
        addonId: 'ADD016',
        addonName: 'Hydrostatic Lock Cover',
        vehicleTypeId: 'VT001',
        vehicleCarrierTypeId: 'VCT001',
        addonDescription: 'Covers engine damage due to water entering the engine (similar to engine protection)',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_ADDON_INSERT',
        updatedBy: 'Admin',
        updatedDate: '2024-01-15',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '17',
        addonId: 'ADD017',
        addonName: 'Rim Damage Cover',
        vehicleTypeId: 'VT001',
        vehicleCarrierTypeId: 'VCT001',
        addonDescription: 'Covers damage to alloy wheels and rims',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_ADDON_INSERT',
        updatedBy: 'Admin',
        updatedDate: '2024-01-15',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '18',
        addonId: 'ADD018',
        addonName: 'Windscreen Protection Cover',
        vehicleTypeId: 'VT001',
        vehicleCarrierTypeId: 'VCT001',
        addonDescription: 'Covers repair or replacement of windscreen, side glasses, and rear glass',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_ADDON_INSERT',
        updatedBy: 'Admin',
        updatedDate: '2024-01-15',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '19',
        addonId: 'ADD019',
        addonName: 'Towing Charges Cover',
        vehicleTypeId: 'VT001',
        vehicleCarrierTypeId: 'VCT001',
        addonDescription: 'Covers towing charges when vehicle breaks down or meets with an accident',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_ADDON_INSERT',
        updatedBy: 'Admin',
        updatedDate: '2024-01-15',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '20',
        addonId: 'ADD020',
        addonName: 'Legal Liability to Paid Driver',
        vehicleTypeId: 'VT001',
        vehicleCarrierTypeId: 'VCT001',
        addonDescription: 'Covers legal liability towards paid driver in case of accident',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_ADDON_INSERT',
        updatedBy: 'Admin',
        updatedDate: '2024-01-15',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '21',
        addonId: 'ADD021',
        addonName: 'Geographical Extension Cover',
        vehicleTypeId: 'VT001',
        vehicleCarrierTypeId: 'VCT001',
        addonDescription: 'Extends coverage to neighboring countries like Nepal, Bhutan, Bangladesh, etc.',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_ADDON_INSERT',
        updatedBy: 'Admin',
        updatedDate: '2024-01-15',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '22',
        addonId: 'ADD022',
        addonName: 'Helmet Cover (Two-Wheeler)',
        vehicleTypeId: 'VT003',
        vehicleCarrierTypeId: 'VCT003',
        addonDescription: 'Covers cost of helmet replacement after an accident',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_ADDON_INSERT',
        updatedBy: 'Admin',
        updatedDate: '2024-01-15',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '23',
        addonId: 'ADD023',
        addonName: 'Pillion Passenger Cover (Two-Wheeler)',
        vehicleTypeId: 'VT003',
        vehicleCarrierTypeId: 'VCT003',
        addonDescription: 'Personal accident cover for pillion passenger on two-wheeler',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_ADDON_INSERT',
        updatedBy: 'Admin',
        updatedDate: '2024-01-15',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '24',
        addonId: 'ADD024',
        addonName: 'Medical Expenses for Unnamed Passengers',
        vehicleTypeId: 'VT002',
        vehicleCarrierTypeId: 'VCT002',
        addonDescription: 'Covers medical expenses for unnamed passengers in commercial vehicles',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_ADDON_INSERT',
        updatedBy: 'Admin',
        updatedDate: '2024-01-15',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '25',
        addonId: 'ADD025',
        addonName: 'IMT-23 (Fiber Glass Tank Cover)',
        vehicleTypeId: 'VT002',
        vehicleCarrierTypeId: 'VCT002',
        addonDescription: 'Covers fiber glass fuel tank for commercial vehicles',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_ADDON_INSERT',
        updatedBy: 'Admin',
        updatedDate: '2024-01-15',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
    ]
    setAddons(mockData)
  }, [])

  // Filter data based on search term
  useEffect(() => {
    let filtered = addons

    if (searchTerm) {
      filtered = filtered.filter(addon =>
        addon.addonId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        addon.addonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        addon.addonDescription?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredAddons(filtered)
  }, [addons, searchTerm])

  const handleAddAddon = () => {
    setEditingAddon(null)
    reset({
      addonId: '',
      addonName: '',
      vehicleTypeId: '',
      vehicleCarrierTypeId: '',
      addonDescription: '',
      isActive: true,
      createdBy: 'Current User',
      createdDate: new Date().toISOString().split('T')[0],
      createdProcName: 'PROC_ADDON_INSERT',
      updatedBy: '',
      updatedDate: '',
      activeFromDate: new Date().toISOString().split('T')[0],
      activeToDate: '',
    })
    setShowModal(true)
  }

  const handleEditAddon = (addon: Addon) => {
    setEditingAddon(addon)
    reset({
      addonId: addon.addonId,
      addonName: addon.addonName,
      vehicleTypeId: addon.vehicleTypeId,
      vehicleCarrierTypeId: addon.vehicleCarrierTypeId,
      addonDescription: addon.addonDescription || '',
      isActive: addon.isActive,
      createdBy: addon.createdBy,
      createdDate: addon.createdDate,
      createdProcName: addon.createdProcName,
      updatedBy: addon.updatedBy || '',
      updatedDate: addon.updatedDate || '',
      activeFromDate: addon.activeFromDate,
      activeToDate: addon.activeToDate || '',
    })
    setShowModal(true)
  }

  const onSubmit = (data: AddonForm) => {
    if (editingAddon) {
      // Update existing addon
      setAddons(prev =>
        prev.map(addon =>
          addon.id === editingAddon.id
            ? {
                ...addon,
                ...data,
                updatedBy: 'Current User',
                updatedDate: new Date().toISOString().split('T')[0],
              }
            : addon
        )
      )
      toast.success('Add-on updated successfully!')
    } else {
      // Add new addon
      const newAddon: Addon = {
        id: Date.now().toString(),
        ...data,
      }
      setAddons(prev => [...prev, newAddon])
      toast.success('Add-on added successfully!')
    }
    setShowModal(false)
    reset()
  }

  const handleDeleteAddon = (id: string) => {
    if (confirm('Are you sure you want to delete this add-on?')) {
      setAddons(prev => prev.filter(addon => addon.id !== id))
      toast.success('Add-on deleted successfully!')
    }
  }

  const totalPages = Math.ceil(filteredAddons.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentAddons = filteredAddons.slice(startIndex, endIndex)

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
                <span className="ml-4 text-gray-900 font-medium">Add-on Master</span>
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
            <h1 className="text-lg font-semibold text-gray-900">Add-on Master</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage insurance add-on covers
            </p>
          </div>
        </div>
        <button
          onClick={handleAddAddon}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Add-on
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
                placeholder="Search add-ons..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {filteredAddons.length} add-ons
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
                  Add-on ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Add-on Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Carrier Type
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
              {currentAddons.map((addon) => (
                <tr key={addon.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {addon.addonId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {addon.addonName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {addon.vehicleTypeId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {addon.vehicleCarrierTypeId}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {addon.addonDescription || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      addon.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {addon.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditAddon(addon)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteAddon(addon.id)}
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
                  <span className="font-medium">{Math.min(endIndex, filteredAddons.length)}</span> of{' '}
                  <span className="font-medium">{filteredAddons.length}</span> results
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
                {editingAddon ? 'Edit Add-on' : 'Add New Add-on'}
              </h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Add-on ID *</label>
                    <input
                      {...register('addonId')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.addonId && <p className="text-red-500 text-xs mt-1">{errors.addonId.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Add-on Name *</label>
                    <input
                      {...register('addonName')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.addonName && <p className="text-red-500 text-xs mt-1">{errors.addonName.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type ID *</label>
                    <input
                      {...register('vehicleTypeId')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.vehicleTypeId && <p className="text-red-500 text-xs mt-1">{errors.vehicleTypeId.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Carrier Type ID *</label>
                    <input
                      {...register('vehicleCarrierTypeId')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.vehicleCarrierTypeId && <p className="text-red-500 text-xs mt-1">{errors.vehicleCarrierTypeId.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Add-on Description</label>
                  <textarea
                    {...register('addonDescription')}
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
                    {editingAddon ? 'Update' : 'Add'} Add-on
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



