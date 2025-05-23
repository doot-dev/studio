import type { User as FirebaseUser } from 'firebase/auth';

export interface User {
  id: string;
  name: string | null;
  avatarUrl: string | null;
  followersCount?: number;
  followingCount?: number;
  postsCount?: number;
}

export interface Review {
  id: string;
  userId: string;
  user?: User; // Populated on fetch
  movieId: string; // Could be an ID from an external movie database
  movieTitle: string;
  ottLink: string;
  thumbnailUrl: string;
  reviewText: string;
  genres: string[];
  createdAt: Date;
  likesCount?: number;
  commentsCount?: number;
}

export interface WatchlistItem {
  id: string;
  userId: string;
  reviewId: string; // Link to a review post if it's from our platform
  movieTitle: string;
  thumbnailUrl: string;
  addedAt: Date;
  watched: boolean;
}

// Extend FirebaseUser with application-specific fields if needed
export interface AppUser extends FirebaseUser {
  // custom fields like username, profilePictureUrl etc.
  username?: string;
}
