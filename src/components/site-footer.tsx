"use client";

import { useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { captureWallEvent } from "@/lib/analytics";

const easeOutExpo = [0.16, 1, 0.3, 1] as const;

const suggestQuoteUrl = `https://x.com/intent/post?text=${encodeURIComponent(
  "@nikhilkr_tw a quote for the-wall: "
)}`;

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

function trackFooterLink(destination: string) {
  captureWallEvent("outbound_link_clicked", {
    destination,
    source: "wall_footer",
  });
}

function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 14.6 5.5 22H2.3l7.4-8.5L.8 2h6.5l4.5 6.8L18.9 2Zm-1.1 18h1.7L6.4 3.9H4.6L17.8 20Z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.77-.24.77-.54v-2.1c-3.13.68-3.79-1.33-3.79-1.33-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 1.72 2.63 1.22 3.27.93.1-.73.39-1.22.71-1.5-2.5-.28-5.13-1.25-5.13-5.54 0-1.22.44-2.22 1.16-3-.12-.28-.5-1.43.11-2.98 0 0 .95-.3 3.08 1.15a10.7 10.7 0 0 1 5.61 0c2.14-1.45 3.08-1.15 3.08-1.15.61 1.55.23 2.7.12 2.98a4.32 4.32 0 0 1 1.15 3.01c0 4.3-2.64 5.25-5.15 5.53.4.35.76 1.03.76 2.08v3.1c0 .3.2.65.77.54A11.2 11.2 0 0 0 12 .8Z" />
    </svg>
  );
}

