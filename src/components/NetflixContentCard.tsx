
import Image from 'next/image';
import Link from 'next/link';
import type { Review } from '@/types';
import { Card } from '@/components/ui/card';
import { PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NetflixContentCardProps {
  review: Review;
  className?: string;
}

export function NetflixContentCard({ review, className }: NetflixContentCardProps) {
  return (
    <Card className={cn(
      "overflow-hidden group relative flex flex-col h-full shadow-lg transition-all duration-300 ease-in-out bg-card border-transparent",
      "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background", // Added focus-within styling for accessibility on keyboard nav
      "md:hover:shadow-xl md:hover:border-primary/50 md:hover:-translate-y-1", // Desktop hover effects
      className
    )}>
      {/* Wrapper for image and play button for positioning context */}
      <div className="relative aspect-[2/3] w-full">
        {/* Link for the image to go to review details */}
        <Link href={`/review/${review.id}`} passHref legacyBehavior>
          <a className="block w-full h-full rounded-t-lg overflow-hidden" aria-label={`View details for ${review.movieTitle}`}>
            <Image
              src={review.thumbnailUrl}
              alt={`Thumbnail for ${review.movieTitle}`}
              fill
              sizes="(max-width: 640px) 30vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, 15vw" // Adjusted sizes
              className="object-cover transition-transform duration-300 md:group-hover:scale-105"
              data-ai-hint="movie poster cinematic"
            />
          </a>
        </Link>
        {/* Play button overlay - links to external OTT. */}
        <a
          href={review.ottLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()} // Prevents Link navigation when play is clicked
          className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 focus:opacity-100"
          aria-label={`Play ${review.movieTitle} on OTT site`}
        >
          <PlayCircle className="h-10 w-10 text-white/80 hover:text-white md:h-12 md:w-12 transition-transform hover:scale-110" />
        </a>
      </div>

      {/* Content below the image - Title only */}
      <div className="px-2 py-1.5 text-center">
        <h3 className="text-xs sm:text-sm font-medium text-foreground truncate" title={review.movieTitle}>
          <Link href={`/review/${review.id}`} className="hover:underline focus:outline-none focus:ring-1 focus:ring-ring rounded">
            {review.movieTitle}
          </Link>
        </h3>
      </div>
    </Card>
  );
}
