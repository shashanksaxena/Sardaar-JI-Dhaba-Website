import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { createServer } from 'vite';

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repositoryRoot = path.resolve(appRoot, '../..');
const outputRoot = path.join(appRoot, 'dist/public');
let siteUrl;
let brandName;

function clip(value, maximum) {
    if (value.length <= maximum) return value;
    return `${value.slice(0, maximum - 1).replace(/\s+\S*$/, '')}…`;
}

function escapeHtml(value) {
    return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

async function lastModified(sourceFile) {
    try {
        return (await stat(path.join(repositoryRoot, sourceFile))).mtime.toISOString().slice(0, 10);
    } catch {
        return undefined;
    }
}

function replaceRoot(html, renderedMarkup) {
    const rootStart = html.indexOf('<div id="root">');
    if (rootStart < 0) throw new Error('Vite template does not contain #root');

    const openTag = /<div\b[^>]*>|<\/div\s*>/gi;
    openTag.lastIndex = rootStart;
    let depth = 0;
    let match;
    let rootEnd = -1;
    while ((match = openTag.exec(html))) {
        depth += match[0].startsWith('</') ? -1 : 1;
        if (depth === 0) {
            rootEnd = openTag.lastIndex;
            break;
        }
    }
    if (rootEnd < 0) throw new Error('Could not find the closing #root element');
    return `${html.slice(0, rootStart)}<div id="root">${renderedMarkup}</div>${html.slice(rootEnd)}`;
}

function routeHead(route, meta, indexable = true) {
    const canonical = `${siteUrl}${route === '/' ? '/' : route}`;
    const title = escapeHtml(clip(meta.title, 60));
    const description = escapeHtml(clip(meta.description, 155));
    const image = escapeHtml(new URL(meta.image, siteUrl).href);
    const robots = indexable ? 'index, follow' : 'noindex, nofollow';
    return [
        `<title>${title}</title>`,
        `<meta name="description" content="${description}">`,
        `<meta name="robots" content="${robots}">`,
        `<link rel="canonical" href="${canonical}">`,
        `<meta property="og:type" content="${meta.type ?? 'website'}">`,
        `<meta property="og:url" content="${canonical}">`,
        `<meta property="og:title" content="${title}">`,
        `<meta property="og:description" content="${description}">`,
        `<meta property="og:image" content="${image}">`,
        `<meta property="og:site_name" content="${brandName}">`,
        '<meta property="og:locale" content="en_IN">',
        '<meta name="twitter:card" content="summary_large_image">',
        `<meta name="twitter:title" content="${title}">`,
        `<meta name="twitter:description" content="${description}">`,
        `<meta name="twitter:image" content="${image}">`,
    ].join('\n  ');
}

function applyHead(template, route, meta, indexable = true) {
    const withoutOldMetadata = template
        .replace(/<title>[\s\S]*?<\/title>/i, '')
        .replace(/<meta\s+(?:name=["'](?:description|keywords|robots|twitter:[^"']+)["']|property=["'](?:og|twitter):[^"']+["'])[^>]*>\s*/gi, '')
        .replace(/<link\s+rel=["']canonical["'][^>]*>\s*/gi, '')
        .replace(/<script\s+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>\s*/gi, '');
    return withoutOldMetadata.replace('</head>', `  ${routeHead(route, meta, indexable)}\n</head>`);
}

function injectJsonLd(html) {
    const schemas = [...html.matchAll(/<template data-seo-jsonld="">([\s\S]*?)<\/template>/g)]
        .map(match => `<script type="application/ld+json">${match[1]}</script>`)
        .join('\n');
    return html.replace('</head>', `${schemas}\n</head>`);
}

function outputPath(route) {
    return path.join(outputRoot, route === '/' ? 'index.html' : `${route.slice(1)}/index.html`);
}

const server = await createServer({
    configFile: path.join(appRoot, 'vite.config.ts'),
    appType: 'custom',
    mode: 'production',
    server: { middlewareMode: true },
});

try {
    const [{ default: App }, content, seo, redirects] = await Promise.all([
        server.ssrLoadModule('/src/App.tsx'),
        server.ssrLoadModule('/src/data/content.ts'),
        server.ssrLoadModule('/src/data/seo.ts'),
        server.ssrLoadModule('/src/data/redirects.ts'),
    ]);
    siteUrl = content.brand.siteUrl;
    brandName = content.brand.name;
    const template = await readFile(path.join(outputRoot, 'index.html'), 'utf8');
    const registeredRoutes = Object.entries(seo.seoRoutes).map(([route, meta]) => ({
        route,
        meta,
        source: 'artifacts/sardaar-ji-dhaba/src/App.tsx',
    }));
    const publicRoutes = registeredRoutes.filter(({ meta }) => meta.indexable !== false);

    for (const story of content.stories) {
        const route = `/blog/${story.id}`;
        const meta = seo.getSeoMetadata(route);
        publicRoutes.push({
            route,
            meta,
            source: 'artifacts/sardaar-ji-dhaba/src/data/content.ts',
        });
    }

    for (const { route, meta } of [...publicRoutes, ...registeredRoutes.filter(({ meta }) => meta.indexable === false)]) {
        const rendered = renderToString(React.createElement(App, { staticPath: route }));
        const html = injectJsonLd(applyHead(replaceRoot(template, rendered), route, meta, meta.indexable !== false));
        const destination = outputPath(route);
        await mkdir(path.dirname(destination), { recursive: true });
        await writeFile(destination, html);
    }

    const notFound = renderToString(React.createElement(App, { staticPath: '/__not_found__' }));
    await writeFile(path.join(outputRoot, '404.html'), injectJsonLd(applyHead(replaceRoot(template, notFound), '/404', {
        title: 'Page Not Found | Sardaar Ji Dhaba',
        description: 'This Sardaar Ji Dhaba page could not be found. Visit the menu or choose an outlet in Noida or Prayagraj.',
        image: seo.seoRoutes['/'].image,
    }, false)));

    const sitemapEntries = await Promise.all(publicRoutes.map(async ({ route, source, meta }) => {
        const lastmod = await lastModified(source);
        const priority = meta.priority ?? 0.5;
        return `  <url><loc>${siteUrl}${route === '/' ? '/' : route}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}<priority>${priority.toFixed(1)}</priority></url>`;
    }));
    await writeFile(path.join(outputRoot, 'sitemap.xml'), [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...sitemapEntries,
        '</urlset>',
        '',
    ].join('\n'));

    await writeFile(path.join(outputRoot, 'robots.txt'), [
        'User-agent: *',
        'Allow: /',
        'Disallow: /admin',
        'Disallow: /api',
        '',
        'User-agent: GPTBot',
        'Allow: /',
        'Disallow: /admin',
        'Disallow: /api',
        '',
        'User-agent: PerplexityBot',
        'Allow: /',
        'Disallow: /admin',
        'Disallow: /api',
        '',
        'User-agent: Google-Extended',
        'Allow: /',
        'Disallow: /admin',
        'Disallow: /api',
        '',
        'User-agent: ClaudeBot',
        'Allow: /',
        'Disallow: /admin',
        'Disallow: /api',
        '',
        'User-agent: Applebot',
        'Allow: /',
        'Disallow: /admin',
        'Disallow: /api',
        '',
        `Sitemap: ${siteUrl}/sitemap.xml`,
        '',
    ].join('\n'));

    const redirectLines = Object.entries(redirects.legacyBlogRedirects)
        .filter(([source, destination]) => source.startsWith('/') && destination.startsWith('/') && destination !== source)
        .map(([source, destination]) => `${source} ${destination} 301`);
    if (redirectLines.length > 0) {
        await writeFile(path.join(outputRoot, '_redirects'), `${redirectLines.join('\n')}\n`);
    }

    console.log(`Prerendered ${publicRoutes.length} routes and generated sitemap.xml`);
} finally {
    await server.close();
}