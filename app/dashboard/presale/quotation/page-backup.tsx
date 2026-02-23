'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  ArrowLeftIcon, 
  DocumentIcon, 
  UserIcon, 
  BuildingOfficeIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  CalculatorIcon, 
  PrinterIcon,
  TruckIcon,
  MapPinIcon,
  CurrencyRupeeIcon,
  ShieldCheckIcon,
  PlusIcon,
  MinusIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const quotationSchema = z.object({
  customerType: z.enum(['INDIVIDUAL', 'CORPORATE']),
  // Individual fields
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  // Corporate fields
  companyName: z.string().optional(),
  registrationNumber: z.string().optional(),
  // Common fields
  email: z.string().email(),
  phone: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  pincode: z.string(),
  // Policy details
  policyType: z.string(),
  // Gen-Motor specific fields
  oem: z.string().optional(),
  modelName: z.string().optional(),
  variant: z.string().optional(),
  yearOfManufacture: z.string().optional(),
  registrationCity: z.string().optional(),
  exShowroomPrice: z.number().optional(),
  // Rollover specific fields
  isRollover: z.string().optional(),
  previousNCB: z.string().optional(),
  claimAvailed: z.boolean().optional(),
  // Quotation details
  coverageAmount: z.number().optional(),
  premiumAmount: z.number().optional(),
  policyTerm: z.number(),
  quotationDate: z.string(),
  validityPeriod: z.number().default(30),
  // Proposal form fields
  nomineeName: z.string().optional(),
  nomineeRelationship: z.string().optional(),
  nomineeDOB: z.string().optional(),
  paymentMode: z.string().optional()
})

type QuotationFormData = z.infer<typeof quotationSchema>

// Mock data for dropdowns
const manufacturers = [
  { id: '1', name: 'Maruti Suzuki' },
  { id: '2', name: 'Hyundai' },
  { id: '3', name: 'Tata Motors' },
  { id: '4', name: 'Mahindra' },
  { id: '5', name: 'Honda' },
  { id: '6', name: 'Toyota' },
  { id: '7', name: 'Ford' },
  { id: '8', name: 'Volkswagen' },
  { id: '9', name: 'Skoda' },
  { id: '10', name: 'Nissan' },
  { id: '11', name: 'Renault' },
  { id: '12', name: 'Kia' },
  { id: '13', name: 'MG Motor' },
  { id: '14', name: 'Jeep' },
  { id: '15', name: 'Volvo' },
  { id: '16', name: 'BMW' },
  { id: '17', name: 'Mercedes-Benz' },
  { id: '18', name: 'Audi' },
  { id: '19', name: 'Jaguar' },
  { id: '20', name: 'Land Rover' }
]

const models = {
  '1': [ // Maruti Suzuki
    { id: '1', name: 'Swift' },
    { id: '2', name: 'Baleno' },
    { id: '3', name: 'Dzire' },
    { id: '4', name: 'Vitara Brezza' },
    { id: '5', name: 'Ertiga' },
    { id: '6', name: 'Celerio' },
    { id: '7', name: 'Wagon R' },
    { id: '8', name: 'Alto' },
    { id: '9', name: 'S-Cross' },
    { id: '10', name: 'XL6' }
  ],
  '2': [ // Hyundai
    { id: '11', name: 'i20' },
    { id: '12', name: 'Creta' },
    { id: '13', name: 'Verna' },
    { id: '14', name: 'Venue' },
    { id: '15', name: 'Alcazar' },
    { id: '16', name: 'Aura' },
    { id: '17', name: 'Grand i10 Nios' },
    { id: '18', name: 'Tucson' },
    { id: '19', name: 'Elantra' },
    { id: '20', name: 'Kona Electric' }
  ],
  '3': [ // Tata Motors
    { id: '21', name: 'Nexon' },
    { id: '22', name: 'Harrier' },
    { id: '23', name: 'Safari' },
    { id: '24', name: 'Altroz' },
    { id: '25', name: 'Tiago' },
    { id: '26', name: 'Tigor' },
    { id: '27', name: 'Punch' },
    { id: '28', name: 'Sierra' },
    { id: '29', name: 'Hexa' },
    { id: '30', name: 'Zest' }
  ],
  '4': [ // Mahindra
    { id: '31', name: 'XUV300' },
    { id: '32', name: 'Scorpio' },
    { id: '33', name: 'XUV700' },
    { id: '34', name: 'Thar' },
    { id: '35', name: 'Bolero' },
    { id: '36', name: 'Marazzo' },
    { id: '37', name: 'KUV100' },
    { id: '38', name: 'TUV300' },
    { id: '39', name: 'XUV500' },
    { id: '40', name: 'Verito' }
  ],
  '5': [ // Honda
    { id: '41', name: 'City' },
    { id: '42', name: 'Amaze' },
    { id: '43', name: 'WR-V' },
    { id: '44', name: 'Jazz' },
    { id: '45', name: 'Civic' },
    { id: '46', name: 'CR-V' },
    { id: '47', name: 'Accord' },
    { id: '48', name: 'Brio' }
  ],
  '6': [ // Toyota
    { id: '49', name: 'Innova Crysta' },
    { id: '50', name: 'Fortuner' },
    { id: '51', name: 'Glanza' },
    { id: '52', name: 'Urban Cruiser' },
    { id: '53', name: 'Camry' },
    { id: '54', name: 'Vellfire' },
    { id: '55', name: 'Prius' },
    { id: '56', name: 'Corolla Altis' }
  ],
  '7': [ // Ford
    { id: '57', name: 'EcoSport' },
    { id: '58', name: 'Endeavour' },
    { id: '59', name: 'Figo' },
    { id: '60', name: 'Aspire' },
    { id: '61', name: 'Freestyle' }
  ],
  '8': [ // Volkswagen
    { id: '62', name: 'Polo' },
    { id: '63', name: 'Vento' },
    { id: '64', name: 'Tiguan' },
    { id: '65', name: 'Passat' },
    { id: '66', name: 'Jetta' }
  ],
  '9': [ // Skoda
    { id: '67', name: 'Rapid' },
    { id: '68', name: 'Octavia' },
    { id: '69', name: 'Superb' },
    { id: '70', name: 'Kodiaq' },
    { id: '71', name: 'Kushaq' }
  ],
  '10': [ // Nissan
    { id: '72', name: 'Magnite' },
    { id: '73', name: 'Kicks' },
    { id: '74', name: 'Micra' },
    { id: '75', name: 'Sunny' },
    { id: '76', name: 'Terrano' }
  ]
}

const variants = {
  '1': [ // Swift
    { id: '1', name: 'Swift LXI' },
    { id: '2', name: 'Swift VXI' },
    { id: '3', name: 'Swift ZXI' },
    { id: '4', name: 'Swift ZXI+' }
  ],
  '2': [ // Baleno
    { id: '5', name: 'Baleno Sigma' },
    { id: '6', name: 'Baleno Delta' },
    { id: '7', name: 'Baleno Zeta' },
    { id: '8', name: 'Baleno Alpha' }
  ],
  '3': [ // Dzire
    { id: '9', name: 'Dzire LXI' },
    { id: '10', name: 'Dzire VXI' },
    { id: '11', name: 'Dzire ZXI' },
    { id: '12', name: 'Dzire ZXI+' }
  ],
  '4': [ // Vitara Brezza
    { id: '13', name: 'Vitara Brezza LDI' },
    { id: '14', name: 'Vitara Brezza VDI' },
    { id: '15', name: 'Vitara Brezza ZDI' },
    { id: '16', name: 'Vitara Brezza ZDI+' }
  ],
  '5': [ // Ertiga
    { id: '17', name: 'Ertiga L' },
    { id: '18', name: 'Ertiga V' },
    { id: '19', name: 'Ertiga Z' },
    { id: '20', name: 'Ertiga Z+' }
  ],
  '11': [ // i20
    { id: '21', name: 'i20 Magna' },
    { id: '22', name: 'i20 Sportz' },
    { id: '23', name: 'i20 Asta' },
    { id: '24', name: 'i20 Asta (O)' }
  ],
  '12': [ // Creta
    { id: '25', name: 'Creta E' },
    { id: '26', name: 'Creta EX' },
    { id: '27', name: 'Creta S' },
    { id: '28', name: 'Creta SX' },
    { id: '29', name: 'Creta SX (O)' }
  ],
  '13': [ // Verna
    { id: '30', name: 'Verna S' },
    { id: '31', name: 'Verna SX' },
    { id: '32', name: 'Verna SX (O)' },
    { id: '33', name: 'Verna SX Turbo' }
  ],
  '21': [ // Nexon
    { id: '34', name: 'Nexon XE' },
    { id: '35', name: 'Nexon XM' },
    { id: '36', name: 'Nexon XZ+' },
    { id: '37', name: 'Nexon XZ+ LUX' },
    { id: '38', name: 'Nexon XZ+ LUX (O)' }
  ],
  '22': [ // Harrier
    { id: '39', name: 'Harrier XE' },
    { id: '40', name: 'Harrier XM' },
    { id: '41', name: 'Harrier XZ' },
    { id: '42', name: 'Harrier XZ+' },
    { id: '43', name: 'Harrier XZ+ (O)' }
  ],
  '31': [ // XUV300
    { id: '44', name: 'XUV300 W4' },
    { id: '45', name: 'XUV300 W6' },
    { id: '46', name: 'XUV300 W8' },
    { id: '47', name: 'XUV300 W8 (O)' }
  ],
  '32': [ // Scorpio
    { id: '48', name: 'Scorpio S2' },
    { id: '49', name: 'Scorpio S4' },
    { id: '50', name: 'Scorpio S6' },
    { id: '51', name: 'Scorpio S8' },
    { id: '52', name: 'Scorpio S11' }
  ],
  '41': [ // City
    { id: '53', name: 'City V' },
    { id: '54', name: 'City VX' },
    { id: '55', name: 'City ZX' },
    { id: '56', name: 'City ZX (O)' }
  ],
  '42': [ // Amaze
    { id: '57', name: 'Amaze V' },
    { id: '58', name: 'Amaze VX' },
    { id: '59', name: 'Amaze ZX' }
  ],
  '49': [ // Innova Crysta
    { id: '60', name: 'Innova Crysta G' },
    { id: '61', name: 'Innova Crysta GX' },
    { id: '62', name: 'Innova Crysta VX' },
    { id: '63', name: 'Innova Crysta ZX' }
  ],
  '50': [ // Fortuner
    { id: '64', name: 'Fortuner 2.7' },
    { id: '65', name: 'Fortuner 2.8' },
    { id: '66', name: 'Fortuner 4x4' }
  ]
}

