import { MediaService } from '@/services/mediaService';
import HomeView from '@/components/home/HomeView';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [featuredRes, trendingRes, newRes, topRatedRes] = await Promise.all([
    MediaService.getFeaturedMedia(),
    MediaService.getMedia({ limit: 6, sort: 'avgRating' }),
    MediaService.getMedia({ limit: 6, sort: 'createdAt' }),
    MediaService.getMedia({ limit: 6, sort: 'views' }),
  ]);

  const featured = featuredRes.data[0] || null;
  const trending = trendingRes.data;
  const newReleases = newRes.data;
  const topRated = topRatedRes.data || [];

  return (
    <HomeView 
      featured={featured} 
      trending={trending} 
      newReleases={newReleases} 
      topRated={topRated}
    />
  );
}
