'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, Play } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { AuthService } from '@/services/authService';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const result = await AuthService.login(data);
      setAuth(result);
      toast.success('Signed in successfully!');
      router.push('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-dark border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl"
    >
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex bg-primary/20 p-3 rounded-xl mb-4">
          <Play className="w-8 h-8 fill-primary text-primary" />
        </div>
        <h1 className="text-3xl font-bold font-outfit tracking-tight">Welcome Back</h1>
        <p className="text-secondary-foreground text-sm">
          Sign in to your CineTube account
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-secondary-foreground ml-1">Email</label>
          <div className="relative group text-white">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              {...register('email')}
              type="email"
              placeholder="name@example.com"
              className="w-full bg-secondary/50 border border-white/5 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground"
            />
          </div>
          {errors.email && (
            <p className="text-xs text-primary mt-1 ml-1">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center ml-1">
            <label className="text-sm font-medium text-secondary-foreground">Password</label>
            <Link href="/forgot-password" title="Forgot Password" className="text-xs text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative group text-white">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              {...register('password')}
              type="password"
              placeholder="••••••••"
              className="w-full bg-secondary/50 border border-white/5 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground"
            />
          </div>
          {errors.password && (
            <p className="text-xs text-primary mt-1 ml-1">{errors.password.message}</p>
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
              Sign In
              <Play className="w-4 h-4 fill-white group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center text-sm">
        <span className="text-secondary-foreground">Don't have an account? </span>
        <Link href="/register" className="text-primary font-bold hover:underline">
          Sign up now
        </Link>
      </div>
    </motion.div>
  );
};

export default LoginPage;