const states = [
  { id: '1', name: 'Andhra Pradesh' },
  { id: '2', name: 'Arunachal Pradesh' },
  { id: '3', name: 'Assam' },
  { id: '4', name: 'Bihar' },
  { id: '5', name: 'Chhattisgarh' },
  { id: '6', name: 'Goa' },
  { id: '7', name: 'Gujarat' },
  { id: '8', name: 'Haryana' },
  { id: '9', name: 'Himachal Pradesh' },
  { id: '10', name: 'Jharkhand' },
  { id: '11', name: 'Karnataka' },
  { id: '12', name: 'Kerala' },
  { id: '13', name: 'Madhya Pradesh' },
  { id: '14', name: 'Maharashtra' },
  { id: '15', name: 'Manipur' },
  { id: '16', name: 'Meghalaya' },
  { id: '17', name: 'Mizoram' },
  { id: '18', name: 'Nagaland' },
  { id: '19', name: 'Odisha' },
  { id: '20', name: 'Punjab' },
  { id: '21', name: 'Rajasthan' },
  { id: '22', name: 'Sikkim' },
  { id: '23', name: 'Tamil Nadu' },
  { id: '24', name: 'Telangana' },
  { id: '25', name: 'Tripura' },
  { id: '26', name: 'Uttar Pradesh' },
  { id: '27', name: 'Uttarakhand' },
  { id: '28', name: 'West Bengal' },
  { id: '29', name: 'Delhi' },
  { id: '30', name: 'Jammu and Kashmir' },
  { id: '31', name: 'Ladakh' }
]

const cities = {
  '1': [ // Andhra Pradesh
    { id: '1', name: 'Visakhapatnam' },
    { id: '2', name: 'Vijayawada' },
    { id: '3', name: 'Guntur' },
    { id: '4', name: 'Nellore' },
    { id: '5', name: 'Kurnool' },
    { id: '6', name: 'Rajahmundry' },
    { id: '7', name: 'Kakinada' },
    { id: '8', name: 'Tirupati' }
  ],
  '3': [ // Assam
    { id: '9', name: 'Guwahati' },
    { id: '10', name: 'Silchar' },
    { id: '11', name: 'Dibrugarh' },
    { id: '12', name: 'Jorhat' },
    { id: '13', name: 'Nagaon' }
  ],
  '4': [ // Bihar
    { id: '14', name: 'Patna' },
    { id: '15', name: 'Gaya' },
    { id: '16', name: 'Bhagalpur' },
    { id: '17', name: 'Muzaffarpur' },
    { id: '18', name: 'Purnia' }
  ],
  '5': [ // Chhattisgarh
    { id: '19', name: 'Raipur' },
    { id: '20', name: 'Bhilai' },
    { id: '21', name: 'Korba' },
    { id: '22', name: 'Bilaspur' }
  ],
  '6': [ // Goa
    { id: '23', name: 'Panaji' },
    { id: '24', name: 'Margao' },
    { id: '25', name: 'Vasco da Gama' }
  ],
  '7': [ // Gujarat
    { id: '26', name: 'Ahmedabad' },
    { id: '27', name: 'Surat' },
    { id: '28', name: 'Vadodara' },
    { id: '29', name: 'Rajkot' },
    { id: '30', name: 'Bhavnagar' },
    { id: '31', name: 'Jamnagar' },
    { id: '32', name: 'Gandhinagar' }
  ],
  '8': [ // Haryana
    { id: '33', name: 'Gurgaon' },
    { id: '34', name: 'Faridabad' },
    { id: '35', name: 'Panipat' },
    { id: '36', name: 'Ambala' },
    { id: '37', name: 'Yamunanagar' },
    { id: '38', name: 'Rohtak' },
    { id: '39', name: 'Hisar' },
    { id: '40', name: 'Karnal' }
  ],
  '9': [ // Himachal Pradesh
    { id: '41', name: 'Shimla' },
    { id: '42', name: 'Solan' },
    { id: '43', name: 'Dharamshala' },
    { id: '44', name: 'Mandi' }
  ],
  '10': [ // Jharkhand
    { id: '45', name: 'Ranchi' },
    { id: '46', name: 'Jamshedpur' },
    { id: '47', name: 'Dhanbad' },
    { id: '48', name: 'Bokaro' }
  ],
  '11': [ // Karnataka
    { id: '49', name: 'Bangalore' },
    { id: '50', name: 'Mysore' },
    { id: '51', name: 'Hubli' },
    { id: '52', name: 'Mangalore' },
    { id: '53', name: 'Belgaum' },
    { id: '54', name: 'Gulbarga' },
    { id: '55', name: 'Davangere' }
  ],
  '12': [ // Kerala
    { id: '56', name: 'Thiruvananthapuram' },
    { id: '57', name: 'Kochi' },
    { id: '58', name: 'Kozhikode' },
    { id: '59', name: 'Thrissur' },
    { id: '60', name: 'Kollam' }
  ],
  '13': [ // Madhya Pradesh
    { id: '61', name: 'Bhopal' },
    { id: '62', name: 'Indore' },
    { id: '63', name: 'Gwalior' },
    { id: '64', name: 'Jabalpur' },
    { id: '65', name: 'Ujjain' },
    { id: '66', name: 'Sagar' }
  ],
  '14': [ // Maharashtra
    { id: '67', name: 'Mumbai' },
    { id: '68', name: 'Pune' },
    { id: '69', name: 'Nagpur' },
    { id: '70', name: 'Nashik' },
    { id: '71', name: 'Aurangabad' },
    { id: '72', name: 'Solapur' },
    { id: '73', name: 'Amravati' },
    { id: '74', name: 'Kolhapur' },
    { id: '75', name: 'Sangli' },
    { id: '76', name: 'Jalgaon' },
    { id: '77', name: 'Akola' },
    { id: '78', name: 'Latur' },
    { id: '79', name: 'Dhule' },
    { id: '80', name: 'Ahmednagar' }
  ],
  '15': [ // Manipur
    { id: '81', name: 'Imphal' }
  ],
  '16': [ // Meghalaya
    { id: '82', name: 'Shillong' }
  ],
  '17': [ // Mizoram
    { id: '83', name: 'Aizawl' }
  ],
  '18': [ // Nagaland
    { id: '84', name: 'Kohima' }
  ],
  '19': [ // Odisha
    { id: '85', name: 'Bhubaneswar' },
    { id: '86', name: 'Cuttack' },
    { id: '87', name: 'Rourkela' },
    { id: '88', name: 'Brahmapur' }
  ],
  '20': [ // Punjab
    { id: '89', name: 'Ludhiana' },
    { id: '90', name: 'Amritsar' },
    { id: '91', name: 'Jalandhar' },
    { id: '92', name: 'Patiala' },
    { id: '93', name: 'Bathinda' }
  ],
  '21': [ // Rajasthan
    { id: '94', name: 'Jaipur' },
    { id: '95', name: 'Jodhpur' },
    { id: '96', name: 'Kota' },
    { id: '97', name: 'Bikaner' },
    { id: '98', name: 'Ajmer' },
    { id: '99', name: 'Udaipur' },
    { id: '100', name: 'Bhilwara' }
  ],
  '22': [ // Sikkim
    { id: '101', name: 'Gangtok' }
  ],
  '23': [ // Tamil Nadu
    { id: '102', name: 'Chennai' },
    { id: '103', name: 'Coimbatore' },
    { id: '104', name: 'Madurai' },
    { id: '105', name: 'Salem' },
    { id: '106', name: 'Tiruchirappalli' },
    { id: '107', name: 'Tirunelveli' },
    { id: '108', name: 'Erode' },
    { id: '109', name: 'Vellore' }
  ],
  '24': [ // Telangana
    { id: '110', name: 'Hyderabad' },
    { id: '111', name: 'Warangal' },
    { id: '112', name: 'Nizamabad' },
    { id: '113', name: 'Khammam' }
  ],
  '25': [ // Tripura
    { id: '114', name: 'Agartala' }
  ],
  '26': [ // Uttar Pradesh
    { id: '115', name: 'Lucknow' },
    { id: '116', name: 'Kanpur' },
    { id: '117', name: 'Ghaziabad' },
    { id: '118', name: 'Agra' },
    { id: '119', name: 'Varanasi' },
    { id: '120', name: 'Meerut' },
    { id: '121', name: 'Allahabad' },
    { id: '122', name: 'Bareilly' },
    { id: '123', name: 'Aligarh' },
    { id: '124', name: 'Moradabad' }
  ],
  '27': [ // Uttarakhand
    { id: '125', name: 'Dehradun' },
    { id: '126', name: 'Haridwar' },
    { id: '127', name: 'Roorkee' },
    { id: '128', name: 'Haldwani' }
  ],
  '28': [ // West Bengal
    { id: '129', name: 'Kolkata' },
    { id: '130', name: 'Howrah' },
    { id: '131', name: 'Durgapur' },
    { id: '132', name: 'Asansol' },
    { id: '133', name: 'Siliguri' }
  ],
  '29': [ // Delhi
    { id: '134', name: 'New Delhi' },
    { id: '135', name: 'Delhi' }
  ],
  '30': [ // Jammu and Kashmir
    { id: '136', name: 'Srinagar' },
    { id: '137', name: 'Jammu' }
  ],
  '31': [ // Ladakh
    { id: '138', name: 'Leh' },
    { id: '139', name: 'Kargil' }
  ]
}

const policyTerms = [
  { id: '1', name: '1 Year', value: 1 },
  { id: '2', name: '2 Years', value: 2 },
  { id: '3', name: '3 Years', value: 3 },
  { id: '4', name: '4 Years', value: 4 },
  { id: '5', name: '5 Years', value: 5 }
]

