'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import {
  AcademicCapIcon,
  ClipboardDocumentCheckIcon,
  DocumentDuplicateIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  PencilIcon,
  UserIcon,
  CalendarIcon,
  CheckCircleIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface PendingLMSActivity {
  id: string
  activityNumber: string
  userName: string
  userRole: string
  activityType: 'TRAINING_INPROGRESS' | 'EXAM_PENDING' | 'EXAM_FAILED' | 'CERTIFICATE_PENDING' | 'TRAINING_NOT_STARTED'
  moduleName: string
  submittedDate?: string
  dueDate: string
  currentStage: string
  stageNumber: number
  totalStages: number
  pendingReason: string
  daysUntilDue: number
  progress: number
  assignedTo: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
}

export default function LMSTrainingPage() {
  const router = useRouter()

  const [pendingActivities] = useState<PendingLMSActivity[]>([
    {
      id: '1',
      activityNumber: 'TRN/2025/234',
      userName: 'Rajesh Kumar',
      userRole: 'Insurance Agent',
      activityType: 'TRAINING_INPROGRESS',
      moduleName: 'Motor Insurance - Advanced Coverage',
      submittedDate: '2025-10-05',
      dueDate: '2025-10-18',
      currentStage: 'Module 3 of 5',
      stageNumber: 3,
      totalStages: 5,
      pendingReason: 'Training in progress - completed 60% of Motor Insurance Advanced module',
      daysUntilDue: 5,
      progress: 60,
      assignedTo: 'Training Coordinator - Ms. Sunita Rao',
      priority: 'MEDIUM'
    },
    {
      id: '2',
      activityNumber: 'EXM/2025/156',
      userName: 'Priya Sharma',
      userRole: 'Policy Advisor',
      activityType: 'EXAM_PENDING',
      moduleName: 'Health Insurance Fundamentals',
      submittedDate: '2025-10-08',
      dueDate: '2025-10-15',
      currentStage: 'Exam Scheduled',
      stageNumber: 4,
      totalStages: 5,
      pendingReason: 'Training completed - online exam scheduled for Oct 15, 2025 at 10:00 AM',
      daysUntilDue: 2,
      progress: 80,
      assignedTo: 'Exam Coordinator - Mr. Anil Deshmukh',
      priority: 'HIGH'
    },
    {
      id: '3',
      activityNumber: 'EXM/2025/145',
      userName: 'Vikram Patel',
      userRole: 'Claims Officer',
      activityType: 'EXAM_FAILED',
      moduleName: 'Claims Processing - Best Practices',
      submittedDate: '2025-10-07',
      dueDate: '2025-10-22',
      currentStage: 'Re-examination Required',
      stageNumber: 4,
      totalStages: 5,
      pendingReason: 'Failed exam with 45% (passing: 60%) - re-examination scheduled after 15 days cooling period',
      daysUntilDue: 9,
      progress: 45,
      assignedTo: 'Training Manager - Ms. Meera Iyer',
      priority: 'CRITICAL'
    },
    {
      id: '4',
      activityNumber: 'CERT/2025/089',
      userName: 'Anjali Reddy',
      userRole: 'Underwriter',
      activityType: 'CERTIFICATE_PENDING',
      moduleName: 'Life Insurance Underwriting',
      submittedDate: '2025-10-09',
      dueDate: '2025-10-14',
      currentStage: 'Certificate Generation',
      stageNumber: 5,
      totalStages: 5,
      pendingReason: 'Exam passed with 85% - awaiting certificate approval and digital signature',
      daysUntilDue: 1,
      progress: 100,
      assignedTo: 'Certification Admin - Mr. Rohit Joshi',
      priority: 'HIGH'
    },
    {
      id: '5',
      activityNumber: 'TRN/2025/235',
      userName: 'Deepak Singh',
      userRole: 'Sales Manager',
      activityType: 'TRAINING_NOT_STARTED',
      moduleName: 'Sales Compliance & Ethics',
      dueDate: '2025-10-20',
      currentStage: 'Not Started',
      stageNumber: 0,
      totalStages: 5,
      pendingReason: 'Mandatory training not yet started - enrollment reminder sent on Oct 10',
      daysUntilDue: 7,
      progress: 0,
      assignedTo: 'HR Training - Ms. Kavita Menon',
      priority: 'HIGH'
    },
  ])

  const lmsTrainingModules = [
    {
      name: 'Online Training',
      href: '/dashboard/lms/online-training',
      icon: AcademicCapIcon,
      description: 'Complete training modules to unlock online exams'
    },
    {
      name: 'Online Exam',
      href: '/dashboard/lms/online-exam',
      icon: ClipboardDocumentCheckIcon,
      description: 'Take online exams to validate your training knowledge'
    },
    {
      name: "Users' Issued Certificate",
      href: '/dashboard/lms/issued-certificates',
      icon: DocumentDuplicateIcon,
      description: 'View and manage certificates issued to agents'
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'LOW':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case 'TRAINING_INPROGRESS':
        return 'bg-blue-100 text-blue-800'
      case 'EXAM_PENDING':
        return 'bg-purple-100 text-purple-800'
      case 'EXAM_FAILED':
        return 'bg-red-100 text-red-800'
      case 'CERTIFICATE_PENDING':
        return 'bg-green-100 text-green-800'
      case 'TRAINING_NOT_STARTED':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStageProgress = (stageNumber: number, totalStages: number) => {
    if (stageNumber === 0) return 0
    return Math.round((stageNumber / totalStages) * 100)
  }

  const getDaysColor = (days: number) => {
    if (days <= 2) return 'text-red-600'
    if (days <= 7) return 'text-orange-600'
    return 'text-gray-600'
  }

  return (
    <div className="space-y-6">
      {/* Back to Dashboard Button */}
      <div>
        <button
          onClick={() => router.push('/dashboard')}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>
      </div>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">LMS Training Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Access your training modules, take exams, and manage certificates
        </p>
      </div>

      {/* Business Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">245</p>
              <div className="flex items-center mt-2">
                <CheckCircleIcon className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">185 active</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Training Modules</p>
              <p className="text-2xl font-bold text-gray-900">18</p>
              <div className="flex items-center mt-2">
                <BookOpenIcon className="w-4 h-4 text-blue-500 mr-1" />
                <span className="text-sm text-blue-600">12 mandatory</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <AcademicCapIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Exams Conducted</p>
              <p className="text-2xl font-bold text-gray-900">156</p>
              <div className="flex items-center mt-2">
                <CheckCircleIcon className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">89% pass rate</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <ClipboardDocumentCheckIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Certificates Issued</p>
              <p className="text-2xl font-bold text-gray-900">142</p>
              <div className="flex items-center mt-2">
                <ClockIcon className="w-4 h-4 text-orange-500 mr-1" />
                <span className="text-sm text-orange-600">8 pending</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <DocumentDuplicateIcon className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Pending LMS Activities */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Pending Training & Exam Activities</h2>
            <p className="text-sm text-gray-600 mt-1">
              Track user training progress, exam schedules, and certificate generation
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <ClockIcon className="h-5 w-5" />
            <span className="font-semibold">{pendingActivities.length} activities pending</span>
          </div>
        </div>

        <div className="space-y-4">
          {pendingActivities.map((activity) => (
            <div key={activity.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
              {/* Header Row */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-base font-semibold text-gray-900">{activity.activityNumber}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(activity.priority)}`}>
                      {activity.priority}
                    </span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getActivityTypeColor(activity.activityType)}`}>
                      {activity.activityType.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">User:</span>
                      <span className="ml-2 font-medium text-gray-900">{activity.userName}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Role:</span>
                      <span className="ml-2 font-medium text-gray-900">{activity.userRole}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Module:</span>
                      <span className="ml-2 font-medium text-gray-900">{activity.moduleName}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Due Date:</span>
                      <span className={`ml-2 font-medium ${activity.daysUntilDue <= 2 ? 'text-red-600' : 'text-gray-900'}`}>
                        {activity.dueDate}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">Progress:</span>
                    <span className="text-sm font-semibold text-blue-600">{activity.currentStage}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{activity.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      activity.activityType === 'EXAM_FAILED' ? 'bg-red-600' : 
                      activity.progress === 100 ? 'bg-green-600' : 'bg-blue-600'
                    }`}
                    style={{ width: `${activity.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Status Info */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                <div className="flex items-start space-x-2">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-yellow-900">Status:</p>
                    <p className="text-sm text-yellow-800 mt-1">{activity.pendingReason}</p>
                  </div>
                </div>
              </div>

              {/* Footer Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <UserIcon className="h-4 w-4" />
                    <span>{activity.assignedTo}</span>
                  </div>
                  <div className={`flex items-center space-x-1 font-medium ${getDaysColor(activity.daysUntilDue)}`}>
                    <ClockIcon className="h-4 w-4" />
                    <span>{activity.daysUntilDue} days until due</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toast.success(`Viewing details for ${activity.activityNumber}`)}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <EyeIcon className="h-4 w-4 mr-1" />
                    View Details
                  </button>
                  <button
                    onClick={() => toast.success(`Managing ${activity.activityNumber}`)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    <PencilIcon className="h-4 w-4 mr-1" />
                    Manage
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LMS Training Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {lmsTrainingModules.map((module) => {
          const IconComponent = module.icon
          return (
            <button
              key={module.name}
              onClick={() => router.push(module.href)}
              className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors text-left group bg-white shadow-sm"
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

      {/* Training Process Overview */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">LMS Training Process</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mb-2">
              1
            </div>
            <h4 className="text-sm font-medium text-gray-900">Enrollment</h4>
            <p className="text-xs text-gray-600 mt-1">Register for training</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mb-2">
              2
            </div>
            <h4 className="text-sm font-medium text-gray-900">Training</h4>
            <p className="text-xs text-gray-600 mt-1">Complete modules</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mb-2">
              3
            </div>
            <h4 className="text-sm font-medium text-gray-900">Examination</h4>
            <p className="text-xs text-gray-600 mt-1">Take online exam</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mb-2">
              4
            </div>
            <h4 className="text-sm font-medium text-gray-900">Evaluation</h4>
            <p className="text-xs text-gray-600 mt-1">Result processing</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mb-2">
              5
            </div>
            <h4 className="text-sm font-medium text-gray-900">Certification</h4>
            <p className="text-xs text-gray-600 mt-1">Certificate issued</p>
          </div>
        </div>
      </div>
    </div>
  )
}
