import SubHeader from "@/components/layout/SubHeader";
import { notFound } from "next/navigation";
import Link from "next/link";
import WorkerCard from "@/components/ui/WorkerCard";
import { resolveStorageUrl } from "@/lib/storage";
import type { Worker } from "@/types";

// ── Types ─────────────────────────────────────────────────
interface ApiCategory {
  id: string;
  title: string;
  icon: string;
  worker_count: number;
}

interface ApiWorker {
  id: string;
  nama: string;
  specialty: string;
  location: string | null;
  status: "available" | "busy";
  rating: number;
  completed_jobs: number;
  experience_years: number;
  response_time: string | null;
  image_url: string | null;
}

// ── Fetchers ──────────────────────────────────────────────
async function fetchCategory(id: string): Promise<ApiCategory | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`, {
    next: { revalidate: 300 },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()).data;
}

async function fetchWorkersByCategory(id: string): Promise<Worker[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/workers?category=${id}&limit=50`,
    { cache: "no-store" }
  );
  if (!res.ok) return [];
  const json = await res.json();
  return json.data.map((w: ApiWorker): Worker => ({
    id: w.id,
    categoryId: id,
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
  }));
}

// ── Metadata ──────────────────────────────────────────────
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const category = await fetchCategory(id);
    if (!category) return {};
    return {
      title: `${category.title} - Nyambi`,
      description: `Temukan pekerja ${category.title} terpercaya di Nyambi.`,
    };
  } catch {
    return {};
  }
}

// ── Page ─────────────────────────────────────────────────
export default async function KategoriDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let category: ApiCategory | null = null;
  try {
    category = await fetchCategory(id);
  } catch {
    notFound();
  }
  if (!category) notFound();

  let workers: Worker[] = [];
  try {
    workers = await fetchWorkersByCategory(id);
  } catch {
    // workers tetap array kosong, tampilkan empty state
  }

  return (
    <>
      <SubHeader backHref="/kategori" />

      <main className="py-4xl px-xl md:px-5xl max-w-360 mx-auto">
        {/* Category header */}
        <div className="flex items-center gap-lg mb-3xl">
          <div className="w-16 h-16 bg-pale-mint/20 text-primary rounded-full flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[32px]">{category.icon}</span>
          </div>
          <div>
            <h1 className="font-headline-lg text-headline-lg text-forest-deep">{category.title}</h1>
            <p className="text-text-mid font-body-md">{category.worker_count} pekerja tersedia</p>
          </div>
        </div>

        {/* Workers grid or empty state */}
        {workers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
            {workers.map((worker) => (
              <WorkerCard key={worker.id} {...worker} />
            ))}
          </div>
        ) : (
          <div className="text-center py-5xl">
            <span className="material-symbols-outlined text-[56px] text-outline mb-lg block">
              search_off
            </span>
            <p className="font-headline-md text-headline-md text-forest-deep">Belum ada pekerja</p>
            <p className="text-text-mid font-body-md mt-xs max-w-96 mx-auto">
              Segera hadir — kami sedang merekrut pekerja untuk kategori ini.
            </p>
            <Link
              href="/pekerja"
              className="inline-flex items-center gap-xs mt-2xl px-2xl py-md rounded-full bg-primary text-on-primary font-bold hover:opacity-90 transition-all"
            >
              Lihat Semua Pekerja
            </Link>
            <Link
              href="/kategori"
              className="inline-flex items-center gap-xs mt-lg ml-lg text-primary font-bold hover:underline transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Lihat Kategori Lain
            </Link>
          </div>
        )}
      </main>
    </>
  );
}
