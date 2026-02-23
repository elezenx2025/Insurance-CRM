'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  AcademicCapIcon,
  ClockIcon,
  DocumentTextIcon,
  PlayIcon,
  CheckCircleIcon,
  XCircleIcon,
  XMarkIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface TrainingModule {
  id: string
  name: string
  agentType: string
  policyTypes: string[]
  topics: Array<{
    id: string
    name: string
    duration: number
    documentPath: string
    isCompleted: boolean
    isUnlocked: boolean
  }>
  totalDuration: number
  isCompleted: boolean
  progress: number
}

interface UserProgress {
  moduleId: string
  completedTopics: string[]
  currentTopic: string
  startTime?: Date
}

export default function OnlineTraining() {
  const router = useRouter()
  const [trainingModules, setTrainingModules] = useState<TrainingModule[]>([])
  const [loading, setLoading] = useState(true)
  const [currentModule, setCurrentModule] = useState<TrainingModule | null>(null)
  const [currentTopic, setCurrentTopic] = useState<any>(null)
  const [userProgress, setUserProgress] = useState<UserProgress[]>([])
  const [showDocument, setShowDocument] = useState(false)

  useEffect(() => {
    fetchTrainingModules()
    fetchUserProgress()
  }, [])

  const fetchTrainingModules = async () => {
    try {
      setLoading(true)
      // Mock data - replace with actual API call
      const mockModules: TrainingModule[] = [
        {
          id: '1',
          name: 'Life Insurance Fundamentals',
          agentType: 'Life Insurance Agent',
          policyTypes: ['Life Insurance', 'Term Life Insurance', 'Whole Life Insurance'],
          topics: [
            {
              id: '1',
              name: 'Introduction to Life Insurance',
              duration: 2.0,
              documentPath: '/documents/life-insurance-intro.pdf',
              isCompleted: false,
              isUnlocked: true,
            },
            {
              id: '2',
              name: 'Types of Life Insurance Policies',
              duration: 3.0,
              documentPath: '/documents/life-insurance-types.pdf',
              isCompleted: false,
              isUnlocked: false,
            },
            {
              id: '3',
              name: 'Premium Calculation',
              duration: 2.5,
              documentPath: '/documents/premium-calculation.pdf',
              isCompleted: false,
              isUnlocked: false,
            },
            {
              id: '4',
              name: 'Claims Process',
              duration: 1.5,
              documentPath: '/documents/claims-process.pdf',
              isCompleted: false,
              isUnlocked: false,
            },
          ],
          totalDuration: 9.0,
          isCompleted: false,
          progress: 0,
        },
        {
          id: '2',
          name: 'General Insurance Basics',
          agentType: 'General Insurance Agent',
          policyTypes: ['Motor Insurance', 'Home Insurance', 'Fire Insurance'],
          topics: [
            {
              id: '5',
              name: 'Overview of General Insurance',
              duration: 1.5,
              documentPath: '/documents/general-insurance-overview.pdf',
              isCompleted: true,
              isUnlocked: true,
            },
            {
              id: '6',
              name: 'Motor Insurance Products',
              duration: 2.0,
              documentPath: '/documents/motor-insurance-guide.pdf',
              isCompleted: true,
              isUnlocked: true,
            },
            {
              id: '7',
              name: 'Property Insurance',
              duration: 2.0,
              documentPath: '/documents/property-insurance.pdf',
              isCompleted: false,
              isUnlocked: true,
            },
            {
              id: '8',
              name: 'Risk Assessment',
              duration: 1.5,
              documentPath: '/documents/risk-assessment.pdf',
              isCompleted: false,
              isUnlocked: false,
            },
          ],
          totalDuration: 7.0,
          isCompleted: false,
          progress: 50,
        },
      ]

      setTrainingModules(mockModules)
    } catch (error) {
      console.error('Error fetching training modules:', error)
      toast.error('Failed to fetch training modules')
    } finally {
      setLoading(false)
    }
  }

  const fetchUserProgress = async () => {
    try {
      // Mock user progress - replace with actual API call
      const mockProgress: UserProgress[] = [
        {
          moduleId: '1',
          completedTopics: [],
          currentTopic: '1',
        },
        {
          moduleId: '2',
          completedTopics: ['5', '6'],
          currentTopic: '7',
        },
      ]
      setUserProgress(mockProgress)
    } catch (error) {
      console.error('Error fetching user progress:', error)
    }
  }

  const startTopic = (module: TrainingModule, topic: any) => {
    if (!topic.isUnlocked) {
      toast.error('Complete previous topics to unlock this topic')
      return
    }

    setCurrentModule(module)
    setCurrentTopic(topic)
    setShowDocument(true)
    
    // Start timer for topic duration
    const startTime = new Date()
    const progress = userProgress.find(p => p.moduleId === module.id)
    if (progress) {
      progress.startTime = startTime
      setUserProgress([...userProgress])
    }

    toast.success(`Started: ${topic.name}`)
  }

  const completeTopic = (moduleId: string, topicId: string) => {
    const progress = userProgress.find(p => p.moduleId === moduleId)
    if (progress && !progress.completedTopics.includes(topicId)) {
      progress.completedTopics.push(topicId)
      setUserProgress([...userProgress])

      // Update module progress
      const moduleToUpdate = trainingModules.find(m => m.id === moduleId)
      if (moduleToUpdate) {
        const completedCount = progress.completedTopics.length
        const totalCount = moduleToUpdate.topics.length
        moduleToUpdate.progress = Math.round((completedCount / totalCount) * 100)
        
        // Check if module is completed
        if (completedCount === totalCount) {
          moduleToUpdate.isCompleted = true
          toast.success('Congratulations! Module completed successfully!')
        } else {
          // Unlock next topic
          const nextTopicIndex = moduleToUpdate.topics.findIndex(t => t.id === topicId) + 1
          if (nextTopicIndex < moduleToUpdate.topics.length) {
            moduleToUpdate.topics[nextTopicIndex].isUnlocked = true
          }
        }
        
        setTrainingModules([...trainingModules])
      }

      setShowDocument(false)
      setCurrentModule(null)
      setCurrentTopic(null)
      toast.success('Topic completed successfully!')
    }
  }

  const formatDuration = (hours: number) => {
    const wholeHours = Math.floor(hours)
    const minutes = Math.round((hours - wholeHours) * 60)
    if (wholeHours > 0) {
      return `${wholeHours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const getProgressColor = (progress: number) => {
    if (progress === 100) return 'bg-green-500'
    if (progress >= 50) return 'bg-yellow-500'
    return 'bg-blue-500'
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
                <button onClick={() => router.push('/dashboard/lms')} className="ml-4 text-gray-400 hover:text-gray-500">
                  LMS Training
                </button>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="text-gray-400">/</span>
                <span className="ml-4 text-gray-900 font-medium">Online Training</span>
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
                <button onClick={() => router.push('/dashboard/lms')} className="ml-4 text-gray-400 hover:text-gray-500">
                  LMS Training
                </button>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="text-gray-400">/</span>
                <span className="ml-4 text-gray-900 font-medium">Online Training</span>
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
            <h1 className="text-2xl font-bold text-gray-900">Online Training</h1>
            <p className="mt-1 text-sm text-gray-600">
              Complete your training modules to unlock online exams.
            </p>
          </div>
        </div>
      </div>

      {/* Training Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {trainingModules.map((module) => (
          <div key={module.id} className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{module.name}</h3>
                  <p className="text-sm text-gray-500">{module.agentType}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {module.isCompleted ? (
                    <CheckCircleIcon className="h-6 w-6 text-green-500" />
                  ) : (
                    <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{module.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(module.progress)}`}
                    style={{ width: `${module.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  <span>Total Duration: {formatDuration(module.totalDuration)}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {module.policyTypes.map((type, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-900">Topics:</h4>
                {module.topics.map((topic, index) => (
                  <div
                    key={topic.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      topic.isCompleted
                        ? 'bg-green-50 border-green-200'
                        : topic.isUnlocked
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-3">
                        {topic.isCompleted ? (
                          <CheckCircleIcon className="h-5 w-5 text-green-500" />
                        ) : topic.isUnlocked ? (
                          <div className="w-5 h-5 border-2 border-blue-500 rounded-full"></div>
                        ) : (
                          <XCircleIcon className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {index + 1}. {topic.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          Duration: {formatDuration(topic.duration)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {topic.isCompleted ? (
                        <span className="text-xs text-green-600 font-medium">Completed</span>
                      ) : topic.isUnlocked ? (
                        <button
                          onClick={() => startTopic(module, topic)}
                          className="btn btn-primary btn-sm"
                        >
                          <PlayIcon className="h-4 w-4 mr-1" />
                          Start
                        </button>
                      ) : (
                        <span className="text-xs text-gray-500">Locked</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Document Viewer Modal */}
      {showDocument && currentTopic && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-6xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {currentTopic.name}
                </h3>
                <button
                  onClick={() => setShowDocument(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-800">
                      <strong>Duration:</strong> {formatDuration(currentTopic.duration)}
                    </p>
                    <p className="text-sm text-blue-800">
                      <strong>Module:</strong> {currentModule?.name}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                    <span className="text-sm text-blue-800">PDF Document</span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <iframe
                  src={currentTopic.documentPath}
                  className="w-full h-96 border rounded-lg"
                  title={currentTopic.name}
                />
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Please read through the document and ensure you understand the content before marking as complete.
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowDocument(false)}
                    className="btn btn-secondary btn-md"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => completeTopic(currentModule!.id, currentTopic.id)}
                    className="btn btn-primary btn-md"
                  >
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    Mark as Complete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
