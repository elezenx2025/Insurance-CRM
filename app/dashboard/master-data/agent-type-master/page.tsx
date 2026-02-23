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
  UserIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

// Available policy types for mapping
const AVAILABLE_POLICY_TYPES = [
  { id: 'life', name: 'Life Insurance', category: 'Life' },
  { id: 'term-life', name: 'Term Life Insurance', category: 'Life' },
  { id: 'whole-life', name: 'Whole Life Insurance', category: 'Life' },
  { id: 'endowment', name: 'Endowment Plans', category: 'Life' },
  { id: 'motor', name: 'Motor Insurance', category: 'General' },
  { id: 'health', name: 'Health Insurance', category: 'General' },
  { id: 'travel', name: 'Travel Insurance', category: 'General' },
  { id: 'home', name: 'Home Insurance', category: 'General' },
  { id: 'fire', name: 'Fire Insurance', category: 'General' },
  { id: 'marine', name: 'Marine Insurance', category: 'General' },
  { id: 'liability', name: 'Liability Insurance', category: 'General' },
  { id: 'crop', name: 'Crop Insurance', category: 'General' },
]

// Available user types for mapping
const AVAILABLE_USER_TYPES = [
  { id: 'admin', name: 'Admin', description: 'Full system access with all permissions' },
  { id: 'manager', name: 'Manager', description: 'Management level access with limited administrative functions' },
  { id: 'agent', name: 'Agent', description: 'Standard agent access for customer interactions' },
  { id: 'viewer', name: 'Viewer', description: 'Read-only access for reporting and analysis' },
]

const agentTypeSchema = z.object({
  name: z.string().min(1, 'Agent type name is required'),
  code: z.string().min(1, 'Agent type code is required'),
  description: z.string().min(1, 'Description is required'),
  commissionRate: z.number().min(0, 'Commission rate must be positive').max(100, 'Commission rate cannot exceed 100%'),
  policyTypes: z.array(z.string()).min(1, 'At least one policy type must be selected'),
  userTypeId: z.string().min(1, 'User type is required'),
  isActive: z.boolean(),
})

type AgentTypeForm = z.infer<typeof agentTypeSchema>

