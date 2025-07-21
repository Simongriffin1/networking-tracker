'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { X, Plus } from 'lucide-react'

export function ContactForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: '',
    preferredName: '',
    email: '',
    phone: '',
    linkedInUrl: '',
    twitterHandle: '',
    company: '',
    title: '',
    location: '',
    relationship: '',
    contactSource: '',
    tags: [] as string[],
    personalNotes: '',
    professionalNotes: '',
    meetingCadence: '',
    nextFollowUp: '',
    birthday: '',
    favoriteTopics: [] as string[]
  })
  const [newTag, setNewTag] = useState('')
  const [newTopic, setNewTopic] = useState('')

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }))
  }

  const addTopic = () => {
    if (newTopic.trim() && !formData.favoriteTopics.includes(newTopic.trim())) {
      setFormData(prev => ({
        ...prev,
        favoriteTopics: [...prev.favoriteTopics, newTopic.trim()]
      }))
      setNewTopic('')
    }
  }

  const removeTopic = (topic: string) => {
    setFormData(prev => ({
      ...prev,
      favoriteTopics: prev.favoriteTopics.filter(t => t !== topic)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would submit to your API
    console.log('Submitting contact:', formData)
    router.push('/contacts')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="preferredName">Preferred Name</Label>
              <Input
                id="preferredName"
                value={formData.preferredName}
                onChange={(e) => handleInputChange('preferredName', e.target.value)}
                placeholder="What they like to be called"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="linkedInUrl">LinkedIn URL</Label>
              <Input
                id="linkedInUrl"
                type="url"
                value={formData.linkedInUrl}
                onChange={(e) => handleInputChange('linkedInUrl', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="twitterHandle">Twitter Handle</Label>
              <Input
                id="twitterHandle"
                value={formData.twitterHandle}
                onChange={(e) => handleInputChange('twitterHandle', e.target.value)}
                placeholder="@username"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Professional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
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
                placeholder="City, State/Country"
              />
            </div>
            <div>
              <Label htmlFor="relationship">Relationship</Label>
              <Input
                id="relationship"
                value={formData.relationship}
                onChange={(e) => handleInputChange('relationship', e.target.value)}
                placeholder="Mentor, Peer, Recruiter, etc."
              />
            </div>
          </div>

          <div>
            <Label htmlFor="contactSource">How you met</Label>
            <Input
              id="contactSource"
              value={formData.contactSource}
              onChange={(e) => handleInputChange('contactSource', e.target.value)}
              placeholder="UChicago event, Referred by Jane, etc."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tags & Topics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Tags</Label>
            <div className="flex items-center space-x-2 mt-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                  <span>{tag}</span>
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label>Favorite Topics</Label>
            <div className="flex items-center space-x-2 mt-2">
              <Input
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                placeholder="Add a topic they love"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTopic())}
              />
              <Button type="button" onClick={addTopic} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.favoriteTopics.map((topic) => (
                <Badge key={topic} variant="outline" className="flex items-center space-x-1">
                  <span>{topic}</span>
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeTopic(topic)} />
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notes & Follow-up</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="personalNotes">Personal Notes</Label>
            <Textarea
              id="personalNotes"
              value={formData.personalNotes}
              onChange={(e) => handleInputChange('personalNotes', e.target.value)}
              placeholder="Who they are, your rapport, personal details..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="professionalNotes">Professional Notes</Label>
            <Textarea
              id="professionalNotes"
              value={formData.professionalNotes}
              onChange={(e) => handleInputChange('professionalNotes', e.target.value)}
              placeholder="Career insights, goals, opportunities..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="meetingCadence">Meeting Cadence</Label>
              <Input
                id="meetingCadence"
                value={formData.meetingCadence}
                onChange={(e) => handleInputChange('meetingCadence', e.target.value)}
                placeholder="Every 3 months, Weekly, etc."
              />
            </div>
            <div>
              <Label htmlFor="nextFollowUp">Next Follow-up</Label>
              <Input
                id="nextFollowUp"
                type="date"
                value={formData.nextFollowUp}
                onChange={(e) => handleInputChange('nextFollowUp', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="birthday">Birthday</Label>
            <Input
              id="birthday"
              type="date"
              value={formData.birthday}
              onChange={(e) => handleInputChange('birthday', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit">
          Save Contact
        </Button>
      </div>
    </form>
  )
} 