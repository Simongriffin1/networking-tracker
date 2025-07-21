import { prisma } from './prisma'

// Type definitions for better type safety
interface ContactForFollowUp {
  id: string
  fullName: string
  meetingCadence: string | null
  nextFollowUp: Date | null
  tags: string[]
  relationship: string | null
  lastContacted: Date | null
}

export interface CalendarEvent {
  id: string
  title: string
  date: Date
  contactId?: string
  contactName?: string
  notes?: string
  type: 'user_event' | 'suggested_follow_up'
  importanceScore?: number
  messagePreview?: string
  location?: string
  backgroundColor?: string
  borderColor?: string
}

export async function getCalendarEvents(startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
  try {
    // Validate input parameters
    if (!startDate || !endDate || isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      console.error('Invalid date parameters provided to getCalendarEvents')
      return []
    }

    // Check if database is available
    if (!process.env.DATABASE_URL) {
      console.warn('DATABASE_URL not found, returning empty events array')
      return []
    }

    // Check if Prisma is available (for development builds)
    if (typeof prisma === 'undefined') {
      console.warn('Prisma client not available, returning empty events array')
      return []
    }

    // Fetch user events
    const userEvents = await prisma.userEvent.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        contact: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
    })

    // Fetch suggested follow-ups
    const suggestedFollowUps = await prisma.suggestedFollowUp.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        contact: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
    })

    // Transform user events
    const transformedUserEvents: CalendarEvent[] = userEvents.map((event: any) => ({
      id: `user_${event.id}`,
      title: event.title,
      date: event.date,
      contactId: event.contactId || undefined,
      contactName: event.contact?.fullName,
      notes: event.notes || undefined,
      type: 'user_event' as const,
      location: event.location || undefined,
      backgroundColor: '#3b82f6', // Blue for user events
      borderColor: '#1d4ed8',
    }))

    // Transform suggested follow-ups
    const transformedSuggestedEvents: CalendarEvent[] = suggestedFollowUps.map((event: any) => ({
      id: `suggested_${event.id}`,
      title: `Follow up with ${event.contactName}`,
      date: event.date,
      contactId: event.contactId,
      contactName: event.contactName,
      notes: event.messagePreview,
      type: 'suggested_follow_up' as const,
      importanceScore: event.importanceScore,
      messagePreview: event.messagePreview,
      backgroundColor: event.importanceScore >= 75 ? '#ef4444' : '#f59e0b', // Red for high importance, orange for medium
      borderColor: event.importanceScore >= 75 ? '#dc2626' : '#d97706',
    }))

    return [...transformedUserEvents, ...transformedSuggestedEvents]
  } catch (error) {
    console.error('Error fetching calendar events:', error)
    return []
  }
}

export async function createUserEvent(data: {
  title: string
  date: Date
  contactId?: string
  notes?: string
  type?: string
  location?: string
}): Promise<CalendarEvent | null> {
  try {
    const event = await prisma.userEvent.create({
      data: {
        title: data.title,
        date: data.date,
        contactId: data.contactId,
        notes: data.notes,
        type: data.type || 'meeting',
        location: data.location,
      },
      include: {
        contact: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
    })

    return {
      id: `user_${event.id}`,
      title: event.title,
      date: event.date,
      contactId: event.contactId || undefined,
      contactName: event.contact?.fullName,
      notes: event.notes || undefined,
      type: 'user_event' as const,
      location: event.location || undefined,
      backgroundColor: '#3b82f6',
      borderColor: '#1d4ed8',
    }
  } catch (error) {
    console.error('Error creating user event:', error)
    return null
  }
}

export async function updateUserEvent(
  id: string,
  data: {
    title?: string
    date?: Date
    contactId?: string
    notes?: string
    type?: string
    location?: string
  }
): Promise<CalendarEvent | null> {
  try {
    const eventId = id.replace('user_', '')
    const event = await prisma.userEvent.update({
      where: { id: eventId },
      data: {
        title: data.title,
        date: data.date,
        contactId: data.contactId,
        notes: data.notes,
        type: data.type,
        location: data.location,
      },
      include: {
        contact: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
    })

    return {
      id: `user_${event.id}`,
      title: event.title,
      date: event.date,
      contactId: event.contactId || undefined,
      contactName: event.contact?.fullName,
      notes: event.notes || undefined,
      type: 'user_event' as const,
      location: event.location || undefined,
      backgroundColor: '#3b82f6',
      borderColor: '#1d4ed8',
    }
  } catch (error) {
    console.error('Error updating user event:', error)
    return null
  }
}

export async function deleteUserEvent(id: string): Promise<boolean> {
  try {
    const eventId = id.replace('user_', '')
    await prisma.userEvent.delete({
      where: { id: eventId },
    })
    return true
  } catch (error) {
    console.error('Error deleting user event:', error)
    return false
  }
}

export async function generateSuggestedFollowUps(): Promise<void> {
  try {
    // Get contacts who haven't been contacted recently
    const contactsNeedingFollowUp = await prisma.contact.findMany({
      where: {
        OR: [
          { lastContacted: null },
          {
            lastContacted: {
              lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
            },
          },
        ],
      },
      select: {
        id: true,
        fullName: true,
        meetingCadence: true,
        nextFollowUp: true,
        tags: true,
        relationship: true,
        lastContacted: true,
      },
    })

    // Generate suggested follow-ups for each contact
    for (const contact of contactsNeedingFollowUp) {
      const importanceScore = calculateImportanceScore(contact)
      const suggestedDate = calculateSuggestedDate(contact)
      
      if (suggestedDate) {
        await prisma.suggestedFollowUp.create({
          data: {
            contactName: contact.fullName,
            contactId: contact.id,
            date: suggestedDate,
            messagePreview: generateMessagePreview(contact),
            importanceScore,
            type: 'follow_up',
          },
        })
      }
    }
  } catch (error) {
    console.error('Error generating suggested follow-ups:', error)
  }
}

function calculateImportanceScore(contact: ContactForFollowUp): number {
  let score = 50 // Base score

  // Adjust based on relationship
  if (contact.relationship === 'Mentor') score += 20
  if (contact.relationship === 'VC') score += 15
  if (contact.relationship === 'Recruiter') score += 10

  // Adjust based on tags
  if (contact.tags.includes('VC')) score += 10
  if (contact.tags.includes('Mentor')) score += 15
  if (contact.tags.includes('Startup')) score += 5

  // Adjust based on last contact
  if (!contact.lastContacted) score += 10 // Never contacted

  return Math.min(score, 100)
}

function calculateSuggestedDate(contact: ContactForFollowUp): Date | null {
  const now = new Date()
  
  // If they have a nextFollowUp date, use that
  if (contact.nextFollowUp) {
    return new Date(contact.nextFollowUp)
  }

  // If they have a meeting cadence, calculate based on that
  if (contact.meetingCadence) {
    const lastContact = contact.lastContacted || now
    const daysToAdd = contact.meetingCadence.includes('month') ? 30 : 7
    return new Date(lastContact.getTime() + daysToAdd * 24 * 60 * 60 * 1000)
  }

  // Default: suggest follow-up in 2 weeks
  return new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000)
}

function generateMessagePreview(contact: ContactForFollowUp): string {
  const templates = [
    `Check in with ${contact.fullName} about their latest projects`,
    `Follow up on our previous conversation with ${contact.fullName}`,
    `Touch base with ${contact.fullName} to maintain the relationship`,
    `Schedule a catch-up call with ${contact.fullName}`,
  ]

  return templates[Math.floor(Math.random() * templates.length)]
} 