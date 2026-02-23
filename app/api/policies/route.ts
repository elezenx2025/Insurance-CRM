import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const policyType = searchParams.get('policyType') || ''
    
    const skip = (page - 1) * limit

    // Mock policies data for demo purposes
    const mockPolicies = [
      {
        id: '1',
        policyNumber: 'POL12345678',
        policyType: 'GEN_MOTOR',
        premium: 15000,
        coverage: 100000,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2025-01-01'),
        status: 'ACTIVE',
        customer: {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
        },
        agent: {
          id: '1',
          firstName: 'Agent',
          lastName: 'Smith',
          email: 'agent@example.com',
        },
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: '2',
        policyNumber: 'POL87654321',
        policyType: 'HEALTH',
        premium: 12000,
        coverage: 500000,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2025-01-01'),
        status: 'ACTIVE',
        customer: {
          id: '2',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
        },
        agent: {
          id: '1',
          firstName: 'Agent',
          lastName: 'Smith',
          email: 'agent@example.com',
        },
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
      },
      {
        id: '3',
        policyNumber: 'POL11223344',
        policyType: 'GEN_FIRE',
        premium: 50000,
        coverage: 1000000,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2025-01-01'),
        status: 'ACTIVE',
        customer: {
          id: '3',
          companyName: 'ABC Corporation',
          email: 'contact@abccorp.com',
        },
        agent: {
          id: '1',
          firstName: 'Agent',
          lastName: 'Smith',
          email: 'agent@example.com',
        },
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-03'),
      },
    ]

    // Filter policies based on search, status, and policy type
    let filteredPolicies = mockPolicies

    if (search) {
      filteredPolicies = filteredPolicies.filter(policy => 
        policy.policyNumber.toLowerCase().includes(search.toLowerCase()) ||
        policy.customer.firstName?.toLowerCase().includes(search.toLowerCase()) ||
        policy.customer.lastName?.toLowerCase().includes(search.toLowerCase()) ||
        policy.customer.companyName?.toLowerCase().includes(search.toLowerCase()) ||
        policy.customer.email.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (status && status !== 'ALL') {
      filteredPolicies = filteredPolicies.filter(policy => policy.status === status)
    }

    if (policyType && policyType !== 'ALL') {
      filteredPolicies = filteredPolicies.filter(policy => policy.policyType === policyType)
    }

    // Paginate results
    const total = filteredPolicies.length
    const paginatedPolicies = filteredPolicies.slice(skip, skip + limit)

    return NextResponse.json({
      policies: paginatedPolicies,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching policies:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { policyNumber, customerId, agentId, policyType, premium, coverage, startDate, endDate } = body

    // Mock policy creation for demo purposes
    const newPolicy = {
      id: Date.now().toString(),
      policyNumber: policyNumber || `POL${Date.now().toString().slice(-8)}`,
      policyType: policyType || 'GEN_MOTOR',
      premium: premium || 0,
      coverage: coverage || 0,
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : new Date(),
      status: 'ACTIVE',
      customer: {
        id: customerId || '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      },
      agent: {
        id: agentId || '1',
        firstName: 'Agent',
        lastName: 'Smith',
        email: 'agent@example.com',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return NextResponse.json(newPolicy, { status: 201 })
  } catch (error) {
    console.error('Error creating policy:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}