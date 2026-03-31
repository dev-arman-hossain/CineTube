'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Sparkles, Heart, Rocket, X } from 'lucide-react';
import { AuthService } from '@/services/authService';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleAcknowledge = async () => {
    try {
      setIsUpdating(true);
      await AuthService.markWelcomeSeen();
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      onClose();
    } catch (error) {
      console.error('Failed to acknowledge welcome', error);
      onClose(); // Close anyway to not block the user
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden backdrop-blur-2xl flex flex-col"
          >
            {/* Header / Glowing Accent */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
            
            <div className="p-8 sm:p-10 space-y-8 text-center">
              {/* Icon Container */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                  <div className="relative w-20 h-20 rounded-3xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                    <Sparkles className="w-10 h-10 text-primary animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Text Content */}
              <div className="space-y-4">
                <h2 className="text-3xl font-black font-outfit uppercase tracking-tighter leading-none">
                  Welcome to <span className="text-primary italic">CineTube</span>
                </h2>
                <div className="flex items-center justify-center gap-2">
                  <div className="h-[1px] w-8 bg-white/10" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Portfolio Disclosure</p>
                  <div className="h-[1px] w-8 bg-white/10" />
                </div>
                <div className="space-y-6 text-sm text-gray-400 font-medium leading-relaxed">
                  <p>
                    Please note that <span className="text-white font-bold">CineTube</span> is a personal project developed exclusively for <span className="text-primary font-bold uppercase tracking-wider text-xs">skill enhancement</span> and portfolio demonstration.
                  </p>
                  
                  <div className="grid grid-cols-1 gap-3 text-left">
                    <div className="flex items-start gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                      <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <p className="text-xs">This platform is <span className="text-white font-bold">not intended for commercial use</span> or financial profit.</p>
                    </div>
                    <div className="flex items-start gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                      <Rocket className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <p className="text-xs">Designed as a playground for <span className="text-white font-bold">advanced web technologies</span> and UI engineering.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                disabled={isUpdating}
                onClick={handleAcknowledge}
                className="group relative w-full bg-white text-black py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] overflow-hidden transition-all hover:bg-primary hover:text-white"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  I Understand & Continue
                  <Heart className="w-3.5 h-3.5 group-hover:fill-white transition-all" />
                </span>
                <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>
            </div>
            
            <p className="text-[9px] text-center pb-6 font-black uppercase tracking-widest text-muted-foreground/30 italic">
              Crafted with passion by the developer
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
