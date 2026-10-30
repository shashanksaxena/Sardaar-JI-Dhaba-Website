import { type FormEvent, type ReactNode, useEffect, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ArrowRight, ArrowUpRight, ChevronLeft, Clock3, Instagram, Linkedin, MapPin, Menu as MenuIcon, MessageCircle, Phone, Search, Utensils, X } from 'lucide-react';
import { Link, Route, Switch, useLocation, useParams, Router as WouterRouter } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { brand, locations, menu, menuBoards, stories, values, type MenuItem } from '@/data/content';
import { getSeoMetadata } from '@/data/seo';
import { getFaqItems, type FaqItem } from '@/data/faqs';
import { business } from '@/config/business';
import { SeoSchema } from '@/components/SeoSchema';
import { SemanticMenu } from '@/components/SemanticMenu';
import NoidaPage from '@/pages/noida';
import PrayagrajPage from '@/pages/prayagraj';

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

async function trackEvent(name: string) {
  if (window.localStorage.getItem('sardaar_cookie_consent') !== 'accepted') return;
  try {
    await fetch(apiUrl('/api/analytics/events'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, path: window.location.pathname }),
      keepalive: true,
    });
  } catch {
    // Analytics must never block a customer action or persist identifiers locally.
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

function Meta({ title, description = 'Sardaar Ji Dhaba serves Punjabi and North Indian food in Noida and Prayagraj.', image = '/images/og/home-1200x630.jpg', type = 'website' }: { title: string; description?: string; image?: string; type?: string }) {
  const [location] = useLocation();
  const seo = getSeoMetadata(location);
  useEffect(() => {
    const canonical = `${brand.siteUrl}${location === '/' ? '/' : location}`;
    const pageTitle = seo?.title ?? title;
    const pageDescription = seo?.description ?? description;
    const pageImage = seo?.image ?? image;
    const pageType = seo?.type ?? type;
    const absoluteImage = pageImage.startsWith('http') ? pageImage : `${brand.siteUrl}${pageImage}`;

    document.title = pageTitle;
    setMeta('description', pageDescription);
    setMeta('og:type', pageType, 'property');
    setMeta('og:title', pageTitle, 'property');
    setMeta('og:description', pageDescription, 'property');
    setMeta('og:url', canonical, 'property');
    setMeta('og:image', absoluteImage, 'property');
    setMeta('twitter:title', pageTitle);
    setMeta('twitter:description', pageDescription);
    setMeta('twitter:image', absoluteImage);

    let canonicalLink = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonical;
  }, [description, image, location, seo, title, type]);
  return null;
}

function Header() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const allNav = [
    ['/about', 'Our story'],
    ['/menu', 'Menu'],
    ['/noida', 'Noida'],
    ['/prayagraj', 'Prayagraj'],
    ['/locations', 'Find us'],
    ['/success-story', 'Success story'],
    ['/blog', 'Blog'],
    ['/restaurant-consulting', 'Restaurant consulting'],
    ['/franchise', 'Franchise opportunity'],
  ];
  const nav = location === '/'
    ? allNav.filter(([href]) => ['/about', '/success-story', '/locations'].includes(href))
    : allNav;
  const isActive = (href: string) => location === href || (href === '/locations' && location.startsWith('/locations/'));
  return (
    <header className="sticky top-0 z-40 border-b border-foreground/10 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link href="/" className="group flex items-center gap-3" data-testid="link-home-logo">
          <img src={brand.logo} alt="Sardaar Ji Dhaba logo" width="44" height="44" loading="eager" className="h-11 w-11 rounded-full object-cover mix-blend-multiply transition-transform group-hover:rotate-[-8deg]" />
          <span className="leading-none">
            <span className="block font-display text-xl font-semibold tracking-[-.04em]">Sardaar Ji</span>
            <span className="font-mono-brand text-[9px] uppercase tracking-[.22em] text-muted-foreground">Dhaba · since {business.established}</span>
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
          {location === '/' ? <Link href="/franchise/apply" onClick={() => trackEvent('franchise_cta_click')} className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5" data-testid="link-franchise-header">Apply for franchise <ArrowRight className="ml-1 inline" size={14} /></Link> : <a href={`tel:${brand.phoneLink}`} onClick={() => trackEvent('phone_click')} className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5" data-testid="link-call-header">Call the dhaba</a>}
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
            {location === '/' ? <Link href="/franchise/apply" onClick={() => { setOpen(false); trackEvent('franchise_cta_click'); }} className="mt-4 flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-center font-bold text-primary-foreground" data-testid="link-franchise-mobile-header">Apply for franchise <ArrowRight size={16} /></Link> : <a href={`tel:${brand.phoneLink}`} className="mt-4 flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-center font-bold text-primary-foreground" data-testid="link-call-mobile"><Phone size={16} /> Call the dhaba</a>}
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
          <div className="mb-5 flex items-center gap-3"><img src={brand.logo} alt="Sardaar Ji Dhaba logo" width="44" height="44" loading="lazy" decoding="async" className="h-11 w-11 rounded-full object-cover" /><span className="font-display text-2xl">Sardaar Ji Dhaba</span></div>
          <p className="max-w-xs text-sm leading-6 text-secondary-foreground/70">A generous roadside table, serving the flavours we grew up with in Noida and Prayagraj.</p>
          <div className="mt-6 flex gap-3"><a href={brand.whatsapp} target="_blank" rel="noreferrer" className="grid h-9 w-9 place-items-center rounded-full border border-secondary-foreground/20 hover:bg-secondary-foreground/10" aria-label="WhatsApp" data-testid="link-whatsapp-footer"><MessageCircle size={15} /></a><a href={brand.instagramUrl} target="_blank" rel="noreferrer" className="grid h-9 w-9 place-items-center rounded-full border border-secondary-foreground/20 hover:bg-secondary-foreground/10" aria-label="Instagram" data-testid="link-instagram-footer"><Instagram size={15} /></a></div>
        </div>
        <div><p className="mb-4 font-mono-brand text-[10px] uppercase tracking-[.2em] text-accent">Explore</p><div className="flex flex-col gap-3 text-sm text-secondary-foreground/75"><Link href="/about" className="hover:text-accent" data-testid="link-footer-about">Our story</Link><Link href="/menu" className="hover:text-accent" data-testid="link-footer-menu">The menu</Link><Link href="/gallery" className="hover:text-accent" data-testid="link-footer-gallery">Gallery</Link><Link href="/blog" className="hover:text-accent" data-testid="link-footer-blog">Blog</Link><Link href="/success-story" className="hover:text-accent" data-testid="link-footer-success">Success story</Link><Link href="/restaurant-consulting" className="hover:text-accent" data-testid="link-footer-consulting">Restaurant consulting · RestroGrowth</Link></div></div>
        <div><p className="mb-4 font-mono-brand text-[10px] uppercase tracking-[.2em] text-accent">Come by</p><div className="flex flex-col gap-3 text-sm text-secondary-foreground/75"><Link href="/locations/noida" className="hover:text-accent" data-testid="link-footer-noida">Noida stop</Link><Link href="/locations/prayagraj" className="hover:text-accent" data-testid="link-footer-prayagraj">Prayagraj stop</Link><Link href="/contact" className="hover:text-accent" data-testid="link-footer-contact">Contact us</Link><Link href="/franchise" className="hover:text-accent" data-testid="link-footer-franchise">Franchise</Link></div></div>
        <div><p className="mb-4 font-mono-brand text-[10px] uppercase tracking-[.2em] text-accent">Say hello</p><div className="flex flex-col gap-3 text-sm text-secondary-foreground/75"><a href={`tel:${brand.phoneLink}`} className="hover:text-accent" data-testid="link-footer-phone">{brand.phone}</a><a href={`mailto:${brand.email}`} className="break-all hover:text-accent" data-testid="link-footer-email">{brand.email}</a><a href={brand.instagramUrl} target="_blank" rel="noreferrer" className="hover:text-accent">{brand.instagram}</a>{brand.googleBusinessUrl && <a href={brand.googleBusinessUrl} target="_blank" rel="noreferrer" className="hover:text-accent">Google reviews</a>}</div></div>
      </div>
      {business.outlets.some(outlet => outlet.fssaiLicenseNumber) && <div className="border-t border-secondary-foreground/15"><div className="mx-auto flex max-w-7xl flex-wrap gap-x-8 gap-y-3 px-5 py-5 text-xs text-secondary-foreground/70 lg:px-8">{business.outlets.filter(outlet => outlet.fssaiLicenseNumber).map(outlet => <div key={outlet.id}><span className="font-semibold">{outlet.city} FSSAI Licence/Registration No.:</span> {outlet.fssaiLicenseNumber} {outlet.foodSafetyConnectQrUrl && <a className="ml-2 underline underline-offset-2" href={outlet.foodSafetyConnectQrUrl} target="_blank" rel="noreferrer">Food Safety Connect QR</a>}</div>)}</div></div>}
      <div className="border-t border-secondary-foreground/15"><div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-5 text-xs text-secondary-foreground/55 sm:flex-row sm:items-center sm:justify-between lg:px-8"><span>© 2024 Sardaar Ji Dhaba. Made for hungry people.</span><div className="flex gap-5"><Link href="/privacy-policy" className="hover:text-accent" data-testid="link-privacy-footer">Privacy</Link><Link href="/terms-and-conditions" className="hover:text-accent" data-testid="link-terms-footer">Terms</Link><button type="button" onClick={() => window.dispatchEvent(new Event('open-cookie-preferences'))} className="text-left hover:text-accent">Cookie preferences</button></div></div></div>
    </footer>
  );
}

function Shell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const faqItems = getFaqItems(location);
  return <><Header /><main>{children}{faqItems.length > 0 && <FaqSection items={faqItems} />}</main><SeoSchema route={location} /><Footer /><MobileActionBar /></>;

}

function FaqSection({ items }: { items: FaqItem[] }) {
  return <section className="mx-auto max-w-4xl px-5 pb-20 pt-8 lg:px-8 lg:pb-28"><h2 className="font-display text-4xl tracking-[-.04em]">Frequently asked questions</h2><dl className="mt-8 divide-y divide-foreground/15 border-y border-foreground/15">{items.map(item => <div key={item.question} className="py-5"><dt className="font-semibold">{item.question}</dt><dd className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{item.answer}</dd></div>)}</dl></section>;
}

function MobileActionBar() {
  const [location] = useLocation();
  if (location === '/') {
    return <nav className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 border-t border-foreground/15 bg-background/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_hsl(var(--foreground)/.12)] backdrop-blur-md md:hidden" aria-label="Franchise enquiry actions">
      <Link href="/franchise/apply" onClick={() => trackEvent('franchise_cta_click')} className="flex min-h-14 items-center justify-center gap-2 bg-primary px-2 text-xs font-bold text-primary-foreground" data-testid="link-mobile-franchise-apply"><ArrowRight size={17} /> Apply for franchise</Link>
      <a href={brand.whatsapp} onClick={() => trackEvent('whatsapp_click')} target="_blank" rel="noreferrer" className="flex min-h-14 items-center justify-center gap-2 text-xs font-bold text-foreground" data-testid="link-mobile-franchise-whatsapp"><MessageCircle size={17} /> WhatsApp us</a>
    </nav>;
  }
  return <nav className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-4 border-t border-foreground/15 bg-background/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_hsl(var(--foreground)/.12)] backdrop-blur-md md:hidden" aria-label="Quick actions">
    <Link href="/menu" onClick={() => trackEvent('menu_click')} className="flex min-h-14 flex-col items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wide text-foreground" data-testid="link-mobile-menu"><Utensils size={17} />Menu</Link>
    <a href={`tel:${brand.phoneLink}`} onClick={() => trackEvent('phone_click')} className="flex min-h-14 flex-col items-center justify-center gap-1 bg-primary text-[10px] font-bold uppercase tracking-wide text-primary-foreground" data-testid="link-mobile-call"><Phone size={17} />Call</a>
    <Link href="/prayagraj" onClick={() => trackEvent('directions_click')} className="flex min-h-14 flex-col items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wide text-foreground" data-testid="link-mobile-directions"><MapPin size={17} />Directions</Link>
    <a href={brand.whatsapp} onClick={() => trackEvent('whatsapp_click')} target="_blank" rel="noreferrer" className="flex min-h-14 flex-col items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wide text-foreground" data-testid="link-mobile-whatsapp"><MessageCircle size={17} />WhatsApp</a>
  </nav>;
}

