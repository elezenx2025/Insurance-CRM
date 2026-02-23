import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export const runtime = 'nodejs'

// Demo mode - bypass database for testing
const DEMO_MODE = true

// Demo user data
const DEMO_USER = {
  id: 'demo-user-1',
  email: 'admin@insurance.com',
  firstName: 'Admin',
  lastName: 'User',
  role: 'ADMIN',
  isActive: true,
  avatar: null,
  createdAt: new Date(),
  updatedAt: new Date(),
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Demo mode authentication
    if (DEMO_MODE) {
      // Check demo credentials
      if (email === 'admin@insurance.com' && password === 'admin123') {
        // Generate JWT token
        const token = jwt.sign(
          { 
            userId: DEMO_USER.id, 
            email: DEMO_USER.email, 
            role: DEMO_USER.role 
          },
          process.env.JWT_SECRET || 'demo-secret-key',
          { expiresIn: '24h' }
        )

        return NextResponse.json({
          message: 'Login successful (Demo Mode)',
          user: DEMO_USER,
          token,
        })
      } else {
        return NextResponse.json(
          { message: 'Invalid credentials. Use admin@insurance.com / admin123' },
          { status: 401 }
        )
      }
    }

    // Production mode - use mock authentication for demo
    try {
      // Mock user validation for demo purposes
      const mockUsers = [
        {
          id: '1',
          email: 'admin@elezenx.com',
          password: 'admin123',
          firstName: 'Admin',
          lastName: 'User',
          role: 'ADMIN',
          isActive: true,
          avatar: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          email: 'agent@elezenx.com',
          password: 'agent123',
          firstName: 'Agent',
          lastName: 'User',
          role: 'AGENT',
          isActive: true,
          avatar: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ]

      const user = mockUsers.find(u => u.email === email)

      if (!user) {
        return NextResponse.json(
          { message: 'Invalid credentials' },
          { status: 401 }
        )
      }

      // Check if user is active
      if (!user.isActive) {
        return NextResponse.json(
          { message: 'Account is deactivated' },
          { status: 401 }
        )
      }

      // Verify password
      if (password !== user.password) {
        return NextResponse.json(
          { message: 'Invalid credentials' },
          { status: 401 }
        )
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email, 
          role: user.role 
        },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '24h' }
      )

      // Return user data without password
      const { password: _, ...userWithoutPassword } = user

      return NextResponse.json({
        message: 'Login successful',
        user: userWithoutPassword,
        token,
      })

    } catch (error) {
      console.error('Authentication error:', error)
      return NextResponse.json(
        { message: 'Internal server error' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

