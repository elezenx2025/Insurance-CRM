'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeftIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  DocumentArrowDownIcon,
  MapPinIcon,
  UserGroupIcon,
  BanknotesIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline'
import { Bar, Line, Doughnut, Pie } from 'react-chartjs-2'
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

interface RevenueData {
  id: string
  agentName: string
  product: string
  region: string
  premium: number
  commission: number
  revenue: number
  date: string
  policyCount: number
  status: 'active' | 'inactive'
}

export default function RevenueContributionReport() {
  const router = useRouter()
  const [revenueData, setRevenueData] = useState<RevenueData[]>([])
  const [filteredData, setFilteredData] = useState<RevenueData[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedAgent, setSelectedAgent] = useState('all')
  const [selectedProduct, setSelectedProduct] = useState('all')
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  })

  // Mock data
  useEffect(() => {
    const mockData: RevenueData[] = [
      {
        id: '1',
        agentName: 'Rajesh Kumar',
        product: 'Life Insurance',
        region: 'Mumbai',
        premium: 2500000,
        commission: 125000,
        revenue: 2500000,
        date: '2024-01-15',
        policyCount: 45,
        status: 'active'
      },
      {
        id: '2',
        agentName: 'Priya Sharma',
        product: 'Health Insurance',
        region: 'Bangalore',
        premium: 1800000,
        commission: 90000,
        revenue: 1800000,
        date: '2024-01-15',
        policyCount: 38,
        status: 'active'
      },
      {
        id: '3',
        agentName: 'Amit Patel',
        product: 'Motor Insurance',
        region: 'Delhi',
        premium: 1200000,
        commission: 60000,
        revenue: 1200000,
        date: '2024-01-15',
        policyCount: 42,
        status: 'active'
      },
      {
        id: '4',
        agentName: 'Sneha Gupta',
        product: 'Life Insurance',
        region: 'Chennai',
        premium: 2200000,
        commission: 110000,
        revenue: 2200000,
        date: '2024-01-14',
        policyCount: 35,
        status: 'active'
      },
      {
        id: '5',
        agentName: 'Vikram Singh',
        product: 'Health Insurance',
        region: 'Pune',
        premium: 1500000,
        commission: 75000,
        revenue: 1500000,
        date: '2024-01-14',
        policyCount: 28,
        status: 'active'
      },
      {
        id: '6',
        agentName: 'Anita Desai',
        product: 'Motor Insurance',
        region: 'Hyderabad',
        premium: 950000,
        commission: 47500,
        revenue: 950000,
        date: '2024-01-13',
        policyCount: 31,
        status: 'active'
      },
      {
        id: '7',
        agentName: 'Rohit Verma',
        product: 'Life Insurance',
        region: 'Kolkata',
        premium: 2800000,
        commission: 140000,
        revenue: 2800000,
        date: '2024-01-13',
        policyCount: 52,
        status: 'active'
      },
      {
        id: '8',
        agentName: 'Kavita Joshi',
        product: 'Health Insurance',
        region: 'Ahmedabad',
        premium: 1650000,
        commission: 82500,
        revenue: 1650000,
        date: '2024-01-12',
        policyCount: 33,
        status: 'active'
      }
    ]
    setRevenueData(mockData)
    setFilteredData(mockData)
  }, [])

  // Filter data based on selected criteria
  useEffect(() => {
    let filtered = revenueData

    if (selectedAgent !== 'all') {
      filtered = filtered.filter(agent => agent.agentName === selectedAgent)
    }

    if (selectedProduct !== 'all') {
      filtered = filtered.filter(agent => agent.product === selectedProduct)
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
  }, [revenueData, selectedAgent, selectedProduct, selectedRegion, dateRange])

  // Chart data
  const chartData = {
    labels: filteredData.map(agent => agent.agentName),
    datasets: [
      {
        label: 'Revenue (₹)',
        data: filteredData.map(agent => agent.revenue / 100000), // Convert to lakhs
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      }
    ]
  }

  const productChartData = {
    labels: ['Life Insurance', 'Health Insurance', 'Motor Insurance'],
    datasets: [
      {
        data: [
          filteredData.filter(agent => agent.product === 'Life Insurance').reduce((sum, agent) => sum + agent.revenue, 0) / 100000,
          filteredData.filter(agent => agent.product === 'Health Insurance').reduce((sum, agent) => sum + agent.revenue, 0) / 100000,
          filteredData.filter(agent => agent.product === 'Motor Insurance').reduce((sum, agent) => sum + agent.revenue, 0) / 100000
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
        borderWidth: 2
      }
    ]
  }

  const regionChartData = {
    labels: Array.from(new Set(filteredData.map(agent => agent.region))),
    datasets: [
      {
        label: 'Revenue by Region (₹ Lakhs)',
        data: Array.from(new Set(filteredData.map(agent => agent.region))).map(region => 
          filteredData.filter(agent => agent.region === region).reduce((sum, agent) => sum + agent.revenue, 0) / 100000
        ),
        backgroundColor: 'rgba(139, 69, 19, 0.8)',
        borderColor: 'rgba(139, 69, 19, 1)',
        borderWidth: 1,
      }
    ]
  }

  const lineChartData = {
    labels: filteredData.map(agent => agent.date),
    datasets: [
      {
        label: 'Revenue Trend (₹ Lakhs)',
        data: filteredData.map(agent => agent.revenue / 100000),
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        tension: 0.4,
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
        text: 'Revenue Contribution by Agent (₹ Lakhs)'
      }
    }
  }

  const productChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Revenue by Product (₹ Lakhs)'
      }
    }
  }

  const regionChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Revenue by Region (₹ Lakhs)'
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
        text: 'Revenue Trend (₹ Lakhs)'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }

  const handleExport = (format: 'pdf' | 'excel') => {
    // Mock export functionality
    console.log(`Exporting revenue contribution report as ${format}`)
    // In a real application, this would generate and download the file
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num)
  }

  const formatLakhs = (num: number) => {
    return `₹${(num / 100000).toFixed(1)}L`
  }

  const getTotalRevenue = () => {
    return filteredData.reduce((sum, agent) => sum + agent.revenue, 0)
  }

  const getTotalCommission = () => {
    return filteredData.reduce((sum, agent) => sum + agent.commission, 0)
  }

  const getAverageRevenue = () => {
    return filteredData.length > 0 ? (getTotalRevenue() / filteredData.length) : 0
  }

  const getTopPerformer = () => {
    if (filteredData.length === 0) return null
    return filteredData.reduce((top, agent) => 
      agent.revenue > top.revenue ? agent : top
    )
  }

  const getProductBreakdown = () => {
    const products = ['Life Insurance', 'Health Insurance', 'Motor Insurance']
    return products.map(product => ({
      product,
      revenue: filteredData.filter(agent => agent.product === product).reduce((sum, agent) => sum + agent.revenue, 0),
      percentage: filteredData.length > 0 ? 
        (filteredData.filter(agent => agent.product === product).reduce((sum, agent) => sum + agent.revenue, 0) / getTotalRevenue() * 100).toFixed(1) : 0
    }))
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
                <span className="ml-4 text-gray-900 font-medium">Revenue & Financial</span>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="text-gray-400">/</span>
                <span className="ml-4 text-gray-900 font-medium">Revenue Contribution Report</span>
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
            <h1 className="text-lg font-semibold text-gray-900">Revenue Contribution Report</h1>
            <p className="mt-1 text-sm text-gray-600">
              Premium breakdown by product, geography, and agent
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Agent</label>
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Agents</option>
              {Array.from(new Set(revenueData.map(agent => agent.agentName))).map(agent => (
                <option key={agent} value={agent}>{agent}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product</label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Products</option>
              {Array.from(new Set(revenueData.map(agent => agent.product))).map(product => (
                <option key={product} value={product}>{product}</option>
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
              {Array.from(new Set(revenueData.map(agent => agent.region))).map(region => (
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
              <CurrencyDollarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatLakhs(getTotalRevenue())}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <BanknotesIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Commission</p>
              <p className="text-2xl font-bold text-gray-900">{formatLakhs(getTotalCommission())}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatLakhs(getAverageRevenue())}</p>
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Agent</h3>
          <Bar data={chartData} options={chartOptions} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Product</h3>
          <Doughnut data={productChartData} options={productChartOptions} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Region</h3>
          <Bar data={regionChartData} options={regionChartOptions} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
          <Line data={lineChartData} options={lineChartOptions} />
        </div>
      </div>

      {/* Product Breakdown */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Revenue Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {getProductBreakdown().map((item, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">{item.product}</span>
                <span className="text-sm font-bold text-gray-900">{item.percentage}%</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{formatLakhs(item.revenue)}</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Revenue Details</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Region
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Premium
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commission
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Policies
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
                    <div className="text-sm font-medium text-gray-900">{agent.agentName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      agent.product === 'Life Insurance' 
                        ? 'bg-blue-100 text-blue-800' 
                        : agent.product === 'Health Insurance'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {agent.product}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{agent.region}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{formatLakhs(agent.premium)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{formatLakhs(agent.commission)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">{formatLakhs(agent.revenue)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{agent.policyCount}</div>
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
