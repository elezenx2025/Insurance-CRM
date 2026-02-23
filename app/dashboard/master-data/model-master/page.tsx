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

const modelSchema = z.object({
  oemId: z.string().min(1, 'OEM ID is required'),
  modelId: z.string().min(1, 'Model ID is required'),
  modelCode: z.string().min(1, 'Model Code is required'),
  modelName: z.string().min(1, 'Model Name is required'),
  bodyType: z.string().min(1, 'Body Type is required'),
  modelDescription: z.string().optional(),
  isActive: z.boolean(),
  createdBy: z.string().min(1, 'Created By is required'),
  createdDate: z.string().min(1, 'Created Date is required'),
  createdProcName: z.string().min(1, 'Created Proc Name is required'),
  updatedBy: z.string().optional(),
  updatedDate: z.string().optional(),
  activeFromDate: z.string().min(1, 'Active From Date is required'),
  activeToDate: z.string().optional(),
})

type ModelForm = z.infer<typeof modelSchema>

interface Model {
  id: string
  oemId: string
  modelId: string
  modelCode: string
  modelName: string
  bodyType: string
  modelDescription?: string
  isActive: boolean
  createdBy: string
  createdDate: string
  createdProcName: string
  updatedBy?: string
  updatedDate?: string
  activeFromDate: string
  activeToDate?: string
}

