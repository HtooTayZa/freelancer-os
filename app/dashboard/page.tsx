import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import DashboardAnalytics from './analytics' // <-- Import the tracker

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  return (
    <div className="p-8">
      {/* Mount the invisible tracker */}
      <DashboardAnalytics /> 
      
      <h1 className="text-3xl font-bold">Welcome to your Dashboard</h1>
      <p className="mt-4 text-slate-600">
        You are successfully logged in as: <strong>{user.email}</strong>
      </p>
    </div>
  )
}