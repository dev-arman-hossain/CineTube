'use client';

import { useState, useEffect } from 'react';
import { WatchlistService } from '@/services/watchlistService';
import { Media } from '@/types';
import MediaGrid from '@/components/media/MediaGrid';
import { Bookmark, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

export default function WatchlistPage() {
  const [watchlistItems, setWatchlistItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchWatchlist = async () => {
      try {
        const response = await WatchlistService.getMyWatchlist();
        setWatchlistItems(response.data);
      } catch (error) {
        console.error('Failed to fetch watchlist:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWatchlist();
  }, [isAuthenticated, router]);

  const movies = watchlistItems.map(item => item.media);

  if (!mounted) return null;

  return (
    <div className="md:px-12 px-4 py-8 space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/20 rounded-2xl border border-primary/20">
          <Bookmark className="w-8 h-8 text-primary fill-primary" />
        </div>
        <div>
           <h1 className="text-4xl font-black font-outfit tracking-tight">My <span className="text-primary">Watchlist</span></h1>
           <p className="text-secondary-foreground text-sm">Your personal collection of must-watch titles.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="mt-4 text-secondary-foreground">Loading your collection...</p>
        </div>
      ) : (
        <MediaGrid items={movies} />
      )}
    </div>
  );
}
