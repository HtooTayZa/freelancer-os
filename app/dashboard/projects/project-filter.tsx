'use client'

import { usePostHog } from 'posthog-js/react'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

export function ProjectFilter() {
  const posthog = usePostHog()

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only fire the event if they type more than 3 characters so we don't spam PostHog
    if (e.target.value.length === 3) {
      posthog.capture('filter_used', { filter_type: 'projects' })
    }
  }

  return (
    <div className="relative max-w-sm">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
      <Input 
        type="search" 
        placeholder="Search projects..." 
        className="pl-9"
        onChange={handleSearch}
      />
    </div>
  )
}