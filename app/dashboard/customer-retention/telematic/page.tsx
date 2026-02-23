'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon, PhoneIcon, UserGroupIcon, CurrencyRupeeIcon, ClockIcon, ChartBarIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline'

export default function TelematicPage() {
  const router = useRouter()
  const [location, setLocation] = useState('ALL')
  const [callerName, setCallerName] = useState('ALL')
  const [callerStatus, setCallerStatus] = useState('ALL')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [showAllData, setShowAllData] = useState(false)
  const [selectedCaller, setSelectedCaller] = useState<any>(null)
  const [showCallerDetails, setShowCallerDetails] = useState(false)

  // Get current date for dynamic date calculations
  const today = new Date()
  const currentYear = today.getFullYear()
  const currentMonth = today.getMonth()
  const currentDay = today.getDate()

  // Helper function to format date as YYYY-MM-DD
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  // Calculate dates relative to today
  const getTodayDate = () => formatDate(today)
  const getTomorrowDate = () => formatDate(new Date(currentYear, currentMonth, currentDay + 1))
  const getDateAfterDays = (days: number) => formatDate(new Date(currentYear, currentMonth, currentDay + days))

  const handleBack = () => {
    router.push('/dashboard/customer-retention')
  }

  const handleExport = () => {
    alert('Exporting to Excel...')
  }

  const handleViewDetails = (caller: any) => {
    setSelectedCaller(caller)
    setShowCallerDetails(true)
  }

  const handleCloseDetails = () => {
    setShowCallerDetails(false)
    setSelectedCaller(null)
  }

  // Mock telematic data with personal information
  const mockTelematicData = [
    {
      id: '1',
      callerName: 'Rajesh Kumar',
      callerStatus: 'Active',
      location: 'Mumbai',
      insuranceVertical: 'MOTOR',
      totalData: 45,
      totalCalls: 12,
      callsConnected: 8,
      totalCallTime: '96 min',
      avgCallTime: '8 min',
      nextScheduledCalls: 3,
      // Personal Information
      email: 'rajesh.kumar@company.com',
      phone: '+91 98765 43210',
      employeeId: 'EMP001',
      joinDate: '2023-01-15',
      department: 'Telesales - Motor',
      reportingManager: 'Amit Sharma',
      shift: 'Morning (9 AM - 6 PM)',
      targetAchievement: '85%',
      performanceRating: '4.2/5',
      // Individual Call Details
      callDetails: [
        {
          id: 'C1',
          customerName: 'Suresh Menon',
          mobile: '+91 98123 45678',
          email: 'suresh.m@email.com',
          policyNo: `POL-${currentYear}-M-001`,
          insuranceVertical: 'MOTOR',
          status: 'Connected',
          callTime: '10:15 AM',
          duration: '12 min',
          scheduledDate: null
        },
        {
          id: 'C2',
          customerName: 'Anita Desai',
          mobile: '+91 98123 45679',
          email: 'anita.d@email.com',
          policyNo: `POL-${currentYear}-M-002`,
          insuranceVertical: 'MOTOR',
          status: 'Not Connected',
          callTime: '10:45 AM',
          duration: '0 min',
          scheduledDate: getTomorrowDate()
        },
        {
          id: 'C3',
          customerName: 'Ramesh Iyer',
          mobile: '+91 98123 45680',
          email: 'ramesh.i@email.com',
          policyNo: `POL-${currentYear}-M-003`,
          insuranceVertical: 'MOTOR',
          status: 'Connected',
          callTime: '11:30 AM',
          duration: '8 min',
          scheduledDate: null
        },
        {
          id: 'C4',
          customerName: 'Kavita Sharma',
          mobile: '+91 98123 45681',
          email: 'kavita.s@email.com',
          policyNo: `POL-${currentYear}-M-004`,
          insuranceVertical: 'MOTOR',
          status: 'Scheduled',
          callTime: '-',
          duration: '-',
          scheduledDate: getTodayDate()
        },
        {
          id: 'C5',
          customerName: 'Deepak Verma',
          mobile: '+91 98123 45682',
          email: 'deepak.v@email.com',
          policyNo: `POL-${currentYear}-M-005`,
          insuranceVertical: 'MOTOR',
          status: 'Connected',
          callTime: '01:15 PM',
          duration: '15 min',
          scheduledDate: null
        },
      ]
    },
    {
      id: '2',
      callerName: 'Priya Sharma',
      callerStatus: 'Active',
      location: 'Delhi',
      insuranceVertical: 'HEALTH',
      totalData: 38,
      totalCalls: 15,
      callsConnected: 12,
      totalCallTime: '120 min',
      avgCallTime: '8 min',
      nextScheduledCalls: 5,
      email: 'priya.sharma@company.com',
      phone: '+91 98765 43211',
      employeeId: 'EMP002',
      joinDate: '2023-02-20',
      department: 'Telesales - Health',
      reportingManager: 'Sunil Gupta',
      shift: 'Afternoon (12 PM - 9 PM)',
      targetAchievement: '92%',
      performanceRating: '4.5/5',
      callDetails: [
        {
          id: 'C1',
          customerName: 'Vikram Malhotra',
          mobile: '+91 98234 56789',
          email: 'vikram.m@email.com',
          policyNo: `POL-${currentYear}-H-001`,
          insuranceVertical: 'HEALTH',
          status: 'Connected',
          callTime: '12:30 PM',
          duration: '10 min',
          scheduledDate: null
        },
        {
          id: 'C2',
          customerName: 'Neha Kapoor',
          mobile: '+91 98234 56790',
          email: 'neha.k@email.com',
          policyNo: `POL-${currentYear}-H-002`,
          insuranceVertical: 'HEALTH',
          status: 'Connected',
          callTime: '01:00 PM',
          duration: '7 min',
          scheduledDate: null
        },
        {
          id: 'C3',
          customerName: 'Arun Joshi',
          mobile: '+91 98234 56791',
          email: 'arun.j@email.com',
          policyNo: `POL-${currentYear}-H-003`,
          insuranceVertical: 'HEALTH',
          status: 'Scheduled',
          callTime: '-',
          duration: '-',
          scheduledDate: getTomorrowDate()
        },
      ]
    },
    {
      id: '3',
      callerName: 'Amit Patel',
      callerStatus: 'On Break',
      location: 'Bangalore',
      insuranceVertical: 'LIFE',
      totalData: 52,
      totalCalls: 18,
      callsConnected: 14,
      totalCallTime: '168 min',
      avgCallTime: '9.3 min',
      nextScheduledCalls: 4,
      email: 'amit.patel@company.com',
      phone: '+91 98765 43212',
      employeeId: 'EMP003',
      joinDate: '2022-11-10',
      department: 'Telesales - Life',
      reportingManager: 'Kavita Rao',
      shift: 'Morning (9 AM - 6 PM)',
      targetAchievement: '88%',
      performanceRating: '4.3/5',
      callDetails: [
        {
          id: 'C1',
          customerName: 'Prakash Nair',
          mobile: '+91 98345 67890',
          email: 'prakash.n@email.com',
          policyNo: `POL-${currentYear}-L-001`,
          insuranceVertical: 'LIFE',
          status: 'Connected',
          callTime: '09:30 AM',
          duration: '14 min',
          scheduledDate: null
        },
        {
          id: 'C2',
          customerName: 'Meera Krishnan',
          mobile: '+91 98345 67891',
          email: 'meera.k@email.com',
          policyNo: `POL-${currentYear}-L-002`,
          insuranceVertical: 'LIFE',
          status: 'Connected',
          callTime: '10:00 AM',
          duration: '9 min',
          scheduledDate: null
        },
      ]
    },
    {
      id: '4',
      callerName: 'Sneha Reddy',
      callerStatus: 'Active',
      location: 'Hyderabad',
      insuranceVertical: 'MOTOR',
      totalData: 41,
      totalCalls: 14,
      callsConnected: 10,
      totalCallTime: '112 min',
      avgCallTime: '8 min',
      nextScheduledCalls: 2,
      email: 'sneha.reddy@company.com',
      phone: '+91 98765 43213',
      employeeId: 'EMP004',
      joinDate: '2023-03-05',
      department: 'Telesales - Motor',
      reportingManager: 'Amit Sharma',
      shift: 'Evening (3 PM - 12 AM)',
      targetAchievement: '78%',
      performanceRating: '3.9/5',
      callDetails: [
        {
          id: 'C1',
          customerName: 'Sanjay Reddy',
          mobile: '+91 98456 78901',
          email: 'sanjay.r@email.com',
          policyNo: `POL-${currentYear}-M-006`,
          insuranceVertical: 'MOTOR',
          status: 'Connected',
          callTime: '03:45 PM',
          duration: '11 min',
          scheduledDate: null
        },
        {
          id: 'C2',
          customerName: 'Lakshmi Rao',
          mobile: '+91 98456 78902',
          email: 'lakshmi.r@email.com',
          policyNo: `POL-${currentYear}-M-007`,
          insuranceVertical: 'MOTOR',
          status: 'Not Connected',
          callTime: '04:15 PM',
          duration: '0 min',
          scheduledDate: getTodayDate()
        },
      ]
    },
    {
      id: '5',
      callerName: 'Vikram Singh',
      callerStatus: 'Active',
      location: 'Chennai',
      insuranceVertical: 'FIRE',
      totalData: 29,
      totalCalls: 10,
      callsConnected: 7,
      totalCallTime: '70 min',
      avgCallTime: '7 min',
      nextScheduledCalls: 3,
      email: 'vikram.singh@company.com',
      phone: '+91 98765 43214',
      employeeId: 'EMP005',
      joinDate: '2023-01-20',
      department: 'Telesales - Fire & Property',
      reportingManager: 'Deepak Mehta',
      shift: 'Morning (9 AM - 6 PM)',
      targetAchievement: '75%',
      performanceRating: '3.8/5',
      callDetails: [
        {
          id: 'C1',
          customerName: 'Gopal Krishnan',
          mobile: '+91 98567 89012',
          email: 'gopal.k@email.com',
          policyNo: `POL-${currentYear}-F-001`,
          insuranceVertical: 'FIRE',
          status: 'Connected',
          callTime: '09:15 AM',
          duration: '6 min',
          scheduledDate: null
        },
        {
          id: 'C2',
          customerName: 'Sunita Pillai',
          mobile: '+91 98567 89013',
          email: 'sunita.p@email.com',
          policyNo: `POL-${currentYear}-F-002`,
          insuranceVertical: 'FIRE',
          status: 'Scheduled',
          callTime: '-',
          duration: '-',
          scheduledDate: getDateAfterDays(2)
        },
      ]
    },
  ]

  // Get unique locations and caller names for dropdowns
  const uniqueLocations = ['ALL', ...Array.from(new Set(mockTelematicData.map(item => item.location)))]
  const uniqueCallerNames = ['ALL', ...Array.from(new Set(mockTelematicData.map(item => item.callerName)))]

  // Filter and display data
  const displayedData = showAllData ? mockTelematicData : mockTelematicData.slice(0, 3)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800'
      case 'On Break':
        return 'bg-yellow-100 text-yellow-800'
      case 'Offline':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCallStatusColor = (status: string) => {
    switch (status) {
      case 'Connected':
        return 'bg-green-100 text-green-800'
      case 'Not Connected':
        return 'bg-red-100 text-red-800'
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Pie chart data for Insurance Vertical-wise Policies vs Premium
  const insuranceVerticalData = [
    { vertical: 'MOTOR', policies: 145, premium: 2800000, color: 'bg-blue-500' },
    { vertical: 'HEALTH', policies: 98, premium: 3200000, color: 'bg-green-500' },
    { vertical: 'LIFE', policies: 67, premium: 1500000, color: 'bg-orange-500' },
    { vertical: 'FIRE', policies: 42, premium: 1800000, color: 'bg-red-500' },
    { vertical: 'MARINE', policies: 28, premium: 900000, color: 'bg-purple-500' },
  ]

  // Bar chart data for Location-wise Callers Status vs Policy Conversions
  const locationData = [
    { location: 'Mumbai', active: 12, onBreak: 2, offline: 1, conversions: 45 },
    { location: 'Delhi', active: 10, onBreak: 3, offline: 2, conversions: 38 },
    { location: 'Bangalore', active: 15, onBreak: 1, offline: 1, conversions: 52 },
    { location: 'Hyderabad', active: 8, onBreak: 2, offline: 1, conversions: 34 },
    { location: 'Chennai', active: 9, onBreak: 1, offline: 2, conversions: 29 },
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Customer Retention
          </button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Telematic Monitoring</h1>
          <p className="text-gray-600 mt-2">
            Real-time call center monitoring and policy conversion tracking
          </p>
        </div>

        {/* First Row - KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          {/* Total Callers */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <UserGroupIcon className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Total Callers</h3>
            <p className="text-2xl font-bold text-gray-900">54</p>
            <p className="text-sm text-green-600 mt-1">↑ 8 from yesterday</p>
          </div>

          {/* Total Calls Made */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <PhoneIcon className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Total Calls Made</h3>
            <p className="text-2xl font-bold text-gray-900">847</p>
            <p className="text-sm text-green-600 mt-1">↑ 124 today</p>
          </div>

          {/* Policies Converted */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <ChartBarIcon className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Policies Converted</h3>
            <p className="text-2xl font-bold text-gray-900">198</p>
            <p className="text-sm text-green-600 mt-1">23.4% conversion</p>
          </div>

          {/* Total Premium Collected */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <CurrencyRupeeIcon className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Premium Collected</h3>
            <p className="text-2xl font-bold text-gray-900">₹10.2L</p>
            <p className="text-sm text-green-600 mt-1">Today's collection</p>
          </div>

          {/* Average Call Time */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <ClockIcon className="h-8 w-8 text-teal-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Avg Call Time</h3>
            <p className="text-2xl font-bold text-gray-900">8.2 min</p>
            <p className="text-sm text-gray-500 mt-1">15.7 calls/caller</p>
          </div>
        </div>

        {/* Second Row - Search & Filter Options */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Search</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {uniqueLocations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Caller Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Caller Name
              </label>
              <select
                value={callerName}
                onChange={(e) => setCallerName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {uniqueCallerNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {/* Caller Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Caller Status
              </label>
              <select
                value={callerStatus}
                onChange={(e) => setCallerStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All</option>
                <option value="Active">Active</option>
                <option value="On Break">On Break</option>
                <option value="Offline">Offline</option>
              </select>
            </div>

            {/* From Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Date
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* To Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To Date
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          {/* Export Button Row */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleExport}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center"
            >
              <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
              Export to Excel
            </button>
          </div>
        </div>

        {/* Third Row - Policy Telematic Details Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Policy Telematic Details</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Caller Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Insurance Vertical
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Calls
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Calls Connected
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Call Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Call Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Next Scheduled
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayedData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.callerName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.callerStatus)}`}>
                        {item.callerStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {item.insuranceVertical}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.totalData}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.totalCalls}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.callsConnected}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.totalCallTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.avgCallTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {item.nextScheduledCalls} calls
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewDetails(item)}
                        className="text-blue-600 hover:text-blue-900 hover:underline"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* More Button */}
          {!showAllData && mockTelematicData.length > 3 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Showing {displayedData.length} of {mockTelematicData.length} callers
              </span>
              <button
                onClick={() => setShowAllData(true)}
                className="inline-flex items-center px-4 py-2 border border-blue-600 rounded-md text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
              >
                More →
              </button>
            </div>
          )}
        </div>

        {/* Fourth Row - Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Insurance Vertical-wise Policies vs Premium */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Insurance Vertical: Policies vs Premium
            </h3>
            <div className="space-y-4">
              {insuranceVerticalData.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{item.vertical}</span>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-gray-900">{item.policies} policies</span>
                      <span className="text-xs text-gray-500 ml-2">• {formatCurrency(item.premium)}</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-6">
                    <div
                      className={`${item.color} h-6 rounded-full flex items-center justify-end px-2`}
                      style={{ width: `${(item.policies / 145) * 100}%` }}
                    >
                      <span className="text-xs text-white font-medium">
                        {((item.policies / 380) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Location-wise Callers Status vs Policy Conversions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Location: Caller Status vs Conversions
            </h3>
            <div className="space-y-4">
              {locationData.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{item.location}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-green-600">Active: {item.active}</span>
                      <span className="text-xs text-yellow-600">Break: {item.onBreak}</span>
                      <span className="text-xs text-red-600">Offline: {item.offline}</span>
                      <span className="text-sm font-semibold text-gray-900 ml-2">{item.conversions} policies</span>
                    </div>
                  </div>
                  <div className="flex space-x-1 h-6">
                    <div
                      className="bg-green-500 rounded-l-full flex items-center justify-center"
                      style={{ width: `${(item.active / (item.active + item.onBreak + item.offline)) * 100}%` }}
                      title={`Active: ${item.active}`}
                    />
                    <div
                      className="bg-yellow-500 flex items-center justify-center"
                      style={{ width: `${(item.onBreak / (item.active + item.onBreak + item.offline)) * 100}%` }}
                      title={`On Break: ${item.onBreak}`}
                    />
                    <div
                      className="bg-red-500 rounded-r-full flex items-center justify-center"
                      style={{ width: `${(item.offline / (item.active + item.onBreak + item.offline)) * 100}%` }}
                      title={`Offline: ${item.offline}`}
                    />
                  </div>
                  <div className="mt-1 text-right">
                    <span className="text-xs text-gray-500">
                      Conversion Rate: {((item.conversions / (item.active * 10)) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Caller Details Modal */}
        {showCallerDetails && selectedCaller && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
            <div className="relative mx-auto p-8 border w-full max-w-4xl shadow-lg rounded-lg bg-white">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Caller Details</h2>
                <button
                  onClick={handleCloseDetails}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-blue-500">
                    Personal Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Full Name</label>
                      <p className="text-base text-gray-900">{selectedCaller.callerName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Employee ID</label>
                      <p className="text-base text-gray-900">{selectedCaller.employeeId}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-base text-gray-900">{selectedCaller.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <p className="text-base text-gray-900">{selectedCaller.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Location</label>
                      <p className="text-base text-gray-900">{selectedCaller.location}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Join Date</label>
                      <p className="text-base text-gray-900">{new Date(selectedCaller.joinDate).toLocaleDateString('en-IN')}</p>
                    </div>
                  </div>
                </div>

                {/* Work Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-green-500">
                    Work Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Department</label>
                      <p className="text-base text-gray-900">{selectedCaller.department}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Reporting Manager</label>
                      <p className="text-base text-gray-900">{selectedCaller.reportingManager}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Shift</label>
                      <p className="text-base text-gray-900">{selectedCaller.shift}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedCaller.callerStatus)}`}>
                        {selectedCaller.callerStatus}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Target Achievement</label>
                      <p className="text-base text-gray-900">{selectedCaller.targetAchievement}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Performance Rating</label>
                      <p className="text-base text-gray-900 font-semibold">{selectedCaller.performanceRating}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Today's Performance */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-purple-500">
                  Today's Performance - Summary
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Total Data</p>
                    <p className="text-2xl font-bold text-blue-600">{selectedCaller.totalData}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Total Calls</p>
                    <p className="text-2xl font-bold text-green-600">{selectedCaller.totalCalls}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Connected</p>
                    <p className="text-2xl font-bold text-purple-600">{selectedCaller.callsConnected}</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Total Time</p>
                    <p className="text-2xl font-bold text-orange-600">{selectedCaller.totalCallTime}</p>
                  </div>
                  <div className="bg-teal-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Avg Time</p>
                    <p className="text-2xl font-bold text-teal-600">{selectedCaller.avgCallTime}</p>
                  </div>
                </div>
              </div>

              {/* Individual Call Details */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-orange-500">
                  Individual Call Details
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mobile No
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Policy No
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Insurance Vertical
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Call Time
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Duration
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedCaller.callDetails?.map((call: any) => (
                        <tr key={call.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            {call.customerName}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {call.mobile}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {call.email}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-blue-600">
                            {call.policyNo}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {call.insuranceVertical}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getCallStatusColor(call.status)}`}>
                                {call.status}
                              </span>
                              {call.status === 'Scheduled' && call.scheduledDate && (
                                <div className="text-xs text-gray-500 mt-1">
                                  Next: {new Date(call.scheduledDate).toLocaleDateString('en-IN')}
                                </div>
                              )}
                              {call.status === 'Not Connected' && call.scheduledDate && (
                                <div className="text-xs text-gray-500 mt-1">
                                  Reschedule: {new Date(call.scheduledDate).toLocaleDateString('en-IN')}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {call.callTime}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {call.duration}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Close Button */}
              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleCloseDetails}
                  className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
