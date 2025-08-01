import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { Analytics } from '@vercel/analytics/react'

// SEO Metadata Configuration
export const metadata: Metadata = {
  metadataBase: new URL('https://notes.zentha.in'),
  title: {
    default: 'Zentha Notes - Study Materials & Educational Resources',
    template: '%s | Zentha Notes'
  },
  description: 'Zentha Notes provides premium study materials, past year question papers, and comprehensive educational resources for engineering students. Access RTU PYQs, mid-term papers, and structured learning content.',
  keywords: [
    'Zentha Notes',
    'study materials',
    'engineering notes',
    'RTU PYQs',
    'past year questions',
    'educational resources',
    'engineering education',
    'study guides',
    'academic materials',
    'student resources',
    'engineering curriculum',
    'exam preparation',
    'study notes',
    'study materials',
    'anand international engineering college',
    'anand engineering college',
    'anand engineering college notes',
    'anand engineering college study materials',
    'anand engineering college past year questions',
    'anand engineering college mid term papers',
    'anand engineering college study guides',
    'educational platform'
  ],
  authors: [{ name: 'Zentha Studio', url: 'https://notes.zentha.in' }],
  creator: 'Zentha Studio',
  publisher: 'Zentha Studio',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://notes.zentha.in',
    siteName: 'Zentha Notes',
    title: 'Zentha Notes - Premium Study Materials & Educational Resources',
    description: 'Zentha Notes provides premium study materials, past year question papers, and comprehensive educational resources for engineering students.',
    images: [
      {
        url: '/og-image.jpeg',
        width: 1200,
        height: 630,
        alt: 'Zentha Notes - Educational Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zentha Notes - Premium Study Materials & Educational Resources',
    description: 'Zentha Notes provides premium study materials, past year question papers, and comprehensive educational resources for engineering students.',
    images: ['/og-image.jpeg'],
    creator: '@zentha_studio',
    site: '@zentha_studio',
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
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  alternates: {
    canonical: 'https://notes.zentha.in',
  },
  category: 'education',
  classification: 'Educational Platform',
  other: {
    'theme-color': '#000000',
    'msapplication-TileColor': '#000000',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'Zentha Notes',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

// Structured Data for Organization
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'Zentha Notes',
  url: 'https://notes.zentha.in',
  logo: 'https://notes.zentha.in/logo.png',
  description: 'educational platform providing study materials and resources for engineering students',
  sameAs: [
    'https://twitter.com/zentha_studio',
    'https://linkedin.com/company/zentha-studio',
    'https://facebook.com/zentha.studio'
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: 'contact@zentha.in',
    availableLanguage: 'English'
  },
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'IN',
    addressLocality: 'India'
  },
  founder: {
    '@type': 'Person',
    name: 'Zentha Studio Team'
  },
  foundingDate: '2025-07-30',
  knowsAbout: [
    'Engineering Education',
    'Study Materials',
    'Past Year Questions',
    'Academic Resources',
    'Student Learning'
  ]
}

// Structured Data for WebSite
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Zentha Notes',
  url: 'https://notes.zentha.in',
  description: 'Premium study materials and educational resources for engineering students',
  publisher: {
    '@type': 'Organization',
    name: 'Zentha Studio',
    url: 'https://notes.zentha.in'
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://notes.zentha.in/search?q={search_term_string}',
    'query-input': 'required name=search_term_string'
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon and app icons */}
        <link rel="icon" href="/FaviconImages/favicon.ico" sizes="any" />
        <link rel="icon" href="/FaviconImages/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/FaviconImages/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/FaviconImages/apple-touch-icon.png" />
        <link rel="icon" href="/FaviconImages/android-chrome-192x192.png" sizes="192x192" type="image/png" />
        <link rel="icon" href="/FaviconImages/android-chrome-512x512.png" sizes="512x512" type="image/png" />
        <link rel="manifest" href="/FaviconImages/site.webmanifest" />
        
        {/* DNS prefetch for performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />

        {/* Open Graph Image */}
        <meta property="og:image" content="https://notes.zentha.in/og-image.jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Zentha Notes - Educational Platform" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:secure_url" content="https://notes.zentha.in/og-image.jpeg" />
        
        {/* Twitter Card Image */}
        <meta name="twitter:image" content="https://notes.zentha.in/og-image.jpeg" />
        <meta name="twitter:image:alt" content="Zentha Notes - Educational Platform" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
        
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