export default function ModelMasterPage() {
  const router = useRouter()
  const [models, setModels] = useState<Model[]>([])
  const [filteredModels, setFilteredModels] = useState<Model[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingModel, setEditingModel] = useState<Model | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ModelForm>({
    resolver: zodResolver(modelSchema),
  })

  // Mock data
  useEffect(() => {
    const mockData: Model[] = [
      // Maruti Suzuki Models (OEM008)
      {
        id: '1',
        oemId: 'OEM008',
        modelId: 'MOD001',
        modelCode: 'SWIFT',
        modelName: 'Swift',
        bodyType: 'Hatchback',
        modelDescription: 'Maruti Suzuki - Compact hatchback car',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MODEL_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '2',
        oemId: 'OEM008',
        modelId: 'MOD002',
        modelCode: 'BALENO',
        modelName: 'Baleno',
        bodyType: 'Hatchback',
        modelDescription: 'Maruti Suzuki - Premium hatchback',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MODEL_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '3',
        oemId: 'OEM008',
        modelId: 'MOD003',
        modelCode: 'DZIRE',
        modelName: 'Dzire',
        bodyType: 'Sedan',
        modelDescription: 'Maruti Suzuki - Compact sedan',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MODEL_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '4',
        oemId: 'OEM008',
        modelId: 'MOD004',
        modelCode: 'ALTO',
        modelName: 'Alto',
        bodyType: 'Hatchback',
        modelDescription: 'Maruti Suzuki - Entry-level hatchback',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MODEL_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '5',
        oemId: 'OEM008',
        modelId: 'MOD005',
        modelCode: 'WAGON_R',
        modelName: 'Wagon R',
        bodyType: 'Hatchback',
        modelDescription: 'Maruti Suzuki - Tall-boy hatchback',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MODEL_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '6',
        oemId: 'OEM008',
        modelId: 'MOD006',
        modelCode: 'BREZZA',
        modelName: 'Brezza',
        bodyType: 'SUV',
        modelDescription: 'Maruti Suzuki - Compact SUV',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MODEL_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '7',
        oemId: 'OEM008',
        modelId: 'MOD007',
        modelCode: 'ERTIGA',
        modelName: 'Ertiga',
        bodyType: 'MPV',
        modelDescription: 'Maruti Suzuki - Multi-purpose vehicle',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MODEL_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '8',
        oemId: 'OEM008',
        modelId: 'MOD008',
        modelCode: 'CIAZ',
        modelName: 'Ciaz',
        bodyType: 'Sedan',
        modelDescription: 'Maruti Suzuki - Premium sedan',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MODEL_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      // Hyundai Models (OEM009)
      {
        id: '9',
        oemId: 'OEM009',
        modelId: 'MOD009',
        modelCode: 'I20',
        modelName: 'i20',
        bodyType: 'Hatchback',
        modelDescription: 'Hyundai - Premium hatchback',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MODEL_INSERT',
        updatedBy: 'Admin',
        updatedDate: '2024-01-15',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '10',
        oemId: 'OEM009',
        modelId: 'MOD010',
        modelCode: 'CRETA',
        modelName: 'Creta',
        bodyType: 'SUV',
        modelDescription: 'Hyundai - Mid-size SUV',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MODEL_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '11',
        oemId: 'OEM009',
        modelId: 'MOD011',
        modelCode: 'VENUE',
        modelName: 'Venue',
        bodyType: 'SUV',
        modelDescription: 'Hyundai - Compact SUV',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MODEL_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      // Tata Models (OEM010)
      {
        id: '12',
        oemId: 'OEM010',
        modelId: 'MOD012',
        modelCode: 'NEXON',
        modelName: 'Nexon',
        bodyType: 'SUV',
        modelDescription: 'Tata - Compact SUV',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MODEL_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '13',
        oemId: 'OEM010',
        modelId: 'MOD013',
        modelCode: 'HARRIER',
        modelName: 'Harrier',
        bodyType: 'SUV',
        modelDescription: 'Tata - Mid-size SUV',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MODEL_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '14',
        oemId: 'OEM010',
        modelId: 'MOD014',
        modelCode: 'PUNCH',
        modelName: 'Punch',
        bodyType: 'SUV',
        modelDescription: 'Tata - Micro SUV',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MODEL_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      // Honda Models (OEM011)
      {
        id: '15',
        oemId: 'OEM011',
        modelId: 'MOD015',
        modelCode: 'CITY',
        modelName: 'City',
        bodyType: 'Sedan',
        modelDescription: 'Honda - Mid-size sedan',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MODEL_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '16',
        oemId: 'OEM011',
        modelId: 'MOD016',
        modelCode: 'AMAZE',
        modelName: 'Amaze',
        bodyType: 'Sedan',
        modelDescription: 'Honda - Compact sedan',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MODEL_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      // Mahindra Models (OEM012)
      {
        id: '17',
        oemId: 'OEM012',
        modelId: 'MOD017',
        modelCode: 'SCORPIO',
        modelName: 'Scorpio',
        bodyType: 'SUV',
        modelDescription: 'Mahindra - Full-size SUV',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MODEL_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '18',
        oemId: 'OEM012',
        modelId: 'MOD018',
        modelCode: 'XUV700',
        modelName: 'XUV700',
        bodyType: 'SUV',
        modelDescription: 'Mahindra - Premium SUV',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MODEL_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '19',
        oemId: 'OEM012',
        modelId: 'MOD019',
        modelCode: 'THAR',
        modelName: 'Thar',
        bodyType: 'SUV',
        modelDescription: 'Mahindra - Off-road SUV',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MODEL_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      // Kia Models (OEM013)
      {
        id: '20',
        oemId: 'OEM013',
        modelId: 'MOD020',
        modelCode: 'SELTOS',
        modelName: 'Seltos',
        bodyType: 'SUV',
        modelDescription: 'Kia - Compact SUV',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MODEL_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '21',
        oemId: 'OEM013',
        modelId: 'MOD021',
        modelCode: 'SONET',
        modelName: 'Sonet',
        bodyType: 'SUV',
        modelDescription: 'Kia - Sub-compact SUV',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MODEL_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '22',
        oemId: 'OEM013',
        modelId: 'MOD022',
        modelCode: 'CARENS',
        modelName: 'Carens',
        bodyType: 'MPV',
        modelDescription: 'Kia - Multi-purpose vehicle',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MODEL_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      // MG Models (OEM014)
      {
        id: '23',
        oemId: 'OEM014',
        modelId: 'MOD023',
        modelCode: 'HECTOR',
        modelName: 'Hector',
        bodyType: 'SUV',
        modelDescription: 'MG - Mid-size SUV',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MODEL_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '24',
        oemId: 'OEM014',
        modelId: 'MOD024',
        modelCode: 'ASTOR',
        modelName: 'Astor',
        bodyType: 'SUV',
        modelDescription: 'MG - Compact SUV',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MODEL_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      // Toyota Models (OEM015)
      {
        id: '25',
        oemId: 'OEM015',
        modelId: 'MOD025',
        modelCode: 'FORTUNER',
        modelName: 'Fortuner',
        bodyType: 'SUV',
        modelDescription: 'Toyota - Premium SUV',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MODEL_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '26',
        oemId: 'OEM015',
        modelId: 'MOD026',
        modelCode: 'INNOVA',
        modelName: 'Innova Crysta',
        bodyType: 'MPV',
        modelDescription: 'Toyota - Premium MPV',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MODEL_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      // 2-Wheeler Models
      {
        id: '27',
        oemId: 'OEM001',
        modelId: 'MOD027',
        modelCode: 'SPLENDOR',
        modelName: 'Splendor Plus',
        bodyType: 'Motorcycle',
        modelDescription: 'Hero - Popular commuter bike',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MODEL_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '28',
        oemId: 'OEM002',
        modelId: 'MOD028',
        modelCode: 'ACTIVA',
        modelName: 'Activa',
        bodyType: 'Scooter',
        modelDescription: 'Honda - Popular scooter',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MODEL_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '29',
        oemId: 'OEM003',
        modelId: 'MOD029',
        modelCode: 'PULSAR',
        modelName: 'Pulsar',
        bodyType: 'Motorcycle',
        modelDescription: 'Bajaj - Sports motorcycle',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MODEL_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      // PCV Models
      {
        id: '30',
        oemId: 'OEM016',
        modelId: 'MOD030',
        modelCode: 'STARBUS',
        modelName: 'Starbus',
        bodyType: 'Bus',
        modelDescription: 'Tata - Passenger bus',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MODEL_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '31',
        oemId: 'OEM017',
        modelId: 'MOD031',
        modelCode: 'LYNX',
        modelName: 'Lynx',
        bodyType: 'Bus',
        modelDescription: 'Ashok Leyland - Passenger bus',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MODEL_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      // GCV Models
      {
        id: '32',
        oemId: 'OEM020',
        modelId: 'MOD032',
        modelCode: 'ACE',
        modelName: 'Ace',
        bodyType: 'Truck',
        modelDescription: 'Tata - Light commercial vehicle',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MODEL_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '33',
        oemId: 'OEM021',
        modelId: 'MOD033',
        modelCode: 'DOST',
        modelName: 'Dost',
        bodyType: 'Truck',
        modelDescription: 'Ashok Leyland - Light commercial vehicle',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MODEL_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '34',
        oemId: 'OEM022',
        modelId: 'MOD034',
        modelCode: 'PRO_2000',
        modelName: 'Pro 2000',
        bodyType: 'Truck',
        modelDescription: 'Eicher - Commercial truck',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MODEL_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      // Misc-D Models
      {
        id: '35',
        oemId: 'OEM025',
        modelId: 'MOD035',
        modelCode: 'YUVO',
        modelName: 'Yuvo',
        bodyType: 'Tractor',
        modelDescription: 'Mahindra - Agricultural tractor',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MODEL_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '36',
        oemId: 'OEM026',
        modelId: 'MOD036',
        modelCode: '5000_SERIES',
        modelName: '5000 Series',
        bodyType: 'Tractor',
        modelDescription: 'John Deere - Agricultural tractor',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MODEL_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '37',
        oemId: 'OEM029',
        modelId: 'MOD037',
        modelCode: 'EXCAVATOR',
        modelName: 'Excavator',
        bodyType: 'Heavy Equipment',
        modelDescription: 'JCB - Construction equipment',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_MODEL_INSERT',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
    ]
    setModels(mockData)
  }, [])

  // Filter data based on search term
  useEffect(() => {
    let filtered = models

    if (searchTerm) {
      filtered = filtered.filter(model =>
        model.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.modelCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.modelId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.bodyType.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredModels(filtered)
  }, [models, searchTerm])

  const handleAddModel = () => {
    setEditingModel(null)
    reset({
      oemId: '',
      modelId: '',
      modelCode: '',
      modelName: '',
      bodyType: '',
      modelDescription: '',
      isActive: true,
      createdBy: 'Current User',
      createdDate: new Date().toISOString().split('T')[0],
      createdProcName: 'PROC_MODEL_INSERT',
      updatedBy: '',
      updatedDate: '',
      activeFromDate: new Date().toISOString().split('T')[0],
      activeToDate: '',
    })
    setShowModal(true)
  }

  const handleEditModel = (model: Model) => {
    setEditingModel(model)
    reset({
      oemId: model.oemId,
      modelId: model.modelId,
      modelCode: model.modelCode,
      modelName: model.modelName,
      bodyType: model.bodyType,
      modelDescription: model.modelDescription || '',
      isActive: model.isActive,
      createdBy: model.createdBy,
      createdDate: model.createdDate,
      createdProcName: model.createdProcName,
      updatedBy: model.updatedBy || '',
      updatedDate: model.updatedDate || '',
      activeFromDate: model.activeFromDate,
      activeToDate: model.activeToDate || '',
    })
    setShowModal(true)
  }

  const onSubmit = (data: ModelForm) => {
    if (editingModel) {
      // Update existing model
      setModels(prev =>
        prev.map(model =>
          model.id === editingModel.id
            ? {
                ...model,
                ...data,
                updatedBy: 'Current User',
                updatedDate: new Date().toISOString().split('T')[0],
              }
            : model
        )
      )
      toast.success('Model updated successfully!')
    } else {
      // Add new model
      const newModel: Model = {
        id: Date.now().toString(),
        ...data,
      }
      setModels(prev => [...prev, newModel])
      toast.success('Model added successfully!')
    }
    setShowModal(false)
    reset()
  }

  const handleDeleteModel = (id: string) => {
    if (confirm('Are you sure you want to delete this model?')) {
      setModels(prev => prev.filter(model => model.id !== id))
      toast.success('Model deleted successfully!')
    }
  }

  const totalPages = Math.ceil(filteredModels.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentModels = filteredModels.slice(startIndex, endIndex)

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
                <span className="ml-4 text-gray-900 font-medium">Model Master</span>
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
            <h1 className="text-lg font-semibold text-gray-900">Model Master</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage vehicle model information
            </p>
          </div>
        </div>
        <button
          onClick={handleAddModel}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Model
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
                placeholder="Search models..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {filteredModels.length} models
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
                  Model Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Model Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Body Type
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
              {currentModels.map((model) => (
                <tr key={model.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {model.oemId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {model.modelId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {model.modelCode}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {model.modelName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {model.bodyType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      model.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {model.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditModel(model)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteModel(model.id)}
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
                  <span className="font-medium">{Math.min(endIndex, filteredModels.length)}</span> of{' '}
                  <span className="font-medium">{filteredModels.length}</span> results
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
                {editingModel ? 'Edit Model' : 'Add New Model'}
              </h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">OEM ID *</label>
                    <input
                      {...register('oemId')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., OEM008"
                    />
                    {errors.oemId && <p className="text-red-500 text-xs mt-1">{errors.oemId.message}</p>}
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Model Code *</label>
                    <input
                      {...register('modelCode')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.modelCode && <p className="text-red-500 text-xs mt-1">{errors.modelCode.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Model Name *</label>
                    <input
                      {...register('modelName')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.modelName && <p className="text-red-500 text-xs mt-1">{errors.modelName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Body Type *</label>
                    <select
                      {...register('bodyType')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Body Type</option>
                      <option value="Hatchback">Hatchback</option>
                      <option value="Sedan">Sedan</option>
                      <option value="SUV">SUV</option>
                      <option value="MUV">MUV</option>
                      <option value="Coupe">Coupe</option>
                      <option value="Convertible">Convertible</option>
                      <option value="Wagon">Wagon</option>
                      <option value="Van">Van</option>
                      <option value="Truck">Truck</option>
                      <option value="Bus">Bus</option>
                    </select>
                    {errors.bodyType && <p className="text-red-500 text-xs mt-1">{errors.bodyType.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Model Description</label>
                  <textarea
                    {...register('modelDescription')}
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
                    {editingModel ? 'Update' : 'Add'} Model
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



