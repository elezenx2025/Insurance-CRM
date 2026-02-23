'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeftIcon, ChartBarIcon } from '@heroicons/react/24/outline'

export default function ReportsPage() {
  const router = useRouter()

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
                <span className="ml-4 text-gray-900 font-medium">Reports & MIS</span>
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
            <h1 className="text-lg font-semibold text-gray-900">Reports & MIS</h1>
            <p className="mt-1 text-sm text-gray-600">
              Comprehensive reporting and management information system for business insights.
            </p>
          </div>
        </div>
      </div>

      {/* Report Categories */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Agent Business Monitoring Reports */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:border-blue-200">
          <div className="p-5">
            <div className="flex items-start mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 mr-4 shadow-sm">
                <ChartBarIcon className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-900 mb-1">Agent Business Monitoring</h3>
                <p className="text-xs text-gray-500 leading-relaxed">Track agent sales performance, conversions, and business metrics</p>
              </div>
            </div>
            <div className="space-y-1">
              <button
                onClick={() => router.push('/dashboard/reports/agent-business/sales-performance')}
                className="w-full text-left p-3 rounded-lg hover:bg-blue-50 border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all duration-200 group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 group-hover:text-blue-700 transition-colors">Sales Performance</p>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">Premium collected, policies sold, and performance metrics</p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
              <button
                onClick={() => router.push('/dashboard/reports/agent-business/top-performers')}
                className="w-full text-left p-3 rounded-lg hover:bg-blue-50 border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all duration-200 group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 group-hover:text-blue-700 transition-colors">Top Performers</p>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">Ranking of agents based on sales volume and value</p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
              <button
                onClick={() => router.push('/dashboard/reports/agent-business/conversion-analysis')}
                className="w-full text-left p-3 rounded-lg hover:bg-blue-50 border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all duration-200 group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 group-hover:text-blue-700 transition-colors">Conversion Analysis</p>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">Leads generated vs policies sold analysis</p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Productivity and Activity Reports */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:border-green-200">
          <div className="p-5">
            <div className="flex items-start mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600 mr-4 shadow-sm">
                <ChartBarIcon className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-900 mb-1">Productivity & Activity</h3>
                <p className="text-xs text-gray-500 leading-relaxed">Monitor agent productivity, activity levels, and engagement</p>
              </div>
            </div>
            <div className="space-y-1">
              <button
                onClick={() => router.push('/dashboard/reports/productivity/activity-report')}
                className="w-full text-left p-3 rounded-lg hover:bg-green-50 border border-gray-100 hover:border-green-200 hover:shadow-sm transition-all duration-200 group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 group-hover:text-green-700 transition-colors">Activity Report</p>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">Customer visits, calls, and touchpoints per agent</p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
              <button
                onClick={() => router.push('/dashboard/reports/productivity/login-activity')}
                className="w-full text-left p-3 rounded-lg hover:bg-green-50 border border-gray-100 hover:border-green-200 hover:shadow-sm transition-all duration-200 group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 group-hover:text-green-700 transition-colors">Login Activity</p>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">Platform engagement and CRM usage monitoring</p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Revenue and Financial Reports */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:border-yellow-200">
          <div className="p-5">
            <div className="flex items-start mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 mr-4 shadow-sm">
                <ChartBarIcon className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-900 mb-1">Revenue & Financial</h3>
                <p className="text-xs text-gray-500 leading-relaxed">Financial performance, commissions, and profitability analysis</p>
              </div>
            </div>
            <div className="space-y-1">
              <button
                onClick={() => router.push('/dashboard/reports/revenue/contribution-report')}
                className="w-full text-left p-3 rounded-lg hover:bg-yellow-50 border border-gray-100 hover:border-yellow-200 hover:shadow-sm transition-all duration-200 group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 group-hover:text-yellow-700 transition-colors">Revenue Contribution</p>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">Premium breakdown by product, geography, and agent</p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
              <button
                onClick={() => router.push('/dashboard/reports/revenue/commission-payout')}
                className="w-full text-left p-3 rounded-lg hover:bg-yellow-50 border border-gray-100 hover:border-yellow-200 hover:shadow-sm transition-all duration-200 group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 group-hover:text-yellow-700 transition-colors">Commission Payout</p>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">Commissions earned by each agent</p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Compliance and Quality Reports */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div className="p-4">
            <div className="flex items-center mb-3">
              <div className="p-2 rounded-lg bg-purple-500 mr-3">
                <ChartBarIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">Compliance and Quality Reports</h3>
                <p className="text-sm text-gray-600">Regulatory compliance, licensing, and quality metrics</p>
              </div>
            </div>
            <div className="space-y-1">
              <button
                onClick={() => router.push('/dashboard/reports/compliance/licensing-status')}
                className="w-full text-left p-2 rounded-md hover:bg-gray-50 border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Agent Licensing and Certification Status</p>
                    <p className="text-xs text-gray-500 mt-1">License renewals and compliance status tracking</p>
                  </div>
                </div>
              </button>
              <button
                onClick={() => router.push('/dashboard/reports/compliance/error-discrepancy')}
                className="w-full text-left p-2 rounded-md hover:bg-gray-50 border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Error and Discrepancy Report</p>
                    <p className="text-xs text-gray-500 mt-1">Incorrect or incomplete policy issuance data</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Customer-Centric Reports */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div className="p-4">
            <div className="flex items-center mb-3">
              <div className="p-2 rounded-lg bg-pink-500 mr-3">
                <ChartBarIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">Customer-Centric Reports</h3>
                <p className="text-sm text-gray-600">Customer feedback, retention, and satisfaction analysis</p>
      </div>
            </div>
            <div className="space-y-1">
              <button
                onClick={() => router.push('/dashboard/reports/customer/feedback-complaints')}
                className="w-full text-left p-2 rounded-md hover:bg-gray-50 border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Customer Feedback and Complaint Report</p>
                    <p className="text-xs text-gray-500 mt-1">Analysis of complaints received against agents</p>
                </div>
                </div>
                        </button>
                        <button
                onClick={() => router.push('/dashboard/reports/customer/retention-report')}
                className="w-full text-left p-2 rounded-md hover:bg-gray-50 border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Customer Retention Report</p>
                    <p className="text-xs text-gray-500 mt-1">Repeat business and retention rates analysis</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Training and Development Reports */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div className="p-4">
            <div className="flex items-center mb-3">
              <div className="p-2 rounded-lg bg-indigo-500 mr-3">
                <ChartBarIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">Training and Development Reports</h3>
                <p className="text-sm text-gray-600">Training attendance, performance, and development tracking</p>
              </div>
            </div>
            <div className="space-y-1">
              <button
                onClick={() => router.push('/dashboard/reports/training/attendance-performance')}
                className="w-full text-left p-2 rounded-md hover:bg-gray-50 border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Agent Training Attendance and Performance</p>
                    <p className="text-xs text-gray-500 mt-1">Participation in training sessions and scores in assessments</p>
                  </div>
                </div>
              </button>
            </div>
            </div>
          </div>

        {/* Operational and Efficiency Reports */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div className="p-4">
            <div className="flex items-center mb-3">
              <div className="p-2 rounded-lg bg-orange-500 mr-3">
                <ChartBarIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">Operational and Efficiency Reports</h3>
                <p className="text-sm text-gray-600">Operational metrics, TAT analysis, and system performance</p>
              </div>
            </div>
            <div className="space-y-1">
                <button
                onClick={() => router.push('/dashboard/reports/operational/policy-issuance-tat')}
                className="w-full text-left p-2 rounded-md hover:bg-gray-50 border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-900">Policy Issuance TAT Report</p>
                    <p className="text-xs text-gray-500 mt-1">Average turnaround time for issuing policies</p>
                  </div>
                </div>
              </button>
              <button
                onClick={() => router.push('/dashboard/reports/operational/pending-cases')}
                className="w-full text-left p-2 rounded-md hover:bg-gray-50 border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-900">Pending Cases and Follow-up Report</p>
                    <p className="text-xs text-gray-500 mt-1">Policies or claims pending completion</p>
                  </div>
                </div>
                </button>
                <button
                onClick={() => router.push('/dashboard/reports/operational/system-downtime')}
                className="w-full text-left p-2 rounded-md hover:bg-gray-50 border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">System Downtime Impact Report</p>
                    <p className="text-xs text-gray-500 mt-1">Issues faced due to Application or system downtimes</p>
                  </div>
                </div>
                </button>
            </div>
          </div>
        </div>

        {/* Geographical and Demographic Insights */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div className="p-4">
            <div className="flex items-center mb-3">
              <div className="p-2 rounded-lg bg-teal-500 mr-3">
                <ChartBarIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                <h3 className="text-base font-semibold text-gray-900">Geographical and Demographic Insights</h3>
                <p className="text-sm text-gray-600">Geographic performance and customer demographic analysis</p>
              </div>
            </div>
            <div className="space-y-1">
                <button
                onClick={() => router.push('/dashboard/reports/geographical/business-report')}
                className="w-full text-left p-2 rounded-md hover:bg-gray-50 border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Geography-wise Business Report</p>
                    <p className="text-xs text-gray-500 mt-1">Performance across different regions</p>
                  </div>
                </div>
                </button>
                <button
                onClick={() => router.push('/dashboard/reports/geographical/customer-demographics')}
                className="w-full text-left p-2 rounded-md hover:bg-gray-50 border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Customer Demographics Report</p>
                    <p className="text-xs text-gray-500 mt-1">Age, gender, and income-based segmentation of customers</p>
                  </div>
                </div>
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}