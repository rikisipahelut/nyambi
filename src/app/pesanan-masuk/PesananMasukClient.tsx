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
  cancellation_reason: string | null;
  has_complaint: boolean;
  created_at: string;
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: string }> = {
  menunggu:     { label: "Menunggu Konfirmasi", color: "bg-cta-amber/15 text-cta-amber",            icon: "schedule"     },
  dikonfirmasi: { label: "Dikonfirmasi",         color: "bg-pale-mint/30 text-secondary",             icon: "check_circle" },
  selesai:      { label: "Selesai",              color: "bg-primary/10 text-primary",                 icon: "task_alt"     },
  dibatalkan:   { label: "Dibatalkan",           color: "bg-error-container text-on-error-container", icon: "cancel"       },
  kadaluarsa:   { label: "Kadaluarsa",           color: "bg-surface-container text-on-surface-variant", icon: "event_busy" },
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
  const [orderErrors, setOrderErrors] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  type PagedResponse = { data: IncomingOrder[]; meta: { total: number; page: number; total_pages: number } };

  useEffect(() => {
    if (!ready) return;
    if (!user) { router.replace("/masuk?from=/pesanan-masuk"); return; }
    if (!user.is_worker) { router.replace("/profil"); return; }

    api.get<PagedResponse>("/orders?page=1")
      .then((res) => {
        setOrders(res.data);
        setTotalPages(res.meta.total_pages);
        setTotal(res.meta.total);
        setPage(1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [ready, user, router]);

  async function loadMore() {
    const next = page + 1;
    setLoadingMore(true);
    try {
      const res = await api.get<PagedResponse>(`/orders?page=${next}`);
      setOrders((prev) => [...prev, ...res.data]);
      setPage(next);
      setTotalPages(res.meta.total_pages);
      setTotal(res.meta.total);
    } catch { /* biarkan */ } finally {
      setLoadingMore(false);
    }
  }

  async function handleConfirm(orderId: string) {
    setActionLoading(orderId);
    setOrderErrors((prev) => ({ ...prev, [orderId]: "" }));
    try {
      await api.put(`/orders/${orderId}/confirm`);
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: "dikonfirmasi" } : o));
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Gagal mengkonfirmasi pesanan.";
      setOrderErrors((prev) => ({ ...prev, [orderId]: message }));
      try {
        const fresh = await api.get<PagedResponse>("/orders?page=1");
        setOrders(fresh.data);
        setTotalPages(fresh.meta.total_pages);
        setTotal(fresh.meta.total);
        setPage(1);
      } catch { /* biarkan */ }
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
    kadaluarsa:   orders.filter((o) => o.status === "kadaluarsa").length,
  };

  const filtered = filter === "semua" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex gap-sm flex-wrap mb-3xl">
        {(["semua", "menunggu", "dikonfirmasi", "selesai", "dibatalkan", "kadaluarsa"] as const).map((tab) => (
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

                  {order.status === "dibatalkan" && order.cancellation_reason && (
                    <div className="flex items-start gap-md">
                      <span className="material-symbols-outlined text-error text-[18px] mt-xs shrink-0">info</span>
                      <div>
                        <p className="text-label-sm font-label-sm text-error uppercase">Alasan Pembatalan</p>
                        <p className="font-body-md text-body-md text-on-surface">{order.cancellation_reason}</p>
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
                <div className="px-xl py-md bg-surface-container border-t border-cream-dark flex flex-col gap-sm">
                  {orderErrors[order.id] && (
                    <div className="flex items-center gap-xs text-error text-label-sm font-label-sm bg-error-container rounded-lg px-md py-xs">
                      <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
                      {orderErrors[order.id]}
                    </div>
                  )}
                  <div className="flex items-center justify-between gap-md flex-wrap">
                    <p className="text-on-surface-variant text-label-sm font-label-sm">
                      Diterima {formatCreated(order.created_at)}
                    </p>
                    <div className="flex gap-md flex-wrap">
                      {order.status === "menunggu" && (
                        <button
                          disabled={actionLoading === order.id}
                          onClick={() => handleConfirm(order.id)}
                          className="px-lg py-xs rounded-full bg-secondary text-on-primary font-bold text-label-sm hover:opacity-90 transition-all disabled:opacity-50"
                        >
                          {actionLoading === order.id ? "Memproses..." : "Konfirmasi"}
                        </button>
                      )}
                      {(order.status === "dikonfirmasi" || order.status === "selesai") && (
                        <Link
                          href={`/komplain/${order.id}`}
                          className={`px-lg py-xs rounded-full font-bold text-label-sm transition-all ${
                            order.has_complaint
                              ? "bg-cta-amber/15 text-cta-amber border border-cta-amber/40 hover:bg-cta-amber/25"
                              : "border border-on-surface-variant/40 text-on-surface-variant hover:border-error hover:text-error"
                          }`}
                        >
                          {order.has_complaint ? "Komplain Aktif" : "Komplain"}
                        </Link>
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
              </div>
            );
          })}
        </div>
      )}

      {page < totalPages && (
        <div className="text-center mt-3xl">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="px-4xl py-md rounded-full border border-primary text-primary font-bold font-body-md hover:bg-primary hover:text-on-primary transition-all disabled:opacity-50"
          >
            {loadingMore ? "Memuat..." : `Muat Lebih (${total - orders.length} tersisa)`}
          </button>
        </div>
      )}
    </div>
  );
}
