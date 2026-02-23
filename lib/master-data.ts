// Master data for insurance CRM system
export interface State {
  id: string
  name: string
  code: string
  countryId: string
  cities: City[]
}

export interface City {
  id: string
  name: string
  stateId: string
  pincode?: string
}

export interface OEM {
  id: string
  name: string
  code: string
  models: Model[]
}

export interface Model {
  id: string
  name: string
  code: string
  oemId: string
  variants: Variant[]
}

export interface Variant {
  id: string
  name: string
  code: string
  modelId: string
  fuelType: string
  cubicCapacity: number
  seatingCapacity: number
}

export interface Addon {
  id: string
  name: string
  description: string
  price: number
  category: string
  isActive: boolean
}

// Comprehensive Indian states and cities data
export const INDIAN_STATES: State[] = [
  {
    id: '1',
    name: 'Maharashtra',
    code: 'MH',
    countryId: 'IN',
    cities: [
      { id: '1', name: 'Mumbai', stateId: '1', pincode: '400001' },
      { id: '2', name: 'Pune', stateId: '1', pincode: '411001' },
      { id: '3', name: 'Nagpur', stateId: '1', pincode: '440001' },
      { id: '4', name: 'Thane', stateId: '1', pincode: '400601' },
      { id: '5', name: 'Nashik', stateId: '1', pincode: '422001' },
      { id: '6', name: 'Aurangabad', stateId: '1', pincode: '431001' },
      { id: '7', name: 'Solapur', stateId: '1', pincode: '413001' },
      { id: '8', name: 'Kolhapur', stateId: '1', pincode: '416001' },
      { id: '9', name: 'Amravati', stateId: '1', pincode: '444601' },
      { id: '10', name: 'Nanded', stateId: '1', pincode: '431601' }
    ]
  },
  {
    id: '2',
    name: 'Delhi',
    code: 'DL',
    countryId: 'IN',
    cities: [
      { id: '11', name: 'New Delhi', stateId: '2', pincode: '110001' },
      { id: '12', name: 'Central Delhi', stateId: '2', pincode: '110002' },
      { id: '13', name: 'East Delhi', stateId: '2', pincode: '110092' },
      { id: '14', name: 'North Delhi', stateId: '2', pincode: '110085' },
      { id: '15', name: 'South Delhi', stateId: '2', pincode: '110017' },
      { id: '16', name: 'West Delhi', stateId: '2', pincode: '110015' },
      { id: '17', name: 'North East Delhi', stateId: '2', pincode: '110051' },
      { id: '18', name: 'North West Delhi', stateId: '2', pincode: '110085' },
      { id: '19', name: 'South East Delhi', stateId: '2', pincode: '110017' },
      { id: '20', name: 'South West Delhi', stateId: '2', pincode: '110075' }
    ]
  },
  {
    id: '3',
    name: 'Karnataka',
    code: 'KA',
    countryId: 'IN',
    cities: [
      { id: '21', name: 'Bangalore', stateId: '3', pincode: '560001' },
      { id: '22', name: 'Mysore', stateId: '3', pincode: '570001' },
      { id: '23', name: 'Hubli', stateId: '3', pincode: '580001' },
      { id: '24', name: 'Mangalore', stateId: '3', pincode: '575001' },
      { id: '25', name: 'Belgaum', stateId: '3', pincode: '590001' },
      { id: '26', name: 'Gulbarga', stateId: '3', pincode: '585101' },
      { id: '27', name: 'Davanagere', stateId: '3', pincode: '577001' },
      { id: '28', name: 'Bellary', stateId: '3', pincode: '583101' },
      { id: '29', name: 'Bijapur', stateId: '3', pincode: '586101' },
      { id: '30', name: 'Shimoga', stateId: '3', pincode: '577201' }
    ]
  },
  {
    id: '4',
    name: 'Tamil Nadu',
    code: 'TN',
    countryId: 'IN',
    cities: [
      { id: '31', name: 'Chennai', stateId: '4', pincode: '600001' },
      { id: '32', name: 'Coimbatore', stateId: '4', pincode: '641001' },
      { id: '33', name: 'Madurai', stateId: '4', pincode: '625001' },
      { id: '34', name: 'Tiruchirappalli', stateId: '4', pincode: '620001' },
      { id: '35', name: 'Salem', stateId: '4', pincode: '636001' },
      { id: '36', name: 'Tirunelveli', stateId: '4', pincode: '627001' },
      { id: '37', name: 'Erode', stateId: '4', pincode: '638001' },
      { id: '38', name: 'Vellore', stateId: '4', pincode: '632001' },
      { id: '39', name: 'Thoothukudi', stateId: '4', pincode: '628001' },
      { id: '40', name: 'Dindigul', stateId: '4', pincode: '624001' }
    ]
  },
  {
    id: '5',
    name: 'Gujarat',
    code: 'GJ',
    countryId: 'IN',
    cities: [
      { id: '41', name: 'Ahmedabad', stateId: '5', pincode: '380001' },
      { id: '42', name: 'Surat', stateId: '5', pincode: '395001' },
      { id: '43', name: 'Vadodara', stateId: '5', pincode: '390001' },
      { id: '44', name: 'Rajkot', stateId: '5', pincode: '360001' },
      { id: '45', name: 'Bhavnagar', stateId: '5', pincode: '364001' },
      { id: '46', name: 'Jamnagar', stateId: '5', pincode: '361001' },
      { id: '47', name: 'Junagadh', stateId: '5', pincode: '362001' },
      { id: '48', name: 'Gandhinagar', stateId: '5', pincode: '382010' },
      { id: '49', name: 'Nadiad', stateId: '5', pincode: '387001' },
      { id: '50', name: 'Morbi', stateId: '5', pincode: '363641' }
    ]
  },
  {
    id: '6',
    name: 'West Bengal',
    code: 'WB',
    countryId: 'IN',
    cities: [
      { id: '51', name: 'Kolkata', stateId: '6', pincode: '700001' },
      { id: '52', name: 'Howrah', stateId: '6', pincode: '711101' },
      { id: '53', name: 'Durgapur', stateId: '6', pincode: '713201' },
      { id: '54', name: 'Asansol', stateId: '6', pincode: '713301' },
      { id: '55', name: 'Siliguri', stateId: '6', pincode: '734001' },
      { id: '56', name: 'Malda', stateId: '6', pincode: '732101' },
      { id: '57', name: 'Bardhaman', stateId: '6', pincode: '713101' },
      { id: '58', name: 'Baharampur', stateId: '6', pincode: '742101' },
      { id: '59', name: 'Habra', stateId: '6', pincode: '743263' },
      { id: '60', name: 'Kharagpur', stateId: '6', pincode: '721301' }
    ]
  },
  {
    id: '7',
    name: 'Uttar Pradesh',
    code: 'UP',
    countryId: 'IN',
    cities: [
      { id: '61', name: 'Lucknow', stateId: '7', pincode: '226001' },
      { id: '62', name: 'Kanpur', stateId: '7', pincode: '208001' },
      { id: '63', name: 'Agra', stateId: '7', pincode: '282001' },
      { id: '64', name: 'Varanasi', stateId: '7', pincode: '221001' },
      { id: '65', name: 'Meerut', stateId: '7', pincode: '250001' },
      { id: '66', name: 'Allahabad', stateId: '7', pincode: '211001' },
      { id: '67', name: 'Bareilly', stateId: '7', pincode: '243001' },
      { id: '68', name: 'Ghaziabad', stateId: '7', pincode: '201001' },
      { id: '69', name: 'Moradabad', stateId: '7', pincode: '244001' },
      { id: '70', name: 'Aligarh', stateId: '7', pincode: '202001' }
    ]
  },
  {
    id: '8',
    name: 'Rajasthan',
    code: 'RJ',
    countryId: 'IN',
    cities: [
      { id: '71', name: 'Jaipur', stateId: '8', pincode: '302001' },
      { id: '72', name: 'Jodhpur', stateId: '8', pincode: '342001' },
      { id: '73', name: 'Udaipur', stateId: '8', pincode: '313001' },
      { id: '74', name: 'Kota', stateId: '8', pincode: '324001' },
      { id: '75', name: 'Bikaner', stateId: '8', pincode: '334001' },
      { id: '76', name: 'Ajmer', stateId: '8', pincode: '305001' },
      { id: '77', name: 'Bharatpur', stateId: '8', pincode: '321001' },
      { id: '78', name: 'Alwar', stateId: '8', pincode: '301001' },
      { id: '79', name: 'Sri Ganganagar', stateId: '8', pincode: '335001' },
      { id: '80', name: 'Pali', stateId: '8', pincode: '306401' }
    ]
  },
  {
    id: '9',
    name: 'Madhya Pradesh',
    code: 'MP',
    countryId: 'IN',
    cities: [
      { id: '81', name: 'Bhopal', stateId: '9', pincode: '462001' },
      { id: '82', name: 'Indore', stateId: '9', pincode: '452001' },
      { id: '83', name: 'Gwalior', stateId: '9', pincode: '474001' },
      { id: '84', name: 'Jabalpur', stateId: '9', pincode: '482001' },
      { id: '85', name: 'Ujjain', stateId: '9', pincode: '456001' },
      { id: '86', name: 'Sagar', stateId: '9', pincode: '470001' },
      { id: '87', name: 'Dewas', stateId: '9', pincode: '455001' },
      { id: '88', name: 'Satna', stateId: '9', pincode: '485001' },
      { id: '89', name: 'Ratlam', stateId: '9', pincode: '457001' },
      { id: '90', name: 'Rewa', stateId: '9', pincode: '486001' },
      { id: '91', name: 'Katni', stateId: '9', pincode: '483501' },
      { id: '92', name: 'Singrauli', stateId: '9', pincode: '486889' },
      { id: '93', name: 'Burhanpur', stateId: '9', pincode: '450331' },
      { id: '94', name: 'Khandwa', stateId: '9', pincode: '450001' },
      { id: '95', name: 'Chhindwara', stateId: '9', pincode: '480001' }
    ]
  }
]

