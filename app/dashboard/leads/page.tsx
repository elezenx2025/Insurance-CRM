'use client'

import { useEffect, useState } from 'react'

interface Lead {
  id: string
  name: string
  email: string
  phone: string
  insuranceType: string
  status: string
  statusColor: string
  source: string
  createdAt: string
  lastContact: string
  notes: string
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    // Simulate API call with demo data
    const fetchLeads = async () => {
      try {
        setTimeout(() => {
          setLeads([
            {
              id: '1',
              name: 'Nisha Kapoor',
              email: 'nisha.k@email.com',
              phone: '+91 98765 43210',
              insuranceType: 'LIFE',
              status: 'NEW',
              statusColor: 'bg-blue-100 text-blue-800',
              source: 'Website',
              createdAt: '2024-10-09',
              lastContact: '2024-10-09',
              notes: 'Interested in term life insurance'
            },
            {
              id: '2',
              name: 'Nexus Enterprises',
              email: 'contact@nexus.com',
              phone: '+91 98765 43211',
              insuranceType: 'FIRE',
              status: 'QUALIFIED',
              statusColor: 'bg-green-100 text-green-800',
              source: 'Referral',
              createdAt: '2024-10-08',
              lastContact: '2024-10-09',
              notes: 'Corporate fire insurance for office building'
            },
            {
              id: '3',
              name: 'Kavita Reddy',
              email: 'kavita.r@email.com',
              phone: '+91 98765 43212',
              insuranceType: 'MOTOR',
              status: 'CONTACTED',
              statusColor: 'bg-orange-100 text-orange-800',
              source: 'Social Media',
              createdAt: '2024-10-07',
              lastContact: '2024-10-08',
              notes: 'Looking for comprehensive car insurance'
            },
            {
              id: '4',
              name: 'Deepak Malhotra',
              email: 'deepak.m@email.com',
              phone: '+91 98765 43213',
              insuranceType: 'HEALTH',
              status: 'NEW',
              statusColor: 'bg-blue-100 text-blue-800',
              source: 'Website',
              createdAt: '2024-10-06',
              lastContact: '2024-10-06',
              notes: 'Family health insurance coverage needed'
            },
            {
              id: '5',
              name: 'Priya Sharma',
              email: 'priya.s@email.com',
              phone: '+91 98765 43214',
              insuranceType: 'LIFE',
              status: 'PROPOSAL SENT',
              statusColor: 'bg-purple-100 text-purple-800',
              source: 'Email Campaign',
              createdAt: '2024-10-05',
              lastContact: '2024-10-07',
              notes: 'Sent life insurance proposal, awaiting response'
            },
            {
              id: '6',
              name: 'TechCorp Solutions',
              email: 'hr@techcorp.com',
              phone: '+91 98765 43215',
              insuranceType: 'GROUP HEALTH',
              status: 'NEGOTIATING',
              statusColor: 'bg-yellow-100 text-yellow-800',
              source: 'Cold Call',
              createdAt: '2024-10-04',
              lastContact: '2024-10-08',
              notes: 'Group health insurance for 50+ employees'
            }
          ])
          setLoading(false)
        }, 500)
      } catch (error) {
        console.error('Error fetching leads:', error)
        setLoading(false)
      }
    }

    fetchLeads()
  }, [])

  const filteredLeads = leads.filter(lead => {
    if (filter === 'all') return true
    return lead.status.toLowerCase().replace(' ', '_') === filter
  })

  const getStatusCounts = () => {
    const counts = {
      all: leads.length,
      new: leads.filter(l => l.status === 'NEW').length,
      qualified: leads.filter(l => l.status === 'QUALIFIED').length,
      contacted: leads.filter(l => l.status === 'CONTACTED').length,
      proposal_sent: leads.filter(l => l.status === 'PROPOSAL SENT').length,
      negotiating: leads.filter(l => l.status === 'NEGOTIATING').length
    }
    return counts
  }

  const statusCounts = getStatusCounts()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back to Dashboard Button */}
      <div>
        <button
          onClick={() => window.location.href = '/dashboard'}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>
      </div>

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Leads Management</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage and track your insurance leads
        </p>
      </div>

      {/* Status Filter */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Status Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {[
            { key: 'all', label: 'All Leads', color: 'bg-gray-100 text-gray-800' },
            { key: 'new', label: 'New', color: 'bg-blue-100 text-blue-800' },
            { key: 'qualified', label: 'Qualified', color: 'bg-green-100 text-green-800' },
            { key: 'contacted', label: 'Contacted', color: 'bg-orange-100 text-orange-800' },
            { key: 'proposal_sent', label: 'Proposal Sent', color: 'bg-purple-100 text-purple-800' },
            { key: 'negotiating', label: 'Negotiating', color: 'bg-yellow-100 text-yellow-800' }
          ].map((status) => (
            <button
              key={status.key}
              onClick={() => setFilter(status.key)}
              className={`p-4 rounded-lg border-2 transition-all ${
                filter === status.key
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                  {statusCounts[status.key as keyof typeof statusCounts]}
                </div>
                <p className="text-sm font-medium text-gray-700 mt-2">{status.label}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {filter === 'all' ? 'All Leads' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Leads`}
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lead
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Insurance Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                      <div className="text-sm text-gray-500">{lead.email}</div>
                      <div className="text-sm text-gray-500">{lead.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {lead.insuranceType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${lead.statusColor}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {lead.source}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(lead.lastContact).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        View
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        Contact
                      </button>
                      <button className="text-purple-600 hover:text-purple-900">
                        Convert
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Details Summary */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{leads.length}</div>
            <div className="text-sm text-gray-600">Total Leads</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {leads.filter(l => l.status === 'QUALIFIED').length}
            </div>
            <div className="text-sm text-gray-600">Qualified Leads</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {leads.filter(l => ['PROPOSAL SENT', 'NEGOTIATING'].includes(l.status)).length}
            </div>
            <div className="text-sm text-gray-600">Hot Leads</div>
          </div>
        </div>
      </div>
    </div>
  )
}
