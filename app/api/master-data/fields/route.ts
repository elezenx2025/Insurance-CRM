import { NextRequest, NextResponse } from 'next/server'

// Mock data for demonstration
const mockFields = [
  {
    id: '1',
    name: 'customer_type',
    displayName: 'Customer Type',
    type: 'dropdown',
    category: 'customer',
    isRequired: true,
    isActive: true,
    sortOrder: 1,
    description: 'Type of customer - Individual or Corporate',
    validation: '{"required": true, "options": ["Individual", "Corporate"]}',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    options: [
      { id: '1', value: 'individual', label: 'Individual', sortOrder: 1, isActive: true },
      { id: '2', value: 'corporate', label: 'Corporate', sortOrder: 2, isActive: true }
    ]
  },
  {
    id: '2',
    name: 'agent_status',
    displayName: 'Agent Status',
    type: 'dropdown',
    category: 'agent',
    isRequired: true,
    isActive: true,
    sortOrder: 2,
    description: 'Current status of the agent',
    validation: '{"required": true, "options": ["Active", "Inactive", "Suspended", "Terminated"]}',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    options: [
      { id: '3', value: 'active', label: 'Active', sortOrder: 1, isActive: true },
      { id: '4', value: 'inactive', label: 'Inactive', sortOrder: 2, isActive: true },
      { id: '5', value: 'suspended', label: 'Suspended', sortOrder: 3, isActive: true },
      { id: '6', value: 'terminated', label: 'Terminated', sortOrder: 4, isActive: true }
    ]
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const type = searchParams.get('type')
    const search = searchParams.get('search')

    let filteredFields = mockFields

    if (category && category !== 'all') {
      filteredFields = filteredFields.filter(field => field.category === category)
    }

    if (type && type !== 'all') {
      filteredFields = filteredFields.filter(field => field.type === type)
    }

    if (search) {
      filteredFields = filteredFields.filter(field => 
        field.name.toLowerCase().includes(search.toLowerCase()) ||
        field.displayName.toLowerCase().includes(search.toLowerCase()) ||
        field.description?.toLowerCase().includes(search.toLowerCase())
      )
    }

    return NextResponse.json({
      success: true,
      data: filteredFields,
      total: filteredFields.length
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch fields' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.displayName || !body.type || !body.category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create new field
    const newField = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // In a real application, save to database here
    console.log('Creating new field:', newField)

    return NextResponse.json({
      success: true,
      data: newField,
      message: 'Field created successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create field' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Field ID is required' },
        { status: 400 }
      )
    }

    // Update field
    const updatedField = {
      ...updateData,
      id,
      updatedAt: new Date().toISOString()
    }

    // In a real application, update in database here
    console.log('Updating field:', updatedField)

    return NextResponse.json({
      success: true,
      data: updatedField,
      message: 'Field updated successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update field' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Field ID is required' },
        { status: 400 }
      )
    }

    // In a real application, delete from database here
    console.log('Deleting field:', id)

    return NextResponse.json({
      success: true,
      message: 'Field deleted successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete field' },
      { status: 500 }
    )
  }
}








