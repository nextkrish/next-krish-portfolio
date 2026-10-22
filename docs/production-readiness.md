# Production readiness and launch checks

## Implemented

- Nine pre-rendered content pages, one server email endpoint, custom errors/404, optimized local images and local Latin font subsets preloaded through next/font.
- Explicit-size responsive project artwork; one-column mobile layout; content-driven chapter spacing; Lenis fine-pointer scrolling and native touch scrolling; word masks without line measurements; offscreen canvas pausing.
- Keyboard navigation, menu focus containment, visible focus, reduced motion, labelled fields/errors and live delivery status. Small-text colors are checked against their page backgrounds. Semantic audit uses axe-core with jsdom; its limits are documented in the JSON report.
- Original monogram favicon at 16/32/48/64px, 512px icon and 180px Apple icon. Regenerate with scripts/prepare-favicon.py using Pillow.
- Gmail SMTP over TLS, fixed recipient, reply-to visitor, safe plain-text body, input/origin/payload validation, a honeypot and a bounded per-process rate limit. Credentials are private server variables.
- Canonical metadata for each page, domain-aware sitemap/robots, consistent social previews and truthful Person/WebSite/CreativeWork/FAQPage structured data. Script JSON is escaped.
- nosniff, frame protection, referrer policy and camera/microphone/location restrictions.

## Netlify launch status

