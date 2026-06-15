import { Suspense } from "react";
import Link from "next/link";
import WorkerCard from "@/components/ui/WorkerCard";
import type { Worker } from "@/types";

// ── Skeleton ──────────────────────────────────────────────
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

export function FeaturedWorkersSkeleton() {
  return (
    <section className="bg-surface-container-low py-4xl">
      <div className="px-xl md:px-5xl max-w-360 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-4xl gap-lg">
          <div className="space-y-sm">
            <div className="h-8 w-72 bg-cream-dark rounded-lg animate-pulse" />
            <div className="h-5 w-96 bg-cream-dark rounded-lg animate-pulse" />
          </div>
          <div className="h-5 w-40 bg-cream-dark rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
          {Array.from({ length: 6 }).map((_, i) => (
            <WorkerCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Fetcher ───────────────────────────────────────────────
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

function mapWorker(w: ApiWorker): Worker {
  return {
    id:               w.id,
    categoryId:       "",
    name:             w.nama,
    specialty:        w.specialty,
    imageUrl:         w.image_url ?? "",
    imageAlt:         w.nama,
    rating:           w.rating,
    tags:             [],
    status:           w.status,
    location:         w.location ?? "",
    bio:              "",
    completedJobs:    w.completed_jobs,
    experienceYears:  w.experience_years,
    responseTime:     w.response_time ?? "",
    services:         [],
  };
}

async function fetchFeaturedWorkers(): Promise<Worker[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/workers?limit=6`,
    { next: { revalidate: 300 } }
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  return json.data.map(mapWorker);
}

// ── Inner async component ─────────────────────────────────
async function FeaturedWorkersContent() {
  let workers: Worker[];
  try {
    workers = await fetchFeaturedWorkers();
  } catch {
    return <FeaturedWorkersSkeleton />;
  }

  return (
    <section className="bg-surface-container-low py-4xl">
      <div className="px-xl md:px-5xl max-w-360 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-4xl gap-lg">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-forest-deep">
              Pekerja Unggulan Pekan Ini
            </h2>
            <p className="text-text-mid font-body-md max-w-144">
              Kami menyeleksi pekerja dengan rating tertinggi dan rekam jejak terbaik untuk kepuasan Anda.
            </p>
          </div>
          <Link
            href="/pekerja"
            className="text-primary font-bold flex items-center gap-xs hover:underline transition-all shrink-0"
          >
            Lihat Semua Pekerja{" "}
            <span className="material-symbols-outlined">arrow_right_alt</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
          {workers.map((worker) => (
            <WorkerCard key={worker.id} {...worker} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Export ────────────────────────────────────────────────
export default function FeaturedWorkersSection() {
  return (
    <Suspense fallback={<FeaturedWorkersSkeleton />}>
      <FeaturedWorkersContent />
    </Suspense>
  );
}
