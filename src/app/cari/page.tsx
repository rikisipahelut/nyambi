import { Suspense } from "react";
import Link from "next/link";
import WorkerCard from "@/components/ui/WorkerCard";
import CategoryCard from "@/components/ui/CategoryCard";
import SearchBar from "./SearchBar";
import { resolveStorageUrl } from "@/lib/storage";
import type { Worker, Category } from "@/types";

// ── Types ─────────────────────────────────────────────────
interface ApiWorker {
  id: string;
  nama: string;
  specialty: string;
  location: string;
  status: "available" | "busy";
  rating: number;
  completed_jobs: number;
  experience_years: number;
  response_time: string | null;
  image_url: string | null;
}

// ── Mapper ────────────────────────────────────────────────
function mapWorker(w: ApiWorker): Worker {
  return {
    id: w.id,
    categoryId: "",
    name: w.nama,
    specialty: w.specialty,
    imageUrl: resolveStorageUrl(w.image_url),
    imageAlt: w.nama,
    rating: w.rating,
    tags: [],
    status: w.status,
    location: w.location ?? "",
    bio: "",
    completedJobs: w.completed_jobs,
    experienceYears: w.experience_years,
    responseTime: w.response_time ?? "",
    services: [],
  };
}

// ── Fetchers ──────────────────────────────────────────────
async function fetchWorkers(q: string, lokasi: string): Promise<Worker[]> {
  const params = new URLSearchParams({ q, limit: "20" });
  if (lokasi) params.set("lokasi", lokasi);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/workers?${params}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  return json.data.map(mapWorker);
}

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

// ── Skeletons ─────────────────────────────────────────────
function ResultsSkeleton() {
  return (
    <div className="space-y-4xl">
      <div className="h-5 w-64 bg-cream-dark rounded animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-surface-container-lowest rounded-xl border border-cream-dark overflow-hidden animate-pulse">
            <div className="h-48 bg-cream-dark" />
            <div className="p-xl space-y-md">
              <div className="h-5 w-32 bg-cream-dark rounded" />
              <div className="h-4 w-24 bg-cream-dark rounded" />
              <div className="h-10 bg-cream-dark rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Results inner component ───────────────────────────────
async function SearchResults({ q, lokasi }: { q: string; lokasi: string }) {
  let workers: Worker[] = [];
  let categories: Category[] = [];

  try {
    [workers, categories] = await Promise.all([
      fetchWorkers(q, lokasi),
      fetchCategories(),
    ]);
  } catch {
    return <ResultsSkeleton />;
  }

  const matchedCategories = categories.filter((c) =>
    c.title.toLowerCase().includes(q.toLowerCase())
  );
  const totalResults = matchedCategories.length + workers.length;

  return (
    <>
      <p className="text-text-mid font-body-md mb-3xl">
        {totalResults > 0 ? (
          <>
            Menampilkan <strong className="text-forest-deep">{totalResults} hasil</strong>{" "}
            untuk &ldquo;<strong className="text-primary">{q}</strong>&rdquo;
            {lokasi && (
              <> di <strong className="text-forest-deep">{lokasi}</strong></>
            )}
          </>
        ) : (
          <>Tidak ada hasil untuk &ldquo;<strong className="text-primary">{q}</strong>&rdquo;</>
        )}
      </p>

      {matchedCategories.length > 0 && (
        <section className="mb-4xl">
          <h2 className="font-headline-md text-headline-md text-forest-deep mb-xl">Kategori</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-xl">
            {matchedCategories.map((cat) => (
              <CategoryCard key={cat.id} {...cat} />
            ))}
          </div>
        </section>
      )}

      {workers.length > 0 && (
        <section className="mb-4xl">
          <h2 className="font-headline-md text-headline-md text-forest-deep mb-xl">Pekerja</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
            {workers.map((worker) => (
              <WorkerCard key={worker.id} {...worker} />
            ))}
          </div>
        </section>
      )}

      {totalResults === 0 && (
        <div className="text-center py-4xl">
          <span className="material-symbols-outlined text-[56px] text-outline mb-lg block">
            search_off
          </span>
          <h2 className="font-headline-md text-headline-md text-forest-deep mb-md">
            Hasil tidak ditemukan
          </h2>
          <p className="text-text-mid font-body-md max-w-144 mx-auto mb-3xl">
            Coba kata kunci lain atau lihat semua kategori yang tersedia.
          </p>
          <div className="flex flex-col sm:flex-row gap-lg justify-center">
            <Link
              href="/kategori"
              className="px-4xl py-md rounded-full bg-primary text-on-primary font-bold hover:opacity-90 transition-all"
            >
              Lihat Semua Kategori
            </Link>
            <Link
              href="/pekerja"
              className="px-4xl py-md rounded-full border border-cream-dark text-on-surface font-bold hover:border-primary hover:text-primary transition-all"
            >
              Lihat Semua Pekerja
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

// ── Page ─────────────────────────────────────────────────
export default async function CariPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const { q = "", lokasi = "" } = await searchParams;

  return (
    <>
      <header className="bg-surface sticky top-0 z-50 border-b border-cream-dark">
        <nav className="flex items-center h-20 px-xl md:px-5xl max-w-360 mx-auto w-full gap-lg">
          <Link
            href="/"
            className="text-on-surface-variant hover:text-primary transition-colors shrink-0"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <SearchBar initialQuery={q} initialLokasi={lokasi} />
        </nav>
      </header>

      <main className="py-4xl px-xl md:px-5xl max-w-360 mx-auto">
        {q ? (
          <Suspense key={`${q}-${lokasi}`} fallback={<ResultsSkeleton />}>
            <SearchResults q={q} lokasi={lokasi} />
          </Suspense>
        ) : (
          <div className="text-center py-4xl">
            <span className="material-symbols-outlined text-[56px] text-primary mb-lg block">
              search
            </span>
            <h2 className="font-headline-md text-headline-md text-forest-deep mb-md">
              Cari jasa apa hari ini?
            </h2>
            <p className="text-text-mid font-body-md mb-3xl">
              Coba: Tukang Listrik, Cleaning, Les Privat...
            </p>
            <div className="flex flex-wrap gap-md justify-center">
              {[
                "Tukang Listrik",
                "Cleaning Service",
                "Les Privat",
                "Tukang Kebun",
                "Fotografer",
                "Catering",
              ].map((suggestion) => (
                <Link
                  key={suggestion}
                  href={`/cari?q=${encodeURIComponent(suggestion)}`}
                  className="px-lg py-sm rounded-full border border-cream-dark text-on-surface-variant font-body-md hover:border-primary hover:text-primary transition-all"
                >
                  {suggestion}
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
