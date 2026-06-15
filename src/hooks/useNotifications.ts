"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export interface Notif {
  id: string;
  icon: string;
  title: string;
  body: string;
  href: string;
  read: boolean;
  createdAt: string;
}

interface ApiNotif {
  id: string;
  icon: string;
  title: string;
  body: string;
  href: string;
  is_read: boolean;
  created_at: string;
}

function mapNotif(n: ApiNotif): Notif {
  return {
    id:        n.id,
    icon:      n.icon,
    title:     n.title,
    body:      n.body,
    href:      n.href,
    read:      n.is_read,
    createdAt: n.created_at,
  };
}

export function useNotifications() {
  const [notifs, setNotifs] = useState<Notif[]>([]);

  useEffect(() => {
    api.get<{ data: ApiNotif[] }>("/notifications")
      .then((res) => setNotifs(res.data.map(mapNotif)))
      .catch(() => {});
  }, []);

  async function markRead(id: string) {
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    await api.put(`/notifications/${id}/read`).catch(() => {});
  }

  async function markAllRead() {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
    await api.put("/notifications/read-all").catch(() => {});
  }

  const unreadCount = notifs.filter((n) => !n.read).length;

  return { notifs, markRead, markAllRead, unreadCount };
}
