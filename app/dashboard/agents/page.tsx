'use client'

import { useState, useEffect } from 'react'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

// Indian States and Cities Data
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
]

const INDIAN_CITIES_BY_STATE = {
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Rajahmundry', 'Tirupati', 'Kadapa'],
  'Arunachal Pradesh': ['Itanagar', 'Naharlagun', 'Pasighat', 'Tezpur'],
  'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Tezpur', 'Nagaon', 'Tinsukia'],
  'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga', 'Bihar Sharif', 'Arrah'],
  'Chhattisgarh': ['Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Rajnandgaon', 'Durg'],
  'Goa': ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Junagadh', 'Gandhinagar'],
  'Haryana': ['Gurgaon', 'Faridabad', 'Panipat', 'Ambala', 'Yamunanagar', 'Rohtak', 'Hisar', 'Karnal'],
  'Himachal Pradesh': ['Shimla', 'Mandi', 'Solan', 'Palampur', 'Dharamshala', 'Baddi'],
  'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar', 'Hazaribagh', 'Giridih'],
  'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum', 'Gulbarga', 'Davanagere', 'Bellary'],
  'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Palakkad', 'Malappuram'],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain', 'Sagar', 'Dewas', 'Satna'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur', 'Amravati', 'Kolhapur'],
  'Manipur': ['Imphal', 'Thoubal', 'Bishnupur'],
  'Meghalaya': ['Shillong', 'Tura', 'Nongstoin'],
  'Mizoram': ['Aizawl', 'Lunglei', 'Saiha'],
  'Nagaland': ['Kohima', 'Dimapur', 'Mokokchung'],
  'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur', 'Puri', 'Balasore'],
  'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali', 'Firozpur'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer', 'Bharatpur', 'Alwar'],
  'Sikkim': ['Gangtok', 'Namchi', 'Mangan'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Erode', 'Thoothukudi'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Khammam', 'Karimnagar', 'Ramagundam', 'Mahbubnagar'],
  'Tripura': ['Agartala', 'Dharmanagar', 'Udaipur'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Meerut', 'Varanasi', 'Allahabad', 'Bareilly'],
  'Uttarakhand': ['Dehradun', 'Haridwar', 'Roorkee', 'Kashipur', 'Rudrapur', 'Haldwani'],
  'West Bengal': ['Kolkata', 'Asansol', 'Siliguri', 'Durgapur', 'Bardhaman', 'Malda', 'Baharampur', 'Habra'],
  'Andaman and Nicobar Islands': ['Port Blair', 'Diglipur'],
  'Chandigarh': ['Chandigarh'],
  'Dadra and Nagar Haveli and Daman and Diu': ['Daman', 'Diu', 'Silvassa'],
  'Delhi': ['New Delhi', 'Central Delhi', 'East Delhi', 'North Delhi', 'North East Delhi', 'North West Delhi', 'Shahdara', 'South Delhi', 'South East Delhi', 'South West Delhi', 'West Delhi'],
  'Jammu and Kashmir': ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Kathua', 'Pulwama', 'Kupwara'],
  'Ladakh': ['Leh', 'Kargil'],
  'Lakshadweep': ['Kavaratti', 'Agatti'],
  'Puducherry': ['Puducherry', 'Karaikal', 'Mahe', 'Yanam']
}

interface Agent {
  id: string
  name: string
  mobile: string
  email: string
  pan: string
  gst?: string
  state: string
  city: string
  address: string
  registrationDate: string
  status: 'Active' | 'Non-Active'
  agentCode: string
  totalPolicies: number
  totalPremium: number
  createdAt: string
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  
  // Search and filter states
  const [searchName, setSearchName] = useState('')
  const [searchMobile, setSearchMobile] = useState('')
  const [searchPAN, setSearchPAN] = useState('')
  const [searchGST, setSearchGST] = useState('')
  const [filterState, setFilterState] = useState('')
  const [filterCity, setFilterCity] = useState('')
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'Active' | 'Non-Active'>('ALL')
  const [registrationDateFrom, setRegistrationDateFrom] = useState('')
  const [registrationDateTo, setRegistrationDateTo] = useState('')

