'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  UserPlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChartBarIcon,
  ArrowLeftIcon,
  DocumentArrowDownIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const leadSchema = z.object({
  leadType: z.enum(['CORPORATE', 'INDIVIDUAL']),
  // Location fields
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  pincode: z.string().optional(),
  // Corporate fields
  companyName: z.string().optional(),
  address: z.string().optional(),
  pan: z.string().optional(),
  gst: z.string().optional(),
  websiteUrl: z.string().optional(),
  contactPersonName: z.string().optional(),
  phoneCountryCode: z.string().optional(),
  phoneNumber: z.string().optional(),
  emailAddress: z.string().optional(),
  // Individual fields
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  mobileCountryCode: z.string().optional(),
  mobileNumber: z.string().optional(),
  // Common fields
  source: z.string().min(1, 'Lead source is required'),
  productInterest: z.string().optional(),
  estimatedValue: z.number().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  status: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL_SENT', 'NEGOTIATING', 'WON', 'LOST']),
  assignedTo: z.string().min(1, 'Assigned agent is required'),
  notes: z.string().optional(),
}).refine((data) => {
  if (data.leadType === 'CORPORATE') {
    return data.companyName && data.emailAddress;
  } else {
    return data.firstName && data.lastName && (data.mobileNumber || data.emailAddress);
  }
}, {
  message: "Required fields must be filled based on lead type",
  path: ["leadType"]
})

type LeadForm = z.infer<typeof leadSchema>

interface Lead {
  id: string
  leadType: 'CORPORATE' | 'INDIVIDUAL'
  // Location fields
  country?: string
  state?: string
  city?: string
  pincode?: string
  // Corporate fields
  companyName?: string
  address?: string
  pan?: string
  gst?: string
  websiteUrl?: string
  contactPersonName?: string
  phoneCountryCode?: string
  phoneNumber?: string
  emailAddress?: string
  // Individual fields
  firstName?: string
  lastName?: string
  mobileCountryCode?: string
  mobileNumber?: string
  // Common fields
  source: string
  productInterest?: string
  estimatedValue?: number
  priority: string
  status: string
  assignedTo: string
  assignedAgent?: {
    name: string
    email: string
  }
  notes?: string
  createdAt: string
  updatedAt: string
  lastContactDate?: string
}

const LEAD_SOURCES = [
  'Website',
  'Referral',
  'Social Media',
  'Cold Call',
  'Email Campaign',
  'Advertisement',
  'Trade Show',
  'Partner',
  'Direct Mail',
  'Other',
]

const PRODUCT_INTERESTS = [
  'Motor Insurance',
  'Health Insurance',
  'Life Insurance',
  'Home Insurance',
  'Travel Insurance',
  'Business Insurance',
  'Two Wheeler Insurance',
  'Commercial Vehicle Insurance',
  'Group Health Insurance',
  'Term Life Insurance',
]

const AGENTS = [
  { id: '1', name: 'Rajesh Kumar', email: 'rajesh@insurance.com' },
  { id: '2', name: 'Priya Sharma', email: 'priya@insurance.com' },
  { id: '3', name: 'Amit Patel', email: 'amit@insurance.com' },
  { id: '4', name: 'Sneha Gupta', email: 'sneha@insurance.com' },
  { id: '5', name: 'Vikram Singh', email: 'vikram@insurance.com' },
]

