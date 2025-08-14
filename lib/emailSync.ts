import { prisma } from '@/lib/prisma'

export interface EmailInteraction {
  from: string
  to: string
  subject: string
  body: string
  date: Date
  messageId: string
}

export async function syncEmailInteractions(emails: EmailInteraction[]) {
  try {
    console.log('🔥 EMAIL SYNC: Starting email sync for', emails.length, 'emails')
    
    let syncedCount = 0
    
    for (const email of emails) {
      // Try to find contact by email
      const contact = await prisma.contact.findFirst({
        where: {
          OR: [
            { email: email.from },
            { email: email.to }
          ]
        }
      })
      
      if (contact) {
        // Create interaction record
        await prisma.interaction.create({
          data: {
            contactId: contact.id,
            type: 'email',
            date: email.date,
            summary: email.subject,
            fullNotes: `From: ${email.from}\nTo: ${email.to}\nSubject: ${email.subject}\n\n${email.body}`,
            location: 'Email'
          }
        })
        
        syncedCount++
        console.log(`🔥 EMAIL SYNC: Synced email with ${contact.fullName}`)
      }
    }
    
    console.log(`🔥 EMAIL SYNC: Successfully synced ${syncedCount} emails`)
    return syncedCount
  } catch (error) {
    console.error('🔥 EMAIL SYNC ERROR:', error)
    return 0
  }
}

// Gmail API integration (requires setup)
export async function fetchGmailMessages(accessToken: string, maxResults: number = 50) {
  try {
    const response = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${maxResults}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    )
    
    if (!response.ok) {
      throw new Error('Failed to fetch Gmail messages')
    }
    
    const data = await response.json()
    return data.messages || []
  } catch (error) {
    console.error('🔥 EMAIL SYNC: Failed to fetch Gmail messages:', error)
    return []
  }
}

// SMS sync utility
export async function syncSMSInteraction(
  phoneNumber: string,
  message: string,
  direction: 'inbound' | 'outbound',
  date: Date
) {
  try {
    console.log('🔥 SMS SYNC: Syncing SMS interaction')
    
    // Find contact by phone number
    const contact = await prisma.contact.findFirst({
      where: {
        phone: phoneNumber
      }
    })
    
    if (contact) {
      await prisma.interaction.create({
        data: {
          contactId: contact.id,
          type: 'sms',
          date: date,
          summary: `${direction === 'inbound' ? 'Received' : 'Sent'} SMS`,
          fullNotes: message,
          location: 'SMS'
        }
      })
      
      console.log(`🔥 SMS SYNC: Synced SMS with ${contact.fullName}`)
      return true
    }
    
    return false
  } catch (error) {
    console.error('🔥 SMS SYNC ERROR:', error)
    return false
  }
} 