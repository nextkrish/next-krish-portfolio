# Publish Next Krish on Vercel

The local production build and Gmail inquiry flow are ready for review. Nothing has been deployed or connected to an external account automatically.

## Free plan and domain

Vercel Hobby is free for personal, non-commercial projects within its usage limits. Vercel explicitly classifies advertising the sale of a service as commercial use, which needs Pro. This portfolio currently advertises website services, so do not assume Hobby covers its current use; confirm eligibility with Vercel or use Pro/a different free host. A personal non-commercial version can use Hobby. A `*.vercel.app` address is included; a custom domain is optional and normally costs money. A free address can be indexed by Google too.

Official guidance: https://vercel.com/docs/plans/hobby and https://vercel.com/docs/limits/fair-use-guidelines.

## Recommended: GitHub import

1. Create a GitHub repository for this folder. A private repository is fine. Commit the app source, `public`, `content`, package files, config and scripts. Original image sources and QA/history folders stay local; the optimized `public` assets are sufficient to build. `.gitignore` already excludes `.env.local`, `node_modules`, `.next` and temporary files. Never upload the Gmail app password. This directory is not a Git repository yet.
2. Sign in to Vercel, select **Add New → Project**, and import that repository. Choose a project name such as `next-krish` if available.
3. Keep the **Next.js** framework preset, root directory `./`, install command `npm ci`, build command `npm run build`, and the default output directory. Select a supported Node version at least 20.9 (Node 22 was used locally). Do not choose static export: the contact form needs a server function.
4. Under project environment variables, add:

| Variable | Value | Environment |
| --- | --- | --- |
| `GMAIL_USER` | `workwithdevskrish@gmail.com` | Production |
| `GMAIL_APP_PASSWORD` | The same working Google app password saved locally | Production; mark sensitive |
| `NEXT_PUBLIC_SITE_URL` | The final HTTPS production origin, e.g. the actual assigned `https://your-project.vercel.app` | Production |
| `GOOGLE_SITE_VERIFICATION` | Optional Search Console HTML verification token, after adding the property | Production |

Keep email credentials server-only; never prefix them with `NEXT_PUBLIC_`. Enter them directly in Vercel, not in chat or GitHub. Preview builds stay non-indexable even if a production URL exists.

5. Click **Deploy**. If the final public URL was unknown before the first build, set `NEXT_PUBLIC_SITE_URL` after it is assigned and **redeploy**. Metadata, robots and sitemap are generated at build time. The app can also use Vercel's `VERCEL_PROJECT_PRODUCTION_URL` system variable when available.
6. Open all pages on the real deployment. Test one inquiry and confirm Inbox arrival, mobile menu, keyboard navigation, résumé download and direct contact links. Gmail sending was verified locally; a new hosting environment still needs its own delivery check.
7. Run mobile and desktop Lighthouse on that public address. Confirm `/robots.txt` allows the site, `/sitemap.xml` contains all nine real URLs, page metadata has `index, follow`, and canonical URLs use only the production domain.

Git import: https://vercel.com/docs/git. Environment variables: https://vercel.com/docs/environment-variables.

## Make “Next Krish” discoverable

1. Add the final origin to Google Search Console as a URL-prefix property (or use a domain property when you own a custom domain).
2. Complete ownership verification. For HTML-token verification, set `GOOGLE_SITE_VERIFICATION` and redeploy.
3. Submit `/sitemap.xml`, then inspect the homepage URL and request indexing.
4. Put the same final portfolio URL on your GitHub profile, LinkedIn, Instagram and YouTube. Keep **Next Krish / Krish Kumar** consistent.
5. Keep the four real project pages useful and current. Add genuine project details and real feedback as it becomes available.

The app includes brand-led titles/descriptions, crawlable project pages, social metadata, Person/WebSite/CreativeWork/FAQ structured data and brand aliases. Google ignores meta-keyword tags; adding a list of keywords cannot ensure ranking. Indexing takes time and neither a 100 SEO audit nor a domain guarantees the first position.

Official references: https://developers.google.com/search/docs/appearance/site-names and https://developers.google.com/search/docs/fundamentals/seo-starter-guide.

## Operational limits

The current inquiry rate limit is per server process. Before larger traffic or multiple instances, use a shared limit and monitored transactional email delivery. Keep the app password private and rotate it if exposed. Do not deploy `.env.local` as a file. `.vercelignore` excludes private/local QA/source-image folders from CLI uploads.

## First Git commit (run after creating your empty GitHub repository)

```sh
cd /Users/mac/PORTFOLIO-NEXT-KRISH
git init
git add .
git status
git commit -m "Build Next Krish portfolio"
git branch -M main
```

Check that `.env.local` is absent from `git status`. Then use the remote URL shown by your own GitHub repository and its push instructions; do not copy a made-up remote URL. Import that repository into Vercel.
