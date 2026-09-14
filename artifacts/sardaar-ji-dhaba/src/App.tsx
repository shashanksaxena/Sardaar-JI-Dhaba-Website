import { type FormEvent, type ReactNode, useEffect, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ArrowRight, ArrowUpRight, ChevronLeft, Clock3, Instagram, Linkedin, MapPin, Menu as MenuIcon, MessageCircle, Phone, Search, Star, Utensils, X } from 'lucide-react';
import { Link, Route, Switch, useLocation, useParams, Router as WouterRouter } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { brand, locations, menu, menuBoards, stories, values, type MenuItem } from '@/data/content';

const queryClient = new QueryClient();

function getApiBase() {
  const configured = (import.meta.env.VITE_API_URL ?? '').trim();
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  const isLocalDev = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0';

  if (import.meta.env.DEV || isLocalDev) {
    return '';
  }

  return configured ? configured.replace(/\/$/, '') : '';
}

function apiUrl(path: string) {
  return `${getApiBase()}${path}`;
}

const DEMO_STORAGE_KEYS = {
  enquiries: 'sardaar_ji_demo_enquiries',
  analytics: 'sardaar_ji_demo_analytics',
  adminSession: 'sardaar_ji_demo_admin_session',
};

const DEMO_ADMIN_USERNAME = 'shasha182';
const DEMO_ADMIN_PASSWORD = 'Shasha@123';

function readDemoCollection<T>(key: string): T[] {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) as T[] : [];
  } catch {
    return [];
  }
}

function writeDemoCollection<T>(key: string, value: T[]) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore localStorage quota failures in demo mode.
  }
}

function getDemoSummary() {
  const enquiries = readDemoCollection<{ kind: string; name: string; email: string; phone?: string; city?: string; message: string; createdAt: string }>(DEMO_STORAGE_KEYS.enquiries);
  const events = readDemoCollection<{ name: string; path: string; createdAt: string }>(DEMO_STORAGE_KEYS.analytics);
  const eventCounts = Object.entries(events.reduce<Record<string, number>>((accumulator, event) => {
    accumulator[event.name] = (accumulator[event.name] ?? 0) + 1;
    return accumulator;
  }, {})).map(([name, count]) => ({ _id: name, count }));

  return {
    inquiries: enquiries.length,
    events: events.length,
    eventCounts: eventCounts.sort((left, right) => right.count - left.count),
    recentInquiries: enquiries.slice().reverse().slice(0, 50),
  };
}

async function trackEvent(name: string) {
  const payload = { name, path: window.location.pathname, createdAt: new Date().toISOString() };
  try {
    const response = await fetch(apiUrl('/api/analytics/events'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, path: window.location.pathname }) });
    if (!response.ok) throw new Error('API unavailable');
  } catch {
    const events = readDemoCollection<{ name: string; path: string; createdAt: string }>(DEMO_STORAGE_KEYS.analytics);
    writeDemoCollection(DEMO_STORAGE_KEYS.analytics, [...events, payload]);
  }
}

function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let element = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, name);
    document.head.appendChild(element);
  }
  element.content = content;
}

function Meta({ title, description = 'Sardaar JI Dhaba serves authentic Punjabi and North Indian food in Noida and Prayagraj, with dhaba-style recipes, tandoori favourites and generous family dining.', keywords = 'Sardaar JI Dhaba, Punjabi restaurant, North Indian food, dhaba food, restaurant style Indian recipes, Noida restaurant, Prayagraj restaurant', image = '/images/blog/restaurant-style-butter-chicken.png', type = 'website' }: { title: string; description?: string; keywords?: string; image?: string; type?: string }) {
  const [location] = useLocation();
  useEffect(() => {
    const canonical = `${brand.siteUrl}${location === '/' ? '/' : location}`;
    const absoluteImage = image.startsWith('http') ? image : `${brand.siteUrl}${image}`;

    document.title = title;
    setMeta('description', description);
    setMeta('keywords', keywords);
    setMeta('og:type', type, 'property');
    setMeta('og:title', title, 'property');
    setMeta('og:description', description, 'property');
    setMeta('og:url', canonical, 'property');
    setMeta('og:image', absoluteImage, 'property');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    setMeta('twitter:image', absoluteImage);

    let canonicalLink = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonical;
  }, [description, image, keywords, location, title, type]);
  return null;
}

function RestaurantStructuredData() {
  useEffect(() => {
    const scriptId = 'restaurant-structured-data';
    document.getElementById(scriptId)?.remove();

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Restaurant',
      name: brand.name,
      description: 'Sardaar JI Dhaba is a Punjabi and North Indian restaurant in Prayagraj and Noida serving butter chicken, dal makhani, paneer tikka, tandoori favourites, family dining and takeaway.',
      url: brand.siteUrl,
      telephone: `+91 ${brand.phone.slice(0, 5)} ${brand.phone.slice(5)}`,
      logo: `${brand.siteUrl}${brand.logo}`,
      image: [`${brand.siteUrl}/images/blog/restaurant-style-butter-chicken.png`, `${brand.siteUrl}/images/restaurant/dining-room.jpg`],
      servesCuisine: ['Punjabi', 'North Indian', 'Indian'],
      priceRange: '₹₹',
      menu: `${brand.siteUrl}/menu`,
      sameAs: [brand.instagramUrl, brand.googleBusinessUrl, brand.orderUrl],
      address: {
        '@type': 'PostalAddress',
        streetAddress: locations[1]?.area ?? locations[0].area,
        addressLocality: 'Prayagraj',
        addressRegion: 'Uttar Pradesh',
        postalCode: '211001',
        addressCountry: 'IN',
      },
      areaServed: locations.map(location => ({ '@type': 'City', name: location.city })),
      openingHoursSpecification: [{
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '11:00',
        closes: '23:00',
      }],
      hasMap: locations[1]?.mapUrl ?? locations[0].mapUrl,
    };

    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
    return () => document.getElementById(scriptId)?.remove();
  }, []);
  return null;
}

