'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createInvoice(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  const project_id = (formData.get('project_id') as string)?.trim()
  const amount = parseFloat(formData.get('amount') as string)
  const status = (formData.get('status') as string)?.trim()
  const issue_date = (formData.get('issue_date') as string)?.trim()
  const due_date = (formData.get('due_date') as string)?.trim()

  if (!project_id || !issue_date || !due_date || Number.isNaN(amount) || amount <= 0) {
    redirect(
      '/dashboard/invoices?error=' +
        encodeURIComponent('Please fill in all invoice fields with valid values.')
    )
  }

  const { error } = await supabase.from('invoices').insert({
    user_id: user.id,
    project_id,
    amount,
    status: status || 'draft',
    issue_date,
    due_date,
  })

  if (error) {
    console.error('Database Error:', error.message)
    redirect(
      '/dashboard/invoices?error=' + encodeURIComponent(error.message)
    )
  }

  revalidatePath('/dashboard/invoices')
  redirect('/dashboard/invoices')
}

export async function updateInvoiceStatus(id: string, status: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  await supabase.from('invoices').update({ status }).eq('id', id).eq('user_id', user.id)
  revalidatePath('/dashboard/invoices')
}
