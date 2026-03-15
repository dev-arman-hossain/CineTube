'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Star, Loader2, Send } from 'lucide-react';
import { ReviewService } from '@/services/reviewService';
import toast from 'react-hot-toast';

const reviewSchema = z.object({
  rating: z.number().min(1).max(10),
  content: z.string().min(10, 'Review must be at least 10 characters'),
  hasSpoiler: z.boolean(),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  mediaId: string;
  onSuccess: () => void;
}

const ReviewForm = ({ mediaId, onSuccess }: ReviewFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      hasSpoiler: false,
    },
  });

  const rating = watch('rating');

  const onSubmit = async (data: ReviewFormValues) => {
    setIsLoading(true);
    try {
      await ReviewService.createReview({ ...data, mediaId });
      toast.success('Review submitted successfully!');
      reset();
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-3">
        <label className="text-sm font-medium text-secondary-foreground">Your Rating</label>
        <div className="flex items-center gap-1.5">
          {[...Array(10)].map((_, i) => (
            <button
              key={i}
              type="button"
              onMouseEnter={() => setHoverRating(i + 1)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setValue('rating', i + 1)}
              className="transition-transform active:scale-90"
            >
              <Star
                className={`w-6 h-6 transition-colors ${
                  (hoverRating || rating) > i ? 'fill-primary text-primary' : 'text-neutral-700'
                }`}
              />
            </button>
          ))}
          <span className="ml-2 font-black text-xl text-white">
            {rating || hoverRating || '0'}<span className="text-muted-foreground text-xs">/10</span>
          </span>
        </div>
        {errors.rating && <p className="text-xs text-primary">{errors.rating.message}</p>}
      </div>

      <div className="space-y-2">
        <textarea
          {...register('content')}
          placeholder="Share your thoughts about this movie..."
          rows={4}
          className="w-full bg-secondary/50 border border-white/5 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm resize-none"
        />
        {errors.content && <p className="text-xs text-primary">{errors.content.message}</p>}
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            {...register('hasSpoiler')}
            type="checkbox"
            className="w-4 h-4 rounded border-white/10 bg-secondary/50 text-primary focus:ring-primary/50 cursor-pointer"
          />
          <span className="text-xs font-bold text-secondary-foreground group-hover:text-white transition-colors uppercase tracking-widest">Contains Spoilers</span>
        </label>

        <button
          disabled={isLoading || !rating}
          className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/10"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              Submit Review
              <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;
