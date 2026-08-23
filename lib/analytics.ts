"use client";

import { ANALYTICS_CONSENT_KEY } from "@/lib/analytics-consent";

export type AnalyticsEvent =
  | {
      event: "feature_upvote";
      feature_data: { feature_id: string; feature_name: string };
    }
  | {
      event: "generate_lead";
      lead_source: "homepage_newsletter" | "changelog_newsletter";
    }
  | {
      event: "feature_request_submit";
      product_id: string;
      category: string;
    }
  | {
      event: "product_view";
      product_id: string;
      product_name: string;
    }
  | {
      event: "roadmap_filter";
      filter_name: string;
    }
  | {
      event: "virtual_page_view";
      page_path: string;
    }
  | {
      event: "cta_click";
      cta_name: string;
      cta_location: string;
    };

export function trackEvent(payload: AnalyticsEvent) {
  if (typeof window === "undefined") return;
  if (window.localStorage.getItem(ANALYTICS_CONSENT_KEY) !== "granted") return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}