// Half-circle punches where the stub tears away from the ticket.
function Notch({ side }: { side: "left" | "right" }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute top-0 size-6 -translate-y-1/2 rounded-full border-[1.5px] border-dashed border-neutral-300 bg-white ${
        side === "left"
          ? "-left-[13.5px] [clip-path:inset(0_0_0_50%)]"
          : "-right-[13.5px] [clip-path:inset(0_50%_0_0)]"
      }`}
    >
      <span
        className={`absolute top-0 h-full w-[calc(50%+2px)] bg-white ${
          side === "left" ? "-left-0.5" : "-right-0.5"
        }`}
      />
    </span>
  );
}

export function SiteFooter({
  quoteCount,
  lastAdded,
}: {
  quoteCount: number;
  lastAdded?: string;
}) {
  const noteRef = useRef<HTMLDivElement>(null);
  const inView = useInView(noteRef, { once: true, margin: "0px 0px -60px 0px" });
  const reduceMotion = useReducedMotion();
  const [pointing, setPointing] = useState(false);
  const drawn = inView || reduceMotion;

  const stats = [
    ["Quotes", String(quoteCount)],
    ...(lastAdded
      ? [["Last added", dateFormat.format(new Date(`${lastAdded}T00:00:00Z`))]]
      : []),
    ["Curator", "Nikhil"],
  ];

  return (
    <footer className="px-5 pt-16 pb-12 sm:px-8 sm:pt-24 sm:pb-16">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -40px 0px" }}
        transition={{ duration: 0.9, ease: easeOutExpo }}
        className="relative mx-auto max-w-3xl rounded-2xl border-[1.5px] border-dashed border-neutral-300 bg-white text-neutral-950"
      >
        <div className="px-6 pt-10 pb-10 text-center sm:pt-14 sm:pb-12">
          <p className="font-mono text-[0.6875rem] tracking-[0.16em] text-neutral-400 uppercase">
            Admit one · the-wall
          </p>
          <h2 className="mt-5 text-4xl leading-[1.05] font-medium tracking-tight sm:text-[3.25rem]">
            That&apos;s the wall for now.
            <span className="mt-1 block font-serif font-normal tracking-normal text-orange-600 italic">
              Go do something worth quoting.
            </span>
          </h2>
          <p className="mt-5 font-serif text-2xl text-neutral-700 italic sm:text-3xl">
            — Nikhil
          </p>
        </div>

        <div className="relative border-t-[1.5px] border-dashed border-neutral-300">
          <Notch side="left" />
          <Notch side="right" />

          <div className="flex flex-col-reverse gap-8 px-6 pt-28 pb-6 sm:flex-row sm:items-end sm:justify-between sm:px-8 sm:pt-24 sm:pb-7">
            <dl className="flex gap-6 font-mono text-[0.6875rem] tracking-[0.12em] text-neutral-500 uppercase sm:gap-8">
              {stats.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd className="mt-1 text-sm tracking-normal text-neutral-950 normal-case">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>

            <nav aria-label="Footer links" className="flex items-center justify-end gap-2">
              <a
                href="https://nikhilkr.in"
                onClick={() => trackFooterLink("portfolio")}
                className="inline-flex h-11 items-center rounded-full border border-neutral-200 px-4 text-sm font-semibold transition-colors hover:border-neutral-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
              >
                nikhilkr.in
              </a>
              <a
                href="https://github.com/NiKHiLkr23/the-wall"
                onClick={() => trackFooterLink("repository")}
                aria-label="the-wall on GitHub"
                className="inline-flex size-11 items-center justify-center rounded-full border border-neutral-200 transition-colors hover:border-neutral-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
              >
                <GitHubIcon />
              </a>

              <div className="relative">
                <div
                  ref={noteRef}
                  className="pointer-events-none absolute right-1/2 bottom-full mb-1 w-44 sm:w-52"
                >
                  <motion.a
                    href={suggestQuoteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackFooterLink("suggest_quote")}
                    onPointerEnter={() => setPointing(true)}
                    onPointerLeave={() => setPointing(false)}
                    onFocus={() => setPointing(true)}
                    onBlur={() => setPointing(false)}
                    initial={reduceMotion ? false : { opacity: 0, rotate: -12, y: 6 }}
                    animate={drawn ? { opacity: 1, rotate: -6, y: 0 } : undefined}
                    transition={{ duration: 0.5, ease: easeOutExpo }}
                    className="pointer-events-auto block w-max origin-bottom-left font-hand text-[1.75rem] leading-none text-orange-600 underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-600"
                  >
                    Suggest a quote!
                    <span className="sr-only"> (opens a post on X)</span>
                  </motion.a>
                  <svg
                    viewBox="0 0 120 56"
                    fill="none"
                    aria-hidden="true"
                    className="mt-0.5 ml-auto block h-12 w-[6.5rem] overflow-visible text-orange-600"
                  >
                    <motion.path
                      d="M4 10c14-7 42-10 63 0 19 9 33 24 40 44"
                      stroke="currentColor"
                      strokeWidth="2.25"
                      strokeLinecap="round"
                      initial={reduceMotion ? false : { pathLength: 0 }}
                      animate={drawn ? { pathLength: 1 } : undefined}
                      transition={{ duration: 0.8, ease: "easeInOut", delay: 0.25 }}
                    />
                    <motion.path
                      d="M97 45.5 107.5 55l4-13"
                      stroke="currentColor"
                      strokeWidth="2.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={reduceMotion ? false : { pathLength: 0 }}
                      animate={drawn ? { pathLength: 1 } : undefined}
                      transition={{ duration: 0.25, ease: "easeOut", delay: 1.05 }}
                    />
                  </svg>
                </div>

                <motion.span
                  className="block"
                  initial={false}
                  animate={drawn && !reduceMotion ? { rotate: [0, -14, 10, -6, 0] } : undefined}
                  transition={{ duration: 0.6, delay: 1.3 }}
                >
                  <motion.a
                    href="https://x.com/nikhilkr_tw"
                    onClick={() => trackFooterLink("x")}
                    aria-label="Nikhil on X"
                    animate={
                      pointing && !reduceMotion
                        ? { scale: 1.12, rotate: -8 }
                        : { scale: 1, rotate: 0 }
                    }
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className="inline-flex size-11 items-center justify-center rounded-full bg-neutral-950 text-white transition-colors hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                  >
                    <XIcon />
                  </motion.a>
                </motion.span>
              </div>
            </nav>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
