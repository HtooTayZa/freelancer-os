import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { CSPostHogProvider } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Freelancer OS | Manage Projects & Invoices',
  description: 'The complete operating system for independent professionals. Track time, manage projects, and generate invoices seamlessly.',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CSPostHogProvider>{children}</CSPostHogProvider>
      </body>
    </html>
  )
}