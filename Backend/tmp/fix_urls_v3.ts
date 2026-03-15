
import { prisma } from '../src/lib/prisma';

const updates = [
    { title: 'Breaking Bad', posterUrl: 'https://image.tmdb.org/t/p/w500/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg' },
    { title: 'The Boys', posterUrl: 'https://image.tmdb.org/t/p/w500/in1R2dDc421JxsoRWaIIAqVI2KE.jpg' },
    { title: 'The Dark Knight', posterUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg' },
    { title: 'Stranger Things', posterUrl: 'https://image.tmdb.org/t/p/w500/uOOtwVbSr4QDjAGIifLDwpb2Pdl.jpg' },
    { title: 'Interstellar', posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg' }
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