function Header() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const nav = [
    ['/about', 'Our story'],
    ['/menu', 'Menu'],
    ['/gallery', 'Gallery'],
    ['/franchise', 'Franchise'],
    ['/locations', 'Find us'],
    ['/success-story', 'Success story'],
    ['/blog', 'Blog'],
  ];
  const isActive = (href: string) => location === href || (href === '/locations' && location.startsWith('/locations/'));
  return (
    <header className="sticky top-0 z-40 border-b border-foreground/10 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link href="/" className="group flex items-center gap-3" data-testid="link-home-logo">
          <img src={brand.logo} alt="Sardaar JI Dhaba logo" className="h-11 w-11 rounded-full object-cover mix-blend-multiply transition-transform group-hover:rotate-[-8deg]" />
          <span className="leading-none">
            <span className="block font-display text-xl font-semibold tracking-[-.04em]">Sardaar JI</span>
            <span className="font-mono-brand text-[9px] uppercase tracking-[.22em] text-muted-foreground">Dhaba · since 2018</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">
          {nav.map(([href, label]) => (
            <Link key={href} href={href} className={`text-sm font-semibold transition-colors hover:text-primary ${isActive(href) ? 'text-primary' : 'text-foreground/70'}`} data-testid={`link-nav-${label.toLowerCase().replace(' ', '-')}`}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <a href={brand.whatsapp} onClick={() => trackEvent('whatsapp_click')} target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center rounded-full border border-secondary/30 text-secondary transition-colors hover:bg-secondary hover:text-secondary-foreground" aria-label="Chat on WhatsApp" data-testid="link-whatsapp-header"><MessageCircle size={17} /></a>
          <a href={`tel:${brand.phone}`} onClick={() => trackEvent('phone_click')} className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5" data-testid="link-call-header">Call the dhaba</a>
        </div>
        <button type="button" onClick={() => setOpen(!open)} className="grid h-10 w-10 place-items-center rounded-full border border-foreground/15 lg:hidden" aria-label={open ? 'Close menu' : 'Open menu'} data-testid="button-toggle-menu">
          {open ? <X size={20} /> : <MenuIcon size={20} />}
        </button>
      </div>
      {open && (
        <div className="border-t border-foreground/10 bg-background px-5 py-5 lg:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            {nav.map(([href, label]) => (
              <Link key={href} href={href} onClick={() => setOpen(false)} className="flex items-center justify-between border-b border-foreground/10 py-3 text-lg font-semibold" data-testid={`link-mobile-${label.toLowerCase().replace(' ', '-')}`}>{label}<ArrowUpRight size={17} /></Link>
            ))}
            <a href={`tel:${brand.phone}`} className="mt-4 flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-center font-bold text-primary-foreground" data-testid="link-call-mobile"><Phone size={16} /> Call the dhaba</a>
          </nav>
        </div>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <div className="mb-5 flex items-center gap-3"><img src={brand.logo} alt="Sardaar JI Dhaba logo" className="h-11 w-11 rounded-full object-cover" /><span className="font-display text-2xl">Sardaar JI Dhaba</span></div>
          <p className="max-w-xs text-sm leading-6 text-secondary-foreground/70">A generous roadside table, serving the flavours we grew up with in Noida and Prayagraj.</p>
          <div className="mt-6 flex gap-3"><a href={brand.whatsapp} target="_blank" rel="noreferrer" className="grid h-9 w-9 place-items-center rounded-full border border-secondary-foreground/20 hover:bg-secondary-foreground/10" aria-label="WhatsApp" data-testid="link-whatsapp-footer"><MessageCircle size={15} /></a><a href={brand.instagramUrl} target="_blank" rel="noreferrer" className="grid h-9 w-9 place-items-center rounded-full border border-secondary-foreground/20 hover:bg-secondary-foreground/10" aria-label="Instagram" data-testid="link-instagram-footer"><Instagram size={15} /></a></div>
        </div>
        <div><p className="mb-4 font-mono-brand text-[10px] uppercase tracking-[.2em] text-accent">Explore</p><div className="flex flex-col gap-3 text-sm text-secondary-foreground/75"><Link href="/about" className="hover:text-accent" data-testid="link-footer-about">Our story</Link><Link href="/menu" className="hover:text-accent" data-testid="link-footer-menu">The menu</Link><Link href="/gallery" className="hover:text-accent" data-testid="link-footer-gallery">Gallery</Link><Link href="/blog" className="hover:text-accent" data-testid="link-footer-blog">Blog</Link><Link href="/success-story" className="hover:text-accent" data-testid="link-footer-success">Success story</Link></div></div>
        <div><p className="mb-4 font-mono-brand text-[10px] uppercase tracking-[.2em] text-accent">Come by</p><div className="flex flex-col gap-3 text-sm text-secondary-foreground/75"><Link href="/locations/noida" className="hover:text-accent" data-testid="link-footer-noida">Noida stop</Link><Link href="/locations/prayagraj" className="hover:text-accent" data-testid="link-footer-prayagraj">Prayagraj stop</Link><Link href="/contact" className="hover:text-accent" data-testid="link-footer-contact">Contact us</Link><Link href="/franchise" className="hover:text-accent" data-testid="link-footer-franchise">Franchise</Link></div></div>
        <div><p className="mb-4 font-mono-brand text-[10px] uppercase tracking-[.2em] text-accent">Say hello</p><div className="flex flex-col gap-3 text-sm text-secondary-foreground/75"><a href={`tel:${brand.phone}`} className="hover:text-accent" data-testid="link-footer-phone">{brand.phone}</a><a href={`mailto:${brand.email}`} className="break-all hover:text-accent" data-testid="link-footer-email">{brand.email}</a><a href={brand.instagramUrl} target="_blank" rel="noreferrer" className="hover:text-accent">{brand.instagram}</a><a href={brand.googleBusinessUrl} target="_blank" rel="noreferrer" className="hover:text-accent">Google reviews</a></div></div>
      </div>
      <div className="border-t border-secondary-foreground/15"><div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-5 text-xs text-secondary-foreground/55 sm:flex-row sm:items-center sm:justify-between lg:px-8"><span>© 2024 Sardaar JI Dhaba. Made for hungry people.</span><div className="flex gap-5"><Link href="/privacy-policy" className="hover:text-accent" data-testid="link-privacy-footer">Privacy</Link><Link href="/terms-and-conditions" className="hover:text-accent" data-testid="link-terms-footer">Terms</Link></div></div></div>
    </footer>
  );
}

function Shell({ children }: { children: ReactNode }) {
  return <><Header /><RestaurantStructuredData /><main>{children}</main><Footer /><MobileActionBar /></>;
}

function MobileActionBar() {
  return <nav className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-4 border-t border-foreground/15 bg-background/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_hsl(var(--foreground)/.12)] backdrop-blur-md md:hidden" aria-label="Quick actions">
    <Link href="/menu" onClick={() => trackEvent('menu_click')} className="flex min-h-14 flex-col items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wide text-foreground" data-testid="link-mobile-menu"><Utensils size={17} />Menu</Link>
    <a href={`tel:${brand.phone}`} onClick={() => trackEvent('phone_click')} className="flex min-h-14 flex-col items-center justify-center gap-1 bg-primary text-[10px] font-bold uppercase tracking-wide text-primary-foreground" data-testid="link-mobile-call"><Phone size={17} />Call</a>
    <Link href="/locations/prayagraj" onClick={() => trackEvent('directions_click')} className="flex min-h-14 flex-col items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wide text-foreground" data-testid="link-mobile-directions"><MapPin size={17} />Directions</Link>
    <a href={brand.whatsapp} onClick={() => trackEvent('whatsapp_click')} target="_blank" rel="noreferrer" className="flex min-h-14 flex-col items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wide text-foreground" data-testid="link-mobile-whatsapp"><MessageCircle size={17} />WhatsApp</a>
  </nav>;
}

function PlaceholderArt({ label, className = '' }: { label: string; className?: string }) {
  return <div className={`relative isolate flex min-h-[180px] items-end overflow-hidden bg-secondary p-5 text-secondary-foreground ${className}`} aria-label={`${label} image placeholder`} data-testid={`placeholder-${label.toLowerCase().replaceAll(' ', '-')}`}><div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, hsl(var(--accent)) 0 1px, transparent 1px)', backgroundSize: '18px 18px' }} /><div className="absolute -right-7 -top-10 h-36 w-36 rounded-full border-[16px] border-accent/30" /><span className="relative font-mono-brand text-[10px] uppercase tracking-[.18em] text-accent">Photo placeholder · {label}</span></div>;
}

function PhotoArt({ src, alt, label, className = '' }: { src: string; alt: string; label: string; className?: string }) {
  return <div className={`relative isolate min-h-[180px] overflow-hidden bg-secondary ${className}`} aria-label={alt} data-testid={`image-${label.toLowerCase().replaceAll(' ', '-')}`}><img src={src} alt={alt} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-secondary/75 via-transparent to-transparent" /><span className="absolute bottom-4 left-4 font-mono-brand text-[10px] uppercase tracking-[.18em] text-background">{label}</span></div>;
}

