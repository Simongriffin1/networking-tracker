import { InteractionForm } from '@/components/interaction-form'

export default function NewInteractionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Log Interaction</h1>
        <p className="text-muted-foreground">
          Record a new interaction with a contact
        </p>
      </div>

      <InteractionForm />
    </div>
  )
} 