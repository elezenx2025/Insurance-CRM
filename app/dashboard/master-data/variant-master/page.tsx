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

const variantSchema = z.object({
  oemId: z.string().min(1, 'OEM ID is required'),
  variantId: z.string().min(1, 'Variant ID is required'),
  modelId: z.string().min(1, 'Model ID is required'),
  modelCode: z.string().min(1, 'Model Code is required'),
  variantCode: z.string().min(1, 'Variant Code is required'),
  variantName: z.string().min(1, 'Variant Name is required'),
  fuelTypeId: z.string().min(1, 'Fuel Type ID is required'),
  cubicCapacity: z.number().min(0, 'Cubic Capacity must be non-negative'),
  grossVehicleWeight: z.number().min(0, 'Gross Vehicle Weight must be non-negative'),
  kilowatt: z.number().min(0, 'Kilowatt must be non-negative'),
  seatingCapacity: z.number().min(1, 'Seating Capacity must be at least 1'),
  isAntiTheftCoFitted: z.boolean(),
  isBiFuelCoFitted: z.boolean(),
  oemSuffixCode: z.string().optional(),
  variantDescription: z.string().optional(),
  isActive: z.boolean(),
  createdBy: z.string().min(1, 'Created By is required'),
  createdDate: z.string().min(1, 'Created Date is required'),
  createdProcName: z.string().min(1, 'Created Proc Name is required'),
  updatedBy: z.string().optional(),
  updatedDate: z.string().optional(),
  activeFromDate: z.string().min(1, 'Active From Date is required'),
  activeToDate: z.string().optional(),
})

type VariantForm = z.infer<typeof variantSchema>

interface Variant {
  id: string
  oemId: string
  variantId: string
  modelId: string
  modelCode: string
  variantCode: string
  variantName: string
  fuelTypeId: string
  cubicCapacity: number
  grossVehicleWeight: number
  kilowatt: number
  seatingCapacity: number
  isAntiTheftCoFitted: boolean
  isBiFuelCoFitted: boolean
  oemSuffixCode?: string
  variantDescription?: string
  isActive: boolean
  createdBy: string
  createdDate: string
  createdProcName: string
  updatedBy?: string
  updatedDate?: string
  activeFromDate: string
  activeToDate?: string
}

