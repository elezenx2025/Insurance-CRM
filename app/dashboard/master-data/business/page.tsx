'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeftIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  UserGroupIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  Cog6ToothIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline'

interface BusinessEntity {
  id: string
  name: string
  code: string
  description?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  category: string
}

export default function BusinessMasterPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'agent-types' | 'policy-types' | 'user-types' | 'regions' | 'departments' | 'statuses' | 'priorities'>('agent-types')
  const [data, setData] = useState<BusinessEntity[]>([])
  const [filteredData, setFilteredData] = useState<BusinessEntity[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<BusinessEntity | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    isActive: true,
    category: ''
  })

  // Mock data
  useEffect(() => {
    const mockData: BusinessEntity[] = [
      // Agent Types
      {
        id: '1',
        name: 'PoSP',
        code: 'POSP',
        description: 'Point of Sales Person',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        category: 'agent-types'
      },
      {
        id: '2',
        name: 'MISP',
        code: 'MISP',
        description: 'Micro Insurance Sales Person',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        category: 'agent-types'
      },
      {
        id: '3',
        name: 'Agent',
        code: 'AGENT',
        description: 'General Insurance Agent',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        category: 'agent-types'
      },
      {
        id: '4',
        name: 'PoSP – Motor',
        code: 'POSP_MOTOR',
        description: 'Point of Sales Person - Motor Insurance',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        category: 'agent-types'
      },
      {
        id: '5',
        name: 'PoSP – Health',
        code: 'POSP_HEALTH',
        description: 'Point of Sales Person - Health Insurance',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        category: 'agent-types'
      },
      {
        id: '6',
        name: 'PoSP – Life',
        code: 'POSP_LIFE',
        description: 'Point of Sales Person - Life Insurance',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        category: 'agent-types'
      },
      {
        id: '7',
        name: 'Calling Agent',
        code: 'CALLING_AGENT',
        description: 'Telesales agent for outbound calling and customer acquisition',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        category: 'agent-types'
      },
      {
        id: '8',
        name: 'Calling Manager',
        code: 'CALLING_MANAGER',
        description: 'Team lead managing calling agents and telesales operations',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        category: 'agent-types'
      },
      // Policy Types
      {
        id: '9',
        name: 'Life',
        code: 'LIFE',
        description: 'Life insurance policies',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        category: 'policy-types'
      },
      {
        id: '8',
        name: 'Life-GTLI',
        code: 'LIFE_GTLI',
        description: 'Life - Group Term Life Insurance',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        category: 'policy-types'
      },
      {
        id: '9',
        name: 'Life-GPA',
        code: 'LIFE_GPA',
        description: 'Life - Group Personal Accident',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        category: 'policy-types'
      },
      {
        id: '10',
        name: 'Health',
        code: 'HEALTH',
        description: 'Health insurance policies',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        category: 'policy-types'
      },
      {
        id: '11',
        name: 'Health-GMC',
        code: 'HEALTH_GMC',
        description: 'Health - Group Medical Cover',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        category: 'policy-types'
      },
      {
        id: '12',
        name: 'Gen-Liability',
        code: 'GEN_LIABILITY',
        description: 'General - Liability Insurance',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        category: 'policy-types'
      },
      {
        id: '13',
        name: 'Gen–Fire',
        code: 'GEN_FIRE',
        description: 'General - Fire Insurance',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        category: 'policy-types'
      },
      {
        id: '14',
        name: 'Gen–Motor',
        code: 'GEN_MOTOR',
        description: 'General - Motor Insurance',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        category: 'policy-types'
      },
      {
        id: '15',
        name: 'Gen–Marine',
        code: 'GEN_MARINE',
        description: 'General - Marine Insurance',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        category: 'policy-types'
      },
      {
        id: '16',
        name: 'Gen–Misc',
        code: 'GEN_MISC',
        description: 'General - Miscellaneous Insurance',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        category: 'policy-types'
      },
      {
        id: '17',
        name: 'Gen–Engg',
        code: 'GEN_ENGG',
        description: 'General - Engineering Insurance',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        category: 'policy-types'
      },
      {
        id: '18',
        name: 'Gen–Property',
        code: 'GEN_PROPERTY',
        description: 'General - Property Insurance',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        category: 'policy-types'
      },
      {
        id: '19',
        name: 'Gen–MBD',
        code: 'GEN_MBD',
        description: 'General - Money, Burglary, and Dacoity Insurance',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        category: 'policy-types'
      },
      {
        id: '20',
        name: 'Gen–Travel',
        code: 'GEN_TRAVEL',
        description: 'General - Travel Insurance',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        category: 'policy-types'
      },
      // User Types
      {
        id: '21',
        name: 'Admin',
        code: 'ADMIN',
        description: 'System Administrator',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        category: 'user-types'
      },
      {
        id: '22',
        name: 'Manager',
        code: 'MANAGER',
        description: 'Branch Manager',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        category: 'user-types'
      },
      {
        id: '23',
        name: 'Agent',
        code: 'AGENT',
        description: 'Insurance Agent',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        category: 'user-types'
      },
      {
        id: '24',
        name: 'Customer',
        code: 'CUSTOMER',
        description: 'End Customer',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        category: 'user-types'
      },
      // Regions
      {
        id: '25',
        name: 'North',
        code: 'NORTH',
        description: 'Northern Region',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        category: 'regions'
      },
      {
        id: '26',
        name: 'South',
        code: 'SOUTH',
        description: 'Southern Region',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        category: 'regions'
      },
      {
        id: '27',
        name: 'East',
        code: 'EAST',
        description: 'Eastern Region',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        category: 'regions'
      },
      {
        id: '28',
        name: 'West',
        code: 'WEST',
        description: 'Western Region',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        category: 'regions'
      },
      // Departments
      {
        id: '29',
        name: 'Sales',
        code: 'SALES',
        description: 'Sales Department',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        category: 'departments'
      },
      {
        id: '30',
        name: 'Operations',
        code: 'OPS',
        description: 'Operations Department',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        category: 'departments'
      },
      {
        id: '31',
        name: 'Claims',
        code: 'CLAIMS',
        description: 'Claims Department',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        category: 'departments'
      },
      {
        id: '32',
        name: 'HR',
        code: 'HR',
        description: 'Human Resources Department',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        category: 'departments'
      },
      // Statuses
      {
        id: '33',
        name: 'Active',
        code: 'ACTIVE',
        description: 'Active status',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        category: 'statuses'
      },
      {
        id: '34',
        name: 'Inactive',
        code: 'INACTIVE',
        description: 'Inactive status',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        category: 'statuses'
      },
      {
        id: '35',
        name: 'Pending',
        code: 'PENDING',
        description: 'Pending status',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        category: 'statuses'
      },
      {
        id: '36',
        name: 'Completed',
        code: 'COMPLETED',
        description: 'Completed status',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        category: 'statuses'
      },
      // Priorities
      {
        id: '37',
        name: 'Low',
        code: 'LOW',
        description: 'Low priority',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        category: 'priorities'
      },
      {
        id: '38',
        name: 'Medium',
        code: 'MEDIUM',
        description: 'Medium priority',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        category: 'priorities'
      },
      {
        id: '39',
        name: 'High',
        code: 'HIGH',
        description: 'High priority',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        category: 'priorities'
      },
      {
        id: '40',
        name: 'Critical',
        code: 'CRITICAL',
        description: 'Critical priority',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        category: 'priorities'
      }
    ]
    setData(mockData)
  }, [])

  // Filter data based on active tab and search term
  useEffect(() => {
    let filtered = data.filter(item => item.category === activeTab)

    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredData(filtered)
  }, [data, activeTab, searchTerm])

  const handleAddItem = () => {
    setFormData({
      name: '',
      code: '',
      description: '',
      isActive: true,
      category: activeTab
    })
    setShowAddModal(true)
  }

  const handleEditItem = (item: BusinessEntity) => {
    setSelectedItem(item)
    setFormData({
      name: item.name,
      code: item.code,
      description: item.description || '',
      isActive: item.isActive,
      category: item.category
    })
    setShowEditModal(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    setShowAddModal(false)
    setShowEditModal(false)
  }

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'agent-types':
        return <UserGroupIcon className="h-5 w-5" />
      case 'policy-types':
        return <DocumentTextIcon className="h-5 w-5" />
      case 'user-types':
        return <UserGroupIcon className="h-5 w-5" />
      case 'regions':
        return <MapPinIcon className="h-5 w-5" />
      case 'departments':
        return <BuildingOfficeIcon className="h-5 w-5" />
      case 'statuses':
        return <Cog6ToothIcon className="h-5 w-5" />
      case 'priorities':
        return <AcademicCapIcon className="h-5 w-5" />
      default:
        return <Cog6ToothIcon className="h-5 w-5" />
    }
  }

  const getTabLabel = (tab: string) => {
    switch (tab) {
      case 'agent-types':
        return 'Agent Types'
      case 'policy-types':
        return 'Policy Types'
      case 'user-types':
        return 'User Types'
      case 'regions':
        return 'Regions'
      case 'departments':
        return 'Departments'
      case 'statuses':
        return 'Statuses'
      case 'priorities':
        return 'Priorities'
      default:
        return 'Business Entities'
    }
  }

  const renderTable = () => {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Code
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
            {filteredData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{item.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{item.code}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{item.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {item.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditItem(item)}
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
                <span className="ml-4 text-gray-900 font-medium">Business Entities</span>
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
            <h1 className="text-lg font-semibold text-gray-900">Business Master Data</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage business entities like agent types, policy types, regions, etc.
            </p>
          </div>
        </div>
        <button
          onClick={handleAddItem}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add {getTabLabel(activeTab).slice(0, -1)}
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {['agent-types', 'policy-types', 'user-types', 'regions', 'departments', 'statuses', 'priorities'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {getTabIcon(tab)}
              <span className="ml-2">{getTabLabel(tab)}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search ${getTabLabel(activeTab).toLowerCase()}...`}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="text-sm text-gray-500">
            {filteredData.length} {getTabLabel(activeTab).toLowerCase()}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {getTabLabel(activeTab)} ({filteredData.length})
          </h3>
        </div>
        {renderTable()}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {showAddModal ? `Add New ${getTabLabel(activeTab).slice(0, -1)}` : `Edit ${getTabLabel(activeTab).slice(0, -1)}`}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Code</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
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
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="mr-2"
                  />
                  <label className="text-sm font-medium text-gray-700">Active</label>
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
                    {showAddModal ? 'Add' : 'Update'}
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


