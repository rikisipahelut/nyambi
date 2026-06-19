"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LocationCombobox } from "@/components/ui/LocationCombobox";

interface Props {
  initialQuery?: string;
  initialLokasi?: string;
}

export default function SearchBar({ initialQuery = "", initialLokasi = "" }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [lokasi, setLokasiState] = useState(initialLokasi);

  useEffect(() => {
    if (initialLokasi) return;
    try {
      const saved = localStorage.getItem("nyambi_lokasi");
      if (saved) setLokasiState(saved);
    } catch {}
  }, [initialLokasi]);

  function setLokasi(val: string) {
    setLokasiState(val);
    try {
      if (val) localStorage.setItem("nyambi_lokasi", val);
      else localStorage.removeItem("nyambi_lokasi");
    } catch {}
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) {
      router.push("/cari");
      return;
    }
    const params = new URLSearchParams();
    params.set("q", query.trim());
    if (lokasi.trim()) params.set("lokasi", lokasi.trim());
    router.push(`/cari?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex-1 flex items-center">
      <div className="w-full bg-surface-container-low border border-cream-dark rounded-full flex items-center focus-within:border-primary transition-all overflow-visible">
        <div className="flex items-center gap-sm px-lg flex-1 min-w-0">
          <span className="material-symbols-outlined text-outline text-[20px] shrink-0">search</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari jasa atau pekerja..."
            className="flex-1 bg-transparent py-sm text-body-md font-body-md outline-none min-w-0"
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(""); setLokasi(""); router.push("/cari"); }}
              className="text-on-surface-variant hover:text-primary transition-colors shrink-0"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>

        <div className="hidden md:flex border-l border-cream-dark w-52 relative">
          <LocationCombobox
            value={lokasi}
            onChange={setLokasi}
            placeholder="Pilih lokasi"
          />
        </div>

        <div className="px-sm shrink-0">
          <button
            type="submit"
            className="bg-primary text-on-primary px-lg py-xs rounded-full font-bold text-label-sm hover:opacity-90 active:scale-95 transition-all"
          >
            Cari
          </button>
        </div>
      </div>
    </form>
  );
}
