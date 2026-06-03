'use server'

import { createClient } from '@/utils/supabase/server'
import { ensureProfile } from '@/utils/supabase/ensure-profile'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createProject(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  const { error: profileError } = await ensureProfile(supabase, user)
  if (profileError) {
    redirect(
      '/dashboard/projects?error=' +
        encodeURIComponent(`Could not sync your profile: ${profileError}`)
    )
  }

  const title = (formData.get('title') as string)?.trim()
  const client_name = (formData.get('client_name') as string)?.trim()
  const status = (formData.get('status') as string)?.trim() || 'planning'

  if (!title || !client_name) {
    redirect(
      '/dashboard/projects?error=' +
        encodeURIComponent('Project title and client name are required')
    )
  }

  const { error } = await supabase.from('projects').insert({
    user_id: user.id,
    title,
    client_name,
    status,
  })

  if (error) {
    console.error('Database Error:', error.message)
    const hint =
      error.message.includes('projects_user_id_fkey')
        ? ' Run supabase/migrations/003_fix_projects_user_fk.sql in the Supabase SQL Editor.'
        : ''
    redirect(
      '/dashboard/projects?error=' +
        encodeURIComponent(error.message + hint)
    )
  }

  revalidatePath('/dashboard/projects')
  redirect('/dashboard/projects')
}
