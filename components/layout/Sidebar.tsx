'use client'

import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import {
  HomeIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  DocumentChartBarIcon,
  CogIcon,
  BellIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon,
  UserIcon,
  Cog6ToothIcon,
  AcademicCapIcon,
  UserPlusIcon,
  DocumentDuplicateIcon,
  ClipboardDocumentCheckIcon,
  XCircleIcon,
  CurrencyDollarIcon,
  ClipboardDocumentIcon,
  ArrowPathIcon,
  ChartPieIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  CalendarIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  FlagIcon,
  MapIcon,
  MapPinIcon,
  BuildingLibraryIcon,
  CpuChipIcon,
  LightBulbIcon,
  ExclamationTriangleIcon,
  DocumentMagnifyingGlassIcon,
  TruckIcon,
} from '@heroicons/react/24/outline'

interface SidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Pre-Sale Modules', href: '/dashboard/presale', icon: UserPlusIcon, hasSubmenu: true },
  { name: 'Policies', href: '/dashboard/policies', icon: DocumentTextIcon, hasSubmenu: true },
  { name: 'Post-Sale Modules', href: '/dashboard/postsale', icon: ClipboardDocumentCheckIcon, hasSubmenu: true },
  { name: 'Invoice & Payout', href: '/dashboard/invoice-payout', icon: CurrencyDollarIcon, hasSubmenu: true },
  { name: 'Customer Retention', href: '/dashboard/customer-retention', icon: ChartPieIcon, hasSubmenu: true },
  { name: 'Vendor Onboarding', href: '/dashboard/vendor-onboarding', icon: TruckIcon, hasSubmenu: true },
  { name: 'LMS Training', href: '/dashboard/lms', icon: AcademicCapIcon, hasSubmenu: true },
  { name: 'Master Data', href: '/dashboard/master-data', icon: Cog6ToothIcon, hasSubmenu: true },
  { name: 'Customers', href: '/dashboard/customers', icon: UserGroupIcon },
  { name: 'Agents', href: '/dashboard/agents', icon: UserIcon },
  { name: 'Reports & MIS', href: '/dashboard/reports', icon: ChartBarIcon },
  { name: 'Analytics', href: '/dashboard/analytics', icon: DocumentChartBarIcon, hasSubmenu: true },
  { name: 'Document Management', href: '/dashboard/document-management', icon: DocumentTextIcon },
  { name: 'Email Configuration', href: '/dashboard/email-config', icon: EnvelopeIcon },
  { name: 'Company', href: '/dashboard/company', icon: BuildingOfficeIcon },
]