// Comprehensive country data with states, cities, and pincodes
const COUNTRY_DATA = {
  'India': {
    states: {
      'Andhra Pradesh': {
        cities: {
          'Hyderabad': ['500001', '500002', '500003', '500004', '500005', '500006', '500007', '500008', '500009', '500010'],
          'Visakhapatnam': ['530001', '530002', '530003', '530004', '530005', '530006', '530007', '530008', '530009', '530010'],
          'Vijayawada': ['520001', '520002', '520003', '520004', '520005', '520006', '520007', '520008', '520009', '520010'],
          'Guntur': ['522001', '522002', '522003', '522004', '522005', '522006', '522007', '522008', '522009', '522010'],
          'Tirupati': ['517501', '517502', '517503', '517504', '517505', '517506', '517507', '517508', '517509', '517510']
        }
      },
      'Arunachal Pradesh': {
        cities: {
          'Itanagar': ['791111', '791112', '791113', '791114', '791115'],
          'Naharlagun': ['791110', '791120', '791130', '791140', '791150'],
          'Pasighat': ['791102', '791103', '791104', '791105', '791106']
        }
      },
      'Assam': {
        cities: {
          'Guwahati': ['781001', '781002', '781003', '781004', '781005', '781006', '781007', '781008', '781009', '781010'],
          'Silchar': ['788001', '788002', '788003', '788004', '788005'],
          'Dibrugarh': ['786001', '786002', '786003', '786004', '786005'],
          'Jorhat': ['785001', '785002', '785003', '785004', '785005']
        }
      },
      'Bihar': {
        cities: {
          'Patna': ['800001', '800002', '800003', '800004', '800005', '800006', '800007', '800008', '800009', '800010'],
          'Gaya': ['823001', '823002', '823003', '823004', '823005'],
          'Bhagalpur': ['812001', '812002', '812003', '812004', '812005'],
          'Muzaffarpur': ['842001', '842002', '842003', '842004', '842005']
        }
      },
      'Chhattisgarh': {
        cities: {
          'Raipur': ['492001', '492002', '492003', '492004', '492005', '492006', '492007', '492008', '492009', '492010'],
          'Bilaspur': ['495001', '495002', '495003', '495004', '495005'],
          'Durg': ['491001', '491002', '491003', '491004', '491005']
        }
      },
      'Delhi': {
        cities: {
          'New Delhi': ['110001', '110002', '110003', '110004', '110005', '110006', '110007', '110008', '110009', '110010'],
          'Central Delhi': ['110011', '110012', '110013', '110014', '110015', '110016', '110017', '110018', '110019', '110020'],
          'East Delhi': ['110021', '110022', '110023', '110024', '110025', '110026', '110027', '110028', '110029', '110030'],
          'North Delhi': ['110031', '110032', '110033', '110034', '110035', '110036', '110037', '110038', '110039', '110040'],
          'South Delhi': ['110041', '110042', '110043', '110044', '110045', '110046', '110047', '110048', '110049', '110050']
        }
      },
      'Goa': {
        cities: {
          'Panaji': ['403001', '403002', '403003', '403004', '403005'],
          'Margao': ['403601', '403602', '403603', '403604', '403605'],
          'Vasco da Gama': ['403802', '403803', '403804', '403805', '403806']
        }
      },
      'Gujarat': {
        cities: {
          'Ahmedabad': ['380001', '380002', '380003', '380004', '380005', '380006', '380007', '380008', '380009', '380010'],
          'Surat': ['395001', '395002', '395003', '395004', '395005', '395006', '395007', '395008', '395009', '395010'],
          'Vadodara': ['390001', '390002', '390003', '390004', '390005', '390006', '390007', '390008', '390009', '390010'],
          'Rajkot': ['360001', '360002', '360003', '360004', '360005'],
          'Bhavnagar': ['364001', '364002', '364003', '364004', '364005']
        }
      },
      'Haryana': {
        cities: {
          'Chandigarh': ['160001', '160002', '160003', '160004', '160005', '160006', '160007', '160008', '160009', '160010'],
          'Faridabad': ['121001', '121002', '121003', '121004', '121005'],
          'Gurgaon': ['122001', '122002', '122003', '122004', '122005'],
          'Panipat': ['132103', '132104', '132105', '132106', '132107']
        }
      },
      'Himachal Pradesh': {
        cities: {
          'Shimla': ['171001', '171002', '171003', '171004', '171005'],
          'Dharamshala': ['176215', '176216', '176217', '176218', '176219'],
          'Manali': ['175131', '175132', '175133', '175134', '175135']
        }
      },
      'Jammu and Kashmir': {
        cities: {
          'Srinagar': ['190001', '190002', '190003', '190004', '190005'],
          'Jammu': ['180001', '180002', '180003', '180004', '180005'],
          'Leh': ['194101', '194102', '194103', '194104', '194105']
        }
      },
      'Jharkhand': {
        cities: {
          'Ranchi': ['834001', '834002', '834003', '834004', '834005'],
          'Jamshedpur': ['831001', '831002', '831003', '831004', '831005'],
          'Dhanbad': ['826001', '826002', '826003', '826004', '826005']
        }
      },
      'Karnataka': {
        cities: {
          'Bangalore': ['560001', '560002', '560003', '560004', '560005', '560006', '560007', '560008', '560009', '560010'],
          'Mysore': ['570001', '570002', '570003', '570004', '570005', '570006', '570007', '570008', '570009', '570010'],
          'Hubli': ['580001', '580002', '580003', '580004', '580005'],
          'Mangalore': ['575001', '575002', '575003', '575004', '575005'],
          'Belgaum': ['590001', '590002', '590003', '590004', '590005']
        }
      },
      'Kerala': {
        cities: {
          'Thiruvananthapuram': ['695001', '695002', '695003', '695004', '695005'],
          'Kochi': ['682001', '682002', '682003', '682004', '682005'],
          'Kozhikode': ['673001', '673002', '673003', '673004', '673005'],
          'Thrissur': ['680001', '680002', '680003', '680004', '680005']
        }
      },
      'Madhya Pradesh': {
        cities: {
          'Bhopal': ['462001', '462002', '462003', '462004', '462005'],
          'Indore': ['452001', '452002', '452003', '452004', '452005'],
          'Gwalior': ['474001', '474002', '474003', '474004', '474005'],
          'Jabalpur': ['482001', '482002', '482003', '482004', '482005']
        }
      },
      'Maharashtra': {
        cities: {
          'Mumbai': ['400001', '400002', '400003', '400004', '400005', '400006', '400007', '400008', '400009', '400010'],
          'Pune': ['411001', '411002', '411003', '411004', '411005', '411006', '411007', '411008', '411009', '411010'],
          'Nagpur': ['440001', '440002', '440003', '440004', '440005', '440006', '440007', '440008', '440009', '440010'],
          'Nashik': ['422001', '422002', '422003', '422004', '422005'],
          'Aurangabad': ['431001', '431002', '431003', '431004', '431005']
        }
      },
      'Manipur': {
        cities: {
          'Imphal': ['795001', '795002', '795003', '795004', '795005']
        }
      },
      'Meghalaya': {
        cities: {
          'Shillong': ['793001', '793002', '793003', '793004', '793005']
        }
      },
      'Mizoram': {
        cities: {
          'Aizawl': ['796001', '796002', '796003', '796004', '796005']
        }
      },
      'Nagaland': {
        cities: {
          'Kohima': ['797001', '797002', '797003', '797004', '797005']
        }
      },
      'Odisha': {
        cities: {
          'Bhubaneswar': ['751001', '751002', '751003', '751004', '751005'],
          'Cuttack': ['753001', '753002', '753003', '753004', '753005'],
          'Rourkela': ['769001', '769002', '769003', '769004', '769005']
        }
      },
      'Punjab': {
        cities: {
          'Chandigarh': ['160001', '160002', '160003', '160004', '160005'],
          'Ludhiana': ['141001', '141002', '141003', '141004', '141005'],
          'Amritsar': ['143001', '143002', '143003', '143004', '143005'],
          'Jalandhar': ['144001', '144002', '144003', '144004', '144005']
        }
      },
      'Rajasthan': {
        cities: {
          'Jaipur': ['302001', '302002', '302003', '302004', '302005', '302006', '302007', '302008', '302009', '302010'],
          'Jodhpur': ['342001', '342002', '342003', '342004', '342005'],
          'Udaipur': ['313001', '313002', '313003', '313004', '313005'],
          'Kota': ['324001', '324002', '324003', '324004', '324005']
        }
      },
      'Sikkim': {
        cities: {
          'Gangtok': ['737101', '737102', '737103', '737104', '737105']
        }
      },
      'Tamil Nadu': {
        cities: {
          'Chennai': ['600001', '600002', '600003', '600004', '600005', '600006', '600007', '600008', '600009', '600010'],
          'Coimbatore': ['641001', '641002', '641003', '641004', '641005', '641006', '641007', '641008', '641009', '641010'],
          'Madurai': ['625001', '625002', '625003', '625004', '625005'],
          'Tiruchirappalli': ['620001', '620002', '620003', '620004', '620005'],
          'Salem': ['636001', '636002', '636003', '636004', '636005']
        }
      },
      'Telangana': {
        cities: {
          'Hyderabad': ['500001', '500002', '500003', '500004', '500005', '500006', '500007', '500008', '500009', '500010'],
          'Warangal': ['506001', '506002', '506003', '506004', '506005'],
          'Nizamabad': ['503001', '503002', '503003', '503004', '503005']
        }
      },
      'Tripura': {
        cities: {
          'Agartala': ['799001', '799002', '799003', '799004', '799005']
        }
      },
      'Uttar Pradesh': {
        cities: {
          'Lucknow': ['226001', '226002', '226003', '226004', '226005', '226006', '226007', '226008', '226009', '226010'],
          'Kanpur': ['208001', '208002', '208003', '208004', '208005'],
          'Agra': ['282001', '282002', '282003', '282004', '282005'],
          'Varanasi': ['221001', '221002', '221003', '221004', '221005'],
          'Allahabad': ['211001', '211002', '211003', '211004', '211005']
        }
      },
      'Uttarakhand': {
        cities: {
          'Dehradun': ['248001', '248002', '248003', '248004', '248005'],
          'Haridwar': ['249401', '249402', '249403', '249404', '249405'],
          'Rishikesh': ['249201', '249202', '249203', '249204', '249205']
        }
      },
      'West Bengal': {
        cities: {
          'Kolkata': ['700001', '700002', '700003', '700004', '700005', '700006', '700007', '700008', '700009', '700010'],
          'Howrah': ['711101', '711102', '711103', '711104', '711105'],
          'Durgapur': ['713201', '713202', '713203', '713204', '713205'],
          'Asansol': ['713301', '713302', '713303', '713304', '713305']
        }
      }
    }
  },
  'United States': {
    states: {
      'Alabama': {
        cities: {
          'Birmingham': ['35201', '35202', '35203', '35204', '35205'],
          'Montgomery': ['36101', '36102', '36103', '36104', '36105'],
          'Mobile': ['36601', '36602', '36603', '36604', '36605']
        }
      },
      'Alaska': {
        cities: {
          'Anchorage': ['99501', '99502', '99503', '99504', '99505'],
          'Fairbanks': ['99701', '99702', '99703', '99704', '99705'],
          'Juneau': ['99801', '99802', '99803', '99804', '99805']
        }
      },
      'Arizona': {
        cities: {
          'Phoenix': ['85001', '85002', '85003', '85004', '85005'],
          'Tucson': ['85701', '85702', '85703', '85704', '85705'],
          'Mesa': ['85201', '85202', '85203', '85204', '85205']
        }
      },
      'California': {
        cities: {
          'Los Angeles': ['90001', '90002', '90003', '90004', '90005', '90006', '90007', '90008', '90009', '90010'],
          'San Francisco': ['94101', '94102', '94103', '94104', '94105', '94106', '94107', '94108', '94109', '94110'],
          'San Diego': ['92101', '92102', '92103', '92104', '92105', '92106', '92107', '92108', '92109', '92110'],
          'San Jose': ['95101', '95102', '95103', '95104', '95105'],
          'Oakland': ['94601', '94602', '94603', '94604', '94605']
        }
      },
      'Florida': {
        cities: {
          'Miami': ['33101', '33102', '33103', '33104', '33105'],
          'Orlando': ['32801', '32802', '32803', '32804', '32805'],
          'Tampa': ['33601', '33602', '33603', '33604', '33605'],
          'Jacksonville': ['32201', '32202', '32203', '32204', '32205']
        }
      },
      'New York': {
        cities: {
          'New York City': ['10001', '10002', '10003', '10004', '10005', '10006', '10007', '10008', '10009', '10010'],
          'Buffalo': ['14201', '14202', '14203', '14204', '14205'],
          'Rochester': ['14601', '14602', '14603', '14604', '14605'],
          'Albany': ['12201', '12202', '12203', '12204', '12205']
        }
      },
      'Texas': {
        cities: {
          'Houston': ['77001', '77002', '77003', '77004', '77005', '77006', '77007', '77008', '77009', '77010'],
          'Dallas': ['75201', '75202', '75203', '75204', '75205', '75206', '75207', '75208', '75209', '75210'],
          'Austin': ['78701', '78702', '78703', '78704', '78705'],
          'San Antonio': ['78201', '78202', '78203', '78204', '78205']
        }
      }
    }
  },
  'United Kingdom': {
    states: {
      'England': {
        cities: {
          'London': ['SW1A 1AA', 'SW1A 2AA', 'SW1A 3AA', 'SW1A 4AA', 'SW1A 5AA', 'SW1A 6AA', 'SW1A 7AA', 'SW1A 8AA', 'SW1A 9AA', 'SW1A 0AA'],
          'Manchester': ['M1 1AA', 'M1 2AA', 'M1 3AA', 'M1 4AA', 'M1 5AA'],
          'Birmingham': ['B1 1AA', 'B1 2AA', 'B1 3AA', 'B1 4AA', 'B1 5AA'],
          'Liverpool': ['L1 1AA', 'L1 2AA', 'L1 3AA', 'L1 4AA', 'L1 5AA'],
          'Leeds': ['LS1 1AA', 'LS1 2AA', 'LS1 3AA', 'LS1 4AA', 'LS1 5AA']
        }
      },
      'Scotland': {
        cities: {
          'Edinburgh': ['EH1 1AA', 'EH1 2AA', 'EH1 3AA', 'EH1 4AA', 'EH1 5AA'],
          'Glasgow': ['G1 1AA', 'G1 2AA', 'G1 3AA', 'G1 4AA', 'G1 5AA'],
          'Aberdeen': ['AB1 1AA', 'AB1 2AA', 'AB1 3AA', 'AB1 4AA', 'AB1 5AA']
        }
      },
      'Wales': {
        cities: {
          'Cardiff': ['CF1 1AA', 'CF1 2AA', 'CF1 3AA', 'CF1 4AA', 'CF1 5AA'],
          'Swansea': ['SA1 1AA', 'SA1 2AA', 'SA1 3AA', 'SA1 4AA', 'SA1 5AA']
        }
      },
      'Northern Ireland': {
        cities: {
          'Belfast': ['BT1 1AA', 'BT1 2AA', 'BT1 3AA', 'BT1 4AA', 'BT1 5AA']
        }
      }
    }
  },
  'Canada': {
    states: {
      'Ontario': {
        cities: {
          'Toronto': ['M1A 1A1', 'M1A 1A2', 'M1A 1A3', 'M1A 1A4', 'M1A 1A5'],
          'Ottawa': ['K1A 1A1', 'K1A 1A2', 'K1A 1A3', 'K1A 1A4', 'K1A 1A5'],
          'Hamilton': ['L8A 1A1', 'L8A 1A2', 'L8A 1A3', 'L8A 1A4', 'L8A 1A5']
        }
      },
      'Quebec': {
        cities: {
          'Montreal': ['H1A 1A1', 'H1A 1A2', 'H1A 1A3', 'H1A 1A4', 'H1A 1A5'],
          'Quebec City': ['G1A 1A1', 'G1A 1A2', 'G1A 1A3', 'G1A 1A4', 'G1A 1A5']
        }
      },
      'British Columbia': {
        cities: {
          'Vancouver': ['V1A 1A1', 'V1A 1A2', 'V1A 1A3', 'V1A 1A4', 'V1A 1A5'],
          'Victoria': ['V8A 1A1', 'V8A 1A2', 'V8A 1A3', 'V8A 1A4', 'V8A 1A5']
        }
      }
    }
  },
  'Australia': {
    states: {
      'New South Wales': {
        cities: {
          'Sydney': ['2000', '2001', '2002', '2003', '2004'],
          'Newcastle': ['2300', '2301', '2302', '2303', '2304'],
          'Wollongong': ['2500', '2501', '2502', '2503', '2504']
        }
      },
      'Victoria': {
        cities: {
          'Melbourne': ['3000', '3001', '3002', '3003', '3004'],
          'Geelong': ['3220', '3221', '3222', '3223', '3224']
        }
      },
      'Queensland': {
        cities: {
          'Brisbane': ['4000', '4001', '4002', '4003', '4004'],
          'Gold Coast': ['4217', '4218', '4219', '4220', '4221']
        }
      }
    }
  },
  'Germany': {
    states: {
      'Bavaria': {
        cities: {
          'Munich': ['80331', '80333', '80335', '80336', '80337'],
          'Nuremberg': ['90402', '90403', '90404', '90405', '90406']
        }
      },
      'North Rhine-Westphalia': {
        cities: {
          'Cologne': ['50667', '50668', '50669', '50670', '50671'],
          'Düsseldorf': ['40210', '40211', '40212', '40213', '40214']
        }
      },
      'Baden-Württemberg': {
        cities: {
          'Stuttgart': ['70173', '70174', '70175', '70176', '70177']
        }
      }
    }
  },
  'France': {
    states: {
      'Île-de-France': {
        cities: {
          'Paris': ['75001', '75002', '75003', '75004', '75005']
        }
      },
      'Provence-Alpes-Côte d\'Azur': {
        cities: {
          'Marseille': ['13001', '13002', '13003', '13004', '13005'],
          'Nice': ['06000', '06001', '06002', '06003', '06004']
        }
      }
    }
  },
  'Japan': {
    states: {
      'Tokyo': {
        cities: {
          'Tokyo': ['100-0001', '100-0002', '100-0003', '100-0004', '100-0005']
        }
      },
      'Osaka': {
        cities: {
          'Osaka': ['530-0001', '530-0002', '530-0003', '530-0004', '530-0005']
        }
      },
      'Kyoto': {
        cities: {
          'Kyoto': ['600-0001', '600-0002', '600-0003', '600-0004', '600-0005']
        }
      }
    }
  },
  'China': {
    states: {
      'Beijing': {
        cities: {
          'Beijing': ['100000', '100001', '100002', '100003', '100004']
        }
      },
      'Shanghai': {
        cities: {
          'Shanghai': ['200000', '200001', '200002', '200003', '200004']
        }
      },
      'Guangdong': {
        cities: {
          'Guangzhou': ['510000', '510001', '510002', '510003', '510004'],
          'Shenzhen': ['518000', '518001', '518002', '518003', '518004']
        }
      }
    }
  },
  'UAE': {
    states: {
      'Dubai': {
        cities: {
          'Dubai': ['00000', '00001', '00002', '00003', '00004']
        }
      },
      'Abu Dhabi': {
        cities: {
          'Abu Dhabi': ['00000', '00001', '00002', '00003', '00004']
        }
      }
    }
  },
  'Saudi Arabia': {
    states: {
      'Riyadh': {
        cities: {
          'Riyadh': ['11564', '11565', '11566', '11567', '11568']
        }
      },
      'Mecca': {
        cities: {
          'Mecca': ['24231', '24232', '24233', '24234', '24235']
        }
      }
    }
  },
  'Singapore': {
    states: {
      'Singapore': {
        cities: {
          'Singapore': ['018956', '018957', '018958', '018959', '018960']
        }
      }
    }
  },
  'Malaysia': {
    states: {
      'Kuala Lumpur': {
        cities: {
          'Kuala Lumpur': ['50000', '50001', '50002', '50003', '50004']
        }
      },
      'Selangor': {
        cities: {
          'Shah Alam': ['40000', '40001', '40002', '40003', '40004']
        }
      }
    }
  }
}

