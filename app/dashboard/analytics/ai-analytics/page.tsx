'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeftIcon,
  CpuChipIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  DocumentMagnifyingGlassIcon,
  ChartPieIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface AnalyticsData {
  id: string
  title: string
  description: string
  icon: any
  status: 'active' | 'warning' | 'error'
  value: string
  change: number
  changeType: 'increase' | 'decrease'
  lastUpdated: string
}

export default function AIAnalytics() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [selectedModule, setSelectedModule] = useState<string | null>(null)
  const [showModuleDetails, setShowModuleDetails] = useState(false)

  const analyticsModules = [
    {
      id: 'premium-optimization',
      title: 'Premium Optimization Engine',
      description: 'AI-powered premium calculation and optimization for maximum profitability',
      icon: CurrencyDollarIcon,
      status: 'active' as const,
      value: '94.2%',
      change: 12.5,
      changeType: 'increase' as const,
      lastUpdated: '2 minutes ago',
    },
    {
      id: 'risk-assessment',
      title: 'Risk Assessment Analyzer',
      description: 'Advanced risk profiling and assessment using machine learning algorithms',
      icon: ShieldCheckIcon,
      status: 'warning' as const,
      value: '87.8%',
      change: -3.2,
      changeType: 'decrease' as const,
      lastUpdated: '5 minutes ago',
    },
    {
      id: 'fraud-detection',
      title: 'Fraud Detection System',
      description: 'Real-time fraud detection and prevention using AI pattern recognition',
      icon: ExclamationTriangleIcon,
      status: 'active' as const,
      value: '99.1%',
      change: 8.7,
      changeType: 'increase' as const,
      lastUpdated: '1 minute ago',
    },
    {
      id: 'document-analysis',
      title: 'Document Analysis AI',
      description: 'Intelligent document processing and analysis for claims and policies',
      icon: DocumentMagnifyingGlassIcon,
      status: 'active' as const,
      value: '96.5%',
      change: 15.3,
      changeType: 'increase' as const,
      lastUpdated: '3 minutes ago',
    },
    {
      id: 'predictive-analysis',
      title: 'Predictive Analysis Dashboard',
      description: 'Predictive modeling for customer behavior and market trends',
      icon: ChartPieIcon,
      status: 'active' as const,
      value: '91.3%',
      change: 6.8,
      changeType: 'increase' as const,
      lastUpdated: '4 minutes ago',
    },
  ]

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100'
      case 'warning':
        return 'text-yellow-600 bg-yellow-100'
      case 'error':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getChangeIcon = (changeType: string) => {
    return changeType === 'increase' ? ArrowTrendingUpIcon : ArrowTrendingDownIcon
  }

  const getChangeColor = (changeType: string) => {
    return changeType === 'increase' ? 'text-green-600' : 'text-red-600'
  }

  const handleModuleClick = (moduleId: string) => {
    setSelectedModule(moduleId)
    setShowModuleDetails(true)
  }

  const handleRunAnalysis = (moduleId: string) => {
    // Simulate running analysis
    toast.success(`Starting analysis for ${analyticsModules.find(m => m.id === moduleId)?.title}...`)
    
    // Simulate analysis completion after 2 seconds
    setTimeout(() => {
      toast.success('Analysis completed successfully!')
    }, 2000)
  }

  const handleGenerateReport = (moduleId: string) => {
    // Simulate report generation
    toast.success(`Generating report for ${analyticsModules.find(m => m.id === moduleId)?.title}...`)
    
    // Simulate report completion after 1.5 seconds
    setTimeout(() => {
      toast.success('Report generated and downloaded!')
    }, 1500)
  }

  const handleExportData = (moduleId: string) => {
    // Simulate data export
    toast.success(`Exporting data for ${analyticsModules.find(m => m.id === moduleId)?.title}...`)
    
    // Simulate export completion after 1 second
    setTimeout(() => {
      toast.success('Data exported successfully!')
    }, 1000)
  }

  const handleSystemHealth = (moduleId: string) => {
    // Simulate system health check
    toast.success(`Checking system health for ${analyticsModules.find(m => m.id === moduleId)?.title}...`)
    
    // Simulate health check completion after 1 second
    setTimeout(() => {
      toast.success('System health check completed - All systems operational!')
    }, 1000)
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
                <button onClick={() => router.push('/dashboard/analytics')} className="ml-4 text-gray-400 hover:text-gray-500">
                  Analytics
                </button>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="text-gray-400">/</span>
                <span className="ml-4 text-gray-900 font-medium">AI Analytics</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      {/* Page header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/dashboard/analytics')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Analytics</h1>
            <p className="mt-1 text-sm text-gray-600">
              Advanced AI-powered analytics and insights for insurance operations.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            All systems operational
          </div>
        </div>
      </div>

      {/* AI Analytics Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {analyticsModules.map((module) => {
          const IconComponent = module.icon
          const ChangeIcon = getChangeIcon(module.changeType)
          return (
            <div
              key={module.id}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleModuleClick(module.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg mr-4">
                    <IconComponent className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(module.status)}`}>
                      {module.status.toUpperCase()}
                    </div>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <EyeIcon className="h-5 w-5" />
                </button>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">{module.description}</p>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{module.value}</p>
                  <p className="text-xs text-gray-500">Accuracy</p>
                </div>
                <div className="text-right">
                  <div className={`flex items-center text-sm ${getChangeColor(module.changeType)}`}>
                    <ChangeIcon className="h-4 w-4 mr-1" />
                    {Math.abs(module.change)}%
                  </div>
                  <p className="text-xs text-gray-500">vs last week</p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">Last updated: {module.lastUpdated}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Performance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">CPU Usage</span>
              <span className="text-sm font-medium text-gray-900">23%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '23%' }}></div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Memory Usage</span>
              <span className="text-sm font-medium text-gray-900">67%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '67%' }}></div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">AI Model Accuracy</span>
              <span className="text-sm font-medium text-gray-900">94.2%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: '94%' }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Premium optimization completed</p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Risk assessment warning detected</p>
                <p className="text-xs text-gray-500">5 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Fraud detection model updated</p>
                <p className="text-xs text-gray-500">8 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Document analysis batch processed</p>
                <p className="text-xs text-gray-500">12 minutes ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={() => handleRunAnalysis(selectedModule || 'all')}
            className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <CpuChipIcon className="h-5 w-5 mr-2 text-blue-600" />
            <span className="text-sm font-medium">Run Analysis</span>
          </button>
          <button 
            onClick={() => handleGenerateReport(selectedModule || 'all')}
            className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ChartBarIcon className="h-5 w-5 mr-2 text-green-600" />
            <span className="text-sm font-medium">Generate Report</span>
          </button>
          <button 
            onClick={() => handleExportData(selectedModule || 'all')}
            className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <DocumentTextIcon className="h-5 w-5 mr-2 text-purple-600" />
            <span className="text-sm font-medium">Export Data</span>
          </button>
          <button 
            onClick={() => handleSystemHealth(selectedModule || 'all')}
            className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ShieldCheckIcon className="h-5 w-5 mr-2 text-red-600" />
            <span className="text-sm font-medium">System Health</span>
          </button>
        </div>
      </div>

      {/* Module Details Modal */}
      {showModuleDetails && selectedModule && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {analyticsModules.find(m => m.id === selectedModule)?.title}
                </h3>
                <button
                  onClick={() => {
                    setShowModuleDetails(false)
                    setSelectedModule(null)
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-600">
                  {analyticsModules.find(m => m.id === selectedModule)?.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Current Status</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {analyticsModules.find(m => m.id === selectedModule)?.value}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Performance Change</p>
                  <div className="flex items-center">
                    {(() => {
                      const selectedAnalyticsModule = analyticsModules.find(m => m.id === selectedModule)
                      const changeType = selectedAnalyticsModule?.changeType || 'increase'
                      const ChangeIcon = getChangeIcon(changeType)
                      return (
                        <>
                          <ChangeIcon className={`h-4 w-4 mr-1 ${getChangeColor(changeType)}`} />
                          <span className={`text-lg font-semibold ${getChangeColor(changeType)}`}>
                            {Math.abs(selectedAnalyticsModule?.change || 0)}%
                          </span>
                        </>
                      )
                    })()}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowModuleDetails(false)
                    setSelectedModule(null)
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => handleRunAnalysis(selectedModule)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Run Analysis
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
