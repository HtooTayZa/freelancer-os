'use client'

import { Download } from 'lucide-react'
import { usePostHog } from 'posthog-js/react'

interface DownloadButtonProps {
  invoiceId: string
}

export function DownloadButton({ invoiceId }: DownloadButtonProps) {
  const posthog = usePostHog()

  const handleDownload = () => {
    // 1. Fire the custom PostHog event before triggering the download thread
    posthog.capture('pdf_exported', { invoice_id: invoiceId })

    // 2. Open your Node.js PDFKit API route in a new tab to download the binary stream
    window.open(`/api/invoices/${invoiceId}/pdf`, '_blank')
  }

  return (
    <button
      onClick={handleDownload}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
    >
      <Download className="h-4 w-4" />
      <span>Download PDF</span>
    </button>
  )
}