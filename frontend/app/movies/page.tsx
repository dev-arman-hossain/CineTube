import { MediaService } from '@/services/mediaService';
import MediaGrid from '@/components/media/MediaGrid';
import MediaFilters from '@/components/media/MediaFilters';

export default async function MoviesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; genre?: string }>;
}) {
  const { q, genre } = await searchParams;

  const response = await MediaService.getMedia({
    type: 'MOVIE',
    genre: genre !== 'All' ? genre : undefined,
    q: q || undefined,
  });
  
  const movies = response.data;

  return (
    <div className="md:px-12 px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black font-outfit tracking-tight">Explore <span className="text-primary">Movies</span></h1>
          <p className="text-secondary-foreground text-sm mt-1">Discover the latest blockbusters and timeless classics.</p>
        </div>

        <MediaFilters initialSearch={q} initialGenre={genre} />
      </div>

      {/* Grid */}
      <MediaGrid items={movies} />
    </div>
  );
}
