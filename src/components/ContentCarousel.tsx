
'use client';

import type { Review } from '@/types';
import { NetflixContentCard } from './NetflixContentCard';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useEffect } from 'react';

interface ContentCarouselProps {
  title: string;
  items: Review[];
}

export function ContentCarousel({ title, items }: ContentCarouselProps) {
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (contentWrapperRef.current && contentWrapperRef.current.parentElement) {
      // The parentElement of the content wrapper should be the ScrollArea Viewport
      viewportRef.current = contentWrapperRef.current.parentElement as HTMLElement;
    }
  }, []); // Runs once after mount and when items change to ensure viewportRef is updated

  const scroll = (direction: 'left' | 'right') => {
    if (viewportRef.current) {
      const viewport = viewportRef.current;
      // Scroll by a percentage of the viewport's width, e.g., 75%
      const scrollAmount = viewport.clientWidth * 0.75; 
      viewport.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!items || items.length === 0) {
    return null;
  }

  // Determine if scroll buttons should be visible
  // This is a basic check, a more robust solution might involve checking scrollWidth vs clientWidth
  const showScrollButtons = items.length > 3; // Adjust this threshold as needed

  return (
    <section className="space-y-3 group/carousel"> {/* Changed group to group/carousel to avoid conflicts */}
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h2>
      <div className="relative">
        <ScrollArea className="w-full whitespace-nowrap rounded-md">
           <div className="flex w-max space-x-2 sm:space-x-3 pb-4" ref={contentWrapperRef}>
            {items.map((item) => (
              <NetflixContentCard 
                key={item.id} 
                review={item} 
                // Adjusted card widths for better mobile and responsive scaling
                // Aims for roughly 2.5 to 3.5 cards visible on mobile.
                className="w-[120px] xs:w-[130px] sm:w-[150px] md:w-[170px] lg:w-[190px] xl:w-[210px]"
              />
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="invisible" /> {/* Rely on buttons/swipe */}
        </ScrollArea>
        {showScrollButtons && (
          <>
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1 sm:p-2 bg-background/50 hover:bg-background/80 rounded-full shadow-md 
                         opacity-0 md:group-hover/carousel:opacity-100 transition-all focus:opacity-100 
                         -ml-2 md:ml-0 disabled:opacity-0 disabled:cursor-not-allowed"
              aria-label="Scroll left"
              // Basic disabled state, can be improved with onScroll listener on viewportRef
              // disabled={viewportRef.current?.scrollLeft === 0} 
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-foreground" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1 sm:p-2 bg-background/50 hover:bg-background/80 rounded-full shadow-md 
                         opacity-0 md:group-hover/carousel:opacity-100 transition-all focus:opacity-100 
                         -mr-2 md:mr-0 disabled:opacity-0 disabled:cursor-not-allowed"
              aria-label="Scroll right"
              // Basic disabled state, can be improved
              // disabled={viewportRef.current ? viewportRef.current.scrollLeft + viewportRef.current.clientWidth >= viewportRef.current.scrollWidth : false}
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-foreground" />
            </button>
          </>
        )}
      </div>
    </section>
  );
}
