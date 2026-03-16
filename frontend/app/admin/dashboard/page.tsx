'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminAppService } from '@/services/adminService';
import { Users, Film, Star, TrendingUp, Edit2, Shield, Power, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AdminDashboardPage() {
  const queryClient = useQueryClient();

  // Fetch Stats
  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const resp = await AdminAppService.getStats();
      return resp.data;
    },
  });

  // Fetch Users
  const { data: users, isLoading: isUsersLoading } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const resp = await AdminAppService.getAllUsers();
      return resp.data;
    },
  });

  // Update Role Mutation
  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string, newRole: string }) => {
      return await AdminAppService.updateUserRole(userId, newRole);
    },
    onSuccess: () => {
      toast.success('User role updated');
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] }); // Stats might change (admin count)
    },
    onError: () => {
      toast.error('Failed to update role');
    },
  });

  // Suspend/Activate Mutation
  const suspendMutation = useMutation({
    mutationFn: async ({ userId, isSuspended }: { userId: string, isSuspended: boolean }) => {
      return await AdminAppService.suspendUser(userId, isSuspended);
    },
    onSuccess: (_, variables) => {
      toast.success(`User ${variables.isSuspended ? 'suspended' : 'activated'}`);
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
    onError: () => {
      toast.error('Operation failed');
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (userId: string) => {
      return await AdminAppService.deleteUser(userId);
    },
    onSuccess: () => {
      toast.success('User deleted permanently');
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
    onError: () => {
      toast.error('Failed to delete user');
    },
  });

  const handleRoleChange = (userId: string, currentRole: string) => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    updateRoleMutation.mutate({ userId, newRole });
  };

  const handleSuspendToggle = (userId: string, currentIsSuspended: boolean) => {
    suspendMutation.mutate({ userId, isSuspended: !currentIsSuspended });
  };

  const handleDelete = (userId: string) => {
    if (window.confirm('Are you absolutely sure? This action cannot be undone.')) {
      deleteMutation.mutate(userId);
    }
  };

  if (isStatsLoading && !stats) return <div className="text-center py-20 font-black uppercase tracking-widest text-xs animate-pulse">Initializing Dashboard...</div>;

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
          {isUsersLoading && !users ? (
            <div className="text-center py-10 animate-pulse text-[10px] font-black uppercase tracking-widest">Loading Users...</div>
          ) : users?.slice(0, 10).map((user: any, idx: number) => (
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
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    user.isSuspended ? "bg-rose-500" : "bg-green-500 animate-pulse"
                  )} />
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                    {user.isSuspended ? "Suspended" : "Active"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleRoleChange(user.id, user.role)}
                    className="p-2 bg-white/5 rounded-xl border border-white/10 hover:bg-primary transition-all"
                    title="Change Role"
                  >
                    <Shield className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => handleSuspendToggle(user.id, user.isSuspended)}
                    className={cn(
                      "p-2 rounded-xl border transition-all",
                      user.isSuspended 
                        ? "bg-green-500/10 text-green-500 border-green-500/20" 
                        : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                    )}
                    title={user.isSuspended ? "Activate" : "Suspend"}
                  >
                    <Power className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(user.id)}
                    className="p-2 bg-white/5 rounded-xl border border-white/10 hover:bg-rose-600 transition-all"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
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
              {isUsersLoading && !users ? (
                <tr><td colSpan={5} className="text-center py-10 animate-pulse">Loading Users...</td></tr>
              ) : users?.slice(0, 10).map((user: any) => (
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
                    <span className={cn(
                      "flex items-center gap-2 text-[10px] font-black uppercase py-1.5 px-3 rounded-full border w-fit",
                      user.isSuspended 
                        ? "bg-rose-500/10 text-rose-500 border-rose-500/20" 
                        : "bg-green-500/10 text-green-500 border-green-500/20 shadow-sm shadow-green-500/10"
                    )}>
                       <div className={cn(
                         "w-1.5 h-1.5 rounded-full",
                         user.isSuspended ? "bg-rose-500" : "bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"
                       )} />
                       {user.isSuspended ? 'Suspended' : 'Active'}
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
                         <Shield className="w-4 h-4" />
                       </button>
                       <button 
                         onClick={() => handleSuspendToggle(user.id, user.isSuspended)}
                         className={cn(
                           "p-2.5 rounded-xl transition-all border border-white/5 shadow-sm",
                           user.isSuspended 
                             ? "bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white" 
                             : "bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white"
                         )}
                         title={user.isSuspended ? "Activate User" : "Suspend User"}
                       >
                         <Power className="w-4 h-4" />
                       </button>
                       <button 
                         onClick={() => handleDelete(user.id)}
                         className="p-2.5 bg-white/5 rounded-xl hover:bg-rose-600 hover:text-white transition-all border border-white/5 shadow-sm"
                         title="Delete User"
                       >
                         <Trash2 className="w-4 h-4" />
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
