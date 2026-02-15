import './globals.css'
import type { Metadata } from 'next'
import { AuthProvider } from '@/components/auth-context'

export const metadata: Metadata = {
  title: 'Inner Sanctuary',
  description: 'A space for reflection, release, and renewal',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}


