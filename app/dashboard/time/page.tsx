import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { TimeForm } from './time-form'
import { LiveTimer } from './live-timer'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { projectTitle } from '@/lib/project-join'
export default async function TimeTrackingPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error: queryError } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // 1. Fetch the user's projects for the dropdown
  const { data: projects } = await supabase
    .from('projects')
    .select('id, title')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // 2. Fetch the user's time entries (joining the project title so we can display it)
  const { data: timeEntries } = await supabase
    .from('time_entries')
    .select(`
      id,
      date,
      duration_hours,
      description,
      projects ( title )
    `)
    .eq('user_id', user.id)
    .order('date', { ascending: false })

  const hasProjects = projects && projects.length > 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Time Tracking</h2>
        <p className="text-slate-600">Log billable hours against your active projects.</p>
      </div>
      
      <LiveTimer projects={projects} />
      {queryError && (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {queryError}
        </p>
      )}
      
      {/* Creation Form */}
      <Card>
        <CardHeader>
          <CardTitle>Log Time</CardTitle>
          <CardDescription>
            {hasProjects 
              ? "Select a project and enter the hours worked." 
              : "⚠️ You must create a Project first before you can log time."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TimeForm projects={projects} hasProjects={hasProjects} />
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Hours</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!timeEntries || timeEntries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-slate-500 py-8">
                  No time logged yet. Get to work!
                </TableCell>
              </TableRow>
            ) : (
              timeEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{entry.date}</TableCell>
                  <TableCell>{projectTitle(entry.projects)}</TableCell>
                  <TableCell className="text-slate-500">{entry.description || '-'}</TableCell>
                  <TableCell className="text-right font-semibold">{entry.duration_hours}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}