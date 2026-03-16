'use client';

import { useState, useEffect } from 'react';
import { AdminAppService } from '@/services/adminService';
import { Users, Film, Star, TrendingUp, MoreVertical, Edit2 } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          AdminAppService.getStats(),
          AdminAppService.getAllUsers(),
        ]);
        setStats(statsRes.data);
        setUsers(usersRes.data);
      } catch (error) {
        toast.error('Failed to fetch admin data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRoleChange = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    try {
      await AdminAppService.updateUserRole(userId, newRole);
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      toast.success('User role updated');
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  if (isLoading) return <div className="text-center py-20">Loading dashboard...</div>;

  const statCards = [
    { label: 'Total Users', value: stats?.userCount, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Media Items', value: stats?.mediaCount, icon: Film, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Average Rating', value: stats?.avgRating?.toFixed(1) || '0.0', icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { label: 'Active Sessions', value: '42', icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-500/10' },
  ];

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-black font-outfit tracking-tight">System <span className="text-primary">Overview</span></h1>
        <p className="text-secondary-foreground text-sm">Real-time performance and user statistics.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-secondary/20 p-5 md:p-6 rounded-[2rem] border border-white/5 space-y-4 relative overflow-hidden group hover:border-primary/30 transition-all duration-500 shadow-lg shadow-black/50"
            >
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
              <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl w-fit relative z-10 shadow-lg border border-white/5`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="relative z-10">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{stat.label}</p>
                <p className="text-3xl font-black font-outfit mt-1 tracking-tighter">{stat.value}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Users Section */}
      <div className="bg-secondary/20 rounded-3xl border border-white/5 overflow-hidden">
        <div className="p-5 md:p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
            <div>
              <h3 className="font-black text-lg md:text-xl font-outfit uppercase tracking-tight">Active <span className="text-primary">Users</span></h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Manage system access</p>
            </div>
            <button className="text-[10px] md:text-xs text-primary font-black uppercase tracking-widest hover:underline">View All</button>
        </div>

        {/* Mobile View: Card List */}
        <div className="md:hidden divide-y divide-white/5">
          {users.slice(0, 10).map((user, idx) => (
            <motion.div 
              key={user.id} 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-sm font-black text-primary border border-primary/20 shadow-inner">
                    {user.name?.[0].toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-black text-sm">{user.name}</h4>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <span className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border", 
                  user.role === 'ADMIN' ? 'text-primary border-primary/20 bg-primary/5' : 'text-blue-400 border-blue-400/20 bg-blue-400/5'
                )}>
                  {user.role}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Active Status</span>
                </div>
                <button 
                  onClick={() => handleRoleChange(user.id, user.role)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all border border-white/10"
                >
                  <Edit2 className="w-3 h-3" />
                  Change Role
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Desktop View: Solid Table */}
        <div className="hidden md:block overflow-x-auto no-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-black/30 text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground border-b border-white/5">
                <th className="px-5 md:px-6 py-5">User Identity</th>
                <th className="px-5 md:px-6 py-5">Status</th>
                <th className="px-5 md:px-6 py-5">System Role</th>
                <th className="px-5 md:px-6 py-5 hidden lg:table-cell">Joined Date</th>
                <th className="px-5 md:px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.slice(0, 10).map((user) => (
                <tr key={user.id} className="text-xs md:text-sm hover:bg-white/5 transition-colors group">
                  <td className="px-5 md:px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-xs font-black text-primary shrink-0 border border-primary/10">
                        {user.name?.[0].toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-black tracking-tight text-white">{user.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 md:px-6 py-5">
                    <span className="flex items-center gap-2 text-[10px] font-black uppercase py-1.5 px-3 rounded-full bg-green-500/10 text-green-500 w-fit border border-green-500/20">
                       <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                       Active
                    </span>
                  </td>
                  <td className="px-5 md:px-6 py-5">
                    <span className={cn(
                      "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border shadow-sm", 
                      user.role === 'ADMIN' ? 'text-primary border-primary/30 bg-primary/10' : 'text-blue-400 border-blue-400/30 bg-blue-400/10'
                    )}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 md:px-6 py-5 hidden lg:table-cell text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
                    {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-5 md:px-6 py-5 text-right">
                    <div className="flex justify-end gap-2">
                       <button 
                         onClick={() => handleRoleChange(user.id, user.role)}
                         className="p-2.5 bg-white/5 rounded-xl hover:bg-primary hover:text-white transition-all border border-white/5 shadow-sm"
                         title="Change Role"
                       >
                         <Edit2 className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