function PlaceholderArt({ label, className = '' }: { label: string; className?: string }) {
  return <div className={`relative isolate flex min-h-[180px] items-end overflow-hidden bg-secondary p-5 text-secondary-foreground ${className}`} aria-label={`${label} image placeholder`} data-testid={`placeholder-${label.toLowerCase().replaceAll(' ', '-')}`}><div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, hsl(var(--accent)) 0 1px, transparent 1px)', backgroundSize: '18px 18px' }} /><div className="absolute -right-7 -top-10 h-36 w-36 rounded-full border-[16px] border-accent/30" /><span className="relative font-mono-brand text-[10px] uppercase tracking-[.18em] text-accent">Photo placeholder · {label}</span></div>;
}

function PhotoArt({ src, alt, label, className = '', priority = false }: { src: string; alt: string; label: string; className?: string; priority?: boolean }) {
  return <div className={`relative isolate min-h-[180px] overflow-hidden bg-secondary ${className}`} aria-label={alt} data-testid={`image-${label.toLowerCase().replaceAll(' ', '-')}`}><picture className="absolute inset-0"><source srcSet={src.replace(/\.(?:jpe?g|png)$/i, '.webp')} type="image/webp" /><img src={src} alt={alt} width="1200" height="800" loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} decoding="async" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105" /></picture><div className="absolute inset-0 bg-gradient-to-t from-secondary/75 via-transparent to-transparent" /><span className="absolute bottom-4 left-4 font-mono-brand text-[10px] uppercase tracking-[.18em] text-background">{label}</span></div>;
}

function PageIntro({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return <section className="mx-auto max-w-7xl px-5 pb-14 pt-16 lg:px-8 lg:pb-20 lg:pt-24"><div className="max-w-3xl fade-up"><p className="mb-5 font-mono-brand text-[10px] uppercase tracking-[.24em] text-primary">{eyebrow}</p><h1 className="text-balance font-display text-5xl leading-[.96] tracking-[-.06em] md:text-7xl">{title}</h1><p className="mt-7 max-w-xl text-base leading-7 text-muted-foreground md:text-lg">{copy}</p></div></section>;
}

function FranchiseLeadForm() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());
    setSending(true);
    setError('');
    const message = `Homepage franchise enquiry. Preferred investment range: ${values.investmentRange}. Restaurant / hospitality experience: ${values.experience || 'Not specified'}.`;
    try {
      const response = await fetch(apiUrl('/api/inquiries'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, message, kind: 'franchise', source: 'homepage-franchise-form', consent: true }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message ?? 'We could not save your enquiry. Please try again or contact us directly.');
      await trackEvent('franchise_form_submission');
      setSent(true);
      form.reset();
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'We could not save your enquiry. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (sent) return <div className="flex min-h-[390px] flex-col justify-center">
    <span className="grid h-12 w-12 place-items-center rounded-full bg-accent font-bold text-secondary">✓</span>
    <h2 className="mt-7 font-display text-3xl">Your franchise enquiry is with us.</h2>
    <p className="mt-4 text-sm leading-7 text-muted-foreground">Thank you for sharing your details. Our team will review your interest and contact you to discuss the next step.</p>
    <p className="mt-5 text-xs text-muted-foreground">Prefer to speak now? <a href={`tel:${brand.phoneLink}`} className="font-bold text-primary underline">{brand.phone}</a></p>
  </div>;

  return <div className="bg-background p-6 text-foreground shadow-2xl md:p-8">
    <p className="font-mono-brand text-[10px] uppercase tracking-[.2em] text-primary">Start a conversation</p>
    <h2 className="mt-3 font-display text-3xl leading-tight tracking-[-.04em]">Explore a franchise partnership.</h2>
    <p className="mt-3 text-sm leading-6 text-muted-foreground">Share a few details. We’ll take it from there.</p>
    <form onSubmit={submit} className="mt-6 space-y-4"><input name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <label className="block text-xs font-bold">Your name<input name="name" required minLength={2} maxLength={100} autoComplete="name" className="mt-2 w-full border-b border-foreground/20 bg-transparent px-0 py-3 text-sm outline-none focus:border-primary" placeholder="Full name" /></label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-xs font-bold">Phone number<input name="phone" required type="tel" minLength={7} maxLength={20} autoComplete="tel" className="mt-2 w-full border-b border-foreground/20 bg-transparent px-0 py-3 text-sm outline-none focus:border-primary" placeholder="+91 ..." /></label>
        <label className="block text-xs font-bold">Email address<input name="email" required type="email" maxLength={160} autoComplete="email" className="mt-2 w-full border-b border-foreground/20 bg-transparent px-0 py-3 text-sm outline-none focus:border-primary" placeholder="you@example.com" /></label>
      </div>
      <label className="block text-xs font-bold">City where you want to open<input name="city" required minLength={2} maxLength={100} autoComplete="address-level2" className="mt-2 w-full border-b border-foreground/20 bg-transparent px-0 py-3 text-sm outline-none focus:border-primary" placeholder="Your preferred city" /></label>
      <label className="block text-xs font-bold">Approximate investment budget
        <span className="mt-1 block text-[10px] font-normal text-muted-foreground">Indicative budget only — not an official franchise fee or project cost.</span><select name="investmentRange" required defaultValue="" className="mt-2 w-full border-b border-foreground/20 bg-transparent px-0 py-3 text-sm outline-none focus:border-primary">
          <option value="" disabled>Select your budget range</option>
          <option>Below ₹10 lakh</option><option>₹10–20 lakh</option><option>₹20–35 lakh</option><option>₹35–50 lakh</option><option>₹50 lakh+</option><option>Need guidance before deciding</option>
        </select>
      </label>
      <label className="flex items-start gap-2 text-[11px] leading-5 text-muted-foreground"><input type="checkbox" required className="mt-1" /><span>I agree that Sardaar Ji Dhaba may use the details I submit to respond to this franchise enquiry. Read our <Link href="/privacy-policy" className="text-primary underline">privacy policy</Link>.</span></label>
      <button type="submit" disabled={sending} className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-60" data-testid="button-home-franchise-submit">{sending ? 'Sending enquiry...' : 'Request franchise details'} <ArrowRight size={16} /></button>
      {error && <p role="alert" className="text-xs text-destructive">{error}</p>}
      <p className="text-center text-[10px] leading-4 text-muted-foreground">Submitting this form is an enquiry, not a franchise offer or approval.</p>
    </form>
  </div>;
}

function Home() {
  const franchiseReasons = [
    ['A recognisable food identity', 'A Punjabi and North Indian dhaba concept with a clear menu personality and familiar comfort-food appeal.'],
    ['An operating brand story', `Sardaar Ji Dhaba has been building its restaurant story since ${business.established}, with a presence in Noida and Prayagraj.`],
    ['A conversation before commitment', 'Start by discussing your city, business goals, site readiness and the practical questions that matter to you.'],
  ];
  const steps = [
    ['01', 'Share your interest', 'Tell us who you are, where you want to open and the investment range you are considering.'],
    ['02', 'Have an initial conversation', 'We’ll understand your goals, answer what we can and learn more about your market and plans.'],
    ['03', 'Explore the fit', 'If there is a mutual fit, we can discuss the concept, requirements and possible next steps in more detail.'],
  ];
  return (
    <Shell>
      <Meta
        title="Sardaar Ji Dhaba Franchise | Explore Franchise Opportunities in India"
        description="Explore a Sardaar Ji Dhaba franchise partnership. Bring a Punjabi and North Indian dhaba concept to your city. Share your details to start a franchise enquiry."
        image="/images/og/franchise-1200x630.jpg"
      />
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute -right-24 -top-28 h-[430px] w-[430px] rounded-full border border-accent/25" />
        <div className="absolute -right-10 -top-14 h-[300px] w-[300px] rounded-full border border-accent/20" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-14 lg:grid-cols-[1.05fr_.8fr] lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <p className="font-mono-brand text-[10px] uppercase tracking-[.27em] text-accent">Franchise enquiries · India</p>
            <h1 className="mt-7 font-display text-[clamp(3.5rem,7vw,6.8rem)] leading-[.88] tracking-[-.08em]">Bring a little<br /><span className="text-accent">dhaba</span> to your city.</h1>
            <p className="mt-7 max-w-xl font-display text-2xl leading-tight md:text-3xl">A familiar Punjabi table. A new chapter with you.</p>
            <p className="mt-5 max-w-lg text-sm leading-7 text-primary-foreground/75 md:text-base">Explore a franchise partnership with Sardaar Ji Dhaba — a Punjabi and North Indian restaurant brand with an operating story dating back to {business.established}.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#franchise-enquiry" onClick={() => trackEvent('franchise_cta_click')} className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-bold text-accent-foreground transition-transform hover:-translate-y-1" data-testid="link-home-hero-franchise">Start your franchise enquiry <ArrowRight size={16} /></a>
              <Link href="/success-story" className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/35 px-6 py-3.5 text-sm font-bold text-primary-foreground hover:bg-primary-foreground/10" data-testid="link-home-hero-story">Our story <ArrowUpRight size={16} /></Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 border-t border-primary-foreground/20 pt-5 font-mono-brand text-[10px] uppercase tracking-[.15em] text-primary-foreground/70">
              <span>Established {business.established}</span><span>Noida · Prayagraj</span><span>Punjabi · North Indian</span>
            </div>
          </div>
          <div id="franchise-enquiry" className="scroll-mt-28">
            <FranchiseLeadForm />
          </div>
        </div>
      </section>

      <section className="border-b border-foreground/10 bg-background">
        <div className="mx-auto grid max-w-7xl grid-cols-3 gap-4 px-5 py-7 lg:px-8">
          {[['Since', String(business.established)], ['Cities', 'Noida + Prayagraj'], ['Cuisine', 'Punjabi & North Indian']].map(([label, value]) => <div key={label} className="border-l-2 border-accent pl-3 sm:pl-5"><p className="font-mono-brand text-[9px] uppercase tracking-[.16em] text-muted-foreground">{label}</p><p className="mt-2 font-display text-sm leading-tight sm:text-xl">{value}</p></div>)}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-[.9fr_1.1fr] lg:px-8 lg:py-28">
        <div>
          <p className="font-mono-brand text-[10px] uppercase tracking-[.24em] text-primary">A brand built around the table</p>
          <h2 className="mt-5 max-w-xl font-display text-4xl leading-[.98] tracking-[-.06em] md:text-6xl">Good food brings people in. A good experience brings them back.</h2>
          <p className="mt-7 max-w-lg text-sm leading-7 text-muted-foreground md:text-base">Sardaar Ji Dhaba brings together the warmth of a Punjabi dhaba, a recognisable North Indian menu and a guest-first approach. We’re inviting thoughtful entrepreneurs to start a conversation about bringing that experience to their city.</p>
          <Link href="/franchise/apply" onClick={() => trackEvent('franchise_cta_click')} className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground" data-testid="link-home-story-franchise">I’m interested in a franchise <ArrowRight size={16} /></Link>
        </div>
        <PhotoArt src="/images/restaurant/dining-room.jpg" alt="Sardaar Ji Dhaba dining room and guest experience" label="the Sardaar Ji table" className="min-h-[360px] md:min-h-[500px]" priority />
      </section>

      <section className="bg-muted/70">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="font-mono-brand text-[10px] uppercase tracking-[.24em] text-primary">Why explore Sardaar Ji Dhaba</p>
            <h2 className="mt-5 font-display text-4xl leading-tight tracking-[-.05em] md:text-5xl">A clear food identity. A real restaurant story. A conversation about your city.</h2>
          </div>
          <div className="mt-12 grid gap-7 md:grid-cols-3">
            {franchiseReasons.map(([title, copy], index) => <article key={title} className="border-t-2 border-secondary bg-background p-6">
              <span className="font-mono-brand text-xs text-primary">0{index + 1}</span>
              <h3 className="mt-8 font-display text-2xl leading-tight">{title}</h3>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">{copy}</p>
            </article>)}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:py-28">
        <PhotoArt src="/images/restaurant/celebration-room.jpg" alt="Sardaar Ji Dhaba restaurant space ready for guests" label="a place to gather" className="min-h-[360px] md:min-h-[470px]" />
        <div>
          <p className="font-mono-brand text-[10px] uppercase tracking-[.24em] text-primary">From first conversation to next step</p>
          <h2 className="mt-5 font-display text-4xl leading-tight tracking-[-.05em] md:text-5xl">A thoughtful process, without pressure.</h2>
          <div className="mt-9 space-y-7">
            {steps.map(([number, title, copy]) => <div key={number} className="flex gap-5 border-t border-foreground/15 pt-5">
              <span className="font-mono-brand text-xs text-primary">{number}</span>
              <div><h3 className="font-display text-2xl">{title}</h3><p className="mt-2 max-w-lg text-sm leading-7 text-muted-foreground">{copy}</p></div>
            </div>)}
          </div>
          <Link href="/franchise/apply" onClick={() => trackEvent('franchise_cta_click')} className="mt-9 inline-flex items-center gap-2 font-bold text-primary underline decoration-accent decoration-2 underline-offset-4" data-testid="link-home-process-apply">Take the first step <ArrowRight size={16} /></Link>
        </div>
      </section>

      <section className="bg-secondary text-secondary-foreground">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-[.8fr_1.2fr] lg:px-8 lg:py-24">
          <div>
            <p className="font-mono-brand text-[10px] uppercase tracking-[.24em] text-accent">Who should get in touch?</p>
            <h2 className="mt-5 font-display text-4xl leading-tight tracking-[-.05em] md:text-5xl">For people who care about building a good local business.</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {['Entrepreneurs exploring the food business', 'Restaurant operators considering another concept', 'People with a city or location in mind', 'Hands-on partners who value consistency and hospitality'].map((item, index) => <div key={item} className="border-t border-secondary-foreground/25 pt-4"><span className="font-mono-brand text-xs text-accent">0{index + 1}</span><p className="mt-6 font-display text-xl leading-snug">{item}</p></div>)}
          </div>
        </div>
      </section>

      <section className="bg-accent text-accent-foreground">
        <div className="mx-auto flex max-w-7xl flex-col gap-7 px-5 py-16 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-20">
          <div>
            <p className="font-mono-brand text-[10px] uppercase tracking-[.24em] text-accent-foreground/65">Your city could be next</p>
            <h2 className="mt-4 max-w-3xl font-display text-4xl leading-tight tracking-[-.05em] md:text-5xl">Let’s see if a Sardaar Ji Dhaba partnership is right for you.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-accent-foreground/75">Start with a short enquiry. We’ll take the conversation from there.</p>
          </div>
          <Link href="/franchise/apply" onClick={() => trackEvent('franchise_cta_click')} className="inline-flex w-fit items-center gap-2 rounded-full bg-secondary px-6 py-3.5 text-sm font-bold text-secondary-foreground" data-testid="link-home-bottom-apply">Apply for franchise <ArrowRight size={16} /></Link>
        </div>
      </section>
    </Shell>
  );
}

