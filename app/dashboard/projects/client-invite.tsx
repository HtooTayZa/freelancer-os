'use client'

import { usePostHog } from 'posthog-js/react'
import { Button } from '@/components/ui/button'
import { Mail } from 'lucide-react'

export function ClientInviteButton() {
  const posthog = usePostHog()

  const handleInvite = () => {
    posthog.capture('client_invited')
    alert('Invite link generated and sent to client!')
  }

  return (
    <Button variant="outline" onClick={handleInvite} className="gap-2">
      <Mail className="h-4 w-4" />
      Invite Client
    </Button>
  )
}