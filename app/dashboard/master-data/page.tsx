'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import {
  Cog6ToothIcon,
  FlagIcon,
  MapIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  BuildingLibraryIcon,
  UserIcon,
  AcademicCapIcon,
  ShieldCheckIcon,
  CogIcon,
} from '@heroicons/react/24/outline'

export default function MasterDataPage() {
  const router = useRouter()

  const masterDataModules = [
    {
      name: 'Dynamic Fields',
      href: '/dashboard/master-data/fields',
      icon: Cog6ToothIcon,
      description: 'Manage all dynamic fields used across the application'
    },
    {
      name: 'Locations',
      href: '/dashboard/master-data/locations',
      icon: MapPinIcon,
      description: 'Manage countries, states, cities, and pincodes'
    },
    {
      name: 'Business Entities',
      href: '/dashboard/master-data/business',
      icon: BuildingOfficeIcon,
      description: 'Manage agent types, policy types, regions, departments'
    },
    {
      name: 'Agent Type Master',
      href: '/dashboard/master-data/agent-type-master',
      icon: UserIcon,
      description: 'Manage agent types and classifications'
    },
    {
      name: 'LMS Masters',
      href: '/dashboard/lms-masters',
      icon: AcademicCapIcon,
      description: 'Manage training modules, materials, and exams'
    },
    {
      name: 'Bank Master',
      href: '/dashboard/master-data/bank-master',
      icon: BuildingLibraryIcon,
      description: 'Manage bank information and details'
    },
    {
      name: 'Policy Configurator',
      href: '/dashboard/master-data/policy-configurator',
      icon: ShieldCheckIcon,
      description: 'Configure insurance policies and products'
    },
    {
      name: 'User Types',
      href: '/dashboard/master-data/user-types',
      icon: UserIcon,
      description: 'Manage user types and permissions'
    },
    {
      name: 'Role Management',
      href: '/dashboard/master-data/role-management',
      icon: CogIcon,
      description: 'Manage user roles and access controls'
    },
    {
      name: 'IRDAI Masters',
      href: '/dashboard/irdai',
      icon: ShieldCheckIcon,
      description: 'Manage IRDAI motor segments, zones, and city zone mappings'
    },
  ]

  return (
    <div className="p-8">
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
                <span className="ml-4 text-gray-900 font-medium">Master Data</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      {/* Page header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Master Data</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage system master data, configurations, and reference information.
            </p>
          </div>
        </div>
      </div>

      {/* Master Data Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {masterDataModules.map((module) => {
          const IconComponent = module.icon
          return (
            <button
              key={module.name}
              onClick={() => router.push(module.href)}
              className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors text-left group"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 bg-primary-100 rounded-lg group-hover:bg-primary-200 transition-colors">
                  <IconComponent className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="ml-4 text-lg font-semibold text-gray-900">{module.name}</h3>
              </div>
              <p className="text-sm text-gray-600">{module.description}</p>
            </button>
          )
        })}
      </div>

      {/* Summary Cards */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Modules</p>
            <p className="text-2xl font-bold text-gray-900">{masterDataModules.length}</p>
          </div>
          <Cog6ToothIcon className="h-10 w-10 text-gray-300" />
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Location Data</p>
            <p className="text-2xl font-bold text-blue-600">4</p>
          </div>
          <MapIcon className="h-10 w-10 text-blue-300" />
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">User Management</p>
            <p className="text-2xl font-bold text-green-600">3</p>
          </div>
          <UserIcon className="h-10 w-10 text-green-300" />
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">LMS System</p>
            <p className="text-2xl font-bold text-purple-600">1</p>
          </div>
          <AcademicCapIcon className="h-10 w-10 text-purple-300" />
        </div>
      </div>
    </div>
  )
}


