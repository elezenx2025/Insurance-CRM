'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  CloudArrowUpIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const trainingMaterialSchema = z.object({
  agentTypeId: z.string().min(1, 'Agent type is required'),
  agentTypeName: z.string().min(1, 'Agent type name is required'),
  policyTypeIds: z.array(z.string()).min(1, 'At least one policy type is required'),
  policyTypeNames: z.array(z.string()).min(1, 'At least one policy type is required'),
  moduleId: z.string().min(1, 'Module is required'),
  moduleName: z.string().min(1, 'Module name is required'),
  topicId: z.string().min(1, 'Topic is required'),
  topicName: z.string().min(1, 'Topic name is required'),
  documentName: z.string().min(1, 'Document name is required'),
  documentFile: z.any().refine((file) => file && file.length > 0, 'PDF document is required'),
  validityFrom: z.string().min(1, 'Validity from date is required'),
  validityTo: z.string().min(1, 'Validity to date is required'),
  isActive: z.boolean(),
})

type TrainingMaterialForm = z.infer<typeof trainingMaterialSchema>

interface TrainingMaterial {
  id: string
  agentTypeId: string
  agentTypeName: string
  policyTypeIds: string[]
  policyTypeNames: string[]
  moduleId: string
  moduleName: string
  topicId: string
  topicName: string
  documentName: string
  documentPath: string
  validityFrom: string
  validityTo: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface AgentType {
  id: string
  name: string
  code: string
}

interface PolicyType {
  id: string
  name: string
  code: string
}

interface TrainingModule {
  id: string
  name: string
  agentTypeId: string
  topics: Array<{
    id: string
    name: string
    duration: number
  }>
}

const AGENT_TYPES: AgentType[] = [
  { id: '1', name: 'Life Insurance Agent', code: 'LIA' },
  { id: '2', name: 'General Insurance Agent', code: 'GIA' },
  { id: '3', name: 'Health Insurance Agent', code: 'HIA' },
  { id: '4', name: 'Motor Insurance Agent', code: 'MIA' },
  { id: '5', name: 'Corporate Insurance Agent', code: 'CIA' },
  { id: '6', name: 'Senior Insurance Agent', code: 'SIA' },
  { id: '7', name: 'New Agent', code: 'NA' },
  { id: '8', name: 'Digital Insurance Agent', code: 'DIA' },
]

const POLICY_TYPES: PolicyType[] = [
  { id: '1', name: 'Life Insurance', code: 'LI' },
  { id: '2', name: 'Term Life Insurance', code: 'TLI' },
  { id: '3', name: 'Whole Life Insurance', code: 'WLI' },
  { id: '4', name: 'Endowment Policy', code: 'EP' },
  { id: '5', name: 'Motor Insurance', code: 'MI' },
  { id: '6', name: 'Health Insurance', code: 'HI' },
  { id: '7', name: 'Travel Insurance', code: 'TI' },
  { id: '8', name: 'Home Insurance', code: 'HOMI' },
  { id: '9', name: 'Fire Insurance', code: 'FI' },
  { id: '10', name: 'Marine Insurance', code: 'MARINE' },
  { id: '11', name: 'Corporate Insurance', code: 'CI' },
  { id: '12', name: 'Group Insurance', code: 'GI' },
]

const TRAINING_MODULES: TrainingModule[] = [
  {
    id: '1',
    name: 'Life Insurance Fundamentals',
    agentTypeId: '1',
    topics: [
      { id: '1', name: 'Introduction to Life Insurance', duration: 2.0 },
      { id: '2', name: 'Types of Life Insurance Policies', duration: 3.0 },
      { id: '3', name: 'Premium Calculation', duration: 2.5 },
      { id: '4', name: 'Claims Process', duration: 1.5 },
    ]
  },
  {
    id: '2',
    name: 'General Insurance Basics',
    agentTypeId: '2',
    topics: [
      { id: '5', name: 'Overview of General Insurance', duration: 1.5 },
      { id: '6', name: 'Motor Insurance Products', duration: 2.0 },
      { id: '7', name: 'Property Insurance', duration: 2.0 },
      { id: '8', name: 'Risk Assessment', duration: 1.5 },
    ]
  },
  {
    id: '3',
    name: 'Health Insurance Specialization',
    agentTypeId: '3',
    topics: [
      { id: '9', name: 'Health Insurance Products', duration: 2.5 },
      { id: '10', name: 'Medical Terminology', duration: 1.5 },
      { id: '11', name: 'Claims and Reimbursement', duration: 2.0 },
      { id: '12', name: 'Network Hospitals', duration: 1.0 },
    ]
  },
]

export default function TrainingMaterial() {
  const router = useRouter()
  const [trainingMaterials, setTrainingMaterials] = useState<TrainingMaterial[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingMaterial, setEditingMaterial] = useState<TrainingMaterial | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterAgentType, setFilterAgentType] = useState('ALL')
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [availableModules, setAvailableModules] = useState<TrainingModule[]>([])
  const [availableTopics, setAvailableTopics] = useState<Array<{id: string, name: string, duration: number}>>([])

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TrainingMaterialForm>({
    resolver: zodResolver(trainingMaterialSchema),
    defaultValues: {
      agentTypeId: '',
      agentTypeName: '',
      policyTypeIds: [],
      policyTypeNames: [],
      moduleId: '',
      moduleName: '',
      topicId: '',
      topicName: '',
      documentName: '',
      validityFrom: '',
      validityTo: '',
      isActive: true,
    },
  })

