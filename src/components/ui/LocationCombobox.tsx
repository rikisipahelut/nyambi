"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { wilayah } from "@/data/wilayah";

const ICON: Record<string, string> = {
  provinsi: "map",
  kota: "location_city",
  kabupaten: "holiday_village",
};

interface Props {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export function LocationCombobox({ value, onChange, placeholder = "Pilih kota/provinsi" }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query.length >= 2
    ? wilayah
        .filter((w) => {
          const q = query.toLowerCase();
          return (
            w.nama.toLowerCase().includes(q) ||
            w.provinsi.toLowerCase().includes(q)
          );
        })
        .slice(0, 8)
    : [];

  const select = useCallback((nama: string) => {
    onChange(nama);
    setQuery("");
    setOpen(false);
  }, [onChange]);

  const clear = useCallback(() => {
    onChange("");
    setQuery("");
    setOpen(false);
  }, [onChange]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative flex-1 flex items-center gap-sm px-lg">
      <span className="material-symbols-outlined text-outline text-[20px] shrink-0">location_on</span>

      {value && !open ? (
        <>
          <span className="flex-1 text-body-md font-body-md text-on-surface truncate">{value}</span>
          <button
            type="button"
            onClick={clear}
            className="shrink-0 text-on-surface-variant hover:text-primary transition-colors"
            aria-label="Hapus lokasi"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </>
      ) : (
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder={value || placeholder}
          className="flex-1 bg-transparent text-body-md font-body-md outline-none min-w-0 placeholder:text-on-surface-variant"
        />
      )}

      {open && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-sm bg-surface-container-lowest border border-cream-dark rounded-xl shadow-lg z-50 overflow-hidden">
          {filtered.map((w) => (
            <button
              key={`${w.tipe}-${w.nama}`}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); select(w.nama); }}
              className="w-full flex items-center gap-md px-lg py-md hover:bg-cream-dark transition-colors text-left"
            >
              <span className="material-symbols-outlined text-primary text-[18px] shrink-0">
                {ICON[w.tipe]}
              </span>
              <span className="flex-1 text-body-md font-body-md text-on-surface">{w.nama}</span>
              {w.provinsi && (
                <span className="text-label-sm text-on-surface-variant shrink-0">{w.provinsi}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