// OEM and Vehicle Data
export const OEM_DATA: OEM[] = [
  {
    id: '1',
    name: 'Maruti Suzuki',
    code: 'MS',
    models: [
      {
        id: '1',
        name: 'Swift',
        code: 'SWIFT',
        oemId: '1',
        variants: [
          { id: '1', name: 'Swift LXI', code: 'LXI', modelId: '1', fuelType: 'Petrol', cubicCapacity: 1197, seatingCapacity: 5 },
          { id: '2', name: 'Swift VXI', code: 'VXI', modelId: '1', fuelType: 'Petrol', cubicCapacity: 1197, seatingCapacity: 5 },
          { id: '3', name: 'Swift ZXI', code: 'ZXI', modelId: '1', fuelType: 'Petrol', cubicCapacity: 1197, seatingCapacity: 5 },
          { id: '4', name: 'Swift ZXI+', code: 'ZXI+', modelId: '1', fuelType: 'Petrol', cubicCapacity: 1197, seatingCapacity: 5 },
          { id: '5', name: 'Swift LDI', code: 'LDI', modelId: '1', fuelType: 'Diesel', cubicCapacity: 1248, seatingCapacity: 5 },
          { id: '6', name: 'Swift VDI', code: 'VDI', modelId: '1', fuelType: 'Diesel', cubicCapacity: 1248, seatingCapacity: 5 }
        ]
      },
      {
        id: '2',
        name: 'Baleno',
        code: 'BALENO',
        oemId: '1',
        variants: [
          { id: '7', name: 'Baleno Sigma', code: 'SIGMA', modelId: '2', fuelType: 'Petrol', cubicCapacity: 1197, seatingCapacity: 5 },
          { id: '8', name: 'Baleno Delta', code: 'DELTA', modelId: '2', fuelType: 'Petrol', cubicCapacity: 1197, seatingCapacity: 5 },
          { id: '9', name: 'Baleno Zeta', code: 'ZETA', modelId: '2', fuelType: 'Petrol', cubicCapacity: 1197, seatingCapacity: 5 },
          { id: '10', name: 'Baleno Alpha', code: 'ALPHA', modelId: '2', fuelType: 'Petrol', cubicCapacity: 1197, seatingCapacity: 5 }
        ]
      },
      {
        id: '3',
        name: 'Creta',
        code: 'CRETA',
        oemId: '1',
        variants: [
          { id: '11', name: 'Creta E', code: 'E', modelId: '3', fuelType: 'Petrol', cubicCapacity: 1497, seatingCapacity: 5 },
          { id: '12', name: 'Creta EX', code: 'EX', modelId: '3', fuelType: 'Petrol', cubicCapacity: 1497, seatingCapacity: 5 },
          { id: '13', name: 'Creta S', code: 'S', modelId: '3', fuelType: 'Petrol', cubicCapacity: 1497, seatingCapacity: 5 },
          { id: '14', name: 'Creta SX', code: 'SX', modelId: '3', fuelType: 'Petrol', cubicCapacity: 1497, seatingCapacity: 5 }
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'Hyundai',
    code: 'HY',
    models: [
      {
        id: '4',
        name: 'i20',
        code: 'I20',
        oemId: '2',
        variants: [
          { id: '15', name: 'i20 Magna', code: 'MAGNA', modelId: '4', fuelType: 'Petrol', cubicCapacity: 1197, seatingCapacity: 5 },
          { id: '16', name: 'i20 Sportz', code: 'SPORTZ', modelId: '4', fuelType: 'Petrol', cubicCapacity: 1197, seatingCapacity: 5 },
          { id: '17', name: 'i20 Asta', code: 'ASTA', modelId: '4', fuelType: 'Petrol', cubicCapacity: 1197, seatingCapacity: 5 },
          { id: '18', name: 'i20 Asta (O)', code: 'ASTA_O', modelId: '4', fuelType: 'Petrol', cubicCapacity: 1197, seatingCapacity: 5 }
        ]
      },
      {
        id: '5',
        name: 'Verna',
        code: 'VERNA',
        oemId: '2',
        variants: [
          { id: '19', name: 'Verna E', code: 'E', modelId: '5', fuelType: 'Petrol', cubicCapacity: 1497, seatingCapacity: 5 },
          { id: '20', name: 'Verna EX', code: 'EX', modelId: '5', fuelType: 'Petrol', cubicCapacity: 1497, seatingCapacity: 5 },
          { id: '21', name: 'Verna S', code: 'S', modelId: '5', fuelType: 'Petrol', cubicCapacity: 1497, seatingCapacity: 5 },
          { id: '22', name: 'Verna SX', code: 'SX', modelId: '5', fuelType: 'Petrol', cubicCapacity: 1497, seatingCapacity: 5 }
        ]
      }
    ]
  },
  {
    id: '3',
    name: 'Tata',
    code: 'TT',
    models: [
      {
        id: '6',
        name: 'Nexon',
        code: 'NEXON',
        oemId: '3',
        variants: [
          { id: '23', name: 'Nexon XE', code: 'XE', modelId: '6', fuelType: 'Petrol', cubicCapacity: 1199, seatingCapacity: 5 },
          { id: '24', name: 'Nexon XM', code: 'XM', modelId: '6', fuelType: 'Petrol', cubicCapacity: 1199, seatingCapacity: 5 },
          { id: '25', name: 'Nexon XZ+', code: 'XZ+', modelId: '6', fuelType: 'Petrol', cubicCapacity: 1199, seatingCapacity: 5 },
          { id: '26', name: 'Nexon XZ+ Lux', code: 'XZ+LUX', modelId: '6', fuelType: 'Petrol', cubicCapacity: 1199, seatingCapacity: 5 }
        ]
      },
      {
        id: '7',
        name: 'Tiago',
        code: 'TIAGO',
        oemId: '3',
        variants: [
          { id: '27', name: 'Tiago XE', code: 'XE', modelId: '7', fuelType: 'Petrol', cubicCapacity: 1199, seatingCapacity: 5 },
          { id: '28', name: 'Tiago XM', code: 'XM', modelId: '7', fuelType: 'Petrol', cubicCapacity: 1199, seatingCapacity: 5 },
          { id: '29', name: 'Tiago XZ', code: 'XZ', modelId: '7', fuelType: 'Petrol', cubicCapacity: 1199, seatingCapacity: 5 },
          { id: '30', name: 'Tiago XZ+', code: 'XZ+', modelId: '7', fuelType: 'Petrol', cubicCapacity: 1199, seatingCapacity: 5 }
        ]
      }
    ]
  },
  {
    id: '4',
    name: 'Honda',
    code: 'HN',
    models: [
      {
        id: '8',
        name: 'City',
        code: 'CITY',
        oemId: '4',
        variants: [
          { id: '31', name: 'City V', code: 'V', modelId: '8', fuelType: 'Petrol', cubicCapacity: 1498, seatingCapacity: 5 },
          { id: '32', name: 'City VX', code: 'VX', modelId: '8', fuelType: 'Petrol', cubicCapacity: 1498, seatingCapacity: 5 },
          { id: '33', name: 'City ZX', code: 'ZX', modelId: '8', fuelType: 'Petrol', cubicCapacity: 1498, seatingCapacity: 5 },
          { id: '34', name: 'City ZX CVT', code: 'ZX_CVT', modelId: '8', fuelType: 'Petrol', cubicCapacity: 1498, seatingCapacity: 5 }
        ]
      }
    ]
  },
  {
    id: '5',
    name: 'Toyota',
    code: 'TY',
    models: [
      {
        id: '9',
        name: 'Innova Crysta',
        code: 'INNOVA_CRYSTA',
        oemId: '5',
        variants: [
          { id: '35', name: 'Innova Crysta G', code: 'G', modelId: '9', fuelType: 'Diesel', cubicCapacity: 2393, seatingCapacity: 7 },
          { id: '36', name: 'Innova Crysta GX', code: 'GX', modelId: '9', fuelType: 'Diesel', cubicCapacity: 2393, seatingCapacity: 7 },
          { id: '37', name: 'Innova Crysta V', code: 'V', modelId: '9', fuelType: 'Diesel', cubicCapacity: 2393, seatingCapacity: 7 },
          { id: '38', name: 'Innova Crysta VX', code: 'VX', modelId: '9', fuelType: 'Diesel', cubicCapacity: 2393, seatingCapacity: 7 },
          { id: '39', name: 'Innova Crysta ZX', code: 'ZX', modelId: '9', fuelType: 'Diesel', cubicCapacity: 2393, seatingCapacity: 7 }
        ]
      }
    ]
  }
]

// Add-on data
export const ADDON_DATA: Addon[] = [
  {
    id: '1',
    name: 'Zero Depreciation',
    description: 'Covers the full cost of replacement parts without depreciation deduction',
    price: 2500,
    category: 'Motor',
    isActive: true
  },
  {
    id: '2',
    name: 'Engine Protection',
    description: 'Covers damage to engine due to water ingress or oil leakage',
    price: 1200,
    category: 'Motor',
    isActive: true
  },
  {
    id: '3',
    name: 'Roadside Assistance',
    description: '24/7 roadside assistance including towing, battery jump-start, and fuel delivery',
    price: 800,
    category: 'Motor',
    isActive: true
  },
  {
    id: '4',
    name: 'Key Replacement',
    description: 'Covers cost of replacing lost or stolen car keys',
    price: 1500,
    category: 'Motor',
    isActive: true
  },
  {
    id: '5',
    name: 'Consumables',
    description: 'Covers cost of consumables like engine oil, coolant, brake oil during repairs',
    price: 1000,
    category: 'Motor',
    isActive: true
  },
  {
    id: '6',
    name: 'Return to Invoice',
    description: 'Pays the full invoice value in case of total loss or theft',
    price: 3000,
    category: 'Motor',
    isActive: true
  },
  {
    id: '7',
    name: 'Personal Accident Cover',
    description: 'Covers accidental death and permanent disability of driver and passengers',
    price: 500,
    category: 'Motor',
    isActive: true
  },
  {
    id: '8',
    name: 'NCB Protection',
    description: 'Protects No Claim Bonus even if a claim is made',
    price: 1800,
    category: 'Motor',
    isActive: true
  }
]

// Utility functions
export function getStates(): State[] {
  return INDIAN_STATES
}

export function getCitiesByState(stateId: string): City[] {
  const state = INDIAN_STATES.find(s => s.id === stateId)
  return state ? state.cities : []
}

export function getOEMs(): OEM[] {
  return OEM_DATA
}

export function getModelsByOEM(oemId: string): Model[] {
  const oem = OEM_DATA.find(o => o.id === oemId)
  return oem ? oem.models : []
}

export function getVariantsByModel(modelId: string): Variant[] {
  for (const oem of OEM_DATA) {
    const model = oem.models.find(m => m.id === modelId)
    if (model) {
      return model.variants
    }
  }
  return []
}

export function getAddons(): Addon[] {
  return ADDON_DATA.filter(addon => addon.isActive)
}

// Year validation functions
export function getValidYears(isNewVehicle: boolean): number[] {
  const currentYear = new Date().getFullYear()
  const years: number[] = []
  
  if (isNewVehicle) {
    // For new vehicles: current year and previous 1 year
    years.push(currentYear - 1, currentYear)
  } else {
    // For rollover: current year and previous 13 years
    for (let i = 0; i <= 13; i++) {
      years.push(currentYear - i)
    }
  }
  
  return years.sort((a, b) => b - a) // Sort in descending order
}

// Mobile number validation
export function validateMobileNumber(mobile: string): boolean {
  // Indian mobile number validation: 10 digits starting with 6, 7, 8, or 9
  const mobileRegex = /^[6-9]\d{9}$/
  return mobileRegex.test(mobile)
}

export function formatMobileNumber(mobile: string): string {
  // Remove all non-digit characters
  const cleaned = mobile.replace(/\D/g, '')
  
  // If it's 10 digits, add +91 prefix
  if (cleaned.length === 10) {
    return `+91-${cleaned}`
  }
  
  return mobile
}
