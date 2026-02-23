'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  DocumentDuplicateIcon,
  CloudArrowUpIcon,
  XMarkIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const signatureSchema = z.object({
  name: z.string().min(1, 'Signature name is required'),
  file: z.any().refine((file) => file && file.length > 0, 'Signature file is required'),
})

const ownedFormatSchema = z.object({
  agentTypeId: z.string().min(1, 'Agent type is required'),
  agentTypeName: z.string().min(1, 'Agent type name is required'),
  policyTypeIds: z.array(z.string()).min(1, 'At least one policy type is required'),
  policyTypeNames: z.array(z.string()).min(1, 'At least one policy type is required'),
  examId: z.string().min(1, 'Exam is required'),
  examName: z.string().min(1, 'Exam name is required'),
  certificateFormat: z.any().refine((file) => file && file.length > 0, 'Certificate format is required'),
  signature: z.any().refine((file) => file && file.length > 0, 'Signature is required'),
  validityFrom: z.string().min(1, 'Validity from date is required'),
  validityTo: z.string().min(1, 'Validity to date is required'),
  isActive: z.boolean(),
})

const customDesignSchema = z.object({
  agentTypeId: z.string().min(1, 'Agent type is required'),
  agentTypeName: z.string().min(1, 'Agent type name is required'),
  policyTypeIds: z.array(z.string()).min(1, 'At least one policy type is required'),
  policyTypeNames: z.array(z.string()).min(1, 'At least one policy type is required'),
  examId: z.string().min(1, 'Exam is required'),
  examName: z.string().min(1, 'Exam name is required'),
  // Header fields
  companyName: z.string().min(1, 'Company name is required'),
  logo: z.any().refine((file) => file && file.length > 0, 'Logo is required'),
  certificateName: z.string().min(1, 'Certificate name is required'),
  // Body fields
  contentText: z.string().min(1, 'Content text is required'),
  dynamicFields: z.array(z.string()).optional(),
  // Footer fields
  signatures: z.array(signatureSchema).min(1, 'At least one signature is required'),
  validityFrom: z.string().min(1, 'Validity from date is required'),
  validityTo: z.string().min(1, 'Validity to date is required'),
  isActive: z.boolean(),
})

type OwnedFormatForm = z.infer<typeof ownedFormatSchema>
type CustomDesignForm = z.infer<typeof customDesignSchema>

