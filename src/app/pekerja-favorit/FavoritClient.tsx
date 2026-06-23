"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useFavorites";
import { api } from "@/lib/api";
import { resolveStorageUrl } from "@/lib/storage";
import WorkerCard from "@/components/ui/WorkerCard";
import type { Worker } from "@/types";

interface ApiFavorite {
  worker_id: string;
  nama: string;
  specialty: string;
  location: string | null;
  rating: number;
  status: "available" | "busy";
  image_url: string | null;
}

export default function FavoritClient() {
  const { user, ready } = useAuth();
  const { favorites } = useFavorites();
  const router = useRouter();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready) return;
    if (!user) { router.replace("/masuk?from=/pekerja-favorit"); return; }

    api.get<{ data: ApiFavorite[] }>("/favorites")
      .then((res) => {
        setWorkers(res.data.map((f) => ({
          id: f.worker_id,
          categoryId: "",
          name: f.nama,
          specialty: f.specialty,
          imageUrl: resolveStorageUrl(f.image_url) ?? "",
          imageAlt: f.nama,
          rating: f.rating,
          tags: [],
          status: f.status,
          location: f.location ?? "",
          bio: "",
          completedJobs: 0,
          experienceYears: 0,
          responseTime: "",
          services: [],
        })));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [ready, user, router]);

  // Sinkron dengan toggle favorit — hapus card yang di-unfavorite
  const visible = workers.filter((w) => favorites.includes(w.id));

  if (!ready || !user) return null;

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-surface-container-low rounded-xl border border-cream-dark h-72 animate-pulse" />
        ))}
      </div>
    );
  }

  if (visible.length === 0) {
    return (
      <div className="text-center py-5xl">
        <div className="w-24 h-24 bg-surface-container-low rounded-full flex items-center justify-center mx-auto mb-2xl">
          <span className="material-symbols-outlined text-outline text-[48px]">favorite</span>
        </div>
        <h2 className="font-headline-md text-headline-md text-forest-deep mb-md">
          Belum ada favorit
        </h2>
        <p className="text-text-mid font-body-md max-w-128 mx-auto mb-3xl">
          Tekan ikon hati di kartu pekerja untuk menyimpan favorit Anda.
        </p>
        <Link
          href="/pekerja"
          className="inline-block px-4xl py-md rounded-full bg-primary text-on-primary font-bold hover:bg-primary-container transition-all"
        >
          Lihat Semua Pekerja
        </Link>
      </div>
    );
  }

  return (
    <>
      <p className="text-text-mid font-body-md mb-3xl">
        <strong className="text-forest-deep">{visible.length}</strong> pekerja favorit Anda
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
        {visible.map((worker) => (
          <WorkerCard key={worker.id} {...worker} />
        ))}
      </div>
    </>
  );
}
