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

A full-viewport loader runs once per document open/reload. It waits briefly for key fonts and the portrait, with an 850ms minimum measured from navigation (not added after hydration), a 1.6-second deadline and a 560ms upward exit. It does not return during internal navigation. The blank white route curtain covers in 300ms and clears in 420ms, without the old extra font wait. Internal links prefetch on hover/focus.

Heading word masks preserve the original text, emphasis and accessible name without measuring line wraps. Paired approach/entrance observers prepare nearby masks and start Web Animations: headings and visuals run for 1.25 seconds; body reveals run for 1.05 seconds. Each project/service card owns one coordinated card, artwork and text sequence. The shared footer has its own lifetime, so route changes and repeated scrolling do not replay its completed entrance. Lenis 1.3.27 smooths fine-pointer wheel input while keeping native document scrolling. Touch and keyboard remain native, and both reduced-motion and the motion toggle bypass the effects. Anchor offsets are applied once rather than accumulating three offsets.

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

The latest measured v15 audit results and their limits are recorded in `docs/production-readiness.md`. Local SEO 66 reflects intentional localhost noindex protection; local scores are not guarantees for Netlify or real devices.
