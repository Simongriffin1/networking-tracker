# 🚀 **Deployment Guide - Make It Your Personal Site**

## 🎯 **Overview**

This guide will help you deploy your networking tracker as a personal site with persistent data storage. You'll have your own URL and database that stores all your contacts and interactions.

## 📊 **Database Options**

### **Option 1: Supabase (Recommended)**
**Best for**: Personal use, free tier, easy setup
- **Free tier**: 500MB database, 50MB file storage
- **Cost**: Free for personal use
- **Features**: PostgreSQL, real-time, auth, file storage

### **Option 2: Railway**
**Best for**: Simple deployment, good free tier
- **Free tier**: $5/month credit
- **Cost**: ~$5-10/month for personal use
- **Features**: PostgreSQL, easy deployment

### **Option 3: PlanetScale**
**Best for**: MySQL preference, generous free tier
- **Free tier**: 1GB database, 1 billion reads/month
- **Cost**: Free for personal use
- **Features**: MySQL, branching, easy scaling

## 🛠️ **Step-by-Step Setup**

### **Step 1: Choose Your Database**

#### **Supabase Setup (Recommended)**

1. **Create Supabase Account**
   ```bash
   # Go to https://supabase.com
   # Sign up with GitHub
   # Create a new project
   ```

2. **Get Your Database URL**
   - Go to Settings → Database
   - Copy the connection string
   - Format: `postgresql://postgres:[password]@[host]:5432/postgres`

3. **Update Environment Variables**
   ```bash
   # Create .env.local file
   DATABASE_URL="your-supabase-connection-string"
   NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
   ```

#### **Railway Setup**

1. **Create Railway Account**
   ```bash
   # Go to https://railway.app
   # Sign up with GitHub
   # Create a new project
   ```

2. **Add PostgreSQL Database**
   - Click "New Service" → "Database" → "PostgreSQL"
   - Copy the connection string

3. **Update Environment Variables**
   ```bash
   DATABASE_URL="your-railway-connection-string"
   ```

### **Step 2: Set Up Your Database**

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Generate Prisma Client**
   ```bash
   npm run db:generate
   ```

3. **Push Schema to Database**
   ```bash
   npm run db:push
   ```

4. **Generate Sample Data (Optional)**
   ```bash
   npm run db:seed
   ```

### **Step 3: Deploy Your Site**

#### **Option A: Vercel (Recommended)**

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/networking-tracker.git
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to https://vercel.com
   - Sign up with GitHub
   - Import your repository
   - Add environment variables:
     ```
     DATABASE_URL=your-database-url
     ```

3. **Your Site is Live!**
   - Vercel will give you a URL like: `https://networking-tracker-xyz.vercel.app`
   - You can add a custom domain later

#### **Option B: Railway (Full Stack)**

1. **Deploy on Railway**
   - Go to https://railway.app
   - Create new project from GitHub
   - Add environment variables
   - Deploy automatically

2. **Your Site is Live!**
   - Railway will give you a URL like: `https://networking-tracker-production.up.railway.app`

## 🔧 **Environment Variables**

Create a `.env.local` file in your project root:

```env
# Database
DATABASE_URL="your-database-connection-string"

# Supabase (if using Supabase)
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"

# NextAuth (optional, for future auth)
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://your-domain.vercel.app"
```

## 📊 **Database Schema**

Your database will store:

### **Contacts Table**
- Personal and professional information
- Relationship details
- Tags and notes
- Follow-up preferences

### **Interactions Table**
- Conversation logs
- Meeting notes
- Sentiment tracking
- Next steps

### **Calendar Events**
- User-created events
- AI-generated follow-up suggestions
- Meeting schedules

### **Sample Data Structure**
```json
{
  "contacts": [
    {
      "id": "uuid",
      "fullName": "Sarah Chen",
      "email": "sarah@techcorp.com",
      "company": "TechCorp",
      "title": "CTO",
      "relationship": "Mentor",
      "tags": ["VC", "Mentor", "Tech"],
      "lastContacted": "2024-01-15",
      "nextFollowUp": "2024-01-22"
    }
  ],
  "interactions": [
    {
      "id": "uuid",
      "contactId": "contact-uuid",
      "type": "coffee",
      "date": "2024-01-15",
      "summary": "Discussed new product launch",
      "sentiment": "Very positive",
      "nextSteps": "Follow up on collaboration opportunity"
    }
  ]
}
```

## 🔒 **Security & Privacy**

### **Data Protection**
- **Your data is private** - only you have access
- **Encrypted in transit** - HTTPS everywhere
- **Database security** - managed by your provider
- **No third-party access** - your personal CRM

### **Backup Strategy**
- **Automatic backups** - provided by your database host
- **Export capability** - you can export your data anytime
- **Version control** - your code is backed up on GitHub

## 🚀 **Custom Domain (Optional)**

### **Add Custom Domain**
1. **Buy a domain** (Namecheap, GoDaddy, etc.)
2. **Configure DNS**:
   ```
   Type: CNAME
   Name: @
   Value: your-vercel-app.vercel.app
   ```
3. **Add to Vercel**:
   - Go to your project settings
   - Add custom domain
   - Update environment variables

### **Example Domains**
- `networking.yourname.com`
- `contacts.yourname.com`
- `crm.yourname.com`

## 📱 **Mobile Access**

### **Progressive Web App**
Your site works as a mobile app:
- **Add to home screen** on iOS/Android
- **Offline capability** (basic functionality)
- **Push notifications** (future feature)

### **Mobile Optimization**
- **Responsive design** - works on all devices
- **Touch-friendly** - optimized for mobile
- **Fast loading** - optimized performance

## 🔄 **Regular Usage**

### **Daily Routine**
1. **Check dashboard** - see today's follow-ups
2. **Review calendar** - upcoming meetings
3. **Add interactions** - log conversations
4. **Update contacts** - keep info current

### **Weekly Planning**
1. **Review suggestions** - AI-generated follow-ups
2. **Schedule meetings** - plan networking time
3. **Update goals** - track relationship progress
4. **Export insights** - review your networking

## 💰 **Cost Breakdown**

### **Free Tier (Recommended)**
- **Supabase**: Free (500MB database)
- **Vercel**: Free (personal projects)
- **Domain**: $10-15/year (optional)
- **Total**: $0-15/year

### **Paid Tier (If Needed)**
- **Supabase Pro**: $25/month (if you exceed free tier)
- **Vercel Pro**: $20/month (if you need team features)
- **Domain**: $10-15/year
- **Total**: $35-60/month (only if you scale up)

## 🎯 **Next Steps**

### **Immediate Actions**
1. **Choose your database provider** (Supabase recommended)
2. **Set up your database** and push schema
3. **Deploy to Vercel** and get your URL
4. **Add your first contacts** and start using it

### **Future Enhancements**
- **Custom domain** for professional appearance
- **Email integration** for automated follow-ups
- **Calendar sync** with Google/Outlook
- **Mobile app** for on-the-go access

## 🎉 **You're Ready!**

Once deployed, you'll have:
- ✅ **Your own personal CRM** at your custom URL
- ✅ **Persistent data storage** in your database
- ✅ **Mobile access** from anywhere
- ✅ **AI-powered suggestions** for follow-ups
- ✅ **Professional networking tool** that grows with you

**Start with Supabase + Vercel for the easiest setup!** 🚀 