'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { 
  Calendar, 
  MapPin, 
  User, 
  MessageSquare, 
  Edit, 
  Trash2, 
  X,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { CalendarEvent } from '@/lib/calendarAPI'

interface EventModalProps {
  event: CalendarEvent | null
  isOpen: boolean
  onClose: () => void
  onEdit: (event: CalendarEvent) => void
  onDelete: (eventId: string) => void
  onSendMessage?: (contactId: string) => void
}

export function EventModal({ 
  event, 
  isOpen, 
  onClose, 
  onEdit, 
  onDelete, 
  onSendMessage 
}: EventModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    title: event?.title || '',
    notes: event?.notes || '',
    location: event?.location || '',
    date: event?.date ? new Date(event.date).toISOString().slice(0, 16) : '',
  })

  if (!isOpen || !event) return null

  const isSuggestedFollowUp = event.type === 'suggested_follow_up'
  const isHighImportance = event.importanceScore && event.importanceScore >= 75

  const handleSave = () => {
    if (event.type === 'user_event') {
      onEdit({
        ...event,
        title: editData.title,
        notes: editData.notes,
        location: editData.location,
        date: new Date(editData.date),
      })
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditData({
      title: event.title,
      notes: event.notes || '',
      location: event.location || '',
      date: event.date ? new Date(event.date).toISOString().slice(0, 16) : '',
    })
    setIsEditing(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center space-x-2">
            {isSuggestedFollowUp ? (
              <AlertTriangle className="h-5 w-5 text-orange-500" />
            ) : (
              <Calendar className="h-5 w-5 text-blue-500" />
            )}
            <CardTitle className="text-lg">
              {isEditing ? 'Edit Event' : 'Event Details'}
            </CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          {isEditing ? (
            // Edit Form
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="date">Date & Time</Label>
                <Input
                  id="date"
                  type="datetime-local"
                  value={editData.date}
                  onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={editData.location}
                  onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                  placeholder="Zoom, Coffee shop, etc."
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={editData.notes}
                  onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleSave} className="flex-1">
                  Save Changes
                </Button>
                <Button variant="outline" onClick={handleCancel} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            // View Mode
            <div className="space-y-4">
              {/* Event Type Badge */}
              <div className="flex items-center space-x-2">
                <Badge 
                  variant={isSuggestedFollowUp ? "secondary" : "default"}
                  className={isSuggestedFollowUp ? "bg-orange-100 text-orange-800" : ""}
                >
                  {isSuggestedFollowUp ? 'AI Suggestion' : 'Your Event'}
                </Badge>
                {isSuggestedFollowUp && isHighImportance && (
                  <Badge variant="destructive">
                    High Priority
                  </Badge>
                )}
              </div>

              {/* Title */}
              <div>
                <h3 className="font-semibold text-lg">{event.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(event.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              {/* Contact Info */}
              {event.contactName && (
                <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{event.contactName}</p>
                    <p className="text-sm text-muted-foreground">Contact</p>
                  </div>
                </div>
              )}

              {/* Location */}
              {event.location && (
                <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{event.location}</p>
                    <p className="text-sm text-muted-foreground">Location</p>
                  </div>
                </div>
              )}

              {/* Notes */}
              {event.notes && (
                <div>
                  <Label className="text-sm font-medium">Notes</Label>
                  <p className="text-sm text-muted-foreground mt-1">{event.notes}</p>
                </div>
              )}

              {/* Importance Score for Suggested Events */}
              {isSuggestedFollowUp && event.importanceScore && (
                <div>
                  <Label className="text-sm font-medium">Importance Score</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          event.importanceScore >= 75 ? 'bg-red-500' : 'bg-orange-500'
                        }`}
                        style={{ width: `${event.importanceScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{event.importanceScore}%</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-4">
                {event.type === 'user_event' && (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditing(true)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => onDelete(event.id)}
                      className="flex-1 text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </>
                )}
                
                {event.contactId && onSendMessage && (
                  <Button 
                    onClick={() => onSendMessage(event.contactId!)}
                    className="flex-1"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                )}
              </div>

              {/* Suggested Event Actions */}
              {isSuggestedFollowUp && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-3">
                    This is an AI-generated follow-up suggestion based on your contact history.
                  </p>
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => {
                        // Convert suggested event to user event
                        onEdit({
                          ...event,
                          type: 'user_event',
                          title: event.title,
                          notes: event.notes,
                        })
                        onClose()
                      }}
                      className="flex-1"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Schedule This
                    </Button>
                    <Button variant="outline" onClick={onClose} className="flex-1">
                      Maybe Later
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 