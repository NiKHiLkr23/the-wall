"use client";

import posthog from "posthog-js";

export function initializeAnalytics() {
  const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  // Builds on preview domains and local testing must never enter live analytics.
  if (
    !posthog.__loaded &&
    process.env.NODE_ENV === "production" &&
    window.location.hostname === "the-wall.nikhilkr.in" &&
    projectToken &&
    apiHost
  ) {
    try {
      posthog.init(projectToken, {
        api_host: apiHost,
        defaults: "2026-08-30",
        autocapture: false,
        capture_dead_clicks: false,
        capture_heatmaps: false,
        capture_pageview: "history_change",
        capture_pageleave: true,
        capture_exceptions: true,
        person_profiles: "identified_only",
        disable_session_recording: true,
        disable_surveys: true,
        // Stamp each event rather than persisting a shared subdomain property,
        // which could otherwise tag the portfolio's events as Wall traffic.
        before_send: (event) => {
          if (event) event.properties.site = "the-wall";
          return event;
        },
      });
    } catch {
      // Analytics must not prevent the wall from loading.
    }
  }
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
  if (!posthog.__loaded) return;
  try {
    posthog.capture(
      event,
      properties,
      // Footer links navigate away, so they cannot wait for the batch queue.
      event === "outbound_link_clicked"
        ? { transport: "sendBeacon", send_instantly: true }
        : undefined
    );
  } catch {
    // A blocked tracker must not break reading, copying, or navigation.
  }
}
