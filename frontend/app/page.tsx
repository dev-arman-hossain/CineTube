'use client';

import { Play, Info, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const categories = [
    { title: 'Trending Now', items: [1, 2, 3, 4, 5, 6] },
    { title: 'New Releases', items: [1, 2, 3, 4, 5, 6] },
    { title: 'Critically Acclaimed', items: [1, 2, 3, 4, 5, 6] },
  ];

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative h-[85vh] w-full flex items-center px-4 md:px-12 overflow-hidden">
        {/* Background Gradient/Image Placeholder */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop')" }}
        />
        
        <div className="relative z-20 max-w-2xl space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="px-3 py-1 bg-primary/20 border border-primary text-primary rounded-full text-xs font-bold uppercase tracking-widest">
              Exclusive Premiere
            </span>
            <h1 className="text-6xl md:text-8xl font-black mt-4 leading-tight font-outfit">
              INCEPTION
            </h1>
            <p className="text-lg text-secondary-foreground line-clamp-3 mt-4">
              Dom Cobb is a skilled thief, the absolute best in the dangerous art of extraction, stealing valuable secrets from deep within the subconscious during the dream state.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-4"
          >
            <button className="flex items-center gap-2 px-8 py-4 bg-white text-black rounded-xl font-bold hover:bg-neutral-200 transition-all transform hover:scale-105">
              <Play className="w-5 h-5 fill-black" />
              Watch Now
            </button>
            <button className="flex items-center gap-2 px-8 py-4 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-all backdrop-blur-md border border-white/20">
              <Info className="w-5 h-5" />
              More Info
            </button>
            <button className="p-4 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all backdrop-blur-md border border-white/20">
              <Plus className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Media Rows */}
      <div className="space-y-12 px-4 md:px-12 mt-[-100px] relative z-30">
        {categories.map((category, idx) => (
          <section key={idx} className="space-y-4">
            <h3 className="text-2xl font-bold font-outfit tracking-tight flex items-center gap-3">
              {category.title}
              <div className="h-1 flex-grow bg-white/5 rounded-full" />
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {category.items.map((item) => (
                <motion.div
                  key={item}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="aspect-[2/3] bg-neutral-900 rounded-xl overflow-hidden relative group cursor-pointer border border-white/5"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-end p-4">
                     <p className="text-xs font-bold">Movie Title {item}</p>
                  </div>
                  <div className="w-full h-full bg-neutral-800 animate-pulse" />
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
