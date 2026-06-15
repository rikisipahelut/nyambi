import { Suspense } from "react";
import Link from "next/link";
import WorkerCard from "@/components/ui/WorkerCard";
import SearchBar from "@/app/cari/SearchBar";
import { CategoryScrollFilter } from "@/components/ui/CategoryScrollFilter";
import type { Worker } from "@/types";

export const metadata = {
  title: "Semua Pekerja - Nyambi",
  description: "Temukan semua pekerja terampil terpercaya di Nyambi.",
};

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

interface Meta {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// ── Mapper ────────────────────────────────────────────────
function mapWorker(w: ApiWorker): Worker {
  return {
    id: w.id,
    categoryId: "",
    name: w.nama,
    specialty: w.specialty,
    imageUrl: w.image_url ?? "",
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

// ── Skeletons ─────────────────────────────────────────────
function WorkerCardSkeleton() {
  return (
    <div className="bg-surface-container-lowest rounded-xl border border-cream-dark overflow-hidden animate-pulse">
      <div className="h-48 bg-cream-dark" />
      <div className="p-xl space-y-md">
        <div className="flex justify-between">
          <div className="space-y-sm">
            <div className="h-5 w-32 bg-cream-dark rounded" />
            <div className="h-4 w-24 bg-cream-dark rounded" />
          </div>
          <div className="h-5 w-10 bg-cream-dark rounded" />
        </div>
        <div className="flex gap-sm">
          <div className="h-6 w-20 bg-cream-dark rounded-full" />
          <div className="h-6 w-16 bg-cream-dark rounded-full" />
        </div>
        <div className="h-10 bg-cream-dark rounded-full" />
      </div>
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
      {Array.from({ length: 12 }).map((_, i) => (
        <WorkerCardSkeleton key={i} />
      ))}
    </div>
  );
}

// ── Fetchers ──────────────────────────────────────────────
async function fetchWorkers(
  category: string,
  lokasi: string,
  page: number
): Promise<{ workers: Worker[]; meta: Meta }> {
  const params = new URLSearchParams({ limit: "12", page: String(page) });
  if (category) params.set("category", category);
  if (lokasi) params.set("lokasi", lokasi);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/workers?${params}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  return {
    workers: json.data.map(mapWorker),
    meta: json.meta,
  };
}

// ── Workers grid + pagination ─────────────────────────────
async function WorkersList({
  category,
  lokasi,
  page,
}: {
  category: string;
  lokasi: string;
  page: number;
}) {
  let workers: Worker[] = [];
  let meta: Meta = { total: 0, page: 1, limit: 12, total_pages: 1 };

  try {
    ({ workers, meta } = await fetchWorkers(category, lokasi, page));
  } catch {
    return <GridSkeleton />;
  }

  function buildHref(p: number) {
    const q = new URLSearchParams();
    if (category) q.set("category", category);
    if (lokasi) q.set("lokasi", lokasi);
    q.set("page", String(p));
    return `/pekerja?${q.toString()}`;
  }

  const prevHref = page > 1 ? buildHref(page - 1) : null;
  const nextHref = page < meta.total_pages ? buildHref(page + 1) : null;

  return (
    <>
      <p className="text-text-mid font-body-md mb-3xl">
        {meta.total} pekerja terverifikasi siap membantu Anda.
      </p>

      {workers.length === 0 ? (
        <div className="text-center py-5xl text-on-surface-variant">
          <span className="material-symbols-outlined text-[64px] mb-lg block">person_search</span>
          <p className="font-headline-md text-body-lg">Tidak ada pekerja ditemukan</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
          {workers.map((worker) => (
            <WorkerCard key={worker.id} {...worker} />
          ))}
        </div>
      )}

      {meta.total_pages > 1 && (
        <div className="flex justify-center items-center gap-lg mt-4xl">
          {prevHref ? (
            <Link
              href={prevHref}
              className="flex items-center gap-xs px-xl py-md rounded-full border border-cream-dark text-on-surface-variant hover:border-primary hover:text-primary transition-all font-bold"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Sebelumnya
            </Link>
          ) : (
            <span className="flex items-center gap-xs px-xl py-md rounded-full border border-cream-dark text-on-surface-variant/40 font-bold cursor-not-allowed">
              <span className="material-symbols-outlined">arrow_back</span>
              Sebelumnya
            </span>
          )}

          <span className="text-on-surface-variant font-body-md">
            Halaman {meta.page} / {meta.total_pages}
          </span>

          {nextHref ? (
            <Link
              href={nextHref}
              className="flex items-center gap-xs px-xl py-md rounded-full border border-cream-dark text-on-surface-variant hover:border-primary hover:text-primary transition-all font-bold"
            >
              Selanjutnya
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          ) : (
            <span className="flex items-center gap-xs px-xl py-md rounded-full border border-cream-dark text-on-surface-variant/40 font-bold cursor-not-allowed">
              Selanjutnya
              <span className="material-symbols-outlined">arrow_forward</span>
            </span>
          )}
        </div>
      )}
    </>
  );
}

// ── Page ─────────────────────────────────────────────────
export default async function PekerjaPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; lokasi?: string; page?: string }>;
}) {
  const { category = "", lokasi = "", page: pageStr = "1" } = await searchParams;
  const page = Math.max(1, Number(pageStr) || 1);

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
          <SearchBar />
        </nav>
      </header>

      <main className="py-4xl px-xl md:px-5xl max-w-360 mx-auto">
        <div className="mb-3xl">
          <h1 className="font-headline-lg text-headline-lg text-forest-deep">Semua Pekerja</h1>
        </div>

        <CategoryScrollFilter activeCategory={category} />

        <Suspense key={`${category}-${lokasi}-${page}`} fallback={<GridSkeleton />}>
          <WorkersList category={category} lokasi={lokasi} page={page} />
        </Suspense>
      </main>
    </>
  );
}
