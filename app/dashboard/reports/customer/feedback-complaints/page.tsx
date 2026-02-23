'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeftIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
  DocumentArrowDownIcon,
  UserGroupIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  StarIcon,
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

interface FeedbackData {
  id: string
  customerName: string
  agentName: string
  complaintType: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  date: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  region: string
  rating: number
  resolutionTime: number // in hours
  assignedTo: string
}

export default function FeedbackComplaintsReport() {
  const router = useRouter()
  const [feedbackData, setFeedbackData] = useState<FeedbackData[]>([])
  const [filteredData, setFilteredData] = useState<FeedbackData[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedAgent, setSelectedAgent] = useState('all')
  const [selectedSeverity, setSelectedSeverity] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  })

  // Mock data
  useEffect(() => {
    const mockData: FeedbackData[] = [
      {
        id: '1',
        customerName: 'Rajesh Kumar',
        agentName: 'Amit Patel',
        complaintType: 'Service Quality',
        severity: 'medium',
        description: 'Poor response time to queries',
        date: '2024-01-15',
        status: 'resolved',
        region: 'Mumbai',
        rating: 3,
        resolutionTime: 24,
        assignedTo: 'Customer Service'
      },
      {
        id: '2',
        customerName: 'Priya Sharma',
        agentName: 'Sneha Gupta',
        complaintType: 'Policy Processing',
        severity: 'high',
        description: 'Policy not issued on time',
        date: '2024-01-14',
        status: 'in_progress',
        region: 'Bangalore',
        rating: 2,
        resolutionTime: 0,
        assignedTo: 'Operations Team'
      },
      {
        id: '3',
        customerName: 'Amit Patel',
        agentName: 'Vikram Singh',
        complaintType: 'Documentation',
        severity: 'low',
        description: 'Missing documents in policy',
        date: '2024-01-13',
        status: 'resolved',
        region: 'Delhi',
        rating: 4,
        resolutionTime: 12,
        assignedTo: 'Quality Team'
      },
      {
        id: '4',
        customerName: 'Sneha Gupta',
        agentName: 'Anita Desai',
        complaintType: 'Premium Payment',
        severity: 'critical',
        description: 'Premium charged incorrectly',
        date: '2024-01-12',
        status: 'open',
        region: 'Chennai',
        rating: 1,
        resolutionTime: 0,
        assignedTo: 'Finance Team'
      },
      {
        id: '5',
        customerName: 'Vikram Singh',
        agentName: 'Rohit Verma',
        complaintType: 'Claim Processing',
        severity: 'high',
        description: 'Claim settlement delayed',
        date: '2024-01-11',
        status: 'resolved',
        region: 'Pune',
        rating: 3,
        resolutionTime: 48,
        assignedTo: 'Claims Team'
      },
      {
        id: '6',
        customerName: 'Anita Desai',
        agentName: 'Kavita Joshi',
        complaintType: 'Communication',
        severity: 'medium',
        description: 'Agent not responding to calls',
        date: '2024-01-10',
        status: 'resolved',
        region: 'Hyderabad',
        rating: 2,
        resolutionTime: 18,
        assignedTo: 'Customer Service'
      },
      {
        id: '7',
        customerName: 'Rohit Verma',
        agentName: 'Rajesh Kumar',
        complaintType: 'Policy Terms',
        severity: 'low',
        description: 'Confusion about policy terms',
        date: '2024-01-09',
        status: 'closed',
        region: 'Kolkata',
        rating: 4,
        resolutionTime: 6,
        assignedTo: 'Customer Service'
      },
      {
        id: '8',
        customerName: 'Kavita Joshi',
        agentName: 'Priya Sharma',
        complaintType: 'Renewal Process',
        severity: 'medium',
        description: 'Renewal process too complicated',
        date: '2024-01-08',
        status: 'resolved',
        region: 'Ahmedabad',
        rating: 3,
        resolutionTime: 36,
        assignedTo: 'Operations Team'
      }
    ]
    setFeedbackData(mockData)
    setFilteredData(mockData)
  }, [])

  // Filter data based on selected criteria
  useEffect(() => {
    let filtered = feedbackData

    if (selectedAgent !== 'all') {
      filtered = filtered.filter(agent => agent.agentName === selectedAgent)
    }

    if (selectedSeverity !== 'all') {
      filtered = filtered.filter(agent => agent.severity === selectedSeverity)
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(agent => agent.status === selectedStatus)
    }

    if (selectedRegion !== 'all') {
      filtered = filtered.filter(agent => agent.region === selectedRegion)
    }

    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(agent => {
        const agentDate = new Date(agent.date)
        const startDate = new Date(dateRange.start)
        const endDate = new Date(dateRange.end)
        return agentDate >= startDate && agentDate <= endDate
      })
    }

    setFilteredData(filtered)
  }, [feedbackData, selectedAgent, selectedSeverity, selectedStatus, selectedRegion, dateRange])

  // Chart data
  const chartData = {
    labels: filteredData.map(agent => agent.agentName),
    datasets: [
      {
        label: 'Complaints Count',
        data: filteredData.map(agent => 1), // Count of complaints per agent
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
      }
    ]
  }

  const severityChartData = {
    labels: ['Low', 'Medium', 'High', 'Critical'],
    datasets: [
      {
        data: [
          filteredData.filter(agent => agent.severity === 'low').length,
          filteredData.filter(agent => agent.severity === 'medium').length,
          filteredData.filter(agent => agent.severity === 'high').length,
          filteredData.filter(agent => agent.severity === 'critical').length
        ],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(156, 163, 175, 0.8)'
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(156, 163, 175, 1)'
        ],
        borderWidth: 2
      }
    ]
  }

  const statusChartData = {
    labels: ['Open', 'In Progress', 'Resolved', 'Closed'],
    datasets: [
      {
        data: [
          filteredData.filter(agent => agent.status === 'open').length,
          filteredData.filter(agent => agent.status === 'in_progress').length,
          filteredData.filter(agent => agent.status === 'resolved').length,
          filteredData.filter(agent => agent.status === 'closed').length
        ],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(59, 130, 246, 0.8)'
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(59, 130, 246, 1)'
        ],
        borderWidth: 2
      }
    ]
  }

  const ratingChartData = {
    labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
    datasets: [
      {
        data: [
          filteredData.filter(agent => agent.rating === 1).length,
          filteredData.filter(agent => agent.rating === 2).length,
          filteredData.filter(agent => agent.rating === 3).length,
          filteredData.filter(agent => agent.rating === 4).length,
          filteredData.filter(agent => agent.rating === 5).length
        ],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(34, 197, 94, 0.8)'
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(34, 197, 94, 1)'
        ],
        borderWidth: 2
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
        text: 'Complaints by Agent'
      }
    }
  }

  const severityChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Complaint Severity Distribution'
      }
    }
  }

  const statusChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Complaint Status Distribution'
      }
    }
  }

  const ratingChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Customer Rating Distribution'
      }
    }
  }

  const handleExport = (format: 'pdf' | 'excel') => {
    // Mock export functionality
    console.log(`Exporting feedback complaints report as ${format}`)
    // In a real application, this would generate and download the file
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num)
  }

  const getTotalComplaints = () => {
    return filteredData.length
  }

  const getOpenComplaints = () => {
    return filteredData.filter(agent => agent.status === 'open').length
  }

  const getResolvedComplaints = () => {
    return filteredData.filter(agent => agent.status === 'resolved').length
  }

  const getCriticalComplaints = () => {
    return filteredData.filter(agent => agent.severity === 'critical').length
  }

  const getAverageRating = () => {
    return filteredData.length > 0 ? 
      (filteredData.reduce((sum, agent) => sum + agent.rating, 0) / filteredData.length).toFixed(1) : 0
  }

  const getAverageResolutionTime = () => {
    const resolvedComplaints = filteredData.filter(agent => agent.status === 'resolved' || agent.status === 'closed')
    return resolvedComplaints.length > 0 ? 
      (resolvedComplaints.reduce((sum, agent) => sum + agent.resolutionTime, 0) / resolvedComplaints.length).toFixed(1) : 0
  }

  const getSeverityCount = (severity: string) => {
    return filteredData.filter(agent => agent.severity === severity).length
  }

  const getStatusCount = (status: string) => {
    return filteredData.filter(agent => agent.status === status).length
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-green-100 text-green-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'critical':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'resolved':
        return 'bg-green-100 text-green-800'
      case 'closed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill={i < rating ? 'currentColor' : 'none'}
      />
    ))
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
                <span className="ml-4 text-gray-900 font-medium">Customer-Centric</span>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="text-gray-400">/</span>
                <span className="ml-4 text-gray-900 font-medium">Feedback & Complaints Report</span>
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
            <h1 className="text-lg font-semibold text-gray-900">Customer Feedback and Complaint Report</h1>
            <p className="mt-1 text-sm text-gray-600">
              Analysis of complaints received against agents
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
              {Array.from(new Set(feedbackData.map(agent => agent.agentName))).map(agent => (
                <option key={agent} value={agent}>{agent}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Severity</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
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
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
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
              {Array.from(new Set(feedbackData.map(agent => agent.region))).map(region => (
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
            <div className="p-3 bg-red-100 rounded-lg">
              <ChatBubbleLeftRightIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Complaints</p>
              <p className="text-2xl font-bold text-gray-900">{getTotalComplaints()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Open Complaints</p>
              <p className="text-2xl font-bold text-gray-900">{getOpenComplaints()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Resolved Complaints</p>
              <p className="text-2xl font-bold text-gray-900">{getResolvedComplaints()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-gray-100 rounded-lg">
              <StarIcon className="h-6 w-6 text-gray-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Rating</p>
              <p className="text-2xl font-bold text-gray-900">{getAverageRating()}/5</p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Open</p>
              <p className="text-2xl font-bold text-red-600">{getStatusCount('open')}</p>
            </div>
            <XCircleIcon className="h-8 w-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-yellow-600">{getStatusCount('in_progress')}</p>
            </div>
            <ClockIcon className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-green-600">{getStatusCount('resolved')}</p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Closed</p>
              <p className="text-2xl font-bold text-blue-600">{getStatusCount('closed')}</p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Complaints by Agent</h3>
          <Bar data={chartData} options={chartOptions} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Complaint Severity Distribution</h3>
          <Doughnut data={severityChartData} options={severityChartOptions} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Complaint Status Distribution</h3>
          <Doughnut data={statusChartData} options={statusChartOptions} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Rating Distribution</h3>
          <Doughnut data={ratingChartData} options={ratingChartOptions} />
        </div>
      </div>

      {/* Feedback Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Feedback Details</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Complaint Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((agent) => (
                <tr key={agent.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{agent.customerName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{agent.agentName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{agent.complaintType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(agent.severity)}`}>
                      {agent.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 max-w-xs truncate">{agent.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getRatingStars(agent.rating)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(agent.status)}`}>
                      {agent.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{agent.date}</div>
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
