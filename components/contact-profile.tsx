'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Edit, Trash2, Save, X } from 'lucide-react'

interface ContactProfileProps {
  contactId: string
}

export function ContactProfile({ contactId }: ContactProfileProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    fullName: 'Sarah Chen',
    email: 'sarah@techcorp.com',
    company: 'TechCorp',
    title: 'CTO',
    phone: '+1-555-0123',
    personalNotes: 'Met at TechCrunch conference. Interested in AI and machine learning.'
  })

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditData({
      fullName: 'Sarah Chen',
      email: 'sarah@techcorp.com',
      company: 'TechCorp',
      title: 'CTO',
      phone: '+1-555-0123',
      personalNotes: 'Met at TechCrunch conference. Interested in AI and machine learning.'
    })
  }

  const handleSave = async () => {
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

      console.log('Contact updated successfully')
      setIsEditing(false)
    } catch (err) {
      console.error('Error updating contact:', err)
      alert('Failed to update contact')
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

      console.log('Contact deleted successfully')
      router.push('/contacts')
    } catch (err) {
      console.error('Error deleting contact:', err)
      alert('Failed to delete contact')
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setEditData({ ...editData, [field]: value })
  }

  console.log('ContactProfile component rendered with contactId:', contactId)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            {isEditing ? (
              <div className="space-y-2">
                <Input
                  value={editData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="text-2xl font-bold"
                />
              </div>
            ) : (
              <CardTitle className="text-2xl">{editData.fullName}</CardTitle>
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
                value={editData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder="Company"
              />
            ) : (
              <p className="text-sm text-muted-foreground">{editData.company}</p>
            )}
          </div>
          <div>
            <p className="text-sm font-medium">Title</p>
            {isEditing ? (
              <Input
                value={editData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Title"
              />
            ) : (
              <p className="text-sm text-muted-foreground">{editData.title}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">Email</p>
            {isEditing ? (
              <Input
                value={editData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                type="email"
                placeholder="Email"
              />
            ) : (
              <p className="text-sm text-muted-foreground">{editData.email}</p>
            )}
          </div>
          <div>
            <p className="text-sm font-medium">Phone</p>
            {isEditing ? (
              <Input
                value={editData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                type="tel"
                placeholder="Phone"
              />
            ) : (
              <p className="text-sm text-muted-foreground">{editData.phone}</p>
            )}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium">Personal Notes</p>
          {isEditing ? (
            <Textarea
              value={editData.personalNotes}
              onChange={(e) => handleInputChange('personalNotes', e.target.value)}
              rows={3}
            />
          ) : (
            <p className="text-sm text-muted-foreground">{editData.personalNotes}</p>
          )}
        </div>

        <p className="text-sm text-muted-foreground">Contact ID: {contactId}</p>
      </CardContent>
    </Card>
  )
} 