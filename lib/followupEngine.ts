import { prisma } from '@/lib/prisma'
import OpenAI from 'openai'

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY!,
  dangerouslyAllowBrowser: false
})

export interface FollowUpSuggestion {
  contactId: string
  contactName: string
  reason: string
  score: number
  suggestedDate: Date
  aiMessageDraft: string
  lastInteractionDate?: Date
  contactTags?: string[]
}

export async function generateSuggestedFollowUps(): Promise<FollowUpSuggestion[]> {
  try {
    console.log('🔥 FOLLOWUP ENGINE: Starting follow-up generation')
    
    const contacts = await prisma.contact.findMany({ 
      include: { 
        interactions: {
          orderBy: { date: 'desc' },
          take: 1
        }
      } 
    })

    console.log(`🔥 FOLLOWUP ENGINE: Processing ${contacts.length} contacts`)

    const suggestions = await Promise.all(
      contacts.map(async (contact: any) => {
        const lastInteraction = contact.interactions[0]
        const daysSince = lastInteraction
          ? Math.floor((Date.now() - lastInteraction.date.getTime()) / (1000 * 60 * 60 * 24))
          : 999

        let score = 0
        let reason = ''

        // Score based on time since last contact
        if (daysSince > 90) {
          score += 30
          reason = `No contact in ${daysSince} days`
        } else if (daysSince > 60) {
          score += 20
          reason = `No contact in ${daysSince} days`
        } else if (daysSince > 30) {
          score += 10
          reason = `No contact in ${daysSince} days`
        }

        // Score based on tags
        if (contact.favoriteTopics?.includes('mentor')) {
          score += 15
          reason += ' | Mentor contact'
        }
        if (contact.favoriteTopics?.includes('vc') || contact.favoriteTopics?.includes('investor')) {
          score += 12
          reason += ' | Investor contact'
        }
        if (contact.favoriteTopics?.includes('colleague')) {
          score += 8
          reason += ' | Former colleague'
        }

        // Only generate suggestions for contacts with score > 0
        if (score === 0) {
          return null
        }

        // Generate AI message draft
        let aiMessageDraft = ''
        try {
          const aiPrompt = `Write a friendly, concise follow-up message to ${contact.fullName}, who is a ${contact.relationship ?? 'contact'} you haven't spoken to in ${daysSince} days. 
          
          Contact details:
          - Name: ${contact.fullName}
          - Relationship: ${contact.relationship || 'professional contact'}
          - Company: ${contact.company || 'N/A'}
          - Topics of interest: ${contact.favoriteTopics?.join(', ') || 'N/A'}
          
          Make it personal, warm, and professional. Keep it under 100 words.`

          const completion = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
              { 
                role: 'system', 
                content: 'You help users write thoughtful, personal follow-up messages to professional contacts. Be warm, genuine, and specific to the person.' 
              },
              { role: 'user', content: aiPrompt }
            ],
            temperature: 0.7,
            max_tokens: 150
          })

          aiMessageDraft = completion.choices[0].message?.content || ''
        } catch (error) {
          console.error('🔥 FOLLOWUP ENGINE: Failed to generate AI message:', error)
          aiMessageDraft = `Hi ${contact.fullName}, hope you're doing well! Would love to catch up sometime.`
        }

        return {
          contactId: contact.id,
          contactName: contact.fullName,
          reason: reason.trim(),
          score,
          suggestedDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
          aiMessageDraft,
          lastInteractionDate: lastInteraction?.date,
          contactTags: contact.favoriteTopics
        }
      })
    )

    // Filter out null suggestions and sort by score
    const validSuggestions = suggestions
      .filter((s): s is FollowUpSuggestion => s !== null)
      .sort((a, b) => b.score - a.score)

    console.log(`🔥 FOLLOWUP ENGINE: Generated ${validSuggestions.length} suggestions`)

    // Store in database
    if (validSuggestions.length > 0) {
      await prisma.suggestedFollowUp.createMany({
        data: validSuggestions.map((s) => ({
          contactId: s.contactId,
          contactName: s.contactName,
          reason: s.reason,
          score: s.score,
          suggestedDate: s.suggestedDate,
          aiMessageDraft: s.aiMessageDraft
        })),
        skipDuplicates: true
      })
    }

    return validSuggestions
  } catch (error) {
    console.error('🔥 FOLLOWUP ENGINE ERROR:', error)
    return []
  }
}

export async function getFollowUpSuggestions(): Promise<FollowUpSuggestion[]> {
  try {
    const suggestions = await prisma.suggestedFollowUp.findMany({
      include: {
        contact: true
      },
      orderBy: {
        score: 'desc'
      }
    })

    return suggestions.map((s: any) => ({
      contactId: s.contactId,
      contactName: s.contactName,
      reason: s.reason,
      score: s.score,
      suggestedDate: s.suggestedDate,
      aiMessageDraft: s.aiMessageDraft,
      contactTags: s.contact.favoriteTopics
    }))
  } catch (error) {
    console.error('🔥 FOLLOWUP ENGINE: Failed to get suggestions:', error)
    return []
  }
}

export async function markFollowUpAsSent(suggestionId: string): Promise<boolean> {
  try {
    await prisma.suggestedFollowUp.delete({
      where: { id: suggestionId }
    })
    return true
  } catch (error) {
    console.error('🔥 FOLLOWUP ENGINE: Failed to mark as sent:', error)
    return false
  }
} 