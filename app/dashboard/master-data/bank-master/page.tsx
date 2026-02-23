'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  BuildingLibraryIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const bankSchema = z.object({
  bankId: z.string().min(1, 'Bank ID is required'),
  name: z.string().min(1, 'Bank name is required'),
  code: z.string().min(1, 'Bank code is required'),
  ifscCode: z.string().optional(),
  micrCode: z.string().optional(),
  swiftCode: z.string().optional(),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  pincode: z.string().min(1, 'Pincode is required'),
  country: z.string().min(1, 'Country is required'),
  phone: z.string().optional(),
  email: z.string().email('Invalid email address').optional(),
  website: z.string().url('Invalid website URL').optional(),
  isActive: z.boolean().default(true),
})

type BankForm = z.infer<typeof bankSchema>

interface Bank {
  id: string
  bankId: string
  name: string
  code: string
  ifscCode?: string
  micrCode?: string
  swiftCode?: string
  address: string
  city: string
  state: string
  pincode: string
  country: string
  phone?: string
  email?: string
  website?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function BankMaster() {
  const [banks, setBanks] = useState<Bank[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingBank, setEditingBank] = useState<Bank | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('ALL')

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bankSchema),
    defaultValues: {
      isActive: true,
    },
  })

  useEffect(() => {
    fetchBanks()
  }, [])

  const fetchBanks = async () => {
    try {
      setLoading(true)
      // Mock data - replace with actual API call
      const mockBanks: Bank[] = [
        // India Banks
        {
          id: '1',
          bankId: 'BANK001',
          name: 'State Bank of India',
          code: 'SBI',
          ifscCode: 'SBIN0000001',
          micrCode: '400002001',
          swiftCode: 'SBININBBXXX',
          address: 'State Bank Bhavan, Madame Cama Road',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400021',
          country: 'India',
          phone: '+91-22-22029456',
          email: 'customercare@sbi.co.in',
          website: 'https://www.sbi.co.in',
          isActive: true,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
        {
          id: '2',
          bankId: 'BANK002',
          name: 'HDFC Bank',
          code: 'HDFC',
          ifscCode: 'HDFC0000001',
          micrCode: '400240001',
          swiftCode: 'HDFCINBBXXX',
          address: 'HDFC Bank House, Senapati Bapat Marg',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400013',
          country: 'India',
          phone: '+91-22-66521000',
          email: 'support@hdfcbank.com',
          website: 'https://www.hdfcbank.com',
          isActive: true,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
        {
          id: '3',
          bankId: 'BANK003',
          name: 'ICICI Bank',
          code: 'ICICI',
          ifscCode: 'ICIC0000001',
          micrCode: '400229001',
          swiftCode: 'ICICINBBXXX',
          address: 'ICICI Bank Towers, Bandra Kurla Complex',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400051',
          country: 'India',
          phone: '+91-22-26568181',
          email: 'customerservice@icicibank.com',
          website: 'https://www.icicibank.com',
          isActive: true,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
        {
          id: '4',
          bankId: 'BANK004',
          name: 'Axis Bank',
          code: 'AXIS',
          ifscCode: 'UTIB0000001',
          micrCode: '400211001',
          swiftCode: 'AXISINBBXXX',
          address: 'Axis Bank House, Wadia International Centre',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400025',
          country: 'India',
          phone: '+91-22-2425-2525',
          email: 'customerservice@axisbank.com',
          website: 'https://www.axisbank.com',
          isActive: true,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
        {
          id: '5',
          bankId: 'BANK005',
          name: 'Kotak Mahindra Bank',
          code: 'KOTAK',
          ifscCode: 'KKBK0000001',
          micrCode: '400485001',
          swiftCode: 'KKBKINBBXXX',
          address: 'Kotak Mahindra Bank Building, BKC',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400051',
          country: 'India',
          phone: '+91-22-66056825',
          email: 'service@kotak.com',
          website: 'https://www.kotak.com',
          isActive: true,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
        {
          id: '6',
          bankId: 'BANK006',
          name: 'Punjab National Bank',
          code: 'PNB',
          ifscCode: 'PUNB0000001',
          micrCode: '110024001',
          swiftCode: 'PUNBINBBXXX',
          address: '7, Bhikaiji Cama Place',
          city: 'New Delhi',
          state: 'Delhi',
          pincode: '110066',
          country: 'India',
          phone: '+91-11-2616-6666',
          email: 'customercare@pnb.co.in',
          website: 'https://www.pnbindia.in',
          isActive: true,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
        {
          id: '7',
          bankId: 'BANK007',
          name: 'Bank of Baroda',
          code: 'BOB',
          ifscCode: 'BARB0ROHANA',
          micrCode: '110012001',
          swiftCode: 'BARBINBBXXX',
          address: 'Baroda Corporate Centre, C-26, G-Block',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400051',
          country: 'India',
          phone: '+91-22-6698-5000',
          email: 'customercare@bankofbaroda.com',
          website: 'https://www.bankofbaroda.in',
          isActive: true,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
        {
          id: '8',
          bankId: 'BANK008',
          name: 'Canara Bank',
          code: 'CANARA',
          ifscCode: 'CNRB0000001',
          micrCode: '560015001',
          swiftCode: 'CNRBINBBXXX',
          address: 'Canara Bank Building, 112, J C Road',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560002',
          country: 'India',
          phone: '+91-80-2222-2222',
          email: 'customercare@canarabank.com',
          website: 'https://www.canarabank.com',
          isActive: true,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
        {
          id: '9',
          bankId: 'BANK009',
          name: 'Union Bank of India',
          code: 'UBI',
          ifscCode: 'UBIN0000001',
          micrCode: '400026001',
          swiftCode: 'UBININBBXXX',
          address: 'Union Bank Bhavan, 239, Vidhan Bhavan Marg',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          country: 'India',
          phone: '+91-22-2289-2000',
          email: 'customercare@unionbankofindia.com',
          website: 'https://www.unionbankofindia.co.in',
          isActive: true,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
        {
          id: '10',
          bankId: 'BANK010',
          name: 'Bank of India',
          code: 'BOI',
          ifscCode: 'BKID0000001',
          micrCode: '400013001',
          swiftCode: 'BKIDINBBXXX',
          address: 'Bank of India Building, Star House',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          country: 'India',
          phone: '+91-22-2266-1919',
          email: 'customercare@bankofindia.co.in',
          website: 'https://www.bankofindia.co.in',
          isActive: true,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
        {
          id: '11',
          bankId: 'BANK011',
          name: 'IndusInd Bank',
          code: 'INDUSIND',
          ifscCode: 'INDB0000001',
          micrCode: '400064001',
          swiftCode: 'INDBINBBXXX',
          address: '2401, Gen Thimmayya Road',
          city: 'Pune',
          state: 'Maharashtra',
          pincode: '411001',
          country: 'India',
          phone: '+91-20-26161000',
          email: 'customer.care@indusind.com',
          website: 'https://www.indusind.com',
          isActive: true,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
        {
          id: '12',
          bankId: 'BANK012',
          name: 'Yes Bank',
          code: 'YES',
          ifscCode: 'YESB0000001',
          micrCode: '400532001',
          swiftCode: 'YESBINBBXXX',
          address: 'YES BANK Tower, Indiabulls Finance Centre',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400013',
          country: 'India',
          phone: '+91-22-33476543',
          email: 'customercare@yesbank.in',
          website: 'https://www.yesbank.in',
          isActive: true,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
        
        // USA Banks
        {
          id: '13',
          bankId: 'BANK013',
          name: 'JPMorgan Chase Bank',
          code: 'CHASE',
          swiftCode: 'CHASUS33XXX',
          address: '383 Madison Avenue',
          city: 'New York',
          state: 'New York',
          pincode: '10179',
          country: 'United States',
          phone: '+1-212-270-6000',
          email: 'customer.service@chase.com',
          website: 'https://www.chase.com',
          isActive: true,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
        {
          id: '14',
          bankId: 'BANK014',
          name: 'Bank of America',
          code: 'BOA',
          swiftCode: 'BOFAUS3NXXX',
          address: '100 North Tryon Street',
          city: 'Charlotte',
          state: 'North Carolina',
          pincode: '28255',
          country: 'United States',
          phone: '+1-704-386-5681',
          email: 'customer.service@bankofamerica.com',
          website: 'https://www.bankofamerica.com',
          isActive: true,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
        {
          id: '15',
          bankId: 'BANK015',
          name: 'Wells Fargo Bank',
          code: 'WELLS',
          swiftCode: 'WFBIUS6SXXX',
          address: '420 Montgomery Street',
          city: 'San Francisco',
          state: 'California',
          pincode: '94104',
          country: 'United States',
          phone: '+1-866-249-3302',
          email: 'customer.service@wellsfargo.com',
          website: 'https://www.wellsfargo.com',
          isActive: true,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
        {
          id: '16',
          bankId: 'BANK016',
          name: 'Citibank',
          code: 'CITI',
          swiftCode: 'CITIUS33XXX',
          address: '388 Greenwich Street',
          city: 'New York',
          state: 'New York',
          pincode: '10013',
          country: 'United States',
          phone: '+1-212-559-1000',
          email: 'customer.service@citi.com',
          website: 'https://www.citibank.com',
          isActive: true,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
        
        // UK Banks
        {
          id: '17',
          bankId: 'BANK017',
          name: 'HSBC Bank',
          code: 'HSBC',
          swiftCode: 'HSBCGB2LXXX',
          address: '8 Canada Square',
          city: 'London',
          state: 'England',
          pincode: 'E14 5HQ',
          country: 'United Kingdom',
          phone: '+44-20-7991-8888',
          email: 'customer.service@hsbc.co.uk',
          website: 'https://www.hsbc.co.uk',
          isActive: true,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
        {
          id: '18',
          bankId: 'BANK018',
          name: 'Barclays Bank',
          code: 'BARCLAYS',
          swiftCode: 'BARCGB22XXX',
          address: '1 Churchill Place',
          city: 'London',
          state: 'England',
          pincode: 'E14 5HP',
          country: 'United Kingdom',
          phone: '+44-20-7116-1000',
          email: 'customer.service@barclays.co.uk',
          website: 'https://www.barclays.co.uk',
          isActive: true,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
        {
          id: '19',
          bankId: 'BANK019',
          name: 'Lloyds Bank',
          code: 'LLOYDS',
          swiftCode: 'LOYDGB2LXXX',
          address: '25 Gresham Street',
          city: 'London',
          state: 'England',
          pincode: 'EC2V 7HN',
          country: 'United Kingdom',
          phone: '+44-20-7626-1500',
          email: 'customer.service@lloydsbank.co.uk',
          website: 'https://www.lloydsbank.com',
          isActive: true,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
        {
          id: '20',
          bankId: 'BANK020',
          name: 'NatWest Bank',
          code: 'NATWEST',
          swiftCode: 'NWBKGB2LXXX',
          address: '250 Bishopsgate',
          city: 'London',
          state: 'England',
          pincode: 'EC2M 4AA',
          country: 'United Kingdom',
          phone: '+44-20-7672-1000',
          email: 'customer.service@natwest.com',
          website: 'https://www.natwest.com',
          isActive: true,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
      ]

      // Apply filters
      let filteredBanks = mockBanks
      if (searchTerm) {
        const loweredSearchTerm = searchTerm.toLowerCase()
        filteredBanks = filteredBanks.filter((bank) => {
          const matchesName = bank.name.toLowerCase().includes(loweredSearchTerm)
          const matchesCode = bank.code.toLowerCase().includes(loweredSearchTerm)
          const matchesIfsc = bank.ifscCode?.toLowerCase().includes(loweredSearchTerm) ?? false
          const matchesCity = bank.city.toLowerCase().includes(loweredSearchTerm)
          const matchesState = bank.state.toLowerCase().includes(loweredSearchTerm)

          return matchesName || matchesCode || matchesIfsc || matchesCity || matchesState
        })
      }
      if (filterStatus !== 'ALL') {
        filteredBanks = filteredBanks.filter((bank) => 
          filterStatus === 'ACTIVE' ? bank.isActive : !bank.isActive
        )
      }

      setBanks(filteredBanks)
    } catch (error) {
      console.error('Error fetching banks:', error)
      toast.error('Failed to fetch banks')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: BankForm) => {
    try {
      if (editingBank) {
        const updatedBank = { 
          ...editingBank, 
          ...data,
          updatedAt: new Date().toISOString() 
        }
        setBanks(banks.map((b) => (b.id === updatedBank.id ? updatedBank : b)))
        toast.success('Bank updated successfully!')
      } else {
        const newBank: Bank = {
          id: String(banks.length + 1),
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        setBanks([...banks, newBank])
        toast.success('Bank created successfully!')
      }

      setShowModal(false)
      reset()
      setEditingBank(null)
    } catch (error) {
      console.error('Error saving bank:', error)
      toast.error('Failed to save bank')
    }
  }

  const openAddModal = () => {
    setEditingBank(null)
    reset({
      name: '',
      code: '',
      ifscCode: '',
      micrCode: '',
      swiftCode: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India',
      phone: '',
      email: '',
      website: '',
      isActive: true,
    })
    setShowModal(true)
  }

  const openEditModal = (bank: Bank) => {
    setEditingBank(bank)
    setValue('name', bank.name)
    setValue('code', bank.code)
    setValue('ifscCode', bank.ifscCode)
    setValue('micrCode', bank.micrCode || '')
    setValue('swiftCode', bank.swiftCode || '')
    setValue('address', bank.address)
    setValue('city', bank.city)
    setValue('state', bank.state)
    setValue('pincode', bank.pincode)
    setValue('country', bank.country)
    setValue('phone', bank.phone || '')
    setValue('email', bank.email || '')
    setValue('website', bank.website || '')
    setValue('isActive', bank.isActive)
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this bank?')) {
      try {
        setBanks(banks.filter((b) => b.id !== id))
        toast.success('Bank deleted successfully')
      } catch (error) {
        console.error('Error deleting bank:', error)
        toast.error('Failed to delete bank')
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bank Master</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage bank information including IFSC codes, addresses, and contact details.
          </p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary btn-md">
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Bank
        </button>
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
                placeholder="Search banks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Banks Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-head">Bank ID</th>
                <th className="table-head">Bank Name</th>
                <th className="table-head">Code</th>
                <th className="table-head">IFSC Code</th>
                <th className="table-head">City</th>
                <th className="table-head">Country</th>
                <th className="table-head">Status</th>
                <th className="table-head">Created</th>
                <th className="table-head">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {banks.length === 0 ? (
                <tr>
                  <td colSpan={9} className="table-cell text-center py-8 text-gray-500">
                    No banks found
                  </td>
                </tr>
              ) : (
                banks.map((bank) => (
                  <tr key={bank.id} className="table-row">
                    <td className="table-cell">
                      <span className="text-sm font-mono text-gray-600">{bank.bankId}</span>
                    </td>
                    <td className="table-cell">
                      <div className="font-medium">{bank.name}</div>
                      <div className="text-xs text-gray-500">{bank.address}</div>
                    </td>
                    <td className="table-cell">
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm font-mono">
                        {bank.code}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-mono">
                        {bank.ifscCode || 'N/A'}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className="text-sm">{bank.city}</span>
                    </td>
                    <td className="table-cell">
                      <span className="text-sm font-semibold">{bank.country}</span>
                    </td>
                    <td className="table-cell">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        bank.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {bank.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className="text-sm">{formatDate(bank.createdAt)}</span>
                    </td>
                    <td className="table-cell">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditModal(bank)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => toast('View details coming soon', { icon: 'ℹ️' })}
                          className="text-green-600 hover:text-green-900"
                          title="View"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(bank.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bank Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-5 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingBank ? 'Edit Bank' : 'Add Bank'}
              </h3>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bank Name *
                    </label>
                    <input
                      type="text"
                      {...register('name')}
                      className="input"
                      placeholder="Enter bank name"
                    />
                    {errors.name && (
                      <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bank Code *
                    </label>
                    <input
                      type="text"
                      {...register('code')}
                      className="input"
                      placeholder="e.g., SBI, HDFC"
                    />
                    {errors.code && (
                      <p className="text-red-600 text-xs mt-1">{errors.code.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      IFSC Code *
                    </label>
                    <input
                      type="text"
                      {...register('ifscCode')}
                      className="input"
                      placeholder="e.g., SBIN0000001"
                    />
                    {errors.ifscCode && (
                      <p className="text-red-600 text-xs mt-1">{errors.ifscCode.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      MICR Code
                    </label>
                    <input
                      type="text"
                      {...register('micrCode')}
                      className="input"
                      placeholder="e.g., 400002001"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SWIFT Code
                    </label>
                    <input
                      type="text"
                      {...register('swiftCode')}
                      className="input"
                      placeholder="e.g., SBININBBXXX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="text"
                      {...register('phone')}
                      className="input"
                      placeholder="e.g., +91-22-22029456"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      {...register('email')}
                      className="input"
                      placeholder="e.g., customercare@sbi.co.in"
                    />
                    {errors.email && (
                      <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website
                    </label>
                    <input
                      type="url"
                      {...register('website')}
                      className="input"
                      placeholder="e.g., https://www.sbi.co.in"
                    />
                    {errors.website && (
                      <p className="text-red-600 text-xs mt-1">{errors.website.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address *
                    </label>
                    <textarea
                      {...register('address')}
                      rows={2}
                      className="input"
                      placeholder="Enter bank address"
                    />
                    {errors.address && (
                      <p className="text-red-600 text-xs mt-1">{errors.address.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      {...register('city')}
                      className="input"
                      placeholder="Enter city"
                    />
                    {errors.city && (
                      <p className="text-red-600 text-xs mt-1">{errors.city.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      {...register('state')}
                      className="input"
                      placeholder="Enter state"
                    />
                    {errors.state && (
                      <p className="text-red-600 text-xs mt-1">{errors.state.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      {...register('pincode')}
                      className="input"
                      placeholder="Enter pincode"
                    />
                    {errors.pincode && (
                      <p className="text-red-600 text-xs mt-1">{errors.pincode.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country *
                    </label>
                    <input
                      type="text"
                      {...register('country')}
                      className="input"
                      placeholder="Enter country"
                    />
                    {errors.country && (
                      <p className="text-red-600 text-xs mt-1">{errors.country.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('isActive')}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Active
                  </label>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      setEditingBank(null)
                      reset()
                    }}
                    className="btn btn-secondary btn-md"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-md">
                    {editingBank ? 'Update Bank' : 'Create Bank'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}












