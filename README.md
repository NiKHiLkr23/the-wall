# The Wall

A simple quote wall at [the-wall.nikhilkr.in](https://the-wall.nikhilkr.in).

## Add a quote

Edit [`quotes.json`](quotes.json). Every entry appears on the wall in file order.
Copy an existing entry or add:

```json
{
  "id": "a-unique-id",
  "text": "Your quote here.",
  "author": "Who said it",
  "source": "Where you found it",
  "sourceUrl": "https://example.com/original-source",
  "kind": "internet"
}
```

Use a unique `id`. `sourceUrl` is optional; `kind` can be `famous` or `internet`.
Existing attribution and source-detail fields preserve the evidence behind older
entries; you do not need to add those fields for a new quote. Preserve uncertainty
when editing them.

The RSS feed reads the same file in reverse order. Append new entries to the end
to put them first in the feed. Optional `addedAt` dates use `YYYY-MM-DD` and mean
the date added to this collection.

Saving updates the local site. Commit and push when ready to publish through
Vercel. After the first push, connect this GitHub repo to the existing **the-wall**
Vercel project and use `main` as the production branch for automatic deployments.

## Development

Requires Node.js 22+ and npm.

```sh
npm ci
npm run dev
```

Open [localhost:4317](http://localhost:4317).

- `src/app/page.tsx` — page composition and quote collection import.
- `src/components/` — header, hero, logo, quote wall, marquee strips, quote dialog, footer, and UI primitives.
- `src/lib/analytics.ts` — PostHog initialization and event tracking.
- `src/lib/site.ts` — shared production URL, search/share title, description, and social image.
- `src/types/quote.ts` — shared quote type.
- `quotes.json` — the single quote collection.
- `src/app/layout.tsx` and `globals.css` — Next.js page shell, fonts, metadata, and styles.
- `public/` — static social image and icons.

Use `npm run lint`, `npm run typecheck`, and `npm run build` to check changes.
`npm run start` serves the production build on port 4317.

## Search and sharing

- `/robots.txt` allows crawling and points to `/sitemap.xml`.
- `/sitemap.xml` lists the canonical homepage. Quotes live on the wall rather than separate pages.
- `/rss.xml` is an RSS 2.0 feed generated from `quotes.json`, with stable IDs, source evidence, and attribution notes. Feed readers discover it through the homepage's alternate link.
- The homepage includes canonical, robots, Open Graph, Twitter Card, and `WebSite`/`CollectionPage` structured data.
- `public/og.png` is the static 1200 × 630 share image; icons are static PNGs too.

After publishing, submit `https://the-wall.nikhilkr.in/sitemap.xml` in Google Search
Console and inspect the homepage URL. Domain verification, if requested, comes
from your Search Console account; no placeholder verification token is included.

## Analytics

PostHog uses the existing **portfolio** project (171413, US Cloud).
The two variables in `.env.example` are already configured on Vercel; use
`.env.local` for local configuration. Analytics runs only in production on
`the-wall.nikhilkr.in`. Filter by `site = the-wall` or the Wall hostname.

## License

The application code is available under the [MIT License](LICENSE). Quotation
text and the works it comes from belong to their respective rights holders and
are excluded from that license. Third-party assets retain their own licenses.