  useEffect(() => {
    fetchAgents()
  }, [])

  // Filter agents when search/filter criteria change
  useEffect(() => {
    filterAgents()
  }, [searchName, searchMobile, searchPAN, searchGST, filterState, filterCity, filterStatus, registrationDateFrom, registrationDateTo])

  const fetchAgents = async () => {
    try {
      setLoading(true)
      // Mock data - replace with actual API call
      const mockAgents: Agent[] = [
        {
          id: '1',
          name: 'Rajesh Kumar',
          mobile: '9876543210',
          email: 'rajesh.kumar@email.com',
          pan: 'ABCDE1234F',
          gst: '29ABCDE1234F1Z5',
          state: 'Maharashtra',
          city: 'Mumbai',
          address: '123 MG Road, Andheri',
          registrationDate: '2023-01-15',
          status: 'Active',
          agentCode: 'AGT001',
          totalPolicies: 45,
          totalPremium: 1250000,
          createdAt: '2023-01-15',
        },
        {
          id: '2',
          name: 'Priya Sharma',
          mobile: '9876543211',
          email: 'priya.sharma@email.com',
          pan: 'FGHIJ5678K',
          gst: '29FGHIJ5678K1Z6',
          state: 'Karnataka',
          city: 'Bangalore',
          address: '456 Brigade Road',
          registrationDate: '2023-02-20',
          status: 'Active',
          agentCode: 'AGT002',
          totalPolicies: 32,
          totalPremium: 980000,
          createdAt: '2023-02-20',
        },
        {
          id: '3',
          name: 'Amit Patel',
          mobile: '9876543212',
          email: 'amit.patel@email.com',
          pan: 'KLMNO9012P',
          state: 'West Bengal',
          city: 'Kolkata',
          address: '789 Park Street',
          registrationDate: '2023-03-01',
          status: 'Non-Active',
          agentCode: 'AGT003',
          totalPolicies: 18,
          totalPremium: 450000,
          createdAt: '2023-03-01',
        },
        {
          id: '4',
          name: 'Sneha Reddy',
          mobile: '9876543213',
          email: 'sneha.reddy@email.com',
          pan: 'PQRST3456U',
          gst: '36PQRST3456U1Z7',
          state: 'Telangana',
          city: 'Hyderabad',
          address: '321 Hitech City',
          registrationDate: '2023-04-10',
          status: 'Active',
          agentCode: 'AGT004',
          totalPolicies: 56,
          totalPremium: 1680000,
          createdAt: '2023-04-10',
        },
        {
          id: '5',
          name: 'Vikram Singh',
          mobile: '9876543214',
          email: 'vikram.singh@email.com',
          pan: 'UVWXY7890Z',
          state: 'Delhi',
          city: 'New Delhi',
          address: '654 Connaught Place',
          registrationDate: '2022-11-05',
          status: 'Active',
          agentCode: 'AGT005',
          totalPolicies: 28,
          totalPremium: 720000,
          createdAt: '2022-11-05',
        },
        {
          id: '6',
          name: 'Anjali Desai',
          mobile: '9876543215',
          email: 'anjali.desai@email.com',
          pan: 'ABCDE2345G',
          gst: '24ABCDE2345G1Z8',
          state: 'Gujarat',
          city: 'Ahmedabad',
          address: '987 CG Road',
          registrationDate: '2023-05-15',
          status: 'Non-Active',
          agentCode: 'AGT006',
          totalPolicies: 12,
          totalPremium: 320000,
          createdAt: '2023-05-15',
        },
        {
          id: '7',
          name: 'Rohit Mehta',
          mobile: '9876543216',
          email: 'rohit.mehta@email.com',
          pan: 'FGHIJ6789L',
          state: 'Punjab',
          city: 'Ludhiana',
          address: '147 Ferozepur Road',
          registrationDate: '2023-06-20',
          status: 'Active',
          agentCode: 'AGT007',
          totalPolicies: 38,
          totalPremium: 1100000,
          createdAt: '2023-06-20',
        },
        {
          id: '8',
          name: 'Kavita Nair',
          mobile: '9876543217',
          email: 'kavita.nair@email.com',
          pan: 'KLMNO0123Q',
          gst: '32KLMNO0123Q1Z9',
          state: 'Kerala',
          city: 'Kochi',
          address: '258 Marine Drive',
          registrationDate: '2023-07-08',
          status: 'Active',
          agentCode: 'AGT008',
          totalPolicies: 42,
          totalPremium: 1350000,
          createdAt: '2023-07-08',
        },
      ]

      // Store all agents for filtering
      setAgents(mockAgents)
    } catch (error) {
      console.error('Error fetching agents:', error)
      toast.error('Failed to fetch agents')
    } finally {
      setLoading(false)
    }
  }

