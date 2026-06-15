import { Suspense } from "react";
import Link from "next/link";
import CategoryCard from "@/components/ui/CategoryCard";
import type { Category } from "@/types";

// ── Skeleton ──────────────────────────────────────────────
export function CategoriesSkeleton() {
  return (
    <section className="py-4xl px-xl md:px-5xl max-w-360 mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-3xl gap-lg">
        <div className="space-y-sm">
          <div className="h-8 w-64 bg-cream-dark rounded-lg animate-pulse" />
          <div className="h-5 w-96 bg-cream-dark rounded-lg animate-pulse" />
        </div>
        <div className="h-5 w-40 bg-cream-dark rounded-lg animate-pulse" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-xl">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-surface-container-low border border-cream-dark rounded-2xl p-xl space-y-lg animate-pulse">
            <div className="w-12 h-12 bg-cream-dark rounded-full" />
            <div className="space-y-sm">
              <div className="h-5 w-3/4 bg-cream-dark rounded" />
              <div className="h-4 w-1/2 bg-cream-dark rounded" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Fetcher ───────────────────────────────────────────────
async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/categories`,
    { next: { revalidate: 300 } }
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  return json.data.map((c: { id: string; icon: string; title: string; worker_count: number }) => ({
    id: c.id,
    icon: c.icon,
    title: c.title,
    workerCount: `${c.worker_count}+`,
  }));
}

// ── Inner async component ─────────────────────────────────
async function CategoriesContent() {
  let categories: Category[];
  try {
    categories = await fetchCategories();
  } catch {
    return <CategoriesSkeleton />;
  }

  return (
    <section className="py-4xl px-xl md:px-5xl max-w-360 mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-3xl gap-lg">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-forest-deep">Kategori Populer</h2>
          <p className="text-text-mid font-body-md">
            Temukan ahli terbaik untuk berbagai kebutuhan harian Anda.
          </p>
        </div>
        <Link
          href="/kategori"
          className="text-primary font-bold flex items-center gap-xs hover:underline transition-all"
        >
          Lihat Semua Kategori{" "}
          <span className="material-symbols-outlined">arrow_right_alt</span>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-xl">
        {categories.slice(0, 4).map((category) => (
          <CategoryCard key={category.id} {...category} />
        ))}
      </div>
    </section>
  );
}

// ── Export: Suspense membungkus skeleton saat loading ─────
export default function CategoriesSection() {
  return (
    <Suspense fallback={<CategoriesSkeleton />}>
      <CategoriesContent />
    </Suspense>
  );
}
