import { site } from "@/lib/site";

export function SiteStructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: `${site.url}/`,
        name: site.name,
        alternateName: "the-wall",
        description: site.description,
        inLanguage: "en",
        creator: {
          "@type": "Person",
          name: "Nikhil",
          url: "https://nikhilkr.in",
        },
      },
      {
        "@type": "CollectionPage",
        "@id": `${site.url}/#webpage`,
        url: `${site.url}/`,
        name: site.title,
        description: site.description,
        isPartOf: { "@id": `${site.url}/#website` },
        image: new URL(site.image, site.url).href,
        inLanguage: "en",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
