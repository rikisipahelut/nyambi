"use client";

import { useEffect, useRef } from "react";

export function useScrollShadow<T extends HTMLElement>(threshold = 20) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handler = () => {
      if (window.scrollY > threshold) {
        el.classList.add("shadow-md");
      } else {
        el.classList.remove("shadow-md");
      }
    };

    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [threshold]);

  return ref;
}
