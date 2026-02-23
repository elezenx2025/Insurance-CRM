'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  ArrowLeftIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const insuranceCompanySchema = z.object({
  icId: z.string().min(1, 'IC ID is required'),
  icName: z.string().min(1, 'IC Name is required'),
  icCode: z.string().min(1, 'IC Code is required'),
  icCin: z.string().min(1, 'IC CIN is required'),
  icRegistrationNumber: z.string().min(1, 'IC Registration Number is required'),
  icBusiness: z.string().min(1, 'IC Business is required'),
  icHeadOffice: z.string().min(1, 'IC Head Office is required'),
  icDescription: z.string().optional(),
  isActive: z.boolean(),
  createdBy: z.string().min(1, 'Created By is required'),
  createdDate: z.string().min(1, 'Created Date is required'),
  createdProcName: z.string().min(1, 'Created Proc Name is required'),
  updatedBy: z.string().optional(),
  updatedDate: z.string().optional(),
  activeFromDate: z.string().min(1, 'Active From Date is required'),
  activeToDate: z.string().optional(),
})

type InsuranceCompanyForm = z.infer<typeof insuranceCompanySchema>

interface InsuranceCompany {
  id: string
  icId: string
  icName: string
  icCode: string
  icCin: string
  icRegistrationNumber: string
  icBusiness: string
  icHeadOffice: string
  icDescription?: string
  isActive: boolean
  createdBy: string
  createdDate: string
  createdProcName: string
  updatedBy?: string
  updatedDate?: string
  activeFromDate: string
  activeToDate?: string
}

