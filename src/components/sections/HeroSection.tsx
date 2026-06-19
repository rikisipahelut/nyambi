"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLocation } from "@/hooks/useLocation";
import { LocationCombobox } from "@/components/ui/LocationCombobox";

export default function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const { lokasi, setLokasi } = useLocation();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    const l = lokasi.trim();
    if (!q && !l) return;

    const params = new URLSearchParams();
    if (l) params.set("lokasi", l);

    if (q) {
      params.set("q", q);
      router.push(`/cari?${params.toString()}`);
    } else {
      router.push(`/pekerja?${params.toString()}`);
    }
  }

  return (
    <section className="hero-gradient flex flex-col items-center justify-center text-center px-xl pt-4xl pb-5xl">
      <div className="max-w-224 mx-auto space-y-xl z-10">
        <h1 className="font-headline-lg text-headline-lg md:text-display text-forest-deep">
          <span className="block">Kerja Lebih Mudah,</span>
          <span className="block">Hidup Lebih Baik</span>
        </h1>
        <p className="font-body-lg text-body-lg text-text-mid max-w-168 mx-auto">
          Hubungkan kebutuhan Anda dengan pekerja serabutan terpercaya di sekitar Anda. Solusi
          praktis untuk setiap sudut rumah dan bisnis Anda.
        </p>

        <form onSubmit={handleSearch} className="mt-2xl max-w-192 mx-auto">
          <div className="bg-surface-container-lowest p-md rounded-full border border-cream-dark shadow-sm flex items-center gap-md focus-within:border-primary-container transition-all">
            {/* Input pencarian jasa */}
            <div className="flex-1 flex items-center px-lg border-r border-cream-dark">
              <span className="material-symbols-outlined text-outline mr-sm">search</span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari jasa: Tukang Kebun, Listrik..."
                className="w-full bg-transparent border-none focus:ring-0 text-body-md font-body-md outline-none"
              />
            </div>

            {/* Lokasi combobox */}
            <div className="hidden md:flex flex-1 border-l border-cream-dark">
              <LocationCombobox
                value={lokasi}
                onChange={setLokasi}
                placeholder="Pilih kota/provinsi"
              />
            </div>

            <button
              type="submit"
              className="bg-primary text-on-primary px-2xl py-md rounded-full font-bold flex items-center gap-sm hover:opacity-90 active:scale-95 transition-all shrink-0"
            >
              Cari
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
