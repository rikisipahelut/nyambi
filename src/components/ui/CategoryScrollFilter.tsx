"use client";

import Link from "next/link";
import { useRef, useState, useEffect, useCallback } from "react";

interface Category {
  id: string;
  title: string;
}

function FilterSkeleton() {
  return (
    <div className="relative mb-3xl flex items-center gap-sm overflow-hidden">
      <div className="flex gap-md">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-9 w-24 shrink-0 bg-cream-dark rounded-full animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export function CategoryScrollFilter({ activeCategory }: { activeCategory: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`)
      .then((r) => r.json())
      .then((json) =>
        setCategories(
          (json.data as { id: string; title: string }[]).map((c) => ({
            id: c.id,
            title: c.title,
          }))
        )
      )
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const updateArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    if (loading) return;
    updateArrows();
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);
    return () => ro.disconnect();
  }, [loading, updateArrows]);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -280 : 280, behavior: "smooth" });
  };

  if (loading) return <FilterSkeleton />;

  const pillBase = "shrink-0 px-lg py-sm rounded-full font-bold text-body-md transition-all";
  const pillActive = "bg-primary text-on-primary";
  const pillInactive =
    "border border-cream-dark text-on-surface-variant hover:border-primary hover:text-primary";

  return (
    <div className="relative mb-3xl flex items-center gap-sm">
      <button
        onClick={() => scroll("left")}
        disabled={!canLeft}
        className="shrink-0 w-8 h-8 rounded-full border border-cream-dark flex items-center justify-center transition-all disabled:opacity-0 disabled:pointer-events-none hover:border-primary hover:text-primary"
        aria-label="Scroll kiri"
      >
        <span className="material-symbols-outlined text-[18px]">chevron_left</span>
      </button>

      <div
        ref={scrollRef}
        onScroll={updateArrows}
        className="flex gap-md overflow-x-auto scrollbar-none flex-1"
      >
        <Link href="/pekerja" className={`${pillBase} ${!activeCategory ? pillActive : pillInactive}`}>
          Semua
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/pekerja?category=${cat.id}`}
            className={`${pillBase} ${activeCategory === cat.id ? pillActive : pillInactive}`}
          >
            {cat.title}
          </Link>
        ))}
      </div>

      <button
        onClick={() => scroll("right")}
        disabled={!canRight}
        className="shrink-0 w-8 h-8 rounded-full border border-cream-dark flex items-center justify-center transition-all disabled:opacity-0 disabled:pointer-events-none hover:border-primary hover:text-primary"
        aria-label="Scroll kanan"
      >
        <span className="material-symbols-outlined text-[18px]">chevron_right</span>
      </button>
    </div>
  );
}
