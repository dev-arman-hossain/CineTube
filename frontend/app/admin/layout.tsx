'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Shield, LayoutDashboard, Users, Film, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      router.push('/');
    }
  }, [user, isAuthenticated, router]);

  if (!user || user.role !== 'ADMIN') return null;

  const sidebarLinks = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'User Management', href: '/admin/users', icon: Users },
    { name: 'Media Catalog', href: '/admin/media', icon: Film },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-80px)] bg-black">
      {/* Mobile Admin Navigation Header */}
      <div className="md:hidden sticky top-20 z-40 w-full overflow-hidden">
        <div className="relative">
          <div className="bg-black/95 backdrop-blur-2xl border-b border-white/10 py-4 px-4 overflow-x-auto no-scrollbar flex items-center gap-3 flex-nowrap shadow-2xl touch-pan-x content-center">
            {sidebarLinks.map((link, idx) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="shrink-0"
                >
                  <Link
                    href={link.href}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300 ring-1 ${
                      isActive 
                        ? 'bg-primary text-white ring-primary shadow-lg shadow-primary/40' 
                        : 'text-secondary-foreground bg-white/5 ring-white/10 hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {link.name}
                  </Link>
                </motion.div>
              );
            })}
          </div>
          {/* Scroll Indicator Gradient */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black via-black/50 to-transparent pointer-events-none z-10" />
        </div>
      </div>

      {/* Admin Sidebar (Desktop) */}
      <aside className="w-64 border-r border-white/5 bg-secondary/20 p-6 space-y-8 hidden md:block">
        <div className="flex items-center gap-2 text-primary">
          <Shield className="w-5 h-5 fill-primary" />
          <span className="font-outfit font-black uppercase tracking-widest text-sm">Admin Portal</span>
        </div>

        <nav className="space-y-2">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  pathname === link.href 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : 'text-secondary-foreground hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