  const selectedAgentTypeId = watch('agentTypeId')
  const selectedPolicyTypeIds = watch('policyTypeIds')
  const selectedModuleId = watch('moduleId')

  useEffect(() => {
    fetchTrainingMaterials()
  }, [])

  useEffect(() => {
    if (selectedAgentTypeId) {
      const selectedAgentType = AGENT_TYPES.find(at => at.id === selectedAgentTypeId)
      if (selectedAgentType) {
        setValue('agentTypeName', selectedAgentType.name)
      }
      
      // Filter modules by agent type
      const modules = TRAINING_MODULES.filter(module => module.agentTypeId === selectedAgentTypeId)
      setAvailableModules(modules)
    } else {
      setAvailableModules([])
      setAvailableTopics([])
    }
  }, [selectedAgentTypeId, setValue])

  useEffect(() => {
    if (selectedPolicyTypeIds.length > 0) {
      const selectedPolicyTypes = POLICY_TYPES.filter(pt => selectedPolicyTypeIds.includes(pt.id))
      setValue('policyTypeNames', selectedPolicyTypes.map(pt => pt.name))
    } else {
      setValue('policyTypeNames', [])
    }
  }, [selectedPolicyTypeIds, setValue])

  useEffect(() => {
    if (selectedModuleId) {
      const selectedModule = availableModules.find(module => module.id === selectedModuleId)
      if (selectedModule) {
        setValue('moduleName', selectedModule.name)
        setAvailableTopics(selectedModule.topics)
      }
    } else {
      setAvailableTopics([])
    }
  }, [selectedModuleId, availableModules, setValue])