interface AgentType {
  id: string
  name: string
  code: string
  description: string
  commissionRate: number
  policyTypes: string[]
  userTypeId: string
  userTypeName?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function AgentTypeMaster() {
  const [agentTypes, setAgentTypes] = useState<AgentType[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingAgentType, setEditingAgentType] = useState<AgentType | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('ALL')

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AgentTypeForm>({
    resolver: zodResolver(agentTypeSchema),
    defaultValues: {
      isActive: true,
      commissionRate: 0,
    },
  })

  useEffect(() => {
    fetchAgentTypes()
  }, [])

  const fetchAgentTypes = async () => {
    try {
      setLoading(true)
      // Mock data - replace with actual API call
  const mockAgentTypes: AgentType[] = [
    {
      id: '1',
      name: 'PoSP',
      code: 'POSP',
      description: 'Point of Sales Person - General insurance products',
      commissionRate: 12.0,
      policyTypes: ['motor', 'health', 'travel', 'home', 'fire'],
      userTypeId: 'agent',
      userTypeName: 'Agent',
      isActive: true,
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
    },
    {
      id: '2',
      name: 'MISP',
      code: 'MISP',
      description: 'Motor Insurance Sales Person - Specialized in motor insurance',
      commissionRate: 14.5,
      policyTypes: ['motor'],
      userTypeId: 'agent',
      userTypeName: 'Agent',
      isActive: true,
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
    },
    {
      id: '3',
      name: 'Agent',
      code: 'AGENT',
      description: 'General insurance agent for all product categories',
      commissionRate: 16.0,
      policyTypes: ['life', 'term-life', 'whole-life', 'endowment', 'motor', 'health', 'travel', 'home', 'fire', 'marine', 'liability'],
      userTypeId: 'manager',
      userTypeName: 'Manager',
      isActive: true,
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
    },
    {
      id: '4',
      name: 'PoSP – Motor',
      code: 'POSP_MOTOR',
      description: 'Point of Sales Person specialized in Motor Insurance',
      commissionRate: 13.5,
      policyTypes: ['motor'],
      userTypeId: 'agent',
      userTypeName: 'Agent',
      isActive: true,
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
    },
    {
      id: '5',
      name: 'PoSP – Health',
      code: 'POSP_HEALTH',
      description: 'Point of Sales Person specialized in Health Insurance',
      commissionRate: 13.0,
      policyTypes: ['health'],
      userTypeId: 'agent',
      userTypeName: 'Agent',
      isActive: true,
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
    },
    {
      id: '6',
      name: 'PoSP – Life',
      code: 'POSP_LIFE',
      description: 'Point of Sales Person specialized in Life Insurance',
      commissionRate: 15.0,
      policyTypes: ['life', 'term-life', 'whole-life', 'endowment'],
      userTypeId: 'agent',
      userTypeName: 'Agent',
      isActive: true,
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
    },
    {
      id: '7',
      name: 'Calling Agent',
      code: 'CALLING_AGENT',
      description: 'Telesales agent for outbound calling and customer acquisition',
      commissionRate: 10.0,
      policyTypes: ['motor', 'health', 'travel', 'home', 'fire'],
      userTypeId: 'agent',
      userTypeName: 'Agent',
      isActive: true,
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
    },
    {
      id: '8',
      name: 'Calling Manager',
      code: 'CALLING_MANAGER',
      description: 'Team lead managing calling agents and telesales operations',
      commissionRate: 8.0,
      policyTypes: ['motor', 'health', 'travel', 'home', 'fire', 'marine', 'liability'],
      userTypeId: 'manager',
      userTypeName: 'Manager',
      isActive: true,
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
    },
  ]

      // Apply filters
      let filteredAgentTypes = mockAgentTypes
      if (searchTerm) {
        filteredAgentTypes = filteredAgentTypes.filter(
          (agentType) =>
            agentType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            agentType.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            agentType.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }
      if (filterStatus !== 'ALL') {
        filteredAgentTypes = filteredAgentTypes.filter((agentType) => 
          filterStatus === 'ACTIVE' ? agentType.isActive : !agentType.isActive
        )
      }

      setAgentTypes(filteredAgentTypes)
    } catch (error) {
      console.error('Error fetching agent types:', error)
      toast.error('Failed to fetch agent types')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: AgentTypeForm) => {
    try {
      if (editingAgentType) {
        const updatedAgentType = { 
          ...editingAgentType, 
          ...data,
          updatedAt: new Date().toISOString() 
        }
        setAgentTypes(agentTypes.map((at) => (at.id === updatedAgentType.id ? updatedAgentType : at)))
        toast.success('Agent type updated successfully!')
      } else {
        const newAgentType: AgentType = {
          id: String(agentTypes.length + 1),
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        setAgentTypes([...agentTypes, newAgentType])
        toast.success('Agent type created successfully!')
      }

      setShowModal(false)
      reset()
      setEditingAgentType(null)
    } catch (error) {
      console.error('Error saving agent type:', error)
      toast.error('Failed to save agent type')
    }
  }

  const openAddModal = () => {
    setEditingAgentType(null)
    reset({
      name: '',
      code: '',
      description: '',
      commissionRate: 0,
      policyTypes: [],
      userTypeId: '',
      isActive: true,
    })
    setShowModal(true)
  }

  const openEditModal = (agentType: AgentType) => {
    setEditingAgentType(agentType)
    setValue('name', agentType.name)
    setValue('code', agentType.code)
    setValue('description', agentType.description)
    setValue('commissionRate', agentType.commissionRate)
    setValue('policyTypes', agentType.policyTypes)
    setValue('userTypeId', agentType.userTypeId)
    setValue('isActive', agentType.isActive)
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this agent type?')) {
      try {
        setAgentTypes(agentTypes.filter((at) => at.id !== id))
        toast.success('Agent type deleted successfully')
      } catch (error) {
        console.error('Error deleting agent type:', error)
        toast.error('Failed to delete agent type')
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
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agent Type Master</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage different types of insurance agents and their commission structures.
          </p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary btn-md">
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Agent Type
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
                placeholder="Search agent types..."
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

      {/* Agent Types Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-head">Agent Type</th>
                <th className="table-head">Code</th>
                <th className="table-head">Description</th>
                <th className="table-head">Commission Rate</th>
                <th className="table-head">Policy Types</th>
                <th className="table-head">User Type</th>
                <th className="table-head">Status</th>
                <th className="table-head">Created</th>
                <th className="table-head">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {agentTypes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="table-cell text-center py-8 text-gray-500">
                    No agent types found
                  </td>
                </tr>
              ) : (
                agentTypes.map((agentType) => (
                  <tr key={agentType.id} className="table-row">
                    <td className="table-cell">
                      <div className="font-medium">{agentType.name}</div>
                    </td>
                    <td className="table-cell">
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm font-mono">
                        {agentType.code}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="text-sm text-gray-600 max-w-xs truncate">
                        {agentType.description}
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm font-medium">
                        {agentType.commissionRate}%
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex flex-wrap gap-1">
                        {agentType.policyTypes.slice(0, 3).map((policyType) => {
                          const policy = AVAILABLE_POLICY_TYPES.find(p => p.id === policyType)
                          return (
                            <span
                              key={policyType}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {policy?.name || policyType}
                            </span>
                          )
                        })}
                        {agentType.policyTypes.length > 3 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            +{agentType.policyTypes.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {agentType.userTypeName || 'Not Assigned'}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        agentType.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {agentType.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className="text-sm">{formatDate(agentType.createdAt)}</span>
                    </td>
                    <td className="table-cell">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditModal(agentType)}
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
                          onClick={() => handleDelete(agentType.id)}
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

      {/* Agent Type Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingAgentType ? 'Edit Agent Type' : 'Add Agent Type'}
              </h3>
              
              <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Agent Type Name *
                    </label>
                    <input
                      type="text"
                      {...register('name')}
                      className="input"
                      placeholder="e.g., Life Insurance Agent"
                    />
                    {errors.name && (
                      <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Agent Type Code *
                    </label>
                    <input
                      type="text"
                      {...register('code')}
                      className="input"
                      placeholder="e.g., LIA"
                    />
                    {errors.code && (
                      <p className="text-red-600 text-xs mt-1">{errors.code.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      {...register('description')}
                      rows={3}
                      className="input"
                      placeholder="Describe the agent type and their responsibilities..."
                    />
                    {errors.description && (
                      <p className="text-red-600 text-xs mt-1">{errors.description.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Commission Rate (%) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      {...register('commissionRate', { valueAsNumber: true })}
                      className="input"
                      placeholder="e.g., 15.5"
                    />
                    {errors.commissionRate && (
                      <p className="text-red-600 text-xs mt-1">{errors.commissionRate.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Policy Types *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto border border-gray-300 rounded-md p-3">
                    {AVAILABLE_POLICY_TYPES.map((policyType) => (
                      <label key={policyType.id} className="flex items-center">
                        <input
                          type="checkbox"
                          value={policyType.id}
                          {...register('policyTypes')}
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-700">{policyType.name}</span>
                      </label>
                    ))}
                  </div>
                  {errors.policyTypes && (
                    <p className="text-red-600 text-xs mt-1">{errors.policyTypes.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    User Type *
                  </label>
                  <select
                    {...register('userTypeId')}
                    className="input"
                  >
                    <option value="">Select User Type</option>
                    {AVAILABLE_USER_TYPES.map((userType) => (
                      <option key={userType.id} value={userType.id}>
                        {userType.name} - {userType.description}
                      </option>
                    ))}
                  </select>
                  {errors.userTypeId && (
                    <p className="text-red-600 text-xs mt-1">{errors.userTypeId.message}</p>
                  )}
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
                      setEditingAgentType(null)
                      reset()
                    }}
                    className="btn btn-secondary btn-md"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-md">
                    {editingAgentType ? 'Update Agent Type' : 'Create Agent Type'}
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
