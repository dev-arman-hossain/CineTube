'use client';

import { useState, useEffect } from 'react';
import { AdminAppService } from '@/services/adminService';
import { Users, Film, Star, TrendingUp, MoreVertical, Edit2 } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-secondary/20 p-6 rounded-3xl border border-white/5 space-y-4"
            >
              <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl w-fit`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-secondary-foreground uppercase tracking-widest">{stat.label}</p>
                <p className="text-3xl font-black font-outfit mt-1">{stat.value}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Users Table */}
      <div className="bg-secondary/20 rounded-3xl border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
           <h3 className="font-bold text-lg">Detailed User Management</h3>
           <button className="text-xs text-primary font-bold hover:underline">View All Users</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-black/20 text-xs font-black uppercase tracking-widest text-muted-foreground border-b border-white/5">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.slice(0, 10).map((user) => (
                <tr key={user.id} className="text-sm hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                      {user.name[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase py-1 px-2 rounded-full bg-green-500/10 text-green-500 w-fit">
                       <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                       Active
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={user.role === 'ADMIN' ? 'text-primary' : 'text-blue-400'}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-secondary-foreground text-xs">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                       <button 
                         onClick={() => handleRoleChange(user.id, user.role)}
                         className="p-2 bg-white/5 rounded-lg hover:bg-primary/20 hover:text-primary transition-all"
                         title="Change Role"
                       >
                         <Edit2 className="w-4 h-4" />
                       </button>
                       <button className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100">
                         <MoreVertical className="w-4 h-4" />
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
