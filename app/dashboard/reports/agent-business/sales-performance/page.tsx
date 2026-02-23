'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeftIcon,
  ChartBarIcon,
  DocumentArrowDownIcon,
  CalendarIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline'
import { Bar, Line, Pie } from 'react-chartjs-2'
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

interface AgentPerformance {
  id: string
  name: string
  region: string
  totalPremium: number
  policiesSold: number
  averagePolicyValue: number
  conversionRate: number
  targetAchievement: number
  rank: number
}

interface ProductPerformance {
  productName: string
  premium: number
  policies: number
  growth: number
}

interface RegionPerformance {
  region: string
  premium: number
  policies: number
  agents: number
}

export default function SalesPerformanceReport() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('monthly')
  const [selectedAgent, setSelectedAgent] = useState('all')
  const [selectedRegion, setSelectedRegion] = useState('all')

  const [agentPerformance, setAgentPerformance] = useState<AgentPerformance[]>([])
  const [productPerformance, setProductPerformance] = useState<ProductPerformance[]>([])
  const [regionPerformance, setRegionPerformance] = useState<RegionPerformance[]>([])

  useEffect(() => {
    fetchReportData()
  }, [selectedPeriod, selectedAgent, selectedRegion])

  const fetchReportData = async () => {
    try {
      setLoading(true)
      
      // Mock data - replace with actual API calls
      const mockAgentPerformance: AgentPerformance[] = [
        {
          id: '1',
          name: 'Rajesh Kumar',
          region: 'Mumbai',
          totalPremium: 2500000,
          policiesSold: 45,
          averagePolicyValue: 55556,
          conversionRate: 78.5,
          targetAchievement: 125.3,
          rank: 1,
        },
        {
          id: '2',
          name: 'Priya Sharma',
          region: 'Bangalore',
          totalPremium: 2200000,
          policiesSold: 38,
          averagePolicyValue: 57895,
          conversionRate: 72.1,
          targetAchievement: 118.7,
          rank: 2,
        },
        {
          id: '3',
          name: 'Amit Patel',
          region: 'Delhi',
          totalPremium: 1950000,
          policiesSold: 42,
          averagePolicyValue: 46429,
          conversionRate: 68.9,
          targetAchievement: 102.4,
          rank: 3,
        },
        {
          id: '4',
          name: 'Sneha Singh',
          region: 'Chennai',
          totalPremium: 1800000,
          policiesSold: 35,
          averagePolicyValue: 51429,
          conversionRate: 65.2,
          targetAchievement: 95.8,
          rank: 4,
        },
        {
          id: '5',
          name: 'Vikram Reddy',
          region: 'Hyderabad',
          totalPremium: 1650000,
          policiesSold: 32,
          averagePolicyValue: 51563,
          conversionRate: 61.8,
          targetAchievement: 89.2,
          rank: 5,
        },
      ]

      const mockProductPerformance: ProductPerformance[] = [
        {
          productName: 'Life Insurance',
          premium: 3200000,
          policies: 85,
          growth: 15.2,
        },
        {
          productName: 'Motor Insurance',
          premium: 2800000,
          policies: 120,
          growth: 8.7,
        },
        {
          productName: 'Health Insurance',
          premium: 2100000,
          policies: 65,
          growth: 22.1,
        },
        {
          productName: 'Travel Insurance',
          premium: 450000,
          policies: 180,
          growth: -5.3,
        },
        {
          productName: 'Home Insurance',
          premium: 380000,
          policies: 25,
          growth: 12.8,
        },
      ]

      const mockRegionPerformance: RegionPerformance[] = [
        {
          region: 'Mumbai',
          premium: 4500000,
          policies: 95,
          agents: 12,
        },
        {
          region: 'Bangalore',
          premium: 3800000,
          policies: 78,
          agents: 10,
        },
        {
          region: 'Delhi',
          premium: 3200000,
          policies: 65,
          agents: 8,
        },
        {
          region: 'Chennai',
          premium: 2800000,
          policies: 58,
          agents: 7,
        },
        {
          region: 'Hyderabad',
          premium: 2500000,
          policies: 52,
          agents: 6,
        },
      ]

      setAgentPerformance(mockAgentPerformance)
      setProductPerformance(mockProductPerformance)
      setRegionPerformance(mockRegionPerformance)
    } catch (error) {
      console.error('Error fetching report data:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportReport = (format: 'pdf' | 'excel' | 'csv') => {
    // Implement export functionality
    console.log(`Exporting report as ${format}`)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num)
  }

  // Chart data
  const agentPerformanceChartData = {
    labels: agentPerformance.map(agent => agent.name),
    datasets: [
      {
        label: 'Total Premium (₹)',
        data: agentPerformance.map(agent => agent.totalPremium),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  }

  const productPerformanceChartData = {
    labels: productPerformance.map(product => product.productName),
    datasets: [
      {
        label: 'Premium (₹)',
        data: productPerformance.map(product => product.premium),
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(168, 85, 247, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }

  const regionPerformanceChartData = {
    labels: regionPerformance.map(region => region.region),
    datasets: [
      {
        label: 'Premium (₹)',
        data: regionPerformance.map(region => region.premium),
        backgroundColor: 'rgba(168, 85, 247, 0.8)',
        borderColor: 'rgba(168, 85, 247, 1)',
        borderWidth: 1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Agent Sales Performance',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return formatCurrency(value)
          },
        },
      },
    },
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
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
                <button onClick={() => router.push('/dashboard/reports')} className="ml-4 text-gray-400 hover:text-gray-500">
                  Agent Business Monitoring
                </button>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="text-gray-400">/</span>
                <span className="ml-4 text-gray-900 font-medium">Sales Performance Report</span>
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
            <h1 className="text-lg font-semibold text-gray-900">Agent Sales Performance Report</h1>
            <p className="mt-1 text-sm text-gray-600">
              Comprehensive analysis of agent sales performance, premium collection, and policy sales.
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => exportReport('pdf')}
            className="btn btn-secondary btn-md"
          >
            <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
            Export PDF
          </button>
          <button
            onClick={() => exportReport('excel')}
            className="btn btn-primary btn-md"
          >
            <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
            Export Excel
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Period
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="input"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Agent
            </label>
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="input"
            >
              <option value="all">All Agents</option>
              {agentPerformance.map(agent => (
                <option key={agent.id} value={agent.id}>{agent.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Region
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="input"
            >
              <option value="all">All Regions</option>
              {regionPerformance.map(region => (
                <option key={region.region} value={region.region}>{region.region}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <div className="flex space-x-2">
              <input type="date" className="input flex-1" />
              <span className="flex items-center text-gray-500">to</span>
              <input type="date" className="input flex-1" />
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
              <p className="text-sm font-medium text-gray-600">Total Premium</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(agentPerformance.reduce((sum, agent) => sum + agent.totalPremium, 0))}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Policies</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(agentPerformance.reduce((sum, agent) => sum + agent.policiesSold, 0))}
              </p>
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
              <p className="text-2xl font-bold text-gray-900">{agentPerformance.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <BuildingOfficeIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Conversion</p>
              <p className="text-2xl font-bold text-gray-900">
                {(agentPerformance.reduce((sum, agent) => sum + agent.conversionRate, 0) / agentPerformance.length).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent Performance by Premium</h3>
          <div className="h-80">
            <Bar data={agentPerformanceChartData} options={chartOptions} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Product-wise Premium Distribution</h3>
          <div className="h-80">
            <Pie data={productPerformanceChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Region-wise Performance</h3>
        <div className="h-80">
          <Bar data={regionPerformanceChartData} options={chartOptions} />
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Agent Performance Details</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-head">Rank</th>
                <th className="table-head">Agent Name</th>
                <th className="table-head">Region</th>
                <th className="table-head">Total Premium</th>
                <th className="table-head">Policies Sold</th>
                <th className="table-head">Avg Policy Value</th>
                <th className="table-head">Conversion Rate</th>
                <th className="table-head">Target Achievement</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {agentPerformance.map((agent) => (
                <tr key={agent.id} className="table-row">
                  <td className="table-cell">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      agent.rank <= 3 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      #{agent.rank}
                    </span>
                  </td>
                  <td className="table-cell font-medium">{agent.name}</td>
                  <td className="table-cell">{agent.region}</td>
                  <td className="table-cell font-medium">{formatCurrency(agent.totalPremium)}</td>
                  <td className="table-cell">{formatNumber(agent.policiesSold)}</td>
                  <td className="table-cell">{formatCurrency(agent.averagePolicyValue)}</td>
                  <td className="table-cell">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      agent.conversionRate >= 70 ? 'bg-green-100 text-green-800' :
                      agent.conversionRate >= 60 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {agent.conversionRate}%
                    </span>
                  </td>
                  <td className="table-cell">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      agent.targetAchievement >= 100 ? 'bg-green-100 text-green-800' :
                      agent.targetAchievement >= 80 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {agent.targetAchievement}%
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
