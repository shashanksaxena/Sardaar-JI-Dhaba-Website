import { brand, stories } from './content';

export type SeoMetadata = {
    title: string;
    description: string;
    image: string;
    type?: 'website' | 'article';
    indexable?: boolean;
};

export const seoRoutes: Record<string, SeoMetadata> = {
    '/': {
        title: 'Punjabi Restaurant in Noida & Prayagraj | Sardaar Ji Dhaba',
        description: 'Explore Punjabi food, North Indian favourites, menu details and two Sardaar Ji Dhaba outlets in Noida and Prayagraj.',
        image: '/images/og/home-1200x630.jpg',
    },
    '/about': {
        title: 'Our Story Since 2018 | Sardaar Ji Dhaba',
        description: 'Read the Sardaar Ji Dhaba story, from its 2018 beginnings to Punjabi restaurant tables in Noida and Prayagraj.',
        image: '/images/og/about-1200x630.jpg',
    },
    '/menu': {
        title: 'Punjabi & North Indian Menu | Sardaar Ji Dhaba',
        description: 'Browse Punjabi starters, North Indian curries, breads, rice, desserts and drinks at Sardaar Ji Dhaba in Noida and Prayagraj.',
        image: '/images/og/menu-1200x630.jpg',
    },
    '/gallery': {
        title: 'Food & Restaurant Gallery | Sardaar Ji Dhaba',
        description: 'View food, restaurant spaces and menu imagery from Sardaar Ji Dhaba in Noida and Prayagraj.',
        image: '/images/og/gallery-1200x630.jpg',
    },
    '/locations': {
        title: 'Noida & Prayagraj Outlets | Sardaar Ji Dhaba',
        description: 'Find both Sardaar Ji Dhaba outlets, with city pages for Noida and Prayagraj, contact details and directions.',
        image: '/images/og/locations-1200x630.jpg',
    },
    '/locations/noida': {
        title: 'Punjabi Restaurant in Noida | Sardaar Ji Dhaba',
        description: 'Visit Sardaar Ji Dhaba at The Aranya, Sector 119, Noida for Punjabi and North Indian food, outlet details and directions.',
        image: '/images/og/noida-1200x630.jpg',
    },
    '/locations/prayagraj': {
        title: 'Punjabi Restaurant in Prayagraj | Sardaar Ji Dhaba',
        description: 'Find Sardaar Ji Dhaba on Mahatma Gandhi Marg near El Chico in Civil Lines, Prayagraj, with hours and directions.',
        image: '/images/og/prayagraj-1200x630.jpg',
    },
    '/success-story': {
        title: 'Sardaar Ji Dhaba Success Story | Noida & Prayagraj',
        description: 'Discover how Sardaar Ji Dhaba grew from its 2018 beginnings into Punjabi restaurant outlets in Noida and Prayagraj.',
        image: '/images/og/success-story-1200x630.jpg',
    },
    '/franchise': {
        title: 'Restaurant Franchise Enquiries | Sardaar Ji Dhaba',
        description: 'Explore a potential Sardaar Ji Dhaba partnership and share your restaurant franchise enquiry with the team.',
        image: '/images/og/franchise-1200x630.jpg',
    },
    '/franchise/apply': {
        title: 'Franchise Application | Sardaar Ji Dhaba',
        description: 'Contact Sardaar Ji Dhaba about a Punjabi restaurant franchise opportunity in your city.',
        image: '/images/og/franchise-1200x630.jpg',
    },
    '/blog': {
        title: 'Punjabi Recipes & City Guides | Sardaar Ji Dhaba',
        description: 'Read Punjabi recipe guides and food stories from Noida and Prayagraj, including butter chicken, dal makhani and more.',
        image: '/images/og/blog-1200x630.jpg',
    },
    '/contact': {
        title: 'Contact Sardaar Ji Dhaba | Noida & Prayagraj',
        description: 'Contact Sardaar Ji Dhaba for questions about its Noida and Prayagraj outlets, menu or franchise enquiries.',
        image: '/images/og/contact-1200x630.jpg',
    },
    '/privacy-policy': {
        title: 'Privacy Policy | Sardaar Ji Dhaba',
        description: 'Read how Sardaar Ji Dhaba handles information submitted through its website and restaurant enquiry channels.',
        image: '/images/og/home-1200x630.jpg',
    },
    '/terms-and-conditions': {
        title: 'Terms & Conditions | Sardaar Ji Dhaba',
        description: 'Review the website terms for Sardaar Ji Dhaba, including restaurant menu, outlet and enquiry information.',
        image: '/images/og/home-1200x630.jpg',
    },
    '/admin': {
        title: 'Admin | Sardaar Ji Dhaba',
        description: 'Private Sardaar Ji Dhaba administration page.',
        image: '/images/og/home-1200x630.jpg',
        indexable: false,
    },
};

export function getSeoMetadata(route: string): SeoMetadata | undefined {
    const staticMetadata = seoRoutes[route];
    if (staticMetadata) return staticMetadata;

    const story = route.startsWith('/blog/')
        ? stories.find(item => route === `/blog/${item.id}`)
        : undefined;
    if (!story) return undefined;

    const dishName = story.title.replace(/^How to Make (?:Restaurant Style )?/i, '');
    return {
        title: story.seoTitle ?? `${dishName} Recipe | ${brand.name}`,
        description: story.seoDescription ?? story.excerpt,
        image: story.image,
        type: 'article',
    };
}