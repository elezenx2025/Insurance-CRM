'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeftIcon,
  ExclamationTriangleIcon,
  DocumentArrowDownIcon,
  UserGroupIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ShieldExclamationIcon,
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

interface ErrorData {
  id: string
  agentName: string
  errorType: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  date: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  region: string
  policyNumber: string
  resolutionTime: number // in hours
  assignedTo: string
}

export default function ErrorDiscrepancyReport() {
  const router = useRouter()
  const [errorData, setErrorData] = useState<ErrorData[]>([])
  const [filteredData, setFilteredData] = useState<ErrorData[]>([])
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
    const mockData: ErrorData[] = [
      {
        id: '1',
        agentName: 'Rajesh Kumar',
        errorType: 'Data Entry Error',
        severity: 'medium',
        description: 'Incorrect premium amount entered',
        date: '2024-01-15',
        status: 'resolved',
        region: 'Mumbai',
        policyNumber: 'POL001234',
        resolutionTime: 2,
        assignedTo: 'Quality Team'
      },
      {
        id: '2',
        agentName: 'Priya Sharma',
        errorType: 'Document Missing',
        severity: 'high',
        description: 'Required documents not uploaded',
        date: '2024-01-14',
        status: 'in_progress',
        region: 'Bangalore',
        policyNumber: 'POL001235',
        resolutionTime: 0,
        assignedTo: 'Compliance Team'
      },
      {
        id: '3',
        agentName: 'Amit Patel',
        errorType: 'Policy Issuance Error',
        severity: 'critical',
        description: 'Wrong policy type issued',
        date: '2024-01-13',
        status: 'open',
        region: 'Delhi',
        policyNumber: 'POL001236',
        resolutionTime: 0,
        assignedTo: 'Technical Team'
      },
      {
        id: '4',
        agentName: 'Sneha Gupta',
        errorType: 'Customer Information Error',
        severity: 'low',
        description: 'Minor spelling error in customer name',
        date: '2024-01-12',
        status: 'resolved',
        region: 'Chennai',
        policyNumber: 'POL001237',
        resolutionTime: 1,
        assignedTo: 'Quality Team'
      },
      {
        id: '5',
        agentName: 'Vikram Singh',
        errorType: 'Payment Processing Error',
        severity: 'high',
        description: 'Payment not processed correctly',
        date: '2024-01-11',
        status: 'resolved',
        region: 'Pune',
        policyNumber: 'POL001238',
        resolutionTime: 4,
        assignedTo: 'Finance Team'
      },
      {
        id: '6',
        agentName: 'Anita Desai',
        errorType: 'System Error',
        severity: 'critical',
        description: 'System crash during policy creation',
        date: '2024-01-10',
        status: 'closed',
        region: 'Hyderabad',
        policyNumber: 'POL001239',
        resolutionTime: 8,
        assignedTo: 'IT Team'
      },
      {
        id: '7',
        agentName: 'Rohit Verma',
        errorType: 'Data Entry Error',
        severity: 'medium',
        description: 'Incorrect beneficiary information',
        date: '2024-01-09',
        status: 'resolved',
        region: 'Kolkata',
        policyNumber: 'POL001240',
        resolutionTime: 3,
        assignedTo: 'Quality Team'
      },
      {
        id: '8',
        agentName: 'Kavita Joshi',
        errorType: 'Document Error',
        severity: 'low',
        description: 'Document format not as per standards',
        date: '2024-01-08',
        status: 'resolved',
        region: 'Ahmedabad',
        policyNumber: 'POL001241',
        resolutionTime: 1,
        assignedTo: 'Quality Team'
      }
    ]
    setErrorData(mockData)
    setFilteredData(mockData)
  }, [])

  // Filter data based on selected criteria
  useEffect(() => {
    let filtered = errorData

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
  }, [errorData, selectedAgent, selectedSeverity, selectedStatus, selectedRegion, dateRange])

  // Chart data
  const chartData = {
    labels: filteredData.map(agent => agent.agentName),
    datasets: [
      {
        label: 'Errors Count',
        data: filteredData.map(agent => 1), // Count of errors per agent
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

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Errors by Agent'
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
        text: 'Error Severity Distribution'
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
        text: 'Error Status Distribution'
      }
    }
  }

  const handleExport = (format: 'pdf' | 'excel') => {
    // Mock export functionality
    console.log(`Exporting error discrepancy report as ${format}`)
    // In a real application, this would generate and download the file
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num)
  }

  const getTotalErrors = () => {
    return filteredData.length
  }

  const getOpenErrors = () => {
    return filteredData.filter(agent => agent.status === 'open').length
  }

  const getResolvedErrors = () => {
    return filteredData.filter(agent => agent.status === 'resolved').length
  }

  const getCriticalErrors = () => {
    return filteredData.filter(agent => agent.severity === 'critical').length
  }

  const getAverageResolutionTime = () => {
    const resolvedErrors = filteredData.filter(agent => agent.status === 'resolved' || agent.status === 'closed')
    return resolvedErrors.length > 0 ? 
      (resolvedErrors.reduce((sum, agent) => sum + agent.resolutionTime, 0) / resolvedErrors.length).toFixed(1) : 0
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
                <span className="ml-4 text-gray-900 font-medium">Compliance & Quality</span>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="text-gray-400">/</span>
                <span className="ml-4 text-gray-900 font-medium">Error and Discrepancy Report</span>
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
            <h1 className="text-lg font-semibold text-gray-900">Error and Discrepancy Report</h1>
            <p className="mt-1 text-sm text-gray-600">
              Incorrect or incomplete policy issuance data
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
              {Array.from(new Set(errorData.map(agent => agent.agentName))).map(agent => (
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
              {Array.from(new Set(errorData.map(agent => agent.region))).map(region => (
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
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Errors</p>
              <p className="text-2xl font-bold text-gray-900">{getTotalErrors()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Open Errors</p>
              <p className="text-2xl font-bold text-gray-900">{getOpenErrors()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Resolved Errors</p>
              <p className="text-2xl font-bold text-gray-900">{getResolvedErrors()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-gray-100 rounded-lg">
              <ShieldExclamationIcon className="h-6 w-6 text-gray-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Critical Errors</p>
              <p className="text-2xl font-bold text-gray-900">{getCriticalErrors()}</p>
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Errors by Agent</h3>
          <Bar data={chartData} options={chartOptions} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Error Severity Distribution</h3>
          <Doughnut data={severityChartData} options={severityChartOptions} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Error Status Distribution</h3>
          <Doughnut data={statusChartData} options={statusChartOptions} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Error Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Total Errors</span>
              </div>
              <span className="text-lg font-bold text-gray-900">{getTotalErrors()}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Resolution Rate</span>
              </div>
              <span className="text-lg font-bold text-gray-900">
                {getTotalErrors() > 0 ? ((getResolvedErrors() / getTotalErrors()) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <ClockIcon className="h-5 w-5 text-yellow-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Avg Resolution Time</span>
              </div>
              <span className="text-lg font-bold text-gray-900">{getAverageResolutionTime()}h</span>
            </div>
          </div>
        </div>
      </div>

      {/* Error Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Error Details</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Error Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Policy Number
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
                    <div className="text-sm font-medium text-gray-900">{agent.agentName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{agent.errorType}</div>
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
                    <div className="text-sm text-gray-900">{agent.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(agent.status)}`}>
                      {agent.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{agent.policyNumber}</div>
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
