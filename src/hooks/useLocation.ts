"use client";

import { useState, useEffect } from "react";

const LOKASI_KEY = "nyambi_lokasi";

export function useLocation() {
  const [lokasi, setLokasiState] = useState("");
  const [isDetecting, setIsDetecting] = useState(false);

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

  function detect() {
    if (!navigator.geolocation) return;
    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.latitude}&longitude=${coords.longitude}&localityLanguage=id`
          );
          const data = await res.json();
          const nama: string = data.city || data.locality || data.principalSubdivision || "";
          if (nama) setLokasi(nama);
        } catch {}
        setIsDetecting(false);
      },
      () => setIsDetecting(false),
      { timeout: 10000 }
    );
  }

  return { lokasi, setLokasi, isDetecting, detect };
}
