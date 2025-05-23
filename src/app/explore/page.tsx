import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { PostCard } from "@/components/PostCard";
import { mockReviews } from "@/data/mock"; // Using mock data for now

export default function ExplorePage() {
  const searchResults = mockReviews.slice(0,3); // Placeholder search results

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">Explore Reels</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Find your next favorite movie or show, discover new creators, or dive into specific genres.
        </p>
      </div>

      <div className="flex w-full max-w-2xl mx-auto items-center space-x-2">
        <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input type="search" placeholder="Search for movies, shows, users, genres..." className="pl-10 pr-4 py-3 h-12 text-base rounded-lg" />
        </div>
        <Button type="submit" size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">Search</Button>
      </div>

      {/* Placeholder for search results or featured content */}
      <div>
        <h2 className="text-2xl font-semibold mb-6 text-center sm:text-left">Featured Reviews</h2>
        {searchResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {searchResults.map((review) => (
              <PostCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-10">No results to display yet. Try a search!</p>
        )}
      </div>
    </div>
  );
}
