import { Hero } from "@/components/hero";
import { QuoteWall } from "@/components/quote-wall";
import { SiteHeader } from "@/components/site-header";
import { SiteStructuredData } from "@/components/seo";
import quotes from "../../quotes.json";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-white">
      <SiteStructuredData />
      <SiteHeader />
      <QuoteWall quotes={quotes} hero={<Hero />} />
    </div>
  );
}
