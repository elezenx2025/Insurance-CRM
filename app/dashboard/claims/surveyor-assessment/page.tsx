'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeftIcon, DocumentIcon, UserIcon, BuildingOfficeIcon, CheckCircleIcon, ExclamationTriangleIcon, ClipboardDocumentCheckIcon, CameraIcon } from '@heroicons/react/24/outline'
import { ContextualDocumentManager } from '@/components/documents/ContextualDocumentManager'
import toast from 'react-hot-toast'

const surveyorAssessmentSchema = z.object({
  claimId: z.string().min(1, 'Claim ID is required'),
  surveyorName: z.string().min(1, 'Surveyor name is required'),
  surveyorLicense: z.string().min(1, 'Surveyor license is required'),
  assessmentDate: z.string(),
  assessmentLocation: z.string(),
  // Assessment details
  damageAssessment: z.string(),
  causeOfLoss: z.string(),
  estimatedRepairCost: z.number(),
  estimatedReplacementCost: z.number(),
  totalAssessmentAmount: z.number(),
  // Surveyor findings
  findings: z.string(),
  recommendations: z.string(),
  photographs: z.array(z.string()).optional(),
  // API integration status
  apiIntegrationEnabled: z.boolean().default(false),
  insuranceCompanyResponse: z.string().optional()
})

type SurveyorAssessmentFormData = z.infer<typeof surveyorAssessmentSchema>

