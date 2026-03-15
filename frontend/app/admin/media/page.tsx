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
      const response = await MediaService.getMedia({ searchTerm: searchQuery || undefined });
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black font-outfit tracking-tight">Media <span className="text-primary">Catalog</span></h1>
          <p className="text-secondary-foreground text-sm">Manage your movies and series library.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search catalog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-secondary/50 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary transition-all w-64"
            />
          </div>
          <button 
            onClick={() => { setEditingMedia(undefined); setIsFormOpen(true); }}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-rose-700 transition-all shadow-xl shadow-primary/20"
          >
            <Plus className="w-4 h-4" />
            Add Content
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
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

      <div className="bg-secondary/20 rounded-3xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-black/20 text-xs font-black uppercase tracking-widest text-muted-foreground border-b border-white/5">
                <th className="px-6 py-4">Poster</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Genre</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading && mediaList.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10">Loading catalog...</td></tr>
              ) : mediaList.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-muted-foreground">No media found</td></tr>
              ) : (
                mediaList.map((media) => (
                  <tr key={media.id} className="text-sm hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="w-12 h-16 bg-neutral-800 rounded-lg overflow-hidden border border-white/5">
                        <img 
                          src={media.posterUrl || 'https://via.placeholder.com/150'} 
                          alt={media.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold">{media.title}</p>
                        <p className="text-[10px] text-muted-foreground uppercase">{media.releaseYear}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                        media.type === 'MOVIE' ? 'border-primary text-primary' : 'border-blue-500 text-blue-500'
                      }`}>
                         {media.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-secondary-foreground">
                      {media.genre.slice(0, 2).join(', ')}
                      {media.genre.length > 2 && '...'}
                    </td>
                    <td className="px-6 py-4">
                       <span className="flex items-center gap-1 font-bold">
                         <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                         {media.avgRating.toFixed(1)}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleEdit(media)}
                            className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(media.id)}
                            className="p-2 bg-white/5 rounded-lg hover:bg-rose-500/10 hover:text-primary transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <a 
                            href={`/media/${media.id}`}
                            className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100"
                            title="View Public"
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
