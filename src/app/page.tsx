import { FeedTabs } from '@/components/FeedTabs';
import { mockReviews } from '@/data/mock';

export default function HomePage() {
  // For now, both feeds use the same mock data.
  // In a real app, these would be fetched based on user's following list and trending algorithms.
  const trendingReviews = mockReviews;
  const followingReviews = mockReviews.slice(0,2); // Simulate a smaller following feed

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight text-center sm:text-4xl md:text-5xl">
        Discover What's Buzzing
      </h1>
      <FeedTabs trendingReviews={trendingReviews} followingReviews={followingReviews} />
    </div>
  );
}