function RestaurantConsulting() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setSending(true);
    setError('');
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    try {
      const response = await fetch(apiUrl('/api/inquiries'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, kind: 'consulting', source: 'restaurant-consulting-page', consent: formData.get('consent') === 'on' }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message ?? 'Your enquiry could not be submitted. Please try again or contact us directly.');
      await trackEvent('consulting_lead_submission');
      setSent(true);
      form.reset();
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Your enquiry could not be submitted. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const services = [
    { title: 'Restaurant operations & SOPs', copy: 'Practical checklists, service workflows, kitchen coordination and day-to-day operating discipline.' },
    { title: 'Food cost & profitability', copy: 'Menu costing, portion controls, wastage reviews and a clearer view of outlet-level margins.' },
    { title: 'Marketing & customer growth', copy: 'Local visibility, offers, repeat-customer ideas, delivery-platform presence and lead capture.' },
    { title: 'Technology & automation', copy: 'POS workflows, billing, reporting and simple automations that reduce manual work.' },
    { title: 'Launch & expansion planning', copy: 'Pre-opening priorities, vendor and process planning, and practical readiness reviews.' },
    { title: 'Business performance reviews', copy: 'A structured look at sales, costs, operations and the next actions worth prioritising.' },
  ];

  return <Shell>
    <Meta title="RestroGrowth | Restaurant Consulting in India" description="Practical restaurant consulting for small and medium restaurants in India. Improve operations, food costs, marketing and technology with RestroGrowth by Sardaar Ji Dhaba." />
    <section className="overflow-hidden bg-secondary text-secondary-foreground">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[1.15fr_.85fr] lg:items-center lg:px-8 lg:py-28">
        <div>
          <p className="font-mono-brand text-[10px] uppercase tracking-[.24em] text-accent">Restaurant consulting · A Sardaar Ji Dhaba initiative</p>
          <h1 className="mt-7 max-w-3xl font-display text-6xl leading-[.9] tracking-[-.07em] md:text-8xl">Restro<span className="text-accent">Growth.</span></h1>
          <p className="mt-7 max-w-2xl font-display text-3xl leading-tight tracking-[-.04em] md:text-4xl">Better systems. Healthier margins. Stronger restaurants.</p>
          <p className="mt-6 max-w-xl text-base leading-7 text-secondary-foreground/75">Practical, operator-minded support for small and medium restaurants. Start remotely; bring us on-site when your business needs hands-on attention.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#consulting-enquiry" onClick={() => trackEvent('consulting_form_cta_click')} className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-bold text-accent-foreground" data-testid="link-consulting-hero-cta">Book a discovery call <ArrowRight size={16} /></a>
            <a href={brand.whatsapp} onClick={() => trackEvent('whatsapp_click')} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-secondary-foreground/30 px-6 py-3.5 text-sm font-bold text-secondary-foreground" data-testid="link-consulting-whatsapp"><MessageCircle size={16} /> WhatsApp us</a>
          </div>
          <p className="mt-6 font-mono-brand text-[10px] uppercase tracking-[.18em] text-secondary-foreground/55">Remote-first · On-site when required · India</p>
        </div>
        <div className="border border-secondary-foreground/20 bg-secondary-foreground/[.04] p-7 md:p-9">
          <p className="font-mono-brand text-[10px] uppercase tracking-[.2em] text-accent">Who we work with</p>
          <h2 className="mt-5 font-display text-3xl leading-tight">Independent restaurants ready to get more organised.</h2>
          <ul className="mt-7 space-y-4 text-sm leading-6 text-secondary-foreground/75">
            <li className="flex gap-3"><span className="text-accent">01</span><span>Single-outlet restaurants looking for tighter daily controls</span></li>
            <li className="flex gap-3"><span className="text-accent">02</span><span>Growing operators preparing for a second outlet</span></li>
            <li className="flex gap-3"><span className="text-accent">03</span><span>Owners who want clearer numbers and practical next steps</span></li>
          </ul>
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
      <div className="max-w-3xl">
        <p className="font-mono-brand text-[10px] uppercase tracking-[.24em] text-primary">What we can help with</p>
        <h2 className="mt-5 font-display text-4xl tracking-[-.05em] md:text-6xl">Good food needs good systems behind it.</h2>
        <p className="mt-6 text-base leading-7 text-muted-foreground">We focus on the business behind the plate: the processes, costs, customer experience and tools that help a restaurant operate with more confidence.</p>
      </div>
      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => <article key={service.title} className="border-t-2 border-secondary bg-muted/40 p-6">
          <span className="font-mono-brand text-xs text-primary">0{index + 1}</span>
          <h3 className="mt-7 font-display text-2xl leading-tight">{service.title}</h3>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">{service.copy}</p>
        </article>)}
      </div>
    </section>

    <section className="bg-muted/70">
      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
        <p className="font-mono-brand text-[10px] uppercase tracking-[.24em] text-primary">A clear, useful process</p>
        <h2 className="mt-4 max-w-3xl font-display text-4xl tracking-[-.05em] md:text-5xl">Start with the problem. Leave with a plan.</h2>
        <div className="mt-12 grid gap-8 md:grid-cols-4">
          {[
            ['01', 'Discovery', 'A focused conversation about your restaurant, goals and current challenges.'],
            ['02', 'Business review', 'We review the information relevant to the problem you want to solve.'],
            ['03', 'Action roadmap', 'You get prioritised recommendations and clear next steps.'],
            ['04', 'Implementation support', 'Remote follow-through, with an on-site visit when the work calls for it.'],
          ].map(([number, title, copy]) => <div key={number} className="border-t border-foreground/20 pt-5">
            <span className="font-mono-brand text-xs text-primary">{number}</span>
            <h3 className="mt-6 font-display text-2xl">{title}</h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{copy}</p>
          </div>)}
        </div>
      </div>
    </section>

    <section className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[.8fr_1.2fr] lg:px-8 lg:py-24" id="consulting-enquiry">
      <div>
        <p className="font-mono-brand text-[10px] uppercase tracking-[.24em] text-primary">Let's talk about your restaurant</p>
        <h2 className="mt-5 font-display text-4xl leading-tight tracking-[-.05em] md:text-5xl">Tell us where you want to grow.</h2>
        <p className="mt-6 max-w-md text-sm leading-7 text-muted-foreground">Share a few details. The RestroGrowth team can use them to understand your restaurant and prepare for an initial conversation. No payment is required to send an enquiry.</p>
        <div className="mt-9 space-y-4 border-t border-foreground/15 pt-6 text-sm">
          <a href={`tel:${brand.phoneLink}`} className="flex items-center gap-3 font-semibold"><Phone size={17} className="text-primary" />{brand.phone}</a>
          <a href={`mailto:${brand.email}`} className="flex items-center gap-3 font-semibold break-all"><ArrowUpRight size={17} className="text-primary" />{brand.email}</a>
        </div>
      </div>
      <div className="bg-muted/60 p-6 md:p-10">
        {sent ? <div className="flex min-h-[420px] flex-col justify-center">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-accent font-bold text-secondary">✓</span>
          <h3 className="mt-7 font-display text-3xl">Thanks. Your enquiry is in.</h3>
          <p className="mt-4 max-w-lg text-sm leading-7 text-muted-foreground">We have received your details. The team will review your requirements and get in touch using the contact information you provided.</p>
          <button type="button" onClick={() => setSent(false)} className="mt-7 w-fit font-bold text-primary underline">Send another enquiry</button>
        </div> : <form onSubmit={submit} className="space-y-5"><input name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-semibold">Your name<input name="name" required minLength={2} maxLength={100} autoComplete="name" className="mt-2 w-full border-b border-foreground/25 bg-transparent px-0 py-3 outline-none focus:border-primary" placeholder="Full name" /></label>
            <label className="block text-sm font-semibold">Phone number<input name="phone" required type="tel" maxLength={20} autoComplete="tel" className="mt-2 w-full border-b border-foreground/25 bg-transparent px-0 py-3 outline-none focus:border-primary" placeholder="+91 ..." /></label>
            <label className="block text-sm font-semibold">Email address<input name="email" required type="email" maxLength={160} autoComplete="email" className="mt-2 w-full border-b border-foreground/25 bg-transparent px-0 py-3 outline-none focus:border-primary" placeholder="you@restaurant.com" /></label>
            <label className="block text-sm font-semibold">Restaurant name<input name="restaurantName" required maxLength={120} className="mt-2 w-full border-b border-foreground/25 bg-transparent px-0 py-3 outline-none focus:border-primary" placeholder="Your restaurant" /></label>
            <label className="block text-sm font-semibold">City<input name="city" required maxLength={100} autoComplete="address-level2" className="mt-2 w-full border-b border-foreground/25 bg-transparent px-0 py-3 outline-none focus:border-primary" placeholder="City" /></label>
            <label className="block text-sm font-semibold">What would you like help with?
              <select name="service" required defaultValue="" className="mt-2 w-full border-b border-foreground/25 bg-transparent px-0 py-3 outline-none focus:border-primary">
                <option value="" disabled>Select a focus area</option>
                <option>Operations & SOPs</option><option>Food cost & profitability</option><option>Marketing & customer growth</option><option>Technology & automation</option><option>Launch & expansion planning</option><option>Business performance review</option><option>Not sure yet</option>
              </select>
            </label>
          </div>
          <label className="block text-sm font-semibold">What is the main challenge?<textarea name="message" required minLength={4} maxLength={2000} rows={4} className="mt-2 w-full resize-y border-b border-foreground/25 bg-transparent px-0 py-3 outline-none focus:border-primary" placeholder="Tell us briefly about your restaurant and what you want to improve." /></label>
          <label className="flex items-start gap-3 text-xs leading-5 text-muted-foreground"><input name="consent" type="checkbox" required className="mt-1" /><span>I agree that Sardaar Ji Dhaba / RestroGrowth may contact me about this consulting enquiry.</span></label>
          <button type="submit" disabled={sending} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground disabled:cursor-wait disabled:opacity-60" data-testid="button-submit-consulting">{sending ? 'Sending...' : 'Send consulting enquiry'} <ArrowRight size={16} /></button>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        </form>}
      </div>
    </section>
  </Shell>;
}

