'use client'

import { useState, useEffect, useRef } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Calendar, Clock, Users } from 'lucide-react'
import { CalendarEvent, getCalendarEvents, createUserEvent, updateUserEvent, deleteUserEvent } from '@/lib/calendarAPI'
import { EventModal } from './EventModal'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export function InteractiveCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false)
  const [view, setView] = useState<'dayGridMonth' | 'timeGridWeek' | 'listWeek'>('dayGridMonth')
  const [currentDate, setCurrentDate] = useState(new Date())
  const calendarRef = useRef<FullCalendar>(null)

  // Load events when component mounts or date changes
  useEffect(() => {
    loadEvents()
  }, [currentDate])

  const loadEvents = async () => {
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    
    const fetchedEvents = await getCalendarEvents(startDate, endDate)
    setEvents(fetchedEvents)
  }

  const handleEventClick = (info: any) => {
    const event = events.find(e => e.id === info.event.id)
    if (event) {
      setSelectedEvent(event)
      setIsModalOpen(true)
    }
  }

  const handleDateSelect = (selectInfo: any) => {
    // Open add event modal with pre-filled date
    setSelectedEvent({
      id: 'new',
      title: '',
      date: selectInfo.start,
      type: 'user_event',
    })
    setIsAddEventModalOpen(true)
  }

  const handleEventDrop = async (dropInfo: any) => {
    const event = events.find(e => e.id === dropInfo.event.id)
    if (event && event.type === 'user_event') {
      const updatedEvent = await updateUserEvent(event.id, {
        date: dropInfo.event.start,
      })
      if (updatedEvent) {
        setEvents(events.map(e => e.id === event.id ? updatedEvent : e))
      }
    }
  }

  const handleEventEdit = async (updatedEvent: CalendarEvent) => {
    if (updatedEvent.type === 'user_event') {
      const result = await updateUserEvent(updatedEvent.id, {
        title: updatedEvent.title,
        date: updatedEvent.date,
        notes: updatedEvent.notes,
        location: updatedEvent.location,
      })
      if (result) {
        setEvents(events.map(e => e.id === updatedEvent.id ? result : e))
      }
    }
    setIsModalOpen(false)
  }

  const handleEventDelete = async (eventId: string) => {
    const success = await deleteUserEvent(eventId)
    if (success) {
      setEvents(events.filter(e => e.id !== eventId))
    }
    setIsModalOpen(false)
  }

  const handleAddEvent = async (eventData: {
    title: string
    date: Date
    notes?: string
    location?: string
  }) => {
    const newEvent = await createUserEvent(eventData)
    if (newEvent) {
      setEvents([...events, newEvent])
    }
    setIsAddEventModalOpen(false)
  }

  const handleSendMessage = (contactId: string) => {
    // This would integrate with your messaging system
    console.log('Send message to contact:', contactId)
    // You could open a compose message modal here
  }

  // Transform events for FullCalendar
  const calendarEvents = events.map(event => ({
    id: event.id,
    title: event.title,
    start: event.date,
    backgroundColor: event.backgroundColor,
    borderColor: event.borderColor,
    extendedProps: {
      type: event.type,
      contactId: event.contactId,
      contactName: event.contactName,
      notes: event.notes,
      importanceScore: event.importanceScore,
      messagePreview: event.messagePreview,
      location: event.location,
    }
  }))

  // Calculate stats
  const today = new Date()
  const todayEvents = events.filter(event => {
    const eventDate = new Date(event.date)
    return eventDate.toDateString() === today.toDateString()
  })

  const suggestedEvents = events.filter(event => event.type === 'suggested_follow_up')
  const userEvents = events.filter(event => event.type === 'user_event')

  return (
    <div className="space-y-6">
      {/* Calendar Header with Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-muted-foreground">
            Manage your meetings and follow-ups
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Stats */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">{userEvents.length} Your Events</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">{suggestedEvents.length} AI Suggestions</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">{todayEvents.length} Today</span>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center space-x-2">
            <Button
              variant={view === 'dayGridMonth' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('dayGridMonth')}
            >
              Month
            </Button>
            <Button
              variant={view === 'timeGridWeek' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('timeGridWeek')}
            >
              Week
            </Button>
            <Button
              variant={view === 'listWeek' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('listWeek')}
            >
              List
            </Button>
          </div>

          {/* Add Event Button */}
          <Button onClick={() => setIsAddEventModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </div>
      </div>

      {/* Calendar */}
      <Card>
        <CardContent className="p-0">
          <div className="h-[600px]">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
              headerToolbar={false}
              initialView={view}
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              weekends={true}
              events={calendarEvents}
              eventClick={handleEventClick}
              select={handleDateSelect}
              eventDrop={handleEventDrop}
              height="100%"
              eventDisplay="block"
              eventTimeFormat={{
                hour: '2-digit',
                minute: '2-digit',
                meridiem: 'short'
              }}
              eventDidMount={(info) => {
                // Add custom styling for suggested events
                if (info.event.extendedProps.type === 'suggested_follow_up') {
                  info.el.classList.add('suggested-event')
                }
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      {events.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">You're all caught up today!</h3>
            <p className="text-muted-foreground mb-4">
              No events scheduled. Add a meeting or check your suggested follow-ups.
            </p>
            <Button onClick={() => setIsAddEventModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Event
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Event Modal */}
      <EventModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEdit={handleEventEdit}
        onDelete={handleEventDelete}
        onSendMessage={handleSendMessage}
      />

      {/* Add Event Modal */}
      {isAddEventModalOpen && (
        <AddEventModal
          isOpen={isAddEventModalOpen}
          onClose={() => setIsAddEventModalOpen(false)}
          onAdd={handleAddEvent}
          initialDate={selectedEvent?.date}
        />
      )}
    </div>
  )
}

// Add Event Modal Component
interface AddEventModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (eventData: { title: string; date: Date; notes?: string; location?: string }) => void
  initialDate?: Date
}

function AddEventModal({ isOpen, onClose, onAdd, initialDate }: AddEventModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    date: initialDate ? new Date(initialDate).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
    notes: '',
    location: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd({
      title: formData.title,
      date: new Date(formData.date),
      notes: formData.notes || undefined,
      location: formData.location || undefined,
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Add New Event</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="date">Date & Time</Label>
              <Input
                id="date"
                type="datetime-local"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Zoom, Coffee shop, etc."
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>

            <div className="flex space-x-2">
              <Button type="submit" className="flex-1">
                Add Event
              </Button>
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 