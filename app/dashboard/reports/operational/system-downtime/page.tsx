'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeftIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  DocumentArrowDownIcon,
  UserGroupIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  XCircleIcon,
  WrenchScrewdriverIcon,
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

interface DowntimeData {
  id: string
  incidentId: string
  systemName: string
  startTime: string
  endTime: string
  duration: number // in minutes
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'resolved' | 'ongoing' | 'investigating'
  impact: string
  affectedUsers: number
  region: string
  rootCause: string
  resolution: string
  reportedBy: string
}

export default function SystemDowntimeReport() {
  const router = useRouter()
  const [downtimeData, setDowntimeData] = useState<DowntimeData[]>([])
  const [filteredData, setFilteredData] = useState<DowntimeData[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedSystem, setSelectedSystem] = useState('all')
  const [selectedSeverity, setSelectedSeverity] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  })

  // Mock data
  useEffect(() => {
    const mockData: DowntimeData[] = [
      {
        id: '1',
        incidentId: 'INC001234',
        systemName: 'Policy Management System',
        startTime: '2024-01-15 10:30:00',
        endTime: '2024-01-15 12:45:00',
        duration: 135,
        severity: 'high',
        status: 'resolved',
        impact: 'Policy issuance delayed',
        affectedUsers: 150,
        region: 'Mumbai',
        rootCause: 'Database connection timeout',
        resolution: 'Restarted database services',
        reportedBy: 'IT Team'
      },
      {
        id: '2',
        incidentId: 'INC001235',
        systemName: 'Claims Processing System',
        startTime: '2024-01-14 14:20:00',
        endTime: '2024-01-14 16:30:00',
        duration: 130,
        severity: 'critical',
        status: 'resolved',
        impact: 'Claims processing halted',
        affectedUsers: 200,
        region: 'Bangalore',
        rootCause: 'Server hardware failure',
        resolution: 'Replaced faulty hardware',
        reportedBy: 'Operations Team'
      },
      {
        id: '3',
        incidentId: 'INC001236',
        systemName: 'Customer Portal',
        startTime: '2024-01-13 09:15:00',
        endTime: '2024-01-13 10:30:00',
        duration: 75,
        severity: 'medium',
        status: 'resolved',
        impact: 'Customer login issues',
        affectedUsers: 75,
        region: 'Delhi',
        rootCause: 'SSL certificate expired',
        resolution: 'Updated SSL certificate',
        reportedBy: 'Customer Service'
      },
      {
        id: '4',
        incidentId: 'INC001237',
        systemName: 'Payment Gateway',
        startTime: '2024-01-12 16:45:00',
        endTime: '2024-01-12 18:20:00',
        duration: 95,
        severity: 'high',
        status: 'resolved',
        impact: 'Payment processing failed',
        affectedUsers: 100,
        region: 'Chennai',
        rootCause: 'Third-party API timeout',
        resolution: 'Switched to backup payment provider',
        reportedBy: 'Finance Team'
      },
      {
        id: '5',
        incidentId: 'INC001238',
        systemName: 'Reporting Dashboard',
        startTime: '2024-01-11 11:00:00',
        endTime: '2024-01-11 12:15:00',
        duration: 75,
        severity: 'low',
        status: 'resolved',
        impact: 'Report generation delayed',
        affectedUsers: 25,
        region: 'Pune',
        rootCause: 'Memory leak in reporting module',
        resolution: 'Restarted reporting service',
        reportedBy: 'Analytics Team'
      },
      {
        id: '6',
        incidentId: 'INC001239',
        systemName: 'Agent Mobile App',
        startTime: '2024-01-10 08:30:00',
        endTime: '2024-01-10 10:45:00',
        duration: 135,
        severity: 'medium',
        status: 'resolved',
        impact: 'Mobile app crashes',
        affectedUsers: 80,
        region: 'Hyderabad',
        rootCause: 'App version compatibility issue',
        resolution: 'Rolled back to previous version',
        reportedBy: 'Mobile Team'
      },
      {
        id: '7',
        incidentId: 'INC001240',
        systemName: 'Email Notification Service',
        startTime: '2024-01-09 13:20:00',
        endTime: '2024-01-09 15:10:00',
        duration: 110,
        severity: 'low',
        status: 'resolved',
        impact: 'Email notifications delayed',
        affectedUsers: 50,
        region: 'Kolkata',
        rootCause: 'SMTP server overload',
        resolution: 'Increased server capacity',
        reportedBy: 'Communication Team'
      },
      {
        id: '8',
        incidentId: 'INC001241',
        systemName: 'Document Management System',
        startTime: '2024-01-08 15:45:00',
        endTime: '',
        duration: 0,
        severity: 'critical',
        status: 'ongoing',
        impact: 'Document upload failures',
        affectedUsers: 120,
        region: 'Ahmedabad',
        rootCause: 'Storage server failure',
        resolution: 'Under investigation',
        reportedBy: 'IT Support'
      }
    ]
    setDowntimeData(mockData)
    setFilteredData(mockData)
  }, [])

  // Filter data based on selected criteria
  useEffect(() => {
    let filtered = downtimeData

    if (selectedSystem !== 'all') {
      filtered = filtered.filter(agent => agent.systemName === selectedSystem)
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
        const agentDate = new Date(agent.startTime.split(' ')[0])
        const startDate = new Date(dateRange.start)
        const endDate = new Date(dateRange.end)
        return agentDate >= startDate && agentDate <= endDate
      })
    }

    setFilteredData(filtered)
  }, [downtimeData, selectedSystem, selectedSeverity, selectedStatus, selectedRegion, dateRange])

  // Chart data
  const chartData = {
    labels: filteredData.map(agent => agent.systemName),
    datasets: [
      {
        label: 'Downtime (Minutes)',
        data: filteredData.map(agent => agent.duration),
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
    labels: ['Resolved', 'Ongoing', 'Investigating'],
    datasets: [
      {
        data: [
          filteredData.filter(agent => agent.status === 'resolved').length,
          filteredData.filter(agent => agent.status === 'ongoing').length,
          filteredData.filter(agent => agent.status === 'investigating').length
        ],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(59, 130, 246, 0.8)'
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
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
        text: 'Downtime by System (Minutes)'
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
        text: 'Incident Severity Distribution'
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
        text: 'Incident Status Distribution'
      }
    }
  }

  const handleExport = (format: 'pdf' | 'excel') => {
    // Mock export functionality
    console.log(`Exporting system downtime report as ${format}`)
    // In a real application, this would generate and download the file
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num)
  }

  const getTotalIncidents = () => {
    return filteredData.length
  }

  const getResolvedIncidents = () => {
    return filteredData.filter(agent => agent.status === 'resolved').length
  }

  const getOngoingIncidents = () => {
    return filteredData.filter(agent => agent.status === 'ongoing').length
  }

  const getCriticalIncidents = () => {
    return filteredData.filter(agent => agent.severity === 'critical').length
  }

  const getTotalDowntime = () => {
    return filteredData.reduce((sum, agent) => sum + agent.duration, 0)
  }

  const getAverageDowntime = () => {
    return filteredData.length > 0 ? 
      (filteredData.reduce((sum, agent) => sum + agent.duration, 0) / filteredData.length).toFixed(1) : 0
  }

  const getTotalAffectedUsers = () => {
    return filteredData.reduce((sum, agent) => sum + agent.affectedUsers, 0)
  }

  const getStatusCount = (status: string) => {
    return filteredData.filter(agent => agent.status === status).length
  }

  const getSeverityCount = (severity: string) => {
    return filteredData.filter(agent => agent.severity === severity).length
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800'
      case 'ongoing':
        return 'bg-yellow-100 text-yellow-800'
      case 'investigating':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
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
                <span className="ml-4 text-gray-900 font-medium">System Downtime Impact Report</span>
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
            <h1 className="text-lg font-semibold text-gray-900">System Downtime Impact Report</h1>
            <p className="mt-1 text-sm text-gray-600">
              Issues faced due to Application or system downtimes
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
            <label className="block text-sm font-medium text-gray-700 mb-2">System</label>
            <select
              value={selectedSystem}
              onChange={(e) => setSelectedSystem(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Systems</option>
              {Array.from(new Set(downtimeData.map(agent => agent.systemName))).map(system => (
                <option key={system} value={system}>{system}</option>
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
              <option value="resolved">Resolved</option>
              <option value="ongoing">Ongoing</option>
              <option value="investigating">Investigating</option>
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
              {Array.from(new Set(downtimeData.map(agent => agent.region))).map(region => (
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
              <p className="text-sm font-medium text-gray-600">Total Incidents</p>
              <p className="text-2xl font-bold text-gray-900">{getTotalIncidents()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-gray-900">{getResolvedIncidents()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Downtime</p>
              <p className="text-2xl font-bold text-gray-900">{getTotalDowntime()}m</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <UserGroupIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Affected Users</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(getTotalAffectedUsers())}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <p className="text-sm font-medium text-gray-600">Ongoing</p>
              <p className="text-2xl font-bold text-yellow-600">{getStatusCount('ongoing')}</p>
            </div>
            <ClockIcon className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Investigating</p>
              <p className="text-2xl font-bold text-blue-600">{getStatusCount('investigating')}</p>
            </div>
            <WrenchScrewdriverIcon className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Downtime by System</h3>
          <Bar data={chartData} options={chartOptions} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Incident Severity Distribution</h3>
          <Doughnut data={severityChartData} options={severityChartOptions} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Incident Status Distribution</h3>
          <Doughnut data={statusChartData} options={statusChartOptions} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Downtime Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Total Incidents</span>
              </div>
              <span className="text-lg font-bold text-gray-900">{getTotalIncidents()}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <ClockIcon className="h-5 w-5 text-yellow-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Total Downtime</span>
              </div>
              <span className="text-lg font-bold text-gray-900">{getTotalDowntime()} minutes</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <ArrowTrendingUpIcon className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Avg Downtime</span>
              </div>
              <span className="text-lg font-bold text-gray-900">{getAverageDowntime()} minutes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Downtime Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">System Downtime Details</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Incident ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  System
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  End Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Affected Users
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((agent) => (
                <tr key={agent.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{agent.incidentId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{agent.systemName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{agent.startTime}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{agent.endTime || 'Ongoing'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">{agent.duration} min</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(agent.severity)}`}>
                      {agent.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(agent.status)}`}>
                      {agent.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatNumber(agent.affectedUsers)}</div>
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
