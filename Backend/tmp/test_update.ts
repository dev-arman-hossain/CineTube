import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL as string;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function testUpdate() {
  try {
    const media = await prisma.media.findFirst();
    if (!media) {
      console.log('No media found to update');
      return;
    }
    console.log(`Found media: ${media.title} (ID: ${media.id})`);
    
    const updated = await prisma.media.update({
      where: { id: media.id },
      data: { title: media.title + ' (Updated)' }
    });
    console.log('Update successful:', updated.title);
  } catch (error) {
    console.error('Update failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testUpdate();
