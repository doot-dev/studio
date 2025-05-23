
'use client';

import type { Review } from '@/types';
import { NetflixContentCard } from './NetflixContentCard';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';

interface ContentCarouselProps {
  title: string;
  items: Review[];
}

export function ContentCarousel({ title, items }: ContentCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.75; // Scroll by 75% of visible width
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };


  if (!items || items.length === 0) {
    return null; // Don't render if no items
  }

  return (
    <section className="space-y-3 group"> {/* Added group here for button visibility control */}
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h2>
      <div className="relative">
        <ScrollArea className="w-full whitespace-nowrap rounded-md">
           <div className="flex w-max space-x-3 sm:space-x-4 pb-4" ref={scrollContainerRef}>
            {items.map((item) => (
              // Adjusted card widths for better mobile and responsive scaling
              <NetflixContentCard key={item.id} review={item} className="w-[140px] xs:w-[150px] sm:w-[170px] md:w-[190px] lg:w-[210px]" />
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="invisible" /> {/* Hide default scrollbar, rely on buttons/swipe */}
        </ScrollArea>
        { items.length > 2 && /* Show scroll buttons only if there's enough content to scroll (adjust as needed) */ (
          <>
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-background/60 hover:bg-background/90 rounded-full shadow-md opacity-0 md:group-hover:opacity-100 transition-all focus:opacity-100 md:focus:group-hover:opacity-100 -ml-3 md:ml-0 disabled:opacity-0 disabled:cursor-not-allowed"
              aria-label="Scroll left"
              // Basic logic to disable button at start (can be improved with scroll event listeners)
              // disabled={scrollContainerRef.current?.scrollLeft === 0} 
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-foreground" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-background/60 hover:bg-background/90 rounded-full shadow-md opacity-0 md:group-hover:opacity-100 transition-all focus:opacity-100 md:focus:group-hover:opacity-100 -mr-3 md:mr-0 disabled:opacity-0 disabled:cursor-not-allowed"
              aria-label="Scroll right"
              // Basic logic to disable button at end (can be improved)
              // disabled={scrollContainerRef.current ? scrollContainerRef.current.scrollLeft + scrollContainerRef.current.clientWidth >= scrollContainerRef.current.scrollWidth : false}
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-foreground" />
            </button>
          </>
        )}
      </div>
    </section>
  );
}
