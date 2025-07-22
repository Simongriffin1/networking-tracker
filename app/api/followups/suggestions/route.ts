import { NextRequest, NextResponse } from 'next/server'
import { getFollowUpSuggestions } from '@/lib/followupEngine'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('🔥 API ROUTE: /api/followups/suggestions - Fetching follow-up suggestions')
    
    const suggestions = await getFollowUpSuggestions()
    
    console.log(`🔥 API ROUTE: Successfully fetched ${suggestions.length} follow-up suggestions`)
    
    return NextResponse.json(suggestions)
  } catch (error) {
    console.error('🔥 API ROUTE ERROR: /api/followups/suggestions failed:', error)
    return NextResponse.json({ error: 'Failed to fetch follow-up suggestions' }, { status: 500 })
  }
} 