function About() {
  return <Shell><Meta title="Our story" /><PageIntro eyebrow="The long way round" title="A dhaba is more than a place to eat." copy="It is a pause in the journey. A familiar smell from the open kitchen. A table where the food keeps coming and nobody checks the time." /><section className="mx-auto grid max-w-7xl gap-12 px-5 pb-20 lg:grid-cols-[.9fr_1.1fr] lg:px-8 lg:pb-32"><PhotoArt src="/images/restaurant/dining-room.jpg" alt="Warm Sardaar Ji Dhaba dining room" label="our beginning" className="min-h-[440px] lg:min-h-[580px]" /><div className="lg:pt-12"><p className="font-mono-brand text-[10px] uppercase tracking-[.24em] text-primary">A note from the family</p><div className="mt-7 space-y-6 font-display text-3xl leading-tight tracking-[-.04em] md:text-4xl"><p>In {business.established}, we opened our first table with one simple belief: roadside food should never feel like a compromise.</p><p>We wanted the warmth of a Punjabi home, the theatre of a live tandoor and the kind of portions that make you loosen your belt.</p></div><p className="mt-8 max-w-lg text-sm leading-7 text-muted-foreground">Since then, Sardaar Ji Dhaba has grown from a single busy stop into a trusted place for family meals, Punjabi comfort food and memorable evenings in Noida and Prayagraj.</p><div className="mt-10 border-l-2 border-accent pl-5 font-mono-brand text-[10px] uppercase tracking-[.17em] text-secondary">Built on repeat guests, slow-cooked gravies and a simple promise:<br /><span className="text-muted-foreground">serve honest food, serve it generously, and make every table feel welcome.</span></div></div></section><section className="bg-secondary text-secondary-foreground"><div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28"><p className="font-mono-brand text-[10px] uppercase tracking-[.24em] text-accent">What has not changed</p><div className="mt-12 grid gap-10 md:grid-cols-3">{values.map(value => <div key={value.number} className="border-t border-secondary-foreground/25 pt-5"><span className="font-mono-brand text-xs text-accent">{value.number}</span><h2 className="mt-10 font-display text-3xl">{value.title}</h2><p className="mt-4 text-sm leading-7 text-secondary-foreground/70">{value.copy}</p></div>)}</div></div></section></Shell>;
}

function SuccessStory() {
  const teamMembers = [
    { name: 'Shashank Saxena', href: 'https://www.linkedin.com/in/shashanksaxena18/' },
    { name: 'Swati Nirkhi', href: 'https://www.linkedin.com/in/swaati-nirkhi-7babb958/' },
    { name: 'Rajan Singh', href: 'https://www.linkedin.com/in/rajan-singh-77739017/' },
    { name: 'Naman Mishra', href: 'https://www.linkedin.com/in/naman-mishra-55756a183/' },
  ];

  return <Shell><Meta title="Success story" /><PageIntro eyebrow="One table became two stops" title="A little roadside belief, carried forward." copy="From the first busy evening in Noida to a second home in Prayagraj — this is a growing story, still written one plate at a time." /><section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8 lg:pb-28"><div className="grid gap-5 md:grid-cols-4">{[String(business.established), '01', '02', '∞'].map((number, i) => <div key={number} className={`min-h-[190px] border-t-2 p-5 ${i === 3 ? 'border-accent bg-accent' : 'border-secondary bg-muted/60'}`}><span className="font-display text-6xl tracking-[-.08em]">{number}</span><p className="mt-8 font-mono-brand text-[10px] uppercase tracking-[.17em] text-muted-foreground">{['The first flame', 'Noida', 'Prayagraj', 'Next chapter'][i]}</p></div>)}</div><div className="mt-16 grid gap-12 lg:grid-cols-[1.05fr_.95fr]"><div><p className="font-mono-brand text-[10px] uppercase tracking-[.24em] text-primary">Built on repeat customers</p><h2 className="mt-5 max-w-lg font-display text-5xl leading-[.95] tracking-[-.06em]">The best kind of growth is someone bringing their parents back.</h2><p className="mt-7 max-w-lg leading-7 text-muted-foreground">What started in Noida with one busy dining room has grown into a second home in Prayagraj, where the same Punjabi values still guide the kitchen: generous portions, smoky tandoor flavours, and the kind of hospitality that keeps people coming back with their families.</p></div><PhotoArt src="/images/people/guest-table.jpg" alt="Guests enjoying Punjabi food at Sardaar Ji Dhaba" label="our people" className="min-h-[360px]" /></div></section><section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8 lg:pb-28"><div className="mb-8"><p className="font-mono-brand text-[10px] uppercase tracking-[.24em] text-primary">Meet the team</p><h2 className="mt-4 font-display text-4xl tracking-[-.05em] md:text-5xl">The people behind the long tables.</h2></div><div className="grid gap-6 md:grid-cols-2">{teamMembers.map(({ name, href }) => <div key={name} className="flex items-center gap-5 rounded-2xl border border-foreground/10 bg-card p-5"><div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent font-display text-lg text-accent-foreground">{name.split(' ').map(word => word[0]).slice(0, 2).join('').toUpperCase()}</div><div className="min-w-0 flex-1"><p className="font-display text-2xl leading-none tracking-[-.03em]">{name}</p><p className="mt-2 text-sm text-muted-foreground">Sardaar Ji Dhaba team</p><a href={href} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary"><Linkedin size={16} /> LinkedIn</a></div></div>)}</div></section><section className="bg-muted/70"><div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24"><div className="grid gap-8 md:grid-cols-2"><div className="sketch-border bg-background p-8"><p className="font-mono-brand text-[10px] uppercase tracking-[.2em] text-primary">The next chapter</p><h3 className="mt-6 font-display text-3xl leading-tight">Built one service, one plate and one conversation at a time.</h3><p className="mt-5 text-sm leading-7 text-muted-foreground">We are continuing to grow carefully, with a focus on the food, hospitality and day-to-day work that make a restaurant worth returning to.</p></div><div className="flex flex-col justify-center"><p className="font-mono-brand text-[10px] uppercase tracking-[.24em] text-primary">Want to build the next table?</p><h2 className="mt-4 font-display text-4xl tracking-[-.05em]">Bring the Sardaar Ji feeling to your city.</h2><Link href="/franchise" className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground" data-testid="link-success-franchise">Explore franchise partnership <ArrowRight size={16} /></Link></div></div></div></section></Shell>;
}