// Country codes for phone numbers
const COUNTRY_CODES = [
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+1', country: 'United States', flag: '🇺🇸' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+1', country: 'Canada', flag: '🇨🇦' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+86', country: 'China', flag: '🇨🇳' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+60', country: 'Malaysia', flag: '🇲🇾' },
]

// Mapping between country names and their country codes
const COUNTRY_TO_CODE_MAP: { [key: string]: string } = {
  'India': '+91',
  'United States': '+1',
  'United Kingdom': '+44',
  'Canada': '+1',
  'Australia': '+61',
  'Germany': '+49',
  'France': '+33',
  'Japan': '+81',
  'China': '+86',
  'UAE': '+971',
  'Saudi Arabia': '+966',
  'Singapore': '+65',
  'Malaysia': '+60',
}

export default function LeadGeneration() {
  const router = useRouter()
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchField, setSearchField] = useState('ALL') // New field to specify what to search
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [filterPriority, setFilterPriority] = useState('ALL')
  const [filterSource, setFilterSource] = useState('ALL')
  const [filterAgent, setFilterAgent] = useState('ALL')
  const [leadType, setLeadType] = useState<'CORPORATE' | 'INDIVIDUAL'>('INDIVIDUAL')
  
  // Dynamic dropdown states
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [availableStates, setAvailableStates] = useState<string[]>([])
  const [availableCities, setAvailableCities] = useState<string[]>([])
  const [availablePincodes, setAvailablePincodes] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LeadForm>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      leadType: 'INDIVIDUAL',
      priority: 'MEDIUM',
      status: 'NEW',
      phoneCountryCode: '+91',
      mobileCountryCode: '+91',
    },
  })

  const watchedLeadType = watch('leadType')

  // Functions to handle dynamic dropdown changes
  const handleCountryChange = (country: string) => {
    setSelectedCountry(country)
    setSelectedState('')
    setSelectedCity('')
    setValue('state', '')
    setValue('city', '')
    setValue('pincode', '')
    
    // Auto-set country codes for phone and mobile numbers
    if (country && COUNTRY_TO_CODE_MAP[country]) {
      const countryCode = COUNTRY_TO_CODE_MAP[country]
      setValue('phoneCountryCode', countryCode)
      setValue('mobileCountryCode', countryCode)
    }
    
    if (country && COUNTRY_DATA[country as keyof typeof COUNTRY_DATA]) {
      const states = Object.keys(COUNTRY_DATA[country as keyof typeof COUNTRY_DATA].states)
      setAvailableStates(states)
    } else {
      setAvailableStates([])
    }
    setAvailableCities([])
    setAvailablePincodes([])
  }

  const handleStateChange = (state: string) => {
    setSelectedState(state)
    setSelectedCity('')
    setValue('city', '')
    setValue('pincode', '')
    
    if (state && selectedCountry && COUNTRY_DATA[selectedCountry as keyof typeof COUNTRY_DATA]) {
      const cities = Object.keys((COUNTRY_DATA[selectedCountry as keyof typeof COUNTRY_DATA] as any).states[state].cities)
      setAvailableCities(cities)
    } else {
      setAvailableCities([])
    }
    setAvailablePincodes([])
  }

  const handleCityChange = (city: string) => {
    setSelectedCity(city)
    setValue('pincode', '')
    
    if (city && selectedState && selectedCountry && COUNTRY_DATA[selectedCountry as keyof typeof COUNTRY_DATA]) {
      const pincodes = (COUNTRY_DATA[selectedCountry as keyof typeof COUNTRY_DATA] as any).states[selectedState].cities[city]
      setAvailablePincodes(pincodes)
    } else {
      setAvailablePincodes([])
    }
  }

  const exportLeads = async (format: 'csv' | 'excel') => {
    try {
      // Filter leads based on current search and filters
      let filteredLeads = leads
      if (searchTerm) {
        filteredLeads = filteredLeads.filter((lead) => {
          const searchLower = searchTerm.toLowerCase()
          
          if (searchField !== 'ALL') {
            switch (searchField) {
              case 'NAME':
                return (lead.firstName && lead.firstName.toLowerCase().includes(searchLower)) ||
                       (lead.lastName && lead.lastName.toLowerCase().includes(searchLower)) ||
                       (lead.companyName && lead.companyName.toLowerCase().includes(searchLower))
              case 'EMAIL':
                return lead.emailAddress && lead.emailAddress.toLowerCase().includes(searchLower)
              case 'PHONE':
                return (lead.mobileNumber && lead.mobileNumber.includes(searchTerm)) ||
                       (lead.phoneNumber && lead.phoneNumber.includes(searchTerm))
              case 'PRODUCT':
                return lead.productInterest && lead.productInterest.toLowerCase().includes(searchLower)
              case 'COMPANY':
                return lead.companyName && lead.companyName.toLowerCase().includes(searchLower)
              case 'LOCATION':
                return (lead.city && lead.city.toLowerCase().includes(searchLower)) ||
                       (lead.state && lead.state.toLowerCase().includes(searchLower)) ||
                       (lead.country && lead.country.toLowerCase().includes(searchLower))
              default:
                return true
            }
          }
          
          return (
            (lead.firstName && lead.firstName.toLowerCase().includes(searchLower)) ||
            (lead.lastName && lead.lastName.toLowerCase().includes(searchLower)) ||
            (lead.companyName && lead.companyName.toLowerCase().includes(searchLower)) ||
            (lead.emailAddress && lead.emailAddress.toLowerCase().includes(searchLower)) ||
            (lead.mobileNumber && lead.mobileNumber.includes(searchTerm)) ||
            (lead.phoneNumber && lead.phoneNumber.includes(searchTerm)) ||
            (lead.productInterest && lead.productInterest.toLowerCase().includes(searchLower)) ||
            (lead.city && lead.city.toLowerCase().includes(searchLower)) ||
            (lead.state && lead.state.toLowerCase().includes(searchLower)) ||
            (lead.country && lead.country.toLowerCase().includes(searchLower))
          )
        })
      }
      if (filterStatus !== 'ALL') {
        filteredLeads = filteredLeads.filter((lead) => lead.status === filterStatus)
      }
      if (filterPriority !== 'ALL') {
        filteredLeads = filteredLeads.filter((lead) => lead.priority === filterPriority)
      }
      if (filterSource !== 'ALL') {
        filteredLeads = filteredLeads.filter((lead) => lead.source === filterSource)
      }
      if (filterAgent !== 'ALL') {
        filteredLeads = filteredLeads.filter((lead) => lead.assignedTo === filterAgent)
      }

      if (format === 'csv') {
        // Generate CSV
        const headers = [
          'Lead Type', 'Name/Company', 'Email', 'Phone/Mobile', 'Source', 'Product Interest',
          'Estimated Value', 'Priority', 'Status', 'Assigned To', 'Created Date', 'Last Contact'
        ]
        
        const csvContent = [
          headers.join(','),
          ...filteredLeads.map(lead => [
            lead.leadType,
            lead.leadType === 'CORPORATE' ? lead.companyName : `${lead.firstName} ${lead.lastName}`,
            lead.emailAddress || '',
            lead.leadType === 'CORPORATE' ? lead.phoneNumber : lead.mobileNumber,
            lead.source,
            lead.productInterest || '',
            lead.estimatedValue || '',
            lead.priority,
            lead.status,
            lead.assignedTo,
            new Date(lead.createdAt).toLocaleDateString(),
            lead.lastContactDate ? new Date(lead.lastContactDate).toLocaleDateString() : ''
          ].map(field => `"${field || ''}"`).join(','))
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `leads-export-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        
        toast.success('Leads exported to CSV successfully!')
      } else if (format === 'excel') {
        // For Excel, we'll create a simple CSV that can be opened in Excel
        const headers = [
          'Lead Type', 'Name/Company', 'Email', 'Phone/Mobile', 'Source', 'Product Interest',
          'Estimated Value', 'Priority', 'Status', 'Assigned To', 'Created Date', 'Last Contact'
        ]
        
        const csvContent = [
          headers.join('\t'),
          ...filteredLeads.map(lead => [
            lead.leadType,
            lead.leadType === 'CORPORATE' ? lead.companyName : `${lead.firstName} ${lead.lastName}`,
            lead.emailAddress || '',
            lead.leadType === 'CORPORATE' ? lead.phoneNumber : lead.mobileNumber,
            lead.source,
            lead.productInterest || '',
            lead.estimatedValue || '',
            lead.priority,
            lead.status,
            lead.assignedTo,
            new Date(lead.createdAt).toLocaleDateString(),
            lead.lastContactDate ? new Date(lead.lastContactDate).toLocaleDateString() : ''
          ].join('\t'))
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `leads-export-${new Date().toISOString().split('T')[0]}.xls`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        
        toast.success('Leads exported to Excel successfully!')
      }
    } catch (error) {
      console.error('Error exporting leads:', error)
      toast.error('Failed to export leads')
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      setLoading(true)
      
      // Load leads from localStorage (created from quotation system)
      const storedLeads = JSON.parse(localStorage.getItem('leads') || '[]')

      // One-time migration: move specific quotation-derived leads (e.g., Ashish Tiwari cases)
      // out of `leads` and into `policyDrafts` so they appear on the proposals dashboard
      try {
        const existingProposals = JSON.parse(localStorage.getItem('policyDrafts') || '[]')

        const leadsToMigrate = (Array.isArray(storedLeads) ? storedLeads : []).filter((lead: any) => {
          const firstName = (lead.firstName || '').toLowerCase()
          const lastName = (lead.lastName || '').toLowerCase()
          const email = (lead.email || lead.emailAddress || '').toLowerCase()
          const isAshishTiwari = (firstName.includes('ashish') && lastName.includes('tiwari')) || email === 'sameer2711@gmail.com'
          const fromQuotation = (lead.source || 'QUOTATION_FORM') === 'QUOTATION_FORM'
          return isAshishTiwari && fromQuotation
        })

        if (leadsToMigrate.length > 0) {
          const migratedProposals = leadsToMigrate.map((lead: any, index: number) => {
            const customerType = lead.customerType || 'INDIVIDUAL'
            const firstName = lead.firstName || 'Ashish'
            const lastName = lead.lastName || 'Tiwari'
            const now = new Date()
            const idSuffix = `${Date.now().toString().slice(-6)}${index + 1}`

            return {
              id: `PROPOSAL-${idSuffix}`,
              proposalNumber: `PROP-${idSuffix}`,
              customerId: lead.customerId || `CUST-${idSuffix}`,
              customerInfo: {
                customerType,
                firstName,
                lastName,
                companyName: lead.companyName || '',
                email: lead.email || lead.emailAddress || '',
                phone: lead.phone || lead.mobileNumber || '',
                address: lead.address || '',
                city: lead.city || '',
                state: lead.state || '',
                pincode: lead.pincode || ''
              },
              policyDetails: {
                policyType: lead.policyType || lead.productInterest || 'MOTOR',
                oem: lead.quotationData?.oem || '',
                modelName: lead.quotationData?.modelName || '',
                variant: lead.quotationData?.variant || '',
                yearOfManufacture: lead.quotationData?.yearOfManufacture || '',
                registrationCity: lead.quotationData?.registrationCity || lead.city || '',
                exShowroomPrice: lead.quotationData?.exShowroomPrice || 0,
                policyTerm: 1,
                quotationDate: lead.quotationData?.quotationDate || lead.createdAt || now.toISOString()
              },
              selectedQuote: {
                companyName: lead.quotationData?.selectedInsuranceCompany || '',
                totalPremium: lead.quotationData?.quotedPremium || lead.estimatedValue || 0,
                status: 'PENDING'
              },
              selectedAddOns: [],
              kycStatus: 'pending',
              panValidation: {
                isValid: false,
                panNumber: lead.pan || '',
                name: `${firstName} ${lastName}`
              },
              status: 'DRAFT',
              createdAt: lead.createdAt || now.toISOString(),
              updatedAt: now.toISOString()
            }
          })

          const updatedLeadsAfterMigration = (storedLeads || []).filter((lead: any) => !leadsToMigrate.includes(lead))
          const updatedProposals = [...existingProposals, ...migratedProposals]

          localStorage.setItem('leads', JSON.stringify(updatedLeadsAfterMigration))
          localStorage.setItem('policyDrafts', JSON.stringify(updatedProposals))

          console.log(`Migrated ${migratedProposals.length} quotation-derived lead(s) to policyDrafts.`)
        }
      } catch (migrationError) {
        console.warn('Lead->Proposal migration skipped due to error:', migrationError)
      }
      
      // Convert stored leads to Lead format
      const convertedLeads: Lead[] = storedLeads.map((lead: any) => ({
        id: lead.id,
        leadType: lead.customerType === 'INDIVIDUAL' ? 'INDIVIDUAL' : 'CORPORATE',
        firstName: lead.firstName || '',
        lastName: lead.lastName || '',
        companyName: lead.companyName || '',
        mobileNumber: lead.phone || lead.mobileNumber || '',
        emailAddress: lead.email || lead.emailAddress || '',
        address: lead.address || '',
        city: lead.city || '',
        state: lead.state || '',
        pincode: lead.pincode || '',
        source: lead.source || 'QUOTATION_FORM',
        productInterest: lead.policyType || '',
        estimatedValue: lead.quotationData?.quotedPremium || 0,
        status: lead.status === 'PENDING' ? 'NEW' : lead.status,
        notes: `Created from quotation: ${lead.quotationData?.id || 'N/A'}`,
        createdAt: lead.createdAt || new Date().toISOString(),
        updatedAt: lead.updatedAt || new Date().toISOString()
      }))
      
      // Mock data for demonstration - replace with actual API call
      const mockLeads: Lead[] = [
        {
          id: '1',
          leadType: 'INDIVIDUAL',
          firstName: 'Arjun',
          lastName: 'Reddy',
          mobileNumber: '+91-9876543210',
          emailAddress: 'arjun.reddy@email.com',
          source: 'Website',
          productInterest: 'Motor Insurance',
          estimatedValue: 25000,
          priority: 'HIGH',
          status: 'QUALIFIED',
          assignedTo: '1',
          assignedAgent: { name: 'Rajesh Kumar', email: 'rajesh@insurance.com' },
          notes: 'Interested in comprehensive car insurance for new Honda City',
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-20T14:15:00Z',
          lastContactDate: '2024-01-20T14:15:00Z',
        },
        {
          id: '2',
          leadType: 'INDIVIDUAL',
          firstName: 'Meera',
          lastName: 'Joshi',
          mobileNumber: '+91-8765432109',
          emailAddress: 'meera.joshi@email.com',
          source: 'Referral',
          productInterest: 'Health Insurance',
          estimatedValue: 45000,
          priority: 'MEDIUM',
          status: 'CONTACTED',
          assignedTo: '2',
          assignedAgent: { name: 'Priya Sharma', email: 'priya@insurance.com' },
          notes: 'Family of 4 looking for comprehensive health coverage',
          createdAt: '2024-01-18T09:45:00Z',
          updatedAt: '2024-01-19T11:20:00Z',
          lastContactDate: '2024-01-19T11:20:00Z',
        },
        {
          id: '3',
          leadType: 'CORPORATE',
          companyName: 'Tech Solutions Pvt Ltd',
          address: '123 Business Park, Sector 5',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          pan: 'ABCDE1234F',
          gst: '27ABCDE1234F1Z5',
          websiteUrl: 'https://techsolutions.com',
          contactPersonName: 'Suresh Malhotra',
          phoneNumber: '+91-7654321098',
          emailAddress: 'suresh.malhotra@techsolutions.com',
          source: 'Cold Call',
          productInterest: 'Business Insurance',
          estimatedValue: 75000,
          priority: 'URGENT',
          status: 'PROPOSAL_SENT',
          assignedTo: '3',
          assignedAgent: { name: 'Amit Patel', email: 'amit@insurance.com' },
          notes: 'Looking for comprehensive business insurance coverage',
          createdAt: '2024-01-20T16:20:00Z',
          updatedAt: '2024-01-21T10:30:00Z',
          lastContactDate: '2024-01-21T10:30:00Z',
        },
        {
          id: '4',
          leadType: 'INDIVIDUAL',
          firstName: 'Kavita',
          lastName: 'Desai',
          mobileNumber: '+91-6543210987',
          emailAddress: 'kavita.desai@email.com',
          source: 'Social Media',
          productInterest: 'Home Insurance',
          estimatedValue: 15000,
          priority: 'LOW',
          status: 'NEW',
          assignedTo: '4',
          assignedAgent: { name: 'Sneha Gupta', email: 'sneha@insurance.com' },
          notes: 'First-time home buyer, needs guidance on home insurance',
          createdAt: '2024-01-22T13:10:00Z',
          updatedAt: '2024-01-22T13:10:00Z',
        },
        {
          id: '5',
          leadType: 'INDIVIDUAL',
          firstName: 'Ravi',
          lastName: 'Kumar',
          mobileNumber: '+91-5432109876',
          emailAddress: 'ravi.kumar@email.com',
          source: 'Advertisement',
          productInterest: 'Two Wheeler Insurance',
          estimatedValue: 8000,
          priority: 'MEDIUM',
          status: 'NEGOTIATING',
          assignedTo: '5',
          assignedAgent: { name: 'Vikram Singh', email: 'vikram@insurance.com' },
          notes: 'Owns a Bajaj Pulsar, looking for best premium rates',
          createdAt: '2024-01-10T08:30:00Z',
          updatedAt: '2024-01-21T15:45:00Z',
          lastContactDate: '2024-01-21T15:45:00Z',
        },
      ]

      // Combine converted leads with mock data
      const allLeads = [...convertedLeads, ...mockLeads]
      
      // Apply filters
      let filteredLeads = allLeads
      if (searchTerm) {
        filteredLeads = filteredLeads.filter((lead) => {
          const searchLower = searchTerm.toLowerCase()
          
          // If specific field is selected, search only that field
          if (searchField !== 'ALL') {
            switch (searchField) {
              case 'NAME':
                return (lead.firstName && lead.firstName.toLowerCase().includes(searchLower)) ||
                       (lead.lastName && lead.lastName.toLowerCase().includes(searchLower)) ||
                       (lead.companyName && lead.companyName.toLowerCase().includes(searchLower))
              case 'EMAIL':
                return lead.emailAddress && lead.emailAddress.toLowerCase().includes(searchLower)
              case 'PHONE':
                return (lead.mobileNumber && lead.mobileNumber.includes(searchTerm)) ||
                       (lead.phoneNumber && lead.phoneNumber.includes(searchTerm))
              case 'PRODUCT':
                return lead.productInterest && lead.productInterest.toLowerCase().includes(searchLower)
              case 'COMPANY':
                return lead.companyName && lead.companyName.toLowerCase().includes(searchLower)
              case 'LOCATION':
                return (lead.city && lead.city.toLowerCase().includes(searchLower)) ||
                       (lead.state && lead.state.toLowerCase().includes(searchLower)) ||
                       (lead.country && lead.country.toLowerCase().includes(searchLower))
              default:
                return true
            }
          }
          
          // If ALL is selected, search across all fields
          return (
            (lead.firstName && lead.firstName.toLowerCase().includes(searchLower)) ||
            (lead.lastName && lead.lastName.toLowerCase().includes(searchLower)) ||
            (lead.companyName && lead.companyName.toLowerCase().includes(searchLower)) ||
            (lead.emailAddress && lead.emailAddress.toLowerCase().includes(searchLower)) ||
            (lead.mobileNumber && lead.mobileNumber.includes(searchTerm)) ||
            (lead.phoneNumber && lead.phoneNumber.includes(searchTerm)) ||
            (lead.productInterest && lead.productInterest.toLowerCase().includes(searchLower)) ||
            (lead.city && lead.city.toLowerCase().includes(searchLower)) ||
            (lead.state && lead.state.toLowerCase().includes(searchLower)) ||
            (lead.country && lead.country.toLowerCase().includes(searchLower))
          )
        })
      }
      if (filterStatus !== 'ALL') {
        filteredLeads = filteredLeads.filter((lead) => lead.status === filterStatus)
      }
      if (filterPriority !== 'ALL') {
        filteredLeads = filteredLeads.filter((lead) => lead.priority === filterPriority)
      }
      if (filterSource !== 'ALL') {
        filteredLeads = filteredLeads.filter((lead) => lead.source === filterSource)
      }
      if (filterAgent !== 'ALL') {
        filteredLeads = filteredLeads.filter((lead) => lead.assignedTo === filterAgent)
      }

      setLeads(filteredLeads)
    } catch (error) {
      console.error('Error fetching leads:', error)
      toast.error('Failed to fetch leads')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: LeadForm) => {
    try {
      if (editingLead) {
        // Update existing lead
        const updatedLead = { 
          ...editingLead, 
          ...data,
          assignedAgent: AGENTS.find(a => a.id === data.assignedTo) || { name: 'Unknown', email: '' },
          updatedAt: new Date().toISOString() 
        }
        setLeads(leads.map((l) => (l.id === updatedLead.id ? updatedLead : l)))
        toast.success('Lead updated successfully!')
      } else {
        // Create new lead
        const newLead: Lead = {
          id: String(leads.length + 1),
          ...data,
          assignedAgent: AGENTS.find(a => a.id === data.assignedTo) || { name: 'Unknown', email: '' },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        setLeads([...leads, newLead])
        toast.success('Lead created successfully!')
      }

      setShowModal(false)
      reset()
      setEditingLead(null)
    } catch (error) {
      console.error('Error saving lead:', error)
      toast.error('Failed to save lead')
    }
  }

  const openAddModal = () => {
    setEditingLead(null)
    reset({
      leadType: 'INDIVIDUAL',
      // Location fields
      country: '',
      state: '',
      city: '',
      pincode: '',
      // Corporate fields
      companyName: '',
      address: '',
      pan: '',
      gst: '',
      websiteUrl: '',
      contactPersonName: '',
      phoneCountryCode: '+91',
      phoneNumber: '',
      emailAddress: '',
      // Individual fields
      firstName: '',
      lastName: '',
      mobileCountryCode: '+91',
      mobileNumber: '',
      // Common fields
      source: '',
      productInterest: '',
      estimatedValue: 0,
      priority: 'MEDIUM',
      status: 'NEW',
      assignedTo: '',
      notes: '',
    })
    setLeadType('INDIVIDUAL')
    setSelectedCountry('')
    setSelectedState('')
    setSelectedCity('')
    setAvailableStates([])
    setAvailableCities([])
    setAvailablePincodes([])
    setShowModal(true)
  }

  const openEditModal = (lead: Lead) => {
    setEditingLead(lead)
    setValue('leadType', lead.leadType)
    // Location fields
    setValue('country', lead.country || '')
    setValue('state', lead.state || '')
    setValue('city', lead.city || '')
    setValue('pincode', lead.pincode || '')
    // Corporate fields
    setValue('companyName', lead.companyName || '')
    setValue('address', lead.address || '')
    setValue('pan', lead.pan || '')
    setValue('gst', lead.gst || '')
    setValue('websiteUrl', lead.websiteUrl || '')
    setValue('contactPersonName', lead.contactPersonName || '')
    setValue('phoneCountryCode', lead.phoneCountryCode || '+91')
    setValue('phoneNumber', lead.phoneNumber || '')
    setValue('emailAddress', lead.emailAddress || '')
    // Individual fields
    setValue('firstName', lead.firstName || '')
    setValue('lastName', lead.lastName || '')
    setValue('mobileCountryCode', lead.mobileCountryCode || '+91')
    setValue('mobileNumber', lead.mobileNumber || '')
    // Common fields
    setValue('source', lead.source)
    setValue('productInterest', lead.productInterest || '')
    setValue('estimatedValue', lead.estimatedValue || 0)
    setValue('priority', lead.priority as any)
    setValue('status', lead.status as any)
    setValue('assignedTo', lead.assignedTo)
    setValue('notes', lead.notes || '')
    setLeadType(lead.leadType)
    
    // Set dropdown states for editing
    setSelectedCountry(lead.country || '')
    setSelectedState(lead.state || '')
    setSelectedCity(lead.city || '')
    
    // Update available options based on current values
    if (lead.country && COUNTRY_DATA[lead.country as keyof typeof COUNTRY_DATA]) {
      const states = Object.keys(COUNTRY_DATA[lead.country as keyof typeof COUNTRY_DATA].states)
      setAvailableStates(states)
    }
    if (lead.state && lead.country && COUNTRY_DATA[lead.country as keyof typeof COUNTRY_DATA]) {
      const cities = Object.keys((COUNTRY_DATA[lead.country as keyof typeof COUNTRY_DATA] as any).states[lead.state].cities)
      setAvailableCities(cities)
    }
    if (lead.city && lead.state && lead.country && COUNTRY_DATA[lead.country as keyof typeof COUNTRY_DATA]) {
      const pincodes = (COUNTRY_DATA[lead.country as keyof typeof COUNTRY_DATA] as any).states[lead.state].cities[lead.city]
      setAvailablePincodes(pincodes)
    }
    
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        setLeads(leads.filter((l) => l.id !== id))
        toast.success('Lead deleted successfully')
      } catch (error) {
        console.error('Error deleting lead:', error)
        toast.error('Failed to delete lead')
      }
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-100 text-red-800'
      case 'HIGH':
        return 'bg-orange-100 text-orange-800'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800'
      case 'LOW':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW':
        return 'bg-blue-100 text-blue-800'
      case 'CONTACTED':
        return 'bg-purple-100 text-purple-800'
      case 'QUALIFIED':
        return 'bg-indigo-100 text-indigo-800'
      case 'PROPOSAL_SENT':
        return 'bg-pink-100 text-pink-800'
      case 'NEGOTIATING':
        return 'bg-yellow-100 text-yellow-800'
      case 'WON':
        return 'bg-green-100 text-green-800'
      case 'LOST':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) { // 1 crore or more
      const crores = amount / 10000000
      return `₹${crores.toFixed(1)}Cr`
    } else if (amount >= 1000000) { // 10 lakh or more
      const millions = amount / 1000000
      return `₹${millions.toFixed(1)}M`
    } else if (amount >= 100000) { // 1 lakh or more
      const lakhs = amount / 100000
      return `₹${lakhs.toFixed(1)}L`
    } else if (amount >= 1000) { // 1 thousand or more
      const thousands = amount / 1000
      return `₹${thousands.toFixed(1)}K`
    } else {
      return `₹${amount.toLocaleString('en-IN')}`
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  // Calculate lead statistics
  const totalLeads = leads.length
  const newLeads = leads.filter(l => l.status === 'NEW').length
  const qualifiedLeads = leads.filter(l => l.status === 'QUALIFIED').length
  const wonLeads = leads.filter(l => l.status === 'WON').length
  const totalValue = leads.reduce((sum, lead) => sum + (lead.estimatedValue || 0), 0)

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
                <button onClick={() => router.push('/dashboard/presale')} className="ml-4 text-gray-400 hover:text-gray-500">
                  Pre-Sale
                </button>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="text-gray-400">/</span>
                <span className="ml-4 text-gray-900 font-medium">Lead Generation</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      {/* Page header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/dashboard/presale')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lead Generation</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage and track sales leads from various sources.
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <div className="relative">
            <button
              onClick={() => {
                const dropdown = document.getElementById('export-dropdown')
                if (dropdown) {
                  dropdown.classList.toggle('hidden')
                }
              }}
              className="btn btn-secondary btn-md"
            >
              <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
              Export
            </button>
            <div
              id="export-dropdown"
              className="hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
            >
              <div className="py-1">
                <button
                  onClick={() => {
                    exportLeads('csv')
                    const dropdown = document.getElementById('export-dropdown')
                    if (dropdown) {
                      dropdown.classList.add('hidden')
                    }
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Export as CSV
                </button>
                <button
                  onClick={() => {
                    exportLeads('excel')
                    const dropdown = document.getElementById('export-dropdown')
                    if (dropdown) {
                      dropdown.classList.add('hidden')
                    }
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Export as Excel
                </button>
              </div>
            </div>
          </div>
          <button onClick={openAddModal} className="btn btn-primary btn-md">
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Lead
          </button>
        </div>
      </div>

      {/* Lead Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <UserPlusIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Leads</p>
              <p className="text-2xl font-semibold text-gray-900">{totalLeads}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold">N</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">New Leads</p>
              <p className="text-2xl font-semibold text-gray-900">{newLeads}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-indigo-600 font-semibold">Q</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Qualified</p>
              <p className="text-2xl font-semibold text-gray-900">{qualifiedLeads}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-semibold">W</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Won</p>
              <p className="text-2xl font-semibold text-gray-900">{wonLeads}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <ChartBarIcon className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Value</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(totalValue)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 flex gap-2">
            <select
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              className="input w-40"
            >
              <option value="ALL">All Fields</option>
              <option value="NAME">Name/Company</option>
              <option value="EMAIL">Email</option>
              <option value="PHONE">Phone</option>
              <option value="PRODUCT">Product</option>
              <option value="COMPANY">Company</option>
              <option value="LOCATION">Location</option>
            </select>
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={`Search ${searchField === 'ALL' ? 'leads' : searchField.toLowerCase()}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input"
            >
              <option value="ALL">All Status</option>
              <option value="NEW">New</option>
              <option value="CONTACTED">Contacted</option>
              <option value="QUALIFIED">Qualified</option>
              <option value="PROPOSAL_SENT">Proposal Sent</option>
              <option value="NEGOTIATING">Negotiating</option>
              <option value="WON">Won</option>
              <option value="LOST">Lost</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="input"
            >
              <option value="ALL">All Priority</option>
              <option value="URGENT">Urgent</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className="input"
            >
              <option value="ALL">All Sources</option>
              {LEAD_SOURCES.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
            <select
              value={filterAgent}
              onChange={(e) => setFilterAgent(e.target.value)}
              className="input"
            >
              <option value="ALL">All Agents</option>
              {AGENTS.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-head">Lead</th>
                <th className="table-head">Contact</th>
                <th className="table-head">Source</th>
                <th className="table-head">Product Interest</th>
                <th className="table-head">Estimated Value</th>
                <th className="table-head">Priority</th>
                <th className="table-head">Status</th>
                <th className="table-head">Assigned To</th>
                <th className="table-head">Created</th>
                <th className="table-head">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={10} className="table-cell text-center py-8 text-gray-500">
                    No leads found
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="table-row">
                    <td className="table-cell">
                      <div className="font-medium">
                        {lead.leadType === 'CORPORATE' ? lead.companyName : `${lead.firstName} ${lead.lastName}`}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {lead.leadType === 'CORPORATE' ? 'Corporate' : 'Individual'}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="text-sm">
                        <div className="flex items-center">
                          <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-1" />
                          <span>{lead.emailAddress}</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <PhoneIcon className="h-4 w-4 text-gray-400 mr-1" />
                          <span>{lead.leadType === 'CORPORATE' ? lead.phoneNumber : lead.mobileNumber}</span>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">{lead.source}</td>
                    <td className="table-cell">{lead.productInterest}</td>
                    <td className="table-cell font-medium">{formatCurrency(lead.estimatedValue || 0)}</td>
                    <td className="table-cell">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(lead.priority)}`}>
                        {lead.priority}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lead.status)}`}>
                        {lead.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="text-sm">
                        <div className="font-medium">{lead.assignedAgent?.name || 'Unassigned'}</div>
                        <div className="text-gray-500">{lead.assignedAgent?.email || 'No email'}</div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm">{formatDate(lead.createdAt)}</span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditModal(lead)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => router.push(`/dashboard/presale/lead-generation/view/${lead.id}`)}
                          className="text-green-600 hover:text-green-900"
                          title="View"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(lead.id)}
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

      {/* Lead Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingLead ? 'Edit Lead' : 'Add Lead'}
              </h3>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Lead Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lead Type *
                  </label>
                  <select
                    {...register('leadType')}
                    className="input"
                    onChange={(e) => {
                      setLeadType(e.target.value as 'CORPORATE' | 'INDIVIDUAL')
                      setValue('leadType', e.target.value as 'CORPORATE' | 'INDIVIDUAL')
                    }}
                  >
                    <option value="INDIVIDUAL">Individual</option>
                    <option value="CORPORATE">Corporate</option>
                  </select>
                  {errors.leadType && (
                    <p className="text-red-600 text-xs mt-1">{errors.leadType.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Corporate Fields */}
                  {watchedLeadType === 'CORPORATE' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name of Company *
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
                          Website URL
                        </label>
                        <input
                          type="url"
                          {...register('websiteUrl')}
                          className="input"
                          placeholder="https://example.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address
                        </label>
                        <input
                          type="text"
                          {...register('address')}
                          className="input"
                          placeholder="Enter address"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Country
                        </label>
                        <select
                          {...register('country')}
                          className="input"
                          onChange={(e) => {
                            setValue('country', e.target.value)
                            handleCountryChange(e.target.value)
                          }}
                        >
                          <option value="">Select Country</option>
                          {Object.keys(COUNTRY_DATA).map((country) => (
                            <option key={country} value={country}>
                              {country}
                            </option>
                          ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                          💡 Country code will auto-update for phone/mobile numbers
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          State
                        </label>
                        <select
                          {...register('state')}
                          className="input"
                          onChange={(e) => {
                            setValue('state', e.target.value)
                            handleStateChange(e.target.value)
                          }}
                          disabled={!selectedCountry}
                        >
                          <option value="">Select State</option>
                          {availableStates.map((state) => (
                            <option key={state} value={state}>
                              {state}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <select
                          {...register('city')}
                          className="input"
                          onChange={(e) => {
                            setValue('city', e.target.value)
                            handleCityChange(e.target.value)
                          }}
                          disabled={!selectedState}
                        >
                          <option value="">Select City</option>
                          {availableCities.map((city) => (
                            <option key={city} value={city}>
                              {city}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Pincode
                        </label>
                        <select
                          {...register('pincode')}
                          className="input"
                          disabled={!selectedCity}
                        >
                          <option value="">Select Pincode</option>
                          {availablePincodes.map((pincode) => (
                            <option key={pincode} value={pincode}>
                              {pincode}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          PAN
                        </label>
                        <input
                          type="text"
                          {...register('pan')}
                          className="input"
                          placeholder="Enter PAN number"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          GST
                        </label>
                        <input
                          type="text"
                          {...register('gst')}
                          className="input"
                          placeholder="Enter GST number"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Contact Person Name
                        </label>
                        <input
                          type="text"
                          {...register('contactPersonName')}
                          className="input"
                          placeholder="Enter contact person name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <div className="flex gap-2">
                          <select
                            {...register('phoneCountryCode')}
                            className="input w-24"
                          >
                            {COUNTRY_CODES.map((country) => (
                              <option key={country.code} value={country.code}>
                                {country.flag} {country.code}
                              </option>
                            ))}
                          </select>
                          <input
                            type="tel"
                            {...register('phoneNumber')}
                            className="input flex-1"
                            placeholder="Enter phone number"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          {...register('emailAddress')}
                          className="input"
                          placeholder="Enter email address"
                        />
                        {errors.emailAddress && (
                          <p className="text-red-600 text-xs mt-1">{errors.emailAddress.message}</p>
                        )}
                      </div>
                    </>
                  )}

                  {/* Individual Fields */}
                  {watchedLeadType === 'INDIVIDUAL' && (
                    <>
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

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address
                        </label>
                        <input
                          type="text"
                          {...register('address')}
                          className="input"
                          placeholder="Enter address"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Country
                        </label>
                        <select
                          {...register('country')}
                          className="input"
                          onChange={(e) => {
                            setValue('country', e.target.value)
                            handleCountryChange(e.target.value)
                          }}
                        >
                          <option value="">Select Country</option>
                          {Object.keys(COUNTRY_DATA).map((country) => (
                            <option key={country} value={country}>
                              {country}
                            </option>
                          ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                          💡 Country code will auto-update for phone/mobile numbers
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          State
                        </label>
                        <select
                          {...register('state')}
                          className="input"
                          onChange={(e) => {
                            setValue('state', e.target.value)
                            handleStateChange(e.target.value)
                          }}
                          disabled={!selectedCountry}
                        >
                          <option value="">Select State</option>
                          {availableStates.map((state) => (
                            <option key={state} value={state}>
                              {state}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <select
                          {...register('city')}
                          className="input"
                          onChange={(e) => {
                            setValue('city', e.target.value)
                            handleCityChange(e.target.value)
                          }}
                          disabled={!selectedState}
                        >
                          <option value="">Select City</option>
                          {availableCities.map((city) => (
                            <option key={city} value={city}>
                              {city}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Pincode
                        </label>
                        <select
                          {...register('pincode')}
                          className="input"
                          disabled={!selectedCity}
                        >
                          <option value="">Select Pincode</option>
                          {availablePincodes.map((pincode) => (
                            <option key={pincode} value={pincode}>
                              {pincode}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          PAN
                        </label>
                        <input
                          type="text"
                          {...register('pan')}
                          className="input"
                          placeholder="Enter PAN number"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mobile Number
                        </label>
                        <div className="flex gap-2">
                          <select
                            {...register('mobileCountryCode')}
                            className="input w-24"
                          >
                            {COUNTRY_CODES.map((country) => (
                              <option key={country.code} value={country.code}>
                                {country.flag} {country.code}
                              </option>
                            ))}
                          </select>
                          <input
                            type="tel"
                            {...register('mobileNumber')}
                            className="input flex-1"
                            placeholder="Enter mobile number"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          {...register('emailAddress')}
                          className="input"
                          placeholder="Enter email address"
                        />
                      </div>
                    </>
                  )}

                  {/* Common Fields */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lead Source *
                    </label>
                    <select
                      {...register('source')}
                      className="input"
                    >
                      <option value="">Select Source</option>
                      {LEAD_SOURCES.map((source) => (
                        <option key={source} value={source}>
                          {source}
                        </option>
                      ))}
                    </select>
                    {errors.source && (
                      <p className="text-red-600 text-xs mt-1">{errors.source.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Interest
                    </label>
                    <select
                      {...register('productInterest')}
                      className="input"
                    >
                      <option value="">Select Product</option>
                      {PRODUCT_INTERESTS.map((product) => (
                        <option key={product} value={product}>
                          {product}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estimate Value (₹)
                    </label>
                    <input
                      type="number"
                      {...register('estimatedValue', { valueAsNumber: true })}
                      className="input"
                      placeholder="Enter estimated value"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority *
                    </label>
                    <select
                      {...register('priority')}
                      className="input"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </select>
                    {errors.priority && (
                      <p className="text-red-600 text-xs mt-1">{errors.priority.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status *
                    </label>
                    <select
                      {...register('status')}
                      className="input"
                    >
                      <option value="NEW">New</option>
                      <option value="CONTACTED">Contacted</option>
                      <option value="QUALIFIED">Qualified</option>
                      <option value="PROPOSAL_SENT">Proposal Sent</option>
                      <option value="NEGOTIATING">Negotiating</option>
                      <option value="WON">Won</option>
                      <option value="LOST">Lost</option>
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
                      {AGENTS.map((agent) => (
                        <option key={agent.id} value={agent.id}>
                          {agent.name}
                        </option>
                      ))}
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
                    placeholder="Add any additional notes about this lead..."
                  ></textarea>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      setEditingLead(null)
                      reset()
                    }}
                    className="btn btn-secondary btn-md"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-md">
                    {editingLead ? 'Update Lead' : 'Create Lead'}
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

