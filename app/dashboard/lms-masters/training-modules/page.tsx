'use client'

import { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  AcademicCapIcon,
  XMarkIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const topicSchema = z.object({
  name: z.string().min(1, 'Topic name is required'),
  duration: z.number().min(0.1, 'Duration must be at least 0.1 hours'),
})

const trainingModuleSchema = z.object({
  agentTypeId: z.string().min(1, 'Agent type is required'),
  agentTypeName: z.string().min(1, 'Agent type name is required'),
  policyTypeIds: z.array(z.string()).min(1, 'At least one policy type is required'),
  policyTypeNames: z.array(z.string()).min(1, 'At least one policy type is required'),
  moduleName: z.string().min(1, 'Module name is required'),
  topics: z.array(topicSchema).min(1, 'At least one topic is required'),
  totalDuration: z.number().min(0.1, 'Total duration must be at least 0.1 hours'),
  validityFrom: z.string().min(1, 'Validity from date is required'),
  validityTo: z.string().min(1, 'Validity to date is required'),
  isActive: z.boolean(),
})

type TrainingModuleForm = z.infer<typeof trainingModuleSchema>

interface TrainingModule {
  id: string
  agentTypeId: string
  agentTypeName: string
  policyTypeIds: string[]
  policyTypeNames: string[]
  moduleName: string
  topics: Array<{
    name: string
    duration: number
  }>
  totalDuration: number
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

const AGENT_TYPES: AgentType[] = [
  { id: '1', name: 'PoSP', code: 'POSP' },
  { id: '2', name: 'MISP', code: 'MISP' },
  { id: '3', name: 'Agent', code: 'AGENT' },
  { id: '4', name: 'PoSP – Motor', code: 'POSP_MOTOR' },
  { id: '5', name: 'PoSP – Health', code: 'POSP_HEALTH' },
  { id: '6', name: 'PoSP – Life', code: 'POSP_LIFE' },
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

export default function TrainingModules() {
  const router = useRouter()
  const [trainingModules, setTrainingModules] = useState<TrainingModule[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingModule, setEditingModule] = useState<TrainingModule | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterAgentType, setFilterAgentType] = useState('ALL')
  const [filterStatus, setFilterStatus] = useState('ALL')

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<TrainingModuleForm>({
    resolver: zodResolver(trainingModuleSchema),
    defaultValues: {
      agentTypeId: '',
      agentTypeName: '',
      policyTypeIds: [],
      policyTypeNames: [],
      moduleName: '',
      topics: [{ name: '', duration: 0 }],
      totalDuration: 0,
      validityFrom: '',
      validityTo: '',
      isActive: true,
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'topics',
  })

  const selectedAgentTypeId = watch('agentTypeId')
  const selectedPolicyTypeIds = watch('policyTypeIds')
  const topics = watch('topics')

  useEffect(() => {
    fetchTrainingModules()
  }, [])

  useEffect(() => {
    if (selectedAgentTypeId) {
      const selectedAgentType = AGENT_TYPES.find(at => at.id === selectedAgentTypeId)
      if (selectedAgentType) {
        setValue('agentTypeName', selectedAgentType.name)
      }
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
    const total = topics.reduce((sum, topic) => sum + (topic.duration || 0), 0)
    setValue('totalDuration', total)
  }, [topics, setValue])

  const fetchTrainingModules = async () => {
    try {
      setLoading(true)
      // Mock data - replace with actual API call
      const mockModules: TrainingModule[] = [
        {
          id: '1',
          agentTypeId: '1',
          agentTypeName: 'PoSP',
          policyTypeIds: ['1', '2', '3'],
          policyTypeNames: ['Life Insurance', 'Term Life Insurance', 'Whole Life Insurance'],
          moduleName: 'Life Insurance Fundamentals',
          topics: [
            { name: 'Introduction to Life Insurance', duration: 2.0 },
            { name: 'Types of Life Insurance Policies', duration: 3.0 },
            { name: 'Premium Calculation', duration: 2.5 },
            { name: 'Claims Process', duration: 1.5 },
          ],
          totalDuration: 9.0,
          validityFrom: '2024-01-01',
          validityTo: '2024-12-31',
          isActive: true,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
        {
          id: '2',
          agentTypeId: '2',
          agentTypeName: 'MISP',
          policyTypeIds: ['5', '8', '9'],
          policyTypeNames: ['Motor Insurance', 'Home Insurance', 'Fire Insurance'],
          moduleName: 'General Insurance Basics',
          topics: [
            { name: 'Overview of General Insurance', duration: 1.5 },
            { name: 'Motor Insurance Products', duration: 2.0 },
            { name: 'Property Insurance', duration: 2.0 },
            { name: 'Risk Assessment', duration: 1.5 },
          ],
          totalDuration: 7.0,
          validityFrom: '2024-01-01',
          validityTo: '2024-12-31',
          isActive: true,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
        {
          id: '3',
          agentTypeId: '3',
          agentTypeName: 'Agent',
          policyTypeIds: ['6', '7'],
          policyTypeNames: ['Health Insurance', 'Travel Insurance'],
          moduleName: 'Health Insurance Specialization',
          topics: [
            { name: 'Health Insurance Products', duration: 2.5 },
            { name: 'Medical Terminology', duration: 1.5 },
            { name: 'Claims and Reimbursement', duration: 2.0 },
            { name: 'Network Hospitals', duration: 1.0 },
          ],
          totalDuration: 7.0,
          validityFrom: '2024-01-01',
          validityTo: '2024-12-31',
          isActive: true,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
      ]

      // Apply filters
      let filteredModules = mockModules
      if (searchTerm) {
        filteredModules = filteredModules.filter(
          (module) =>
            module.moduleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            module.agentTypeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            module.policyTypeNames.some(name => name.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      }
      if (filterAgentType !== 'ALL') {
        filteredModules = filteredModules.filter((module) => module.agentTypeId === filterAgentType)
      }
      if (filterStatus !== 'ALL') {
        filteredModules = filteredModules.filter((module) => 
          filterStatus === 'ACTIVE' ? module.isActive : !module.isActive
        )
      }

      setTrainingModules(filteredModules)
    } catch (error) {
      console.error('Error fetching training modules:', error)
      toast.error('Failed to fetch training modules')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: TrainingModuleForm) => {
    try {
      if (editingModule) {
        const updatedModule = { 
          ...editingModule, 
          ...data,
          updatedAt: new Date().toISOString() 
        }
        setTrainingModules(trainingModules.map((tm) => (tm.id === updatedModule.id ? updatedModule : tm)))
        toast.success('Training module updated successfully!')
      } else {
        const newModule: TrainingModule = {
          id: String(trainingModules.length + 1),
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        setTrainingModules([...trainingModules, newModule])
        toast.success('Training module created successfully!')
      }

      setShowModal(false)
      reset()
      setEditingModule(null)
    } catch (error) {
      console.error('Error saving training module:', error)
      toast.error('Failed to save training module')
    }
  }

  const openAddModal = () => {
    setEditingModule(null)
    reset({
      agentTypeId: '',
      agentTypeName: '',
      policyTypeIds: [],
      policyTypeNames: [],
      moduleName: '',
      topics: [{ name: '', duration: 0 }],
      totalDuration: 0,
      validityFrom: '',
      validityTo: '',
      isActive: true,
    })
    setShowModal(true)
  }

  const openEditModal = (module: TrainingModule) => {
    setEditingModule(module)
    setValue('agentTypeId', module.agentTypeId)
    setValue('agentTypeName', module.agentTypeName)
    setValue('policyTypeIds', module.policyTypeIds)
    setValue('policyTypeNames', module.policyTypeNames)
    setValue('moduleName', module.moduleName)
    setValue('topics', module.topics)
    setValue('totalDuration', module.totalDuration)
    setValue('validityFrom', module.validityFrom)
    setValue('validityTo', module.validityTo)
    setValue('isActive', module.isActive)
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this training module?')) {
      try {
        setTrainingModules(trainingModules.filter((tm) => tm.id !== id))
        toast.success('Training module deleted successfully')
      } catch (error) {
        console.error('Error deleting training module:', error)
        toast.error('Failed to delete training module')
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
                <span className="ml-4 text-gray-900 font-medium">Training Modules</span>
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
            <h1 className="text-2xl font-bold text-gray-900">Training Modules</h1>
            <p className="mt-1 text-sm text-gray-600">
              Create and manage training modules for different agent types and policy types.
            </p>
          </div>
        </div>
        <button onClick={openAddModal} className="btn btn-primary btn-md">
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Training Module
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
                placeholder="Search training modules..."
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

      {/* Training Modules Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-head">Module Name</th>
                <th className="table-head">Agent Type</th>
                <th className="table-head">Policy Types</th>
                <th className="table-head">Topics</th>
                <th className="table-head">Duration</th>
                <th className="table-head">Validity</th>
                <th className="table-head">Status</th>
                <th className="table-head">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {trainingModules.length === 0 ? (
                <tr>
                  <td colSpan={8} className="table-cell text-center py-8 text-gray-500">
                    No training modules found
                  </td>
                </tr>
              ) : (
                trainingModules.map((module) => (
                  <tr key={module.id} className="table-row">
                    <td className="table-cell">
                      <div className="font-medium">{module.moduleName}</div>
                    </td>
                    <td className="table-cell">
                      <span className="text-sm">{module.agentTypeName}</span>
                    </td>
                    <td className="table-cell">
                      <div className="flex flex-wrap gap-1">
                        {module.policyTypeNames.map((name, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                            {name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="text-sm text-gray-600">
                        {module.topics.length} topics
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm font-medium">
                        {module.totalDuration}h
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="text-sm">
                        <div>{formatDate(module.validityFrom)}</div>
                        <div className="text-gray-500">to {formatDate(module.validityTo)}</div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        module.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {module.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditModal(module)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => toast('View details coming soon')}
                          className="text-green-600 hover:text-green-900"
                          title="View"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(module.id)}
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

      {/* Training Module Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-5 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingModule ? 'Edit Training Module' : 'Add Training Module'}
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
                      <p className="text-red-600 text-xs mt-1">{errors.agentTypeId.message}</p>
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
                      <p className="text-red-600 text-xs mt-1">{errors.policyTypeIds.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Module Name *
                    </label>
                    <input
                      type="text"
                      {...register('moduleName')}
                      className="input"
                      placeholder="Enter module name"
                    />
                    {errors.moduleName && (
                      <p className="text-red-600 text-xs mt-1">{errors.moduleName.message}</p>
                    )}
                  </div>
                </div>

                {/* Topics Section */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Topics *
                    </label>
                    <button
                      type="button"
                      onClick={() => append({ name: '', duration: 0 })}
                      className="btn btn-secondary btn-sm"
                    >
                      <PlusIcon className="h-4 w-4 mr-1" />
                      Add Topic
                    </button>
                  </div>
                  
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 mb-2">
                      <div className="flex-1">
                        <input
                          type="text"
                          {...register(`topics.${index}.name`)}
                          className="input"
                          placeholder="Topic name"
                        />
                      </div>
                      <div className="w-32">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          {...register(`topics.${index}.duration`, { valueAsNumber: true })}
                          className="input"
                          placeholder="Hours"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="btn btn-danger btn-sm"
                        disabled={fields.length === 1}
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  
                  {errors.topics && (
                    <p className="text-red-600 text-xs mt-1">{errors.topics.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Duration (Hours)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      {...register('totalDuration', { valueAsNumber: true })}
                      className="input"
                      readOnly
                    />
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
                      <p className="text-red-600 text-xs mt-1">{errors.validityFrom.message}</p>
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
                      <p className="text-red-600 text-xs mt-1">{errors.validityTo.message}</p>
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
                      setEditingModule(null)
                      reset()
                    }}
                    className="btn btn-secondary btn-md"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-md">
                    {editingModule ? 'Update Module' : 'Create Module'}
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
