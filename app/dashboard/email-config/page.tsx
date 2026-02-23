'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon, EnvelopeIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function EmailConfigPage() {
  const router = useRouter()
  const [testEmail, setTestEmail] = useState('')
  const [isTesting, setIsTesting] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleBack = () => {
    router.push('/dashboard')
  }

  const testSMTPConnection = async () => {
    setIsTesting(true)
    try {
      const response = await fetch('/api/email/test')
      const data = await response.json()
      
      if (data.success) {
        setConnectionStatus('success')
        toast.success('SMTP connection successful!')
      } else {
        setConnectionStatus('error')
        toast.error('SMTP connection failed')
      }
    } catch (error) {
      setConnectionStatus('error')
      toast.error('Failed to test SMTP connection')
    } finally {
      setIsTesting(false)
    }
  }

  const sendTestEmail = async () => {
    if (!testEmail) {
      toast.error('Please enter an email address')
      return
    }

    setIsTesting(true)
    try {
      const response = await fetch('/api/email/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: testEmail,
          subject: 'Test Email from ElezenX Insurance',
          message: 'This is a test email to verify SMTP configuration.'
        })
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success('Test email sent successfully!')
      } else {
        toast.error('Failed to send test email')
      }
    } catch (error) {
      toast.error('Failed to send test email')
    } finally {
      setIsTesting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Dashboard
            </button>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Email Configuration</h1>
          <p className="text-gray-600 mt-2">
            Configure and test SMTP settings for email notifications
          </p>
        </div>

        {/* SMTP Configuration */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">SMTP Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Host</label>
              <input
                type="text"
                value="smtp.gmail.com"
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Port</label>
              <input
                type="text"
                value="587"
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From Email</label>
              <input
                type="email"
                value="noreply@elezenx.com"
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From Name</label>
              <input
                type="text"
                value="ElezenX Insurance"
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Connection Test */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">SMTP Connection Test</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={testSMTPConnection}
              disabled={isTesting}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isTesting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Testing...
                </>
              ) : (
                <>
                  <EnvelopeIcon className="h-4 w-4 mr-2" />
                  Test SMTP Connection
                </>
              )}
            </button>
            
            {connectionStatus === 'success' && (
              <div className="flex items-center text-green-600">
                <CheckCircleIcon className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Connection Successful</span>
              </div>
            )}
            
            {connectionStatus === 'error' && (
              <div className="flex items-center text-red-600">
                <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Connection Failed</span>
              </div>
            )}
          </div>
        </div>

        {/* Test Email */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Send Test Email</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Email Address
              </label>
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="Enter email address to send test email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={sendTestEmail}
              disabled={isTesting || !testEmail}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {isTesting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <EnvelopeIcon className="h-4 w-4 mr-2" />
                  Send Test Email
                </>
              )}
            </button>
          </div>
        </div>

        {/* Email Templates Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Email Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Quotation Email</h3>
              <p className="text-xs text-gray-600">Sent when quotation is generated with policy details and premium information.</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">OTP Verification</h3>
              <p className="text-xs text-gray-600">Sent when customer selects an insurance plan for identity verification.</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Policy Issued</h3>
              <p className="text-xs text-gray-600">Sent when policy is successfully issued with policy number and certificate.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
