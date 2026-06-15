"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const KEY = "nyambi_favorites"; // local cache for instant UI

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    // Seed from cache instantly, then sync with API
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setFavorites(JSON.parse(raw));
    } catch {}

    api.get<{ data: { worker_id: string }[] }>("/favorites")
      .then((res) => {
        const ids = res.data.map((w) => w.worker_id);
        setFavorites(ids);
        localStorage.setItem(KEY, JSON.stringify(ids));
      })
      .catch(() => {}); // offline — use cached
  }, []);

  async function toggle(workerId: string) {
    const isFav = favorites.includes(workerId);
    const snapshot = [...favorites];

    // Optimistic update
    const updated = isFav
      ? favorites.filter((id) => id !== workerId)
      : [...favorites, workerId];
    setFavorites(updated);
    localStorage.setItem(KEY, JSON.stringify(updated));

    try {
      if (isFav) {
        await api.delete(`/favorites/${workerId}`);
      } else {
        await api.post(`/favorites/${workerId}`);
      }
    } catch {
      // Rollback on failure
      setFavorites(snapshot);
      localStorage.setItem(KEY, JSON.stringify(snapshot));
    }
  }

  function isFavorite(workerId: string) {
    return favorites.includes(workerId);
  }

  return { favorites, toggle, isFavorite };
}
