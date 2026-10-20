# Next Krish

Krish Kumar's multipage portfolio. The source lives at [nextkrish/next-krish-portfolio](https://github.com/nextkrish/next-krish-portfolio) and deploys from `main` to [nextkrish.netlify.app](https://nextkrish.netlify.app).

## Run

```sh
npm ci
npm run dev
```

Open the printed local address, normally http://127.0.0.1:3000.

Production: `npm run build`, then `npm start`. Requires Node.js 20.9 or later; developed with Node 22. Dependency versions are pinned in package.json and package-lock.json.

## Pages

- Home: portrait interaction, live 3D particle sheet, technology grid, real project gallery, website capabilities, process, clearly marked sample-review layout, FAQ, footer.
- Work: category filters and four real projects.
- Four project detail pages: real captured screens, project overview and visible design decisions, next-project navigation.
- About: supplied portrait, BCA education, résumé download, current technology toolkit, particle sphere.
- Services: website development only — landing pages, business websites, personal websites.
- Contact: validated server-side Gmail delivery, thank-you confirmation, direct email/WhatsApp/social links and prefilled alternatives on failure.
- Custom 404 and error recovery; generated social image, favicon, robots and domain-aware sitemap.

## Motion and responsive layout

The animated corner loading indicator leaves the main content visible and exits when key fonts and the portrait are ready, with a 1.2-second fallback and a 0.35-second exit. The blank white route curtain is retained. Heading word masks preserve the original DOM text and need no line measurement. They prepare near the viewport after fonts settle. An IntersectionObserver starts native Web Animations API transform animations when content enters view; heading masks are prepared near the viewport without line measurement, no page-wide scroll refresh runs, and scroll reveals have no artificial delay. Heading reveals last 1.02 seconds and body/art reveals 0.88 seconds, each 0.3 seconds longer than v13. Services artwork and text begin together. Parent groups do not clip their child observers. Footer text, links and ribbon have viewport entrances; the ribbon no longer runs expensive pointer-driven perspective transforms or a full-footer mask. Native wheel/trackpad scrolling is retained and anchor links use CSS smooth scrolling.

Project artwork has an explicit width and no fixed minimum height, eliminating aspect-ratio overflow. The two-column desktop/tablet gallery becomes one column on mobile. Content determines chapter height rather than viewport minimums. Missing portrait, 3D-object, review-card and footer-button entrances are included. The About particle sphere uses a fixed radius and orthographic camera, including tangential hover movement that preserves its round outline. Canvases have limited pixel density and pause offscreen/hidden. The persistent motion switch and reduced-motion preferences leave content visible. The mobile menu contains keyboard focus, makes background content inert and supports Escape.

Fonts are local Latin subsets, preloaded through next/font with fallback metric adjustment. The supplied monogram is centred in generated multi-resolution favicon, 512px icon and 180px Apple icon files. No new image-generation service is needed for these deterministic assets.

## Content and assets

- `content/profile.json`: supplied identity, links, education, technology list and projects.
- `src/lib/content.ts`: public project presentation copy and FAQ.
- `assets/source/`: preserved supplied portraits and logo.
- `assets/project-captures/`: captured screens from Krish's four supplied live sites.
- `public/images/`: optimized assets consumed by the app.
- `public/Krish-Kumar-Resume.pdf`: actual downloadable résumé.
- `scripts/prepare-assets.mjs`: regenerates optimized assets from originals/captures.
- `scripts/create_resume.py`: regenerates the résumé using the bundled Python/reportlab runtime.
- `design/`: retained research and revision notes. Obsolete concept images have been removed.

Project technology stacks, backend integrations, client relationships, and measurable outcomes are not invented. Sample-review cards are explicitly labelled illustrative and have no invented attribution. Replace them with genuine feedback when available. The About portrait is an AI-generated editorial variant of the supplied photo, saved non-destructively alongside the original. The footer invitation includes a brushed-metal ribbon loop with a viewport reveal and a continuous background through the social links. The footer uses the supplied logo's symbol, clipped through CSS beside separate text, with a vertical fade.

## Contact delivery

