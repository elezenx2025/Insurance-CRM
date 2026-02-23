import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    // Mock reports data - in real implementation, fetch from database
    const mockReports = [
      {
        id: '1',
        title: 'Monthly Sales Report',
        type: 'Sales',
        description: 'Comprehensive monthly sales performance analysis',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            {
              label: 'Sales',
              data: [12000, 19000, 3000, 5000, 2000, 3000],
              backgroundColor: 'rgba(59, 130, 246, 0.5)',
            },
          ],
        },
        createdAt: '2024-01-20T10:30:00Z',
        user: {
          firstName: 'John',
          lastName: 'Doe',
        },
      },
      {
        id: '2',
        title: 'Customer Analytics Report',
        type: 'Customer',
        description: 'Customer behavior and engagement analysis',
        data: {
          labels: ['New', 'Active', 'Inactive', 'Churned'],
          datasets: [
            {
              label: 'Customers',
              data: [150, 300, 100, 50],
              backgroundColor: [
                'rgba(34, 197, 94, 0.5)',
                'rgba(59, 130, 246, 0.5)',
                'rgba(245, 158, 11, 0.5)',
                'rgba(239, 68, 68, 0.5)',
              ],
            },
          ],
        },
        createdAt: '2024-01-19T14:15:00Z',
        user: {
          firstName: 'Jane',
          lastName: 'Smith',
        },
      },
      {
        id: '3',
        title: 'Claims Processing Report',
        type: 'Claims',
        description: 'Claims processing efficiency and timeline analysis',
        data: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          datasets: [
            {
              label: 'Claims Processed',
              data: [45, 52, 38, 61],
              backgroundColor: 'rgba(168, 85, 247, 0.5)',
            },
          ],
        },
        createdAt: '2024-01-18T16:20:00Z',
        user: {
          firstName: 'Mike',
          lastName: 'Johnson',
        },
      },
    ]

    return NextResponse.json(mockReports)
  } catch (error) {
    console.error('Error fetching reports:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, dateRange } = body

    // Generate report based on type and date range
    const reportData = generateReportData(type, dateRange)

    // In real implementation, save to database
    const newReport = {
      id: Date.now().toString(),
      title: `${type} Report - ${getDateRangeLabel(dateRange)}`,
      type: type,
      description: `Generated ${type.toLowerCase()} report for ${getDateRangeLabel(dateRange)}`,
      data: reportData,
      createdAt: new Date().toISOString(),
      user: {
        firstName: 'System',
        lastName: 'Generated',
      },
    }

    return NextResponse.json(newReport, { status: 201 })
  } catch (error) {
    console.error('Error generating report:', error)
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    )
  }
}

function generateReportData(type: string, dateRange: number) {
  const labels = generateLabels(dateRange)
  
  switch (type.toLowerCase()) {
    case 'sales':
      return {
        labels,
        datasets: [
          {
            label: 'Sales Revenue',
            data: generateRandomData(labels.length, 10000, 50000),
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 2,
          },
        ],
      }
    
    case 'customer':
      return {
        labels: ['New Customers', 'Active Customers', 'Inactive Customers', 'Churned Customers'],
        datasets: [
          {
            label: 'Customer Count',
            data: generateRandomData(4, 50, 500),
            backgroundColor: [
              'rgba(34, 197, 94, 0.5)',
              'rgba(59, 130, 246, 0.5)',
              'rgba(245, 158, 11, 0.5)',
              'rgba(239, 68, 68, 0.5)',
            ],
          },
        ],
      }
    
    case 'claims':
      return {
        labels,
        datasets: [
          {
            label: 'Claims Processed',
            data: generateRandomData(labels.length, 20, 100),
            backgroundColor: 'rgba(168, 85, 247, 0.5)',
            borderColor: 'rgba(168, 85, 247, 1)',
            borderWidth: 2,
          },
        ],
      }
    
    case 'policy':
      return {
        labels,
        datasets: [
          {
            label: 'Policies Issued',
            data: generateRandomData(labels.length, 100, 1000),
            backgroundColor: 'rgba(16, 185, 129, 0.5)',
            borderColor: 'rgba(16, 185, 129, 1)',
            borderWidth: 2,
          },
        ],
      }
    
    default:
      return {
        labels: ['Data Point 1', 'Data Point 2', 'Data Point 3', 'Data Point 4'],
        datasets: [
          {
            label: 'Default Data',
            data: [100, 200, 150, 300],
            backgroundColor: 'rgba(107, 114, 128, 0.5)',
          },
        ],
      }
  }
}

function generateLabels(dateRange: number): string[] {
  const now = new Date()
  const labels: string[] = []
  
  switch (dateRange) {
    case 7: // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(date.getDate() - i)
        labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }))
      }
      break
    
    case 30: // Last 30 days
      for (let i = 29; i >= 0; i -= 5) {
        const date = new Date(now)
        date.setDate(date.getDate() - i)
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
      }
      break
    
    case 90: // Last 3 months
      for (let i = 2; i >= 0; i--) {
        const date = new Date(now)
        date.setMonth(date.getMonth() - i)
        labels.push(date.toLocaleDateString('en-US', { month: 'long' }))
      }
      break
    
    case 365: // Last year
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now)
        date.setMonth(date.getMonth() - i)
        labels.push(date.toLocaleDateString('en-US', { month: 'short' }))
      }
      break
    
    default:
      labels.push('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun')
  }
  
  return labels
}

function generateRandomData(count: number, min: number, max: number): number[] {
  return Array.from({ length: count }, () => 
    Math.floor(Math.random() * (max - min + 1)) + min
  )
}

function getDateRangeLabel(dateRange: number): string {
  switch (dateRange) {
    case 7:
      return 'Last 7 Days'
    case 30:
      return 'Last 30 Days'
    case 90:
      return 'Last 3 Months'
    case 365:
      return 'Last Year'
    default:
      return 'Custom Range'
  }
}










