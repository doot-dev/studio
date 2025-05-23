
import Image from 'next/image';
import Link from 'next/link';
import type { Review } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlayCircle, Heart, MessageSquare, Share2, ListPlus, UserPlus, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NetflixContentCardProps {
  review: Review;
  className?: string;
}

export function NetflixContentCard({ review, className }: NetflixContentCardProps) {
  return (
    <Card className={cn("overflow-hidden group relative flex flex-col h-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out bg-card border-transparent hover:border-primary/50 transform hover:-translate-y-1", className)}>
      <div className="relative aspect-[2/3] w-full">
        <Image
          src={review.thumbnailUrl}
          alt={`Thumbnail for ${review.movieTitle}`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          data-ai-hint="movie poster cinematic"
        />
        <a 
          href={review.ottLink} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-label={`Play ${review.movieTitle} on OTT site`}
        >
          <PlayCircle className="h-16 w-16 text-white/80 group-hover:text-white transition-colors" />
        </a>
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             <Button variant="ghost" size="icon" className="h-8 w-8 bg-black/50 hover:bg-black/70" asChild>
                <Link href={`/review/${review.id}`} aria-label="More info">
                    <MoreHorizontal className="h-4 w-4 text-white" />
                </Link>
            </Button>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <h3 className="text-base font-semibold text-white truncate mb-1">
          <Link href={`/review/${review.id}`} className="hover:underline pointer-events-auto">{review.movieTitle}</Link>
        </h3>
        <div className="flex flex-wrap gap-1 mb-1">
          {review.genres.slice(0, 2).map((genre) => (
            <Badge key={genre} variant="secondary" className="text-xs bg-white/20 text-white backdrop-blur-sm px-1.5 py-0.5">
              {genre}
            </Badge>
          ))}
        </div>
        <p className="text-xs text-gray-300 line-clamp-2 mb-2">
          {review.reviewText}
        </p>
        <div className="flex items-center space-x-2 mt-1 pointer-events-auto">
          <Button variant="ghost" size="icon" className="h-7 w-7 p-1 text-white/80 hover:text-white hover:bg-white/10">
            <Heart className="h-4 w-4" />
            <span className="sr-only">Like</span>
          </Button>
           <Button variant="ghost" size="icon" className="h-7 w-7 p-1 text-white/80 hover:text-white hover:bg-white/10" asChild>
            <Link href={`/review/${review.id}#comments`}>
                <MessageSquare className="h-4 w-4" />
                <span className="sr-only">Comment</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 p-1 text-white/80 hover:text-white hover:bg-white/10">
            <ListPlus className="h-4 w-4" />
            <span className="sr-only">Add to My List</span>
          </Button>
          {review.user && (
             <Button variant="ghost" size="icon" className="h-7 w-7 p-1 text-white/80 hover:text-white hover:bg-white/10" asChild>
                <Link href={`/profile/${review.userId}`}>
                    <UserPlus className="h-4 w-4" />
                    <span className="sr-only">Follow {review.user.name}</span>
                </Link>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