function MenuPage() {
  const [active, setActive] = useState('All');
  const [query, setQuery] = useState('');
  const categories = useMemo(() => ['All', ...Array.from(new Set(menu.map(item => item.category)))], []);
  const filtered = useMemo(() => menu.filter(item => (active === 'All' || item.category === active) && `${item.name} ${item.description}`.toLowerCase().includes(query.toLowerCase())), [active, query]);
  return <Shell><Meta title="Our Menu - North Indian & Punjabi Specialities | Sardaar Ji Dhaba" description="Explore the full menu at Sardaar Ji Dhaba. From Dal Makhani to Tandoori Roti, view our fresh Punjabi dishes." /><PageIntro eyebrow="The menu" title="Come hungry. Leave happier." copy="Punjabi classics, North Indian favourites and fresh dhaba-style comfort food across both Sardaar Ji Dhaba locations." /><section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8 lg:pb-28"><div className="flex flex-col gap-5 border-y border-foreground/10 py-5 lg:flex-row lg:items-center lg:justify-between"><div className="flex gap-2 overflow-x-auto pb-1">{categories.map(category => <button type="button" key={category} onClick={() => setActive(category)} className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-bold transition-colors ${active === category ? 'border-primary bg-primary text-primary-foreground' : 'border-foreground/15 hover:border-primary hover:text-primary'}`} data-testid={`button-filter-${category.toLowerCase()}`}>{category}</button>)}</div><label className="flex items-center gap-3 border-b border-foreground/20 pb-2 text-sm lg:w-60"><Search size={16} className="text-muted-foreground" /><span className="sr-only">Search menu</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search the menu" className="w-full bg-transparent outline-none placeholder:text-muted-foreground" data-testid="input-menu-search" /></label></div><p className="mt-6 text-sm leading-6 text-muted-foreground">Menu items, prices and availability may change by outlet. Please confirm current prices and availability with the team before ordering. If you have a food allergy or dietary requirement, contact the outlet before placing your order so the team can discuss ingredients and preparation.</p><div className="mt-8 grid gap-x-10 gap-y-8 md:grid-cols-2">{filtered.map((item, index) => <MenuCard item={item} key={item.id} categoryStart={index === 0 || item.category !== filtered[index - 1].category} />)}</div>{filtered.length === 0 && <div className="py-20 text-center"><Utensils className="mx-auto text-primary" /><p className="mt-4 font-display text-2xl">That plate is not on today's list.</p><button type="button" onClick={() => { setQuery(''); setActive('All'); }} className="mt-4 text-sm font-bold text-primary underline" data-testid="button-reset-menu">Reset the menu</button></div>}<div className="mt-16 border border-dashed border-primary/50 bg-primary/5 p-5 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">Menu note:</strong> Sardaar Ji Dhaba serves a broad Punjabi and North Indian menu across both locations, including tandoori starters, curries, breads, rice, desserts and beverages.</div></section></Shell>;
}


function MenuCard({ item, categoryStart }: { item: MenuItem; categoryStart: boolean }) {
  return <SemanticMenu items={[item]} showCategoryHeadings={categoryStart} />;
}
function Gallery() {
  const photos = [
    ...menuBoards,
    { id: 'dining-room', title: 'Dining room', image: '/images/restaurant/dining-room.jpg', alt: 'Sardaar Ji Dhaba dining room' },
    { id: 'dhaba-exterior', title: 'Dhaba exterior', image: '/images/restaurant/dhaba-exterior.jpg', alt: 'Sardaar Ji Dhaba exterior' },
    { id: 'guest-table', title: 'Family table', image: '/images/people/guest-table.jpg', alt: 'Guests enjoying a meal at Sardaar Ji Dhaba' },
  ];
  return <Shell><Meta title="Gallery | Sardaar Ji Dhaba" description="See the real food, dining spaces and menu boards from Sardaar Ji Dhaba in Noida and Prayagraj." /><PageIntro eyebrow="A look around the table" title="Food, fire and familiar faces." copy="A gallery of the restaurant, menu boards and dining moments already shared by Sardaar Ji Dhaba." /><section className="mx-auto grid max-w-7xl gap-5 px-5 pb-24 sm:grid-cols-2 lg:grid-cols-3 lg:px-8">{photos.map(photo => <figure key={photo.id} className="group overflow-hidden border border-foreground/10 bg-card"><PhotoArt src={photo.image} alt={photo.alt} label={photo.title} className="min-h-[260px] transition-transform duration-500 group-hover:scale-[1.02]" /><figcaption className="p-4 font-display text-2xl">{photo.title}</figcaption></figure>)}</section></Shell>;
}

function LocationsLegacy() {
  return <Shell><Meta title="Find us" /><PageIntro eyebrow="Two stops, one big welcome" title="Where the road meets good food." copy="Choose your nearest table. Exact addresses, timings and map links are marked for the Sardaar Ji team to add." /><section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8 lg:pb-28"><div className="grid gap-6 md:grid-cols-2">{locations.map(location => <Link href={`/locations/${location.id}`} key={location.id} className="group border border-foreground/15 bg-card p-3 transition-transform hover:-translate-y-1" data-testid={`card-location-${location.id}`}><PhotoArt src={location.image} alt={`${location.city} Sardaar Ji Dhaba location`} label={`${location.city} stop`} className="min-h-[260px]" /><div className="p-5"><div className="flex items-center justify-between"><p className="font-mono-brand text-[10px] uppercase tracking-[.2em] text-primary">{location.city}</p><ArrowUpRight size={18} className="text-primary transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></div><h2 className="mt-4 font-display text-3xl">{location.note}</h2><div className="mt-6 space-y-2 text-sm text-muted-foreground"><p className="flex items-center gap-2"><MapPin size={14} className="text-primary" />{location.area}</p><p className="flex items-center gap-2"><Clock3 size={14} className="text-primary" />{location.hours}</p></div></div></Link>)}</div></section></Shell>;
}

function Locations() {
  return <Shell><Meta title="Visit Sardaar Ji Dhaba in Prayagraj & Noida" description="Find Sardaar Ji Dhaba in Prayagraj and Noida, view the exact address, opening hours, map directions, and plan your next Punjabi or North Indian meal." /><PageIntro eyebrow="Two stops, one big welcome" title="Where the road meets good food." copy="Choose your nearest Sardaar Ji Dhaba stop in Prayagraj or Noida and plan your visit with the exact address, timings and directions." /><section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8 lg:pb-28"><div className="grid gap-6 md:grid-cols-2">{locations.map(location => <div key={location.id} className="border border-foreground/15 bg-card p-3"><PhotoArt src={location.image} alt={`${location.city} Sardaar Ji Dhaba location`} label={`${location.city} stop`} className="min-h-[260px]" /><div className="p-5"><p className="font-mono-brand text-[10px] uppercase tracking-[.2em] text-primary">{location.city}</p><h2 className="mt-4 font-display text-3xl">{location.note}</h2><p className="mt-6 text-sm text-muted-foreground">{location.area}</p><p className="mt-3 flex items-center gap-2 text-sm font-semibold"><Clock3 size={15} className="text-primary" />{location.hours}</p><p className="mt-2 text-sm text-muted-foreground">{location.availability}</p><div className="mt-6 flex flex-wrap gap-3"><Link href={`/locations/${location.id}`} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground" data-testid={`link-directions-${location.city.toLowerCase()}`}><MapPin size={15} /> Get Directions</Link><a href={location.mapUrl}
    target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-secondary px-5 py-3 text-sm font-bold text-secondary" data-testid={`link-map-${location.id}`}>Google Maps <MapPin size={15} /></a></div></div></div>)}</div></section></Shell>;
}

function LocationDetail() {
  const { city } = useParams<{ city: string }>();
  const place = locations.find(item => item.id === city);
  if (!place) return <NotFound />;

  const mapEmbedSrc = `https://www.google.com/maps?q=${encodeURIComponent(place.area)}&output=embed`;
  const menuIds = place.id === 'noida'
    ? ['tandoori-chicken', 'paneer-tikka', 'dal-makhani']
    : ['kadhai-chicken', 'dal-makhani', 'paneer-tikka'];
  const intro = `Find Sardaar Ji Dhaba in ${place.city} at ${place.area}. This local outlet page gives visitors one place to review the address, opening hours, map, phone contact and selected menu items before travelling. The published menu includes Punjabi and North Indian favourites, with tandoori starters, paneer dishes, dal, breads and rice; availability can change, so call to confirm a specific item before visiting. Daily hours are listed as ${business.hours.display}. Use the embedded Google Map to check the location and open directions in Google Maps. The contact number below connects to the restaurant team for questions about the current menu and visit details. Reservation, delivery, takeaway and group-seating availability have not been confirmed for this outlet; please ask directly rather than relying on assumptions. The full menu page provides more published dishes and categories for guests planning a meal. Map and address details are included to help residents and visitors navigate to this ${place.city} stop. Confirm current details by phone when timing or a particular dish matters.`;

  return (
    <Shell>
      <Meta title={`Punjabi Restaurant in ${place.city} | Sardaar Ji Dhaba`} description={`Visit Sardaar Ji Dhaba in ${place.city} for Punjabi and North Indian food, outlet details and directions.`} image={`/images/og/${place.id}-1200x630.jpg`} />
      <section className="bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
          <Link href="/locations" className="inline-flex items-center gap-2 font-mono-brand text-[10px] uppercase tracking-[.2em] text-accent"><ChevronLeft size={14} /> All locations</Link>
          <p className="mt-12 font-mono-brand text-[10px] uppercase tracking-[.24em] text-accent">Punjabi food · {place.city}</p>
          <h1 className="mt-5 max-w-5xl font-display text-5xl leading-[.92] md:text-7xl">Punjabi Restaurant in {place.city}, Sardaar Ji Dhaba</h1>
          <p className="mt-7 max-w-4xl text-base leading-7 text-secondary-foreground/80">{intro}</p>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-2 lg:px-8 lg:py-24">
        <div>
          <h2 className="font-display text-4xl">Plan your visit</h2>
          <dl className="mt-7 space-y-5 border-t border-foreground/15 pt-6 text-sm">
            <div><dt className="font-bold">Address</dt><dd className="mt-1 text-muted-foreground">{place.area}</dd></div>
            <div><dt className="font-bold">Phone</dt><dd className="mt-1"><a href={`tel:${business.phone.e164}`} className="text-primary underline">{business.phone.display}</a></dd></div>
            <div><dt className="font-bold">Hours</dt><dd className="mt-1 text-muted-foreground">Daily, {business.hours.display}</dd></div>
          </dl>
          <a href={place.mapUrl} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground"><MapPin size={16} /> Directions to {place.city}</a>
          <h2 className="mt-12 font-display text-3xl">Popular Punjabi dishes</h2>
          <ul className="mt-4 space-y-3">{menuIds.map(id => {
            const item = menu.find(dish => dish.id === id);
            return item ? <li key={id}><Link href="/menu" className="text-primary underline">{item.name}</Link></li> : null;
          })}</ul>
        </div>
        <div className="min-h-[360px] overflow-hidden border border-foreground/15"><iframe title={`${place.city} map`} src={mapEmbedSrc} width="100%" height="100%" loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="min-h-[360px] w-full border-0" /></div>
      </section>
    </Shell>
  );
}

function NoidaLanding() {
  return <Shell><Meta title="Sardaar Ji Dhaba Noida | Sector 76" description="Visit Sardaar Ji Dhaba in Noida for Punjabi and North Indian food. Check outlet details, opening hours and directions before your visit." image="/images/og/noida-1200x630.jpg" /><NoidaPage /></Shell>;
}

function PrayagrajLanding() {
  return <Shell><Meta title="Sardaar Ji Dhaba Prayagraj | Civil Lines" description="Visit Sardaar Ji Dhaba at 138C Mahatma Gandhi Marg, near El Chico in Civil Lines, Prayagraj. Get directions, opening hours and ordering links." image="/images/og/prayagraj-1200x630.jpg" /><PrayagrajPage /></Shell>;
}

function BreadcrumbJsonLd({ route }: { route: string }) {
  return null;
}

function Franchise() {
  return <Shell><Meta title="Franchise partnership" /><section className="bg-secondary text-secondary-foreground"><div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[1fr_.8fr] lg:px-8 lg:py-28"><div><p className="font-mono-brand text-[10px] uppercase tracking-[.24em] text-accent">For people who know the value of a full table</p><h1 className="mt-6 font-display text-6xl leading-[.88] tracking-[-.07em] md:text-8xl">Bring a<br /><span className="text-accent">dhaba</span><br />home.</h1><p className="mt-8 max-w-md text-lg leading-7 text-secondary-foreground/75">We are exploring thoughtful partnerships with people who want to serve honest Punjabi food in their city.</p><Link href="/franchise/apply" className="mt-9 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-bold text-accent-foreground" data-testid="link-franchise-apply">Start a conversation <ArrowRight size={16} /></Link></div><PhotoArt src="/images/restaurant/celebration-room.jpg" alt="Dining room prepared for a Sardaar Ji Dhaba gathering" label="future table" className="min-h-[430px] bg-secondary/60" /></div></section><section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28"><div className="grid gap-12 lg:grid-cols-[.7fr_1.3fr]"><div><p className="font-mono-brand text-[10px] uppercase tracking-[.24em] text-primary">The right fit</p><h2 className="mt-5 font-display text-5xl leading-none tracking-[-.06em]">Not a template.<br />A shared table.</h2></div><div className="grid gap-7 sm:grid-cols-2">{['A love for food with a point of view', 'Care for guests that goes beyond service', 'A city, space or idea worth exploring', 'Patience to build something lasting'].map((item, index) => <div key={item} className="border-t border-foreground/15 pt-4"><span className="font-mono-brand text-xs text-primary">0{index + 1}</span><p className="mt-8 font-display text-2xl">{item}</p></div>)}</div></div></section><section className="bg-accent"><div className="mx-auto flex max-w-7xl flex-col gap-7 px-5 py-16 lg:flex-row lg:items-center lg:justify-between lg:px-8"><h2 className="max-w-xl font-display text-4xl leading-tight tracking-[-.05em]">Franchise details, investment and territory information will be shared after an initial conversation.</h2><Link href="/franchise/apply" className="inline-flex w-fit items-center gap-2 rounded-full bg-secondary px-6 py-3.5 text-sm font-bold text-secondary-foreground" data-testid="link-franchise-form">Tell us about your idea <ArrowRight size={16} /></Link></div></section></Shell>;
}

