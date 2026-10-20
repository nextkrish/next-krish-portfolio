# Production readiness and launch checks

## Implemented

- Nine pre-rendered content pages, one server email endpoint, custom errors/404, optimized local images and local Latin font subsets preloaded through next/font.
- Explicit-size responsive project artwork; one-column mobile layout; content-driven chapter spacing; native scrolling; near-viewport word masks without line measurements; offscreen canvas pausing.
- Keyboard navigation, menu focus containment, visible focus, reduced motion, labelled fields/errors and live delivery status. Small-text colors are checked against their page backgrounds. Semantic audit uses axe-core with jsdom; its limits are documented in the JSON report.
- Original monogram favicon at 16/32/48/64px, 512px icon and 180px Apple icon. Regenerate with scripts/prepare-favicon.py using Pillow.
- Gmail SMTP over TLS, fixed recipient, reply-to visitor, safe plain-text body, input/origin/payload validation, a honeypot and a bounded per-process rate limit. Credentials are private server variables.
- Canonical metadata for each page, domain-aware sitemap/robots, consistent social previews and truthful Person/WebSite/CreativeWork/FAQPage structured data. Script JSON is escaped.
- nosniff, frame protection, referrer policy and camera/microphone/location restrictions.

## Before publishing on Vercel

1. Review the local layout and approve hosting. No deployment has been performed.
2. Add GMAIL_USER and GMAIL_APP_PASSWORD to the production environment, never a NEXT_PUBLIC_ variable. Use an app password from a Gmail account with 2-Step Verification.
3. Set NEXT_PUBLIC_SITE_URL to the final HTTPS public origin, or enable Vercel system environment variables so VERCEL_PROJECT_PRODUCTION_URL is available. Preview builds remain non-indexable.
4. Build using the Next.js preset and the normal npm run build command. Do not use static export: the contact endpoint requires a Node.js function. Its max duration is 30 seconds.
5. Send a test enquiry through the deployed form and confirm its arrival in the destination inbox. Check reply-to, failure recovery, mobile navigation and asset caching on that deployment.
6. Run Lighthouse or PageSpeed Insights on the real public deployment (mobile and desktop), fix measured findings, and manually test keyboard/screen reader and physical mobile devices. The non-blocking animated corner loading indicator exits when key content is ready instead of enforcing a three-second wait. Scores must still be measured rather than asserted.
7. Confirm production robots/canonical/sitemap values and submit the sitemap in Google Search Console. Monitor real Core Web Vitals after sufficient traffic.
8. If contact traffic grows across server instances, replace the process-local limit with shared rate limiting, add a server-verified anti-abuse challenge, and move email to a transactional provider with delivery monitoring/retries. The portfolio pages themselves can be served from the CDN.

## Search visibility

Helpful, original project descriptions, clear identity, crawlable links and accurate structured data form the SEO/AEO/GEO foundation. These do not guarantee a number-one ranking, a rich result or inclusion in an AI answer. Google does not require special AI schema or llms.txt for its AI search features.

Official references:
- https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- https://developers.google.com/search/docs/appearance/ai-features
- https://vercel.com/docs/environment-variables/system-environment-variables
- https://support.google.com/accounts/answer/185833
- https://nodemailer.com/usage/using-gmail/

## Verification scope

See artifacts/qa.md and artifacts/accessibility-v14.json for results. Passing the semantic audit is not a 100/100 Lighthouse accessibility score, nor does it establish real-device performance or guarantee search rankings. Local production-preview delivery is verified: Gmail accepted a labelled form submission, the thank-you card appeared, and Krish confirmed arrival in Inbox on 20 October 2026. Repeat the delivery test after deployment with production environment variables.

For step-by-step deployment and the Hobby commercial-use restriction, see [Vercel launch](vercel-launch.md). The site remains local until a hosting choice is confirmed.

## Final v14 verification — 20 October 2026

The final local production homepage Lighthouse 13.5.0 audit measured:

| Audit | Mobile | Desktop |
| --- | ---: | ---: |
| Performance | 85 | 100 |
| Accessibility | 100 | 100 |
| Best practices | 100 | 100 |
| SEO | 66 | 66 |

Mobile LCP was 3.4s, TBT 310ms and CLS 0; desktop LCP 0.7s, TBT 0ms and CLS 0. The requested mobile performance 100 target remains unmet. The SEO blocker is intentional localhost noindex/robots protection, not missing metadata. A public production origin and new production build must enable indexing, followed by another audit. No public score or search position has been verified.

Production build and TypeScript pass. Nine tests pass; all nine content routes/assets/custom 404 pass the production checks. axe-core semantic checks report zero violations on all nine routes. Browser checks cover responsive layouts, Work filtering, route curtain/back recovery, motion-off readability, mobile menu and portrait hover/scroll scatter. Gmail delivery was previously confirmed in Inbox by Krish; no new test email was sent in this revision. See `artifacts/lighthouse-v14.json`, the matching HTML reports, `artifacts/responsive-v14.json`, `artifacts/accessibility-v14.json` and `artifacts/performance-budget-v14.json`.

The hero and homepage project-card structure render on the server. Portrait dots use 1,868 precomputed points, avoiding runtime pixel sampling. Responsive AVIF/WebP hero variants avoid duplicate portrait loading. Text/filter/route reveals use native browser animations; fine-pointer cursor effects retain lazy GSAP. The optional animated loading indicator is in a corner and does not obscure or lock content.

Removed 85 unused images/previews/archive files, 34.67 MiB. The manifest is `artifacts/asset-cleanup-v14.json`; temporary recovery archive: `/private/tmp/nextkrish-unused-assets-20261020.tar.gz`. Needed runtime assets and regeneration sources remain.
