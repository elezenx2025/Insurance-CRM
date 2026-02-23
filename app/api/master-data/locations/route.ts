import { NextRequest, NextResponse } from 'next/server'

// Mock data for demonstration
const mockCountries = [
  {
    id: '1',
    name: 'India',
    code: 'IN',
    phoneCode: '+91',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    states: [
      {
        id: '1',
        countryId: '1',
        name: 'Maharashtra',
        code: 'MH',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        cities: [
          {
            id: '1',
            stateId: '1',
            name: 'Mumbai',
            isActive: true,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
            pincodes: [
              { id: '1', cityId: '1', code: '400001', isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
              { id: '2', cityId: '1', code: '400002', isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' }
            ]
          },
          {
            id: '2',
            stateId: '1',
            name: 'Pune',
            isActive: true,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
            pincodes: [
              { id: '3', cityId: '2', code: '411001', isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
              { id: '4', cityId: '2', code: '411002', isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' }
            ]
          }
        ]
      },
      {
        id: '2',
        countryId: '1',
        name: 'Karnataka',
        code: 'KA',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        cities: [
          {
            id: '3',
            stateId: '2',
            name: 'Bangalore',
            isActive: true,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
            pincodes: [
              { id: '5', cityId: '3', code: '560001', isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
              { id: '6', cityId: '3', code: '560002', isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'United States',
    code: 'US',
    phoneCode: '+1',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'countries'
    const countryId = searchParams.get('countryId')
    const stateId = searchParams.get('stateId')
    const search = searchParams.get('search')

    let data: any[] = []

    switch (type) {
      case 'countries':
        data = mockCountries
        break
      case 'states':
        if (countryId) {
          const country = mockCountries.find(c => c.id === countryId)
          data = country?.states || []
        } else {
          data = mockCountries.flatMap(c => c.states || [])
        }
        break
      case 'cities':
        if (stateId) {
          const state = mockCountries.flatMap(c => c.states || []).find(s => s.id === stateId)
          data = state?.cities || []
        } else {
          data = mockCountries.flatMap(c => c.states?.flatMap(s => s.cities || []) || [])
        }
        break
      case 'pincodes':
        if (stateId) {
          const state = mockCountries.flatMap(c => c.states || []).find(s => s.id === stateId)
          data = state?.cities?.flatMap(c => c.pincodes || []) || []
        } else {
          data = mockCountries.flatMap(c => 
            c.states?.flatMap(s => 
              s.cities?.flatMap(city => city.pincodes || []) || []
            ) || []
          )
        }
        break
    }

    if (search) {
      data = data.filter(item => 
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.code?.toLowerCase().includes(search.toLowerCase())
      )
    }

    return NextResponse.json({
      success: true,
      data,
      total: data.length
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch location data' },
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

    // Create new location entry
    const newEntry = {
      id: Date.now().toString(),
      ...data,
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
      { success: false, error: 'Failed to create location entry' },
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

    // Update location entry
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
      { success: false, error: 'Failed to update location entry' },
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
      { success: false, error: 'Failed to delete location entry' },
      { status: 500 }
    )
  }
}








