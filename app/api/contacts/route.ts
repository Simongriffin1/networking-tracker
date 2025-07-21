import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      include: {
        interactions: {
          orderBy: {
            date: 'desc'
          },
          take: 1
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    return NextResponse.json(contacts)
  } catch (error) {
    console.error('Error fetching contacts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const contact = await prisma.contact.create({
      data: {
        fullName: body.fullName,
        preferredName: body.preferredName,
        email: body.email,
        phone: body.phone,
        linkedInUrl: body.linkedInUrl,
        twitterHandle: body.twitterHandle,
        company: body.company,
        title: body.title,
        location: body.location,
        relationship: body.relationship,
        contactSource: body.contactSource,
        tags: body.tags || [],
        personalNotes: body.personalNotes,
        professionalNotes: body.professionalNotes,
        meetingCadence: body.meetingCadence,
        nextFollowUp: body.nextFollowUp ? new Date(body.nextFollowUp) : null,
        birthday: body.birthday ? new Date(body.birthday) : null,
        favoriteTopics: body.favoriteTopics || []
      }
    })

    return NextResponse.json(contact, { status: 201 })
  } catch (error) {
    console.error('Error creating contact:', error)
    return NextResponse.json(
      { error: 'Failed to create contact' },
      { status: 500 }
    )
  }
} 