The form submits to POST `/api/contact` with the label **Send Inquiry**. It displays a thank-you state only after the server confirms that the email provider accepted the message. Validation/network/provider errors retain the form details and offer prefilled direct email, Gmail and WhatsApp alternatives. No success is fabricated when the provider is missing.

Gmail is the selected provider. In the hidden, ignored `.env.local` file set:

```env
GMAIL_USER=workwithdevskrish@gmail.com
GMAIL_APP_PASSWORD=your_16_character_google_app_password
```

Use a Google **app password**, never the normal Gmail password. [Google setup instructions](https://support.google.com/accounts/answer/185833) require 2-Step Verification. Keep the password out of chat, source control and public `NEXT_PUBLIC_` variables. Restart the local server after configuration. On Netlify, set both values as server environment variables and mark the app password as a secret. TLS is required; credentials are never returned to the browser. Enquiries have a `[New inquiry]` subject, all submitted fields and the visitor's reply-to address. The recipient is fixed to the supplied inbox.

The existing Resend integration remains an optional fallback if its own key and verified sender are configured. The endpoint includes field/payload limits, origin checks, a honeypot and a bounded in-memory rate limit. Gmail acceptance is not a guarantee of inbox placement. For multiple server instances or higher email volume, configure shared rate limiting and a transactional delivery service before scaling the contact endpoint.

Verified on 20 October 2026: Gmail authentication passed after the credential correction. One labelled test was submitted through the local production-preview form; Gmail accepted it, the thank-you card appeared, and Krish confirmed arrival in Inbox. The earlier authentication failure correctly preserved the form and showed an unsent error. Use `npm run verify:email` for a connection-only check after future credential changes, then restart the server. A second labelled test on the public Netlify deployment reached the form’s server-confirmed “Inquiry sent” state, and Krish confirmed its arrival in Inbox.

## Search and deployment

Each page has its own title, description and social metadata. The canonical base uses `NEXT_PUBLIC_SITE_URL`, Netlify's production `URL`, or Vercel's production-domain variable. Local and deploy-preview builds are non-indexable; the production HTTPS domain activates canonical URLs, a nine-page sitemap and crawler access. Profile, website, project and FAQ structured data match real visible content. No invented reviews, ratings or project outcomes are marked up.

See [production readiness](docs/production-readiness.md) for deployment checks and the limits of SEO and automated scores. Netlify deployment is connected to the GitHub repository. No ranking or unmeasured Lighthouse score is promised.

## Checks

```sh
npm run typecheck
npm test
npm run build
npm run qa:production  # run with local production server active
npm run qa:a11y        # server-rendered semantics; not a full Lighthouse score
```

The contact tests cover validation, malformed input, header injection, length bounds and correctly encoded email, Gmail and WhatsApp drafts. Browser QA covers navigation/curtain recovery, Work filtering, native FAQ disclosure, contact-draft preparation, mobile menu, horizontal overflow, the motion toggle and the résumé action. See `artifacts/qa.md` for the completed results and remaining operational limitations.

## Vercel launch guide

See [Vercel launch](docs/vercel-launch.md) only if moving to that host later. The active deployment is on Netlify. Old concepts, obsolete captures and unused image variants were removed; the exact list and recovery location are in artifacts/asset-cleanup-v14.json.

## Netlify deployment

The repository includes `netlify.toml` for a Node 22 Next.js build. Netlify's production `URL` is used automatically for canonical metadata, robots and the sitemap; deploy previews remain non-indexable. Netlify connected the original GitHub repository, published the site at `nextkrish.netlify.app`, and disabled its Powered by Netlify badge. `GMAIL_USER` and a production-only secret `GMAIL_APP_PASSWORD` are configured in Netlify. See [Netlify launch](docs/netlify-launch.md).

Source-image regeneration scripts require the local originals in assets/source and assets/project-captures. Those folders, historical design notes, QA output and output/pdf are ignored by Git and are not part of GitHub-triggered Netlify builds. Normal builds only need the optimized files in public; those must be committed.

Final local homepage audit: desktop 100 performance / 100 accessibility / 100 best practices; mobile 85 / 100 / 100. Local SEO 66 reflects intentional noindex protection. Mobile performance 100 remains unmet. See `artifacts/lighthouse-v14.json` and `docs/production-readiness.md` for exact scope and launch limits.
