'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminAppService } from '@/services/adminService';
import { Shield, Edit2, Search, Calendar, Mail, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function UserManagementPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch Users
  const { data: users = [], isLoading } = useQuery({
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
      toast.success('User updated');
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
    onError: () => {
      toast.error('Failed to update role');
    },
  });

  const handleRoleChange = (userId: string, currentRole: string) => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    updateRoleMutation.mutate({ userId, newRole });
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
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary to-black flex items-center justify-center border border-white/10 shadow-2xl overflow-hidden group-hover:border-primary/30 transition-all">
                             <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                             <span className="relative z-10 text-lg font-black text-primary font-outfit">{user.name?.[0].toUpperCase()}</span>
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
                          <p className="text-[10px] font-black text-green-500 uppercase">ACTIVE</p>
                       </div>
                    </div>

                    <button 
                      onClick={() => handleRoleChange(user.id, user.role)}
                      className="w-full h-12 flex items-center justify-center gap-2 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border border-white/10 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-xl shadow-black/50 overflow-hidden relative group/btn"
                    >
                      <div className="absolute inset-0 bg-primary/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                      <Edit2 className="w-3.5 h-3.5 relative z-10" />
                      <span className="relative z-10">Modify Privileges</span>
                    </button>
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
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-secondary to-black flex items-center justify-center border border-white/10 shadow-lg group-hover:scale-105 transition-transform">
                           <span className="font-outfit font-black text-primary text-base">{user.name?.[0].toUpperCase()}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-black text-white text-base tracking-tight group-hover:text-primary transition-colors">{user.name}</p>
                          <p className="text-[10px] text-muted-foreground font-bold lowercase truncate max-w-[200px]">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase px-3 py-1.5 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 shadow-sm shadow-green-500/10">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
                          Authorized
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
                       <button 
                         onClick={() => handleRoleChange(user.id, user.role)}
                         className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] hover:bg-primary hover:text-white transition-all border border-white/5 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 group-hover:shadow-2xl shadow-primary/40 duration-300"
                       >
                         <Edit2 className="w-3.5 h-3.5" />
                         Elevate
                       </button>
                    </td>
                  </tr>
                ))
               )}
             </tbody>
           </table>
         </div>
      </div>
    </div>
  );
}
