'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, X } from 'lucide-react'
import { useState } from 'react'

export function ContactSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([])

  const availableTags = ['Engineering', 'AI', 'Mentor', 'Startup', 'VC', 'Strategy', 'Investment', 'Biotech']
  const availableCompanies = ['TechCorp', 'StartupXYZ', 'VC Partners', 'Google', 'Microsoft', 'Apple']

  const addTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag))
  }

  const addCompany = (company: string) => {
    if (!selectedCompanies.includes(company)) {
      setSelectedCompanies([...selectedCompanies, company])
    }
  }

  const removeCompany = (company: string) => {
    setSelectedCompanies(selectedCompanies.filter(c => c !== company))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search contacts by name, company, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-3">
        <div>
          <h4 className="text-sm font-medium mb-2">Filter by Tags</h4>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => selectedTags.includes(tag) ? removeTag(tag) : addTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Filter by Company</h4>
          <div className="flex flex-wrap gap-2">
            {availableCompanies.map((company) => (
              <Badge
                key={company}
                variant={selectedCompanies.includes(company) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => selectedCompanies.includes(company) ? removeCompany(company) : addCompany(company)}
              >
                {company}
              </Badge>
            ))}
          </div>
        </div>

        {(selectedTags.length > 0 || selectedCompanies.length > 0) && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {selectedTags.map((tag) => (
              <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                <span>{tag}</span>
                <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
              </Badge>
            ))}
            {selectedCompanies.map((company) => (
              <Badge key={company} variant="secondary" className="flex items-center space-x-1">
                <span>{company}</span>
                <X className="h-3 w-3 cursor-pointer" onClick={() => removeCompany(company)} />
              </Badge>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedTags([])
                setSelectedCompanies([])
              }}
            >
              Clear all
            </Button>
          </div>
        )}
      </div>
    </div>
  )
} 