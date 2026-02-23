'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon, CheckCircleIcon, XCircleIcon, ClockIcon, CogIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface APIConfig {
  id: string
  vendorName: string
  serviceType: string
  apiEndpoint: string
  apiKey: string
  status: string
  lastTested: string
  responseTime: string
  successRate: string
}

export default function APIConfigurationPage() {
  const router = useRouter()
  const [apiConfigs, setApiConfigs] = useState<APIConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [testingApi, setTestingApi] = useState<string | null>(null)

  useEffect(() => {
    fetchAPIConfigs()
  }, [])

  const fetchAPIConfigs = async () => {
    try {
      const today = new Date()
      const mockAPIs: APIConfig[] = [
        {
          id: '1',
          vendorName: 'TeleConnect Solutions',
          serviceType: 'Calling Solution',
          apiEndpoint: 'https://api.teleconnect.com/v1/calls',
          apiKey: 'TC_**********************',
          status: 'Active',
          lastTested: today.toISOString().split('T')[0],
          responseTime: '245ms',
          successRate: '99.8%'
        },
        {
          id: '2',
          vendorName: 'SMS Gateway India',
          serviceType: 'SMS',
          apiEndpoint: 'https://api.smsgateway.in/v2/send',
          apiKey: 'SMS_**********************',
          status: 'Active',
          lastTested: today.toISOString().split('T')[0],
          responseTime: '180ms',
          successRate: '99.5%'
        },
        {
          id: '3',
          vendorName: 'WhatsApp Business',
          serviceType: 'WhatsApp',
          apiEndpoint: 'https://api.whatsappbiz.com/messages',
          apiKey: 'WA_**********************',
          status: 'Active',
          lastTested: today.toISOString().split('T')[0],
          responseTime: '320ms',
          successRate: '98.9%'
        },
        {
          id: '4',
          vendorName: 'MailChimp India',
          serviceType: 'Bulk Email',
          apiEndpoint: 'https://api.mailchimp.in/v3/campaigns',
          apiKey: 'MC_**********************',
          status: 'Active',
          lastTested: today.toISOString().split('T')[0],
          responseTime: '410ms',
          successRate: '99.2%'
        },
        {
          id: '5',
          vendorName: 'SecureNet Solutions',
          serviceType: 'Cyber Security',
          apiEndpoint: 'https://api.securenet.com/security/scan',
          apiKey: 'SN_**********************',
          status: 'Inactive',
          lastTested: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          responseTime: '-',
          successRate: '-'
        },
      ]

      setApiConfigs(mockAPIs)
      setLoading(false)
    } catch (error) {
      toast.error('Failed to fetch API configurations')
      setLoading(false)
    }
  }

  const handleTestAPI = async (apiId: string) => {
    setTestingApi(apiId)
    try {
      // Simulate API test
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('API test successful!')
      fetchAPIConfigs()
    } catch (error) {
      toast.error('API test failed')
    } finally {
      setTestingApi(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800'
      case 'Inactive':
        return 'bg-red-100 text-red-800'
      case 'Testing':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/dashboard/vendor-onboarding')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Vendor Onboarding
          </button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">API Configuration</h1>
          <p className="text-gray-600 mt-2">
            Configure and test vendor API integrations
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total APIs</p>
                <p className="text-2xl font-bold text-gray-900">{apiConfigs.length}</p>
              </div>
              <CogIcon className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active APIs</p>
                <p className="text-2xl font-bold text-green-600">
                  {apiConfigs.filter(api => api.status === 'Active').length}
                </p>
              </div>
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Response Time</p>
                <p className="text-2xl font-bold text-purple-600">289ms</p>
              </div>
              <ClockIcon className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Success Rate</p>
                <p className="text-2xl font-bold text-teal-600">99.4%</p>
              </div>
              <CheckCircleIcon className="h-8 w-8 text-teal-600" />
            </div>
          </div>
        </div>

        {/* API Configurations Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">API Configurations</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    API Endpoint
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    API Key
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Tested
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {apiConfigs.map((api) => (
                  <tr key={api.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {api.vendorName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {api.serviceType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                        {api.apiEndpoint}
                      </code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                        {api.apiKey}
                      </code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(api.lastTested).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>{api.responseTime}</div>
                      <div className="text-xs text-gray-500">{api.successRate} success</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(api.status)}`}>
                        {api.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleTestAPI(api.id)}
                          disabled={testingApi === api.id}
                          className="text-blue-600 hover:text-blue-900 disabled:text-gray-400"
                        >
                          {testingApi === api.id ? 'Testing...' : 'Test'}
                        </button>
                        <button
                        onClick={() => toast('Configure API')}
                          className="text-green-600 hover:text-green-900"
                        >
                          Configure
                        </button>
                        <button
                        onClick={() => toast('View logs')}
                          className="text-purple-600 hover:text-purple-900"
                        >
                          Logs
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}




