import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function generateSampleData() {
  try {
    console.log('Generating sample calendar data...')

    // Create sample contacts
    const contacts = await Promise.all([
      prisma.contact.create({
        data: {
          fullName: 'Sarah Chen',
          email: 'sarah@techcorp.com',
          company: 'TechCorp',
          title: 'CTO',
          relationship: 'Mentor',
          tags: ['VC', 'Mentor', 'Tech'],
          lastContacted: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
          nextFollowUp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        }
      }),
      prisma.contact.create({
        data: {
          fullName: 'Mike Johnson',
          email: 'mike@startupxyz.com',
          company: 'StartupXYZ',
          title: 'CEO',
          relationship: 'VC',
          tags: ['VC', 'Startup'],
          lastContacted: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
          nextFollowUp: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        }
      }),
      prisma.contact.create({
        data: {
          fullName: 'Emily Rodriguez',
          email: 'emily@vcpartners.com',
          company: 'VC Partners',
          title: 'Partner',
          relationship: 'VC',
          tags: ['VC', 'Finance'],
          lastContacted: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
          nextFollowUp: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        }
      })
    ])

    console.log('Created contacts:', contacts.length)

    // Create sample user events
    const userEvents = await Promise.all([
      prisma.userEvent.create({
        data: {
          title: 'Coffee with Sarah Chen',
          date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
          contactId: contacts[0].id,
          notes: 'Discuss new product launch and potential collaboration',
          type: 'meeting',
          location: 'Blue Bottle Coffee, SF',
        }
      }),
      prisma.userEvent.create({
        data: {
          title: 'Follow-up call with Mike',
          date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
          contactId: contacts[1].id,
          notes: 'Check in on funding round progress',
          type: 'follow_up',
          location: 'Zoom',
        }
      }),
      prisma.userEvent.create({
        data: {
          title: 'Monthly check-in reminder',
          date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
          notes: 'Review networking goals and plan next month',
          type: 'reminder',
        }
      })
    ])

    console.log('Created user events:', userEvents.length)

    // Create sample suggested follow-ups
    const suggestedFollowUps = await Promise.all([
      prisma.suggestedFollowUp.create({
        data: {
          contactName: 'Sarah Chen',
          contactId: contacts[0].id,
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          messagePreview: 'Check in with Sarah about their latest product launch and potential collaboration opportunities',
          importanceScore: 85,
          type: 'follow_up',
        }
      }),
      prisma.suggestedFollowUp.create({
        data: {
          contactName: 'Mike Johnson',
          contactId: contacts[1].id,
          date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
          messagePreview: 'Follow up on funding round progress and discuss next steps',
          importanceScore: 90,
          type: 'follow_up',
        }
      }),
      prisma.suggestedFollowUp.create({
        data: {
          contactName: 'Emily Rodriguez',
          contactId: contacts[2].id,
          date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
          messagePreview: 'Touch base with Emily to maintain the relationship and discuss potential opportunities',
          importanceScore: 70,
          type: 'follow_up',
        }
      })
    ])

    console.log('Created suggested follow-ups:', suggestedFollowUps.length)

    console.log('✅ Sample data generated successfully!')
    console.log('📅 You can now view the calendar at http://localhost:3000/calendar')

  } catch (error) {
    console.error('Error generating sample data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
generateSampleData() 