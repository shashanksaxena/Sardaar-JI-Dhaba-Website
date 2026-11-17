# SEO Assets And Redirects

## Social Images

The build currently generates 1200 x 630 JPEG previews at these paths from existing restaurant photography. Replace the source photos in `scripts/convert-images.mjs` with approved, page-specific branded photos when available. Blog posts use their own article image when it accurately represents the post.

- `/images/og/home-1200x630.jpg`
- `/images/og/about-1200x630.jpg`
- `/images/og/menu-1200x630.jpg`
- `/images/og/gallery-1200x630.jpg`
- `/images/og/locations-1200x630.jpg`
- `/images/og/noida-1200x630.jpg`
- `/images/og/prayagraj-1200x630.jpg`
- `/images/og/success-story-1200x630.jpg`
- `/images/og/franchise-1200x630.jpg`
- `/images/og/blog-1200x630.jpg`
- `/images/og/contact-1200x630.jpg`

The legal pages use the home image. The existing article images are currently used for blog-post social previews.

## Legacy Blog Redirects

The build emits the verified legacy article and city aliases in `public/_redirects`. Redirect destinations use the final trailing-slash page URL so visitors and crawlers do not take an extra redirect to Cloudflare Pages' clean URL. The retired restaurant billing/POS software articles point to PetuPOS because it is the directly relevant product site.

Do not guess destinations for additional Search Console 404s or redirect errors. Export the affected URL samples from Search Console, confirm a relevant replacement for each URL, and only then add a permanent redirect. URLs with no equivalent replacement should remain not found rather than redirecting to unrelated content.

The generated sitemap, canonical tags, Open Graph URLs, structured page URLs, and internal page links use trailing slashes for non-root pages. Rebuild and run `pnpm run seo:check` after changing routes or redirects.

## Canonical Host

Use Cloudflare Redirect Rules for host-wide redirects because Pages `_redirects` only handles path redirects. Add permanent (301) rules that preserve the path and query string for:

- `http://sardaarjidhaba.com/*` to `https://sardaarjidhaba.com/$1`
- `https://www.sardaarjidhaba.com/*` to `https://sardaarjidhaba.com/$1`
- `http://www.sardaarjidhaba.com/*` to `https://sardaarjidhaba.com/$1`

Ensure the apex domain is attached to the Pages project and redirects are evaluated before serving assets. These host-wide rules must be verified in the Cloudflare dashboard; they are not created by the repository build.