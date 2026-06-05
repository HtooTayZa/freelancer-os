'use client'

import { useState, useEffect } from 'react'
import { usePostHog } from 'posthog-js/react'
import { Button } from '@/components/ui/button'
import { Play, Square } from 'lucide-react'
import { createTimeEntry } from './actions'
import { Label } from '@/components/ui/label'

type Project = { id: string; title: string }

export function LiveTimer({ projects }: { projects: Project[] | null }) {
  const posthog = usePostHog()
  const [isRunning, setIsRunning] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [selectedProject, setSelectedProject] = useState('')

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning) {
      interval = setInterval(() => setSeconds(s => s + 1), 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning])

  const toggleTimer = async () => {
    if (!selectedProject) {
      alert("Please select a project first!")
      return
    }

    if (!isRunning) {
      posthog.capture('timer_started')
      setIsRunning(true)
    } else {
      posthog.capture('timer_stopped', { total_seconds: seconds })
      setIsRunning(false)
      
      // Calculate hours (minimum 0.25 hours for billing)
      const hours = Math.max(0.25, seconds / 3600).toFixed(2)

      // Create a programmatic form submission to reuse your server action
      const formData = new FormData()
      formData.append('project_id', selectedProject)
      formData.append('date', new Date().toISOString().split('T')[0])
      formData.append('duration_hours', hours.toString())
      formData.append('description', 'Live tracked session')

      await createTimeEntry(formData)
      setSeconds(0) // Reset after saving
    }
  }

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0')
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0')
    const s = (totalSeconds % 60).toString().padStart(2, '0')
    return `${h}:${m}:${s}`
  }

  return (
    <div className="flex flex-col gap-3 bg-slate-900 text-white p-5 rounded-xl w-full max-w-md shadow-lg border border-slate-800">
      <Label className="text-slate-300">Active Working Session</Label>
      <div className="flex items-center gap-4">
        <select 
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          disabled={isRunning}
          className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <option value="">Select a project...</option>
          {projects?.map((p) => (
            <option key={p.id} value={p.id}>{p.title}</option>
          ))}
        </select>
        
        <div className="text-2xl font-mono tracking-wider w-28 text-center">{formatTime(seconds)}</div>
        
        <Button 
          variant={isRunning ? "destructive" : "default"} 
          size="icon" 
          onClick={toggleTimer}
          className="shrink-0"
        >
          {isRunning ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  )
}