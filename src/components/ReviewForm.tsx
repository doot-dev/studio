
'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { XIcon, Wand2, UploadCloud, Loader2, FileImage } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { autoTagReviewPost, type AutoTagReviewPostInput } from '@/ai/flows/auto-tag-review-post';
import imageCompression from 'browser-image-compression';
import Image from 'next/image';

const reviewSchema = z.object({
  movieTitle: z.string().min(1, 'Movie title is required'),
  ottLink: z.string().url('Must be a valid URL').min(1, 'OTT link is required'),
  thumbnailUrl: z.string().url('Must be a valid URL for the thumbnail').optional().or(z.literal('')),
  reviewText: z.string().min(10, 'Review must be at least 10 characters'),
  genres: z.array(z.string()).min(1, 'At least one genre is required'),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

export function ReviewForm() {
  const { toast } = useToast();
  const [customGenre, setCustomGenre] = useState('');
  const [isSuggestingGenres, setIsSuggestingGenres] = useState(false);

  const [selectedThumbnailFile, setSelectedThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);


  const { control, handleSubmit, watch, setValue, formState: { errors }, clearErrors } = useForm<ReviewFormData>({
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
  const currentThumbnailUrl = watch('thumbnailUrl');

  useEffect(() => {
    // Clean up object URL to prevent memory leaks
    return () => {
      if (thumbnailPreview) {
        URL.revokeObjectURL(thumbnailPreview);
      }
    };
  }, [thumbnailPreview]);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setSelectedThumbnailFile(null);
      setThumbnailPreview(null);
      return;
    }

    setIsCompressing(true);
    toast({ title: 'Compressing image...', description: 'Please wait.' });

    const options = {
      maxSizeMB: 1, // Max file size after compression
      maxWidthOrHeight: 1920, // Max width or height
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      setSelectedThumbnailFile(compressedFile);
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview); // Revoke old preview
      setThumbnailPreview(URL.createObjectURL(compressedFile));
      setValue('thumbnailUrl', ''); // Clear manual URL if a file is uploaded
      clearErrors('thumbnailUrl');
      toast({ title: 'Image Compressed', description: 'Thumbnail ready for upload.' });
    } catch (error) {
      console.error('Error compressing image:', error);
      toast({
        title: 'Image Compression Failed',
        description: 'Could not compress the image. Please try a different one or check console.',
        variant: 'destructive',
      });
      setSelectedThumbnailFile(null);
      setThumbnailPreview(null);
    } finally {
      setIsCompressing(false);
      // Reset file input to allow re-selection of the same file if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

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
    let finalThumbnailUrl = data.thumbnailUrl;

    if (selectedThumbnailFile) {
      console.log('A file was selected for upload:', selectedThumbnailFile);
      // Here, you would typically upload `selectedThumbnailFile` to your storage (e.g., Firebase Storage)
      // and get back a public URL. This URL would then become `finalThumbnailUrl`.
      // For now, we'll just log it.
      // Example: finalThumbnailUrl = await uploadFileAndGetURL(selectedThumbnailFile);
      // If using the preview (local blob URL) for temp display: finalThumbnailUrl = thumbnailPreview;
      // However, blob URLs are not persistent and shouldn't be stored in a database.
      // Let's assume the backend handles file upload and provides the URL.
      // So, we would pass `selectedThumbnailFile` to the backend.
      // For this example, we'll clear `finalThumbnailUrl` if a file is chosen,
      // implying the backend will generate it from the file.
      finalThumbnailUrl = ''; // Or pass selectedThumbnailFile separately
       toast({
        title: 'Review Submitted (with file)',
        description: `File '${selectedThumbnailFile.name}' would be uploaded. Review for ${data.movieTitle} has been posted.`,
      });
    } else if (data.thumbnailUrl) {
      console.log('Using manually entered thumbnail URL:', data.thumbnailUrl);
       toast({
        title: 'Review Submitted (with URL)',
        description: 'Your review for ' + data.movieTitle + ' has been posted using the provided URL.',
      });
    } else {
      console.log('No thumbnail provided.');
       toast({
        title: 'Review Submitted (no thumbnail)',
        description: 'Your review for ' + data.movieTitle + ' has been posted.',
      });
    }
    
    const submissionData = {
      ...data,
      // If selectedThumbnailFile exists, it needs to be handled by an upload process.
      // The final URL from that upload would replace data.thumbnailUrl.
      // For now, we are logging; actual implementation requires backend integration.
      finalThumbnailUrlToStore: finalThumbnailUrl, // This would be the URL from storage if a file was uploaded
      uploadedFile: selectedThumbnailFile ? selectedThumbnailFile.name : null
    };
    console.log('Final Submission Data:', submissionData);


    // Reset form potentially (excluding file input which is handled by ref)
    // setValue('movieTitle', '');
    // setValue('ottLink', '');
    // setValue('thumbnailUrl', '');
    // setValue('reviewText', '');
    // setValue('genres', []);
    // setSelectedThumbnailFile(null);
    // setThumbnailPreview(null);
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
            <Label htmlFor="thumbnail" className="text-foreground/80">Thumbnail</Label>
            <div className="mt-1 space-y-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isCompressing}
                className="w-full"
              >
                {isCompressing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <UploadCloud className="mr-2 h-4 w-4" />
                )}
                {isCompressing ? 'Compressing...' : (selectedThumbnailFile ? 'Change Image' : 'Upload Image')}
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
                id="thumbnail-file-input"
              />
              {thumbnailPreview && (
                <div className="mt-2 relative w-full aspect-video rounded-md overflow-hidden border border-dashed border-muted-foreground/50 flex items-center justify-center">
                   <Image src={thumbnailPreview} alt="Thumbnail preview" layout="fill" objectFit="contain" />
                </div>
              )}
              {!thumbnailPreview && currentThumbnailUrl && (
                 <div className="mt-2 text-xs text-muted-foreground">
                   Using manually entered URL: <span className="italic">{currentThumbnailUrl.substring(0,50)}{currentThumbnailUrl.length > 50 ? "..." : ""}</span>
                 </div>
              )}
               {!thumbnailPreview && !currentThumbnailUrl && (
                <div className="mt-2 p-4 border border-dashed border-muted-foreground/50 rounded-md flex flex-col items-center justify-center text-muted-foreground">
                  <FileImage className="h-8 w-8 mb-2" />
                  <span>No thumbnail selected. Upload or paste URL below.</span>
                </div>
              )}
            </div>
            <div className="mt-3">
                <Label htmlFor="thumbnailUrl" className="text-xs text-muted-foreground">Or paste image URL</Label>
                <Controller
                  name="thumbnailUrl"
                  control={control}
                  render={({ field }) => (
                    <Input 
                      id="thumbnailUrl" 
                      {...field} 
                      placeholder="https://example.com/image.png" 
                      disabled={!!selectedThumbnailFile || isCompressing}
                      onChange={(e) => {
                        field.onChange(e);
                        if (e.target.value) { // If user types a URL, clear uploaded file
                          setSelectedThumbnailFile(null);
                          if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
                          setThumbnailPreview(null);
                        }
                      }}
                    />
                  )}
                />
            </div>
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
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3" disabled={isCompressing || isSuggestingGenres}>
              {(isCompressing || isSuggestingGenres) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Post Review
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
