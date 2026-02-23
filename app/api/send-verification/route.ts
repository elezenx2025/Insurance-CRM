import { NextRequest, NextResponse } from 'next/server'
import { generateVerificationCode, sendVerificationEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, customerName, insuranceCompany, premium } = body

    // Generate 6-digit code
    const verificationCode = generateVerificationCode()

    // Store code in session/database with expiry (10 minutes)
    // For now, we'll return it in response (in production, store in Redis/DB)
    
    // Send email
    const emailSent = await sendVerificationEmail(
      email,
      customerName,
      verificationCode,
      insuranceCompany,
      premium
    )

    if (!emailSent) {
      return NextResponse.json(
        { error: 'Failed to send verification email' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Verification code sent successfully',
      code: verificationCode, // In production, don't send this, store in session
      expiresIn: 600 // 10 minutes in seconds
    })
  } catch (error) {
    console.error('Error in send-verification API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}






