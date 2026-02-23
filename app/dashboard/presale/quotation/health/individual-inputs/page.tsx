'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline'

const relationshipOptions = ['Self', 'Spouse', 'Father', 'Mother', 'Father-in-law', 'Mother-in-law', 'Son', 'Daughter']
const sumInsuredOptions = [
  { value: 10000, label: '₹10,000' },
  { value: 20000, label: '₹20,000' },
  { value: 25000, label: '₹25,000' },
  { value: 50000, label: '₹50,000' },
  { value: 75000, label: '₹75,000' },
  { value: 100000, label: '₹1 Lac' },
  { value: 150000, label: '₹1.5 Lac' },
  { value: 200000, label: '₹2 Lac' },
  { value: 250000, label: '₹2.5 Lac' },
  { value: 300000, label: '₹3 Lac' },
  { value: 350000, label: '₹3.5 Lac' },
  { value: 400000, label: '₹4 Lac' },
  { value: 450000, label: '₹4.5 Lac' },
  { value: 500000, label: '₹5.0 Lac' }
]

const memberSchema = z.object({
  relationship: z.enum(['Self', 'Spouse', 'Father', 'Mother', 'Father-in-law', 'Mother-in-law', 'Son', 'Daughter']),
  age: z.number().min(1).max(120)
})

const healthIndividualSchema = z.object({
  planType: z.enum(['Individual', 'Family Floater']),
  members: z.array(memberSchema).min(1),
  totalSumInsured: z.number().min(10000)
}).refine((data) => {
  if (data.planType === 'Family Floater') {
    if (data.members.length < 2) return false
    if (data.members.length > 10) return false
    // Count adults and children: Son/Daughter are children until age 25, others use 18
    const adults = data.members.filter((m: any) => {
      const age = Number(m.age)
      if (m.relationship === 'Son' || m.relationship === 'Daughter') {
        return age > 25
      }
      return age >= 18
    }).length
    const children = data.members.filter((m: any) => {
      const age = Number(m.age)
      if (m.relationship === 'Son' || m.relationship === 'Daughter') {
        return age <= 25
      }
      return age < 18
    }).length
    if (adults > 4) return false
    if (children > 6) return false
  }
  return true
}, { message: 'Family Floater: Minimum 2 persons, Maximum 10 (max 4 adults + 6 children)', path: ['members'] })

type HealthIndividualForm = z.infer<typeof healthIndividualSchema>

