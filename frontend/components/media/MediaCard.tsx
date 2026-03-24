'use client';

import Link from 'next/link';
import { Play, Star, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Media } from '@/types';
import Image from 'next/image';

interface MediaCardProps {
  media: Media;
}

const MediaCard = ({ media }: MediaCardProps) => {
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
            <button className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all backdrop-blur-md">
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Premium Badge */}
      {media.contentType === 'PREMIUM' && (
        <div className="absolute top-3 right-3 z-20 bg-yellow-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg">
          PREMIUM
        </div>
      )}
    </motion.div>
  );
};

export default MediaCard;
