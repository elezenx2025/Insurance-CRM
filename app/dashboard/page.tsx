'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

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
  premiumTrends: boolean
  occasions: boolean
  festivals: boolean
}

export default function DashboardPage() {
  const router = useRouter()
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
    // Try to load from localStorage, but default to all sections visible for demonstration
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
    targets: true,
    pendingTasks: true,
    renewals: true,
    leads: true,
    proposals: true,
    claims: true,
    premiumsByType: true,
    premiumTrends: true,
    occasions: true,
    festivals: true,
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
    'premiumTrends',
    'occasions',
    'festivals'
  ])

  const [showCustomize, setShowCustomize] = useState(false)

  // Load saved preferences on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Clear localStorage to show all sections for demonstration
      localStorage.removeItem('dashboardSections')
      localStorage.removeItem('dashboardSectionOrder')
      localStorage.removeItem('dashboardInitialized')
      
      // Set all sections to visible
      const allSectionsVisible = {
        kpis: true,
        targets: true,
        pendingTasks: true,
        renewals: true,
        leads: true,
        proposals: true,
        claims: true,
        premiumsByType: true,
        premiumTrends: true,
        occasions: true,
        festivals: true,
      }
      setSectionsVisible(allSectionsVisible)
      localStorage.setItem('dashboardSections', JSON.stringify(allSectionsVisible))
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

  const getSectionBackgroundColor = (section: keyof DashboardSections): string => {
    const colors = {
      kpis: 'bg-blue-50 border-blue-200',
      targets: 'bg-green-50 border-green-200',
      pendingTasks: 'bg-yellow-50 border-yellow-200',
      renewals: 'bg-purple-50 border-purple-200',
      leads: 'bg-pink-50 border-pink-200',
      proposals: 'bg-indigo-50 border-indigo-200',
      claims: 'bg-red-50 border-red-200',
      premiumsByType: 'bg-orange-50 border-orange-200',
      premiumTrends: 'bg-cyan-50 border-cyan-200',
      occasions: 'bg-emerald-50 border-emerald-200',
      festivals: 'bg-rose-50 border-rose-200',
    }
    return colors[section] || 'bg-gray-50 border-gray-200'
  }

  const getSectionContentBoxColor = (section: keyof DashboardSections): string => {
    const colors = {
      kpis: 'bg-blue-100 border-blue-300',
      targets: 'bg-green-100 border-green-300',
      pendingTasks: 'bg-yellow-100 border-yellow-300',
      renewals: 'bg-purple-100 border-purple-300',
      leads: 'bg-pink-100 border-pink-300',
      proposals: 'bg-indigo-100 border-indigo-300',
      claims: 'bg-red-100 border-red-300',
      premiumsByType: 'bg-orange-100 border-orange-300',
      premiumTrends: 'bg-cyan-100 border-cyan-300',
      occasions: 'bg-emerald-100 border-emerald-300',
      festivals: 'bg-rose-100 border-rose-300',
    }
    return colors[section] || 'bg-gray-100 border-gray-300'
  }

  const renderDashboardSections = () => {
    return sectionOrder.map((sectionKey) => {
      if (!sectionsVisible[sectionKey]) return null
      
    return (
        <div key={sectionKey} className={`dashboard-section mb-8 p-6 rounded-lg border-2 ${getSectionBackgroundColor(sectionKey)}`}>
          <div className="mb-4">
            <span className="inline-block px-3 py-1 text-xs font-semibold bg-white rounded-full border shadow-sm">
              {sectionKey.replace(/([A-Z])/g, ' $1').trim().toUpperCase()} SECTION
            </span>
          </div>
          {renderSectionContent(sectionKey)}
      </div>
    )
    })
  }

  const renderSectionContent = (section: keyof DashboardSections) => {
    switch (section) {
      case 'kpis':
        return renderKPISection(section)
      case 'targets':
        return renderTargetsSection(section)
      case 'pendingTasks':
        return renderPendingTasksSection(section)
      case 'renewals':
        return renderRenewalsSection(section)
      case 'leads':
        return renderLeadsSection(section)
      case 'proposals':
        return renderProposalsSection(section)
      case 'claims':
        return renderClaimsSection(section)
      case 'premiumsByType':
        return renderPremiumsByTypeSection(section)
      case 'premiumTrends':
        return renderPremiumTrendsSection(section)
      case 'occasions':
        return renderOccasionsSection(section)
      case 'festivals':
        return renderFestivalsSection(section)
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
      targets: true,
      pendingTasks: true,
      renewals: true,
      leads: true,
      proposals: true,
      claims: true,
      premiumsByType: true,
      premiumTrends: true,
      occasions: true,
      festivals: true,
    }
    setSectionsVisible(defaultSections)
    localStorage.setItem('dashboardSections', JSON.stringify(defaultSections))
    
    const defaultOrder: (keyof DashboardSections)[] = [
      'kpis', 'targets', 'pendingTasks', 'renewals', 'leads', 'proposals', 
      'claims', 'premiumsByType', 'premiumTrends', 'occasions', 'festivals'
    ]
    setSectionOrder(defaultOrder)
    localStorage.setItem('dashboardSectionOrder', JSON.stringify(defaultOrder))
    
    // Force page refresh to ensure clean state
    window.location.reload()
  }

  // All render functions for different sections
  const renderKPISection = (section: keyof DashboardSections) => (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Key Performance Indicators</h2>
      </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Customers */}
        <div className={`${getSectionContentBoxColor(section)} overflow-hidden shadow rounded-lg border`}>
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
        <div className={`${getSectionContentBoxColor(section)} overflow-hidden shadow rounded-lg border`}>
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
        <div className={`${getSectionContentBoxColor(section)} overflow-hidden shadow rounded-lg border`}>
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
        <div className={`${getSectionContentBoxColor(section)} overflow-hidden shadow rounded-lg border`}>
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

  const renderTargetsSection = (section: keyof DashboardSections) => (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Monthly Targets</h2>
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          View Details
        </button>
          </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`${getSectionContentBoxColor(section)} shadow rounded-lg p-6 border`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-900">Premium Target</h3>
            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Target: ₹5.0M</span>
              <span className="font-medium">65%</span>
                  </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{width: '65%'}}></div>
                </div>
            <p className="text-xs text-gray-600">Achieved: ₹3.3M</p>
              </div>
            </div>

        <div className={`${getSectionContentBoxColor(section)} shadow rounded-lg p-6 border`}>
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

        <div className={`${getSectionContentBoxColor(section)} shadow rounded-lg p-6 border`}>
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

        <div className={`${getSectionContentBoxColor(section)} shadow rounded-lg p-6 border`}>
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

  const renderPendingTasksSection = (section: keyof DashboardSections) => (
    <div>
      <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Pending Tasks</h2>
        <button 
          onClick={() => router.push('/dashboard')}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium">
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
            <button 
            onClick={() => router.push('/dashboard/policies/renewals')}
            className="mt-3 w-full px-3 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700">
            View All
          </button>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-green-800">Quotations</h3>
            <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
          <p className="text-2xl font-bold text-green-800">12</p>
          <p className="text-xs text-green-700">quotes pending approval</p>
          <button 
            onClick={() => router.push('/dashboard/presale/quotation')}
            className="mt-3 w-full px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
          >
            View All
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
          <button 
            onClick={() => router.push('/dashboard/document-management')}
            className="mt-3 w-full px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
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
          <button 
            onClick={() => router.push('/dashboard/presale/lead-generation')}
            className="mt-3 w-full px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">
            Follow Up
            </button>
        </div>
      </div>
    </div>
  )

  const renderRenewalsSection = (section: keyof DashboardSections) => (
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
              <p className="text-xs text-gray-600">Policy #: HP-2024-001 • Premium: ₹15K</p>
            </div>
            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Completed</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <div>
              <p className="text-sm font-medium">Motor Policy Renewed - Priya Sharma</p>
              <p className="text-xs text-gray-600">Policy #: MP-2024-045 • Premium: ₹8.5K</p>
            </div>
            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Completed</span>
          </div>
        </div>
      </div>
    </div>
  )

  const renderLeadsSection = (section: keyof DashboardSections) => (
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

  const renderProposalsSection = (section: keyof DashboardSections) => (
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
              <p className="text-xs text-gray-600">Proposal #: HP-2024-156 • Amount: ₹5.0L</p>
            </div>
            <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">Under Review</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <div>
              <p className="text-sm font-medium">Motor Policy - Priya Sharma</p>
              <p className="text-xs text-gray-600">Proposal #: MP-2024-234 • Amount: ₹8.0L</p>
            </div>
            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Approved</span>
          </div>
        </div>
      </div>
    </div>
  )

  const renderClaimsSection = (section: keyof DashboardSections) => (
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
              <p className="text-xs text-gray-600">Claim #: HC-2024-089 • Amount: ₹2.5L</p>
            </div>
            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Approved</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <div>
              <p className="text-sm font-medium">Motor Claim - Priya Sharma</p>
              <p className="text-xs text-gray-600">Claim #: MC-2024-156 • Amount: ₹1.3L</p>
            </div>
            <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">Under Review</span>
          </div>
        </div>
      </div>
    </div>
  )

  const renderPremiumsByTypeSection = (section: keyof DashboardSections) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Premium by Insurance Type - Bar Chart */}
        <div className={`${getSectionContentBoxColor(section)} shadow rounded-lg p-6 border`}>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Premium by Insurance Type</h3>
          <div className="h-64 relative">
            <svg width="100%" height="100%" className="absolute inset-0">
              {/* Y-axis labels */}
              <text x="20" y="20" className="text-xs fill-gray-500">₹20L</text>
              <text x="20" y="60" className="text-xs fill-gray-500">₹15L</text>
              <text x="20" y="100" className="text-xs fill-gray-500">₹10L</text>
              <text x="20" y="140" className="text-xs fill-gray-500">₹5L</text>
              <text x="20" y="180" className="text-xs fill-gray-500">₹0L</text>
              
              {/* Grid lines */}
              <line x1="50" y1="40" x2="95%" y2="40" stroke="#E5E7EB" strokeWidth="1" />
              <line x1="50" y1="80" x2="95%" y2="80" stroke="#E5E7EB" strokeWidth="1" />
              <line x1="50" y1="120" x2="95%" y2="120" stroke="#E5E7EB" strokeWidth="1" />
              <line x1="50" y1="160" x2="95%" y2="160" stroke="#E5E7EB" strokeWidth="1" />
              <line x1="50" y1="200" x2="95%" y2="200" stroke="#E5E7EB" strokeWidth="1" />
              
              {/* Bars with tooltips */}
              <rect x="15%" y="20" width="12%" height="160" fill="#3B82F6" rx="2" className="cursor-pointer hover:fill-blue-600 transition-colors" onMouseEnter={(e) => showTooltip(e, 'FIRE: ₹17.5L')} onMouseMove={moveTooltip} onMouseLeave={hideTooltip}>
                <title>FIRE: ₹17.5L (17.5 Lakhs)</title>
              </rect>
              <rect x="30%" y="10" width="12%" height="170" fill="#10B981" rx="2" className="cursor-pointer hover:fill-green-600 transition-colors" onMouseEnter={(e) => showTooltip(e, 'HEALTH: ₹18.2L')} onMouseMove={moveTooltip} onMouseLeave={hideTooltip}>
                <title>HEALTH: ₹18.2L (18.2 Lakhs)</title>
              </rect>
              <rect x="45%" y="190" width="12%" height="10" fill="#F59E0B" rx="2" className="cursor-pointer hover:fill-orange-600 transition-colors" onMouseEnter={(e) => showTooltip(e, 'LIFE: ₹0.8L')} onMouseMove={moveTooltip} onMouseLeave={hideTooltip}>
                <title>LIFE: ₹0.8L (0.8 Lakhs)</title>
              </rect>
              <rect x="60%" y="100" width="12%" height="100" fill="#EF4444" rx="2" className="cursor-pointer hover:fill-red-600 transition-colors" onMouseEnter={(e) => showTooltip(e, 'MARINE: ₹8.5L')} onMouseMove={moveTooltip} onMouseLeave={hideTooltip}>
                <title>MARINE: ₹8.5L (8.5 Lakhs)</title>
              </rect>
              <rect x="75%" y="120" width="12%" height="80" fill="#8B5CF6" rx="2" className="cursor-pointer hover:fill-purple-600 transition-colors" onMouseEnter={(e) => showTooltip(e, 'MOTOR: ₹5.8L')} onMouseMove={moveTooltip} onMouseLeave={hideTooltip}>
                <title>MOTOR: ₹5.8L (5.8 Lakhs)</title>
              </rect>
              
              {/* X-axis labels */}
              <text x="21%" y="220" className="text-xs fill-gray-500" textAnchor="middle">FIRE</text>
              <text x="36%" y="220" className="text-xs fill-gray-500" textAnchor="middle">HEALTH</text>
              <text x="51%" y="220" className="text-xs fill-gray-500" textAnchor="middle">LIFE</text>
              <text x="66%" y="220" className="text-xs fill-gray-500" textAnchor="middle">MARINE</text>
              <text x="81%" y="220" className="text-xs fill-gray-500" textAnchor="middle">MOTOR</text>
            </svg>
          {tooltip.visible && (
            <div className="absolute pointer-events-none bg-gray-900 text-white text-xs px-2 py-1 rounded" style={{ left: tooltip.x, top: tooltip.y }}>
              {tooltip.text}
            </div>
          )}
          </div>
        </div>

        {/* Business Segment Distribution - Donut Chart */}
        <div className={`${getSectionContentBoxColor(section)} shadow rounded-lg p-6 border`}>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Business Segment Distribution</h3>
          <div className="flex items-center justify-center">
            <div className="relative w-64 h-64">
              <svg width="256" height="256" className="transform -rotate-90">
                {/* Donut chart segments with tooltips */}
                <circle
                  cx="128"
                  cy="128"
                  r="80"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="24"
                  strokeDasharray={`${(50 / 100) * 502.4} 502.4`}
                  strokeDashoffset="0"
                  className="cursor-pointer hover:stroke-blue-600 transition-colors" onMouseEnter={(e) => showTooltip(e, 'Corporate: 50% (1,247)')} onMouseMove={moveTooltip} onMouseLeave={hideTooltip}
                >
                  <title>Corporate: 50% (1,247 customers)</title>
                </circle>
                <circle
                  cx="128"
                  cy="128"
                  r="80"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="24"
                  strokeDasharray={`${(35 / 100) * 502.4} 502.4`}
                  strokeDashoffset={`-${(50 / 100) * 502.4}`}
                className="cursor-pointer hover:stroke-green-600 transition-colors" onMouseEnter={(e) => showTooltip(e, 'Group: 35% (872)')} onMouseMove={moveTooltip} onMouseLeave={hideTooltip}
                >
                <title>Group: 35% (872 customers)</title>
                </circle>
                <circle
                  cx="128"
                  cy="128"
                  r="80"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="24"
                  strokeDasharray={`${(15 / 100) * 502.4} 502.4`}
                  strokeDashoffset={`-${((50 + 35) / 100) * 502.4}`}
                className="cursor-pointer hover:stroke-orange-600 transition-colors" onMouseEnter={(e) => showTooltip(e, 'Individual: 15% (375)')} onMouseMove={moveTooltip} onMouseLeave={hideTooltip}
                >
                <title>Individual: 15% (375 customers)</title>
                </circle>
              </svg>
            </div>
          </div>
          <div className="mt-4 flex justify-center space-x-6">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-sm font-medium text-gray-700">CORPORATE</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm font-medium text-gray-700">GROUP</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
            <span className="text-sm font-medium text-gray-700">INDIVIDUAL</span>
            </div>
          </div>
        </div>
      </div>
  )


  const renderPremiumTrendsSection = (section: keyof DashboardSections) => (
      <div className={`${getSectionContentBoxColor(section)} shadow rounded-lg p-6 border`}>
        <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Monthly Premium Trends</h3>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setPremiumTrendToggle('month-to-month')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                premiumTrendToggle === 'month-to-month'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Month-to-Month
            </button>
            <button
              onClick={() => setPremiumTrendToggle('year-to-year')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                premiumTrendToggle === 'year-to-year'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Year-to-Year
            </button>
            </div>
            </div>
        
        {premiumTrendToggle === 'month-to-month' ? (
          // Month-to-Month Comparison
          <div className="h-64 relative">
            <svg width="100%" height="100%" className="absolute inset-0">
              {/* Y-axis labels */}
            <text x="20" y="20" className="text-xs fill-gray-500">₹2.5M</text>
            <text x="20" y="60" className="text-xs fill-gray-500">₹2.0M</text>
            <text x="20" y="100" className="text-xs fill-gray-500">₹1.5M</text>
            <text x="20" y="140" className="text-xs fill-gray-500">₹1.0M</text>
            <text x="20" y="180" className="text-xs fill-gray-500">₹0.5M</text>
            <text x="20" y="220" className="text-xs fill-gray-500">₹0</text>
              
              {/* Grid lines */}
            <line x1="80" y1="40" x2="95%" y2="40" stroke="#E5E7EB" strokeWidth="1" />
            <line x1="80" y1="80" x2="95%" y2="80" stroke="#E5E7EB" strokeWidth="1" />
            <line x1="80" y1="120" x2="95%" y2="120" stroke="#E5E7EB" strokeWidth="1" />
            <line x1="80" y1="160" x2="95%" y2="160" stroke="#E5E7EB" strokeWidth="1" />
            <line x1="80" y1="200" x2="95%" y2="200" stroke="#E5E7EB" strokeWidth="1" />
            <line x1="80" y1="240" x2="95%" y2="240" stroke="#E5E7EB" strokeWidth="1" />
            
            {/* Premium Trends chart */}
              {(() => {
                const months = premiumTrendData
                const maxVal = Math.max(...months.map(m => Math.max(m.currentYear, m.previousYear)))
                const minVal = 0
              // Pixel-based chart box
              const left = 80
              const right = typeof window !== 'undefined' && window.innerWidth ? Math.min(window.innerWidth * 0.85, 950) : 950
                const top = 30
                const bottom = 220
                const xFor = (i: number) => left + ((right - left) * i) / (months.length - 1)
                const yFor = (v: number) => bottom - ((v - minVal) / (maxVal - minVal)) * (bottom - top)
              
                // Create polylines
                const currentPoints = months.map((m, i) => `${xFor(i)},${yFor(m.currentYear)}`).join(' ')
                const prevPoints = months.map((m, i) => `${xFor(i)},${yFor(m.previousYear)}`).join(' ')
                
                return (
                  <>
                  {/* Polylines */}
                  <polyline points={currentPoints} fill="none" stroke="#3B82F6" strokeWidth="3" className="drop-shadow-sm" />
                  <polyline points={prevPoints} fill="none" stroke="#10B981" strokeWidth="3" className="drop-shadow-sm" />
                  
                  {/* Data points */}
                    {months.map((m, i) => (
                    <g key={`points-${i}`}>
                      <circle 
                        cx={xFor(i)} 
                        cy={yFor(m.currentYear)} 
                        r="4" 
                        fill="#3B82F6" 
                        className="cursor-pointer hover:r-6 transition-all"
                        onMouseEnter={(e) => showTooltip(e, `${m.month} 2025: ${formatIndianNumber(m.currentYear)}`)} 
                        onMouseMove={moveTooltip} 
                        onMouseLeave={hideTooltip}
                      />
                      <circle 
                        cx={xFor(i)} 
                        cy={yFor(m.previousYear)} 
                        r="4" 
                        fill="#10B981" 
                        className="cursor-pointer hover:r-6 transition-all"
                        onMouseEnter={(e) => showTooltip(e, `${m.month} 2024: ${formatIndianNumber(m.previousYear)}`)} 
                        onMouseMove={moveTooltip} 
                        onMouseLeave={hideTooltip}
                      />
                    </g>
                  ))}
                  
                  {/* Month labels */}
                  {months.map((m, i) => (
                    <text key={`label-${i}`} x={xFor(i)} y={250} className="text-xs fill-gray-600" textAnchor="middle" style={{ fontSize: '10px', fontWeight: '500' }}>
                        {m.month}
                      </text>
                    ))}
                  </>
                )
              })()}
            </svg>
            {tooltip.visible && (
              <div className="absolute pointer-events-none bg-gray-900 text-white text-xs px-2 py-1 rounded" style={{ left: tooltip.x, top: tooltip.y }}>
                {tooltip.text}
            </div>
            )}
          </div>
        ) : (
          // Year-to-Year Comparison
          <div className="h-64 relative">
            <svg width="100%" height="100%" className="absolute inset-0">
              {/* Y-axis labels */}
              <text x="20" y="20" className="text-xs fill-gray-500">₹4.5Cr</text>
              <text x="20" y="80" className="text-xs fill-gray-500">₹4Cr</text>
              <text x="20" y="140" className="text-xs fill-gray-500">₹3.5Cr</text>
              <text x="20" y="200" className="text-xs fill-gray-500">₹3Cr</text>
              
              {/* Grid lines */}
            <line x1="80" y1="40" x2="95%" y2="40" stroke="#E5E7EB" strokeWidth="1" />
            <line x1="80" y1="100" x2="95%" y2="100" stroke="#E5E7EB" strokeWidth="1" />
            <line x1="80" y1="160" x2="95%" y2="160" stroke="#E5E7EB" strokeWidth="1" />
            <line x1="80" y1="220" x2="95%" y2="220" stroke="#E5E7EB" strokeWidth="1" />
            
            {/* 2024 Line */}
            <line x1="80" y1="60" x2="350" y2="60" stroke="#3B82F6" strokeWidth="4" className="drop-shadow-sm" />
            
            {/* 2023 Line */}
            <line x1="80" y1="120" x2="350" y2="120" stroke="#10B981" strokeWidth="4" className="drop-shadow-sm" />
              
              {/* Data points */}
            <circle cx="80" cy="60" r="6" fill="#3B82F6" />
              <circle cx="350" cy="60" r="6" fill="#3B82F6" />
            <circle cx="80" cy="120" r="6" fill="#10B981" />
              <circle cx="350" cy="120" r="6" fill="#10B981" />
              
              {/* X-axis labels */}
            <text x="80" y="250" className="text-xs fill-gray-500" textAnchor="middle">2023</text>
            <text x="350" y="250" className="text-xs fill-gray-500" textAnchor="middle">2024</text>
            </svg>
          </div>
        )}
        
        {/* Legend */}
        <div className="flex items-center justify-center mt-4 space-x-6">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-700">
            {premiumTrendToggle === 'month-to-month' ? 'Current Year (2025)' : '2024'}
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-700">
            {premiumTrendToggle === 'month-to-month' ? 'Previous Year (2024)' : '2023'}
            </span>
        </div>
      </div>
    </div>
  )

  const renderOccasionsSection = (section: keyof DashboardSections) => (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Special Occasions & Campaigns</h2>
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          Manage Campaigns
        </button>
            </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`${getSectionContentBoxColor(section)} shadow rounded-lg p-6 border`}>
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

        <div className={`${getSectionContentBoxColor(section)} shadow rounded-lg p-6 border`}>
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

  const renderFestivalsSection = (section: keyof DashboardSections) => (
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
