'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLocation } from '@/contexts/LocationContext'
import { 
  ShieldCheckIcon, 
  HomeIcon,
  TruckIcon,
  HeartIcon,
  BriefcaseIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  StarIcon,
  MapPinIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

export default function BuyNewPolicy() {
  const { location, region, getPricing } = useLocation()
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedPolicy, setSelectedPolicy] = useState<any>(null)
  const [step, setStep] = useState(1)

  const categories = [
    {
      id: 'auto',
      name: 'Auto Insurance',
      icon: TruckIcon,
      description: 'Comprehensive coverage for your vehicle',
      color: 'blue'
    },
    {
      id: 'home',
      name: 'Home Insurance', 
      icon: HomeIcon,
      description: 'Protect your home and belongings',
      color: 'green'
    },
    {
      id: 'health',
      name: 'Health Insurance',
      icon: HeartIcon,
      description: 'Medical coverage for you and family',
      color: 'red'
    },
    {
      id: 'business',
      name: 'Business Insurance',
      icon: BriefcaseIcon,
      description: 'Coverage for your business assets',
      color: 'purple'
    },
    {
      id: 'travel',
      name: 'Travel Insurance',
      icon: PaperAirplaneIcon,
      description: 'Protection while traveling',
      color: 'orange'
    }
  ]

  const getRegionalPricing = (basePrice: number, policyType: string) => {
    const pricing = getPricing(policyType)
    return pricing ? pricing.regionalPrice : basePrice
  }

  const policies = {
    auto: [
      {
        id: 'AUTO-001',
        name: 'Basic Auto Coverage',
        basePrice: 800,
        price: getRegionalPricing(800, 'auto'),
        features: ['Third Party Liability', 'Personal Accident Cover', 'Roadside Assistance'],
        rating: 4.2
      },
      {
        id: 'AUTO-002', 
        name: 'Comprehensive Auto',
        basePrice: 1200,
        price: getRegionalPricing(1200, 'auto'),
        features: ['Full Coverage', 'Zero Depreciation', 'Engine Protection', 'Roadside Assistance'],
        rating: 4.8
      },
      {
        id: 'AUTO-003',
        name: 'Premium Auto',
        basePrice: 1800,
        price: getRegionalPricing(1800, 'auto'),
        features: ['Full Coverage', 'Zero Depreciation', 'Engine Protection', 'Roadside Assistance', 'Personal Belongings'],
        rating: 4.9
      }
    ],
    home: [
      {
        id: 'HOME-001',
        name: 'Basic Home Protection',
        basePrice: 600,
        price: getRegionalPricing(600, 'home'),
        features: ['Fire & Theft Coverage', 'Natural Disaster Protection'],
        rating: 4.1
      },
      {
        id: 'HOME-002',
        name: 'Comprehensive Home',
        basePrice: 900,
        price: getRegionalPricing(900, 'home'),
        features: ['Fire & Theft Coverage', 'Natural Disaster Protection', 'Personal Belongings', 'Liability Coverage'],
        rating: 4.6
      }
    ],
    health: [
      {
        id: 'HEALTH-001',
        name: 'Individual Health',
        basePrice: 2000,
        price: getRegionalPricing(2000, 'health'),
        features: ['Hospitalization Coverage', 'Pre & Post Hospitalization', 'Day Care Procedures'],
        rating: 4.3
      },
      {
        id: 'HEALTH-002',
        name: 'Family Health',
        basePrice: 3500,
        price: getRegionalPricing(3500, 'health'),
        features: ['Family Coverage', 'Maternity Benefits', 'Preventive Care', 'Emergency Coverage'],
        rating: 4.7
      }
    ]
  }

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      red: 'bg-red-50 text-red-600 border-red-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200',
      orange: 'bg-orange-50 text-orange-600 border-orange-200'
    }
    return colors[color] || colors.blue
  }

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setStep(2)
  }

  const handlePolicySelect = (policy: any) => {
    setSelectedPolicy(policy)
    setStep(3)
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Buy New Insurance Policy</h1>
        <p className="text-gray-600 mt-2">Choose the perfect coverage for your needs</p>
        {location && region && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <MapPinIcon className="h-5 w-5 text-blue-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-blue-900">
                  Pricing for {location.city}, {location.state}
                </p>
                <p className="text-xs text-blue-700">
                  Risk Level: {region.riskLevel.charAt(0).toUpperCase() + region.riskLevel.slice(1)} • 
                  Average Premium: ${region.averagePremium}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Step 1: Category Selection */}
      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Select Insurance Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className={`p-6 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all hover:shadow-md text-left ${getColorClasses(category.color)}`}
              >
                <category.icon className="h-12 w-12 mb-4" />
                <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
                <p className="text-sm opacity-80">{category.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Policy Selection */}
      {step === 2 && selectedCategory && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Choose Your {categories.find(c => c.id === selectedCategory)?.name} Plan
            </h2>
            <button
              onClick={() => setStep(1)}
              className="text-blue-600 hover:text-blue-700"
            >
              ← Back to Categories
            </button>
          </div>
          
          <div className="grid gap-6">
            {(policies as any)[selectedCategory]?.map((policy: any) => (
              <div key={policy.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <ShieldCheckIcon className="h-12 w-12 text-blue-600" />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{policy.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(policy.rating)
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">({policy.rating})</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-gray-900">
                      {location?.currencySymbol || '₹'}{policy.price}
                    </p>
                    {policy.basePrice && policy.price !== policy.basePrice && (
                      <p className="text-sm text-gray-500 line-through">
                        {location?.currencySymbol || '₹'}{policy.basePrice}
                      </p>
                    )}
                    {location && region && (
                      <p className="text-sm text-blue-600">
                        {location.city}, {location.state} pricing
                      </p>
                    )}
                    <p className="text-sm text-gray-600">Annual Premium</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">What's Included:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {policy.features.map((feature: string, index: number) => (
                      <div key={index} className="flex items-center">
                        <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={() => handlePolicySelect(policy)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Select This Plan
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Purchase Form */}
      {step === 3 && selectedPolicy && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Complete Your Purchase</h2>
            <button
              onClick={() => setStep(2)}
              className="text-blue-600 hover:text-blue-700"
            >
              ← Back to Plans
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Policy Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Plan</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Plan:</span>
                  <span className="font-medium">{selectedPolicy.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Annual Premium:</span>
                  <span className="font-medium">{location?.currencySymbol || '₹'}{selectedPolicy.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Frequency:</span>
                  <span className="font-medium">Annual</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-gray-900 font-semibold">Total Amount:</span>
                    <span className="text-xl font-bold text-gray-900">{location?.currencySymbol || '₹'}{selectedPolicy.price}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Information Form */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Information</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your email"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Complete Purchase
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
