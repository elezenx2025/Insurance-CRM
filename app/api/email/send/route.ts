import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, sendQuotationEmail, sendPolicyIssuedEmail, sendOTPEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, to, data } = body

    if (!type || !to) {
      return NextResponse.json(
        { error: 'Missing required fields: type and to' },
        { status: 400 }
      )
    }

    let result

    switch (type) {
      case 'quotation':
        result = await sendQuotationEmail(to, data)
        break
      case 'policyIssued':
        result = await sendPolicyIssuedEmail(to, data)
        break
      case 'otp':
        result = await sendOTPEmail(to, data)
        break
      default:
        return NextResponse.json(
          { error: 'Invalid email type' },
          { status: 400 }
        )
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Email sent successfully',
        messageId: result.messageId
      })
    } else {
      return NextResponse.json(
        { error: 'Failed to send email', details: result.error },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Email API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
