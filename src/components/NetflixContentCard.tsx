
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
    <Card className={cn("overflow-hidden group relative flex flex-col h-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out bg-card border-transparent hover:border-primary/50 transform hover:-translate-y-1", className)}>
      {/* Wrapper for image and play button to manage positioning context */}
      <div className="relative aspect-[2/3] w-full">
        {/* Link for the image to go to review details */}
        <Link href={`/review/${review.id}`} passHref legacyBehavior>
          <a className="block w-full h-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-t-lg" aria-label={`View details for ${review.movieTitle}`}>
            <Image
              src={review.thumbnailUrl}
              alt={`Thumbnail for ${review.movieTitle}`}
              fill
              sizes="(max-width: 640px) 40vw, (max-width: 768px) 30vw, (max-width: 1024px) 20vw, 15vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105 rounded-t-md"
              data-ai-hint="movie poster cinematic"
            />
          </a>
        </Link>
        {/* Play button overlay - links to external OTT.
            This 'a' tag is now a sibling to the 'a' tag rendered by the Link above (in terms of DOM nesting within this div),
            and is absolutely positioned to overlay the image. */}
        <a
          href={review.ottLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()} // Prevents Link navigation when play is clicked
          className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 focus:opacity-100"
          aria-label={`Play ${review.movieTitle} on OTT site`}
        >
          <PlayCircle className="h-12 w-12 sm:h-16 sm:w-16 text-white/90 hover:text-white transition-transform hover:scale-110" />
        </a>
      </div>

      {/* Content below the image */}
      <div className="p-2 text-center flex-grow flex flex-col justify-between">
        <h3 className="text-xs sm:text-sm font-semibold text-foreground truncate">
          <Link href={`/review/${review.id}`} className="hover:underline focus:outline-none focus:ring-1 focus:ring-ring rounded">
            {review.movieTitle}
          </Link>
        </h3>
      </div>
    </Card>
  );
}
