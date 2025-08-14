'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Edit, Trash2, Save, X } from 'lucide-react'

interface Contact {
  id: string
  fullName: string
  preferredName?: string
  email?: string
  phone?: string
  company?: string
  title?: string
  location?: string
  personalNotes?: string
  tags: string[]
}

interface ContactProfileProps {
  contactId: string
}

export function ContactProfile({ contactId }: ContactProfileProps) {
  const router = useRouter()
  const [contact, setContact] = useState<Contact | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<Contact | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch contact data
  useEffect(() => {
    const fetchContact = async () => {
      try {
        console.log('Fetching contact:', contactId)
        const response = await fetch(`/api/contacts/${contactId}`)
        console.log('Response status:', response.status)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch contact: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('API data received:', data)
        
        setContact(data)
        setEditData(data)
        setLoading(false)
        console.log('State updated, loading set to false')
      } catch (err) {
        console.error('Error fetching contact:', err)
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

  console.log('Component render state:', { loading, error, contact, isEditing })

  if (loading) {
    console.log('Rendering loading state')
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
    console.log('Rendering error state:', { error, contact })
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

  console.log('Rendering contact profile:', contact)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
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
          <div>
            <p className="text-sm font-medium">Company</p>
            {isEditing ? (
              <Input
                value={editData?.company || ''}
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder="Company"
              />
            ) : (
              <p className="text-sm text-muted-foreground">{contact.company}</p>
            )}
          </div>
          <div>
            <p className="text-sm font-medium">Title</p>
            {isEditing ? (
              <Input
                value={editData?.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Title"
              />
            ) : (
              <p className="text-sm text-muted-foreground">{contact.title}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">Email</p>
            {isEditing ? (
              <Input
                value={editData?.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                type="email"
                placeholder="Email"
              />
            ) : (
              <p className="text-sm text-muted-foreground">{contact.email}</p>
            )}
          </div>
          <div>
            <p className="text-sm font-medium">Phone</p>
            {isEditing ? (
              <Input
                value={editData?.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                type="tel"
                placeholder="Phone"
              />
            ) : (
              <p className="text-sm text-muted-foreground">{contact.phone}</p>
            )}
          </div>
        </div>

        {contact.personalNotes && (
          <div>
            <p className="text-sm font-medium">Personal Notes</p>
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

        {error && (
          <div className="text-red-600 text-sm">
            <p>Error: {error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 