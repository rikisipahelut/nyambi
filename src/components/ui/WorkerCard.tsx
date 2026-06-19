"use client";

import Link from "next/link";
import type { Worker } from "@/types";
import { useFavorites } from "@/hooks/useFavorites";

function WorkerAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="w-full h-full bg-linear-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
      <span className="text-4xl font-black text-primary">{initials}</span>
    </div>
  );
}

export default function WorkerCard({ id, name, specialty, imageUrl, imageAlt, rating, tags, status, location }: Worker) {
  const isAvailable = status === "available";
  const { isFavorite, toggle } = useFavorites();
  const favorited = isFavorite(id);

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-cream-dark overflow-hidden hover:border-primary transition-all group">
      <div className="relative h-48 w-full">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={imageAlt} className="w-full h-full object-cover object-top" />
        ) : (
          <WorkerAvatar name={name} />
        )}
        {imageUrl && <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent" />}
        <div className="absolute top-md right-md">
          {isAvailable ? (
            <span className="bg-green-100 text-secondary px-md py-xs rounded-full font-bold text-label-sm flex items-center gap-xs">
              <span className="w-2 h-2 rounded-full bg-secondary" /> Tersedia
            </span>
          ) : (
            <span className="bg-orange-100 text-orange-700 px-md py-xs rounded-full font-bold text-label-sm flex items-center gap-xs">
              <span className="w-2 h-2 rounded-full bg-orange-700" /> Sibuk
            </span>
          )}
        </div>
        <button
          onClick={() => toggle(id)}
          className="absolute top-md left-md w-8 h-8 rounded-full bg-surface/80 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-all"
          aria-label={favorited ? "Hapus dari favorit" : "Tambah ke favorit"}
        >
          <span
            className={`material-symbols-outlined text-[18px] transition-colors ${favorited ? "text-error" : "text-on-surface-variant"}`}
            style={{ fontVariationSettings: favorited ? "'FILL' 1" : "'FILL' 0" }}
          >
            favorite
          </span>
        </button>
      </div>
      <div className="p-xl">
        <div className="flex justify-between items-start mb-md">
          <div>
            <h4 className="font-headline-md text-body-lg text-forest-deep">{name}</h4>
            <p className="text-on-surface-variant text-body-md">{specialty}</p>
            {location && (
              <p className="flex items-center gap-xs text-on-surface-variant text-label-sm mt-xs">
                <span className="material-symbols-outlined text-[14px]">location_on</span>
                {location}
              </p>
            )}
          </div>
          <div className="flex items-center text-cta-amber">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              star
            </span>
            <span className="font-bold ml-xs text-on-surface">{rating}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-sm mb-xl">
          {tags.map((tag) => (
            <span key={tag} className="px-md py-xs bg-cream-dark rounded-full text-label-sm font-body-md">
              {tag}
            </span>
          ))}
        </div>
        <Link
          href={`/pekerja/${id}`}
          className="block w-full py-md rounded-full border-1.5 border-primary text-primary font-bold hover:bg-primary hover:text-on-primary transition-all text-center"
        >
          Lihat Profil
        </Link>
      </div>
    </div>
  );
}
