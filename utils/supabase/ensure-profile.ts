import type { User } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

/** Ensures public.profiles has a row for the auth user (when projects FK references profiles). */
export async function ensureProfile(
  supabase: SupabaseClient,
  user: User
): Promise<{ error: string | null }> {
  const hasEmail = Boolean(user.email?.trim())

  if (!hasEmail) {
    return {
      error:
        'Your account has no email on file. Sign out, sign up again with an email, or add email in Supabase Auth.',
    }
  }

  const row = { id: user.id, email: user.email!.trim() }

  const { error: upsertError } = await supabase
    .from('profiles')
    .upsert(row, { onConflict: 'id' })

  if (!upsertError) {
    return { error: null }
  }

  if (upsertError.code === '23505') {
    return { error: null }
  }

  return { error: upsertError.message }
}
