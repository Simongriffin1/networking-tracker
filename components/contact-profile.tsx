'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
  Trash2,
  Save,
  X
} from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface Contact {
  id: string
  fullName: string
  preferredName?: string
  email?: string
  phone?: string
  linkedInUrl?: string
  twitterHandle?: string
  company?: string
  title?: string
  location?: string
  relationship?: string
  contactSource?: string
  tags: string[]
  personalNotes?: string
  professionalNotes?: string
  meetingCadence?: string
  lastContacted?: string
  nextFollowUp?: string
  birthday?: string
  favoriteTopics: string[]
}

interface ContactProfileProps {
  contactId: string
}

export function ContactProfile({ contactId }: ContactProfileProps) {
  const router = useRouter()
  const [contact, setContact] = useState<Contact | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [editData, setEditData] = useState<Contact | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch contact data
  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await fetch(`/api/contacts/${contactId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch contact')
        }
        const data = await response.json()
        setContact(data)
        setEditData(data)
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch contact')
        setLoading(false)
      }
    }

    fetchContact()
  }, [contactId])

  const handleEdit = () => {
    setIsEditing(true)
    setEditData(contact)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditData(contact)
  }

  const handleSave = async () => {
    if (!editData) return

    try {
      const response = await fetch(`/api/contacts/${contactId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      })

      if (!response.ok) {
        throw new Error('Failed to update contact')
      }

      const updatedContact = await response.json()
      setContact(updatedContact)
      setIsEditing(false)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update contact')
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this contact? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/contacts/${contactId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete contact')
      }

      router.push('/contacts')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete contact')
    }
  }

  const handleInputChange = (field: keyof Contact, value: any) => {
    if (editData) {
      setEditData({ ...editData, [field]: value })
    }
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading contact...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !contact) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p>Error: {error || 'Contact not found'}</p>
            <Button onClick={() => router.back()} className="mt-2">
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    )
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
                {isEditing ? (
                  <div className="space-y-2">
                    <Input
                      value={editData?.fullName || ''}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="text-2xl font-bold"
                    />
                    {editData?.preferredName && (
                      <Input
                        value={editData.preferredName}
                        onChange={(e) => handleInputChange('preferredName', e.target.value)}
                        placeholder="Preferred name"
                      />
                    )}
                  </div>
                ) : (
                  <>
                    <CardTitle className="text-2xl">{contact.fullName}</CardTitle>
                    {contact.preferredName && contact.preferredName !== contact.fullName && (
                      <p className="text-muted-foreground">({contact.preferredName})</p>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <Button onClick={handleSave} size="sm">
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button onClick={handleCancelEdit} variant="outline" size="sm">
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={handleEdit} variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button onClick={handleDelete} variant="outline" size="sm" className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Building className="h-4 w-4 text-muted-foreground" />
              <div>
                {isEditing ? (
                  <div className="space-y-1">
                    <Input
                      value={editData?.company || ''}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      placeholder="Company"
                    />
                    <Input
                      value={editData?.title || ''}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Title"
                    />
                  </div>
                ) : (
                  <>
                    <p className="font-medium">{contact.company}</p>
                    <p className="text-sm text-muted-foreground">{contact.title}</p>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              {isEditing ? (
                <Input
                  value={editData?.location || ''}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Location"
                />
              ) : (
                <span>{contact.location}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contact.email && (
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                {isEditing ? (
                  <Input
                    value={editData?.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    type="email"
                    placeholder="Email"
                  />
                ) : (
                  <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                    {contact.email}
                  </a>
                )}
              </div>
            )}
            {contact.phone && (
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                {isEditing ? (
                  <Input
                    value={editData?.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    type="tel"
                    placeholder="Phone"
                  />
                ) : (
                  <a href={`tel:${contact.phone}`} className="text-blue-600 hover:underline">
                    {contact.phone}
                  </a>
                )}
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
              {isEditing ? (
                <Textarea
                  value={editData?.personalNotes || ''}
                  onChange={(e) => handleInputChange('personalNotes', e.target.value)}
                  rows={3}
                />
              ) : (
                <p className="text-sm text-muted-foreground">{contact.personalNotes}</p>
              )}
            </div>
          )}
          {contact.professionalNotes && (
            <div>
              <h4 className="font-medium mb-2">Professional Notes</h4>
              {isEditing ? (
                <Textarea
                  value={editData?.professionalNotes || ''}
                  onChange={(e) => handleInputChange('professionalNotes', e.target.value)}
                  rows={3}
                />
              ) : (
                <p className="text-sm text-muted-foreground">{contact.professionalNotes}</p>
              )}
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
              {isEditing ? (
                <Input
                  value={editData?.meetingCadence || ''}
                  onChange={(e) => handleInputChange('meetingCadence', e.target.value)}
                  placeholder="Every 3 months"
                />
              ) : (
                <p className="text-sm text-muted-foreground">{contact.meetingCadence}</p>
              )}
            </div>
            <div>
              <p className="text-sm font-medium">Next Follow-up</p>
              {isEditing ? (
                <Input
                  value={editData?.nextFollowUp || ''}
                  onChange={(e) => handleInputChange('nextFollowUp', e.target.value)}
                  type="date"
                />
              ) : (
                <p className="text-sm text-muted-foreground">{contact.nextFollowUp}</p>
              )}
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
                {isEditing ? (
                  <Input
                    value={editData?.birthday || ''}
                    onChange={(e) => handleInputChange('birthday', e.target.value)}
                    type="date"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">{contact.birthday}</p>
                )}
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-medium">How we met</p>
            {isEditing ? (
              <Input
                value={editData?.contactSource || ''}
                onChange={(e) => handleInputChange('contactSource', e.target.value)}
                placeholder="How you met"
              />
            ) : (
              <p className="text-sm text-muted-foreground">{contact.contactSource}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 