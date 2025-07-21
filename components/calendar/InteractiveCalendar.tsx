'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Plus, Clock, Users, TrendingUp } from 'lucide-react'
import { EventModal } from './EventModal'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export interface CalendarEvent {
  id: string
  title: string
  date: Date
  contactId?: string
  contactName?: string
  notes?: string
  type: 'user_event' | 'suggested_follow_up'
  location?: string
  importanceScore?: number
  messagePreview?: string
  backgroundColor?: string
  borderColor?: string
}

export function InteractiveCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const calendarRef = useRef<FullCalendar>(null)

  const loadEvents = useCallback(async () => {
    try {
      setIsLoading(true)
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
      const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

      const response = await fetch(`/api/calendar/events?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`)
      if (response.ok) {
        const fetchedEvents = await response.json()
        setEvents(fetchedEvents)
      } else {
        console.error('Failed to fetch events')
        setEvents([])
      }
    } catch (error) {
      console.error('Error loading events:', error)
      setEvents([])
    } finally {
      setIsLoading(false)
    }
  }, [currentDate])

  // Load events when component mounts or date changes
  useEffect(() => {
    loadEvents()
  }, [loadEvents])

  const handleEventClick = (info: any) => {
    const event = events.find(e => e.id === info.event.id)
    if (event) {
      setSelectedEvent(event)
    }
  }

  const handleDateClick = (info: any) => {
    setSelectedDate(info.date)
    setShowAddModal(true)
  }

  const handleEventDrop = async (info: any) => {
    const event = events.find(e => e.id === info.event.id)
    if (event && event.type === 'user_event') {
      try {
        const response = await fetch(`/api/calendar/events/user`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: event.id.replace('user_', ''),
            date: info.event.start.toISOString(),
          }),
        })
        if (response.ok) {
          loadEvents() // Reload events
        }
      } catch (error) {
        console.error('Error updating event:', error)
      }
    }
  }

  const handleAddEvent = async (eventData: any) => {
    try {
      const response = await fetch('/api/calendar/events/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: eventData.title,
          date: eventData.date.toISOString(),
          notes: eventData.notes,
          type: eventData.type,
          location: eventData.location,
        }),
      })
      if (response.ok) {
        loadEvents() // Reload events
        setShowAddModal(false)
      }
    } catch (error) {
      console.error('Error adding event:', error)
    }
  }

  const handleUpdateEvent = async (eventData: any) => {
    try {
      const response = await fetch('/api/calendar/events/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: eventData.id.replace('user_', ''),
          title: eventData.title,
          date: eventData.date.toISOString(),
          notes: eventData.notes,
          type: eventData.type,
          location: eventData.location,
        }),
      })
      if (response.ok) {
        loadEvents() // Reload events
        setSelectedEvent(null)
      }
    } catch (error) {
      console.error('Error updating event:', error)
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const response = await fetch('/api/calendar/events/user', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: eventId.replace('user_', ''),
        }),
      })
      if (response.ok) {
        loadEvents() // Reload events
        setSelectedEvent(null)
      }
    } catch (error) {
      console.error('Error deleting event:', error)
    }
  }

  const calendarEvents = events.map(event => ({
    id: event.id,
    title: event.title,
    date: event.date,
    backgroundColor: event.backgroundColor,
    borderColor: event.borderColor,
    extendedProps: {
      type: event.type,
      contactId: event.contactId,
      contactName: event.contactName,
      notes: event.notes,
      location: event.location,
      importanceScore: event.importanceScore,
      messagePreview: event.messagePreview,
    },
  }))

  const stats = {
    totalEvents: events.length,
    userEvents: events.filter(e => e.type === 'user_event').length,
    suggestedEvents: events.filter(e => e.type === 'suggested_follow_up').length,
    highPriority: events.filter(e => e.type === 'suggested_follow_up' && (e.importanceScore || 0) >= 75).length,
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center space-x-2 p-4">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Total Events</p>
              <p className="text-2xl font-bold">{stats.totalEvents}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center space-x-2 p-4">
            <Plus className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Your Events</p>
              <p className="text-2xl font-bold">{stats.userEvents}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center space-x-2 p-4">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">AI Suggestions</p>
              <p className="text-2xl font-bold">{stats.suggestedEvents}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center space-x-2 p-4">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">High Priority</p>
              <p className="text-2xl font-bold">{stats.highPriority}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Calendar</span>
            <Button onClick={() => setShowAddModal(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[600px]">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
              }}
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              weekends={true}
              events={calendarEvents}
              eventClick={handleEventClick}
              dateClick={handleDateClick}
              eventDrop={handleEventDrop}
              height="100%"
            />
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      {events.length === 0 && !isLoading && (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">You&apos;re all caught up today!</h3>
            <p className="text-muted-foreground mb-4">
              No events scheduled. Add a meeting or check your suggested follow-ups.
            </p>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Event
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Event Modal */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onEdit={handleUpdateEvent}
          onDelete={handleDeleteEvent}
        />
      )}

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Add New Event</h2>
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              handleAddEvent({
                title: formData.get('title') as string,
                date: selectedDate || new Date(),
                notes: formData.get('notes') as string,
                type: formData.get('type') as string,
                location: formData.get('location') as string,
              })
            }}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" required />
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input 
                    id="date" 
                    name="date" 
                    type="datetime-local" 
                    defaultValue={selectedDate?.toISOString().slice(0, 16)}
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <select id="type" name="type" className="w-full p-2 border rounded">
                    <option value="meeting">Meeting</option>
                    <option value="follow_up">Follow Up</option>
                    <option value="reminder">Reminder</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="location">Location (Optional)</Label>
                  <Input id="location" name="location" />
                </div>
                <div>
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea id="notes" name="notes" />
                </div>
                <div className="flex space-x-2">
                  <Button type="submit" className="flex-1">Add Event</Button>
                  <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 