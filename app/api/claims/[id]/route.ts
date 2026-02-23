import { NextRequest, NextResponse } from 'next/server'

type RouteParams = { params: Promise<{ id: string }> }

export async function GET(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const params = await context.params
    // Mock claim data for demo purposes
    const mockClaim = {
      id: params.id,
      claimNumber: `CLM${params.id.slice(-6).toUpperCase()}`,
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
        phone: '+91-9876543210',
      },
      policy: {
        id: '1',
        policyNumber: 'POL12345678',
        policyType: 'GEN_MOTOR',
        coverage: 100000,
        premium: 15000,
        deductible: 5000,
      },
      user: {
        id: '1',
        firstName: 'Admin',
        lastName: 'User',
      },
      documents: [
        {
          id: '1',
          fileName: 'FIR Copy',
          fileUrl: '/documents/fir.pdf',
          fileType: 'application/pdf',
          fileSize: 1024000,
          createdAt: new Date('2024-01-16'),
        },
        {
          id: '2',
          fileName: 'Vehicle Photos',
          fileUrl: '/documents/vehicle-photos.zip',
          fileType: 'application/zip',
          fileSize: 2048000,
          createdAt: new Date('2024-01-16'),
        },
      ],
    }

    return NextResponse.json(mockClaim)
  } catch (error) {
    console.error('Error fetching claim:', error)
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
    const { claimNumber, policyId, customerId, claimType, description, amount, status } = body

    // Mock claim update for demo purposes
    const updatedClaim = {
      id: params.id,
      claimNumber: claimNumber || `CLM${params.id.slice(-6).toUpperCase()}`,
      status: status || 'SUBMITTED',
      claimType: claimType || 'MOTOR',
      claimAmount: amount || 50000,
      description: description || 'Vehicle accident claim',
      incidentDate: new Date('2024-01-15'),
      reportedDate: new Date('2024-01-16'),
      processedAt: status === 'APPROVED' || status === 'DENIED' || status === 'SETTLED' ? new Date() : null,
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

    return NextResponse.json(updatedClaim)
  } catch (error) {
    console.error('Error updating claim:', error)
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
    // Mock claim deletion for demo purposes
    console.log(`Mock: Deleting claim with ID: ${params.id}`)
    
    return NextResponse.json({ message: 'Claim deleted successfully' })
  } catch (error) {
    console.error('Error deleting claim:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}