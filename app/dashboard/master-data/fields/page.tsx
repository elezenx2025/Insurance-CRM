'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeftIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  DocumentTextIcon,
  CalendarIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline'

interface MasterField {
  id: string
  name: string
  displayName: string
  type: string
  category: string
  isRequired: boolean
  isActive: boolean
  sortOrder: number
  description?: string
  validation?: string
  createdAt: string
  updatedAt: string
  options?: FieldOption[]
}

interface FieldOption {
  id: string
  value: string
  label: string
  sortOrder: number
  isActive: boolean
}

export default function MasterFieldsPage() {
  const router = useRouter()
  const [fields, setFields] = useState<MasterField[]>([])
  const [filteredFields, setFilteredFields] = useState<MasterField[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedField, setSelectedField] = useState<MasterField | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    type: 'text',
    category: 'general',
    isRequired: false,
    isActive: true,
    sortOrder: 0,
    description: '',
    validation: ''
  })

  // Mock data
  useEffect(() => {
    const mockFields: MasterField[] = [
      {
        id: '1',
        name: 'customer_type',
        displayName: 'Customer Type',
        type: 'dropdown',
        category: 'customer',
        isRequired: true,
        isActive: true,
        sortOrder: 1,
        description: 'Type of customer - Individual or Corporate',
        validation: '{"required": true, "options": ["Individual", "Corporate"]}',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        options: [
          { id: '1', value: 'individual', label: 'Individual', sortOrder: 1, isActive: true },
          { id: '2', value: 'corporate', label: 'Corporate', sortOrder: 2, isActive: true }
        ]
      },
      {
        id: '2',
        name: 'agent_status',
        displayName: 'Agent Status',
        type: 'dropdown',
        category: 'agent',
        isRequired: true,
        isActive: true,
        sortOrder: 2,
        description: 'Current status of the agent',
        validation: '{"required": true, "options": ["Active", "Inactive", "Suspended", "Terminated"]}',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        options: [
          { id: '3', value: 'active', label: 'Active', sortOrder: 1, isActive: true },
          { id: '4', value: 'inactive', label: 'Inactive', sortOrder: 2, isActive: true },
          { id: '5', value: 'suspended', label: 'Suspended', sortOrder: 3, isActive: true },
          { id: '6', value: 'terminated', label: 'Terminated', sortOrder: 4, isActive: true }
        ]
      },
      {
        id: '3',
        name: 'policy_status',
        displayName: 'Policy Status',
        type: 'dropdown',
        category: 'policy',
        isRequired: true,
        isActive: true,
        sortOrder: 3,
        description: 'Current status of the policy',
        validation: '{"required": true, "options": ["Draft", "Active", "Expired", "Cancelled", "Renewed"]}',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        options: [
          { id: '7', value: 'draft', label: 'Draft', sortOrder: 1, isActive: true },
          { id: '8', value: 'active', label: 'Active', sortOrder: 2, isActive: true },
          { id: '9', value: 'expired', label: 'Expired', sortOrder: 3, isActive: true },
          { id: '10', value: 'cancelled', label: 'Cancelled', sortOrder: 4, isActive: true },
          { id: '11', value: 'renewed', label: 'Renewed', sortOrder: 5, isActive: true }
        ]
      },
      {
        id: '4',
        name: 'claim_priority',
        displayName: 'Claim Priority',
        type: 'dropdown',
        category: 'claim',
        isRequired: true,
        isActive: true,
        sortOrder: 4,
        description: 'Priority level of the claim',
        validation: '{"required": true, "options": ["Low", "Medium", "High", "Critical"]}',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        options: [
          { id: '12', value: 'low', label: 'Low', sortOrder: 1, isActive: true },
          { id: '13', value: 'medium', label: 'Medium', sortOrder: 2, isActive: true },
          { id: '14', value: 'high', label: 'High', sortOrder: 3, isActive: true },
          { id: '15', value: 'critical', label: 'Critical', sortOrder: 4, isActive: true }
        ]
      },
      {
        id: '5',
        name: 'training_status',
        displayName: 'Training Status',
        type: 'dropdown',
        category: 'training',
        isRequired: true,
        isActive: true,
        sortOrder: 5,
        description: 'Status of training completion',
        validation: '{"required": true, "options": ["Not Started", "In Progress", "Completed", "Failed"]}',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        options: [
          { id: '16', value: 'not_started', label: 'Not Started', sortOrder: 1, isActive: true },
          { id: '17', value: 'in_progress', label: 'In Progress', sortOrder: 2, isActive: true },
          { id: '18', value: 'completed', label: 'Completed', sortOrder: 3, isActive: true },
          { id: '19', value: 'failed', label: 'Failed', sortOrder: 4, isActive: true }
        ]
      }
    ]
    setFields(mockFields)
    setFilteredFields(mockFields)
  }, [])

  // Filter fields
  useEffect(() => {
    let filtered = fields

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(field => field.category === selectedCategory)
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(field => field.type === selectedType)
    }

    if (searchTerm) {
      filtered = filtered.filter(field => 
        field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        field.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        field.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredFields(filtered)
  }, [fields, selectedCategory, selectedType, searchTerm])

  const handleAddField = () => {
    setFormData({
      name: '',
      displayName: '',
      type: 'text',
      category: 'general',
      isRequired: false,
      isActive: true,
      sortOrder: 0,
      description: '',
      validation: ''
    })
    setShowAddModal(true)
  }

  const handleEditField = (field: MasterField) => {
    setSelectedField(field)
    setFormData({
      name: field.name,
      displayName: field.displayName,
      type: field.type,
      category: field.category,
      isRequired: field.isRequired,
      isActive: field.isActive,
      sortOrder: field.sortOrder,
      description: field.description || '',
      validation: field.validation || ''
    })
    setShowEditModal(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
    setShowAddModal(false)
    setShowEditModal(false)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'dropdown':
        return <ChartBarIcon className="h-5 w-5" />
      case 'text':
        return <DocumentTextIcon className="h-5 w-5" />
      case 'date':
        return <CalendarIcon className="h-5 w-5" />
      case 'boolean':
        return <CheckCircleIcon className="h-5 w-5" />
      default:
        return <Cog6ToothIcon className="h-5 w-5" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'dropdown':
        return 'bg-blue-100 text-blue-800'
      case 'text':
        return 'bg-green-100 text-green-800'
      case 'date':
        return 'bg-purple-100 text-purple-800'
      case 'boolean':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'customer':
        return 'bg-blue-100 text-blue-800'
      case 'agent':
        return 'bg-green-100 text-green-800'
      case 'policy':
        return 'bg-purple-100 text-purple-800'
      case 'claim':
        return 'bg-red-100 text-red-800'
      case 'training':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
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
                <span className="ml-4 text-gray-900 font-medium">Dynamic Fields</span>
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
            <h1 className="text-lg font-semibold text-gray-900">Dynamic Fields Management</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage all dynamic fields used across the application
            </p>
          </div>
        </div>
        <button
          onClick={handleAddField}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Field
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search fields..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="customer">Customer</option>
              <option value="agent">Agent</option>
              <option value="policy">Policy</option>
              <option value="claim">Claim</option>
              <option value="training">Training</option>
              <option value="general">General</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="dropdown">Dropdown</option>
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
              <option value="boolean">Boolean</option>
              <option value="multiselect">Multi-select</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Fields Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Dynamic Fields ({filteredFields.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Field
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Options
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
              {filteredFields.map((field) => (
                <tr key={field.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{field.displayName}</div>
                      <div className="text-sm text-gray-500">{field.name}</div>
                      {field.description && (
                        <div className="text-xs text-gray-400 mt-1">{field.description}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(field.type)}`}>
                      {getTypeIcon(field.type)}
                      <span className="ml-1">{field.type}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(field.category)}`}>
                      {field.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {field.options ? field.options.length : 0} options
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      field.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {field.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditField(field)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {showAddModal ? 'Add New Field' : 'Edit Field'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Field Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="text">Text</option>
                    <option value="dropdown">Dropdown</option>
                    <option value="number">Number</option>
                    <option value="date">Date</option>
                    <option value="boolean">Boolean</option>
                    <option value="multiselect">Multi-select</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="general">General</option>
                    <option value="customer">Customer</option>
                    <option value="agent">Agent</option>
                    <option value="policy">Policy</option>
                    <option value="claim">Claim</option>
                    <option value="training">Training</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isRequired}
                      onChange={(e) => setFormData({ ...formData, isRequired: e.target.checked })}
                      className="mr-2"
                    />
                    Required
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="mr-2"
                    />
                    Active
                  </label>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false)
                      setShowEditModal(false)
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    {showAddModal ? 'Add Field' : 'Update Field'}
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








