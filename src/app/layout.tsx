
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { AppLayout } from '@/components/layout/AppLayout';
import DevErrorBoundary from '@/components/DevErrorBoundary';

export const metadata: Metadata = {
  title: 'DootRec - Share Your Movie & Show Takes',
  description: 'Discover, review, and discuss your favorite movies and TV shows on DootRec.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pageContent = (
    <AppLayout>
      {children}
    </AppLayout>
  );

  return (
    <html lang="en">
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        {process.env.NODE_ENV === 'development' ? (
          <DevErrorBoundary>{pageContent}</DevErrorBoundary>
        ) : (
          pageContent
        )}
      </body>
    </html>
  );
}
