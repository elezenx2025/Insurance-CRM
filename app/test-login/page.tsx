'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function TestLoginPage() {
  const [email, setEmail] = useState('admin@insurance.com')
  const [password, setPassword] = useState('admin123')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setResult('')
    
    try {
      console.log('Testing login with:', { email, password })
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', response.headers)
      
      const data = await response.json()
      console.log('Response data:', data)
      
      setResult(`Status: ${response.status}\nResponse: ${JSON.stringify(data, null, 2)}`)
      
      if (response.ok) {
        // Store token in localStorage
        if (data.token) {
          localStorage.setItem('authToken', data.token)
          localStorage.setItem('user', JSON.stringify(data.user))
        }
        
        // Navigate to dashboard
        router.push('/dashboard')
      }
      
    } catch (error) {
      console.error('Login error:', error)
      setResult(`Error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Test Login Page
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Debug login functionality
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Testing...' : 'Test Login'}
            </button>
          </div>
        </form>
        
        {result && (
          <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Debug Result:</h3>
            <pre className="text-xs text-gray-600 whitespace-pre-wrap">{result}</pre>
          </div>
        )}
      </div>
    </div>
  )
}

