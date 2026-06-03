import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { createInvoice } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Download } from 'lucide-react'
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

export default async function InvoicesPage({
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

  // 1. Fetch projects for the dropdown
  const { data: projects } = await supabase
    .from('projects')
    .select('id, title')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // 2. Fetch invoices with their associated project titles
  const { data: invoices } = await supabase
    .from('invoices')
    .select(`
      id,
      amount,
      status,
      issue_date,
      due_date,
      projects ( title )
    `)
    .eq('user_id', user.id)
    .order('issue_date', { ascending: false })

  const hasProjects = projects && projects.length > 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Invoices</h2>
        <p className="text-slate-600">Bill your clients and track payments.</p>
      </div>

      {queryError && (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {queryError}
        </p>
      )}

      {/* Creation Form */}
      <Card>
        <CardHeader>
          <CardTitle>Create Invoice</CardTitle>
          <CardDescription>
            {hasProjects 
              ? "Draft a new invoice for an active project." 
              : "⚠️ You must create a Project first before you can bill for it."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createInvoice} className="flex flex-col gap-4 md:flex-row md:items-end flex-wrap">
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
              <Label htmlFor="amount">Amount ($)</Label>
              <Input type="number" step="0.01" min="1" id="amount" name="amount" placeholder="e.g. 1500.00" required disabled={!hasProjects} />
            </div>

            <div className="grid w-full max-w-[150px] items-center gap-1.5">
              <Label htmlFor="status">Status</Label>
              <select 
                name="status" 
                id="status" 
                required
                disabled={!hasProjects}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                defaultValue="draft"
              >
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="paid">Paid</option>
              </select>
            </div>

            <div className="grid w-full max-w-[150px] items-center gap-1.5">
              <Label htmlFor="issue_date">Issue Date</Label>
              <Input type="date" id="issue_date" name="issue_date" required disabled={!hasProjects} defaultValue={new Date().toISOString().split('T')[0]} />
            </div>

            <div className="grid w-full max-w-[150px] items-center gap-1.5">
              <Label htmlFor="due_date">Due Date</Label>
              <Input type="date" id="due_date" name="due_date" required disabled={!hasProjects} />
            </div>

            <Button type="submit" disabled={!hasProjects}>Generate Invoice</Button>
          </form>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Issue Date</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Due Date</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!invoices || invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-slate-500 py-8">
                  No invoices created yet.
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.issue_date}</TableCell>
                  <TableCell className="font-medium">{projectTitle(invoice.projects)}</TableCell>
                  <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={
                      invoice.status === 'paid' ? 'default' : 
                      invoice.status === 'sent' ? 'secondary' : 'outline'
                    }>
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-slate-500">{invoice.due_date}</TableCell>
                  <TableCell>
                    <a href={`/api/invoices/${invoice.id}/pdf`} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4 text-slate-500 hover:text-slate-900" />
                    </Button>
                    </a>
                </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}