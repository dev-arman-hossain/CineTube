export type Role = 'USER' | 'ADMIN';
export type MediaType = 'MOVIE' | 'SERIES';
export type ContentType = 'FREE' | 'PREMIUM';
export type ReviewStatus = 'PENDING' | 'PUBLISHED' | 'UNPUBLISHED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  createdAt: string;
  isPremium?: boolean;
  lastLogin?: string;
}

export interface Media {
  id: string;
  title: string;
  synopsis: string;
  genre: string[];
  releaseYear: number;
  director: string;
  cast: string[];
  platform: string[];
  posterUrl?: string;
  backdropUrl?: string;
  streamingLink?: string;
  type: MediaType;
  contentType: ContentType;
  avgRating: number;
  totalRatings: number;
  reviews?: Review[];
  isLocked?: boolean;
}

export interface Review {
  id: string;
  rating: number;
  content: string;
  tags: string[];
  hasSpoiler: boolean;
  status: ReviewStatus;
  userId: string;
  mediaId: string;
  user?: User;
  media?: Media;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  userId: string;
}
