import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { Playfair_Display } from 'next/font/google'
import './globals.css'

// Playfair Display — Serif für Headlines, Brand-Wörter, Eigennamen in Brand-Karten.
// display: 'swap' vermeidet FOIT (Flash of Invisible Text) beim Laden.
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Snippt',
  description: 'Buche deinen Lieblingsfriseuer — schnell, einfach, ohne Anruf.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${GeistSans.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
