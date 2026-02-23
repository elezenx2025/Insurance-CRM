'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeftIcon,
  MapPinIcon,
  ChartBarIcon,
  DocumentArrowDownIcon,
  UserGroupIcon,
  CalendarIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
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

interface GeographyData {
  id: string
  region: string
  state: string
  city: string
  totalPolicies: number
  totalPremium: number
  activeAgents: number
  customerCount: number
  growthRate: number
  marketShare: number
  topProduct: string
  lastUpdated: string
}

export default function GeographyBusinessReport() {
  const router = useRouter()
  const [geographyData, setGeographyData] = useState<GeographyData[]>([])
  const [filteredData, setFilteredData] = useState<GeographyData[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedState, setSelectedState] = useState('all')
  const [selectedCity, setSelectedCity] = useState('all')
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  })

  // Mock data
  useEffect(() => {
    const mockData: GeographyData[] = [
      {
        id: '1',
        region: 'North',
        state: 'Delhi',
        city: 'New Delhi',
        totalPolicies: 1250,
        totalPremium: 25000000,
        activeAgents: 45,
        customerCount: 1200,
        growthRate: 15.5,
        marketShare: 12.3,
        topProduct: 'Life Insurance',
        lastUpdated: '2024-01-15'
      },
      {
        id: '2',
        region: 'South',
        state: 'Karnataka',
        city: 'Bangalore',
        totalPolicies: 1800,
        totalPremium: 36000000,
        activeAgents: 65,
        customerCount: 1750,
        growthRate: 22.3,
        marketShare: 18.7,
        topProduct: 'Health Insurance',
        lastUpdated: '2024-01-15'
      },
      {
        id: '3',
        region: 'West',
        state: 'Maharashtra',
        city: 'Mumbai',
        totalPolicies: 2200,
        totalPremium: 44000000,
        activeAgents: 85,
        customerCount: 2100,
        growthRate: 18.7,
        marketShare: 25.2,
        topProduct: 'Life Insurance',
        lastUpdated: '2024-01-15'
      },
      {
        id: '4',
        region: 'South',
        state: 'Tamil Nadu',
        city: 'Chennai',
        totalPolicies: 1500,
        totalPremium: 30000000,
        activeAgents: 55,
        customerCount: 1450,
        growthRate: 12.8,
        marketShare: 15.4,
        topProduct: 'Motor Insurance',
        lastUpdated: '2024-01-15'
      },
      {
        id: '5',
        region: 'West',
        state: 'Gujarat',
        city: 'Ahmedabad',
        totalPolicies: 1100,
        totalPremium: 22000000,
        activeAgents: 40,
        customerCount: 1050,
        growthRate: 20.1,
        marketShare: 11.8,
        topProduct: 'Health Insurance',
        lastUpdated: '2024-01-15'
      },
      {
        id: '6',
        region: 'East',
        state: 'West Bengal',
        city: 'Kolkata',
        totalPolicies: 1350,
        totalPremium: 27000000,
        activeAgents: 50,
        customerCount: 1300,
        growthRate: 16.2,
        marketShare: 13.9,
        topProduct: 'Life Insurance',
        lastUpdated: '2024-01-15'
      },
      {
        id: '7',
        region: 'South',
        state: 'Telangana',
        city: 'Hyderabad',
        totalPolicies: 950,
        totalPremium: 19000000,
        activeAgents: 35,
        customerCount: 900,
        growthRate: 14.5,
        marketShare: 9.7,
        topProduct: 'Motor Insurance',
        lastUpdated: '2024-01-15'
      },
      {
        id: '8',
        region: 'West',
        state: 'Maharashtra',
        city: 'Pune',
        totalPolicies: 800,
        totalPremium: 16000000,
        activeAgents: 30,
        customerCount: 750,
        growthRate: 19.3,
        marketShare: 8.2,
        topProduct: 'Health Insurance',
        lastUpdated: '2024-01-15'
      }
    ]
    setGeographyData(mockData)
    setFilteredData(mockData)
  }, [])

  // Filter data based on selected criteria
  useEffect(() => {
    let filtered = geographyData

    if (selectedState !== 'all') {
      filtered = filtered.filter(agent => agent.state === selectedState)
    }

    if (selectedCity !== 'all') {
      filtered = filtered.filter(agent => agent.city === selectedCity)
    }

    if (selectedRegion !== 'all') {
      filtered = filtered.filter(agent => agent.region === selectedRegion)
    }

    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(agent => {
        const agentDate = new Date(agent.lastUpdated)
        const startDate = new Date(dateRange.start)
        const endDate = new Date(dateRange.end)
        return agentDate >= startDate && agentDate <= endDate
      })
    }

    setFilteredData(filtered)
  }, [geographyData, selectedState, selectedCity, selectedRegion, dateRange])

  // Chart data
  const chartData = {
    labels: filteredData.map(agent => agent.city),
    datasets: [
      {
        label: 'Total Premium (₹ Lakhs)',
        data: filteredData.map(agent => agent.totalPremium / 100000),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      }
    ]
  }

  const regionChartData = {
    labels: Array.from(new Set(filteredData.map(agent => agent.region))),
    datasets: [
      {
        data: Array.from(new Set(filteredData.map(agent => agent.region))).map(region => 
          filteredData.filter(agent => agent.region === region).reduce((sum, agent) => sum + agent.totalPolicies, 0)
        ),
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

  const growthChartData = {
    labels: filteredData.map(agent => agent.city),
    datasets: [
      {
        label: 'Growth Rate (%)',
        data: filteredData.map(agent => agent.growthRate),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgba(16, 185, 129, 1)',
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
        text: 'Premium by City (₹ Lakhs)'
      }
    }
  }

  const regionChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Policies by Region'
      }
    }
  }

  const growthChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Growth Rate by City (%)'
      }
    }
  }

  const handleExport = (format: 'pdf' | 'excel') => {
    // Mock export functionality
    console.log(`Exporting geography business report as ${format}`)
    // In a real application, this would generate and download the file
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num)
  }

  const formatLakhs = (num: number) => {
    return `₹${(num / 100000).toFixed(1)}L`
  }

  const getTotalPolicies = () => {
    return filteredData.reduce((sum, agent) => sum + agent.totalPolicies, 0)
  }

  const getTotalPremium = () => {
    return filteredData.reduce((sum, agent) => sum + agent.totalPremium, 0)
  }

  const getTotalAgents = () => {
    return filteredData.reduce((sum, agent) => sum + agent.activeAgents, 0)
  }

  const getTotalCustomers = () => {
    return filteredData.reduce((sum, agent) => sum + agent.customerCount, 0)
  }

  const getAverageGrowthRate = () => {
    return filteredData.length > 0 ? 
      (filteredData.reduce((sum, agent) => sum + agent.growthRate, 0) / filteredData.length).toFixed(1) : 0
  }

  const getTopPerformingCity = () => {
    if (filteredData.length === 0) return null
    return filteredData.reduce((top, agent) => 
      agent.totalPremium > top.totalPremium ? agent : top
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
                <button onClick={() => router.push('/dashboard/reports')} className="ml-4 text-gray-400 hover:text-gray-500">
                  Reports & MIS
                </button>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="text-gray-400">/</span>
                <span className="ml-4 text-gray-900 font-medium">Geographical & Demographic</span>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="text-gray-400">/</span>
                <span className="ml-4 text-gray-900 font-medium">Geography-wise Business Report</span>
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
            <h1 className="text-lg font-semibold text-gray-900">Geography-wise Business Report</h1>
            <p className="mt-1 text-sm text-gray-600">
              Performance across different regions
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Regions</option>
              {Array.from(new Set(geographyData.map(agent => agent.region))).map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All States</option>
              {Array.from(new Set(geographyData.map(agent => agent.state))).map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Cities</option>
              {Array.from(new Set(geographyData.map(agent => agent.city))).map(city => (
                <option key={city} value={city}>{city}</option>
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
              <GlobeAltIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Policies</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(getTotalPolicies())}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Premium</p>
              <p className="text-2xl font-bold text-gray-900">{formatLakhs(getTotalPremium())}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <UserGroupIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Agents</p>
              <p className="text-2xl font-bold text-gray-900">{getTotalAgents()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <ArrowTrendingUpIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Growth Rate</p>
              <p className="text-2xl font-bold text-gray-900">{getAverageGrowthRate()}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performer */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing City</h3>
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
          <div className="flex items-center">
            <MapPinIcon className="h-8 w-8 text-blue-600 mr-4" />
            <div>
              <p className="text-lg font-bold text-gray-900">{getTopPerformingCity()?.city}</p>
              <p className="text-sm text-gray-600">{getTopPerformingCity()?.state}, {getTopPerformingCity()?.region}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">{formatLakhs(getTopPerformingCity()?.totalPremium || 0)}</p>
            <p className="text-sm text-gray-600">Total Premium</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Premium by City</h3>
          <Bar data={chartData} options={chartOptions} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Policies by Region</h3>
          <Doughnut data={regionChartData} options={regionChartOptions} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Growth Rate by City</h3>
          <Bar data={growthChartData} options={growthChartOptions} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Geographic Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <GlobeAltIcon className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Total Policies</span>
              </div>
              <span className="text-lg font-bold text-gray-900">{formatNumber(getTotalPolicies())}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <CurrencyDollarIcon className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Total Premium</span>
              </div>
              <span className="text-lg font-bold text-gray-900">{formatLakhs(getTotalPremium())}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <UserGroupIcon className="h-5 w-5 text-purple-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Total Customers</span>
              </div>
              <span className="text-lg font-bold text-gray-900">{formatNumber(getTotalCustomers())}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Geography Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Geographic Performance Details</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  City
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  State
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Region
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Policies
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Premium
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agents
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customers
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Growth Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Market Share
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((agent) => (
                <tr key={agent.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{agent.city}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{agent.state}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      agent.region === 'North' 
                        ? 'bg-blue-100 text-blue-800' 
                        : agent.region === 'South'
                        ? 'bg-green-100 text-green-800'
                        : agent.region === 'West'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {agent.region}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">{formatNumber(agent.totalPolicies)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">{formatLakhs(agent.totalPremium)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{agent.activeAgents}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatNumber(agent.customerCount)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">{agent.growthRate}%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{agent.marketShare}%</div>
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
