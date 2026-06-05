import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { TimeForm } from './time-form'
import { LiveTimer } from './live-timer'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default async function TimePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: projects } = await supabase.from('projects').select('id, title').eq('user_id', user.id)
  
  const { data: timeEntries } = await supabase
    .from('time_entries')
    .select('*, projects(title)')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">
      {/* Polished Header with Divider */}
      <div className="border-b border-slate-200 pb-6">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Time Tracking</h2>
        <p className="text-slate-500 mt-1">Log your billable hours and active sessions.</p>
      </div>

      {/* Stacked Input Section */}
      <div className="space-y-6 max-w-5xl">
        <LiveTimer projects={projects} />
        
        <Card className="shadow-sm border-slate-200 bg-white">
          <CardHeader className="pb-4 border-b border-slate-100 mb-4 bg-slate-50/30">
            <CardTitle className="text-lg text-slate-900">Manual Entry</CardTitle>
            <CardDescription>Log time from a previous session or external tracker.</CardDescription>
          </CardHeader>
          <CardContent>
            <TimeForm projects={projects} />
          </CardContent>
        </Card>
      </div>

      {/* History Log Table */}
      <div className="pt-4 space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Recent Timesheets</h3>
        
        <Card className="shadow-sm border-slate-200 overflow-hidden bg-white">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-semibold text-slate-900">Date</TableHead>
                <TableHead className="font-semibold text-slate-900">Project</TableHead>
                <TableHead className="font-semibold text-slate-900">Duration</TableHead>
                <TableHead className="font-semibold text-slate-900">Note</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!timeEntries?.length ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center text-slate-500">
                    No time entries logged yet.
                  </TableCell>
                </TableRow>
              ) : (
                timeEntries.map((entry) => (
                  <TableRow key={entry.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-medium text-slate-900">
                      {new Date(entry.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-white text-slate-600">
                        {entry.projects?.title || 'Unknown'}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-slate-700">
                      {entry.duration_hours} hrs
                    </TableCell>
                    <TableCell className="text-slate-600 truncate max-w-[300px]">
                      {entry.description}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  )
}