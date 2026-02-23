'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const lifeGtliSchema = z.object({
  topMgmtCount: z.number().min(0).default(0),
  topMgmtCoverage: z.number().min(0).default(0),
  seniorMgmtCount: z.number().min(0).default(0),
  seniorMgmtCoverage: z.number().min(0).default(0),
  middleMgmtCount: z.number().min(0).default(0),
  middleMgmtCoverage: z.number().min(0).default(0),
  managersCount: z.number().min(0).default(0),
  managersCoverage: z.number().min(0).default(0),
  officersCount: z.number().min(0).default(0),
  officersCoverage: z.number().min(0).default(0),
  age_60_70: z.number().min(0).default(0),
  age_50_60: z.number().min(0).default(0),
  age_45_50: z.number().min(0).default(0),
  age_35_45: z.number().min(0).default(0),
  age_25_35: z.number().min(0).default(0),
  age_18_25: z.number().min(0).default(0),
  totalEmployees: z.number().min(0).default(0),
  totalEmployeesCoverage: z.number().min(0).default(0),
  prevTotalInsured: z.number().min(0).default(0),
  prevTotalInsuredCoverage: z.number().min(0).default(0),
  prevClaimedAmount: z.number().min(0).default(0),
  prevPremiumPaid: z.number().min(0).default(0),
  prevInsuranceCompany: z.string().default('')
})

type LifeGtliForm = z.infer<typeof lifeGtliSchema>

