import { prisma } from '../src/lib/prisma';

async function main() {
  const allMedia = await prisma.media.findMany({
    select: {
      id: true,
      title: true,
      posterUrl: true,
      type: true,
      releaseYear: true
    },
  });
  
  console.log('\\nTotal media items:', allMedia.length);
  console.log('\\nMedia with empty/null posterUrl:');
  const emptyPoster = allMedia.filter(m => !m.posterUrl);
  console.log(`Found: ${emptyPoster.length} items without posterUrl`);
  emptyPoster.forEach(m => {
    console.log(`- ${m.title} (${m.releaseYear})`);
  });
  
  console.log('\\nMedia with valid posterUrl:');
  const validPoster = allMedia.filter(m => m.posterUrl);
  console.log(`Found: ${validPoster.length} items with posterUrl`);
  validPoster.slice(0, 10).forEach(m => {
    if (m.posterUrl) {
      console.log(`- ${m.title}: ${m.posterUrl.substring(0, 50)}...`);
    }
  });
}

main().finally(() => prisma.$disconnect());
