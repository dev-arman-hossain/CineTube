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
  const { isAuthenticated, user } = useAuthStore();

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
      const result = await WatchlistService.toggleWatchlist(id as string);
      setInWatchlist(result.data.added);
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
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
      <section className="px-4 md:px-12 py-8">
        <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
          {/* Background Image */}
          <Image 
            src={media.backdropUrl || media.posterUrl || 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=2070&auto=format&fit=crop'}
            alt={media.title}
            fill
            className="w-full h-full object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 85vw"
            onError={(e: any) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=2070&auto=format&fit=crop';
            }}
          />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent md:from-black md:via-black/40 z-10" />
          
          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 lg:p-16 z-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl space-y-6"
            >
              {/* Badge */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1.5 bg-primary text-white text-[11px] font-black rounded-full">
                  {media.type}
                </span>
                <span className="px-3 py-1.5 bg-white/10 text-white text-[11px] font-bold rounded-full backdrop-blur-md border border-white/20">
                  {media.contentType}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black font-outfit uppercase tracking-tighter leading-tight">
                {media.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 md:gap-6 pt-4 text-xs md:text-sm font-medium text-secondary-foreground">
                <span className="flex items-center gap-1.5 text-primary">
                  <Star className="w-4 h-4 fill-primary" />
                  <span className="text-white font-bold">{media.avgRating.toFixed(1)}</span>
                  <span>({media.totalRatings})</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {media.releaseYear}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  128 min
                </span>
                <span className="bg-white/5 px-3 py-1 rounded-full border border-white/10 uppercase tracking-widest text-[9px] font-bold text-white">
                  {media.genre.slice(0, 2).join(' / ')}
                </span>
              </div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-4"
              >
                {media.isLocked ? (
                  <button 
                    onClick={() => router.push('/pricing')}
                    className="flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-primary text-white rounded-xl font-bold hover:bg-rose-700 transition-all shadow-xl shadow-primary/30 w-full sm:w-auto justify-center sm:justify-start"
                  >
                    <Lock className="w-5 h-5 fill-white" />
                    <span>Unlock Premium</span>
                  </button>
                ) : (
                  <a 
                    href={media.streamingLink || '#'} 
                    target="_blank"
                    className="flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-primary text-white rounded-xl font-bold hover:bg-rose-700 transition-all shadow-xl shadow-primary/30 w-full sm:w-auto justify-center sm:justify-start"
                  >
                    <Play className="w-5 h-5 fill-white" />
                    <span>Watch Now</span>
                  </a>
                )}
                <button 
                  onClick={handleWatchlistToggle}
                  className={cn(
                    "flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold transition-all backdrop-blur-md border w-full sm:w-auto justify-center sm:justify-start",
                    inWatchlist 
                      ? "bg-white text-black border-white shadow-xl shadow-white/20" 
                      : "bg-white/10 text-white border-white/30 hover:bg-white/20"
                  )}
                >
                  {inWatchlist ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  <span>{inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}</span>
                </button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Details Content */}
      <div className="px-4 md:px-12 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-2 space-y-12">
          <section className="space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-black font-outfit uppercase tracking-tight mb-4">
                <span className="text-primary">About</span> This Show
              </h2>
              <div className="w-12 h-1 bg-primary rounded-full" />
            </div>
            <p className="text-secondary-foreground leading-relaxed text-base md:text-lg">
              {media.synopsis}
            </p>
          </section>

          <section className="space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-black font-outfit uppercase tracking-tight mb-4">
                Director <span className="text-primary">&</span> Cast
              </h2>
              <div className="w-12 h-1 bg-primary rounded-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4 bg-secondary/30 p-5 rounded-2xl border border-white/5 hover:border-primary/30 transition-colors">
                <div className="bg-primary/20 p-3 rounded-xl shrink-0">
                   <User className="w-6 h-6 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-secondary-foreground font-bold uppercase tracking-widest">Director</p>
                  <p className="font-bold text-white text-lg mt-1">{media.director}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-secondary/30 p-5 rounded-2xl border border-white/5 hover:border-primary/30 transition-colors">
                 <div className="bg-primary/20 p-3 rounded-xl shrink-0">
                   <Globe className="w-6 h-6 text-primary" />
                </div>
                <div className="min-w-0">
                   <p className="text-xs text-secondary-foreground font-bold uppercase tracking-widest">Platforms</p>
                   <p className="font-bold text-white text-lg mt-1">{media.platform.join(', ')}</p>
                </div>
              </div>
            </div>
            
            <div className="pt-4">
              <p className="text-xs text-secondary-foreground font-bold uppercase tracking-widest mb-4">Lead Cast</p>
              <div className="flex flex-wrap gap-3">
                {media.cast.map((actor) => (
                  <span key={actor} className="px-4 py-2.5 bg-secondary/50 rounded-full text-sm font-semibold border border-white/10 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300">
                    {actor}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* User Reviews */}
          <section className="pt-12 border-t border-white/10" id="reviews">
            <h2 className="text-2xl md:text-3xl font-black font-outfit uppercase tracking-tight mb-8">
              Audience <span className="text-primary">Reviews</span>
            </h2>
            <ReviewSection mediaId={id as string} onReviewSubmitted={fetchMedia} />
          </section>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-secondary/20 rounded-3xl p-6 md:p-8 border border-white/10 space-y-6 shadow-xl hover:border-white/20 transition-colors">
             <div className="flex items-center gap-3 pb-6 border-b border-white/10">
               <Globe className="w-5 h-5 text-primary" />
               <h3 className="font-bold uppercase tracking-widest text-xs">Official Info</h3>
             </div>
             <div className="space-y-3">
               <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                 <p className="text-[11px] text-secondary-foreground uppercase font-bold mb-1">Status</p>
                 <p className="text-sm font-bold text-green-400">Available Now</p>
               </div>
               <div className="p-4 bg-secondary/50 rounded-xl border border-white/10">
                 <p className="text-[11px] text-secondary-foreground uppercase font-bold mb-1">Language</p>
                 <p className="text-sm font-bold text-white">English (Original)</p>
               </div>
             </div>
             
             <button className="w-full py-3 text-primary font-bold text-xs bg-primary/10 rounded-xl hover:bg-primary/20 transition-all border border-primary/30 uppercase tracking-widest">
               Rate This {media.type}
             </button>
          </div>

          {/* Premium Promo */}
          {!(user as any)?.isPremium && (
            <div className="bg-gradient-to-br from-primary/30 via-secondary/20 to-secondary/10 rounded-3xl border border-primary/30 p-6 md:p-8 overflow-hidden relative shadow-lg">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16" />
               <div className="relative z-10 space-y-4">
                 <h4 className="text-xl md:text-2xl font-black font-outfit">Unlock Premium</h4>
                 <p className="text-sm text-secondary-foreground leading-relaxed">Access exclusive titles, ad-free streaming, and early releases.</p>
                 <button 
                   onClick={() => router.push('/pricing')}
                   className="w-full px-6 py-3 bg-white text-black rounded-xl text-sm font-black uppercase tracking-widest hover:bg-white/90 transition-all shadow-lg shadow-white/20"
                 >
                   Explore Plans
                 </button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
