'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeftIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  GlobeAltIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  HomeIcon,
} from '@heroicons/react/24/outline'

interface Country {
  id: string
  name: string
  code: string
  phoneCode: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  states?: State[]
}

interface State {
  id: string
  countryId: string
  name: string
  code?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  cities?: City[]
}

interface City {
  id: string
  stateId: string
  name: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  pincodes?: Pincode[]
}

interface Pincode {
  id: string
  cityId: string
  code: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function LocationsMasterPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'countries' | 'states' | 'cities' | 'pincodes'>('countries')
  const [countries, setCountries] = useState<Country[]>([])
  const [states, setStates] = useState<State[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [pincodes, setPincodes] = useState<Pincode[]>([])
  const [filteredData, setFilteredData] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    phoneCode: '',
    isActive: true
  })

  // Mock data
  useEffect(() => {
    const mockCountries: Country[] = [
      {
        id: '1',
        name: 'India',
        code: 'IN',
        phoneCode: '+91',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        states: [
          {
            id: '1',
            countryId: '1',
            name: 'Maharashtra',
            code: 'MH',
            isActive: true,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
            cities: [
              {
                id: '1',
                stateId: '1',
                name: 'Mumbai',
                isActive: true,
                createdAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-01T00:00:00Z',
                pincodes: [
                  { id: '1', cityId: '1', code: '400001', isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
                  { id: '2', cityId: '1', code: '400002', isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' }
                ]
              },
              {
                id: '2',
                stateId: '1',
                name: 'Pune',
                isActive: true,
                createdAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-01T00:00:00Z',
                pincodes: [
                  { id: '3', cityId: '2', code: '411001', isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
                  { id: '4', cityId: '2', code: '411002', isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' }
                ]
              }
            ]
          },
          {
            id: '2',
            countryId: '1',
            name: 'Karnataka',
            code: 'KA',
            isActive: true,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
            cities: [
              {
                id: '3',
                stateId: '2',
                name: 'Bangalore',
                isActive: true,
                createdAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-01T00:00:00Z',
                pincodes: [
                  { id: '5', cityId: '3', code: '560001', isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
                  { id: '6', cityId: '3', code: '560002', isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' }
                ]
              }
            ]
          }
        ]
      },
      {
        id: '2',
        name: 'United States',
        code: 'US',
        phoneCode: '+1',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ]
    setCountries(mockCountries)
    setFilteredData(mockCountries)
  }, [])

  // Filter data based on search term
  useEffect(() => {
    let data: any[] = []
    
    switch (activeTab) {
      case 'countries':
        data = countries
        break
      case 'states':
        data = states
        break
      case 'cities':
        data = cities
        break
      case 'pincodes':
        data = pincodes
        break
    }

    if (searchTerm) {
      data = data.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredData(data)
  }, [activeTab, countries, states, cities, pincodes, searchTerm])

  const handleAddItem = () => {
    setFormData({
      name: '',
      code: '',
      phoneCode: '',
      isActive: true
    })
    setShowAddModal(true)
  }

  const handleEditItem = (item: any) => {
    setSelectedItem(item)
    setFormData({
      name: item.name,
      code: item.code || '',
      phoneCode: item.phoneCode || '',
      isActive: item.isActive
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
      case 'countries':
        return <GlobeAltIcon className="h-5 w-5" />
      case 'states':
        return <MapPinIcon className="h-5 w-5" />
      case 'cities':
        return <BuildingOfficeIcon className="h-5 w-5" />
      case 'pincodes':
        return <HomeIcon className="h-5 w-5" />
      default:
        return <GlobeAltIcon className="h-5 w-5" />
    }
  }

  const getTabLabel = (tab: string) => {
    switch (tab) {
      case 'countries':
        return 'Countries'
      case 'states':
        return 'States'
      case 'cities':
        return 'Cities'
      case 'pincodes':
        return 'Pincodes'
      default:
        return 'Countries'
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
              {activeTab === 'countries' && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone Code
                </th>
              )}
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
                {activeTab === 'countries' && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.phoneCode}</div>
                  </td>
                )}
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
                <span className="ml-4 text-gray-900 font-medium">Locations</span>
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
            <h1 className="text-lg font-semibold text-gray-900">Location Master Data</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage countries, states, cities, and pincodes
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
        <nav className="-mb-px flex space-x-8">
          {['countries', 'states', 'cities', 'pincodes'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
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
                {activeTab === 'countries' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Code</label>
                    <input
                      type="text"
                      value={formData.phoneCode}
                      onChange={(e) => setFormData({ ...formData, phoneCode: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                )}
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








