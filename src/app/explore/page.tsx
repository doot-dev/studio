
'use client';

import { useState, useEffect, type FormEvent, Suspense } from "react";
import { useSearchParams } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { PostCard } from "@/components/PostCard";
import { mockReviews } from "@/data/mock";
import type { Review } from "@/types";

function ExplorePageContent() {
  const searchParams = useSearchParams();
  const initialGenre = searchParams.get('genre');

  const [searchQuery, setSearchQuery] = useState(initialGenre || '');
  const [displayedReviews, setDisplayedReviews] = useState<Review[]>([]);
  const [pageTitle, setPageTitle] = useState('Explore All Content');
  const [hasSearchedWithQuery, setHasSearchedWithQuery] = useState(!!initialGenre);

  useEffect(() => {
    if (initialGenre) {
      const lowerCaseGenre = initialGenre.toLowerCase();
      const results = mockReviews.filter(review =>
        review.genres.some(g => g.toLowerCase() === lowerCaseGenre)
      );
      setDisplayedReviews(results);
      setPageTitle(`Reviews for "${initialGenre.charAt(0).toUpperCase() + initialGenre.slice(1)}"`);
      setSearchQuery(initialGenre); // Pre-fill search bar
      setHasSearchedWithQuery(true);
    } else {
      setDisplayedReviews(mockReviews);
      setPageTitle('Explore All Content');
    }
  }, [initialGenre]);

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!searchQuery.trim()) {
      setDisplayedReviews(mockReviews);
      setPageTitle('Explore All Content');
      setHasSearchedWithQuery(false);
      return;
    }

    setHasSearchedWithQuery(true);
    const lowerCaseQuery = searchQuery.toLowerCase();
    const results = mockReviews.filter(review => {
      const titleMatch = review.movieTitle.toLowerCase().includes(lowerCaseQuery);
      const genreMatch = review.genres.some(genre => genre.toLowerCase().includes(lowerCaseQuery));
      const userMatch = review.user?.name?.toLowerCase().includes(lowerCaseQuery);
      const reviewTextMatch = review.reviewText.toLowerCase().includes(lowerCaseQuery);
      return titleMatch || genreMatch || userMatch || reviewTextMatch;
    });

    setDisplayedReviews(results);
    setPageTitle(`Search Results for "${searchQuery}"`);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">Explore DootRec</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Find your next favorite movie or show, discover new creators, or dive into specific genres.
        </p>
      </div>

      <form onSubmit={handleSearchSubmit} className="flex w-full max-w-2xl mx-auto items-center space-x-2">
        <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search movies, shows, users, genres..."
              className="pl-10 pr-4 py-3 h-12 text-base rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
        <Button type="submit" size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">Search</Button>
      </form>

      <div>
        <h2 className="text-2xl font-semibold mb-6 text-center sm:text-left">{pageTitle}</h2>
        {displayedReviews.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayedReviews.map((review) => (
              <PostCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          hasSearchedWithQuery && searchQuery.trim() !== '' && (
            <p className="text-center text-muted-foreground py-10">No results found for "{searchQuery}". Try a different search!</p>
          )
        )}
        {!hasSearchedWithQuery && displayedReviews.length === 0 && mockReviews.length === 0 && (
             <p className="text-center text-muted-foreground py-10">No content available to explore yet.</p>
        )}
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ExplorePageContent />
    </Suspense>
  );
}
