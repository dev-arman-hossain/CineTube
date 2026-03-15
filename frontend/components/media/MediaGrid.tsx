'use client';

import { Media } from '@/types';
import MediaCard from './MediaCard';
import { motion } from 'framer-motion';

interface MediaGridProps {
  items: Media[];
  isLoading?: boolean;
}

const MediaGrid = ({ items, isLoading }: MediaGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {[...Array(12)].map((_, idx) => (
          <div 
            key={idx} 
            className="aspect-[2/3] bg-neutral-900 rounded-2xl animate-pulse border border-white/5"
          />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-secondary-foreground">
        <p className="text-lg font-medium font-outfit">No content found</p>
        <p className="text-sm">Try adjusting your filters or search query</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
    >
      {items.map((media) => (
        <MediaCard key={media.id} media={media} />
      ))}
    </motion.div>
  );
};

export default MediaGrid;
