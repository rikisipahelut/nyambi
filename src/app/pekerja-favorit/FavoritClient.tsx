"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { workers } from "@/data/workers";
import WorkerCard from "@/components/ui/WorkerCard";

export default function FavoritClient() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("nyambi_favorites");
      if (raw) setFavoriteIds(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  if (!ready) return null;

  const favoriteWorkers = workers.filter((w) => favoriteIds.includes(w.id));

  if (favoriteWorkers.length === 0) {
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
        <strong className="text-forest-deep">{favoriteWorkers.length}</strong> pekerja favorit Anda
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
        {favoriteWorkers.map((worker) => (
          <WorkerCard key={worker.id} {...worker} />
        ))}
      </div>
    </>
  );
}
