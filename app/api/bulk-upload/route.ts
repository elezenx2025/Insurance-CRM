import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    if (!type) {
      return NextResponse.json(
        { success: false, error: 'No type specified' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['.xlsx', '.xls', '.csv']
    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    if (!allowedTypes.includes(`.${fileExtension}`)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only Excel and CSV files are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds 10MB limit' },
        { status: 400 }
      )
    }

    // Process the file based on type
    const result = await processBulkUpload(file, type)

    return NextResponse.json({
      success: true,
      message: `${type} bulk upload completed successfully`,
      data: result
    })
  } catch (error) {
    console.error('Bulk upload error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process bulk upload' },
      { status: 500 }
    )
  }
}

async function processBulkUpload(file: File, type: string) {
  // Simulate file processing
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Mock processing results based on type
  const mockResults = {
    policies: {
      recordsProcessed: 150,
      recordsSuccessful: 148,
      recordsFailed: 2,
      errors: [
        'Row 45: Invalid policy number format',
        'Row 78: Missing required field'
      ]
    },
    claims: {
      recordsProcessed: 75,
      recordsSuccessful: 73,
      recordsFailed: 2,
      errors: [
        'Row 23: Invalid claim number format',
        'Row 45: Missing required field'
      ]
    },
    customers: {
      recordsProcessed: 200,
      recordsSuccessful: 195,
      recordsFailed: 5,
      errors: [
        'Row 12: Invalid email format',
        'Row 45: Missing required field',
        'Row 78: Duplicate customer'
      ]
    },
    leads: {
      recordsProcessed: 300,
      recordsSuccessful: 285,
      recordsFailed: 15,
      errors: [
        'Row 12: Invalid phone number format',
        'Row 45: Missing required field',
        'Row 78: Duplicate lead'
      ]
    }
  }

  return mockResults[type as keyof typeof mockResults] || {
    recordsProcessed: 0,
    recordsSuccessful: 0,
    recordsFailed: 0,
    errors: []
  }
}








