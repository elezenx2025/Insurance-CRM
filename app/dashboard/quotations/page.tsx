'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

type QuotationStatus = 'pending' | 'converted'
type InsuranceType = 'Health' | 'Motor' | 'Life' | 'Fire' | 'Marine' | 'Other'

interface Quotation {
  id: string
  customerName: string
  customerId: string
  leadId: string
  leadName: string
  mobile: string
  pan?: string
  aadhaar?: string
  insuranceType: InsuranceType
  status: QuotationStatus
  createdAt: string
}

const sampleQuotations: Quotation[] = [
  {
    id: 'Q-1001',
    customerName: 'Rohit Sharma',
    customerId: 'CUST-001',
    leadId: 'LEAD-101',
    leadName: 'Rohit Sharma',
    mobile: '9876543210',
    pan: 'ABCDE1234F',
    aadhaar: '1234 5678 9012',
    insuranceType: 'Health',
    status: 'pending',
    createdAt: '2025-05-01',
  },
  {
    id: 'Q-1002',
    customerName: 'Priya Verma',
    customerId: 'CUST-002',
    leadId: 'LEAD-102',
    leadName: 'Priya Verma',
    mobile: '9988776655',
    pan: 'PQRSV5678L',
    aadhaar: '2345 6789 0123',
    insuranceType: 'Motor',
    status: 'pending',
    createdAt: '2025-06-12',
  },
  {
    id: 'Q-1003',
    customerName: 'Aman Gupta',
    customerId: 'CUST-003',
    leadId: 'LEAD-103',
    leadName: 'Aman Gupta',
    mobile: '9123456780',
    pan: 'LMNOP3456Z',
    aadhaar: '5678 9012 3456',
    insuranceType: 'Life',
    status: 'converted',
    createdAt: '2025-04-19',
  },
  {
    id: 'Q-1004',
    customerName: 'Meera Iyer',
    customerId: 'CUST-004',
    leadId: 'LEAD-104',
    leadName: 'Meera Iyer',
    mobile: '9090909090',
    insuranceType: 'Fire',
    status: 'pending',
    createdAt: '2025-06-28',
  },
]

type SearchField =
  | 'All'
  | 'Customer Name'
  | 'Customer ID'
  | 'Lead ID'
  | 'Lead Name'
  | 'Mobile Number'
  | 'PAN Number'
  | 'Aadhaar Number'

export default function QuotationsPage() {
  const router = useRouter()
  const [searchField, setSearchField] = useState<SearchField>('All')
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<'All' | InsuranceType>('All')

  const data = sampleQuotations

  const pending = useMemo(() => data.filter((q) => q.status === 'pending'), [data])

  const results = useMemo(() => {
    let items = pending
    if (typeFilter !== 'All') {
      items = items.filter((q) => q.insuranceType === typeFilter)
    }
    const q = query.trim().toLowerCase()
    if (!q || searchField === 'All') return items
    switch (searchField) {
      case 'Customer Name':
        return items.filter((x) => x.customerName.toLowerCase().includes(q))
      case 'Customer ID':
        return items.filter((x) => x.customerId.toLowerCase().includes(q))
      case 'Lead ID':
        return items.filter((x) => x.leadId.toLowerCase().includes(q))
      case 'Lead Name':
        return items.filter((x) => x.leadName.toLowerCase().includes(q))
      case 'Mobile Number':
        return items.filter((x) => x.mobile.replace(/\s/g, '').includes(q.replace(/\s/g, '')))
      case 'PAN Number':
        return items.filter((x) => (x.pan || '').toLowerCase().includes(q))
      case 'Aadhaar Number':
        return items.filter((x) => (x.aadhaar || '').replace(/\s/g, '').includes(q.replace(/\s/g, '')))
      default:
        return items
    }
  }, [pending, query, searchField, typeFilter])

  const handleNew = () => router.push('/dashboard/presale/quotation')
  const handleView = (id: string) => alert(`View quotation ${id}`)
  const handleEdit = (id: string) => alert(`Edit quotation ${id}`)
  const handleDelete = (id: string) => {
    const ok = confirm(`Delete quotation ${id}?`)
    if (ok) alert('Deleted (demo)')
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header: title left, button right */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Insurance Quotation</h1>
        <button onClick={handleNew} className="inline-flex items-center px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors">
          New Quotation
        </button>
      </div>

      {/* Search Row */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Search by</label>
            <select
              value={searchField}
              onChange={(e) => setSearchField(e.target.value as SearchField)}
              className="w-full border rounded-md px-3 py-2 text-sm"
            >
              {['All','Customer Name','Customer ID','Lead ID','Lead Name','Mobile Number','PAN Number','Aadhaar Number'].map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Query</label>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter value..."
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Insurance Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="w-full border rounded-md px-3 py-2 text-sm"
            >
              <option value="All">All</option>
              {(['Health','Motor','Life','Fire','Marine','Other'] as InsuranceType[]).map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end gap-2">
            <button onClick={() => { /* search happens live */ }} className="px-4 py-2 rounded-md bg-gray-800 text-white text-sm">Search</button>
            <button onClick={() => { setQuery(''); setSearchField('All'); setTypeFilter('All') }} className="px-4 py-2 rounded-md border text-sm">Clear</button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Pending Quotations</h2>
            <p className="text-xs text-gray-500">Showing {results.length} of {pending.length} pending</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-2 text-left">Quotation ID</th>
                <th className="px-4 py-2 text-left">Customer</th>
                <th className="px-4 py-2 text-left">Customer ID</th>
                <th className="px-4 py-2 text-left">Lead ID</th>
                <th className="px-4 py-2 text-left">Mobile</th>
                <th className="px-4 py-2 text-left">Insurance Type</th>
                <th className="px-4 py-2 text-left">Created</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {results.map((q) => (
                <tr key={q.id} className="border-t">
                  <td className="px-4 py-2">{q.id}</td>
                  <td className="px-4 py-2">{q.customerName}</td>
                  <td className="px-4 py-2">{q.customerId}</td>
                  <td className="px-4 py-2">{q.leadId}</td>
                  <td className="px-4 py-2">{q.mobile}</td>
                  <td className="px-4 py-2">{q.insuranceType}</td>
                  <td className="px-4 py-2">{q.createdAt}</td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <button onClick={() => handleView(q.id)} className="px-2 py-1 text-xs rounded border">View</button>
                      <button onClick={() => handleEdit(q.id)} className="px-2 py-1 text-xs rounded border">Edit</button>
                      <button onClick={() => handleDelete(q.id)} className="px-2 py-1 text-xs rounded border text-red-600">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {results.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-gray-500">No pending quotations found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}



