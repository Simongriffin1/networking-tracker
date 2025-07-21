'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Mail, Phone, MapPin, Building } from 'lucide-react'
import Link from 'next/link'

export function ContactList() {
  // This would be fetched from the API in a real app
  const contacts = [
    {
      id: '1',
      fullName: 'Sarah Chen',
      preferredName: 'Sarah',
      email: 'sarah.chen@techcorp.com',
      phone: '+1 (555) 123-4567',
      company: 'TechCorp',
      title: 'Senior Engineer',
      location: 'San Francisco, CA',
      tags: ['Engineering', 'AI', 'Mentor'],
      lastContacted: '2024-01-14',
      nextFollowUp: '2024-01-21'
    },
    {
      id: '2',
      fullName: 'Mike Johnson',
      preferredName: 'Mike',
      email: 'mike@startupxyz.com',
      phone: '+1 (555) 987-6543',
      company: 'StartupXYZ',
      title: 'Founder & CEO',
      location: 'New York, NY',
      tags: ['Startup', 'VC', 'Strategy'],
      lastContacted: '2024-01-13',
      nextFollowUp: '2024-01-20'
    },
    {
      id: '3',
      fullName: 'Emily Rodriguez',
      preferredName: 'Emily',
      email: 'emily@vcpartners.com',
      phone: '+1 (555) 456-7890',
      company: 'VC Partners',
      title: 'Partner',
      location: 'Boston, MA',
      tags: ['VC', 'Investment', 'Biotech'],
      lastContacted: '2024-01-12',
      nextFollowUp: '2024-01-19'
    }
  ]

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Contacts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center space-x-4 rounded-lg border p-4 hover:bg-muted/50 transition-colors"
            >
              <Avatar className="h-12 w-12">
                <AvatarFallback>
                  {getInitials(contact.fullName)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold">{contact.fullName}</h3>
                  {contact.preferredName && contact.preferredName !== contact.fullName && (
                    <span className="text-sm text-muted-foreground">
                      ({contact.preferredName})
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-4 mt-1">
                  <div className="flex items-center space-x-1">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{contact.company}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{contact.location}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mt-2">
                  {contact.email && (
                    <div className="flex items-center space-x-1">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {contact.email}
                      </span>
                    </div>
                  )}
                  {contact.phone && (
                    <div className="flex items-center space-x-1">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {contact.phone}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 mt-2">
                  {contact.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col items-end space-y-2">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Last contacted</p>
                  <p className="text-sm font-medium">{contact.lastContacted}</p>
                </div>
                <Button size="sm" asChild>
                  <Link href={`/contacts/${contact.id}`}>
                    View Profile
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