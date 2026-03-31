'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminAppService } from '@/services/adminService';
import { Shield, Edit2, Search, Calendar, Mail, UserCheck, UserMinus, UserX, Power, Trash2, Globe, Monitor, Smartphone, Activity, Clock, X, Info, Loader2 } from 'lucide-react';
import { parseUserAgent } from '@/lib/deviceInfo';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function UserManagementPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Fetch Users
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const resp = await AdminAppService.getAllUsers();
      return resp.data;
    },
    refetchInterval: 3000, // Auto refresh every 3 seconds to instantly show new registrations
  });

  // Fetch Single User Details for Insight Modal
  const { data: userDetails, isLoading: isDetailsLoading } = useQuery({
    queryKey: ['admin', 'user', selectedUserId],
    queryFn: async () => {
      if (!selectedUserId) return null;
      const resp = await AdminAppService.getUserDetails(selectedUserId);
      return resp.data;
    },
    enabled: !!selectedUserId,
    refetchInterval: 5000, 
  });

  const formatDuration = (login: string, active: string) => {
    const diff = new Date(active).getTime() - new Date(login).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes <= 0) return 'less than 1m';
    return `${minutes}m`;
  };

  // Update Role Mutation
  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string, newRole: string }) => {
      return await AdminAppService.updateUserRole(userId, newRole);
    },
    onSuccess: () => {
      toast.success('User updated');
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
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

  const filteredUsers = users.filter((u: any) => 
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10">
      {/* Dynamic HeaderSection */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 pb-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-black font-outfit tracking-tighter uppercase italic">
            User <span className="text-primary">Registry</span>
          </h1>
          <div className="flex items-center gap-2">
            <div className="h-1 w-12 bg-primary rounded-full" />
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em]">Advanced User Permissions</p>
          </div>
        </div>

        <div className="relative group w-full sm:w-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Identify user..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-secondary/40 border border-white/5 rounded-2xl py-3.5 pl-12 pr-6 text-sm focus:outline-none focus:border-primary/50 focus:bg-secondary/60 transition-all w-full sm:w-80 shadow-inner"
          />
        </div>
      </div>

      <div className="bg-secondary/20 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl backdrop-blur-sm">
         {/* Mobile View: High-Fidelity Cards */}
         <div className="md:hidden divide-y divide-white/5">
            {isLoading ? (
              <div className="text-center py-24 animate-pulse text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">Synchronizing Records...</div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-24 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">Non-identifiable query</div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredUsers.map((user: any, idx: number) => (
                  <motion.div 
                    key={user.id} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.04 }}
                    className="p-6 space-y-6 group active:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary to-black flex items-center justify-center border border-white/10 shadow-2xl overflow-hidden group-hover:border-primary/30 transition-all relative">
                             <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                             {user.avatar ? (
                               <Image 
                                 src={user.avatar} 
                                 alt={user.name} 
                                 fill 
                                 className="object-cover"
                               />
                             ) : (
                               <span className="relative z-10 text-lg font-black text-primary font-outfit">{user.name?.[0].toUpperCase()}</span>
                             )}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-black flex items-center justify-center">
                             <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          </div>
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-black text-base truncate tracking-tight">{user.name}</h4>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                             <Mail className="w-3 h-3" />
                             <p className="text-[11px] font-bold truncate lowercase">{user.email}</p>
                          </div>
                        </div>
                      </div>
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shrink-0 shadow-sm", 
                        user.role === 'ADMIN' ? 'text-primary border-primary/20 bg-primary/5' : 'text-blue-400 border-blue-400/20 bg-blue-400/5'
                      )}>
                        {user.role}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="bg-white/[0.03] p-3 rounded-xl border border-white/5 space-y-1">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                             <Calendar className="w-3 h-3" />
                             <span className="text-[8px] font-black uppercase tracking-widest">Registered</span>
                          </div>
                          <p className="text-[10px] font-black">{new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                       </div>
                        <div className="bg-white/[0.03] p-3 rounded-xl border border-white/5 space-y-1">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                             <UserCheck className="w-3 h-3" />
                             <span className="text-[8px] font-black uppercase tracking-widest">Verify Status</span>
                          </div>
                          <p className={cn(
                            "text-[10px] font-black uppercase",
                            user.isSuspended ? "text-rose-500" : "text-green-500"
                          )}>
                            {user.isSuspended ? "SUSPENDED" : "ACTIVE"}
                          </p>
                       </div>
                    </div>

                    {/* Technical Identity Card */}
                    <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 space-y-3">
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                             <Globe className="w-3 h-3 text-primary" />
                             <span className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground">Network Node</span>
                          </div>
                          <p className="text-[10px] font-black font-mono text-primary">{user.sessions?.[0]?.ipAddress || '0.0.0.0'}</p>
                       </div>
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                             {user.sessions?.[0]?.userAgent && parseUserAgent(user.sessions[0].userAgent).type === 'mobile' ? (
                               <Smartphone className="w-3 h-3 text-primary" />
                             ) : (
                               <Monitor className="w-3 h-3 text-primary" />
                             )}
                             <span className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground">Access Device</span>
                          </div>
                          <p className="text-[10px] font-black truncate max-w-[150px]">
                            {user.sessions?.[0]?.userAgent ? `${parseUserAgent(user.sessions[0].userAgent).os} (${parseUserAgent(user.sessions[0].userAgent).model})` : 'Unknown Access'}
                          </p>
                       </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <button 
                        onClick={() => setSelectedUserId(user.id)}
                        className="h-10 flex items-center justify-center gap-2 bg-primary/10 rounded-xl text-[9px] font-black uppercase tracking-widest border border-primary/20 hover:bg-primary hover:text-white transition-all shadow-lg text-primary"
                        title="User Insights"
                      >
                        <Activity className="w-3 h-3" />
                        Stats
                      </button>

                      <button 
                        onClick={() => handleRoleChange(user.id, user.role)}
                        className="h-10 flex items-center justify-center gap-2 bg-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/10 hover:bg-primary hover:text-white transition-all shadow-lg"
                        title="Change Permissions"
                      >
                        <Shield className="w-3 h-3" />
                        Privs
                      </button>
                      
                      <button 
                        onClick={() => handleSuspendToggle(user.id, user.isSuspended)}
                        className={cn(
                          "h-10 flex items-center justify-center gap-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all shadow-lg",
                          user.isSuspended 
                            ? "bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500 hover:text-white" 
                            : "bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500 hover:text-white"
                        )}
                        title={user.isSuspended ? "Activate User" : "Suspend User"}
                      >
                        <Power className="w-3 h-3" />
                        State
                      </button>

                      <button 
                        onClick={() => handleDelete(user.id)}
                        className="h-10 flex items-center justify-center gap-2 bg-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/10 hover:bg-rose-600 hover:text-white transition-all shadow-lg"
                        title="Delete User"
                      >
                        <Trash2 className="w-3 h-3" />
                        Del
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
         </div>

         {/* Desktop View: Advanced Interaction Table */}
         <div className="hidden md:block overflow-x-auto no-scrollbar">
           <table className="w-full text-left">
             <thead>
               <tr className="bg-white/[0.03] text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground border-b border-white/5">
                 <th className="px-8 py-6">Unique Identity</th>
                 <th className="px-8 py-6">Connectivity</th>
                 <th className="px-8 py-6">Account Status</th>
                 <th className="px-8 py-6 text-center">System Authority</th>
                 <th className="px-8 py-6">Timeline</th>
                 <th className="px-8 py-6 text-right">Administrative</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-white/5">
               {isLoading ? (
                  <tr><td colSpan={5} className="text-center py-20 text-[10px] font-black uppercase tracking-widest animate-pulse">Initializing User Database...</td></tr>
               ) : filteredUsers.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-20 text-muted-foreground uppercase font-black text-xs">No personnel records found</td></tr>
               ) : (
                filteredUsers.map((user: any) => (
                  <tr key={user.id} className="text-sm hover:bg-white/[0.02] transition-all group border-l-4 border-l-transparent hover:border-l-primary">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-secondary to-black flex items-center justify-center border border-white/10 shadow-lg group-hover:scale-105 transition-transform overflow-hidden relative">
                           {user.avatar ? (
                             <Image 
                               src={user.avatar} 
                               alt={user.name} 
                               fill 
                               className="object-cover"
                             />
                           ) : (
                             <span className="font-outfit font-black text-primary text-base">{user.name?.[0].toUpperCase()}</span>
                           )}
                        </div>
                        <div className="min-w-0">
                          <p 
                            onClick={() => setSelectedUserId(user.id)}
                            className="font-black text-white text-base tracking-tight group-hover:text-primary transition-colors cursor-pointer"
                          >
                            {user.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-bold lowercase truncate max-w-[200px]">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
                          <Globe className="w-3 h-3" />
                          <span className="text-[11px] font-black font-mono tracking-tighter">{user.sessions?.[0]?.ipAddress || 'Not Recorded'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground group-hover:text-white transition-colors">
                           {user.sessions?.[0]?.userAgent && parseUserAgent(user.sessions[0].userAgent).type === 'mobile' ? (
                             <Smartphone className="w-3 h-3" />
                           ) : (
                             <Monitor className="w-3 h-3" />
                           )}
                           <span className="text-[10px] font-bold truncate max-w-[150px]">
                             {user.sessions?.[0]?.userAgent 
                               ? `${parseUserAgent(user.sessions[0].userAgent).os} (${parseUserAgent(user.sessions[0].userAgent).model})` 
                               : 'Unknown Origin'}
                           </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <span className={cn(
                         "inline-flex items-center gap-2 text-[10px] font-black uppercase px-3 py-1.5 rounded-full border shadow-sm",
                         user.isSuspended 
                           ? "bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-rose-500/10" 
                           : "bg-green-500/10 text-green-500 border-green-500/20 shadow-green-500/10"
                       )}>
                          <div className={cn(
                            "w-1.5 h-1.5 rounded-full animate-pulse",
                            user.isSuspended ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]" : "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"
                          )} />
                          {user.isSuspended ? 'Suspended' : 'Authorized'}
                       </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <div className="flex items-center justify-center gap-2">
                          {user.role === 'ADMIN' && <Shield className="w-4 h-4 text-primary animate-bounce-slow" />}
                          <span className={cn(
                            "px-4 py-1.5 rounded-xl text-[10px] font-black titlecase tracking-widest border shadow-xl transition-all duration-300", 
                            user.role === 'ADMIN' ? 'bg-primary/20 text-primary border-primary/30' : 'bg-blue-400/20 text-blue-400 border-blue-400/30'
                          )}>
                             {user.role}
                          </span>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="space-y-1">
                          <p className="text-[10px] font-black text-white uppercase tracking-tighter">Registered On</p>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase">{new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</p>
                       </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex items-center justify-end gap-2 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                         <button 
                           onClick={() => setSelectedUserId(user.id)}
                           className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all border border-primary/20 shadow-lg"
                           title="View Detailed Analytics"
                         >
                           <Activity className="w-3.5 h-3.5" />
                           Insights
                         </button>

                         <button 
                           onClick={() => handleRoleChange(user.id, user.role)}
                           className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all border border-white/5"
                           title="Change Role"
                         >
                           <Shield className="w-3.5 h-3.5" />
                           {user.role === 'ADMIN' ? 'Demote' : 'Promote'}
                         </button>

                         <button 
                           onClick={() => handleSuspendToggle(user.id, user.isSuspended)}
                           className={cn(
                             "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border",
                             user.isSuspended 
                               ? "bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500 hover:text-white" 
                               : "bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500 hover:text-white"
                           )}
                           title={user.isSuspended ? "Activate" : "Suspend"}
                         >
                           <Power className="w-3.5 h-3.5" />
                           {user.isSuspended ? 'Active' : 'Suspend'}
                         </button>

                         <button 
                           onClick={() => handleDelete(user.id)}
                           className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all border border-white/5"
                           title="Permanently Delete"
                         >
                           <Trash2 className="w-3.5 h-3.5" />
                           Delete
                         </button>
                       </div>
                    </td>
                  </tr>
                ))
               )}
             </tbody>
           </table>
         </div>
      </div>
      {/* User Insights Modal */}
      <AnimatePresence>
        {selectedUserId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUserId(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0a0a0a]/90 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden backdrop-blur-xl flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30">
                    <Activity className="w-6 h-6 text-primary animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black font-outfit uppercase tracking-tighter">User <span className="text-primary">Insights</span></h2>
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Real-time session analytics</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedUserId(null)}
                  className="p-3 hover:bg-white/10 rounded-2xl transition-colors text-muted-foreground hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-8">
                {isDetailsLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Fetching Intelligence...</p>
                  </div>
                ) : userDetails ? (
                  <>
                    {/* Top Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-white/5 p-6 rounded-3xl border border-white/5 space-y-2">
                        <div className="flex items-center gap-2 text-primary">
                          <Globe className="w-4 h-4" />
                          <span className="text-[9px] font-black uppercase tracking-widest">Active nodes</span>
                        </div>
                        <p className="text-3xl font-black">{userDetails.sessions.length}</p>
                        <p className="text-[10px] text-muted-foreground font-bold">Concurrent locations</p>
                      </div>
                      <div className="bg-white/5 p-6 rounded-3xl border border-white/5 space-y-2">
                        <div className="flex items-center gap-2 text-primary">
                          <Clock className="w-4 h-4" />
                          <span className="text-[9px] font-black uppercase tracking-widest">Last Stay</span>
                        </div>
                        <p className="text-3xl font-black">
                          {userDetails.sessions?.[0] ? formatDuration(userDetails.sessions[0].loginTime, userDetails.sessions[0].lastActive) : '0m'}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-bold">Active duration</p>
                      </div>
                      <div className="bg-white/5 p-6 rounded-3xl border border-white/5 space-y-2">
                        <div className="flex items-center gap-2 text-primary">
                          <Calendar className="w-4 h-4" />
                          <span className="text-[9px] font-black uppercase tracking-widest">Member Since</span>
                        </div>
                        <p className="text-xl font-black truncate">{new Date(userDetails.createdAt).toLocaleDateString()}</p>
                        <p className="text-[10px] text-muted-foreground font-bold italic">{userDetails.isPremium ? 'Premium Identity' : 'Standard Identity'}</p>
                      </div>
                    </div>

                    {/* Session Log */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 px-2">
                        <Info className="w-4 h-4 text-primary" />
                        <h3 className="text-sm font-black uppercase tracking-widest">Session History</h3>
                      </div>
                      <div className="space-y-3">
                        {userDetails.sessions.map((session: any) => (
                          <div key={session.id} className="bg-white/[0.02] p-4 rounded-2xl border border-white/5 flex items-center justify-between group hover:bg-white/[0.05] transition-colors">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center border border-white/10">
                                {parseUserAgent(session.userAgent).type === 'mobile' ? <Smartphone className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-black truncate max-w-[200px]">{parseUserAgent(session.userAgent).os} ({parseUserAgent(session.userAgent).model})</p>
                                <p className="text-[10px] text-muted-foreground font-mono">{session.ipAddress}</p>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-[10px] font-black text-primary uppercase">Stayed {formatDuration(session.loginTime, session.lastActive)}</p>
                              <p className="text-[9px] text-muted-foreground font-bold uppercase">{new Date(session.loginTime).toLocaleDateString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-20 text-muted-foreground">Target profile offline or non-existent</div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-6 bg-white/5 border-t border-white/5 flex justify-end">
                <button 
                  onClick={() => setSelectedUserId(null)}
                  className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
                >
                  Terminate View
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
