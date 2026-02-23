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
  ArrowTrendingDownIcon,
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

interface TATData {
  id: string
  policyNumber: string
  agentName: string
  customerName: string
  policyType: string
  applicationDate: string
  issuanceDate: string
  tatHours: number
  status: 'completed' | 'pending' | 'delayed' | 'rejected'
  region: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  delayReason?: string
}

export default function PolicyIssuanceTATReport() {
  const router = useRouter()
  const [tatData, setTATData] = useState<TATData[]>([])
  const [filteredData, setFilteredData] = useState<TATData[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedAgent, setSelectedAgent] = useState('all')
  const [selectedPolicyType, setSelectedPolicyType] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  })

  // Mock data
  useEffect(() => {
    const mockData: TATData[] = [
      {
        id: '1',
        policyNumber: 'POL001234',
        agentName: 'Rajesh Kumar',
        customerName: 'Amit Patel',
        policyType: 'Life Insurance',
        applicationDate: '2024-01-15',
        issuanceDate: '2024-01-16',
        tatHours: 24,
        status: 'completed',
        region: 'Mumbai',
        priority: 'medium'
      },
      {
        id: '2',
        policyNumber: 'POL001235',
        agentName: 'Priya Sharma',
        customerName: 'Sneha Gupta',
        policyType: 'Health Insurance',
        applicationDate: '2024-01-14',
        issuanceDate: '2024-01-17',
        tatHours: 72,
        status: 'completed',
        region: 'Bangalore',
        priority: 'high'
      },
      {
        id: '3',
        policyNumber: 'POL001236',
        agentName: 'Amit Patel',
        customerName: 'Vikram Singh',
        policyType: 'Motor Insurance',
        applicationDate: '2024-01-13',
        issuanceDate: '',
        tatHours: 0,
        status: 'pending',
        region: 'Delhi',
        priority: 'low'
      },
      {
        id: '4',
        policyNumber: 'POL001237',
        agentName: 'Sneha Gupta',
        customerName: 'Anita Desai',
        policyType: 'Life Insurance',
        applicationDate: '2024-01-12',
        issuanceDate: '2024-01-20',
        tatHours: 192,
        status: 'delayed',
        region: 'Chennai',
        priority: 'medium',
        delayReason: 'Document verification pending'
      },
      {
        id: '5',
        policyNumber: 'POL001238',
        agentName: 'Vikram Singh',
        customerName: 'Rohit Verma',
        policyType: 'Health Insurance',
        applicationDate: '2024-01-11',
        issuanceDate: '2024-01-12',
        tatHours: 12,
        status: 'completed',
        region: 'Pune',
        priority: 'urgent'
      },
      {
        id: '6',
        policyNumber: 'POL001239',
        agentName: 'Anita Desai',
        customerName: 'Kavita Joshi',
        policyType: 'Motor Insurance',
        applicationDate: '2024-01-10',
        issuanceDate: '',
        tatHours: 0,
        status: 'rejected',
        region: 'Hyderabad',
        priority: 'medium',
        delayReason: 'Incomplete documentation'
      },
      {
        id: '7',
        policyNumber: 'POL001240',
        agentName: 'Rohit Verma',
        customerName: 'Rajesh Kumar',
        policyType: 'Life Insurance',
        applicationDate: '2024-01-09',
        issuanceDate: '2024-01-10',
        tatHours: 18,
        status: 'completed',
        region: 'Kolkata',
        priority: 'high'
      },
      {
        id: '8',
        policyNumber: 'POL001241',
        agentName: 'Kavita Joshi',
        customerName: 'Priya Sharma',
        policyType: 'Health Insurance',
        applicationDate: '2024-01-08',
        issuanceDate: '2024-01-15',
        tatHours: 168,
        status: 'delayed',
        region: 'Ahmedabad',
        priority: 'medium',
        delayReason: 'Medical examination required'
      }
    ]
    setTATData(mockData)
    setFilteredData(mockData)
  }, [])

  // Filter data based on selected criteria
  useEffect(() => {
    let filtered = tatData

    if (selectedAgent !== 'all') {
      filtered = filtered.filter(agent => agent.agentName === selectedAgent)
    }

    if (selectedPolicyType !== 'all') {
      filtered = filtered.filter(agent => agent.policyType === selectedPolicyType)
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(agent => agent.status === selectedStatus)
    }

    if (selectedRegion !== 'all') {
      filtered = filtered.filter(agent => agent.region === selectedRegion)
    }

    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(agent => {
        const agentDate = new Date(agent.applicationDate)
        const startDate = new Date(dateRange.start)
        const endDate = new Date(dateRange.end)
        return agentDate >= startDate && agentDate <= endDate
      })
    }

    setFilteredData(filtered)
  }, [tatData, selectedAgent, selectedPolicyType, selectedStatus, selectedRegion, dateRange])

  // Chart data
  const chartData = {
    labels: filteredData.map(agent => agent.agentName),
    datasets: [
      {
        label: 'Average TAT (Hours)',
        data: filteredData.map(agent => agent.tatHours),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      }
    ]
  }

  const statusChartData = {
    labels: ['Completed', 'Pending', 'Delayed', 'Rejected'],
    datasets: [
      {
        data: [
          filteredData.filter(agent => agent.status === 'completed').length,
          filteredData.filter(agent => agent.status === 'pending').length,
          filteredData.filter(agent => agent.status === 'delayed').length,
          filteredData.filter(agent => agent.status === 'rejected').length
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

  const policyTypeChartData = {
    labels: ['Life Insurance', 'Health Insurance', 'Motor Insurance'],
    datasets: [
      {
        data: [
          filteredData.filter(agent => agent.policyType === 'Life Insurance').reduce((sum, agent) => sum + agent.tatHours, 0) / 
          (filteredData.filter(agent => agent.policyType === 'Life Insurance').length || 1),
          filteredData.filter(agent => agent.policyType === 'Health Insurance').reduce((sum, agent) => sum + agent.tatHours, 0) / 
          (filteredData.filter(agent => agent.policyType === 'Health Insurance').length || 1),
          filteredData.filter(agent => agent.policyType === 'Motor Insurance').reduce((sum, agent) => sum + agent.tatHours, 0) / 
          (filteredData.filter(agent => agent.policyType === 'Motor Insurance').length || 1)
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)'
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)'
        ],
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
        text: 'Average TAT by Agent (Hours)'
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
        text: 'Policy Status Distribution'
      }
    }
  }

  const policyTypeChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Average TAT by Policy Type (Hours)'
      }
    }
  }

  const handleExport = (format: 'pdf' | 'excel') => {
    // Mock export functionality
    console.log(`Exporting policy issuance TAT report as ${format}`)
    // In a real application, this would generate and download the file
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num)
  }

  const getTotalPolicies = () => {
    return filteredData.length
  }

  const getCompletedPolicies = () => {
    return filteredData.filter(agent => agent.status === 'completed').length
  }

  const getPendingPolicies = () => {
    return filteredData.filter(agent => agent.status === 'pending').length
  }

  const getDelayedPolicies = () => {
    return filteredData.filter(agent => agent.status === 'delayed').length
  }

  const getAverageTAT = () => {
    const completedPolicies = filteredData.filter(agent => agent.status === 'completed' && agent.tatHours > 0)
    return completedPolicies.length > 0 ? 
      (completedPolicies.reduce((sum, agent) => sum + agent.tatHours, 0) / completedPolicies.length).toFixed(1) : 0
  }

  const getStatusCount = (status: string) => {
    return filteredData.filter(agent => agent.status === status).length
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'delayed':
        return 'bg-red-100 text-red-800'
      case 'rejected':
        return 'bg-gray-100 text-gray-800'
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
                <span className="ml-4 text-gray-900 font-medium">Policy Issuance TAT Report</span>
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
            <h1 className="text-lg font-semibold text-gray-900">Policy Issuance TAT Report</h1>
            <p className="mt-1 text-sm text-gray-600">
              Average turnaround time for issuing policies
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
              {Array.from(new Set(tatData.map(agent => agent.agentName))).map(agent => (
                <option key={agent} value={agent}>{agent}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Policy Type</label>
            <select
              value={selectedPolicyType}
              onChange={(e) => setSelectedPolicyType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              {Array.from(new Set(tatData.map(agent => agent.policyType))).map(type => (
                <option key={type} value={type}>{type}</option>
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
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="delayed">Delayed</option>
              <option value="rejected">Rejected</option>
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
              {Array.from(new Set(tatData.map(agent => agent.region))).map(region => (
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
              <ClockIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Policies</p>
              <p className="text-2xl font-bold text-gray-900">{getTotalPolicies()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{getCompletedPolicies()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{getPendingPolicies()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <ArrowTrendingUpIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg TAT</p>
              <p className="text-2xl font-bold text-gray-900">{getAverageTAT()}h</p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{getStatusCount('completed')}</p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
          </div>
        </div>
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
              <p className="text-sm font-medium text-gray-600">Delayed</p>
              <p className="text-2xl font-bold text-red-600">{getStatusCount('delayed')}</p>
            </div>
            <ArrowTrendingUpIcon className="h-8 w-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-gray-600">{getStatusCount('rejected')}</p>
            </div>
            <ArrowTrendingDownIcon className="h-8 w-8 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Average TAT by Agent</h3>
          <Bar data={chartData} options={chartOptions} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Policy Status Distribution</h3>
          <Doughnut data={statusChartData} options={statusChartOptions} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Average TAT by Policy Type</h3>
          <Bar data={policyTypeChartData} options={policyTypeChartOptions} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">TAT Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <ClockIcon className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Total Policies</span>
              </div>
              <span className="text-lg font-bold text-gray-900">{getTotalPolicies()}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Completion Rate</span>
              </div>
              <span className="text-lg font-bold text-gray-900">
                {getTotalPolicies() > 0 ? ((getCompletedPolicies() / getTotalPolicies()) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <ArrowTrendingUpIcon className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Average TAT</span>
              </div>
              <span className="text-lg font-bold text-gray-900">{getAverageTAT()}h</span>
            </div>
          </div>
        </div>
      </div>

      {/* TAT Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Policy TAT Details</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Policy Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Policy Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Application Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Issuance Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  TAT (Hours)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((agent) => (
                <tr key={agent.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{agent.policyNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{agent.agentName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{agent.customerName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      agent.policyType === 'Life Insurance' 
                        ? 'bg-blue-100 text-blue-800' 
                        : agent.policyType === 'Health Insurance'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {agent.policyType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{agent.applicationDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{agent.issuanceDate || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">
                      {agent.tatHours > 0 ? `${agent.tatHours}h` : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(agent.status)}`}>
                      {agent.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(agent.priority)}`}>
                      {agent.priority}
                    </span>
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
