import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Atlas - AI Operating System for Insurance Restoration',
  description: 'Atlas is the AI Operating System for Insurance Restoration. Turn your insurance restoration company from an open-loop business into a closed-loop business. Know everything, miss nothing.',
  keywords: ['insurance restoration', 'AI operating system', 'claims management', 'supplements', 'construction software', 'roofing software', 'restoration software'],
  authors: [{ name: 'Project Atlas' }],
  creator: 'Project Atlas',
  publisher: 'Project Atlas',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://atlas.ai'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://atlas.ai',
    title: 'Atlas - AI Operating System for Insurance Restoration',
    description: 'Atlas is the AI Operating System for Insurance Restoration. Turn your insurance restoration company from an open-loop business into a closed-loop business.',
    siteName: 'Atlas',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Atlas - AI Operating System for Insurance Restoration',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Atlas - AI Operating System for Insurance Restoration',
    description: 'Atlas is the AI Operating System for Insurance Restoration. Turn your insurance restoration company from an open-loop business into a closed-loop business.',
    images: ['/og-image.png'],
    creator: '@projectatlas',
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'Atlas',
            description: 'Atlas is the AI Operating System for Insurance Restoration. Turn your insurance restoration company from an open-loop business into a closed-loop business.',
            url: 'https://atlas.ai',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            creator: {
              '@type': 'Organization',
              name: 'Project Atlas',
              url: 'https://atlas.ai',
            },
            featureList: [
              'AI-powered claims management',
              'Intelligent supplement tracking',
              'Automated document processing',
              'Real-time business intelligence',
              'Predictive analytics',
              'Learning system',
            ],
          }),
        }}
      />
    </>
  );
}
