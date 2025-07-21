'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, Phone, Mail, Coffee } from 'lucide-react'
import Link from 'next/link'

export function RecentInteractions() {
  // This would be fetched from the API in a real app
  const interactions = [
    {
      id: '1',
      contactName: 'Sarah Chen',
      type: 'email',
      summary: 'Discussed project timeline and deliverables',
      date: '2024-01-14',
      sentiment: 'positive'
    },
    {
      id: '2',
      contactName: 'Mike Johnson',
      type: 'call',
      summary: 'Coffee meeting to discuss potential collaboration',
      date: '2024-01-13',
      sentiment: 'positive'
    },
    {
      id: '3',
      contactName: 'Emily Rodriguez',
      type: 'coffee',
      summary: 'Pitch presentation and Q&A session',
      date: '2024-01-12',
      sentiment: 'neutral'
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
          <span>Recent Interactions</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {interactions.map((interaction) => (
            <div
              key={interaction.id}
              className="flex items-start space-x-3 rounded-lg border p-3"
            >
              <div className="flex-shrink-0">
                {getIcon(interaction.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{interaction.contactName}</h4>
                  <Badge 
                    variant="outline" 
                    className={getSentimentColor(interaction.sentiment)}
                  >
                    {interaction.sentiment}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {interaction.summary}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {interaction.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 