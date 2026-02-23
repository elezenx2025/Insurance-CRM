'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeftIcon,
  TrophyIcon,
  StarIcon,
  DocumentArrowDownIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline'
import { Bar, Line } from 'react-chartjs-2'
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
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
)

interface TopPerformer {
  id: string
  name: string
  region: string
  rank: number
  totalSales: number
  totalPremium: number
  policiesSold: number
  conversionRate: number
  averagePolicyValue: number
  targetAchievement: number
  growthRate: number
  performanceScore: number
  awards: string[]
  achievements: string[]
}

interface PerformanceMetric {
  metric: string
  value: number
  unit: string
  trend: 'up' | 'down' | 'stable'
  change: number
}

export default function TopPerformersReport() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('monthly')
  const [selectedRanking, setSelectedRanking] = useState('premium')
  const [topPerformers, setTopPerformers] = useState<TopPerformer[]>([])
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([])

  useEffect(() => {
    fetchTopPerformersData()
  }, [selectedPeriod, selectedRanking])

  const fetchTopPerformersData = async () => {
    try {
      setLoading(true)
      
      // Mock data - replace with actual API calls
      const mockTopPerformers: TopPerformer[] = [
        {
          id: '1',
          name: 'Rajesh Kumar',
          region: 'Mumbai',
          rank: 1,
          totalSales: 2500000,
          totalPremium: 2500000,
          policiesSold: 45,
          conversionRate: 78.5,
          averagePolicyValue: 55556,
          targetAchievement: 125.3,
          growthRate: 15.2,
          performanceScore: 95.8,
          awards: ['Top Performer', 'Sales Champion', 'Customer Excellence'],
          achievements: ['Exceeded target by 25%', 'Highest conversion rate', 'Zero complaints'],
        },
        {
          id: '2',
          name: 'Priya Sharma',
          region: 'Bangalore',
          rank: 2,
          totalSales: 2200000,
          totalPremium: 2200000,
          policiesSold: 38,
          conversionRate: 72.1,
          averagePolicyValue: 57895,
          targetAchievement: 118.7,
          growthRate: 12.8,
          performanceScore: 92.3,
          awards: ['Sales Excellence', 'Customer Satisfaction'],
          achievements: ['Consistent performer', 'High customer retention'],
        },
        {
          id: '3',
          name: 'Amit Patel',
          region: 'Delhi',
          rank: 3,
          totalSales: 1950000,
          totalPremium: 1950000,
          policiesSold: 42,
          conversionRate: 68.9,
          averagePolicyValue: 46429,
          targetAchievement: 102.4,
          growthRate: 8.7,
          performanceScore: 88.9,
          awards: ['Rising Star'],
          achievements: ['Fastest growing agent', 'New market penetration'],
        },
        {
          id: '4',
          name: 'Sneha Singh',
          region: 'Chennai',
          rank: 4,
          totalSales: 1800000,
          totalPremium: 1800000,
          policiesSold: 35,
          conversionRate: 65.2,
          averagePolicyValue: 51429,
          targetAchievement: 95.8,
          growthRate: 6.4,
          performanceScore: 85.2,
          awards: ['Consistent Performer'],
          achievements: ['Steady growth', 'Reliable performance'],
        },
        {
          id: '5',
          name: 'Vikram Reddy',
          region: 'Hyderabad',
          rank: 5,
          totalSales: 1650000,
          totalPremium: 1650000,
          policiesSold: 32,
          conversionRate: 61.8,
          averagePolicyValue: 51563,
          targetAchievement: 89.2,
          growthRate: 4.1,
          performanceScore: 82.1,
          awards: ['Team Player'],
          achievements: ['Strong team collaboration', 'Mentor to new agents'],
        },
      ]

      const mockPerformanceMetrics: PerformanceMetric[] = [
        {
          metric: 'Total Premium Generated',
          value: 10100000,
          unit: 'INR',
          trend: 'up',
          change: 12.5,
        },
        {
          metric: 'Average Conversion Rate',
          value: 69.3,
          unit: '%',
          trend: 'up',
          change: 3.2,
        },
        {
          metric: 'Total Policies Sold',
          value: 192,
          unit: 'policies',
          trend: 'up',
          change: 8.7,
        },
        {
          metric: 'Average Performance Score',
          value: 88.9,
          unit: 'points',
          trend: 'up',
          change: 5.1,
        },
      ]

      setTopPerformers(mockTopPerformers)
      setPerformanceMetrics(mockPerformanceMetrics)
    } catch (error) {
      console.error('Error fetching top performers data:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportReport = (format: 'pdf' | 'excel' | 'csv') => {
    // Implement export functionality
    console.log(`Exporting top performers report as ${format}`)
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

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <TrophyIcon className="h-6 w-6 text-yellow-500" />
      case 2:
        return <StarIcon className="h-6 w-6 text-gray-400" />
      case 3:
        return <StarIcon className="h-6 w-6 text-amber-600" />
      default:
        return <StarIcon className="h-6 w-6 text-blue-500" />
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-100 text-yellow-800'
      case 2:
        return 'bg-gray-100 text-gray-800'
      case 3:
        return 'bg-amber-100 text-amber-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  // Chart data
  const performersChartData = {
    labels: topPerformers.map(performer => performer.name),
    datasets: [
      {
        label: 'Total Premium (₹)',
        data: topPerformers.map(performer => performer.totalPremium),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  }

  const performanceScoreChartData = {
    labels: topPerformers.map(performer => performer.name),
    datasets: [
      {
        label: 'Performance Score',
        data: topPerformers.map(performer => performer.performanceScore),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 2,
        fill: false,
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
        text: 'Top Performers - Premium Generated',
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

  const scoreChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Performance Scores',
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
                <span className="ml-4 text-gray-900 font-medium">Top Performers Report</span>
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
            <h1 className="text-lg font-semibold text-gray-900">Top Performers Report</h1>
            <p className="mt-1 text-sm text-gray-600">
              Ranking of agents based on sales volume, value, and performance metrics.
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
              Ranking Criteria
            </label>
            <select
              value={selectedRanking}
              onChange={(e) => setSelectedRanking(e.target.value)}
              className="input"
            >
              <option value="premium">By Premium</option>
              <option value="policies">By Policies Sold</option>
              <option value="conversion">By Conversion Rate</option>
              <option value="score">By Performance Score</option>
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

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics.map((metric, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.metric}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {metric.unit === 'INR' ? formatCurrency(metric.value) : 
                   metric.unit === '%' ? `${metric.value}%` :
                   metric.unit === 'points' ? `${metric.value}` :
                   formatNumber(metric.value)}
                </p>
              </div>
              <div className={`p-2 rounded-full ${
                metric.trend === 'up' ? 'bg-green-100' :
                metric.trend === 'down' ? 'bg-red-100' : 'bg-gray-100'
              }`}>
                <ChartBarIcon className={`h-6 w-6 ${
                  metric.trend === 'up' ? 'text-green-600' :
                  metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`} />
              </div>
            </div>
            <div className="mt-2">
              <span className={`text-sm font-medium ${
                metric.trend === 'up' ? 'text-green-600' :
                metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {metric.trend === 'up' ? '+' : metric.trend === 'down' ? '-' : ''}{metric.change}% from last period
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers - Premium Generated</h3>
          <div className="h-80">
            <Bar data={performersChartData} options={chartOptions} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Scores</h3>
          <div className="h-80">
            <Line data={performanceScoreChartData} options={scoreChartOptions} />
          </div>
        </div>
      </div>

      {/* Top Performers Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Top Performers Ranking</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-head">Rank</th>
                <th className="table-head">Agent</th>
                <th className="table-head">Region</th>
                <th className="table-head">Total Premium</th>
                <th className="table-head">Policies Sold</th>
                <th className="table-head">Conversion Rate</th>
                <th className="table-head">Performance Score</th>
                <th className="table-head">Growth Rate</th>
                <th className="table-head">Awards</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {topPerformers.map((performer) => (
                <tr key={performer.id} className="table-row">
                  <td className="table-cell">
                    <div className="flex items-center">
                      {getRankIcon(performer.rank)}
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getRankColor(performer.rank)}`}>
                        #{performer.rank}
                      </span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div>
                      <p className="font-medium text-gray-900">{performer.name}</p>
                      <p className="text-sm text-gray-500">{performer.region}</p>
                    </div>
                  </td>
                  <td className="table-cell">{performer.region}</td>
                  <td className="table-cell font-medium">{formatCurrency(performer.totalPremium)}</td>
                  <td className="table-cell">{formatNumber(performer.policiesSold)}</td>
                  <td className="table-cell">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      performer.conversionRate >= 70 ? 'bg-green-100 text-green-800' :
                      performer.conversionRate >= 60 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {performer.conversionRate}%
                    </span>
                  </td>
                  <td className="table-cell">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      performer.performanceScore >= 90 ? 'bg-green-100 text-green-800' :
                      performer.performanceScore >= 80 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {performer.performanceScore}%
                    </span>
                  </td>
                  <td className="table-cell">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      performer.growthRate >= 10 ? 'bg-green-100 text-green-800' :
                      performer.growthRate >= 5 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      +{performer.growthRate}%
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex flex-wrap gap-1">
                      {performer.awards.slice(0, 2).map((award, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {award}
                        </span>
                      ))}
                      {performer.awards.length > 2 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          +{performer.awards.length - 2} more
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Key Achievements</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topPerformers.slice(0, 3).map((performer) => (
              <div key={performer.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  {getRankIcon(performer.rank)}
                  <h4 className="ml-2 font-semibold text-gray-900">{performer.name}</h4>
                </div>
                <div className="space-y-2">
                  {performer.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <StarIcon className="h-4 w-4 text-yellow-500 mr-2" />
                      {achievement}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
