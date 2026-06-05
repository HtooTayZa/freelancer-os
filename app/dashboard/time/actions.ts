'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createTimeEntry(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const projectId = formData.get('project_id') as string
  const date = formData.get('date') as string
  const description = formData.get('description') as string
  
  // FIX: Read the raw decimal directly without forcing a 0.25 minimum ceiling
  const durationHours = parseFloat(formData.get('duration_hours') as string)

  // Quick validation to make sure it's a real positive number
  if (isNaN(durationHours) || durationHours <= 0) {
    throw new Error('Invalid duration provided')
  }

  const { error } = await supabase
    .from('time_entries')
    .insert([
      {
        user_id: user.id,
        project_id: projectId,
        date,
        duration_hours: durationHours,
        description: description || null
      }
    ])

  if (error) throw new Error(error.message)

  // Refresh the timesheet log layout instantly
  revalidatePath('/dashboard/time')
}