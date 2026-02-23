'use client'

import Link from 'next/link'
import { 
  ShieldCheckIcon, 
  UserGroupIcon, 
  CogIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  StarIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

export default function PortalLanding() {
  const features = [
    {
      icon: ShieldCheckIcon,
      title: 'Policy Management',
      description: 'Manage all your insurance policies in one place'
    },
    {
      icon: UserGroupIcon,
      title: 'Customer Support',
      description: '24/7 support for all your insurance needs'
    },
    {
      icon: CogIcon,
      title: 'Easy Renewals',
      description: 'Quick and secure policy renewals'
    }
  ]

  const benefits = [
    'Comprehensive coverage options',
    'Competitive pricing',
    'Fast claim processing',
    '24/7 customer support',
    'Digital policy management',
    'Secure online transactions'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        {/* Top Bar with Contact Info */}
        <div className="bg-blue-600 text-white py-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <PhoneIcon className="h-4 w-4" />
                  <span>Toll Free: 1-800-PAAS-HELP (1-800-722-7435)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <EnvelopeIcon className="h-4 w-4" />
                  <span>support@elezenx.com</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <ClockIcon className="h-4 w-4" />
                <span>24/7 Customer Support</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img
                src="/elezenx-logo1.svg"
                alt="ELEZENX Tech Solutions"
                className="h-16 w-auto"
              />
              <span className="ml-2 text-xl font-bold text-blue-900"></span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/customer/login"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Customer Login
              </Link>
              <Link
                href="/auth/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Agent Login
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-4xl font-bold text-gray-900 mb-6">
            Welcome to Our
            <span className="text-blue-600"> Policy Assurance Administrator System</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Choose your portal to manage your insurance needs. Whether you're a customer looking to renew policies or an agent managing the insurance business.
          </p>
        </div>

        {/* Portal Options */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-16">
          {/* Customer Portal */}
          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <UserGroupIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Customer Portal</h2>
              <p className="text-gray-600 mb-6">
                Access your policies, renew coverage, file claims, and manage your insurance needs.
              </p>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                  View and manage your policies
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                  Easy policy renewal process
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                  File and track claims
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                  Buy new insurance policies
                </div>
              </div>

              <div className="space-y-4">
                <Link
                  href="/customer/login"
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  Customer Login
                  <ArrowRightIcon className="h-5 w-5 ml-2" />
                </Link>
                <Link 
                  href="/customer/register"
                  className="w-full border border-blue-600 text-blue-600 py-3 px-6 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Create New Account
                </Link>
              </div>
            </div>
          </div>
  
          {/* Admin Portal */}
          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CogIcon className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Agent Portal</h2>
              <p className="text-gray-600 mb-6">
                Manage policies, process claims, handle customers, and oversee the entire insurance system.
              </p>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                  Comprehensive dashboard
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                  Policy and claims management
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                  Customer relationship management
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                  Analytics and reporting
                </div>
              </div>

              <div className="space-y-4">
                <Link
                  href="/auth/login"
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  Agent Login
                  <ArrowRightIcon className="h-5 w-5 ml-2" />
                </Link>
                <div className="text-sm text-gray-500">
                  Demo: admin@insurance.com / admin123
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Our Insurance Portal?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-20 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            What You Get
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center">
                <StarIcon className="h-5 w-5 text-yellow-500 mr-3" />
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of satisfied customers who trust us with their insurance needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/customer/register"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Started as Customer
            </Link>
            <Link
              href="/customer/login"
              className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Already a Customer? Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Information */}
            <div>
              <div className="flex items-center mb-4">
                <img
                  src="/elezenx-logo2.svg"
                  alt="ELEZENX Tech Solutions"
                  className="h-24 w-auto"
                />
                <span className="ml-2 text-xl font-bold"></span>
              </div>
              <p className="text-gray-300 mb-4">
                ELEZENX Tech Solutions Private Limited - Your Trusted Partner for Comprehensive Insurance IT Solutions.
              </p>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <MapPinIcon className="h-4 w-4" />
                <span>Kolar Road, Bhopal 462042</span>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <PhoneIcon className="h-4 w-4 text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-300">Mobile Number</p>
                    <p className="text-white font-medium">+91 95997 79962</p>
                    <p className="text-xs text-gray-400">(+91 95997 79962)</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <EnvelopeIcon className="h-4 w-4 text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-300">Email Support</p>
                    <p className="text-white font-medium">support@elezenx.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <ClockIcon className="h-4 w-4 text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-300">Business Hours</p>
                    <p className="text-white font-medium">Mon-Sat: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Compliance & Legal */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Compliance</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <DocumentTextIcon className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-gray-300">Licensed in 50 States</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ShieldCheckIcon className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-gray-300">NAIC Member #12345</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ExclamationTriangleIcon className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm text-gray-300">A+ BBB Rating</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-gray-300">SOC 2 Compliant</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link href="/customer/login" className="block text-sm text-gray-300 hover:text-white transition-colors">
                  Customer Portal
                </Link>
                <Link href="/auth/login" className="block text-sm text-gray-300 hover:text-white transition-colors">
                  Agent Portal
                </Link>
                <Link href="/customer/register" className="block text-sm text-gray-300 hover:text-white transition-colors">
                  Register Account
                </Link>
                <Link href="/help" className="block text-sm text-gray-300 hover:text-white transition-colors">
                  Help Center
                </Link>
                <Link href="/contact" className="block text-sm text-gray-300 hover:text-white transition-colors">
                  Contact Support
                </Link>
                <Link href="/privacy" className="block text-sm text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="block text-sm text-gray-300 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-sm text-gray-400 mb-4 md:mb-0">
                © 2025 PAAS - Policy Assurance Administrator System. All rights reserved with ELEZENX Tech Solutions Private Limited.
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