export default function SurveyorAssessmentPage() {
  const router = useRouter()
  const [showDocuments, setShowDocuments] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiResponse, setApiResponse] = useState<any>(null)

  const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(surveyorAssessmentSchema),
    defaultValues: {
      apiIntegrationEnabled: false
    }
  })

  const apiIntegrationEnabled = watch('apiIntegrationEnabled')
  const estimatedRepairCost = watch('estimatedRepairCost')
  const estimatedReplacementCost = watch('estimatedReplacementCost')

  const handleBack = () => {
    router.push('/dashboard/postsale/claims')
  }

  const handleDocuments = () => {
    setShowDocuments(true)
  }

  const calculateTotalAssessment = () => {
    const repair = estimatedRepairCost || 0
    const replacement = estimatedReplacementCost || 0
    const total = repair + replacement
    setValue('totalAssessmentAmount', total)
  }

  const onSubmit = async (data: SurveyorAssessmentFormData) => {
    setIsSubmitting(true)
    try {
      if (data.apiIntegrationEnabled) {
        // Mock API call to insurance company
        await new Promise(resolve => setTimeout(resolve, 3000))
        const mockResponse = {
          assessmentId: 'ASSESS-' + Date.now().toString().slice(-6),
          status: 'SUBMITTED',
          referenceNumber: 'REF-' + Date.now().toString().slice(-8),
          message: 'Surveyor assessment submitted successfully to insurance company',
          nextSteps: ['Insurance Company Approval', 'Document Verification', 'Settlement Process']
        }
        setApiResponse(mockResponse)
        setValue('insuranceCompanyResponse', JSON.stringify(mockResponse))
        toast.success('Surveyor assessment submitted to insurance company successfully!')
      } else {
        // Manual process
        await new Promise(resolve => setTimeout(resolve, 2000))
        toast.success('Surveyor assessment recorded for manual processing!')
      }
      setCurrentStep(4)
    } catch (error) {
      toast.error('Failed to submit surveyor assessment')
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const getStepStatus = (step: number) => {
    if (step < currentStep) return 'completed'
    if (step === currentStep) return 'current'
    return 'upcoming'
  }

  const getStepIcon = (step: number) => {
    const status = getStepStatus(step)
    if (status === 'completed') return <CheckCircleIcon className="h-5 w-5 text-green-500" />
    if (status === 'current') return <ExclamationTriangleIcon className="h-5 w-5 text-blue-500" />
    return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
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
              Back to Claims
            </button>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Surveyor Assessment</h1>
          <p className="text-gray-600 mt-2">
            Submit surveyor assessment back flow from insurance company with API integration
          </p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between">
            {[
              { step: 1, title: 'Surveyor Details', description: 'Enter surveyor information' },
              { step: 2, title: 'Assessment Details', description: 'Record damage assessment' },
              { step: 3, title: 'API Integration', description: 'Submit to insurance company' },
              { step: 4, title: 'Confirmation', description: 'Review and confirm' }
            ].map(({ step, title, description }) => (
              <div key={step} className="flex items-center">
                <div className="flex items-center">
                  {getStepIcon(step)}
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${
                      getStepStatus(step) === 'current' ? 'text-blue-600' : 
                      getStepStatus(step) === 'completed' ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {title}
                    </p>
                    <p className="text-xs text-gray-500">{description}</p>
                  </div>
                </div>
                {step < 4 && <div className="ml-8 h-0.5 w-16 bg-gray-200" />}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Step 1: Surveyor Details */}
          {currentStep === 1 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Surveyor Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Claim ID *
                  </label>
                  <input
                    type="text"
                    {...register('claimId')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter claim ID"
                  />
                  {errors.claimId && <p className="text-red-500 text-xs mt-1">{errors.claimId.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Surveyor Name *
                  </label>
                  <input
                    type="text"
                    {...register('surveyorName')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter surveyor name"
                  />
                  {errors.surveyorName && <p className="text-red-500 text-xs mt-1">{errors.surveyorName.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Surveyor License *
                  </label>
                  <input
                    type="text"
                    {...register('surveyorLicense')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter surveyor license number"
                  />
                  {errors.surveyorLicense && <p className="text-red-500 text-xs mt-1">{errors.surveyorLicense.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assessment Date *
                  </label>
                  <input
                    type="date"
                    {...register('assessmentDate')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.assessmentDate && <p className="text-red-500 text-xs mt-1">{errors.assessmentDate.message}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assessment Location *
                  </label>
                  <input
                    type="text"
                    {...register('assessmentLocation')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter assessment location"
                  />
                  {errors.assessmentLocation && <p className="text-red-500 text-xs mt-1">{errors.assessmentLocation.message}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Assessment Details */}
          {currentStep === 2 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Damage Assessment</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Damage Assessment *
                    </label>
                    <select
                      {...register('damageAssessment')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Damage Level</option>
                      <option value="MINOR">Minor Damage</option>
                      <option value="MODERATE">Moderate Damage</option>
                      <option value="MAJOR">Major Damage</option>
                      <option value="TOTAL_LOSS">Total Loss</option>
                    </select>
                    {errors.damageAssessment && <p className="text-red-500 text-xs mt-1">{errors.damageAssessment.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cause of Loss *
                    </label>
                    <select
                      {...register('causeOfLoss')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Cause of Loss</option>
                      <option value="ACCIDENT">Accident</option>
                      <option value="FIRE">Fire</option>
                      <option value="THEFT">Theft</option>
                      <option value="NATURAL_CALAMITY">Natural Calamity</option>
                      <option value="VANDALISM">Vandalism</option>
                      <option value="WEAR_TEAR">Wear and Tear</option>
                    </select>
                    {errors.causeOfLoss && <p className="text-red-500 text-xs mt-1">{errors.causeOfLoss.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Repair Cost (₹) *
                    </label>
                    <input
                      type="number"
                      {...register('estimatedRepairCost', { valueAsNumber: true })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => {
                        register('estimatedRepairCost', { valueAsNumber: true }).onChange(e)
                        calculateTotalAssessment()
                      }}
                    />
                    {errors.estimatedRepairCost && <p className="text-red-500 text-xs mt-1">{errors.estimatedRepairCost.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Replacement Cost (₹) *
                    </label>
                    <input
                      type="number"
                      {...register('estimatedReplacementCost', { valueAsNumber: true })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => {
                        register('estimatedReplacementCost', { valueAsNumber: true }).onChange(e)
                        calculateTotalAssessment()
                      }}
                    />
                    {errors.estimatedReplacementCost && <p className="text-red-500 text-xs mt-1">{errors.estimatedReplacementCost.message}</p>}
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-900 mb-2">Assessment Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span>Repair Cost:</span>
                      <span>₹{estimatedRepairCost?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Replacement Cost:</span>
                      <span>₹{estimatedReplacementCost?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex justify-between font-medium border-t pt-2 col-span-2">
                      <span>Total Assessment Amount:</span>
                      <span>₹{watch('totalAssessmentAmount')?.toLocaleString() || 0}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Surveyor Findings *
                  </label>
                  <textarea
                    {...register('findings')}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter detailed surveyor findings..."
                  />
                  {errors.findings && <p className="text-red-500 text-xs mt-1">{errors.findings.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recommendations *
                  </label>
                  <textarea
                    {...register('recommendations')}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter surveyor recommendations..."
                  />
                  {errors.recommendations && <p className="text-red-500 text-xs mt-1">{errors.recommendations.message}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: API Integration */}
          {currentStep === 3 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">API Integration</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <ClipboardDocumentCheckIcon className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">API Integration with Insurance Company</h3>
                      <p className="text-xs text-gray-500">Submit surveyor assessment directly to insurance company</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={apiIntegrationEnabled}
                      onChange={(e) => setValue('apiIntegrationEnabled', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-600">Enable API Integration</span>
                  </div>
                </div>

                {apiIntegrationEnabled ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-green-900 mb-2">API Integration Enabled</h3>
                    <div className="space-y-2 text-sm text-green-800">
                      <div className="flex justify-between">
                        <span>Integration Status:</span>
                        <span className="font-medium">Active</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Insurance Company:</span>
                        <span className="font-medium">Integrated</span>
                      </div>
                      <div className="flex justify-between">
                        <span>API Endpoint:</span>
                        <span className="font-medium">https://api.insurance.com/assessments</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Response Time:</span>
                        <span className="font-medium">~3 seconds</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-yellow-900 mb-2">Manual Processing</h3>
                    <div className="space-y-2 text-sm text-yellow-800">
                      <div className="flex justify-between">
                        <span>Processing Mode:</span>
                        <span className="font-medium">Manual</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Next Steps:</span>
                        <span className="font-medium">Manual submission required</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimated Time:</span>
                        <span className="font-medium">24-48 hours</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleDocuments}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Manage Assessment Documents
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {currentStep === 4 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Confirmation</h2>
              {apiResponse ? (
                <div className="text-center">
                  <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Surveyor Assessment Submitted Successfully!</h3>
                  <p className="text-gray-600 mb-6">
                    Your surveyor assessment has been submitted to the insurance company.
                  </p>
                  <div className="space-y-2 mb-6">
                    <p className="text-sm text-gray-500">Assessment ID: {apiResponse.assessmentId}</p>
                    <p className="text-sm text-gray-500">Reference Number: {apiResponse.referenceNumber}</p>
                    <p className="text-sm text-gray-500">Status: {apiResponse.status}</p>
                    <p className="text-sm text-gray-500">Claim ID: {watch('claimId')}</p>
                    <p className="text-sm text-gray-500">Surveyor: {watch('surveyorName')}</p>
                    <p className="text-sm text-gray-500">Total Assessment: ₹{watch('totalAssessmentAmount')?.toLocaleString()}</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">Next Steps:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      {apiResponse.nextSteps.map((step: string, index: number) => (
                        <li key={index} className="flex items-center">
                          <span className="mr-2">{index + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-center space-x-4">
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentStep(1)
                        setApiResponse(null)
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Submit Another Assessment
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-yellow-900 mb-2">Assessment Summary</h3>
                    <div className="space-y-2 text-sm text-yellow-800">
                      <div className="flex justify-between">
                        <span>Claim ID:</span>
                        <span>{watch('claimId')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Surveyor:</span>
                        <span>{watch('surveyorName')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Assessment Date:</span>
                        <span>{watch('assessmentDate')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Damage Assessment:</span>
                        <span>{watch('damageAssessment')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Assessment:</span>
                        <span>₹{watch('totalAssessmentAmount')?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>API Integration:</span>
                        <span>{apiIntegrationEnabled ? 'Enabled' : 'Manual Processing'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          {currentStep < 4 && (
            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {currentStep === 3 ? 'Submit Assessment' : 'Next'}
              </button>
            </div>
          )}

          {/* Submit Button for Step 3 */}
          {currentStep === 3 && (
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Surveyor Assessment'}
              </button>
            </div>
          )}
        </form>

        {/* Contextual Document Manager */}
        {showDocuments && (
          <ContextualDocumentManager 
            processType="surveyor-assessment"
            customerId="CUST-001"
          />
        )}
      </div>
    </div>
  )
}