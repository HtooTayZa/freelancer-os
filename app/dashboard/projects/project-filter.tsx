'use client'

import { usePostHog } from 'posthog-js/react'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useRef } from 'react'

export function ProjectFilter() {
  const posthog = usePostHog()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  
  // We use a ref to keep track of the typing timer
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  const handleSearch = (term: string) => {
    // 1. Update the URL for Next.js to filter the database
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set('q', term)
    } else {
      params.delete('q')
    }
    router.replace(`${pathname}?${params.toString()}`)

    // 2. Clear the previous timer on every new keystroke
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // 3. Set a new timer. If the user stops typing for 1000ms (1 second), fire the event!
    debounceTimerRef.current = setTimeout(() => {
      if (term.length > 0) {
        posthog.capture('filter_used', { 
          filter_type: 'projects',
          search_term: term 
        })
      }
    }, 1000)
  }

  return (
    <div className="relative max-w-sm mb-4">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
      <Input 
        type="search" 
        placeholder="Search projects..." 
        className="pl-9 bg-white"
        defaultValue={searchParams.get('q')?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  )
}