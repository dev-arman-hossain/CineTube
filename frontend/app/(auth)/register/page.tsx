'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Loader2, Play } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { AuthService } from '@/services/authService';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const result = await AuthService.register(data);
      setAuth(result);
      toast.success('Account created successfully!');
      router.push('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="premium-card rounded-3xl p-8 md:p-12"
    >
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold font-outfit tracking-tight">Create Account</h1>
        <p className="text-secondary-foreground text-sm">
          Join the community of cinema lovers
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-secondary-foreground ml-1">Full Name</label>
          <div className="relative group text-white">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              {...register('name')}
              type="text"
              placeholder="John Doe"
              className="w-full bg-secondary/50 border border-white/5 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground"
            />
          </div>
          {errors.name && (
            <p className="text-xs text-primary mt-1 ml-1">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-secondary-foreground ml-1">Email</label>
          <div className="relative group text-white">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              {...register('email')}
              type="email"
              placeholder="name@example.com"
              className="w-full bg-secondary/50 border border-white/5 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground"
            />
          </div>
          {errors.email && (
            <p className="text-xs text-primary mt-1 ml-1">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-secondary-foreground ml-1">Password</label>
          <div className="relative group text-white">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              {...register('password')}
              type="password"
              placeholder="••••••••"
              className="w-full bg-secondary/50 border border-white/5 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground"
            />
          </div>
          {errors.password && (
            <p className="text-xs text-primary mt-1 ml-1">{errors.password.message}</p>
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
              className="w-full bg-secondary/50 border border-white/5 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground"
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-primary mt-1 ml-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          disabled={isLoading}
          className="w-full bg-primary hover:bg-rose-700 text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 group shadow-xl shadow-primary/20 mt-4"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Sign Up
              <Play className="w-4 h-4 fill-white group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center text-sm">
        <span className="text-secondary-foreground">Already have an account? </span>
        <Link href="/login" className="text-primary font-bold hover:underline">
          Sign in here
        </Link>
      </div>
    </motion.div>
  );
};

export default RegisterPage;
