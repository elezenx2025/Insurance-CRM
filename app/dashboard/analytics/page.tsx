'use client'

import { useRouter } from 'next/navigation'
import {
  ArrowLeftIcon,
  CpuChipIcon,
  LightBulbIcon,
  ChartBarIcon,
  DocumentChartBarIcon,
} from '@heroicons/react/24/outline'

export default function AnalyticsPage() {
  const router = useRouter()

  const analyticsModules = [
    {
      id: 'ai-analytics',
      title: 'AI Analytics',
      description: 'Advanced AI-powered analytics including premium optimization, risk assessment, fraud detection, document analysis, and predictive analysis',
      icon: CpuChipIcon,
      href: '/dashboard/analytics/ai-analytics',
      color: 'bg-blue-500',
      features: [
        'Premium Optimization Engine',
        'Risk Assessment Analyzer',
        'Fraud Detection System',
        'Document Analysis AI',
        'Predictive Analysis Dashboard'
      ]
    },
    {
      id: 'ai-insights',
      title: 'AI Insights',
      description: 'Intelligent insights and recommendations including premium optimization opportunities, high-risk identification, suspicious claim patterns, market trends, client engagement, and process automation',
      icon: LightBulbIcon,
      href: '/dashboard/analytics/ai-insights',
      color: 'bg-purple-500',
      features: [
        'Premium Optimization Opportunities',
        'High-Risk Identification',
        'Suspicious Claim Pattern Detection',
        'Market Trend Analysis',
        'Client Engagement Optimization',
        'Process Automation Opportunities'
      ]
    },
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
                <span className="ml-4 text-gray-900 font-medium">Analytics</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      {/* Page header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="mt-1 text-sm text-gray-600">
              Advanced analytics and AI-powered insights for data-driven decision making.
            </p>
          </div>
        </div>
      </div>

      {/* Analytics Modules Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {analyticsModules.map((module) => {
          const IconComponent = module.icon
          return (
            <div
              key={module.id}
              onClick={() => router.push(module.href)}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <div className="flex items-start mb-4">
                <div className={`${module.color} p-4 rounded-lg mr-4`}>
                  <IconComponent className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 mb-2">
                    {module.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {module.description}
                  </p>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Key Features:</h4>
                <ul className="space-y-1">
                  {module.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-sm text-gray-500">Click to explore</span>
                <div className="flex items-center text-blue-600 group-hover:text-blue-800">
                  <span className="text-sm font-medium mr-1">Open</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CpuChipIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">AI Models Active</p>
              <p className="text-2xl font-bold text-gray-900">5</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <LightBulbIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Insights</p>
              <p className="text-2xl font-bold text-gray-900">23</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Accuracy Rate</p>
              <p className="text-2xl font-bold text-gray-900">94.2%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Analytics Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">Premium optimization analysis completed for Q1 2024</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">New fraud detection pattern identified in health insurance claims</p>
              <p className="text-xs text-gray-500">4 hours ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">Risk assessment model updated with latest market data</p>
              <p className="text-xs text-gray-500">6 hours ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">Client engagement optimization recommendations generated</p>
              <p className="text-xs text-gray-500">8 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}