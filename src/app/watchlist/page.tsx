import { PostCard } from '@/components/PostCard'; // Reusing PostCard if appropriate, or a new WatchlistItemCard
import { mockWatchlistItems, mockReviews } from '@/data/mock';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';

export default function WatchlistPage() {
  // Map mockWatchlistItems to full review details if needed or use a simpler card
  const watchlistContent = mockWatchlistItems.map(item => {
    const reviewDetails = mockReviews.find(r => r.id === item.reviewId); // Find corresponding review
    return { ...item, reviewDetails };
  });

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-2">My Watchlist</h1>
        <p className="text-lg text-muted-foreground">Movies and shows you want to watch or have watched.</p>
      </div>
      {watchlistContent.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {watchlistContent.map((item) => (
             // Using a custom card for watchlist item for more specific layout
            (<Card key={item.id} className="overflow-hidden flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="p-0 relative">
                <Link
                  href={item.reviewDetails ? `/review/${item.reviewDetails.id}` : '#'}
                  passHref
                  >
                    <Image
                    src={item.thumbnailUrl}
                    alt={`Thumbnail for ${item.movieTitle}`}
                    width={300}
                    height={450}
                    className="w-full h-auto object-cover aspect-[2/3]"
                    data-ai-hint="movie poster small"
                    />
                </Link>
              </CardHeader>
              <CardContent className="p-4 flex-grow">
                <CardTitle className="text-lg mb-2 hover:text-accent transition-colors">
                  <Link
                    href={item.reviewDetails ? `/review/${item.reviewDetails.id}` : '#'}
                    >{item.movieTitle}</Link>
                </CardTitle>
                <p className="text-xs text-muted-foreground">Added: {new Date(item.addedAt).toLocaleDateString()}</p>
              </CardContent>
              <CardFooter className="p-4 border-t border-border/50">
                <Button variant={item.watched ? "secondary" : "outline"} className="w-full">
                  {item.watched ? <CheckCircle className="mr-2 h-4 w-4" /> : <Circle className="mr-2 h-4 w-4" />}
                  {item.watched ? 'Watched' : 'Mark as Watched'}
                </Button>
              </CardFooter>
            </Card>)
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-10">Your watchlist is empty. Add some movies and shows!</p>
      )}
    </div>
  );
}