// Submenu definitions
const submenuItems = {
  'Pre-Sale Modules': [
    { name: 'Lead Generation', href: '/dashboard/presale/lead-generation', icon: UserPlusIcon },
    { name: 'Quotation (Market Placement)', href: '/dashboard/presale/quotation', icon: DocumentDuplicateIcon },
    { name: 'Policy Proposals', href: '/dashboard/presale/policy-proposals', icon: DocumentTextIcon },
  ],
  'Policies': [
    { name: 'New Policy', href: '/dashboard/policies/new', icon: DocumentTextIcon },
    { name: 'Renewal', href: '/dashboard/policies/renewal', icon: ArrowPathIcon },
    { name: 'Rollover', href: '/dashboard/policies/rollover', icon: ArrowPathIcon },
    { name: 'Self-Renewal', href: '/dashboard/policies/self-renewal', icon: ArrowPathIcon },
  ],
  'Post-Sale Modules': [
    { name: '64VB Verify', href: '/dashboard/postsale/64vb-verify', icon: ClipboardDocumentCheckIcon },
    { name: 'Endorsement', href: '/dashboard/postsale/endorsement', icon: DocumentDuplicateIcon },
    { name: 'Cancellation', href: '/dashboard/postsale/cancellation', icon: XCircleIcon },
    { name: 'Claims', href: '/dashboard/postsale/claims', icon: ClipboardDocumentListIcon },
  ],
  'Invoice & Payout': [
    { name: 'Data Approval', href: '/dashboard/invoice-payout/data-approval', icon: ClipboardDocumentCheckIcon },
    { name: 'Invoice Upload', href: '/dashboard/invoice-payout/invoice-upload', icon: DocumentDuplicateIcon },
    { name: 'Invoice Settlement', href: '/dashboard/invoice-payout/invoice-settlement', icon: CurrencyDollarIcon },
    { name: 'Payment Approval', href: '/dashboard/invoice-payout/payment-approval', icon: ClipboardDocumentCheckIcon },
    { name: 'Bank Integration', href: '/dashboard/invoice-payout/bank-integration', icon: BuildingOfficeIcon },
  ],
  'Customer Retention': [
    { name: 'Renewal Tracking', href: '/dashboard/customer-retention/renewal-tracking', icon: ChartPieIcon },
    { name: 'Conversion Reports', href: '/dashboard/customer-retention/conversion-reports', icon: ChartBarIcon },
    { name: 'Telematic Solution', href: '/dashboard/customer-retention/telematic', icon: PhoneIcon },
    { name: 'SMS Integration', href: '/dashboard/customer-retention/sms', icon: PhoneIcon },
    { name: 'WhatsApp Integration', href: '/dashboard/customer-retention/whatsapp', icon: ChatBubbleLeftRightIcon },
    { name: 'Bulk Email', href: '/dashboard/customer-retention/bulk-email', icon: EnvelopeIcon },
    { name: 'Festival Lists', href: '/dashboard/customer-retention/festival-lists', icon: CalendarIcon },
  ],
  'Vendor Onboarding': [
    { name: 'Add New Vendor', href: '/dashboard/vendor-onboarding/add-vendor', icon: UserPlusIcon },
    { name: 'Vendor List', href: '/dashboard/vendor-onboarding/vendor-list', icon: ClipboardDocumentListIcon },
    { name: 'Contract Management', href: '/dashboard/vendor-onboarding/contracts', icon: DocumentTextIcon },
    { name: 'API Configuration', href: '/dashboard/vendor-onboarding/api-config', icon: CogIcon },
  ],
  'LMS Training': [
    { name: 'Online Training', href: '/dashboard/lms/online-training', icon: AcademicCapIcon },
    { name: 'Online Exam', href: '/dashboard/lms/online-exam', icon: ClipboardDocumentCheckIcon },
    { name: "Users' issued Certificate", href: '/dashboard/lms/issued-certificates', icon: DocumentDuplicateIcon },
  ],
  'Master Data': [
    { name: 'Dynamic Fields', href: '/dashboard/master-data/fields', icon: DocumentMagnifyingGlassIcon },
    { name: 'Locations', href: '/dashboard/master-data/locations', icon: MapIcon },
    { name: 'Business Entities', href: '/dashboard/master-data/business', icon: BuildingOfficeIcon },
    { name: 'Data Management', href: '/dashboard/master-data/data-management', icon: Cog6ToothIcon },
    { name: 'Country Master', href: '/dashboard/master-data/country-master', icon: FlagIcon },
    { name: 'State Master', href: '/dashboard/master-data/state-master', icon: MapIcon },
    { name: 'City Master', href: '/dashboard/master-data/city-master', icon: BuildingOfficeIcon },
    { name: 'Pincode Master', href: '/dashboard/master-data/pincode-master', icon: MapPinIcon },
    { name: 'Bank Master', href: '/dashboard/master-data/bank-master', icon: BuildingLibraryIcon },
    { name: 'Agent Type Master', href: '/dashboard/master-data/agent-type-master', icon: UserIcon },
    { name: 'Manufacturer Master', href: '/dashboard/master-data/manufacturer-master', icon: BuildingOfficeIcon },
    { name: 'Fuel Type Master', href: '/dashboard/master-data/fuel-type-master', icon: ExclamationTriangleIcon },
    { name: 'Model Master', href: '/dashboard/master-data/model-master', icon: DocumentTextIcon },
    { name: 'Variant Master', href: '/dashboard/master-data/variant-master', icon: DocumentTextIcon },
    { name: 'Vehicle Class Master', href: '/dashboard/master-data/vehicle-class-master', icon: DocumentTextIcon },
    { name: 'Vehicle Type Master', href: '/dashboard/master-data/vehicle-type-master', icon: DocumentTextIcon },
    { name: 'Vehicle Carrier Type Master', href: '/dashboard/master-data/vehicle-carrier-type-master', icon: DocumentTextIcon },
    { name: 'Vehicle Body Type Master', href: '/dashboard/master-data/vehicle-body-type-master', icon: DocumentTextIcon },
    { name: 'RTO Master', href: '/dashboard/master-data/rto-master', icon: MapIcon },
    { name: 'Vehicle Depreciation Slab Master', href: '/dashboard/master-data/vehicle-depreciation-slab-master', icon: ChartBarIcon },
    { name: 'NCB Master', href: '/dashboard/master-data/ncb-master', icon: ChartBarIcon },
    { name: 'Policy Product Master', href: '/dashboard/master-data/policy-product-master', icon: DocumentTextIcon },
    { name: 'Add-on Master', href: '/dashboard/master-data/addon-master', icon: DocumentTextIcon },
    { name: 'Accessories Master', href: '/dashboard/master-data/accessories-master', icon: DocumentTextIcon },
    { name: 'IMT Master', href: '/dashboard/master-data/imt-master', icon: DocumentTextIcon },
    { name: 'Geo Extension Master', href: '/dashboard/master-data/geo-extension-master', icon: MapIcon },
    { name: 'Salutation Master', href: '/dashboard/master-data/salutation-master', icon: UserIcon },
    { name: 'Relationship Master', href: '/dashboard/master-data/relationship-master', icon: UserIcon },
    { name: 'Insurance Company Master', href: '/dashboard/master-data/insurance-company-master', icon: BuildingOfficeIcon },
    { name: 'IRDAI Masters', href: '/dashboard/irdai', icon: ShieldCheckIcon, hasSubmenu: true },
    { name: 'LMS Masters', href: '/dashboard/lms-masters', icon: AcademicCapIcon, hasSubmenu: true },
    { name: 'Policy Configurator', href: '/dashboard/master-data/policy-configurator', icon: ShieldCheckIcon },
    { name: 'User Types', href: '/dashboard/master-data/user-types', icon: UserIcon },
    { name: 'Role Management', href: '/dashboard/master-data/role-management', icon: CogIcon },
  ],
  'LMS Masters': [
    { name: 'Training Modules', href: '/dashboard/lms-masters/training-modules', icon: AcademicCapIcon },
    { name: 'Training Material', href: '/dashboard/lms-masters/training-material', icon: DocumentTextIcon },
    { name: 'Online Exam', href: '/dashboard/lms-masters/online-exam', icon: ClipboardDocumentCheckIcon },
    { name: 'Examination Certificate', href: '/dashboard/lms-masters/examination-certificate', icon: DocumentDuplicateIcon },
  ],
  'IRDAI Masters': [
    { name: 'Motor Segment', href: '/dashboard/irdai/motor-segment', icon: TruckIcon },
    { name: 'Zone Master', href: '/dashboard/irdai/zone-master', icon: MapPinIcon },
    { name: 'City Zone Master', href: '/dashboard/irdai/city-zone-master', icon: BuildingLibraryIcon },
  ],
  'Analytics': [
    { name: 'AI Analytics', href: '/dashboard/analytics/ai-analytics', icon: CpuChipIcon },
    { name: 'AI Insights', href: '/dashboard/analytics/ai-insights', icon: LightBulbIcon },
  ],
}