const cityZones = [
  // Zone A (Metro Cities)
  { id: '1', name: 'Mumbai - Zone A' },
  { id: '2', name: 'Delhi - Zone A' },
  { id: '3', name: 'Chennai - Zone A' },
  { id: '4', name: 'Kolkata - Zone A' },
  { id: '5', name: 'Bangalore - Zone A' },
  { id: '6', name: 'Hyderabad - Zone A' },
  { id: '7', name: 'Pune - Zone A' },
  { id: '8', name: 'Ahmedabad - Zone A' },
  
  // Zone B (Tier 1 Cities)
  { id: '9', name: 'Jaipur - Zone B' },
  { id: '10', name: 'Lucknow - Zone B' },
  { id: '11', name: 'Bhopal - Zone B' },
  { id: '12', name: 'Chandigarh - Zone B' },
  { id: '13', name: 'Indore - Zone B' },
  { id: '14', name: 'Surat - Zone B' },
  { id: '15', name: 'Kanpur - Zone B' },
  { id: '16', name: 'Nagpur - Zone B' },
  { id: '17', name: 'Coimbatore - Zone B' },
  { id: '18', name: 'Kochi - Zone B' },
  { id: '19', name: 'Visakhapatnam - Zone B' },
  { id: '20', name: 'Vadodara - Zone B' },
  { id: '21', name: 'Gurgaon - Zone B' },
  { id: '22', name: 'Noida - Zone B' },
  { id: '23', name: 'Faridabad - Zone B' },
  { id: '24', name: 'Ghaziabad - Zone B' },
  
  // Zone C (Tier 2 Cities)
  { id: '25', name: 'Nashik - Zone C' },
  { id: '26', name: 'Aurangabad - Zone C' },
  { id: '27', name: 'Solapur - Zone C' },
  { id: '28', name: 'Kolhapur - Zone C' },
  { id: '29', name: 'Sangli - Zone C' },
  { id: '30', name: 'Jalgaon - Zone C' },
  { id: '31', name: 'Akola - Zone C' },
  { id: '32', name: 'Latur - Zone C' },
  { id: '33', name: 'Dhule - Zone C' },
  { id: '34', name: 'Ahmednagar - Zone C' },
  { id: '35', name: 'Amravati - Zone C' },
  { id: '36', name: 'Mysore - Zone C' },
  { id: '37', name: 'Hubli - Zone C' },
  { id: '38', name: 'Mangalore - Zone C' },
  { id: '39', name: 'Belgaum - Zone C' },
  { id: '40', name: 'Gulbarga - Zone C' },
  { id: '41', name: 'Davangere - Zone C' },
  { id: '42', name: 'Madurai - Zone C' },
  { id: '43', name: 'Salem - Zone C' },
  { id: '44', name: 'Tiruchirappalli - Zone C' },
  { id: '45', name: 'Tirunelveli - Zone C' },
  { id: '46', name: 'Erode - Zone C' },
  { id: '47', name: 'Vellore - Zone C' },
  { id: '48', name: 'Warangal - Zone C' },
  { id: '49', name: 'Nizamabad - Zone C' },
  { id: '50', name: 'Khammam - Zone C' },
  { id: '51', name: 'Jodhpur - Zone C' },
  { id: '52', name: 'Kota - Zone C' },
  { id: '53', name: 'Bikaner - Zone C' },
  { id: '54', name: 'Ajmer - Zone C' },
  { id: '55', name: 'Udaipur - Zone C' },
  { id: '56', name: 'Bhilwara - Zone C' },
  { id: '57', name: 'Rajkot - Zone C' },
  { id: '58', name: 'Bhavnagar - Zone C' },
  { id: '59', name: 'Jamnagar - Zone C' },
  { id: '60', name: 'Gandhinagar - Zone C' },
  { id: '61', name: 'Panipat - Zone C' },
  { id: '62', name: 'Ambala - Zone C' },
  { id: '63', name: 'Yamunanagar - Zone C' },
  { id: '64', name: 'Rohtak - Zone C' },
  { id: '65', name: 'Hisar - Zone C' },
  { id: '66', name: 'Karnal - Zone C' },
  { id: '67', name: 'Shimla - Zone C' },
  { id: '68', name: 'Solan - Zone C' },
  { id: '69', name: 'Dharamshala - Zone C' },
  { id: '70', name: 'Mandi - Zone C' },
  { id: '71', name: 'Ranchi - Zone C' },
  { id: '72', name: 'Jamshedpur - Zone C' },
  { id: '73', name: 'Dhanbad - Zone C' },
  { id: '74', name: 'Bokaro - Zone C' },
  { id: '75', name: 'Thiruvananthapuram - Zone C' },
  { id: '76', name: 'Kozhikode - Zone C' },
  { id: '77', name: 'Thrissur - Zone C' },
  { id: '78', name: 'Kollam - Zone C' },
  { id: '79', name: 'Gwalior - Zone C' },
  { id: '80', name: 'Jabalpur - Zone C' },
  { id: '81', name: 'Ujjain - Zone C' },
  { id: '82', name: 'Sagar - Zone C' },
  { id: '83', name: 'Bhubaneswar - Zone C' },
  { id: '84', name: 'Cuttack - Zone C' },
  { id: '85', name: 'Rourkela - Zone C' },
  { id: '86', name: 'Brahmapur - Zone C' },
  { id: '87', name: 'Ludhiana - Zone C' },
  { id: '88', name: 'Amritsar - Zone C' },
  { id: '89', name: 'Jalandhar - Zone C' },
  { id: '90', name: 'Patiala - Zone C' },
  { id: '91', name: 'Bathinda - Zone C' },
  { id: '92', name: 'Gangtok - Zone C' },
  { id: '93', name: 'Agartala - Zone C' },
  { id: '94', name: 'Agra - Zone C' },
  { id: '95', name: 'Varanasi - Zone C' },
  { id: '96', name: 'Meerut - Zone C' },
  { id: '97', name: 'Allahabad - Zone C' },
  { id: '98', name: 'Bareilly - Zone C' },
  { id: '99', name: 'Aligarh - Zone C' },
  { id: '100', name: 'Moradabad - Zone C' },
  { id: '101', name: 'Dehradun - Zone C' },
  { id: '102', name: 'Haridwar - Zone C' },
  { id: '103', name: 'Roorkee - Zone C' },
  { id: '104', name: 'Haldwani - Zone C' },
  { id: '105', name: 'Howrah - Zone C' },
  { id: '106', name: 'Durgapur - Zone C' },
  { id: '107', name: 'Asansol - Zone C' },
  { id: '108', name: 'Siliguri - Zone C' },
  { id: '109', name: 'Srinagar - Zone C' },
  { id: '110', name: 'Jammu - Zone C' },
  { id: '111', name: 'Leh - Zone C' },
  { id: '112', name: 'Kargil - Zone C' }
]

const ncbOptions = ['0', '20', '25', '35', '45', '50']

const addOns = [
  { id: '1', name: 'Zero Depreciation Cover', description: 'Covers full cost without depreciation', premium: 2000 },
  { id: '2', name: 'Engine Protection Cover', description: 'Covers engine damage due to water ingression', premium: 1500 },
  { id: '3', name: 'Roadside Assistance', description: '24/7 roadside assistance', premium: 800 },
  { id: '4', name: 'Personal Accident Cover', description: 'Cover for driver and passengers', premium: 1200 },
  { id: '5', name: 'Key Replacement Cover', description: 'Covers lost or stolen keys', premium: 600 },
  { id: '6', name: 'Consumables Cover', description: 'Covers consumables like oil, grease, etc.', premium: 1000 },
  { id: '7', name: 'Tyre Protection Cover', description: 'Covers tyre damage and replacement', premium: 1800 },
  { id: '8', name: 'Return to Invoice Cover', description: 'Covers invoice value in case of total loss', premium: 2500 },
  { id: '9', name: 'NCB Protection Cover', description: 'Protects No Claim Bonus', premium: 2200 },
  { id: '10', name: 'Passenger Cover', description: 'Cover for passengers in case of accident', premium: 900 },
  { id: '11', name: 'Daily Allowance', description: 'Daily allowance during vehicle repair', premium: 500 },
  { id: '12', name: 'Loss of Personal Belongings', description: 'Covers loss of personal items', premium: 700 },
  { id: '13', name: 'Hydrostatic Lock Cover', description: 'Covers engine damage due to water', premium: 1300 },
  { id: '14', name: 'Electrical Accessories Cover', description: 'Covers electrical accessories', premium: 1100 },
  { id: '15', name: 'Non-Electrical Accessories Cover', description: 'Covers non-electrical accessories', premium: 1400 }
]

const insuranceCompanies = [
  { id: '1', name: 'ICICI Lombard', logo: '/logos/placeholder-logo.svg' },
  { id: '2', name: 'Bajaj Allianz', logo: '/logos/placeholder-logo.svg' },
  { id: '3', name: 'HDFC ERGO', logo: '/logos/placeholder-logo.svg' },
  { id: '4', name: 'TATA AIG', logo: '/logos/placeholder-logo.svg' },
  { id: '5', name: 'New India Assurance', logo: '/logos/placeholder-logo.svg' },
  { id: '6', name: 'Oriental Insurance', logo: '/logos/placeholder-logo.svg' },
  { id: '7', name: 'United India Insurance', logo: '/logos/placeholder-logo.svg' },
  { id: '8', name: 'National Insurance', logo: '/logos/placeholder-logo.svg' },
  { id: '9', name: 'Reliance General Insurance', logo: '/logos/placeholder-logo.svg' },
  { id: '10', name: 'Future Generali', logo: '/logos/placeholder-logo.svg' },
  { id: '11', name: 'IFFCO Tokio', logo: '/logos/placeholder-logo.svg' },
  { id: '12', name: 'Royal Sundaram', logo: '/logos/placeholder-logo.svg' },
  { id: '13', name: 'SBI General Insurance', logo: '/logos/placeholder-logo.svg' },
  { id: '14', name: 'Kotak General Insurance', logo: '/logos/placeholder-logo.svg' },
  { id: '15', name: 'Liberty General Insurance', logo: '/logos/placeholder-logo.svg' }
]

