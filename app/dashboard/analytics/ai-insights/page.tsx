'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeftIcon,
  LightBulbIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon,
  CogIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface Insight {
  id: string
  title: string
  description: string
  category: 'premium' | 'risk' | 'fraud' | 'market' | 'engagement' | 'automation'
  priority: 'high' | 'medium' | 'low'
  impact: string
  confidence: number
  status: 'new' | 'reviewed' | 'implemented' | 'dismissed'
  createdAt: string
  tags: string[]
}

export default function AIInsights() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedPriority, setSelectedPriority] = useState<string>('all')
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null)
  const [showInsightDetails, setShowInsightDetails] = useState(false)

  const insights: Insight[] = [
    {
      id: '1',
      title: 'Premium Optimization Opportunity',
      description: 'AI analysis suggests 15% premium increase for high-risk motor policies in Mumbai region could improve profitability by ₹2.3M annually.',
      category: 'premium',
      priority: 'high',
      impact: '₹2.3M annual revenue increase',
      confidence: 94,
      status: 'new',
      createdAt: '2024-01-20T10:30:00Z',
      tags: ['Motor Insurance', 'Mumbai', 'Premium Optimization'],
    },
    {
      id: '2',
      title: 'High-Risk Identification',
      description: 'Pattern analysis reveals 23% of claims from specific agent network show suspicious patterns. Recommend enhanced verification.',
      category: 'risk',
      priority: 'high',
      impact: 'Potential ₹1.8M fraud prevention',
      confidence: 89,
      status: 'reviewed',
      createdAt: '2024-01-19T14:15:00Z',
      tags: ['Risk Assessment', 'Agent Network', 'Fraud Prevention'],
    },
    {
      id: '3',
      title: 'Suspicious Claim Pattern Detection',
      description: 'AI detected unusual claim patterns in health insurance category. 12 claims from same hospital within 30 days require investigation.',
      category: 'fraud',
      priority: 'high',
      impact: '₹850K potential fraud prevention',
      confidence: 92,
      status: 'new',
      createdAt: '2024-01-20T08:45:00Z',
      tags: ['Health Insurance', 'Claim Patterns', 'Hospital Network'],
    },
    {
      id: '4',
      title: 'Market Trend Analysis',
      description: 'Emerging trend shows 40% increase in cyber insurance demand. Recommend expanding product portfolio in Q2.',
      category: 'market',
      priority: 'medium',
      impact: '₹5.2M new business opportunity',
      confidence: 87,
      status: 'reviewed',
      createdAt: '2024-01-18T16:20:00Z',
      tags: ['Cyber Insurance', 'Market Trends', 'Product Expansion'],
    },
    {
      id: '5',
      title: 'Client Engagement Optimization',
      description: 'Analysis shows 35% improvement in renewal rates when using personalized communication. Implement AI-driven messaging.',
      category: 'engagement',
      priority: 'medium',
      impact: '18% renewal rate improvement',
      confidence: 91,
      status: 'implemented',
      createdAt: '2024-01-15T11:30:00Z',
      tags: ['Client Engagement', 'Renewal Rates', 'Personalization'],
    },
    {
      id: '6',
      title: 'Process Automation Opportunities',
      description: 'Claims processing can be automated for 78% of standard cases, reducing processing time by 65% and costs by ₹1.2M annually.',
      category: 'automation',
      priority: 'medium',
      impact: '₹1.2M annual cost savings',
      confidence: 88,
      status: 'new',
      createdAt: '2024-01-17T09:15:00Z',
      tags: ['Claims Processing', 'Automation', 'Cost Reduction'],
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'premium':
        return CurrencyDollarIcon
      case 'risk':
        return ExclamationTriangleIcon
      case 'fraud':
        return ExclamationTriangleIcon
      case 'market':
        return ArrowTrendingUpIcon
      case 'engagement':
        return UserGroupIcon
      case 'automation':
        return CogIcon
      default:
        return LightBulbIcon
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'premium':
        return 'bg-green-100 text-green-800'
      case 'risk':
        return 'bg-yellow-100 text-yellow-800'
      case 'fraud':
        return 'bg-red-100 text-red-800'
      case 'market':
        return 'bg-blue-100 text-blue-800'
      case 'engagement':
        return 'bg-purple-100 text-purple-800'
      case 'automation':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800'
      case 'reviewed':
        return 'bg-yellow-100 text-yellow-800'
      case 'implemented':
        return 'bg-green-100 text-green-800'
      case 'dismissed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return ClockIcon
      case 'reviewed':
        return EyeIcon
      case 'implemented':
        return CheckCircleIcon
      case 'dismissed':
        return XCircleIcon
      default:
        return ClockIcon
    }
  }

  const handleInsightClick = (insight: Insight) => {
    setSelectedInsight(insight)
    setShowInsightDetails(true)
  }

  const handleViewDetails = (insight: Insight) => {
    toast.success(`Opening detailed view for: ${insight.title}`)
    // In a real app, this would navigate to a detailed page or open a detailed modal
  }

  const handleImplementInsight = (insight: Insight) => {
    toast.success(`Implementing insight: ${insight.title}`)
    
    // Simulate implementation process
    setTimeout(() => {
      toast.success('Insight implementation started! You will be notified when completed.')
    }, 1500)
  }

  const handleDismissInsight = (insight: Insight) => {
    toast.success(`Dismissing insight: ${insight.title}`)
    
    // Simulate dismissal process
    setTimeout(() => {
      toast.success('Insight dismissed successfully.')
    }, 1000)
  }

  const filteredInsights = insights.filter(insight => {
    const categoryMatch = selectedCategory === 'all' || insight.category === selectedCategory
    const priorityMatch = selectedPriority === 'all' || insight.priority === selectedPriority
    return categoryMatch && priorityMatch
  })

  const categories = [
    { id: 'all', name: 'All Categories', count: insights.length },
    { id: 'premium', name: 'Premium Optimization', count: insights.filter(i => i.category === 'premium').length },
    { id: 'risk', name: 'Risk Assessment', count: insights.filter(i => i.category === 'risk').length },
    { id: 'fraud', name: 'Fraud Detection', count: insights.filter(i => i.category === 'fraud').length },
    { id: 'market', name: 'Market Trends', count: insights.filter(i => i.category === 'market').length },
    { id: 'engagement', name: 'Client Engagement', count: insights.filter(i => i.category === 'engagement').length },
    { id: 'automation', name: 'Process Automation', count: insights.filter(i => i.category === 'automation').length },
  ]

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
                <span className="ml-4 text-gray-900 font-medium">AI Insights</span>
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
            <h1 className="text-2xl font-bold text-gray-900">AI Insights</h1>
            <p className="mt-1 text-sm text-gray-600">
              Intelligent insights and recommendations powered by AI analytics.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            {filteredInsights.length} insights available
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name} ({category.count})
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="input"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredInsights.map((insight) => {
          const CategoryIcon = getCategoryIcon(insight.category)
          const StatusIcon = getStatusIcon(insight.status)
          return (
            <div
              key={insight.id}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleInsightClick(insight)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <CategoryIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{insight.title}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(insight.category)}`}>
                        {insight.category.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(insight.priority)}`}>
                        {insight.priority.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(insight.status)}`}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {insight.status.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">{insight.description}</p>
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Confidence</span>
                  <span className="text-sm text-gray-900">{insight.confidence}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${insight.confidence}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-1">Expected Impact</p>
                <p className="text-sm text-gray-900">{insight.impact}</p>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {insight.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Created: {new Date(insight.createdAt).toLocaleDateString()}
                </p>
                <div className="flex space-x-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      handleViewDetails(insight)
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View Details
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      handleImplementInsight(insight)
                    }}
                    className="text-sm text-green-600 hover:text-green-800 font-medium"
                  >
                    Implement
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredInsights.length === 0 && (
        <div className="text-center py-12">
          <LightBulbIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No insights found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your filters to see more insights.
          </p>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <LightBulbIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Insights</p>
              <p className="text-lg font-bold text-gray-900">{insights.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-lg font-bold text-gray-900">
                {insights.filter(i => i.priority === 'high').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Implemented</p>
              <p className="text-lg font-bold text-gray-900">
                {insights.filter(i => i.status === 'implemented').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ClockIcon className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">New</p>
              <p className="text-lg font-bold text-gray-900">
                {insights.filter(i => i.status === 'new').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Insight Details Modal */}
      {showInsightDetails && selectedInsight && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedInsight.title}
                </h3>
                <button
                  onClick={() => {
                    setShowInsightDetails(false)
                    setSelectedInsight(null)
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-600">{selectedInsight.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Confidence Level</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedInsight.confidence}%</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Expected Impact</p>
                  <p className="text-sm font-medium text-gray-900">{selectedInsight.impact}</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-2">Tags:</p>
                <div className="flex flex-wrap gap-1">
                  {selectedInsight.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowInsightDetails(false)
                    setSelectedInsight(null)
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => handleDismissInsight(selectedInsight)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Dismiss
                </button>
                <button
                  onClick={() => handleImplementInsight(selectedInsight)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Implement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
