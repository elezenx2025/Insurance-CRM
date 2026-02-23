import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { to, subject, html } = await req.json()
    if (!to || !subject || !html) {
      return NextResponse.json({ ok: false, message: 'to, subject, html are required' }, { status: 400 })
    }
    // Mock integration: in real implementation, call email provider here
    console.log('Mock Email sent', { to, subject })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Email notify error', e)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}


