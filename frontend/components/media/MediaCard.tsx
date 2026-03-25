'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { Play, Star, Plus, Lock, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { Media } from '@/types';
import Image from 'next/image';
import { WatchlistService } from '@/services/watchlistService';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

interface MediaCardProps {
  media: Media;
}

const MediaCard = ({ media }: MediaCardProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const [inWatchlist, setInWatchlist] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const checkWatchlist = async () => {
        try {
          const response = await WatchlistService.getMyWatchlist();
          // The backend returns { success: true, data: [ { id, mediaId, ... }, ... ] }
          const exists = response.data.some((item: any) => item.mediaId === media.id);
          setInWatchlist(exists);
        } catch (error) {
          console.error('Failed to check watchlist:', error);
        }
      };
      checkWatchlist();
    }
  }, [media.id, isAuthenticated]);

  const handleWatchlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) return router.push('/login');
    
    try {
      setIsToggling(true);
      const result = await WatchlistService.toggleWatchlist(media.id);
      setInWatchlist(result.data.added);
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
      toast.success(result.data.added ? 'Added to watchlist' : 'Removed from watchlist');
    } catch (error) {
      toast.error('Failed to update watchlist');
    } finally {
      setIsToggling(false);
    }
  };

  const posterUrl = media.posterUrl || 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=2070&auto=format&fit=crop';

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative aspect-2/3 bg-neutral-900 rounded-2xl overflow-hidden border border-white/5 cursor-pointer"
    >
      {/* Poster Image */}
      <Image
        src={posterUrl}
        alt={media.title}
        fill
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        priority={false}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

      {/* Content */}
      <div className="absolute inset-0 p-4 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-xs font-bold text-primary bg-primary/20 px-2 py-0.5 rounded-full border border-primary/30">
              <Star className="w-3 h-3 fill-primary" />
              {media.avgRating.toFixed(1)}
            </span>
            <span className="text-[10px] text-secondary-foreground font-medium bg-white/5 px-2 py-0.5 rounded-full">
              {media.releaseYear}
            </span>
          </div>

          <h3 className="text-sm font-bold text-white line-clamp-1 leading-tight">
            {media.title}
          </h3>

          <p className="text-[10px] text-secondary-foreground line-clamp-2">
            {media.genre.join(', ')}
          </p>

          <div className="flex items-center gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-500 delay-100">
            <Link
              href={`/media/${media.id}`}
              className="grow flex items-center justify-center gap-1 py-2 bg-primary text-white text-[10px] font-bold rounded-lg hover:bg-rose-700 transition-all"
            >
              <Play className="w-3 h-3 fill-white" />
              Details
            </Link>
            <button 
              onClick={handleWatchlistToggle} 
              disabled={isToggling}
              className={`p-2 rounded-lg transition-all backdrop-blur-md ${inWatchlist ? 'bg-primary text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
              {inWatchlist ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
            </button>
          </div>
        </div>
      </div>

      {/* Premium Badge */}
      {media.contentType === 'PREMIUM' && (
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-yellow-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg">
          {media.isLocked && <Lock className="w-2.5 h-2.5" />}
          PREMIUM
        </div>
      )}
    </motion.div>
  );
};

export default MediaCard;
