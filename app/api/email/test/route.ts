import { NextRequest, NextResponse } from 'next/server'
import { verifySMTPConnection, sendQuotationEmail } from '@/lib/email'

export const runtime = 'nodejs'

export async function GET() {
  try {
    // Test SMTP connection
    const isConnected = await verifySMTPConnection()
    
    if (isConnected) {
      return NextResponse.json({
        success: true,
        message: 'SMTP connection successful',
        config: {
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: process.env.SMTP_PORT || '587',
          user: process.env.SMTP_USER || 'noreply@elezenx.com'
        }
      })
    } else {
      return NextResponse.json(
        { error: 'SMTP connection failed' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('SMTP test error:', error)
    return NextResponse.json(
      { error: 'SMTP test failed', details: error },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to, subject, message } = body

    if (!to || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, message' },
        { status: 400 }
      )
    }

    // Send test email
    const result = await sendQuotationEmail(to, {
      customerName: 'Test Customer',
      quotationNumber: 'TEST-001',
      policyType: 'Gen-Motor',
      premiumAmount: 50000,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      validityPeriod: 30,
      manufacturer: 'Test Manufacturer',
      model: 'Test Model',
      variant: 'Test Variant',
      year: '2024'
    })

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully',
        messageId: result.messageId
      })
    } else {
      return NextResponse.json(
        { error: 'Failed to send test email', details: result.error },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Test email error:', error)
    return NextResponse.json(
      { error: 'Test email failed', details: error },
      { status: 500 }
    )
  }
}
