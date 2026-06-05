import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { ProjectForm } from './project-form'
import { StatusDropdown } from './status-dropdown'
import { ProjectFilter } from './project-filter'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ClientInviteButton } from './client-invite'

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; q?: string }>
}) {
  // Await the searchParams to safely extract the query and errors
  const { error: queryError, q: searchQuery } = await searchParams
  
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Build the dynamic Supabase query
  let query = supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)

  // Apply the search filter if a user typed in the ProjectFilter search bar
  if (searchQuery) {
    query = query.ilike('title', `%${searchQuery}%`)
  }

  const { data: projects, error: fetchError } = await query.order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
          <p className="text-slate-600">Manage your clients and active work.</p>
        </div>
        {/* NEW: Client Invite Simulation Button */}
        <ClientInviteButton />
      </div>

      {queryError && (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {queryError}
        </p>
      )}

      {fetchError && (
        <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Could not load projects: {fetchError.message}
        </p>
      )}

      {/* NEW: Interactive Search Filter */}
      <ProjectFilter />

      <Card>
        <CardHeader>
          <CardTitle>New Project</CardTitle>
          <CardDescription>
            Create a new project to start tracking time and invoices.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* PostHog Tracked Form */}
          <ProjectForm />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!projects || projects.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="py-8 text-center text-slate-500"
                  >
                    {searchQuery 
                      ? "No projects match your search." 
                      : "No projects found. Create your first one above."}
                  </TableCell>
                </TableRow>
              ) : (
                projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">
                      {project.title}
                    </TableCell>
                    <TableCell>{project.client_name}</TableCell>
                    <TableCell>
                      {/* NEW: PostHog Tracked Status Dropdown */}
                      <StatusDropdown 
                        projectId={project.id} 
                        currentStatus={project.status} 
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      {new Date(project.created_at).toLocaleDateString()}
                    </TableCell>
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