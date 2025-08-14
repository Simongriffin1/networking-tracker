import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contact = await prisma.contact.findUnique({
      where: { id: params.id },
      include: {
        interactions: {
          orderBy: {
            date: 'desc'
          }
        }
      }
    })

    if (!contact) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(contact)
  } catch (error) {
    console.error('Error fetching contact:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contact' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const contact = await prisma.contact.update({
      where: { id: params.id },
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

    return NextResponse.json(contact)
  } catch (error) {
    console.error('Error updating contact:', error)
    return NextResponse.json(
      { error: 'Failed to update contact' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Delete related records first to handle foreign key constraints
    await prisma.interaction.deleteMany({
      where: { contactId: id }
    })

    await prisma.userEvent.deleteMany({
      where: { contactId: id }
    })

    await prisma.suggestedFollowUp.deleteMany({
      where: { contactId: id }
    })

    // Now delete the contact
    await prisma.contact.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Contact deleted successfully' })
  } catch (error) {
    console.error('Error deleting contact:', error)
    return NextResponse.json(
      { error: 'Failed to delete contact' },
      { status: 500 }
    )
  }
} 