import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    
    const skip = (page - 1) * limit

    // Mock claims data for demo purposes
    const mockClaims = [
      {
        id: '1',
        claimNumber: 'CLM001234',
        status: 'SUBMITTED',
        claimType: 'MOTOR',
        claimAmount: 50000,
        description: 'Vehicle accident claim',
        incidentDate: new Date('2024-01-15'),
        reportedDate: new Date('2024-01-16'),
        customer: {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
        },
        policy: {
          id: '1',
          policyNumber: 'POL12345678',
          policyType: 'GEN_MOTOR',
        },
        user: {
          id: '1',
          firstName: 'Admin',
          lastName: 'User',
        },
      },
      {
        id: '2',
        claimNumber: 'CLM001235',
        status: 'APPROVED',
        claimType: 'HEALTH',
        claimAmount: 25000,
        description: 'Medical treatment claim',
        incidentDate: new Date('2024-01-10'),
        reportedDate: new Date('2024-01-12'),
        customer: {
          id: '2',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
        },
        policy: {
          id: '2',
          policyNumber: 'POL87654321',
          policyType: 'HEALTH',
        },
        user: {
          id: '1',
          firstName: 'Admin',
          lastName: 'User',
        },
      },
      {
        id: '3',
        claimNumber: 'CLM001236',
        status: 'PENDING',
        claimType: 'FIRE',
        claimAmount: 100000,
        description: 'Property damage claim',
        incidentDate: new Date('2024-01-08'),
        reportedDate: new Date('2024-01-09'),
        customer: {
          id: '3',
          firstName: 'Bob',
          lastName: 'Johnson',
          email: 'bob.johnson@example.com',
        },
        policy: {
          id: '3',
          policyNumber: 'POL11223344',
          policyType: 'GEN_FIRE',
        },
        user: {
          id: '1',
          firstName: 'Admin',
          lastName: 'User',
        },
      },
    ]

    // Filter claims based on search and status
    let filteredClaims = mockClaims

    if (search) {
      filteredClaims = filteredClaims.filter(claim => 
        claim.claimNumber.toLowerCase().includes(search.toLowerCase()) ||
        claim.description.toLowerCase().includes(search.toLowerCase()) ||
        claim.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
        claim.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
        claim.policy.policyNumber.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (status && status !== 'ALL') {
      filteredClaims = filteredClaims.filter(claim => claim.status === status)
    }

    // Paginate results
    const total = filteredClaims.length
    const paginatedClaims = filteredClaims.slice(skip, skip + limit)

    return NextResponse.json({
      claims: paginatedClaims,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching claims:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { claimNumber, policyId, customerId, claimType, description, amount } = body

    // Mock claim creation for demo purposes
    const newClaim = {
      id: Date.now().toString(),
      claimNumber: claimNumber || `CLM${Date.now().toString().slice(-6)}`,
      status: 'SUBMITTED',
      claimType: claimType || 'MOTOR',
      claimAmount: amount || 0,
      description: description || 'New claim',
      incidentDate: new Date(),
      reportedDate: new Date(),
      customer: {
        id: customerId || '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      },
      policy: {
        id: policyId || '1',
        policyNumber: 'POL12345678',
        policyType: 'GEN_MOTOR',
      },
      user: {
        id: '1',
        firstName: 'Admin',
        lastName: 'User',
      },
    }

    return NextResponse.json(newClaim, { status: 201 })
  } catch (error) {
    console.error('Error creating claim:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}