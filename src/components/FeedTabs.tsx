'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostCard } from "@/components/PostCard";
import type { Review } from "@/types";

interface FeedTabsProps {
  trendingReviews: Review[];
  followingReviews: Review[]; // Initially might be same as trending or empty
}

export function FeedTabs({ trendingReviews, followingReviews }: FeedTabsProps) {
  return (
    <Tabs defaultValue="trending" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6 sm:w-96 mx-auto">
        <TabsTrigger value="trending">Trending</TabsTrigger>
        <TabsTrigger value="following">Following</TabsTrigger>
      </TabsList>
      <TabsContent value="trending">
        {trendingReviews.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {trendingReviews.map((review) => (
              <PostCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-10">No trending reviews right now. Check back later!</p>
        )}
      </TabsContent>
      <TabsContent value="following">
         {followingReviews.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {followingReviews.map((review) => (
              <PostCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-10">Follow users to see their reviews here, or explore trending content!</p>
        )}
      </TabsContent>
    </Tabs>
  );
}
