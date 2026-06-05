import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { DashboardViewTracker } from './view-tracker'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Briefcase, Clock, DollarSign, Plus, ArrowRight, FileText, Activity } from 'lucide-react'

export default async function DashboardOverview() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // 1. Fetch High-Level Metrics
  const { count: activeProjects } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('status', 'in_progress')

  const { data: unpaidInvoices } = await supabase
    .from('invoices')
    .select('amount')
    .eq('user_id', user.id)
    .neq('status', 'paid')
  
  const totalOutstanding = unpaidInvoices?.reduce((acc, curr) => acc + curr.amount, 0) || 0

  const { data: timeEntries } = await supabase
    .from('time_entries')
    .select('duration_hours')
    .eq('user_id', user.id)

  const totalHours = timeEntries?.reduce((acc, curr) => acc + curr.duration_hours, 0) || 0

  // 2. Fetch Recent Activity Feeds
  const { data: recentProjects } = await supabase
    .from('projects')
    .select('id, title, client_name, status')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(3)

  const { data: recentInvoices } = await supabase
    .from('invoices')
    .select('id, amount, status, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(3)

  return (
    <div className="space-y-8">
      {/* Invisible PostHog Tracker */}
      <DashboardViewTracker />

      {/* Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h2>
          <p className="text-slate-500 mt-1">Here is the latest snapshot of your freelance business.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/time">
            <Button variant="outline" className="gap-2 bg-white">
              <Clock className="h-4 w-4" />
              Log Time
            </Button>
          </Link>
          <Link href="/dashboard/projects">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </Link>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-white shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-600">Outstanding Revenue</CardTitle>
            <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">${totalOutstanding.toFixed(2)}</div>
            <p className="text-xs text-slate-500 mt-1 font-medium">From draft and sent invoices</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-600">Active Projects</CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Briefcase className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{activeProjects || 0}</div>
            <p className="text-xs text-slate-500 mt-1 font-medium">Work currently in progress</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-600">Total Billable Hours</CardTitle>
            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
              <Clock className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{totalHours.toFixed(1)} <span className="text-lg text-slate-500">hrs</span></div>
            <p className="text-xs text-slate-500 mt-1 font-medium">Lifetime tracked time</p>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Activity Row */}
      <div className="grid gap-6 md:grid-cols-2">
        
        {/* Recent Projects Panel */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-100">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="h-4 w-4 text-slate-500" />
                Recent Projects
              </CardTitle>
              <CardDescription>Your latest client work</CardDescription>
            </div>
            <Link href="/dashboard/projects">
              <Button variant="ghost" size="sm" className="text-xs text-blue-600 hover:text-blue-700">
                View all <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {!recentProjects?.length ? (
                <div className="p-6 text-center text-sm text-slate-500">No projects found.</div>
              ) : (
                recentProjects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                    <div>
                      <p className="font-medium text-slate-900 text-sm">{project.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{project.client_name}</p>
                    </div>
                    <Badge variant={project.status === 'in_progress' ? 'default' : 'secondary'} className="capitalize text-xs">
                      {project.status.replace('_', ' ')}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Invoices Panel */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-100">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4 text-slate-500" />
                Recent Invoices
              </CardTitle>
              <CardDescription>Latest billing activity</CardDescription>
            </div>
            <Link href="/dashboard/invoices">
              <Button variant="ghost" size="sm" className="text-xs text-blue-600 hover:text-blue-700">
                View all <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {!recentInvoices?.length ? (
                <div className="p-6 text-center text-sm text-slate-500">No invoices generated yet.</div>
              ) : (
                recentInvoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                    <div>
                      <p className="font-medium text-slate-900 text-sm">${invoice.amount.toFixed(2)}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {new Date(invoice.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge 
                      variant={invoice.status === 'paid' ? 'default' : invoice.status === 'sent' ? 'secondary' : 'outline'} 
                      className={invoice.status === 'paid' ? 'bg-emerald-500 hover:bg-emerald-600' : 'capitalize text-xs'}
                    >
                      {invoice.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}