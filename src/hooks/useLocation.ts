"use client";

import { useState, useEffect } from "react";

const LOKASI_KEY = "nyambi_lokasi";

export function useLocation() {
  const [lokasi, setLokasiState] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOKASI_KEY);
      if (saved) setLokasiState(saved);
    } catch {}
  }, []);

  function setLokasi(val: string) {
    setLokasiState(val);
    try {
      if (val) localStorage.setItem(LOKASI_KEY, val);
      else localStorage.removeItem(LOKASI_KEY);
    } catch {}
  }

  return { lokasi, setLokasi };
}
