'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Search, Bell, User, Menu, X, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Movies', href: '/movies' },
    { name: 'Series', href: '/series' },
    { name: 'Watchlist', href: '/watchlist' },
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 z-50 w-full transition-all duration-300 px-4 md:px-12 py-4',
        isScrolled ? 'glass-dark bg-black/80' : 'bg-transparent'
      )}
    >
      <div className="flex items-center justify-between max-w-7-xl mx-auto">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary p-1.5 rounded-lg group-hover:scale-110 transition-transform">
              <Play className="w-5 h-5 fill-white text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tighter text-white">
              CINE<span className="text-primary">TUBE</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  pathname === link.href ? 'text-primary' : 'text-secondary-foreground'
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 text-secondary-foreground hover:text-white transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button className="hidden md:block p-2 text-secondary-foreground hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <Link
            href="/login"
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary hover:bg-rose-700 text-white rounded-full text-sm font-semibold transition-all"
          >
            <User className="w-4 h-4" />
            Sign In
          </Link>
          <button
            className="md:hidden p-2 text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-black/95 border-b border-white/10 md:hidden flex flex-col p-6 gap-4"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  'text-lg font-medium transition-colors',
                  pathname === link.href ? 'text-primary' : 'text-secondary-foreground'
                )}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-white rounded-xl font-bold"
            >
              Sign In
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
