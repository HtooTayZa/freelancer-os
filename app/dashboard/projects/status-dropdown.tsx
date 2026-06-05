'use client'

import { updateProjectStatus } from './actions'
import { usePostHog } from 'posthog-js/react'




export function StatusDropdown({ projectId, currentStatus }: { projectId: string, currentStatus: string }) {
  const posthog = usePostHog()
  return (
    <select
      defaultValue={currentStatus}
      onChange={async (e) => {
        const newStatus = e.target.value
        
        // Fire the event if the user specifically selects "Done"
        if (newStatus === 'done' && currentStatus !== 'done') {
          posthog.capture('project_completed')
        }
        
        await updateProjectStatus(projectId, newStatus)
      }}
      className={`text-xs rounded-full px-2.5 py-1 font-semibold border cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
        currentStatus === 'done' ? 'bg-green-100 text-green-800 border-green-200' :
        currentStatus === 'in_progress' ? 'bg-blue-100 text-blue-800 border-blue-200' :
        'bg-slate-100 text-slate-800 border-slate-200'
      }`}
    >
      <option value="todo">To Do</option>
      <option value="in_progress">In Progress</option>
      <option value="done">Done</option>
    </select>
  )
}