const bottomNavigation = [
  { name: 'Notifications', href: '/dashboard/notifications', icon: BellIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: CogIcon },
]

function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const pathname = usePathname()
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])

  // Debug logging
  console.log('Sidebar render - sidebarOpen:', sidebarOpen)

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault()
    console.log('Link clicked:', href)
    window.location.href = href
  }

  const toggleSubmenu = (menuName: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuName) 
        ? prev.filter(name => name !== menuName)
        : [...prev, menuName]
    )
  }

  const isMenuExpanded = (menuName: string) => {
    return expandedMenus.includes(menuName)
  }

  const isPathActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  const renderNavigationItem = (item: any, isMobile = false) => {
    if (item.hasSubmenu) {
      return (
        <div key={item.name}>
          <div className="flex items-center">
            <Link
              href={item.href}
              onClick={() => {
                if (isMobile) setSidebarOpen(false)
              }}
              className={clsx(
                isPathActive(item.href)
                  ? 'bg-blue-800 text-white'
                  : 'text-white hover:text-blue-100 hover:bg-blue-700',
                'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold flex-1'
              )}
            >
              <item.icon
                className={clsx(
                  isPathActive(item.href) ? 'text-white' : 'text-blue-200 group-hover:text-white',
                  'h-6 w-6 shrink-0'
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
            <button
              onClick={() => toggleSubmenu(item.name)}
              className={clsx(
                isPathActive(item.href)
                  ? 'text-white'
                  : 'text-blue-200 hover:text-white',
                'p-2 rounded-md hover:bg-blue-700'
              )}
              aria-label={`Toggle ${item.name} submenu`}
            >
              {isMenuExpanded(item.name) ? (
                <ChevronDownIcon className="h-4 w-4" />
              ) : (
                <ChevronRightIcon className="h-4 w-4" />
              )}
            </button>
          </div>
          {isMenuExpanded(item.name) && (
            <ul className={clsx("mt-1 space-y-1", isMobile ? "ml-6" : "ml-6")}>
              {(submenuItems as any)[item.name]?.map((subItem: any) => (
                <li key={subItem.name}>
                  <Link
                    href={subItem.href}
                    onClick={() => {
                      if (isMobile) setSidebarOpen(false)
                    }}
                    className={clsx(
                      pathname === subItem.href
                        ? 'bg-blue-800 text-white'
                        : 'text-blue-100 hover:text-white hover:bg-blue-700',
                      'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium'
                    )}
                  >
                    <subItem.icon
                      className={clsx(
                        pathname === subItem.href ? 'text-white' : 'text-blue-300 group-hover:text-white',
                        'h-5 w-5 shrink-0'
                      )}
                      aria-hidden="true"
                    />
                    {subItem.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )
    } else {
      return (
        <Link
          key={item.name}
          href={item.href}
          className={clsx(
            pathname === item.href
              ? 'bg-blue-800 text-white'
              : 'text-white hover:text-blue-100 hover:bg-blue-700',
            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
          )}
        >
          <item.icon
            className={clsx(
              pathname === item.href ? 'text-white' : 'text-blue-200 group-hover:text-white',
              'h-6 w-6 shrink-0'
            )}
            aria-hidden="true"
          />
          {item.name}
        </Link>
      )
    }
  }

  return (
    <>
      {/* Mobile sidebar */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-50 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900 bg-opacity-80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-blue-600 px-6 pb-4">
                  <div className="flex h-16 shrink-0 items-center justify-center">
                    <div className="flex items-center">
                      <span className="text-lg font-bold text-white">PAAS</span>
                    </div>
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {navigation.map((item) => (
                            <li key={item.name}>
                              {item.hasSubmenu ? renderNavigationItem(item, true) : renderNavigationItem(item, true)}
                            </li>
                          ))}
                        </ul>
                      </li>
                      <li className="mt-auto">
                        <ul role="list" className="-mx-2 space-y-1">
                          {bottomNavigation.map((item) => (
                            <li key={item.name}>
                              <Link
                                href={item.href}
                                className={clsx(
                                  pathname === item.href
                                    ? 'bg-blue-800 text-white'
                                    : 'text-white hover:text-blue-100 hover:bg-blue-700',
                                  'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                )}
                              >
                                <item.icon
                                  className={clsx(
                                    pathname === item.href ? 'text-white' : 'text-blue-200 group-hover:text-white',
                                    'h-6 w-6 shrink-0'
                                  )}
                                  aria-hidden="true"
                                />
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-72 lg:flex-col lg:border-r lg:border-blue-700">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-blue-600 px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center justify-center">
            <div className="flex items-center">
              <span className="text-lg font-bold text-white">PAAS</span>
            </div>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      {renderNavigationItem(item, false)}
                    </li>
                  ))}
                </ul>
              </li>
              <li className="mt-auto">
                <ul role="list" className="-mx-2 space-y-1">
                  {bottomNavigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={clsx(
                          pathname === item.href
                            ? 'bg-blue-800 text-white'
                            : 'text-white hover:text-blue-100 hover:bg-blue-700',
                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                        )}
                      >
                        <item.icon
                          className={clsx(
                            pathname === item.href ? 'text-white' : 'text-blue-200 group-hover:text-white',
                            'h-6 w-6 shrink-0'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  )
}

export default Sidebar