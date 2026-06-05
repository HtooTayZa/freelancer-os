import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { DownloadButton } from './download-button'
import { InvoiceForm } from './invoice-form'

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

  // 1. Fetch projects for the dropdown selections
  const { data: projects } = await supabase
    .from('projects')
    .select('id, title')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // 2. Fetch invoices with structural project joins
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

      {/* Modernized Creation Form Workspace */}
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
          <InvoiceForm projects={projects} hasProjects={!!hasProjects} />
        </CardContent>
      </Card>

      {/* Relational Data Workspace */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Issue Date</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Due Date</TableHead>
              <TableHead className="w-[140px] text-center">Actions</TableHead>
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
                  <TableCell className="text-center">
                    {/* Replaced generic link with custom PostHog tracked download action node */}
                    <DownloadButton invoiceId={invoice.id} />
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