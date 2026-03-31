'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Camera, Loader2, Save, ArrowLeft, ImagePlus, Clock, ShieldCheck, Monitor, Globe, Settings, Shield, Activity } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { AuthService } from '@/services/authService';
import Link from 'next/link';
import { useRef } from 'react';

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  avatar: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, isAuthenticated, updateUser, fetchMe } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      avatar: user?.avatar || '',
    },
  });

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      // Fetch latest user data on mount
      fetchMe().catch(() => {
        router.push('/login');
      });
    }
  }, [mounted, isAuthenticated, router, fetchMe]);

  // Sync avatarPreview with the store user avatar on mount
  useEffect(() => {
    if (user?.avatar) setAvatarPreview(user.avatar);
  }, [user?.avatar]);

  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    try {
      const result = await AuthService.updateProfile(data);
      updateUser(result);
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Immediately show a local blob preview while uploading
    const localPreview = URL.createObjectURL(file);
    setAvatarPreview(localPreview);
    setIsUploading(true);

    try {
      // uploadAvatar uploads to Cloudinary and updates the profile in one step
      const updatedUser = await AuthService.uploadAvatar(file);

      if (updatedUser && updatedUser.avatar) {
        // Use the real Cloudinary URL from response
        const cloudinaryUrl = updatedUser.avatar;
        setAvatarPreview(cloudinaryUrl);
        setValue('avatar', cloudinaryUrl);
        updateUser(updatedUser);
        toast.success('Profile picture updated!');
      } else {
        throw new Error('No avatar URL returned from server');
      }
    } catch (error: any) {
      // Revert preview on failure
      setAvatarPreview(user?.avatar || null);
      toast.error(error.response?.data?.message || 'Failed to upload image');
      console.error('Avatar upload error:', error);
    } finally {
      setIsUploading(false);
      // Clean up the blob URL
      URL.revokeObjectURL(localPreview);
    }
  };

  if (!mounted || !user) return null;


  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-12 bg-black">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-secondary-foreground hover:text-white transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-dark border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl"
        >
          <div className="mb-12">
            <h1 className="text-4xl font-black font-outfit uppercase tracking-tighter mb-2">My Profile</h1>
            <p className="text-secondary-foreground">Manage your account settings and preferences</p>
          </div>

          <div className="flex p-1.5 bg-white/5 rounded-2xl mb-12 border border-white/5 backdrop-blur-xl relative overflow-hidden group">
            <div 
              className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-primary rounded-xl transition-all duration-500 ease-out shadow-2xl shadow-primary/20 ${
                activeTab === 'profile' ? 'translate-x-0' : 'translate-x-full'
              }`}
            />
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 relative z-10 transition-colors duration-300 ${
                activeTab === 'profile' ? 'text-white' : 'text-secondary-foreground hover:text-white'
              }`}
            >
              <User className={`w-4 h-4 transition-transform ${activeTab === 'profile' ? 'scale-110' : ''}`} />
              <span className="text-sm font-bold uppercase tracking-widest font-outfit">Identity</span>
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 relative z-10 transition-colors duration-300 ${
                activeTab === 'security' ? 'text-white' : 'text-secondary-foreground hover:text-white'
              }`}
            >
              <Shield className={`w-4 h-4 transition-transform ${activeTab === 'security' ? 'scale-110' : ''}`} />
              <span className="text-sm font-bold uppercase tracking-widest font-outfit">Security</span>
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="min-h-[400px]">
            <AnimatePresence mode="wait">
              {activeTab === 'profile' ? (
                <motion.div
                  key="profile-tab"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-8"
                >
                  <div className="flex flex-col items-center gap-4 mb-8">
                    <div className="relative group">
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden" 
                        accept="image/*"
                      />
                      <div className="w-32 h-32 rounded-full bg-primary/20 border-2 border-white/10 flex items-center justify-center overflow-hidden shadow-2xl relative">
                        {isUploading && (
                          <div className="absolute inset-0 bg-black/60 z-10 flex items-center justify-center backdrop-blur-sm">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                          </div>
                        )}
                        {avatarPreview ? (
                          <Image 
                            src={avatarPreview} 
                            alt={user.name} 
                            fill
                            className="w-full h-full object-cover"
                            priority={false}
                            sizes="128px"
                          />
                        ) : (
                            <span className="relative z-10 text-4xl font-black text-primary font-outfit uppercase">
                              {user.name?.[0]}
                            </span>
                        )}
                      </div>
                      <button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 p-3 bg-primary text-white rounded-full shadow-xl hover:bg-rose-700 transition-all hover:scale-110 active:scale-95 z-20 border-2 border-black"
                        title="Upload Avatar"
                      >
                        <Camera className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">Profile Identity</p>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-secondary-foreground ml-1">Full Name</label>
                      <input
                        {...register('name')}
                        type="text"
                        className="w-full bg-secondary/50 border border-white/5 rounded-xl py-3.5 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-white"
                        placeholder="Enter your name"
                      />
                      {errors.name && (
                        <p className="text-xs text-primary mt-1 ml-1">{errors.name.message}</p>
                      )}
                    </div>

                    <div className="space-y-2 opacity-60">
                      <label className="text-sm font-medium text-secondary-foreground ml-1">Email Address</label>
                      <div className="w-full bg-secondary/30 border border-white/5 rounded-xl py-3.5 px-4 cursor-not-allowed text-white flex items-center gap-3">
                         <User className="w-4 h-4 text-muted-foreground" />
                         <span>{user.email}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-secondary-foreground ml-1">Avatar URL</label>
                      <input
                        {...register('avatar')}
                        type="text"
                        className="w-full bg-secondary/50 border border-white/5 rounded-xl py-3.5 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-white"
                        placeholder="https://example.com/avatar.jpg"
                      />
                    </div>
                  </div>

                  <button
                    disabled={isLoading}
                    className="w-full bg-primary hover:bg-rose-700 text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 group shadow-xl shadow-primary/20 mt-8"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save Changes
                      </>
                    )}
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="security-tab"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-secondary-foreground ml-1 flex items-center gap-2">
                       <Activity className="w-4 h-4 text-primary" />
                       Last Session Status
                    </label>
                    <div className="w-full bg-secondary/20 border border-white/10 rounded-xl py-5 px-6 flex items-center justify-between shadow-inner">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/20 rounded-2xl">
                           <Clock className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                           <p className="text-xs text-secondary-foreground uppercase tracking-wider font-bold mb-1">Time Spotted</p>
                           <p className="text-xl font-bold text-white uppercase tracking-tighter">
                            {user.lastLogin 
                              ? new Date(user.lastLogin).toLocaleString('en-US', { 
                                  dateStyle: 'medium', 
                                  timeStyle: 'short' 
                                }) 
                              : 'Initial Session'}
                           </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                         <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                         <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Logged In</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-white/10 space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <ShieldCheck className="w-5 h-5 text-primary" />
                      <h3 className="text-xl font-bold font-outfit uppercase tracking-tight text-white">Advanced Session logs</h3>
                    </div>
                    
                    <div className="space-y-3">
                      {user.sessions && user.sessions.length > 0 ? (
                        user.sessions.map((session, index) => (
                          <motion.div 
                            key={session.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center justify-between p-4 rounded-2xl bg-secondary/10 border border-white/5 hover:bg-secondary/20 transition-all group"
                          >
                            <div className="flex items-center gap-4">
                              <div className="p-2.5 rounded-xl bg-white/5 text-secondary-foreground group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                <Monitor className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-white group-hover:text-primary transition-colors">
                                  {new Date(session.loginTime).toLocaleString('en-US', { 
                                    dateStyle: 'medium', 
                                    timeStyle: 'short' 
                                  })}
                                </p>
                                <p className="text-xs text-secondary-foreground flex items-center gap-1.5 mt-0.5">
                                  <Globe className="w-3 h-3 opacity-50" />
                                  {session.ipAddress || 'Unknown IP'} • {session.userAgent ? (session.userAgent.includes('Windows') ? 'Windows Pro' : session.userAgent.includes('Mac') ? 'macOS Safari' : 'Mobile/Tablet') : 'Unknown Context'}
                                </p>
                              </div>
                            </div>
                            {index === 0 && (
                              <div className="flex flex-col items-end gap-1">
                                <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                                  Primary
                                </span>
                              </div>
                            )}
                          </motion.div>
                        ))
                      ) : (
                        <div className="text-center py-12 bg-secondary/5 rounded-3xl border border-dashed border-white/10">
                          <p className="text-sm text-secondary-foreground">Zero session artifacts found.</p>
                        </div>
                      )}
                    </div>
                    <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-start gap-3">
                        <Shield className="w-4 h-4 text-emerald-500 mt-0.5" />
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest leading-relaxed">Security Protocol: CineTube tracks the last 10 session checkpoints to ensure account sovereignty. Regular audits recommended.</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
