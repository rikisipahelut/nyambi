"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";

function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "Baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  return `${Math.floor(diff / 86400)} hari lalu`;
}

export default function NotifikasiClient() {
  const { user, ready } = useAuth();
  const router = useRouter();
  const { notifs, markRead, markAllRead } = useNotifications();

  useEffect(() => {
    if (ready && !user) router.replace("/masuk");
  }, [ready, user, router]);

  if (!ready || !user) return null;

  const unread = notifs.filter((n) => !n.read).length;

  if (notifs.length === 0) {
    return (
      <div className="text-center py-5xl">
        <div className="w-24 h-24 bg-surface-container-low rounded-full flex items-center justify-center mx-auto mb-2xl">
          <span className="material-symbols-outlined text-outline text-[48px]">notifications_none</span>
        </div>
        <h2 className="font-headline-md text-headline-md text-forest-deep mb-md">Tidak ada notifikasi</h2>
        <p className="text-text-mid font-body-md">Anda sudah membaca semua notifikasi.</p>
      </div>
    );
  }

  return (
    <div>
      {unread > 0 && (
        <div className="flex items-center justify-between mb-xl">
          <p className="text-on-surface-variant font-body-md text-body-md">
            <strong className="text-forest-deep">{unread}</strong> belum dibaca
          </p>
          <button
            onClick={markAllRead}
            className="text-primary font-bold text-body-md hover:underline"
          >
            Tandai semua dibaca
          </button>
        </div>
      )}

      <div className="space-y-md">
        {notifs.map((n) => (
          <Link
            key={n.id}
            href={n.href}
            onClick={() => markRead(n.id)}
            className={`flex items-start gap-lg p-xl rounded-2xl border transition-all hover:border-primary group ${
              n.read
                ? "bg-surface-container-low border-cream-dark"
                : "bg-primary/5 border-primary/30"
            }`}
          >
            {/* unread dot */}
            <div className="relative shrink-0 mt-xs">
              <div className="w-10 h-10 bg-surface-container rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {n.icon}
                </span>
              </div>
              {!n.read && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-primary rounded-full" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className={`text-body-lg font-body-lg ${n.read ? "text-on-surface" : "text-forest-deep font-bold"}`}>
                {n.title}
              </p>
              <p className="text-on-surface-variant text-body-md font-body-md mt-xs leading-relaxed">{n.body}</p>
              <p className="text-on-surface-variant text-label-sm font-label-sm mt-md">{timeAgo(n.createdAt)}</p>
            </div>

            <span className="material-symbols-outlined text-on-surface-variant text-[18px] group-hover:text-primary transition-colors shrink-0 mt-xs">
              chevron_right
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
