'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { MediaService } from '@/services/mediaService';
import { WatchlistService } from '@/services/watchlistService';
import { useAuthStore } from '@/store/authStore';
import { Media } from '@/types';
import { Play, Star, Calendar, Clock, Globe, User, Plus, Check, Bookmark, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import ReviewSection from './ReviewSection';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function MediaDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [media, setMedia] = useState<Media | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [inWatchlist, setInWatchlist] = useState(false);
  const { isAuthenticated } = useAuthStore();

  const fetchMedia = async () => {
    try {
      const response = await MediaService.getMediaById(id as string);
      setMedia(response.data);
    } catch (error) {
      console.error('Failed to fetch media details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
    
    // Check if in watchlist
    if (isAuthenticated) {
      const checkWatchlist = async () => {
        try {
          const response = await WatchlistService.getMyWatchlist();
          const exists = response.data.some((item: any) => item.mediaId === id);
          setInWatchlist(exists);
        } catch (error) {
          console.error('Failed to check watchlist:', error);
        }
      };
      checkWatchlist();
    }
  }, [id, isAuthenticated]);

  const handleWatchlistToggle = async () => {
    if (!isAuthenticated) return router.push('/login');
    try {
      toast.success(result.data.added ? 'Added to watchlist' : 'Removed from watchlist');
    } catch (error) {
      toast.error('Failed to update watchlist');
    }
  };

  if (isLoading) {
    return (
      <div className="md:px-12 px-4 py-8 space-y-8 animate-pulse">
        <div className="h-[60vh] bg-neutral-900 rounded-3xl" />
        <div className="max-w-4xl space-y-4">
          <div className="h-12 w-1/2 bg-neutral-900 rounded-xl" />
          <div className="h-6 w-full bg-neutral-900 rounded-xl" />
          <div className="h-24 w-full bg-neutral-900 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!media) return <div className="text-center py-20">Media not found</div>;

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-[80vh] w-full flex items-end px-4 md:px-12 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent z-10" />
        <Image 
          src={media.posterUrl || 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=2070&auto=format&fit=crop'}
          alt={media.title}
          fill
          className="absolute inset-0 w-full h-full object-cover"
          priority
          sizes="100vw"
        />
        
        <div className="relative z-20 max-w-4xl space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-2 mb-4">
               <span className="px-3 py-1 bg-primary text-white text-[10px] font-black rounded-full">
                 {media.type}
               </span>
               <span className="px-3 py-1 bg-white/10 text-white text-[10px] font-bold rounded-full backdrop-blur-md">
                 {media.contentType}
               </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black font-outfit uppercase tracking-tighter leading-none">
              {media.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 mt-6 text-sm font-medium text-secondary-foreground">
              <span className="flex items-center gap-1.5 text-primary">
                <Star className="w-4 h-4 fill-primary" />
                <span className="text-white font-bold text-base">{media.avgRating.toFixed(1)}</span>
                <span className="text-xs">({media.totalRatings} ratings)</span>
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {media.releaseYear}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                128 min
              </span>
              <span className="bg-white/5 px-3 py-1 rounded-full border border-white/10 uppercase text-[10px] tracking-widest text-white">
                {media.genre.join(' / ')}
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center gap-4"
          >
            {media.isLocked ? (
              <button 
                onClick={() => router.push('/pricing')}
                className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-bold hover:bg-rose-700 transition-all shadow-xl shadow-primary/20"
              >
                <Lock className="w-5 h-5 fill-white" />
                Unlock Premium
              </button>
            ) : (
              <a 
                href={media.streamingLink || '#'} 
                target="_blank"
                className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-bold hover:bg-rose-700 transition-all shadow-xl shadow-primary/20"
              >
                <Play className="w-5 h-5 fill-white" />
                Watch Now
              </a>
            )}
            <button 
              onClick={handleWatchlistToggle}
              className={cn(
                "flex items-center gap-2 px-8 py-4 rounded-xl font-bold transition-all backdrop-blur-md border",
                inWatchlist 
                  ? "bg-white text-black border-white" 
                  : "bg-white/10 text-white border-white/20 hover:bg-white/20"
              )}
            >
              {inWatchlist ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
            </button>
          </motion.div>
        </div>
      </section>

      {/* Details Content */}
      <div className="md:px-12 px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold font-outfit">Synopsis</h2>
            <p className="text-secondary-foreground leading-relaxed text-lg">
              {media.synopsis}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold font-outfit">Director & Cast</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-center gap-4 bg-secondary/30 p-4 rounded-2xl border border-white/5">
                <div className="bg-primary/20 p-3 rounded-xl">
                   <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-secondary-foreground font-medium uppercase tracking-widest">Director</p>
                  <p className="font-bold text-white">{media.director}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-secondary/30 p-4 rounded-2xl border border-white/5">
                 <div className="bg-secondary p-3 rounded-xl">
                   <Play className="w-6 h-6 text-white" />
                </div>
                <div>
                   <p className="text-xs text-secondary-foreground font-medium uppercase tracking-widest">Platforms</p>
                   <p className="font-bold text-white">{media.platform.join(', ')}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <p className="text-xs text-secondary-foreground font-medium uppercase tracking-widest mb-4">Lead Cast</p>
              <div className="flex flex-wrap gap-2">
                {media.cast.map((actor) => (
                  <span key={actor} className="px-4 py-2 bg-secondary/50 rounded-xl text-sm font-medium border border-white/5 hover:border-primary/50 transition-colors">
                    {actor}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* User Reviews */}
          <section className="pt-12 border-t border-white/5" id="reviews">
            <h2 className="text-3xl font-black font-outfit tracking-tight mb-8">Audience <span className="text-primary">Reviews</span></h2>
            <ReviewSection mediaId={id as string} onReviewSubmitted={fetchMedia} />
          </section>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <div className="bg-card rounded-3xl p-6 border border-white/5 space-y-6 shadow-2xl">
             <div className="flex items-center gap-3">
               <Globe className="w-5 h-5 text-primary" />
               <h3 className="font-bold uppercase tracking-widest text-xs">Official Source</h3>
             </div>
             <div className="space-y-3">
               <div className="p-3 bg-secondary/50 rounded-xl border border-white/5">
                 <p className="text-[10px] text-muted-foreground uppercase font-bold">Release Status</p>
                 <p className="text-sm font-bold text-green-500">Available to Stream</p>
               </div>
               <div className="p-3 bg-secondary/50 rounded-xl border border-white/5">
                 <p className="text-[10px] text-muted-foreground uppercase font-bold">Language</p>
                 <p className="text-sm font-bold">English (Original)</p>
               </div>
             </div>
             
             <button className="w-full py-4 text-primary font-bold text-sm bg-primary/10 rounded-xl hover:bg-primary/20 transition-all border border-primary/20">
               Rate this {media.type.toLowerCase()}
             </button>
          </div>

          {/* Ad/Promo Placeholder */}
          <div className="aspect-4/5 bg-linear-to-br from-primary/20 to-secondary rounded-3xl border border-white/5 flex items-center justify-center p-8 text-center overflow-hidden relative">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
             <div className="relative z-10 space-y-4">
               <h4 className="text-xl font-bold font-outfit">Join the CineTube Pro</h4>
               <p className="text-xs text-secondary-foreground">Unlock exclusive premium titles and early access content.</p>
               <button className="px-6 py-2.5 bg-white text-black rounded-lg text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform">
                 Upgrade Now
               </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
