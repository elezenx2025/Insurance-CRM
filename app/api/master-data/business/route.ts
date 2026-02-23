import { NextRequest, NextResponse } from 'next/server'

// Mock data for demonstration
const mockBusinessData = {
  'agent-types': [
    {
      id: '1',
      name: 'PoSP',
      code: 'POSP',
      description: 'Point of Sales Person',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      category: 'agent-types'
    },
    {
      id: '2',
      name: 'MISP',
      code: 'MISP',
      description: 'Micro Insurance Sales Person',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      category: 'agent-types'
    },
    {
      id: '3',
      name: 'Agent',
      code: 'AGENT',
      description: 'General Insurance Agent',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      category: 'agent-types'
    },
    {
      id: '4',
      name: 'PoSP – Motor',
      code: 'POSP_MOTOR',
      description: 'Point of Sales Person - Motor Insurance',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      category: 'agent-types'
    },
    {
      id: '5',
      name: 'PoSP – Health',
      code: 'POSP_HEALTH',
      description: 'Point of Sales Person - Health Insurance',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      category: 'agent-types'
    },
    {
      id: '6',
      name: 'PoSP – Life',
      code: 'POSP_LIFE',
      description: 'Point of Sales Person - Life Insurance',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      category: 'agent-types'
    }
  ],
  'policy-types': [
    {
      id: '7',
      name: 'Life Insurance',
      code: 'LIFE',
      description: 'Life insurance policies',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      category: 'policy-types'
    },
    {
      id: '8',
      name: 'Health Insurance',
      code: 'HEALTH',
      description: 'Health insurance policies',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      category: 'policy-types'
    },
    {
      id: '9',
      name: 'Motor Insurance',
      code: 'MOTOR',
      description: 'Motor vehicle insurance policies',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      category: 'policy-types'
    },
    {
      id: '10',
      name: 'General Insurance',
      code: 'GENERAL',
      description: 'General insurance policies',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      category: 'policy-types'
    }
  ],
  'user-types': [
    {
      id: '11',
      name: 'Admin',
      code: 'ADMIN',
      description: 'System Administrator',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      category: 'user-types'
    },
    {
      id: '12',
      name: 'Manager',
      code: 'MANAGER',
      description: 'Branch Manager',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      category: 'user-types'
    },
    {
      id: '13',
      name: 'Agent',
      code: 'AGENT',
      description: 'Insurance Agent',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      category: 'user-types'
    },
    {
      id: '14',
      name: 'Customer',
      code: 'CUSTOMER',
      description: 'End Customer',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      category: 'user-types'
    }
  ],
  'regions': [
    {
      id: '15',
      name: 'North',
      code: 'NORTH',
      description: 'Northern Region',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      category: 'regions'
    },
    {
      id: '16',
      name: 'South',
      code: 'SOUTH',
      description: 'Southern Region',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      category: 'regions'
    },
    {
      id: '17',
      name: 'East',
      code: 'EAST',
      description: 'Eastern Region',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      category: 'regions'
    },
    {
      id: '18',
      name: 'West',
      code: 'WEST',
      description: 'Western Region',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      category: 'regions'
    }
  ],
  'departments': [
    {
      id: '19',
      name: 'Sales',
      code: 'SALES',
      description: 'Sales Department',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      category: 'departments'
    },
    {
      id: '20',
      name: 'Operations',
      code: 'OPS',
      description: 'Operations Department',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      category: 'departments'
    },
    {
      id: '21',
      name: 'Claims',
      code: 'CLAIMS',
      description: 'Claims Department',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      category: 'departments'
    },
    {
      id: '22',
      name: 'HR',
      code: 'HR',
      description: 'Human Resources Department',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      category: 'departments'
    }
  ],
  'statuses': [
    {
      id: '23',
      name: 'Active',
      code: 'ACTIVE',
      description: 'Active status',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      category: 'statuses'
    },
    {
      id: '24',
      name: 'Inactive',
      code: 'INACTIVE',
      description: 'Inactive status',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      category: 'statuses'
    },
    {
      id: '25',
      name: 'Pending',
      code: 'PENDING',
      description: 'Pending status',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      category: 'statuses'
    },
    {
      id: '26',
      name: 'Completed',
      code: 'COMPLETED',
      description: 'Completed status',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      category: 'statuses'
    }
  ],
  'priorities': [
    {
      id: '27',
      name: 'Low',
      code: 'LOW',
      description: 'Low priority',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      category: 'priorities'
    },
    {
      id: '28',
      name: 'Medium',
      code: 'MEDIUM',
      description: 'Medium priority',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      category: 'priorities'
    },
    {
      id: '29',
      name: 'High',
      code: 'HIGH',
      description: 'High priority',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      category: 'priorities'
    },
    {
      id: '30',
      name: 'Critical',
      code: 'CRITICAL',
      description: 'Critical priority',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      category: 'priorities'
    }
  ]
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'agent-types'
    const search = searchParams.get('search')

    let data = mockBusinessData[type as keyof typeof mockBusinessData] || []

    if (search) {
      data = data.filter(item => 
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.code.toLowerCase().includes(search.toLowerCase()) ||
        item.description?.toLowerCase().includes(search.toLowerCase())
      )
    }

    return NextResponse.json({
      success: true,
      data,
      total: data.length
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch business data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, ...data } = body

    // Validate required fields
    if (!type || !data.name || !data.code) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create new business entity
    const newEntry = {
      id: Date.now().toString(),
      ...data,
      category: type,
      isActive: data.isActive !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // In a real application, save to database here
    console.log(`Creating new ${type}:`, newEntry)

    return NextResponse.json({
      success: true,
      data: newEntry,
      message: `${type} created successfully`
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create business entity' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, type, ...updateData } = body

    if (!id || !type) {
      return NextResponse.json(
        { success: false, error: 'ID and type are required' },
        { status: 400 }
      )
    }

    // Update business entity
    const updatedEntry = {
      ...updateData,
      id,
      updatedAt: new Date().toISOString()
    }

    // In a real application, update in database here
    console.log(`Updating ${type}:`, updatedEntry)

    return NextResponse.json({
      success: true,
      data: updatedEntry,
      message: `${type} updated successfully`
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update business entity' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const type = searchParams.get('type')

    if (!id || !type) {
      return NextResponse.json(
        { success: false, error: 'ID and type are required' },
        { status: 400 }
      )
    }

    // In a real application, delete from database here
    console.log(`Deleting ${type}:`, id)

    return NextResponse.json({
      success: true,
      message: `${type} deleted successfully`
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete business entity' },
      { status: 500 }
    )
  }
}








