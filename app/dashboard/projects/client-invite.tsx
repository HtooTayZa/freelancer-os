'use client'

import { usePostHog } from 'posthog-js/react'
import { Button } from '@/components/ui/button'
import { Mail, Check } from 'lucide-react'
import { useState } from 'react'

export function ClientInviteButton() {
  const posthog = usePostHog()
  const [isSent, setIsSent] = useState(false)

  const handleInvite = () => {
    // 1. Fire the event (network request will now complete successfully)
    posthog.capture('client_invited')
    
    // 2. Change the UI state instead of freezing the browser with an alert
    setIsSent(true)
    
    // 3. Reset the button after 2 seconds
    setTimeout(() => {
      setIsSent(false)
    }, 2000)
  }

  return (
    <Button 
      variant={isSent ? "default" : "outline"} 
      onClick={handleInvite} 
      className="gap-2 transition-all"
      disabled={isSent}
    >
      {isSent ? <Check className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
      {isSent ? "Invite Sent!" : "Invite Client"}
    </Button>
  )
}