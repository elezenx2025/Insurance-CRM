'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeftIcon,
  ChartPieIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  DocumentArrowDownIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  EyeIcon,
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

interface ConversionData {
  agentId: string
  agentName: string
  region: string
  leadsGenerated: number
  policiesSold: number
  conversionRate: number
  averageLeadValue: number
  averagePolicyValue: number
  timeToConvert: number // in days
  followUpCalls: number
  lastFollowUp: string
}

interface ConversionTrend {
  period: string
  leadsGenerated: number
  policiesSold: number
  conversionRate: number
}

interface LeadSource {
  source: string
  leads: number
  conversions: number
  conversionRate: number
  averageValue: number
}

export default function ConversionAnalysisReport() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('monthly')
  const [selectedAgent, setSelectedAgent] = useState('all')
  const [conversionData, setConversionData] = useState<ConversionData[]>([])
  const [conversionTrends, setConversionTrends] = useState<ConversionTrend[]>([])
  const [leadSources, setLeadSources] = useState<LeadSource[]>([])

  useEffect(() => {
    fetchConversionData()
  }, [selectedPeriod, selectedAgent])

  const fetchConversionData = async () => {
    try {
      setLoading(true)
      
      // Mock data - replace with actual API calls
      const mockConversionData: ConversionData[] = [
        {
          agentId: '1',
          agentName: 'Rajesh Kumar',
          region: 'Mumbai',
          leadsGenerated: 120,
          policiesSold: 45,
          conversionRate: 37.5,
          averageLeadValue: 45000,
          averagePolicyValue: 55556,
          timeToConvert: 7.2,
          followUpCalls: 8,
          lastFollowUp: '2024-01-15',
        },
        {
          agentId: '2',
          agentName: 'Priya Sharma',
          region: 'Bangalore',
          leadsGenerated: 95,
          policiesSold: 38,
          conversionRate: 40.0,
          averageLeadValue: 52000,
          averagePolicyValue: 57895,
          timeToConvert: 6.8,
          followUpCalls: 6,
          lastFollowUp: '2024-01-14',
        },
        {
          agentId: '3',
          agentName: 'Amit Patel',
          region: 'Delhi',
          leadsGenerated: 110,
          policiesSold: 42,
          conversionRate: 38.2,
          averageLeadValue: 48000,
          averagePolicyValue: 46429,
          timeToConvert: 8.1,
          followUpCalls: 9,
          lastFollowUp: '2024-01-13',
        },
        {
          agentId: '4',
          agentName: 'Sneha Singh',
          region: 'Chennai',
          leadsGenerated: 85,
          policiesSold: 35,
          conversionRate: 41.2,
          averageLeadValue: 43000,
          averagePolicyValue: 51429,
          timeToConvert: 6.5,
          followUpCalls: 5,
          lastFollowUp: '2024-01-12',
        },
        {
          agentId: '5',
          agentName: 'Vikram Reddy',
          region: 'Hyderabad',
          leadsGenerated: 78,
          policiesSold: 32,
          conversionRate: 41.0,
          averageLeadValue: 41000,
          averagePolicyValue: 51563,
          timeToConvert: 7.8,
          followUpCalls: 7,
          lastFollowUp: '2024-01-11',
        },
      ]

      const mockConversionTrends: ConversionTrend[] = [
        { period: 'Jan', leadsGenerated: 450, policiesSold: 180, conversionRate: 40.0 },
        { period: 'Feb', leadsGenerated: 520, policiesSold: 195, conversionRate: 37.5 },
        { period: 'Mar', leadsGenerated: 480, policiesSold: 200, conversionRate: 41.7 },
        { period: 'Apr', leadsGenerated: 550, policiesSold: 220, conversionRate: 40.0 },
        { period: 'May', leadsGenerated: 600, policiesSold: 240, conversionRate: 40.0 },
        { period: 'Jun', leadsGenerated: 580, policiesSold: 235, conversionRate: 40.5 },
      ]

      const mockLeadSources: LeadSource[] = [
        {
          source: 'Website',
          leads: 320,
          conversions: 128,
          conversionRate: 40.0,
          averageValue: 52000,
        },
        {
          source: 'Referrals',
          leads: 180,
          conversions: 90,
          conversionRate: 50.0,
          averageValue: 58000,
        },
        {
          source: 'Social Media',
          leads: 150,
          conversions: 45,
          conversionRate: 30.0,
          averageValue: 45000,
        },
        {
          source: 'Cold Calling',
          leads: 200,
          conversions: 60,
          conversionRate: 30.0,
          averageValue: 48000,
        },
        {
          source: 'Walk-ins',
          leads: 100,
          conversions: 50,
          conversionRate: 50.0,
          averageValue: 55000,
        },
      ]

      setConversionData(mockConversionData)
      setConversionTrends(mockConversionTrends)
      setLeadSources(mockLeadSources)
    } catch (error) {
      console.error('Error fetching conversion data:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportReport = (format: 'pdf' | 'excel' | 'csv') => {
    // Implement export functionality
    console.log(`Exporting conversion analysis report as ${format}`)
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
  const conversionTrendsChartData = {
    labels: conversionTrends.map(trend => trend.period),
    datasets: [
      {
        label: 'Leads Generated',
        data: conversionTrends.map(trend => trend.leadsGenerated),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
      {
        label: 'Policies Sold',
        data: conversionTrends.map(trend => trend.policiesSold),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
    ],
  }

  const conversionRateChartData = {
    labels: conversionTrends.map(trend => trend.period),
    datasets: [
      {
        label: 'Conversion Rate (%)',
        data: conversionTrends.map(trend => trend.conversionRate),
        backgroundColor: 'rgba(168, 85, 247, 0.8)',
        borderColor: 'rgba(168, 85, 247, 1)',
        borderWidth: 2,
        fill: false,
      },
    ],
  }

  const leadSourceChartData = {
    labels: leadSources.map(source => source.source),
    datasets: [
      {
        label: 'Conversion Rate (%)',
        data: leadSources.map(source => source.conversionRate),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(168, 85, 247, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
        ],
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
        text: 'Leads vs Conversions Trend',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  const rateChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Conversion Rate Trend',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value: any) {
            return value + '%'
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
                <span className="ml-4 text-gray-900 font-medium">Conversion Rate Analysis</span>
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
            <h1 className="text-lg font-semibold text-gray-900">Conversion Rate Analysis</h1>
            <p className="mt-1 text-sm text-gray-600">
              Analysis of leads generated vs policies sold and conversion performance.
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              {conversionData.map(agent => (
                <option key={agent.agentId} value={agent.agentId}>{agent.agentName}</option>
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
              <UserGroupIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Leads</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(conversionData.reduce((sum, agent) => sum + agent.leadsGenerated, 0))}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <ChartPieIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Conversions</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(conversionData.reduce((sum, agent) => sum + agent.policiesSold, 0))}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <ArrowTrendingUpIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {(conversionData.reduce((sum, agent) => sum + agent.conversionRate, 0) / conversionData.length).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <EyeIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Time to Convert</p>
              <p className="text-2xl font-bold text-gray-900">
                {(conversionData.reduce((sum, agent) => sum + agent.timeToConvert, 0) / conversionData.length).toFixed(1)} days
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Leads vs Conversions Trend</h3>
          <div className="h-80">
            <Bar data={conversionTrendsChartData} options={chartOptions} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Rate Trend</h3>
          <div className="h-80">
            <Line data={conversionRateChartData} options={rateChartOptions} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion by Lead Source</h3>
          <div className="h-80">
            <Doughnut data={leadSourceChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Source Performance</h3>
          <div className="space-y-4">
            {leadSources.map((source, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{source.source}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    source.conversionRate >= 40 ? 'bg-green-100 text-green-800' :
                    source.conversionRate >= 30 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {source.conversionRate}%
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <p>Leads: {formatNumber(source.leads)}</p>
                    <p>Conversions: {formatNumber(source.conversions)}</p>
                  </div>
                  <div>
                    <p>Avg Value: {formatCurrency(source.averageValue)}</p>
                    <p>Total Value: {formatCurrency(source.conversions * source.averageValue)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Agent Conversion Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-head">Agent</th>
                <th className="table-head">Region</th>
                <th className="table-head">Leads Generated</th>
                <th className="table-head">Policies Sold</th>
                <th className="table-head">Conversion Rate</th>
                <th className="table-head">Avg Lead Value</th>
                <th className="table-head">Avg Policy Value</th>
                <th className="table-head">Time to Convert</th>
                <th className="table-head">Follow-up Calls</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {conversionData.map((agent) => (
                <tr key={agent.agentId} className="table-row">
                  <td className="table-cell font-medium">{agent.agentName}</td>
                  <td className="table-cell">{agent.region}</td>
                  <td className="table-cell">{formatNumber(agent.leadsGenerated)}</td>
                  <td className="table-cell">{formatNumber(agent.policiesSold)}</td>
                  <td className="table-cell">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      agent.conversionRate >= 40 ? 'bg-green-100 text-green-800' :
                      agent.conversionRate >= 35 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {agent.conversionRate}%
                    </span>
                  </td>
                  <td className="table-cell">{formatCurrency(agent.averageLeadValue)}</td>
                  <td className="table-cell">{formatCurrency(agent.averagePolicyValue)}</td>
                  <td className="table-cell">{agent.timeToConvert} days</td>
                  <td className="table-cell">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {agent.followUpCalls} calls
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
