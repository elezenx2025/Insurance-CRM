'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon, DocumentCheckIcon, CurrencyDollarIcon, CreditCardIcon, BuildingLibraryIcon, ChartBarIcon, UserGroupIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function FinancePage() {
  const router = useRouter()

  const handleBack = () => {
    router.push('/dashboard')
  }

  const financeModules = [
    {
      id: 'data-review',
      title: 'Business Data Review',
      description: 'Review and approve monthly business data from operations team',
      href: '/dashboard/finance/data-review',
      icon: DocumentCheckIcon,
      color: 'blue'
    },
    {
      id: 'invoice-processing',
      title: 'Invoice Processing',
      description: 'Process invoices from agents and insurance intermediaries',
      href: '/dashboard/finance/invoice-processing',
      icon: CurrencyDollarIcon,
      color: 'green'
    },
    {
      id: 'payment-approval',
      title: 'Payment Approval',
      description: 'Approve payments to agents with 2-level authorization',
      href: '/dashboard/finance/payment-approval',
      icon: CreditCardIcon,
      color: 'orange'
    },
    {
      id: 'bank-operations',
      title: 'Bank Operations',
      description: 'Manage bank integration and payment distribution',
      href: '/dashboard/finance/bank-operations',
      icon: BuildingLibraryIcon,
      color: 'red'
    }
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 text-blue-600',
      green: 'bg-green-50 border-green-200 text-green-600',
      orange: 'bg-orange-50 border-orange-200 text-orange-600',
      red: 'bg-red-50 border-red-200 text-red-600'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          <h1 className="text-2xl font-bold text-gray-900">Finance Department</h1>
          <p className="text-gray-600 mt-2">
            Finance operations and payment management system
          </p>
        </div>

        {/* Finance Department Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Finance Department Access</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <div className="flex items-start">
                <span className="mr-2">•</span>
                <span>Review and approve business data from operations team</span>
              </div>
              <div className="flex items-start">
                <span className="mr-2">•</span>
                <span>Process invoices and payment approvals</span>
              </div>
            </div>
            <div>
              <div className="flex items-start">
                <span className="mr-2">•</span>
                <span>Manage bank integration and payment distribution</span>
              </div>
              <div className="flex items-start">
                <span className="mr-2">•</span>
                <span>Financial reporting and compliance tracking</span>
              </div>
            </div>
          </div>
        </div>

        {/* Finance Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {financeModules.map((module) => (
            <Link
              key={module.id}
              href={module.href}
              className="group block p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:border-gray-200"
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${getColorClasses(module.color)}`}>
                  <module.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {module.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {module.description}
                  </p>
                  <div className="mt-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Finance Access
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Finance Statistics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="text-sm font-medium text-gray-500">Pending Approvals</div>
            <div className="text-2xl font-bold text-yellow-600">12</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="text-sm font-medium text-gray-500">Total Payments</div>
            <div className="text-2xl font-bold text-gray-900">₹2,450,000</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="text-sm font-medium text-gray-500">Processed Today</div>
            <div className="text-2xl font-bold text-green-600">8</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="text-sm font-medium text-gray-500">Pending Review</div>
            <div className="text-2xl font-bold text-blue-600">5</div>
          </div>
        </div>
      </div>
    </div>
  )
}






