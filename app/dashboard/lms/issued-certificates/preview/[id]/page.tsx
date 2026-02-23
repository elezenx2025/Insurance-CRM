'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon, ArrowDownTrayIcon, PrinterIcon, ShareIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

// Sample certificate data - in a real app, this would come from an API
const sampleCertificate = {
  id: 'CERT-001',
  agentId: 'AGENT-12345',
  agentName: 'Rajesh Kumar',
  agentType: 'PoSP',
  examName: 'Insurance Fundamentals Certification',
  policyType: 'Life Insurance',
  score: 85,
  percentage: 85,
  issuedDate: '2024-01-15',
  expiryDate: '2025-01-15',
  certificateNumber: 'CERT-2024-001234',
  status: 'ACTIVE',
  downloadCount: 3,
  lastDownloaded: '2024-12-15',
  issuer: 'Insurance Regulatory and Development Authority of India (IRDAI)',
  courseDuration: '40 hours',
  validityPeriod: '1 year',
  grade: 'A',
  institute: 'Insurance Training Institute',
  instructor: 'Dr. Priya Sharma',
  completionDate: '2024-01-10',
  examDate: '2024-01-12',
  totalQuestions: 100,
  correctAnswers: 85,
  passingScore: 70
}

type PageParams = { params: Promise<{ id: string }> }

