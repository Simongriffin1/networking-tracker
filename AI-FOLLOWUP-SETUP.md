# 🤖 AI Follow-Up System Setup Guide

Your networking-tracker now includes a powerful AI-powered follow-up suggestion system that automatically identifies contacts you should reach out to and generates personalized messages.

## ✅ Features Implemented

### 🧠 AI Follow-Up Engine
- **Smart Scoring**: Analyzes time since last contact, tags, and relationship importance
- **AI Message Generation**: Creates personalized follow-up messages using OpenAI
- **Priority Ranking**: Sorts suggestions by importance score
- **One-Click Actions**: Mark as sent, copy message, or generate new suggestions

### 📧 Email & SMS Sync
- **SMS Webhook**: Automatically logs incoming/outgoing SMS via Twilio
- **Email Sync Framework**: Ready for Gmail API integration
- **Contact Matching**: Links messages to existing contacts by phone/email

## 🔧 Setup Instructions

### 1. OpenAI API Key (Required for AI Messages)

Add your OpenAI API key to `.env.local`:

```bash
OPENAI_API_KEY=sk-your-openai-api-key-here
```

**Get your API key from:** https://platform.openai.com/api-keys

### 2. Generate Follow-Up Suggestions

#### Option A: Manual Generation
1. Go to your dashboard
2. Click "Generate New" in the AI Follow-Up Suggestions section
3. Review and send the AI-generated messages

#### Option B: Automated Weekly Generation
Set up a cron job to hit: `https://your-domain.vercel.app/api/followups/generate`

**Using Vercel Cron Jobs:**
```json
{
  "crons": [
    {
      "path": "/api/followups/generate",
      "schedule": "0 9 * * 1"
    }
  ]
}
```

**Using EasyCron:**
- URL: `https://your-domain.vercel.app/api/followups/generate`
- Schedule: Every Monday at 9 AM

### 3. SMS Integration (Optional)

#### Twilio Setup:
1. Create a Twilio account: https://www.twilio.com/
2. Get a phone number
3. Set webhook URL to: `https://your-domain.vercel.app/api/sms/webhook`
4. Add Twilio credentials to `.env.local`:

```bash
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
```

### 4. Email Integration (Optional)

#### Gmail API Setup:
1. Go to Google Cloud Console
2. Enable Gmail API
3. Create OAuth 2.0 credentials
4. Add to `.env.local`:

```bash
GMAIL_CLIENT_ID=your-client-id
GMAIL_CLIENT_SECRET=your-client-secret
GMAIL_REFRESH_TOKEN=your-refresh-token
```

## 🎯 How It Works

### Scoring Algorithm
The AI engine scores contacts based on:

| Factor | Points | Description |
|--------|--------|-------------|
| > 90 days inactive | +30 | High priority reconnection |
| > 60 days inactive | +20 | Medium priority |
| > 30 days inactive | +10 | Low priority |
| Mentor tag | +15 | Important relationship |
| Investor/VC tag | +12 | Professional opportunity |
| Colleague tag | +8 | Network maintenance |

### AI Message Generation
- Uses GPT-4 to create personalized messages
- Incorporates contact details, relationship, and context
- Generates warm, professional follow-ups
- Keeps messages under 100 words

### Contact Matching
- **SMS**: Matches by phone number
- **Email**: Matches by email address
- **Automatic Logging**: Creates interaction records

## 🚀 Usage

### Dashboard View
1. **View Suggestions**: See AI-generated follow-up suggestions
2. **Score Indicators**: Color-coded badges show priority
3. **AI Messages**: Pre-written personalized messages
4. **Quick Actions**: Mark as sent or copy message

### Manual Generation
```bash
# Trigger via API
curl -X POST https://your-domain.vercel.app/api/followups/generate
```

### View Suggestions
```bash
# Get current suggestions
curl https://your-domain.vercel.app/api/followups/suggestions
```

## 🔄 Automation Options

### Weekly Email Digest
Set up a cron job to:
1. Generate suggestions
2. Send email with top 5 suggestions
3. Include AI-generated messages

### Slack Integration
Create a Slack bot that:
1. Posts weekly follow-up reminders
2. Includes AI-generated messages
3. Allows one-click "Mark as Sent"

### Calendar Integration
Sync suggested follow-ups to your calendar as reminders.

## 🛠️ Customization

### Modify Scoring
Edit `lib/followupEngine.ts` to adjust:
- Time thresholds
- Tag weights
- Custom scoring rules

### Custom Message Templates
Modify the AI prompt in `generateSuggestedFollowUps()` to:
- Change tone/style
- Include specific information
- Add custom formatting

### Add New Contact Tags
Update the scoring logic to recognize new tags like:
- "speaker"
- "author"
- "influencer"

## 🔍 Troubleshooting

### AI Messages Not Generating
- Check OpenAI API key is set
- Verify API key has sufficient credits
- Check console logs for errors

### SMS Not Syncing
- Verify Twilio webhook URL is correct
- Check phone numbers match contact records
- Review webhook logs

### Suggestions Not Appearing
- Ensure contacts have recent interactions
- Check contact tags are set correctly
- Verify database connection

## 📈 Next Steps

### Advanced Features to Add:
1. **Sentiment Analysis**: Analyze interaction notes for sentiment
2. **News Integration**: Suggest follow-ups based on company news
3. **Meeting Scheduler**: Direct calendar booking from suggestions
4. **Template Library**: Save and reuse successful message templates
5. **Analytics**: Track response rates and success metrics

### Integration Ideas:
- **LinkedIn**: Sync LinkedIn interactions
- **Twitter**: Monitor mentions and engagement
- **CRM Systems**: Export to Salesforce, HubSpot, etc.
- **Email Clients**: Direct integration with Outlook, Gmail

Your AI follow-up system is now ready to help you maintain stronger professional relationships! 🚀 