"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export function ProductViewTracker({ productId, productName }: { productId: string; productName: string }) {
  useEffect(() => {
    trackEvent({ event: "product_view", product_id: productId, product_name: productName });
  }, [productId, productName]);
  return null;
}
