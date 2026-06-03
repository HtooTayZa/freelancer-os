'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createInvoice(formData: FormData) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error('You must be logged in to create an invoice')
  }

  const project_id = formData.get('project_id') as string
  const amount = parseFloat(formData.get('amount') as string)
  const status = formData.get('status') as string
  const issue_date = formData.get('issue_date') as string
  const due_date = formData.get('due_date') as string

  const { error } = await supabase.from('invoices').insert({
    project_id,
    amount,
    status,
    issue_date,
    due_date,
  })

  if (error) {
    console.error('Database Error:', error.message)
    throw new Error('Failed to create invoice')
  }

  revalidatePath('/dashboard/invoices')
}