1. **Done:** The owner approved publishing. [nextkrish.netlify.app](https://nextkrish.netlify.app) is public and deploys automatically from `main` on GitHub.
2. **Done:** `GMAIL_USER` and a production-only secret `GMAIL_APP_PASSWORD` are in Netlify. The production Next.js build deployed one server function; static export is not used.
3. **Done:** Netlify's `URL` sets the HTTPS canonical origin. The public homepage reports `index, follow`, robots permits crawling, and the sitemap lists all nine pages. Deploy previews remain non-indexable.
4. **Done:** A labelled inquiry submitted through the public contact form reached the server-confirmed “Inquiry sent” state, and Krish confirmed Inbox receipt. The reply-to address should be checked separately.
5. **Next:** Run Lighthouse or PageSpeed Insights on the public deployment (mobile and desktop), then manually test keyboard/screen reader behavior and physical mobile devices. Automated scores vary by device and network.
6. **Done:** Search Console ownership is verified, the sitemap processed successfully with nine discovered pages, and Google accepted the homepage indexing request on 22 October 2026. Monitor indexing and real Core Web Vitals after sufficient traffic.
7. If contact traffic grows across server instances, replace the process-local limit with shared rate limiting, add a server-verified anti-abuse challenge, and move email to a transactional provider with delivery monitoring/retries. The portfolio pages themselves can be served from the CDN.

## Search visibility

Helpful, original project descriptions, clear identity, crawlable links and accurate structured data form the SEO/AEO/GEO foundation. These do not guarantee a number-one ranking, a rich result or inclusion in an AI answer. Google does not require special AI schema or llms.txt for its AI search features.

Official references:
- https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- https://developers.google.com/search/docs/appearance/ai-features
- https://docs.netlify.com/environment-variables/overview/
- https://support.google.com/accounts/answer/185833
- https://nodemailer.com/usage/using-gmail/

## Verification scope

See artifacts/qa.md and artifacts/accessibility-v14.json for results. Passing the semantic audit is not a 100/100 Lighthouse accessibility score, nor does it establish real-device performance or guarantee search rankings. Local production-preview delivery is verified: Gmail accepted a labelled form submission, the thank-you card appeared, and Krish confirmed arrival in Inbox on 20 October 2026. The live Netlify form also reached its server-confirmed success state on 20 October 2026, and Krish confirmed Inbox receipt.

For ongoing operations, see [Netlify launch](netlify-launch.md). [Vercel launch](vercel-launch.md) is retained only as a migration reference.

## Final v14 verification — 20 October 2026

The final local production homepage Lighthouse 13.5.0 audit measured:

| Audit | Mobile | Desktop |
| --- | ---: | ---: |
| Performance | 85 | 100 |
| Accessibility | 100 | 100 |
| Best practices | 100 | 100 |
| SEO | 66 | 66 |

Mobile LCP was 3.4s, TBT 310ms and CLS 0; desktop LCP 0.7s, TBT 0ms and CLS 0. The requested mobile performance 100 target remains unmet. The local SEO score reflects intentional localhost noindex/robots protection. The public Netlify build has indexable metadata and a live sitemap, but no public Lighthouse score or search position has been verified.

Production build and TypeScript pass. Nine tests pass; all nine content routes/assets/custom 404 pass the production checks. axe-core semantic checks report zero violations on all nine routes. Browser checks cover responsive layouts, Work filtering, route curtain/back recovery, motion-off readability, mobile menu and portrait hover/scroll scatter. Gmail delivery was previously confirmed in Inbox by Krish; no new test email was sent in this revision. See `artifacts/lighthouse-v14.json`, the matching HTML reports, `artifacts/responsive-v14.json`, `artifacts/accessibility-v14.json` and `artifacts/performance-budget-v14.json`.

The hero and homepage project-card structure render on the server. Portrait dots use 1,868 precomputed points, avoiding runtime pixel sampling. Responsive AVIF/WebP hero variants avoid duplicate portrait loading. Text/filter/route reveals use native browser animations; fine-pointer cursor effects retain lazy GSAP. The optional animated loading indicator is in a corner and does not obscure or lock content.

Removed 85 unused images/previews/archive files, 34.67 MiB. The manifest is `artifacts/asset-cleanup-v14.json`; temporary recovery archive: `/private/tmp/nextkrish-unused-assets-20261020.tar.gz`. Needed runtime assets and regeneration sources remain.


## Motion revision v15 — 22 October 2026

- Restored the full-screen loading chapter and coordinated page entrances with its exit. Loader timing includes time before hydration, preventing an additional wait on slower phones. Reduced the route curtain from 1.72 seconds of animation to 0.72 seconds, plus route/network time.
- Added Lenis 1.3.27 for fine-pointer wheel smoothing. Native scroll keys cancel pending wheel inertia before their default action. Touch, keyboard, focus navigation and reduced-motion behavior retain native scrolling. Menu/loading/route locks stop and resume the same instance.
- Replaced independently nested project/service entrances with one sequence per card. The shared footer is observed once independently of page route effects. Completed reveals remain completed when scrolling back.
- Mask padding travels with each word, preserving italic overhangs and punctuation. Hover bounds are cached; scroll callbacks avoid repeated React state changes. The first Work image is preloaded, project image sizes match the actual grid, and Work filter counts have sufficient contrast.
- Production build, TypeScript and all 12 tests pass. The added regressions cover footer replay prevention, accessible mask cleanup, card ownership, filtered cards and curtain coordination. All nine content routes/assets/custom 404 pass production checks. The semantic axe audit reports zero violations on all nine pages.
- Browser checks cover 15 route/viewport combinations at 320, 393, 768 and 1440 pixels with no horizontal overflow. Also checked filtering, mobile menu navigation, motion-off readability, one entrance per project card, footer persistence across navigation, full-screen loader geometry, blank curtain completion and intact footer punctuation.
- No new enquiry email was sent during this visual revision. The previously confirmed delivery integration and search metadata are retained.

Reports and screenshots are local ignored artifacts under `artifacts/`, with the `v15` suffix. They are measurements of the local optimized production preview, not production-site promises. Desktop and mobile Lighthouse audits run sequentially to avoid competing for CPU. The full-screen loader is an intentional opening animation with a bounded wait; a 100 performance score is not guaranteed.


### Local Lighthouse measurements

Lighthouse 13.5.0, simulated mobile / desktop, sequential runs:

| Page / device | Performance | Accessibility | Best practices | SEO |
| --- | ---: | ---: | ---: | ---: |
| Home / desktop | 99 | 100 | 100 | 66 |
| Home / mobile, final local run | 75 | 100 | 100 | 66 |
| Work / mobile, final local run | 79 | 100 | 100 | 66 |

Mobile runs varied substantially during this session (Home 75–93; Work 79–91). Background CPU activity was present on the host. The final local runs are retained rather than selecting only the highest scores. Their LCP was about 3.5s; total blocking time was 565ms for Home and 440ms for Work. CLS was zero in all three runs. Local SEO 66 reflects intentional localhost noindex/robots protection. These results do not establish a mobile performance improvement on the public deployment; verify that separately. See `artifacts/lighthouse-v15.json` and the matching full reports.
