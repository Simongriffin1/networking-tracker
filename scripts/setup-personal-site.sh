#!/bin/bash

echo "🚀 Setting up your personal networking tracker site..."
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOF
# Database Configuration
DATABASE_URL="postgresql://your-username:your-password@your-host:5432/your-database"

# Supabase Configuration (if using Supabase)
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"

# NextAuth Configuration (optional)
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
EOF
    echo "✅ Created .env.local file"
    echo "⚠️  Please update the DATABASE_URL with your actual database connection string"
else
    echo "✅ .env.local file already exists"
fi

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🔧 Setting up database..."
echo "Please make sure you have:"
echo "1. Created a database (Supabase/Railway/PlanetScale)"
echo "2. Updated DATABASE_URL in .env.local"
echo "3. Run 'npm run db:generate' to generate Prisma client"
echo "4. Run 'npm run db:push' to push schema to database"
echo "5. Run 'npm run db:seed' to add sample data (optional)"

echo ""
echo "🌐 To deploy your site:"
echo "1. Push your code to GitHub"
echo "2. Connect to Vercel (vercel.com)"
echo "3. Add your DATABASE_URL as environment variable"
echo "4. Deploy!"

echo ""
echo "🎯 Your site will be available at:"
echo "- Development: http://localhost:3000"
echo "- Production: https://your-app-name.vercel.app"

echo ""
echo "📱 You can access your personal CRM from anywhere!"
echo "✅ All your contacts, interactions, and calendar events will be stored securely"
echo "✅ AI-powered follow-up suggestions will help you stay connected"
echo "✅ Mobile-responsive design works on all devices"

echo ""
echo "🚀 Ready to start? Run 'npm run dev' to test locally!" 