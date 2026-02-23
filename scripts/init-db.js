const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database initialization...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@insurance.com' },
    update: {},
    create: {
      email: 'admin@insurance.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      isActive: true,
    },
  })

  console.log('Admin user created:', adminUser.email)

  // Create sample customers
  const customers = [
    {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@email.com',
      phone: '+1-555-0101',
      dateOfBirth: new Date('1985-05-15'),
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
    },
    {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@email.com',
      phone: '+1-555-0102',
      dateOfBirth: new Date('1990-08-22'),
      address: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
    },
    {
      firstName: 'Bob',
      lastName: 'Johnson',
      email: 'bob.johnson@email.com',
      phone: '+1-555-0103',
      dateOfBirth: new Date('1978-12-03'),
      address: '789 Pine Rd',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
    },
  ]

  for (const customerData of customers) {
    const customer = await prisma.customer.upsert({
      where: { email: customerData.email },
      update: {},
      create: customerData,
    })
    console.log('Customer created:', customer.email)
  }

  // Create sample policies
  const policies = [
    {
      policyNumber: 'POL-2024-001',
      customerId: '1',
      userId: adminUser.id,
      policyType: 'AUTO',
      coverage: 'Full Coverage',
      premium: 1200.00,
      deductible: 500.00,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      status: 'ACTIVE',
    },
    {
      policyNumber: 'POL-2024-002',
      customerId: '2',
      userId: adminUser.id,
      policyType: 'HOME',
      coverage: 'Property Protection',
      premium: 800.00,
      deductible: 1000.00,
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-12-31'),
      status: 'ACTIVE',
    },
    {
      policyNumber: 'POL-2024-003',
      customerId: '3',
      userId: adminUser.id,
      policyType: 'LIFE',
      coverage: 'Term Life Insurance',
      premium: 600.00,
      deductible: 0.00,
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-12-31'),
      status: 'PENDING',
    },
  ]

  for (const policyData of policies) {
    const policy = await prisma.policy.upsert({
      where: { policyNumber: policyData.policyNumber },
      update: {},
      create: policyData,
    })
    console.log('Policy created:', policy.policyNumber)
  }

  // Create sample claims
  const claims = [
    {
      claimNumber: 'CLM-2024-001',
      policyId: '1',
      customerId: '1',
      userId: adminUser.id,
      claimType: 'AUTO_ACCIDENT',
      description: 'Vehicle collision with another car',
      amount: 5000.00,
      status: 'UNDER_REVIEW',
      submittedAt: new Date('2024-01-15'),
    },
    {
      claimNumber: 'CLM-2024-002',
      policyId: '2',
      customerId: '2',
      userId: adminUser.id,
      claimType: 'PROPERTY_DAMAGE',
      description: 'Water damage from burst pipe',
      amount: 3500.00,
      status: 'APPROVED',
      submittedAt: new Date('2024-01-20'),
      processedAt: new Date('2024-01-25'),
    },
    {
      claimNumber: 'CLM-2024-003',
      policyId: '3',
      customerId: '3',
      userId: adminUser.id,
      claimType: 'THEFT',
      description: 'Stolen personal belongings',
      amount: 2500.00,
      status: 'PENDING',
      submittedAt: new Date('2024-02-01'),
    },
  ]

  for (const claimData of claims) {
    const claim = await prisma.claim.upsert({
      where: { claimNumber: claimData.claimNumber },
      update: {},
      create: claimData,
    })
    console.log('Claim created:', claim.claimNumber)
  }

  // Create company information
  const company = await prisma.company.upsert({
    where: { id: 'default-company' },
    update: {},
    create: {
      id: 'default-company',
      name: 'Insurance CRM System',
      logo: '/logo.png',
      address: '123 Insurance Ave, Suite 100',
      phone: '+1-555-INSURANCE',
      email: 'info@insurancecrm.com',
      website: 'https://insurancecrm.com',
    },
  })

  console.log('Company created:', company.name)

  console.log('Database initialization completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error during database initialization:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })




























