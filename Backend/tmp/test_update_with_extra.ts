import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL as string;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function testUpdateWithExtra() {
  try {
    const media = await prisma.media.findFirst();
    if (!media) {
      console.log('No media found');
      return;
    }
    
    console.log(`Attempting update with extra fields...`);
    const updated = await prisma.media.update({
      where: { id: media.id },
      data: { 
        title: media.title,
        extraField: 'This should fail' 
      } as any
    });
    console.log('Update successful (unexpected):', updated.title);
  } catch (error) {
    console.error('Update failed as expected:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testUpdateWithExtra();
