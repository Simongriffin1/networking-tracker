'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Calendar, TrendingUp } from 'lucide-react'

export function ContactStats() {
  // This would be fetched from the API in a real app
  const stats = [
    {
      title: 'Total Contacts',
      value: '127',
      icon: Users,
      description: 'People in your network'
    },
    {
      title: 'Follow-ups This Week',
      value: '8',
      icon: Calendar,
      description: 'Due for follow-up'
    },
    {
      title: 'Recent Interactions',
      value: '23',
      icon: TrendingUp,
      description: 'This month'
    }
  ]

  return (
    <>
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </>
  )
} 