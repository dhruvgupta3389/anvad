import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  metadataBase: new URL('https://anveda.vercel.app'),
  title: {
    default: 'ANVEDA - Premium A2 Ghee & Organic Products | Pure, Traditional, Authentic',
    template: '%s | ANVEDA - Premium A2 Ghee'
  },
  description: 'Discover ANVEDA\'s premium A2 ghee made from Gir cow, Desi cow, and Buffalo milk. Shop authentic, traditionally churned ghee, cold-pressed oils, pure honey, and organic spices. Free delivery across India.',
  keywords: ['A2 ghee', 'Gir cow ghee', 'desi cow ghee', 'buffalo ghee', 'cold pressed oil', 'organic honey', 'traditional ghee', 'pure ghee', 'authentic ghee', 'ANVEDA'],
  authors: [{ name: 'ANVEDA' }],
  creator: 'ANVEDA',
  publisher: 'ANVEDA',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://anveda.vercel.app',
    title: 'ANVEDA - Premium A2 Ghee & Organic Products',
    description: 'Premium A2 ghee made from Gir cow, Desi cow, and Buffalo milk. Traditionally churned for authentic taste and nutrition.',
    siteName: 'ANVEDA',
    images: [
      {
        url: '/anveda-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ANVEDA Premium A2 Ghee Products',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ANVEDA - Premium A2 Ghee & Organic Products',
    description: 'Premium A2 ghee made from Gir cow, Desi cow, and Buffalo milk. Traditionally churned for authentic taste and nutrition.',
    images: ['/anveda-og-image.jpg'],
    creator: '@anveda_official',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  other: {
    'theme-color': '#7d3600',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'mobile-web-app-capable': 'yes',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
