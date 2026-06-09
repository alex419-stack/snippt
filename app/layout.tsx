import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Snippt',
  description: 'Dein Friseur — anstellen oder Termin buchen, ohne Anruf.',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'Snippt',
    statusBarStyle: 'black-translucent',
  },
}

export const viewport: Viewport = {
  themeColor: '#08080B',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${inter.variable} ${playfair.variable}`}>
      {/* Snippt v1 Design-Fonts (Clash Display + General Sans) via Fontshare-CDN */}
      <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
      <link
        href="https://api.fontshare.com/v2/css?f[]=clash-display@600,700&f[]=general-sans@400,500,600&display=swap"
        rel="stylesheet"
      />
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
