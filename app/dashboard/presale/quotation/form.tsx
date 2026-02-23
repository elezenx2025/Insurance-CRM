'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const quotationSchema = z.object({ email: z.string().email(), phone: z.string() })
type QuotationFormData = z.infer<typeof quotationSchema>

export default function QuotationForm() {
  const router = useRouter()
  const { register, handleSubmit, formState: { errors } } = useForm<QuotationFormData>({ resolver: zodResolver(quotationSchema) })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (_data: QuotationFormData) => {
    setIsSubmitting(true)
    setTimeout(() => { setIsSubmitting(false); alert('Quotation submitted (demo)') }, 600)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">New Quotation</h1>
        <button onClick={()=>router.push('/dashboard/presale/quotation')} className="text-sm text-blue-600">Back to Search</button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-4 space-y-4">
        <div>
          <label className="block text-xs text-gray-600 mb-1">Email</label>
          <input className="border rounded-md px-3 py-2 text-sm w-full" {...register('email')} />
          {errors.email && <p className="text-xs text-red-600 mt-1">Valid email required</p>}
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Phone</label>
          <input className="border rounded-md px-3 py-2 text-sm w-full" {...register('phone')} />
          {errors.phone && <p className="text-xs text-red-600 mt-1">Phone required</p>}
        </div>
        <div className="pt-2">
          <button disabled={isSubmitting} className="px-4 py-2 rounded-md bg-blue-600 text-white disabled:opacity-60">{isSubmitting ? 'Submitting...' : 'Submit'}</button>
        </div>
      </form>
    </div>
  )
}


