'use client'

import { usePostHog } from 'posthog-js/react'
import { useEffect } from 'react'

export function DashboardViewTracker() {
  const posthog = usePostHog()

  useEffect(() => {
    // Fires once when the component mounts on the dashboard
    posthog.capture('dashboard_viewed')
  }, [posthog])

  return null // This is an invisible tracking component
}