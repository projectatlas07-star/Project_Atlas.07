import type { Metadata } from 'next';
import './globals.css';

const ATLAS_APP_URL = process.env.NEXT_PUBLIC_ATLAS_APP_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Atlas - AI Operating System for Insurance Restoration',
  description: 'Atlas is the AI Operating System for Insurance Restoration. Turn your insurance restoration company from an open-loop business into a closed-loop business. Know everything, miss nothing.',
  keywords: ['insurance restoration', 'AI operating system', 'claims management', 'supplements', 'construction software', 'roofing software', 'restoration software'],
  authors: [{ name: 'Project Atlas' }],
  creator: 'Project Atlas',
  publisher: 'Project Atlas',
  metadataBase: new URL(ATLAS_APP_URL),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: ATLAS_APP_URL,
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}