'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const healthGmcSchema = z.object({
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
  familyMembersCount: z.number().min(0).default(0),
  age_85_70: z.number().min(0).default(0),
  age_60_70: z.number().min(0).default(0),
  age_50_60: z.number().min(0).default(0),
  age_45_50: z.number().min(0).default(0),
  age_35_45: z.number().min(0).default(0),
  age_25_35: z.number().min(0).default(0),
  age_18_25: z.number().min(0).default(0),
  age_1_18: z.number().min(0).default(0),
  age_infant: z.number().min(0).default(0),
  totalEmployees: z.number().min(0).default(0),
  totalEmployeesCoverage: z.number().min(0).default(0),
  totalInsured: z.number().min(0).default(0),
  totalInsuredCoverage: z.number().min(0).default(0),
  prevTotalInsured: z.number().min(0).default(0),
  prevTotalInsuredCoverage: z.number().min(0).default(0),
  prevClaimedAmount: z.number().min(0).default(0),
  prevPremiumPaid: z.number().min(0).default(0),
  prevInsuranceCompany: z.string().default('')
}).refine((d) => d.totalEmployees > 0, { message: 'Total Employees must be greater than 0', path: ['totalEmployees'] })
  .refine((d) => d.totalInsured > 0, { message: 'Total Insured must be greater than 0', path: ['totalInsured'] })
  .refine((d) => d.prevInsuranceCompany.trim().length > 0, { message: 'Select previous insurance company', path: ['prevInsuranceCompany'] })

type HealthGmcForm = z.infer<typeof healthGmcSchema>

