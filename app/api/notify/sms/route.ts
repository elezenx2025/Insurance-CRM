import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { to, message } = await req.json()
    if (!to || !message) {
      return NextResponse.json({ ok: false, message: 'to and message are required' }, { status: 400 })
    }
    // Mock integration: in real implementation, call SMS provider here
    console.log('Mock SMS sent', { to, message })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('SMS notify error', e)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}