export default function QuotationPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [quotationGenerated, setQuotationGenerated] = useState(false)
  const [testMode, setTestMode] = useState(false)
  const [showQuotes, setShowQuotes] = useState(false)
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([])
  const [additionalAddOns, setAdditionalAddOns] = useState<string[]>([])
  const [exShowroomPrice, setExShowroomPrice] = useState(0)
  const [quotes, setQuotes] = useState<any[]>([])
  const [loadingQuotes, setLoadingQuotes] = useState(false)
  const [selectedQuote, setSelectedQuote] = useState<any>(null)
  const [showOTPModal, setShowOTPModal] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [enteredOTP, setEnteredOTP] = useState('')
  const [showProposalForm, setShowProposalForm] = useState(false)
  const [showPremiumBreakup, setShowPremiumBreakup] = useState<any>(null)
  const [showKYCForm, setShowKYCForm] = useState(false)
  const [kycDocuments, setKycDocuments] = useState({
    identityProof: null as File | null,
    addressProof: null as File | null,
    incomeProof: null as File | null,
    vehicleRC: null as File | null,
    vehicleInvoice: null as File | null
  })
  const [kycStatus, setKycStatus] = useState<'pending' | 'verified' | 'rejected'>('pending')
  const [panValidation, setPanValidation] = useState({
    isValid: false,
    panNumber: '',
    name: '',
    fatherName: '',
    dob: '',
    errors: [] as string[]
  })
  const [savedDrafts, setSavedDrafts] = useState<any[]>([])
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'completed' | 'failed'>('pending')
  const [showPolicyCertificate, setShowPolicyCertificate] = useState(false)
  const [issuedPolicy, setIssuedPolicy] = useState<any>(null)

  const { register, handleSubmit, watch, formState: { errors }, setValue, reset } = useForm({
    resolver: zodResolver(quotationSchema),
    defaultValues: {
      customerType: 'INDIVIDUAL',
      validityPeriod: 30
    }
  })

  const customerType = watch('customerType')

  // Load draft data if draft ID is provided in URL
  useEffect(() => {
    const loadDraftData = () => {
      const urlParams = new URLSearchParams(window.location.search)
      const draftId = urlParams.get('draft')
      const editId = urlParams.get('edit')
      
      if (draftId || editId) {
        const id = draftId || editId
        const savedDrafts = JSON.parse(localStorage.getItem('policyDrafts') || '[]')
        const draft = savedDrafts.find((d: any) => d.id === id)
        
        if (draft) {
          console.log('Loading draft data:', draft)
          
          // Reset form with draft data
          reset({
            customerType: draft.customerInfo.customerType,
            firstName: draft.customerInfo.firstName,
            lastName: draft.customerInfo.lastName,
            email: draft.customerInfo.email,
            phone: draft.customerInfo.phone,
            address: draft.customerInfo.address,
            city: draft.customerInfo.city,
            state: draft.customerInfo.state,
            pincode: draft.customerInfo.pincode,
            policyType: draft.policyDetails.policyType,
            oem: draft.policyDetails.oem,
            modelName: draft.policyDetails.modelName,
            variant: draft.policyDetails.variant,
            yearOfManufacture: draft.policyDetails.yearOfManufacture,
            registrationCity: draft.policyDetails.registrationCity,
            exShowroomPrice: draft.policyDetails.exShowroomPrice,
            policyTerm: draft.policyDetails.policyTerm,
            quotationDate: draft.policyDetails.quotationDate,
            validityPeriod: 30
          })
          
          // Set other state variables
          setSelectedAddOns(draft.selectedAddOns || [])
          setSelectedQuote(draft.selectedQuote)
          setKycStatus(draft.kycStatus)
          setPanValidation(draft.panValidation)
          setExShowroomPrice(draft.policyDetails.exShowroomPrice || 0)
          
          // Navigate to appropriate step based on draft status
          if (editId) {
            // For edit mode, continue from where it was saved
            if (draft.kycStatus === 'verified' && draft.selectedQuote) {
              setCurrentStep(4) // Go to quotes step to continue workflow
              toast.success('Draft loaded! You can continue with the proposal process.')
            } else if (draft.selectedQuote) {
              setCurrentStep(4) // Go to quotes step
              toast.success('Draft loaded! You can continue with KYC and proposal process.')
            } else {
              setCurrentStep(3) // Go to add-ons step
              toast.success('Draft loaded! You can continue with add-ons selection.')
            }
          } else {
            // For view mode, show appropriate step
            if (draft.kycStatus === 'verified') {
              setCurrentStep(4) // Go to proposal form
            } else if (draft.selectedQuote) {
              setCurrentStep(4) // Go to quotes step
            } else {
              setCurrentStep(3) // Go to add-ons step
            }
            toast.success('Draft loaded successfully! You can now view this proposal.')
          }
        } else {
          toast.error('Draft not found')
        }
      }
    }

    loadDraftData()
  }, [reset])
  const coverageAmount = watch('coverageAmount')
  const premiumAmount = watch('premiumAmount')
  const policyTerm = watch('policyTerm')
  const policyType = watch('policyType')
  const oem = watch('oem')
  const modelName = watch('modelName')
  const isRollover = watch('isRollover')
  const state = watch('state')

  const handleBack = () => {
    router.push('/dashboard/presale')
  }

  // Get available models based on selected OEM
  const getAvailableModels = () => {
    if (!oem) return []
    return models[oem as keyof typeof models] || []
  }

  // Get available variants based on selected model
  const getAvailableVariants = () => {
    if (!modelName) return []
    return variants[modelName as keyof typeof variants] || []
  }

  // Get available cities based on selected state
  const getAvailableCities = () => {
    if (!state) return []
    return cities[state as keyof typeof cities] || []
  }

  // Get year options based on new/rollover
  const getYearOptions = () => {
    const currentYear = new Date().getFullYear()
    if (isRollover === 'true') {
      // For rollover: current year and previous 13 years
      const years = []
      for (let i = 0; i <= 13; i++) {
        years.push(currentYear - i)
      }
      return years
    } else {
      // For new vehicle: current and previous 1 year only
      return [currentYear, currentYear - 1]
    }
  }

  // Handle add-on selection
  const handleAddOnToggle = (addOnId: string) => {
    setSelectedAddOns(prev => 
      prev.includes(addOnId) 
        ? prev.filter(id => id !== addOnId)
        : [...prev, addOnId]
    )
  }

  // Handle additional add-on selection
  const handleAdditionalAddOnToggle = (addOnId: string) => {
    setAdditionalAddOns(prev => 
      prev.includes(addOnId) 
        ? prev.filter(id => id !== addOnId)
        : [...prev, addOnId]
    )
  }

  // Handle update quotes with additional add-ons
  const handleUpdateQuotes = () => {
    if (additionalAddOns.length > 0) {
      fetchQuotes(additionalAddOns)
      setSelectedAddOns(prev => [...prev, ...additionalAddOns])
      setAdditionalAddOns([])
    }
  }

  // Adjust ex-showroom price
  const adjustExShowroomPrice = (adjustment: number) => {
    setExShowroomPrice(prev => Math.max(0, prev + adjustment))
    setValue('exShowroomPrice', Math.max(0, exShowroomPrice + adjustment))
  }

  // Fetch quotes from insurance companies
  const fetchQuotes = async (additionalAddOns: string[] = []) => {
    setLoadingQuotes(true)
    try {
      // Mock API call to insurance companies
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Calculate add-on premium based on selected add-ons
      const allSelectedAddOns = [...selectedAddOns, ...additionalAddOns]
      const addOnPremium = allSelectedAddOns.reduce((total, addOnId) => {
        const addOn = addOns.find(a => a.id === addOnId)
        return total + (addOn?.premium || 0)
      }, 0)
      
      const mockQuotes = insuranceCompanies.map((company, index) => {
        const basePremium = Math.floor(Math.random() * 50000) + 20000
        const quote = {
          companyId: company.id,
          companyName: company.name,
          logo: company.logo,
          basePremium: basePremium,
          addOnPremium: addOnPremium,
          totalPremium: 0,
          premiumBreakup: {
            ownDamage: Math.floor(Math.random() * 30000) + 15000,
            thirdParty: Math.floor(Math.random() * 10000) + 5000,
            personalAccident: Math.floor(Math.random() * 5000) + 2000,
            addOns: addOnPremium,
            gst: 0,
            total: 0
          },
          coverage: {
            ownDamage: 'Comprehensive coverage for own vehicle damage',
            thirdParty: 'Third party liability coverage as per IRDAI guidelines',
            personalAccident: 'Personal accident cover for owner-driver'
          },
          features: [
            'Cashless claim settlement',
            '24/7 customer support',
            'Quick claim processing',
            'Network garages across India'
          ],
          selectedAddOns: allSelectedAddOns
        }
        
        // Calculate total premium and GST
        const subtotal = quote.basePremium + quote.addOnPremium
        quote.premiumBreakup.gst = subtotal * 0.18
        quote.premiumBreakup.total = subtotal + quote.premiumBreakup.gst
        quote.totalPremium = quote.premiumBreakup.total
        
        return quote
      })

      setQuotes(mockQuotes)
      setShowQuotes(true)
      toast.success('Quotes fetched successfully!')
    } catch (error) {
      console.error('Error in fetchQuotes:', error)
      toast.error('Failed to fetch quotes from insurance companies')
    } finally {
      setLoadingQuotes(false)
    }
  }

  // Handle plan selection and send OTP
  const handleSelectPlan = async (quote: any) => {
    setSelectedQuote(quote)
    
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    setOtpCode(otp)
    
    // Get form data
    const email = watch('email')
    const firstName = watch('firstName')
    const lastName = watch('lastName')
    const phone = watch('phone')
    
    console.log('OTP Debug - Form data:', { email, firstName, lastName, phone, customerType })
    
    // Check if email is available
    if (!email) {
      toast.error('Email address is required to send OTP')
      return
    }
    
    console.log('Sending OTP to email:', email)
    
    // Send OTP via email
    try {
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'otp',
          to: email,
          data: {
            customerName: customerType === 'INDIVIDUAL' ? `${firstName} ${lastName}` : watch('companyName'),
            otpCode: otp,
            phone: phone
          }
        })
      })

      if (response.ok) {
        toast.success(`OTP sent to ${email}`)
        setShowOTPModal(true)
      } else {
        throw new Error('Failed to send OTP')
      }
    } catch (error) {
      toast.error('Failed to send OTP')
    }
  }

  // Handle OTP verification
  const handleOTPVerification = () => {
    if (enteredOTP === otpCode) {
      toast.success('OTP verified successfully!')
      setShowOTPModal(false)
      setShowKYCForm(true)
    } else {
      toast.error('Invalid OTP. Please try again.')
    }
  }

  // Development bypass for OTP (only in development mode)
  const handleOTPBypass = () => {
    if (process.env.NODE_ENV === 'development' || testMode) {
      toast.success('OTP bypassed for testing!')
      setShowOTPModal(false)
      setShowKYCForm(true)
    }
  }

  // PAN Card validation function
  const validatePANCard = (file: File): Promise<{isValid: boolean, data: any, errors: string[]}> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        
        // Mock PAN card validation - in real implementation, this would use OCR or API
        setTimeout(() => {
          // Simulate PAN card data extraction
          const mockPANData = {
            panNumber: 'ABCDE1234F',
            name: 'JOHN DOE',
            fatherName: 'JANE DOE',
            dob: '01/01/1990',
            signature: 'Present',
            photo: 'Present'
          }
          
          const errors: string[] = []
          
          // Validate PAN format (5 letters + 4 digits + 1 letter)
          const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
          if (!panRegex.test(mockPANData.panNumber)) {
            errors.push('Invalid PAN number format')
          }
          
          // Validate name (should not be empty)
          if (!mockPANData.name || mockPANData.name.length < 2) {
            errors.push('Name not found or invalid')
          }
          
          // Validate father's name
          if (!mockPANData.fatherName || mockPANData.fatherName.length < 2) {
            errors.push('Father\'s name not found or invalid')
          }
          
          // Validate date of birth
          if (!mockPANData.dob) {
            errors.push('Date of birth not found')
          }
          
          // Check for signature
          if (mockPANData.signature !== 'Present') {
            errors.push('Signature not found on PAN card')
          }
          
          // Check for photo
          if (mockPANData.photo !== 'Present') {
            errors.push('Photo not found on PAN card')
          }
          
          // File size validation (should be reasonable for a document)
          if (file.size > 10 * 1024 * 1024) { // 10MB
            errors.push('File size too large (max 10MB)')
          }
          
          if (file.size < 10 * 1024) { // 10KB
            errors.push('File size too small (min 10KB)')
          }
          
          // File type validation
          const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
          if (!allowedTypes.includes(file.type)) {
            errors.push('Invalid file type. Only JPEG, PNG, and PDF are allowed')
          }
          
          const isValid = errors.length === 0
          
          resolve({
            isValid,
            data: mockPANData,
            errors
          })
        }, 2000) // Simulate processing time
      }
      
      reader.readAsDataURL(file)
    })
  }

  // Handle KYC document upload
  const handleDocumentUpload = async (documentType: keyof typeof kycDocuments, file: File) => {
    setKycDocuments(prev => ({
      ...prev,
      [documentType]: file
    }))
    
    // If it's a PAN card (identity proof), validate it
    if (documentType === 'identityProof') {
      toast('Validating PAN card...', { icon: 'ℹ️' })
      
      try {
        const validation = await validatePANCard(file)
        
        setPanValidation({
          isValid: validation.isValid,
          panNumber: validation.data.panNumber,
          name: validation.data.name,
          fatherName: validation.data.fatherName,
          dob: validation.data.dob,
          errors: validation.errors
        })
        
        if (validation.isValid) {
          toast.success('PAN card validated successfully!')
        } else {
          toast.error(`PAN card validation failed: ${validation.errors.join(', ')}`)
        }
      } catch (error) {
        toast.error('Error validating PAN card')
        setPanValidation({
          isValid: false,
          panNumber: '',
          name: '',
          fatherName: '',
          dob: '',
          errors: ['Error processing PAN card']
        })
      }
    } else {
      toast.success(`${documentType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} uploaded successfully`)
    }
  }

  // Handle KYC verification
  const handleKYCVerification = async () => {
    // Check if all required documents are uploaded
    const requiredDocs = ['identityProof', 'addressProof', 'vehicleRC']
    const missingDocs = requiredDocs.filter(doc => !kycDocuments[doc as keyof typeof kycDocuments])
    
    if (missingDocs.length > 0) {
      toast.error(`Please upload: ${missingDocs.join(', ')}`)
      return
    }

    // Check PAN card validation if identity proof is uploaded
    if (kycDocuments.identityProof && !panValidation.isValid) {
      toast.error('Please upload a valid PAN card. Current PAN card validation failed.')
      return
    }

    // Simulate KYC verification process
    setKycStatus('pending')
    toast('KYC verification in progress...', { icon: 'ℹ️' })
    
    // Mock API call for KYC verification
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Simulate successful verification
    setKycStatus('verified')
    toast.success('KYC verification completed successfully!')
    
    // Proceed to proposal form
    setTimeout(() => {
      setShowKYCForm(false)
      setShowProposalForm(true)
    }, 1000)
  }

  // Handle saving proposal as draft
  const handleSaveDraft = async () => {
    setIsSavingDraft(true)
    try {
      const draftData = {
        id: `DRAFT_${Date.now()}`,
        customerInfo: {
          customerType: watch('customerType'),
          firstName: watch('firstName'),
          lastName: watch('lastName'),
          email: watch('email'),
          phone: watch('phone'),
          address: watch('address'),
          city: watch('city'),
          state: watch('state'),
          pincode: watch('pincode')
        },
        policyDetails: {
          policyType: watch('policyType'),
          oem: watch('oem'),
          modelName: watch('modelName'),
          variant: watch('variant'),
          yearOfManufacture: watch('yearOfManufacture'),
          registrationCity: watch('registrationCity'),
          exShowroomPrice: watch('exShowroomPrice'),
          policyTerm: watch('policyTerm'),
          quotationDate: watch('quotationDate')
        },
        selectedQuote: selectedQuote,
        selectedAddOns: selectedAddOns,
        kycStatus: kycStatus,
        panValidation: panValidation,
        status: 'DRAFT',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      // Save to localStorage (in real app, this would be an API call)
      const existingDrafts = JSON.parse(localStorage.getItem('policyDrafts') || '[]')
      existingDrafts.push(draftData)
      localStorage.setItem('policyDrafts', JSON.stringify(existingDrafts))
      
      setSavedDrafts(existingDrafts)
      toast.success('Proposal saved as draft successfully!')
      
      // Close the proposal form
      setShowProposalForm(false)
      
    } catch (error) {
      console.error('Error saving draft:', error)
      toast.error('Failed to save draft')
    } finally {
      setIsSavingDraft(false)
    }
  }

  // Handle proposal submission
  const handleProposalSubmission = async (data: any) => {
    console.log('Proposal submission started with data:', data)
    setIsSubmitting(true)
    try {
      // Close proposal form and show payment form
      setShowProposalForm(false)
      setShowPaymentForm(true)
      setPaymentStatus('pending')
      
      toast.success('Proposal submitted successfully! Please proceed with payment.')
    } catch (error) {
      toast.error('Failed to submit proposal')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePaymentProcessing = async (paymentData: any) => {
    console.log('Payment processing started:', paymentData)
    setPaymentStatus('processing')
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Mock payment success
      setPaymentStatus('completed')
      toast.success('Payment processed successfully!')
      
      // Proceed to policy issuance
      await handlePolicyIssuance()
      
    } catch (error) {
      setPaymentStatus('failed')
      toast.error('Payment processing failed')
    }
  }

  const handlePolicyIssuance = async () => {
    try {
      toast('Processing policy issuance with insurance company...', { icon: 'ℹ️' })
      
      // Mock API call to insurance company
      console.log('Starting policy issuance process...')
      await new Promise(resolve => setTimeout(resolve, 4000))
      
      // Mock policy issuance response
      const policyNumber = `POL${Date.now().toString().slice(-8)}`
      const certificateNumber = `CERT${Date.now().toString().slice(-10)}`
      
      const policyData = {
        policyNumber,
        certificateNumber,
        customerName: customerType === 'INDIVIDUAL' ? `${watch('firstName')} ${watch('lastName')}` : watch('companyName'),
        insuranceCompany: selectedQuote?.companyName,
        premiumAmount: selectedQuote?.totalPremium,
        startDate: new Date().toLocaleDateString(),
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + (watch('policyTerm') || 1))).toLocaleDateString(),
        vehicleDetails: {
          oem: watch('oem'),
          model: watch('modelName'),
          variant: watch('variant'),
          year: watch('yearOfManufacture'),
          registrationCity: watch('registrationCity')
        },
        addOns: selectedAddOns,
        nomineeDetails: {
          name: watch('nomineeName'),
          relationship: watch('nomineeRelationship'),
          dob: watch('nomineeDOB')
        }
      }
      
      setIssuedPolicy(policyData)
      
      // Send policy issued email
      const emailResponse = await fetch('/api/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'policyIssued',
          to: watch('email'),
          data: policyData
        })
      })

      if (emailResponse.ok) {
        toast.success(`Policy issued successfully! Policy Number: ${policyNumber}. Email sent to ${watch('email')}`)
      } else {
        toast.success(`Policy issued successfully! Policy Number: ${policyNumber}`)
      }
      
      // Show policy certificate
      setShowPaymentForm(false)
      setShowPolicyCertificate(true)
      
    } catch (error) {
      toast.error('Failed to issue policy')
    }
  }

  const onSubmit = async (data: QuotationFormData) => {
    setIsSubmitting(true)
    try {
      // Generate quotation number
      const quotationNumber = `QUO${Date.now().toString().slice(-6)}`
      
      // Send quotation email
      const emailResponse = await fetch('/api/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'quotation',
          to: data.email,
          data: {
            customerName: customerType === 'INDIVIDUAL' ? `${data.firstName} ${data.lastName}` : data.companyName,
            quotationNumber: quotationNumber,
            policyType: data.policyType,
            premiumAmount: selectedQuote?.totalPremium || 0,
            validUntil: new Date(new Date().getTime() + (data.validityPeriod || 30) * 24 * 60 * 60 * 1000).toLocaleDateString(),
            validityPeriod: data.validityPeriod || 30,
            manufacturer: manufacturers.find(m => m.id === data.oem)?.name,
            model: getAvailableModels().find(m => m.id === data.modelName)?.name,
            variant: getAvailableVariants().find(v => v.id === data.variant)?.name,
            year: data.yearOfManufacture
          }
        })
      })

      if (emailResponse.ok) {
        toast.success(`Quotation generated successfully! Email sent to ${data.email}`)
      } else {
        toast.success('Quotation generated successfully!')
      }
      
      setQuotationGenerated(true)
      setCurrentStep(4)
    } catch (error) {
      toast.error('Failed to generate quotation')
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const getStepStatus = (step: number) => {
    if (step < currentStep) return 'completed'
    if (step === currentStep) return 'current'
    return 'upcoming'
  }

  const getStepIcon = (step: number) => {
    const status = getStepStatus(step)
    if (status === 'completed') return <CheckCircleIcon className="h-5 w-5 text-green-500" />
    if (status === 'current') return <ExclamationTriangleIcon className="h-5 w-5 text-blue-500" />
    return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
  }

  const calculatePremium = () => {
    if (coverageAmount && policyTerm) {
      const basePremium = coverageAmount * 0.02 // 2% of coverage amount
      const termMultiplier = 1 + (policyTerm - 1) * 0.1 // 10% increase per additional year
      const calculatedPremium = basePremium * termMultiplier
      setValue('premiumAmount', Math.round(calculatedPremium))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to Pre-Sales
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && (
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={testMode}
                    onChange={(e) => setTestMode(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-600">Test Mode</span>
                </label>
                <button
                  onClick={() => {
                    // Auto-fill form for testing
                    setValue('firstName', 'John')
                    setValue('lastName', 'Doe')
                    setValue('email', 'test@example.com')
                    setValue('phone', '9876543210')
                    setValue('address', '123 Main Street, Mumbai')
                    setValue('state', '14') // Maharashtra
                    setValue('city', '67') // Mumbai
                    setValue('pincode', '400001')
                    setValue('policyType', 'GEN_MOTOR')
                    setValue('policyTerm', 1)
                    setValue('quotationDate', '2024-01-15')
                    setValue('oem', '1') // Maruti Suzuki
                    setValue('modelName', '1') // Swift
                    setValue('variant', '2') // Swift VXI
                    setValue('yearOfManufacture', '2024')
                    setValue('registrationCity', '1') // Mumbai - Zone A
                    setValue('exShowroomPrice', 500000)
                    setExShowroomPrice(500000)
                    toast.success('Form auto-filled for testing!')
                  }}
                  className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  Auto-Fill Form
                </button>
              </div>
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Insurance Quotation</h1>
          <p className="text-gray-600 mt-2">
            Generate insurance quotations for potential customers
          </p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between">
            {[
              { step: 1, title: 'Customer Info', description: 'Collect customer information' },
              { step: 2, title: 'Policy Details', description: 'Select policy type and vehicle details' },
              { step: 3, title: 'Add-ons Selection', description: 'Choose add-ons and get quotes' },
              { step: 4, title: 'Compare Quotes', description: 'Compare insurance company offers' }
            ].map(({ step, title, description }) => (
              <div key={step} className="flex items-center">
                <div className="flex items-center">
                  {getStepIcon(step)}
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${
                      getStepStatus(step) === 'current' ? 'text-blue-600' : 
                      getStepStatus(step) === 'completed' ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {title}
                    </p>
                    <p className="text-xs text-gray-500">{description}</p>
                  </div>
                </div>
                {step < 4 && <div className="ml-8 h-0.5 w-16 bg-gray-200" />}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Step 1: Customer Information */}
          {currentStep === 1 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Type
                  </label>
                  <select
                    {...register('customerType')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="INDIVIDUAL">Individual</option>
                    <option value="CORPORATE">Corporate</option>
                  </select>
                </div>

                {customerType === 'INDIVIDUAL' ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        {...register('firstName')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        {...register('lastName')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        {...register('dateOfBirth')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gender
                      </label>
                      <select
                        {...register('gender')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        {...register('companyName')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Registration Number
                      </label>
                      <input
                        type="text"
                        {...register('registrationNumber')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    {...register('phone')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <textarea
                    {...register('address')}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <select
                    {...register('state')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state.id} value={state.id}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                  {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <select
                    {...register('city')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={!state}
                  >
                    <option value="">Select City</option>
                    {getAvailableCities().map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    {...register('pincode')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode.message}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Policy Details */}
          {currentStep === 2 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Policy Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Policy Type *
                  </label>
                  <select
                    {...register('policyType')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Policy Type</option>
                    <option value="LIFE">Life</option>
                    <option value="LIFE_GTLI">Life-GTLI</option>
                    <option value="LIFE_GPA">Life-GPA</option>
                    <option value="HEALTH">Health</option>
                    <option value="HEALTH_GMC">Health-GMC</option>
                    <option value="GEN_LIABILITY">Gen-Liability</option>
                    <option value="GEN_FIRE">Gen–Fire</option>
                    <option value="GEN_MOTOR">Gen–Motor</option>
                    <option value="GEN_MARINE">Gen–Marine</option>
                    <option value="GEN_MISC">Gen–Misc</option>
                    <option value="GEN_ENGG">Gen–Engg</option>
                    <option value="GEN_PROPERTY">Gen–Property</option>
                    <option value="GEN_MBD">Gen–MBD</option>
                    <option value="GEN_TRAVEL">Gen–Travel</option>
                  </select>
                  {errors.policyType && <p className="text-red-500 text-xs mt-1">{errors.policyType.message}</p>}
                </div>

                {/* Gen-Motor Specific Fields */}
                {policyType === 'GEN_MOTOR' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vehicle Type
                      </label>
                      <div className="flex space-x-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            {...register('isRollover')}
                            value="false"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="ml-2 text-sm text-gray-700">New Vehicle</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            {...register('isRollover')}
                            value="true"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="ml-2 text-sm text-gray-700">Rollover</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        OEM (Manufacturer) *
                      </label>
                      <select
                        {...register('oem')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Manufacturer</option>
                        {manufacturers.map((manufacturer) => (
                          <option key={manufacturer.id} value={manufacturer.id}>
                            {manufacturer.name}
                          </option>
                        ))}
                      </select>
                      {errors.oem && <p className="text-red-500 text-xs mt-1">{errors.oem.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Model Name *
                      </label>
                      <select
                        {...register('modelName')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={!oem}
                      >
                        <option value="">Select Model</option>
                        {getAvailableModels().map((model) => (
                          <option key={model.id} value={model.id}>
                            {model.name}
                          </option>
                        ))}
                      </select>
                      {errors.modelName && <p className="text-red-500 text-xs mt-1">{errors.modelName.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Variant *
                      </label>
                      <select
                        {...register('variant')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={!modelName}
                      >
                        <option value="">Select Variant</option>
                        {getAvailableVariants().map((variant) => (
                          <option key={variant.id} value={variant.id}>
                            {variant.name}
                          </option>
                        ))}
                      </select>
                      {errors.variant && <p className="text-red-500 text-xs mt-1">{errors.variant.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Year of Manufacture *
                      </label>
                      <select
                        {...register('yearOfManufacture')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Year</option>
                        {getYearOptions().map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                      {errors.yearOfManufacture && <p className="text-red-500 text-xs mt-1">{errors.yearOfManufacture.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Registration City *
                      </label>
                      <select
                        {...register('registrationCity')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Registration City</option>
                        {cityZones.map((city) => (
                          <option key={city.id} value={city.id}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                      {errors.registrationCity && <p className="text-red-500 text-xs mt-1">{errors.registrationCity.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ex-showroom Price (₹) *
                      </label>
                      <div className="flex">
                        <button
                          type="button"
                          onClick={() => adjustExShowroomPrice(-10000)}
                          className="px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100"
                        >
                          <MinusIcon className="h-4 w-4" />
                        </button>
                        <input
                          type="number"
                          {...register('exShowroomPrice', { valueAsNumber: true })}
                          className="flex-1 px-3 py-2 border-t border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter ex-showroom price"
                        />
                        <button
                          type="button"
                          onClick={() => adjustExShowroomPrice(10000)}
                          className="px-3 py-2 border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </button>
                      </div>
                      {errors.exShowroomPrice && <p className="text-red-500 text-xs mt-1">{errors.exShowroomPrice.message}</p>}
                    </div>

                    {/* Rollover Specific Fields - Only for rollover vehicles */}
                    {isRollover === 'true' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Previous NCB (%) *
                          </label>
                          <select
                            {...register('previousNCB')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select Previous NCB</option>
                            {ncbOptions.map((ncb) => (
                              <option key={ncb} value={ncb}>
                                {ncb}%
                              </option>
                            ))}
                          </select>
                          {errors.previousNCB && <p className="text-red-500 text-xs mt-1">{errors.previousNCB.message}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Any Claim Availed? *
                          </label>
                          <div className="flex space-x-4">
                            <label className="flex items-center">
                              <input
                                type="radio"
                                {...register('claimAvailed')}
                                value="true"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                              />
                              <span className="ml-2 text-sm text-gray-700">Yes</span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                {...register('claimAvailed')}
                                value="false"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                              />
                              <span className="ml-2 text-sm text-gray-700">No</span>
                            </label>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Policy Term *
                  </label>
                  <select
                    {...register('policyTerm', { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => {
                      register('policyTerm', { valueAsNumber: true }).onChange(e)
                      calculatePremium()
                    }}
                  >
                    <option value="">Select Policy Term</option>
                    {policyTerms.map((term) => (
                      <option key={term.id} value={term.value}>
                        {term.name}
                      </option>
                    ))}
                  </select>
                  {errors.policyTerm && <p className="text-red-500 text-xs mt-1">{errors.policyTerm.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quotation Date *
                  </label>
                  <input
                    type="date"
                    {...register('quotationDate')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.quotationDate && <p className="text-red-500 text-xs mt-1">{errors.quotationDate.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Validity Period (Days)
                  </label>
                  <input
                    type="number"
                    {...register('validityPeriod', { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Add-ons Selection */}
          {currentStep === 3 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Add-ons Selection</h2>
              
              {/* Vehicle Details Summary */}
              {policyType === 'GEN_MOTOR' && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Vehicle Details</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Manufacturer:</span>
                      <p className="font-medium">{manufacturers.find(m => m.id === oem)?.name || 'Not selected'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Model:</span>
                      <p className="font-medium">{getAvailableModels().find(m => m.id === modelName)?.name || 'Not selected'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Variant:</span>
                      <p className="font-medium">{getAvailableVariants().find(v => v.id === watch('variant'))?.name || 'Not selected'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Year:</span>
                      <p className="font-medium">{watch('yearOfManufacture') || 'Not selected'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Ex-showroom Price Display */}
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-blue-900">Ex-showroom Price</h3>
                    <p className="text-2xl font-bold text-blue-900">₹{watch('exShowroomPrice')?.toLocaleString() || '0'}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => adjustExShowroomPrice(-10000)}
                      className="p-2 bg-blue-100 rounded-md hover:bg-blue-200"
                    >
                      <MinusIcon className="h-4 w-4 text-blue-600" />
                    </button>
                    <button
                      type="button"
                      onClick={() => adjustExShowroomPrice(10000)}
                      className="p-2 bg-blue-100 rounded-md hover:bg-blue-200"
                    >
                      <PlusIcon className="h-4 w-4 text-blue-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Add-ons Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Select Add-ons</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addOns.map((addOn) => (
                    <div
                      key={addOn.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedAddOns.includes(addOn.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleAddOnToggle(addOn.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedAddOns.includes(addOn.id)}
                          onChange={() => handleAddOnToggle(addOn.id)}
                          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">{addOn.name}</h4>
                          <p className="text-xs text-gray-500 mt-1">{addOn.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected Add-ons Summary */}
              {selectedAddOns.length > 0 && (
                <div className="mt-6 bg-green-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-green-900 mb-2">Selected Add-ons</h3>
                  <div className="space-y-1">
                    {selectedAddOns.map((addOnId) => {
                      const addOn = addOns.find(a => a.id === addOnId)
                      return (
                        <div key={addOnId} className="flex justify-between text-sm">
                          <span className="text-green-800">{addOn?.name}</span>
                          <span className="text-green-800">₹2,000</span>
                        </div>
                      )
                    })}
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between text-sm font-medium">
                        <span className="text-green-900">Total Add-on Premium:</span>
                        <span className="text-green-900">₹{selectedAddOns.length * 2000}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Fetch Quotes Button */}
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => fetchQuotes()}
                  disabled={loadingQuotes}
                  className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingQuotes ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Fetching Quotes...
                    </>
                  ) : (
                    <>
                      <ShieldCheckIcon className="h-4 w-4 mr-2" />
                      Get Quotes from Insurance Companies
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Insurance Company Quotes */}
          {currentStep === 4 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Insurance Company Quotes</h2>
              
              {/* Customer and Vehicle Details Summary */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Quotation Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Customer:</span>
                    <p className="font-medium">{customerType === 'INDIVIDUAL' ? `${watch('firstName')} ${watch('lastName')}` : watch('companyName')}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <p className="font-medium">{watch('email')}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Policy Type:</span>
                    <p className="font-medium">{watch('policyType')}</p>
                  </div>
                  {policyType === 'GEN_MOTOR' && (
                    <>
                      <div>
                        <span className="text-gray-500">Vehicle:</span>
                        <p className="font-medium">
                          {manufacturers.find(m => m.id === oem)?.name} {getAvailableModels().find(m => m.id === modelName)?.name}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Ex-showroom Price:</span>
                        <p className="font-medium">₹{watch('exShowroomPrice')?.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Selected Add-ons:</span>
                        <p className="font-medium">{selectedAddOns.length} add-ons</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {showQuotes ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Sidebar - Ex-showroom Price and Add-ons */}
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-blue-900 mb-2">Ex-showroom Price</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-blue-900">₹{watch('exShowroomPrice')?.toLocaleString() || '0'}</span>
                        <div className="flex space-x-1">
                          <button
                            type="button"
                            onClick={() => adjustExShowroomPrice(-10000)}
                            className="p-1 bg-blue-100 rounded hover:bg-blue-200"
                          >
                            <MinusIcon className="h-3 w-3 text-blue-600" />
                          </button>
                          <button
                            type="button"
                            onClick={() => adjustExShowroomPrice(10000)}
                            className="p-1 bg-blue-100 rounded hover:bg-blue-200"
                          >
                            <PlusIcon className="h-3 w-3 text-blue-600" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-green-900 mb-2">Selected Add-ons</h3>
                      <div className="space-y-2">
                        {selectedAddOns.map((addOnId) => {
                          const addOn = addOns.find(a => a.id === addOnId)
                          return (
                            <div key={addOnId} className="flex items-center space-x-2">
                              <CheckCircleIcon className="h-4 w-4 text-green-600" />
                              <span className="text-sm text-green-800">{addOn?.name}</span>
                            </div>
                          )
                        })}
                        {selectedAddOns.length === 0 && (
                          <p className="text-sm text-green-600">No add-ons selected</p>
                        )}
                      </div>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-yellow-900 mb-2">Additional Add-ons</h3>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {addOns.filter(addOn => !selectedAddOns.includes(addOn.id)).map((addOn) => (
                          <div key={addOn.id} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`addon-${addOn.id}`}
                              onChange={() => handleAdditionalAddOnToggle(addOn.id)}
                              className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                            />
                            <label htmlFor={`addon-${addOn.id}`} className="text-sm text-yellow-800 cursor-pointer">
                              {addOn.name}
                            </label>
                            <span className="text-xs text-yellow-600 ml-auto">₹{addOn.premium}</span>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={handleUpdateQuotes}
                        className="mt-3 w-full px-3 py-2 bg-yellow-600 text-white text-sm rounded-md hover:bg-yellow-700"
                      >
                        Update Quotes
                      </button>
                    </div>
                  </div>

                  {/* Middle - Insurance Company Quotes */}
                  <div className="lg:col-span-1 space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Premium Quotes</h3>
                    {quotes.map((quote, index) => (
                      <div key={quote.companyId} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-gray-600">{quote.companyName.charAt(0)}</span>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">{quote.companyName}</h4>
                              <p className="text-xs text-gray-500">Base Premium: ₹{quote.basePremium.toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-blue-600">₹{quote.totalPremium.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">Total Premium</p>
                          </div>
                        </div>
                        
                        {selectedAddOns.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs text-gray-500">Add-on Premium: ₹{quote.addOnPremium.toLocaleString()}</p>
                          </div>
                        )}

                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleSelectPlan(quote)}
                            className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                          >
                            Select Plan
                          </button>
                          <button 
                            onClick={() => setShowPremiumBreakup(quote)}
                            className="px-3 py-2 border border-gray-300 text-sm rounded-md hover:bg-gray-50"
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Right Sidebar - Coverage Details */}
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Coverage Details</h3>
                      <div className="space-y-3 text-sm">
                        <div>
                          <h4 className="font-medium text-gray-900">Own Damage Coverage</h4>
                          <p className="text-gray-600">{quotes[0]?.coverage.ownDamage}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Third Party Coverage</h4>
                          <p className="text-gray-600">{quotes[0]?.coverage.thirdParty}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Personal Accident</h4>
                          <p className="text-gray-600">{quotes[0]?.coverage.personalAccident}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-yellow-900 mb-3">Key Features</h3>
                      <div className="space-y-2 text-sm">
                        {quotes[0]?.features.map((feature: string, index: number) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircleIcon className="h-4 w-4 text-yellow-600" />
                            <span className="text-yellow-800">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <ShieldCheckIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Quotes Available</h3>
                  <p className="text-gray-600 mb-6">
                    Please complete the previous steps and fetch quotes from insurance companies.
                  </p>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Go Back to Add-ons Selection
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          {currentStep < 4 && (
            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Next
              </button>
            </div>
          )}

          {/* Step 4 Actions */}
          {currentStep === 4 && showQuotes && (
            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Previous
              </button>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentStep(1)
                    setShowQuotes(false)
                    setSelectedAddOns([])
                    setQuotes([])
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  New Quotation
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Generating...' : 'Generate Final Quotation'}
                </button>
              </div>
            </div>
          )}
        </form>

        {/* OTP Verification Modal */}
        {showOTPModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">OTP Verification</h3>
                <p className="text-sm text-gray-600 mb-4">
                  A 6-digit OTP has been sent to {watch('email')}. Please enter it below to proceed.
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enter OTP
                    </label>
                    <input
                      type="text"
                      value={enteredOTP}
                      onChange={(e) => setEnteredOTP(e.target.value)}
                      maxLength={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg tracking-widest"
                      placeholder="000000"
                    />
                  </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowOTPModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  {(process.env.NODE_ENV === 'development' || testMode) && (
                    <button
                      type="button"
                      onClick={handleOTPBypass}
                      className="px-4 py-2 text-sm font-medium text-orange-700 bg-orange-100 rounded-md hover:bg-orange-200"
                    >
                      Skip OTP {testMode ? '(Test Mode)' : '(Dev)'}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleOTPVerification}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Verify OTP
                  </button>
                </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Premium Breakup Modal */}
        {showPremiumBreakup && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Premium Breakup</h3>
                  <button
                    onClick={() => setShowPremiumBreakup(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Own Damage Premium:</span>
                    <span className="text-sm font-medium">₹{showPremiumBreakup.premiumBreakup.ownDamage.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Third Party Premium:</span>
                    <span className="text-sm font-medium">₹{showPremiumBreakup.premiumBreakup.thirdParty.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Personal Accident:</span>
                    <span className="text-sm font-medium">₹{showPremiumBreakup.premiumBreakup.personalAccident.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Add-on Premium:</span>
                    <span className="text-sm font-medium">₹{showPremiumBreakup.addOnPremium.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Subtotal:</span>
                    <span className="text-sm font-medium">₹{(showPremiumBreakup.basePremium + showPremiumBreakup.addOnPremium).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">GST (18%):</span>
                    <span className="text-sm font-medium">₹{showPremiumBreakup.premiumBreakup.gst.toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-900">Total Premium:</span>
                      <span className="text-sm font-bold text-blue-600">₹{showPremiumBreakup.totalPremium.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Proposal Form Modal */}
        {/* KYC Verification Modal */}
        {showKYCForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900">KYC Verification</h3>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      kycStatus === 'verified' ? 'bg-green-100 text-green-800' :
                      kycStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {kycStatus === 'verified' ? 'Verified' : 
                       kycStatus === 'rejected' ? 'Rejected' : 'Pending'}
                    </span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-4">
                    Please upload the required documents for KYC verification. All documents should be clear and readable.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Identity Proof */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Identity Proof (PAN Card) <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs text-gray-500">Upload PAN Card for identity verification</p>
                    <div className={`border-2 border-dashed rounded-lg p-4 ${
                      kycDocuments.identityProof ? 
                        (panValidation.isValid ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50') : 
                        'border-gray-300'
                    }`}>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleDocumentUpload('identityProof', file)
                        }}
                        className="hidden"
                        id="identityProof"
                      />
                      <label htmlFor="identityProof" className="cursor-pointer">
                        {kycDocuments.identityProof ? (
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              {panValidation.isValid ? (
                                <CheckCircleIcon className="h-5 w-5 text-green-600" />
                              ) : (
                                <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
                              )}
                              <span className={`text-sm ${panValidation.isValid ? 'text-green-600' : 'text-red-600'}`}>
                                {kycDocuments.identityProof.name}
                              </span>
                            </div>
                            
                            {/* PAN Card Validation Results */}
                            {panValidation.panNumber && (
                              <div className="mt-3 p-3 bg-white rounded border">
                                <h4 className="text-sm font-medium text-gray-900 mb-2">PAN Card Details:</h4>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  <div>
                                    <span className="text-gray-600">PAN Number:</span>
                                    <p className="font-medium">{panValidation.panNumber}</p>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Name:</span>
                                    <p className="font-medium">{panValidation.name}</p>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Father's Name:</span>
                                    <p className="font-medium">{panValidation.fatherName}</p>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Date of Birth:</span>
                                    <p className="font-medium">{panValidation.dob}</p>
                                  </div>
                                </div>
                                
                                {/* Validation Status */}
                                <div className="mt-2">
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    panValidation.isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                    {panValidation.isValid ? '✓ Valid PAN Card' : '✗ Invalid PAN Card'}
                                  </span>
                                </div>
                                
                                {/* Validation Errors */}
                                {panValidation.errors.length > 0 && (
                                  <div className="mt-2">
                                    <p className="text-xs text-red-600 font-medium">Issues found:</p>
                                    <ul className="text-xs text-red-600 list-disc list-inside">
                                      {panValidation.errors.map((error, index) => (
                                        <li key={index}>{error}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center">
                            <DocumentIcon className="mx-auto h-8 w-8 text-gray-400" />
                            <p className="text-sm text-gray-600">Click to upload PAN Card</p>
                            <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max 10MB)</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Address Proof */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Address Proof <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs text-gray-500">Aadhaar Card, Utility Bill, Bank Statement, or Rental Agreement</p>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleDocumentUpload('addressProof', file)
                        }}
                        className="hidden"
                        id="addressProof"
                      />
                      <label htmlFor="addressProof" className="cursor-pointer">
                        {kycDocuments.addressProof ? (
                          <div className="flex items-center space-x-2 text-green-600">
                            <CheckCircleIcon className="h-5 w-5" />
                            <span className="text-sm">{kycDocuments.addressProof.name}</span>
                          </div>
                        ) : (
                          <div className="text-center">
                            <DocumentIcon className="mx-auto h-8 w-8 text-gray-400" />
                            <p className="text-sm text-gray-600">Click to upload</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Vehicle RC */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Vehicle Registration Certificate <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs text-gray-500">Original RC or Smart Card</p>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleDocumentUpload('vehicleRC', file)
                        }}
                        className="hidden"
                        id="vehicleRC"
                      />
                      <label htmlFor="vehicleRC" className="cursor-pointer">
                        {kycDocuments.vehicleRC ? (
                          <div className="flex items-center space-x-2 text-green-600">
                            <CheckCircleIcon className="h-5 w-5" />
                            <span className="text-sm">{kycDocuments.vehicleRC.name}</span>
                          </div>
                        ) : (
                          <div className="text-center">
                            <DocumentIcon className="mx-auto h-8 w-8 text-gray-400" />
                            <p className="text-sm text-gray-600">Click to upload</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Vehicle Invoice */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Vehicle Invoice (Optional)
                    </label>
                    <p className="text-xs text-gray-500">For new vehicles - Purchase Invoice</p>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleDocumentUpload('vehicleInvoice', file)
                        }}
                        className="hidden"
                        id="vehicleInvoice"
                      />
                      <label htmlFor="vehicleInvoice" className="cursor-pointer">
                        {kycDocuments.vehicleInvoice ? (
                          <div className="flex items-center space-x-2 text-green-600">
                            <CheckCircleIcon className="h-5 w-5" />
                            <span className="text-sm">{kycDocuments.vehicleInvoice.name}</span>
                          </div>
                        ) : (
                          <div className="text-center">
                            <DocumentIcon className="mx-auto h-8 w-8 text-gray-400" />
                            <p className="text-sm text-gray-600">Click to upload</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Income Proof */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Income Proof (Optional)
                    </label>
                    <p className="text-xs text-gray-500">Salary Slip, ITR, or Bank Statement</p>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleDocumentUpload('incomeProof', file)
                        }}
                        className="hidden"
                        id="incomeProof"
                      />
                      <label htmlFor="incomeProof" className="cursor-pointer">
                        {kycDocuments.incomeProof ? (
                          <div className="flex items-center space-x-2 text-green-600">
                            <CheckCircleIcon className="h-5 w-5" />
                            <span className="text-sm">{kycDocuments.incomeProof.name}</span>
                          </div>
                        ) : (
                          <div className="text-center">
                            <DocumentIcon className="mx-auto h-8 w-8 text-gray-400" />
                            <p className="text-sm text-gray-600">Click to upload</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">Document Requirements:</h4>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• <strong>PAN Card:</strong> Must be valid and contain all required information</li>
                    <li>• Documents should be clear and readable</li>
                    <li>• Accepted formats: PDF, JPG, JPEG, PNG</li>
                    <li>• Maximum file size: 10MB per document</li>
                    <li>• All required documents must be uploaded to proceed</li>
                    <li>• PAN card will be automatically validated upon upload</li>
                  </ul>
                </div>

                {/* PAN Card Validation Info */}
                {kycDocuments.identityProof && (
                  <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h4 className="text-sm font-medium text-yellow-900 mb-2">PAN Card Validation:</h4>
                    <ul className="text-xs text-yellow-800 space-y-1">
                      <li>• PAN number format: 5 letters + 4 digits + 1 letter (e.g., ABCDE1234F)</li>
                      <li>• Must contain valid name, father's name, and date of birth</li>
                      <li>• Must have signature and photo</li>
                      <li>• File must be clear and readable</li>
                    </ul>
                  </div>
                )}

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowKYCForm(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  {(process.env.NODE_ENV === 'development' || testMode) && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          // Simulate valid PAN card
                          setPanValidation({
                            isValid: true,
                            panNumber: 'ABCDE1234F',
                            name: 'JOHN DOE',
                            fatherName: 'JANE DOE',
                            dob: '01/01/1990',
                            errors: []
                          })
                          toast.success('Test: Valid PAN card simulated!')
                        }}
                        className="px-3 py-2 text-xs font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200"
                      >
                        Test Valid PAN
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          // Simulate invalid PAN card
                          setPanValidation({
                            isValid: false,
                            panNumber: 'INVALID123',
                            name: '',
                            fatherName: '',
                            dob: '',
                            errors: ['Invalid PAN number format', 'Name not found', 'Father\'s name not found', 'Date of birth not found']
                          })
                          toast.error('Test: Invalid PAN card simulated!')
                        }}
                        className="px-3 py-2 text-xs font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200"
                      >
                        Test Invalid PAN
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          toast.success('KYC bypassed for testing!')
                          setShowKYCForm(false)
                          setShowProposalForm(true)
                        }}
                        className="px-4 py-2 text-sm font-medium text-orange-700 bg-orange-100 rounded-md hover:bg-orange-200"
                      >
                        Skip KYC {testMode ? '(Test Mode)' : '(Dev)'}
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={handleKYCVerification}
                    disabled={kycStatus === 'pending'}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {kycStatus === 'pending' ? 'Verifying...' : 'Verify KYC'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showProposalForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Policy Proposal Form</h3>
                <form onSubmit={handleSubmit(handleProposalSubmission)} className="space-y-4">
                  {/* Customer Details Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Selected Plan</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Insurance Company:</span>
                        <p className="font-medium">{selectedQuote?.companyName}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Total Premium:</span>
                        <p className="font-medium">₹{selectedQuote?.totalPremium.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Proposal Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nominee Name *
                      </label>
                      <input
                        type="text"
                        {...register('nomineeName')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nominee Relationship *
                      </label>
                      <select {...register('nomineeRelationship')} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                        <option value="">Select Relationship</option>
                        <option value="spouse">Spouse</option>
                        <option value="child">Child</option>
                        <option value="parent">Parent</option>
                        <option value="sibling">Sibling</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nominee Date of Birth *
                      </label>
                      <input
                        type="date"
                        {...register('nomineeDOB')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Mode *
                      </label>
                      <select {...register('paymentMode')} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                        <option value="">Select Payment Mode</option>
                        <option value="online">Online Payment</option>
                        <option value="cheque">Cheque</option>
                        <option value="dd">Demand Draft</option>
                        <option value="cash">Cash</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowProposalForm(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveDraft}
                      disabled={isSavingDraft}
                      className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 disabled:opacity-50"
                    >
                      {isSavingDraft ? 'Saving...' : 'Save as Draft'}
                    </button>
                    {(process.env.NODE_ENV === 'development' || testMode) && (
                      <button
                        type="button"
                        onClick={() => {
                          console.log('Test: Bypassing proposal form submission')
                          // Simulate successful policy issuance
                          const policyNumber = `POL${Date.now().toString().slice(-8)}`
                          const certificateNumber = `CERT${Date.now().toString().slice(-10)}`
                          
                          toast.success(`Test: Policy issued successfully! Policy Number: ${policyNumber}`)
                          setShowProposalForm(false)
                          setQuotationGenerated(true)
                          setCurrentStep(4)
                        }}
                        className="px-4 py-2 text-sm font-medium text-orange-700 bg-orange-100 rounded-md hover:bg-orange-200"
                      >
                        Test Submit {testMode ? '(Test Mode)' : '(Dev)'}
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Processing...' : 'Submit Proposal'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Payment Form Modal */}
        {showPaymentForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Processing</h3>
                
                {/* Payment Status */}
                <div className="mb-6">
                  <div className={`p-4 rounded-lg ${
                    paymentStatus === 'pending' ? 'bg-blue-50 border border-blue-200' :
                    paymentStatus === 'processing' ? 'bg-yellow-50 border border-yellow-200' :
                    paymentStatus === 'completed' ? 'bg-green-50 border border-green-200' :
                    'bg-red-50 border border-red-200'
                  }`}>
                    <div className="flex items-center">
                      {paymentStatus === 'pending' && (
                        <>
                          <ClockIcon className="h-5 w-5 text-blue-600 mr-2" />
                          <span className="text-blue-800">Payment Pending</span>
                        </>
                      )}
                      {paymentStatus === 'processing' && (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-600 mr-2"></div>
                          <span className="text-yellow-800">Processing Payment...</span>
                        </>
                      )}
                      {paymentStatus === 'completed' && (
                        <>
                          <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                          <span className="text-green-800">Payment Completed</span>
                        </>
                      )}
                      {paymentStatus === 'failed' && (
                        <>
                          <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2" />
                          <span className="text-red-800">Payment Failed</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Payment Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Insurance Company:</span>
                      <span className="font-medium">{selectedQuote?.companyName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Policy Type:</span>
                      <span className="font-medium">{watch('policyType')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Premium Amount:</span>
                      <span className="font-medium">₹{selectedQuote?.totalPremium.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">GST (18%):</span>
                      <span className="font-medium">₹{Math.round((selectedQuote?.totalPremium || 0) * 0.18).toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total Amount:</span>
                        <span>₹{Math.round((selectedQuote?.totalPremium || 0) * 1.18).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Methods */}
                {paymentStatus === 'pending' && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-900">Select Payment Method</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        onClick={() => handlePaymentProcessing({ method: 'online', type: 'card' })}
                        className="p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-blue-600 font-semibold">💳</span>
                          </div>
                          <div className="text-left">
                            <div className="font-medium">Credit/Debit Card</div>
                            <div className="text-sm text-gray-500">Visa, Mastercard, RuPay</div>
                          </div>
                        </div>
                      </button>
                      
                      <button
                        onClick={() => handlePaymentProcessing({ method: 'online', type: 'netbanking' })}
                        className="p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-green-600 font-semibold">🏦</span>
                          </div>
                          <div className="text-left">
                            <div className="font-medium">Net Banking</div>
                            <div className="text-sm text-gray-500">All major banks</div>
                          </div>
                        </div>
                      </button>
                      
                      <button
                        onClick={() => handlePaymentProcessing({ method: 'online', type: 'upi' })}
                        className="p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-purple-600 font-semibold">📱</span>
                          </div>
                          <div className="text-left">
                            <div className="font-medium">UPI</div>
                            <div className="text-sm text-gray-500">PhonePe, GPay, Paytm</div>
                          </div>
                        </div>
                      </button>
                      
                      <button
                        onClick={() => handlePaymentProcessing({ method: 'offline', type: 'cheque' })}
                        className="p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-orange-600 font-semibold">📄</span>
                          </div>
                          <div className="text-left">
                            <div className="font-medium">Cheque/DD</div>
                            <div className="text-sm text-gray-500">Offline payment</div>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                {/* Test Mode Payment */}
                {(process.env.NODE_ENV === 'development' || testMode) && paymentStatus === 'pending' && (
                  <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <h4 className="text-sm font-medium text-orange-900 mb-2">Test Mode</h4>
                    <button
                      onClick={() => handlePaymentProcessing({ method: 'test', type: 'bypass' })}
                      className="w-full px-4 py-2 text-sm font-medium text-orange-700 bg-orange-100 rounded-md hover:bg-orange-200"
                    >
                      Skip Payment (Test Mode)
                    </button>
                  </div>
                )}

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPaymentForm(false)
                      setShowProposalForm(true)
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Back to Proposal
                  </button>
                  {paymentStatus === 'failed' && (
                    <button
                      onClick={() => setPaymentStatus('pending')}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      Retry Payment
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Policy Certificate Modal */}
        {showPolicyCertificate && issuedPolicy && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="text-center mb-6">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Policy Issued Successfully!</h3>
                  <p className="text-sm text-gray-600">Your insurance policy has been issued and certificate has been sent to your email.</p>
                </div>

                {/* Policy Certificate */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
                  <div className="text-center mb-4">
                    <h4 className="text-xl font-bold text-blue-900">ELEZENX INSURANCE</h4>
                    <p className="text-sm text-blue-700">Motor Vehicle Insurance Certificate</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-3">Policy Details</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Policy Number:</span>
                          <span className="font-medium">{issuedPolicy.policyNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Certificate Number:</span>
                          <span className="font-medium">{issuedPolicy.certificateNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Insurance Company:</span>
                          <span className="font-medium">{issuedPolicy.insuranceCompany}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Premium Amount:</span>
                          <span className="font-medium">₹{issuedPolicy.premiumAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Policy Start Date:</span>
                          <span className="font-medium">{issuedPolicy.startDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Policy End Date:</span>
                          <span className="font-medium">{issuedPolicy.endDate}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-3">Vehicle Details</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Customer Name:</span>
                          <span className="font-medium">{issuedPolicy.customerName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Vehicle:</span>
                          <span className="font-medium">
                            {issuedPolicy.vehicleDetails.oem} {issuedPolicy.vehicleDetails.model}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Variant:</span>
                          <span className="font-medium">{issuedPolicy.vehicleDetails.variant}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Year of Manufacture:</span>
                          <span className="font-medium">{issuedPolicy.vehicleDetails.year}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Registration City:</span>
                          <span className="font-medium">{issuedPolicy.vehicleDetails.registrationCity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Nominee:</span>
                          <span className="font-medium">{issuedPolicy.nomineeDetails.name} ({issuedPolicy.nomineeDetails.relationship})</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-blue-200">
                    <h5 className="font-semibold text-gray-900 mb-2">Coverage Details</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Own Damage:</span>
                        <p className="font-medium">₹{selectedQuote?.premiumBreakup.ownDamage.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Third Party:</span>
                        <p className="font-medium">₹{selectedQuote?.premiumBreakup.thirdParty.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Personal Accident:</span>
                        <p className="font-medium">₹{selectedQuote?.premiumBreakup.personalAccident.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-blue-200">
                    <h5 className="font-semibold text-gray-900 mb-2">Selected Add-ons</h5>
                    <div className="flex flex-wrap gap-2">
                      {issuedPolicy.addOns.map((addOnId: string) => {
                        const addOn = addOns.find(a => a.id === addOnId)
                        return (
                          <span key={addOnId} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {addOn?.name}
                          </span>
                        )
                      })}
                      {issuedPolicy.addOns.length === 0 && (
                        <span className="text-sm text-gray-500">No add-ons selected</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => window.print()}
                    className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Print Certificate
                  </button>
                  <button
                    onClick={() => {
                      setQuotationGenerated(false)
                      setCurrentStep(1)
                      setShowQuotes(false)
                      setSelectedAddOns([])
                      setAdditionalAddOns([])
                      setQuotes([])
                      setSelectedQuote(null)
                    }}
                    className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    New Quotation
                  </button>
                  <button
                    onClick={() => {
                      setShowPolicyCertificate(false)
                      setQuotationGenerated(false)
                      setCurrentStep(1)
                      setShowQuotes(false)
                      setSelectedAddOns([])
                      setAdditionalAddOns([])
                      setQuotes([])
                      setSelectedQuote(null)
                    }}
                    className="px-6 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
