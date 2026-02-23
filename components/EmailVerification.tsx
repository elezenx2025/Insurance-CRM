'use client'

import { useState } from 'react'
import { 
  EnvelopeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'

interface EmailVerificationProps {
  email: string
  onVerificationSuccess: () => void
  onBack: () => void
}

export default function EmailVerification({ email, onVerificationSuccess, onBack }: EmailVerificationProps) {
  const [verificationCode, setVerificationCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [error, setError] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)

  // Generate a 6-digit verification code
  const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  // Send verification code to email
  const sendVerificationCode = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      const code = generateVerificationCode()
      
      // Simulate API call to send email
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Store code in session storage for verification (in real app, this would be sent via email)
      sessionStorage.setItem('verificationCode', code)
      sessionStorage.setItem('verificationEmail', email)
      sessionStorage.setItem('verificationTime', Date.now().toString())
      
      setIsCodeSent(true)
      setTimeLeft(300) // 5 minutes
      
      // Start countdown timer
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      
      console.log(`Verification code sent to ${email}: ${code}`) // For demo purposes
      
    } catch (error) {
      setError('Failed to send verification code. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Verify the entered code
  const verifyCode = async () => {
    if (verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit code')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // Simulate API call to verify code
      await new Promise(resolve => setTimeout(resolve, 1000))

      const storedCode = sessionStorage.getItem('verificationCode')
      const storedEmail = sessionStorage.getItem('verificationEmail')
      const storedTime = sessionStorage.getItem('verificationTime')

      if (!storedCode || !storedTime) {
        setError('Verification code has expired. Please request a new one.')
        setAttempts(prev => prev + 1)
        return
      }

      // Check if code is expired (5 minutes)
      const timeDiff = Date.now() - parseInt(storedTime)
      if (timeDiff > 300000) { // 5 minutes in milliseconds
        setError('Verification code has expired. Please request a new one.')
        setAttempts(prev => prev + 1)
        return
      }

      if (storedCode === verificationCode && storedEmail === email) {
        // Clear stored verification data
        sessionStorage.removeItem('verificationCode')
        sessionStorage.removeItem('verificationEmail')
        sessionStorage.removeItem('verificationTime')
        
        onVerificationSuccess()
      } else {
        setError('Invalid verification code. Please try again.')
        setAttempts(prev => prev + 1)
      }
    } catch (error) {
      setError('Verification failed. Please try again.')
      setAttempts(prev => prev + 1)
    } finally {
      setIsLoading(false)
    }
  }

  // Resend verification code
  const resendCode = async () => {
    if (timeLeft > 0) return
    
    setIsCodeSent(false)
    setVerificationCode('')
    setError('')
    await sendVerificationCode()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '') // Only allow digits
    if (value.length <= 6) {
      setVerificationCode(value)
      setError('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && verificationCode.length === 6) {
      verifyCode()
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="text-center mb-6">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <EnvelopeIcon className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Verify Your Email</h2>
        <p className="text-gray-600">
          We've sent a 6-digit verification code to
        </p>
        <p className="font-medium text-gray-900">{email}</p>
      </div>

      {!isCodeSent ? (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 text-center">
            Click the button below to send a verification code to your email address.
          </p>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-sm text-red-800">{error}</span>
              </div>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={onBack}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={sendVerificationCode}
              disabled={isLoading}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin inline" />
                  Sending...
                </>
              ) : (
                'Send Code'
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-sm text-green-800">
                Verification code sent successfully!
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter 6-digit verification code
            </label>
            <input
              type="text"
              value={verificationCode}
              onChange={handleCodeChange}
              onKeyPress={handleKeyPress}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-lg tracking-widest"
              placeholder="000000"
              maxLength={6}
              autoComplete="off"
            />
            {timeLeft > 0 && (
              <p className="text-sm text-gray-500 mt-1 text-center">
                Code expires in {formatTime(timeLeft)}
              </p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-sm text-red-800">{error}</span>
              </div>
            </div>
          )}

          {attempts >= 3 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-2" />
                <span className="text-sm text-yellow-800">
                  Multiple failed attempts. Please request a new code.
                </span>
              </div>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={onBack}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={verifyCode}
              disabled={isLoading || verificationCode.length !== 6 || attempts >= 3}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin inline" />
                  Verifying...
                </>
              ) : (
                'Verify Code'
              )}
            </button>
          </div>

          {timeLeft === 0 && (
            <button
              onClick={resendCode}
              className="w-full text-blue-600 hover:text-blue-700 text-sm py-2 transition-colors"
            >
              Resend verification code
            </button>
          )}
        </div>
      )}
    </div>
  )
}












