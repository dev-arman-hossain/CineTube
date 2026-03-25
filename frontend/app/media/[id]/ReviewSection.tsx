'use client';

import { useState, useEffect } from 'react';
import { Review, User as UserType } from '@/types';
import { ReviewService } from '@/services/reviewService';
import { useAuthStore } from '@/store/authStore';
import { Star, ThumbsUp, MessageSquare, AlertCircle, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import ReviewForm from './ReviewForm';
import CommentSection from './CommentSection';

interface ReviewSectionProps {
  mediaId: string;
  onReviewSubmitted?: () => void;
}

const ReviewSection = ({ mediaId, onReviewSubmitted }: ReviewSectionProps) => {
  const [reviews, setReviews] = useState<any[]>([]); // Changed to any to support _count
  const [isLoading, setIsLoading] = useState(true);
  const [expandedReviewId, setExpandedReviewId] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuthStore();

  const fetchReviews = async () => {
    try {
      const response = await ReviewService.getAllReviews({ mediaId, status: 'PUBLISHED' });
      setReviews(response.data);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccess = () => {
    // Small delay to ensure DB has committed
    setTimeout(() => {
      fetchReviews();
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    }, 500);
  };

  useEffect(() => {
    fetchReviews();
  }, [mediaId]);

  const handleLike = async (id: string) => {
    if (!isAuthenticated) return toast.error('Please sign in to like reviews');
    try {
      await ReviewService.toggleLike(id);
      fetchReviews(); // Refresh
    } catch (error) {
      toast.error('Failed to like review');
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review? This will also delete all associated comments.')) return;

    try {
      await ReviewService.deleteReview(id);
      toast.success('Review deleted successfully');
      fetchReviews();
      if (onReviewSubmitted) onReviewSubmitted();
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  return (
    <div className="space-y-12">
      {/* Review Submission Form */}
      <div className="bg-secondary/20 p-8 rounded-3xl border border-white/5">
        <h3 className="text-xl font-bold font-outfit mb-6">Write a Review</h3>
        {isAuthenticated ? (
          <ReviewForm mediaId={mediaId} onSuccess={handleSuccess} />
        ) : (
          <div className="text-center py-6 space-y-4">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto" />
            <p className="text-secondary-foreground">You must be signed in to submit a review.</p>
            <button className="px-6 py-2 bg-primary text-white rounded-xl font-bold">Sign In</button>
          </div>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map(i => <div key={i} className="h-40 bg-neutral-900 rounded-2xl" />)}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 bg-secondary/10 rounded-3xl border border-dashed border-white/10">
            <p className="text-secondary-foreground italic">No reviews yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          reviews.map((review: any) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-secondary/30 rounded-2xl border border-white/5 p-6 hover:border-white/10 transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center border border-primary/20">
                    <span className="text-primary font-black text-sm">{review.user?.name?.[0].toUpperCase() || 'U'}</span>
                  </div>
                  <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">{review.user?.name || 'Anonymous User'}</h4>
                    {review.user?.isPremium && (
                      <span className="text-[8px] bg-yellow-500 text-black px-1.5 py-0.5 rounded-full font-black">PRO</span>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                  <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                  <span className="text-sm font-bold">{review.rating}</span>
                </div>
              </div>

              <div className="space-y-4">
                {review.hasSpoiler ? (
                  <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center opacity-100 group-hover:opacity-0 transition-opacity">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Contains Spoilers (Hover to reveal)</span>
                    </div>
                    <p className="text-secondary-foreground text-sm leading-relaxed">{review.content}</p>
                  </div>
                ) : (
                  <p className="text-secondary-foreground text-sm leading-relaxed">{review.content}</p>
                )}

                <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                  <button
                    onClick={() => handleLike(review.id)}
                    className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    {review._count?.likes || 0} Likes
                  </button>
                  <button
                    onClick={() => setExpandedReviewId(expandedReviewId === review.id ? null : review.id)}
                    className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-white transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    {review._count?.comments || 0} Comments
                    {expandedReviewId === review.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>

                  {isAuthenticated && (user?.id === review.userId || user?.id === review.user?.id || user?.role === 'ADMIN') && (
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors ml-auto"
                      title="Delete Review"
                    >
                      <Trash2 className="w-4 h-4 text-primary" />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  )}
                </div>

                <AnimatePresence>
                  {expandedReviewId === review.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden pt-4"
                    >
                      <CommentSection reviewId={review.id} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
