'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { DollarSign, Calendar, TrendingUp, Users } from 'lucide-react'

export function DealPipeline() {
  // This would be fetched from the API in a real CRM
  const deals = [
    {
      id: '1',
      title: 'AI Platform Implementation',
      contact: 'Sarah Chen',
      company: 'TechCorp',
      value: 50000,
      stage: 'Proposal',
      probability: 75,
      expectedClose: '2024-02-15',
      lastActivity: '2024-01-14'
    },
    {
      id: '2',
      title: 'Consulting Services',
      contact: 'Mike Johnson',
      company: 'StartupXYZ',
      value: 25000,
      stage: 'Negotiation',
      probability: 90,
      expectedClose: '2024-01-30',
      lastActivity: '2024-01-13'
    },
    {
      id: '3',
      title: 'Training Program',
      contact: 'Emily Rodriguez',
      company: 'VC Partners',
      value: 15000,
      stage: 'Qualification',
      probability: 50,
      expectedClose: '2024-03-01',
      lastActivity: '2024-01-12'
    }
  ]

  const pipelineStages = [
    { name: 'Prospecting', deals: deals.filter(d => d.stage === 'Prospecting') },
    { name: 'Qualification', deals: deals.filter(d => d.stage === 'Qualification') },
    { name: 'Proposal', deals: deals.filter(d => d.stage === 'Proposal') },
    { name: 'Negotiation', deals: deals.filter(d => d.stage === 'Negotiation') },
    { name: 'Closed Won', deals: deals.filter(d => d.stage === 'Closed Won') },
    { name: 'Closed Lost', deals: deals.filter(d => d.stage === 'Closed Lost') }
  ]

  const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0)
  const weightedValue = deals.reduce((sum, deal) => sum + (deal.value * deal.probability / 100), 0)

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Prospecting': return 'bg-gray-100 text-gray-800'
      case 'Qualification': return 'bg-blue-100 text-blue-800'
      case 'Proposal': return 'bg-yellow-100 text-yellow-800'
      case 'Negotiation': return 'bg-orange-100 text-orange-800'
      case 'Closed Won': return 'bg-green-100 text-green-800'
      case 'Closed Lost': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Pipeline Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pipeline</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {deals.length} active deals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weighted Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${weightedValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Probability-adjusted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Deal Size</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalValue / deals.length).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Per deal
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Stages */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
        {pipelineStages.map((stage) => (
          <Card key={stage.name}>
            <CardHeader>
              <CardTitle className="text-sm">{stage.name}</CardTitle>
              <div className="text-2xl font-bold">{stage.deals.length}</div>
            </CardHeader>
            <CardContent className="space-y-3">
              {stage.deals.map((deal) => (
                <div key={deal.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{deal.title}</h4>
                    <Badge className={getStageColor(deal.stage)}>
                      {deal.stage}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span>{deal.contact}</span>
                      <span className="font-medium">${deal.value.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Progress value={deal.probability} className="h-2" />
                      <span className="text-xs text-muted-foreground">
                        {deal.probability}%
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{deal.expectedClose}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 