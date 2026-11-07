"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import {
  getAnalyticsConsent,
  initializeAnalytics,
  setAnalyticsConsent,
  subscribeAnalyticsConsent,
} from "@/lib/analytics";

export function AnalyticsPreferences() {
  const consent = useSyncExternalStore(
    subscribeAnalyticsConsent,
    getAnalyticsConsent,
    () => null
  );
  const [editing, setEditing] = useState(false);
  useEffect(initializeAnalytics, []);

  function choose(choice: "granted" | "denied") {
    setAnalyticsConsent(choice);
    setEditing(false);
  }

  const buttonClass = "min-h-11 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium transition-colors hover:border-neutral-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600";

  return (
    <aside aria-label="Analytics preferences" className="border-t border-neutral-200 bg-white px-5 py-5 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-8 gap-y-3">
        <p className="max-w-xl text-sm leading-relaxed text-neutral-600">
          {consent === "blocked"
            ? "Analytics is off. Your browser’s privacy preference is respected."
            : consent === "granted" && !editing
              ? "Optional analytics is on. You can change your choice anytime."
              : consent === "denied" && !editing
                ? "Analytics is off. Enjoy the wall."
                : "Can I collect basic usage stats to improve the wall? Analytics stays off unless you allow it."}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/privacy" className="inline-flex min-h-11 items-center text-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600">
            Privacy
          </Link>
          {consent !== "blocked" && (consent === null || editing) ? (
            <>
              <button type="button" onClick={() => choose("granted")} className={buttonClass}>Allow analytics</button>
              <button type="button" onClick={() => choose("denied")} className={buttonClass}>No thanks</button>
            </>
          ) : consent !== "blocked" ? (
            <button type="button" onClick={() => setEditing(true)} className={buttonClass}>Analytics settings</button>
          ) : null}
        </div>
        <span role="status" className="sr-only">
          {consent === "granted" ? "Analytics allowed." : consent ? "Analytics disabled." : "No analytics choice saved."}
        </span>
      </div>
    </aside>
  );
}
