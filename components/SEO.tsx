import { Metadata } from 'next';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  price?: string;
  currency?: string;
  availability?: 'instock' | 'outofstock' | 'preorder';
  category?: string;
  brand?: string;
}

interface StructuredDataProps {
  type: 'Product' | 'Organization' | 'Website' | 'Article';
  data: any;
}

export function generateSEOMetadata({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
}: SEOProps): Metadata {
  const baseUrl = 'https://anveda.vercel.app';
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl;
  const ogImage = image ? `${baseUrl}${image}` : `${baseUrl}/anveda-og-image.jpg`;

  return {
    title: title ? `${title} | ANVEDA - Premium A2 Ghee` : 'ANVEDA - Premium A2 Ghee & Organic Products | Pure, Traditional, Authentic',
    description: description || 'Discover ANVEDA\'s premium A2 ghee made from Gir cow, Desi cow, and Buffalo milk. Shop authentic, traditionally churned ghee, cold-pressed oils, pure honey, and organic spices.',
    keywords: keywords || ['A2 ghee', 'Gir cow ghee', 'desi cow ghee', 'buffalo ghee', 'cold pressed oil', 'organic honey'],
    authors: author ? [{ name: author }] : [{ name: 'ANVEDA' }],
    openGraph: {
      type: type === 'product' ? 'website' : type,
      url: fullUrl,
      title: title || 'ANVEDA - Premium A2 Ghee & Organic Products',
      description: description || 'Premium A2 ghee made from Gir cow, Desi cow, and Buffalo milk. Traditionally churned for authentic taste and nutrition.',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title || 'ANVEDA Premium A2 Ghee Products',
        },
      ],
      siteName: 'ANVEDA',
      locale: 'en_IN',
    },
    twitter: {
      card: 'summary_large_image',
      title: title || 'ANVEDA - Premium A2 Ghee & Organic Products',
      description: description || 'Premium A2 ghee made from Gir cow, Desi cow, and Buffalo milk.',
      images: [ogImage],
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
    alternates: {
      canonical: fullUrl,
    },
    ...(publishedTime && { 
      other: {
        'article:published_time': publishedTime,
        ...(modifiedTime && { 'article:modified_time': modifiedTime }),
      }
    }),
  };
}

export function generateProductStructuredData(product: {
  name: string;
  description: string;
  price: number;
  currency: string;
  image: string;
  url: string;
  brand: string;
  category: string;
  availability: 'instock' | 'outofstock' | 'preorder';
  sku?: string;
  gtin?: string;
  rating?: number;
  reviewCount?: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: `https://anveda.vercel.app${product.image}`,
    url: `https://anveda.vercel.app${product.url}`,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    category: product.category,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency,
      availability: `https://schema.org/${product.availability === 'instock' ? 'InStock' : product.availability === 'outofstock' ? 'OutOfStock' : 'PreOrder'}`,
      url: `https://anveda.vercel.app${product.url}`,
    },
    ...(product.sku && { sku: product.sku }),
    ...(product.gtin && { gtin: product.gtin }),
    ...(product.rating && product.reviewCount && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviewCount,
      },
    }),
  };
}

export function generateOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ANVEDA',
    url: 'https://anveda.vercel.app',
    logo: 'https://anveda.vercel.app/logo.png',
    description: 'Premium A2 ghee and organic products made from traditional methods',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-XXXXXXXXXX',
      contactType: 'Customer Service',
      areaServed: 'IN',
      availableLanguage: ['English', 'Hindi'],
    },
    sameAs: [
      'https://www.facebook.com/anveda',
      'https://www.instagram.com/anveda',
      'https://twitter.com/anveda',
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
    },
  };
}

export function StructuredData({ type, data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}
