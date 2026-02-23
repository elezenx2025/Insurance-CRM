'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Quote {
  company: string
  od?: number
  tp?: number
  addons?: number
  total: number
  features: string[]
}

export default function CorporateCompareQuotes() {
  const router = useRouter()
  const [input, setInput] = useState<any>(null)
  const [selected, setSelected] = useState<string>('')
  const [customer, setCustomer] = useState<any>(null)

  useEffect(() => {
    try {
      const data = sessionStorage.getItem('corporateQuotationInput')
      if (data) setInput(JSON.parse(data))
      const cust = sessionStorage.getItem('selectedCustomer') || sessionStorage.getItem('quotationSelectedCustomer')
      if (cust) setCustomer(JSON.parse(cust))
      if (!cust) {
        const pending = sessionStorage.getItem('pendingQuotation')
        if (pending) {
          const pq = JSON.parse(pending)
          const derived = {
            name: pq.companyName || [pq.firstName, pq.lastName].filter(Boolean).join(' '),
            email: pq.email,
            phone: pq.phone,
            city: pq.city,
            state: pq.state,
            customerId: pq.customerId,
            companyName: pq.companyName,
            customerType: pq.customerType
          }
          setCustomer(derived)
        }
      }
      if (!cust && !sessionStorage.getItem('pendingQuotation')) {
        // Fallback to customer draft saved at Customer Information step
        const draft = sessionStorage.getItem('quotationCustomerDraft')
        if (draft) {
          const d = JSON.parse(draft)
          const derived = {
            name: d.companyName || [d.firstName, d.lastName].filter(Boolean).join(' '),
            email: d.email,
            phone: d.phone,
            city: d.city,
            state: d.state,
            customerId: d.customerId,
            companyName: d.companyName,
            customerType: d.customerType || 'INDIVIDUAL'
          }
          setCustomer(derived)
        }
      }
    } catch {}
  }, [])

  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  // Simulate integrated API calls based on totals
  useEffect(() => {
    if (!input) return
    setLoading(true)
    const totalEmployees = Number(input?.data?.totalEmployees || 0)
    const totalInsured = Number(input?.data?.totalInsured || 0)
    const base = Math.max(totalEmployees, 1) * 1200 + Math.max(totalInsured, 1) * 800
    const mockQuotes: Quote[] = [
      { company: 'New India', total: Math.round(base * 0.95), features: ['Cashless', 'PAN-India Network', '24x7 Support'] },
      { company: 'United India', total: Math.round(base * 0.99), features: ['Cashless', 'Ambulance Cover', 'Wellness'] },
      { company: 'HDFC ERGO', total: Math.round(base * 1.03), features: ['Cashless', 'OPD Cover', 'Wellness'] },
    ]
    const timer = setTimeout(() => {
      setQuotes(mockQuotes)
      setLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [input])

  const handleSaveProposal = () => {
    const chosen = quotes.find(q => q.company === selected)
    if (!chosen) return
    // Store draft/proposal
    const drafts = JSON.parse(localStorage.getItem('policyDrafts') || '[]')
    const proposal = {
      id: `PROPOSAL-${Date.now().toString().slice(-6)}`,
      policyType: input?.policyType || 'CORPORATE',
      customerType: 'CORPORATE',
      // normalized selected quote structure used by proposals dashboard
      selectedQuote: {
        companyName: chosen.company,
        totalPremium: chosen.total,
        status: 'ACTIVE'
      },
      // minimal customer and policy details for rendering and workflows
      customerInfo: {
        customerType: 'CORPORATE',
        companyName: customer?.companyName || customer?.name || input?.data?.companyName || 'Corporate Customer',
        email: customer?.email || input?.data?.email,
        phone: customer?.phone || input?.data?.phone,
        customerId: customer?.customerId || input?.data?.customerId
      },
      policyDetails: {
        policyType: input?.policyType,
        policyTerm: 1
      },
      createdAt: new Date().toISOString(),
      status: 'PENDING'
    }
    localStorage.setItem('policyDrafts', JSON.stringify([proposal, ...drafts]))
    // Clear session to avoid prefill when returning
    try {
      sessionStorage.removeItem('selectedCustomer')
      sessionStorage.removeItem('quotationCustomerDraft')
      sessionStorage.removeItem('corporateQuotationInput')
    } catch {}
    router.push('/dashboard/presale/policy-proposals')
  }

  const handleIssueNow = () => {
    const chosen = quotes.find(q => q.company === selected)
    if (!chosen) return
    const pending = {
      ...input,
      selectedCompany: chosen.company,
      quotedPremium: chosen.total,
      action: 'ISSUE_POLICY'
    }
    sessionStorage.setItem('pendingQuotation', JSON.stringify(pending))
    router.push('/dashboard/presale/email-verification')
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Corporate Quote Comparison</h1>
        <p className="text-gray-600 text-sm mt-1">Review quotes, then save as proposal or issue policy.</p>
      </div>
      {/* Company details row */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="w-full bg-white rounded-xl border p-4 flex flex-wrap items-center gap-6 text-sm text-gray-700">
          <div><span className="font-medium">Customer:</span> {customer?.name || customer?.companyName || input?.data?.companyName || [input?.data?.firstName, input?.data?.lastName].filter(Boolean).join(' ') || '-'}</div>
          {(customer?.customerType || input?.data?.customerType) && (
            <div><span className="font-medium">Type:</span> {customer?.customerType || input?.data?.customerType}</div>
          )}
          {(customer?.customerId || input?.data?.customerId) && (
            <div><span className="font-medium">ID:</span> {customer?.customerId || input?.data?.customerId}</div>
          )}
          {(customer?.email || input?.data?.email) && (<div><span className="font-medium">Email:</span> {customer?.email || input?.data?.email}</div>)}
          {(customer?.phone || input?.data?.phone) && (<div><span className="font-medium">Phone:</span> {customer?.phone || input?.data?.phone}</div>)}
          {(customer?.city || input?.data?.city) && (
            <div><span className="font-medium">Location:</span> {(customer?.city || input?.data?.city)}{(customer?.state || input?.data?.state) ? `, ${(customer?.state || input?.data?.state)}` : ''}</div>
          )}
          <div className="ml-auto text-gray-500">{new Date().toLocaleDateString()}</div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left - Input Summary */}
        <div className="lg:col-span-3 rounded-lg border p-4 bg-indigo-50 border-indigo-100">
          <h2 className="text-lg font-semibold mb-2">Input Summary</h2>
          <div className="text-sm text-gray-700 space-y-1">
            <p><span className="font-medium">Policy Type:</span> {input?.policyType || '-'}</p>
            <p><span className="font-medium">Top Mgmt:</span> {input?.data?.topMgmtCount ?? '-'}</p>
            <p><span className="font-medium">Senior Mgmt:</span> {input?.data?.seniorMgmtCount ?? '-'}</p>
            <p><span className="font-medium">Middle Mgmt:</span> {input?.data?.middleMgmtCount ?? '-'}</p>
            {typeof input?.data?.familyMembersCount !== 'undefined' && (
              <p><span className="font-medium">Family Members:</span> {input?.data?.familyMembersCount}</p>
            )}
            {typeof input?.data?.totalEmployees !== 'undefined' && (
              <p><span className="font-medium">Total Employees:</span> {input?.data?.totalEmployees}</p>
            )}
            {input?.data?.prevInsuranceCompany && (
              <p><span className="font-medium">Previous Insurer:</span> {input?.data?.prevInsuranceCompany}</p>
            )}
          </div>
        </div>

        {/* Middle - Quotes */}
        <div className="lg:col-span-6 rounded-xl border p-4 bg-cyan-50 border-cyan-100">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Company Quotes</h2>
            {selected && (
              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">Selected: {selected}</span>
            )}
          </div>
          <div className="space-y-3">
            {loading && (
              <div className="p-4 text-sm text-gray-600">Fetching quotes from insurers...</div>
            )}
            {!loading && quotes.map(q => {
              const isActive = selected === q.company
              return (
                <label key={q.company} className={`flex items-center justify-between border rounded-lg p-4 cursor-pointer transition-all ${isActive ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50' : 'hover:bg-gray-50'}`}>
                  <div className="flex items-center gap-4">
                    <input type="radio" name="quote" value={q.company} checked={isActive} onChange={() => setSelected(q.company)} />
                    <div>
                      <p className="text-base font-semibold text-gray-900">{q.company}</p>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {q.features.map(f => (
                          <span key={f} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">{f}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Total Premium</p>
                    <p className="text-2xl font-bold text-gray-900">₹{q.total.toLocaleString('en-IN')}</p>
                  </div>
                </label>
              )
            })}
          </div>
        </div>

        {/* Right - Coverage Details */}
        <div className="lg:col-span-3 rounded-xl border p-4 bg-amber-50 border-amber-100">
          <h2 className="text-lg font-semibold mb-2">Coverage Details</h2>
          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
            <li>Room Rent Limits</li>
            <li>Day Care Procedures</li>
            <li>Ambulance Cover</li>
            <li>Maternity (if opted)</li>
          </ul>
        </div>
      </div>
      {/* Bottom action bar */}
      <div className="max-w-7xl mx-auto mt-6">
        <div className="w-full bg-white rounded-xl border p-4 flex items-center justify-between">
          <button onClick={() => {
            const policy = input?.policyType
            if (policy === 'LIFE_GTLI') {
              sessionStorage.setItem('lifeGtliRestore','1')
              router.push('/dashboard/presale/quotation/corporate/life-gtli')
            } else if (policy === 'HEALTH_GMC') {
              sessionStorage.setItem('healthGmcRestore','1')
              router.push('/dashboard/presale/quotation/corporate/health-gmc')
            } else if (policy === 'LIFE_GPA') {
              sessionStorage.setItem('lifeGpaRestore','1')
              router.push('/dashboard/presale/quotation/corporate/life-gpa')
            } else {
              router.back()
            }
          }} className="px-4 py-2 border rounded-md text-gray-700 bg-white hover:bg-gray-50">Previous</button>
          <div className="flex gap-2">
            <button disabled={!selected} onClick={handleSaveProposal} className="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:opacity-50 hover:bg-indigo-700">Save as Proposal</button>
            <button disabled={!selected} onClick={handleIssueNow} className="px-4 py-2 bg-green-600 text-white rounded-md disabled:opacity-50 hover:bg-green-700">Issue Policy Now</button>
          </div>
        </div>
      </div>
    </div>
  )
}


