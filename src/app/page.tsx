import { ContentCarousel } from "@/components/ContentCarousel";
import { mockReviews, mockUsers } from "@/data/mock";
import type { Review } from "@/types";

// Simulate different categories of reviews
const trendingReviews = [...mockReviews].sort(
  (a, b) => (b.likesCount || 0) - (a.likesCount || 0)
);
const topLikedReviews = [...mockReviews]
  .sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0))
  .slice(0, 5);

// Simulate "From Friends" - for now, just picks a few reviews from other users
const reviewsFromFriends = mockReviews
  .filter((r) => r.userId !== mockUsers[0].id)
  .slice(0, 5);

// Simulate "Recommended" - for now, just shuffles some reviews
const recommendedReviews = [...mockReviews]
  .sort(() => 0.5 - Math.random())
  .slice(0, 10);

// Simulate "Latest by Genre" - for now, picks a genre and shows latest for it.
// In a real app, this would be more dynamic or multiple carousels.
const actionGenreReviews = mockReviews
  .filter((r) => r.genres.includes("Action"))
  .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  .slice(0, 5);
const sciFiGenreReviews = mockReviews
  .filter((r) => r.genres.includes("Sci-Fi"))
  .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  .slice(0, 5);

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero section could go here - TBD */}

      <ContentCarousel title="Trending Now" items={trendingReviews} />
      <ContentCarousel title="Top Liked Reviews" items={topLikedReviews} />
      <ContentCarousel
        title="From People You Might Know"
        items={reviewsFromFriends}
      />
      <ContentCarousel title="Recommended For You" items={recommendedReviews} />
      <ContentCarousel title="Latest Action" items={actionGenreReviews} />
      <ContentCarousel title="Latest Sci-Fi" items={sciFiGenreReviews} />

      {/* Add more carousels as needed */}
    </div>
  );
}
