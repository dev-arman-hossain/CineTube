'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MediaService } from '@/services/mediaService';
import { Media } from '@/types';
import MediaGrid from '@/components/media/MediaGrid';
import { Search as SearchIcon, Loader2 } from 'lucide-react';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState<Media[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState(query);

  const fetchResults = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await MediaService.getMedia({ q: searchTerm });
      setResults(response.data);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Sync Input with URL (Initial load)
  useEffect(() => {
    setInputValue(query);
  }, [query]);

  // Debounced Search Effect
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (inputValue !== query) {
        const params = new URLSearchParams(searchParams);
        if (inputValue.trim()) {
          params.set('q', inputValue);
        } else {
          params.delete('q');
        }
        router.push(`/search?${params.toString()}`);
      }
      
      if (inputValue.trim()) {
        fetchResults(inputValue);
      } else {
        setResults([]);
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [inputValue, searchParams, router, query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      fetchResults(inputValue);
    }
  };

  return (
    <div className="md:px-12 px-4 py-12 space-y-10">
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <h1 className="text-4xl font-black font-outfit uppercase tracking-tighter">Search <span className="text-primary">Results</span></h1>
        
        <form onSubmit={handleSearch} className="relative group">
           <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
           <input 
             type="text"
             value={inputValue}
             onChange={(e) => setInputValue(e.target.value)}
             placeholder="Search for movies, series, genres..."
             className="w-full bg-secondary/50 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-lg focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all font-medium"
           />
           {isLoading && <Loader2 className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 animate-spin text-primary" />}
        </form>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold font-outfit uppercase tracking-widest text-secondary-foreground flex items-center gap-3">
          {results.length} results found
          <div className="h-px flex-grow bg-white/5" />
        </h2>
        
        <MediaGrid items={results} isLoading={isLoading} />
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="md:px-12 px-4 py-12 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
