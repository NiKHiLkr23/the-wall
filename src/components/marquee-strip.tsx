"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useAnimationFrame, useInView, useMotionValue, wrap, type MotionValue } from "motion/react";
import { ArrowUpRight, Asterisk } from "lucide-react";
import { cn } from "cn";
import type { Quote } from "@/types/quote";

export type StripVariant = "sans" | "serif" | "accent";

export type StripDirection = "left" | "right";

const MIN_CHARS_PER_HALF = 180;

const CHARS_PER_SECOND = 4.2;

const variantStyles: Record<
  StripVariant,
  { strip: string; fill: string; quote: string; author: string; mark: string }
> = {
  sans: {
    strip: "border-b border-border bg-white text-neutral-950",
    fill: "bg-orange-600",
    quote:
      "text-2xl font-extrabold tracking-tight uppercase font-stretch-80% sm:text-3xl md:text-4xl",
    author:
      "font-serif text-xl italic text-neutral-500 group-hover:text-orange-100 group-focus-visible:text-orange-100 sm:text-2xl md:text-3xl",
    mark: "text-neutral-300 group-hover:text-orange-300 group-focus-visible:text-orange-300",
  },
  serif: {
    strip: "border-b border-border bg-white text-neutral-950",
    fill: "bg-orange-600",
    quote: "font-serif text-[1.7rem] italic sm:text-[2.1rem] md:text-[2.6rem]",
    author:
      "text-xs font-bold tracking-[0.2em] uppercase text-neutral-500 group-hover:text-orange-100 group-focus-visible:text-orange-100 sm:text-sm",
    mark: "text-neutral-300 group-hover:text-orange-300 group-focus-visible:text-orange-300",
  },
  accent: {
    strip: "border-b border-orange-600 bg-orange-600 text-white",
    fill: "bg-neutral-950",
    quote:
      "text-2xl font-extrabold tracking-tight uppercase font-stretch-80% sm:text-3xl md:text-4xl",
    author: "font-serif text-xl italic text-orange-100 sm:text-2xl md:text-3xl",
    mark: "text-orange-300 group-hover:text-orange-500 group-focus-visible:text-orange-500",
  },
};

type MarqueeStripProps = {
  quote: Quote;
  index: number;
  direction: StripDirection;
  variant: StripVariant;
  paused: boolean;
  scrollVelocity: MotionValue<number>;
  onOpen: () => void;
};

export function MarqueeStrip({
  quote,
  index,
  direction,
  variant,
  paused,
  scrollVelocity,
  onOpen,
}: MarqueeStripProps) {
  const styles = variantStyles[variant];
  const unitChars = quote.text.length + quote.author.length + 8;
  const copies = Math.max(1, Math.ceil(MIN_CHARS_PER_HALF / unitChars));
  const speedJitter = 0.85 + ((index * 37) % 30) / 100;

  const stripRef = useRef<HTMLButtonElement>(null);
  const halfRef = useRef<HTMLDivElement>(null);
  const halfWidth = useRef(0);
  const phased = useRef(false);
  const [engaged, setEngaged] = useState(false);
  const inView = useInView(stripRef, { margin: "200px 0px" });

  const x = useMotionValue(0);
  const speed = useMotionValue(paused ? 0 : 1);

  useEffect(() => {
    const el = halfRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      halfWidth.current = el.offsetWidth;
      if (!phased.current && halfWidth.current > 0) {
        phased.current = true;
        x.set(-halfWidth.current * ((index * 0.37) % 1));
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [index, x]);

  useEffect(() => {
    const controls = animate(speed, paused || engaged ? 0 : 1, {
      duration: engaged ? 0.45 : 0.9,
      ease: engaged ? "easeOut" : "easeInOut",
    });
    return () => controls.stop();
  }, [paused, engaged, speed]);

  useAnimationFrame((_, delta) => {
    const width = halfWidth.current;
    if (!width || !inView) return;
    const factor = speed.get();
    if (factor === 0) return;
    const boost = 1 + Math.min(Math.abs(scrollVelocity.get()) / 450, 4);
    const pxPerSecond =
      (width / (unitChars * copies)) * CHARS_PER_SECOND * speedJitter;
    const step = pxPerSecond * factor * boost * (Math.min(delta, 64) / 1000);
    const sign = direction === "left" ? -1 : 1;
    x.set(wrap(-width, 0, x.get() + sign * step));
  });

  return (
    <button
      ref={stripRef}
      type="button"
      onClick={onOpen}
      onPointerEnter={(e) => e.pointerType === "mouse" && setEngaged(true)}
      onPointerLeave={() => setEngaged(false)}
      onFocus={() => setEngaged(true)}
      onBlur={() => setEngaged(false)}
      aria-label={`Read the quote by ${quote.author}: ${quote.text}`}
      className={cn(
        "group relative block w-full overflow-hidden py-4 text-left outline-none focus-visible:z-10 sm:py-5",
        styles.strip
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-0 scale-x-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100",
          direction === "left" ? "origin-right" : "origin-left",
          styles.fill
        )}
      />
      <div
        className="marquee-mask relative transition-colors duration-300 group-hover:text-white group-focus-visible:text-white"
        aria-hidden="true"
      >
        <motion.div style={{ x }} className="flex w-max will-change-transform">
          {[0, 1].map((half) => (
            <div
              key={half}
              ref={half === 0 ? halfRef : undefined}
              className="flex shrink-0"
            >
              {Array.from({ length: copies }, (_, i) => (
                <span
                  key={i}
                  className="flex shrink-0 items-center gap-4 pr-4 whitespace-nowrap sm:gap-6 sm:pr-6"
                >
                  <span className={cn("leading-none", styles.quote)}>
                    “{quote.text}”
                  </span>
                  <span
                    className={cn(
                      "leading-none transition-colors duration-300",
                      styles.author
                    )}
                  >
                    {quote.author}
                  </span>
                  <Asterisk
                    strokeWidth={3}
                    className={cn(
                      "size-5 shrink-0 transition-colors duration-300 sm:size-7",
                      styles.mark
                    )}
                  />
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-4 hidden -translate-y-1/2 translate-x-3 items-center gap-1 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-neutral-950 opacity-0 shadow-lg shadow-black/10 transition-all delay-75 duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 md:inline-flex"
      >
        Read
        <ArrowUpRight className="size-4" strokeWidth={2.5} />
      </span>
    </button>
  );
}
