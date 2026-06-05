'use client'

import { usePostHog } from 'posthog-js/react'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { signOutUser } from '@/app/login/actions'

export function SignOutButton() {
  const posthog = usePostHog()

  const handleSignOut = async () => {
    // 1. Capture the analytics event
    posthog.capture('user_logged_out')
    posthog.reset() // Optional: Clears the PostHog user session from local storage
    
    // 2. Trigger the server-side cookie deletion and redirect
    await signOutUser()
  }

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={handleSignOut} 
      className="gap-2 text-slate-500 hover:text-slate-900"
    >
      <LogOut className="h-4 w-4" />
      <span>Log out</span>
    </Button>
  )
}