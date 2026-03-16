'use client';

import { useState, useEffect } from 'react';
import { MediaService } from '@/services/mediaService';
import { Media } from '@/types';
import { Film, Plus, Search, Edit2, Trash2, ExternalLink, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import MediaForm from '@/components/admin/MediaForm';

export default function MediaCatalogPage() {
  const [mediaList, setMediaList] = useState<Media[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMedia, setEditingMedia] = useState<Media | undefined>(undefined);

  const fetchMedia = async () => {
    setIsLoading(true);
    try {
      const response = await MediaService.getMedia({ q: searchQuery || undefined });
      setMediaList(response.data);
    } catch (error) {
      toast.error('Failed to fetch media catalog');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchMedia, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this content?')) return;
    try {
      await MediaService.deleteMedia(id);
      setMediaList(mediaList.filter(m => m.id !== id));
      toast.success('Media deleted');
    } catch (error) {
      toast.error('Failed to delete media');
    }
  };

  const handleEdit = (media: Media) => {
    setEditingMedia(media);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black font-outfit tracking-tight uppercase italic underline decoration-primary/50 underline-offset-8">Media <span className="text-primary">Catalog</span></h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-black mt-3">Refine your digital library content</p>
        </div>

        <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-4">
          <div className="relative group flex-grow xs:flex-grow-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search catalog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-secondary/40 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 focus:bg-secondary/60 transition-all w-full xs:w-56"
            />
          </div>
          <button 
            onClick={() => { setEditingMedia(undefined); setIsFormOpen(true); }}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-rose-700 transition-all shadow-xl shadow-primary/30"
          >
            <Plus className="w-4 h-4" />
            Add Content
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-12"
          >
            <MediaForm 
              initialData={editingMedia} 
              onSuccess={() => { setIsFormOpen(false); fetchMedia(); }} 
              onCancel={() => setIsFormOpen(false)} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-secondary/20 rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
        {/* Mobile View: High-Quality Cards */}
        <div className="md:hidden divide-y divide-white/5">
          {isLoading && mediaList.length === 0 ? (
            <div className="text-center py-20 animate-pulse text-muted-foreground uppercase tracking-widest font-black text-xs">Loading Catalog...</div>
          ) : mediaList.length === 0 ? (
             <div className="text-center py-20 text-muted-foreground uppercase tracking-widest font-black text-xs">No media found</div>
          ) : (
            mediaList.map((media, idx) => (
              <motion.div 
                key={media.id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-5 flex gap-5 group"
              >
                <div className="w-24 h-36 bg-neutral-800 rounded-2xl overflow-hidden border border-white/10 shrink-0 shadow-lg group-hover:border-primary/30 transition-all">
                  <img 
                    src={media.posterUrl || 'https://via.placeholder.com/150'} 
                    alt={media.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="flex flex-col justify-between py-1 min-w-0">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                       <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                        media.type === 'MOVIE' ? 'border-primary/30 text-primary bg-primary/5' : 'border-blue-500/30 text-blue-500 bg-blue-500/5'
                       }`}>
                          {media.type}
                       </span>
                       <span className="flex items-center gap-1 text-[10px] font-black text-yellow-500">
                         <Star className="w-3 h-3 fill-yellow-500" />
                         {media.avgRating.toFixed(1)}
                       </span>
                    </div>
                    <h4 className="font-black text-sm truncate uppercase tracking-tight line-clamp-2 leading-tight">{media.title}</h4>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{media.releaseYear} • {media.genre[0]}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 pt-3">
                    <button 
                      onClick={() => handleEdit(media)}
                      className="p-2.5 bg-white/5 rounded-xl hover:bg-primary hover:text-white transition-all border border-white/5"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(media.id)}
                      className="p-2.5 bg-white/5 rounded-xl hover:bg-rose-500 hover:text-white transition-all border border-white/5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <a 
                      href={`/media/${media.id}`}
                      className="p-2.5 bg-white/5 rounded-xl hover:bg-white/20 transition-all border border-white/5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Desktop View: Advanced Table */}
        <div className="hidden md:block overflow-x-auto no-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.02] text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground border-b border-white/5">
                <th className="px-8 py-6">Visual</th>
                <th className="px-8 py-6">Content Details</th>
                <th className="px-8 py-6 text-center">Format</th>
                <th className="px-8 py-6">Genre Hierarchy</th>
                <th className="px-8 py-6 text-center">Score</th>
                <th className="px-8 py-6 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading && mediaList.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-20 text-muted-foreground uppercase tracking-widest font-black text-xs animate-pulse">Initializing Data Stream...</td></tr>
              ) : mediaList.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-20 text-muted-foreground uppercase tracking-widest font-black text-xs">No assets found in catalog</td></tr>
              ) : (
                mediaList.map((media) => (
                  <tr key={media.id} className="text-sm hover:bg-white/[0.03] transition-colors group">
                    <td className="px-8 py-5">
                      <div className="w-14 h-20 bg-neutral-900 rounded-xl overflow-hidden border border-white/10 shadow-lg group-hover:border-primary/50 transition-all duration-300">
                        <img 
                          src={media.posterUrl || 'https://via.placeholder.com/150'} 
                          alt={media.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div>
                        <p className="font-black text-white text-base tracking-tight uppercase group-hover:text-primary transition-colors">{media.title}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black mt-1">Released {media.releaseYear}</p>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border shadow-sm ${
                        media.type === 'MOVIE' ? 'border-primary/30 text-primary bg-primary/5' : 'border-blue-500/30 text-blue-500 bg-blue-500/5'
                      }`}>
                         {media.type}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-[10px] font-black uppercase tracking-wider text-secondary-foreground/80">
                      {media.genre.slice(0, 2).join(' / ')}
                    </td>
                    <td className="px-8 py-5 text-center">
                       <span className="inline-flex items-center gap-1.5 font-black text-primary text-base">
                         <Star className="w-4 h-4 fill-primary" />
                         {media.avgRating.toFixed(1)}
                       </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                       <div className="flex justify-end gap-3 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                          <button 
                            onClick={() => handleEdit(media)}
                            className="p-3 bg-white/5 rounded-2xl hover:bg-primary hover:text-white transition-all border border-white/5 shadow-xl"
                            title="Edit Record"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(media.id)}
                            className="p-3 bg-white/5 rounded-2xl hover:bg-rose-600 hover:text-white transition-all border border-white/5 shadow-xl"
                            title="Delete Asset"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <a 
                            href={`/media/${media.id}`}
                            className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/5 shadow-xl"
                            title="Open Preview"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