  const filterAgents = () => {
    // This will be called from useEffect when filters change
    // For now, we'll filter in the render
  }

  const getFilteredAgents = (): Agent[] => {
    let filtered = agents

    // Filter by Name
    if (searchName) {
      filtered = filtered.filter(agent =>
        agent.name.toLowerCase().includes(searchName.toLowerCase())
      )
    }

    // Filter by Mobile
    if (searchMobile) {
      filtered = filtered.filter(agent =>
        agent.mobile.includes(searchMobile)
      )
    }

    // Filter by PAN
    if (searchPAN) {
      filtered = filtered.filter(agent =>
        agent.pan.toLowerCase().includes(searchPAN.toLowerCase())
      )
    }

    // Filter by GST
    if (searchGST) {
      filtered = filtered.filter(agent =>
        agent.gst?.toLowerCase().includes(searchGST.toLowerCase())
      )
    }

    // Filter by State
    if (filterState) {
      filtered = filtered.filter(agent =>
        agent.state === filterState
      )
    }

    // Filter by City
    if (filterCity) {
      filtered = filtered.filter(agent =>
        agent.city === filterCity
      )
    }

    // Filter by Status
    if (filterStatus !== 'ALL') {
      filtered = filtered.filter(agent =>
        agent.status === filterStatus
      )
    }

    // Filter by Registration Date Range
    if (registrationDateFrom) {
      const fromDate = new Date(registrationDateFrom)
      filtered = filtered.filter(agent => {
        const agentDate = new Date(agent.registrationDate)
        return agentDate >= fromDate
      })
    }

    if (registrationDateTo) {
      const toDate = new Date(registrationDateTo)
      toDate.setHours(23, 59, 59, 999) // Include the entire end date
      filtered = filtered.filter(agent => {
        const agentDate = new Date(agent.registrationDate)
        return agentDate <= toDate
      })
    }

    return filtered
  }

  const handleClearFilters = () => {
    setSearchName('')
    setSearchMobile('')
    setSearchPAN('')
    setSearchGST('')
    setFilterState('')
    setFilterCity('')
    setFilterStatus('ALL')
    setRegistrationDateFrom('')
    setRegistrationDateTo('')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const filteredAgents = getFilteredAgents()
  const availableCities = filterState ? INDIAN_CITIES_BY_STATE[filterState as keyof typeof INDIAN_CITIES_BY_STATE] || [] : []

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back to Dashboard Button */}
      <div>
        <button
          onClick={() => window.location.href = '/dashboard'}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>
      </div>

      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agents</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage insurance agents and their performance.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-secondary btn-md"
          >
            <FunnelIcon className="h-5 w-5 mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          <button
            onClick={() => {/* Add new agent functionality */}}
            className="btn btn-primary btn-md"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Agent
          </button>
        </div>
      </div>

