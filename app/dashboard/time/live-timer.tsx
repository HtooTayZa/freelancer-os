'use client'

import { useState, useEffect } from 'react'
import { usePostHog } from 'posthog-js/react'
import { Button } from '@/components/ui/button'
import { Play, Square } from 'lucide-react'

export function LiveTimer() {
  const posthog = usePostHog()
  const [isRunning, setIsRunning] = useState(false)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning) {
      interval = setInterval(() => setSeconds(s => s + 1), 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning])

  const toggleTimer = () => {
    if (!isRunning) {
      posthog.capture('timer_started')
      setIsRunning(true)
    } else {
      posthog.capture('timer_stopped', { total_seconds: seconds })
      setIsRunning(false)
      // Here you could automatically fill the manual time form with the calculated hours
    }
  }

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0')
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0')
    const s = (totalSeconds % 60).toString().padStart(2, '0')
    return `${h}:${m}:${s}`
  }

  return (
    <div className="flex items-center gap-4 bg-slate-900 text-white p-4 rounded-lg w-fit">
      <div className="text-2xl font-mono tracking-wider">{formatTime(seconds)}</div>
      <Button 
        variant={isRunning ? "destructive" : "default"} 
        size="icon" 
        onClick={toggleTimer}
      >
        {isRunning ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>
    </div>
  )
}