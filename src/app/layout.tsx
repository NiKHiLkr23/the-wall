import type { Metadata, Viewport } from "next";
import {
  Bricolage_Grotesque,
  Caveat,
  Geist_Mono,
  Instrument_Serif,
} from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { AnalyticsPreferences } from "@/components/analytics-preferences";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["wdth", "opsz"],
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: "600",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  applicationName: site.name,
  authors: [{ name: "Nikhil", url: "https://nikhilkr.in" }],
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": "/rss.xml" },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.title,
    description: site.description,
    url: `${site.url}/`,
    locale: "en_US",
    images: [{ url: site.image, width: 1200, height: 630, type: "image/png", alt: site.imageAlt }],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@nikhilkr_tw",
    title: site.title,
    description: site.description,
    images: [{ url: site.image, alt: site.imageAlt }],
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${instrument.variable} ${caveat.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <AnalyticsPreferences />
      </body>
    </html>
  );
}
