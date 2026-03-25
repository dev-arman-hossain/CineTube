'use client';

import { useState, useEffect } from 'react';
import { CommentService } from '@/services/commentService';
import { useAuthStore } from '@/store/authStore';
import { Send, Loader2, User as UserIcon, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface CommentSectionProps {
  reviewId: string;
}

const CommentSection = ({ reviewId }: CommentSectionProps) => {
  const [comments, setComments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isAuthenticated } = useAuthStore();

  const fetchComments = async () => {
    try {
      const response = await CommentService.getCommentsByReviewId(reviewId);
      setComments(response.data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [reviewId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!isAuthenticated) return toast.error('Please sign in to comment');

    setIsSubmitting(true);
    try {
      await CommentService.createComment({
        reviewId,
        content: newComment,
      });
      setNewComment('');
      fetchComments();
      toast.success('Comment posted');
    } catch (error) {
      toast.error('Failed to post comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await CommentService.deleteComment(id);
      fetchComments();
      toast.success('Comment deleted');
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  };

  return (
    <div className="space-y-6 pt-4 border-t border-white/5 bg-black/20 p-4 rounded-xl">
      {/* List Comments */}
      <div className="space-y-4 max-h-[300px] overflow-y-auto no-scrollbar pr-2">
        {isLoading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
          </div>
        ) : comments.length === 0 ? (
          <p className="text-xs text-muted-foreground italic text-center py-4">No comments yet</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3 group">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0 border border-white/10">
                <UserIcon className="w-4 h-4 text-secondary-foreground" />
              </div>
              <div className="flex-grow space-y-1">
                <div className="flex items-center justify-between">
                  <h5 className="text-[10px] font-bold text-white">{comment.user?.name}</h5>
                  <p className="text-[8px] text-muted-foreground">{new Date(comment.createdAt).toLocaleDateString()}</p>
                </div>
                <p className="text-xs text-secondary-foreground leading-snug">{comment.content}</p>

                {isAuthenticated && (user?.id === comment.userId || user?.id === comment.user?.id || user?.role === 'ADMIN') && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-[8px] text-primary hover:underline opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 pt-1"
                  >
                    <Trash2 className="w-2.5 h-2.5" />
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Field */}
      {isAuthenticated && (
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full bg-secondary/50 border border-white/5 rounded-lg py-2 pl-3 pr-10 text-[11px] focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all text-white"
          />
          <button
            disabled={isSubmitting || !newComment.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-primary disabled:text-muted-foreground transition-colors hover:text-rose-500"
          >
            {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
          </button>
        </form>
      )}
    </div>
  );
};

export default CommentSection;
