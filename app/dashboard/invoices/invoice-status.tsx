'use client'

import { usePostHog } from 'posthog-js/react'
import { updateInvoiceStatus } from './actions'

export function InvoiceStatusDropdown({ invoiceId, currentStatus }: { invoiceId: string, currentStatus: string }) {
  const posthog = usePostHog()

  return (
    <select
      defaultValue={currentStatus}
      onChange={async (e) => {
        const newStatus = e.target.value
        if (newStatus === 'paid' && currentStatus !== 'paid') {
          posthog.capture('invoice_paid')
        }
        await updateInvoiceStatus(invoiceId, newStatus)
      }}
      className="text-xs rounded-full px-2.5 py-1 font-semibold border cursor-pointer bg-white"
    >
      <option value="draft">Draft</option>
      <option value="sent">Sent</option>
      <option value="paid">Paid</option>
    </select>
  )
}