function PageIntro({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return <section className="mx-auto max-w-7xl px-5 pb-14 pt-16 lg:px-8 lg:pb-20 lg:pt-24"><div className="max-w-3xl fade-up"><p className="mb-5 font-mono-brand text-[10px] uppercase tracking-[.24em] text-primary">{eyebrow}</p><h1 className="text-balance font-display text-5xl leading-[.96] tracking-[-.06em] md:text-7xl">{title}</h1><p className="mt-7 max-w-xl text-base leading-7 text-muted-foreground md:text-lg">{copy}</p></div></section>;
}

function Home() {
  return <Shell><Meta title="Authentic Punjabi Dhaba in Noida & Prayagraj | Sardaar JI Dhaba" description="Experience authentic Punjabi food at Sardaar JI Dhaba. Serving signature butter chicken, fresh naans, and rich gravies in Noida and Prayagraj." keywords="Punjabi restaurant Noida, Punjabi restaurant Prayagraj, authentic dhaba food, North Indian restaurant, butter chicken, dal makhani, tandoori chicken" /><section className="relative overflow-hidden border-b border-foreground/10 bg-primary text-primary-foreground"><div className="mx-auto grid min-h-[650px] max-w-7xl items-end gap-12 px-5 pb-14 pt-20 lg:grid-cols-[1.1fr_.9fr] lg:px-8 lg:pb-20"><div className="relative z-10 max-w-2xl fade-up"><p className="mb-7 font-mono-brand text-[10px] uppercase tracking-[.27em] text-accent">Noida · Prayagraj · India</p><h1 className="font-display text-[clamp(4.5rem,11vw,9.7rem)] leading-[.78] tracking-[-.09em]">Pull over.<br /><span className="text-accent">Eat well.</span></h1><p className="mt-9 max-w-md text-lg leading-7 text-primary-foreground/80">The kind of food that makes a long drive worth taking — cooked with time, served with both hands.</p><div className="mt-9 flex flex-wrap gap-3"><Link href="/menu" className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-bold text-accent-foreground transition-transform hover:-translate-y-1" data-testid="link-hero-menu">See what's cooking <ArrowRight size={16} /></Link><Link href="/locations" className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/40 px-6 py-3.5 text-sm font-bold text-primary-foreground hover:bg-primary-foreground/10" data-testid="link-hero-locations">Find a stop <MapPin size={16} /></Link></div></div><div className="relative min-h-[330px] lg:min-h-[430px] fade-up delay-2"><div className="absolute inset-0 rotate-3 border border-accent/50" /><div className="absolute inset-4 -rotate-3 bg-background p-4 text-foreground shadow-2xl"><PhotoArt src="/images/blog/restaurant-style-butter-chicken.png" alt="Restaurant style butter chicken with naan at Sardaar JI Dhaba" label="signature spread" className="h-full min-h-0" /><div className="absolute bottom-7 left-7 right-7 flex justify-between font-mono-brand text-[9px] uppercase tracking-[.18em]"><span>Made for sharing</span><span>Est. 2018</span></div></div><div className="absolute -bottom-3 -left-5 grid h-24 w-24 -rotate-12 place-items-center rounded-full border-2 border-accent bg-accent font-display text-center text-lg leading-none text-accent-foreground shadow-lg">full<br />plates<br />only</div></div></div></section><section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28"><div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]"><div><p className="font-mono-brand text-[10px] uppercase tracking-[.24em] text-primary">The dhaba promise</p><h2 className="mt-5 max-w-sm font-display text-4xl leading-tight tracking-[-.05em] md:text-5xl">Come as a stranger. Leave with a favourite.</h2></div><div className="grid gap-8 sm:grid-cols-3">{values.map((value, i) => <div key={value.number} className={`border-t-2 ${i === 1 ? 'border-accent' : 'border-secondary'} pt-4 fade-up delay-${i + 1}`}><span className="font-mono-brand text-xs text-primary">{value.number}</span><h3 className="mt-8 font-display text-2xl">{value.title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{value.copy}</p></div>)}</div></div></section><section className="bg-muted/70"><div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-20 lg:grid-cols-[1.1fr_.9fr] lg:px-8 lg:py-24"><div><p className="font-mono-brand text-[10px] uppercase tracking-[.24em] text-secondary">The plate that started conversations</p><h2 className="mt-5 font-display text-5xl leading-[.95] tracking-[-.06em] md:text-7xl">More gravy.<br />More naan.<br /><span className="text-primary">No apologies.</span></h2><p className="mt-7 max-w-md leading-7 text-muted-foreground">We are here for the second helping, the table-wide order and that quiet moment when everyone stops talking because the food arrived.</p><Link href="/menu" className="mt-8 inline-flex items-center gap-2 font-bold text-primary underline decoration-accent decoration-2 underline-offset-4" data-testid="link-home-menu">Browse the full menu <ArrowRight size={16} /></Link></div><PhotoArt src="/images/people/family-table.jpg" alt="Guests sharing a generous dhaba meal" label="the big table" className="min-h-[400px] rotate-2 lg:min-h-[500px]" /></div></section><section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28"><div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div><p className="font-mono-brand text-[10px] uppercase tracking-[.24em] text-primary">The blog</p><h2 className="mt-4 font-display text-4xl tracking-[-.05em] md:text-5xl">Restaurant-style recipes</h2></div><Link href="/blog" className="font-bold text-primary underline decoration-accent underline-offset-4" data-testid="link-home-blog">Read all recipes <ArrowRight className="ml-2 inline" size={16} /></Link></div><div className="mt-10 grid gap-6 md:grid-cols-3">{stories.slice(0, 3).map((story, i) => <Link href={`/blog/${story.id}`} key={story.id} className={`group ${i === 1 ? 'md:translate-y-8' : ''}`} data-testid={`card-home-story-${story.id}`}><PhotoArt src={story.image} alt={story.alt} label={story.category} className="min-h-[220px] transition-transform duration-300 group-hover:rotate-1" /><p className="mt-5 font-mono-brand text-[10px] uppercase tracking-[.18em] text-primary">{story.category}</p><h3 className="mt-2 font-display text-2xl leading-tight group-hover:text-primary">{story.title}</h3><span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold">Read recipe <ArrowUpRight size={14} /></span></Link>)}</div></section><section className="border-t border-foreground/10 bg-accent"><div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-5 py-14 sm:flex-row sm:items-center lg:px-8"><div><p className="font-mono-brand text-[10px] uppercase tracking-[.24em] text-accent-foreground/60">Have a question?</p><h2 className="mt-2 font-display text-4xl tracking-[-.05em]">Ring the bell. We pick up.</h2></div><a href={`tel:${brand.phone}`} className="inline-flex items-center gap-2 rounded-full bg-secondary px-6 py-3.5 text-sm font-bold text-secondary-foreground" data-testid="link-home-call"><Phone size={16} /> {brand.phone}</a></div></section></Shell>;
}

function About() {
  return <Shell><Meta title="Our story" /><PageIntro eyebrow="The long way round" title="A dhaba is more than a place to eat." copy="It is a pause in the journey. A familiar smell from the open kitchen. A table where the food keeps coming and nobody checks the time." /><section className="mx-auto grid max-w-7xl gap-12 px-5 pb-20 lg:grid-cols-[.9fr_1.1fr] lg:px-8 lg:pb-32"><PhotoArt src="/images/restaurant/dining-room.jpg" alt="Warm Sardaar JI Dhaba dining room" label="our beginning" className="min-h-[440px] lg:min-h-[580px]" /><div className="lg:pt-12"><p className="font-mono-brand text-[10px] uppercase tracking-[.24em] text-primary">A note from the family</p><div className="mt-7 space-y-6 font-display text-3xl leading-tight tracking-[-.04em] md:text-4xl"><p>In 2018, we opened our first table with one simple belief: roadside food should never feel like a compromise.</p><p>We wanted the warmth of a Punjabi home, the theatre of a live tandoor and the kind of portions that make you loosen your belt.</p></div><p className="mt-8 max-w-lg text-sm leading-7 text-muted-foreground">Since then, Sardaar JI Dhaba has grown from a single busy stop into a trusted place for family meals, Punjabi comfort food and memorable evenings in Noida and Prayagraj.</p><div className="mt-10 border-l-2 border-accent pl-5 font-mono-brand text-[10px] uppercase tracking-[.17em] text-secondary">Built on repeat guests, slow-cooked gravies and a simple promise:<br /><span className="text-muted-foreground">serve honest food, serve it generously, and make every table feel welcome.</span></div></div></section><section className="bg-secondary text-secondary-foreground"><div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28"><p className="font-mono-brand text-[10px] uppercase tracking-[.24em] text-accent">What has not changed</p><div className="mt-12 grid gap-10 md:grid-cols-3">{values.map(value => <div key={value.number} className="border-t border-secondary-foreground/25 pt-5"><span className="font-mono-brand text-xs text-accent">{value.number}</span><h2 className="mt-10 font-display text-3xl">{value.title}</h2><p className="mt-4 text-sm leading-7 text-secondary-foreground/70">{value.copy}</p></div>)}</div></div></section></Shell>;
}

function SuccessStory() {
  const teamMembers = [
    { name: 'Shashank Saxena', href: 'https://www.linkedin.com/in/shashanksaxena18/' },
    { name: 'Swati Nirkhi', href: 'https://www.linkedin.com/in/swaati-nirkhi-7babb958/' },
    { name: 'Rajan Singh', href: 'https://www.linkedin.com/in/rajan-singh-77739017/' },
    { name: 'Naman Mishra', href: 'https://www.linkedin.com/in/naman-mishra-55756a183/' },
  ];

  return <Shell><Meta title="Success story" /><PageIntro eyebrow="One table became two stops" title="A little roadside belief, carried forward." copy="From the first busy evening in Noida to a second home in Prayagraj — this is a growing story, still written one plate at a time." /><section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8 lg:pb-28"><div className="grid gap-5 md:grid-cols-4">{['2018', '01', '02', '∞'].map((number, i) => <div key={number} className={`min-h-[190px] border-t-2 p-5 ${i === 3 ? 'border-accent bg-accent' : 'border-secondary bg-muted/60'}`}><span className="font-display text-6xl tracking-[-.08em]">{number}</span><p className="mt-8 font-mono-brand text-[10px] uppercase tracking-[.17em] text-muted-foreground">{['The first flame', 'Noida', 'Prayagraj', 'Next chapter'][i]}</p></div>)}</div><div className="mt-16 grid gap-12 lg:grid-cols-[1.05fr_.95fr]"><div><p className="font-mono-brand text-[10px] uppercase tracking-[.24em] text-primary">Built on repeat customers</p><h2 className="mt-5 max-w-lg font-display text-5xl leading-[.95] tracking-[-.06em]">The best kind of growth is someone bringing their parents back.</h2><p className="mt-7 max-w-lg leading-7 text-muted-foreground">What started in Noida with one busy dining room has grown into a second home in Prayagraj, where the same Punjabi values still guide the kitchen: generous portions, smoky tandoor flavours, and the kind of hospitality that keeps people coming back with their families.</p></div><PhotoArt src="/images/people/guest-table.jpg" alt="Guests enjoying Punjabi food at Sardaar JI Dhaba" label="our people" className="min-h-[360px]" /></div></section><section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8 lg:pb-28"><div className="mb-8"><p className="font-mono-brand text-[10px] uppercase tracking-[.24em] text-primary">Meet the team</p><h2 className="mt-4 font-display text-4xl tracking-[-.05em] md:text-5xl">The people behind the long tables.</h2></div><div className="grid gap-6 md:grid-cols-2">{teamMembers.map(({ name, href }) => <div key={name} className="flex items-center gap-5 rounded-2xl border border-foreground/10 bg-card p-5"><div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent font-display text-lg text-accent-foreground">{name.split(' ').map(word => word[0]).slice(0, 2).join('').toUpperCase()}</div><div className="min-w-0 flex-1"><p className="font-display text-2xl leading-none tracking-[-.03em]">{name}</p><p className="mt-2 text-sm text-muted-foreground">Sardaar JI Dhaba team</p><a href={href} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary"><Linkedin size={16} /> LinkedIn</a></div></div>)}</div></section><section className="bg-muted/70"><div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24"><div className="grid gap-8 md:grid-cols-2"><div className="sketch-border bg-background p-8"><Star className="text-accent" size={22} fill="currentColor" /><p className="mt-6 font-display text-3xl leading-tight">“The taste, warmth and generosity that makes people return.”</p><p className="mt-6 font-mono-brand text-[10px] uppercase tracking-[.17em] text-muted-foreground">Guest quote placeholder</p></div><div className="flex flex-col justify-center"><p className="font-mono-brand text-[10px] uppercase tracking-[.24em] text-primary">Want to build the next table?</p><h2 className="mt-4 font-display text-4xl tracking-[-.05em]">Bring the Sardaar JI feeling to your city.</h2><Link href="/franchise" className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground" data-testid="link-success-franchise">Explore franchise partnership <ArrowRight size={16} /></Link></div></div></div></section></Shell>;
}

function MenuPage() {
  const [active, setActive] = useState('All');
  const [query, setQuery] = useState('');
  const categories = useMemo(() => ['All', ...Array.from(new Set(menu.map(item => item.category)))], []);
  const filtered = useMemo(() => menu.filter(item => (active === 'All' || item.category === active) && `${item.name} ${item.description}`.toLowerCase().includes(query.toLowerCase())), [active, query]);
  return <Shell><Meta title="Our Menu - North Indian & Punjabi Specialities | Sardaar JI Dhaba" description="Explore the full menu at Sardaar JI Dhaba. From Dal Makhani to Tandoori Roti, view our fresh Punjabi dishes." /><PageIntro eyebrow="The menu" title="Come hungry. Leave happier." copy="Punjabi classics, North Indian favourites and fresh dhaba-style comfort food across both Sardaar JI Dhaba locations." /><section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8 lg:pb-28"><div className="flex flex-col gap-5 border-y border-foreground/10 py-5 lg:flex-row lg:items-center lg:justify-between"><div className="flex gap-2 overflow-x-auto pb-1">{categories.map(category => <button type="button" key={category} onClick={() => setActive(category)} className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-bold transition-colors ${active === category ? 'border-primary bg-primary text-primary-foreground' : 'border-foreground/15 hover:border-primary hover:text-primary'}`} data-testid={`button-filter-${category.toLowerCase()}`}>{category}</button>)}</div><label className="flex items-center gap-3 border-b border-foreground/20 pb-2 text-sm lg:w-60"><Search size={16} className="text-muted-foreground" /><span className="sr-only">Search menu</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search the menu" className="w-full bg-transparent outline-none placeholder:text-muted-foreground" data-testid="input-menu-search" /></label></div><div className="mt-12 grid gap-x-10 gap-y-8 md:grid-cols-2">{filtered.map(item => <MenuCard item={item} key={item.id} />)}</div>{filtered.length === 0 && <div className="py-20 text-center"><Utensils className="mx-auto text-primary" /><p className="mt-4 font-display text-2xl">That plate is not on today's list.</p><button type="button" onClick={() => { setQuery(''); setActive('All'); }} className="mt-4 text-sm font-bold text-primary underline" data-testid="button-reset-menu">Reset the menu</button></div>}<div className="mt-16 border border-dashed border-primary/50 bg-primary/5 p-5 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">Menu note:</strong> Sardaar JI Dhaba serves a broad Punjabi and North Indian menu across both locations, including tandoori starters, curries, breads, rice, desserts and beverages.</div></section></Shell>;
}

function MenuCard({ item }: { item: MenuItem }) {
  return <article className="group flex gap-4 border-b border-foreground/10 pb-7" data-testid={`card-menu-item-${item.id}`}><div className="h-24 w-24 shrink-0 overflow-hidden sm:h-28 sm:w-32"><PhotoArt src={item.image ?? "/images/restaurant/signature-thali.jpg"} alt={`${item.name} at Sardaar JI Dhaba`} label={item.name} className="h-full min-h-0 p-0 transition-transform duration-300 group-hover:scale-105" /></div><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-3"><h2 className="font-display text-2xl leading-none tracking-[-.03em]">{item.name}</h2><span className="font-mono-brand text-sm text-primary">{item.price}</span></div><p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>{item.mark && <span className="mt-3 inline-block font-mono-brand text-[9px] uppercase tracking-[.17em] text-secondary">{item.mark}</span>}</div></article>;
}

function Gallery() {
  const photos = [
    ...menuBoards,
    { id: 'dining-room', title: 'Dining room', image: '/images/restaurant/dining-room.jpg', alt: 'Sardaar JI Dhaba dining room' },
    { id: 'dhaba-exterior', title: 'Dhaba exterior', image: '/images/restaurant/dhaba-exterior.jpg', alt: 'Sardaar JI Dhaba exterior' },
    { id: 'guest-table', title: 'Family table', image: '/images/people/guest-table.jpg', alt: 'Guests enjoying a meal at Sardaar JI Dhaba' },
  ];
  return <Shell><Meta title="Gallery | Sardaar JI Dhaba" description="See the real food, dining spaces and menu boards from Sardaar JI Dhaba in Noida and Prayagraj." /><PageIntro eyebrow="A look around the table" title="Food, fire and familiar faces." copy="A gallery of the restaurant, menu boards and dining moments already shared by Sardaar JI Dhaba." /><section className="mx-auto grid max-w-7xl gap-5 px-5 pb-24 sm:grid-cols-2 lg:grid-cols-3 lg:px-8">{photos.map(photo => <figure key={photo.id} className="group overflow-hidden border border-foreground/10 bg-card"><PhotoArt src={photo.image} alt={photo.alt} label={photo.title} className="min-h-[260px] transition-transform duration-500 group-hover:scale-[1.02]" /><figcaption className="p-4 font-display text-2xl">{photo.title}</figcaption></figure>)}</section></Shell>;
}

function LocationsLegacy() {
  return <Shell><Meta title="Find us" /><PageIntro eyebrow="Two stops, one big welcome" title="Where the road meets good food." copy="Choose your nearest table. Exact addresses, timings and map links are marked for the Sardaar JI team to add." /><section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8 lg:pb-28"><div className="grid gap-6 md:grid-cols-2">{locations.map(location => <Link href={`/locations/${location.id}`} key={location.id} className="group border border-foreground/15 bg-card p-3 transition-transform hover:-translate-y-1" data-testid={`card-location-${location.id}`}><PhotoArt src={location.image} alt={`${location.city} Sardaar JI Dhaba location`} label={`${location.city} stop`} className="min-h-[260px]" /><div className="p-5"><div className="flex items-center justify-between"><p className="font-mono-brand text-[10px] uppercase tracking-[.2em] text-primary">{location.city}</p><ArrowUpRight size={18} className="text-primary transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></div><h2 className="mt-4 font-display text-3xl">{location.note}</h2><div className="mt-6 space-y-2 text-sm text-muted-foreground"><p className="flex items-center gap-2"><MapPin size={14} className="text-primary" />{location.area}</p><p className="flex items-center gap-2"><Clock3 size={14} className="text-primary" />{location.hours}</p></div></div></Link>)}</div></section></Shell>;
}

function Locations() {
  return <Shell><Meta title="Visit Sardaar Ji Dhaba in Prayagraj & Noida" description="Find Sardaar Ji Dhaba in Prayagraj and Noida, view the exact address, opening hours, map directions, and plan your next Punjabi or North Indian meal." /><PageIntro eyebrow="Two stops, one big welcome" title="Where the road meets good food." copy="Choose your nearest Sardaar JI Dhaba stop in Prayagraj or Noida and plan your visit with the exact address, timings and directions." /><section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8 lg:pb-28"><div className="grid gap-6 md:grid-cols-2">{locations.map(location => <div key={location.id} className="border border-foreground/15 bg-card p-3"><PhotoArt src={location.image} alt={`${location.city} Sardaar JI Dhaba location`} label={`${location.city} stop`} className="min-h-[260px]" /><div className="p-5"><p className="font-mono-brand text-[10px] uppercase tracking-[.2em] text-primary">{location.city}</p><h2 className="mt-4 font-display text-3xl">{location.note}</h2><p className="mt-6 text-sm text-muted-foreground">{location.area}</p><p className="mt-3 flex items-center gap-2 text-sm font-semibold"><Clock3 size={15} className="text-primary" />{location.hours}</p><p className="mt-2 text-sm text-muted-foreground">{location.availability}</p><div className="mt-6 flex flex-wrap gap-3"><Link href={`/locations/${location.id}`} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground">View stop <ArrowUpRight size={15} /></Link><a href={location.mapUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-secondary px-5 py-3 text-sm font-bold text-secondary" data-testid={`link-map-${location.id}`}>Google Maps <MapPin size={15} /></a></div></div></div>)}</div></section></Shell>;
}

function LocationLandingPage({ place }: { place: (typeof locations)[number] }) {
  const formattedPhone = `+91-${brand.phone}`;

  useEffect(() => {
    const scriptId = `location-structured-data-${place.id}`;
    document.getElementById(scriptId)?.remove();

    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: `Sardaar JI Dhaba - ${place.city} Outlet`,
      description: `Sardaar JI Dhaba in ${place.city} serves authentic Punjabi and North Indian food, family dining, and dhaba-style favourites.`,
      url: `${brand.siteUrl}/locations/${place.id}`,
      telephone: formattedPhone,
      image: `${brand.siteUrl}${place.image}`,
      logo: `${brand.siteUrl}${brand.logo}`,
      priceRange: '₹₹',
      servesCuisine: ['Punjabi', 'North Indian', 'Indian'],
      menu: `${brand.siteUrl}/menu`,
      address: {
        '@type': 'PostalAddress',
        streetAddress: place.area,
        addressLocality: place.city,
        addressRegion: 'Uttar Pradesh',
        addressCountry: 'IN',
      },
      openingHours: ['Mo-Su 11:00-23:00'],
      sameAs: [brand.instagramUrl, brand.googleBusinessUrl, brand.orderUrl],
      areaServed: place.city,
      geo: {
        '@type': 'GeoCoordinates',
        latitude: place.id === 'noida' ? 28.5897917 : 25.435801,
        longitude: place.id === 'noida' ? 77.4045819 : 81.8463,
      },
    });

    document.head.appendChild(script);
    return () => document.getElementById(scriptId)?.remove();
  }, [formattedPhone, place.area, place.city, place.id, place.image]);

  const mapEmbedSrc = `https://www.google.com/maps?q=${encodeURIComponent(place.area)}&output=embed`;

  return <Shell><Meta title={`Sardaar JI Dhaba - ${place.city} Outlet`} description={`Visit Sardaar JI Dhaba - ${place.city} Outlet for authentic Punjabi food, tandoori favourites, family dining, and easy directions in ${place.city}.`} /><section className="bg-secondary text-secondary-foreground"><div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24"><Link href="/locations" className="inline-flex items-center gap-2 font-mono-brand text-[10px] uppercase tracking-[.2em] text-accent" data-testid="link-back-locations"><ChevronLeft size={14} /> All locations</Link><div className="mt-12 grid items-end gap-12 lg:grid-cols-[.8fr_1.2fr]"><div><p className="font-mono-brand text-[10px] uppercase tracking-[.24em] text-accent">{place.city} · Sardaar JI Dhaba</p><h1 className="mt-5 font-display text-7xl leading-[.86] tracking-[-.08em]">Sardaar JI Dhaba - {place.city} Outlet</h1><p className="mt-5 max-w-xl text-base leading-7 text-secondary-foreground/80">{place.note}</p></div><PhotoArt src={place.image} alt={`${place.city} Sardaar JI Dhaba exterior`} label={`${place.city} exterior`} className="min-h-[300px] bg-secondary/70" /></div></div></section><section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24"><div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr]"><div className="border-t-2 border-primary pt-5"><p className="font-mono-brand text-[10px] uppercase tracking-[.2em] text-primary">Plan your stop</p><div className="mt-8 space-y-5 text-sm"><div><p className="font-bold">Address</p><p className="mt-1 text-muted-foreground">{place.area}</p></div><div><p className="font-bold">Phone</p><p className="mt-1 text-muted-foreground">{formattedPhone}</p></div><div><p className="font-bold">Opening hours</p><p className="mt-1 text-muted-foreground">{place.hours}</p></div><div><p className="font-bold">Availability</p><p className="mt-1 text-muted-foreground">{place.availability}</p></div></div><div className="mt-9 flex flex-wrap gap-3"><a href={place.mapUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground" data-testid={`link-directions-${place.city.toLowerCase()}`}><MapPin size={15} /> Get Directions</a><a href={`tel:${brand.phone}`} className="inline-flex items-center gap-2 rounded-full border border-secondary px-5 py-3 text-sm font-bold text-secondary" data-testid={`link-call-${place.city.toLowerCase()}`}><Phone size={15} /> Call Now</a></div></div><div className="rounded-2xl border border-foreground/10 bg-card p-3 md:p-4"><div className="overflow-hidden rounded-xl border border-foreground/10"><iframe title={`${place.city} map`} src={mapEmbedSrc} width="100%" height="420" style={{ border: 0 }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div></div></div></section></Shell>;
}

function LocationDetail() {
  const { city } = useParams<{ city: string }>();
  const place = locations.find(item => item.id === city);

  if (!place) return <NotFound />;
  return <LocationLandingPage place={place} />;
}

function Franchise() {
  return <Shell><Meta title="Franchise partnership" /><section className="bg-secondary text-secondary-foreground"><div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[1fr_.8fr] lg:px-8 lg:py-28"><div><p className="font-mono-brand text-[10px] uppercase tracking-[.24em] text-accent">For people who know the value of a full table</p><h1 className="mt-6 font-display text-6xl leading-[.88] tracking-[-.07em] md:text-8xl">Bring a<br /><span className="text-accent">dhaba</span><br />home.</h1><p className="mt-8 max-w-md text-lg leading-7 text-secondary-foreground/75">We are exploring thoughtful partnerships with people who want to serve honest Punjabi food in their city.</p><Link href="/franchise/apply" className="mt-9 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-bold text-accent-foreground" data-testid="link-franchise-apply">Start a conversation <ArrowRight size={16} /></Link></div><PhotoArt src="/images/restaurant/celebration-room.jpg" alt="Dining room prepared for a Sardaar JI Dhaba gathering" label="future table" className="min-h-[430px] bg-secondary/60" /></div></section><section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28"><div className="grid gap-12 lg:grid-cols-[.7fr_1.3fr]"><div><p className="font-mono-brand text-[10px] uppercase tracking-[.24em] text-primary">The right fit</p><h2 className="mt-5 font-display text-5xl leading-none tracking-[-.06em]">Not a template.<br />A shared table.</h2></div><div className="grid gap-7 sm:grid-cols-2">{['A love for food with a point of view', 'Care for guests that goes beyond service', 'A city, space or idea worth exploring', 'Patience to build something lasting'].map((item, index) => <div key={item} className="border-t border-foreground/15 pt-4"><span className="font-mono-brand text-xs text-primary">0{index + 1}</span><p className="mt-8 font-display text-2xl">{item}</p></div>)}</div></div></section><section className="bg-accent"><div className="mx-auto flex max-w-7xl flex-col gap-7 px-5 py-16 lg:flex-row lg:items-center lg:justify-between lg:px-8"><h2 className="max-w-xl font-display text-4xl leading-tight tracking-[-.05em]">Franchise details, investment and territory information will be shared after an initial conversation.</h2><Link href="/franchise/apply" className="inline-flex w-fit items-center gap-2 rounded-full bg-secondary px-6 py-3.5 text-sm font-bold text-secondary-foreground" data-testid="link-franchise-form">Tell us about your idea <ArrowRight size={16} /></Link></div></section></Shell>;
}

async function sendInquiry(form: HTMLFormElement, kind: 'contact' | 'franchise') {
  const values = Object.fromEntries(new FormData(form).entries());
  const payload = { ...values, kind, createdAt: new Date().toISOString() };

  try {
    const response = await fetch(apiUrl('/api/inquiries'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...values, kind }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.message ?? 'The message could not be sent.');
    return;
  } catch {
    const enquiries = readDemoCollection<{ kind: string; name: string; email: string; phone?: string; city?: string; message: string; createdAt: string }>(DEMO_STORAGE_KEYS.enquiries);
    const rawPayload = payload as Record<string, string | undefined>;
    const submission = {
      kind: String(rawPayload.kind ?? 'contact'),
      name: String(rawPayload.name ?? ''),
      email: String(rawPayload.email ?? ''),
      phone: typeof rawPayload.phone === 'string' ? rawPayload.phone : undefined,
      city: typeof rawPayload.city === 'string' ? rawPayload.city : undefined,
      message: String(rawPayload.message ?? ''),
      createdAt: payload.createdAt,
    };
    writeDemoCollection(DEMO_STORAGE_KEYS.enquiries, [...enquiries, submission]);
  }
}

function Application() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSending(true);
    try {
      await sendInquiry(event.currentTarget, 'franchise');
      setSent(true);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'The message could not be sent.');
    } finally {
      setSending(false);
    }
  };
  return <Shell><Meta title="Franchise application" /><div className="mx-auto grid max-w-7xl gap-14 px-5 py-16 lg:grid-cols-[.7fr_1.3fr] lg:px-8 lg:py-24"><div><Link href="/franchise" className="inline-flex items-center gap-2 font-mono-brand text-[10px] uppercase tracking-[.2em] text-primary" data-testid="link-back-franchise"><ChevronLeft size={14} /> Franchise</Link><h1 className="mt-12 font-display text-6xl leading-[.88] tracking-[-.07em]">Let's talk<br /><span className="text-primary">over chai.</span></h1><p className="mt-7 max-w-sm leading-7 text-muted-foreground">Tell us a little about yourself and the place you imagine. This first form is just a hello — no hard sell, no jargon.</p><div className="mt-10 flex items-center gap-3 border-t border-foreground/10 pt-5 text-sm"><Phone size={16} className="text-primary" /><a href={`tel:${brand.phone}`} className="font-bold" data-testid="link-application-phone">{brand.phone}</a></div></div><div className="bg-muted/60 p-6 md:p-10">{sent ? <div className="flex min-h-[500px] flex-col items-start justify-center"><span className="grid h-12 w-12 place-items-center rounded-full bg-accent font-bold text-secondary">✓</span><h2 className="mt-7 font-display text-4xl">Message received.</h2><p className="mt-4 max-w-md leading-7 text-muted-foreground">Thank you for reaching out. The Sardaar JI team will review your note and get back to you at the contact details you shared.</p><button type="button" onClick={() => setSent(false)} className="mt-7 font-bold text-primary underline" data-testid="button-application-another">Send another note</button></div> : <form onSubmit={submit} className="space-y-6"><div><label htmlFor="name" className="mb-2 block text-sm font-bold">Your name</label><input id="name" name="name" required className="w-full border-b border-foreground/25 bg-transparent px-0 py-3 outline-none transition-colors focus:border-primary" placeholder="e.g. Harpreet Singh" data-testid="input-application-name" /></div><div><label htmlFor="email" className="mb-2 block text-sm font-bold">Email address</label><input id="email" name="email" type="email" required className="w-full border-b border-foreground/25 bg-transparent px-0 py-3 outline-none focus:border-primary" placeholder="you@example.com" data-testid="input-application-email" /></div><div><label htmlFor="phone" className="mb-2 block text-sm font-bold">Phone number</label><input id="phone" name="phone" required className="w-full border-b border-foreground/25 bg-transparent px-0 py-3 outline-none focus:border-primary" placeholder="Your best number" data-testid="input-application-phone" /></div><div><label htmlFor="city" className="mb-2 block text-sm font-bold">City or location</label><input id="city" name="city" required className="w-full border-b border-foreground/25 bg-transparent px-0 py-3 outline-none focus:border-primary" placeholder="Where would you open a table?" data-testid="input-application-city" /></div><div><label htmlFor="message" className="mb-2 block text-sm font-bold">Tell us a little more <span className="font-normal text-muted-foreground">(optional)</span></label><textarea id="message" name="message" rows={4} className="w-full resize-none border-b border-foreground/25 bg-transparent px-0 py-3 outline-none focus:border-primary" placeholder="Your background, your idea, or just say hello." data-testid="input-application-message" /></div><button type="submit" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground" data-testid="button-submit-application">Send enquiry <ArrowRight size={16} /></button><p className="text-xs text-muted-foreground">By submitting, you agree to be contacted about this enquiry. This is a sample application form pending final integration.</p></form>}</div></div></Shell>;
}

