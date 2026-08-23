"use client";

import { sendGAEvent } from "@next/third-parties/google";
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
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);

  if (window.localStorage.getItem(ANALYTICS_CONSENT_KEY) !== "granted") return;

  const { event } = payload;
  let parameters: Record<string, string> = {};

  if (payload.event === "feature_upvote") {
    parameters = {
      feature_id: payload.feature_data.feature_id,
      feature_name: payload.feature_data.feature_name,
    };
  } else {
    const { event: _event, ...eventParameters } = payload;
    void _event;
    parameters = eventParameters;
  }

  sendGAEvent("event", event, parameters);
}
