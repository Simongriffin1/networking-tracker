import { NextRequest, NextResponse } from 'next/server'
import { getCalendarEvents } from '@/lib/calendarAPI'

// Force dynamic rendering to prevent static generation
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('🔥 API ROUTE: /api/calendar/events - Starting request')
    
    // Handle cases where request is not available (build-time)
    if (!request) {
      console.log('🔥 API ROUTE: No request object available')
      return NextResponse.json([])
    }

    // Safely access URL parameters without direct URL construction
    let startDate: string | null = null
    let endDate: string | null = null
    
    try {
      // Use NextRequest's built-in searchParams instead of URL construction
      startDate = request.nextUrl?.searchParams.get('startDate') || null
      endDate = request.nextUrl?.searchParams.get('endDate') || null
      
      console.log('🔥 API ROUTE: Extracted params:', { startDate, endDate })
    } catch (error) {
      console.error('🔥 API ROUTE ERROR: Failed to extract URL parameters:', error)
      return NextResponse.json(
        { error: 'Invalid request parameters' },
        { status: 400 }
      )
    }

    if (!startDate || !endDate) {
      console.log('🔥 API ROUTE: Missing required parameters')
      return NextResponse.json(
        { error: 'startDate and endDate are required' },
        { status: 400 }
      )
    }

    // Validate date parameters
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      console.log('🔥 API ROUTE: Invalid date format provided')
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      )
    }

    console.log('🔥 API ROUTE: Calling getCalendarEvents with dates:', { start, end })
    const events = await getCalendarEvents(start, end)
    console.log('🔥 API ROUTE: Successfully fetched events:', events.length)
    
    return NextResponse.json(events)
  } catch (error) {
    console.error('🔥 API ROUTE ERROR: /api/calendar/events failed:', error)
    return NextResponse.json(
      { error: 'Failed to fetch calendar events' },
      { status: 500 }
    )
  }
} 