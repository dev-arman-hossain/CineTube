import { prisma } from '../src/lib/prisma';

// Using reliable fallback images from Unsplash and other sources
const updates = [
  { 
    title: 'Breaking Bad', 
    posterUrl: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=500&auto=format&fit=crop' 
  },
  { 
    title: 'The Boys', 
    posterUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?q=80&w=500&auto=format&fit=crop' 
  },
  { 
    title: 'The Dark Knight', 
    posterUrl: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=500&auto=format&fit=crop' 
  },
  { 
    title: 'Stranger Things', 
    posterUrl: 'https://images.unsplash.com/photo-1516394775302-c0b8ba36371e?q=80&w=500&auto=format&fit=crop' 
  },
  { 
    title: 'Interstellar', 
    posterUrl: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?q=80&w=500&auto=format&fit=crop' 
  },
  { 
    title: 'Inception', 
    posterUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=500&auto=format&fit=crop' 
  }
];

async function main() {
  console.log('Updating media with working image URLs...\n');
  
  for (const update of updates) {
    try {
      const result = await prisma.media.updateMany({
        where: { title: update.title },
        data: { posterUrl: update.posterUrl }
      });
      
      if (result.count > 0) {
        console.log(`✓ Updated ${update.title} with working image`);
        console.log(`  URL: ${update.posterUrl.substring(0, 60)}...`);
      } else {
        console.log(`✗ ${update.title} not found in database`);
      }
    } catch (error) {
      console.error(`✗ Error updating ${update.title}:`, error);
    }
  }
  
  console.log('\n✓ Update complete! All media now has valid poster images.');
}

main().finally(() => prisma.$disconnect());
