import { NextRequest, NextResponse } from 'next/server'

type RouteParams = { params: Promise<{ id: string }> }

export async function GET(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const params = await context.params
    // Mock policy data for demo purposes
    const mockPolicy = {
      id: params.id,
      policyNumber: 'POL12345678',
      policyType: 'GEN_MOTOR',
      premium: 15000,
      coverage: 100000,
      deductible: 5000,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2025-01-01'),
      status: 'ACTIVE',
      customer: {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+91-9876543210',
        address: '123 Main Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
      },
      agent: {
        id: '1',
        firstName: 'Agent',
        lastName: 'Smith',
        email: 'agent@example.com',
        phone: '+91-9876543211',
      },
      claims: [
        {
          id: '1',
          claimNumber: 'CLM001234',
          status: 'SUBMITTED',
          claimType: 'MOTOR',
          claimAmount: 50000,
          description: 'Vehicle accident claim',
          incidentDate: new Date('2024-01-15'),
          reportedDate: new Date('2024-01-16'),
        }
      ],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    }

    return NextResponse.json(mockPolicy)
  } catch (error) {
    console.error('Error fetching policy:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const params = await context.params
    const body = await request.json()
    const { policyNumber, customerId, agentId, policyType, premium, coverage, startDate, endDate, status } = body

    // Mock policy update for demo purposes
    const updatedPolicy = {
      id: params.id,
      policyNumber: policyNumber || 'POL12345678',
      policyType: policyType || 'GEN_MOTOR',
      premium: premium || 15000,
      coverage: coverage || 100000,
      startDate: startDate ? new Date(startDate) : new Date('2024-01-01'),
      endDate: endDate ? new Date(endDate) : new Date('2025-01-01'),
      status: status || 'ACTIVE',
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
      updatedAt: new Date(),
    }

    return NextResponse.json(updatedPolicy)
  } catch (error) {
    console.error('Error updating policy:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const params = await context.params
    // Mock policy deletion for demo purposes
    console.log(`Mock: Deleting policy with ID: ${params.id}`)
    
    return NextResponse.json({ message: 'Policy deleted successfully' })
  } catch (error) {
    console.error('Error deleting policy:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}