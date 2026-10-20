# Publish Next Krish on Netlify

This repository is configured for Netlify's Next.js integration. The contact endpoint needs server-side functions, so do not switch the project to a static export.

## Required production variables

Set these in **Netlify → Site configuration → Environment variables**:

| Variable | Purpose |
| --- | --- |
| `GMAIL_USER` | Server-side Gmail account used to deliver enquiries. |
| `GMAIL_APP_PASSWORD` | The existing Google app password. Keep it secret. |
| `GOOGLE_SITE_VERIFICATION` | Optional Google Search Console verification token. |

Netlify supplies the production `URL` automatically. The application uses it for canonical URLs, sitemap entries, Open Graph metadata and crawler access. Deploy previews remain non-indexable.

## After deployment

1. Confirm `/robots.txt`, `/sitemap.xml`, the résumé and every project page load from the production URL.
2. Submit one labelled enquiry and confirm Inbox delivery.
3. Run Lighthouse against the public deployment; local scores are not production guarantees.
4. Add the site to Google Search Console, submit `/sitemap.xml`, and request indexing for the homepage.
5. Put the final site URL on GitHub, LinkedIn, Instagram and YouTube so Google can connect the Next Krish entity consistently.

GitHub-triggered deploys should be used for future updates: commit and push to `main`, then Netlify builds the revision automatically.
