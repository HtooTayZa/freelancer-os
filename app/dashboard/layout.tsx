import Link from 'next/link'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Sidebar Navigation */}
      <div className="hidden border-r bg-slate-50/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
              <span>Freelancer OS</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4 gap-1">
              <Link 
                href="/dashboard" 
                className="flex items-center gap-3 rounded-lg bg-slate-100 px-3 py-2 text-slate-900 transition-all hover:text-slate-900"
              >
                Overview
              </Link>
              <Link 
                href="/dashboard/projects" 
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-500 transition-all hover:text-slate-900 hover:bg-slate-50"
              >
                Projects
              </Link>
              <Link 
                href="/dashboard/time" 
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-500 transition-all hover:text-slate-900 hover:bg-slate-50"
              >
                Time Tracking
              </Link>
              <Link 
                href="/dashboard/invoices" 
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-500 transition-all hover:text-slate-900 hover:bg-slate-50"
              >
                Invoices
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col">
        <main className="flex flex-1 flex-col p-4 lg:p-8">
          {/* The specific page content will be injected exactly here */}
          {children}
        </main>
      </div>
    </div>
  )
}