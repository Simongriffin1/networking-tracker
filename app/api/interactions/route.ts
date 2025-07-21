import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const interactions = await prisma.interaction.findMany({
      include: {
        contact: {
          select: {
            id: true,
            fullName: true,
            company: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    })

    return NextResponse.json(interactions)
  } catch (error) {
    console.error('Error fetching interactions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch interactions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const interaction = await prisma.interaction.create({
      data: {
        contactId: body.contactId,
        type: body.type,
        date: new Date(body.date),
        summary: body.summary,
        fullNotes: body.fullNotes,
        nextSteps: body.nextSteps,
        location: body.location,
        sentiment: body.sentiment,
        sharedBy: body.sharedBy
      },
      include: {
        contact: {
          select: {
            id: true,
            fullName: true,
            company: true
          }
        }
      }
    })

    // Update the contact's lastContacted field
    await prisma.contact.update({
      where: { id: body.contactId },
      data: {
        lastContacted: new Date(body.date)
      }
    })

    return NextResponse.json(interaction, { status: 201 })
  } catch (error) {
    console.error('Error creating interaction:', error)
    return NextResponse.json(
      { error: 'Failed to create interaction' },
      { status: 500 }
    )
  }
} 