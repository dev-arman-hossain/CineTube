'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Mail, Loader2, Play } from 'lucide-react';
import toast from 'react-hot-toast';
import { AuthService } from '@/services/authService';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    try {
      await AuthService.forgotPassword(data.email);
      setIsSubmitted(true);
      toast.success('Reset link sent! Check your email.');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="premium-card rounded-3xl p-8 md:p-12 text-center"
      >
        <div className="inline-flex bg-primary/20 p-3 rounded-xl mb-6">
          <Mail className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold font-outfit tracking-tight mb-4">Check Your Email</h1>
        <p className="text-secondary-foreground text-sm mb-8">
          We've sent a password reset link to your email address. Please click the link to reset your password.
        </p>
        <Link 
          href="/login" 
          className="inline-flex items-center text-primary font-bold hover:underline"
        >
          Back to Login
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
        <h1 className="text-3xl font-bold font-outfit tracking-tight">Forgot Password?</h1>
        <p className="text-secondary-foreground text-sm">
          No worries! Enter your email and we'll send you a reset link.
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

        <button
          disabled={isLoading}
          className="w-full bg-primary hover:bg-rose-700 text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 group shadow-xl shadow-primary/20"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Send Reset Link
              <Play className="w-4 h-4 fill-white group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center text-sm">
        <Link href="/login" className="text-secondary-foreground hover:text-primary transition-colors flex items-center justify-center gap-2">
          Ready to login? <span className="text-primary font-bold hover:underline">Sign In</span>
        </Link>
      </div>
    </motion.div>
  );
};

export default ForgotPasswordPage;
