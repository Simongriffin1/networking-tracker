# Networking Tracker - Personal CRM

A comprehensive personal CRM and relationship manager built with Next.js, Prisma, and Supabase. Track everyone you meet, every conversation you have, and all follow-up actions with deep insights and context.

## ✨ Features

### 📊 **Extensive Contact Management**
- **Deep Contact Profiles**: Store comprehensive information including personal notes, professional insights, favorite topics, and relationship context
- **Flexible Tagging**: Categorize contacts with custom tags and track favorite topics
- **Professional Details**: Company, title, location, LinkedIn, Twitter, and more
- **Relationship Context**: Track how you met, relationship type, and meeting cadence

### 🔄 **Interaction Tracking**
- **Rich Interaction Logs**: Record detailed summaries, full notes, and next steps
- **Multiple Interaction Types**: Email, call, coffee, lunch, conference, LinkedIn DM, and more
- **Sentiment Analysis**: Track positive, negative, or neutral interactions
- **Location Tracking**: Record where interactions took place
- **Introduction Tracking**: Note who introduced you to new contacts

### 📈 **Smart Follow-up Management**
- **Follow-up Reminders**: Never miss important follow-ups with automated tracking
- **Dashboard Overview**: See upcoming follow-ups and recent interactions at a glance
- **Meeting Cadence**: Set custom follow-up schedules for each contact
- **Next Steps Tracking**: Log and track action items from each interaction

### 🔍 **Advanced Search & Filtering**
- **Smart Search**: Find contacts by name, company, tags, or any field
- **Tag-based Filtering**: Filter contacts by custom tags and categories
- **Company Filtering**: Group contacts by company or organization
- **Relationship Filtering**: Filter by relationship type (mentor, peer, recruiter, etc.)

### 📱 **Modern UI/UX**
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Beautiful Components**: Built with Radix UI and Tailwind CSS
- **Intuitive Navigation**: Easy-to-use interface with clear information hierarchy
- **Real-time Updates**: Instant feedback and smooth interactions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (Supabase recommended)
- npm or yarn

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd networking-tracker
npm install
```

### 2. Environment Setup
Create a `.env.local` file:
```env
# Database
DATABASE_URL="postgresql://your-username:your-password@localhost:5432/networking-tracker"

# Supabase (if using Supabase)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### 3. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# (Optional) Open Prisma Studio
npm run db:studio
```

### 4. Start Development
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your app!

## 🏗️ Project Structure

```
networking-tracker/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── contacts/          # Contact pages
│   ├── dashboard/         # Dashboard page
│   ├── interactions/      # Interaction pages
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── contact-*.tsx     # Contact-related components
│   └── interaction-*.tsx # Interaction components
├── lib/                  # Utility functions
│   ├── prisma.ts         # Database client
│   └── utils.ts          # Helper functions
├── prisma/               # Database schema
│   └── schema.prisma     # Prisma schema
└── public/               # Static assets
```

## 📊 Database Schema

### Contact Model
```prisma
model Contact {
  id              String    @id @default(uuid())
  fullName        String
  preferredName   String?
  email           String?
  phone           String?
  linkedInUrl     String?
  twitterHandle   String?
  company         String?
  title           String?
  location        String?
  relationship    String?
  contactSource   String?
  tags            String[]
  personalNotes   String?
  professionalNotes String?
  meetingCadence  String?
  lastContacted   DateTime?
  nextFollowUp    DateTime?
  birthday        DateTime?
  favoriteTopics  String[]?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  interactions    Interaction[]
}
```

### Interaction Model
```prisma
model Interaction {
  id            String   @id @default(uuid())
  contact       Contact  @relation(fields: [contactId], references: [id])
  contactId     String
  type          String
  date          DateTime
  summary       String
  fullNotes     String?
  nextSteps     String?
  location      String?
  sentiment     String?
  sharedBy      String?
  createdAt     DateTime @default(now())
}
```

## 🎯 Key Pages

| Page | Description |
|------|-------------|
| `/dashboard` | Overview with follow-ups and recent activity |
| `/contacts` | List all contacts with search and filters |
| `/contacts/new` | Add a new contact |
| `/contacts/[id]` | Individual contact profile |
| `/interactions/new` | Log a new interaction |

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: Vercel (recommended)
- **Icons**: Lucide React
- **Forms**: React Hook Form (planned)

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production
```env
DATABASE_URL=your-production-database-url
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 🔮 Future Features

### V2 Roadmap
- [ ] **Smart Search**: NLP-enabled query bar
- [ ] **CSV Import/Export**: Upload contacts from LinkedIn/Gmail
- [ ] **Calendar Integration**: Sync with Google Calendar
- [ ] **Relationship Strength Score**: AI-powered relationship scoring
- [ ] **Pipeline Tracking**: Job/investor-specific views
- [ ] **Bulk Operations**: Multi-select and bulk edit
- [ ] **Analytics Dashboard**: Relationship insights and trends
- [ ] **Mobile App**: React Native companion app

### Advanced Features
- [ ] **Email Integration**: Auto-log email interactions
- [ ] **LinkedIn Sync**: Import connections and interactions
- [ ] **Meeting Scheduler**: Built-in scheduling with Calendly
- [ ] **AI Insights**: Smart suggestions and relationship analysis
- [ ] **Export Reports**: Generate relationship reports
- [ ] **Team Collaboration**: Share contacts with team members

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
- Database with [Prisma](https://www.prisma.io/)
- Icons from [Lucide](https://lucide.dev/)

---

**Happy Networking! 🚀** 