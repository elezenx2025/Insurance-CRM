'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeftIcon,
  ClockIcon,
  ChartBarIcon,
  DocumentArrowDownIcon,
  UserGroupIcon,
  CalendarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  XCircleIcon,
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

interface PendingCaseData {
  id: string
  caseNumber: string
  agentName: string
  customerName: string
  caseType: 'policy' | 'claim' | 'renewal' | 'cancellation'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'in_progress' | 'on_hold' | 'escalated'
  createdDate: string
  lastUpdated: string
  daysPending: number
  region: string
  assignedTo: string
  description: string
}

export default function PendingCasesReport() {
  const router = useRouter()
  const [pendingData, setPendingData] = useState<PendingCaseData[]>([])
  const [filteredData, setFilteredData] = useState<PendingCaseData[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedAgent, setSelectedAgent] = useState('all')
  const [selectedCaseType, setSelectedCaseType] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  })

  // Mock data
  useEffect(() => {
    const mockData: PendingCaseData[] = [
      {
        id: '1',
        caseNumber: 'CASE001234',
        agentName: 'Rajesh Kumar',
        customerName: 'Amit Patel',
        caseType: 'policy',
        priority: 'high',
        status: 'pending',
        createdDate: '2024-01-10',
        lastUpdated: '2024-01-15',
        daysPending: 5,
        region: 'Mumbai',
        assignedTo: 'Policy Team',
        description: 'Policy issuance pending due to document verification'
      },
      {
        id: '2',
        caseNumber: 'CASE001235',
        agentName: 'Priya Sharma',
        customerName: 'Sneha Gupta',
        caseType: 'claim',
        priority: 'urgent',
        status: 'in_progress',
        createdDate: '2024-01-08',
        lastUpdated: '2024-01-15',
        daysPending: 7,
        region: 'Bangalore',
        assignedTo: 'Claims Team',
        description: 'Health insurance claim processing'
      },
      {
        id: '3',
        caseNumber: 'CASE001236',
        agentName: 'Amit Patel',
        customerName: 'Vikram Singh',
        caseType: 'renewal',
        priority: 'medium',
        status: 'on_hold',
        createdDate: '2024-01-05',
        lastUpdated: '2024-01-12',
        daysPending: 10,
        region: 'Delhi',
        assignedTo: 'Renewal Team',
        description: 'Policy renewal pending customer confirmation'
      },
      {
        id: '4',
        caseNumber: 'CASE001237',
        agentName: 'Sneha Gupta',
        customerName: 'Anita Desai',
        caseType: 'cancellation',
        priority: 'low',
        status: 'pending',
        createdDate: '2024-01-12',
        lastUpdated: '2024-01-15',
        daysPending: 3,
        region: 'Chennai',
        assignedTo: 'Customer Service',
        description: 'Policy cancellation request'
      },
      {
        id: '5',
        caseNumber: 'CASE001238',
        agentName: 'Vikram Singh',
        customerName: 'Rohit Verma',
        caseType: 'claim',
        priority: 'high',
        status: 'escalated',
        createdDate: '2024-01-03',
        lastUpdated: '2024-01-15',
        daysPending: 12,
        region: 'Pune',
        assignedTo: 'Senior Claims Team',
        description: 'Motor insurance claim - complex case'
      },
      {
        id: '6',
        caseNumber: 'CASE001239',
        agentName: 'Anita Desai',
        customerName: 'Kavita Joshi',
        caseType: 'policy',
        priority: 'medium',
        status: 'in_progress',
        createdDate: '2024-01-09',
        lastUpdated: '2024-01-14',
        daysPending: 6,
        region: 'Hyderabad',
        assignedTo: 'Policy Team',
        description: 'New policy application under review'
      },
      {
        id: '7',
        caseNumber: 'CASE001240',
        agentName: 'Rohit Verma',
        customerName: 'Rajesh Kumar',
        caseType: 'renewal',
        priority: 'urgent',
        status: 'pending',
        createdDate: '2024-01-11',
        lastUpdated: '2024-01-15',
        daysPending: 4,
        region: 'Kolkata',
        assignedTo: 'Renewal Team',
        description: 'Urgent policy renewal required'
      },
      {
        id: '8',
        caseNumber: 'CASE001241',
        agentName: 'Kavita Joshi',
        customerName: 'Priya Sharma',
        caseType: 'claim',
        priority: 'medium',
        status: 'on_hold',
        createdDate: '2024-01-07',
        lastUpdated: '2024-01-13',
        daysPending: 8,
        region: 'Ahmedabad',
        assignedTo: 'Claims Team',
        description: 'Claim on hold pending additional documents'
      }
    ]
    setPendingData(mockData)
    setFilteredData(mockData)
  }, [])

  // Filter data based on selected criteria
  useEffect(() => {
    let filtered = pendingData

    if (selectedAgent !== 'all') {
      filtered = filtered.filter(agent => agent.agentName === selectedAgent)
    }

    if (selectedCaseType !== 'all') {
      filtered = filtered.filter(agent => agent.caseType === selectedCaseType)
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(agent => agent.status === selectedStatus)
    }

    if (selectedRegion !== 'all') {
      filtered = filtered.filter(agent => agent.region === selectedRegion)
    }

    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(agent => {
        const agentDate = new Date(agent.createdDate)
        const startDate = new Date(dateRange.start)
        const endDate = new Date(dateRange.end)
        return agentDate >= startDate && agentDate <= endDate
      })
    }

    setFilteredData(filtered)
  }, [pendingData, selectedAgent, selectedCaseType, selectedStatus, selectedRegion, dateRange])

  // Chart data
  const chartData = {
    labels: filteredData.map(agent => agent.agentName),
    datasets: [
      {
        label: 'Pending Cases',
        data: filteredData.map(agent => 1), // Count of cases per agent
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
      }
    ]
  }

  const statusChartData = {
    labels: ['Pending', 'In Progress', 'On Hold', 'Escalated'],
    datasets: [
      {
        data: [
          filteredData.filter(agent => agent.status === 'pending').length,
          filteredData.filter(agent => agent.status === 'in_progress').length,
          filteredData.filter(agent => agent.status === 'on_hold').length,
          filteredData.filter(agent => agent.status === 'escalated').length
        ],
        backgroundColor: [
          'rgba(245, 158, 11, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(156, 163, 175, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgba(245, 158, 11, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(156, 163, 175, 1)',
          'rgba(239, 68, 68, 1)'
        ],
        borderWidth: 2
      }
    ]
  }

  const caseTypeChartData = {
    labels: ['Policy', 'Claim', 'Renewal', 'Cancellation'],
    datasets: [
      {
        data: [
          filteredData.filter(agent => agent.caseType === 'policy').length,
          filteredData.filter(agent => agent.caseType === 'claim').length,
          filteredData.filter(agent => agent.caseType === 'renewal').length,
          filteredData.filter(agent => agent.caseType === 'cancellation').length
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)'
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
        text: 'Pending Cases by Agent'
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
        text: 'Case Status Distribution'
      }
    }
  }

  const caseTypeChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Case Type Distribution'
      }
    }
  }

  const handleExport = (format: 'pdf' | 'excel') => {
    // Mock export functionality
    console.log(`Exporting pending cases report as ${format}`)
    // In a real application, this would generate and download the file
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num)
  }

  const getTotalCases = () => {
    return filteredData.length
  }

  const getPendingCases = () => {
    return filteredData.filter(agent => agent.status === 'pending').length
  }

  const getInProgressCases = () => {
    return filteredData.filter(agent => agent.status === 'in_progress').length
  }

  const getEscalatedCases = () => {
    return filteredData.filter(agent => agent.status === 'escalated').length
  }

  const getAverageDaysPending = () => {
    return filteredData.length > 0 ? 
      (filteredData.reduce((sum, agent) => sum + agent.daysPending, 0) / filteredData.length).toFixed(1) : 0
  }

  const getStatusCount = (status: string) => {
    return filteredData.filter(agent => agent.status === status).length
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'on_hold':
        return 'bg-gray-100 text-gray-800'
      case 'escalated':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCaseTypeColor = (caseType: string) => {
    switch (caseType) {
      case 'policy':
        return 'bg-blue-100 text-blue-800'
      case 'claim':
        return 'bg-green-100 text-green-800'
      case 'renewal':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancellation':
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
                <span className="ml-4 text-gray-900 font-medium">Operational & Efficiency</span>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="text-gray-400">/</span>
                <span className="ml-4 text-gray-900 font-medium">Pending Cases and Follow-up Report</span>
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
            <h1 className="text-lg font-semibold text-gray-900">Pending Cases and Follow-up Report</h1>
            <p className="mt-1 text-sm text-gray-600">
              Policies or claims pending completion
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
              {Array.from(new Set(pendingData.map(agent => agent.agentName))).map(agent => (
                <option key={agent} value={agent}>{agent}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Case Type</label>
            <select
              value={selectedCaseType}
              onChange={(e) => setSelectedCaseType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="policy">Policy</option>
              <option value="claim">Claim</option>
              <option value="renewal">Renewal</option>
              <option value="cancellation">Cancellation</option>
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
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="on_hold">On Hold</option>
              <option value="escalated">Escalated</option>
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
              {Array.from(new Set(pendingData.map(agent => agent.region))).map(region => (
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
              <ClockIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Cases</p>
              <p className="text-2xl font-bold text-gray-900">{getTotalCases()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Cases</p>
              <p className="text-2xl font-bold text-gray-900">{getPendingCases()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <ArrowTrendingUpIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">{getInProgressCases()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <XCircleIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Days Pending</p>
              <p className="text-2xl font-bold text-gray-900">{getAverageDaysPending()}d</p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{getStatusCount('pending')}</p>
            </div>
            <ExclamationTriangleIcon className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">{getStatusCount('in_progress')}</p>
            </div>
            <ArrowTrendingUpIcon className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">On Hold</p>
              <p className="text-2xl font-bold text-gray-600">{getStatusCount('on_hold')}</p>
            </div>
            <ClockIcon className="h-8 w-8 text-gray-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Escalated</p>
              <p className="text-2xl font-bold text-red-600">{getStatusCount('escalated')}</p>
            </div>
            <XCircleIcon className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Cases by Agent</h3>
          <Bar data={chartData} options={chartOptions} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Case Status Distribution</h3>
          <Doughnut data={statusChartData} options={statusChartOptions} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Case Type Distribution</h3>
          <Doughnut data={caseTypeChartData} options={caseTypeChartOptions} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Cases Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <ClockIcon className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Total Cases</span>
              </div>
              <span className="text-lg font-bold text-gray-900">{getTotalCases()}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Pending Cases</span>
              </div>
              <span className="text-lg font-bold text-gray-900">{getPendingCases()}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <ArrowTrendingUpIcon className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Avg Days Pending</span>
              </div>
              <span className="text-lg font-bold text-gray-900">{getAverageDaysPending()} days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Cases Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Pending Cases Details</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Case Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Case Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Days Pending
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned To
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((agent) => (
                <tr key={agent.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{agent.caseNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{agent.agentName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{agent.customerName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCaseTypeColor(agent.caseType)}`}>
                      {agent.caseType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(agent.priority)}`}>
                      {agent.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(agent.status)}`}>
                      {agent.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">{agent.daysPending} days</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{agent.assignedTo}</div>
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
