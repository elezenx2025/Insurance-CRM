import { NextRequest, NextResponse } from 'next/server'

// Mock document data
const mockDocuments = [
  {
    id: '1',
    name: 'Policy Document - POL001.pdf',
    type: 'application/pdf',
    size: 1024000,
    uploadedAt: '2024-01-15T10:30:00Z',
    url: '/documents/policy-pol001.pdf',
    category: 'Policy'
  },
  {
    id: '2',
    name: 'KYC Document - KYC001.pdf',
    type: 'application/pdf',
    size: 2048000,
    uploadedAt: '2024-01-14T14:20:00Z',
    url: '/documents/kyc-kyc001.pdf',
    category: 'KYC'
  },
  {
    id: '3',
    name: 'Claim Document - CLM001.pdf',
    type: 'application/pdf',
    size: 1536000,
    uploadedAt: '2024-01-13T09:15:00Z',
    url: '/documents/claim-clm001.pdf',
    category: 'Claim'
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    let documents = mockDocuments

    if (category && category !== 'all') {
      documents = documents.filter(doc => doc.category.toLowerCase() === category.toLowerCase())
    }

    if (search) {
      documents = documents.filter(doc => 
        doc.name.toLowerCase().includes(search.toLowerCase())
      )
    }

    return NextResponse.json({
      success: true,
      data: documents,
      total: documents.length
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch documents' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const category = formData.get('category') as string

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'No category specified' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx']
    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    if (!allowedTypes.includes(`.${fileExtension}`)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only PDF, images, and documents are allowed.' },
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

    // Create new document entry
    const newDocument = {
      id: Date.now().toString(),
      name: file.name,
      type: file.type,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      url: `/documents/${category.toLowerCase()}-${Date.now()}.${fileExtension}`,
      category: category
    }

    // In a real application, save the file and document metadata to database
    console.log('Document uploaded:', newDocument)

    return NextResponse.json({
      success: true,
      data: newDocument,
      message: 'Document uploaded successfully'
    })
  } catch (error) {
    console.error('Document upload error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to upload document' },
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
        { success: false, error: 'Document ID is required' },
        { status: 400 }
      )
    }

    // In a real application, delete the file and document metadata from database
    console.log('Document deleted:', id)

    return NextResponse.json({
      success: true,
      message: 'Document deleted successfully'
    })
  } catch (error) {
    console.error('Document deletion error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete document' },
      { status: 500 }
    )
  }
}








