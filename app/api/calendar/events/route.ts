import { NextRequest, NextResponse } from 'next/server'
import { getCalendarEvents } from '@/lib/calendarAPI'

export async function GET(request: NextRequest) {
  try {
    // Handle build-time data collection
    if (process.env.NODE_ENV === 'production' && !request?.url) {
      return NextResponse.json({ events: [] })
    }

    // Handle cases where request is not available
    if (!request || !request.url) {
      return NextResponse.json({ events: [] })
    }

    const { searchParams } = new URL(request.url)
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