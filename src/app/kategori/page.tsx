import { Suspense } from "react";
import Link from "next/link";
import CategoryCard from "@/components/ui/CategoryCard";
import SearchBar from "@/app/cari/SearchBar";
import type { Category } from "@/types";

export const metadata = {
  title: "Semua Kategori - Nyambi",
  description: "Temukan semua kategori jasa pekerja terampil di Nyambi.",
};

// ── Skeleton ──────────────────────────────────────────────
function KategoriSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-xl">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="bg-surface-container-lowest p-xl rounded-xl border border-cream-dark animate-pulse text-center"
        >
          <div className="w-16 h-16 bg-cream-dark rounded-full mx-auto mb-lg" />
          <div className="h-5 w-3/4 bg-cream-dark rounded mx-auto mb-sm" />
          <div className="h-4 w-1/2 bg-cream-dark rounded mx-auto" />
        </div>
      ))}
    </div>
  );
}

// ── Fetcher ───────────────────────────────────────────────
async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
    next: { revalidate: 300 },
  });
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
async function KategoriContent() {
  let categories: Category[];
  try {
    categories = await fetchCategories();
  } catch {
    return <KategoriSkeleton />;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-xl">
      {categories.map((category) => (
        <CategoryCard key={category.id} {...category} />
      ))}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────
export default function KategoriPage() {
  return (
    <>
      <header className="bg-surface sticky top-0 z-50 border-b border-cream-dark">
        <nav className="flex items-center h-20 px-xl md:px-5xl max-w-360 mx-auto w-full gap-lg">
          <Link href="/" className="text-on-surface-variant hover:text-primary transition-colors shrink-0">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <SearchBar />
        </nav>
      </header>

      <main className="py-4xl px-xl md:px-5xl max-w-360 mx-auto">
        <div className="mb-3xl">
          <h1 className="font-headline-lg text-headline-lg text-forest-deep">Semua Kategori</h1>
          <p className="text-text-mid font-body-md mt-xs">
            Temukan ahli terbaik untuk berbagai kebutuhan harian Anda.
          </p>
        </div>

        <Suspense fallback={<KategoriSkeleton />}>
          <KategoriContent />
        </Suspense>
      </main>
    </>
  );
}
