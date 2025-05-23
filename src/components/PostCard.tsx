import Image from 'next/image';
import Link from 'next/link';
import type { Review } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MessageCircle, Heart, Bookmark as BookmarkIcon, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PostCardProps {
  review: Review;
}

export function PostCard({ review }: PostCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card">
      <CardHeader className="p-0 relative">
        <Link href={`/review/${review.id}`} passHref>
          <Image
            src={review.thumbnailUrl}
            alt={`Thumbnail for ${review.movieTitle}`}
            width={600}
            height={900} // Typical movie poster aspect ratio
            className="w-full h-auto object-cover aspect-[2/3]"
            data-ai-hint="movie poster"
          />
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-xl mb-2 hover:text-accent transition-colors">
          <Link href={`/review/${review.id}`}>{review.movieTitle}</Link>
        </CardTitle>
        <div className="flex items-center space-x-2 mb-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={review.user?.avatarUrl || undefined} alt={review.user?.name || 'User'} data-ai-hint="user avatar small" />
            <AvatarFallback>{review.user?.name ? review.user.name.substring(0,1) : 'U'}</AvatarFallback>
          </Avatar>
          <Link href={`/profile/${review.userId}`} className="text-sm font-medium hover:underline">
            {review.user?.name || 'Anonymous'}
          </Link>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
          {review.reviewText}
        </p>
        <div className="flex flex-wrap gap-1 mb-2">
          {review.genres.slice(0, 3).map((genre) => (
            <Badge key={genre} variant="secondary" className="text-xs">{genre}</Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center border-t border-border/50">
        <div className="flex space-x-3 text-muted-foreground">
          <Button variant="ghost" size="sm" className="flex items-center space-x-1 px-2">
            <Heart className="h-4 w-4" />
            <span>{review.likesCount || 0}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center space-x-1 px-2">
            <MessageCircle className="h-4 w-4" />
            <span>{review.commentsCount || 0}</span>
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" asChild>
            <a href={review.ottLink} target="_blank" rel="noopener noreferrer" aria-label="View on OTT platform">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
          <Button variant="ghost" size="icon" aria-label="Bookmark">
            <BookmarkIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
