'use client';

import { Play, Info, Star, Tv, Film, Sparkles, Shield, Zap, Smile, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Media } from '@/types';

interface HomeViewProps {
  featured: Media | null;
  trending: Media[];
  newReleases: Media[];
  topRated?: Media[];
}

export default function HomeView({ featured, trending, newReleases, topRated = [] }: HomeViewProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardOffset, setCardOffset] = useState(220); // Default desktop offset

  useEffect(() => {
    // Handle responsive slider offset safely for SSR hydration
    const handleResize = () => {
      if (window.innerWidth < 640) setCardOffset(90);
      else if (window.innerWidth < 1024) setCardOffset(150);
      else setCardOffset(220);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!trending?.length) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % Math.min(trending.length, 10));
    }, 4000);
    return () => clearInterval(timer);
  }, [trending]);

  const categories = [
    { title: 'Trending Now', items: trending, link: '/movies' },
    { title: 'New Releases', items: newReleases, link: '/series' },
    ...(topRated.length > 0 ? [{ title: 'Most Popular', items: topRated, link: '/movies' }] : []),
  ];

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] lg:min-h-[90vh] w-full flex items-center px-4 md:px-12 overflow-hidden bg-neutral-950 pt-24 pb-16 lg:py-0">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-[-10%] w-[600px] h-[600px] bg-primary/20 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-20 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* Left Column: Text & CTAs */}
          <div className="space-y-6 lg:space-y-8 z-10 text-center lg:text-left pt-10 lg:pt-0">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-4 lg:space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-xs md:text-sm font-bold text-primary uppercase tracking-widest">Premium Streaming</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] font-outfit uppercase tracking-tighter mx-auto lg:mx-0 max-w-3xl">
                Unlimited <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-rose-400">Movies</span>, <br className="hidden sm:block" />
                TV Shows & More.
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-neutral-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Watch anywhere. Cancel anytime. Experience the next generation of cinematic entertainment exclusively on Cinetube.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <Link
                href="/pricing"
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-xl font-black uppercase tracking-wider hover:bg-primary/90 transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(225,29,72,0.3)]"
              >
                <Play className="w-5 h-5 fill-current" />
                Subscribe Now
              </Link>
              <Link
                href="/movies"
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-white/5 text-white rounded-xl font-bold hover:bg-white/10 transition-all backdrop-blur-md border border-white/10 hover:border-white/20"
              >
                Explore Library
              </Link>
            </motion.div>
          </div>

          {/* Right Column: Premium 3D Rotating Coverflow Slider */}
          <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[650px] flex items-center justify-center perspective-[1200px] lg:ml-auto select-none mt-8 lg:mt-0 max-w-[100vw] overflow-visible">
            {trending.slice(0, Math.min(trending.length, 10)).map((media, index) => {
              const totalCards = Math.min(trending.length, 10);
              let relativePos = index - activeIndex;

              // Ensure perfect looping queue
              if (relativePos < -Math.floor(totalCards / 2)) relativePos += totalCards;
              if (relativePos > Math.floor(totalCards / 2)) relativePos -= totalCards;

              const isVisible = Math.abs(relativePos) <= 2;
              if (!isVisible) return null;

              const isActive = relativePos === 0;

              return (
                <motion.div
                  key={media.id}
                  initial={false}
                  animate={{
                    x: relativePos * cardOffset,
                    scale: isActive ? 1 : 1 - Math.abs(relativePos) * 0.2, // Stronger scaling for depth
                    zIndex: 30 - Math.abs(relativePos),
                    rotateY: relativePos * -25, // Stronger rotation for distinct 3D effect
                    opacity: 1
                  }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute w-[180px] sm:w-[240px] lg:w-[320px] aspect-[2/3] rounded-[2rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-white/20 cursor-pointer group"
                  style={{ transformStyle: 'preserve-3d' }}
                  onClick={() => {
                    if (!isActive) {
                      setActiveIndex(index);
                    } else {
                      window.location.href = `/media/${media.id}`;
                    }
                  }}
                >
                  <Image
                    src={media.posterUrl || 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=2070&auto=format&fit=crop'}
                    alt={media.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 180px, (max-width: 1024px) 240px, 320px"
                    priority={isActive}
                  />

                  {/* Premium dark gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent transition-opacity duration-500 ${isActive ? 'opacity-90 group-hover:opacity-80' : 'opacity-60 group-hover:opacity-40'}`} />

                  {/* Card Info Overlay */}
                  {isActive && (
                    <motion.div
                      key={`info-${media.id}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                      className="absolute bottom-0 left-0 right-0 p-5 sm:p-6"
                    >
                      <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-3">
                        <span className="px-3 py-1 bg-primary text-white text-[10px] sm:text-xs font-black rounded-lg uppercase tracking-wider backdrop-blur-md shadow-lg shadow-primary/20">
                          Trending #{index + 1}
                        </span>
                        <span className="flex items-center text-xs font-bold text-yellow-400 bg-black/40 px-2 py-1 rounded-lg backdrop-blur-md">
                          <Star className="w-3.5 h-3.5 fill-yellow-400 mr-1" />
                          {media.avgRating.toFixed(1)}
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white line-clamp-2 leading-tight drop-shadow-2xl">
                        {media.title}
                      </h3>
                      <div className="mt-4 flex items-center justify-center py-2 px-4 rounded-xl bg-white/10 backdrop-blur-none border border-white/20 text-white text-sm font-bold transition-all duration-300 hover:bg-white hover:text-black">
                        <Play className="w-4 h-4 mr-2" /> Watch Now
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Media Rows */}
      <div className="space-y-16 px-4 md:px-12 py-12 relative z-30">
        {categories.map((category, idx) => (
          <section key={idx} className="space-y-6">
            <div className="flex justify-between items-end">
              <h3 className="text-3xl font-black font-outfit tracking-tighter flex items-center gap-3">
                {category.title}
                <div className="h-1 w-20 bg-primary/40 rounded-full" />
              </h3>
              <Link href={category.link} className="text-xs font-bold text-primary hover:underline uppercase tracking-widest">
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
                    <div className="aspect-2/3 bg-neutral-900 rounded-2xl overflow-hidden relative border border-white/12 shadow-[0_8px_30px_rgb(0,0,0,0.5)] group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-shadow duration-500">
                      <Image
                        src={media.posterUrl || 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=2070&auto=format&fit=crop'}
                        alt={media.title}
                        fill
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        priority={false}
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
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

      {/* Browse by Genre Section */}
      <section className="px-4 md:px-12 py-16 mt-8 relative">
        <div className="flex justify-between items-end mb-8 relative z-10">
          <h3 className="text-3xl font-black font-outfit tracking-tighter flex items-center gap-3">
            Browse by Genre
            <div className="h-1 w-20 bg-primary/40 rounded-full" />
          </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 relative z-10">
          {[
            { name: 'Action', icon: Zap },
            { name: 'Comedy', icon: Smile },
            { name: 'Drama', icon: Film },
            { name: 'Sci-Fi', icon: Sparkles },
            { name: 'Horror', icon: Tv },
            { name: 'Documentary', icon: Info },
          ].map((genre, idx) => (
            <Link key={idx} href={`/search?q=${genre.name}`} className="block">
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative overflow-hidden rounded-2xl bg-neutral-900 border border-white/5 p-6 flex flex-col items-center justify-center gap-4 group cursor-pointer hover:bg-neutral-800 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(var(--primary),0.15)] transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-300 border border-white/5 group-hover:border-primary/20">
                  <genre.icon className="w-6 h-6 text-neutral-400 group-hover:text-primary transition-colors duration-300" />
                </div>
                <span className="text-neutral-300 font-bold uppercase tracking-widest text-sm group-hover:text-white transition-colors duration-300">{genre.name}</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="px-4 md:px-12 py-16 bg-neutral-900/50 border-y border-white/5 mt-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-black font-outfit uppercase tracking-tighter">Why Choose Cinetube?</h2>
            <p className="text-neutral-400 max-w-2xl mx-auto text-lg">Experience the next generation of streaming with premium features designed for your ultimate entertainment.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Premium 4K Quality', desc: 'Watch your favorite movies and series in stunning 4K Ultra HD resolution with Dolby Atmos audio.', icon: Sparkles },
              { title: 'Ad-Free Experience', desc: 'Enjoy uninterrupted entertainment without any annoying ads or pop-ups during your playback.', icon: Shield },
              { title: 'Cancel Anytime', desc: 'No hidden fees or long-term contracts. Pause or cancel your subscription whenever you want.', icon: CheckCircle2 },
            ].map((feature, idx) => (
              <div key={idx} className="bg-neutral-900 border border-white/10 rounded-3xl p-8 hover:bg-neutral-800 transition-colors duration-300 flex flex-col items-center text-center space-y-4 shadow-xl">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold">{feature.title}</h4>
                <p className="text-neutral-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="px-4 md:px-12 py-24 text-center">
        <div className="max-w-4xl mx-auto bg-linear-to-r from-primary/20 via-primary/10 to-transparent border border-primary/20 rounded-3xl p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-primary/30 blur-3xl rounded-full" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-primary/30 blur-3xl rounded-full" />

          <div className="relative z-10 space-y-6">
            <h2 className="text-4xl md:text-5xl font-black font-outfit uppercase tracking-tighter">Ready to start watching?</h2>
            <p className="text-xl text-neutral-300 max-w-2xl mx-auto">Join thousands of subscribers who are already enjoying our unlimited streaming library.</p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/pricing" className="px-8 py-4 bg-primary text-primary-foreground font-black uppercase tracking-wider rounded-xl hover:bg-primary/90 transition-all transform hover:scale-105 w-full sm:w-auto text-lg flex items-center justify-center gap-2 shadow-lg">
                <Play className="w-5 h-5 fill-current" />
                Subscribe Now
              </Link>
              <Link href="/movies" className="px-8 py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all backdrop-blur-md w-full sm:w-auto text-lg border border-white/20">
                Explore Library
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
