"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { api, ApiError } from "@/lib/api";
import type { OrderStatus } from "@/hooks/useOrders";

interface IncomingOrder {
  id: string;
  customer: { id: string; nama: string; telepon: string | null } | null;
  tanggal: string;
  waktu: string;
  deskripsi: string | null;
  alamat: string;
  telepon: string;
  status: OrderStatus;
  created_at: string;
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: string }> = {
  menunggu:     { label: "Menunggu Konfirmasi", color: "bg-cta-amber/15 text-cta-amber",            icon: "schedule"     },
  dikonfirmasi: { label: "Dikonfirmasi",         color: "bg-pale-mint/30 text-secondary",             icon: "check_circle" },
  selesai:      { label: "Selesai",              color: "bg-primary/10 text-primary",                 icon: "task_alt"     },
  dibatalkan:   { label: "Dibatalkan",           color: "bg-error-container text-on-error-container", icon: "cancel"       },
};

function formatTanggal(t: string) {
  return new Date(t).toLocaleDateString("id-ID", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  });
}

function formatCreated(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export default function PesananMasukClient() {
  const { user, ready } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<IncomingOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OrderStatus | "semua">("semua");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!ready) return;
    if (!user) { router.replace("/masuk?from=/pesanan-masuk"); return; }
    if (!user.is_worker) { router.replace("/profil"); return; }

    api.get<{ data: IncomingOrder[] }>("/orders")
      .then((res) => setOrders(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [ready, user, router]);

  async function handleAction(orderId: string, action: "confirm" | "complete") {
    setActionLoading(orderId + action);
    try {
      await api.put(`/orders/${orderId}/${action === "confirm" ? "confirm" : "complete"}`);
      setOrders((prev) => prev.map((o) =>
        o.id === orderId ? { ...o, status: action === "confirm" ? "dikonfirmasi" : "selesai" } : o
      ));
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Gagal memperbarui status.");
    } finally {
      setActionLoading(null);
    }
  }

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
          <span className="material-symbols-outlined text-outline text-[48px]">inbox</span>
        </div>
        <h2 className="font-headline-md text-headline-md text-forest-deep mb-md">Belum ada pesanan masuk</h2>
        <p className="text-text-mid font-body-md max-w-128 mx-auto">
          Pesanan dari pelanggan akan muncul di sini.
        </p>
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
          <button key={tab} onClick={() => setFilter(tab)}
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
              <div key={order.id} className="bg-surface-container-low border border-cream-dark rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-xl py-lg border-b border-cream-dark">
                  <div>
                    <p className="text-label-sm font-label-sm text-on-surface-variant uppercase">Dari</p>
                    <p className="font-body-lg text-body-lg text-forest-deep font-bold">
                      {order.customer?.nama ?? "Pelanggan"}
                    </p>
                  </div>
                  <span className={`${cfg.color} px-md py-xs rounded-full font-bold text-label-sm flex items-center gap-xs`}>
                    <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>{cfg.icon}</span>
                    {cfg.label}
                  </span>
                </div>

                {/* Body */}
                <div className="px-xl py-lg space-y-md">
                  <div className="flex items-start gap-md">
                    <span className="material-symbols-outlined text-on-surface-variant text-[18px] mt-xs shrink-0">calendar_today</span>
                    <div>
                      <p className="text-label-sm font-label-sm text-on-surface-variant uppercase">Jadwal</p>
                      <p className="font-body-md text-body-md text-on-surface">{formatTanggal(order.tanggal)}, {order.waktu} WIB</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-md">
                    <span className="material-symbols-outlined text-on-surface-variant text-[18px] mt-xs shrink-0">location_on</span>
                    <div>
                      <p className="text-label-sm font-label-sm text-on-surface-variant uppercase">Alamat</p>
                      <p className="font-body-md text-body-md text-on-surface">{order.alamat}</p>
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

                  <div className="flex items-start gap-md">
                    <span className="material-symbols-outlined text-on-surface-variant text-[18px] mt-xs shrink-0">call</span>
                    <div>
                      <p className="text-label-sm font-label-sm text-on-surface-variant uppercase">Kontak</p>
                      <p className="font-body-md text-body-md text-on-surface">+62 {order.telepon}</p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-xl py-md bg-surface-container border-t border-cream-dark flex items-center justify-between gap-md flex-wrap">
                  <p className="text-on-surface-variant text-label-sm font-label-sm">
                    Diterima {formatCreated(order.created_at)}
                  </p>
                  <div className="flex gap-md flex-wrap">
                    {order.status === "menunggu" && (
                      <button
                        disabled={!!actionLoading}
                        onClick={() => handleAction(order.id, "confirm")}
                        className="px-lg py-xs rounded-full bg-secondary text-on-primary font-bold text-label-sm hover:opacity-90 transition-all disabled:opacity-50"
                      >
                        {actionLoading === order.id + "confirm" ? "Memproses..." : "Konfirmasi"}
                      </button>
                    )}
                    <Link
                      href={`/orders/${order.id}`}
                      className="px-lg py-xs rounded-full border border-primary text-primary font-bold text-label-sm hover:bg-primary hover:text-on-primary transition-all"
                    >
                      Detail
                    </Link>
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
