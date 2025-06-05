
'use client';

import type { Review } from '@/types';
import { NetflixContentCard } from './NetflixContentCard';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

interface ContentCarouselProps {
  title: string;
  items: Review[];
}

export function ContentCarousel({ title, items }: ContentCarouselProps) {
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    // This effect sets up the viewportRef and manages scroll button states.
    // It depends on 'items' because scrollability and dimensions change with content.
    if (contentWrapperRef.current?.parentElement) {
      viewportRef.current = contentWrapperRef.current.parentElement as HTMLElement;
    }

    const updateScrollButtonState = () => {
      if (viewportRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = viewportRef.current;
        // Check if we can scroll left (not at the absolute beginning)
        // Adding a small buffer (e.g., 5px) can help with precision issues
        setCanScrollLeft(scrollLeft > 5);
        // Check if we can scroll right (not at the absolute end)
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
      } else {
        // Default states if viewport is not yet available
        setCanScrollLeft(false);
        // Assume can scroll right if there are items and viewport isn't ready
        // This will be corrected once viewportRef is set and observer runs
        setCanScrollRight(items.length > 1); 
      }
    };

    // Call immediately to set initial state
    updateScrollButtonState();

    const currentViewport = viewportRef.current;
    if (currentViewport) {
      // Listen to scroll events on the viewport
      currentViewport.addEventListener('scroll', updateScrollButtonState, { passive: true });
      
      // Use ResizeObserver to detect changes in viewport or content size
      const observer = new ResizeObserver(updateScrollButtonState);
      observer.observe(currentViewport);
      if (contentWrapperRef.current) {
        observer.observe(contentWrapperRef.current);
      }

      // Cleanup function
      return () => {
        currentViewport.removeEventListener('scroll', updateScrollButtonState);
        observer.disconnect();
      };
    }
  }, [items]); // Key dependency: re-run when items array changes

  const scroll = (direction: 'left' | 'right') => {
    if (viewportRef.current) {
      const viewport = viewportRef.current;
      // Scroll by a percentage of the viewport's width, e.g., 75% or a fixed amount
      const scrollAmount = viewport.clientWidth * 0.8; // Scroll by 80% of visible width
      viewport.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!items || items.length === 0) {
    return null;
  }

  // Determine if scroll buttons should be visible based on a heuristic (e.g., more items than typically fit)
  // This can be refined, but a simple item count is often sufficient for visibility.
  // Actual disabling is handled by canScrollLeft/Right state.
  const showScrollButtons = items.length > 1; // Show if there's more than one item

  return (
    <section className="space-y-3 group/carousel">
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h2>
      <div className="relative">
        <ScrollArea className="w-full whitespace-nowrap rounded-md">
           <div className="flex w-max space-x-2 sm:space-x-3 pb-4" ref={contentWrapperRef}>
            {items.map((item) => (
              <NetflixContentCard 
                key={item.id} 
                review={item} 
                className="w-[120px] xs:w-[130px] sm:w-[150px] md:w-[170px] lg:w-[190px] xl:w-[210px]"
              />
            ))}
          </div>
          {/* 
            The ScrollBar can be kept for accessibility or touch devices that might not see buttons.
            It's visually hidden by default by ShadCN if not needed or can be styled further.
            Making it visible on hover along with buttons can be an option.
          */}
          <ScrollBar orientation="horizontal" className="invisible md:visible md:group-hover/carousel:visible" />
        </ScrollArea>
        {showScrollButtons && (
          <>
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1 sm:p-2 bg-background/60 hover:bg-background/90 rounded-full shadow-md 
                         opacity-0 md:group-hover/carousel:opacity-100 transition-all focus:opacity-100 
                         -ml-3 md:-ml-1 disabled:opacity-20 disabled:cursor-not-allowed"
              aria-label="Scroll left"
              disabled={!canScrollLeft}
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-foreground" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1 sm:p-2 bg-background/60 hover:bg-background/90 rounded-full shadow-md 
                         opacity-0 md:group-hover/carousel:opacity-100 transition-all focus:opacity-100 
                         -mr-3 md:-mr-1 disabled:opacity-20 disabled:cursor-not-allowed"
              aria-label="Scroll right"
              disabled={!canScrollRight}
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-foreground" />
            </button>
          </>
        )}
      </div>
    </section>
  );
}
