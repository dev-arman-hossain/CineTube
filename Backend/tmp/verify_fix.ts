import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL as string;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const updateMediaValidationSchema = z.object({
  body: z.object({
    title: z.string().optional(),
  }),
});

async function verifyFix() {
  try {
    const media = await prisma.media.findFirst();
    if (!media) {
      console.log('No media found');
      return;
    }

    const reqBody = {
      title: media.title,
      extraField: 'This should be stripped'
    };

    console.log('Original req.body:', reqBody);

    // Simulate validateRequest behavior
    const parsed = await updateMediaValidationSchema.parseAsync({
      body: reqBody
    });
    
    const strippedBody = parsed.body;
    console.log('Stripped req.body:', strippedBody);

    // This should now succeed because extraField is stripped
    const updated = await prisma.media.update({
      where: { id: media.id },
      data: strippedBody as any
    });
    console.log('Update successful with stripped data:', updated.title);

  } catch (error) {
    console.error('Update failed after fix:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyFix();
