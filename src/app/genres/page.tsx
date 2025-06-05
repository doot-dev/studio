
import Link from 'next/link';

export default function GenresPage() {
  // Placeholder data for genres. In a real app, this would come from a database or API.
  const genres = [
    "Action", "Comedy", "Drama", "Sci-Fi", "Horror",
    "Thriller", "Romance", "Animation", "Documentary",
    "Fantasy", "Mystery", "Family", "Historical", "Musical", "Anime"
  ];

  return (
    <div className="space-y-8">
      <header className="text-center py-8">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl">
          Explore by Genre
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover reviews based on your favorite movie and show genres. Click on a genre to see related content.
        </p>
      </header>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
        {genres.map((genre) => (
          <Link
            key={genre}
            href={`/explore?genre=${encodeURIComponent(genre.toLowerCase())}`}
            passHref
            className="group relative flex flex-col items-center justify-center p-6 aspect-video rounded-lg bg-card hover:bg-primary/20 transition-all duration-300 ease-in-out shadow-md hover:shadow-xl transform hover:scale-105"
            >
            <div
              className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/30 via-accent/30 to-secondary/30 opacity-50 group-hover:opacity-70 transition-opacity"
              style={{
                backgroundImage: `linear-gradient(to bottom right, hsl(var(--primary-hsl), 0.3), hsl(var(--accent-hsl), 0.3), hsl(var(--secondary-hsl), 0.3)), url(https://placehold.co/300x200.png?text=${encodeURIComponent(genre)})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              data-ai-hint="genre abstract background"
            />
             <div className="absolute inset-0 bg-card/50 group-hover:bg-card/30 transition-colors rounded-lg" />
            <span className="relative text-xl sm:text-2xl font-semibold text-foreground z-10">
              {genre}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
