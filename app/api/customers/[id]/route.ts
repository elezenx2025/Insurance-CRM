import { NextRequest, NextResponse } from 'next/server'

type RouteParams = { params: Promise<{ id: string }> }

export async function GET(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const params = await context.params
    // Mock customer data for demo purposes
    const mockCustomer = {
      id: params.id,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+91-9876543210',
      dateOfBirth: new Date('1990-01-15'),
      gender: 'MALE',
      address: '123 Main Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      status: 'ACTIVE',
      customerType: 'INDIVIDUAL',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      policies: [
        {
          id: '1',
          policyNumber: 'POL12345678',
          policyType: 'GEN_MOTOR',
          premium: 15000,
          startDate: new Date('2024-01-01'),
          endDate: new Date('2025-01-01'),
          status: 'ACTIVE',
        },
        {
          id: '2',
          policyNumber: 'POL87654321',
          policyType: 'HEALTH',
          premium: 12000,
          startDate: new Date('2024-01-01'),
          endDate: new Date('2025-01-01'),
          status: 'ACTIVE',
        }
      ],
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
      ]
    }

    return NextResponse.json(mockCustomer)
  } catch (error) {
    console.error('Error fetching customer:', error)
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
    const { firstName, lastName, companyName, email, phone, customerType, ...otherFields } = body

    // Mock customer update for demo purposes
    const updatedCustomer = {
      id: params.id,
      firstName: firstName || 'John',
      lastName: lastName || 'Doe',
      companyName: companyName || null,
      email: email || 'john.doe@example.com',
      phone: phone || '+91-9876543210',
      customerType: customerType || 'INDIVIDUAL',
      status: 'ACTIVE',
      updatedAt: new Date(),
      ...otherFields
    }

    return NextResponse.json(updatedCustomer)
  } catch (error) {
    console.error('Error updating customer:', error)
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
    // Mock customer deletion for demo purposes
    console.log(`Mock: Deleting customer with ID: ${params.id}`)
    
    return NextResponse.json({ message: 'Customer deleted successfully' })
  } catch (error) {
    console.error('Error deleting customer:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}