function Blog() {
  const [visibleCount, setVisibleCount] = useState(6);
  const visibleStories = stories.slice(0, visibleCount);
  return <Shell><Meta title="Sardaar JI Dhaba Blog & City Guides" description="Read Sardaar JI Dhaba blog posts and city guides on Prayagraj, restaurant picks, Punjabi comfort food, and local travel ideas." /><PageIntro eyebrow="Blog" title="Stories, guides and good food from Prayagraj." copy="From restaurant-style recipes to local city guides, discover what makes Sardaar JI Dhaba a favourite stop in Noida and Prayagraj." /><section className="mx-auto max-w-7xl px-5 pb-24 lg:px-8"><div className="grid gap-7 md:grid-cols-3">{visibleStories.map((story, i) => <Link href={`/blog/${story.id}`} key={story.id} className={`group ${i % 3 === 1 ? 'md:translate-y-12' : ''}`} data-testid={`card-blog-${story.id}`}><PhotoArt src={story.image} alt={story.alt} label={story.category} className="min-h-[270px]" /><p className="mt-6 font-mono-brand text-[10px] uppercase tracking-[.18em] text-primary">{story.publishedAt} · {story.category} · {story.read}</p><h2 className="mt-3 font-display text-3xl leading-none tracking-[-.04em] group-hover:text-primary">{story.title}</h2><p className="mt-4 text-sm leading-6 text-muted-foreground">{story.excerpt}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-bold">{story.category === 'Recipe guide' ? 'Read recipe' : 'Read article'} <ArrowUpRight size={15} /></span></Link>)}</div>{visibleCount < stories.length && <button type="button" onClick={() => setVisibleCount(count => Math.min(count + 6, stories.length))} className="mx-auto mt-16 block rounded-full border border-primary px-6 py-3 text-sm font-bold text-primary hover:bg-primary hover:text-primary-foreground" data-testid="button-load-more-blog">Load more posts</button>}</section></Shell>;
}

function RecipeStructuredData({ story }: { story: typeof stories[number] }) {
  useEffect(() => {
    const scriptId = 'recipe-structured-data';
    document.getElementById(scriptId)?.remove();
    if (!story.ingredients || !story.method) return;

    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Recipe',
      name: story.title,
      description: story.seoDescription ?? story.excerpt,
      image: `${brand.siteUrl}${story.image}`,
      author: { '@type': 'Organization', name: brand.name },
      publisher: { '@type': 'Organization', name: brand.name, url: brand.siteUrl },
      datePublished: story.publishedAt,
      recipeCategory: 'Punjabi recipe',
      recipeCuisine: 'North Indian',
      recipeIngredient: story.ingredients,
      recipeInstructions: story.method.map((step, index) => ({ '@type': 'HowToStep', name: `Step ${index + 1}`, text: step })),
      mainEntityOfPage: `${brand.siteUrl}/blog/${story.id}`,
    });
    document.head.appendChild(script);
    return () => document.getElementById(scriptId)?.remove();
  }, [story]);
  return null;
}

