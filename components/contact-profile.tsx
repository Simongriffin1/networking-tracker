'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Calendar, 
  ExternalLink,
  Edit,
  Trash2
} from 'lucide-react'
import Link from 'next/link'

interface ContactProfileProps {
  contactId: string
}

export function ContactProfile({ contactId }: ContactProfileProps) {
  // This would be fetched from the API in a real app
  const contact = {
    id: contactId,
    fullName: 'Sarah Chen',
    preferredName: 'Sarah',
    email: 'sarah.chen@techcorp.com',
    phone: '+1 (555) 123-4567',
    linkedInUrl: 'https://linkedin.com/in/sarahchen',
    twitterHandle: '@sarahchen',
    company: 'TechCorp',
    title: 'Senior Engineer',
    location: 'San Francisco, CA',
    relationship: 'Mentor',
    contactSource: 'UChicago Alumni Event',
    tags: ['Engineering', 'AI', 'Mentor'],
    personalNotes: 'Sarah is incredibly passionate about AI and machine learning. She loves discussing new technologies and is always willing to help others learn. We have a great rapport and she&apos;s been a valuable mentor in my career.',
    professionalNotes: 'Sarah has extensive experience in AI/ML at major tech companies. She&apos;s interested in early-stage AI startups and could be a great advisor or investor. She mentioned wanting to get more involved in the startup ecosystem.',
    meetingCadence: 'Every 3 months',
    lastContacted: '2024-01-14',
    nextFollowUp: '2024-04-14',
    birthday: '1985-03-15',
    favoriteTopics: ['AI', 'Machine Learning', 'Startups', 'Career Development']
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg">
                  {getInitials(contact.fullName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{contact.fullName}</CardTitle>
                {contact.preferredName && contact.preferredName !== contact.fullName && (
                  <p className="text-muted-foreground">({contact.preferredName})</p>
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm" className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Building className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">{contact.company}</p>
                <p className="text-sm text-muted-foreground">{contact.title}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{contact.location}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contact.email && (
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                  {contact.email}
                </a>
              </div>
            )}
            {contact.phone && (
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a href={`tel:${contact.phone}`} className="text-blue-600 hover:underline">
                  {contact.phone}
                </a>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {contact.linkedInUrl && (
              <Button variant="outline" size="sm" asChild>
                <Link href={contact.linkedInUrl} target="_blank">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  LinkedIn
                </Link>
              </Button>
            )}
            {contact.twitterHandle && (
              <Button variant="outline" size="sm" asChild>
                <Link href={`https://twitter.com/${contact.twitterHandle.replace('@', '')}`} target="_blank">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Twitter
                </Link>
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Tags</p>
            <div className="flex flex-wrap gap-2">
              {contact.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Favorite Topics</p>
            <div className="flex flex-wrap gap-2">
              {contact.favoriteTopics.map((topic) => (
                <Badge key={topic} variant="outline">
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {contact.personalNotes && (
            <div>
              <h4 className="font-medium mb-2">Personal Notes</h4>
              <p className="text-sm text-muted-foreground">{contact.personalNotes}</p>
            </div>
          )}
          {contact.professionalNotes && (
            <div>
              <h4 className="font-medium mb-2">Professional Notes</h4>
              <p className="text-sm text-muted-foreground">{contact.professionalNotes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Follow-up Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Meeting Cadence</p>
              <p className="text-sm text-muted-foreground">{contact.meetingCadence}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Next Follow-up</p>
              <p className="text-sm text-muted-foreground">{contact.nextFollowUp}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Last Contacted</p>
              <p className="text-sm text-muted-foreground">{contact.lastContacted}</p>
            </div>
            {contact.birthday && (
              <div>
                <p className="text-sm font-medium">Birthday</p>
                <p className="text-sm text-muted-foreground">{contact.birthday}</p>
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-medium">How we met</p>
            <p className="text-sm text-muted-foreground">{contact.contactSource}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 