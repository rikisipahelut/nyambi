"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useOrders } from "@/hooks/useOrders";
import type { OrderStatus } from "@/hooks/useOrders";

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: string }> = {
  menunggu:     { label: "Menunggu Konfirmasi", color: "bg-cta-amber/15 text-cta-amber",           icon: "schedule"  },
  dikonfirmasi: { label: "Dikonfirmasi",         color: "bg-pale-mint/30 text-secondary",            icon: "check_circle" },
  selesai:      { label: "Selesai",              color: "bg-primary/10 text-primary",                icon: "task_alt"  },
  dibatalkan:   { label: "Dibatalkan",           color: "bg-error-container text-on-error-container", icon: "cancel"   },
};

function formatTanggal(tanggal: string) {
  if (!tanggal) return "-";
  return new Date(tanggal).toLocaleDateString("id-ID", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  });
}

function formatCreated(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export default function RiwayatClient() {
  const { user, ready } = useAuth();
  const router = useRouter();
  const { orders, loading, cancelOrder } = useOrders();
  const [filter, setFilter] = useState<OrderStatus | "semua">("semua");
  const [cancelling, setCancelling] = useState<string | null>(null);

  useEffect(() => {
    if (ready && !user) router.replace("/masuk?from=/riwayat-pesanan");
  }, [ready, user, router]);

  if (!ready || !user) return null;

  if (loading) {
    return (
      <div className="space-y-xl">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-surface-container-low border border-cream-dark rounded-2xl h-40 animate-pulse" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-5xl">
        <div className="w-24 h-24 bg-surface-container-low rounded-full flex items-center justify-center mx-auto mb-2xl">
          <span className="material-symbols-outlined text-outline text-[48px]">shopping_bag</span>
        </div>
        <h2 className="font-headline-md text-headline-md text-forest-deep mb-md">
          Belum ada pesanan
        </h2>
        <p className="text-text-mid font-body-md max-w-128 mx-auto mb-3xl">
          Pesanan yang Anda buat akan muncul di sini. Mulai cari pekerja sekarang!
        </p>
        <Link
          href="/kategori"
          className="inline-block px-4xl py-md rounded-full bg-primary text-on-primary font-bold hover:bg-primary-container transition-all"
        >
          Cari Jasa Sekarang
        </Link>
      </div>
    );
  }

  const counts = {
    semua:        orders.length,
    menunggu:     orders.filter((o) => o.status === "menunggu").length,
    dikonfirmasi: orders.filter((o) => o.status === "dikonfirmasi").length,
    selesai:      orders.filter((o) => o.status === "selesai").length,
    dibatalkan:   orders.filter((o) => o.status === "dibatalkan").length,
  };

  const filtered = filter === "semua" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex gap-sm flex-wrap mb-3xl">
        {(["semua", "menunggu", "dikonfirmasi", "selesai", "dibatalkan"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-lg py-sm rounded-full font-body-md text-body-md font-bold transition-all ${
              filter === tab
                ? "bg-primary text-on-primary"
                : "border border-cream-dark text-on-surface-variant hover:border-primary hover:text-primary"
            }`}
          >
            {tab === "semua" ? "Semua" : STATUS_CONFIG[tab].label}
            {counts[tab] > 0 && (
              <span className={`ml-xs text-label-sm ${filter === tab ? "opacity-80" : "text-primary"}`}>
                ({counts[tab]})
              </span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-4xl text-on-surface-variant font-body-md">
          Tidak ada pesanan dengan status ini.
        </div>
      ) : (
        <div className="space-y-xl">
          {filtered.map((order) => {
            const cfg = STATUS_CONFIG[order.status];
            return (
              <div key={order.orderId} className="bg-surface-container-low border border-cream-dark rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-xl py-lg border-b border-cream-dark">
                  <div>
                    <p className="text-label-sm font-label-sm text-on-surface-variant uppercase">Nomor Pesanan</p>
                    <p className="font-mono text-sm text-forest-deep tracking-wider">
                      {order.orderId.split("-")[0].toUpperCase()}
                    </p>
                  </div>
                  <span className={`${cfg.color} px-md py-xs rounded-full font-bold text-label-sm flex items-center gap-xs`}>
                    <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {cfg.icon}
                    </span>
                    {cfg.label}
                  </span>
                </div>

                {/* Body */}
                <div className="px-xl py-lg space-y-md">
                  <div className="flex items-start gap-md">
                    <span className="material-symbols-outlined text-on-surface-variant text-[18px] mt-xs shrink-0">person</span>
                    <div>
                      <p className="text-label-sm font-label-sm text-on-surface-variant uppercase">Pekerja</p>
                      <p className="font-body-lg text-body-lg text-on-surface">{order.worker}</p>
                      <p className="text-on-surface-variant font-body-md text-body-md">{order.specialty}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-md">
                    <span className="material-symbols-outlined text-on-surface-variant text-[18px] mt-xs shrink-0">calendar_today</span>
                    <div>
                      <p className="text-label-sm font-label-sm text-on-surface-variant uppercase">Jadwal</p>
                      <p className="font-body-md text-body-md text-on-surface">
                        {formatTanggal(order.tanggal)}, {order.waktu} WIB
                      </p>
                    </div>
                  </div>

                  {order.deskripsi && (
                    <div className="flex items-start gap-md">
                      <span className="material-symbols-outlined text-on-surface-variant text-[18px] mt-xs shrink-0">description</span>
                      <div>
                        <p className="text-label-sm font-label-sm text-on-surface-variant uppercase">Deskripsi</p>
                        <p className="font-body-md text-body-md text-on-surface line-clamp-2">{order.deskripsi}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-xl py-md bg-surface-container border-t border-cream-dark flex items-center justify-between gap-md flex-wrap">
                  <p className="text-on-surface-variant text-label-sm font-label-sm">
                    Dipesan {formatCreated(order.createdAt)}
                  </p>
                  <div className="flex gap-md">
                    {order.status === "menunggu" && (
                      <button
                        disabled={cancelling === order.orderId}
                        onClick={async () => {
                          setCancelling(order.orderId);
                          try { await cancelOrder(order.orderId); } finally { setCancelling(null); }
                        }}
                        className="px-lg py-xs rounded-full border border-error text-error font-bold text-label-sm hover:bg-error-container transition-all disabled:opacity-50"
                      >
                        {cancelling === order.orderId ? "Membatalkan..." : "Batalkan"}
                      </button>
                    )}
                    {order.workerId && (
                      <Link
                        href={`/pekerja/${order.workerId}`}
                        className="px-lg py-xs rounded-full border border-primary text-primary font-bold text-label-sm hover:bg-primary hover:text-on-primary transition-all"
                      >
                        Lihat Pekerja
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