  const fetchTrainingMaterials = async () => {
    try {
      setLoading(true)
      // Mock data - replace with actual API call
      const mockMaterials: TrainingMaterial[] = [
        {
          id: '1',
          agentTypeId: '1',
          agentTypeName: 'Life Insurance Agent',
          policyTypeIds: ['1', '2'],
          policyTypeNames: ['Life Insurance', 'Term Life Insurance'],
          moduleId: '1',
          moduleName: 'Life Insurance Fundamentals',
          topicId: '1',
          topicName: 'Introduction to Life Insurance',
          documentName: 'Introduction to Life Insurance Guide',
          documentPath: '/documents/life-insurance-intro.pdf',
          validityFrom: '2024-01-01',
          validityTo: '2024-12-31',
          isActive: true,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
        {
          id: '2',
          agentTypeId: '1',
          agentTypeName: 'Life Insurance Agent',
          policyTypeIds: ['1', '3'],
          policyTypeNames: ['Life Insurance', 'Whole Life Insurance'],
          moduleId: '1',
          moduleName: 'Life Insurance Fundamentals',
          topicId: '2',
          topicName: 'Types of Life Insurance Policies',
          documentName: 'Life Insurance Policy Types',
          documentPath: '/documents/life-insurance-types.pdf',
          validityFrom: '2024-01-01',
          validityTo: '2024-12-31',
          isActive: true,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
        {
          id: '3',
          agentTypeId: '2',
          agentTypeName: 'General Insurance Agent',
          policyTypeIds: ['5', '8'],
          policyTypeNames: ['Motor Insurance', 'Home Insurance'],
          moduleId: '2',
          moduleName: 'General Insurance Basics',
          topicId: '6',
          topicName: 'Motor Insurance Products',
          documentName: 'Motor Insurance Product Guide',
          documentPath: '/documents/motor-insurance-guide.pdf',
          validityFrom: '2024-01-01',
          validityTo: '2024-12-31',
          isActive: true,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
      ]

      // Apply filters
      let filteredMaterials = mockMaterials
      if (searchTerm) {
        filteredMaterials = filteredMaterials.filter(
          (material) =>
            material.documentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            material.agentTypeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            material.moduleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            material.topicName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }
      if (filterAgentType !== 'ALL') {
        filteredMaterials = filteredMaterials.filter((material) => material.agentTypeId === filterAgentType)
      }
      if (filterStatus !== 'ALL') {
        filteredMaterials = filteredMaterials.filter((material) => 
          filterStatus === 'ACTIVE' ? material.isActive : !material.isActive
        )
      }

      setTrainingMaterials(filteredMaterials)
    } catch (error) {
      console.error('Error fetching training materials:', error)
      toast.error('Failed to fetch training materials')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: TrainingMaterialForm) => {
    try {
      if (editingMaterial) {
        const updatedMaterial = { 
          ...editingMaterial, 
          ...data,
          documentPath: data.documentFile ? URL.createObjectURL(data.documentFile[0]) : editingMaterial.documentPath,
          updatedAt: new Date().toISOString() 
        }
        setTrainingMaterials(trainingMaterials.map((tm) => (tm.id === updatedMaterial.id ? updatedMaterial : tm)))
        toast.success('Training material updated successfully!')
      } else {
        const newMaterial: TrainingMaterial = {
          id: String(trainingMaterials.length + 1),
          ...data,
          documentPath: data.documentFile ? URL.createObjectURL(data.documentFile[0]) : '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        setTrainingMaterials([...trainingMaterials, newMaterial])
        toast.success('Training material created successfully!')
      }

      setShowModal(false)
      reset()
      setEditingMaterial(null)
    } catch (error) {
      console.error('Error saving training material:', error)
      toast.error('Failed to save training material')
    }
  }

  const openAddModal = () => {
    setEditingMaterial(null)
    reset({
      agentTypeId: '',
      agentTypeName: '',
      policyTypeIds: [],
      policyTypeNames: [],
      moduleId: '',
      moduleName: '',
      topicId: '',
      topicName: '',
      documentName: '',
      validityFrom: '',
      validityTo: '',
      isActive: true,
    })
    setAvailableModules([])
    setAvailableTopics([])
    setShowModal(true)
  }

  const openEditModal = (material: TrainingMaterial) => {
    setEditingMaterial(material)
    setValue('agentTypeId', material.agentTypeId)
    setValue('agentTypeName', material.agentTypeName)
    setValue('policyTypeIds', material.policyTypeIds)
    setValue('policyTypeNames', material.policyTypeNames)
    setValue('moduleId', material.moduleId)
    setValue('moduleName', material.moduleName)
    setValue('topicId', material.topicId)
    setValue('topicName', material.topicName)
    setValue('documentName', material.documentName)
    setValue('validityFrom', material.validityFrom)
    setValue('validityTo', material.validityTo)
    setValue('isActive', material.isActive)
    
    // Set available modules and topics
    const modules = TRAINING_MODULES.filter(module => module.agentTypeId === material.agentTypeId)
    setAvailableModules(modules)
    const selectedModule = modules.find(module => module.id === material.moduleId)
    if (selectedModule) {
      setAvailableTopics(selectedModule.topics)
    }
    
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this training material?')) {
      try {
        setTrainingMaterials(trainingMaterials.filter((tm) => tm.id !== id))
        toast.success('Training material deleted successfully')
      } catch (error) {
        console.error('Error deleting training material:', error)
        toast.error('Failed to delete training material')
      }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
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
                <button onClick={() => router.push('/dashboard/lms-masters')} className="ml-4 text-gray-400 hover:text-gray-500">
                  LMS Masters
                </button>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="text-gray-400">/</span>
                <span className="ml-4 text-gray-900 font-medium">Training Material</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      {/* Page header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/dashboard/lms-masters')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Training Material</h1>
            <p className="mt-1 text-sm text-gray-600">
              Upload and manage training materials (PDF documents) for different modules and topics.
            </p>
          </div>
        </div>
        <button onClick={openAddModal} className="btn btn-primary btn-md">
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Training Material
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
                placeholder="Search training materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterAgentType}
              onChange={(e) => setFilterAgentType(e.target.value)}
              className="input"
            >
              <option value="ALL">All Agent Types</option>
              {AGENT_TYPES.map((agentType) => (
                <option key={agentType.id} value={agentType.id}>
                  {agentType.name}
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
          </div>
        </div>
      </div>

      {/* Training Materials Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-head">Document Name</th>
                <th className="table-head">Agent Type</th>
                <th className="table-head">Policy Types</th>
                <th className="table-head">Module</th>
                <th className="table-head">Topic</th>
                <th className="table-head">Validity</th>
                <th className="table-head">Status</th>
                <th className="table-head">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {trainingMaterials.length === 0 ? (
                <tr>
                  <td colSpan={8} className="table-cell text-center py-8 text-gray-500">
                    No training materials found
                  </td>
                </tr>
              ) : (
                trainingMaterials.map((material) => (
                  <tr key={material.id} className="table-row">
                    <td className="table-cell">
                      <div className="flex items-center">
                        <DocumentTextIcon className="h-5 w-5 text-red-500 mr-2" />
                        <div className="font-medium">{material.documentName}</div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="text-sm">{material.agentTypeName}</span>
                    </td>
                    <td className="table-cell">
                      <div className="flex flex-wrap gap-1">
                        {material.policyTypeNames.map((name, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                            {name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="text-sm">{material.moduleName}</span>
                    </td>
                    <td className="table-cell">
                      <span className="text-sm">{material.topicName}</span>
                    </td>
                    <td className="table-cell">
                      <div className="text-sm">
                        <div>{formatDate(material.validityFrom)}</div>
                        <div className="text-gray-500">to {formatDate(material.validityTo)}</div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        material.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {material.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => window.open(material.documentPath, '_blank')}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Document"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(material)}
                          className="text-green-600 hover:text-green-900"
                          title="Edit"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(material.id)}
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

      {/* Training Material Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-5 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingMaterial ? 'Edit Training Material' : 'Add Training Material'}
              </h3>
              
              <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Agent Type *
                    </label>
                    <select
                      {...register('agentTypeId')}
                      className="input"
                    >
                      <option value="">Select Agent Type</option>
                      {AGENT_TYPES.map((agentType) => (
                        <option key={agentType.id} value={agentType.id}>
                          {agentType.name}
                        </option>
                      ))}
                    </select>
                    {errors.agentTypeId && (
                      <p className="text-red-600 text-xs mt-1">{errors.agentTypeId.message as string}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Policy Types * (Multiple Selection)
                    </label>
                    <select
                      multiple
                      {...register('policyTypeIds')}
                      className="input h-32"
                    >
                      {POLICY_TYPES.map((policyType) => (
                        <option key={policyType.id} value={policyType.id}>
                          {policyType.name}
                        </option>
                      ))}
                    </select>
                    {errors.policyTypeIds && (
                      <p className="text-red-600 text-xs mt-1">{errors.policyTypeIds.message as string}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Module *
                    </label>
                    <select
                      {...register('moduleId')}
                      className="input"
                      disabled={availableModules.length === 0}
                    >
                      <option value="">Select Module</option>
                      {availableModules.map((module) => (
                        <option key={module.id} value={module.id}>
                          {module.name}
                        </option>
                      ))}
                    </select>
                    {errors.moduleId && (
                      <p className="text-red-600 text-xs mt-1">{errors.moduleId.message as string}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Topic *
                    </label>
                    <select
                      {...register('topicId')}
                      className="input"
                      disabled={availableTopics.length === 0}
                    >
                      <option value="">Select Topic</option>
                      {availableTopics.map((topic) => (
                        <option key={topic.id} value={topic.id}>
                          {topic.name}
                        </option>
                      ))}
                    </select>
                    {errors.topicId && (
                      <p className="text-red-600 text-xs mt-1">{errors.topicId.message as string}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Document Name *
                    </label>
                    <input
                      type="text"
                      {...register('documentName')}
                      className="input"
                      placeholder="Enter document name"
                    />
                    {errors.documentName && (
                      <p className="text-red-600 text-xs mt-1">{errors.documentName.message as string}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Upload PDF Document *
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="document-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                          >
                            <span>Upload a PDF file</span>
                            <input
                              id="document-upload"
                              type="file"
                              className="sr-only"
                              accept=".pdf"
                              {...register('documentFile')}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PDF files only, up to 10MB</p>
                      </div>
                    </div>
                    {errors.documentFile && (
                      <p className="text-red-600 text-xs mt-1">{errors.documentFile.message as string}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Validity From *
                    </label>
                    <input
                      type="date"
                      {...register('validityFrom')}
                      className="input"
                    />
                    {errors.validityFrom && (
                      <p className="text-red-600 text-xs mt-1">{errors.validityFrom.message as string}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Validity To *
                    </label>
                    <input
                      type="date"
                      {...register('validityTo')}
                      className="input"
                    />
                    {errors.validityTo && (
                      <p className="text-red-600 text-xs mt-1">{errors.validityTo.message as string}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('isActive')}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Active
                  </label>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      setEditingMaterial(null)
                      reset()
                    }}
                    className="btn btn-secondary btn-md"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-md">
                    {editingMaterial ? 'Update Material' : 'Create Material'}
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

