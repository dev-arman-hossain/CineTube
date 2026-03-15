'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Shield, LayoutDashboard, Users, Film, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
    <div className="flex min-h-[calc(100vh-80px)] bg-black">
      {/* Admin Sidebar */}
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
      <main className="flex-grow p-8">
        {children}
      </main>
    </div>
  );
}
