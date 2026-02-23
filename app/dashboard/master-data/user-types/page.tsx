'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeftIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'

const userTypeSchema = z.object({
  name: z.string().min(1, 'User type name is required'),
  code: z.string().min(1, 'User type code is required'),
  description: z.string().min(1, 'Description is required'),
  permissions: z.array(z.string()).min(1, 'At least one permission is required'),
  isActive: z.boolean(),
})

type UserTypeForm = z.infer<typeof userTypeSchema>

interface UserType {
  id: string
  name: string
  code: string
  description: string
  permissions: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

const mockUserTypes: UserType[] = [
  {
    id: '1',
    name: 'Admin',
    code: 'ADMIN',
    description: 'Full system access with all permissions',
    permissions: ['read', 'write', 'delete', 'manage_users', 'manage_settings'],
    isActive: true,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'Manager',
    code: 'MANAGER',
    description: 'Management level access with limited administrative functions',
    permissions: ['read', 'write', 'manage_team'],
    isActive: true,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '3',
    name: 'Agent',
    code: 'AGENT',
    description: 'Standard agent access for customer interactions',
    permissions: ['read', 'write'],
    isActive: true,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '4',
    name: 'Viewer',
    code: 'VIEWER',
    description: 'Read-only access for reporting and analysis',
    permissions: ['read'],
    isActive: true,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
]

const availablePermissions = [
  'read',
  'write',
  'delete',
  'manage_users',
  'manage_settings',
  'manage_team',
  'view_reports',
  'export_data',
  'manage_policies',
  'manage_claims',
]

export default function UserTypes() {
  const router = useRouter()
  const [userTypes, setUserTypes] = useState<UserType[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingUserType, setEditingUserType] = useState<UserType | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm<UserTypeForm>({
    resolver: zodResolver(userTypeSchema),
  })

  const watchedPermissions = watch('permissions', [])

  useEffect(() => {
    fetchUserTypes()
  }, [])

  const fetchUserTypes = async () => {
    try {
      setLoading(true)
      // Mock data - replace with actual API call
      setUserTypes(mockUserTypes)
    } catch (error) {
      console.error('Error fetching user types:', error)
      toast.error('Failed to fetch user types')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: UserTypeForm) => {
    try {
      if (editingUserType) {
        // Update existing user type
        const updatedUserTypes = userTypes.map(ut =>
          ut.id === editingUserType.id
            ? {
                ...ut,
                ...data,
                updatedAt: new Date().toISOString(),
              }
            : ut
        )
        setUserTypes(updatedUserTypes)
        toast.success('User type updated successfully')
      } else {
        // Create new user type
        const newUserType: UserType = {
          id: Date.now().toString(),
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        setUserTypes([...userTypes, newUserType])
        toast.success('User type created successfully')
      }
      setShowModal(false)
      setEditingUserType(null)
      reset()
    } catch (error) {
      console.error('Error saving user type:', error)
      toast.error('Failed to save user type')
    }
  }

  const openAddModal = () => {
    setEditingUserType(null)
    reset()
    setShowModal(true)
  }

  const openEditModal = (userType: UserType) => {
    setEditingUserType(userType)
    setValue('name', userType.name)
    setValue('code', userType.code)
    setValue('description', userType.description)
    setValue('permissions', userType.permissions)
    setValue('isActive', userType.isActive)
    setShowModal(true)
  }

  const deleteUserType = (id: string) => {
    if (window.confirm('Are you sure you want to delete this user type?')) {
      setUserTypes(userTypes.filter(ut => ut.id !== id))
      toast.success('User type deleted successfully')
    }
  }

  const togglePermission = (permission: string) => {
    const currentPermissions = watchedPermissions || []
    const newPermissions = currentPermissions.includes(permission)
      ? currentPermissions.filter(p => p !== permission)
      : [...currentPermissions, permission]
    setValue('permissions', newPermissions)
  }

  const filteredUserTypes = userTypes.filter(userType =>
    userType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    userType.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    userType.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
                <span className="ml-4 text-gray-900 font-medium">User Types</span>
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
            <h1 className="text-2xl font-bold text-gray-900">User Types</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage user types and their permissions for system access control.
            </p>
          </div>
        </div>
        <button onClick={openAddModal} className="btn btn-primary btn-md">
          <PlusIcon className="h-5 w-5 mr-2" />
          Add User Type
        </button>
      </div>

      {/* Search and filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search user types..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* User Types Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Permissions
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
              {filteredUserTypes.map((userType) => (
                <tr key={userType.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <UserIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{userType.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{userType.code}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">{userType.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {userType.permissions.slice(0, 3).map((permission) => (
                        <span
                          key={permission}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {permission}
                        </span>
                      ))}
                      {userType.permissions.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          +{userType.permissions.length - 3} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        userType.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {userType.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditModal(userType)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteUserType(userType.id)}
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
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingUserType ? 'Edit User Type' : 'Add New User Type'}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false)
                    setEditingUserType(null)
                    reset()
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">User Type Name</label>
                    <input
                      {...register('name')}
                      className="input"
                      placeholder="Enter user type name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message as string}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Code</label>
                    <input
                      {...register('code')}
                      className="input"
                      placeholder="Enter code"
                    />
                    {errors.code && (
                      <p className="mt-1 text-sm text-red-600">{errors.code.message as string}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    {...register('description')}
                    rows={3}
                    className="input"
                    placeholder="Enter description"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description.message as string}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {availablePermissions.map((permission) => (
                      <label key={permission} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={watchedPermissions?.includes(permission) || false}
                          onChange={() => togglePermission(permission)}
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-700">{permission}</span>
                      </label>
                    ))}
                  </div>
                  {errors.permissions && (
                    <p className="mt-1 text-sm text-red-600">{errors.permissions.message as string}</p>
                  )}
                </div>

                <div className="flex items-center">
                  <input
                    {...register('isActive')}
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <label className="ml-2 text-sm text-gray-700">Active</label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      setEditingUserType(null)
                      reset()
                    }}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingUserType ? 'Update' : 'Create'} User Type
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








