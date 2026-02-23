'use client'

import { useEffect, useState } from 'react'

interface DashboardStats {
  totalCustomers: number
  corporateCustomers: number
  retailCustomers: number
  totalPolicies: number
  newPolicies: number
  renewalPolicies: number
  rolloverPolicies: number
  totalPremium: number
  healthPremium: number
  motorPremium: number
  lifePremium: number
  totalClaims: number
  activeClaims: number
  settledClaims: number
  pendingClaims: number
  totalRevenue: number
  monthlyGrowth: number
  claimApprovalRate: number
  expiredPolicies: number
}

interface BusinessSegment {
  name: string
  value: number
  color: string
}

interface PremiumTrendData {
  month: string
  currentYear: number
  previousYear: number
}

interface YearlyComparison {
  year: string
  totalPremium: number
  totalPolicies: number
  totalClaims: number
}

interface DashboardSections {
  kpis: boolean
  targets: boolean
  pendingTasks: boolean
  renewals: boolean
  leads: boolean
  proposals: boolean
  claims: boolean
  premiumsByType: boolean
  businessSegments: boolean
  premiumTrends: boolean
  occasions: boolean
  festivals: boolean
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    corporateCustomers: 0,
    retailCustomers: 0,
    totalPolicies: 0,
    newPolicies: 0,
    renewalPolicies: 0,
    rolloverPolicies: 0,
    totalPremium: 0,
    healthPremium: 0,
    motorPremium: 0,
    lifePremium: 0,
    totalClaims: 0,
    activeClaims: 0,
    settledClaims: 0,
    pendingClaims: 0,
    totalRevenue: 0,
    monthlyGrowth: 0,
    claimApprovalRate: 0,
    expiredPolicies: 0,
  })

  const [loading, setLoading] = useState(true)
  const [premiumTrendToggle, setPremiumTrendToggle] = useState<'month-to-month' | 'year-to-year'>('month-to-month')
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string; visible: boolean }>({ x: 0, y: 0, text: '', visible: false })

  const [sectionsVisible, setSectionsVisible] = useState<DashboardSections>(() => {
    // Try to load from localStorage, but default to only KPIs visible
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dashboardSections')
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch (e) {
          // If parsing fails, use default
        }
      }
    }
    return {
      kpis: true,
      targets: false,
      pendingTasks: false,
      renewals: false,
      leads: false,
      proposals: false,
      claims: false,
      premiumsByType: false,
      businessSegments: false,
      premiumTrends: false,
      occasions: false,
      festivals: false,
    }
  })

  const [sectionOrder, setSectionOrder] = useState<(keyof DashboardSections)[]>([
    'kpis',
    'targets', 
    'pendingTasks',
    'renewals',
    'leads',
    'proposals',
    'claims',
    'premiumsByType',
    'businessSegments',
    'premiumTrends',
    'occasions',
    'festivals'
  ])

  const [showCustomize, setShowCustomize] = useState(false)

  // Load saved preferences on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check if this is the first time loading the dashboard
      const isInitialized = localStorage.getItem('dashboardInitialized')
      
      if (!isInitialized) {
        // First time - clear any existing data and set defaults
        localStorage.removeItem('dashboardSections')
        localStorage.removeItem('dashboardSectionOrder')
        localStorage.setItem('dashboardInitialized', 'true')
      } else {
        // Load saved preferences
        const savedSections = localStorage.getItem('dashboardSections')
        const savedOrder = localStorage.getItem('dashboardSectionOrder')
        
        if (savedSections) {
          try {
            setSectionsVisible(JSON.parse(savedSections))
          } catch (e) {
            console.error('Error parsing saved sections:', e)
          }
        }
        
        if (savedOrder) {
          try {
            setSectionOrder(JSON.parse(savedOrder))
          } catch (e) {
            console.error('Error parsing saved order:', e)
          }
        }
      }
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          setStats({
            totalCustomers: 15420,
            corporateCustomers: 3240,
            retailCustomers: 12180,
            totalPolicies: 8945,
            newPolicies: 1250,
            renewalPolicies: 6890,
            rolloverPolicies: 805,
            totalPremium: 285000000,
            healthPremium: 125000000,
            motorPremium: 98000000,
            lifePremium: 62000000,
            totalClaims: 1245,
            activeClaims: 89,
            settledClaims: 1089,
            pendingClaims: 67,
            totalRevenue: 28500000,
            monthlyGrowth: 12.5,
            claimApprovalRate: 87.3,
            expiredPolicies: 45,
          })
          setLoading(false)
        }, 500)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatNumber = (num: number): string => {
    if (num >= 10000000) {
      return (num / 10000000).toFixed(1) + ' Cr'
    } else if (num >= 100000) {
      return (num / 100000).toFixed(1) + ' L'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  const formatIndianNumber = (num: number): string => {
    if (num >= 10000000) { // 1 crore or more
      const crores = num / 10000000
      return `₹${crores.toFixed(1)}Cr`
    } else if (num >= 1000000) { // 10 lakh or more
      const millions = num / 1000000
      return `₹${millions.toFixed(1)}M`
    } else if (num >= 100000) { // 1 lakh or more
      const lakhs = num / 100000
      return `₹${lakhs.toFixed(1)}L`
    } else if (num >= 1000) { // 1 thousand or more
      const thousands = num / 1000
      return `₹${thousands.toFixed(1)}K`
    } else {
      return `₹${num.toLocaleString('en-IN')}`
    }
  }

  const businessSegments: BusinessSegment[] = [
    { name: 'Health Insurance', value: 45, color: '#3B82F6' },
    { name: 'Motor Insurance', value: 30, color: '#10B981' },
    { name: 'Life Insurance', value: 15, color: '#F59E0B' },
    { name: 'Property Insurance', value: 7, color: '#EF4444' },
    { name: 'Travel Insurance', value: 3, color: '#8B5CF6' },
  ]

  const premiumTrendData: PremiumTrendData[] = [
    { month: 'Jan', currentYear: 2800000, previousYear: 2400000 },
    { month: 'Feb', currentYear: 3200000, previousYear: 2800000 },
    { month: 'Mar', currentYear: 2900000, previousYear: 2600000 },
    { month: 'Apr', currentYear: 3400000, previousYear: 3000000 },
    { month: 'May', currentYear: 3600000, previousYear: 3200000 },
    { month: 'Jun', currentYear: 3300000, previousYear: 2900000 },
    { month: 'Jul', currentYear: 3800000, previousYear: 3400000 },
    { month: 'Aug', currentYear: 3500000, previousYear: 3100000 },
    { month: 'Sep', currentYear: 3700000, previousYear: 3300000 },
    { month: 'Oct', currentYear: 3900000, previousYear: 3500000 },
    { month: 'Nov', currentYear: 4100000, previousYear: 3700000 },
    { month: 'Dec', currentYear: 4300000, previousYear: 3900000 },
  ]

  const yearlyComparisonData: YearlyComparison[] = [
    { year: '2023', totalPremium: 380000000, totalPolicies: 7800, totalClaims: 1150 },
    { year: '2024', totalPremium: 425000000, totalPolicies: 8945, totalClaims: 1245 },
  ]

  const showTooltip = (event: React.MouseEvent<SVGElement, MouseEvent>, text: string) => {
    const container = (event.currentTarget.ownerSVGElement || event.currentTarget) as SVGElement
    const rect = container.getBoundingClientRect()
    setTooltip({
      x: event.clientX - rect.left + 8,
      y: event.clientY - rect.top + 8,
      text,
      visible: true,
    })
  }

  const moveTooltip = (event: React.MouseEvent<SVGElement, MouseEvent>) => {
    const container = (event.currentTarget.ownerSVGElement || event.currentTarget) as SVGElement
    const rect = container.getBoundingClientRect()
    setTooltip(prev => ({
      ...prev,
      x: event.clientX - rect.left + 8,
      y: event.clientY - rect.top + 8,
    }))
  }

  const hideTooltip = () => {
    setTooltip(prev => ({ ...prev, visible: false }))
  }

  const handleSectionToggle = (section: keyof DashboardSections) => {
    const newSections = { ...sectionsVisible, [section]: !sectionsVisible[section] }
    setSectionsVisible(newSections)
    localStorage.setItem('dashboardSections', JSON.stringify(newSections))
  }

  const handleNavigation = (url: string) => {
    console.log('Dashboard button clicked:', url)
    window.location.href = url
  }

  const renderDashboardSections = () => {
    return sectionOrder.map((sectionKey) => {
      if (!sectionsVisible[sectionKey]) return null
      
      return (
        <div key={sectionKey} className="dashboard-section mb-8">
          {renderSectionContent(sectionKey)}
        </div>
      )
    })
  }

  const renderSectionContent = (section: keyof DashboardSections) => {
    switch (section) {
      case 'kpis':
        return renderKPISection()
      case 'targets':
        return renderTargetsSection()
      case 'pendingTasks':
        return renderPendingTasksSection()
      case 'renewals':
        return renderRenewalsSection()
      case 'leads':
        return renderLeadsSection()
      case 'proposals':
        return renderProposalsSection()
      case 'claims':
        return renderClaimsSection()
      case 'premiumsByType':
        return renderPremiumsByTypeSection()
      case 'businessSegments':
        return renderBusinessSegmentsSection()
      case 'premiumTrends':
        return renderPremiumTrendsSection()
      case 'occasions':
        return renderOccasionsSection()
      case 'festivals':
        return renderFestivalsSection()
      default:
        return null
    }
  }

  const moveSectionUp = (section: keyof DashboardSections) => {
    const currentIndex = sectionOrder.indexOf(section)
    if (currentIndex > 0) {
      const newOrder = [...sectionOrder]
      newOrder[currentIndex] = newOrder[currentIndex - 1]
      newOrder[currentIndex - 1] = section
      setSectionOrder(newOrder)
      localStorage.setItem('dashboardSectionOrder', JSON.stringify(newOrder))
    }
  }

  const moveSectionDown = (section: keyof DashboardSections) => {
    const currentIndex = sectionOrder.indexOf(section)
    if (currentIndex < sectionOrder.length - 1) {
      const newOrder = [...sectionOrder]
      newOrder[currentIndex] = newOrder[currentIndex + 1]
      newOrder[currentIndex + 1] = section
      setSectionOrder(newOrder)
      localStorage.setItem('dashboardSectionOrder', JSON.stringify(newOrder))
    }
  }

  const resetDashboard = () => {
    const defaultSections = {
      kpis: true,
      targets: false,
      pendingTasks: false,
      renewals: false,
      leads: false,
      proposals: false,
      claims: false,
      premiumsByType: false,
      businessSegments: false,
      premiumTrends: false,
      occasions: false,
      festivals: false,
    }
    setSectionsVisible(defaultSections)
    localStorage.setItem('dashboardSections', JSON.stringify(defaultSections))
    
    const defaultOrder: (keyof DashboardSections)[] = [
      'kpis', 'targets', 'pendingTasks', 'renewals', 'leads', 'proposals', 
      'claims', 'premiumsByType', 'businessSegments', 'premiumTrends', 'occasions', 'festivals'
    ]
    setSectionOrder(defaultOrder)
    localStorage.setItem('dashboardSectionOrder', JSON.stringify(defaultOrder))
    
    // Force page refresh to ensure clean state
    window.location.reload()
  }

  // All render functions for different sections
  const renderKPISection = () => (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Key Performance Indicators</h2>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Customers */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Customers
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {formatNumber(stats.totalCustomers)}
                  </dd>
                </dl>
                <div className="mt-2 text-xs text-gray-500">
                  <div className="flex justify-between">
                    <span>Corporate: {formatNumber(stats.corporateCustomers)}</span>
                    <span>Retail: {formatNumber(stats.retailCustomers)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Policies */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active Policies
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {formatNumber(stats.totalPolicies)}
                  </dd>
                </dl>
                <div className="mt-2 text-xs text-gray-500">
                  <div className="flex justify-between">
                    <span>New: {formatNumber(stats.newPolicies)}</span>
                    <span>Renewal: {formatNumber(stats.renewalPolicies)}</span>
                    <span>Rollover: {formatNumber(stats.rolloverPolicies)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Total Premium */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Premium
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {formatIndianNumber(stats.totalPremium)}
                  </dd>
                </dl>
                <div className="mt-2 text-xs text-gray-500">
                  <div className="flex justify-between">
                    <span>Health: {formatIndianNumber(stats.healthPremium)}</span>
                    <span>Motor: {formatIndianNumber(stats.motorPremium)}</span>
                    <span>Life: {formatIndianNumber(stats.lifePremium)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Claims */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active Claims
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {formatNumber(stats.activeClaims)}
                  </dd>
                </dl>
                <div className="mt-2 text-xs text-gray-500">
                  <div className="flex justify-between">
                    <span>Settled: {formatNumber(stats.settledClaims)}</span>
                    <span>Pending: {formatNumber(stats.pendingClaims)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderTargetsSection = () => (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Monthly Targets</h2>
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          View Details
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-900">Premium Target</h3>
            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Target: ₹50,00,000</span>
              <span className="font-medium">65%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{width: '65%'}}></div>
            </div>
            <p className="text-xs text-gray-600">Achieved: ₹32,50,000</p>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-900">New Customers</h3>
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Target: 500</span>
              <span className="font-medium">77%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{width: '77%'}}></div>
            </div>
            <p className="text-xs text-gray-600">Achieved: 387</p>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-900">Policies Sold</h3>
            <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Target: 300</span>
              <span className="font-medium">82%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-orange-600 h-2 rounded-full" style={{width: '82%'}}></div>
            </div>
            <p className="text-xs text-gray-600">Achieved: 245</p>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-900">Renewals</h3>
            <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Target: 150</span>
              <span className="font-medium">95%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{width: '95%'}}></div>
            </div>
            <p className="text-xs text-gray-600">Achieved: 142</p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderPendingTasksSection = () => (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Pending Tasks</h2>
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          View All Tasks
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-yellow-800">Policy Renewals Due</h3>
            <svg className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-yellow-800">23</p>
          <p className="text-xs text-yellow-700">policies expiring in next 7 days</p>
          <button className="mt-3 w-full px-3 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700">
            View All
          </button>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-red-800">Pending Claims Review</h3>
            <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-red-800">8</p>
          <p className="text-xs text-red-700">claims awaiting approval</p>
          <button className="mt-3 w-full px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">
            Review
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-blue-800">Document Verification</h3>
            <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-blue-800">15</p>
          <p className="text-xs text-blue-700">documents pending verification</p>
          <button className="mt-3 w-full px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
            Process
          </button>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-green-800">New Lead Follow-up</h3>
            <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-green-800">42</p>
          <p className="text-xs text-green-700">leads requiring follow-up</p>
          <button className="mt-3 w-full px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">
            Follow Up
          </button>
        </div>
      </div>
    </div>
  )

  const renderRenewalsSection = () => (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Policy Renewals</h2>
        <button 
          onClick={() => handleNavigation('/dashboard/policies/renewals')}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Manage Renewals
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">23</p>
              <p className="text-sm text-gray-600">Expiring This Week</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">67</p>
              <p className="text-sm text-gray-600">Expiring This Month</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">142</p>
              <p className="text-sm text-gray-600">Renewed This Month</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">Recent Renewal Activities</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <div>
              <p className="text-sm font-medium">Health Policy Renewed - Rajesh Kumar</p>
              <p className="text-xs text-gray-600">Policy #: HP-2024-001 • Premium: ₹15,000</p>
            </div>
            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Completed</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <div>
              <p className="text-sm font-medium">Motor Policy Renewed - Priya Sharma</p>
              <p className="text-xs text-gray-600">Policy #: MP-2024-045 • Premium: ₹8,500</p>
            </div>
            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Completed</span>
          </div>
        </div>
      </div>
    </div>
  )

  const renderLeadsSection = () => (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Lead Management</h2>
        <button 
          onClick={() => handleNavigation('/dashboard/presale/lead-generation')}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Manage Leads
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">89</p>
              <p className="text-sm text-gray-600">New Leads</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">42</p>
              <p className="text-sm text-gray-600">Follow-up Due</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">156</p>
              <p className="text-sm text-gray-600">Qualified</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">234</p>
              <p className="text-sm text-gray-600">Converted</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderProposalsSection = () => (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Policy Proposals</h2>
        <button 
          onClick={() => handleNavigation('/dashboard/presale/policy-proposals')}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View All Proposals
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">67</p>
              <p className="text-sm text-gray-600">Pending Review</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">234</p>
              <p className="text-sm text-gray-600">Approved</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">12</p>
              <p className="text-sm text-gray-600">Rejected</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">89%</p>
              <p className="text-sm text-gray-600">Approval Rate</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">Recent Proposals</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <div>
              <p className="text-sm font-medium">Health Policy - Rajesh Kumar</p>
              <p className="text-xs text-gray-600">Proposal #: HP-2024-156 • Amount: ₹5,00,000</p>
            </div>
            <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">Under Review</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <div>
              <p className="text-sm font-medium">Motor Policy - Priya Sharma</p>
              <p className="text-xs text-gray-600">Proposal #: MP-2024-234 • Amount: ₹8,00,000</p>
            </div>
            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Approved</span>
          </div>
        </div>
      </div>
    </div>
  )

  const renderClaimsSection = () => (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Claims Overview</h2>
        <button 
          onClick={() => handleNavigation('/dashboard/postsale/claims')}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Manage Claims
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">23</p>
              <p className="text-sm text-gray-600">Pending Review</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">45</p>
              <p className="text-sm text-gray-600">Under Investigation</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">156</p>
              <p className="text-sm text-gray-600">Approved</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">₹45.2L</p>
              <p className="text-sm text-gray-600">Claims Paid</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">Recent Claims Activity</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <div>
              <p className="text-sm font-medium">Health Claim - Rajesh Kumar</p>
              <p className="text-xs text-gray-600">Claim #: HC-2024-089 • Amount: ₹2,50,000</p>
            </div>
            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Approved</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <div>
              <p className="text-sm font-medium">Motor Claim - Priya Sharma</p>
              <p className="text-xs text-gray-600">Claim #: MC-2024-156 • Amount: ₹1,25,000</p>
            </div>
            <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">Under Review</span>
          </div>
        </div>
      </div>
    </div>
  )

  const renderPremiumsByTypeSection = () => (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Premiums by Insurance Type</h2>
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          View Details
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Health Insurance</p>
              <p className="text-2xl font-bold text-blue-600">₹12.5 Cr</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">45% of total</p>
              <p className="text-xs text-green-600">↗ +12%</p>
            </div>
          </div>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{width: '45%'}}></div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Motor Insurance</p>
              <p className="text-2xl font-bold text-green-600">₹9.8 Cr</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">35% of total</p>
              <p className="text-xs text-green-600">↗ +8%</p>
            </div>
          </div>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-600 h-2 rounded-full" style={{width: '35%'}}></div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Life Insurance</p>
              <p className="text-2xl font-bold text-purple-600">₹6.2 Cr</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">20% of total</p>
              <p className="text-xs text-red-600">↘ -2%</p>
            </div>
          </div>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div className="bg-purple-600 h-2 rounded-full" style={{width: '20%'}}></div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderBusinessSegmentsSection = () => (
    <div>
      <div className="flex items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Business Segments</h2>
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-600">Business segments section content will be displayed here.</p>
      </div>
    </div>
  )

  const renderPremiumTrendsSection = () => (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Premium Trends</h2>
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded">Monthly</button>
          <button className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded">Yearly</button>
        </div>
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">₹28.5 Cr</p>
            <p className="text-sm text-blue-800">This Month</p>
            <p className="text-xs text-green-600">↗ +15%</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">₹24.8 Cr</p>
            <p className="text-sm text-green-800">Last Month</p>
            <p className="text-xs text-gray-600">Previous</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">₹312 Cr</p>
            <p className="text-sm text-purple-800">YTD Total</p>
            <p className="text-xs text-green-600">↗ +22%</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-2xl font-bold text-yellow-600">₹35 Cr</p>
            <p className="text-sm text-yellow-800">Target</p>
            <p className="text-xs text-blue-600">81% achieved</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Monthly Performance</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">December 2024</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '81%'}}></div>
                </div>
                <span className="text-sm font-medium">₹28.5 Cr</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">November 2024</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{width: '71%'}}></div>
                </div>
                <span className="text-sm font-medium">₹24.8 Cr</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">October 2024</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{width: '68%'}}></div>
                </div>
                <span className="text-sm font-medium">₹23.8 Cr</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderOccasionsSection = () => (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Special Occasions & Campaigns</h2>
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          Manage Campaigns
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">New Year Campaign</h3>
            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Active</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Campaign Period</span>
              <span className="text-sm font-medium">Dec 15 - Jan 31</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Target Policies</span>
              <span className="text-sm font-medium">500</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Achieved</span>
              <span className="text-sm font-medium text-green-600">387 (77%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{width: '77%'}}></div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Festival Bonanza</h3>
            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Upcoming</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Campaign Period</span>
              <span className="text-sm font-medium">Mar 1 - Mar 31</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Target Policies</span>
              <span className="text-sm font-medium">750</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Special Discount</span>
              <span className="text-sm font-medium text-blue-600">Up to 25% off</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{width: '0%'}}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderFestivalsSection = () => (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Festival Calendar & Offers</h2>
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          View Calendar
        </button>
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="text-2xl mb-2">🪔</div>
            <h3 className="font-semibold text-gray-900">Diwali Special</h3>
            <p className="text-sm text-gray-600">Oct 24 - Nov 15</p>
            <p className="text-sm font-medium text-orange-600">20% Off All Policies</p>
          </div>
          
          <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="text-2xl mb-2">🎄</div>
            <h3 className="font-semibold text-gray-900">Christmas Offer</h3>
            <p className="text-sm text-gray-600">Dec 15 - Jan 5</p>
            <p className="text-sm font-medium text-red-600">Gift a Policy</p>
          </div>
          
          <div className="text-center p-4 bg-pink-50 rounded-lg border border-pink-200">
            <div className="text-2xl mb-2">🌸</div>
            <h3 className="font-semibold text-gray-900">Holi Celebration</h3>
            <p className="text-sm text-gray-600">Mar 1 - Mar 20</p>
            <p className="text-sm font-medium text-pink-600">Family Plans</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Upcoming Festival Offers</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-lg">🎊</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">New Year Special</p>
                  <p className="text-xs text-gray-600">Jan 1 - Jan 15 • Health & Motor Insurance</p>
                </div>
              </div>
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">15% Off</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-lg">💝</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">Valentine's Day</p>
                  <p className="text-xs text-gray-600">Feb 10 - Feb 20 • Couple Insurance Plans</p>
                </div>
              </div>
              <span className="px-2 py-1 text-xs bg-pink-100 text-pink-800 rounded">Buy 1 Get 1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // Calculate max value for bar chart scaling
  const maxSegmentValue = Math.max(...businessSegments.map(segment => segment.value))

  // Calculate max value for line chart scaling
  const maxPremiumValue = Math.max(...premiumTrendData.map(data => Math.max(data.currentYear, data.previousYear)))
  const minPremiumValue = Math.min(...premiumTrendData.map(data => Math.min(data.currentYear, data.previousYear)))

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your insurance business.</p>
        </div>
        <button
          onClick={() => setShowCustomize(!showCustomize)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
          </svg>
          Customize Dashboard
        </button>
      </div>

      {/* Customize Panel */}
      {showCustomize && (
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Dashboard Customization</h3>
            <button
              onClick={resetDashboard}
              className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
            >
              Reset to Default
            </button>
          </div>
          
          <div className="mb-6">
            <h4 className="text-md font-medium text-gray-800 mb-3">Section Visibility</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(sectionsVisible).map(([key, visible]) => (
                <label key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={visible}
                    onChange={() => handleSectionToggle(key as keyof DashboardSections)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-md font-medium text-gray-800 mb-3">Section Order</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {sectionOrder.map((section, index) => (
                <div key={section} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-600 mr-2">#{index + 1}</span>
                    <span className="text-sm text-gray-700 capitalize">
                      {section.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    {!sectionsVisible[section] && (
                      <span className="ml-2 text-xs text-gray-400">(Hidden)</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => moveSectionUp(section)}
                      disabled={index === 0}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => moveSectionDown(section)}
                      disabled={index === sectionOrder.length - 1}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Sections in Custom Order */}
      {renderDashboardSections()}
    </div>
  )
}
