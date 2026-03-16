'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Search, Bell, User, Menu, X, Play, LogOut, Shield, ChevronDown, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
    setIsProfileOpen(false);
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Movies', href: '/movies' },
    { name: 'Series', href: '/series' },
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 z-50 w-full transition-all duration-500 px-4 md:px-12 py-4',
        isScrolled 
          ? 'bg-black/60 backdrop-blur-xl border-b border-white/5 shadow-2xl' 
          : 'bg-transparent'
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="bg-primary p-2 rounded-xl group-hover:shadow-lg group-hover:shadow-primary/40 transition-all"
            >
              <Play className="w-5 h-5 fill-white text-white" />
            </motion.div>
            <span className="text-2xl font-black tracking-tighter text-white font-outfit">
              CINE<span className="text-primary">TUBE</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-bold tracking-wide transition-all hover:text-primary relative group py-2',
                  pathname === link.href ? 'text-primary' : 'text-secondary-foreground'
                )}
              >
                {link.name}
                <motion.span 
                  initial={false}
                  animate={{ width: pathname === link.href ? '100%' : '0%' }}
                  className="absolute bottom-0 left-0 h-0.5 bg-primary rounded-full"
                />
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2">
             <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Link href="/search" className="p-2.5 text-secondary-foreground hover:text-white transition-colors bg-white/5 rounded-full border border-transparent hover:border-white/10">
                  <Search className="w-5 h-5" />
                </Link>
             </motion.div>
             <motion.button 
               whileHover={{ scale: 1.1 }} 
               whileTap={{ scale: 0.9 }}
               className="p-2.5 text-secondary-foreground hover:text-white transition-colors bg-white/5 rounded-full border border-transparent hover:border-white/10 relative"
              >
               <Bell className="w-5 h-5" />
               <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-black" />
             </motion.button>
          </div>

          <div className="h-8 w-px bg-white/10 hidden md:block" />

          {isAuthenticated ? (
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 pl-1 pr-3 py-1 rounded-full bg-white/5 border border-white/10 hover:border-primary/40 transition-all group"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-rose-600 flex items-center justify-center text-white font-black text-xs shadow-lg group-hover:scale-105 transition-transform overflow-hidden border border-white/10">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user?.name?.[0].toUpperCase()
                  )}
                </div>
                <div className="hidden lg:block text-left">
                   <p className="text-[10px] font-black text-muted-foreground uppercase leading-none mb-0.5">Account</p>
                   <p className="text-xs font-bold text-white leading-none truncate max-w-[80px]">{user?.name?.split(' ')[0]}</p>
                </div>
                <ChevronDown className={cn("w-4 h-4 text-secondary-foreground transition-transform duration-300", isProfileOpen && "rotate-180")} />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute right-0 mt-3 w-64 glass-dark border border-white/10 rounded-2xl p-2 shadow-2xl"
                  >
                    <div className="p-4 border-b border-white/5 mb-2">
                       <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Signed in as</p>
                       <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <Link 
                        href="/profile" 
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-secondary-foreground hover:text-white hover:bg-white/5 rounded-xl transition-all"
                      >
                        <User className="w-4 h-4" />
                        My Profile
                      </Link>
                      <Link 
                        href="/watchlist" 
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-secondary-foreground hover:text-white hover:bg-white/5 rounded-xl transition-all"
                      >
                        <Bookmark className="w-4 h-4" />
                        My Watchlist
                      </Link>
                      {user?.role === 'ADMIN' && (
                        <Link 
                          href="/admin/dashboard" 
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-primary hover:bg-primary/5 rounded-xl transition-all"
                        >
                          <Shield className="w-4 h-4" />
                          Admin Dashboard
                        </Link>
                      )}
                    </div>
                    
                    <div className="mt-2 pt-2 border-t border-white/5">
                      <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-rose-700 text-white rounded-full text-sm font-bold transition-all shadow-lg shadow-primary/20"
            >
              Sign In
            </Link>
          )}

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
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 w-full bg-black/95 border-b border-white/10 md:hidden flex flex-col p-6 gap-4 overflow-hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  'text-lg font-bold transition-colors',
                  pathname === link.href ? 'text-primary' : 'text-secondary-foreground'
                )}
              >
                {link.name}
              </Link>
            ))}
            {isAuthenticated && (
               <>
                 <Link
                   href="/profile"
                   onClick={() => setIsMobileMenuOpen(false)}
                   className="flex items-center gap-3 text-lg font-bold text-secondary-foreground hover:text-white transition-colors py-2"
                 >
                   <User className="w-5 h-5" />
                   Profile
                 </Link>
                 <Link
                   href="/watchlist"
                   onClick={() => setIsMobileMenuOpen(false)}
                   className="flex items-center gap-3 text-lg font-bold text-secondary-foreground hover:text-white transition-colors py-2"
                 >
                   <Bookmark className="w-5 h-5" />
                   Watchlist
                 </Link>
                 {user?.role === 'ADMIN' && (
                   <Link
                     href="/admin/dashboard"
                     onClick={() => setIsMobileMenuOpen(false)}
                     className="flex items-center gap-3 text-lg font-bold text-primary hover:text-rose-400 transition-colors py-2"
                   >
                     <Shield className="w-5 h-5" />
                     Admin Dashboard
                   </Link>
                 )}
               </>
            )}
            {!isAuthenticated && (
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-4 bg-primary text-white rounded-xl font-bold mt-4 shadow-lg shadow-primary/20"
              >
                Sign In
              </Link>
            )}
            {isAuthenticated && (
               <button
                 onClick={handleLogout}
                 className="flex items-center justify-center gap-2 w-full py-4 bg-white/5 text-rose-500 rounded-xl font-bold mt-4 border border-rose-500/10 hover:bg-rose-500/10 transition-all"
               >
                 <LogOut className="w-5 h-5" />
                 Logout
               </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
