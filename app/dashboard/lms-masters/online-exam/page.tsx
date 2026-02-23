'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  AcademicCapIcon,
  CloudArrowUpIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const onlineExamSchema = z.object({
  agentTypeId: z.string().min(1, 'Agent type is required'),
  agentTypeName: z.string().min(1, 'Agent type name is required'),
  policyTypeIds: z.array(z.string()).min(1, 'At least one policy type is required'),
  policyTypeNames: z.array(z.string()).min(1, 'At least one policy type is required'),
  examName: z.string().min(1, 'Exam name is required'),
  duration: z.number().min(1, 'Duration must be at least 1 minute'),
  validityFrom: z.string().min(1, 'Validity from date is required'),
  validityTo: z.string().min(1, 'Validity to date is required'),
  documentFile: z.any().refine((file) => file && file.length > 0, 'Exam document is required'),
  totalMarks: z.number().min(1, 'Total marks must be at least 1'),
  minimumMarks: z.number().min(1, 'Minimum marks must be at least 1'),
  minimumPercentage: z.number().min(1, 'Minimum percentage must be at least 1%').max(100, 'Minimum percentage cannot exceed 100%'),
  isActive: z.boolean().default(true),
})

type OnlineExamForm = z.infer<typeof onlineExamSchema>

interface OnlineExam {
  id: string
  agentTypeId: string
  agentTypeName: string
  policyTypeIds: string[]
  policyTypeNames: string[]
  examName: string
  duration: number
  validityFrom: string
  validityTo: string
  documentPath: string
  totalMarks: number
  minimumMarks: number
  minimumPercentage: number
  isActive: boolean
  createdAt: string
  updatedAt: string
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

export default function OnlineExam() {
  const router = useRouter()
  const [onlineExams, setOnlineExams] = useState<OnlineExam[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingExam, setEditingExam] = useState<OnlineExam | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterAgentType, setFilterAgentType] = useState('ALL')
  const [filterStatus, setFilterStatus] = useState('ALL')

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(onlineExamSchema),
    defaultValues: {
      agentTypeId: '',
      agentTypeName: '',
      policyTypeIds: [],
      policyTypeNames: [],
      examName: '',
      duration: 60,
      validityFrom: '',
      validityTo: '',
      totalMarks: 100,
      minimumMarks: 50,
      minimumPercentage: 50,
      isActive: true,
    },
  })

  const selectedAgentTypeId = watch('agentTypeId')
  const selectedPolicyTypeIds = watch('policyTypeIds')
  const totalMarks = watch('totalMarks')

  useEffect(() => {
    fetchOnlineExams()
  }, [])

  useEffect(() => {
    if (selectedAgentTypeId) {
      const selectedAgentType = AGENT_TYPES.find(at => at.id === selectedAgentTypeId)
      if (selectedAgentType) {
        setValue('agentTypeName', selectedAgentType.name)
      }
    }
  }, [selectedAgentTypeId, setValue])

  useEffect(() => {
    if (selectedPolicyTypeIds.length > 0) {
      const selectedPolicyTypes = POLICY_TYPES.filter(pt => selectedPolicyTypeIds.includes(pt.id))
      setValue('policyTypeNames', selectedPolicyTypes.map(pt => pt.name))
    } else {
      setValue('policyTypeNames', [])
    }
  }, [selectedPolicyTypeIds, setValue])

  useEffect(() => {
    // Auto-calculate minimum marks based on percentage
    const minimumPercentage = watch('minimumPercentage')
    if (totalMarks && minimumPercentage) {
      const calculatedMarks = Math.round((totalMarks * minimumPercentage) / 100)
      setValue('minimumMarks', calculatedMarks)
    }
  }, [totalMarks, watch, setValue])

  const fetchOnlineExams = async () => {
    try {
      setLoading(true)
      // Mock data - replace with actual API call
      const mockExams: OnlineExam[] = [
        {
          id: '1',
          agentTypeId: '1',
          agentTypeName: 'Life Insurance Agent',
          policyTypeIds: ['1', '2', '3'],
          policyTypeNames: ['Life Insurance', 'Term Life Insurance', 'Whole Life Insurance'],
          examName: 'Life Insurance Fundamentals Exam',
          duration: 90,
          validityFrom: '2024-01-01',
          validityTo: '2024-12-31',
          documentPath: '/documents/life-insurance-exam.pdf',
          totalMarks: 100,
          minimumMarks: 60,
          minimumPercentage: 60,
          isActive: true,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
        {
          id: '2',
          agentTypeId: '2',
          agentTypeName: 'General Insurance Agent',
          policyTypeIds: ['5', '8', '9'],
          policyTypeNames: ['Motor Insurance', 'Home Insurance', 'Fire Insurance'],
          examName: 'General Insurance Basics Exam',
          duration: 75,
          validityFrom: '2024-01-01',
          validityTo: '2024-12-31',
          documentPath: '/documents/general-insurance-exam.pdf',
          totalMarks: 80,
          minimumMarks: 48,
          minimumPercentage: 60,
          isActive: true,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
        {
          id: '3',
          agentTypeId: '3',
          agentTypeName: 'Health Insurance Agent',
          policyTypeIds: ['6', '7'],
          policyTypeNames: ['Health Insurance', 'Travel Insurance'],
          examName: 'Health Insurance Specialization Exam',
          duration: 120,
          validityFrom: '2024-01-01',
          validityTo: '2024-12-31',
          documentPath: '/documents/health-insurance-exam.pdf',
          totalMarks: 120,
          minimumMarks: 72,
          minimumPercentage: 60,
          isActive: true,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
      ]

      // Apply filters
      let filteredExams = mockExams
      if (searchTerm) {
        filteredExams = filteredExams.filter(
          (exam) =>
            exam.examName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            exam.agentTypeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            exam.policyTypeNames.some(name => name.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      }
      if (filterAgentType !== 'ALL') {
        filteredExams = filteredExams.filter((exam) => exam.agentTypeId === filterAgentType)
      }
      if (filterStatus !== 'ALL') {
        filteredExams = filteredExams.filter((exam) => 
          filterStatus === 'ACTIVE' ? exam.isActive : !exam.isActive
        )
      }

      setOnlineExams(filteredExams)
    } catch (error) {
      console.error('Error fetching online exams:', error)
      toast.error('Failed to fetch online exams')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: OnlineExamForm) => {
    try {
      if (editingExam) {
        const updatedExam = { 
          ...editingExam, 
          ...data,
          documentPath: data.documentFile ? URL.createObjectURL(data.documentFile[0]) : editingExam.documentPath,
          updatedAt: new Date().toISOString() 
        }
        setOnlineExams(onlineExams.map((oe) => (oe.id === updatedExam.id ? updatedExam : oe)))
        toast.success('Online exam updated successfully!')
      } else {
        const newExam: OnlineExam = {
          id: String(onlineExams.length + 1),
          ...data,
          documentPath: data.documentFile ? URL.createObjectURL(data.documentFile[0]) : '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        setOnlineExams([...onlineExams, newExam])
        toast.success('Online exam created successfully!')
      }

      setShowModal(false)
      reset()
      setEditingExam(null)
    } catch (error) {
      console.error('Error saving online exam:', error)
      toast.error('Failed to save online exam')
    }
  }

  const openAddModal = () => {
    setEditingExam(null)
    reset({
      agentTypeId: '',
      agentTypeName: '',
      policyTypeIds: [],
      policyTypeNames: [],
      examName: '',
      duration: 60,
      validityFrom: '',
      validityTo: '',
      totalMarks: 100,
      minimumMarks: 50,
      minimumPercentage: 50,
      isActive: true,
    })
    setShowModal(true)
  }

  const openEditModal = (exam: OnlineExam) => {
    setEditingExam(exam)
    setValue('agentTypeId', exam.agentTypeId)
    setValue('agentTypeName', exam.agentTypeName)
    setValue('policyTypeIds', exam.policyTypeIds)
    setValue('policyTypeNames', exam.policyTypeNames)
    setValue('examName', exam.examName)
    setValue('duration', exam.duration)
    setValue('validityFrom', exam.validityFrom)
    setValue('validityTo', exam.validityTo)
    setValue('totalMarks', exam.totalMarks)
    setValue('minimumMarks', exam.minimumMarks)
    setValue('minimumPercentage', exam.minimumPercentage)
    setValue('isActive', exam.isActive)
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this online exam?')) {
      try {
        setOnlineExams(onlineExams.filter((oe) => oe.id !== id))
        toast.success('Online exam deleted successfully')
      } catch (error) {
        console.error('Error deleting online exam:', error)
        toast.error('Failed to delete online exam')
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

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
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
                <span className="ml-4 text-gray-900 font-medium">Online Exam</span>
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
                <span className="ml-4 text-gray-900 font-medium">Online Exam</span>
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
            <h1 className="text-2xl font-bold text-gray-900">Online Exam</h1>
            <p className="mt-1 text-sm text-gray-600">
              Create and manage online exams with question papers and marking schemes.
            </p>
          </div>
        </div>
        <button onClick={openAddModal} className="btn btn-primary btn-md">
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Online Exam
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
                placeholder="Search online exams..."
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

      {/* Online Exams Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-head">Exam Name</th>
                <th className="table-head">Agent Type</th>
                <th className="table-head">Policy Types</th>
                <th className="table-head">Duration</th>
                <th className="table-head">Total Marks</th>
                <th className="table-head">Passing Criteria</th>
                <th className="table-head">Validity</th>
                <th className="table-head">Status</th>
                <th className="table-head">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {onlineExams.length === 0 ? (
                <tr>
                  <td colSpan={9} className="table-cell text-center py-8 text-gray-500">
                    No online exams found
                  </td>
                </tr>
              ) : (
                onlineExams.map((exam) => (
                  <tr key={exam.id} className="table-row">
                    <td className="table-cell">
                      <div className="font-medium">{exam.examName}</div>
                    </td>
                    <td className="table-cell">
                      <span className="text-sm">{exam.agentTypeName}</span>
                    </td>
                    <td className="table-cell">
                      <div className="flex flex-wrap gap-1">
                        {exam.policyTypeNames.map((name, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                            {name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm font-medium">
                        {formatDuration(exam.duration)}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm font-medium">
                        {exam.totalMarks}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="text-sm">
                        <div>{exam.minimumMarks} marks</div>
                        <div className="text-gray-500">({exam.minimumPercentage}%)</div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="text-sm">
                        <div>{formatDate(exam.validityFrom)}</div>
                        <div className="text-gray-500">to {formatDate(exam.validityTo)}</div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        exam.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {exam.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => window.open(exam.documentPath, '_blank')}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Exam Paper"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(exam)}
                          className="text-green-600 hover:text-green-900"
                          title="Edit"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(exam.id)}
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

      {/* Online Exam Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-5 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingExam ? 'Edit Online Exam' : 'Add Online Exam'}
              </h3>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Agent Type *
                    </label>
                    <select
                      {...register('agentTypeId')}
                      className="input"
                    >
                      <option value="">Select Agent Type</option>
                      {AGENT_TYPES.map((agentType) => (
                        <option key={agentType.id} value={agentType.id}>
                          {agentType.name}
                        </option>
                      ))}
                    </select>
                    {errors.agentTypeId && (
                      <p className="text-red-600 text-xs mt-1">{errors.agentTypeId.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Policy Types * (Multiple Selection)
                    </label>
                    <select
                      multiple
                      {...register('policyTypeIds')}
                      className="input h-32"
                    >
                      {POLICY_TYPES.map((policyType) => (
                        <option key={policyType.id} value={policyType.id}>
                          {policyType.name}
                        </option>
                      ))}
                    </select>
                    {errors.policyTypeIds && (
                      <p className="text-red-600 text-xs mt-1">{errors.policyTypeIds.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Exam Name *
                    </label>
                    <input
                      type="text"
                      {...register('examName')}
                      className="input"
                      placeholder="Enter exam name"
                    />
                    {errors.examName && (
                      <p className="text-red-600 text-xs mt-1">{errors.examName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration (Minutes) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      {...register('duration', { valueAsNumber: true })}
                      className="input"
                      placeholder="e.g., 90"
                    />
                    {errors.duration && (
                      <p className="text-red-600 text-xs mt-1">{errors.duration.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Marks *
                    </label>
                    <input
                      type="number"
                      min="1"
                      {...register('totalMarks', { valueAsNumber: true })}
                      className="input"
                      placeholder="e.g., 100"
                    />
                    {errors.totalMarks && (
                      <p className="text-red-600 text-xs mt-1">{errors.totalMarks.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Percentage (%) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      {...register('minimumPercentage', { valueAsNumber: true })}
                      className="input"
                      placeholder="e.g., 60"
                    />
                    {errors.minimumPercentage && (
                      <p className="text-red-600 text-xs mt-1">{errors.minimumPercentage.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Marks (Auto-calculated)
                    </label>
                    <input
                      type="number"
                      {...register('minimumMarks', { valueAsNumber: true })}
                      className="input bg-gray-100"
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Validity From *
                    </label>
                    <input
                      type="date"
                      {...register('validityFrom')}
                      className="input"
                    />
                    {errors.validityFrom && (
                      <p className="text-red-600 text-xs mt-1">{errors.validityFrom.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Validity To *
                    </label>
                    <input
                      type="date"
                      {...register('validityTo')}
                      className="input"
                    />
                    {errors.validityTo && (
                      <p className="text-red-600 text-xs mt-1">{errors.validityTo.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Upload Exam Document (PDF) *
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="exam-document-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                          >
                            <span>Upload exam PDF</span>
                            <input
                              id="exam-document-upload"
                              type="file"
                              className="sr-only"
                              accept=".pdf"
                              {...register('documentFile')}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PDF files only, up to 10MB</p>
                      </div>
                    </div>
                    {errors.documentFile && (
                      <p className="text-red-600 text-xs mt-1">{(errors.documentFile as any)?.message}</p>
                    )}
                  </div>
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
                      setEditingExam(null)
                      reset()
                    }}
                    className="btn btn-secondary btn-md"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-md">
                    {editingExam ? 'Update Exam' : 'Create Exam'}
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