async function sendInquiry(form: HTMLFormElement, kind: 'contact' | 'franchise') {
  const values = Object.fromEntries(new FormData(form).entries());
  const consent = values.consent === 'on';
  const response = await fetch(apiUrl('/api/inquiries'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...values,
      kind,
      consent,
      source: kind === 'franchise' ? 'franchise-application' : 'contact-page',
    }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.message ?? 'The message could not be sent. Please try again.');
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
      await trackEvent('franchise_form_submission');
      setSent(true);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'The message could not be sent.');
    } finally {
      setSending(false);
    }
  };
  return (
    <Shell>
      <Meta title="Sardaar Ji Dhaba Franchise Enquiry | Start an Application" description="Tell Sardaar Ji Dhaba about your city, investment readiness and restaurant plans. Submit a franchise enquiry to start a conversation." image="/images/og/franchise-1200x630.jpg" />
      <div className="mx-auto grid max-w-7xl gap-14 px-5 py-16 lg:grid-cols-[.7fr_1.3fr] lg:px-8 lg:py-24">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 font-mono-brand text-[10px] uppercase tracking-[.2em] text-primary" data-testid="link-back-franchise"><ChevronLeft size={14} /> Sardaar Ji Dhaba</Link>
          <h1 className="mt-12 font-display text-6xl leading-[.88] tracking-[-.07em]">Let's talk<br /><span className="text-primary">about your city.</span></h1>
          <p className="mt-7 max-w-sm leading-7 text-muted-foreground">Share a few details about yourself and your plans. This is an initial enquiry, not a commitment or franchise approval. Our team will review your details and contact you about the next step.</p>
          <div className="mt-10 flex items-center gap-3 border-t border-foreground/10 pt-5 text-sm"><Phone size={16} className="text-primary" /><a href={`tel:${brand.phoneLink}`} className="font-bold" data-testid="link-application-phone">{brand.phone}</a></div>
        </div>
        <div className="bg-muted/60 p-6 md:p-10">
          {sent ? (
            <div className="flex min-h-[500px] flex-col items-start justify-center">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-accent font-bold text-secondary">✓</span>
              <h2 className="mt-7 font-display text-4xl">Enquiry received.</h2>
              <p className="mt-4 max-w-md leading-7 text-muted-foreground">Thank you for your interest in Sardaar Ji Dhaba. The team will review your details and get in touch using the contact information you shared.</p>
              <Link href="/" className="mt-7 font-bold text-primary underline">Back to home</Link>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={submit}><input name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
              <div className="grid gap-6 sm:grid-cols-2">
                <label className="block text-sm font-semibold">Your name<input name="name" required minLength={2} maxLength={100} autoComplete="name" placeholder="Full name" className="mt-2 w-full border-b border-foreground/25 bg-transparent px-0 py-3 outline-none focus:border-primary" data-testid="input-application-name" /></label>
                <label className="block text-sm font-semibold">Phone number<input name="phone" required type="tel" minLength={7} maxLength={20} autoComplete="tel" placeholder="+91 ..." className="mt-2 w-full border-b border-foreground/25 bg-transparent px-0 py-3 outline-none focus:border-primary" data-testid="input-application-phone-number" /></label>
                <label className="block text-sm font-semibold">Email address<input name="email" required type="email" maxLength={160} autoComplete="email" placeholder="you@example.com" className="mt-2 w-full border-b border-foreground/25 bg-transparent px-0 py-3 outline-none focus:border-primary" data-testid="input-application-email" /></label>
                <label className="block text-sm font-semibold">Preferred city<input name="city" required minLength={2} maxLength={100} autoComplete="address-level2" placeholder="City you have in mind" className="mt-2 w-full border-b border-foreground/25 bg-transparent px-0 py-3 outline-none focus:border-primary" data-testid="input-application-city" /></label>
                <label className="block text-sm font-semibold">Approximate investment budget
                  <span className="mt-1 block text-[10px] font-normal text-muted-foreground">Indicative budget only — not an official franchise fee or project cost.</span><select name="investmentRange" required defaultValue="" className="mt-2 w-full border-b border-foreground/25 bg-transparent px-0 py-3 outline-none focus:border-primary" data-testid="select-application-budget">
                    <option value="" disabled>Select a range</option><option>Below ₹10 lakh</option><option>₹10–20 lakh</option><option>₹20–35 lakh</option><option>₹35–50 lakh</option><option>₹50 lakh+</option><option>Need guidance before deciding</option>
                  </select>
                </label>
                <label className="block text-sm font-semibold">Restaurant / hospitality experience
                  <select name="experience" defaultValue="" className="mt-2 w-full border-b border-foreground/25 bg-transparent px-0 py-3 outline-none focus:border-primary" data-testid="select-application-experience">
                    <option value="">Choose if applicable</option><option>Currently operate a restaurant</option><option>Worked in hospitality</option><option>First-time entrepreneur</option><option>Other business experience</option>
                  </select>
                </label>
              </div>
              <label className="block text-sm font-semibold">Anything else we should know?<textarea name="message" required minLength={4} maxLength={2000} rows={4} placeholder="Tell us about your plans, preferred location or any questions." className="mt-2 w-full resize-y border-b border-foreground/25 bg-transparent px-0 py-3 outline-none focus:border-primary" data-testid="input-application-message" /></label>
              <label className="flex items-start gap-3 text-xs leading-5 text-muted-foreground"><input name="consent" type="checkbox" required className="mt-1" /><span>I agree that Sardaar Ji Dhaba may contact me about this franchise enquiry.</span></label>
              <button type="submit" disabled={sending} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground disabled:cursor-wait disabled:opacity-60" data-testid="button-submit-application">{sending ? 'Sending...' : 'Submit franchise enquiry'} <ArrowRight size={16} /></button>
              {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
              <p className="text-xs text-muted-foreground">Your details will only be used to respond to this enquiry. See our <Link href="/privacy-policy" className="text-primary underline">privacy policy</Link>.</p>
            </form>
          )}
        </div>
      </div>
    </Shell>
  );
}

