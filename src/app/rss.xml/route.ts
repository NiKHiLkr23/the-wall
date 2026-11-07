import quotes from "../../../quotes.json";
import { site } from "@/lib/site";
import type { Quote } from "@/types/quote";

function escapeXml(value: string) {
  return value.replace(/[<>&"']/g, (character) => {
    const entities: Record<string, string> = {
      "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;",
    };
    return entities[character];
  });
}

function item(quote: Quote) {
  const sourceUrl = quote.sourceUrl ?? quote.sourceDetails?.url;
  const description = [
    `“${quote.text}” — ${quote.author}`,
    `Source: ${quote.source}`,
    sourceUrl,
    quote.sourceDetails?.locator,
    quote.sourceDetails?.speaker && `Speaker: ${quote.sourceDetails.speaker}`,
    quote.attribution && `Attribution: ${quote.attribution.name} (${quote.attribution.status}). ${quote.attribution.note ?? ""}`,
    quote.textForm && `Text form: ${quote.textForm}`,
    quote.originalSource && `Original source: ${[quote.originalSource.title, quote.originalSource.url, quote.originalSource.locator].filter(Boolean).join(" — ")}`,
  ].filter(Boolean).join("\n\n");

  // Collection dates are optional. Never invent a publication date for an entry.
  const addedAt = quote.addedAt && /^\d{4}-\d{2}-\d{2}$/.test(quote.addedAt)
    ? new Date(`${quote.addedAt}T00:00:00Z`)
    : undefined;
  const date = addedAt && !Number.isNaN(addedAt.getTime()) && addedAt.toISOString().slice(0, 10) === quote.addedAt
    ? `<pubDate>${addedAt.toUTCString()}</pubDate>`
    : "";

  return `<item>
    <title>${escapeXml(`${quote.text} — ${quote.author}`)}</title>
    <link>${escapeXml(`${site.url}/#${encodeURIComponent(quote.id)}`)}</link>
    <guid isPermaLink="false">${escapeXml(`the-wall:${quote.id}`)}</guid>
    <description>${escapeXml(description)}</description>
    ${date}
  </item>`;
}

export function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(site.title)}</title>
    <link>${site.url}/</link>
    <description>${escapeXml(site.description)}</description>
    <language>en</language>
    <atom:link href="${site.url}/rss.xml" rel="self" type="application/rss+xml" />
    ${[...quotes].reverse().map(item).join("\n")}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
      "X-Robots-Tag": "noindex",
    },
  });
}
