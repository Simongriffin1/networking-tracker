import { NextRequest, NextResponse } from 'next/server'
import { createUserEvent, updateUserEvent, deleteUserEvent } from '@/lib/calendarAPI'

// Force dynamic rendering to prevent static generation
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    console.log('🔥 API ROUTE: /api/calendar/events/user - POST request')
    const body = await request.json()
    const event = await createUserEvent(body)
    
    if (event) {
      console.log('🔥 API ROUTE: Successfully created user event')
      return NextResponse.json(event, { status: 201 })
    } else {
      console.log('🔥 API ROUTE: Failed to create user event')
      return NextResponse.json(
        { error: 'Failed to create event' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('🔥 API ROUTE ERROR: /api/calendar/events/user POST failed:', error)
    return NextResponse.json(
      { error: 'Failed to create user event' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('🔥 API ROUTE: /api/calendar/events/user - PUT request')
    const body = await request.json()
    const { id, ...data } = body
    
    const event = await updateUserEvent(id, data)
    
    if (event) {
      console.log('🔥 API ROUTE: Successfully updated user event')
      return NextResponse.json(event)
    } else {
      console.log('🔥 API ROUTE: Failed to update user event')
      return NextResponse.json(
        { error: 'Failed to update event' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('🔥 API ROUTE ERROR: /api/calendar/events/user PUT failed:', error)
    return NextResponse.json(
      { error: 'Failed to update user event' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log('🔥 API ROUTE: /api/calendar/events/user - DELETE request')
    
    // Handle cases where request is not available (build-time)
    if (!request) {
      console.log('🔥 API ROUTE: No request object available')
      return NextResponse.json({ message: 'No operation performed' })
    }

    // Safely access URL parameters without direct URL construction
    let id: string | null = null
    
    try {
      // Use NextRequest's built-in searchParams instead of URL construction
      id = request.nextUrl?.searchParams.get('id') || null
      console.log('🔥 API ROUTE: Extracted ID:', id)
    } catch (error) {
      console.error('🔥 API ROUTE ERROR: Failed to extract ID parameter:', error)
      return NextResponse.json(
        { error: 'Invalid request parameters' },
        { status: 400 }
      )
    }
    
    if (!id) {
      console.log('🔥 API ROUTE: Missing event ID')
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      )
    }

    const success = await deleteUserEvent(id)
    
    if (success) {
      console.log('🔥 API ROUTE: Successfully deleted user event')
      return NextResponse.json({ message: 'Event deleted successfully' })
    } else {
      console.log('🔥 API ROUTE: Failed to delete user event')
      return NextResponse.json(
        { error: 'Failed to delete event' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('🔥 API ROUTE ERROR: /api/calendar/events/user DELETE failed:', error)
    return NextResponse.json(
      { error: 'Failed to delete user event' },
      { status: 500 }
    )
  }
} 