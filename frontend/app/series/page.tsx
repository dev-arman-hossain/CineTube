'use client';

import { useState, useEffect } from 'react';
import { MediaService } from '@/services/mediaService';
import { Media } from '@/types';
import MediaGrid from '@/components/media/MediaGrid';
import { Search, Filter, ChevronDown } from 'lucide-react';

const genres = ['All', 'Action', 'Sci-Fi', 'Drama', 'Crime', 'Thriller', 'Horror', 'Adventure', 'Comedy', 'Fantasy'];

export default function SeriesPage() {
  const [series, setSeries] = useState<Media[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchSeries = async () => {
      setIsLoading(true);
      try {
        const response = await MediaService.getMedia({
          type: 'SERIES',
          genre: selectedGenre !== 'All' ? selectedGenre : undefined,
          q: searchQuery || undefined,
        });
        setSeries(response.data);
      } catch (error) {
        console.error('Failed to fetch series:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchSeries, 500); // Debounce search
    return () => clearTimeout(timer);
  }, [selectedGenre, searchQuery]);

  return (
    <div className="md:px-12 px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black font-outfit tracking-tight">Explore <span className="text-primary">Series</span></h1>
          <p className="text-secondary-foreground text-sm mt-1">Binge-worthy shows from top-rated creators across all platforms.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group min-w-[280px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search series..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-secondary/50 border border-white/5 rounded-xl py-2.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
            />
          </div>

          <div className="hidden lg:flex items-center bg-secondary/50 p-1 rounded-xl border border-white/5">
            {genres.slice(0, 5).map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedGenre === genre ? 'bg-primary text-white shadow-lg' : 'text-secondary-foreground hover:text-white'
                }`}
              >
                {genre}
              </button>
            ))}
            <button className="px-4 py-1.5 rounded-lg text-xs font-bold text-secondary-foreground hover:text-white flex items-center gap-1">
              More <ChevronDown className="w-3 h-3" />
            </button>
          </div>
          
          <button className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-secondary/50 border border-white/5 rounded-xl text-xs font-bold">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      <div className="lg:hidden flex gap-2 overflow-x-auto no-scrollbar pb-2">
         {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                selectedGenre === genre 
                  ? 'bg-primary border-primary text-white' 
                  : 'bg-transparent border-white/10 text-secondary-foreground'
              }`}
            >
              {genre}
            </button>
         ))}
      </div>

      <MediaGrid items={series} isLoading={isLoading} />
    </div>
  );
}