interface Certificate {
  id: string
  type: 'OWNED' | 'CUSTOM'
  agentTypeId: string
  agentTypeName: string
  policyTypeIds: string[]
  policyTypeNames: string[]
  examId: string
  examName: string
  validityFrom: string
  validityTo: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  // Owned format fields
  certificateFormat?: string
  signature?: string
  // Custom design fields
  companyName?: string
  logo?: string
  certificateName?: string
  contentText?: string
  dynamicFields?: string[]
  signatures?: Array<{
    name: string
    file: string
  }>
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

interface OnlineExam {
  id: string
  name: string
  agentTypeId: string
}

const AGENT_TYPES: AgentType[] = [
  { id: '1', name: 'Life Insurance Agent', code: 'LIA' },
  { id: '2', name: 'General Insurance Agent', code: 'GIA' },
  { id: '3', name: 'Health Insurance Agent', code: 'HIA' },
  { id: '4', name: 'Motor Insurance Agent', code: 'MIA' },
  { id: '5', name: 'Corporate Insurance Agent', code: 'CIA' },
  { id: '6', name: 'Senior Insurance Agent', code: 'SIA' },
  { id: '7', name: 'New Agent', code: 'NA' },
  { id: '8', name: 'Digital Insurance Agent', code: 'DIA' },
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

const ONLINE_EXAMS: OnlineExam[] = [
  { id: '1', name: 'Life Insurance Fundamentals Exam', agentTypeId: '1' },
  { id: '2', name: 'General Insurance Basics Exam', agentTypeId: '2' },
  { id: '3', name: 'Health Insurance Specialization Exam', agentTypeId: '3' },
  { id: '4', name: 'Motor Insurance Advanced Exam', agentTypeId: '4' },
  { id: '5', name: 'Corporate Insurance Expert Exam', agentTypeId: '5' },
]

const DYNAMIC_FIELDS = [
  'Agent Name',
  'Agent ID',
  'Exam Date',
  'Score',
  'Percentage',
  'Certificate Number',
  'Issue Date',
  'Expiry Date',
  'Policy Type',
  'Training Module',
]

export default function ExaminationCertificate() {
  const router = useRouter()
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterAgentType, setFilterAgentType] = useState('ALL')
  const [filterType, setFilterType] = useState('ALL')
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [certificateType, setCertificateType] = useState<'OWNED' | 'CUSTOM'>('OWNED')
  const [availableExams, setAvailableExams] = useState<OnlineExam[]>([])

  const ownedForm = useForm<OwnedFormatForm>({
    resolver: zodResolver(ownedFormatSchema),
    defaultValues: {
      agentTypeId: '',
      agentTypeName: '',
      policyTypeIds: [],
      policyTypeNames: [],
      examId: '',
      examName: '',
      validityFrom: '',
      validityTo: '',
      isActive: true,
    },
  })

  const customForm = useForm<CustomDesignForm>({
    resolver: zodResolver(customDesignSchema),
    defaultValues: {
      agentTypeId: '',
      agentTypeName: '',
      policyTypeIds: [],
      policyTypeNames: [],
      examId: '',
      examName: '',
      companyName: '',
      certificateName: '',
      contentText: '',
      dynamicFields: [],
      signatures: [{ name: '', file: null }],
      validityFrom: '',
      validityTo: '',
      isActive: true,
    },
  })

  const { fields: signatureFields, append: appendSignature, remove: removeSignature } = useFieldArray({
    control: customForm.control,
    name: 'signatures',
  })

  const selectedAgentTypeId = ownedForm.watch('agentTypeId') || customForm.watch('agentTypeId')
  const selectedPolicyTypeIds = ownedForm.watch('policyTypeIds') || customForm.watch('policyTypeIds')

  useEffect(() => {
    fetchCertificates()
  }, [])

  useEffect(() => {
    if (selectedAgentTypeId) {
      const selectedAgentType = AGENT_TYPES.find(at => at.id === selectedAgentTypeId)
      if (selectedAgentType) {
        ownedForm.setValue('agentTypeName', selectedAgentType.name)
        customForm.setValue('agentTypeName', selectedAgentType.name)
      }
      
      // Filter exams by agent type
      const exams = ONLINE_EXAMS.filter(exam => exam.agentTypeId === selectedAgentTypeId)
      setAvailableExams(exams)
    } else {
      setAvailableExams([])
    }
  }, [selectedAgentTypeId, ownedForm, customForm])

  useEffect(() => {
    if (selectedPolicyTypeIds && selectedPolicyTypeIds.length > 0) {
      const selectedPolicyTypes = POLICY_TYPES.filter(pt => selectedPolicyTypeIds.includes(pt.id))
      const policyNames = selectedPolicyTypes.map(pt => pt.name)
      ownedForm.setValue('policyTypeNames', policyNames)
      customForm.setValue('policyTypeNames', policyNames)
    } else {
      ownedForm.setValue('policyTypeNames', [])
      customForm.setValue('policyTypeNames', [])
    }
  }, [selectedPolicyTypeIds, ownedForm, customForm])

  const fetchCertificates = async () => {
    try {
      setLoading(true)
      // Mock data - replace with actual API call
      const mockCertificates: Certificate[] = [
        {
          id: '1',
          type: 'OWNED',
          agentTypeId: '1',
          agentTypeName: 'Life Insurance Agent',
          policyTypeIds: ['1', '2'],
          policyTypeNames: ['Life Insurance', 'Term Life Insurance'],
          examId: '1',
          examName: 'Life Insurance Fundamentals Exam',
          certificateFormat: '/certificates/life-insurance-cert.pdf',
          signature: '/signatures/manager-signature.pdf',
          validityFrom: '2024-01-01',
          validityTo: '2024-12-31',
          isActive: true,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
        {
          id: '2',
          type: 'CUSTOM',
          agentTypeId: '2',
          agentTypeName: 'General Insurance Agent',
          policyTypeIds: ['5', '8'],
          policyTypeNames: ['Motor Insurance', 'Home Insurance'],
          examId: '2',
          examName: 'General Insurance Basics Exam',
          companyName: 'Insurance Training Institute',
          logo: '/logos/company-logo.png',
          certificateName: 'Certificate of Completion',
          contentText: 'This is to certify that [Agent Name] has successfully completed the [Exam Name] with a score of [Score]% on [Exam Date].',
          dynamicFields: ['Agent Name', 'Exam Name', 'Score', 'Exam Date'],
          signatures: [
            { name: 'Training Manager', file: '/signatures/training-manager.pdf' },
            { name: 'HR Director', file: '/signatures/hr-director.pdf' }
          ],
          validityFrom: '2024-01-01',
          validityTo: '2024-12-31',
          isActive: true,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
      ]

      // Apply filters
      let filteredCertificates = mockCertificates
      if (searchTerm) {
        filteredCertificates = filteredCertificates.filter(
          (cert) =>
            cert.examName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cert.agentTypeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (cert.certificateName && cert.certificateName.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      }
      if (filterAgentType !== 'ALL') {
        filteredCertificates = filteredCertificates.filter((cert) => cert.agentTypeId === filterAgentType)
      }
      if (filterType !== 'ALL') {
        filteredCertificates = filteredCertificates.filter((cert) => cert.type === filterType)
      }
      if (filterStatus !== 'ALL') {
        filteredCertificates = filteredCertificates.filter((cert) => 
          filterStatus === 'ACTIVE' ? cert.isActive : !cert.isActive
        )
      }

      setCertificates(filteredCertificates)
    } catch (error) {
      console.error('Error fetching certificates:', error)
      toast.error('Failed to fetch certificates')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: any) => {
    try {
      const certificateData = {
        ...data,
        type: certificateType,
        createdAt: editingCertificate ? editingCertificate.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      if (editingCertificate) {
        const updatedCertificate = { 
          ...editingCertificate, 
          ...certificateData,
        }
        setCertificates(certificates.map((c) => (c.id === updatedCertificate.id ? updatedCertificate : c)))
        toast.success('Certificate updated successfully!')
      } else {
        const newCertificate: Certificate = {
          id: String(certificates.length + 1),
          ...certificateData,
        }
        setCertificates([...certificates, newCertificate])
        toast.success('Certificate created successfully!')
      }

      setShowModal(false)
      resetForms()
      setEditingCertificate(null)
    } catch (error) {
      console.error('Error saving certificate:', error)
      toast.error('Failed to save certificate')
    }
  }

  const resetForms = () => {
    ownedForm.reset()
    customForm.reset()
    setAvailableExams([])
  }

  const openAddModal = () => {
    setEditingCertificate(null)
    setCertificateType('OWNED')
    resetForms()
    setShowModal(true)
  }

  const openEditModal = (certificate: Certificate) => {
    setEditingCertificate(certificate)
    setCertificateType(certificate.type)
    
    if (certificate.type === 'OWNED') {
      ownedForm.reset({
        agentTypeId: certificate.agentTypeId,
        agentTypeName: certificate.agentTypeName,
        policyTypeIds: certificate.policyTypeIds,
        policyTypeNames: certificate.policyTypeNames,
        examId: certificate.examId,
        examName: certificate.examName,
        validityFrom: certificate.validityFrom,
        validityTo: certificate.validityTo,
        isActive: certificate.isActive,
      })
    } else {
      customForm.reset({
        agentTypeId: certificate.agentTypeId,
        agentTypeName: certificate.agentTypeName,
        policyTypeIds: certificate.policyTypeIds,
        policyTypeNames: certificate.policyTypeNames,
        examId: certificate.examId,
        examName: certificate.examName,
        companyName: certificate.companyName || '',
        certificateName: certificate.certificateName || '',
        contentText: certificate.contentText || '',
        dynamicFields: certificate.dynamicFields || [],
        signatures: certificate.signatures || [{ name: '', file: null }],
        validityFrom: certificate.validityFrom,
        validityTo: certificate.validityTo,
        isActive: certificate.isActive,
      })
    }
    
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this certificate?')) {
      try {
        setCertificates(certificates.filter((c) => c.id !== id))
        toast.success('Certificate deleted successfully')
      } catch (error) {
        console.error('Error deleting certificate:', error)
        toast.error('Failed to delete certificate')
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
                <span className="ml-4 text-gray-900 font-medium">Examination Certificate</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>


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
                <span className="ml-4 text-gray-900 font-medium">Examination Certificate</span>
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
            <h1 className="text-2xl font-bold text-gray-900">Examination Certificate</h1>
            <p className="mt-1 text-sm text-gray-600">
              Create and manage examination passing certificates with owned format or custom design.
            </p>
          </div>
        </div>
        <button onClick={openAddModal} className="btn btn-primary btn-md">
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Certificate
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
                placeholder="Search certificates..."
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
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input"
            >
              <option value="ALL">All Types</option>
              <option value="OWNED">Owned Format</option>
              <option value="CUSTOM">Custom Design</option>
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

      {/* Certificates Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-head">Certificate</th>
                <th className="table-head">Type</th>
                <th className="table-head">Agent Type</th>
                <th className="table-head">Policy Types</th>
                <th className="table-head">Exam</th>
                <th className="table-head">Validity</th>
                <th className="table-head">Status</th>
                <th className="table-head">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {certificates.length === 0 ? (
                <tr>
                  <td colSpan={8} className="table-cell text-center py-8 text-gray-500">
                    No certificates found
                  </td>
                </tr>
              ) : (
                certificates.map((certificate) => (
                  <tr key={certificate.id} className="table-row">
                    <td className="table-cell">
                      <div className="flex items-center">
                        <DocumentDuplicateIcon className="h-5 w-5 text-blue-500 mr-2" />
                        <div>
                          <div className="font-medium">
                            {certificate.type === 'CUSTOM' ? certificate.certificateName : 'Owned Format'}
                          </div>
                          {certificate.type === 'CUSTOM' && certificate.companyName && (
                            <div className="text-sm text-gray-500">{certificate.companyName}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        certificate.type === 'OWNED' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {certificate.type === 'OWNED' ? 'Owned Format' : 'Custom Design'}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className="text-sm">{certificate.agentTypeName}</span>
                    </td>
                    <td className="table-cell">
                      <div className="flex flex-wrap gap-1">
                        {certificate.policyTypeNames.map((name, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                            {name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="text-sm">{certificate.examName}</span>
                    </td>
                    <td className="table-cell">
                      <div className="text-sm">
                        <div>{formatDate(certificate.validityFrom)}</div>
                        <div className="text-gray-500">to {formatDate(certificate.validityTo)}</div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        certificate.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {certificate.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toast('Preview certificate coming soon')}
                          className="text-blue-600 hover:text-blue-900"
                          title="Preview"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(certificate)}
                          className="text-green-600 hover:text-green-900"
                          title="Edit"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(certificate.id)}
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

      {/* Certificate Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-5 mx-auto p-5 border w-11/12 max-w-5xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingCertificate ? 'Edit Certificate' : 'Add Certificate'}
              </h3>
              
              {/* Certificate Type Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certificate Type *
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="OWNED"
                      checked={certificateType === 'OWNED'}
                      onChange={(e) => setCertificateType(e.target.value as 'OWNED' | 'CUSTOM')}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Owned Format</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="CUSTOM"
                      checked={certificateType === 'CUSTOM'}
                      onChange={(e) => setCertificateType(e.target.value as 'OWNED' | 'CUSTOM')}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Custom Design</span>
                  </label>
                </div>
              </div>

              {certificateType === 'OWNED' ? (
                <form onSubmit={ownedForm.handleSubmit(onSubmit as any)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Agent Type *
                      </label>
                      <select
                        {...ownedForm.register('agentTypeId')}
                        className="input"
                      >
                        <option value="">Select Agent Type</option>
                        {AGENT_TYPES.map((agentType) => (
                          <option key={agentType.id} value={agentType.id}>
                            {agentType.name}
                          </option>
                        ))}
                      </select>
                      {ownedForm.formState.errors.agentTypeId && (
                        <p className="text-red-600 text-xs mt-1">Agent type is required</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Policy Types * (Multiple Selection)
                      </label>
                      <select
                        multiple
                        {...ownedForm.register('policyTypeIds')}
                        className="input h-32"
                      >
                        {POLICY_TYPES.map((policyType) => (
                          <option key={policyType.id} value={policyType.id}>
                            {policyType.name}
                          </option>
                        ))}
                      </select>
                      {ownedForm.formState.errors.policyTypeIds && (
                        <p className="text-red-600 text-xs mt-1">At least one policy type is required</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Exam *
                      </label>
                      <select
                        {...ownedForm.register('examId')}
                        className="input"
                        disabled={availableExams.length === 0}
                      >
                        <option value="">Select Exam</option>
                        {availableExams.map((exam) => (
                          <option key={exam.id} value={exam.id}>
                            {exam.name}
                          </option>
                        ))}
                      </select>
                      {ownedForm.formState.errors.examId && (
                        <p className="text-red-600 text-xs mt-1">Exam is required</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Validity From *
                      </label>
                      <input
                        type="date"
                        {...ownedForm.register('validityFrom')}
                        className="input"
                      />
                      {ownedForm.formState.errors.validityFrom && (
                        <p className="text-red-600 text-xs mt-1">Validity from date is required</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Validity To *
                      </label>
                      <input
                        type="date"
                        {...ownedForm.register('validityTo')}
                        className="input"
                      />
                      {ownedForm.formState.errors.validityTo && (
                        <p className="text-red-600 text-xs mt-1">Validity to date is required</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Upload Certificate Format (PDF) *
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="certificate-format-upload"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                            >
                              <span>Upload certificate PDF</span>
                              <input
                                id="certificate-format-upload"
                                type="file"
                                className="sr-only"
                                accept=".pdf"
                                {...ownedForm.register('certificateFormat')}
                              />
                            </label>
                          </div>
                          <p className="text-xs text-gray-500">PDF files only, up to 10MB</p>
                        </div>
                      </div>
                      {ownedForm.formState.errors.certificateFormat && (
                        <p className="text-red-600 text-xs mt-1">Certificate format is required</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Upload Signature (PDF) *
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="signature-upload"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                            >
                              <span>Upload signature PDF</span>
                              <input
                                id="signature-upload"
                                type="file"
                                className="sr-only"
                                accept=".pdf"
                                {...ownedForm.register('signature')}
                              />
                            </label>
                          </div>
                          <p className="text-xs text-gray-500">PDF files only, up to 5MB</p>
                        </div>
                      </div>
                      {ownedForm.formState.errors.signature && (
                        <p className="text-red-600 text-xs mt-1">Signature is required</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      {...ownedForm.register('isActive')}
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
                        setEditingCertificate(null)
                        resetForms()
                      }}
                      className="btn btn-secondary btn-md"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary btn-md">
                      {editingCertificate ? 'Update Certificate' : 'Create Certificate'}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={customForm.handleSubmit(onSubmit as any)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Agent Type *
                      </label>
                      <select
                        {...customForm.register('agentTypeId')}
                        className="input"
                      >
                        <option value="">Select Agent Type</option>
                        {AGENT_TYPES.map((agentType) => (
                          <option key={agentType.id} value={agentType.id}>
                            {agentType.name}
                          </option>
                        ))}
                      </select>
                      {customForm.formState.errors.agentTypeId && (
                        <p className="text-red-600 text-xs mt-1">{customForm.formState.errors.agentTypeId.message as string}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Policy Types * (Multiple Selection)
                      </label>
                      <select
                        multiple
                        {...customForm.register('policyTypeIds')}
                        className="input h-32"
                      >
                        {POLICY_TYPES.map((policyType) => (
                          <option key={policyType.id} value={policyType.id}>
                            {policyType.name}
                          </option>
                        ))}
                      </select>
                      {customForm.formState.errors.policyTypeIds && (
                        <p className="text-red-600 text-xs mt-1">{customForm.formState.errors.policyTypeIds.message as string}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Exam *
                      </label>
                      <select
                        {...customForm.register('examId')}
                        className="input"
                        disabled={availableExams.length === 0}
                      >
                        <option value="">Select Exam</option>
                        {availableExams.map((exam) => (
                          <option key={exam.id} value={exam.id}>
                            {exam.name}
                          </option>
                        ))}
                      </select>
                      {customForm.formState.errors.examId && (
                        <p className="text-red-600 text-xs mt-1">{customForm.formState.errors.examId.message as string}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Validity From *
                      </label>
                      <input
                        type="date"
                        {...customForm.register('validityFrom')}
                        className="input"
                      />
                      {customForm.formState.errors.validityFrom && (
                        <p className="text-red-600 text-xs mt-1">{customForm.formState.errors.validityFrom.message as string}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Validity To *
                      </label>
                      <input
                        type="date"
                        {...customForm.register('validityTo')}
                        className="input"
                      />
                      {customForm.formState.errors.validityTo && (
                        <p className="text-red-600 text-xs mt-1">{customForm.formState.errors.validityTo.message as string}</p>
                      )}
                    </div>
                  </div>

                  {/* Header Section */}
                  <div className="border-t pt-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Header Design</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Company Name *
                        </label>
                        <input
                          type="text"
                          {...customForm.register('companyName')}
                          className="input"
                          placeholder="Enter company name"
                        />
                        {customForm.formState.errors.companyName && (
                          <p className="text-red-600 text-xs mt-1">{customForm.formState.errors.companyName.message as string}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Certificate Name *
                        </label>
                        <input
                          type="text"
                          {...customForm.register('certificateName')}
                          className="input"
                          placeholder="Enter certificate name"
                        />
                        {customForm.formState.errors.certificateName && (
                          <p className="text-red-600 text-xs mt-1">{customForm.formState.errors.certificateName.message as string}</p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Upload Logo (PNG/JPG) *
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                          <div className="space-y-1 text-center">
                            <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-600">
                              <label
                                htmlFor="logo-upload"
                                className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                              >
                                <span>Upload logo</span>
                                <input
                                  id="logo-upload"
                                  type="file"
                                  className="sr-only"
                                  accept=".png,.jpg,.jpeg"
                                  {...customForm.register('logo')}
                                />
                              </label>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG files only, up to 5MB</p>
                          </div>
                        </div>
                        {customForm.formState.errors.logo && (
                          <p className="text-red-600 text-xs mt-1">{customForm.formState.errors.logo.message as string}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Body Section */}
                  <div className="border-t pt-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Body Content</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Content Text *
                        </label>
                        <textarea
                          {...customForm.register('contentText')}
                          className="input h-32"
                          placeholder="Enter the certificate content text. Use [Field Name] for dynamic fields like [Agent Name], [Score], [Date], etc."
                        />
                        {customForm.formState.errors.contentText && (
                          <p className="text-red-600 text-xs mt-1">{customForm.formState.errors.contentText.message as string}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Available Dynamic Fields
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {DYNAMIC_FIELDS.map((field) => (
                            <label key={field} className="flex items-center">
                              <input
                                type="checkbox"
                                value={field}
                                {...customForm.register('dynamicFields')}
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                              />
                              <span className="ml-2 text-sm text-gray-700">{field}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Section */}
                  <div className="border-t pt-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Footer Signatures</h4>
                    <div className="space-y-4">
                      {signatureFields.map((field, index) => (
                        <div key={field.id} className="flex gap-4 items-end">
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Signature Name *
                            </label>
                            <input
                              type="text"
                              {...customForm.register(`signatures.${index}.name`)}
                              className="input"
                              placeholder="Enter signature name"
                            />
                            {customForm.formState.errors.signatures?.[index]?.name && (
                              <p className="text-red-600 text-xs mt-1">{customForm.formState.errors.signatures[index]?.name?.message as string}</p>
                            )}
                          </div>
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Signature File *
                            </label>
                            <input
                              type="file"
                              {...customForm.register(`signatures.${index}.file`)}
                              className="input"
                              accept=".png,.jpg,.jpeg,.pdf"
                            />
                            {customForm.formState.errors.signatures?.[index]?.file && (
                              <p className="text-red-600 text-xs mt-1">{customForm.formState.errors.signatures[index]?.file?.message as string}</p>
                            )}
                          </div>
                          {signatureFields.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeSignature(index)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => appendSignature({ name: '', file: null })}
                        className="btn btn-secondary btn-sm"
                      >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Add Signature
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      {...customForm.register('isActive')}
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
                        setEditingCertificate(null)
                        resetForms()
                      }}
                      className="btn btn-secondary btn-md"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary btn-md">
                      {editingCertificate ? 'Update Certificate' : 'Create Certificate'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}