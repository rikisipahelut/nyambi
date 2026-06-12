"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  initialQuery?: string;
  initialLokasi?: string;
}

export default function SearchBar({ initialQuery = "", initialLokasi = "" }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [lokasi, setLokasi] = useState(initialLokasi);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    const params = new URLSearchParams();
    params.set("q", query.trim());
    if (lokasi.trim()) params.set("lokasi", lokasi.trim());
    router.push(`/cari?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex-1 flex items-center">
      <div className="w-full bg-surface-container-low border border-cream-dark rounded-full flex items-center gap-sm px-lg focus-within:border-primary transition-all">
        <span className="material-symbols-outlined text-outline text-[20px] shrink-0">search</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari jasa atau pekerja..."
          className="flex-1 bg-transparent py-sm text-body-md font-body-md outline-none min-w-0"
        />
        {lokasi && (
          <>
            <div className="h-4 w-px bg-cream-dark shrink-0" />
            <span className="material-symbols-outlined text-outline text-[18px] shrink-0">location_on</span>
            <input
              type="text"
              value={lokasi}
              onChange={(e) => setLokasi(e.target.value)}
              placeholder="Lokasi"
              className="w-28 bg-transparent py-sm text-body-md font-body-md outline-none"
            />
          </>
        )}
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(""); setLokasi(""); }}
            className="text-on-surface-variant hover:text-primary transition-colors shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        )}
        <button
          type="submit"
          className="bg-primary text-on-primary px-lg py-xs rounded-full font-bold text-label-sm hover:opacity-90 active:scale-95 transition-all shrink-0"
        >
          Cari
        </button>
      </div>
    </form>
  );
}
