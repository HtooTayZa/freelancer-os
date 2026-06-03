import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import DashboardAnalytics from './analytics'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  return (
    <>
      <DashboardAnalytics /> 
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
      </div>
      <div className="mt-4">
        <p className="text-slate-600">
          Welcome back, <strong>{user.email}</strong>. Here is what's happening with your freelance business today.
        </p>
      </div>
    </>
  )
}