'use client'

import { usePostHog } from 'posthog-js/react'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

export function ProjectFilter() {
  const posthog = usePostHog()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set('q', term)
      if (term.length === 3) posthog.capture('filter_used', { filter_type: 'projects' })
    } else {
      params.delete('q')
    }
    // Update the URL without reloading the page
    router.replace(`${pathname}?${params.toString()}`)
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