function Blog() {
  const [visibleCount, setVisibleCount] = useState(6);
  const visibleStories = stories.slice(0, visibleCount);
  return <Shell><Meta title="Sardaar Ji Dhaba Blog & City Guides" description="Read Sardaar Ji Dhaba blog posts and city guides on Prayagraj, restaurant picks, Punjabi comfort food, and local travel ideas." /><PageIntro eyebrow="Blog" title="Stories, guides and good food from Prayagraj." copy="From restaurant-style recipes to local city guides, discover what makes Sardaar Ji Dhaba a favourite stop in Noida and Prayagraj." /><section className="mx-auto max-w-7xl px-5 pb-24 lg:px-8"><div className="grid gap-7 md:grid-cols-3">{visibleStories.map((story, i) => <Link href={`/blog/${story.id}`} key={story.id} className={`group ${i % 3 === 1 ? 'md:translate-y-12' : ''}`} data-testid={`card-blog-${story.id}`}><PhotoArt src={story.image} alt={story.alt} label={story.category} className="min-h-[270px]" /><p className="mt-6 font-mono-brand text-[10px] uppercase tracking-[.18em] text-primary">{story.publishedAt ? `${story.publishedAt} · ` : ''}{story.category} · {story.read}</p><h2 className="mt-3 font-display text-3xl leading-none tracking-[-.04em] group-hover:text-primary">{story.title}</h2><p className="mt-4 text-sm leading-6 text-muted-foreground">{story.excerpt}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-bold">{story.category === 'Recipe guide' ? 'Read recipe' : 'Read article'} <ArrowUpRight size={15} /></span></Link>)}</div>{visibleCount < stories.length && <button type="button" onClick={() => setVisibleCount(count => Math.min(count + 6, stories.length))} className="mx-auto mt-16 block rounded-full border border-primary px-6 py-3 text-sm font-bold text-primary hover:bg-primary hover:text-primary-foreground" data-testid="button-load-more-blog">Load more posts</button>}</section></Shell>;
}

function BlogArticle() {
  const { slug } = useParams<{ slug: string }>();
  const story = stories.find(item => item.id === slug);
  if (!story) return <NotFound />;

  const recipeName = story.category === 'Recipe guide'
    ? story.title.replace(/^How to Make /i, '')
    : story.title;
  const articleTitle = story.category === 'Recipe guide'
    ? `${story.title} - Restaurant Style Cooking | Sardaar Ji Dhaba Blog`
    : (story.seoTitle ?? story.title);
  const articleDescription = story.category === 'Recipe guide'
    ? `Learn how to make authentic ${recipeName} at home with step-by-step guides from Sardaar Ji Dhaba.`
    : (story.seoDescription ?? story.excerpt);

  const answerLead = story.body[0].split(/\s+/).slice(0, 55).join(' ');

  return <Shell><Meta title={articleTitle} description={articleDescription} image={story.image} type="article" /><article><header className="mx-auto max-w-4xl px-5 pb-12 pt-16 text-center lg:px-8 lg:pt-24"><Link href="/blog" className="font-mono-brand text-[10px] uppercase tracking-[.2em] text-primary" data-testid="link-back-blog">← Back to blog</Link><p className="mt-10 font-mono-brand text-[10px] uppercase tracking-[.2em] text-secondary">{story.category} · {story.read}</p><h1 className="mt-5 font-display text-5xl leading-[.92] tracking-[-.07em] md:text-7xl">{story.title}</h1><p className="mx-auto mt-7 max-w-3xl text-left text-base leading-7 text-foreground"><strong>In brief: </strong>{answerLead}</p><p className="mt-7 max-w-xl text-base leading-7 text-muted-foreground">{story.excerpt}</p></header><div className="mx-auto max-w-5xl px-5 lg:px-8"><PhotoArt src={story.image} alt={story.alt} label={story.category} className="min-h-[300px] md:min-h-[480px]" /></div><div className="mx-auto max-w-3xl px-5 py-16 lg:px-8"><div className="space-y-10">{story.ingredients && story.ingredients.length > 0 && <section className="rounded-2xl border border-foreground/10 bg-card p-6 md:p-8"><h2 className="font-display text-3xl tracking-[-.04em]">Ingredients</h2><ul className="mt-5 space-y-3 text-sm leading-7 text-muted-foreground">{story.ingredients.map((ingredient) => <li key={ingredient} className="flex gap-3"><span className="mt-2 h-2 w-2 rounded-full bg-primary" aria-hidden="true" /><span>{ingredient}</span></li>)}</ul></section>}{story.method && story.method.length > 0 && <section className="rounded-2xl border border-foreground/10 bg-card p-6 md:p-8"><h2 className="font-display text-3xl tracking-[-.04em]">How to make it</h2><ol className="mt-5 space-y-5 text-sm leading-7 text-muted-foreground">{story.method.map((step, index) => <li key={step} className="flex gap-4"><span className="mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">{index + 1}</span><span>{step}</span></li>)}</ol></section>}{story.tips && story.tips.length > 0 && <section className="rounded-2xl border border-foreground/10 bg-card p-6 md:p-8"><h2 className="font-display text-3xl tracking-[-.04em]">Chef tips</h2><ul className="mt-5 space-y-3 text-sm leading-7 text-muted-foreground">{story.tips.map((tip) => <li key={tip} className="flex gap-3"><span className="mt-2 h-2 w-2 rounded-full bg-accent" aria-hidden="true" /><span>{tip}</span></li>)}</ul></section>}<section className="prose prose-stone max-w-none prose-headings:font-display prose-headings:font-semibold prose-p:leading-8"><h2>{story.category === 'Recipe guide' ? 'Why this recipe works' : 'Why this guide matters'}</h2>{story.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<blockquote>{story.category === 'Recipe guide' ? 'The first bite should make you look up from the table.' : 'The best city guides help you see the place clearly, not just tick off the obvious stops.'}</blockquote><p className="font-mono-brand text-xs uppercase tracking-[.16em] text-muted-foreground">{story.category === 'Recipe guide' ? 'Kitchen note · Sardaar Ji Dhaba' : 'City note · Prayagraj'}</p></section></div></div></article></Shell>;
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
  return <Shell><Meta title="Contact" /><PageIntro eyebrow="Come say hello" title="The kettle is always on." copy="For table questions, feedback, catering conversations or just a friendly hello, reach out directly." /><section className="mx-auto grid max-w-7xl gap-12 px-5 pb-24 lg:grid-cols-[.8fr_1.2fr] lg:px-8"><div className="space-y-4"><a href={`tel:${brand.phoneLink}`} className="group flex items-center justify-between border-t border-foreground/15 py-5" data-testid="link-contact-phone"><span><span className="block font-mono-brand text-[10px] uppercase tracking-[.18em] text-primary">Call</span><span className="mt-2 block font-display text-2xl">{brand.phone}</span></span><ArrowUpRight className="text-primary" /></a><a href={`mailto:${brand.email}`} className="group flex items-center justify-between border-t border-foreground/15 py-5" data-testid="link-contact-email"><span><span className="block font-mono-brand text-[10px] uppercase tracking-[.18em] text-primary">Email</span><span className="mt-2 block font-display text-2xl break-all">{brand.email}</span></span><ArrowUpRight className="text-primary" /></a><a href={brand.whatsapp} target="_blank" rel="noreferrer" className="group flex items-center justify-between border-y border-foreground/15 py-5" data-testid="link-contact-whatsapp"><span><span className="block font-mono-brand text-[10px] uppercase tracking-[.18em] text-primary">WhatsApp</span><span className="mt-2 block font-display text-2xl">Start a chat</span></span><ArrowUpRight className="text-primary" /></a></div><div className="bg-muted/60 p-6 md:p-10"><h2 className="font-display text-3xl">Leave a note</h2>{sent ? <div className="mt-12"><h3 className="font-display text-2xl">We have your note.</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">Thanks for writing. We will get back to you soon.</p></div> : <form className="mt-8 space-y-6" onSubmit={submit}><input name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" /><div className="grid gap-6 sm:grid-cols-2"><input name="name" required aria-label="Your name" placeholder="Your name" className="border-b border-foreground/25 bg-transparent px-0 py-3 outline-none" data-testid="input-contact-name" /><input name="email" required type="email" aria-label="Email address" placeholder="Email address" className="border-b border-foreground/25 bg-transparent px-0 py-3 outline-none" data-testid="input-contact-email" /></div><textarea name="message" required minLength={4} maxLength={2000} rows={5} aria-label="Your message" placeholder="What can we help with?" className="w-full resize-none border-b border-foreground/25 bg-transparent px-0 py-3 outline-none" data-testid="input-contact-message" /><label className="flex items-start gap-3 text-xs leading-5 text-muted-foreground"><input name="consent" type="checkbox" required className="mt-1" /><span>I agree that Sardaar Ji Dhaba may use the details I submit to respond to this message. Read our <Link href="/privacy-policy" className="text-primary underline">privacy policy</Link>.</span></label><button type="submit" disabled={sending} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground disabled:cursor-wait disabled:opacity-60" data-testid="button-submit-contact">{sending ? 'Sending...' : 'Send note'} <ArrowRight size={16} /></button>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}</form>}</div></section></Shell>;
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

  return <Shell><Meta title="Contact" /><PageIntro eyebrow="Come say hello" title="The kettle is always on." copy="For table questions, feedback, catering conversations or just a friendly hello, reach out directly." /><section className="mx-auto grid max-w-7xl gap-12 px-5 pb-24 lg:grid-cols-[.8fr_1.2fr] lg:px-8"><div className="space-y-4"><a href={`tel:${brand.phoneLink}`} className="group flex items-center justify-between border-t border-foreground/15 py-5" data-testid="link-contact-phone"><span><span className="block font-mono-brand text-[10px] uppercase tracking-[.18em] text-primary">Call</span><span className="mt-2 block font-display text-2xl">{brand.phone}</span></span><ArrowUpRight className="text-primary" /></a><a href={`mailto:${brand.email}`} className="group flex items-center justify-between border-t border-foreground/15 py-5" data-testid="link-contact-email"><span><span className="block font-mono-brand text-[10px] uppercase tracking-[.18em] text-primary">Email</span><span className="mt-2 block font-display text-2xl break-all">{brand.email}</span></span><ArrowUpRight className="text-primary" /></a><a href={brand.whatsapp} target="_blank" rel="noreferrer" className="group flex items-center justify-between border-y border-foreground/15 py-5" data-testid="link-contact-whatsapp"><span><span className="block font-mono-brand text-[10px] uppercase tracking-[.18em] text-primary">WhatsApp</span><span className="mt-2 block font-display text-2xl">Start a chat</span></span><ArrowUpRight className="text-primary" /></a></div><div className="bg-muted/60 p-6 md:p-10"><h2 className="font-display text-3xl">Leave a note</h2>{sent ? <div className="mt-12"><h3 className="font-display text-2xl">We have your note.</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">Thanks for writing. We will get back to you soon.</p></div> : <form className="mt-8 space-y-6" onSubmit={submit}><div className="grid gap-6 sm:grid-cols-2"><input name="name" required aria-label="Your name" placeholder="Your name" className="border-b border-foreground/25 bg-transparent px-0 py-3 outline-none" data-testid="input-contact-name" /><input name="email" required type="email" aria-label="Email address" placeholder="Email address" className="border-b border-foreground/25 bg-transparent px-0 py-3 outline-none" data-testid="input-contact-email" /></div><textarea name="message" required rows={5} aria-label="Your message" placeholder="What can we help with?" className="w-full resize-none border-b border-foreground/25 bg-transparent px-0 py-3 outline-none" data-testid="input-contact-message" /><button type="submit" disabled={sending} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground disabled:cursor-wait disabled:opacity-60" data-testid="button-submit-contact">{sending ? 'Sending...' : 'Send note'} <ArrowRight size={16} /></button>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}</form>}</div></section></Shell>;
}

function Legal({ terms = false }: { terms?: boolean }) {
  const title = terms ? 'Terms & Conditions | Sardaar Ji Dhaba' : 'Privacy Policy | Sardaar Ji Dhaba';
  const description = terms ? 'Read the Terms & Conditions for Sardaar Ji Dhaba.' : 'Read the Privacy Policy for Sardaar Ji Dhaba.';

  return <Shell><Meta title={title} description={description} /><PageIntro eyebrow="The fine print" title={terms ? 'Terms & conditions' : 'Privacy policy'} copy={terms ? 'These terms govern your use of the Sardaar Ji Dhaba website, including menu browsing, location information, franchise enquiries and contact forms.' : 'This privacy policy explains how Sardaar Ji Dhaba handles personal information provided through our website, contact forms, WhatsApp enquiries and related service requests.'} /><section className="mx-auto max-w-3xl px-5 pb-28 lg:px-8"><div className="space-y-10 border-t border-foreground/15 pt-8 text-sm leading-7 text-muted-foreground">
    {terms ? (
      <>
        <div>
          <h2 className="font-display text-3xl text-foreground">Website use</h2>
          <p className="mt-3">By accessing or using this website, you agree to use it only for lawful, non-commercial purposes. You may browse the menu, locations, blog content, contact details and franchise information for personal reference and general restaurant discovery.</p>
        </div>
        <div>
          <h2 className="font-display text-2xl text-foreground">Content and accuracy</h2>
          <p className="mt-3">Sardaar Ji Dhaba makes every effort to keep the information on this website accurate and up to date. Menu items, prices, timings, offers, locations and content may change without prior notice. We do not guarantee that all information will always be error-free, current, or complete.</p>
        </div>
        <div>
          <h2 className="font-display text-2xl text-foreground">Orders, reservations and enquiries</h2>
          <p className="mt-3">Any request submitted through our website, including contact forms, franchise enquiries, or WhatsApp communication, is subject to confirmation by Sardaar Ji Dhaba. We may contact you to verify details, clarify requirements or respond to your enquiry. The website is not a binding reservation or order platform unless explicitly stated otherwise.</p>
        </div>
        <div>
          <h2 className="font-display text-2xl text-foreground">Third-party links and services</h2>
          <p className="mt-3">This website may contain links to third-party services such as Google Maps, WhatsApp, Instagram and other external platforms. Sardaar Ji Dhaba is not responsible for the content, privacy practices, availability or accuracy of those external services.</p>
        </div>
        <div>
          <h2 className="font-display text-2xl text-foreground">Intellectual property</h2>
          <p className="mt-3">All text, design, branding, photography, menus, blog content, logos and other materials on this website are owned by Sardaar Ji Dhaba or are used with appropriate permission. You may not reproduce, redistribute or republish website content without prior written approval.</p>
        </div>
        <div>
          <h2 className="font-display text-2xl text-foreground">Limitation of liability</h2>
          <p className="mt-3">Sardaar Ji Dhaba shall not be liable for any indirect, incidental, consequential or punitive damages arising out of or relating to the use of this website. While we aim to provide a reliable and helpful experience, the website is provided on an as-is basis.</p>
        </div>
        <div>
          <h2 className="font-display text-2xl text-foreground">Applicable law</h2>
          <p className="mt-3">These terms are governed by the laws of India, and any dispute arising from the use of this website shall be subject to the exclusive jurisdiction of the courts in Uttar Pradesh, India.</p>
        </div>
        <div>
          <h2 className="font-display text-2xl text-foreground">Contact</h2>
          <p className="mt-3">If you have questions about these terms, please contact us at <a href={`mailto:${brand.email}`} className="font-bold text-primary underline">{brand.email}</a> or call <a href={`tel:${brand.phoneLink}`} className="font-bold text-primary underline">{brand.phone}</a>.</p>
        </div>
      </>
    ) : (
      <>
        <div>
          <h2 className="font-display text-3xl text-foreground">Who is responsible for your information</h2>
          <p className="mt-3">Sardaar Ji Dhaba is responsible for personal information submitted through this website. For privacy questions, requests or complaints, contact us at <a href={`mailto:${brand.email}`} className="font-bold text-primary underline">{brand.email}</a> or call <a href={`tel:${brand.phoneLink}`} className="font-bold text-primary underline">{brand.phone}</a>.</p>
        </div>
        <div>
          <h2 className="font-display text-2xl text-foreground">Information we collect and why</h2>
          <p className="mt-3">When you submit a contact, franchise or restaurant-consulting enquiry, we collect the details shown in that form, such as your name, email address, phone number, city, restaurant details, indicative budget and message. We use those details to respond to the specific enquiry, assess the request and keep a record of the conversation. Please do not submit payment details, identity documents or other sensitive information through these forms.</p>
        </div>
        <div>
          <h2 className="font-display text-2xl text-foreground">Information we collect</h2>
          <p className="mt-3">We may collect personal information that you voluntarily provide through website forms, direct messages, franchise enquiries, reservations, WhatsApp communication or other contact methods. This may include your name, email address, phone number, city, message content and any other information you choose to share.</p>
        </div>
        <div>
          <h2 className="font-display text-2xl text-foreground">How we use your information</h2>
          <p className="mt-3">We use the information you provide to respond to enquiries, improve customer service, understand visitor interest, support business communications, manage franchise or partnership requests, and maintain the quality and security of our website and services.</p>
        </div>
        <div>
          <h2 className="font-display text-2xl text-foreground">Information sharing</h2>
          <p className="mt-3">Sardaar Ji Dhaba does not sell personal information. We may share information with trusted service providers that help us operate the website or deliver communications, but only when necessary and under appropriate confidentiality obligations.</p>
        </div>
        <div>
          <h2 className="font-display text-2xl text-foreground">Cookies and analytics</h2>
          <p className="mt-3">Strictly necessary storage is used to remember your cookie preference. Google Analytics 4 and Google Tag Manager are not loaded until you choose to accept optional analytics cookies. If you accept, those services may process online identifiers, device and browser information, and website interaction data to measure site use. If you reject, optional analytics tags are not loaded by this website. You can change your choice at any time using the Cookie preferences link in the footer. Your browser may also provide controls to clear stored preferences.</p>
        </div>
        <div>
          <h2 className="font-display text-2xl text-foreground">Data retention and security</h2>
          <p className="mt-3">We retain personal information only for as long as needed to fulfil the purpose for which it was collected, comply with legal obligations, maintain records, or protect against misuse. We take reasonable administrative, technical and organizational measures to help keep information secure.</p>
        </div>
        <div>
          <h2 className="font-display text-2xl text-foreground">Your choices</h2>
          <p className="mt-3">Subject to applicable law, you may ask us for information about personal data processed through this website, request correction or erasure, withdraw consent for processing that relies on consent, and raise a grievance. Withdrawal does not affect processing already carried out lawfully before withdrawal. To make a request, contact us using the details below and identify the enquiry so we can locate it. We may need to verify your request before acting on it.</p>
        </div>
        <div>
          <h2 className="font-display text-2xl text-foreground">Contact</h2>
          <p className="mt-3">If you have any questions about this privacy policy or how your information is handled, please contact <a href={`mailto:${brand.email}`} className="font-bold text-primary underline">{brand.email}</a> or call <a href={`tel:${brand.phoneLink}`} className="font-bold text-primary underline">{brand.phone}</a>.</p>
        </div>
      </>
    )}
  </div></section></Shell>;
}

function NotFound() {
  return <Shell><Meta title="Page not found" /><section className="mx-auto flex min-h-[65vh] max-w-7xl flex-col justify-center px-5 py-20 lg:px-8"><p className="font-mono-brand text-[10px] uppercase tracking-[.24em] text-primary">Wrong turn</p><h1 className="mt-6 max-w-3xl font-display text-[clamp(5rem,14vw,12rem)] leading-[.75] tracking-[-.1em]">404<span className="text-primary">.</span></h1><p className="mt-10 max-w-sm text-lg leading-7 text-muted-foreground">This road does not go to the dhaba. Let us get you back to something tasty.</p><div className="mt-8 flex flex-wrap gap-3"><Link href="/" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground" data-testid="link-404-home">Take me home <ArrowRight size={16} /></Link><Link href="/menu" className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-6 py-3.5 text-sm font-bold" data-testid="link-404-menu">See the menu <Utensils size={16} /></Link></div></section></Shell>;
}

type AdminSummary = { inquiries: number; events: number; eventCounts: { _id: string; count: number }[]; recentInquiries: { kind: string; name: string; email: string; phone?: string; city?: string; investmentRange?: string; experience?: string; source?: string; message: string; createdAt: string }[] };

function Admin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [summary, setSummary] = useState<AdminSummary | null>(null);
  const [error, setError] = useState('');
  const loadSummary = async () => {
    const response = await fetch(apiUrl('/api/admin/summary'), { credentials: 'include' });
    if (!response.ok) {
      setAuthenticated(false);
      setSummary(null);
      return;
    }
    setSummary(await response.json());
    setAuthenticated(true);
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
      setError('Could not sign in. Please check the server connection and your credentials.');
    }
  };
  if (!authenticated || !summary) return <main className="mx-auto flex min-h-screen max-w-md items-center px-5 py-16"><form onSubmit={login} className="w-full border border-foreground/15 bg-card p-7 shadow-[var(--shadow-card)]"><p className="font-mono-brand text-[10px] uppercase tracking-[.2em] text-primary">Sardaar Ji Dhaba</p><h1 className="mt-4 font-display text-4xl">Admin sign in</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">Lead and analytics access for the restaurant team.</p><label className="mt-8 block text-sm font-bold">Username<input value={credentials.username} onChange={event => setCredentials({ ...credentials, username: event.target.value })} className="mt-2 w-full border-b border-foreground/25 bg-transparent px-0 py-3 outline-none" autoComplete="username" required /></label><label className="mt-5 block text-sm font-bold">Password<input type="password" value={credentials.password} onChange={event => setCredentials({ ...credentials, password: event.target.value })} className="mt-2 w-full border-b border-foreground/25 bg-transparent px-0 py-3 outline-none" autoComplete="current-password" required /></label>{error && <p className="mt-5 text-sm text-destructive" role="alert">{error}</p>}<button type="submit" className="mt-7 w-full rounded-full bg-primary px-5 py-3 font-bold text-primary-foreground">Sign in</button></form></main>;
  return <main className="min-h-screen bg-muted/50 px-5 py-10 lg:px-8"><div className="mx-auto max-w-7xl"><div className="flex flex-wrap items-end justify-between gap-5"><div><p className="font-mono-brand text-[10px] uppercase tracking-[.2em] text-primary">Private dashboard</p><h1 className="mt-3 font-display text-5xl">Good morning, Sardaar Ji.</h1></div><button type="button" onClick={async () => { try { await fetch(apiUrl('/api/admin/logout'), { method: 'POST', credentials: 'include' }); } catch { /* fallback demo logout */ } setAuthenticated(false); setSummary(null); }} className="rounded-full border border-foreground/20 px-5 py-2.5 text-sm font-bold">Sign out</button></div><div className="mt-10 grid gap-4 sm:grid-cols-2"><div className="bg-secondary p-6 text-secondary-foreground"><p className="font-mono-brand text-[10px] uppercase tracking-[.2em] text-accent">Leads</p><p className="mt-5 font-display text-6xl">{summary.inquiries}</p></div><div className="bg-primary p-6 text-primary-foreground"><p className="font-mono-brand text-[10px] uppercase tracking-[.2em] text-accent">Tracked events</p><p className="mt-5 font-display text-6xl">{summary.events}</p></div></div><section className="mt-10 grid gap-8 lg:grid-cols-[.7fr_1.3fr]"><div className="border border-foreground/10 bg-card p-6"><h2 className="font-display text-3xl">Conversion activity</h2><div className="mt-6 space-y-4">{summary.eventCounts.map(event => <div key={event._id} className="flex items-center justify-between border-b border-foreground/10 pb-3 text-sm"><span>{event._id.replaceAll('_', ' ')}</span><strong>{event.count}</strong></div>)}</div></div><div className="border border-foreground/10 bg-card p-6"><h2 className="font-display text-3xl">Recent leads</h2><div className="mt-6 space-y-5">{summary.recentInquiries.length === 0 ? <p className="text-sm text-muted-foreground">No enquiries yet.</p> : summary.recentInquiries.map((lead, index) => <article key={`${lead.email}-${index}`} className="border-b border-foreground/10 pb-5"><div className="flex flex-wrap justify-between gap-2"><h3 className="font-bold">{lead.name}</h3><span className="font-mono-brand text-[10px] uppercase text-primary">{lead.kind}</span></div><p className="mt-1 text-sm text-muted-foreground">{lead.email}{lead.phone ? ` · ${lead.phone}` : ''}{lead.city ? ` · ${lead.city}` : ''}</p><p className="mt-1 text-xs text-muted-foreground">{lead.investmentRange ? `Budget: ${lead.investmentRange}` : ''}{lead.experience ? ` · Experience: ${lead.experience}` : ''}</p><p className="mt-1 text-[10px] text-muted-foreground">{lead.source ? `Source: ${lead.source}` : ''}</p><p className="mt-3 text-sm leading-6">{lead.message}</p></article>)}</div></div></section></div></main>;
}

function loadOptionalAnalytics() {
  const analyticsWindow = window as Window & { dataLayer?: unknown[] };
  analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];
  analyticsWindow.dataLayer.push(['consent', 'update', {
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  }]);
  if (!document.getElementById('sardaar-google-analytics')) {
    analyticsWindow.dataLayer.push(['js', new Date()]);
    analyticsWindow.dataLayer.push(['config', 'G-XFGBQ9E94J']);
    const analyticsScript = document.createElement('script');
    analyticsScript.id = 'sardaar-google-analytics';
    analyticsScript.async = true;
    analyticsScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-XFGBQ9E94J';
    document.head.appendChild(analyticsScript);
  }
  if (!document.getElementById('sardaar-google-tag-manager')) {
    analyticsWindow.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    const tagManagerScript = document.createElement('script');
    tagManagerScript.id = 'sardaar-google-tag-manager';
    tagManagerScript.async = true;
    tagManagerScript.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-T32V895H';
    document.head.appendChild(tagManagerScript);
  }
}

