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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-black">
      <body
        className={`${inter.variable} ${outfit.variable} antialiased bg-black text-white min-h-screen flex flex-col`}
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
          <QueryProvider>
            {children}
          </QueryProvider>
        </main>
        <Footer />
      </body>
    </html>
  );
}