export default function HealthIndividualInputs() {
  const router = useRouter()
  const [planType, setPlanType] = useState<'Individual' | 'Family Floater'>('Individual')
  const [memberCount, setMemberCount] = useState(1)

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<HealthIndividualForm>({
    resolver: zodResolver(healthIndividualSchema) as any,
    mode: 'onSubmit',
    defaultValues: {
      planType: 'Individual',
      members: [{ relationship: 'Self', age: 25 }],
      totalSumInsured: 100000
    }
  })

  // Restore from sessionStorage (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const saved = sessionStorage.getItem('healthIndividualDraft')
      const shouldRestore = sessionStorage.getItem('healthRestore') === '1'
      if (shouldRestore && saved) {
        const data = JSON.parse(saved)
        const members = Array.isArray(data.members) && data.members.length > 0 
          ? data.members.map((m: any) => ({
              relationship: relationshipOptions.includes(m.relationship) ? m.relationship : 'Self',
              age: Number(m.age) || 25
            }))
          : [{ relationship: 'Self' as const, age: 25 }]
        setPlanType(data.planType || 'Individual')
        setMemberCount(members.length)
        setValue('planType', data.planType || 'Individual')
        setValue('members', members)
        setValue('totalSumInsured', Number(data.totalSumInsured) || 100000)
        sessionStorage.removeItem('healthRestore')
      } else if (saved) {
        const data = JSON.parse(saved)
        const members = Array.isArray(data.members) && data.members.length > 0 
          ? data.members.map((m: any) => ({
              relationship: relationshipOptions.includes(m.relationship) ? m.relationship : 'Self',
              age: Number(m.age) || 25
            }))
          : [{ relationship: 'Self' as const, age: 25 }]
        setPlanType(data.planType || 'Individual')
        setMemberCount(members.length)
        setValue('planType', data.planType || 'Individual')
        setValue('members', members)
        setValue('totalSumInsured', Number(data.totalSumInsured) || 100000)
      } else {
        // Try to get plan type from quotation page
        const quotationDraft = sessionStorage.getItem('quotationCustomerDraft')
        if (quotationDraft) {
          const qd = JSON.parse(quotationDraft)
          if (qd.policyFor === 'Individual' || qd.policyFor === 'Family Floater') {
            setPlanType(qd.policyFor)
            setValue('planType', qd.policyFor)
          }
        }
      }
    } catch {}
  }, [setValue])

  // Persist draft (client-side only)
  const saveTimerRef = useRef<any>(null)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const subscription = watch((values) => {
      try {
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
        saveTimerRef.current = setTimeout(() => {
          if (values && typeof window !== 'undefined') {
            sessionStorage.setItem('healthIndividualDraft', JSON.stringify(values))
          }
        }, 300)
      } catch {}
    })
    return () => subscription.unsubscribe()
  }, [watch])

  // Helper function to determine if a member is a child
  const isChild = (member: any) => {
    const age = Number(member.age)
    if (member.relationship === 'Son' || member.relationship === 'Daughter') {
      return age <= 25
    }
    return age < 18
  }

  const addMember = () => {
    const current = watch('members') || []
    if (planType === 'Family Floater') {
      if (current.length >= 10) {
        toast.error('Maximum 10 family members allowed')
        return
      }
      const adults = current.filter(m => !isChild(m)).length
      const children = current.filter(m => isChild(m)).length
      const nextAdult = adults < 4
      const nextChild = children < 6
      if (!nextAdult && !nextChild) {
        toast.error('Maximum 4 adults and 6 children allowed')
        return
      }
    }
    const newMembers = [...current, { relationship: 'Self' as const, age: 25 }]
    setValue('members', newMembers)
    setMemberCount(newMembers.length)
  }

  const removeMember = (index: number) => {
    const current = watch('members') || []
    if (planType === 'Individual' && current.length <= 1) {
      toast.error('At least one person must be selected for Individual plan')
      return
    }
    if (planType === 'Family Floater' && current.length <= 2) {
      toast.error('Family Floater requires at least 2 members')
      return
    }
    const newMembers = current.filter((_, i) => i !== index)
    setValue('members', newMembers)
    setMemberCount(newMembers.length)
  }

  const updateMember = (index: number, field: 'relationship' | 'age', value: any) => {
    const current = watch('members') || []
    const updated = [...current]
    updated[index] = { ...updated[index], [field]: field === 'age' ? Number(value) : value }
    setValue('members', updated, { shouldDirty: true })
  }

  const handlePlanTypeChange = (newType: 'Individual' | 'Family Floater') => {
    setPlanType(newType)
    setValue('planType', newType)
    const current = watch('members') || []
    
    if (newType === 'Individual') {
      // Keep only first member
      if (current.length > 1) {
        setValue('members', [current[0] || { relationship: 'Self', age: 25 }])
        setMemberCount(1)
      }
    } else {
      // Family Floater: ensure at least 2 members
      if (current.length < 2) {
        setValue('members', [
          current[0] || { relationship: 'Self', age: 25 },
          { relationship: 'Spouse', age: 25 }
        ])
        setMemberCount(2)
      }
    }
  }

  const onSubmit = (data: HealthIndividualForm) => {
    console.log('Form submitted with data:', data)
    
    // Get current members from watch to ensure we have the latest values
    const currentMembers = watch('members') || []
    const currentPlanType = watch('planType') || planType
    const currentSumInsured = watch('totalSumInsured') || data.totalSumInsured || 100000
    
    // Validate members data
    const validatedMembers = currentMembers.map((m: any) => ({
      relationship: relationshipOptions.includes(m.relationship) ? m.relationship : 'Self',
      age: Number(m.age) || 25
    }))
    
    if (currentPlanType === 'Individual' && validatedMembers.length === 0) {
      toast.error('At least one person must be selected for Individual plan')
      return
    }
    if (currentPlanType === 'Family Floater') {
      if (validatedMembers.length < 2) {
        toast.error('Family Floater requires at least 2 members')
        return
      }
      if (validatedMembers.length > 10) {
        toast.error('Maximum 10 family members allowed')
        return
      }
      // Count adults and children: Son/Daughter are children until age 25, others use 18
      const adults = validatedMembers.filter((m: any) => {
        const age = Number(m.age)
        if (m.relationship === 'Son' || m.relationship === 'Daughter') {
          return age > 25
        }
        return age >= 18
      }).length
      const children = validatedMembers.filter((m: any) => {
        const age = Number(m.age)
        if (m.relationship === 'Son' || m.relationship === 'Daughter') {
          return age <= 25
        }
        return age < 18
      }).length
      
      console.log('Family Floater validation (onSubmit):', { 
        totalMembers: validatedMembers.length, 
        adults, 
        children, 
        members: validatedMembers 
      })
      
      if (adults > 4) {
        toast.error(`Maximum 4 adults allowed. You have ${adults} adults.`)
        return
      }
      if (children > 6) {
        toast.error(`Maximum 6 children allowed. You have ${children} children.`)
        return
      }
    }
    
    // Ensure all required fields are present
    if (!validatedMembers || validatedMembers.length === 0) {
      toast.error('Please add at least one member')
      return
    }
    
    if (!currentSumInsured || currentSumInsured < 10000) {
      toast.error('Please select a valid Sum Insured amount')
      return
    }
    
    const formData = {
      planType: currentPlanType,
      members: validatedMembers,
      totalSumInsured: currentSumInsured
    }
    
    console.log('Saving form data:', formData)
    
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('healthQuotationInput', JSON.stringify(formData))
        sessionStorage.setItem('healthIndividualDraft', JSON.stringify(formData))
      }
      router.push('/dashboard/presale/quotation/health/compare')
    } catch (error) {
      console.error('Error saving form data:', error)
      toast.error('Failed to save form data. Please try again.')
    }
  }
  
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const currentMembers = watch('members') || []
    const currentPlanType = watch('planType') || planType
    const currentSumInsured = watch('totalSumInsured') || 100000
    
    // Manual validation
    if (!currentPlanType) {
      toast.error('Please select a Plan Type')
      return
    }
    
    if (!currentMembers || currentMembers.length === 0) {
      toast.error('Please add at least one member')
      return
    }
    
    // Validate all members have valid data
    for (let i = 0; i < currentMembers.length; i++) {
      const m = currentMembers[i]
      if (!m || !m.relationship || !relationshipOptions.includes(m.relationship)) {
        toast.error(`Member ${i + 1}: Please select a valid relationship`)
        return
      }
      const age = Number(m.age)
      if (!age || age < 1 || age > 120 || isNaN(age)) {
        toast.error(`Member ${i + 1}: Please enter a valid age (1-120)`)
        return
      }
    }
    
    if (!currentSumInsured || currentSumInsured < 10000) {
      toast.error('Please select a valid Sum Insured amount')
      return
    }
    
    // Validate members data
    const validatedMembers = currentMembers.map((m: any) => ({
      relationship: relationshipOptions.includes(m.relationship) ? m.relationship : 'Self',
      age: Number(m.age) || 25
    }))
    
    if (currentPlanType === 'Individual' && validatedMembers.length === 0) {
      toast.error('At least one person must be selected for Individual plan')
      return
    }
    if (currentPlanType === 'Family Floater') {
      if (validatedMembers.length < 2) {
        toast.error('Family Floater requires at least 2 members')
        return
      }
      if (validatedMembers.length > 10) {
        toast.error('Maximum 10 family members allowed')
        return
      }
      // Count adults and children: Son/Daughter are children until age 25, others use 18
      const adults = validatedMembers.filter((m: any) => {
        const age = Number(m.age)
        if (m.relationship === 'Son' || m.relationship === 'Daughter') {
          return age > 25
        }
        return age >= 18
      }).length
      const children = validatedMembers.filter((m: any) => {
        const age = Number(m.age)
        if (m.relationship === 'Son' || m.relationship === 'Daughter') {
          return age <= 25
        }
        return age < 18
      }).length
      
      console.log('Family Floater validation (handleFormSubmit):', { 
        totalMembers: validatedMembers.length, 
        adults, 
        children, 
        members: validatedMembers 
      })
      
      if (adults > 4) {
        toast.error(`Maximum 4 adults allowed. You have ${adults} adults.`)
        return
      }
      if (children > 6) {
        toast.error(`Maximum 6 children allowed. You have ${children} children.`)
        return
      }
    }
    
    const formData = {
      planType: currentPlanType,
      members: validatedMembers,
      totalSumInsured: currentSumInsured
    }
    
    console.log('Saving form data:', formData)
    
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('healthQuotationInput', JSON.stringify(formData))
        sessionStorage.setItem('healthIndividualDraft', JSON.stringify(formData))
      }
      router.push('/dashboard/presale/quotation/health/compare')
    } catch (error) {
      console.error('Error saving form data:', error)
      toast.error('Failed to save form data. Please try again.')
    }
  }

  const members = watch('members') || []

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Health Individual Inputs</h1>
        <p className="text-gray-600">Select plan type and provide member details.</p>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-6">
        {/* Plan Type Selection */}
        <div className="bg-white rounded-lg border p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Plan Type *</label>
          <select
            value={planType}
            onChange={(e) => handlePlanTypeChange(e.target.value as 'Individual' | 'Family Floater')}
            className="w-full md:w-1/3 px-3 py-2 border rounded-md"
          >
            <option value="Individual">Individual</option>
            <option value="Family Floater">Family Floater</option>
          </select>
          {planType === 'Family Floater' && (
            <p className="text-xs text-gray-500 mt-2">
              Minimum 2 persons, Maximum 10 persons (Maximum 4 adults + 6 children). Note: Son/Daughter are counted as children until age 25.
            </p>
          )}
          {planType === 'Individual' && (
            <p className="text-xs text-gray-500 mt-2">
              At least one person must be selected
            </p>
          )}
        </div>

        {/* Family Members Section */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {planType === 'Family Floater' ? 'Family Members' : 'Member Details'}
            </h2>
            {planType === 'Family Floater' && (
              <button
                type="button"
                onClick={addMember}
                disabled={members.length >= 10}
                className="flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Member
              </button>
            )}
          </div>

          <div className="space-y-4">
            {members.map((member, index) => (
              <div key={index} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium text-gray-700">
                    {planType === 'Family Floater' ? `Member ${index + 1}` : 'Member'}
                  </h3>
                  {(planType === 'Family Floater' && members.length > 2) || (planType === 'Individual' && members.length > 1) ? (
                    <button
                      type="button"
                      onClick={() => removeMember(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <MinusIcon className="h-5 w-5" />
                    </button>
                  ) : null}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Relationship *</label>
                    <select
                      value={member.relationship || 'Self'}
                      onChange={(e) => updateMember(index, 'relationship', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      {relationshipOptions.map(rel => (
                        <option key={rel} value={rel}>{rel}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      value={member.age || 25}
                      onChange={(e) => updateMember(index, 'age', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                    {member.age && (() => {
                      const age = Number(member.age || 0)
                      if (member.relationship === 'Son' || member.relationship === 'Daughter') {
                        return age <= 25 ? (
                          <span className="text-xs text-orange-600 mt-1 block">Child</span>
                        ) : (
                          <span className="text-xs text-blue-600 mt-1 block">Adult</span>
                        )
                      }
                      return age < 18 ? (
                        <span className="text-xs text-orange-600 mt-1 block">Child</span>
                      ) : (
                        <span className="text-xs text-blue-600 mt-1 block">Adult</span>
                      )
                    })()}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {planType === 'Family Floater' && (
            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-800">
                <span className="font-medium">Members:</span> {members.length}/10 | 
                <span className="font-medium ml-2">Adults:</span> {members.filter(m => {
                  const age = Number(m.age)
                  if (m.relationship === 'Son' || m.relationship === 'Daughter') {
                    return age > 25
                  }
                  return age >= 18
                }).length}/4 | 
                <span className="font-medium ml-2">Children:</span> {members.filter(m => {
                  const age = Number(m.age)
                  if (m.relationship === 'Son' || m.relationship === 'Daughter') {
                    return age <= 25
                  }
                  return age < 18
                }).length}/6
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Note: Son/Daughter are counted as children until age 25
              </p>
            </div>
          )}
        </div>

        {/* Sum Insured Selection */}
        <div className="bg-white rounded-lg border p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {planType === 'Family Floater' ? 'Total Sum Insured *' : 'Sum Insured *'}
          </label>
          <select
            {...register('totalSumInsured', { valueAsNumber: true })}
            className="w-full md:w-1/3 px-3 py-2 border rounded-md"
          >
            {sumInsuredOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          {errors.totalSumInsured && (
            <p className="text-xs text-red-600 mt-1">{errors.totalSumInsured.message as any}</p>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => {
              sessionStorage.setItem('forceQuotationStep', '3')
              router.push('/dashboard/presale/quotation')
            }}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Compare Quotes
          </button>
        </div>
      </form>
    </div>
  )
}

