'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function LMSMastersPage() {
  const router = useRouter()

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
                <button onClick={() => router.push('/dashboard/master-data')} className="ml-4 text-gray-400 hover:text-gray-500">
                  Master Data
                </button>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="text-gray-400">/</span>
                <span className="ml-4 text-gray-900 font-medium">LMS Masters</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      {/* Page header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/dashboard/master-data')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-blue-600">LMS Masters</h1>
            <p className="mt-1 text-sm text-gray-600">Welcome to LMS Masters. This is the main LMS Masters page.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button 
          onClick={() => router.push('/dashboard/lms-masters/training-modules')} 
          className="p-4 border rounded-lg hover:bg-gray-50 text-left"
        >
          <h3 className="font-semibold">Training Modules</h3>
          <p className="text-sm text-gray-600">Manage training modules</p>
        </button>
        <button 
          onClick={() => router.push('/dashboard/lms-masters/training-material')} 
          className="p-4 border rounded-lg hover:bg-gray-50 text-left"
        >
          <h3 className="font-semibold">Training Material</h3>
          <p className="text-sm text-gray-600">Manage training materials</p>
        </button>
        <button 
          onClick={() => router.push('/dashboard/lms-masters/online-exam')} 
          className="p-4 border rounded-lg hover:bg-gray-50 text-left"
        >
          <h3 className="font-semibold">Online Exam</h3>
          <p className="text-sm text-gray-600">Manage online exams</p>
        </button>
        <button 
          onClick={() => router.push('/dashboard/lms-masters/examination-certificate')} 
          className="p-4 border rounded-lg hover:bg-gray-50 text-left"
        >
          <h3 className="font-semibold">Examination Certificate</h3>
          <p className="text-sm text-gray-600">Manage certificates</p>
        </button>
      </div>
    </div>
  )
}
