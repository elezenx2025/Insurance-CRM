'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginForm = z.infer<typeof loginSchema>

function LoginContent() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  // Handle URL parameters for error messages and redirects
  useEffect(() => {
    const error = searchParams.get('error')
    if (error === 'unauthorized') {
      toast.error('Your session has expired. Please log in again.')
    }
  }, [searchParams])

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    console.log('Login attempt with:', { email: data.email })
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      console.log('Login response status:', response.status)

      if (response.ok) {
        const result = await response.json()
        console.log('Login successful, result:', result)
        toast.success('Login successful!')
        
        // Store token in localStorage
        if (result.token) {
          localStorage.setItem('authToken', result.token)
          localStorage.setItem('user', JSON.stringify(result.user))
          console.log('Token stored in localStorage')
          
          // Also set as HTTP-only cookie
          const isLocalhost = window.location.hostname === 'localhost'
          document.cookie = `authToken=${result.token}; path=/; max-age=86400; ${!isLocalhost ? 'secure;' : ''} samesite=strict`
          console.log('Token set as cookie')
        }
        
        // Get redirect URL from search params or default to dashboard
        const redirectUrl = searchParams.get('redirect') || '/dashboard'
        console.log('Redirecting to:', redirectUrl)
        
        // Use setTimeout to ensure cookie is set before redirect
        setTimeout(() => {
          window.location.href = redirectUrl
        }, 500)
        
      } else {
        const error = await response.json()
        console.error('Login failed:', error)
        toast.error(error.message || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('An error occurred during login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-32 w-auto flex items-center justify-center">
            <img
              src="/elezenx-logo.svg"
              alt="ELEZENX Tech Solutions"
              className="h-28 w-auto"
            />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Policy Assurance Administrator System
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account
          </p>
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-medium text-blue-900 mb-2">Demo Credentials:</p>
            <p className="text-xs text-blue-700">Email: <span className="font-mono">admin@insurance.com</span></p>
            <p className="text-xs text-blue-700">Password: <span className="font-mono">admin123</span></p>
            <button
              type="button"
              onClick={() => onSubmit({ email: 'admin@insurance.com', password: 'admin123' })}
              className="mt-2 w-full px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
            >
              🚀 Quick Login (Debug)
            </button>
          </div>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                {...register('email')}
                type="email"
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="text-center text-sm text-gray-600">
            <p>Demo Rights to EZTS</p>
            <p className="mt-1">For Credentials: Connect to Administrator</p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8 text-center">
            <div className="mx-auto h-32 w-auto flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
            <p className="text-gray-600">Loading login page...</p>
          </div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  )
}