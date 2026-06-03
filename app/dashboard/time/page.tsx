import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { createTimeEntry } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function TimeTrackingPage() {
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
          <form action={createTimeEntry} className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="grid w-full max-w-xs items-center gap-1.5">
              <Label htmlFor="project_id">Project</Label>
              <select 
                name="project_id" 
                id="project_id" 
                required
                disabled={!hasProjects}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select a project...</option>
                {projects?.map((p) => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>
            
            <div className="grid w-full max-w-[150px] items-center gap-1.5">
              <Label htmlFor="date">Date</Label>
              <Input type="date" id="date" name="date" required disabled={!hasProjects} defaultValue={new Date().toISOString().split('T')[0]} />
            </div>

            <div className="grid w-full max-w-[120px] items-center gap-1.5">
              <Label htmlFor="duration_hours">Hours</Label>
              <Input type="number" step="0.25" min="0.25" id="duration_hours" name="duration_hours" placeholder="e.g. 2.5" required disabled={!hasProjects} />
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input type="text" id="description" name="description" placeholder="What did you work on?" disabled={!hasProjects} />
            </div>

            <Button type="submit" disabled={!hasProjects}>Log Time</Button>
          </form>
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
                  {/* We access the joined project title like this: */}
                  <TableCell>{entry.projects?.title || 'Unknown Project'}</TableCell>
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