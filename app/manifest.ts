import type { MetadataRoute } from 'next'

// Macht Snippt zur installierbaren Web-App („Zum Startbildschirm hinzufügen").
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Snippt',
    short_name: 'Snippt',
    description: 'Dein Friseur — anstellen oder Termin buchen.',
    start_url: '/',
    display: 'standalone',
    background_color: '#08080B',
    theme_color: '#08080B',
    icons: [
      { src: '/icon', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      { src: '/icon', sizes: '512x512', type: 'image/png' },
    ],
  }
}
