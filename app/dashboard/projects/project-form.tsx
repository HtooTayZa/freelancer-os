'use client'

import { createProject } from './actions'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SubmitButton } from '@/components/submit-button'
import { usePostHog } from 'posthog-js/react'
import { useRef } from 'react'

export function ProjectForm() {
  const posthog = usePostHog()
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        // 1. Fire the custom PostHog event FIRST before the page can refresh
        posthog.capture('project_created')
        
        // 2. Run the server action to save to Supabase
        await createProject(formData)
        
        // 3. Reset the form inputs for better UX
        formRef.current?.reset()
      }}
      className="flex flex-col gap-4 md:flex-row md:items-end"
    >
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="title">Project Title</Label>
        <Input
          type="text"
          id="title"
          name="title"
          placeholder="e.g. Website Redesign"
          required
        />
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="client_name">Client Name</Label>
        <Input
          type="text"
          id="client_name"
          name="client_name"
          placeholder="e.g. Acme Corp"
          required
        />
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          name="status"
          defaultValue="todo"
          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>
      <SubmitButton>Create Project</SubmitButton>
    </form>
  )
}