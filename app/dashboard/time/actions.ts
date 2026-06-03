'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createTimeEntry(formData: FormData) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error('You must be logged in to log time')
  }

  const project_id = formData.get('project_id') as string
  const date = formData.get('date') as string
  const duration_hours = parseFloat(formData.get('duration_hours') as string)
  const description = formData.get('description') as string

  const { error } = await supabase.from('time_entries').insert({
    project_id,
    date,
    duration_hours,
    description,
    // user_id is handled natively by the database default we set!
  })

  if (error) {
    console.error('Database Error:', error.message)
    throw new Error('Failed to log time')
  }

  // Refresh the page to show the new entry
  revalidatePath('/dashboard/time')
}