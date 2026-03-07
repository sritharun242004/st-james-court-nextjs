import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import ScrollToTop from '@/components/ScrollToTop';

export const metadata: Metadata = {
  title: 'St James Court Beach Resort | Luxury Beach Resort in Pondicherry',
  description: 'Experience luxury at St James Court Beach Resort. Premium accommodations, world-class amenities, and stunning beach views in Pondicherry. Book your perfect getaway today.',
  keywords: 'luxury resort, beach resort, pondicherry, hotels, accommodation, beach vacation, spa, dining, events',
  authors: [{ name: 'St James Court Beach Resort' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://stjamescourtresort.com',
    siteName: 'St James Court Beach Resort',
    title: 'St James Court Beach Resort | Luxury Beach Resort in Pondicherry',
    description: 'Experience luxury at St James Court Beach Resort. Premium accommodations, world-class amenities, and stunning beach views in Pondicherry.',
    images: [
      {
        url: '/logo.jpeg',
        width: 1200,
        height: 630,
        alt: 'St James Court Beach Resort',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'St James Court Beach Resort | Luxury Beach Resort in Pondicherry',
    description: 'Experience luxury at St James Court Beach Resort. Premium accommodations, world-class amenities, and stunning beach views in Pondicherry.',
    images: ['/logo.jpeg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased font-jost">
        <AuthProvider>
          <ScrollToTop />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}