export default function InsuranceCompanyMasterPage() {
  const router = useRouter()
  const [insuranceCompanies, setInsuranceCompanies] = useState<InsuranceCompany[]>([])
  const [filteredInsuranceCompanies, setFilteredInsuranceCompanies] = useState<InsuranceCompany[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingInsuranceCompany, setEditingInsuranceCompany] = useState<InsuranceCompany | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InsuranceCompanyForm>({
    resolver: zodResolver(insuranceCompanySchema),
  })

  // Mock data
  useEffect(() => {
    const mockData: InsuranceCompany[] = [
      {
        id: '1',
        icId: 'IC001',
        icName: 'Bajaj Allianz General Insurance Company Limited',
        icCode: 'BAJAJ_ALLIANZ',
        icCin: 'U66010PN2000PLC015329',
        icRegistrationNumber: 'REG001',
        icBusiness: 'General Insurance',
        icHeadOffice: 'Pune, Maharashtra',
        icDescription: 'Leading general insurance company in India',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_IC_INSERT',
        updatedBy: 'Admin',
        updatedDate: '2024-01-15',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '2',
        icId: 'IC002',
        icName: 'HDFC ERGO General Insurance Company Limited',
        icCode: 'HDFC_ERGO',
        icCin: 'U66010MH2007PLC175194',
        icRegistrationNumber: 'REG002',
        icBusiness: 'General Insurance',
        icHeadOffice: 'Mumbai, Maharashtra',
        icDescription: 'General insurance solutions provider',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_IC_INSERT',
        updatedBy: 'Admin',
        updatedDate: '2024-01-15',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '3',
        icId: 'IC003',
        icName: 'ICICI Lombard General Insurance Company Limited',
        icCode: 'ICICI_LOMBARD',
        icCin: 'U66010MH2000PLC120425',
        icRegistrationNumber: 'REG003',
        icBusiness: 'General Insurance',
        icHeadOffice: 'Mumbai, Maharashtra',
        icDescription: 'Digital-first general insurance company',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_IC_INSERT',
        updatedBy: 'Admin',
        updatedDate: '2024-01-15',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '4',
        icId: 'IC004',
        icName: 'New India Assurance Company Limited',
        icCode: 'NEW_INDIA',
        icCin: 'U66010MH1919PTC000006',
        icRegistrationNumber: 'REG004',
        icBusiness: 'General Insurance',
        icHeadOffice: 'Mumbai, Maharashtra',
        icDescription: 'Public sector general insurance company',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_IC_INSERT',
        updatedBy: 'Admin',
        updatedDate: '2024-01-15',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
      {
        id: '5',
        icId: 'IC005',
        icName: 'Oriental Insurance Company Limited',
        icCode: 'ORIENTAL',
        icCin: 'U66010DL1947GOI000001',
        icRegistrationNumber: 'REG005',
        icBusiness: 'General Insurance',
        icHeadOffice: 'New Delhi, Delhi',
        icDescription: 'Public sector general insurance company',
        isActive: true,
        createdBy: 'Admin',
        createdDate: '2024-01-01',
        createdProcName: 'PROC_IC_INSERT',
        updatedBy: 'Admin',
        updatedDate: '2024-01-15',
        activeFromDate: '2024-01-01',
        activeToDate: '2025-12-31',
      },
    ]
    setInsuranceCompanies(mockData)
  }, [])

  // Filter data based on search term
  useEffect(() => {
    let filtered = insuranceCompanies

    if (searchTerm) {
      filtered = filtered.filter(company =>
        company.icName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.icCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.icId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.icBusiness.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredInsuranceCompanies(filtered)
  }, [insuranceCompanies, searchTerm])

  const handleAddInsuranceCompany = () => {
    setEditingInsuranceCompany(null)
    reset({
      icId: '',
      icName: '',
      icCode: '',
      icCin: '',
      icRegistrationNumber: '',
      icBusiness: '',
      icHeadOffice: '',
      icDescription: '',
      isActive: true,
      createdBy: 'Current User',
      createdDate: new Date().toISOString().split('T')[0],
      createdProcName: 'PROC_IC_INSERT',
      updatedBy: '',
      updatedDate: '',
      activeFromDate: new Date().toISOString().split('T')[0],
      activeToDate: '',
    })
    setShowModal(true)
  }

  const handleEditInsuranceCompany = (company: InsuranceCompany) => {
    setEditingInsuranceCompany(company)
    reset({
      icId: company.icId,
      icName: company.icName,
      icCode: company.icCode,
      icCin: company.icCin,
      icRegistrationNumber: company.icRegistrationNumber,
      icBusiness: company.icBusiness,
      icHeadOffice: company.icHeadOffice,
      icDescription: company.icDescription || '',
      isActive: company.isActive,
      createdBy: company.createdBy,
      createdDate: company.createdDate,
      createdProcName: company.createdProcName,
      updatedBy: company.updatedBy || '',
      updatedDate: company.updatedDate || '',
      activeFromDate: company.activeFromDate,
      activeToDate: company.activeToDate || '',
    })
    setShowModal(true)
  }

  const onSubmit = (data: InsuranceCompanyForm) => {
    if (editingInsuranceCompany) {
      // Update existing insurance company
      setInsuranceCompanies(prev =>
        prev.map(company =>
          company.id === editingInsuranceCompany.id
            ? {
                ...company,
                ...data,
                updatedBy: 'Current User',
                updatedDate: new Date().toISOString().split('T')[0],
              }
            : company
        )
      )
      toast.success('Insurance Company updated successfully!')
    } else {
      // Add new insurance company
      const newInsuranceCompany: InsuranceCompany = {
        id: Date.now().toString(),
        ...data,
      }
      setInsuranceCompanies(prev => [...prev, newInsuranceCompany])
      toast.success('Insurance Company added successfully!')
    }
    setShowModal(false)
    reset()
  }

  const handleDeleteInsuranceCompany = (id: string) => {
    if (confirm('Are you sure you want to delete this insurance company?')) {
      setInsuranceCompanies(prev => prev.filter(company => company.id !== id))
      toast.success('Insurance Company deleted successfully!')
    }
  }

  const totalPages = Math.ceil(filteredInsuranceCompanies.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentInsuranceCompanies = filteredInsuranceCompanies.slice(startIndex, endIndex)

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
                <span className="ml-4 text-gray-900 font-medium">Insurance Company Master</span>
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
            <h1 className="text-lg font-semibold text-gray-900">Insurance Company Master</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage insurance company information and details
            </p>
          </div>
        </div>
        <button
          onClick={handleAddInsuranceCompany}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Insurance Company
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search insurance companies..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {filteredInsuranceCompanies.length} companies
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IC Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Business Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Head Office
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CIN
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
              {currentInsuranceCompanies.map((company) => (
                <tr key={company.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {company.icCode}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="max-w-xs truncate" title={company.icName}>
                      {company.icName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {company.icBusiness}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {company.icHeadOffice}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {company.icCin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      company.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {company.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditInsuranceCompany(company)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteInsuranceCompany(company.id)}
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(endIndex, filteredInsuranceCompanies.length)}</span> of{' '}
                  <span className="font-medium">{filteredInsuranceCompanies.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === page
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-6xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingInsuranceCompany ? 'Edit Insurance Company' : 'Add New Insurance Company'}
              </h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">IC ID *</label>
                    <input
                      {...register('icId')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.icId && <p className="text-red-500 text-xs mt-1">{errors.icId.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">IC Code *</label>
                    <input
                      {...register('icCode')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.icCode && <p className="text-red-500 text-xs mt-1">{errors.icCode.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">IC CIN *</label>
                    <input
                      {...register('icCin')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.icCin && <p className="text-red-500 text-xs mt-1">{errors.icCin.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">IC Name *</label>
                  <input
                    {...register('icName')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.icName && <p className="text-red-500 text-xs mt-1">{errors.icName.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">IC Registration Number *</label>
                    <input
                      {...register('icRegistrationNumber')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.icRegistrationNumber && <p className="text-red-500 text-xs mt-1">{errors.icRegistrationNumber.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">IC Business *</label>
                    <select
                      {...register('icBusiness')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Business Type</option>
                      <option value="General Insurance">General Insurance</option>
                      <option value="Life Insurance">Life Insurance</option>
                      <option value="Health Insurance">Health Insurance</option>
                      <option value="Reinsurance">Reinsurance</option>
                    </select>
                    {errors.icBusiness && <p className="text-red-500 text-xs mt-1">{errors.icBusiness.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">IC Head Office *</label>
                  <input
                    {...register('icHeadOffice')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.icHeadOffice && <p className="text-red-500 text-xs mt-1">{errors.icHeadOffice.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">IC Description</label>
                  <textarea
                    {...register('icDescription')}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Created By *</label>
                    <input
                      {...register('createdBy')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.createdBy && <p className="text-red-500 text-xs mt-1">{errors.createdBy.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Created Date *</label>
                    <input
                      {...register('createdDate')}
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.createdDate && <p className="text-red-500 text-xs mt-1">{errors.createdDate.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Created Proc Name *</label>
                    <input
                      {...register('createdProcName')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.createdProcName && <p className="text-red-500 text-xs mt-1">{errors.createdProcName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Updated By</label>
                    <input
                      {...register('updatedBy')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Updated Date</label>
                    <input
                      {...register('updatedDate')}
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Active From Date *</label>
                    <input
                      {...register('activeFromDate')}
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.activeFromDate && <p className="text-red-500 text-xs mt-1">{errors.activeFromDate.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Active To Date</label>
                    <input
                      {...register('activeToDate')}
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    {...register('isActive')}
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">Is Active</label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    {editingInsuranceCompany ? 'Update' : 'Add'} Insurance Company
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



