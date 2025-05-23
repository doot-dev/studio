'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { XIcon, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { autoTagReviewPost, type AutoTagReviewPostInput } from '@/ai/flows/auto-tag-review-post';

const reviewSchema = z.object({
  movieTitle: z.string().min(1, 'Movie title is required'),
  ottLink: z.string().url('Must be a valid URL').min(1, 'OTT link is required'),
  thumbnailUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')), // Optional for now
  reviewText: z.string().min(10, 'Review must be at least 10 characters'),
  genres: z.array(z.string()).min(1, 'At least one genre is required'),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

export function ReviewForm() {
  const { toast } = useToast();
  const [customGenre, setCustomGenre] = useState('');
  const [isSuggestingGenres, setIsSuggestingGenres] = useState(false);

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      movieTitle: '',
      ottLink: '',
      thumbnailUrl: '',
      reviewText: '',
      genres: [],
    },
  });

  const movieTitle = watch('movieTitle');
  const ottLink = watch('ottLink');
  const currentGenres = watch('genres');

  const handleAddGenre = () => {
    if (customGenre.trim() && !currentGenres.includes(customGenre.trim())) {
      setValue('genres', [...currentGenres, customGenre.trim()]);
      setCustomGenre('');
    }
  };

  const handleRemoveGenre = (genreToRemove: string) => {
    setValue('genres', currentGenres.filter(genre => genre !== genreToRemove));
  };

  const handleSuggestGenres = async () => {
    if (!movieTitle || !ottLink) {
      toast({
        title: 'Missing Information',
        description: 'Please enter a movie title and OTT link to suggest genres.',
        variant: 'destructive',
      });
      return;
    }
    setIsSuggestingGenres(true);
    try {
      const input: AutoTagReviewPostInput = { title: movieTitle, ottLink };
      const result = await autoTagReviewPost(input);
      if (result.genres && result.genres.length > 0) {
        const newGenres = result.genres.filter(g => !currentGenres.includes(g));
        setValue('genres', [...currentGenres, ...newGenres]);
        toast({
          title: 'Genres Suggested',
          description: `${newGenres.length} new genre(s) added.`,
        });
      } else {
        toast({
          title: 'No New Genres Found',
          description: 'The AI couldn\'t suggest any new genres based on the input.',
        });
      }
    } catch (error) {
      console.error('Error suggesting genres:', error);
      toast({
        title: 'Error Suggesting Genres',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSuggestingGenres(false);
    }
  };
  
  const onSubmit = (data: ReviewFormData) => {
    console.log(data); // Replace with actual submission logic
    toast({
      title: 'Review Submitted!',
      description: 'Your review for ' + data.movieTitle + ' has been posted.',
    });
    // Reset form potentially
  };

  return (
    <Card className="max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl text-center text-primary">Create a New Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="movieTitle" className="text-foreground/80">Movie/Show Title</Label>
            <Controller
              name="movieTitle"
              control={control}
              render={({ field }) => <Input id="movieTitle" {...field} placeholder="e.g., The Matrix" />}
            />
            {errors.movieTitle && <p className="text-sm text-destructive mt-1">{errors.movieTitle.message}</p>}
          </div>

          <div>
            <Label htmlFor="ottLink" className="text-foreground/80">OTT Link (Netflix, Hulu, etc.)</Label>
            <Controller
              name="ottLink"
              control={control}
              render={({ field }) => <Input id="ottLink" {...field} placeholder="https://www.netflix.com/title/..." />}
            />
            {errors.ottLink && <p className="text-sm text-destructive mt-1">{errors.ottLink.message}</p>}
          </div>
          
          <div>
            <Label htmlFor="thumbnailUrl" className="text-foreground/80">Thumbnail URL (Optional)</Label>
            <Controller
              name="thumbnailUrl"
              control={control}
              render={({ field }) => <Input id="thumbnailUrl" {...field} placeholder="https://placehold.co/600x900.png" />}
            />
            {errors.thumbnailUrl && <p className="text-sm text-destructive mt-1">{errors.thumbnailUrl.message}</p>}
          </div>

          <div>
            <Label htmlFor="reviewText" className="text-foreground/80">Your Review</Label>
            <Controller
              name="reviewText"
              control={control}
              render={({ field }) => <Textarea id="reviewText" {...field} rows={5} placeholder="What did you think?" />}
            />
            {errors.reviewText && <p className="text-sm text-destructive mt-1">{errors.reviewText.message}</p>}
          </div>

          <div>
            <div className="flex justify-between items-end mb-2">
                <Label htmlFor="genres" className="text-foreground/80">Genres</Label>
                <Button type="button" onClick={handleSuggestGenres} variant="outline" size="sm" disabled={isSuggestingGenres || !movieTitle || !ottLink}>
                    <Wand2 className="mr-2 h-4 w-4" />
                    {isSuggestingGenres ? 'Suggesting...' : 'Suggest Genres'}
                </Button>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Input
                id="customGenre"
                value={customGenre}
                onChange={(e) => setCustomGenre(e.target.value)}
                placeholder="Add a genre (e.g., Comedy)"
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddGenre();}}}
              />
              <Button type="button" onClick={handleAddGenre} variant="secondary">Add</Button>
            </div>
            {errors.genres && <p className="text-sm text-destructive mt-1 mb-2">{errors.genres.message}</p>}
            <div className="flex flex-wrap gap-2">
              {currentGenres.map((genre) => (
                <Badge key={genre} variant="default" className="text-sm bg-accent text-accent-foreground hover:bg-accent/90">
                  {genre}
                  <button
                    type="button"
                    onClick={() => handleRemoveGenre(genre)}
                    className="ml-2 appearance-none border-none bg-transparent p-0 cursor-pointer text-accent-foreground hover:text-white"
                    aria-label={`Remove ${genre}`}
                  >
                    <XIcon className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
          <CardFooter className="p-0 pt-6">
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3">Post Review</Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
