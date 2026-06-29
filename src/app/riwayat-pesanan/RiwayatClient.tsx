"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useOrders } from "@/hooks/useOrders";
import type { OrderStatus } from "@/hooks/useOrders";

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: string }> = {
  menunggu:     { label: "Menunggu Konfirmasi", color: "bg-cta-amber/15 text-cta-amber",              icon: "schedule"     },
  dikonfirmasi: { label: "Dikonfirmasi",         color: "bg-pale-mint/30 text-secondary",               icon: "check_circle" },
  selesai:      { label: "Selesai",              color: "bg-primary/10 text-primary",                   icon: "task_alt"     },
  dibatalkan:   { label: "Dibatalkan",           color: "bg-error-container text-on-error-container",   icon: "cancel"       },
  kadaluarsa:   { label: "Kadaluarsa",           color: "bg-surface-container text-on-surface-variant", icon: "event_busy"   },
};

const CANCEL_REASONS = [
  "Berubah pikiran",
  "Jadwal bentrok",
  "Salah pesan",
  "Menemukan pekerja lain",
  "Lainnya",
];

function formatTanggal(tanggal: string) {
  if (!tanggal) return "-";
  return new Date(tanggal).toLocaleDateString("id-ID", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  });
}

function formatOrderNo(id: string) {
  return `INV-${id.slice(0, 8).toUpperCase()}`;
}

