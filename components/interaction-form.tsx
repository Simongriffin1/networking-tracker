'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { X, Plus } from 'lucide-react'

export function InteractionForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const contactId = searchParams.get('contactId')

  const [formData, setFormData] = useState({
    contactId: contactId || '',
    type: '',
    date: new Date().toISOString().split('T')[0],
    summary: '',
    fullNotes: '',
    nextSteps: '',
    location: '',
    sentiment: '',
    sharedBy: ''
  })

  const [selectedContact, setSelectedContact] = useState<any>(null)
  const [availableContacts, setAvailableContacts] = useState([
    { id: '1', fullName: 'Sarah Chen', company: 'TechCorp' },
    { id: '2', fullName: 'Mike Johnson', company: 'StartupXYZ' },
    { id: '3', fullName: 'Emily Rodriguez', company: 'VC Partners' }
  ])

  const interactionTypes = [
    'email', 'call', 'coffee', 'lunch', 'dinner', 'conference', 
    'LinkedIn DM', 'text', 'video call', 'meeting', 'other'
  ]

  const sentimentOptions = [
    'Very positive', 'Positive', 'Neutral', 'Negative', 'Very negative'
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would submit to your API
    console.log('Submitting interaction:', formData)
    router.push(`/contacts/${formData.contactId}`)
  }

  useEffect(() => {
    if (contactId) {
      const contact = availableContacts.find(c => c.id === contactId)
      setSelectedContact(contact)
    }
  }, [contactId, availableContacts])

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Interaction Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="contact">Contact *</Label>
            <select
              id="contact"
              value={formData.contactId}
              onChange={(e) => {
                handleInputChange('contactId', e.target.value)
                const contact = availableContacts.find(c => c.id === e.target.value)
                setSelectedContact(contact)
              }}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Select a contact</option>
              {availableContacts.map((contact) => (
                <option key={contact.id} value={contact.id}>
                  {contact.fullName} - {contact.company}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Interaction Type *</Label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="">Select type</option>
                {interactionTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Zoom, San Francisco, etc."
              />
            </div>
            <div>
              <Label htmlFor="sentiment">Sentiment</Label>
              <select
                id="sentiment"
                value={formData.sentiment}
                onChange={(e) => handleInputChange('sentiment', e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select sentiment</option>
                {sentimentOptions.map((sentiment) => (
                  <option key={sentiment} value={sentiment}>
                    {sentiment}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="summary">Summary *</Label>
            <Input
              id="summary"
              value={formData.summary}
              onChange={(e) => handleInputChange('summary', e.target.value)}
              placeholder="Brief summary of what you discussed"
              required
            />
          </div>

          <div>
            <Label htmlFor="fullNotes">Full Notes</Label>
            <Textarea
              id="fullNotes"
              value={formData.fullNotes}
              onChange={(e) => handleInputChange('fullNotes', e.target.value)}
              placeholder="Detailed notes about the conversation, key points, etc."
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="nextSteps">Next Steps</Label>
            <Textarea
              id="nextSteps"
              value={formData.nextSteps}
              onChange={(e) => handleInputChange('nextSteps', e.target.value)}
              placeholder="Any follow-up actions, TODOs, or next steps"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="sharedBy">Introduced by</Label>
            <Input
              id="sharedBy"
              value={formData.sharedBy}
              onChange={(e) => handleInputChange('sharedBy', e.target.value)}
              placeholder="If this person introduced you to someone else"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit">
          Log Interaction
        </Button>
      </div>
    </form>
  )
} 