function BlogArticle() {
  const { slug } = useParams<{ slug: string }>();
  const story = stories.find(item => item.id === slug);
  if (!story) return <NotFound />;

  const recipeName = story.category === 'Recipe guide'
    ? story.title.replace(/^How to Make /i, '')
    : story.title;
  const articleTitle = story.category === 'Recipe guide'
    ? `${story.title} - Restaurant Style Cooking | Sardaar JI Dhaba Blog`
    : (story.seoTitle ?? story.title);
  const articleDescription = story.category === 'Recipe guide'
    ? `Learn how to make authentic ${recipeName} at home with step-by-step guides from Sardaar JI Dhaba.`
    : (story.seoDescription ?? story.excerpt);

  return <Shell><Meta title={articleTitle} description={articleDescription} keywords={story.keywords} image={story.image} type="article" /><RecipeStructuredData story={story} /><article><header className="mx-auto max-w-4xl px-5 pb-12 pt-16 text-center lg:px-8 lg:pt-24"><Link href="/blog" className="font-mono-brand text-[10px] uppercase tracking-[.2em] text-primary" data-testid="link-back-blog">← Back to blog</Link><p className="mt-10 font-mono-brand text-[10px] uppercase tracking-[.2em] text-secondary">{story.category} · {story.read}</p><h1 className="mt-5 font-display text-5xl leading-[.92] tracking-[-.07em] md:text-7xl">{story.title}</h1><p className="mx-auto mt-7 max-w-xl text-lg leading-7 text-muted-foreground">{story.excerpt}</p></header><div className="mx-auto max-w-5xl px-5 lg:px-8"><PhotoArt src={story.image} alt={story.alt} label={story.category} className="min-h-[300px] md:min-h-[480px]" /></div><div className="mx-auto max-w-3xl px-5 py-16 lg:px-8"><div className="space-y-10">{story.ingredients && story.ingredients.length > 0 && <section className="rounded-2xl border border-foreground/10 bg-card p-6 md:p-8"><h2 className="font-display text-3xl tracking-[-.04em]">Ingredients</h2><ul className="mt-5 space-y-3 text-sm leading-7 text-muted-foreground">{story.ingredients.map((ingredient) => <li key={ingredient} className="flex gap-3"><span className="mt-2 h-2 w-2 rounded-full bg-primary" aria-hidden="true" /><span>{ingredient}</span></li>)}</ul></section>}{story.method && story.method.length > 0 && <section className="rounded-2xl border border-foreground/10 bg-card p-6 md:p-8"><h2 className="font-display text-3xl tracking-[-.04em]">How to make it</h2><ol className="mt-5 space-y-5 text-sm leading-7 text-muted-foreground">{story.method.map((step, index) => <li key={step} className="flex gap-4"><span className="mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">{index + 1}</span><span>{step}</span></li>)}</ol></section>}{story.tips && story.tips.length > 0 && <section className="rounded-2xl border border-foreground/10 bg-card p-6 md:p-8"><h2 className="font-display text-3xl tracking-[-.04em]">Chef tips</h2><ul className="mt-5 space-y-3 text-sm leading-7 text-muted-foreground">{story.tips.map((tip) => <li key={tip} className="flex gap-3"><span className="mt-2 h-2 w-2 rounded-full bg-accent" aria-hidden="true" /><span>{tip}</span></li>)}</ul></section>}<section className="prose prose-stone max-w-none prose-headings:font-display prose-headings:font-semibold prose-p:leading-8"><h2>{story.category === 'Recipe guide' ? 'Why this recipe works' : 'Why this guide matters'}</h2>{story.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<blockquote>{story.category === 'Recipe guide' ? 'The first bite should make you look up from the table.' : 'The best city guides help you see the place clearly, not just tick off the obvious stops.'}</blockquote><p className="font-mono-brand text-xs uppercase tracking-[.16em] text-muted-foreground">{story.category === 'Recipe guide' ? 'Kitchen note · Sardaar JI Dhaba' : 'City note · Prayagraj'}</p></section></div></div></article></Shell>;
}

function ContactLegacy() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSending(true);
    try {
      await sendInquiry(event.currentTarget, 'contact');
      setSent(true);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'The message could not be sent.');
    } finally {
      setSending(false);
    }
  };
  return <Shell><Meta title="Contact" /><PageIntro eyebrow="Come say hello" title="The kettle is always on." copy="For table questions, feedback, catering conversations or just a friendly hello, reach out directly." /><section className="mx-auto grid max-w-7xl gap-12 px-5 pb-24 lg:grid-cols-[.8fr_1.2fr] lg:px-8"><div className="space-y-4"><a href={`tel:${brand.phone}`} className="group flex items-center justify-between border-t border-foreground/15 py-5" data-testid="link-contact-phone"><span><span className="block font-mono-brand text-[10px] uppercase tracking-[.18em] text-primary">Call</span><span className="mt-2 block font-display text-2xl">{brand.phone}</span></span><ArrowUpRight className="text-primary transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></a><a href={`mailto:${brand.email}`} className="group flex items-center justify-between border-t border-foreground/15 py-5" data-testid="link-contact-email"><span><span className="block font-mono-brand text-[10px] uppercase tracking-[.18em] text-primary">Email</span><span className="mt-2 block font-display text-2xl break-all">{brand.email}</span></span><ArrowUpRight className="text-primary" /></a><a href={brand.whatsapp} target="_blank" rel="noreferrer" className="group flex items-center justify-between border-y border-foreground/15 py-5" data-testid="link-contact-whatsapp"><span><span className="block font-mono-brand text-[10px] uppercase tracking-[.18em] text-primary">WhatsApp</span><span className="mt-2 block font-display text-2xl">Start a chat</span></span><ArrowUpRight className="text-primary" /></a></div><div className="bg-muted/60 p-6 md:p-10"><h2 className="font-display text-3xl">Leave a note</h2>{sent ? <div className="mt-12"><h3 className="font-display text-2xl">We have your note.</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">Thanks for writing. We will get back to you soon.</p></div> : <form className="mt-8 space-y-6" onSubmit={event => { event.preventDefault(); setSent(true); }}><div className="grid gap-6 sm:grid-cols-2"><input required aria-label="Your name" placeholder="Your name" className="border-b border-foreground/25 bg-transparent px-0 py-3 outline-none focus:border-primary" data-testid="input-contact-name" /><input required type="email" aria-label="Email address" placeholder="Email address" className="border-b border-foreground/25 bg-transparent px-0 py-3 outline-none focus:border-primary" data-testid="input-contact-email" /></div><textarea required rows={5} aria-label="Your message" placeholder="What can we help with?" className="w-full resize-none border-b border-foreground/25 bg-transparent px-0 py-3 outline-none focus:border-primary" data-testid="input-contact-message" /><button type="submit" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground" data-testid="button-submit-contact">Send note <ArrowRight size={16} /></button></form>}</div></section></Shell>;
}

