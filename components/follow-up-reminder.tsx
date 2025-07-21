'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Mail, Phone } from 'lucide-react'
import Link from 'next/link'

export function FollowUpReminder() {
  // This would be fetched from the API in a real app
  const followUps = [
    {
      id: '1',
      name: 'Sarah Chen',
      company: 'TechCorp',
      title: 'Senior Engineer',
      dueDate: '2024-01-15',
      type: 'email',
      notes: 'Follow up on the project discussion'
    },
    {
      id: '2',
      name: 'Mike Johnson',
      company: 'StartupXYZ',
      title: 'Founder',
      dueDate: '2024-01-16',
      type: 'call',
      notes: 'Schedule coffee meeting'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      company: 'VC Partners',
      title: 'Partner',
      dueDate: '2024-01-17',
      type: 'email',
      notes: 'Send pitch deck'
    }
  ]

  const getIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4" />
      case 'call':
        return <Phone className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span>Follow-ups This Week</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {followUps.map((followUp) => (
            <div
              key={followUp.id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium">{followUp.name}</h4>
                  <Badge variant="secondary">{followUp.company}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {followUp.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {followUp.notes}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {getIcon(followUp.type)}
                <span className="text-sm text-muted-foreground">
                  {followUp.dueDate}
                </span>
                <Button size="sm" asChild>
                  <Link href={`/contacts/${followUp.id}`}>
                    View
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 