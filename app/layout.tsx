import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Habit Adventure - Gamified Habit Tracker',
  description:
    'Track your daily habits in an adventure game format. Earn XP, level up, and explore new worlds as you build better habits.',
  keywords: [
    'habit tracker',
    'gamification',
    'productivity',
    'PWA',
    'adventure game',
    'daily habits',
  ],
  authors: [{ name: 'Habit Adventure Team' }],
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Habit Adventure',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'Habit Adventure',
    title: 'Habit Adventure - Gamified Habit Tracker',
    description: 'Track your daily habits in an adventure game format',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Habit Adventure - Gamified Habit Tracker',
    description: 'Track your daily habits in an adventure game format',
  },
}

export const viewport: Viewport = {
  themeColor: '#5f3122',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 3,
  userScalable: true,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

