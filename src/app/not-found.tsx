import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col bg-white text-neutral-950">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-5 py-24 sm:px-8">
        <p className="font-mono text-sm tracking-[0.2em] text-orange-600">404</p>
        <h1 className="mt-5 max-w-2xl text-5xl leading-none font-extrabold tracking-tight sm:text-7xl">
          Nothing on this wall.
        </h1>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-neutral-600">
          This page wandered off. The quotes are back this way.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-11 w-fit items-center rounded-lg bg-neutral-950 px-5 py-3 font-semibold text-white transition-colors hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-600"
        >
          Back to the wall <span className="ml-3" aria-hidden="true">↗</span>
        </Link>
      </main>
    </div>
  );
}
