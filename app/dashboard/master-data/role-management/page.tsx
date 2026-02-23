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
  UserIcon,
  ShieldCheckIcon,
  CogIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const roleSchema = z.object({
  roleName: z.string().min(1, 'Role name is required'),
  description: z.string().min(1, 'Description is required'),
  permissions: z.array(z.string()).min(1, 'At least one permission is required'),
  isActive: z.boolean(),
})

type RoleForm = z.infer<typeof roleSchema>

interface Role {
  id: string
  roleName: string
  description: string
  permissions: string[]
  userCount: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

const PERMISSIONS = [
  // Dashboard & Analytics
  { category: 'Dashboard & Analytics', permissions: [
    'dashboard.view',
    'analytics.view',
    'reports.generate',
    'reports.export',
  ]},
  
  // Customer Management
  { category: 'Customer Management', permissions: [
    'customers.view',
    'customers.create',
    'customers.edit',
    'customers.delete',
    'customers.export',
  ]},
  
  // Policy Management
  { category: 'Policy Management', permissions: [
    'policies.view',
    'policies.create',
    'policies.edit',
    'policies.delete',
    'policies.approve',
    'policies.renewal',
    'policies.cancellation',
  ]},
  
  // Claims Management
  { category: 'Claims Management', permissions: [
    'claims.view',
    'claims.create',
    'claims.edit',
    'claims.approve',
    'claims.reject',
    'claims.settle',
  ]},
  
  // Pre-Sale Modules
  { category: 'Pre-Sale Modules', permissions: [
    'leads.view',
    'leads.create',
    'leads.edit',
    'quotations.view',
    'quotations.create',
    'quotations.edit',
    'proposals.view',
    'proposals.create',
    'proposals.edit',
  ]},
  
  // Post-Sale Modules
  { category: 'Post-Sale Modules', permissions: [
    '64vb.verify',
    'endorsements.view',
    'endorsements.create',
    'endorsements.approve',
    'cancellations.view',
    'cancellations.create',
    'cancellations.approve',
  ]},
  
  // Invoice & Payout
  { category: 'Invoice & Payout', permissions: [
    'invoices.view',
    'invoices.create',
    'invoices.approve',
    'payments.view',
    'payments.approve',
    'settlements.view',
    'settlements.create',
  ]},
  
  // Customer Retention
  { category: 'Customer Retention', permissions: [
    'retention.view',
    'sms.send',
    'email.send',
    'whatsapp.send',
    'telematic.view',
    'renewals.track',
  ]},
  
  // LMS Training
  { category: 'LMS Training', permissions: [
    'training.view',
    'training.upload',
    'training.assign',
    'exams.view',
    'exams.create',
    'certificates.generate',
  ]},
  
  // Master Data
  { category: 'Master Data', permissions: [
    'masterdata.view',
    'masterdata.upload',
    'masterdata.edit',
    'config.view',
    'config.edit',
  ]},
  
  // User Management
  { category: 'User Management', permissions: [
    'users.view',
    'users.create',
    'users.edit',
    'users.delete',
    'roles.view',
    'roles.create',
    'roles.edit',
    'roles.delete',
  ]},
  
  // System Administration
  { category: 'System Administration', permissions: [
    'settings.view',
    'settings.edit',
    'notifications.view',
    'notifications.send',
    'audit.view',
    'system.monitor',
  ]},
]

const PREDEFINED_ROLES = [
  {
    roleName: 'Super Admin',
    description: 'Full system access with all permissions',
    permissions: PERMISSIONS.flatMap(cat => cat.permissions),
  },
  {
    roleName: 'Admin',
    description: 'Administrative access with most permissions except user management',
    permissions: PERMISSIONS.flatMap(cat => cat.permissions).filter(p => !p.includes('users.') && !p.includes('roles.')),
  },
  {
    roleName: 'Manager',
    description: 'Management access with policy and claims oversight',
    permissions: [
      'dashboard.view',
      'analytics.view',
      'reports.generate',
      'customers.view',
      'policies.view',
      'policies.approve',
      'claims.view',
      'claims.approve',
      'invoices.view',
      'invoices.approve',
      'payments.approve',
    ],
  },
  {
    roleName: 'Agent',
    description: 'Agent access for customer interaction and policy sales',
    permissions: [
      'dashboard.view',
      'customers.view',
      'customers.create',
      'customers.edit',
      'policies.view',
      'policies.create',
      'leads.view',
      'leads.create',
      'quotations.view',
      'quotations.create',
      'proposals.view',
      'proposals.create',
    ],
  },
  {
    roleName: 'Underwriter',
    description: 'Underwriting access for policy approval and risk assessment',
    permissions: [
      'dashboard.view',
      'policies.view',
      'policies.approve',
      '64vb.verify',
      'endorsements.view',
      'endorsements.approve',
      'cancellations.view',
      'cancellations.approve',
    ],
  },
  {
    roleName: 'Claims Handler',
    description: 'Claims processing and settlement access',
    permissions: [
      'dashboard.view',
      'claims.view',
      'claims.create',
      'claims.edit',
      'claims.approve',
      'claims.settle',
      'customers.view',
      'policies.view',
    ],
  },
]

export default function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RoleForm>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      permissions: [],
      isActive: true,
    },
  })

  useEffect(() => {
    fetchRoles()
  }, [])

  const fetchRoles = async () => {
    try {
      setLoading(true)
      // Mock data - replace with actual API call
      const mockRoles: Role[] = [
        {
          id: '1',
          roleName: 'Super Admin',
          description: 'Full system access with all permissions',
          permissions: PERMISSIONS.flatMap(cat => cat.permissions),
          userCount: 2,
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: '2',
          roleName: 'Admin',
          description: 'Administrative access with most permissions',
          permissions: PERMISSIONS.flatMap(cat => cat.permissions).filter(p => !p.includes('users.') && !p.includes('roles.')),
          userCount: 5,
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: '3',
          roleName: 'Manager',
          description: 'Management access with policy and claims oversight',
          permissions: [
            'dashboard.view',
            'analytics.view',
            'reports.generate',
            'customers.view',
            'policies.view',
            'policies.approve',
            'claims.view',
            'claims.approve',
            'invoices.view',
            'invoices.approve',
            'payments.approve',
          ],
          userCount: 8,
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: '4',
          roleName: 'Agent',
          description: 'Agent access for customer interaction and policy sales',
          permissions: [
            'dashboard.view',
            'customers.view',
            'customers.create',
            'customers.edit',
            'policies.view',
            'policies.create',
            'leads.view',
            'leads.create',
            'quotations.view',
            'quotations.create',
            'proposals.view',
            'proposals.create',
          ],
          userCount: 25,
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: '5',
          roleName: 'Underwriter',
          description: 'Underwriting access for policy approval and risk assessment',
          permissions: [
            'dashboard.view',
            'policies.view',
            'policies.approve',
            '64vb.verify',
            'endorsements.view',
            'endorsements.approve',
            'cancellations.view',
            'cancellations.approve',
          ],
          userCount: 12,
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      ]

      setRoles(mockRoles)
    } catch (error) {
      console.error('Error fetching roles:', error)
      toast.error('Failed to fetch roles')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: RoleForm) => {
    try {
      const formData = {
        ...data,
        permissions: selectedPermissions,
      }

      if (editingRole) {
        // Update existing role
        const updatedRole = { 
          ...editingRole, 
          ...formData, 
          updatedAt: new Date().toISOString() 
        }
        setRoles(roles.map((r) => (r.id === updatedRole.id ? updatedRole : r)))
        toast.success('Role updated successfully!')
      } else {
        // Create new role
        const newRole: Role = {
          id: String(roles.length + 1),
          ...formData,
          userCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        setRoles([...roles, newRole])
        toast.success('Role created successfully!')
      }

      setShowModal(false)
      reset()
      setEditingRole(null)
      setSelectedPermissions([])
    } catch (error) {
      console.error('Error saving role:', error)
      toast.error('Failed to save role')
    }
  }

  const openAddModal = () => {
    setEditingRole(null)
    reset({
      roleName: '',
      description: '',
      permissions: [],
      isActive: true,
    })
    setSelectedPermissions([])
    setShowModal(true)
  }

  const openEditModal = (role: Role) => {
    setEditingRole(role)
    reset(role)
    setSelectedPermissions(role.permissions)
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this role? This action cannot be undone.')) {
      try {
        setRoles(roles.filter((r) => r.id !== id))
        toast.success('Role deleted successfully')
      } catch (error) {
        console.error('Error deleting role:', error)
        toast.error('Failed to delete role')
      }
    }
  }

  const applyPredefinedRole = (predefinedRole: typeof PREDEFINED_ROLES[0]) => {
    reset({
      roleName: predefinedRole.roleName,
      description: predefinedRole.description,
      permissions: predefinedRole.permissions,
      isActive: true,
    })
    setSelectedPermissions(predefinedRole.permissions)
  }

  const togglePermission = (permission: string) => {
    setSelectedPermissions(prev =>
      prev.includes(permission)
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    )
  }

  const toggleCategoryPermissions = (categoryPermissions: string[]) => {
    const allSelected = categoryPermissions.every(p => selectedPermissions.includes(p))
    
    if (allSelected) {
      // Remove all permissions from this category
      setSelectedPermissions(prev => 
        prev.filter(p => !categoryPermissions.includes(p))
      )
    } else {
      // Add all permissions from this category
      setSelectedPermissions(prev => 
        Array.from(new Set([...prev, ...categoryPermissions]))
      )
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Role Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Create and manage user roles with specific permissions.
          </p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary btn-md">
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Role
        </button>
      </div>

      {/* Roles Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-head">Role Name</th>
                <th className="table-head">Description</th>
                <th className="table-head">Permissions</th>
                <th className="table-head">Users</th>
                <th className="table-head">Status</th>
                <th className="table-head">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {roles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="table-cell text-center py-8 text-gray-500">
                    No roles found
                  </td>
                </tr>
              ) : (
                roles.map((role) => (
                  <tr key={role.id} className="table-row">
                    <td className="table-cell font-medium">{role.roleName}</td>
                    <td className="table-cell">{role.description}</td>
                    <td className="table-cell">
                      <span className="text-sm text-gray-600">
                        {role.permissions.length} permissions
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center">
                        <UsersIcon className="h-4 w-4 text-gray-400 mr-1" />
                        <span>{role.userCount}</span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        role.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {role.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditModal(role)}
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
                          onClick={() => handleDelete(role.id)}
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

      {/* Role Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-6xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingRole ? 'Edit Role' : 'Add Role'}
              </h3>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role Name *
                    </label>
                    <input
                      type="text"
                      {...register('roleName')}
                      className="input"
                      placeholder="Enter role name"
                    />
                    {errors.roleName && (
                      <p className="text-red-600 text-xs mt-1">{errors.roleName.message}</p>
                    )}
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        {...register('isActive')}
                        className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                      />
                      <span className="ml-2 text-sm text-gray-700">Active</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    {...register('description')}
                    rows={3}
                    className="input"
                    placeholder="Describe the role and its responsibilities"
                  ></textarea>
                  {errors.description && (
                    <p className="text-red-600 text-xs mt-1">{errors.description.message}</p>
                  )}
                </div>

                {/* Predefined Roles */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quick Setup - Predefined Roles
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {PREDEFINED_ROLES.map((predefinedRole, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => applyPredefinedRole(predefinedRole)}
                        className="p-3 text-left border border-gray-300 rounded-md hover:border-blue-500 hover:bg-blue-50"
                      >
                        <div className="font-medium text-sm">{predefinedRole.roleName}</div>
                        <div className="text-xs text-gray-600 mt-1">{predefinedRole.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Permissions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Permissions * ({selectedPermissions.length} selected)
                  </label>
                  <div className="space-y-4 max-h-96 overflow-y-auto border border-gray-200 rounded-md p-4">
                    {PERMISSIONS.map((category) => (
                      <div key={category.category} className="border-b border-gray-100 pb-3 last:border-b-0">
                        <div className="flex items-center mb-2">
                          <button
                            type="button"
                            onClick={() => toggleCategoryPermissions(category.permissions)}
                            className="flex items-center text-sm font-medium text-gray-900 hover:text-blue-600"
                          >
                            <ShieldCheckIcon className="h-4 w-4 mr-1" />
                            {category.category}
                            <span className="ml-2 text-xs text-gray-500">
                              ({category.permissions.filter(p => selectedPermissions.includes(p)).length}/{category.permissions.length})
                            </span>
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-6">
                          {category.permissions.map((permission) => (
                            <label key={permission} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedPermissions.includes(permission)}
                                onChange={() => togglePermission(permission)}
                                className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                              />
                              <span className="ml-2 text-sm text-gray-700">{permission}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  {errors.permissions && (
                    <p className="text-red-600 text-xs mt-1">{errors.permissions.message}</p>
                  )}
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      setEditingRole(null)
                      reset()
                      setSelectedPermissions([])
                    }}
                    className="btn btn-secondary btn-md"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-md">
                    {editingRole ? 'Update Role' : 'Create Role'}
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


















