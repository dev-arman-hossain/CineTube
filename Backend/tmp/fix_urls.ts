
import { prisma } from '../src/lib/prisma';

const updates = [
    { title: 'Inception', posterUrl: 'https://image.tmdb.org/t/p/w500/o0jO0S79UMST9777YqS07vS3N6u.jpg' },
    { title: 'Breaking Bad', posterUrl: 'https://image.tmdb.org/t/p/w500/ztkUQvHnd79fv6rnESSj3gS7CGS.jpg' },
    { title: 'The Boys', posterUrl: 'https://image.tmdb.org/t/p/w500/7Y6Sndmub9mYcr9Xj6v977vI84I.jpg' }
];

async function main() {
    for (const update of updates) {
        await prisma.media.updateMany({
            where: { title: update.title },
            data: { posterUrl: update.posterUrl }
        });
        console.log(`Updated ${update.title}`);
    }
}

main().finally(() => prisma.$disconnect());
