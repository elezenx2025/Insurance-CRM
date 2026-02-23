import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    
    const skip = (page - 1) * limit

    // Mock customers data for demo purposes
    const mockCustomers = [
      {
        id: '1',
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
          }
        ]
      },
      {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        phone: '+91-9876543211',
        dateOfBirth: new Date('1985-05-20'),
        gender: 'FEMALE',
        address: '456 Oak Avenue',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001',
        status: 'ACTIVE',
        customerType: 'INDIVIDUAL',
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
        policies: [
          {
            id: '2',
            policyNumber: 'POL87654321',
            policyType: 'HEALTH',
            premium: 12000,
            startDate: new Date('2024-01-01'),
            endDate: new Date('2025-01-01'),
          }
        ]
      },
      {
        id: '3',
        companyName: 'ABC Corporation',
        email: 'contact@abccorp.com',
        phone: '+91-9876543212',
        address: '789 Business Park',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001',
        status: 'ACTIVE',
        customerType: 'CORPORATE',
        registrationNumber: 'CORP123456',
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-03'),
        policies: [
          {
            id: '3',
            policyNumber: 'POL11223344',
            policyType: 'GEN_FIRE',
            premium: 50000,
            startDate: new Date('2024-01-01'),
            endDate: new Date('2025-01-01'),
          }
        ]
      },
    ]

    // Filter customers based on search and status
    let filteredCustomers = mockCustomers

    if (search) {
      filteredCustomers = filteredCustomers.filter(customer => 
        customer.firstName?.toLowerCase().includes(search.toLowerCase()) ||
        customer.lastName?.toLowerCase().includes(search.toLowerCase()) ||
        customer.companyName?.toLowerCase().includes(search.toLowerCase()) ||
        customer.email.toLowerCase().includes(search.toLowerCase()) ||
        customer.phone.includes(search)
      )
    }

    if (status && status !== 'ALL') {
      filteredCustomers = filteredCustomers.filter(customer => customer.status === status)
    }

    // Paginate results
    const total = filteredCustomers.length
    const paginatedCustomers = filteredCustomers.slice(skip, skip + limit)

    return NextResponse.json({
      customers: paginatedCustomers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, companyName, email, phone, customerType, ...otherFields } = body

    // Mock customer creation for demo purposes
    const newCustomer = {
      id: Date.now().toString(),
      firstName: firstName || null,
      lastName: lastName || null,
      companyName: companyName || null,
      email,
      phone,
      customerType: customerType || 'INDIVIDUAL',
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
      ...otherFields
    }

    return NextResponse.json(newCustomer, { status: 201 })
  } catch (error) {
    console.error('Error creating customer:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}