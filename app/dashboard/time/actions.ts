'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createTimeEntry(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  const project_id = (formData.get('project_id') as string)?.trim()
  const date = (formData.get('date') as string)?.trim()
  const duration_hours = parseFloat(formData.get('duration_hours') as string)
  const description = ((formData.get('description') as string) || '').trim() || null

  if (!project_id || !date || Number.isNaN(duration_hours) || duration_hours <= 0) {
    redirect(
      '/dashboard/time?error=' +
        encodeURIComponent('Please select a project, date, and valid hours.')
    )
  }

  const { error } = await supabase.from('time_entries').insert({
    user_id: user.id,
    project_id,
    date,
    duration_hours,
    description,
  })

  if (error) {
    console.error('Database Error:', error.message)
    redirect('/dashboard/time?error=' + encodeURIComponent(error.message))
  }

  revalidatePath('/dashboard/time')
  redirect('/dashboard/time')
}
