'use server';

/**
 * @fileOverview Automatically suggests genre tags for a review post based on the movie/show title and OTT link.
 *
 * - autoTagReviewPost - A function that handles the auto-tagging process.
 * - AutoTagReviewPostInput - The input type for the autoTagReviewPost function.
 * - AutoTagReviewPostOutput - The return type for the autoTagReviewPost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutoTagReviewPostInputSchema = z.object({
  title: z.string().describe('The title of the movie or show.'),
  ottLink: z.string().describe('The link to the movie or show on an OTT platform.'),
});
export type AutoTagReviewPostInput = z.infer<typeof AutoTagReviewPostInputSchema>;

const AutoTagReviewPostOutputSchema = z.object({
  genres: z.array(z.string()).describe('An array of suggested genre tags for the review post.'),
});
export type AutoTagReviewPostOutput = z.infer<typeof AutoTagReviewPostOutputSchema>;

export async function autoTagReviewPost(input: AutoTagReviewPostInput): Promise<AutoTagReviewPostOutput> {
  return autoTagReviewPostFlow(input);
}

const prompt = ai.definePrompt({
  name: 'autoTagReviewPostPrompt',
  input: {schema: AutoTagReviewPostInputSchema},
  output: {schema: AutoTagReviewPostOutputSchema},
  prompt: `You are an expert in categorizing movies and shows by genre.

  Given the title and OTT link for a movie or show, suggest a list of genre tags that would be appropriate for a review post.

  Title: {{{title}}}
  OTT Link: {{{ottLink}}}

  Genres:`,
});

const autoTagReviewPostFlow = ai.defineFlow(
  {
    name: 'autoTagReviewPostFlow',
    inputSchema: AutoTagReviewPostInputSchema,
    outputSchema: AutoTagReviewPostOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
