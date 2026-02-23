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
  FunnelIcon,
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

// City to Pincode mapping for Indian cities
const CITY_PINCODE_MAP = {
  // Maharashtra
  'Mumbai': '400001',
  'Pune': '411001',
  'Nagpur': '440001',
  'Nashik': '422001',
  'Aurangabad': '431001',
  'Solapur': '413001',
  'Amravati': '444601',
  'Kolhapur': '416001',
  
  // Karnataka
  'Bangalore': '560001',
  'Mysore': '570001',
  'Hubli': '580001',
  'Mangalore': '575001',
  'Belgaum': '590001',
  'Gulbarga': '585101',
  'Davanagere': '577001',
  'Bellary': '583101',
  
  // Tamil Nadu
  'Chennai': '600001',
  'Coimbatore': '641001',
  'Madurai': '625001',
  'Tiruchirappalli': '620001',
  'Salem': '636001',
  'Tirunelveli': '627001',
  'Erode': '638001',
  'Thoothukudi': '628001',
  
  // West Bengal
  'Kolkata': '700001',
  'Asansol': '713301',
  'Siliguri': '734001',
  'Durgapur': '713201',
  'Bardhaman': '713101',
  'Malda': '732101',
  'Baharampur': '742101',
  'Habra': '743263',
  
  // Uttar Pradesh
  'Lucknow': '226001',
  'Kanpur': '208001',
  'Ghaziabad': '201001',
  'Agra': '282001',
  'Meerut': '250001',
  'Varanasi': '221001',
  'Allahabad': '211001',
  'Bareilly': '243001',
  
  // Gujarat
  'Ahmedabad': '380001',
  'Surat': '395001',
  'Vadodara': '390001',
  'Rajkot': '360001',
  'Bhavnagar': '364001',
  'Jamnagar': '361001',
  'Junagadh': '362001',
  'Gandhinagar': '382010',
  
  // Rajasthan
  'Jaipur': '302001',
  'Jodhpur': '342001',
  'Udaipur': '313001',
  'Kota': '324001',
  'Bikaner': '334001',
  'Ajmer': '305001',
  'Bharatpur': '321001',
  'Alwar': '301001',
  
  // Andhra Pradesh
  'Visakhapatnam': '530001',
  'Vijayawada': '520001',
  'Guntur': '522001',
  'Nellore': '524001',
  'Kurnool': '518001',
  'Rajahmundry': '533101',
  'Tirupati': '517501',
  'Kadapa': '516001',
  
  // Telangana
  'Hyderabad': '500001',
  'Warangal': '506001',
  'Nizamabad': '503001',
  'Khammam': '507001',
  'Karimnagar': '505001',
  'Ramagundam': '505208',
  'Mahbubnagar': '509001',
  
  // Kerala
  'Thiruvananthapuram': '695001',
  'Kochi': '682001',
  'Kozhikode': '673001',
  'Thrissur': '680001',
  'Kollam': '691001',
  'Palakkad': '678001',
  'Malappuram': '676505',
  
  // Punjab
  'Ludhiana': '141001',
  'Amritsar': '143001',
  'Jalandhar': '144001',
  'Patiala': '147001',
  'Bathinda': '151001',
  'Mohali': '160055',
  'Firozpur': '152001',
  
  // Haryana
  'Gurgaon': '122001',
  'Faridabad': '121001',
  'Panipat': '132103',
  'Ambala': '133001',
  'Yamunanagar': '135001',
  'Rohtak': '124001',
  'Hisar': '125001',
  'Karnal': '132001',
  
  // Madhya Pradesh
  'Bhopal': '462001',
  'Indore': '452001',
  'Gwalior': '474001',
  'Jabalpur': '482001',
  'Ujjain': '456001',
  'Sagar': '470001',
  'Dewas': '455001',
  'Satna': '485001',
  
  // Odisha
  'Bhubaneswar': '751001',
  'Cuttack': '753001',
  'Rourkela': '769001',
  'Berhampur': '760001',
  'Sambalpur': '768001',
  'Puri': '752001',
  'Balasore': '756001',
  
  // Bihar
  'Patna': '800001',
  'Gaya': '823001',
  'Bhagalpur': '812001',
  'Muzaffarpur': '842001',
  'Purnia': '854301',
  'Darbhanga': '846004',
  'Bihar Sharif': '803101',
  'Arrah': '802301',
  
  // Jharkhand
  'Ranchi': '834001',
  'Jamshedpur': '831001',
  'Dhanbad': '826001',
  'Bokaro': '827001',
  'Deoghar': '814112',
  'Hazaribagh': '825301',
  'Giridih': '815301',
  
  // Assam
  'Guwahati': '781001',
  'Silchar': '788001',
  'Dibrugarh': '786001',
  'Jorhat': '785001',
  'Tezpur': '784001',
  'Nagaon': '782001',
  'Tinsukia': '786125',
  
  // Himachal Pradesh
  'Shimla': '171001',
  'Mandi': '175001',
  'Solan': '173212',
  'Palampur': '176061',
  'Dharamshala': '176215',
  'Baddi': '173205',
  
  // Uttarakhand
  'Dehradun': '248001',
  'Haridwar': '249401',
  'Roorkee': '247667',
  'Kashipur': '244713',
  'Rudrapur': '263153',
  'Haldwani': '263139',
  
  // Union Territories
  'New Delhi': '110001',
  'Central Delhi': '110001',
  'East Delhi': '110092',
  'North Delhi': '110054',
  'North East Delhi': '110053',
  'North West Delhi': '110085',
  'Shahdara': '110032',
  'South Delhi': '110017',
  'South East Delhi': '110024',
  'South West Delhi': '110070',
  'West Delhi': '110015',
  'Chandigarh': '160017',
  'Puducherry': '605001',
  'Karaikal': '609602',
  'Mahe': '673310',
  'Yanam': '533464',
  
  // Special Regions
  'Srinagar': '190001',
  'Jammu': '180001',
  'Leh': '194101',
  'Kargil': '194103',
  'Port Blair': '744101',
  'Gangtok': '737101',
  'Imphal': '795001',
  'Shillong': '793001',
  'Aizawl': '796001',
  'Kohima': '797001',
  'Agartala': '799001',
  'Panaji': '403001',
  'Daman': '396210',
  'Diu': '362520',
  'Silvassa': '396230',
  'Kavaratti': '682555'
}

