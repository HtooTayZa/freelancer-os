import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import PDFDocument from 'pdfkit'

// Force Next.js to use the Node environment
export const runtime = 'nodejs'
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> } // 1. Tell TypeScript it is a Promise
) {
  const params = await context.params // 2. Await the Promise to unwrap the ID

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  // Fetch the exact invoice and its connected project
  const { data: invoice, error } = await supabase
    .from('invoices')
    .select(`
      *,
      projects ( title, client_name )
    `)
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (error || !invoice) {
    return new NextResponse('Invoice not found', { status: 404 })
  }

  // Generate the PDF in memory
  const pdfBytes = await new Promise<Uint8Array>((resolve, reject) => {
    // Set standard A4 paper size with clean margins
    const doc = new PDFDocument({ size: 'A4', margin: 50 })
    const buffers: Uint8Array[] = []
    
    doc.on('data', (chunk: Uint8Array) => buffers.push(chunk))
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers)
      resolve(new Uint8Array(pdfData)) 
    })
    doc.on('error', reject)

    // --- DESIGN VARIABLES ---
    const brandColor = '#0f172a' // Slate 900
    const textColor = '#334155'  // Slate 700
    const lightGray = '#e2e8f0'  // Slate 200
    const startY = 50

    // --- HEADER ---
    // Left side: Brand
    doc.fillColor(brandColor).font('Helvetica-Bold').fontSize(24).text('FREELANCER OS', 50, startY)
    doc.fillColor(textColor).font('Helvetica').fontSize(10).text('Professional Services', 50, startY + 28)

    // Right side: INVOICE title
    doc.fillColor(brandColor).font('Helvetica-Bold').fontSize(28).text('INVOICE', 350, startY, { align: 'right' })
    doc.fillColor(textColor).font('Helvetica').fontSize(10).text(`INV-${invoice.id.substring(0, 8).toUpperCase()}`, 350, startY + 32, { align: 'right' })

    // Divider Line
    doc.moveTo(50, 110).lineTo(545, 110).lineWidth(1).strokeColor(lightGray).stroke()

    // --- CLIENT & INVOICE DETAILS ---
    const detailsY = 140

    // Billed To
    doc.fillColor(brandColor).font('Helvetica-Bold').fontSize(12).text('Billed To:', 50, detailsY)
    doc.fillColor(textColor).font('Helvetica').fontSize(11).text(invoice.projects.client_name, 50, detailsY + 20)
    doc.text(`Project: ${invoice.projects.title}`, 50, detailsY + 35)

    // Meta Details
    doc.fillColor(brandColor).font('Helvetica-Bold').fontSize(12).text('Invoice Details:', 350, detailsY)
    
    doc.fillColor(textColor).font('Helvetica-Bold').fontSize(10).text('Issue Date:', 350, detailsY + 20)
    doc.font('Helvetica').text(invoice.issue_date, 450, detailsY + 20)

    doc.font('Helvetica-Bold').text('Due Date:', 350, detailsY + 35)
    doc.font('Helvetica').text(invoice.due_date, 450, detailsY + 35)

    doc.font('Helvetica-Bold').text('Status:', 350, detailsY + 50)
    doc.font('Helvetica').text(invoice.status.toUpperCase(), 450, detailsY + 50)

    // --- LINE ITEMS TABLE (Stylized) ---
    const tableY = 250
    
    // Table Header Background
    doc.rect(50, tableY, 495, 30).fillColor(brandColor).fill()
    
    // Table Header Text
    doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(10)
    doc.text('DESCRIPTION', 60, tableY + 10)
    doc.text('AMOUNT', 400, tableY + 10, { width: 135, align: 'right' })

    // Table Row
    const rowY = tableY + 45
    doc.fillColor(textColor).font('Helvetica').fontSize(11)
    doc.text(`Professional services for ${invoice.projects.title}`, 60, rowY)
    doc.text(`$${Number(invoice.amount).toFixed(2)}`, 400, rowY, { width: 135, align: 'right' })

    // Bottom Table Border
    doc.moveTo(50, rowY + 25).lineTo(545, rowY + 25).lineWidth(1).strokeColor(lightGray).stroke()

    // --- TOTAL AMOUNT ---
    const totalY = rowY + 45
    doc.rect(330, totalY - 10, 215, 40).fillColor('#f8fafc').fill() // Light background for total
    
    doc.fillColor(brandColor).font('Helvetica-Bold').fontSize(14).text('Total Due:', 340, totalY)
    doc.fillColor('#16a34a').font('Helvetica-Bold').fontSize(14).text(`$${Number(invoice.amount).toFixed(2)}`, 400, totalY, { width: 135, align: 'right' }) // Green total

    // --- FOOTER ---
    doc.fillColor(textColor).font('Helvetica-Oblique').fontSize(10).text('Thank you for your business.', 50, 700, { align: 'center' })

    doc.end()
  })

  // Return the file to the browser
  return new Response(pdfBytes as BodyInit, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="invoice-${invoice.id.substring(0, 8)}.pdf"`,
    },
  })
}