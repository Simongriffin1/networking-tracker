'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, Send, RefreshCw, User, Calendar } from 'lucide-react'
import { FollowUpSuggestion } from '@/lib/followupEngine'

export function FollowUpSuggestions() {
  const [suggestions, setSuggestions] = useState<FollowUpSuggestion[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  const fetchSuggestions = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/followups/suggestions')
      if (response.ok) {
        const data = await response.json()
        setSuggestions(data)
      } else {
        console.error('Failed to fetch suggestions')
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateSuggestions = async () => {
    try {
      setGenerating(true)
      const response = await fetch('/api/followups/generate', {
        method: 'POST'
      })
      if (response.ok) {
        await fetchSuggestions()
      } else {
        console.error('Failed to generate suggestions')
      }
    } catch (error) {
      console.error('Error generating suggestions:', error)
    } finally {
      setGenerating(false)
    }
  }

  const markAsSent = async (suggestionId: string) => {
    try {
      const response = await fetch(`/api/followups/suggestions/${suggestionId}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        setSuggestions(suggestions.filter(s => s.contactId !== suggestionId))
      }
    } catch (error) {
      console.error('Error marking as sent:', error)
    }
  }

  useEffect(() => {
    fetchSuggestions()
  }, [])

  const getScoreColor = (score: number) => {
    if (score >= 40) return 'bg-red-500'
    if (score >= 25) return 'bg-orange-500'
    if (score >= 15) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            AI Follow-Up Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading suggestions...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            AI Follow-Up Suggestions
          </CardTitle>
          <Button 
            onClick={generateSuggestions} 
            disabled={generating}
            size="sm"
            variant="outline"
          >
            {generating ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Generate New
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {suggestions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No follow-up suggestions</p>
            <p className="text-sm">Click "Generate New" to create AI-powered follow-up suggestions</p>
          </div>
        ) : (
          <div className="space-y-4">
            {suggestions.map((suggestion) => (
              <div key={suggestion.contactId} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{suggestion.contactName}</span>
                    <Badge className={getScoreColor(suggestion.score)}>
                      Score: {suggestion.score}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {new Date(suggestion.suggestedDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    <strong>Reason:</strong> {suggestion.reason}
                  </p>
                  
                  {suggestion.contactTags && suggestion.contactTags.length > 0 && (
                    <div className="flex gap-1">
                      {suggestion.contactTags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-muted/50 rounded-md p-3">
                  <p className="text-sm font-medium mb-2">AI-Generated Message:</p>
                  <p className="text-sm leading-relaxed">{suggestion.aiMessageDraft}</p>
                </div>

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => markAsSent(suggestion.contactId)}
                    className="flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Mark as Sent
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      // Copy message to clipboard
                      navigator.clipboard.writeText(suggestion.aiMessageDraft)
                    }}
                  >
                    Copy Message
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 