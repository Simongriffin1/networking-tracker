import { NextRequest, NextResponse } from 'next/server'
import { syncSMSInteraction } from '@/lib/emailSync'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    console.log('🔥 SMS WEBHOOK: Received SMS webhook')
    
    const body = await request.formData()
    const from = body.get('From') as string
    const to = body.get('To') as string
    const bodyText = body.get('Body') as string
    const messageSid = body.get('MessageSid') as string
    
    console.log('🔥 SMS WEBHOOK: Processing message from', from, 'to', to)
    
    if (!from || !bodyText) {
      console.log('🔥 SMS WEBHOOK: Missing required fields')
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    // Sync the SMS interaction
    const success = await syncSMSInteraction(
      from,
      bodyText,
      'inbound',
      new Date()
    )
    
    if (success) {
      console.log('🔥 SMS WEBHOOK: Successfully synced SMS interaction')
    } else {
      console.log('🔥 SMS WEBHOOK: No matching contact found for', from)
    }
    
    // Return TwiML response
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>Message received and logged</Message>
</Response>`
    
    return new NextResponse(twiml, {
      status: 200,
      headers: {
        'Content-Type': 'text/xml'
      }
    })
  } catch (error) {
    console.error('🔥 SMS WEBHOOK ERROR:', error)
    return NextResponse.json({ error: 'Failed to process SMS webhook' }, { status: 500 })
  }
} 