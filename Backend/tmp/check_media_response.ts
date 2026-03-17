import { MediaService } from '../src/modules/media/media.service';

async function main() {
  try {
    const result = await MediaService.getAllMedia({ page: 1, limit: 6, sort: 'avgRating' });
    console.log('\n=== TRENDING MEDIA ===');
    result.data.forEach((m: any) => {
      console.log(`Title: ${m.title}`);
      console.log(`Rating: ${m.avgRating}`);
      console.log(`Poster: ${m.posterUrl}`);
      console.log('---');
    });

    const newResult = await MediaService.getAllMedia({ page: 1, limit: 6, sort: 'createdAt' });
    console.log('\n=== NEW RELEASES ===');
    newResult.data.forEach((m: any) => {
      console.log(`Title: ${m.title}`);
      console.log(`Poster: ${m.posterUrl}`);
      console.log('---');
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    const { prisma } = await import('../src/lib/prisma');
    await prisma.$disconnect();
  }
}

main();
