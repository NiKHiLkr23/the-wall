"use client";

import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { AnimatePresence, MotionConfig, motion, useScroll, useSpring, useVelocity } from "motion/react";
import { Pause, Play, Shuffle } from "lucide-react";
import { Button } from "./ui/button";
import { MarqueeStrip, type StripDirection, type StripVariant } from "./marquee-strip";
import { QuoteDialog } from "./quote-dialog";
import { SiteFooter } from "./site-footer";
import { captureWallEvent, initializeAnalytics } from "@/lib/analytics";
import type { Quote } from "@/types/quote";

const easeOutExpo = [0.16, 1, 0.3, 1] as const;

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function subscribeToMotionPreference(onChange: () => void) {
  const query = window.matchMedia(reducedMotionQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getMotionPreference() {
  return window.matchMedia(reducedMotionQuery).matches;
}

// Match the first server/client render; the browser preference updates after hydration.
function getServerMotionPreference() {
  return true;
}

function stripVariant(index: number): StripVariant {
  if (index % 7 === 3) return "accent";
  return index % 2 === 0 ? "sans" : "serif";
}

export function QuoteWall({ quotes, hero }: { quotes: Quote[]; hero?: ReactNode }) {
  useEffect(initializeAnalytics, []);

  const [userPaused, setUserPaused] = useState<boolean | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [open, setOpen] = useState(false);
  const prefersReducedMotion = useSyncExternalStore(
    subscribeToMotionPreference,
    getMotionPreference,
    getServerMotionPreference
  );
  const paused = userPaused ?? Boolean(prefersReducedMotion);

  const { scrollY } = useScroll();
  const scrollVelocity = useSpring(useVelocity(scrollY), {
    damping: 50,
    stiffness: 400,
  });

  const visible = quotes;

  const activeIndex = activeId
    ? visible.findIndex((q) => q.id === activeId)
    : -1;
  const activeQuote = activeIndex >= 0 ? visible[activeIndex] : null;

  function openQuote(id: string, method: "strip" | "surprise" = "strip") {
    setDirection(1);
    setActiveId(id);
    setOpen(true);
    captureWallEvent("wall_quote_opened", { quote_id: id, method });
  }

  function step(delta: 1 | -1) {
    if (activeIndex < 0 || visible.length === 0) return;
    const next = (activeIndex + delta + visible.length) % visible.length;
    setDirection(delta);
    setActiveId(visible[next].id);
    captureWallEvent("wall_quote_navigated", {
      quote_id: visible[next].id,
      direction: delta === 1 ? "next" : "previous",
    });
  }

  function openRandom() {
    if (visible.length === 0) return;
    const pool =
      visible.length > 1 ? visible.filter((q) => q.id !== activeId) : visible;
    openQuote(pool[Math.floor(Math.random() * pool.length)].id, "surprise");
  }

  return (
    <MotionConfig reducedMotion="user">
      <main className="flex flex-1 flex-col">
        {hero}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: easeOutExpo, delay: 0.45 }}
          className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-end gap-3 px-5 pb-6 sm:px-8"
        >
          <div className="flex items-center gap-2">
            <p className="mr-2 hidden text-sm text-muted-foreground lg:block">
              Hover a strip to slow it down. Click to read.
            </p>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                setUserPaused(!paused);
                captureWallEvent("wall_motion_toggled", { paused: !paused });
              }}
              aria-pressed={paused}
              className="w-24 px-3 font-semibold"
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={paused ? "play" : "pause"}
                  initial={{ scale: 0.4, rotate: -90, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  exit={{ scale: 0.4, rotate: 90, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="inline-flex"
                >
                  {paused ? <Play /> : <Pause />}
                </motion.span>
              </AnimatePresence>
              {paused ? "Play" : "Pause"}
            </Button>
            <Button
              size="lg"
              onClick={openRandom}
              disabled={visible.length === 0}
              className="px-3 font-semibold [&_svg]:transition-transform [&_svg]:duration-500 hover:[&_svg]:rotate-180"
            >
              <Shuffle />
              Surprise me
            </Button>
          </div>
        </motion.div>

        <section
          aria-label="Quote strips"
          className="overflow-x-clip border-t border-border"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col"
            >
              {visible.length === 0 ? (
                <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-6 py-24 text-center">
                  <p className="font-serif text-3xl text-neutral-950">
                    Nothing to repeat here yet.
                  </p>
                </div>
              ) : (
                visible.map((quote, index) => {
                  const stripDirection: StripDirection =
                    index % 2 === 0 ? "left" : "right";
                  return (
                    <motion.div
                      key={quote.id}
                      id={quote.id}
                      initial={{
                        opacity: 0,
                        x: stripDirection === "left" ? 120 : -120,
                      }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "0px 0px -40px 0px" }}
                      transition={{
                        duration: 0.9,
                        ease: easeOutExpo,
                        delay: Math.min(index, 6) * 0.06,
                      }}
                    >
                      <MarqueeStrip
                        quote={quote}
                        index={index}
                        direction={stripDirection}
                        variant={stripVariant(index)}
                        paused={paused || open}
                        scrollVelocity={scrollVelocity}
                        onOpen={() => openQuote(quote.id)}
                      />
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          </AnimatePresence>
        </section>
      </main>

      <SiteFooter
        quoteCount={quotes.length}
        lastAdded={quotes.reduce<string | undefined>(
          (latest, quote) =>
            quote.addedAt && (!latest || quote.addedAt > latest)
              ? quote.addedAt
              : latest,
          undefined
        )}
      />

      <QuoteDialog
        quote={activeQuote}
        position={activeIndex + 1}
        total={visible.length}
        direction={direction}
        open={open}
        onOpenChange={setOpen}
        onPrevious={() => step(-1)}
        onNext={() => step(1)}
      />
    </MotionConfig>
  );
}
