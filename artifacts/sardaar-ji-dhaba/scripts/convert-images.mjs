import { mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const imageRoot = path.join(appRoot, 'public/images');

async function convertDirectory(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
        const source = path.join(directory, entry.name);
        if (entry.isDirectory()) {
            await convertDirectory(source);
            continue;
        }
        if (!/\.(?:jpe?g|png)$/i.test(entry.name)) continue;
        const destination = source.replace(/\.(?:jpe?g|png)$/i, '.webp');
        await sharp(source).webp({ quality: 82, effort: 5 }).toFile(destination);
    }
}

await convertDirectory(imageRoot);

const openGraphImages = {
    'home-1200x630.jpg': 'restaurant/dining-room.jpg',
    'about-1200x630.jpg': 'restaurant/dining-room.jpg',
    'menu-1200x630.jpg': 'restaurant/signature-thali.jpg',
    'gallery-1200x630.jpg': 'restaurant/dining-room.jpg',
    'locations-1200x630.jpg': 'restaurant/dhaba-exterior.jpg',
    'noida-1200x630.jpg': 'restaurant/dining-room.jpg',
    'prayagraj-1200x630.jpg': 'restaurant/dhaba-exterior.jpg',
    'success-story-1200x630.jpg': 'restaurant/sardaar-ji-dhaba-franchise.png',
    'franchise-1200x630.jpg': 'restaurant/sardaar-ji-dhaba-franchise.png',
    'blog-1200x630.jpg': 'blog/restaurant-style-butter-chicken.png',
    'contact-1200x630.jpg': 'restaurant/dining-room.jpg',
};
const openGraphRoot = path.join(imageRoot, 'og');
await mkdir(openGraphRoot, { recursive: true });
for (const [filename, source] of Object.entries(openGraphImages)) {
    await sharp(path.join(imageRoot, source))
        .resize(1200, 630, { fit: 'cover', position: sharp.strategy.attention })
        .jpeg({ quality: 86, mozjpeg: true })
        .toFile(path.join(openGraphRoot, filename));
}

console.log('Generated WebP variants and 1200x630 Open Graph images from approved restaurant photography.');