function formatCreated(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export default function RiwayatClient() {
  const { user, ready } = useAuth();
  const router = useRouter();
  const { orders, loading, cancelOrder, completeOrder } = useOrders();
  const [filter, setFilter] = useState<OrderStatus | "semua">("semua");
  const [completing, setCompleting] = useState<string | null>(null);

  // Cancel modal state
  const [cancelTarget, setCancelTarget] = useState<string | null>(null);
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (ready && !user) router.replace("/masuk?from=/riwayat-pesanan");
  }, [ready, user, router]);

  function openCancelModal(orderId: string) {
    setCancelTarget(orderId);
    setSelectedReason("");
    setCustomReason("");
  }

  function closeCancelModal() {
    setCancelTarget(null);
    setSelectedReason("");
    setCustomReason("");
  }

  async function handleConfirmCancel() {
    if (!cancelTarget) return;
    const reason = selectedReason === "Lainnya" ? customReason.trim() : selectedReason;
    if (!reason) return;

    setCancelling(true);
    try {
      await cancelOrder(cancelTarget, reason);
      closeCancelModal();
    } finally {
      setCancelling(false);
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
          <span className="material-symbols-outlined text-outline text-[48px]">shopping_bag</span>
        </div>
        <h2 className="font-headline-md text-headline-md text-forest-deep mb-md">Belum ada pesanan</h2>
        <p className="text-text-mid font-body-md max-w-128 mx-auto mb-3xl">
          Pesanan yang Anda buat akan muncul di sini. Mulai cari pekerja sekarang!
        </p>
        <Link href="/kategori" className="inline-block px-4xl py-md rounded-full bg-primary text-on-primary font-bold hover:bg-primary-container transition-all">
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
    kadaluarsa:   orders.filter((o) => o.status === "kadaluarsa").length,
  };

  const filtered = filter === "semua" ? orders : orders.filter((o) => o.status === filter);
  const isReasonValid = selectedReason && (selectedReason !== "Lainnya" || customReason.trim().length > 0);

  return (
    <div>
      {/* Cancel modal */}
      {cancelTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-xl">
          <div className="bg-surface rounded-2xl w-full max-w-128 shadow-xl">
            <div className="px-xl pt-xl pb-lg border-b border-cream-dark">
              <h3 className="font-headline-md text-headline-md text-forest-deep">Batalkan Pesanan</h3>
              <p className="text-on-surface-variant font-body-md text-body-md mt-xs">Pilih alasan pembatalan pesanan ini.</p>
            </div>
            <div className="px-xl py-lg space-y-sm">
              {CANCEL_REASONS.map((reason) => (
                <label key={reason} className="flex items-center gap-md cursor-pointer group">
                  <input
                    type="radio"
                    name="cancel-reason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={() => setSelectedReason(reason)}
                    className="accent-primary w-4 h-4 shrink-0"
                  />
                  <span className="font-body-md text-body-md text-on-surface group-hover:text-primary transition-colors">
                    {reason}
                  </span>
                </label>
              ))}
              {selectedReason === "Lainnya" && (
                <textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Tuliskan alasan Anda..."
                  rows={3}
                  className="w-full mt-sm border border-cream-dark rounded-xl px-md py-sm font-body-md text-body-md text-on-surface bg-surface-container-low focus:outline-none focus:border-primary resize-none"
                />
              )}
            </div>
            <div className="px-xl pb-xl flex gap-md">
              <button
                onClick={closeCancelModal}
                disabled={cancelling}
                className="flex-1 py-sm rounded-full border border-cream-dark text-on-surface-variant font-bold font-body-md hover:bg-surface-container transition-all disabled:opacity-50"
              >
                Kembali
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={!isReasonValid || cancelling}
                className="flex-1 py-sm rounded-full bg-error text-on-primary font-bold font-body-md hover:opacity-90 transition-all disabled:opacity-40"
              >
                {cancelling ? "Membatalkan..." : "Konfirmasi Batal"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-sm flex-wrap mb-3xl">
        {(["semua", "menunggu", "dikonfirmasi", "selesai", "dibatalkan", "kadaluarsa"] as const).map((tab) => (
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
                    <p className="font-mono text-sm text-forest-deep tracking-wider">{formatOrderNo(order.orderId)}</p>
                  </div>
                  <span className={`${cfg.color} px-md py-xs rounded-full font-bold text-label-sm flex items-center gap-xs`}>
                    <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>{cfg.icon}</span>
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
                      <p className="font-body-md text-body-md text-on-surface">{formatTanggal(order.tanggal)}, {order.waktu} WIB</p>
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

                  {order.status === "dibatalkan" && order.cancellationReason && (
                    <div className="flex items-start gap-md">
                      <span className="material-symbols-outlined text-error text-[18px] mt-xs shrink-0">info</span>
                      <div>
                        <p className="text-label-sm font-label-sm text-error uppercase">Alasan Pembatalan</p>
                        <p className="font-body-md text-body-md text-on-surface">{order.cancellationReason}</p>
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
                        onClick={() => openCancelModal(order.orderId)}
                        className="px-lg py-xs rounded-full border border-error text-error font-bold text-label-sm hover:bg-error-container transition-all"
                      >
                        Batalkan
                      </button>
                    )}
                    {order.status === "dikonfirmasi" && (
                      <button
                        disabled={completing === order.orderId}
                        onClick={async () => {
                          setCompleting(order.orderId);
                          try { await completeOrder(order.orderId); } finally { setCompleting(null); }
                        }}
                        className="px-lg py-xs rounded-full bg-secondary text-on-primary font-bold text-label-sm hover:opacity-90 transition-all disabled:opacity-50"
                      >
                        {completing === order.orderId ? "Memproses..." : "Tandai Selesai"}
                      </button>
                    )}
                    {(order.status === "dikonfirmasi" || order.status === "selesai") && (
                      <Link
                        href={`/komplain/${order.orderId}`}
                        className={`px-lg py-xs rounded-full font-bold text-label-sm transition-all ${
                          order.hasComplaint
                            ? "bg-cta-amber/15 text-cta-amber border border-cta-amber/40 hover:bg-cta-amber/25"
                            : "border border-on-surface-variant/40 text-on-surface-variant hover:border-error hover:text-error"
                        }`}
                      >
                        {order.hasComplaint ? "Komplain Aktif" : "Komplain"}
                      </Link>
                    )}
                    {order.workerId && (
                      <Link
                        href={`/pekerja/${order.workerId}`}
                        className="px-lg py-xs rounded-full border border-primary text-primary font-bold text-label-sm hover:bg-primary hover:text-on-primary transition-all"
                      >
                        Lihat Pekerja
                      </Link>
                    )}
                    <Link
                      href={`/orders/${order.orderId}`}
                      className="px-lg py-xs rounded-full bg-primary text-on-primary font-bold text-label-sm hover:bg-primary-container transition-all"
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
