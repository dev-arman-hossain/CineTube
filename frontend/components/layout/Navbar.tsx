'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Search, Bell, User, Menu, X, Play, LogOut, Shield, ChevronDown, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { 
    notifications, 
    unreadCount, 
    fetchNotifications, 
    markAsRead, 
    markAllAsRead 
  } = useNotificationStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      // Optional: Poll every 30 seconds for new notifications
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, fetchNotifications]);

  const timeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleNotificationClick = async (id: string) => {
    await markAsRead(id);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
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
        <div className="flex items-center gap-10">
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

        <div className="flex items-center gap-5">
          <div className="hidden md:flex items-center gap-3">
             <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  href="/search" 
                  className="w-10 h-10 flex items-center justify-center text-secondary-foreground hover:text-white transition-all bg-white/3 hover:bg-white/8 rounded-full border border-white/5 hover:border-white/20 group"
                >
                  <Search className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" />
                </Link>
             </motion.div>
             <div className="relative" ref={notificationRef}>
               <motion.button 
                 onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                 whileHover={{ scale: 1.05 }} 
                 whileTap={{ scale: 0.95 }}
                 className="w-10 h-10 flex items-center justify-center text-secondary-foreground hover:text-white transition-all bg-white/3 hover:bg-white/8 rounded-full border border-white/5 hover:border-white/20 relative group"
                >
                 <Bell className="w-4.5 h-4.5 group-hover:rotate-12 transition-transform" />
                 {unreadCount > 0 && (
                   <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-[#141414] shadow-sm animate-pulse" />
                 )}
               </motion.button>

               <AnimatePresence>
                 {isNotificationOpen && (
                   <motion.div
                     initial={{ opacity: 0, scale: 0.95, y: 10 }}
                     animate={{ opacity: 1, scale: 1, y: 0 }}
                     exit={{ opacity: 0, scale: 0.95, y: 10 }}
                     className="absolute right-0 mt-3 w-80 bg-black/95 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                   >
                     <div className="p-4 border-b border-white/5 flex items-center justify-between">
                        <p className="text-sm font-black text-white uppercase tracking-widest">Notifications</p>
                        {unreadCount > 0 && (
                          <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold">{unreadCount} New</span>
                        )}
                     </div>
                     <div className="max-h-80 overflow-y-auto no-scrollbar">
                       {notifications.length > 0 ? notifications.map((notification) => (
                         <div 
                           key={notification.id}
                           onClick={() => handleNotificationClick(notification.id)}
                           className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group"
                         >
                           <div className="flex gap-3">
                             {/* Only show dot if not read */}
                             <div className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0", !notification.isRead ? "bg-primary" : "bg-transparent")} />
                             <div>
                               <p className={cn("text-sm font-bold transition-colors", !notification.isRead ? "text-white group-hover:text-primary" : "text-secondary-foreground")}>{notification.title}</p>
                               <p className="text-xs text-secondary-foreground mt-1 line-clamp-2">{notification.message}</p>
                               <p className="text-[10px] text-muted-foreground mt-2 font-bold uppercase">{timeAgo(notification.createdAt)}</p>
                             </div>
                           </div>
                         </div>
                       )) : (
                         <div className="p-8 text-center">
                           <p className="text-sm text-secondary-foreground font-medium">No notifications yet</p>
                         </div>
                       )}
                     </div>
                     {notifications.length > 0 && unreadCount > 0 && (
                       <div 
                         onClick={handleMarkAllAsRead}
                         className="p-3 border-t border-white/5 text-center bg-black/50 hover:bg-white/5 transition-colors cursor-pointer"
                       >
                         <p className="text-xs font-bold text-primary uppercase tracking-widest">Mark all as read</p>
                       </div>
                     )}
                   </motion.div>
                 )}
               </AnimatePresence>
             </div>
          </div>

          <div className="h-6 w-px bg-white/10 hidden md:block mx-1" />

          {isAuthenticated ? (
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 pl-1 pr-3 py-1 rounded-full bg-white/5 border border-white/10 hover:border-primary/40 transition-all group"
              >
                <div className="w-9 h-9 rounded-full bg-linear-to-br from-primary to-rose-600 flex items-center justify-center text-white font-black text-xs shadow-lg group-hover:scale-105 transition-transform overflow-hidden border border-white/10 relative">
                  {user?.avatar ? (
                    <Image 
                      src={user.avatar} 
                      alt={user.name} 
                      fill
                      className="w-full h-full object-cover"
                      priority={false}
                      sizes="36px"
                    />
                  ) : (
                    user?.name?.[0].toUpperCase()
                  )}
                </div>
                <div className="hidden lg:block text-left">
                   <p className="text-[10px] font-black text-muted-foreground uppercase leading-none mb-0.5">Account</p>
                   <p className="text-xs font-bold text-white leading-none truncate max-w-20">{user?.name?.split(' ')[0]}</p>
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
