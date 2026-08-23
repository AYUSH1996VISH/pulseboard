"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { trackEvent } from "@/lib/analytics";

type Props = ComponentProps<typeof Link> & {
  ctaName: string;
  ctaLocation: string;
};

export function TrackedLink({ ctaName, ctaLocation, onClick, ...props }: Props) {
  return (
    <Link
      {...props}
      onClick={(event) => {
        trackEvent({ event: "cta_click", cta_name: ctaName, cta_location: ctaLocation });
        onClick?.(event);
      }}
    />
  );
}
