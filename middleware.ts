import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/portal',
  '/auth/login',
  '/customer/login',
  '/customer/login/standalone',
  '/customer/register',
  '/api/auth/login',
  '/api/auth/logout',
  '/api/send-verification',
  '/_next',
  '/favicon.ico',
  '/sw.js',
  '/static',
  '/logos',
  '/templates'
]

// Define routes that require admin authentication
const adminRoutes = [
  '/dashboard',
  '/api/policies',
  '/api/claims',
  '/api/customers',
  '/api/reports',
  '/api/master-data',
  '/api/bulk-upload',
  '/api/documents',
  '/api/email',
  '/api/notify'
]

// Define routes that require customer authentication
const customerRoutes = [
  '/customer/buy',
  '/customer/claims',
  '/customer/file-claim',
  '/customer/insurance-quotes',
  '/customer/insurance-quotes-simple',
  '/customer/policies',
  '/customer/policy-details',
  '/customer/profile',
  '/customer/proposal',
  '/customer/renew',
  '/customer/test'
]

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(route => {
    if (route === '/') return pathname === '/'
    return pathname.startsWith(route)
  })
}

function isAdminRoute(pathname: string): boolean {
  return adminRoutes.some(route => pathname.startsWith(route))
}

function isCustomerRoute(pathname: string): boolean {
  return customerRoutes.some(route => pathname.startsWith(route))
}

function verifyToken(token?: string): any {
  try {
    if (!token) return null
    return jwt.verify(token, process.env.JWT_SECRET || 'demo-secret-key')
  } catch (error) {
    return null
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  console.log(`Middleware: Temporarily allowing all routes for login debugging - ${pathname}`)
  return NextResponse.next()
  
  // Allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }

  // Check for admin routes
  if (isAdminRoute(pathname)) {
    // Check for admin authentication
    const authToken = request.cookies.get('authToken')?.value || 
                     request.headers.get('authorization')?.replace('Bearer ', '')

    if (!authToken) {
      // Redirect to admin login
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Verify admin token
    const decoded = verifyToken(authToken)
    if (!decoded || (decoded.role !== 'ADMIN' && decoded.role !== 'AGENT')) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      loginUrl.searchParams.set('error', 'unauthorized')
      return NextResponse.redirect(loginUrl)
    }

    // Add user info to headers for API routes
    if (pathname.startsWith('/api/')) {
      const response = NextResponse.next()
      response.headers.set('x-user-id', decoded.userId)
      response.headers.set('x-user-role', decoded.role)
      response.headers.set('x-user-email', decoded.email)
      return response
    }

    return NextResponse.next()
  }

  // Check for customer routes
  if (isCustomerRoute(pathname)) {
    // Check for customer authentication
    const customerToken = request.cookies.get('customer_token')?.value

    if (!customerToken) {
      // Redirect to customer login
      const loginUrl = new URL('/customer/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // For demo purposes, accept any non-empty token
    // In production, you would verify the customer token here
    if (customerToken === 'demo_token_123' || (customerToken?.length ?? 0) > 0) {
      return NextResponse.next()
    }

    // Invalid token - redirect to login
    const loginUrl = new URL('/customer/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    loginUrl.searchParams.set('error', 'invalid_token')
    return NextResponse.redirect(loginUrl)
  }

  // For any other protected routes, redirect to portal
  return NextResponse.redirect(new URL('/portal', request.url))
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public|static|logos|templates).*)',
  ],
}