// State-wise STD codes for Indian states
const STATE_STD_CODES = {
  'Andhra Pradesh': '+91-40',
  'Arunachal Pradesh': '+91-360',
  'Assam': '+91-361',
  'Bihar': '+91-612',
  'Chhattisgarh': '+91-771',
  'Goa': '+91-832',
  'Gujarat': '+91-79',
  'Haryana': '+91-124',
  'Himachal Pradesh': '+91-177',
  'Jharkhand': '+91-651',
  'Karnataka': '+91-80',
  'Kerala': '+91-471',
  'Madhya Pradesh': '+91-755',
  'Maharashtra': '+91-22',
  'Manipur': '+91-385',
  'Meghalaya': '+91-364',
  'Mizoram': '+91-389',
  'Nagaland': '+91-370',
  'Odisha': '+91-674',
  'Punjab': '+91-172',
  'Rajasthan': '+91-141',
  'Sikkim': '+91-3592',
  'Tamil Nadu': '+91-44',
  'Telangana': '+91-40',
  'Tripura': '+91-381',
  'Uttar Pradesh': '+91-522',
  'Uttarakhand': '+91-135',
  'West Bengal': '+91-33',
  'Andaman and Nicobar Islands': '+91-3192',
  'Chandigarh': '+91-172',
  'Dadra and Nagar Haveli and Daman and Diu': '+91-260',
  'Delhi': '+91-11',
  'Jammu and Kashmir': '+91-194',
  'Ladakh': '+91-1982',
  'Lakshadweep': '+91-4895',
  'Puducherry': '+91-413'
}

