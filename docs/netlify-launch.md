# Next Krish on Netlify

The production project is [nextkrish.netlify.app](https://nextkrish.netlify.app), built from the `main` branch of [nextkrish/next-krish-portfolio](https://github.com/nextkrish/next-krish-portfolio). Netlify published the first build from commit `e2158ef` on 20 October 2026. The contact endpoint needs server-side functions, so do not switch the project to a static export.

## Required production variables

Set these in **Netlify → Project configuration → Environment variables**:

| Variable | Purpose |
| --- | --- |
| `GMAIL_USER` | Server-side Gmail account used to deliver enquiries. |
| `GMAIL_APP_PASSWORD` | The existing Google app password. Select **Contains secret values**. Keep it out of Git and chat. |
| `GOOGLE_SITE_VERIFICATION` | Optional Google Search Console verification token. |

Netlify supplies the production `URL` automatically. The application uses it for canonical URLs, sitemap entries, Open Graph metadata and crawler access. Deploy previews remain non-indexable.

## After deployment

1. Confirm `/robots.txt`, `/sitemap.xml`, the résumé and every project page load from the production URL. **Verified on 20 October 2026:** robots allows crawling, the sitemap lists nine canonical URLs, all project pages load, and the résumé returns a PDF.
2. Submit one labelled enquiry and confirm Inbox delivery. **Verified on 20 October 2026:** the live form showed its server-confirmed “Inquiry sent” state, and Krish confirmed delivery to Inbox.
3. Run Lighthouse against the public deployment; local scores are not production guarantees.
4. Add the site to Google Search Console, submit `/sitemap.xml`, and request indexing for the homepage.
5. Put the final site URL on GitHub, LinkedIn, Instagram and YouTube so Google can connect the Next Krish entity consistently.

GitHub-triggered deploys are enabled: commit and push to `main`, then Netlify builds the revision automatically. The Powered by Netlify badge is disabled in Project configuration → General.
