import { ThemeProvider } from '@/components/providers/theme-provider'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import TopLoader from '@/components/providers/top-loader'
import AuthProvider from '@/components/providers/auth-provider'
import { TailwindIndicator } from '@/components/indicator'
import { Toaster } from '@/components/ui/toaster'
import { getSessionUser } from '@/components/get-session-user'
import { getSettings } from '@/lib/prisma/session'
import { GeistSans } from "geist/font";
import { siteConfig } from '@/config/site'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.DOMAIN!),
  appleWebApp: true,
  applicationName: 'FalseNotes',
  icons: { apple: '/apple-192x192.png', icon: '/favicon.ico', shortcut: '/favicon.ico' },
  verification: { google: 'A9rA7yXdPFGwGxzMtOJ1tXoD0d5NBfJX7nEWrU37iJg', me: '@me', yandex: '37a0482b63273551' },
  manifest: `${process.env.DOMAIN}/manifest.json`,
  title: 'FalseNotes - Where Creativity Takes Flight',
  description: '🚀 FalseNotes is a developer-focused blogging platform where individual developers can ignite discussions, share expertise, and craft their coding journeys.',
  keywords: ['FalseNotes', 'False Notes', 'FalseNotes Blog', 'FalseNotes Blogging', 'FalseNotes Blogging Platform', 'FalseNotes Platform', 'FalseNotes Blogging Platform', 'FalseNotes Blogging Platform'],
  openGraph: {
    title: 'FalseNotes - Where Creativity Takes Flight',
    description: '🚀 FalseNotes is a developer-focused blogging platform where individual developers can ignite discussions, share expertise, and craft their coding journeys.',
    url: process.env.DOMAIN!,
    images: [
      {
        url: '/og.png',
        alt: 'FalseNotes',
      },
    ],
    type: 'website',
    siteName: 'FalseNotes',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FalseNotes - Where Creativity Takes Flight',
    description: '🚀 FalseNotes is a developer-focused blogging platform where individual developers can ignite discussions, share expertise, and craft their coding journeys.',
    images: [
      {
        url: '/og.png',
        alt: 'FalseNotes',
      },
    ],
    site: 'FalseNotes',
  },
}


export default async function Rootayout({
  children,
}: {
  children: React.ReactNode
}) {

  const session = await getSessionUser()
  const { settings } = await getSettings({ id: session?.id })
  return (
    <html lang={settings?.language || 'en'}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-192x192.png" />
        <link rel="mask-icon" href="/favicon.svg" color="#000000" />
        <link rel="icon" className="js-site-favicon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content={'#000000'} />
        <meta name="google-adsense-account" content="ca-pub-8147189047076030" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8147189047076030" crossOrigin="anonymous" />
      </head>
      <body className={`${GeistSans.className}`}>
        <ThemeProvider attribute="class" defaultTheme={settings?.appearance || 'system'} enableSystem>
          <AuthProvider>
            {children}
            <Toaster />
            <TailwindIndicator />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