// City-wise STD codes (more specific than state codes)
const CITY_STD_CODES = {
  // Maharashtra
  'Mumbai': '+91-22',
  'Pune': '+91-20',
  'Nagpur': '+91-712',
  'Nashik': '+91-253',
  'Aurangabad': '+91-240',
  'Solapur': '+91-217',
  'Amravati': '+91-721',
  'Kolhapur': '+91-231',
  
  // Karnataka
  'Bangalore': '+91-80',
  'Mysore': '+91-821',
  'Hubli': '+91-836',
  'Mangalore': '+91-824',
  'Belgaum': '+91-831',
  'Gulbarga': '+91-8472',
  'Davanagere': '+91-8192',
  'Bellary': '+91-8392',
  
  // Tamil Nadu
  'Chennai': '+91-44',
  'Coimbatore': '+91-422',
  'Madurai': '+91-452',
  'Tiruchirappalli': '+91-431',
  'Salem': '+91-427',
  'Tirunelveli': '+91-4632',
  'Erode': '+91-424',
  'Thoothukudi': '+91-461',
  
  // West Bengal
  'Kolkata': '+91-33',
  'Asansol': '+91-341',
  'Siliguri': '+91-353',
  'Durgapur': '+91-343',
  'Bardhaman': '+91-342',
  'Malda': '+91-351',
  'Baharampur': '+91-3482',
  'Habra': '+91-3165',
  
  // Uttar Pradesh
  'Lucknow': '+91-522',
  'Kanpur': '+91-512',
  'Ghaziabad': '+91-120',
  'Agra': '+91-562',
  'Meerut': '+91-121',
  'Varanasi': '+91-542',
  'Allahabad': '+91-532',
  'Bareilly': '+91-581',
  
  // Gujarat
  'Ahmedabad': '+91-79',
  'Surat': '+91-261',
  'Vadodara': '+91-265',
  'Rajkot': '+91-281',
  'Bhavnagar': '+91-278',
  'Jamnagar': '+91-288',
  'Junagadh': '+91-285',
  'Gandhinagar': '+91-79',
  
  // Rajasthan
  'Jaipur': '+91-141',
  'Jodhpur': '+91-291',
  'Udaipur': '+91-294',
  'Kota': '+91-744',
  'Bikaner': '+91-151',
  'Ajmer': '+91-145',
  'Bharatpur': '+91-5644',
  'Alwar': '+91-144',
  
  // Andhra Pradesh
  'Visakhapatnam': '+91-891',
  'Vijayawada': '+91-866',
  'Guntur': '+91-863',
  'Nellore': '+91-861',
  'Kurnool': '+91-8518',
  'Rajahmundry': '+91-883',
  'Tirupati': '+91-877',
  'Kadapa': '+91-8562',
  
  // Telangana
  'Hyderabad': '+91-40',
  'Warangal': '+91-870',
  'Nizamabad': '+91-8462',
  'Khammam': '+91-8742',
  'Karimnagar': '+91-878',
  'Ramagundam': '+91-8745',
  'Mahbubnagar': '+91-8542',
  
  // Kerala
  'Thiruvananthapuram': '+91-471',
  'Kochi': '+91-484',
  'Kozhikode': '+91-495',
  'Thrissur': '+91-487',
  'Kollam': '+91-474',
  'Palakkad': '+91-491',
  'Malappuram': '+91-483',
  
  // Punjab
  'Ludhiana': '+91-161',
  'Amritsar': '+91-183',
  'Jalandhar': '+91-181',
  'Patiala': '+91-175',
  'Bathinda': '+91-164',
  'Mohali': '+91-172',
  'Firozpur': '+91-1632',
  
  // Haryana
  'Gurgaon': '+91-124',
  'Faridabad': '+91-129',
  'Panipat': '+91-180',
  'Ambala': '+91-171',
  'Yamunanagar': '+91-1732',
  'Rohtak': '+91-1262',
  'Hisar': '+91-1662',
  'Karnal': '+91-184',
  
  // Madhya Pradesh
  'Bhopal': '+91-755',
  'Indore': '+91-731',
  'Gwalior': '+91-751',
  'Jabalpur': '+91-761',
  'Ujjain': '+91-734',
  'Sagar': '+91-7582',
  'Dewas': '+91-7272',
  'Satna': '+91-7672',
  
  // Odisha
  'Bhubaneswar': '+91-674',
  'Cuttack': '+91-671',
  'Rourkela': '+91-661',
  'Berhampur': '+91-680',
  'Sambalpur': '+91-663',
  'Puri': '+91-6752',
  'Balasore': '+91-6782',
  
  // Bihar
  'Patna': '+91-612',
  'Gaya': '+91-631',
  'Bhagalpur': '+91-641',
  'Muzaffarpur': '+91-621',
  'Purnia': '+91-6454',
  'Darbhanga': '+91-6272',
  'Bihar Sharif': '+91-6112',
  'Arrah': '+91-6182',
  
  // Jharkhand
  'Ranchi': '+91-651',
  'Jamshedpur': '+91-657',
  'Dhanbad': '+91-326',
  'Bokaro': '+91-6542',
  'Deoghar': '+91-6432',
  'Hazaribagh': '+91-6546',
  'Giridih': '+91-6532',
  
  // Assam
  'Guwahati': '+91-361',
  'Silchar': '+91-3842',
  'Dibrugarh': '+91-373',
  'Jorhat': '+91-376',
  'Tezpur': '+91-3712',
  'Nagaon': '+91-3672',
  'Tinsukia': '+91-374',
  
  // Himachal Pradesh
  'Shimla': '+91-177',
  'Mandi': '+91-1905',
  'Solan': '+91-1792',
  'Palampur': '+91-1894',
  'Dharamshala': '+91-1892',
  'Baddi': '+91-1795',
  
  // Uttarakhand
  'Dehradun': '+91-135',
  'Haridwar': '+91-1334',
  'Roorkee': '+91-1332',
  'Kashipur': '+91-5947',
  'Rudrapur': '+91-5944',
  'Haldwani': '+91-5946',
  
  // Union Territories
  'New Delhi': '+91-11',
  'Central Delhi': '+91-11',
  'East Delhi': '+91-11',
  'North Delhi': '+91-11',
  'North East Delhi': '+91-11',
  'North West Delhi': '+91-11',
  'Shahdara': '+91-11',
  'South Delhi': '+91-11',
  'South East Delhi': '+91-11',
  'South West Delhi': '+91-11',
  'West Delhi': '+91-11',
  'Chandigarh': '+91-172',
  'Puducherry': '+91-413',
  'Karaikal': '+91-4368',
  'Mahe': '+91-490',
  'Yanam': '+91-884',
  
  // Special Regions
  'Srinagar': '+91-194',
  'Jammu': '+91-191',
  'Leh': '+91-1982',
  'Kargil': '+91-1985',
  'Port Blair': '+91-3192',
  'Gangtok': '+91-3592',
  'Imphal': '+91-385',
  'Shillong': '+91-364',
  'Aizawl': '+91-389',
  'Kohima': '+91-370',
  'Agartala': '+91-381',
  'Panaji': '+91-832',
  'Daman': '+91-260',
  'Diu': '+91-2875',
  'Silvassa': '+91-260',
  'Kavaratti': '+91-4895'
}

