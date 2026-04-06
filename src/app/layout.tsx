import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/ui/Nav'
import Footer from '@/components/ui/Footer'

export const metadata: Metadata = {
  title: {
    default: 'Ausmalbilder Gratis — Kostenlose Ausmalbilder zum Ausdrucken und Online-Ausmalen',
    template: '%s | Ausmalbilder Gratis',
  },
  description:
    'Entdecke tausende kostenlose Ausmalbilder zum Ausdrucken und Online-Ausmalen. Für Kinder und Erwachsene — Tiere, Mandalas, saisonale Motive und mehr.',
  metadataBase: new URL('https://ausmalbilder-gratis.com'),
  alternates: {
    canonical: 'https://ausmalbilder-gratis.com',
    languages: {
      'de': 'https://ausmalbilder-gratis.com',
      'x-default': 'https://ausmalbilder-gratis.com',
    },
    types: {
      'application/rss+xml': '/blog/feed.xml',
    },
  },
  openGraph: {
    siteName: 'Ausmalbilder Gratis',
    locale: 'de_DE',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large' as const,
    'max-snippet': -1,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large' as const,
      'max-snippet': -1,
    },
  },
  other: {
    'geo.region': 'DE',
    'geo.placename': 'Deutschland',
    'content-language': 'de',
    'distribution': 'global',
    'rating': 'general',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-brand-cream text-foreground">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
