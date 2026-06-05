import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { ProjectForm } from './project-form'
import { StatusDropdown } from './status-dropdown'
import { ProjectFilter } from './project-filter'
import { ClientInviteButton } from './client-invite'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<{ error?: string; q?: string }> }) {
  const { error: queryError, q: searchQuery } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  let query = supabase.from('projects').select('*').eq('user_id', user.id)
  if (searchQuery) query = query.ilike('title', `%${searchQuery}%`)
  
  const { data: projects, error: fetchError } = await query.order('created_at', { ascending: false })

  return (
    <div className="space-y-8">
      {/* Polished Header with Divider */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Projects</h2>
          <p className="text-slate-500 mt-1">Manage your clients and active engagements.</p>
        </div>
        <ClientInviteButton />
      </div>

      {queryError && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-100">{queryError}</p>}
      {fetchError && <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md border border-amber-100">Error: {fetchError.message}</p>}

      {/* UX Upgrade: Form gets its own focused row with a readable max-width */}
      <div className="max-w-2xl">
        <Card className="shadow-sm border-slate-200 bg-white">
          <CardHeader className="pb-4 border-b border-slate-100 mb-4 bg-slate-50/30">
            <CardTitle className="text-lg text-slate-900">New Project</CardTitle>
            <CardDescription>Enter the details below to start tracking a new client engagement.</CardDescription>
          </CardHeader>
          <CardContent>
            <ProjectForm />
          </CardContent>
        </Card>
      </div>

      {/* UX Upgrade: Table gets the full width of the screen to breathe */}
      <div className="pt-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg font-semibold text-slate-900">Active Directory</h3>
          <ProjectFilter />
        </div>
        
        <Card className="shadow-sm border-slate-200 overflow-hidden bg-white">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-semibold text-slate-900">Title</TableHead>
                <TableHead className="font-semibold text-slate-900">Client</TableHead>
                <TableHead className="font-semibold text-slate-900">Status</TableHead>
                <TableHead className="text-right font-semibold text-slate-900">Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!projects?.length ? (
                <TableRow><TableCell colSpan={4} className="py-8 text-center text-slate-500">No projects found.</TableCell></TableRow>
              ) : (
                projects.map((project) => (
                  <TableRow key={project.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-medium text-slate-900">{project.title}</TableCell>
                    <TableCell className="text-slate-600">{project.client_name}</TableCell>
                    <TableCell><StatusDropdown projectId={project.id} currentStatus={project.status} /></TableCell>
                    <TableCell className="text-right text-slate-500 text-sm">{new Date(project.created_at).toLocaleDateString()}</TableCell>
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