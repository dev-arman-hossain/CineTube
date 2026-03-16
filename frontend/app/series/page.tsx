import { MediaService } from '@/services/mediaService';
import MediaGrid from '@/components/media/MediaGrid';
import MediaFilters from '@/components/media/MediaFilters';

export const dynamic = 'force-dynamic';

export default async function SeriesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; genre?: string }>;
}) {
  const { q, genre } = await searchParams;

  const response = await MediaService.getMedia({
    type: 'SERIES',
    genre: genre !== 'All' ? genre : undefined,
    q: q || undefined,
  });
  
  const series = response.data;

  return (
    <div className="md:px-12 px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black font-outfit tracking-tight">Explore <span className="text-primary">Series</span></h1>
          <p className="text-secondary-foreground text-sm mt-1">Binge-worthy shows from top-rated creators across all platforms.</p>
        </div>

        <MediaFilters initialSearch={q} initialGenre={genre} />
      </div>

      <MediaGrid items={series} />
    </div>
  );
}
