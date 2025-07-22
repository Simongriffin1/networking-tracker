import { NextRequest, NextResponse } from 'next/server'
import { markFollowUpAsSent } from '@/lib/followupEngine'

export const dynamic = 'force-dynamic'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🔥 API ROUTE: /api/followups/suggestions/[id] - Marking as sent:', params.id)
    
    const success = await markFollowUpAsSent(params.id)
    
    if (success) {
      console.log('🔥 API ROUTE: Successfully marked follow-up as sent')
      return NextResponse.json({ success: true, message: 'Follow-up marked as sent' })
    } else {
      console.log('🔥 API ROUTE: Failed to mark follow-up as sent')
      return NextResponse.json({ success: false, error: 'Failed to mark as sent' }, { status: 500 })
    }
  } catch (error) {
    console.error('🔥 API ROUTE ERROR: /api/followups/suggestions/[id] DELETE failed:', error)
    return NextResponse.json({ success: false, error: 'Failed to mark follow-up as sent' }, { status: 500 })
  }
} 