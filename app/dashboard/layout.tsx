import Link from 'next/link'
import { SignOutButton } from './sign-out-button'
import { LayoutDashboard, Briefcase, Clock, FileText } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-slate-50">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Freelancer OS</h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {/* NEW: Overview Link */}
          <Link 
            href="/dashboard" 
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <LayoutDashboard className="h-4 w-4" />
            Overview
          </Link>
          <Link 
            href="/dashboard/projects" 
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <Briefcase className="h-4 w-4" />
            Projects
          </Link>
          <Link 
            href="/dashboard/time" 
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <Clock className="h-4 w-4" />
            Time Tracking
          </Link>
          <Link 
            href="/dashboard/invoices" 
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <FileText className="h-4 w-4" />
            Invoices
          </Link>
        </nav>

        {/* The Log Out Escape Hatch - Added pb-20 to clear the Vercel floating button */}
        <div className="p-4 pb-20 border-t border-slate-200">
          <SignOutButton />
        </div>
      </aside>

      {/* Main App Workspace */}
      <main className="flex-1 p-6 md:p-8">
        <div className="mx-auto max-w-5xl">
          {children}
        </div>
      </main>
    </div>
  )
}