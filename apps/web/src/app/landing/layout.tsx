import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import './landing.css';

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Atlas — The AI Operating System for Insurance Restoration',
  description: 'Atlas is the AI operating system for insurance restoration companies. It sits above your existing stack — CRM, estimating, claims, photos, documents, emails, notes, supplements, team knowledge — and turns it into one connected intelligence layer.',
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
    canonical: '/landing',
  },
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://atlas.ai',
    title: 'Atlas — The AI Operating System for Insurance Restoration',
    description: 'Connect every system a restoration company already uses into a single intelligence layer. Close the loop on supplements, claims, and operational visibility.',
    siteName: 'Atlas',
    images: [
      {
        url: '/atlas-logo-full.png',
        width: 1200,
        height: 630,
        alt: 'Atlas — The AI Operating System for Insurance Restoration',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Atlas — The AI Operating System for Insurance Restoration',
    description: 'Connect every system a restoration company already uses into a single intelligence layer. Close the loop on supplements, claims, and operational visibility.',
    images: ['/atlas-logo-full.png'],
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
    <div className={spaceGrotesk.variable}>
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
    </div>
  );
}
