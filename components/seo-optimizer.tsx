'use client'

import { useEffect } from 'react'
import Head from 'next/head'

interface SEOOptimizerProps {
  title?: string
  description?: string
  keywords?: string[]
  ogImage?: string
  ogType?: string
  canonical?: string
  structuredData?: object
  noIndex?: boolean
  noFollow?: boolean
}

export default function SEOOptimizer({
  title,
  description,
  keywords = [],
  ogImage = '/og-image.jpg',
  ogType = 'website',
  canonical,
  structuredData,
  noIndex = false,
  noFollow = false,
}: SEOOptimizerProps) {
  useEffect(() => {
    // Update page title dynamically
    if (title) {
      document.title = title
    }

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription && description) {
      metaDescription.setAttribute('content', description)
    }

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle && title) {
      ogTitle.setAttribute('content', title)
    }

    const ogDesc = document.querySelector('meta[property="og:description"]')
    if (ogDesc && description) {
      ogDesc.setAttribute('content', description)
    }

    const ogImageTag = document.querySelector('meta[property="og:image"]')
    if (ogImageTag && ogImage) {
      ogImageTag.setAttribute('content', `https://zentha.in${ogImage}`)
    }

    // Update Twitter tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]')
    if (twitterTitle && title) {
      twitterTitle.setAttribute('content', title)
    }

    const twitterDesc = document.querySelector('meta[name="twitter:description"]')
    if (twitterDesc && description) {
      twitterDesc.setAttribute('content', description)
    }

    // Update robots meta
    const robotsMeta = document.querySelector('meta[name="robots"]')
    if (robotsMeta) {
      const robotsContent = []
      if (noIndex) robotsContent.push('noindex')
      if (noFollow) robotsContent.push('nofollow')
      if (!noIndex && !noFollow) robotsContent.push('index, follow')
      robotsMeta.setAttribute('content', robotsContent.join(', '))
    }

    // Add structured data if provided
    if (structuredData) {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.text = JSON.stringify(structuredData)
      document.head.appendChild(script)

      return () => {
        document.head.removeChild(script)
      }
    }
  }, [title, description, keywords, ogImage, ogType, canonical, structuredData, noIndex, noFollow])

  return null
}

// Predefined structured data schemas
export const structuredDataSchemas = {
  // Course/Educational Content Schema
  course: (data: {
    name: string
    description: string
    provider: string
    url: string
    educationalLevel?: string
    inLanguage?: string
  }) => ({
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: data.name,
    description: data.description,
    provider: {
      '@type': 'Organization',
      name: data.provider,
      url: 'https://zentha.in'
    },
    url: data.url,
    educationalLevel: data.educationalLevel || 'Undergraduate',
    inLanguage: data.inLanguage || 'en',
    isAccessibleForFree: true,
    educationalUse: 'Study Material',
    learningResourceType: 'Study Guide'
  }),

  // Article Schema for Study Materials
  article: (data: {
    headline: string
    description: string
    author: string
    datePublished: string
    dateModified: string
    image?: string
    url: string
  }) => ({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.headline,
    description: data.description,
    author: {
      '@type': 'Organization',
      name: data.author,
      url: 'https://zentha.in'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Zentha Studio',
      url: 'https://zentha.in',
      logo: {
        '@type': 'ImageObject',
        url: 'https://zentha.in/logo.png'
      }
    },
    datePublished: data.datePublished,
    dateModified: data.dateModified,
    image: data.image ? `https://zentha.in${data.image}` : 'https://zentha.in/og-image.jpg',
    url: data.url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': data.url
    }
  }),

  // FAQ Schema
  faq: (data: { questions: Array<{ question: string; answer: string }> }) => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.questions.map(q => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer
      }
    }))
  }),

  // Breadcrumb Schema
  breadcrumb: (data: { items: Array<{ name: string; url: string }> }) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: data.items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  })
} 