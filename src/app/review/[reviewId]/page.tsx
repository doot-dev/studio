
'use client'; // Add this if not already present for useEffect

import { mockReviews, mockUsers } from '@/data/mock';
import Image from 'next/image';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Heart, MessageCircle, Bookmark as BookmarkIcon, Share2, Edit3, Trash2, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react'; // Import useState and useEffect

import { useParams } from 'next/navigation';

export default function ReviewDetailPage() {

  const params = useParams();
  const review = mockReviews.find(r => r.id === params.reviewId);
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    if (review) {
      setFormattedDate(
        new Date(review.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      );
    }
  }, [review]);

  if (!review) {
    return <p className="text-center text-destructive py-10">Review not found.</p>;
  }

  // Assuming current user for edit/delete actions (placeholder)
  const isAuthor = review.userId === mockUsers[0].id;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="overflow-hidden shadow-xl">
        <CardHeader className="p-0 relative">
          <Image
            src={review.thumbnailUrl}
            alt={`Thumbnail for ${review.movieTitle}`}
            width={1200}
            height={675} // 16:9 aspect ratio for a banner
            className="w-full h-auto object-cover aspect-video" // Or keep aspect-[2/3] if preferred
            data-ai-hint="movie banner"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 sm:p-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">{review.movieTitle}</h1>
            <div className="flex flex-wrap gap-2">
              {review.genres.map((genre) => (
                <Badge key={genre} variant="secondary" className="text-xs bg-white/20 text-white backdrop-blur-sm">
                  {genre}
                </Badge>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 pb-6 border-b border-border/50">
            <div className="flex items-center space-x-3 mb-4 sm:mb-0">
              <Avatar className="h-12 w-12">
                <AvatarImage src={review.user?.avatarUrl || undefined} alt={review.user?.name || 'User'} data-ai-hint="user avatar medium" />
                <AvatarFallback className="text-lg">{review.user?.name ? review.user.name.substring(0,1) : 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <Link
                  href={`/profile/${review.userId}`}
                  className="text-lg font-semibold hover:underline"
                  >
                  {review.user?.name || 'Anonymous'}
                </Link>
                <p className="text-sm text-muted-foreground">
                  {formattedDate ? `Posted on ${formattedDate}` : 'Loading date...'}
                </p>
              </div>
            </div>
             <Link href={review.ottLink} target="_blank" rel="noopener noreferrer" className="inline-block">
                <Button variant="outline" size="sm">
                    <ExternalLink className="mr-2 h-4 w-4"/> View on OTT
                </Button>
            </Link>
          </div>

          <article className="prose prose-invert max-w-none text-foreground/90 text-base leading-relaxed">
            <p>{review.reviewText}</p>
          </article>

          <div className="mt-8 pt-6 border-t border-border/50 flex flex-wrap gap-2 justify-between items-center">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex items-center">
                <Heart className="mr-2 h-4 w-4" /> Like ({review.likesCount || 0})
              </Button>
              <Button variant="outline" size="sm" className="flex items-center">
                <MessageCircle className="mr-2 h-4 w-4" /> Comment ({review.commentsCount || 0})
              </Button>
              <Button variant="outline" size="sm" className="flex items-center">
                <BookmarkIcon className="mr-2 h-4 w-4" /> Bookmark
              </Button>
               <Button variant="outline" size="sm" className="flex items-center">
                <Share2 className="mr-2 h-4 w-4" /> Share
              </Button>
            </div>
            {isAuthor && (
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-accent">
                    <Edit3 className="mr-2 h-4 w-4" /> Edit
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      {/* Placeholder for comments section */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Comments</h2>
        <div className="bg-card p-6 rounded-lg shadow-md">
          <p className="text-muted-foreground">Comments are coming soon!</p>
          {/* TODO: Add comment form and list */}
        </div>
      </div>
    </div>
  );
}

// This function can be used if you need to generate static paths for reviews
// export async function generateStaticParams() {
//   return mockReviews.map(review => ({
//     reviewId: review.id,
//   }));
// }
