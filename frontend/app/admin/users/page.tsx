'use client';

import { useState, useEffect } from 'react';
import { AdminAppService } from '@/services/adminService';
import { User, Shield, Edit2, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await AdminAppService.getAllUsers();
      setUsers(response.data);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    try {
      await AdminAppService.updateUserRole(userId, newRole);
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      toast.success('User role updated successfully');
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black font-outfit tracking-tight">User <span className="text-primary">Management</span></h1>
          <p className="text-secondary-foreground text-sm">Control access and permissions for all registered users.</p>
        </div>

        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-secondary/50 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-primary transition-all w-72"
          />
        </div>
      </div>

      <div className="bg-secondary/20 rounded-3xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-black/20 text-xs font-black uppercase tracking-widest text-muted-foreground border-b border-white/5">
                <th className="px-6 py-4">Full Name</th>
                <th className="px-6 py-4">Email Address</th>
                <th className="px-6 py-4">Current Role</th>
                <th className="px-6 py-4">Registration Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr><td colSpan={5} className="text-center py-10">Loading users...</td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-10 text-muted-foreground">No users match your search</td></tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="text-sm hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                         <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center border border-white/10 text-xs font-bold text-secondary-foreground">
                            {user.name[0].toUpperCase()}
                         </div>
                         <p className="font-bold">{user.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-secondary-foreground">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                         {user.role === 'ADMIN' && <Shield className="w-3.5 h-3.5 text-primary" />}
                         <span className={user.role === 'ADMIN' ? 'text-primary font-bold' : 'text-blue-400 font-medium'}>
                           {user.role}
                         </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-secondary-foreground">
                       {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button 
                         onClick={() => handleRoleChange(user.id, user.role)}
                         className="flex items-center gap-2 ml-auto px-4 py-2 bg-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-lg"
                       >
                         <Edit2 className="w-3 h-3" />
                         Promote/Demote
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
