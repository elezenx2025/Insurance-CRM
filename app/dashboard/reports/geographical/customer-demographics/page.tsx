'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeftIcon,
  UserGroupIcon,
  ChartBarIcon,
  DocumentArrowDownIcon,
  CalendarIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  UsersIcon,
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

interface DemographicsData {
  id: string
  ageGroup: string
  gender: string
  incomeRange: string
  region: string
  city: string
  customerCount: number
  averagePremium: number
  policyType: string
  education: string
  occupation: string
  maritalStatus: string
}

export default function CustomerDemographicsReport() {
  const router = useRouter()
  const [demographicsData, setDemographicsData] = useState<DemographicsData[]>([])
  const [filteredData, setFilteredData] = useState<DemographicsData[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('all')
  const [selectedGender, setSelectedGender] = useState('all')
  const [selectedIncomeRange, setSelectedIncomeRange] = useState('all')
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  })

  // Mock data
  useEffect(() => {
    const mockData: DemographicsData[] = [
      {
        id: '1',
        ageGroup: '25-35',
        gender: 'Male',
        incomeRange: '5-10 Lakhs',
        region: 'North',
        city: 'Delhi',
        customerCount: 450,
        averagePremium: 25000,
        policyType: 'Life Insurance',
        education: 'Graduate',
        occupation: 'Software Engineer',
        maritalStatus: 'Married'
      },
      {
        id: '2',
        ageGroup: '35-45',
        gender: 'Female',
        incomeRange: '10-15 Lakhs',
        region: 'South',
        city: 'Bangalore',
        customerCount: 380,
        averagePremium: 35000,
        policyType: 'Health Insurance',
        education: 'Post Graduate',
        occupation: 'Manager',
        maritalStatus: 'Married'
      },
      {
        id: '3',
        ageGroup: '45-55',
        gender: 'Male',
        incomeRange: '15-25 Lakhs',
        region: 'West',
        city: 'Mumbai',
        customerCount: 320,
        averagePremium: 50000,
        policyType: 'Life Insurance',
        education: 'Graduate',
        occupation: 'Business Owner',
        maritalStatus: 'Married'
      },
      {
        id: '4',
        ageGroup: '25-35',
        gender: 'Female',
        incomeRange: '3-5 Lakhs',
        region: 'South',
        city: 'Chennai',
        customerCount: 280,
        averagePremium: 18000,
        policyType: 'Motor Insurance',
        education: 'Graduate',
        occupation: 'Teacher',
        maritalStatus: 'Single'
      },
      {
        id: '5',
        ageGroup: '55-65',
        gender: 'Male',
        incomeRange: '25+ Lakhs',
        region: 'West',
        city: 'Pune',
        customerCount: 150,
        averagePremium: 75000,
        policyType: 'Life Insurance',
        education: 'Post Graduate',
        occupation: 'Senior Executive',
        maritalStatus: 'Married'
      },
      {
        id: '6',
        ageGroup: '35-45',
        gender: 'Male',
        incomeRange: '10-15 Lakhs',
        region: 'South',
        city: 'Hyderabad',
        customerCount: 220,
        averagePremium: 30000,
        policyType: 'Health Insurance',
        education: 'Graduate',
        occupation: 'Doctor',
        maritalStatus: 'Married'
      },
      {
        id: '7',
        ageGroup: '25-35',
        gender: 'Female',
        incomeRange: '5-10 Lakhs',
        region: 'East',
        city: 'Kolkata',
        customerCount: 190,
        averagePremium: 22000,
        policyType: 'Motor Insurance',
        education: 'Graduate',
        occupation: 'Banker',
        maritalStatus: 'Single'
      },
      {
        id: '8',
        ageGroup: '45-55',
        gender: 'Female',
        incomeRange: '15-25 Lakhs',
        region: 'West',
        city: 'Ahmedabad',
        customerCount: 180,
        averagePremium: 45000,
        policyType: 'Health Insurance',
        education: 'Post Graduate',
        occupation: 'CA',
        maritalStatus: 'Married'
      }
    ]
    setDemographicsData(mockData)
    setFilteredData(mockData)
  }, [])

  // Filter data based on selected criteria
  useEffect(() => {
    let filtered = demographicsData

    if (selectedAgeGroup !== 'all') {
      filtered = filtered.filter(agent => agent.ageGroup === selectedAgeGroup)
    }

    if (selectedGender !== 'all') {
      filtered = filtered.filter(agent => agent.gender === selectedGender)
    }

    if (selectedIncomeRange !== 'all') {
      filtered = filtered.filter(agent => agent.incomeRange === selectedIncomeRange)
    }

    if (selectedRegion !== 'all') {
      filtered = filtered.filter(agent => agent.region === selectedRegion)
    }

    setFilteredData(filtered)
  }, [demographicsData, selectedAgeGroup, selectedGender, selectedIncomeRange, selectedRegion])

  // Chart data
  const ageChartData = {
    labels: Array.from(new Set(filteredData.map(agent => agent.ageGroup))),
    datasets: [
      {
        label: 'Customer Count',
        data: Array.from(new Set(filteredData.map(agent => agent.ageGroup))).map(age => 
          filteredData.filter(agent => agent.ageGroup === age).reduce((sum, agent) => sum + agent.customerCount, 0)
        ),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      }
    ]
  }

  const genderChartData = {
    labels: ['Male', 'Female'],
    datasets: [
      {
        data: [
          filteredData.filter(agent => agent.gender === 'Male').reduce((sum, agent) => sum + agent.customerCount, 0),
          filteredData.filter(agent => agent.gender === 'Female').reduce((sum, agent) => sum + agent.customerCount, 0)
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)'
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(236, 72, 153, 1)'
        ],
        borderWidth: 2
      }
    ]
  }

  const incomeChartData = {
    labels: Array.from(new Set(filteredData.map(agent => agent.incomeRange))),
    datasets: [
      {
        label: 'Average Premium (₹)',
        data: Array.from(new Set(filteredData.map(agent => agent.incomeRange))).map(income => {
          const incomeData = filteredData.filter(agent => agent.incomeRange === income)
          return incomeData.length > 0 ? 
            incomeData.reduce((sum, agent) => sum + agent.averagePremium, 0) / incomeData.length : 0
        }),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
      }
    ]
  }

  const regionChartData = {
    labels: Array.from(new Set(filteredData.map(agent => agent.region))),
    datasets: [
      {
        data: Array.from(new Set(filteredData.map(agent => agent.region))).map(region => 
          filteredData.filter(agent => agent.region === region).reduce((sum, agent) => sum + agent.customerCount, 0)
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

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Customer Count by Age Group'
      }
    }
  }

  const genderChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Gender Distribution'
      }
    }
  }

  const incomeChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Average Premium by Income Range (₹)'
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
        text: 'Customer Distribution by Region'
      }
    }
  }

  const handleExport = (format: 'pdf' | 'excel') => {
    // Mock export functionality
    console.log(`Exporting customer demographics report as ${format}`)
    // In a real application, this would generate and download the file
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num)
  }

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(num)
  }

  const getTotalCustomers = () => {
    return filteredData.reduce((sum, agent) => sum + agent.customerCount, 0)
  }

  const getMaleCustomers = () => {
    return filteredData.filter(agent => agent.gender === 'Male').reduce((sum, agent) => sum + agent.customerCount, 0)
  }

  const getFemaleCustomers = () => {
    return filteredData.filter(agent => agent.gender === 'Female').reduce((sum, agent) => sum + agent.customerCount, 0)
  }

  const getAveragePremium = () => {
    const totalPremium = filteredData.reduce((sum, agent) => sum + (agent.averagePremium * agent.customerCount), 0)
    const totalCustomers = getTotalCustomers()
    return totalCustomers > 0 ? (totalPremium / totalCustomers).toFixed(0) : 0
  }

  const getTopAgeGroup = () => {
    if (filteredData.length === 0) return null
    const ageGroups = Array.from(new Set(filteredData.map(agent => agent.ageGroup)))
    let maxCount = 0
    let topAgeGroup = ''
    
    ageGroups.forEach(age => {
      const count = filteredData.filter(agent => agent.ageGroup === age).reduce((sum, agent) => sum + agent.customerCount, 0)
      if (count > maxCount) {
        maxCount = count
        topAgeGroup = age
      }
    })
    
    return { ageGroup: topAgeGroup, count: maxCount }
  }

  const getTopRegion = () => {
    if (filteredData.length === 0) return null
    const regions = Array.from(new Set(filteredData.map(agent => agent.region)))
    let maxCount = 0
    let topRegion = ''
    
    regions.forEach(region => {
      const count = filteredData.filter(agent => agent.region === region).reduce((sum, agent) => sum + agent.customerCount, 0)
      if (count > maxCount) {
        maxCount = count
        topRegion = region
      }
    })
    
    return { region: topRegion, count: maxCount }
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
                <span className="ml-4 text-gray-900 font-medium">Customer Demographics Report</span>
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
            <h1 className="text-lg font-semibold text-gray-900">Customer Demographics Report</h1>
            <p className="mt-1 text-sm text-gray-600">
              Age, gender, and income-based segmentation of customers
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Age Group</label>
            <select
              value={selectedAgeGroup}
              onChange={(e) => setSelectedAgeGroup(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Age Groups</option>
              {Array.from(new Set(demographicsData.map(agent => agent.ageGroup))).map(age => (
                <option key={age} value={age}>{age}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Income Range</label>
            <select
              value={selectedIncomeRange}
              onChange={(e) => setSelectedIncomeRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Income Ranges</option>
              {Array.from(new Set(demographicsData.map(agent => agent.incomeRange))).map(income => (
                <option key={income} value={income}>{income}</option>
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
              {Array.from(new Set(demographicsData.map(agent => agent.region))).map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <UsersIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(getTotalCustomers())}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <UserGroupIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Male Customers</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(getMaleCustomers())}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-pink-100 rounded-lg">
              <UserGroupIcon className="h-6 w-6 text-pink-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Female Customers</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(getFemaleCustomers())}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Premium</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(Number(getAveragePremium()))}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Age Group</h3>
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
            <div className="flex items-center">
              <UserGroupIcon className="h-8 w-8 text-blue-600 mr-4" />
              <div>
                <p className="text-lg font-bold text-gray-900">{getTopAgeGroup()?.ageGroup} years</p>
                <p className="text-sm text-gray-600">Most represented age group</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">{formatNumber(getTopAgeGroup()?.count || 0)}</p>
              <p className="text-sm text-gray-600">Customers</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Region</h3>
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
            <div className="flex items-center">
              <GlobeAltIcon className="h-8 w-8 text-green-600 mr-4" />
              <div>
                <p className="text-lg font-bold text-gray-900">{getTopRegion()?.region}</p>
                <p className="text-sm text-gray-600">Highest customer concentration</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">{formatNumber(getTopRegion()?.count || 0)}</p>
              <p className="text-sm text-gray-600">Customers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Count by Age Group</h3>
          <Bar data={ageChartData} options={chartOptions} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Gender Distribution</h3>
          <Doughnut data={genderChartData} options={genderChartOptions} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Premium by Income Range</h3>
          <Bar data={incomeChartData} options={incomeChartOptions} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Distribution by Region</h3>
          <Doughnut data={regionChartData} options={regionChartOptions} />
        </div>
      </div>

      {/* Demographics Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Demographics Details</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Age Group
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gender
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Income Range
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Region
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  City
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer Count
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Premium
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Policy Type
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((agent) => (
                <tr key={agent.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{agent.ageGroup}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      agent.gender === 'Male' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-pink-100 text-pink-800'
                    }`}>
                      {agent.gender}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{agent.incomeRange}</div>
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
                    <div className="text-sm text-gray-900">{agent.city}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">{formatNumber(agent.customerCount)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">{formatCurrency(agent.averagePremium)}</div>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
