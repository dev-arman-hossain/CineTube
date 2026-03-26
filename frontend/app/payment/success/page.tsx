'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, ChevronRight, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { SubscriptionService } from '@/services/subscriptionService';

import { Suspense } from 'react';

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { user, fetchMe } = useAuthStore();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const activate = async () => {
      // Verify with Stripe and update isPremium in DB, then refresh user
      if (sessionId) {
        try {
          await SubscriptionService.verifySession(sessionId);
        } catch (e) {
          // session may already be verified — safe to ignore
        }
      }
      await fetchMe();
    };

    activate();

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router, fetchMe, sessionId]);


  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-8 border border-primary/30"
      >
        <CheckCircle2 className="w-12 h-12 text-primary" />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-4 max-w-md"
      >
        <h1 className="text-4xl font-black font-outfit uppercase tracking-tighter">
          Payment <span className="text-primary italic">Successful</span>!
        </h1>
        <p className="text-secondary-foreground">
          Welcome to the CineTube Pro family, <span className="text-white font-bold">{user?.name}</span>. 
          Your premium access has been activated. Enjoy unlimited streaming!
        </p>
        
        <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/"
            className="flex items-center justify-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-rose-700 transition-all"
          >
            Start Watching
            <Play className="w-4 h-4 fill-white" />
          </Link>
          <Link 
            href="/watchlist"
            className="flex items-center justify-center gap-2 px-8 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-bold hover:bg-white/10 transition-all"
          >
            Go to Watchlist
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <p className="text-xs text-muted-foreground pt-12">
          Redirecting to home in {countdown} seconds...
        </p>
      </motion.div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center">Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
