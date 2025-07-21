import { ContactForm } from '@/components/contact-form'

export default function NewContactPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add New Contact</h1>
        <p className="text-muted-foreground">
          Add a new person to your professional network
        </p>
      </div>

      <ContactForm />
    </div>
  )
} 