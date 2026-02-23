'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  MagnifyingGlassIcon,
  DocumentDuplicateIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ArrowLeftIcon,
  UserIcon,
  CalendarIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface IssuedCertificate {
  id: string
  agentId: string
  agentName: string
  agentType: string
  examName: string
  policyType: string
  score: number
  percentage: number
  issuedDate: string
  expiryDate: string
  certificateNumber: string
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED'
  downloadCount: number
  lastDownloaded?: string
}

const AGENT_TYPES = [
  'PoSP', 'MISP', 'Agent', 'PoSP – Motor', 'PoSP – Health', 'PoSP – Life'
]

const POLICY_TYPES = [
  'Life Insurance', 'Term Life Insurance', 'Whole Life Insurance', 'Endowment Policy',
  'Motor Insurance', 'Health Insurance', 'Travel Insurance', 'Home Insurance',
  'Fire Insurance', 'Marine Insurance', 'Corporate Insurance', 'Group Insurance'
]

export default function IssuedCertificates() {
  const router = useRouter()
  const [certificates, setCertificates] = useState<IssuedCertificate[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterAgentType, setFilterAgentType] = useState('ALL')
  const [filterPolicyType, setFilterPolicyType] = useState('ALL')
  const [filterStatus, setFilterStatus] = useState('ALL')

  useEffect(() => {
    fetchCertificates()
  }, [])

  const fetchCertificates = async () => {
    try {
      setLoading(true)
      // Mock data - replace with actual API call
      const mockCertificates: IssuedCertificate[] = [
        {
          id: '1',
          agentId: 'AG001',
          agentName: 'John Smith',
          agentType: 'PoSP',
          examName: 'Life Insurance Fundamentals Exam',
          policyType: 'Life Insurance',
          score: 85,
          percentage: 85,
          issuedDate: '2024-01-15',
          expiryDate: '2025-01-15',
          certificateNumber: 'CERT-2024-001',
          status: 'ACTIVE',
          downloadCount: 3,
          lastDownloaded: '2024-01-20',
        },
        {
          id: '2',
          agentId: 'AG002',
          agentName: 'Sarah Johnson',
          agentType: 'MISP',
          examName: 'Motor Insurance Advanced Exam',
          policyType: 'Motor Insurance',
          score: 92,
          percentage: 92,
          issuedDate: '2024-01-10',
          expiryDate: '2025-01-10',
          certificateNumber: 'CERT-2024-002',
          status: 'ACTIVE',
          downloadCount: 1,
          lastDownloaded: '2024-01-10',
        },
        {
          id: '3',
          agentId: 'AG003',
          agentName: 'Mike Wilson',
          agentType: 'Agent',
          examName: 'Health Insurance Specialization Exam',
          policyType: 'Health Insurance',
          score: 78,
          percentage: 78,
          issuedDate: '2023-12-20',
          expiryDate: '2024-12-20',
          certificateNumber: 'CERT-2023-156',
          status: 'EXPIRED',
          downloadCount: 2,
          lastDownloaded: '2024-01-05',
        },
        {
          id: '4',
          agentId: 'AG004',
          agentName: 'Emily Davis',
          agentType: 'PoSP – Health',
          examName: 'Health Insurance Basics Exam',
          policyType: 'Health Insurance',
          score: 88,
          percentage: 88,
          issuedDate: '2024-01-05',
          expiryDate: '2025-01-05',
          certificateNumber: 'CERT-2024-003',
          status: 'ACTIVE',
          downloadCount: 0,
        },
      ]

      // Apply filters
      let filteredCertificates = mockCertificates
      if (searchTerm) {
        filteredCertificates = filteredCertificates.filter(
          (cert) =>
            cert.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cert.agentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cert.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cert.examName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }
      if (filterAgentType !== 'ALL') {
        filteredCertificates = filteredCertificates.filter((cert) => cert.agentType === filterAgentType)
      }
      if (filterPolicyType !== 'ALL') {
        filteredCertificates = filteredCertificates.filter((cert) => cert.policyType === filterPolicyType)
      }
      if (filterStatus !== 'ALL') {
        filteredCertificates = filteredCertificates.filter((cert) => cert.status === filterStatus)
      }

      setCertificates(filteredCertificates)
    } catch (error) {
      console.error('Error fetching certificates:', error)
      toast.error('Failed to fetch certificates')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (certificate: IssuedCertificate) => {
    try {
      // Generate certificate HTML content
      const certificateHTML = generateCertificateHTML(certificate)
      
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
      
      toast.success(`Certificate ${certificate.certificateNumber} is ready for download`)
      
      // Update download count
      setCertificates(certificates.map(cert => 
        cert.id === certificate.id 
          ? { 
              ...cert, 
              downloadCount: cert.downloadCount + 1,
              lastDownloaded: new Date().toISOString().split('T')[0]
            }
          : cert
      ))
    } catch (error) {
      console.error('Error downloading certificate:', error)
      toast.error('Failed to download certificate')
    }
  }

  const generateCertificateHTML = (certificate: IssuedCertificate) => {
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

  const handleRevoke = async (certificate: IssuedCertificate) => {
    if (window.confirm(`Are you sure you want to revoke certificate ${certificate.certificateNumber}?`)) {
      try {
        setCertificates(certificates.map(cert => 
          cert.id === certificate.id 
            ? { ...cert, status: 'REVOKED' as const }
            : cert
        ))
        toast.success('Certificate revoked successfully')
      } catch (error) {
        console.error('Error revoking certificate:', error)
        toast.error('Failed to revoke certificate')
      }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800'
      case 'EXPIRED':
        return 'bg-red-100 text-red-800'
      case 'REVOKED':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="mb-6">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            <li>
              <button onClick={() => router.push('/dashboard')} className="text-gray-400 hover:text-gray-500">
                Dashboard
              </button>
            </li>
            <li>
              <div className="flex items-center">
                <span className="text-gray-400">/</span>
                <button onClick={() => router.push('/dashboard/lms')} className="ml-4 text-gray-400 hover:text-gray-500">
                  LMS Training
                </button>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="text-gray-400">/</span>
                <span className="ml-4 text-gray-900 font-medium">Users' issued Certificate</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      {/* Page header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/dashboard/lms-masters')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Users' issued Certificate</h1>
            <p className="mt-1 text-sm text-gray-600">
              View and manage all certificates issued to users after successful exam completion.
            </p>
          </div>
        </div>
      </div>

      {/* Search and filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search certificates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterAgentType}
              onChange={(e) => setFilterAgentType(e.target.value)}
              className="input"
            >
              <option value="ALL">All Agent Types</option>
              {AGENT_TYPES.map((agentType) => (
                <option key={agentType} value={agentType}>
                  {agentType}
                </option>
              ))}
            </select>
            <select
              value={filterPolicyType}
              onChange={(e) => setFilterPolicyType(e.target.value)}
              className="input"
            >
              <option value="ALL">All Policy Types</option>
              {POLICY_TYPES.map((policyType) => (
                <option key={policyType} value={policyType}>
                  {policyType}
                </option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="EXPIRED">Expired</option>
              <option value="REVOKED">Revoked</option>
            </select>
          </div>
        </div>
      </div>

      {/* Certificates Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-head">Certificate</th>
                <th className="table-head">Agent</th>
                <th className="table-head">Exam Details</th>
                <th className="table-head">Score</th>
                <th className="table-head">Validity</th>
                <th className="table-head">Status</th>
                <th className="table-head">Downloads</th>
                <th className="table-head">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {certificates.length === 0 ? (
                <tr>
                  <td colSpan={8} className="table-cell text-center py-8 text-gray-500">
                    No certificates found
                  </td>
                </tr>
              ) : (
                certificates.map((certificate) => (
                  <tr key={certificate.id} className="table-row">
                    <td className="table-cell">
                      <div className="flex items-center">
                        <DocumentDuplicateIcon className="h-5 w-5 text-blue-500 mr-2" />
                        <div>
                          <div className="font-medium">{certificate.certificateNumber}</div>
                          <div className="text-sm text-gray-500">
                            Issued: {formatDate(certificate.issuedDate)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center">
                        <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <div className="font-medium">{certificate.agentName}</div>
                          <div className="text-sm text-gray-500">
                            {certificate.agentId} • {certificate.agentType}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div>
                        <div className="font-medium">{certificate.examName}</div>
                        <div className="text-sm text-gray-500">{certificate.policyType}</div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="text-center">
                        <div className="font-medium">{certificate.score}/100</div>
                        <div className="text-sm text-gray-500">{certificate.percentage}%</div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="text-sm">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 text-gray-400 mr-1" />
                          {formatDate(certificate.expiryDate)}
                        </div>
                        {certificate.lastDownloaded && (
                          <div className="text-gray-500 mt-1">
                            Last: {formatDate(certificate.lastDownloaded)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(certificate.status)}`}>
                        {certificate.status}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="text-center">
                        <div className="font-medium">{certificate.downloadCount}</div>
                        <div className="text-sm text-gray-500">times</div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => router.push(`/dashboard/lms/issued-certificates/preview/${certificate.id}`)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Preview"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDownload(certificate)}
                          className="text-green-600 hover:text-green-900"
                          title="Download"
                          disabled={certificate.status !== 'ACTIVE'}
                        >
                          <ArrowDownTrayIcon className="h-4 w-4" />
                        </button>
                        {certificate.status === 'ACTIVE' && (
                          <button
                            onClick={() => handleRevoke(certificate)}
                            className="text-red-600 hover:text-red-900"
                            title="Revoke"
                          >
                            <CheckCircleIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DocumentDuplicateIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Certificates</p>
              <p className="text-2xl font-semibold text-gray-900">{certificates.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Certificates</p>
              <p className="text-2xl font-semibold text-gray-900">
                {certificates.filter(c => c.status === 'ACTIVE').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ArrowDownTrayIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Downloads</p>
              <p className="text-2xl font-semibold text-gray-900">
                {certificates.reduce((sum, c) => sum + c.downloadCount, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserIcon className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Unique Agents</p>
              <p className="text-2xl font-semibold text-gray-900">
                {new Set(certificates.map(c => c.agentId)).size}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}











