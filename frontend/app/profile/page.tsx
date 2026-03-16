'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { User, Camera, Loader2, Save, ArrowLeft, ImagePlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { AuthService } from '@/services/authService';
import { MediaService } from '@/services/mediaService';
import Link from 'next/link';
import { useRef } from 'react';

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  avatar: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, isAuthenticated, updateUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

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

    setIsUploading(true);
    try {
      // 1. Upload to server
      const uploadRes = await MediaService.uploadMedia(file);
      const avatarUrl = uploadRes.url;
      
      // 2. Update profile with new avatar URL
      const updatedUser = await AuthService.updateProfile({ avatar: avatarUrl });
      
      // 3. Sync store
      updateUser(updatedUser);
      setValue('avatar', avatarUrl);
      
      toast.success('Profile picture updated!');
    } catch (error: any) {
      toast.error('Failed to upload image');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  if (!user) return null;

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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-16 h-16 text-primary" />
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
                <label className="text-sm font-medium text-secondary-foreground ml-1">Email Address (Cannot be changed)</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full bg-secondary/30 border border-white/5 rounded-xl py-3.5 px-4 cursor-not-allowed text-white"
                />
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
          </form>
        </motion.div>
      </div>
    </div>
  );
}
