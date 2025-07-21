'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MessageSquare, Phone, Mail, Coffee, Calendar, MapPin } from 'lucide-react'
import Link from 'next/link'

interface InteractionTimelineProps {
  contactId: string
}

export function InteractionTimeline({ contactId }: InteractionTimelineProps) {
  // This would be fetched from the API in a real app
  const interactions = [
    {
      id: '1',
      type: 'email',
      date: '2024-01-14',
      summary: 'Followed up on project discussion and shared updated timeline',
      fullNotes: 'Sarah was very responsive and excited about the project direction. She mentioned some concerns about the timeline but overall positive feedback. She suggested we schedule a call next week to dive deeper into the technical details.',
      nextSteps: 'Schedule technical deep-dive call for next week',
      location: 'Email',
      sentiment: 'positive',
      sharedBy: null
    },
    {
      id: '2',
      type: 'call',
      date: '2024-01-07',
      summary: 'Initial project discussion and scope definition',
      fullNotes: 'Great conversation about the AI project. Sarah has deep expertise in the space and provided valuable insights. She\'s interested in potentially advising or investing in the project.',
      nextSteps: 'Send project proposal and follow up in 2 weeks',
      location: 'Zoom',
      sentiment: 'positive',
      sharedBy: null
    },
    {
      id: '3',
      type: 'coffee',
      date: '2023-12-15',
      summary: 'First meeting to discuss career opportunities and mentorship',
      fullNotes: 'Met at Blue Bottle Coffee in SF. Sarah was incredibly generous with her time and advice. We discussed my career goals and she offered to introduce me to some people in her network.',
      nextSteps: 'Follow up with thank you email and stay in touch',
      location: 'San Francisco',
      sentiment: 'positive',
      sharedBy: 'Mike Johnson'
    }
  ]

  const getIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4" />
      case 'call':
        return <Phone className="h-4 w-4" />
      case 'coffee':
        return <Coffee className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800'
      case 'negative':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageSquare className="h-5 w-5" />
          <span>Interaction History</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {interactions.map((interaction, index) => (
            <div key={interaction.id} className="relative">
              {/* Timeline line */}
              {index < interactions.length - 1 && (
                <div className="absolute left-6 top-8 w-0.5 h-16 bg-border" />
              )}
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                    {getIcon(interaction.type)}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{interaction.summary}</h4>
                      <Badge 
                        variant="outline" 
                        className={getSentimentColor(interaction.sentiment)}
                      >
                        {interaction.sentiment}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{interaction.date}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 mb-2 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{interaction.location}</span>
                    </div>
                    {interaction.sharedBy && (
                      <div className="flex items-center space-x-1">
                        <span>Introduced by {interaction.sharedBy}</span>
                      </div>
                    )}
                  </div>
                  
                  {interaction.fullNotes && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {interaction.fullNotes}
                    </p>
                  )}
                  
                  {interaction.nextSteps && (
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-sm font-medium mb-1">Next Steps</p>
                      <p className="text-sm text-muted-foreground">
                        {interaction.nextSteps}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 