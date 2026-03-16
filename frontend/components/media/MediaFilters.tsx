'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search, ChevronDown, Filter } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

const genres = ['All', 'Action', 'Sci-Fi', 'Drama', 'Crime', 'Thriller', 'Horror', 'Adventure', 'Comedy'];

export default function MediaFilters({ initialSearch = '', initialGenre = 'All' }: { initialSearch?: string, initialGenre?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  // Sync internal state with URL if it changes externally (e.g. browser back button)
  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== 'All') {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Debounce or just update on enter? Let's do a simple debounce-like effect with a timer if needed, 
    // but for now let's just use form submission or a brief delay.
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      // Guard: Only push to URL if the value is actually different to avoid recursion
      if (searchQuery === (searchParams.get('q') || '')) return;

      const queryString = createQueryString('q', searchQuery);
      router.push(`${pathname}?${queryString}`, { scroll: false });
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, pathname, router, createQueryString, searchParams]);

  const handleGenreSelect = (genre: string) => {
    if (genre === (searchParams.get('genre') || 'All')) return;
    const queryString = createQueryString('genre', genre);
    router.push(`${pathname}?${queryString}`, { scroll: false });
  };

  const currentGenre = searchParams.get('genre') || 'All';

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search Bar */}
      <div className="relative group min-w-[280px]">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <input
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full bg-secondary/50 border border-white/5 rounded-xl py-2.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
        />
      </div>

      {/* Genre Dropdown/Buttons (Mobile) or Grid of buttons (Desktop) */}
      <div className="hidden lg:flex items-center bg-secondary/50 p-1 rounded-xl border border-white/5">
        {genres.slice(0, 5).map((genre) => (
          <button
            key={genre}
            onClick={() => handleGenreSelect(genre)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              currentGenre === genre ? 'bg-primary text-white shadow-lg' : 'text-secondary-foreground hover:text-white'
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

      {/* Genre Pills (Mobile/Tablets) - Visible when filters are toggled perhaps, but for now matching original */}
      <div className="lg:hidden w-full flex gap-2 overflow-x-auto no-scrollbar pb-2 mt-2">
         {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => handleGenreSelect(genre)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                currentGenre === genre 
                  ? 'bg-primary border-primary text-white' 
                  : 'bg-transparent border-white/10 text-secondary-foreground'
              }`}
            >
              {genre}
            </button>
         ))}
      </div>
    </div>
  );
}
