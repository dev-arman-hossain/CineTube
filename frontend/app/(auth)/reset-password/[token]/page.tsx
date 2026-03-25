'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Lock, Loader2, Play, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { AuthService } from '@/services/authService';

const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const ResetPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const { token } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setIsLoading(true);
    try {
      await AuthService.resetPassword({
        token: token as string,
        newPassword: data.newPassword,
      });
      setIsSuccess(true);
      toast.success('Password reset successfully!');
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Reset failed. Token may be invalid or expired.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="premium-card rounded-3xl p-8 md:p-12 text-center"
      >
        <div className="inline-flex bg-green-500/20 p-3 rounded-xl mb-6">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold font-outfit tracking-tight mb-4">Password Reset!</h1>
        <p className="text-secondary-foreground text-sm mb-8">
          Your password has been successfully reset. You will be redirected to the login page in a few seconds.
        </p>
        <Link 
          href="/login" 
          className="inline-flex items-center text-primary font-bold hover:underline"
        >
          Go to Login Now
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="premium-card rounded-3xl p-8 md:p-12"
    >
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold font-outfit tracking-tight">Set New Password</h1>
        <p className="text-secondary-foreground text-sm">
          Please enter your new password below.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-secondary-foreground ml-1">New Password</label>
          <div className="relative group text-white">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              {...register('newPassword')}
              type="password"
              placeholder="••••••••"
              className="w-full bg-secondary/50 border border-white/5 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground"
            />
          </div>
          {errors.newPassword && (
            <p className="text-xs text-primary mt-1 ml-1">{errors.newPassword.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-secondary-foreground ml-1">Confirm Password</label>
          <div className="relative group text-white">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              {...register('confirmPassword')}
              type="password"
              placeholder="••••••••"
              className="w-full bg-secondary/50 border border-white/5 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground"
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-primary mt-1 ml-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          disabled={isLoading}
          className="w-full bg-primary hover:bg-rose-700 text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 group shadow-xl shadow-primary/20"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Reset Password
              <Play className="w-4 h-4 fill-white group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default ResetPasswordPage;
