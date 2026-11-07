import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  // Quotes are anchors on this page, not separate indexable pages.
  return [{ url: `${site.url}/` }];
}
