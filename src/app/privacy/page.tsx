import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/lib/site";

const title = "Privacy — The Wall";
const description = "How The Wall handles optional analytics and your privacy choices.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/privacy" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title,
    description,
    url: "/privacy",
    images: [{ url: site.image, width: 1200, height: 630, alt: site.imageAlt }],
  },
  twitter: { card: "summary_large_image", title, description, images: [site.image] },
};

export default function Privacy() {
  return (
    <div className="flex flex-1 flex-col bg-white">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-5 py-12 text-neutral-700 sm:px-8 sm:py-20">
        <h1 className="text-5xl font-extrabold tracking-tight text-neutral-950">A little about privacy.</h1>
        <p className="mt-6 text-lg leading-relaxed">This is a quote wall. You can read, browse, and copy quotes without an account or analytics.</p>
        <section className="mt-10 space-y-4 leading-relaxed">
          <h2 className="text-2xl font-bold text-neutral-950">Analytics is your choice</h2>
          <p>PostHog loads only after you choose “Allow analytics.” It measures page views, quote opens, navigation, copy success or failure, source links, motion controls, outbound links, and browser errors. Events can include page addresses and basic browser and device information.</p>
          <p>The app does not send quote text or clipboard contents as custom event properties. Session replay, heatmaps, surveys, and automatic click capture are disabled. There is no login and the app does not identify you by name or email.</p>
          <p>Analytics uses a random identifier stored in this site’s local browser storage. It is separate from the portfolio site’s storage. IP-based analytics enrichment is disabled; the services handling a network request still receive connection information needed to deliver it. PostHog Cloud processes the analytics data in the United States.</p>
          <p>Use “Analytics settings” below to change your choice. Declining stops new analytics capture and clears this site’s active analytics storage. It does not erase events already sent. Do Not Track and Global Privacy Control browser signals keep analytics off.</p>
        </section>
        <section className="mt-10 space-y-4 leading-relaxed">
          <h2 className="text-2xl font-bold text-neutral-950">Storage and hosting</h2>
          <p>Your analytics choice is saved in local storage on this browser. If storage is blocked, your choice applies for the current page only. The site is hosted by Vercel, which processes network requests and may retain operational or security logs even when optional analytics is off.</p>
          <p>Links to quote sources, GitHub, and X open services with their own privacy practices.</p>
          <p>Questions or a data request? <a href="https://nikhilkr.in" className="underline underline-offset-4">Contact Nikhil through his website</a>. You can also read <a href="https://posthog.com/privacy" className="underline underline-offset-4">PostHog’s privacy policy</a> and <a href="https://vercel.com/legal/privacy-policy" className="underline underline-offset-4">Vercel’s privacy policy</a>.</p>
        </section>
        <Link href="/" className="mt-10 inline-flex min-h-11 items-center font-semibold text-neutral-950 underline underline-offset-4">Back to the wall</Link>
      </main>
    </div>
  );
}
