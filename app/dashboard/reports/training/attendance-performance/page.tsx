'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeftIcon,
  AcademicCapIcon,
  ChartBarIcon,
  DocumentArrowDownIcon,
  UserGroupIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  StarIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline'
import { Bar, Line, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
)

interface TrainingData {
  id: string
  agentName: string
  trainingModule: string
  attendanceDate: string
  attendanceStatus: 'present' | 'absent' | 'late'
  score: number
  maxScore: number
  region: string
  trainer: string
  completionTime: number // in minutes
  certificationStatus: 'pending' | 'completed' | 'failed'
}

export default function TrainingAttendanceReport() {
  const router = useRouter()
  const [trainingData, setTrainingData] = useState<TrainingData[]>([])
  const [filteredData, setFilteredData] = useState<TrainingData[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedAgent, setSelectedAgent] = useState('all')
  const [selectedModule, setSelectedModule] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  })

  // Mock data
  useEffect(() => {
    const mockData: TrainingData[] = [
      {
        id: '1',
        agentName: 'Rajesh Kumar',
        trainingModule: 'Life Insurance Fundamentals',
        attendanceDate: '2024-01-15',
        attendanceStatus: 'present',
        score: 85,
        maxScore: 100,
        region: 'Mumbai',
        trainer: 'Dr. Priya Sharma',
        completionTime: 120,
        certificationStatus: 'completed'
      },
      {
        id: '2',
        agentName: 'Priya Sharma',
        trainingModule: 'Health Insurance Products',
        attendanceDate: '2024-01-14',
        attendanceStatus: 'present',
        score: 92,
        maxScore: 100,
        region: 'Bangalore',
        trainer: 'Prof. Amit Patel',
        completionTime: 90,
        certificationStatus: 'completed'
      },
      {
        id: '3',
        agentName: 'Amit Patel',
        trainingModule: 'Motor Insurance Regulations',
        attendanceDate: '2024-01-13',
        attendanceStatus: 'late',
        score: 78,
        maxScore: 100,
        region: 'Delhi',
        trainer: 'Ms. Sneha Gupta',
        completionTime: 150,
        certificationStatus: 'completed'
      },
      {
        id: '4',
        agentName: 'Sneha Gupta',
        trainingModule: 'Customer Service Excellence',
        attendanceDate: '2024-01-12',
        attendanceStatus: 'present',
        score: 88,
        maxScore: 100,
        region: 'Chennai',
        trainer: 'Dr. Vikram Singh',
        completionTime: 110,
        certificationStatus: 'completed'
      },
      {
        id: '5',
        agentName: 'Vikram Singh',
        trainingModule: 'Sales Techniques',
        attendanceDate: '2024-01-11',
        attendanceStatus: 'absent',
        score: 0,
        maxScore: 100,
        region: 'Pune',
        trainer: 'Mr. Rohit Verma',
        completionTime: 0,
        certificationStatus: 'pending'
      },
      {
        id: '6',
        agentName: 'Anita Desai',
        trainingModule: 'Digital Insurance Platforms',
        attendanceDate: '2024-01-10',
        attendanceStatus: 'present',
        score: 95,
        maxScore: 100,
        region: 'Hyderabad',
        trainer: 'Dr. Kavita Joshi',
        completionTime: 100,
        certificationStatus: 'completed'
      },
      {
        id: '7',
        agentName: 'Rohit Verma',
        trainingModule: 'Regulatory Compliance',
        attendanceDate: '2024-01-09',
        attendanceStatus: 'present',
        score: 90,
        maxScore: 100,
        region: 'Kolkata',
        trainer: 'Prof. Rajesh Kumar',
        completionTime: 130,
        certificationStatus: 'completed'
      },
      {
        id: '8',
        agentName: 'Kavita Joshi',
        trainingModule: 'Claims Processing',
        attendanceDate: '2024-01-08',
        attendanceStatus: 'present',
        score: 82,
        maxScore: 100,
        region: 'Ahmedabad',
        trainer: 'Ms. Priya Sharma',
        completionTime: 140,
        certificationStatus: 'completed'
      }
    ]
    setTrainingData(mockData)
    setFilteredData(mockData)
  }, [])

  // Filter data based on selected criteria
  useEffect(() => {
    let filtered = trainingData

    if (selectedAgent !== 'all') {
      filtered = filtered.filter(agent => agent.agentName === selectedAgent)
    }

    if (selectedModule !== 'all') {
      filtered = filtered.filter(agent => agent.trainingModule === selectedModule)
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(agent => agent.attendanceStatus === selectedStatus)
    }

    if (selectedRegion !== 'all') {
      filtered = filtered.filter(agent => agent.region === selectedRegion)
    }

    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(agent => {
        const agentDate = new Date(agent.attendanceDate)
        const startDate = new Date(dateRange.start)
        const endDate = new Date(dateRange.end)
        return agentDate >= startDate && agentDate <= endDate
      })
    }

    setFilteredData(filtered)
  }, [trainingData, selectedAgent, selectedModule, selectedStatus, selectedRegion, dateRange])

  // Chart data
  const chartData = {
    labels: filteredData.map(agent => agent.agentName),
    datasets: [
      {
        label: 'Score (%)',
        data: filteredData.map(agent => (agent.score / agent.maxScore) * 100),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      }
    ]
  }

  const attendanceChartData = {
    labels: ['Present', 'Absent', 'Late'],
    datasets: [
      {
        data: [
          filteredData.filter(agent => agent.attendanceStatus === 'present').length,
          filteredData.filter(agent => agent.attendanceStatus === 'absent').length,
          filteredData.filter(agent => agent.attendanceStatus === 'late').length
        ],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(245, 158, 11, 0.8)'
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(245, 158, 11, 1)'
        ],
        borderWidth: 2
      }
    ]
  }

  const moduleChartData = {
    labels: Array.from(new Set(filteredData.map(agent => agent.trainingModule))),
    datasets: [
      {
        label: 'Average Score (%)',
        data: Array.from(new Set(filteredData.map(agent => agent.trainingModule))).map(module => {
          const moduleData = filteredData.filter(agent => agent.trainingModule === module)
          return moduleData.length > 0 ? 
            (moduleData.reduce((sum, agent) => sum + (agent.score / agent.maxScore) * 100, 0) / moduleData.length) : 0
        }),
        backgroundColor: 'rgba(139, 69, 19, 0.8)',
        borderColor: 'rgba(139, 69, 19, 1)',
        borderWidth: 1,
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Training Scores by Agent (%)'
      }
    }
  }

  const attendanceChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Attendance Status Distribution'
      }
    }
  }

  const moduleChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Average Score by Training Module (%)'
      }
    }
  }

  const handleExport = (format: 'pdf' | 'excel') => {
    // Mock export functionality
    console.log(`Exporting training attendance report as ${format}`)
    // In a real application, this would generate and download the file
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num)
  }

  const getTotalSessions = () => {
    return filteredData.length
  }

  const getPresentSessions = () => {
    return filteredData.filter(agent => agent.attendanceStatus === 'present').length
  }

  const getAbsentSessions = () => {
    return filteredData.filter(agent => agent.attendanceStatus === 'absent').length
  }

  const getAverageScore = () => {
    const validScores = filteredData.filter(agent => agent.score > 0)
    return validScores.length > 0 ? 
      (validScores.reduce((sum, agent) => sum + (agent.score / agent.maxScore) * 100, 0) / validScores.length).toFixed(1) : 0
  }

  const getAttendanceRate = () => {
    return filteredData.length > 0 ? 
      ((getPresentSessions() / filteredData.length) * 100).toFixed(1) : 0
  }

  const getCertificationRate = () => {
    const completed = filteredData.filter(agent => agent.certificationStatus === 'completed').length
    return filteredData.length > 0 ? ((completed / filteredData.length) * 100).toFixed(1) : 0
  }

  const getStatusCount = (status: string) => {
    return filteredData.filter(agent => agent.attendanceStatus === status).length
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800'
      case 'absent':
        return 'bg-red-100 text-red-800'
      case 'late':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCertificationColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
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
                <button onClick={() => router.push('/dashboard/reports')} className="ml-4 text-gray-400 hover:text-gray-500">
                  Reports & MIS
                </button>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="text-gray-400">/</span>
                <span className="ml-4 text-gray-900 font-medium">Training & Development</span>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="text-gray-400">/</span>
                <span className="ml-4 text-gray-900 font-medium">Training Attendance & Performance</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      {/* Page header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/dashboard/reports')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Agent Training Attendance and Performance</h1>
            <p className="mt-1 text-sm text-gray-600">
              Participation in training sessions and scores in assessments
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => handleExport('pdf')}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
            Export PDF
          </button>
          <button
            onClick={() => handleExport('excel')}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
            Export Excel
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Agent</label>
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Agents</option>
              {Array.from(new Set(trainingData.map(agent => agent.agentName))).map(agent => (
                <option key={agent} value={agent}>{agent}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Module</label>
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Modules</option>
              {Array.from(new Set(trainingData.map(agent => agent.trainingModule))).map(module => (
                <option key={module} value={module}>{module}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Regions</option>
              {Array.from(new Set(trainingData.map(agent => agent.region))).map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <div className="flex space-x-2">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <AcademicCapIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Sessions</p>
              <p className="text-2xl font-bold text-gray-900">{getTotalSessions()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Present Sessions</p>
              <p className="text-2xl font-bold text-gray-900">{getPresentSessions()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <StarIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Score</p>
              <p className="text-2xl font-bold text-gray-900">{getAverageScore()}%</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrophyIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
              <p className="text-2xl font-bold text-gray-900">{getAttendanceRate()}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Present</p>
              <p className="text-2xl font-bold text-green-600">{getStatusCount('present')}</p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Absent</p>
              <p className="text-2xl font-bold text-red-600">{getStatusCount('absent')}</p>
            </div>
            <ClockIcon className="h-8 w-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Late</p>
              <p className="text-2xl font-bold text-yellow-600">{getStatusCount('late')}</p>
            </div>
            <ClockIcon className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Training Scores by Agent</h3>
          <Bar data={chartData} options={chartOptions} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Status Distribution</h3>
          <Doughnut data={attendanceChartData} options={attendanceChartOptions} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Score by Training Module</h3>
          <Bar data={moduleChartData} options={moduleChartOptions} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Training Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <AcademicCapIcon className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Total Sessions</span>
              </div>
              <span className="text-lg font-bold text-gray-900">{getTotalSessions()}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Attendance Rate</span>
              </div>
              <span className="text-lg font-bold text-gray-900">{getAttendanceRate()}%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <TrophyIcon className="h-5 w-5 text-purple-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Certification Rate</span>
              </div>
              <span className="text-lg font-bold text-gray-900">{getCertificationRate()}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Training Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Training Details</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Training Module
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completion Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Certification
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trainer
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((agent) => (
                <tr key={agent.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{agent.agentName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{agent.trainingModule}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{agent.attendanceDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(agent.attendanceStatus)}`}>
                      {agent.attendanceStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">
                      {agent.score > 0 ? `${agent.score}/${agent.maxScore}` : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {agent.completionTime > 0 ? `${agent.completionTime} min` : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCertificationColor(agent.certificationStatus)}`}>
                      {agent.certificationStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{agent.trainer}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
