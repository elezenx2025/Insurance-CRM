'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  AcademicCapIcon,
  ClockIcon,
  ClipboardDocumentCheckIcon,
  PlayIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface OnlineExam {
  id: string
  name: string
  agentType: string
  policyTypes: string[]
  duration: number
  totalMarks: number
  minimumMarks: number
  minimumPercentage: number
  totalQuestions: number
  attemptsUsed: number
  maxAttempts: number
  isEligible: boolean
  isPassed: boolean
  requiredModules?: string[]
  modulesCompleted?: boolean
  lastAttemptDate?: string
  bestScore?: number
}

interface ExamQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  marks: number
}

interface ExamSession {
  examId: string
  startTime: Date
  endTime?: Date
  answers: Record<string, number>
  isCompleted: boolean
  score?: number
  percentage?: number
  isPassed?: boolean
}

export default function OnlineExam() {
  const router = useRouter()
  const [exams, setExams] = useState<OnlineExam[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchExams()
  }, [])

  const fetchExams = async () => {
    try {
      setLoading(true)
      // Mock data - replace with actual API call
      const mockExams: OnlineExam[] = [
        {
          id: '1',
          name: 'Life Insurance Fundamentals Exam',
          agentType: 'Life Insurance Agent',
          policyTypes: ['Life Insurance', 'Term Life Insurance', 'Whole Life Insurance'],
          duration: 90,
          totalMarks: 100,
          minimumMarks: 60,
          minimumPercentage: 60,
          totalQuestions: 50,
          attemptsUsed: 0,
          maxAttempts: 3,
          isEligible: true,
          isPassed: false,
          requiredModules: ['1'], // Life Insurance Training Module
          modulesCompleted: true, // All required modules completed
        },
        {
          id: '2',
          name: 'General Insurance Basics Exam',
          agentType: 'General Insurance Agent',
          policyTypes: ['Motor Insurance', 'Home Insurance', 'Fire Insurance'],
          duration: 75,
          totalMarks: 80,
          minimumMarks: 48,
          minimumPercentage: 60,
          totalQuestions: 40,
          attemptsUsed: 1,
          maxAttempts: 3,
          lastAttemptDate: '2024-01-15',
          bestScore: 45,
          isEligible: true,
          isPassed: false,
          requiredModules: ['2'], // General Insurance Training Module
          modulesCompleted: false, // Training modules not completed
        },
        {
          id: '3',
          name: 'Motor Insurance Specialization Exam',
          agentType: 'Motor Insurance Agent',
          policyTypes: ['Motor Insurance'],
          duration: 60,
          totalMarks: 100,
          minimumMarks: 60,
          minimumPercentage: 60,
          totalQuestions: 50,
          attemptsUsed: 2,
          maxAttempts: 3,
          lastAttemptDate: '2024-01-18',
          bestScore: 75,
          isEligible: true,
          isPassed: true,
        },
      ]

      setExams(mockExams)
    } catch (error) {
      console.error('Error fetching exams:', error)
      toast.error('Failed to fetch exams')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (exam: OnlineExam) => {
    if (exam.isPassed) return 'text-green-600'
    if (!exam.isEligible) return 'text-red-600'
    if (exam.attemptsUsed > 0) return 'text-yellow-600'
    return 'text-blue-600'
  }

  const getStatusText = (exam: OnlineExam) => {
    if (exam.isPassed) return 'Passed'
    if (!exam.isEligible) return 'Max Attempts Reached'
    if (exam.attemptsUsed > 0) return `${exam.attemptsUsed}/${exam.maxAttempts} Attempts Used`
    return 'Available'
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
                <button onClick={() => router.push('/dashboard/lms')} className="ml-4 text-gray-400 hover:text-gray-500">
                  LMS Training
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
            onClick={() => router.push('/dashboard/lms')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Online Exam</h1>
            <p className="mt-1 text-sm text-gray-600">
              Take online exams to test your knowledge and earn certificates.
            </p>
          </div>
        </div>
      </div>

      {/* Exams List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {exams.map((exam) => (
          <div key={exam.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{exam.name}</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <AcademicCapIcon className="h-4 w-4 mr-2" />
                    <span>{exam.agentType}</span>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    <span>{exam.duration} minutes</span>
                  </div>
                  <div className="flex items-center">
                    <ClipboardDocumentCheckIcon className="h-4 w-4 mr-2" />
                    <span>{exam.totalQuestions} questions</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-2">
                <strong>Policy Types:</strong> {exam.policyTypes.join(', ')}
              </div>
              <div className="text-sm text-gray-600 mb-2">
                <strong>Total Marks:</strong> {exam.totalMarks} | <strong>Minimum:</strong> {exam.minimumMarks} marks ({exam.minimumPercentage}%)
              </div>
            </div>

            {/* Module Completion Status */}
            {exam.requiredModules && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <ExclamationTriangleIcon className="h-4 w-4 mr-2 text-amber-500" />
                  <span className="text-sm font-medium text-gray-700">Training Requirements</span>
                </div>
                <p className="text-sm text-gray-600">
                  {exam.modulesCompleted 
                    ? 'All required training modules have been completed. You can take this exam.'
                    : 'Complete all required training modules before taking this exam.'
                  }
                </p>
              </div>
            )}

            <div className="mb-4">
              <div className={`text-sm font-medium ${getStatusColor(exam)}`}>
                Status: {getStatusText(exam)}
              </div>
              {exam.bestScore && (
                <div className="text-sm text-gray-600">
                  Best Score: {exam.bestScore}/{exam.totalMarks} marks
                </div>
              )}
              {exam.lastAttemptDate && (
                <div className="text-sm text-gray-600">
                  Last Attempt: {exam.lastAttemptDate}
                </div>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  if (!exam.modulesCompleted) {
                    toast.error('Please complete all required training modules first.')
                    return
                  }
                  if (!exam.isEligible) {
                    toast.error('You have exhausted all attempts. Please complete training again.')
                    return
                  }
                  toast('Exam functionality will be implemented in the next phase.', { icon: 'ℹ️' })
                }}
                disabled={!exam.isEligible || !exam.modulesCompleted}
                className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium ${
                  exam.isEligible && exam.modulesCompleted
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <PlayIcon className="h-4 w-4 mr-2" />
                {exam.isPassed ? 'Retake Exam' : 'Start Exam'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {exams.length === 0 && (
        <div className="text-center py-12">
          <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No exams available</h3>
          <p className="mt-1 text-sm text-gray-500">
            There are no exams available for your agent type at the moment.
          </p>
        </div>
      )}
    </div>
  )
}