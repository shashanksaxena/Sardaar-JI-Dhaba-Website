import { ArrowUpRight, Clock3, MapPin, Phone } from 'lucide-react';
import { business } from '@/config/business';

type LocalLandingPageProps = {
    city: 'Noida' | 'Prayagraj';
    heading: string;
    address: string;
    postalCode?: string;
    description: string;
    image: string;
    zomatoUrl?: string;
};

const schemaDays = business.hours.days.map(day => `https://schema.org/${day}`);

export function LocalLandingPage({ city, heading, address, postalCode, description, image, zomatoUrl }: LocalLandingPageProps) {
    const mapQuery = `${business.name}, ${address}, ${city}, Uttar Pradesh${postalCode ? ` ${postalCode}` : ''}`;
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
    const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`;
    const searchQuery = encodeURIComponent(`${business.name} ${city}`);
    const sameAs = [business.social.instagramUrl, city === 'Prayagraj' ? business.orderUrl : null]
        .filter((profile): profile is string => Boolean(profile));
    const localBusinessSchema = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        '@id': `${business.siteUrl}/${city.toLowerCase()}#localbusiness`,
        name: business.name,
        url: `${business.siteUrl}/${city.toLowerCase()}`,
        telephone: business.phone.e164,
        image: `${business.siteUrl}${image}`,
        servesCuisine: business.cuisine,
        priceRange: business.priceRange,
        sameAs,
        address: {
            '@type': 'PostalAddress',
            streetAddress: address,
            addressLocality: city,
            addressRegion: 'Uttar Pradesh',
            ...(postalCode ? { postalCode } : {}),
            addressCountry: 'IN',
        },
        openingHoursSpecification: [{
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: schemaDays,
            opens: '11:00',
            closes: '23:00',
        }],
        hasMap: mapUrl,
    };

    return (
        <>
            <template data-seo-jsonld="" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema).replace(/</g, '\\u003c') }} />
            <section className="bg-secondary text-secondary-foreground">
                <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-[1.1fr_.9fr] lg:px-8 lg:py-24">
                    <div>
                        <p className="font-mono-brand text-[10px] uppercase tracking-[.24em] text-accent">Punjabi &amp; North Indian food · {city}</p>
                        <h1 className="mt-5 max-w-4xl font-display text-5xl leading-[.96] md:text-7xl">{heading}</h1>
                        <p className="mt-7 max-w-2xl text-base leading-7 text-secondary-foreground/80">{description}</p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <a href={`https://www.swiggy.com/search?query=${searchQuery}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-sm bg-accent px-5 py-3 text-sm font-bold text-accent-foreground">Order on Swiggy <ArrowUpRight size={16} /></a>
                            <a href={zomatoUrl ?? `https://www.zomato.com/search?q=${searchQuery}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-sm border border-accent/70 px-5 py-3 text-sm font-bold text-accent">Order on Zomato <ArrowUpRight size={16} /></a>
                            <a href={`tel:${business.phone.e164}`} className="inline-flex items-center gap-2 rounded-sm border border-secondary-foreground/40 px-5 py-3 text-sm font-bold text-secondary-foreground"><Phone size={16} /> Call to order</a>
                        </div>
                    </div>
                    <div className="relative min-h-[300px] overflow-hidden border border-secondary-foreground/20 bg-background/10 sm:min-h-[380px]">
                        <img src={image} alt={`${business.name} in ${city}`} width="1200" height="800" loading="eager" className="absolute inset-0 h-full w-full object-cover" />
                    </div>
                </div>
            </section>
            <section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[.8fr_1.2fr] lg:px-8 lg:py-24">
                <div>
                    <p className="font-mono-brand text-[10px] uppercase tracking-[.2em] text-primary">Visit Sardaar Ji Dhaba</p>
                    <h2 className="mt-4 font-display text-4xl">Find us in {city}</h2>
                    <dl className="mt-8 divide-y divide-foreground/15 border-y border-foreground/15">
                        <div className="flex gap-4 py-5"><MapPin className="mt-1 shrink-0 text-primary" size={18} /><div><dt className="font-semibold">Address</dt><dd className="mt-1 text-sm leading-6 text-muted-foreground">{address}{postalCode ? `, ${postalCode}` : ''}, {city}, Uttar Pradesh</dd></div></div>
                        <div className="flex gap-4 py-5"><Phone className="mt-1 shrink-0 text-primary" size={18} /><div><dt className="font-semibold">Phone</dt><dd className="mt-1 text-sm"><a href={`tel:${business.phone.e164}`} className="text-primary underline underline-offset-4">{business.phone.display}</a></dd></div></div>
                        <div className="flex gap-4 py-5"><Clock3 className="mt-1 shrink-0 text-primary" size={18} /><div><dt className="font-semibold">Opening hours</dt><dd className="mt-1 text-sm text-muted-foreground">Daily, 11:00 AM – 11:00 PM</dd></div></div>
                    </dl>
                    <a href={mapUrl} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 font-semibold text-primary underline decoration-accent underline-offset-4">Get directions <ArrowUpRight size={16} /></a>
                </div>
                <div className="min-h-[360px] overflow-hidden border border-foreground/15 bg-muted">
                    <iframe title={`${business.name} Google Map in ${city}`} src={mapEmbedUrl} width="100%" height="100%" loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="min-h-[360px] w-full border-0" />
                </div>
            </section>
        </>
    );
}