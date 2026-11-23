"use client";
import { useEffect } from "react";

export const NO_IMAGE = "/image/no-image.svg";

// Any <img> from /image/ that fails to load is replaced by the D CORE banner.
export default function ImgFallback() {
  useEffect(() => {
    const swap = (img: HTMLImageElement) => {
      if (img.dataset.noimg || img.src.endsWith(NO_IMAGE)) return;
      img.dataset.noimg = "1";
      img.removeAttribute("srcset");
      img.src = NO_IMAGE;
    };
    const onError = (e: Event) => {
      const t = e.target;
      if (t instanceof HTMLImageElement) swap(t);
    };
    document.addEventListener("error", onError, true);
    // images that failed before hydration
    document.querySelectorAll("img").forEach((img) => {
      if (img.complete && img.naturalWidth === 0 && img.getAttribute("src")) swap(img);
    });
    return () => document.removeEventListener("error", onError, true);
  }, []);
  return null;
}
