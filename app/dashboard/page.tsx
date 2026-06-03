import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import DashboardAnalytics from './analytics'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Briefcase, Clock, DollarSign, Receipt } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  // 1. Fetch all required data in parallel
  const [
    { data: projects },
    { data: timeEntries },
    { data: invoices }
  ] = await Promise.all([
    supabase.from('projects').select('status').eq('user_id', user.id),
    supabase.from('time_entries').select('duration_hours').eq('user_id', user.id),
    supabase.from('invoices').select('id, amount, status, due_date, projects(title)').eq('user_id', user.id).order('issue_date', { ascending: false })
  ])

  // 2. Aggregate Metrics
  const activeProjects = projects?.filter(p => p.status !== 'completed').length || 0
  const totalHours = timeEntries?.reduce((sum, entry) => sum + Number(entry.duration_hours), 0) || 0
  
  const totalPaid = invoices?.filter(i => i.status === 'paid').reduce((sum, i) => sum + Number(i.amount), 0) || 0
  const totalOutstanding = invoices?.filter(i => i.status !== 'paid').reduce((sum, i) => sum + Number(i.amount), 0) || 0
  
  const recentInvoices = invoices?.slice(0, 5) || [] // Get top 5 most recent

  return (
    <div className="space-y-8">
      <DashboardAnalytics /> 
      
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
        <p className="text-slate-600 mt-2">
          Welcome back, <strong>{user.email}</strong>. Here is your business at a glance.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPaid.toFixed(2)}</div>
            <p className="text-xs text-slate-500">Collected to date</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            <Receipt className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalOutstanding.toFixed(2)}</div>
            <p className="text-xs text-slate-500">Awaiting payment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hours Logged</CardTitle>
            <Clock className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHours.toFixed(1)}</div>
            <p className="text-xs text-slate-500">Total billable hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Briefcase className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjects}</div>
            <p className="text-xs text-slate-500">Currently in progress</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Table */}
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Recent Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Due Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentInvoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-slate-500 py-4">
                    No invoices generated yet.
                  </TableCell>
                </TableRow>
              ) : (
                recentInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.projects?.title || 'Unknown'}</TableCell>
                    <TableCell>${Number(invoice.amount).toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={invoice.status === 'paid' ? 'default' : invoice.status === 'sent' ? 'secondary' : 'outline'}>
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-slate-500">{invoice.due_date}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}