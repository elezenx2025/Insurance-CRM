'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Quote {
  company: string
  total: number
  features: string[]
}

export default function HealthCompareQuotes() {
  const router = useRouter()
  const [input, setInput] = useState<any>(null)
  const [selected, setSelected] = useState<string>('')
  const [customer, setCustomer] = useState<any>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const data = sessionStorage.getItem('healthQuotationInput')
      if (data) setInput(JSON.parse(data))

      // Get customer info from session
      const selectedCust = sessionStorage.getItem('selectedCustomer')
      const quotationSelectedCust = sessionStorage.getItem('quotationSelectedCustomer')
      const pendingQuotation = sessionStorage.getItem('pendingQuotation')
      const quotationCustomerDraft = sessionStorage.getItem('quotationCustomerDraft')

      let customerData = null
      if (selectedCust) {
        customerData = JSON.parse(selectedCust)
      } else if (quotationSelectedCust) {
        customerData = JSON.parse(quotationSelectedCust)
      } else if (pendingQuotation) {
        const pq = JSON.parse(pendingQuotation)
        customerData = {
          name: pq.companyName || [pq.firstName, pq.lastName].filter(Boolean).join(' '),
          email: pq.email,
          phone: pq.phone,
          city: pq.city,
          state: pq.state,
          customerId: pq.customerId,
          companyName: pq.companyName,
          customerType: pq.customerType
        }
      } else if (quotationCustomerDraft) {
        const d = JSON.parse(quotationCustomerDraft)
        customerData = {
          name: d.companyName || [d.firstName, d.lastName].filter(Boolean).join(' '),
          email: d.email,
          phone: d.phone,
          city: d.city,
          state: d.state,
          customerId: d.customerId,
          companyName: d.companyName,
          customerType: d.customerType || 'INDIVIDUAL'
        }
      }
      setCustomer(customerData)
    } catch {}
  }, [])

  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  // Generate quotes based on plan details
  useEffect(() => {
    if (!input) return
    setLoading(true)
    
    const totalSumInsured = input.totalSumInsured || 100000
    const memberCount = input.members?.length || 1
    const planType = input.planType || 'Individual'
    
    // Base premium calculation
    const basePremium = totalSumInsured * 0.02 // 2% of sum insured
    const memberMultiplier = planType === 'Family Floater' ? 1.5 : 1.0
    const base = Math.round(basePremium * memberMultiplier)
    
    const mockQuotes: Quote[] = [
      { company: 'Star Health', total: Math.round(base * 0.95), features: ['Cashless', 'PAN-India Network', '24x7 Support'] },
      { company: 'HDFC ERGO', total: Math.round(base * 0.99), features: ['Cashless', 'Wellness Programs', 'OPD Cover'] },
      { company: 'ICICI Lombard', total: Math.round(base * 1.02), features: ['Cashless', 'Home Healthcare', 'AYUSH Benefits'] },
      { company: 'Bajaj Allianz', total: Math.round(base * 1.05), features: ['Cashless', 'Preventive Check-up', 'Multiplier Benefit'] }
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
    
    const drafts = JSON.parse(localStorage.getItem('policyDrafts') || '[]')
    const proposal = {
      id: `PROPOSAL-${Date.now().toString().slice(-6)}`,
      policyType: 'HEALTH',
      customerType: 'INDIVIDUAL',
      selectedQuote: {
        companyName: chosen.company,
        totalPremium: chosen.total,
        status: 'ACTIVE'
      },
      customerInfo: {
        customerType: customer?.customerType || 'INDIVIDUAL',
        firstName: customer?.firstName || input?.data?.firstName,
        lastName: customer?.lastName || input?.data?.lastName,
        name: customer?.name || [customer?.firstName, customer?.lastName].filter(Boolean).join(' ') || 'Individual Customer',
        email: customer?.email || input?.data?.email,
        phone: customer?.phone || input?.data?.phone,
        customerId: customer?.customerId || input?.data?.customerId,
        city: customer?.city || input?.data?.city,
        state: customer?.state || input?.data?.state,
        address: customer?.address || input?.data?.address,
        pincode: customer?.pincode || input?.data?.pincode,
      },
      policyDetails: {
        policyType: 'HEALTH',
        planType: input.planType,
        sumInsured: input.totalSumInsured,
        members: input.members,
        policyTerm: 1
      },
      quotedPremium: chosen.total,
      selectedCompany: chosen.company,
      createdAt: new Date().toISOString(),
      status: 'PENDING'
    }
    localStorage.setItem('policyDrafts', JSON.stringify([proposal, ...drafts]))
    
    try {
      sessionStorage.removeItem('selectedCustomer')
      sessionStorage.removeItem('quotationCustomerDraft')
      sessionStorage.removeItem('healthQuotationInput')
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

  const productFeatures = [
    {
      title: 'Hospitalization Expenses',
      description: 'Just like every other health insurance plan, we also cover your hospitalization expenses such as room rent, ICU, investigations, surgery, doctor consultations etc due to illnesses and injuries seamlessly.'
    },
    {
      title: 'Mental Healthcare',
      description: 'We believe mental healthcare is just as important as hospitalization due to physical illness or injury; hence, we cover hospitalization expenses incurred for treating mental illnesses.'
    },
    {
      title: 'Pre & Post Hospitalisation',
      description: 'It means all your pre hospitalization expenses up to 60 days before the date of admission and post-hospitalization expenses up to 180 days after discharge from the hospital are covered.'
    },
    {
      title: 'Day Care Treatments',
      description: 'Medical advancements help in wrapping up important surgeries and treatments in less than 24 hours, and guess what? We cover you for that as well.'
    },
    {
      title: 'Home Healthcare',
      description: 'Cashless Home Healthcare for medically necessary treatment of Illnesses, if prescribed by treating medical practitioner.'
    },
    {
      title: 'Sum Insured Rebound',
      description: 'This benefit adds to the Sum Insured, an amount equivalent to the claim amount, up to basic sum Insured, on subsequent Hospitalization.'
    },
    {
      title: 'Organ Donor Expenses',
      description: 'Organ donation is a noble cause and we cover the medical and surgical expenses of the organ donor while harvesting a major organ from the donor\'s body.'
    },
    {
      title: 'Recovery Benefit',
      description: 'If you stay in a hospital for more than 10 days at a stretch, then we pay for other financial losses. It helps to take care of other expenses during your hospitalization.'
    },
    {
      title: 'AYUSH Benefits',
      description: 'Let your belief in alternate therapies like Ayurveda, Unani, Siddha, and Homeopathy stay intact as we cover hospitalization expenses for AYUSH treatment as well.'
    },
    {
      title: 'Preventive Health Check-up',
      description: 'We care for your well-being and hence we offer preventive health check-up at renewal.'
    },
    {
      title: 'Lifelong Renewability',
      description: 'Once you get yourself secured with, our health insurance plan there is no looking back. Our health plan continues to secure your medical expenses for your entire lifetime on break free renewals.'
    },
    {
      title: 'Multiplier Benefit',
      description: 'If there is no claim in the first year, in the next policy year, the sum insured will grow by 50%. It means, instead of ₹ 5 Lakh, your sum insured would now stand at ₹ 7.5 Lakh for the second year.'
    }
  ]

  return (
    <div className="p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Health Insurance Quote Comparison</h1>
        <p className="text-gray-600 text-sm mt-1">Review quotes from different insurance companies and select the best option.</p>
      </div>

      {/* Customer Details */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="w-full bg-white rounded-xl border p-4 flex flex-wrap items-center gap-6 text-sm text-gray-700">
          <div><span className="font-medium">Customer:</span> {customer?.name || [customer?.firstName, customer?.lastName].filter(Boolean).join(' ') || '-'}</div>
          {(customer?.customerId || input?.data?.customerId) && (
            <div><span className="font-medium">ID:</span> {customer?.customerId || input?.data?.customerId}</div>
          )}
          {(customer?.email || input?.data?.email) && (
            <div><span className="font-medium">Email:</span> {customer?.email || input?.data?.email}</div>
          )}
          {(customer?.phone || input?.data?.phone) && (
            <div><span className="font-medium">Phone:</span> {customer?.phone || input?.data?.phone}</div>
          )}
          {(customer?.city || input?.data?.city) && (
            <div><span className="font-medium">Location:</span> {(customer?.city || input?.data?.city)}{(customer?.state || input?.data?.state) ? `, ${(customer?.state || input?.data?.state)}` : ''}</div>
          )}
          <div className="ml-auto text-gray-500">{new Date().toLocaleDateString()}</div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left - Plan Details */}
        <div className="lg:col-span-3 rounded-lg border p-4 bg-indigo-50 border-indigo-100">
          <h2 className="text-lg font-semibold mb-2">Plan Details</h2>
          <div className="text-sm text-gray-700 space-y-2">
            <p><span className="font-medium">Plan Type:</span> {input?.planType || '-'}</p>
            <p><span className="font-medium">Members:</span> {input?.members?.length || 0}</p>
            <div className="mt-2">
              <span className="font-medium">Member Details:</span>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                {input?.members?.map((m: any, idx: number) => (
                  <li key={idx}>{m.relationship} - Age {m.age}</li>
                ))}
              </ul>
            </div>
            <p className="mt-2"><span className="font-medium">Sum Insured:</span> ₹{input?.totalSumInsured?.toLocaleString('en-IN') || '-'}</p>
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
                    <p className="text-xs text-gray-500">Annual Premium</p>
                    <p className="text-2xl font-bold text-gray-900">₹{q.total.toLocaleString('en-IN')}</p>
                  </div>
                </label>
              )
            })}
          </div>
        </div>

        {/* Right - Product Features */}
        <div className="lg:col-span-3 rounded-xl border p-4 bg-amber-50 border-amber-100">
          <h2 className="text-lg font-semibold mb-3">Product Features</h2>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {productFeatures.map((feature, idx) => (
              <div key={idx} className="pb-3 border-b border-amber-200 last:border-0">
                <h3 className="font-semibold text-sm text-gray-900 mb-1">{feature.title}</h3>
                <p className="text-xs text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="max-w-7xl mx-auto mt-6">
        <div className="w-full bg-white rounded-xl border p-4 flex items-center justify-between">
          <button
            onClick={() => {
              sessionStorage.setItem('healthRestore', '1')
              router.push('/dashboard/presale/quotation/health/individual-inputs')
            }}
            className="px-4 py-2 border rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Previous
          </button>
          <div className="flex gap-2">
            <button disabled={!selected} onClick={handleSaveProposal} className="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:opacity-50 hover:bg-indigo-700">Save as Proposal</button>
            <button disabled={!selected} onClick={handleIssueNow} className="px-4 py-2 bg-green-600 text-white rounded-md disabled:opacity-50 hover:bg-green-700">Issue Policy Now</button>
          </div>
        </div>
      </div>
    </div>
  )
}

