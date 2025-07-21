import { NextRequest, NextResponse } from 'next/server'
import { createUserEvent, updateUserEvent, deleteUserEvent } from '@/lib/calendarAPI'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const event = await createUserEvent(body)
    
    if (event) {
      return NextResponse.json(event, { status: 201 })
    } else {
      return NextResponse.json(
        { error: 'Failed to create event' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error creating user event:', error)
    return NextResponse.json(
      { error: 'Failed to create user event' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...data } = body
    
    const event = await updateUserEvent(id, data)
    
    if (event) {
      return NextResponse.json(event)
    } else {
      return NextResponse.json(
        { error: 'Failed to update event' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error updating user event:', error)
    return NextResponse.json(
      { error: 'Failed to update user event' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      )
    }

    const success = await deleteUserEvent(id)
    
    if (success) {
      return NextResponse.json({ message: 'Event deleted successfully' })
    } else {
      return NextResponse.json(
        { error: 'Failed to delete event' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error deleting user event:', error)
    return NextResponse.json(
      { error: 'Failed to delete user event' },
      { status: 500 }
    )
  }
} 