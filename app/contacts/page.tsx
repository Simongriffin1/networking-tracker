import { ContactList } from '@/components/contact-list'
import { ContactSearch } from '@/components/contact-search'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default function ContactsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contacts</h1>
          <p className="text-muted-foreground">
            Manage your professional network
          </p>
        </div>
        <Button asChild>
          <Link href="/contacts/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Contact
          </Link>
        </Button>
      </div>

      <ContactSearch />
      <ContactList />
    </div>
  )
} 