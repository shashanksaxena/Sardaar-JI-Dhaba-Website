import { business } from '@/config/business';
import { menu, stories } from '@/data/content';
import { getFaqItems } from '@/data/faqs';
import { getSeoMetadata } from '@/data/seo';

const sameAs = [
    business.social.instagramUrl,
    business.social.facebookUrl,
    business.social.swiggyUrl,
    business.social.zomatoUrl,
].filter((profile): profile is string => Boolean(profile));

function buildRestaurantSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Restaurant',
        '@id': `${business.siteUrl}/#restaurant`,
        name: business.name,
        url: business.siteUrl,
        telephone: business.phone.e164,
        image: `${business.siteUrl}${business.logo}`,
        servesCuisine: business.cuisine,
        priceRange: business.priceRange,
        hasMenu: `${business.siteUrl}/menu`,
        sameAs,
        openingHoursSpecification: [{
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: business.hours.days,
            opens: business.hours.opens,
            closes: business.hours.closes,
        }],
        department: business.schemaDepartments.map(department => ({
            '@type': 'Restaurant',
            '@id': `${business.siteUrl}/#${department.id}`,
            name: business.name,
            url: `${business.siteUrl}/${department.city.toLowerCase()}`,
            telephone: business.phone.e164,
            servesCuisine: business.cuisine,
            priceRange: business.priceRange,
            hasMenu: `${business.siteUrl}/menu`,
            sameAs,
            address: {
                '@type': 'PostalAddress',
                streetAddress: department.streetAddress,
                addressLocality: department.city,
                addressRegion: department.addressRegion,
                ...(department.postalCode ? { postalCode: department.postalCode } : {}),
                addressCountry: 'IN',
            },
            openingHoursSpecification: [{
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: business.hours.days,
                opens: business.hours.opens,
                closes: business.hours.closes,
            }],
        })),
    };
}

function buildFaqSchema(route: string) {
    const faqItems = getFaqItems(route);
    if (faqItems.length === 0) return undefined;
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems.map(item => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
    };
}

function buildRouteSchemas(route: string) {
    const schemas: Record<string, unknown>[] = [];
    const faqSchema = buildFaqSchema(route);
    const outlet = business.outlets.find(item => route === `/locations/${item.id}`);
    const story = route.startsWith('/blog/') ? stories.find(item => route === `/blog/${item.id}`) : undefined;

    if (route === '/') {
        schemas.push(
            {
                '@context': 'https://schema.org',
                '@type': 'Organization',
                '@id': `${business.siteUrl}/#organization`,
                name: business.name,
                url: business.siteUrl,
                logo: `${business.siteUrl}${business.logo}`,
                sameAs,
                foundingDate: String(business.established),
            },
            {
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: business.name,
                url: business.siteUrl,
                publisher: { '@id': `${business.siteUrl}/#organization` },
            },
            buildRestaurantSchema(),
        );
    }

    if (route !== '/') {
        schemas.push({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: business.name, item: business.siteUrl },
                { '@type': 'ListItem', position: 2, name: getSeoMetadata(route)?.title ?? route, item: `${business.siteUrl}${route}` },
            ],
        });
    }

    if (outlet) {
        schemas.push({
            '@context': 'https://schema.org',
            '@type': 'Restaurant',
            '@id': `${business.siteUrl}${route}#restaurant`,
            name: business.name,
            url: `${business.siteUrl}${route}`,
            telephone: business.phone.e164,
            image: `${business.siteUrl}${outlet.image}`,
            address: {
                '@type': 'PostalAddress',
                streetAddress: outlet.streetAddress,
                addressLocality: outlet.city,
                addressRegion: outlet.addressRegion,
                ...(outlet.postalCode ? { postalCode: outlet.postalCode } : {}),
                addressCountry: 'IN',
            },
            ...(outlet.latitude !== null && outlet.longitude !== null ? { geo: { '@type': 'GeoCoordinates', latitude: outlet.latitude, longitude: outlet.longitude } } : {}),
            openingHoursSpecification: [{
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: business.hours.days,
                opens: business.hours.opens,
                closes: business.hours.closes,
            }],
            servesCuisine: business.cuisine,
            priceRange: business.priceRange,
            hasMenu: `${business.siteUrl}/menu`,
            hasMap: outlet.mapUrl,
            sameAs,
            parentOrganization: { '@type': 'Organization', name: business.name, url: business.siteUrl },
        });
    }

    if (route === '/menu') {
        schemas.push({
            '@context': 'https://schema.org',
            '@type': 'Menu',
            name: `${business.name} Menu`,
            url: `${business.siteUrl}/menu`,
            hasMenuSection: Array.from(new Set(menu.map(item => item.category))).map(category => ({
                '@type': 'MenuSection',
                name: category,
                hasMenuItem: menu.filter(item => item.category === category).map(item => ({
                    '@type': 'MenuItem',
                    name: item.name,
                    description: item.description,
                })),
            })),
        });
    }

    if (story) {
        schemas.push({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: story.title,
            description: story.excerpt,
            image: `${business.siteUrl}${story.image}`,
            author: { '@type': 'Organization', name: business.name },
            publisher: { '@type': 'Organization', name: business.name, url: business.siteUrl },
            ...(story.publishedAt ? { datePublished: story.publishedAt } : {}),
            ...(story.modifiedAt ? { dateModified: story.modifiedAt } : {}),
            mainEntityOfPage: `${business.siteUrl}${route}`,
        });
    }

    if (faqSchema) schemas.push(faqSchema);
    return schemas;
}

export function SeoSchema({ route }: { route: string }) {
    return <>{buildRouteSchemas(route).map((schema, index) => (
        <template
            key={`${route}-schema-${index}`}
            data-seo-jsonld=""
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
        />
    ))}</>;
}
