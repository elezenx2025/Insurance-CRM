#!/bin/bash

echo "🚀 Initializing Insurance CRM Database..."

# Check if .env file exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local file not found. Please copy env.example to .env.local and configure it."
    exit 1
fi

# Generate Prisma client
echo "📦 Generating Prisma client..."
npx prisma generate

# Push database schema
echo "🗄️  Pushing database schema..."
npx prisma db push

# Run database initialization script
echo "🌱 Seeding database with initial data..."
node scripts/init-db.js

echo "✅ Database initialization completed successfully!"
echo ""
echo "🎉 Your Insurance CRM is ready to use!"
echo ""
echo "📋 Demo Credentials:"
echo "   Email: admin@insurance.com"
echo "   Password: admin123"
echo ""
echo "🌐 Start the application:"
echo "   npm run dev"
echo ""
echo "🐳 Or with Docker:"
echo "   docker-compose up -d"




























