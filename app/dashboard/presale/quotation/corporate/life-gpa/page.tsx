'use client'

import React, { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'

const lifeGpaSchema = z.object({
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
  employeesCount: z.number().min(0).default(0),
  employeesCoverage: z.number().min(0).default(0),
  prevTotalInsured: z.number().min(0).default(0),
  prevTotalInsuredCoverage: z.number().min(0).default(0),
  prevClaimedAmount: z.number().min(0).default(0),
  prevPremiumPaid: z.number().min(0).default(0),
  prevInsuranceCompany: z.string().default('')
}).refine((d) => d.prevInsuranceCompany.trim().length > 0, { message: 'Select previous insurance company', path: ['prevInsuranceCompany'] })

type LifeGpaForm = z.infer<typeof lifeGpaSchema>

export default function LifeGPAQuotation() {
  const router = useRouter()
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<LifeGpaForm>({
    resolver: zodResolver(lifeGpaSchema) as any,
    mode: 'onSubmit',
    defaultValues: {
      topMgmtCount: 0, topMgmtCoverage: 0,
      seniorMgmtCount: 0, seniorMgmtCoverage: 0,
      middleMgmtCount: 0, middleMgmtCoverage: 0,
      managersCount: 0, managersCoverage: 0,
      officersCount: 0, officersCoverage: 0,
      employeesCount: 0, employeesCoverage: 0,
      prevTotalInsured: 0, prevTotalInsuredCoverage: 0,
      prevClaimedAmount: 0, prevPremiumPaid: 0,
      prevInsuranceCompany: ''
    }
  })

  // Restore draft from sessionStorage only when coming back; otherwise clear stale drafts
  useEffect(() => {
    try {
      const shouldRestore = sessionStorage.getItem('lifeGpaRestore') === '1'
      const draft = shouldRestore ? sessionStorage.getItem('lifeGpaDraft') : null
      if (shouldRestore && draft) {
        const data = JSON.parse(draft)
        Object.keys(data || {}).forEach((k) => setValue(k as any, data[k], { shouldDirty: false, shouldValidate: false }))
        sessionStorage.removeItem('lifeGpaRestore')
      } else {
        sessionStorage.removeItem('lifeGpaDraft')
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
          sessionStorage.setItem('lifeGpaDraft', JSON.stringify(values))
        }, 300)
      } catch {}
    })
    return () => subscription.unsubscribe()
  }, [watch])

  // Watch all count and coverage fields for auto-calculation
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

  // Auto-calculate Total Employees Nos and Total Employees Coverage
  const lastTotalsRef = useRef({ e: 0, ec: 0 })
  useEffect(() => {
    const toNum = (v: any) => Number(String(v ?? '').replace(/[^0-9.-]/g, '')) || 0
    
    // Total Employees Nos = Top + Senior + Middle + Managers + Officers
    const employees = toNum(topMgmtCount) + toNum(seniorMgmtCount) + toNum(middleMgmtCount) + toNum(managersCount) + toNum(officersCount)
    if (employees !== lastTotalsRef.current.e) {
      lastTotalsRef.current.e = employees
      setValue('employeesCount', employees, { shouldDirty: false, shouldValidate: false })
    }

    // Total Employees Coverage = Top + Senior + Middle + Managers + Officers Coverage
    const employeesCoverage = toNum(topMgmtCoverage) + toNum(seniorMgmtCoverage) + toNum(middleMgmtCoverage) + toNum(managersCoverage) + toNum(officersCoverage)
    if (employeesCoverage !== lastTotalsRef.current.ec) {
      lastTotalsRef.current.ec = employeesCoverage
      setValue('employeesCoverage', employeesCoverage, { shouldDirty: false, shouldValidate: false })
    }
  }, [topMgmtCount, seniorMgmtCount, middleMgmtCount, managersCount, officersCount, topMgmtCoverage, seniorMgmtCoverage, middleMgmtCoverage, managersCoverage, officersCoverage, setValue])

  const onSubmit = (data: LifeGpaForm) => {
    if (!data.prevInsuranceCompany || !data.prevInsuranceCompany.trim()) {
      toast.error('Please select Previous Insurance Company before comparing quotes')
      return
    }
    sessionStorage.setItem('corporateQuotationInput', JSON.stringify({ policyType: 'LIFE_GPA', data }))
    // Keep draft for back navigation
    sessionStorage.setItem('lifeGpaDraft', JSON.stringify(data))
    router.push('/dashboard/presale/quotation/corporate/compare')
  }

  const Field = ({ label, name, type = 'number', allowDecimal = false }: { label: string; name: keyof LifeGpaForm; type?: string; allowDecimal?: boolean }) => {
    if (allowDecimal) {
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{label} <span className="text-xs text-gray-500">(₹ in Millions)</span></label>
          <input
            type="number"
            step="any"
            autoComplete="off"
            {...register(name as any, { valueAsNumber: true })}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Enter amount in Millions"
          />
          {errors[name] && (<p className="text-xs text-red-600 mt-1">{errors[name]?.message as any}</p>)}
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
        {errors[name] && (<p className="text-xs text-red-600 mt-1">{errors[name]?.message as any}</p>)}
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Life-GPA • Corporate Inputs</h1>
        <p className="text-gray-600">Provide group details to compute quotations.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="Total Top Management Nos" name="topMgmtCount" />
          <Field label="Top Management Coverage" name="topMgmtCoverage" allowDecimal />
          <Field label="Total Senior Management Nos" name="seniorMgmtCount" />
          <Field label="Senior Management Coverage" name="seniorMgmtCoverage" allowDecimal />
          <Field label="Total Middle Management Nos" name="middleMgmtCount" />
          <Field label="Middle Management Coverage" name="middleMgmtCoverage" allowDecimal />
          <Field label="Total Managers Nos" name="managersCount" />
          <Field label="Managers Coverage" name="managersCoverage" allowDecimal />
          <Field label="Total Officers Nos" name="officersCount" />
          <Field label="Officers Coverage" name="officersCoverage" allowDecimal />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Employees Nos</label>
            <input
              type="number"
              {...register('employeesCount' as any, { valueAsNumber: true })}
              className="w-full px-3 py-2 border rounded-md bg-gray-50"
              placeholder="Auto: Top + Senior + Middle + Managers + Officers"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employees Coverage <span className="text-xs text-gray-500">(₹ in Millions)</span></label>
            <input
              type="number"
              step="any"
              {...register('employeesCoverage' as any, { valueAsNumber: true })}
              className="w-full px-3 py-2 border rounded-md bg-gray-50"
              placeholder="Auto: Top + Senior + Middle + Managers + Officers Coverage"
              readOnly
            />
          </div>
          <Field label="Previous Total Insured Nos" name="prevTotalInsured" />
          <Field label="Previous Total Insured Coverage" name="prevTotalInsuredCoverage" allowDecimal />
          <Field label="Previous Claimed Amount" name="prevClaimedAmount" allowDecimal />
          <Field label="Previous Premium Paid" name="prevPremiumPaid" allowDecimal />
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
