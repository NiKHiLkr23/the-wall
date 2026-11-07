"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { ArrowLeft, ArrowRight, Check, Copy, TriangleAlert } from "lucide-react";
import { cn } from "cn";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./ui/dialog";
import { captureWallEvent } from "@/lib/analytics";
import type { Quote } from "@/types/quote";

type CopyStatus = { quoteId: string; status: "copied" | "failed" };

type QuoteDialogProps = {
  quote: Quote | null;
  position: number;
  total: number;
  direction: 1 | -1;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPrevious: () => void;
  onNext: () => void;
};

const easeOutExpo = [0.16, 1, 0.3, 1] as const;

const slide: Variants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction * 48,
    filter: "blur(6px)",
  }),
  center: { opacity: 1, x: 0, filter: "blur(0px)" },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction * -48,
    filter: "blur(6px)",
  }),
};

const ticker: Variants = {
  enter: (direction: number) => ({ y: direction * 14, opacity: 0 }),
  center: { y: 0, opacity: 1 },
  exit: (direction: number) => ({ y: direction * -14, opacity: 0 }),
};

function quoteSizeClass(length: number) {
  if (length > 110) return "text-[1.75rem] sm:text-[2.1rem]";
  if (length > 60) return "text-3xl sm:text-[2.6rem]";
  return "text-4xl sm:text-5xl";
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function useMeasuredHeight() {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [measured, setMeasured] = useState<{
    element: HTMLElement;
    height: number;
  } | null>(null);

  useEffect(() => {
    if (!element) return;
    const observer = new ResizeObserver(() => {
      setMeasured({ element, height: element.offsetHeight });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [element]);

  const height =
    measured && measured.element === element ? measured.height : "auto";
  return [setElement, height] as const;
}

export function QuoteDialog({
  quote,
  position,
  total,
  direction,
  open,
  onOpenChange,
  onPrevious,
  onNext,
}: QuoteDialogProps) {
  const [copy, setCopy] = useState<CopyStatus | null>(null);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [bodyRef, bodyHeight] = useMeasuredHeight();

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  const copyStatus = quote && copy?.quoteId === quote.id ? copy.status : "idle";
  const canNavigate = total > 1;

  async function handleCopy() {
    if (!quote) return;
    let status: CopyStatus["status"] = "copied";
    try {
      await navigator.clipboard.writeText(`“${quote.text}” — ${quote.author}`);
      captureWallEvent("wall_quote_copied", { quote_id: quote.id });
    } catch {
      status = "failed";
      captureWallEvent("wall_quote_copy_failed", { quote_id: quote.id });
    }
    setCopy({ quoteId: quote.id, status });
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setCopy(null), 2200);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!canNavigate) return;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      onNext();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      onPrevious();
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onKeyDown={handleKeyDown}
        className="max-h-[calc(100dvh-2rem)] gap-0 overflow-x-hidden overflow-y-auto p-0 shadow-2xl shadow-black/15 sm:max-w-2xl"
      >
        {/* Kept outside the animated region: Base UI clears the dialog's
            label when a title unmounts, which an exit animation would do late. */}
        <DialogTitle className="sr-only">
          {quote ? `Quote by ${quote.author}` : "Quote"}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {quote ? `${quote.text} — ${quote.source}` : ""}
        </DialogDescription>

        {quote ? (
          <>
            <motion.div
              initial={false}
              animate={{ height: bodyHeight }}
              transition={{ duration: 0.45, ease: easeOutExpo }}
              className="overflow-hidden"
              aria-hidden="true"
            >
              <div
                ref={bodyRef}
                className="px-6 pt-6 pb-8 sm:px-10 sm:pt-8 sm:pb-10"
              >
                <div className="flex items-center gap-3 pr-10">
                  <span className="rounded-full border border-border bg-muted px-2.5 py-1 text-[0.7rem] font-bold tracking-[0.18em] text-neutral-600 uppercase">
                    {quote.kind === "famous" ? "Famous" : "From the internet"}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-medium tabular-nums text-muted-foreground">
                    No.
                    <span className="relative inline-flex h-4 items-center overflow-hidden">
                      <AnimatePresence
                        mode="popLayout"
                        initial={false}
                        custom={direction}
                      >
                        <motion.span
                          key={position}
                          custom={direction}
                          variants={ticker}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{ duration: 0.35, ease: easeOutExpo }}
                          className="inline-block"
                        >
                          {pad(position)}
                        </motion.span>
                      </AnimatePresence>
                    </span>
                    of {pad(total)}
                  </span>
                </div>

                <div className="relative">
                  <AnimatePresence
                    mode="popLayout"
                    initial={false}
                    custom={direction}
                  >
                    <motion.div
                      key={quote.id}
                      custom={direction}
                      variants={slide}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.45, ease: easeOutExpo }}
                    >
                      <motion.span
                        initial={{ scale: 0.6, rotate: -12, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 18,
                          delay: 0.05,
                        }}
                        className="mt-6 block h-10 w-fit origin-bottom-left font-serif text-[6rem] leading-[0.9] text-orange-500 select-none sm:h-12 sm:text-[7rem]"
                      >
                        “
                      </motion.span>
                      <blockquote
                        className={cn(
                          "font-serif leading-[1.12] tracking-tight text-pretty text-neutral-950",
                          quoteSizeClass(quote.text.length)
                        )}
                      >
                        {quote.text}
                      </blockquote>
                      <div className="mt-7 flex items-center gap-3">
                        <motion.span
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{
                            duration: 0.5,
                            ease: easeOutExpo,
                            delay: 0.15,
                          }}
                          className="h-px w-8 shrink-0 origin-left bg-neutral-950"
                        />
                        <div className="min-w-0">
                          <p className="text-base leading-tight font-bold text-neutral-950">
                            {quote.author}
                          </p>
                          <p className="mt-0.5 text-sm text-muted-foreground">
                            {quote.source}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {quote.sourceUrl ? (
              <a
                href={quote.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  captureWallEvent("wall_source_opened", { quote_id: quote.id })
                }
                className="flex min-h-11 items-center gap-2 border-t border-border px-6 py-3 text-sm font-medium text-neutral-600 underline underline-offset-4 hover:text-orange-600 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-orange-600 sm:px-10"
              >
                Watch source · {quote.source}
                <span aria-hidden="true">↗</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ) : null}

            <div className="flex items-center justify-between gap-3 border-t border-border bg-neutral-50 px-4 py-3 sm:px-6">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon-lg"
                  onClick={onPrevious}
                  disabled={!canNavigate}
                  aria-label="Previous quote"
                  className="[&_svg]:transition-transform hover:[&_svg]:-translate-x-0.5"
                >
                  <ArrowLeft />
                </Button>
                <Button
                  variant="outline"
                  size="icon-lg"
                  onClick={onNext}
                  disabled={!canNavigate}
                  aria-label="Next quote"
                  className="[&_svg]:transition-transform hover:[&_svg]:translate-x-0.5"
                >
                  <ArrowRight />
                </Button>
                <span className="ml-1 hidden text-xs text-muted-foreground sm:inline">
                  or use ← → keys
                </span>
              </div>
              <Button
                size="lg"
                onClick={handleCopy}
                className="min-w-32 overflow-hidden px-3"
                aria-live="polite"
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={copyStatus}
                    initial={{ y: 18, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -18, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 32 }}
                    className="inline-flex items-center gap-1.5"
                  >
                    {copyStatus === "copied" ? (
                      <>
                        <Check className="text-orange-400" /> Copied
                      </>
                    ) : copyStatus === "failed" ? (
                      <>
                        <TriangleAlert /> Copy failed
                      </>
                    ) : (
                      <>
                        <Copy /> Copy quote
                      </>
                    )}
                  </motion.span>
                </AnimatePresence>
              </Button>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
