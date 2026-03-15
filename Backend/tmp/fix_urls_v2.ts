
import { prisma } from '../src/lib/prisma';

const updates = [
    { title: 'Inception', posterUrl: 'https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg' },
    { title: 'Breaking Bad', posterUrl: 'https://image.tmdb.org/t/p/w500/ztkHQYFGfGKBz4AykGLwmsau0TM.jpg' },
    { title: 'The Boys', posterUrl: 'https://image.tmdb.org/t/p/w500/7Y6Sndmub9mYcr9Xj6v977vI84I.jpg' },
    { title: 'The Dark Knight', posterUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDp9CjV1f4GZp2mSTpX.jpg' },
    { title: 'Stranger Things', posterUrl: 'https://image.tmdb.org/t/p/w500/49WpLuvsvAP1nQ6dgvFJqht9PZ4.jpg' },
    { title: 'Interstellar', posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6EwfVDxCzs25vubp2FA.jpg' }
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
