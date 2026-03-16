import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding initial data...');

  const mediaData = [
    {
      title: 'Inception',
      synopsis: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
      genre: ['Sci-Fi', 'Action', 'Thriller'],
      releaseYear: 2010,
      director: 'Christopher Nolan',
      cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page'],
      platform: ['Netflix', 'Amazon Prime'],
      posterUrl: 'https://image.tmdb.org/t/p/w500/o0jO0S79UMST9777YqS07vS3N6u.jpg',
      streamingLink: 'https://www.netflix.com/title/70131314',
      type: 'MOVIE',
      contentType: 'FREE',
    },
    {
      title: 'Breaking Bad',
      synopsis: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's future.",
      genre: ['Crime', 'Drama', 'Thriller'],
      releaseYear: 2008,
      director: 'Vince Gilligan',
      cast: ['Bryan Cranston', 'Aaron Paul', 'Anna Gunn'],
      platform: ['Netflix'],
      posterUrl: 'https://image.tmdb.org/t/p/w500/ztkUQvHnd79fv6rnESSj3gS7CGS.jpg',
      streamingLink: 'https://www.netflix.com/title/70143836',
      type: 'SERIES',
      contentType: 'FREE',
    },
    {
      title: 'The Dark Knight',
      synopsis: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
      genre: ['Action', 'Crime', 'Drama'],
      releaseYear: 2008,
      director: 'Christopher Nolan',
      cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
      platform: ['HBO Max'],
      posterUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDp9CjV1f4GZp2mSTpX.jpg',
      streamingLink: 'https://www.hbomax.com/movies/the-dark-knight',
      type: 'MOVIE',
      contentType: 'PREMIUM',
    },
    {
      title: 'Stranger Things',
      synopsis: 'When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces in order to get him back.',
      genre: ['Drama', 'Fantasy', 'Horror'],
      releaseYear: 2016,
      director: 'The Duffer Brothers',
      cast: ['Millie Bobby Brown', 'Finn Wolfhard', 'Winona Ryder'],
      platform: ['Netflix'],
      posterUrl: 'https://image.tmdb.org/t/p/w500/49WpLuvsvAP1nQ6dgvFJqht9PZ4.jpg',
      streamingLink: 'https://www.netflix.com/title/80057281',
      type: 'SERIES',
      contentType: 'FREE',
    },
    {
      title: 'Interstellar',
      synopsis: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
      genre: ['Adventure', 'Drama', 'Sci-Fi'],
      releaseYear: 2014,
      director: 'Christopher Nolan',
      cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
      platform: ['Paramount+', 'Amazon Prime'],
      posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6EwfVDxCzs25vubp2FA.jpg',
      streamingLink: 'https://www.amazon.com/Interstellar-Matthew-McConaughey/dp/B00S0X767A',
      type: 'MOVIE',
      contentType: 'FREE',
    },
    {
      title: 'The Boys',
      synopsis: 'A group of vigilantes set out to take down corrupt superheroes who abuse their superpowers.',
      genre: ['Action', 'Comedy', 'Crime'],
      releaseYear: 2019,
      director: 'Eric Kripke',
      cast: ['Karl Urban', 'Jack Quaid', 'Antony Starr'],
      platform: ['Amazon Prime'],
      posterUrl: 'https://image.tmdb.org/t/p/w500/7Y6Sndmub9mYcr9Xj6v977vI84I.jpg',
      streamingLink: 'https://www.amazon.com/The-Boys-Season-1/dp/B07QNJCMCK',
      type: 'SERIES',
      contentType: 'PREMIUM',
    },
  ];

  for (const media of mediaData) {
    const existing = await prisma.media.findFirst({
      where: { title: media.title },
    });

    if (!existing) {
      await prisma.media.create({
        data: media as any,
      });
      console.log(`Created media: ${media.title}`);
    } else {
      console.log(`Skipping existing media: ${media.title}`);
    }
  }

  console.log('Seeding users...');
  const hashedPassword = await bcrypt.hash('password123', 10);

  const users = [
    {
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
    {
      name: 'Test User',
      email: 'user@example.com',
      password: hashedPassword,
      role: 'USER',
    }
  ];

  for (const user of users) {
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    });
    if (!existingUser) {
      await prisma.user.create({ data: user as any });
      console.log(`Created user: ${user.email}`);
    } else {
      console.log(`Skipping existing user: ${user.email}`);
    }
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