function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const storedChoice = window.localStorage.getItem('sardaar_cookie_consent');
    if (storedChoice === 'accepted') loadOptionalAnalytics();
    setVisible(storedChoice !== 'accepted' && storedChoice !== 'rejected');
    const openPreferences = () => setVisible(true);
    window.addEventListener('open-cookie-preferences', openPreferences);
    return () => window.removeEventListener('open-cookie-preferences', openPreferences);
  }, []);

  const choose = (accepted: boolean) => {
    window.localStorage.setItem('sardaar_cookie_consent', accepted ? 'accepted' : 'rejected');
    const analyticsWindow = window as Window & { dataLayer?: unknown[] };
    if (accepted) {
      loadOptionalAnalytics();
    } else if (analyticsWindow.dataLayer) {
      analyticsWindow.dataLayer.push(['consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      }]);
    }
    setVisible(false);
  };

  if (!visible) return null;
  return (
    <aside className="fixed inset-x-3 bottom-20 z-[60] mx-auto max-w-3xl border border-foreground/15 bg-background p-5 text-foreground shadow-2xl md:bottom-5 md:p-6" aria-label="Cookie preferences" aria-live="polite">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-xl">
          <h2 className="font-display text-xl">Your privacy choices</h2>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">We use essential storage to remember your choice. Optional Google Analytics and Tag Manager tags load only if you accept. Read our <a href="/privacy-policy" className="font-semibold text-primary underline">privacy policy</a>.</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button type="button" onClick={() => choose(false)} className="rounded-full border border-foreground/20 px-4 py-2 text-xs font-bold">Reject optional</button>
          <button type="button" onClick={() => choose(true)} className="rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground">Accept optional</button>
        </div>
      </div>
    </aside>
  );
}

function Router() {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}><Switch><Route path="/" component={Home} /><Route path="/noida" component={NoidaLanding} /><Route path="/prayagraj" component={PrayagrajLanding} /><Route path="/admin" component={Admin} /><Route path="/about" component={About} /><Route path="/success-story" component={SuccessStory} /><Route path="/menu" component={MenuPage} /><Route path="/gallery" component={Gallery} /><Route path="/locations" component={Locations} /><Route path="/locations/:city" component={LocationDetail} /><Route path="/restaurant-consulting" component={RestaurantConsulting} /><Route path="/franchise" component={Franchise} /><Route path="/franchise/apply" component={Application} /><Route path="/blog" component={Blog} /><Route path="/blog/:slug" component={BlogArticle} /><Route path="/contact" component={Contact} /><Route path="/privacy-policy"><Legal /></Route><Route path="/terms-and-conditions"><Legal terms /></Route><Route component={NotFound} /></Switch></ErrorBoundary>;
}

function App({ staticPath }: { staticPath?: string } = {}) {
  const locationHook = staticPath
    ? Object.assign(
      (): [string, (path: string, ...args: any[]) => any] => [staticPath, () => undefined],
      { searchHook: () => '' },
    )
    : undefined;
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter hook={locationHook} base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><CookieConsent /><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;
