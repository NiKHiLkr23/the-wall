"use client";

const consentKey = "the-wall:analytics-consent";
const consentEvent = "the-wall:analytics-consent-changed";
export type AnalyticsConsent = "granted" | "denied" | "blocked" | null;
let memoryConsent: AnalyticsConsent = null;
let client: typeof import("posthog-js").default | undefined;
let initializing: Promise<void> | undefined;
let active = false;

export function getAnalyticsConsent(): AnalyticsConsent {
  if (typeof window === "undefined") return null;
  const browser = navigator as Navigator & { globalPrivacyControl?: boolean };
  if (browser.doNotTrack === "1" || browser.globalPrivacyControl) return "blocked";
  try {
    const stored = localStorage.getItem(consentKey);
    return stored === "granted" || stored === "denied" ? stored : null;
  } catch {
    // Reading the wall also works when browser storage is unavailable.
  }
  return memoryConsent;
}

export function subscribeAnalyticsConsent(onChange: () => void) {
  const update = () => {
    initializeAnalytics();
    onChange();
  };
  const storageChanged = (event: StorageEvent) => {
    if (event.key === consentKey || event.key === null) update();
  };
  window.addEventListener(consentEvent, update);
  window.addEventListener("storage", storageChanged);
  return () => {
    window.removeEventListener(consentEvent, update);
    window.removeEventListener("storage", storageChanged);
  };
}

export function setAnalyticsConsent(choice: "granted" | "denied") {
  memoryConsent = choice;
  try {
    localStorage.setItem(consentKey, choice);
  } catch {
    // The choice still applies for this page when it cannot be saved.
  }
  initializeAnalytics();
  window.dispatchEvent(new Event(consentEvent));
}

export function initializeAnalytics() {
  if (getAnalyticsConsent() !== "granted") {
    if (client?.__loaded && active) {
      client.opt_out_capturing();
    }
    active = false;
    return;
  }

  const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;
  if (
    active || initializing ||
    process.env.NODE_ENV !== "production" ||
    window.location.hostname !== "the-wall.nikhilkr.in" ||
    !projectToken || !apiHost
  ) return;

  // Do not even load the SDK before the visitor opts in.
  initializing = import("posthog-js").then(({ default: posthog }) => {
    if (getAnalyticsConsent() !== "granted") return;
    client = posthog;
    if (!posthog.__loaded) {
      posthog.init(projectToken, {
        api_host: apiHost,
        defaults: "2026-08-30",
        persistence: "localStorage",
        persistence_name: "the-wall",
        cross_subdomain_cookie: false,
        opt_out_capturing_by_default: true,
        opt_out_capturing_cookie_prefix: "the-wall-",
        opt_out_capturing_persistence_type: "localStorage",
        respect_dnt: true,
        ip: false,
        autocapture: false,
        capture_dead_clicks: false,
        capture_heatmaps: false,
        capture_pageview: "history_change",
        capture_pageleave: true,
        capture_exceptions: true,
        person_profiles: "identified_only",
        disable_session_recording: true,
        disable_surveys: true,
        before_send: (event) => {
          if (!active || getAnalyticsConsent() !== "granted") return null;
          if (event) event.properties.site = "the-wall";
          return event;
        },
      });
    }
    active = true;
    posthog.opt_in_capturing({ captureEventName: "$pageview" });
  }).catch(() => {
    active = false;
    // A blocked tracker must never prevent the wall from loading.
  }).finally(() => {
    initializing = undefined;
  });
}

type WallEvent =
  | "wall_quote_opened"
  | "wall_quote_navigated"
  | "wall_quote_copied"
  | "wall_quote_copy_failed"
  | "wall_source_opened"
  | "wall_motion_toggled"
  | "outbound_link_clicked";

export function captureWallEvent(
  event: WallEvent,
  properties: Record<string, string | number | boolean>
) {
  if (!active || getAnalyticsConsent() !== "granted" || !client?.__loaded) return;
  try {
    client.capture(
      event,
      properties,
      event === "outbound_link_clicked"
        ? { transport: "sendBeacon", send_instantly: true }
        : undefined
    );
  } catch {
    // Analytics must not break reading, copying, or navigation.
  }
}
