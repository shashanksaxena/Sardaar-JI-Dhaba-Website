# Website compliance and SEO owner checklist

This checklist separates repository changes from facts and operational controls that must be confirmed by the business owner. It is not a legal opinion or a certificate of compliance.

## Implemented in the website branch

- [x] Optional Google Analytics, Google Tag Manager and first-party interaction tracking are loaded only after explicit analytics opt-in.
- [x] Rejecting or withdrawing analytics consent updates Google Consent Mode to denied; first-party event requests stop.
- [x] Enquiry forms show purpose-specific data notices and require affirmative consent.
- [x] Enquiry API rejects filled honeypots, validates consent and records the consent timestamp and notice version.
- [x] API request bodies are limited to 10 KB; API responses use `Cache-Control: no-store` and baseline security headers.
- [x] City pages use canonical `/locations/noida` and `/locations/prayagraj` URLs; legacy city paths redirect.
- [x] Noida opening hours are not published until verified. Prayagraj hours are outlet-specific.
- [x] Google Maps is no longer embedded automatically; a visitor opens the external map only after selecting the directions link.
- [x] FSSAI Food Safety Connect information and direct Android/iPhone app links are in the footer.
- [x] The site can display each outlet's FSSAI licence number and a supplied QR image/link.
- [x] Unknown dietary classifications are not guessed; incomplete menu descriptions are removed and unlisted prices are labelled for confirmation.
- [x] Franchise copy avoids unverified fee, return, payback and profit claims.
- [x] Restaurant, local outlet, FAQ, service, article, menu and eligible recipe structured data are generated from page content.
- [x] Recipe structured data is withheld unless the article has its own matching dish photo.
- [x] Social preview images are generated as 1200 x 630 JPEGs from existing approved restaurant photography.
- [x] SEO build checks cover canonical URLs, titles/descriptions, one H1, JSON-LD, sitemap, redirects, admin noindex, OG assets, image alt text, missing image files and security headers.
- [x] Cloudflare Pages `_headers` adds baseline security/privacy headers.

## Owner confirmation required before calling the site fully compliant

### Food safety and restaurant information

- [ ] Provide the current FSSAI licence/registration number for the Noida premises.
- [ ] Provide the current FSSAI licence/registration number for the Prayagraj premises.
- [ ] Provide the Food Safety Connect QR image from each current licence/registration certificate, if you want the actual QR displayed on the website.
- [ ] Confirm the prescribed Food Safety Display Board and licence/registration certificate are displayed in customer-visible areas at each premises.
- [ ] Confirm the exact Noida postal address, PIN code and current opening hours.
- [ ] Confirm the current Prayagraj opening hours and the Google Business Profile URL for each outlet.
- [ ] Verify every menu item's current price, vegetarian/non-vegetarian classification, major allergens and preparation/cross-contact information.
- [ ] Confirm whether menu prices include applicable taxes and whether any other charges apply; the site must not imply an unverified tax or service-charge treatment.

FSSAI's 1 August 2025 press release asks food businesses, including restaurants and dhabas, to display the licence/registration certificate with the Food Safety Connect QR code in customer-visible areas and to feature the QR code or a direct app-download link on digital assets, including websites and online-ordering platforms, wherever applicable:
https://fssai.gov.in/upload/uploadfiles/files/Press%20Release_Food%20Safety%20Connect%20App%20QR%20Code.pdf

### Privacy and data governance

- [ ] Confirm the full legal name and legal form of the business that should be identified in the privacy policy (proprietorship, partnership, company, etc.).
- [ ] Confirm the person/role responsible for privacy and grievance requests.
- [ ] Approve an actual enquiry-data retention and deletion schedule. The code currently records enquiry timestamps but does not automatically delete old enquiries.
- [ ] Confirm who can access enquiry records and the process for handling access, correction, withdrawal and erasure requests.
- [ ] Review the Google Tag Manager container and confirm that every tag loaded after consent is within the scope described in the consent notice. No container-level tag audit was possible from repository access alone.
- [ ] Confirm the hosting, database and other data processors and their applicable privacy/security arrangements.

### Security, hosting and accessibility

- [ ] Configure and verify the canonical host redirects (HTTP and www to HTTPS apex) in the Cloudflare dashboard. Repository redirects cannot configure domain-level rules.
- [ ] Configure production API rate limiting and bot protection (for example, Cloudflare Turnstile/WAF). The current form honeypot is only a basic anti-spam measure.
- [ ] Review and configure an appropriate Content-Security-Policy after verifying all production script, font and image sources; a strict CSP was not added because it could break unreviewed GTM tags.
- [ ] Verify production TLS/HSTS, backups, admin access controls and database permissions.
- [ ] Run a production accessibility audit against WCAG 2.2 AA, including keyboard-only and screen-reader checks. The repository checks alt text but do not certify accessibility.

## SEO launch and monitoring

- [ ] Connect Google Search Console and verify the canonical domain.
- [ ] Submit `https://sardaarjidhaba.com/sitemap.xml` and inspect the canonical homepage, franchise page and both location pages.
- [ ] Connect/verify the two Google Business Profiles and keep name, address, phone, hours, categories, photos and website URL consistent.
- [ ] Replace generic/reused recipe imagery with original dish-specific photos. Current recipe rich-result markup is intentionally limited to matching images.
- [ ] Run Google's Rich Results Test on eligible recipe pages and LocalBusiness/Restaurant pages after deployment.
- [ ] Measure mobile Core Web Vitals and page experience on the deployed site.
- [ ] Track Search Console impressions, clicks, queries, indexing and local landing-page performance over 4–8 weeks; rankings cannot be guaranteed by metadata or schema changes alone.

## Release status

The source changes are on the review branch and in a draft pull request. Production HTTP behaviour, host redirects, live indexing, Google Business Profile data and real-world outlet compliance still require post-deployment and owner verification.
