'use client';

import { useState, useEffect } from 'react';
import { MediaService } from '@/services/mediaService';
import { Media } from '@/types';
import { Play, Info, Plus, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const Home = () => {
  const [featured, setFeatured] = useState<Media | null>(null);
  const [trending, setTrending] = useState<Media[]>([]);
  const [newReleases, setNewReleases] = useState<Media[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, trendingRes, newRes] = await Promise.all([
          MediaService.getFeaturedMedia(),
          MediaService.getMedia({ limit: 6, sort: 'avgRating' }),
          MediaService.getMedia({ limit: 6, sort: 'createdAt' }),
        ]);
        setFeatured(featuredRes.data[0] || null);
        setTrending(trendingRes.data);
        setNewReleases(newRes.data);
      } catch (error) {
        console.error('Failed to fetch home data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const categories = [
    { title: 'Trending Now', items: trending },
    { title: 'New Releases', items: newReleases },
  ];

  if (isLoading) {
    return (
      <div className="space-y-12 pb-20 animate-pulse">
        <div className="h-[80vh] bg-neutral-900" />
        <div className="px-12 space-y-8">
           <div className="h-8 w-48 bg-neutral-900 rounded" />
           <div className="grid grid-cols-6 gap-4">
             {[1,2,3,4,5,6].map(i => <div key={i} className="aspect-[2/3] bg-neutral-900 rounded-xl" />)}
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Hero Section */}
      {featured && (
        <section className="relative h-[85vh] w-full flex items-center px-4 md:px-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent z-10" />
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
            style={{ backgroundImage: `url(${featured.posterUrl || 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop'})` }}
          />
          
          <div className="relative z-20 max-w-2xl space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-2">
                 <span className="px-3 py-1 bg-primary/20 border border-primary text-primary rounded-full text-xs font-bold uppercase tracking-widest">
                   Featured
                 </span>
                 <span className="flex items-center gap-1 text-xs font-bold text-yellow-500">
                   <Star className="w-4 h-4 fill-yellow-500" />
                   {featured.avgRating.toFixed(1)}
                 </span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black mt-4 leading-tight font-outfit uppercase">
                {featured.title}
              </h1>
              <p className="text-lg text-secondary-foreground line-clamp-3 mt-4 max-w-lg">
                {featured.synopsis}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-4"
            >
              <Link
                href={`/media/${featured.id}`}
                className="flex items-center gap-2 px-8 py-4 bg-white text-black rounded-xl font-bold hover:bg-neutral-200 transition-all transform hover:scale-105 shadow-xl"
              >
                <Play className="w-5 h-5 fill-black" />
                Watch Now
              </Link>
              <Link 
                href={`/media/${featured.id}#reviews`}
                className="flex items-center gap-2 px-8 py-4 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-all backdrop-blur-md border border-white/20"
              >
                <Info className="w-5 h-5" />
                Details
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Media Rows */}
      <div className="space-y-16 px-4 md:px-12 mt-[-80px] relative z-30">
        {categories.map((category, idx) => (
          <section key={idx} className="space-y-6">
            <div className="flex justify-between items-end">
               <h3 className="text-3xl font-black font-outfit tracking-tighter flex items-center gap-3">
                 {category.title}
                 <div className="h-1 w-20 bg-primary/40 rounded-full" />
               </h3>
               <Link href={idx === 0 ? '/movies' : '/series'} className="text-xs font-bold text-primary hover:underline uppercase tracking-widest">
                  View All
               </Link>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {category.items.map((media) => (
                <motion.div
                  key={media.id}
                  whileHover={{ y: -12, scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="group relative"
                >
                   <Link href={`/media/${media.id}`}>
                      <div className="aspect-[2/3] bg-neutral-900 rounded-2xl overflow-hidden relative border border-white/5 shadow-2xl">
                        <img 
                          src={media.posterUrl || 'https://via.placeholder.com/300x450'} 
                          alt={media.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                           <div className="flex items-center justify-between mb-2">
                              <span className="flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/20 px-2 py-0.5 rounded-full border border-primary/20">
                                <Star className="w-2.5 h-2.5 fill-primary" />
                                {media.avgRating.toFixed(1)}
                              </span>
                              <span className="text-[10px] text-white font-bold">{media.releaseYear}</span>
                           </div>
                           <h4 className="text-sm font-bold text-white line-clamp-1">{media.title}</h4>
                        </div>
                      </div>
                   </Link>
                </motion.div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default Home;