function Contact() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSending(true);
    try {
      await sendInquiry(event.currentTarget, 'contact');
      setSent(true);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'The message could not be sent.');
    } finally {
      setSending(false);
    }
  };

  return <Shell><Meta title="Contact" /><PageIntro eyebrow="Come say hello" title="The kettle is always on." copy="For table questions, feedback, catering conversations or just a friendly hello, reach out directly." /><section className="mx-auto grid max-w-7xl gap-12 px-5 pb-24 lg:grid-cols-[.8fr_1.2fr] lg:px-8"><div className="space-y-4"><a href={`tel:${brand.phone}`} className="group flex items-center justify-between border-t border-foreground/15 py-5" data-testid="link-contact-phone"><span><span className="block font-mono-brand text-[10px] uppercase tracking-[.18em] text-primary">Call</span><span className="mt-2 block font-display text-2xl">{brand.phone}</span></span><ArrowUpRight className="text-primary" /></a><a href={`mailto:${brand.email}`} className="group flex items-center justify-between border-t border-foreground/15 py-5" data-testid="link-contact-email"><span><span className="block font-mono-brand text-[10px] uppercase tracking-[.18em] text-primary">Email</span><span className="mt-2 block font-display text-2xl break-all">{brand.email}</span></span><ArrowUpRight className="text-primary" /></a><a href={brand.whatsapp} target="_blank" rel="noreferrer" className="group flex items-center justify-between border-y border-foreground/15 py-5" data-testid="link-contact-whatsapp"><span><span className="block font-mono-brand text-[10px] uppercase tracking-[.18em] text-primary">WhatsApp</span><span className="mt-2 block font-display text-2xl">Start a chat</span></span><ArrowUpRight className="text-primary" /></a></div><div className="bg-muted/60 p-6 md:p-10"><h2 className="font-display text-3xl">Leave a note</h2>{sent ? <div className="mt-12"><h3 className="font-display text-2xl">We have your note.</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">Thanks for writing. We will get back to you soon.</p></div> : <form className="mt-8 space-y-6" onSubmit={submit}><div className="grid gap-6 sm:grid-cols-2"><input name="name" required aria-label="Your name" placeholder="Your name" className="border-b border-foreground/25 bg-transparent px-0 py-3 outline-none focus:border-primary" data-testid="input-contact-name" /><input name="email" required type="email" aria-label="Email address" placeholder="Email address" className="border-b border-foreground/25 bg-transparent px-0 py-3 outline-none focus:border-primary" data-testid="input-contact-email" /></div><textarea name="message" required rows={5} aria-label="Your message" placeholder="What can we help with?" className="w-full resize-none border-b border-foreground/25 bg-transparent px-0 py-3 outline-none focus:border-primary" data-testid="input-contact-message" /><button type="submit" disabled={sending} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground disabled:cursor-wait disabled:opacity-60" data-testid="button-submit-contact">{sending ? 'Sending...' : 'Send note'} <ArrowRight size={16} /></button>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}</form>}</div></section></Shell>;
}

