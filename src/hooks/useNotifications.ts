"use client";

import { useEffect, useState } from "react";

export interface Notif {
  id: string;
  icon: string;
  title: string;
  body: string;
  href: string;
  read: boolean;
  createdAt: string;
}

const KEY = "nyambi_notifs";

const SEEDS: Notif[] = [
  {
    id: "n1",
    icon: "celebration",
    title: "Selamat datang di Nyambi!",
    body: "Temukan ribuan pekerja terampil di sekitar Anda.",
    href: "/",
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  },
  {
    id: "n2",
    icon: "tips_and_updates",
    title: "Lengkapi profil Anda",
    body: "Tambahkan nomor telepon agar pekerja lebih mudah menghubungi Anda.",
    href: "/profil/edit",
    read: false,
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
];

function ensureSeeds() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      localStorage.setItem(KEY, JSON.stringify(SEEDS));
      return SEEDS;
    }
    return JSON.parse(raw) as Notif[];
  } catch {
    return SEEDS;
  }
}

export function useNotifications() {
  const [notifs, setNotifs] = useState<Notif[]>([]);

  useEffect(() => {
    setNotifs(ensureSeeds());
  }, []);

  function markRead(id: string) {
    setNotifs((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      localStorage.setItem(KEY, JSON.stringify(updated));
      return updated;
    });
  }

  function markAllRead() {
    setNotifs((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      localStorage.setItem(KEY, JSON.stringify(updated));
      return updated;
    });
  }

  const unreadCount = notifs.filter((n) => !n.read).length;

  return { notifs, markRead, markAllRead, unreadCount };
}
