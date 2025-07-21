'use client'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

interface AddInteractionButtonProps {
  contactId: string
}

export function AddInteractionButton({ contactId }: AddInteractionButtonProps) {
  return (
    <Button asChild>
      <Link href={`/interactions/new?contactId=${contactId}`}>
        <Plus className="h-4 w-4 mr-2" />
        Log Interaction
      </Link>
    </Button>
  )
} 