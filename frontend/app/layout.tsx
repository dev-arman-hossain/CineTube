import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'CineTube | Movie & Series Rating Portal',
  description: 'Stream, Rate and Manage your favorite movies and series on CineTube.',
  keywords: ['movies', 'series', 'streaming', 'reviews', 'ratings', 'watchlist'],
};

import QueryProvider from '@/components/providers/QueryProvider';
import GoogleProvider from '@/components/providers/GoogleAuthProvider';
import WelcomeDisclosure from '@/components/layout/WelcomeDisclosure';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-black" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${outfit.variable} antialiased bg-black text-white min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#141414',
              color: '#fff',
              border: '1px solid #262626',
            },
          }}
        />
        <Navbar />
        <main className="flex-grow pt-20">
          <GoogleProvider>
            <QueryProvider>
              <WelcomeDisclosure />
              {children}
            </QueryProvider>
          </GoogleProvider>
        </main>
        <Footer />
      </body>
    </html>
  );
}
