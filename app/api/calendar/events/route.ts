import { NextRequest, NextResponse } from 'next/server'
import { getCalendarEvents } from '@/lib/calendarAPI'

// Force dynamic rendering to prevent static generation
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Handle build-time data collection - return empty array to prevent static generation
    if (!request || !request.url || process.env.NODE_ENV === 'production' && typeof request.url === 'undefined') {
      return NextResponse.json([])
    }

    // Safely access URL parameters
    let searchParams: URLSearchParams
    try {
      const url = new URL(request.url)
      searchParams = url.searchParams
    } catch (error) {
      console.error('Invalid request URL:', error)
      return NextResponse.json(
        { error: 'Invalid request URL' },
        { status: 400 }
      )
    }

    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'startDate and endDate are required' },
        { status: 400 }
      )
    }

    // Validate date parameters
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      )
    }

    const events = await getCalendarEvents(start, end)
    return NextResponse.json(events)
  } catch (error) {
    console.error('Error fetching calendar events:', error)
    return NextResponse.json(
      { error: 'Failed to fetch calendar events' },
      { status: 500 }
    )
  }
} 