const customerSchema = z.object({
  customerType: z.enum(['individual', 'corporate']),
  // Individual fields
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  mobileNumber: z.string().optional(),
  // Corporate fields
  companyName: z.string().optional(),
  contactPersonName: z.string().optional(),
  phoneNumber: z.string().optional(),
  pan: z.string().optional(),
  gst: z.string().optional(),
  websiteUrl: z.string().url().optional().or(z.literal('')),
  // Common fields
  email: z.string().email('Invalid email address'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  pincode: z.string()
    .min(6, 'Pincode must be at least 6 digits')
    .max(6, 'Pincode must be exactly 6 digits')
    .regex(/^[0-9]+$/, 'Pincode should contain only digits'),
  status: z.string().min(1, 'Status is required'),
  assignedTo: z.string().min(1, 'Assigned to is required'),
  notes: z.string().optional(),
}).refine((data) => {
  if (data.customerType === 'individual') {
    return data.firstName && data.lastName && data.mobileNumber
  }
  if (data.customerType === 'corporate') {
    return data.companyName && data.contactPersonName && data.phoneNumber
  }
  return true
}, {
  message: 'Required fields are missing for the selected customer type',
  path: ['customerType']
})

type CustomerForm = z.infer<typeof customerSchema>

interface Customer {
  id: string
  customerType: 'individual' | 'corporate'
  // Individual fields
  firstName?: string
  lastName?: string
  mobileNumber?: string
  // Corporate fields
  companyName?: string
  contactPersonName?: string
  phoneNumber?: string
  pan?: string
  gst?: string
  websiteUrl?: string
  // Common fields
  email: string
  address: string
  city: string
  state: string
  pincode: string
  status: string
  assignedTo: string
  notes?: string
  policies: number
  createdAt: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [selectedState, setSelectedState] = useState('')
  const [selectedCity, setSelectedCity] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CustomerForm>({
    resolver: zodResolver(customerSchema),
  })

  // Function to get pincode for a city
  const getPincodeForCity = (city: string) => {
    return CITY_PINCODE_MAP[city as keyof typeof CITY_PINCODE_MAP] || ''
  }

  // Function to get STD code for a city (more specific)
  const getStdCodeForCity = (city: string) => {
    return CITY_STD_CODES[city as keyof typeof CITY_STD_CODES] || ''
  }

  // Function to get STD code for a state (fallback)
  const getStdCodeForState = (state: string) => {
    return STATE_STD_CODES[state as keyof typeof STATE_STD_CODES] || '+91-'
  }

  // Function to get complete phone number with STD code
  const getCompletePhoneNumber = (phoneNumber: string) => {
    const stdCode = selectedCity ? getStdCodeForCity(selectedCity) : 
                   selectedState ? getStdCodeForState(selectedState) : '+91-'
    return `${stdCode}${phoneNumber}`
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      // Mock data - replace with actual API call
      const mockCustomers: Customer[] = [
        {
          id: '1',
          customerType: 'individual',
          firstName: 'Rajesh',
          lastName: 'Kumar',
          mobileNumber: '9876543210',
          email: 'rajesh.kumar@email.com',
          address: '123 MG Road',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          pan: 'ABCDE1234F',
          status: 'active',
          assignedTo: 'John Smith',
          notes: 'Regular customer with good payment history',
          policies: 2,
          createdAt: '2024-01-15',
        },
        {
          id: '2',
          customerType: 'corporate',
          companyName: 'Tech Solutions Pvt Ltd',
          contactPersonName: 'Priya Sharma',
          phoneNumber: '9876543211',
          email: 'priya.sharma@techsolutions.com',
          address: '456 Brigade Road',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560001',
          pan: 'FGHIJ5678K',
          gst: '29ABCDE1234F1Z5',
          websiteUrl: 'https://techsolutions.com',
          status: 'active',
          assignedTo: 'Sarah Johnson',
          notes: 'Corporate client with multiple policies',
          policies: 1,
          createdAt: '2024-02-20',
        },
        {
          id: '3',
          customerType: 'individual',
          firstName: 'Amit',
          lastName: 'Patel',
          mobileNumber: '9876543212',
          email: 'amit.patel@email.com',
          address: '789 Park Street',
          city: 'Kolkata',
          state: 'West Bengal',
          pincode: '700001',
          pan: 'KLMNO9012P',
          status: 'pending',
          assignedTo: 'Mike Wilson',
          notes: 'New customer, verification pending',
          policies: 3,
          createdAt: '2024-03-01',
        },
      ]

      // Apply filters
      let filteredCustomers = mockCustomers
      if (searchTerm) {
        filteredCustomers = mockCustomers.filter(
          (customer) =>
            (customer.customerType === 'corporate' 
              ? customer.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
              : `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
            ) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (customer.customerType === 'corporate' 
              ? customer.phoneNumber?.includes(searchTerm)
              : customer.mobileNumber?.includes(searchTerm)
            ) ||
            customer.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }

      setCustomers(filteredCustomers)
    } catch (error) {
      console.error('Error fetching customers:', error)
      toast.error('Failed to fetch customers')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: CustomerForm) => {
    try {
      // Add complete phone number with STD code
      const formData = {
        ...data,
        phone: getCompletePhoneNumber(data.mobileNumber || '')
      }

      if (editingCustomer) {
        // Update existing customer
        const response = await fetch(`/api/customers/${editingCustomer.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })

        if (response.ok) {
          toast.success('Customer updated successfully')
          setEditingCustomer(null)
          setSelectedState('')
          setSelectedCity('')
          setShowModal(false)
          reset()
          fetchCustomers()
        } else {
          toast.error('Failed to update customer')
        }
      } else {
        // Create new customer
        const response = await fetch('/api/customers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })

        if (response.ok) {
          toast.success('Customer created successfully')
          setSelectedState('')
          setSelectedCity('')
          setShowModal(false)
          reset()
          fetchCustomers()
        } else {
          toast.error('Failed to create customer')
        }
      }
    } catch (error) {
      console.error('Error saving customer:', error)
      toast.error('Failed to save customer')
    }
  }

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer)
    setSelectedState(customer.state)
    setSelectedCity(customer.city)
    
    // Extract phone number without STD code for editing
    const phoneWithoutStd = (customer as any).phone?.replace(/^\+91-\d+-?/, '') || ''
    
    reset({
      customerType: customer.customerType,
      firstName: customer.firstName,
      lastName: customer.lastName,
      mobileNumber: customer.mobileNumber,
      companyName: customer.companyName,
      contactPersonName: customer.contactPersonName,
      phoneNumber: customer.phoneNumber,
      pan: customer.pan,
      gst: customer.gst,
      websiteUrl: customer.websiteUrl,
      email: customer.email,
      address: customer.address,
      city: customer.city,
      state: customer.state,
      pincode: customer.pincode,
      status: customer.status,
      assignedTo: customer.assignedTo,
      notes: customer.notes,
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        const response = await fetch(`/api/customers/${id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          toast.success('Customer deleted successfully')
          fetchCustomers()
        } else {
          toast.error('Failed to delete customer')
        }
      } catch (error) {
        console.error('Error deleting customer:', error)
        toast.error('Failed to delete customer')
      }
    }
  }

  const handleAddNew = () => {
    setEditingCustomer(null)
    setSelectedState('')
    setSelectedCity('')
    reset()
    setShowModal(true)
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
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your customer database and information.
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="btn btn-primary btn-md"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Customer
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
                placeholder="Search customers..."
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
              <option value="ALL">All Customers</option>
              <option value="WITH_POLICIES">With Policies</option>
              <option value="WITHOUT_POLICIES">Without Policies</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customers table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-head">Customer Type</th>
                <th className="table-head">Name/Company</th>
                <th className="table-head">Email</th>
                <th className="table-head">Phone</th>
                <th className="table-head">Location</th>
                <th className="table-head">Status</th>
                <th className="table-head">Assigned To</th>
                <th className="table-head">Policies</th>
                <th className="table-head">Joined</th>
                <th className="table-head">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="table-cell text-center py-8 text-gray-500">
                    No customers found
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id} className="table-row">
                    <td className="table-cell">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        customer.customerType === 'corporate' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {customer.customerType === 'corporate' ? 'Corporate' : 'Individual'}
                      </span>
                    </td>
                    <td className="table-cell font-medium">
                      {customer.customerType === 'corporate' 
                        ? customer.companyName 
                        : `${customer.firstName} ${customer.lastName}`
                      }
                    </td>
                    <td className="table-cell">{customer.email}</td>
                    <td className="table-cell">
                      {customer.customerType === 'corporate' 
                        ? customer.phoneNumber 
                        : customer.mobileNumber
                      }
                    </td>
                    <td className="table-cell">{customer.city}, {customer.state}</td>
                    <td className="table-cell">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        customer.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : customer.status === 'inactive'
                          ? 'bg-red-100 text-red-800'
                          : customer.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="table-cell">{customer.assignedTo}</td>
                    <td className="table-cell">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {customer.policies} policies
                      </span>
                    </td>
                    <td className="table-cell">{formatDate(customer.createdAt)}</td>
                    <td className="table-cell">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(customer)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit customer"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(customer.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete customer"
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

      {/* Add/Edit Customer Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
              </h3>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Customer Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Type *
                  </label>
                  <select
                    {...register('customerType')}
                    className="input"
                  >
                    <option value="">Select Customer Type</option>
                    <option value="individual">Individual</option>
                    <option value="corporate">Corporate</option>
                  </select>
                  {errors.customerType && (
                    <p className="text-red-600 text-xs mt-1">{errors.customerType.message}</p>
                  )}
                </div>

                {/* Conditional Fields based on Customer Type */}
                {watch('customerType') === 'individual' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          First Name *
                        </label>
                        <input
                          type="text"
                          {...register('firstName')}
                          className="input"
                          placeholder="Enter first name"
                        />
                        {errors.firstName && (
                          <p className="text-red-600 text-xs mt-1">{errors.firstName.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          {...register('lastName')}
                          className="input"
                          placeholder="Enter last name"
                        />
                        {errors.lastName && (
                          <p className="text-red-600 text-xs mt-1">{errors.lastName.message}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        {...register('mobileNumber')}
                        className="input"
                        placeholder="Enter mobile number"
                      />
                      {errors.mobileNumber && (
                        <p className="text-red-600 text-xs mt-1">{errors.mobileNumber.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        PAN *
                      </label>
                      <input
                        type="text"
                        {...register('pan')}
                        className="input"
                        placeholder="Enter PAN number"
                      />
                      {errors.pan && (
                        <p className="text-red-600 text-xs mt-1">{errors.pan.message}</p>
                      )}
                    </div>
                  </>
                )}

                {watch('customerType') === 'corporate' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        {...register('companyName')}
                        className="input"
                        placeholder="Enter company name"
                      />
                      {errors.companyName && (
                        <p className="text-red-600 text-xs mt-1">{errors.companyName.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Person Name *
                      </label>
                      <input
                        type="text"
                        {...register('contactPersonName')}
                        className="input"
                        placeholder="Enter contact person name"
                      />
                      {errors.contactPersonName && (
                        <p className="text-red-600 text-xs mt-1">{errors.contactPersonName.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        {...register('phoneNumber')}
                        className="input"
                        placeholder="Enter phone number"
                      />
                      {errors.phoneNumber && (
                        <p className="text-red-600 text-xs mt-1">{errors.phoneNumber.message}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          PAN *
                        </label>
                        <input
                          type="text"
                          {...register('pan')}
                          className="input"
                          placeholder="Enter PAN number"
                        />
                        {errors.pan && (
                          <p className="text-red-600 text-xs mt-1">{errors.pan.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          GST *
                        </label>
                        <input
                          type="text"
                          {...register('gst')}
                          className="input"
                          placeholder="Enter GST number"
                        />
                        {errors.gst && (
                          <p className="text-red-600 text-xs mt-1">{errors.gst.message}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Website URL
                      </label>
                      <input
                        type="url"
                        {...register('websiteUrl')}
                        className="input"
                        placeholder="Enter website URL"
                      />
                      {errors.websiteUrl && (
                        <p className="text-red-600 text-xs mt-1">{errors.websiteUrl.message}</p>
                      )}
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    className="input"
                    placeholder="Enter email address"
                  />
                  {errors.email && (
                    <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>
                  )}
                </div>

                {/* Common fields for both Individual and Corporate */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <input
                    type="text"
                    {...register('address')}
                    className="input"
                    placeholder="Enter address"
                  />
                  {errors.address && (
                    <p className="text-red-600 text-xs mt-1">{errors.address.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <select
                      {...register('state')}
                      value={selectedState}
                      onChange={(e) => {
                        setSelectedState(e.target.value)
                        setSelectedCity('') // Reset city when state changes
                        setValue('city', '')
                        setValue('pincode', '')
                        // STD code will auto-update via the display logic
                        register('state').onChange(e)
                      }}
                      className="input"
                    >
                      <option value="">Select State</option>
                      {INDIAN_STATES.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                    {errors.state && (
                      <p className="text-red-600 text-xs mt-1">{errors.state.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <select
                      {...register('city')}
                      value={selectedCity}
                      onChange={(e) => {
                        const city = e.target.value
                        setSelectedCity(city)
                        register('city').onChange(e)
                        
                        // Auto-populate pincode when city is selected
                        if (city) {
                          const pincode = getPincodeForCity(city)
                          setValue('pincode', pincode)
                        }
                      }}
                      className="input"
                      disabled={!selectedState}
                    >
                      <option value="">Select City</option>
                      {selectedState && INDIAN_CITIES_BY_STATE[selectedState as keyof typeof INDIAN_CITIES_BY_STATE]?.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                    {errors.city && (
                      <p className="text-red-600 text-xs mt-1">{errors.city.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pincode * 
                      <span className="text-xs text-gray-500 ml-1">(Auto-filled, editable)</span>
                    </label>
                    <input
                      type="text"
                      {...register('pincode')}
                      className="input"
                      placeholder="Auto-filled based on city"
                      maxLength={6}
                    />
                    {errors.pincode && (
                      <p className="text-red-600 text-xs mt-1">{errors.pincode.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status *
                    </label>
                    <select
                      {...register('status')}
                      className="input"
                    >
                      <option value="">Select Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="pending">Pending</option>
                      <option value="suspended">Suspended</option>
                    </select>
                    {errors.status && (
                      <p className="text-red-600 text-xs mt-1">{errors.status.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Assigned To *
                    </label>
                    <select
                      {...register('assignedTo')}
                      className="input"
                    >
                      <option value="">Select Agent</option>
                      <option value="agent1">John Smith</option>
                      <option value="agent2">Sarah Johnson</option>
                      <option value="agent3">Mike Wilson</option>
                      <option value="agent4">Lisa Brown</option>
                    </select>
                    {errors.assignedTo && (
                      <p className="text-red-600 text-xs mt-1">{errors.assignedTo.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    {...register('notes')}
                    rows={3}
                    className="input"
                    placeholder="Enter any additional notes about the customer"
                  />
                  {errors.notes && (
                    <p className="text-red-600 text-xs mt-1">{errors.notes.message}</p>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      setEditingCustomer(null)
                      setSelectedState('')
                      setSelectedCity('')
                      reset()
                    }}
                    className="btn btn-secondary btn-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary btn-md"
                  >
                    {editingCustomer ? 'Update Customer' : 'Add Customer'}
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