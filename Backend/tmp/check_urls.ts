
import { prisma } from '../src/lib/prisma';

async function main() {
  try {
    const media = await prisma.media.findMany({
      select: {
        id: true,
        title: true,
        posterUrl: true
      }
    });
    console.log('--- DATABASE MEDIA URLS ---');
    media.forEach(m => {
      console.log(`ID: ${m.id} | Title: ${m.title} | URL: ${m.posterUrl}`);
    });
    console.log('---------------------------');
  } catch (error: any) {
    console.error('Error checking DB:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
