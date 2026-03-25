'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { SubscriptionService } from '@/services/subscriptionService';
import { Check, Zap, Star, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Basic access to public content',
    features: [
      'Standard video quality',
      'Public movie reviews',
      'Watchlist sync',
      'Ads included',
    ],
    buttonText: 'Current Plan',
    buttonClass: 'bg-white/10 text-white cursor-default',
    disabled: true,
  },
  {
    name: 'Pro Monthly',
    id: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID || 'price_1TF0MWLpRxg0enN5bFP11dj0',
    price: '$9.99',
    period: '/month',
    description: 'Unlock all premium titles and features',
    features: [
      'HD Streaming',
      'Ad-free experience',
      'Premium exclusive titles',
      'Priority support',
      'Cancel anytime',
    ],
    buttonText: 'Get Started',
    buttonClass: 'bg-primary text-white hover:bg-rose-700 shadow-xl shadow-primary/20',
    popular: true,
    type: 'subscription',
  },
  {
    name: 'Yearly Pro',
    id: process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID || 'price_1TF0MZLpRxg0enN5SLYlnkwP',
    price: '$99.99',
    period: '/year',
    description: 'One-time payment for perpetual premium access',
    features: [
      'All Pro features',
      'Lifetime access',
      'Exclusive member badge',
      'Offline viewing (coming soon)',
      'No subscription renewal',
    ],
    buttonText: 'Buy Once',
    buttonClass: 'bg-white text-black hover:bg-neutral-200',
    type: 'one-time',
  },
];

export default function PricingPage() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleSubscription = async (priceId: string, type: 'subscription' | 'one-time') => {
    if (!isAuthenticated) {
      toast.error('Please login to subscribe');
      router.push('/login');
      return;
    }

    if ((user as any)?.isPremium && type === 'subscription') {
      toast.error('You already have a premium subscription');
      return;
    }

    try {
      setLoadingId(priceId);
      const response = await SubscriptionService.createCheckoutSession(priceId, type as any);
      if (response.success && response.data.sessionUrl) {
        window.location.href = response.data.sessionUrl;
      }
    } catch (error) {
      toast.error('Failed to initiate checkout');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen py-20 px-4 md:px-12 bg-black relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10 opacity-50" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-rose-900/10 rounded-full blur-[120px] -z-10 opacity-30" />

      <div className="max-w-6xl mx-auto text-center space-y-4 mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-black font-outfit uppercase tracking-tighter"
        >
          Elevate Your <span className="text-primary italic">Cinema</span> Experience
        </motion.h1>
        <p className="text-secondary-foreground text-lg max-w-2xl mx-auto">
          Choose the plan that fits your lifestyle. Unlock premium content and support the future of independent cinema.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative flex flex-col p-8 rounded-[2.5rem] bg-neutral-950 border border-white/5 shadow-2xl transition-all hover:border-primary/50 group ${plan.popular ? 'md:scale-105 z-10' : ''}`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5 border border-white/20">
                <Star className="w-3 h-3 fill-white" />
                Most Popular
              </div>
            )}

            <div className="space-y-2 mb-8">
              <h3 className="text-xl font-bold font-outfit">{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black">{plan.price}</span>
                <span className="text-muted-foreground text-sm font-medium">{plan.period}</span>
              </div>
              <p className="text-sm text-secondary-foreground">{plan.description}</p>
            </div>

            <div className="space-y-4 flex-grow mb-8">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-center gap-3 text-sm">
                  <div className="bg-primary/10 p-1 rounded-full border border-primary/20">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-neutral-300 font-medium">{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => !plan.disabled && handleSubscription(plan.id!, plan.type as any)}
              disabled={plan.disabled || loadingId === plan.id || ((user as any)?.isPremium && plan.type === 'subscription')}
              className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${plan.buttonClass} disabled:opacity-50`}
            >
              {loadingId === plan.id 
                ? 'Loading...' 
                : ((user as any)?.isPremium && plan.type === 'subscription' && (user as any)?.subscriptionStatus === (plan.name.toLowerCase().includes('monthly') ? 'active' : 'yearly_active')) // Note: simple check for now
                  ? 'Current Plan'
                  : ((user as any)?.isPremium && plan.type === 'subscription')
                    ? 'Subscribed'
                    : plan.buttonText
              }
            </button>
            
            {plan.popular && (
              <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                <ShieldCheck className="w-3 h-3" />
                Secure checkout via Stripe
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="mt-20 max-w-4xl mx-auto p-8 rounded-3xl bg-secondary/20 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-2 text-center md:text-left">
          <h4 className="text-2xl font-bold font-outfit">Already have a code?</h4>
          <p className="text-sm text-secondary-foreground">Redeem your gift card or promo code to unlock premium features.</p>
        </div>
        <button className="px-8 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-bold hover:bg-white/10 transition-all whitespace-nowrap">
          Redeem Code
        </button>
      </div>
    </div>
  );
}
