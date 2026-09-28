import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputRoot = path.join(appRoot, 'dist/public');
const sitemap = await readFile(path.join(outputRoot, 'sitemap.xml'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
const titles = new Set();
const descriptions = new Set();
const results = [];

function assert(condition, message) {
    if (!condition) throw new Error(message);
}

function routeFile(url) {
    const route = new URL(url).pathname;
    return path.join(outputRoot, route === '/' ? 'index.html' : `${route.slice(1)}/index.html`);
}

function schemasFrom(html) {
    return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
}

for (const url of urls) {
    const route = new URL(url).pathname;
    const html = await readFile(routeFile(url), 'utf8');
    const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? '';
    const description = html.match(/<meta name="description" content="([^"]*)">/)?.[1] ?? '';
    const canonical = html.match(/<link rel="canonical" href="([^"]*)">/)?.[1] ?? '';
    const h1Count = (html.match(/<h1\b/g) ?? []).length;
    const schemas = schemasFrom(html);
    const head = html.split('</head>')[0] ?? '';
    const headSchemas = schemasFrom(head);
    const cityIntro = route.startsWith('/locations/') ? html.match(/<h1\b[\s\S]*?<\/section>/)?.[0] ?? '' : '';
    const cityIntroWords = cityIntro.replace(/<[^>]*>/g, ' ').replace(/&(?:amp|quot|#x27|lt|gt);/g, ' ').trim().split(/\s+/).filter(Boolean).length;
    const checks = {
        title: title.length > 0 && title.length <= 60 && !titles.has(title),
        description: description.length > 0 && description.length <= 155 && !descriptions.has(description),
        canonical: canonical === url,
        h1: h1Count === 1,
        jsonld: schemas.length > 0 && schemas.length === headSchemas.length,
        sitemap: urls.includes(url),
        noKeywords: !/<meta\s+name="keywords"/i.test(html),
    };

    for (const schema of schemas) {
        assert(schema['@context'] === 'https://schema.org', `${route}: JSON-LD context missing`);
        if (schema['@type'] === 'Organization') {
            assert(schema.name && schema.url && schema.logo && schema.foundingDate && Array.isArray(schema.sameAs), `${route}: Organization required field missing`);
        }
        if (schema['@type'] === 'WebSite') assert(schema.name && schema.url, `${route}: WebSite required field missing`);
        if (schema['@type'] === 'Restaurant') {
            assert(schema.name && schema.url && schema.telephone, `${route}: Restaurant required field missing`);
            assert(schema.geo === undefined || (Number.isFinite(schema.geo.latitude) && Number.isFinite(schema.geo.longitude)), `${route}: invalid restaurant geo`);
            assert(Array.isArray(schema.servesCuisine) && Array.isArray(schema.openingHoursSpecification) && schema.hasMenu, `${route}: Restaurant schema fields missing`);
            if (route === '/') {
                assert(schema.priceRange === '₹₹', `${route}: Restaurant priceRange missing`);
                assert(['North Indian', 'Punjabi', 'Desi Chinese'].every(cuisine => schema.servesCuisine.includes(cuisine)), `${route}: Restaurant cuisine list incomplete`);
                assert(schema.sameAs.includes('https://www.instagram.com/sardaarjidhaba/'), `${route}: Instagram sameAs missing`);
                assert(schema.sameAs.includes('https://www.zomato.com/allahabad/sardaar-ji-1-civil-lines'), `${route}: Zomato sameAs missing`);
                assert(Array.isArray(schema.department) && schema.department.length === 3, `${route}: expected three Restaurant departments`);
                for (const department of schema.department) {
                    assert(department.address?.['@type'] === 'PostalAddress' && department.address.addressLocality && department.address.addressRegion, `${route}: restaurant department address missing`);
                }
                assert(schema.department.some(department => department.address?.streetAddress === 'Sector 76'), `${route}: Noida Sector 76 department missing`);
                assert(schema.department.some(department => department.address?.streetAddress === 'Sector 64'), `${route}: Noida Sector 64 department missing`);
                assert(schema.department.some(department => department.address?.streetAddress === '138C, Mahatma Gandhi Marg, near El Chico, Civil Lines'), `${route}: Prayagraj department missing`);
            } else {
                assert(schema.address?.['@type'] === 'PostalAddress', `${route}: branch Restaurant address missing`);
            }
        }
        if (schema['@type'] === 'FAQPage') assert(Array.isArray(schema.mainEntity) && schema.mainEntity.length >= 6, `${route}: FAQPage questions missing`);
        if (schema['@type'] === 'FAQPage') {
            for (const item of schema.mainEntity) {
                assert(html.includes(item.name) && html.includes(item.acceptedAnswer.text), `${route}: visible FAQ content does not match FAQPage JSON-LD`);
            }
        }
        if (schema['@type'] === 'BlogPosting') assert(schema.headline && schema.image && schema.author && schema.mainEntityOfPage, `${route}: BlogPosting required field missing`);
        if (schema['@type'] === 'BreadcrumbList') assert(Array.isArray(schema.itemListElement) && schema.itemListElement.length >= 2, `${route}: BreadcrumbList required field missing`);
        if (schema['@type'] === 'Menu') assert(Array.isArray(schema.hasMenuSection) && schema.hasMenuSection.length > 0, `${route}: Menu sections missing`);
    }

    titles.add(title);
    descriptions.add(description);
    if (route.startsWith('/locations/')) assert(cityIntroWords >= 150, `${route}: city introduction has only ${cityIntroWords} words`);
    results.push({ route, ...checks });
}

assert(urls.length > 0, 'Sitemap contains no URLs');
assert(new Set(urls).size === urls.length, 'Sitemap contains duplicate URLs');

const columns = ['route', 'title', 'description', 'canonical', 'h1', 'jsonld', 'sitemap', 'noKeywords'];
const widths = Object.fromEntries(columns.map(column => [column, Math.max(column.length, ...results.map(result => String(result[column]).length))]));
console.log(columns.map(column => column.padEnd(widths[column])).join(' | '));
console.log(columns.map(column => '-'.repeat(widths[column])).join('-+-'));
for (const result of results) console.log(columns.map(column => String(result[column]).padEnd(widths[column])).join(' | '));

const failures = results.filter(result => Object.values(result).some(value => value === false));
if (failures.length > 0) process.exitCode = 1;
console.log(`\n${results.length} routes checked; ${failures.length} route failures.`);
