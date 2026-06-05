'use client'

import { createTimeEntry } from './actions'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SubmitButton } from '@/components/submit-button'
import { usePostHog } from 'posthog-js/react'
import { useRef } from 'react'

// Define the shape of the projects prop so TypeScript is happy
type Project = {
  id: string
  title: string
}

export function TimeForm({ projects, hasProjects }: { projects: Project[] | null, hasProjects: boolean | null }) {
  const posthog = usePostHog()
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <form 
      ref={formRef}
      action={async (formData) => {
        // 1. Fire the custom PostHog event FIRST before the page can refresh
        posthog.capture('manual_time_logged')
        
        // 2. Run the server action to save to Supabase
        await createTimeEntry(formData)
        
        // 3. Reset the form inputs for better UX
        formRef.current?.reset()
      }} 
      className="flex flex-col gap-4 md:flex-row md:items-end"
    >
      <div className="grid w-full max-w-xs items-center gap-1.5">
        <Label htmlFor="project_id">Project</Label>
        <select 
          name="project_id" 
          id="project_id" 
          required
          disabled={!hasProjects}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Select a project...</option>
          {projects?.map((p) => (
            <option key={p.id} value={p.id}>{p.title}</option>
          ))}
        </select>
      </div>
      
      <div className="grid w-full max-w-[150px] items-center gap-1.5">
        <Label htmlFor="date">Date</Label>
        <Input type="date" id="date" name="date" required disabled={!hasProjects} defaultValue={new Date().toISOString().split('T')[0]} />
      </div>

      <div className="grid w-full max-w-[120px] items-center gap-1.5">
        <Label htmlFor="duration_hours">Hours</Label>
        <Input type="number" step="0.25" min="0.25" id="duration_hours" name="duration_hours" placeholder="e.g. 2.5" required disabled={!hasProjects} />
      </div>

      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="description">Description (Optional)</Label>
        <Input type="text" id="description" name="description" placeholder="What did you work on?" disabled={!hasProjects} />
      </div>

      <SubmitButton disabled={!hasProjects}>Log Time</SubmitButton>
    </form>
  )
}