export default function HealthGMCQuotation() {
  const router = useRouter()
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<HealthGmcForm>({
    resolver: zodResolver(healthGmcSchema) as any,
    mode: 'onSubmit',
    defaultValues: {
      topMgmtCount: 0, topMgmtCoverage: 0,
      seniorMgmtCount: 0, seniorMgmtCoverage: 0,
      middleMgmtCount: 0, middleMgmtCoverage: 0,
      managersCount: 0, managersCoverage: 0,
      officersCount: 0, officersCoverage: 0,
      familyMembersCount: 0,
      age_85_70: 0, age_60_70: 0, age_50_60: 0, age_45_50: 0, age_35_45: 0, age_25_35: 0, age_18_25: 0, age_1_18: 0, age_infant: 0,
      totalEmployees: 0, totalEmployeesCoverage: 0,
      totalInsured: 0, totalInsuredCoverage: 0,
      prevTotalInsured: 0, prevTotalInsuredCoverage: 0,
      prevClaimedAmount: 0, prevPremiumPaid: 0,
      prevInsuranceCompany: ''
    }
  })

  // Restore draft from sessionStorage only when coming back; otherwise clear stale drafts
  useEffect(() => {
    try {
      const shouldRestore = sessionStorage.getItem('healthGmcRestore') === '1'
      const draft = shouldRestore ? sessionStorage.getItem('healthGmcDraft') : null
      if (shouldRestore && draft) {
        const data = JSON.parse(draft)
        Object.keys(data || {}).forEach((k) => setValue(k as any, data[k], { shouldDirty: false, shouldValidate: false }))
        sessionStorage.removeItem('healthGmcRestore')
      } else {
        sessionStorage.removeItem('healthGmcDraft')
      }
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Persist draft on change (debounced)
  const saveTimerRef = useRef<any>(null)
  useEffect(() => {
    const subscription = watch((values) => {
      try {
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
        saveTimerRef.current = setTimeout(() => {
          sessionStorage.setItem('healthGmcDraft', JSON.stringify(values))
        }, 300)
      } catch {}
    })
    return () => subscription.unsubscribe()
  }, [watch])

  // Auto-calc totals based on component inputs
  const seniorMgmtCount = watch('seniorMgmtCount')
  const middleMgmtCount = watch('middleMgmtCount')
  const managersCount = watch('managersCount')
  const officersCount = watch('officersCount')
  const topMgmtCount = watch('topMgmtCount')
  const familyMembersCount = watch('familyMembersCount')

  const seniorMgmtCoverage = watch('seniorMgmtCoverage')
  const middleMgmtCoverage = watch('middleMgmtCoverage')
  const managersCoverage = watch('managersCoverage')
  const officersCoverage = watch('officersCoverage')
  const topMgmtCoverage = watch('topMgmtCoverage')

  const lastTotalsRef = useRef({ e: 0, ec: 0, i: 0, ic: 0 })
  useEffect(() => {
    const toNum = (v: any) => Number(String(v ?? '').replace(/[^0-9.-]/g, '')) || 0
    // Employees total = Senior + Middle + Managers + Officers
    const employees = toNum(seniorMgmtCount) + toNum(middleMgmtCount) + toNum(managersCount) + toNum(officersCount)
    if (employees !== lastTotalsRef.current.e) {
      lastTotalsRef.current.e = employees
      setValue('totalEmployees', employees, { shouldDirty: false, shouldValidate: false })
    }

    // Employees coverage = Senior + Middle + Managers + Officers coverage
    const employeesCoverage = toNum(seniorMgmtCoverage) + toNum(middleMgmtCoverage) + toNum(managersCoverage) + toNum(officersCoverage)
    if (employeesCoverage !== lastTotalsRef.current.ec) {
      lastTotalsRef.current.ec = employeesCoverage
      setValue('totalEmployeesCoverage', employeesCoverage, { shouldDirty: false, shouldValidate: false })
    }

    // Insured total = Top + Senior + Middle + Managers + Officers + Family members
    const insured = toNum(topMgmtCount) + toNum(seniorMgmtCount) + toNum(middleMgmtCount) + toNum(managersCount) + toNum(officersCount) + toNum(familyMembersCount)
    if (insured !== lastTotalsRef.current.i) {
      lastTotalsRef.current.i = insured
      setValue('totalInsured', insured, { shouldDirty: false, shouldValidate: false })
    }

    // Insured coverage = Top + Senior + Middle + Managers + Officers coverage
    const insuredCoverage = toNum(topMgmtCoverage) + toNum(seniorMgmtCoverage) + toNum(middleMgmtCoverage) + toNum(managersCoverage) + toNum(officersCoverage)
    if (insuredCoverage !== lastTotalsRef.current.ic) {
      lastTotalsRef.current.ic = insuredCoverage
      setValue('totalInsuredCoverage', insuredCoverage, { shouldDirty: false, shouldValidate: false })
    }
  }, [seniorMgmtCount, middleMgmtCount, managersCount, officersCount, topMgmtCount, familyMembersCount, seniorMgmtCoverage, middleMgmtCoverage, managersCoverage, officersCoverage, topMgmtCoverage, setValue])

  const onSubmit = (data: HealthGmcForm) => {
    sessionStorage.setItem('corporateQuotationInput', JSON.stringify({ policyType: 'HEALTH_GMC', data }))
    // Keep draft for back navigation
    sessionStorage.setItem('healthGmcDraft', JSON.stringify(data))
    router.push('/dashboard/presale/quotation/corporate/compare')
  }

  const Field = ({ label, name, type = 'number', allowDecimal = false }: { label: string; name: keyof HealthGmcForm; type?: string; allowDecimal?: boolean }) => {
    if (allowDecimal) {
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
          <input
            type="number"
            step="any"
            autoComplete="off"
            {...register(name as any, { valueAsNumber: true })}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
      )
    }
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
          type="text"
          inputMode={type === 'number' ? 'numeric' : undefined}
          autoComplete="off"
          {...register(name as any, {
            setValueAs: (v) => {
              const raw = String(v ?? '')
              const cleanedInt = raw.replace(/[^0-9]/g, '')
              const parsedInt = parseInt(cleanedInt || '0', 10)
              return Number.isFinite(parsedInt) ? parsedInt : 0
            },
          })}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
    )
  }

  // Auto-calculate totals when component renders or values change
  const computeTotals = () => {
    try {
      const s = (n: number | undefined) => Number(n || 0)
      const values = (name: keyof HealthGmcForm) => (document.querySelector(`[name="${String(name)}"]`) as HTMLInputElement)?.value
      // Not using getValues to keep dependencies minimal; calculations are informational until submit
    } catch {}
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Health-GMC • Corporate Inputs</h1>
        <p className="text-gray-600">Provide group details to compute quotations.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="Total Top Management Nos" name="topMgmtCount" />
          <Field label="Top Management Coverage (₹ in Millions)" name="topMgmtCoverage" allowDecimal />
          <Field label="Total Senior Management Nos" name="seniorMgmtCount" />
          <Field label="Senior Management Coverage (₹ in Millions)" name="seniorMgmtCoverage" allowDecimal />
          <Field label="Total Middle Management Nos" name="middleMgmtCount" />
          <Field label="Middle Management Coverage (₹ in Millions)" name="middleMgmtCoverage" allowDecimal />
          <Field label="Total Managers Nos" name="managersCount" />
          <Field label="Managers Coverage (₹ in Millions)" name="managersCoverage" allowDecimal />
          <Field label="Total Officers Nos" name="officersCount" />
          <Field label="Officers Coverage (₹ in Millions)" name="officersCoverage" allowDecimal />
          <Field label="Total Family Members Nos" name="familyMembersCount" />
          <Field label="Nos Age 85-70" name="age_85_70" />
          <Field label="Nos Age 60-70" name="age_60_70" />
          <Field label="Nos Age 50-60" name="age_50_60" />
          <Field label="Nos Age 45-50" name="age_45_50" />
          <Field label="Nos Age 35-45" name="age_35_45" />
          <Field label="Nos Age 25-35" name="age_25_35" />
          <Field label="Nos Age 18-25" name="age_18_25" />
          <Field label="Nos Age 1-18" name="age_1_18" />
          <Field label="Nos Age Infant" name="age_infant" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Employees Nos</label>
            <input
              type="number"
              {...register('totalEmployees' as any, { valueAsNumber: true })}
              className="w-full px-3 py-2 border rounded-md bg-gray-50"
              placeholder="Auto: Senior + Middle + Managers + Officers"
              readOnly
            />
            {errors.totalEmployees && (<p className="text-xs text-red-600 mt-1">{errors.totalEmployees.message as any}</p>)}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Employees Coverage</label>
            <input
              type="number"
              {...register('totalEmployeesCoverage' as any, { valueAsNumber: true })}
              className="w-full px-3 py-2 border rounded-md bg-gray-50"
              placeholder="Auto: Senior + Middle + Managers + Officers coverage"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Insured Nos</label>
            <input
              type="number"
              {...register('totalInsured' as any, { valueAsNumber: true })}
              className="w-full px-3 py-2 border rounded-md bg-gray-50"
              placeholder="Auto: Top + Senior + Middle + Managers + Officers + Family"
              readOnly
            />
            {errors.totalInsured && (<p className="text-xs text-red-600 mt-1">{errors.totalInsured.message as any}</p>)}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Insured Coverage</label>
            <input
              type="number"
              {...register('totalInsuredCoverage' as any, { valueAsNumber: true })}
              className="w-full px-3 py-2 border rounded-md bg-gray-50"
              placeholder="Auto: Top + Senior + Middle + Managers + Officers coverage"
              readOnly
            />
          </div>
          <Field label="Previous Total Insured Nos" name="prevTotalInsured" />
          <Field label="Previous Total Insured Coverage (₹ in Millions)" name="prevTotalInsuredCoverage" allowDecimal />
          <Field label="Previous Claimed Amount (₹ in Millions)" name="prevClaimedAmount" allowDecimal />
          <Field label="Previous Premium Paid (₹ in Millions)" name="prevPremiumPaid" allowDecimal />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Previous Insurance Company</label>
            <select {...register('prevInsuranceCompany' as any)} className="w-full px-3 py-2 border rounded-md">
              <option value="">Select Company</option>
              <option>New India</option>
              <option>United India</option>
              <option>Oriental</option>
              <option>National</option>
              <option>HDFC ERGO</option>
              <option>Bajaj Allianz</option>
            </select>
            {errors.prevInsuranceCompany && (<p className="text-xs text-red-600 mt-1">{errors.prevInsuranceCompany.message as any}</p>)}
          </div>
        </div>

        <div className="flex justify-between">
          <button type="button" onClick={() => { sessionStorage.setItem('forceQuotationStep', '3'); router.push('/dashboard/presale/quotation') }} className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">Previous</button>
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Compare Quotes</button>
        </div>
      </form>
    </div>
  )
}


