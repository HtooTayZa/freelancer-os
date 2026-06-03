import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import PDFDocument from 'pdfkit'

export const runtime = 'nodejs'

type ProjectJoin = { title: string; client_name: string }

function getProject(projects: ProjectJoin | ProjectJoin[] | null): ProjectJoin | null {
  if (!projects) return null
  return Array.isArray(projects) ? projects[0] ?? null : projects
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const { data: invoice, error } = await supabase
    .from('invoices')
    .select(`
      *,
      projects ( title, client_name )
    `)
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !invoice) {
    return new NextResponse('Invoice not found', { status: 404 })
  }

  const project = getProject(invoice.projects as ProjectJoin | ProjectJoin[] | null)
  const clientName = project?.client_name ?? 'Unknown client'
  const projectTitle = project?.title ?? 'Unknown project'

  const pdfBytes = await new Promise<Uint8Array>((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 })
    const buffers: Buffer[] = []

    doc.on('data', (chunk: Buffer) => buffers.push(chunk))
    doc.on('end', () => {
      resolve(new Uint8Array(Buffer.concat(buffers)))
    })
    doc.on('error', reject)

    doc.fontSize(20).text('INVOICE', { align: 'right' })
    doc.moveDown()

    doc.fontSize(12).text('Freelancer OS')
    doc.text(`Generated: ${new Date().toLocaleDateString()}`)
    doc.moveDown(2)

    doc.fontSize(14).text('Billed To:')
    doc.fontSize(12).text(`Client: ${clientName}`)
    doc.text(`Project: ${projectTitle}`)
    doc.moveDown(2)

    doc.text(`Issue Date: ${invoice.issue_date}`)
    doc.text(`Due Date: ${invoice.due_date}`)
    doc.text(`Status: ${String(invoice.status).toUpperCase()}`)
    doc.moveDown(2)

    doc
      .fontSize(16)
      .text(`Total Amount: $${Number(invoice.amount).toFixed(2)}`, { underline: true })

    doc.end()
  })

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="invoice-${id.substring(0, 8)}.pdf"`,
    },
  })
}