export default function VariantMasterPage() {
  const router = useRouter()
  const [variants, setVariants] = useState<Variant[]>([])
  const [filteredVariants, setFilteredVariants] = useState<Variant[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingVariant, setEditingVariant] = useState<Variant | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VariantForm>({
    resolver: zodResolver(variantSchema),
  })

  // Mock data
  useEffect(() => {
    const mockData: Variant[] = [
      {
        id: '1',
        oemId: 'OEM001',
        variantId: 'VAR001',
        modelId: 'MOD001',
        modelCode: 'SWIFT',
        variantCode: 'SWIFT_LXI',
        variantName: 'Swift LXI',
        fuelTypeId: 'FT001',
        cubicCapacity: 1197,
        grossVehicleWeight: 1200,
        kilowatt: 55,
        seatingCapacity: 5,
        isAntiTheftCoFitted: true,
        isBiFuelCoFitted: false,
        oemSuffixCode: 'LXI',
        variantDescription: 'Swift LXI variant with basic features',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_VARIANT_INSERT',
        updatedBy: 'Admin',
        updatedDate: '2024-01-15',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '2',
        oemId: 'OEM001',
        variantId: 'VAR002',
        modelId: 'MOD001',
        modelCode: 'SWIFT',
        variantCode: 'SWIFT_VXI',
        variantName: 'Swift VXI',
        fuelTypeId: 'FT001',
        cubicCapacity: 1197,
        grossVehicleWeight: 1200,
        kilowatt: 55,
        seatingCapacity: 5,
        isAntiTheftCoFitted: true,
        isBiFuelCoFitted: false,
        oemSuffixCode: 'VXI',
        variantDescription: 'Swift VXI variant with enhanced features',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_VARIANT_INSERT',
        updatedBy: 'Admin',
        updatedDate: '2024-01-15',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '3',
        oemId: 'OEM002',
        variantId: 'VAR003',
        modelId: 'MOD002',
        modelCode: 'I20',
        variantCode: 'I20_MAGNA',
        variantName: 'i20 Magna',
        fuelTypeId: 'FT001',
        cubicCapacity: 1197,
        grossVehicleWeight: 1250,
        kilowatt: 60,
        seatingCapacity: 5,
        isAntiTheftCoFitted: true,
        isBiFuelCoFitted: false,
        oemSuffixCode: 'MAGNA',
        variantDescription: 'i20 Magna variant with premium features',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_VARIANT_INSERT',
        updatedBy: 'Admin',
        updatedDate: '2024-01-15',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '4',
        oemId: 'OEM003',
        variantId: 'VAR004',
        modelId: 'MOD003',
        modelCode: 'CRETA',
        variantCode: 'CRETA_E',
        variantName: 'Creta E',
        fuelTypeId: 'FT001',
        cubicCapacity: 1493,
        grossVehicleWeight: 1400,
        kilowatt: 75,
        seatingCapacity: 5,
        isAntiTheftCoFitted: true,
        isBiFuelCoFitted: false,
        oemSuffixCode: 'E',
        variantDescription: 'Creta E variant with entry-level features',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_VARIANT_INSERT',
        updatedBy: 'Admin',
        updatedDate: '2024-01-15',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '5',
        oemId: 'OEM009',
        variantId: 'VAR005',
        modelId: 'MOD010',
        modelCode: 'CRETA',
        variantCode: 'CRETA_S',
        variantName: 'Creta S',
        fuelTypeId: 'FT001',
        cubicCapacity: 1493,
        grossVehicleWeight: 1400,
        kilowatt: 75,
        seatingCapacity: 5,
        isAntiTheftCoFitted: true,
        isBiFuelCoFitted: false,
        oemSuffixCode: 'S',
        variantDescription: 'Hyundai Creta S variant',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_VARIANT_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      // Baleno Variants (Maruti - OEM008, MOD002)
      {
        id: '6',
        oemId: 'OEM008',
        variantId: 'VAR006',
        modelId: 'MOD002',
        modelCode: 'BALENO',
        variantCode: 'BALENO_SIGMA',
        variantName: 'Baleno Sigma',
        fuelTypeId: 'FT001',
        cubicCapacity: 1197,
        grossVehicleWeight: 1100,
        kilowatt: 66,
        seatingCapacity: 5,
        isAntiTheftCoFitted: true,
        isBiFuelCoFitted: false,
        oemSuffixCode: 'SIGMA',
        variantDescription: 'Baleno base variant',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_VARIANT_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '7',
        oemId: 'OEM008',
        variantId: 'VAR007',
        modelId: 'MOD002',
        modelCode: 'BALENO',
        variantCode: 'BALENO_ALPHA',
        variantName: 'Baleno Alpha',
        fuelTypeId: 'FT001',
        cubicCapacity: 1197,
        grossVehicleWeight: 1100,
        kilowatt: 66,
        seatingCapacity: 5,
        isAntiTheftCoFitted: true,
        isBiFuelCoFitted: false,
        oemSuffixCode: 'ALPHA',
        variantDescription: 'Baleno top variant',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_VARIANT_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      // Nexon Variants (Tata - OEM010, MOD012)
      {
        id: '8',
        oemId: 'OEM010',
        variantId: 'VAR008',
        modelId: 'MOD012',
        modelCode: 'NEXON',
        variantCode: 'NEXON_XE',
        variantName: 'Nexon XE',
        fuelTypeId: 'FT001',
        cubicCapacity: 1199,
        grossVehicleWeight: 1450,
        kilowatt: 88,
        seatingCapacity: 5,
        isAntiTheftCoFitted: true,
        isBiFuelCoFitted: false,
        oemSuffixCode: 'XE',
        variantDescription: 'Nexon base variant',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_VARIANT_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '9',
        oemId: 'OEM010',
        variantId: 'VAR009',
        modelId: 'MOD012',
        modelCode: 'NEXON',
        variantCode: 'NEXON_XZ_PLUS',
        variantName: 'Nexon XZ Plus',
        fuelTypeId: 'FT001',
        cubicCapacity: 1199,
        grossVehicleWeight: 1450,
        kilowatt: 88,
        seatingCapacity: 5,
        isAntiTheftCoFitted: true,
        isBiFuelCoFitted: false,
        oemSuffixCode: 'XZ_PLUS',
        variantDescription: 'Nexon top variant',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_VARIANT_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      // 2-Wheeler Variants
      {
        id: '10',
        oemId: 'OEM001',
        variantId: 'VAR010',
        modelId: 'MOD027',
        modelCode: 'SPLENDOR',
        variantCode: 'SPLENDOR_PLUS',
        variantName: 'Splendor Plus BS6',
        fuelTypeId: 'FT001',
        cubicCapacity: 97,
        grossVehicleWeight: 112,
        kilowatt: 5.6,
        seatingCapacity: 2,
        isAntiTheftCoFitted: false,
        isBiFuelCoFitted: false,
        oemSuffixCode: 'PLUS',
        variantDescription: 'Hero Splendor Plus',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_VARIANT_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '11',
        oemId: 'OEM002',
        variantId: 'VAR011',
        modelId: 'MOD028',
        modelCode: 'ACTIVA',
        variantCode: 'ACTIVA_6G',
        variantName: 'Activa 6G Standard',
        fuelTypeId: 'FT001',
        cubicCapacity: 109,
        grossVehicleWeight: 109,
        kilowatt: 5.9,
        seatingCapacity: 2,
        isAntiTheftCoFitted: false,
        isBiFuelCoFitted: false,
        oemSuffixCode: '6G',
        variantDescription: 'Honda Activa 6G',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_VARIANT_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      // PCV Variants
      {
        id: '12',
        oemId: 'OEM016',
        variantId: 'VAR012',
        modelId: 'MOD030',
        modelCode: 'STARBUS',
        variantCode: 'STARBUS_AC',
        variantName: 'Starbus Ultra AC',
        fuelTypeId: 'FT002',
        cubicCapacity: 5660,
        grossVehicleWeight: 16200,
        kilowatt: 130,
        seatingCapacity: 49,
        isAntiTheftCoFitted: true,
        isBiFuelCoFitted: false,
        oemSuffixCode: 'AC',
        variantDescription: 'Tata Starbus AC variant',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_VARIANT_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      // GCV Variants
      {
        id: '13',
        oemId: 'OEM020',
        variantId: 'VAR013',
        modelId: 'MOD032',
        modelCode: 'ACE',
        variantCode: 'ACE_GOLD',
        variantName: 'Ace Gold',
        fuelTypeId: 'FT002',
        cubicCapacity: 1405,
        grossVehicleWeight: 1500,
        kilowatt: 40,
        seatingCapacity: 3,
        isAntiTheftCoFitted: true,
        isBiFuelCoFitted: false,
        oemSuffixCode: 'GOLD',
        variantDescription: 'Tata Ace Gold variant',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_VARIANT_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      // Misc-D Variants
      {
        id: '14',
        oemId: 'OEM025',
        variantId: 'VAR014',
        modelId: 'MOD035',
        modelCode: 'YUVO',
        variantCode: 'YUVO_TECH',
        variantName: 'Yuvo Tech Plus',
        fuelTypeId: 'FT002',
        cubicCapacity: 2730,
        grossVehicleWeight: 2200,
        kilowatt: 29,
        seatingCapacity: 1,
        isAntiTheftCoFitted: false,
        isBiFuelCoFitted: false,
        oemSuffixCode: 'TECH',
        variantDescription: 'Mahindra Yuvo tractor',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_VARIANT_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '15',
        oemId: 'OEM029',
        variantId: 'VAR015',
        modelId: 'MOD037',
        modelCode: 'EXCAVATOR',
        variantCode: 'JS_205',
        variantName: 'JS 205',
        fuelTypeId: 'FT002',
        cubicCapacity: 4400,
        grossVehicleWeight: 20500,
        kilowatt: 110,
        seatingCapacity: 1,
        isAntiTheftCoFitted: false,
        isBiFuelCoFitted: false,
        oemSuffixCode: 'JS205',
        variantDescription: 'JCB Excavator JS 205',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_VARIANT_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
    ]
    setVariants(mockData)
  }, [])

  // Filter data based on search term
  useEffect(() => {
    let filtered = variants

    if (searchTerm) {
      filtered = filtered.filter(variant =>
        variant.variantId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        variant.variantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        variant.variantCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        variant.modelCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        variant.variantDescription?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredVariants(filtered)
  }, [variants, searchTerm])

  const handleAddVariant = () => {
    setEditingVariant(null)
    reset({
      oemId: '',
      variantId: '',
      modelId: '',
      modelCode: '',
      variantCode: '',
      variantName: '',
      fuelTypeId: '',
      cubicCapacity: 0,
      grossVehicleWeight: 0,
      kilowatt: 0,
      seatingCapacity: 5,
      isAntiTheftCoFitted: false,
      isBiFuelCoFitted: false,
      oemSuffixCode: '',
      variantDescription: '',
      isActive: true,
      createdBy: 'Current User',
      createdDate: new Date().toISOString().split('T')[0],
      createdProcName: 'PROC_VARIANT_INSERT',
      updatedBy: '',
      updatedDate: '',
      activeFromDate: new Date().toISOString().split('T')[0],
      activeToDate: '',
    })
    setShowModal(true)
  }

  const handleEditVariant = (variant: Variant) => {
    setEditingVariant(variant)
    reset({
      oemId: variant.oemId,
      variantId: variant.variantId,
      modelId: variant.modelId,
      modelCode: variant.modelCode,
      variantCode: variant.variantCode,
      variantName: variant.variantName,
      fuelTypeId: variant.fuelTypeId,
      cubicCapacity: variant.cubicCapacity,
      grossVehicleWeight: variant.grossVehicleWeight,
      kilowatt: variant.kilowatt,
      seatingCapacity: variant.seatingCapacity,
      isAntiTheftCoFitted: variant.isAntiTheftCoFitted,
      isBiFuelCoFitted: variant.isBiFuelCoFitted,
      oemSuffixCode: variant.oemSuffixCode || '',
      variantDescription: variant.variantDescription || '',
      isActive: variant.isActive,
      createdBy: variant.createdBy,
      createdDate: variant.createdDate,
      createdProcName: variant.createdProcName,
      updatedBy: variant.updatedBy || '',
      updatedDate: variant.updatedDate || '',
      activeFromDate: variant.activeFromDate,
      activeToDate: variant.activeToDate || '',
    })
    setShowModal(true)
  }

  const onSubmit = (data: VariantForm) => {
    if (editingVariant) {
      // Update existing variant
      setVariants(prev =>
        prev.map(variant =>
          variant.id === editingVariant.id
            ? {
                ...variant,
                ...data,
                updatedBy: 'Current User',
                updatedDate: new Date().toISOString().split('T')[0],
              }
            : variant
        )
      )
      toast.success('Variant updated successfully!')
    } else {
      // Add new variant
      const newVariant: Variant = {
        id: Date.now().toString(),
        ...data,
      }
      setVariants(prev => [...prev, newVariant])
      toast.success('Variant added successfully!')
    }
    setShowModal(false)
    reset()
  }

  const handleDeleteVariant = (id: string) => {
    if (confirm('Are you sure you want to delete this variant?')) {
      setVariants(prev => prev.filter(variant => variant.id !== id))
      toast.success('Variant deleted successfully!')
    }
  }

  const totalPages = Math.ceil(filteredVariants.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentVariants = filteredVariants.slice(startIndex, endIndex)

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
                <span className="ml-4 text-gray-900 font-medium">Variant Master</span>
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
            <h1 className="text-lg font-semibold text-gray-900">Variant Master</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage vehicle variants and specifications
            </p>
          </div>
        </div>
        <button
          onClick={handleAddVariant}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Variant
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
                placeholder="Search variants..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {filteredVariants.length} variants
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
                  Model ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Variant ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Variant Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Model Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Engine (CC)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Seating
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
              {currentVariants.map((variant) => (
                <tr key={variant.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {variant.oemId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {variant.modelId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {variant.variantId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {variant.variantName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {variant.modelCode}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {variant.cubicCapacity} CC
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {variant.seatingCapacity} Seater
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      variant.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {variant.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditVariant(variant)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteVariant(variant.id)}
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
                  <span className="font-medium">{Math.min(endIndex, filteredVariants.length)}</span> of{' '}
                  <span className="font-medium">{filteredVariants.length}</span> results
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
          <div className="relative top-20 mx-auto p-5 border w-full max-w-6xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingVariant ? 'Edit Variant' : 'Add New Variant'}
              </h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Variant ID *</label>
                    <input
                      {...register('variantId')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.variantId && <p className="text-red-500 text-xs mt-1">{errors.variantId.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Model ID *</label>
                    <input
                      {...register('modelId')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.modelId && <p className="text-red-500 text-xs mt-1">{errors.modelId.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Model Code *</label>
                    <input
                      {...register('modelCode')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.modelCode && <p className="text-red-500 text-xs mt-1">{errors.modelCode.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Variant Code *</label>
                    <input
                      {...register('variantCode')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.variantCode && <p className="text-red-500 text-xs mt-1">{errors.variantCode.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Variant Name *</label>
                    <input
                      {...register('variantName')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.variantName && <p className="text-red-500 text-xs mt-1">{errors.variantName.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type ID *</label>
                    <input
                      {...register('fuelTypeId')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.fuelTypeId && <p className="text-red-500 text-xs mt-1">{errors.fuelTypeId.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">OEM Suffix Code</label>
                    <input
                      {...register('oemSuffixCode')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cubic Capacity (CC) *</label>
                    <input
                      {...register('cubicCapacity', { valueAsNumber: true })}
                      type="number"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.cubicCapacity && <p className="text-red-500 text-xs mt-1">{errors.cubicCapacity.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gross Vehicle Weight (kg) *</label>
                    <input
                      {...register('grossVehicleWeight', { valueAsNumber: true })}
                      type="number"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.grossVehicleWeight && <p className="text-red-500 text-xs mt-1">{errors.grossVehicleWeight.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kilowatt (kW) *</label>
                    <input
                      {...register('kilowatt', { valueAsNumber: true })}
                      type="number"
                      min="0"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.kilowatt && <p className="text-red-500 text-xs mt-1">{errors.kilowatt.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Seating Capacity *</label>
                    <input
                      {...register('seatingCapacity', { valueAsNumber: true })}
                      type="number"
                      min="1"
                      max="20"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.seatingCapacity && <p className="text-red-500 text-xs mt-1">{errors.seatingCapacity.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <input
                      {...register('isAntiTheftCoFitted')}
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">Is Anti-Theft Co Fitted</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      {...register('isBiFuelCoFitted')}
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">Is Bi-Fuel Co Fitted</label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Variant Description</label>
                  <textarea
                    {...register('variantDescription')}
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
                    {editingVariant ? 'Update' : 'Add'} Variant
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