export default function LifeGTLIQuotation() {
  const router = useRouter()
  const { register, handleSubmit, watch, setValue } = useForm<LifeGtliForm>({
    resolver: zodResolver(lifeGtliSchema) as any,
    defaultValues: {
      topMgmtCount: 0, topMgmtCoverage: 0,
      seniorMgmtCount: 0, seniorMgmtCoverage: 0,
      middleMgmtCount: 0, middleMgmtCoverage: 0,
      managersCount: 0, managersCoverage: 0,
      officersCount: 0, officersCoverage: 0,
      age_60_70: 0, age_50_60: 0, age_45_50: 0, age_35_45: 0, age_25_35: 0, age_18_25: 0,
      totalEmployees: 0, totalEmployeesCoverage: 0,
      prevTotalInsured: 0, prevTotalInsuredCoverage: 0,
      prevClaimedAmount: 0, prevPremiumPaid: 0,
      prevInsuranceCompany: ''
    }
  })

  // Restore draft from session always (persist until session ends)
  useEffect(() => {
    try {
      const draft = sessionStorage.getItem('lifeGtliDraft')
      if (draft) {
        const data = JSON.parse(draft)
        Object.keys(data || {}).forEach((k) => setValue(k as any, data[k] as any, { shouldDirty: false }))
      }
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Persist draft on change
  useEffect(() => {
    const sub = watch((values) => {
      try { sessionStorage.setItem('lifeGtliDraft', JSON.stringify(values)) } catch {}
    })
    return () => sub.unsubscribe()
  }, [watch])

  // Auto-calc totals
  const topMgmtCount = watch('topMgmtCount')
  const seniorMgmtCount = watch('seniorMgmtCount')
  const middleMgmtCount = watch('middleMgmtCount')
  const managersCount = watch('managersCount')
  const officersCount = watch('officersCount')

  const topMgmtCoverage = watch('topMgmtCoverage')
  const seniorMgmtCoverage = watch('seniorMgmtCoverage')
  const middleMgmtCoverage = watch('middleMgmtCoverage')
  const managersCoverage = watch('managersCoverage')
  const officersCoverage = watch('officersCoverage')

  useEffect(() => {
    const toNum = (v: any) => Number(String(v ?? '').replace(/[^0-9.-]/g, '')) || 0
    const employees = toNum(topMgmtCount) + toNum(seniorMgmtCount) + toNum(middleMgmtCount) + toNum(managersCount) + toNum(officersCount)
    const employeesCoverage = toNum(topMgmtCoverage) + toNum(seniorMgmtCoverage) + toNum(middleMgmtCoverage) + toNum(managersCoverage) + toNum(officersCoverage)
    setValue('totalEmployees', employees, { shouldDirty: false })
    setValue('totalEmployeesCoverage', employeesCoverage, { shouldDirty: false })
  }, [topMgmtCount, seniorMgmtCount, middleMgmtCount, managersCount, officersCount, topMgmtCoverage, seniorMgmtCoverage, middleMgmtCoverage, managersCoverage, officersCoverage, setValue])

  const onSubmit = (data: LifeGtliForm) => {
    if (!data.prevInsuranceCompany || (data.totalEmployees || 0) <= 0) {
      alert('Please fill the required inputs and select Previous Insurance Company before comparing quotes')
      return
    }
    sessionStorage.setItem('corporateQuotationInput', JSON.stringify({ policyType: 'LIFE_GTLI', data }))
    router.push('/dashboard/presale/quotation/corporate/compare')
  }

  const Field = ({ label, name, type = 'number' }: { label: string; name: keyof LifeGtliForm; type?: string }) => {
    const key = String(name)
    const isCoverage = key.toLowerCase().includes('coverage')
    const isPrevMillions = key === 'prevClaimedAmount' || key === 'prevPremiumPaid'
    const showMillions = isCoverage || isPrevMillions
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}{showMillions && ' (₹ in Millions)'}</label>
        <input
          type={type}
          step={showMillions ? '0.01' : undefined}
          placeholder={showMillions ? 'Enter amount in Millions' : undefined}
          {...register(name as any, { valueAsNumber: type === 'number' })}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Life-GTLI • Corporate Inputs</h1>
        <p className="text-gray-600">Provide group details to compute quotations.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="p-3 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-800 text-sm">
          Note: All coverage inputs below should be entered in ₹ Millions.
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="Total Top Management Nos" name="topMgmtCount" />
          <Field label="Top Management Coverage" name="topMgmtCoverage" />
          <Field label="Total Senior Management Nos" name="seniorMgmtCount" />
          <Field label="Senior Management Coverage" name="seniorMgmtCoverage" />
          <Field label="Total Middle Management Nos" name="middleMgmtCount" />
          <Field label="Middle Management Coverage" name="middleMgmtCoverage" />
          <Field label="Total Managers Nos" name="managersCount" />
          <Field label="Managers Coverage" name="managersCoverage" />
          <Field label="Total Officers Nos" name="officersCount" />
          <Field label="Officers Coverage" name="officersCoverage" />
          <Field label="Nos Age 60-70" name="age_60_70" />
          <Field label="Nos Age 50-60" name="age_50_60" />
          <Field label="Nos Age 45-50" name="age_45_50" />
          <Field label="Nos Age 35-45" name="age_35_45" />
          <Field label="Nos Age 25-35" name="age_25_35" />
          <Field label="Nos Age 18-25" name="age_18_25" />
          <Field label="Total Employees Nos" name="totalEmployees" />
          <Field label="Total Employees Coverage" name="totalEmployeesCoverage" />
          <Field label="Previous Total Insured Nos" name="prevTotalInsured" />
          <Field label="Previous Total Insured Coverage" name="prevTotalInsuredCoverage" />
          <Field label="Previous Claimed Amount" name="prevClaimedAmount" />
          <Field label="Previous Premium Paid" name="prevPremiumPaid" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Previous Insurance Company</label>
            <select {...register('prevInsuranceCompany' as any)} className="w-full px-3 py-2 border rounded-md">
              <option value="">Select Company</option>
              <option>LIC</option>
              <option>SBI Life</option>
              <option>HDFC Life</option>
              <option>ICICI Prudential</option>
              <option>Max Life</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between">
          <button type="button" onClick={() => { sessionStorage.setItem('forceQuotationStep','3'); router.push('/dashboard/presale/quotation') }} className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">Previous</button>
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Compare Quotes</button>
        </div>
      </form>
    </div>
  )
}


