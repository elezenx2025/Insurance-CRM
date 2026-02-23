'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  TruckIcon,
  MapPinIcon,
  BuildingLibraryIcon,
  ArrowRightIcon,
  ChartBarIcon,
  DocumentTextIcon,
  CogIcon,
} from '@heroicons/react/24/outline'

interface IRDAIModule {
  id: string
  title: string
  description: string
  icon: React.ComponentType<any>
  path: string
  status: 'active' | 'inactive'
  recordCount: number
  lastUpdated: string
}

export default function IRDAIPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')

  const modules: IRDAIModule[] = [
    {
      id: 'motor-segment',
      title: 'Motor Segment',
      description: 'Manage IRDAI motor insurance segments (Private and Commercial) with comprehensive tracking and audit trails',
      icon: TruckIcon,
      path: '/dashboard/irdai/motor-segment',
      status: 'active',
      recordCount: 2,
      lastUpdated: '2024-01-20'
    },
    {
      id: 'zone-master',
      title: 'Zone Master',
      description: 'Configure insurance zones based on motor segments - Private (A, B) and Commercial (A, B, C) zones',
      icon: MapPinIcon,
      path: '/dashboard/irdai/zone-master',
      status: 'active',
      recordCount: 5,
      lastUpdated: '2024-01-20'
    },
    {
      id: 'city-zone-master',
      title: 'City Zone Master',
      description: 'Assign cities to specific zones based on motor segments with detailed geographical mapping',
      icon: BuildingLibraryIcon,
      path: '/dashboard/irdai/city-zone-master',
      status: 'active',
      recordCount: 15,
      lastUpdated: '2024-01-20'
    }
  ]

  const filteredModules = modules.filter(module => 
    module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    module.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalRecords = modules.reduce((sum, module) => sum + module.recordCount, 0)
  const activeModules = modules.filter(module => module.status === 'active').length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">IRDAI Master Data</h1>
              <p className="text-gray-600 mt-2">
                Insurance Regulatory and Development Authority of India - Master data management system
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                <div className="flex items-center">
                  <ChartBarIcon className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Active Modules</p>
                    <p className="text-lg font-bold text-blue-600">{activeModules}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                <div className="flex items-center">
                  <DocumentTextIcon className="h-5 w-5 text-green-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Total Records</p>
                    <p className="text-lg font-bold text-green-600">{totalRecords}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <CogIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search IRDAI modules..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredModules.map((module) => {
            const IconComponent = module.icon
            return (
              <div
                key={module.id}
                className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => router.push(module.path)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-3 rounded-lg mr-4">
                        <IconComponent className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                        <div className="flex items-center mt-1">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            module.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            <span className="capitalize">{module.status}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <ArrowRightIcon className="h-5 w-5 text-gray-400" />
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {module.description}
                  </p>

                  <div className="space-y-3">
                    {/* Record Count */}
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Records</span>
                      <span className="font-medium text-gray-900">{module.recordCount}</span>
                    </div>

                    {/* Last Updated */}
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>Last Updated</span>
                      <span>{new Date(module.lastUpdated).toLocaleDateString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 rounded-b-lg">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(module.path)
                    }}
                    className="w-full text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors flex items-center justify-center"
                  >
                    Manage {module.title}
                    <ArrowRightIcon className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* No Results */}
        {filteredModules.length === 0 && (
          <div className="text-center py-12">
            <CogIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No modules found</h3>
            <p className="text-gray-600">
              Try adjusting your search criteria.
            </p>
          </div>
        )}

        {/* Module Hierarchy Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Module Hierarchy</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-2 rounded-lg">
                <TruckIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">1. Motor Segment</h3>
                <p className="text-sm text-gray-600">
                  Base level: Define Private and Commercial motor vehicle segments
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-yellow-100 p-2 rounded-lg">
                <MapPinIcon className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">2. Zone Master</h3>
                <p className="text-sm text-gray-600">
                  Second level: Create zones based on motor segments (Private: A,B | Commercial: A,B,C)
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-purple-100 p-2 rounded-lg">
                <BuildingLibraryIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">3. City Zone Master</h3>
                <p className="text-sm text-gray-600">
                  Third level: Assign cities to specific zones based on motor segments
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
