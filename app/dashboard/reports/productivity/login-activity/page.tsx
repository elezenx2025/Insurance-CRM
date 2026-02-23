'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeftIcon,
  ChartBarIcon,
  UserGroupIcon,
  ClockIcon,
  ComputerDesktopIcon,
  DocumentArrowDownIcon,
  CalendarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
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

interface LoginData {
  id: string
  agentName: string
  date: string
  loginTime: string
  logoutTime: string
  sessionDuration: number
  platform: string
  region: string
  status: 'active' | 'inactive'
  lastActivity: string
}

export default function LoginActivityReport() {
  const router = useRouter()
  const [loginData, setLoginData] = useState<LoginData[]>([])
  const [filteredData, setFilteredData] = useState<LoginData[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState('week')
  const [selectedAgent, setSelectedAgent] = useState('all')
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  })

  // Mock data
  useEffect(() => {
    const mockData: LoginData[] = [
      {
        id: '1',
        agentName: 'Rajesh Kumar',
        date: '2024-01-15',
        loginTime: '09:00',
        logoutTime: '18:30',
        sessionDuration: 570, // minutes
        platform: 'Desktop',
        region: 'Mumbai',
        status: 'active',
        lastActivity: '18:25'
      },
      {
        id: '2',
        agentName: 'Priya Sharma',
        date: '2024-01-15',
        loginTime: '08:45',
        logoutTime: '17:15',
        sessionDuration: 510,
        platform: 'Mobile',
        region: 'Bangalore',
        status: 'active',
        lastActivity: '17:10'
      },
      {
        id: '3',
        agentName: 'Amit Patel',
        date: '2024-01-15',
        loginTime: '09:15',
        logoutTime: '19:00',
        sessionDuration: 585,
        platform: 'Desktop',
        region: 'Delhi',
        status: 'active',
        lastActivity: '18:55'
      },
      {
        id: '4',
        agentName: 'Sneha Gupta',
        date: '2024-01-14',
        loginTime: '08:30',
        logoutTime: '18:45',
        sessionDuration: 615,
        platform: 'Desktop',
        region: 'Chennai',
        status: 'active',
        lastActivity: '18:40'
      },
      {
        id: '5',
        agentName: 'Vikram Singh',
        date: '2024-01-14',
        loginTime: '09:30',
        logoutTime: '17:45',
        sessionDuration: 495,
        platform: 'Mobile',
        region: 'Pune',
        status: 'active',
        lastActivity: '17:40'
      },
      {
        id: '6',
        agentName: 'Anita Desai',
        date: '2024-01-13',
        loginTime: '08:15',
        logoutTime: '19:30',
        sessionDuration: 675,
        platform: 'Desktop',
        region: 'Hyderabad',
        status: 'active',
        lastActivity: '19:25'
      },
      {
        id: '7',
        agentName: 'Rohit Verma',
        date: '2024-01-13',
        loginTime: '09:45',
        logoutTime: '18:15',
        sessionDuration: 510,
        platform: 'Mobile',
        region: 'Kolkata',
        status: 'active',
        lastActivity: '18:10'
      },
      {
        id: '8',
        agentName: 'Kavita Joshi',
        date: '2024-01-12',
        loginTime: '08:00',
        logoutTime: '17:30',
        sessionDuration: 570,
        platform: 'Desktop',
        region: 'Ahmedabad',
        status: 'active',
        lastActivity: '17:25'
      }
    ]
    setLoginData(mockData)
    setFilteredData(mockData)
  }, [])

  // Filter data based on selected criteria
  useEffect(() => {
    let filtered = loginData

    if (selectedAgent !== 'all') {
      filtered = filtered.filter(agent => agent.agentName === selectedAgent)
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
  }, [loginData, selectedAgent, selectedRegion, dateRange])

  // Chart data
  const chartData = {
    labels: filteredData.map(agent => agent.agentName),
    datasets: [
      {
        label: 'Session Duration (hours)',
        data: filteredData.map(agent => agent.sessionDuration / 60),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      }
    ]
  }

  const lineChartData = {
    labels: filteredData.map(agent => agent.date),
    datasets: [
      {
        label: 'Average Session Duration (hours)',
        data: filteredData.map(agent => agent.sessionDuration / 60),
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        tension: 0.4,
      }
    ]
  }

  const doughnutData = {
    labels: ['Desktop', 'Mobile'],
    datasets: [
      {
        data: [
          filteredData.filter(agent => agent.platform === 'Desktop').length,
          filteredData.filter(agent => agent.platform === 'Mobile').length
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)'
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)'
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
        text: 'Agent Login Session Duration'
      }
    }
  }

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Session Duration Trend'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Platform Usage Distribution'
      }
    }
  }

  const handleExport = (format: 'pdf' | 'excel') => {
    // Mock export functionality
    console.log(`Exporting login activity report as ${format}`)
    // In a real application, this would generate and download the file
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num)
  }

  const getTotalSessionTime = () => {
    return filteredData.reduce((sum, agent) => sum + agent.sessionDuration, 0)
  }

  const getAverageSessionTime = () => {
    return filteredData.length > 0 ? (getTotalSessionTime() / filteredData.length / 60).toFixed(1) : 0
  }

  const getTopPerformer = () => {
    if (filteredData.length === 0) return null
    return filteredData.reduce((top, agent) => 
      agent.sessionDuration > top.sessionDuration ? agent : top
    )
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
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
                <span className="ml-4 text-gray-900 font-medium">Productivity & Activity</span>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="text-gray-400">/</span>
                <span className="ml-4 text-gray-900 font-medium">Login Activity Report</span>
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
            <h1 className="text-lg font-semibold text-gray-900">Agent Login Activity Report</h1>
            <p className="mt-1 text-sm text-gray-600">
              Monitor agent engagement with the sales platform and CRM system
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              {Array.from(new Set(loginData.map(agent => agent.agentName))).map(agent => (
                <option key={agent} value={agent}>{agent}</option>
              ))}
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
              {Array.from(new Set(loginData.map(agent => agent.region))).map(region => (
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
              <p className="text-sm font-medium text-gray-600">Total Session Time</p>
              <p className="text-2xl font-bold text-gray-900">{formatDuration(getTotalSessionTime())}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Session Time</p>
              <p className="text-2xl font-bold text-gray-900">{getAverageSessionTime()}h</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Sessions</p>
              <p className="text-2xl font-bold text-gray-900">{filteredData.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <UserGroupIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Top Performer</p>
              <p className="text-lg font-bold text-gray-900">{getTopPerformer()?.agentName || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Duration by Agent</h3>
          <Bar data={chartData} options={chartOptions} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Duration Trend</h3>
          <Line data={lineChartData} options={lineChartOptions} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Usage Distribution</h3>
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Login Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <ComputerDesktopIcon className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Desktop Logins</span>
              </div>
              <span className="text-lg font-bold text-gray-900">
                {filteredData.filter(agent => agent.platform === 'Desktop').length}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <ClockIcon className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Mobile Logins</span>
              </div>
              <span className="text-lg font-bold text-gray-900">
                {filteredData.filter(agent => agent.platform === 'Mobile').length}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Longest Session</span>
              </div>
              <span className="text-lg font-bold text-gray-900">
                {formatDuration(Math.max(...filteredData.map(agent => agent.sessionDuration)))}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Login Activity Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Login Activity Details</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Login Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Logout Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Platform
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Region
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
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
                    <div className="text-sm text-gray-900">{agent.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{agent.loginTime}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{agent.logoutTime}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{formatDuration(agent.sessionDuration)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      agent.platform === 'Desktop' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {agent.platform}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{agent.region}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      agent.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {agent.status}
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