function Legal({ terms = false }: { terms?: boolean }) {
  const title = terms ? 'Terms & Conditions | Sardaar JI Dhaba' : 'Privacy Policy | Sardaar JI Dhaba';
  const description = terms ? 'Read the Terms & Conditions for Sardaar JI Dhaba.' : 'Read the Privacy Policy for Sardaar JI Dhaba.';

  return <Shell><Meta title={title} description={description} /><PageIntro eyebrow="The fine print" title={terms ? 'Terms & conditions' : 'Privacy policy'} copy={terms ? 'These terms govern your use of the Sardaar JI Dhaba website, including menu browsing, location information, franchise enquiries and contact forms.' : 'This privacy policy explains how Sardaar JI Dhaba handles personal information provided through our website, contact forms, WhatsApp enquiries and related service requests.'} /><section className="mx-auto max-w-3xl px-5 pb-28 lg:px-8"><div className="space-y-10 border-t border-foreground/15 pt-8 text-sm leading-7 text-muted-foreground">
    {terms ? (
      <>
        <div>
          <h2 className="font-display text-3xl text-foreground">Website use</h2>
          <p className="mt-3">By accessing or using this website, you agree to use it only for lawful, non-commercial purposes. You may browse the menu, locations, blog content, contact details and franchise information for personal reference and general restaurant discovery.</p>
        </div>
        <div>
          <h2 className="font-display text-2xl text-foreground">Content and accuracy</h2>
          <p className="mt-3">Sardaar JI Dhaba makes every effort to keep the information on this website accurate and up to date. Menu items, prices, timings, offers, locations and content may change without prior notice. We do not guarantee that all information will always be error-free, current, or complete.</p>
        </div>
        <div>
          <h2 className="font-display text-2xl text-foreground">Orders, reservations and enquiries</h2>
          <p className="mt-3">Any request submitted through our website, including contact forms, franchise enquiries, or WhatsApp communication, is subject to confirmation by Sardaar JI Dhaba. We may contact you to verify details, clarify requirements or respond to your enquiry. The website is not a binding reservation or order platform unless explicitly stated otherwise.</p>
        </div>
        <div>
          <h2 className="font-display text-2xl text-foreground">Third-party links and services</h2>
          <p className="mt-3">This website may contain links to third-party services such as Google Maps, WhatsApp, Instagram and other external platforms. Sardaar JI Dhaba is not responsible for the content, privacy practices, availability or accuracy of those external services.</p>
        </div>
        <div>
          <h2 className="font-display text-2xl text-foreground">Intellectual property</h2>
          <p className="mt-3">All text, design, branding, photography, menus, blog content, logos and other materials on this website are owned by Sardaar JI Dhaba or are used with appropriate permission. You may not reproduce, redistribute or republish website content without prior written approval.</p>
        </div>
        <div>
          <h2 className="font-display text-2xl text-foreground">Limitation of liability</h2>
          <p className="mt-3">Sardaar JI Dhaba shall not be liable for any indirect, incidental, consequential or punitive damages arising out of or relating to the use of this website. While we aim to provide a reliable and helpful experience, the website is provided on an as-is basis.</p>
        </div>
        <div>
          <h2 className="font-display text-2xl text-foreground">Applicable law</h2>
          <p className="mt-3">These terms are governed by the laws of India, and any dispute arising from the use of this website shall be subject to the exclusive jurisdiction of the courts in Uttar Pradesh, India.</p>
        </div>
        <div>
          <h2 className="font-display text-2xl text-foreground">Contact</h2>
          <p className="mt-3">If you have questions about these terms, please contact us at <a href={`mailto:${brand.email}`} className="font-bold text-primary underline">{brand.email}</a> or call <a href={`tel:${brand.phone}`} className="font-bold text-primary underline">{brand.phone}</a>.</p>
        </div>
      </>
    ) : (
      <>
        <div>
          <h2 className="font-display text-3xl text-foreground">Information we collect</h2>
          <p className="mt-3">We may collect personal information that you voluntarily provide through website forms, direct messages, franchise enquiries, reservations, WhatsApp communication or other contact methods. This may include your name, email address, phone number, city, message content and any other information you choose to share.</p>
        </div>
        <div>
          <h2 className="font-display text-2xl text-foreground">How we use your information</h2>
          <p className="mt-3">We use the information you provide to respond to enquiries, improve customer service, understand visitor interest, support business communications, manage franchise or partnership requests, and maintain the quality and security of our website and services.</p>
        </div>
        <div>
          <h2 className="font-display text-2xl text-foreground">Information sharing</h2>
          <p className="mt-3">Sardaar JI Dhaba does not sell personal information. We may share information with trusted service providers that help us operate the website or deliver communications, but only when necessary and under appropriate confidentiality obligations.</p>
        </div>
        <div>
          <h2 className="font-display text-2xl text-foreground">Cookies and analytics</h2>
          <p className="mt-3">Our website may use cookies, analytics tools and similar technologies to understand how visitors use the site, improve performance, support security and measure marketing effectiveness. You can disable cookies in your browser settings, though some website features may not function properly as a result.</p>
        </div>
        <div>
          <h2 className="font-display text-2xl text-foreground">Data retention and security</h2>
          <p className="mt-3">We retain personal information only for as long as needed to fulfil the purpose for which it was collected, comply with legal obligations, maintain records, or protect against misuse. We take reasonable administrative, technical and organizational measures to help keep information secure.</p>
        </div>
        <div>
          <h2 className="font-display text-2xl text-foreground">Your choices</h2>
          <p className="mt-3">You may contact us at any time to ask what information we hold about you, request a correction, or ask that we stop using your information for a particular purpose, subject to applicable legal requirements.</p>
        </div>
        <div>
          <h2 className="font-display text-2xl text-foreground">Contact</h2>
          <p className="mt-3">If you have any questions about this privacy policy or how your information is handled, please contact <a href={`mailto:${brand.email}`} className="font-bold text-primary underline">{brand.email}</a> or call <a href={`tel:${brand.phone}`} className="font-bold text-primary underline">{brand.phone}</a>.</p>
        </div>
      </>
    )}
  </div></section></Shell>;
}

