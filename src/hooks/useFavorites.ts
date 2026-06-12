"use client";

import { useEffect, useState } from "react";

const KEY = "nyambi_favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setFavorites(JSON.parse(raw));
    } catch {}
  }, []);

  function toggle(workerId: string) {
    setFavorites((prev) => {
      const updated = prev.includes(workerId)
        ? prev.filter((id) => id !== workerId)
        : [...prev, workerId];
      localStorage.setItem(KEY, JSON.stringify(updated));
      return updated;
    });
  }

  function isFavorite(workerId: string) {
    return favorites.includes(workerId);
  }

  return { favorites, toggle, isFavorite };
}
