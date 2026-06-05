'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { ensureProfile } from '@/utils/supabase/ensure-profile'

export async function login(formData: FormData) {
  const supabase = await createClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    // Exposing the exact Supabase error message
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  if (data.user) {
    const { error: profileError } = await ensureProfile(supabase, data.user)
    if (profileError) {
      redirect(
        `/login?error=${encodeURIComponent(`Profile setup failed: ${profileError}`)}`
      )
    }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    // Exposing the exact Supabase error message
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  if (data.user) {
    const { error: profileError } = await ensureProfile(supabase, data.user)
    if (profileError) {
      redirect(
        `/login?error=${encodeURIComponent(`Profile setup failed: ${profileError}`)}`
      )
    }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signOutUser() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  
  // Redirect back to the login page after clearing the session
  redirect('/login')
}