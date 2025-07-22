import { NextRequest, NextResponse } from 'next/server'
import { generateSuggestedFollowUps } from '@/lib/followupEngine'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('🔥 API ROUTE: /api/followups/generate - Starting follow-up generation')
    
    const suggestions = await generateSuggestedFollowUps()
    
    console.log(`🔥 API ROUTE: Successfully generated ${suggestions.length} follow-up suggestions`)
    
    return NextResponse.json({ 
      success: true, 
      suggestions: suggestions.length,
      message: `Generated ${suggestions.length} follow-up suggestions`
    })
  } catch (error) {
    console.error('🔥 API ROUTE ERROR: /api/followups/generate failed:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to generate follow-up suggestions' 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔥 API ROUTE: /api/followups/generate - POST request for manual generation')
    
    const suggestions = await generateSuggestedFollowUps()
    
    console.log(`🔥 API ROUTE: Successfully generated ${suggestions.length} follow-up suggestions`)
    
    return NextResponse.json({ 
      success: true, 
      suggestions: suggestions.length,
      message: `Generated ${suggestions.length} follow-up suggestions`
    })
  } catch (error) {
    console.error('🔥 API ROUTE ERROR: /api/followups/generate POST failed:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to generate follow-up suggestions' 
    }, { status: 500 })
  }
} 