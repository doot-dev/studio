
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
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8; // Scroll by 80% of visible width
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
    <section className="space-y-3">
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h2>
      <div className="relative">
        <ScrollArea className="w-full whitespace-nowrap rounded-md">
           <div className="flex w-max space-x-4 pb-4" ref={scrollContainerRef}>
            {items.map((item) => (
              <NetflixContentCard key={item.id} review={item} className="w-[200px] sm:w-[220px] md:w-[240px] lg:w-[260px]" />
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="invisible group-hover:visible" />
        </ScrollArea>
        { items.length > 4 && /* Show scroll buttons only if there's enough content to scroll */ (
          <>
            <button 
              onClick={() => scroll('left')} 
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-background/70 hover:bg-background/90 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-6 w-6 text-foreground" />
            </button>
            <button 
              onClick={() => scroll('right')} 
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-background/70 hover:bg-background/90 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-6 w-6 text-foreground" />
            </button>
          </>
        )}
      </div>
    </section>
  );
}
