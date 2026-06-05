'use client'

import { createInvoice } from './actions'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SubmitButton } from '@/components/submit-button'
import { usePostHog } from 'posthog-js/react'
import { useRef } from 'react'

type Project = {
  id: string
  title: string
}

export function InvoiceForm({ projects, hasProjects }: { projects: Project[] | null, hasProjects: boolean }) {
  const posthog = usePostHog()
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <form 
      ref={formRef}
      action={async (formData) => {
        // 1. Fire the custom PostHog event before the DOM mutations revalidate the layout
        posthog.capture('invoice_generated')
        
        // 2. Run the native server action
        await createInvoice(formData)
        
        // 3. Purge inputs
        formRef.current?.reset()
      }} 
      className="flex flex-col gap-4 md:flex-row md:items-end flex-wrap"
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
        <Label htmlFor="amount">Amount ($)</Label>
        <Input type="number" step="0.01" min="1" id="amount" name="amount" placeholder="e.g. 1500.00" required disabled={!hasProjects} />
      </div>

      <div className="grid w-full max-w-[150px] items-center gap-1.5">
        <Label htmlFor="status">Status</Label>
        <select 
          name="status" 
          id="status" 
          required
          disabled={!hasProjects}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
          defaultValue="draft"
        >
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="paid">Paid</option>
        </select>
      </div>

      <div className="grid w-full max-w-[150px] items-center gap-1.5">
        <Label htmlFor="issue_date">Issue Date</Label>
        <Input type="date" id="issue_date" name="issue_date" required disabled={!hasProjects} defaultValue={new Date().toISOString().split('T')[0]} />
      </div>

      <div className="grid w-full max-w-[150px] items-center gap-1.5">
        <Label htmlFor="due_date">Due Date</Label>
        <Input type="date" id="due_date" name="due_date" required disabled={!hasProjects} />
      </div>

      <SubmitButton disabled={!hasProjects}>Generate Invoice</SubmitButton>
    </form>
  )
}