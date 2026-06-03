import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { CSPostHogProvider } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Freelancer OS',
  description: 'Manage your freelance business',
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