function NotFound() {
  return <Shell><Meta title="Page not found" /><section className="mx-auto flex min-h-[65vh] max-w-7xl flex-col justify-center px-5 py-20 lg:px-8"><p className="font-mono-brand text-[10px] uppercase tracking-[.24em] text-primary">Wrong turn</p><h1 className="mt-6 max-w-3xl font-display text-[clamp(5rem,14vw,12rem)] leading-[.75] tracking-[-.1em]">404<span className="text-primary">.</span></h1><p className="mt-10 max-w-sm text-lg leading-7 text-muted-foreground">This road does not go to the dhaba. Let us get you back to something tasty.</p><div className="mt-8 flex flex-wrap gap-3"><Link href="/" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground" data-testid="link-404-home">Take me home <ArrowRight size={16} /></Link><Link href="/menu" className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-6 py-3.5 text-sm font-bold" data-testid="link-404-menu">See the menu <Utensils size={16} /></Link></div></section></Shell>;
}

type AdminSummary = { inquiries: number; events: number; eventCounts: { _id: string; count: number }[]; recentInquiries: { kind: string; name: string; email: string; phone?: string; city?: string; message: string; createdAt: string }[] };

function Admin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [summary, setSummary] = useState<AdminSummary | null>(null);
  const [error, setError] = useState('');
  const api = getApiBase();
  const loadSummary = async () => {
    try {
      const response = await fetch(apiUrl('/api/admin/summary'), { credentials: 'include' });
      if (!response.ok) throw new Error('Admin session required.');
      setSummary(await response.json());
      setAuthenticated(true);
      return;
    } catch {
      const session = window.localStorage.getItem(DEMO_STORAGE_KEYS.adminSession);
      if (session !== 'active') {
        setAuthenticated(false);
        setSummary(null);
        return;
      }
      setSummary(getDemoSummary());
      setAuthenticated(true);
    }
  };
  useEffect(() => { loadSummary().catch(() => undefined); }, []);
  const login = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    try {
      const response = await fetch(apiUrl('/api/admin/login'), { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(credentials) });
      if (!response.ok) throw new Error((await response.json().catch(() => ({}))).message ?? 'Could not sign in.');
      await loadSummary();
      return;
    } catch {
      if (credentials.username === DEMO_ADMIN_USERNAME && credentials.password === DEMO_ADMIN_PASSWORD) {
        window.localStorage.setItem(DEMO_STORAGE_KEYS.adminSession, 'active');
        setSummary(getDemoSummary());
        setAuthenticated(true);
        return;
      }
      setError('Could not sign in.');
    }
  };
  if (!authenticated || !summary) return <main className="mx-auto flex min-h-screen max-w-md items-center px-5 py-16"><form onSubmit={login} className="w-full border border-foreground/15 bg-card p-7 shadow-[var(--shadow-card)]"><p className="font-mono-brand text-[10px] uppercase tracking-[.2em] text-primary">Sardaar JI Dhaba</p><h1 className="mt-4 font-display text-4xl">Admin sign in</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">Lead and analytics access for the restaurant team.</p><label className="mt-8 block text-sm font-bold">Username<input value={credentials.username} onChange={event => setCredentials({ ...credentials, username: event.target.value })} className="mt-2 w-full border-b border-foreground/25 bg-transparent px-0 py-3 outline-none" autoComplete="username" required /></label><label className="mt-5 block text-sm font-bold">Password<input type="password" value={credentials.password} onChange={event => setCredentials({ ...credentials, password: event.target.value })} className="mt-2 w-full border-b border-foreground/25 bg-transparent px-0 py-3 outline-none" autoComplete="current-password" required /></label>{error && <p className="mt-5 text-sm text-destructive" role="alert">{error}</p>}<button type="submit" className="mt-7 w-full rounded-full bg-primary px-5 py-3 font-bold text-primary-foreground">Sign in</button></form></main>;
  return <main className="min-h-screen bg-muted/50 px-5 py-10 lg:px-8"><div className="mx-auto max-w-7xl"><div className="flex flex-wrap items-end justify-between gap-5"><div><p className="font-mono-brand text-[10px] uppercase tracking-[.2em] text-primary">Private dashboard</p><h1 className="mt-3 font-display text-5xl">Good morning, Sardaar Ji.</h1></div><button type="button" onClick={async () => { try { await fetch(apiUrl('/api/admin/logout'), { method: 'POST', credentials: 'include' }); } catch { /* fallback demo logout */ } window.localStorage.removeItem(DEMO_STORAGE_KEYS.adminSession); setAuthenticated(false); setSummary(null); }} className="rounded-full border border-foreground/20 px-5 py-2.5 text-sm font-bold">Sign out</button></div><div className="mt-10 grid gap-4 sm:grid-cols-2"><div className="bg-secondary p-6 text-secondary-foreground"><p className="font-mono-brand text-[10px] uppercase tracking-[.2em] text-accent">Leads</p><p className="mt-5 font-display text-6xl">{summary.inquiries}</p></div><div className="bg-primary p-6 text-primary-foreground"><p className="font-mono-brand text-[10px] uppercase tracking-[.2em] text-accent">Tracked events</p><p className="mt-5 font-display text-6xl">{summary.events}</p></div></div><section className="mt-10 grid gap-8 lg:grid-cols-[.7fr_1.3fr]"><div className="border border-foreground/10 bg-card p-6"><h2 className="font-display text-3xl">Conversion activity</h2><div className="mt-6 space-y-4">{summary.eventCounts.map(event => <div key={event._id} className="flex items-center justify-between border-b border-foreground/10 pb-3 text-sm"><span>{event._id.replaceAll('_', ' ')}</span><strong>{event.count}</strong></div>)}</div></div><div className="border border-foreground/10 bg-card p-6"><h2 className="font-display text-3xl">Recent leads</h2><div className="mt-6 space-y-5">{summary.recentInquiries.length === 0 ? <p className="text-sm text-muted-foreground">No enquiries yet.</p> : summary.recentInquiries.map((lead, index) => <article key={`${lead.email}-${index}`} className="border-b border-foreground/10 pb-5"><div className="flex flex-wrap justify-between gap-2"><h3 className="font-bold">{lead.name}</h3><span className="font-mono-brand text-[10px] uppercase text-primary">{lead.kind}</span></div><p className="mt-1 text-sm text-muted-foreground">{lead.email}{lead.phone ? ` · ${lead.phone}` : ''}{lead.city ? ` · ${lead.city}` : ''}</p><p className="mt-3 text-sm leading-6">{lead.message}</p></article>)}</div></div></section></div></main>;
}

function Router() {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}><Switch><Route path="/" component={Home} /><Route path="/admin" component={Admin} /><Route path="/about" component={About} /><Route path="/success-story" component={SuccessStory} /><Route path="/menu" component={MenuPage} /><Route path="/gallery" component={Gallery} /><Route path="/locations" component={Locations} /><Route path="/locations/:city" component={LocationDetail} /><Route path="/franchise" component={Franchise} /><Route path="/franchise/apply" component={Application} /><Route path="/blog" component={Blog} /><Route path="/blog/:slug" component={BlogArticle} /><Route path="/contact" component={Contact} /><Route path="/privacy-policy"><Legal /></Route><Route path="/terms-and-conditions"><Legal terms /></Route><Route component={NotFound} /></Switch></ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;
