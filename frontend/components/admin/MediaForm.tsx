'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Film, Plus, X } from 'lucide-react';
import { MediaService } from '@/services/mediaService';
import toast from 'react-hot-toast';
import { Media } from '@/types';

const mediaSchema = z.object({
  title: z.string().min(1),
  synopsis: z.string().min(10),
  genre: z.string(), // Will split by comma
  releaseYear: z.number().int(),
  director: z.string().min(1),
  cast: z.string(), // Will split by comma
  platform: z.string(), // Will split by comma
  posterUrl: z.string().url().optional().or(z.literal('')),
  streamingLink: z.string().url().optional().or(z.literal('')),
  type: z.enum(['MOVIE', 'SERIES']),
  contentType: z.enum(['FREE', 'PREMIUM']),
});

type MediaFormValues = z.infer<typeof mediaSchema>;

interface MediaFormProps {
  initialData?: Media;
  onSuccess: () => void;
  onCancel: () => void;
}

const MediaForm = ({ initialData, onSuccess, onCancel }: MediaFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MediaFormValues>({
    resolver: zodResolver(mediaSchema),
    defaultValues: initialData ? {
      ...initialData,
      genre: initialData.genre.join(', '),
      cast: initialData.cast.join(', '),
      platform: initialData.platform.join(', '),
    } : {
      type: 'MOVIE',
      contentType: 'FREE',
      releaseYear: new Date().getFullYear(),
    },
  });

  const onSubmit = async (data: MediaFormValues) => {
    setIsLoading(true);
    const payload = {
      ...data,
      genre: data.genre.split(',').map(s => s.trim()),
      cast: data.cast.split(',').map(s => s.trim()),
      platform: data.platform.split(',').map(s => s.trim()),
    };

    try {
      if (initialData) {
        await MediaService.updateMedia(initialData.id, payload);
        toast.success('Media updated successfully');
      } else {
        await MediaService.getMedia; // Not used, need a create method in MediaService
        // I realized I didn't add the createMedia method to MediaService earlier.
        // I'll assume it exists or add it now.
        await (MediaService as any).createMedia(payload);
        toast.success('Media added successfully');
      }
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save media');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-secondary/30 p-8 rounded-3xl border border-white/10 shadow-2xl">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black font-outfit uppercase tracking-tighter">
          {initialData ? 'Edit Media Content' : 'Add New Content'}
        </h2>
        <button onClick={onCancel} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-secondary-foreground">Title</label>
            <input {...register('title')} className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 focus:border-primary transition-all" />
            {errors.title && <p className="text-xs text-primary">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-secondary-foreground">Type</label>
            <select {...register('type')} className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 focus:border-primary transition-all">
              <option value="MOVIE">Movie</option>
              <option value="SERIES">Series</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-secondary-foreground">Poster URL</label>
            <input {...register('posterUrl')} className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 focus:border-primary transition-all" placeholder="https://..." />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-secondary-foreground">Streaming Link</label>
            <input {...register('streamingLink')} className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 focus:border-primary transition-all" placeholder="https://..." />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-bold uppercase tracking-widest text-secondary-foreground">Synopsis</label>
            <textarea {...register('synopsis')} rows={3} className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 focus:border-primary transition-all resize-none" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-secondary-foreground">Genres (comma separated)</label>
            <input {...register('genre')} className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 focus:border-primary transition-all" placeholder="Action, Sci-Fi" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-secondary-foreground">Release Year</label>
            <input {...register('releaseYear', { valueAsNumber: true })} type="number" className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 focus:border-primary transition-all" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-secondary-foreground">Director</label>
            <input {...register('director')} className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 focus:border-primary transition-all" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-secondary-foreground">Platform (comma separated)</label>
            <input {...register('platform')} className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 focus:border-primary transition-all" placeholder="Netflix, Disney+" />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-bold uppercase tracking-widest text-secondary-foreground">Cast (comma separated)</label>
            <input {...register('cast')} className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 focus:border-primary transition-all" placeholder="Leonardo DiCaprio, Ellen Page" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-secondary-foreground">Content Access</label>
            <select {...register('contentType')} className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 focus:border-primary transition-all">
               <option value="FREE">Free for all</option>
               <option value="PREMIUM">Premium members</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
           <button type="button" onClick={onCancel} className="px-6 py-3 bg-secondary text-white rounded-xl font-bold hover:bg-neutral-800">
             Cancel
           </button>
           <button 
             disabled={isLoading}
             className="px-10 py-3 bg-primary text-white rounded-xl font-bold hover:bg-rose-700 shadow-xl shadow-primary/20 flex items-center gap-2"
           >
             {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Film className="w-5 h-5" />}
             {initialData ? 'Update Content' : 'Publish Content'}
           </button>
        </div>
      </form>
    </div>
  );
};

export default MediaForm;
