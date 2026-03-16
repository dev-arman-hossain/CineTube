import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function checkDb() {
  try {
    const mediaCount = await prisma.media.count();
    const userCount = await prisma.user.count();
    console.log(`Media count in DB: ${mediaCount}`);
    console.log(`User count in DB: ${userCount}`);
  } catch (error) {
    console.error('Error connecting to DB:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDb();
