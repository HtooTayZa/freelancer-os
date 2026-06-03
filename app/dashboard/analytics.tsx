'use client'

import { usePostHog } from 'posthog-js/react'
import { useEffect } from 'react'

export default function DashboardAnalytics() {
  const posthog = usePostHog()

  useEffect(() => {
    // Fire the custom event the moment this component mounts
    posthog.capture('dashboard_viewed')
  }, [posthog])

  return null // This renders absolutely nothing on the screen
}