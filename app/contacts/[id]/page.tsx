import { ContactProfile } from '@/components/contact-profile'
import { InteractionTimeline } from '@/components/interaction-timeline'
import { AddInteractionButton } from '@/components/add-interaction-button'

interface ContactPageProps {
  params: {
    id: string
  }
}

export default function ContactPage({ params }: ContactPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contact Profile</h1>
          <p className="text-muted-foreground">
            View and manage contact details and interactions
          </p>
        </div>
        <AddInteractionButton contactId={params.id} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ContactProfile contactId={params.id} />
        <InteractionTimeline contactId={params.id} />
      </div>
    </div>
  )
} 