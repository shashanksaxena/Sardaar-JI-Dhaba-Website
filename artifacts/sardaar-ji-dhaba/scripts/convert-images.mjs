import { readdir } from 'node:fs/promises';
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
console.log('Generated WebP variants for public JPG and PNG images.');
