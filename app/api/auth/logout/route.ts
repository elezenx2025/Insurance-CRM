import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Create response with cleared cookies
    const response = NextResponse.json({
      message: 'Logout successful',
    })

    // Clear authentication cookies
    response.cookies.set('authToken', '', {
      path: '/',
      expires: new Date(0),
      httpOnly: true,
      secure: true,
      sameSite: 'strict'
    })

    response.cookies.set('customer_token', '', {
      path: '/',
      expires: new Date(0),
      httpOnly: true,
      secure: true,
      sameSite: 'strict'
    })

    // In a real application, you might want to:
    // 1. Add the token to a blacklist
    // 2. Log the logout activity
    // 3. Clear any server-side sessions

    return response

  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}




























