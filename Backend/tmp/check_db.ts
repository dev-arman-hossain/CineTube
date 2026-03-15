
import { prisma } from '../src/lib/prisma';

async function main() {
  try {
    const allMedia = await prisma.media.findMany({
      take: 5
    });
    console.log('Media Sample:', JSON.stringify(allMedia, null, 2));
    
    const count = await prisma.media.count();
    console.log('Total Media Count:', count);
  } catch (error) {
    console.error('Error checking DB:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