export default function CertificatePreviewPage({ params }: PageParams) {
  const router = useRouter()
  const [resolvedParams, setResolvedParams] = React.useState<{ id: string } | null>(null)

  React.useEffect(() => {
    let isMounted = true
    params.then(value => {
      if (isMounted) {
        setResolvedParams(value)
      }
    })
    return () => {
      isMounted = false
    }
  }, [params])

  if (!resolvedParams) {
    return <div className="p-6">Loading certificate...</div>
  }

  const certificateId = resolvedParams.id

  const handleDownload = () => {
    try {
      // Generate certificate HTML content
      const certificateHTML = generateCertificateHTML(sampleCertificate)
      
      // Create a new window for printing/downloading
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(certificateHTML)
        printWindow.document.close()
        
        // Wait for content to load, then trigger print dialog
        printWindow.onload = () => {
          printWindow.print()
          // Close the window after printing
          setTimeout(() => {
            printWindow.close()
          }, 1000)
        }
      }
      
      toast.success(`Certificate ${sampleCertificate.certificateNumber} is ready for download`)
    } catch (error) {
      console.error('Error downloading certificate:', error)
      toast.error('Failed to download certificate')
    }
  }

  const generateCertificateHTML = (certificate: any) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Certificate - ${certificate.certificateNumber}</title>
        <style>
          @page {
            size: A4;
            margin: 0.5in;
          }
          body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 20px;
            background: white;
            color: #333;
          }
          .certificate {
            border: 3px solid #2563eb;
            border-radius: 10px;
            padding: 40px;
            text-align: center;
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            min-height: 80vh;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          .header {
            margin-bottom: 30px;
          }
          .logo {
            width: 80px;
            height: 80px;
            background: #2563eb;
            border-radius: 50%;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
            font-weight: bold;
          }
          .title {
            font-size: 32px;
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 10px;
          }
          .subtitle {
            font-size: 18px;
            color: #64748b;
            margin-bottom: 40px;
          }
          .content {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          .certificate-text {
            font-size: 20px;
            margin-bottom: 20px;
            color: #374151;
          }
          .agent-name {
            font-size: 28px;
            font-weight: bold;
            color: #2563eb;
            margin: 20px 0;
          }
          .course-info {
            font-size: 18px;
            color: #374151;
            margin: 20px 0;
          }
          .details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 30px 0;
            text-align: left;
          }
          .detail-item {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e5e7eb;
          }
          .detail-label {
            font-weight: bold;
            color: #374151;
          }
          .detail-value {
            color: #6b7280;
          }
          .footer {
            margin-top: 40px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
          }
          .signature {
            text-align: center;
          }
          .signature-line {
            border-top: 2px solid #374151;
            width: 200px;
            margin: 10px auto;
          }
          .status {
            display: inline-block;
            padding: 8px 16px;
            background: #10b981;
            color: white;
            border-radius: 20px;
            font-size: 14px;
            font-weight: bold;
            margin-top: 20px;
          }
          @media print {
            body { margin: 0; }
            .certificate { border: none; box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="header">
            <div class="logo">✓</div>
            <h1 class="title">Certificate of Completion</h1>
            <p class="subtitle">Insurance Training Program</p>
          </div>
          
          <div class="content">
            <p class="certificate-text">This is to certify that</p>
            <h2 class="agent-name">${certificate.agentName}</h2>
            <p class="certificate-text">has successfully completed the course</p>
            <h3 class="course-info">${certificate.examName}</h3>
            <p class="certificate-text">for ${certificate.policyType}</p>
            
            <div class="details">
              <div class="detail-item">
                <span class="detail-label">Certificate Number:</span>
                <span class="detail-value">${certificate.certificateNumber}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Score:</span>
                <span class="detail-value">${certificate.score}/100</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Percentage:</span>
                <span class="detail-value">${certificate.percentage}%</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Issued Date:</span>
                <span class="detail-value">${certificate.issuedDate}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Expiry Date:</span>
                <span class="detail-value">${certificate.expiryDate}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Agent Type:</span>
                <span class="detail-value">${certificate.agentType}</span>
              </div>
            </div>
            
            <div class="status">Certificate is Valid and Active</div>
          </div>
          
          <div class="footer">
            <div class="signature">
              <p><strong>Instructor</strong></p>
              <div class="signature-line"></div>
              <p>Dr. Priya Sharma</p>
              <p>Insurance Training Institute</p>
            </div>
            <div class="signature">
              <p><strong>Issued By</strong></p>
              <div class="signature-line"></div>
              <p>Insurance Regulatory and Development Authority of India (IRDAI)</p>
              <p>Date: ${certificate.issuedDate}</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  }

  const handlePrint = () => {
    window.print()
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Insurance Certificate',
        text: `Certificate for ${sampleCertificate.agentName}`,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Certificate link copied to clipboard')
    }
  }

  const handleBack = () => {
    router.push('/dashboard/lms/issued-certificates')
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Certificates
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Certificate Preview</h1>
            <p className="text-gray-600">View and download certificate</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleDownload}
            className="flex items-center px-4 py-2 text-sm font-medium text-green-600 bg-green-50 border border-green-200 rounded-md hover:bg-green-100"
          >
            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            Download
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100"
          >
            <PrinterIcon className="h-4 w-4 mr-2" />
            Print
          </button>
          <button
            onClick={handleShare}
            className="flex items-center px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded-md hover:bg-purple-100"
          >
            <ShareIcon className="h-4 w-4 mr-2" />
            Share
          </button>
        </div>
      </div>

      {/* Certificate Preview */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border-2 border-gray-200 rounded-lg shadow-lg p-8 print:shadow-none print:border-0">
          {/* Certificate Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Certificate of Completion</h1>
            <p className="text-lg text-gray-600">Insurance Training Program</p>
          </div>

          {/* Certificate Content */}
          <div className="text-center mb-8">
            <p className="text-lg text-gray-700 mb-4">
              This is to certify that
            </p>
            <h2 className="text-2xl font-bold text-blue-600 mb-4">
              {sampleCertificate.agentName}
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              has successfully completed the course
            </p>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {sampleCertificate.examName}
            </h3>
            <p className="text-lg text-gray-700 mb-6">
              for {sampleCertificate.policyType}
            </p>
          </div>

          {/* Certificate Details */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">Certificate Number:</span>
                <span className="text-gray-900">{sampleCertificate.certificateNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">Score:</span>
                <span className="text-gray-900">{sampleCertificate.score}/{sampleCertificate.totalQuestions}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">Percentage:</span>
                <span className="text-gray-900">{sampleCertificate.percentage}%</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">Grade:</span>
                <span className="text-gray-900">{sampleCertificate.grade}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">Issued Date:</span>
                <span className="text-gray-900">{sampleCertificate.issuedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">Expiry Date:</span>
                <span className="text-gray-900">{sampleCertificate.expiryDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">Course Duration:</span>
                <span className="text-gray-900">{sampleCertificate.courseDuration}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">Validity Period:</span>
                <span className="text-gray-900">{sampleCertificate.validityPeriod}</span>
              </div>
            </div>
          </div>

          {/* Certificate Footer */}
          <div className="border-t border-gray-200 pt-6">
            <div className="grid grid-cols-2 gap-8">
              <div className="text-center">
                <div className="border-b border-gray-300 pb-2 mb-2">
                  <p className="font-semibold text-gray-700">Instructor</p>
                </div>
                <p className="text-gray-900">{sampleCertificate.instructor}</p>
                <p className="text-sm text-gray-600">{sampleCertificate.institute}</p>
              </div>
              <div className="text-center">
                <div className="border-b border-gray-300 pb-2 mb-2">
                  <p className="font-semibold text-gray-700">Issued By</p>
                </div>
                <p className="text-gray-900">{sampleCertificate.issuer}</p>
                <p className="text-sm text-gray-600">Date: {sampleCertificate.issuedDate}</p>
              </div>
            </div>
          </div>

          {/* Certificate Status */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Certificate is Valid and Active
            </div>
          </div>
        </div>

        {/* Certificate Information */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Certificate Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Agent ID</label>
              <p className="mt-1 text-sm text-gray-900">{sampleCertificate.agentId}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Agent Type</label>
              <p className="mt-1 text-sm text-gray-900">{sampleCertificate.agentType}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Exam Date</label>
              <p className="mt-1 text-sm text-gray-900">{sampleCertificate.examDate}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Completion Date</label>
              <p className="mt-1 text-sm text-gray-900">{sampleCertificate.completionDate}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Correct Answers</label>
              <p className="mt-1 text-sm text-gray-900">{sampleCertificate.correctAnswers}/{sampleCertificate.totalQuestions}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Passing Score</label>
              <p className="mt-1 text-sm text-gray-900">{sampleCertificate.passingScore}%</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Download Count</label>
              <p className="mt-1 text-sm text-gray-900">{sampleCertificate.downloadCount} times</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Downloaded</label>
              <p className="mt-1 text-sm text-gray-900">{sampleCertificate.lastDownloaded}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