      {/* Search and filters panel */}
      {showFilters && (
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Search & Filter Agents</h3>
            <button
              onClick={handleClearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              <XMarkIcon className="h-4 w-4 mr-1" />
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Name Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>

            {/* Mobile Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by mobile..."
                  value={searchMobile}
                  onChange={(e) => setSearchMobile(e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>

            {/* PAN Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PAN Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by PAN..."
                  value={searchPAN}
                  onChange={(e) => setSearchPAN(e.target.value.toUpperCase())}
                  className="input pl-10"
                  maxLength={10}
                />
              </div>
            </div>

            {/* GST Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GST Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by GST..."
                  value={searchGST}
                  onChange={(e) => setSearchGST(e.target.value.toUpperCase())}
                  className="input pl-10"
                />
              </div>
            </div>

            {/* State Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <select
                value={filterState}
                onChange={(e) => {
                  setFilterState(e.target.value)
                  setFilterCity('') // Reset city when state changes
                }}
                className="input"
              >
                <option value="">All States</option>
                {INDIAN_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            {/* City Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <select
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
                className="input"
                disabled={!filterState}
              >
                <option value="">All Cities</option>
                {availableCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'ALL' | 'Active' | 'Non-Active')}
                className="input"
              >
                <option value="ALL">All Status</option>
                <option value="Active">Active</option>
                <option value="Non-Active">Non-Active</option>
              </select>
            </div>

            {/* Registration Date From */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Registration Date From
              </label>
              <input
                type="date"
                value={registrationDateFrom}
                onChange={(e) => setRegistrationDateFrom(e.target.value)}
                className="input"
              />
            </div>

            {/* Registration Date To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Registration Date To
              </label>
              <input
                type="date"
                value={registrationDateTo}
                onChange={(e) => setRegistrationDateTo(e.target.value)}
                className="input"
                min={registrationDateFrom || undefined}
              />
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{filteredAgents.length}</span> of{' '}
              <span className="font-semibold text-gray-900">{agents.length}</span> agents
            </p>
          </div>
        </div>
      )}

      {/* Quick search bar (always visible) */}
      {!showFilters && (
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Quick search by name, mobile, PAN, or GST..."
                  value={searchName || searchMobile || searchPAN || searchGST}
                  onChange={(e) => {
                    const value = e.target.value
                    setSearchName(value)
                    setSearchMobile(value)
                    setSearchPAN(value)
                    setSearchGST(value)
                  }}
                  className="input pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'ALL' | 'Active' | 'Non-Active')}
                className="input"
              >
                <option value="ALL">All Status</option>
                <option value="Active">Active</option>
                <option value="Non-Active">Non-Active</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Agents table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-head">Agent Code</th>
                <th className="table-head">Name</th>
                <th className="table-head">Mobile</th>
                <th className="table-head">Email</th>
                <th className="table-head">PAN</th>
                <th className="table-head">GST</th>
                <th className="table-head">Location</th>
                <th className="table-head">Registration Date</th>
                <th className="table-head">Status</th>
                <th className="table-head">Total Policies</th>
                <th className="table-head">Total Premium</th>
                <th className="table-head">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {filteredAgents.length === 0 ? (
                <tr>
                  <td colSpan={12} className="table-cell text-center py-8 text-gray-500">
                    No agents found matching your search criteria
                  </td>
                </tr>
              ) : (
                filteredAgents.map((agent) => (
                  <tr key={agent.id} className="table-row">
                    <td className="table-cell font-medium text-blue-600">
                      {agent.agentCode}
                    </td>
                    <td className="table-cell font-medium">
                      {agent.name}
                    </td>
                    <td className="table-cell">{agent.mobile}</td>
                    <td className="table-cell">{agent.email}</td>
                    <td className="table-cell font-mono text-sm">{agent.pan}</td>
                    <td className="table-cell font-mono text-sm">
                      {agent.gst || '-'}
                    </td>
                    <td className="table-cell">
                      {agent.city}, {agent.state}
                    </td>
                    <td className="table-cell">{formatDate(agent.registrationDate)}</td>
                    <td className="table-cell">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        agent.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {agent.status}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {agent.totalPolicies}
                      </span>
                    </td>
                    <td className="table-cell font-semibold">
                      {formatCurrency(agent.totalPremium)}
                    </td>
                    <td className="table-cell">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {/* View agent details */}}
                          className="text-blue-600 hover:text-blue-900"
                          title="View agent"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {/* Edit agent */}}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit agent"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {/* Delete agent */}}
                          className="text-red-600 hover:text-red-900"
                          title="Delete agent"
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
    </div>
  )
}
