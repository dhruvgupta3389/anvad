import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ANVEDA - Premium A2 Ghee & Organic Products',
    short_name: 'ANVEDA',
    description: 'Premium A2 ghee made from Gir cow, Desi cow, and Buffalo milk. Traditionally churned for authentic taste and nutrition.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F9F1E6',
    theme_color: '#7d3600',
    categories: ['food', 'shopping', 'health'],
    icons: [
      {
        src: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        src: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
