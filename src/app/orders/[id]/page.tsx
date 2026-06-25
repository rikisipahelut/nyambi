"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { api, ApiError } from "@/lib/api";
import type { OrderStatus } from "@/hooks/useOrders";

interface OrderDetail {
  id: string;
  worker: { id: string; nama: string; specialty: string; image_url: string | null } | null;
  tanggal: string;
  waktu: string;
  deskripsi: string | null;
  alamat: string;
  telepon: string;
  status: OrderStatus;
  created_at: string;
}

interface StatusLog {
  from_status: OrderStatus | null;
  to_status: OrderStatus;
  note: string | null;
  actor: string;
  created_at: string;
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: string }> = {
  menunggu:     { label: "Menunggu Konfirmasi", color: "bg-cta-amber/15 text-cta-amber",              icon: "schedule"     },
  dikonfirmasi: { label: "Dikonfirmasi",         color: "bg-pale-mint/30 text-secondary",               icon: "check_circle" },
  selesai:      { label: "Selesai",              color: "bg-primary/10 text-primary",                   icon: "task_alt"     },
  dibatalkan:   { label: "Dibatalkan",           color: "bg-error-container text-on-error-container",   icon: "cancel"       },
  kadaluarsa:   { label: "Kadaluarsa",           color: "bg-surface-container text-on-surface-variant", icon: "event_busy"   },
};

function Row({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex gap-lg px-xl py-lg border-b border-cream-dark last:border-0">
      <span className="material-symbols-outlined text-on-surface-variant text-[20px] shrink-0 mt-xs">{icon}</span>
      <div className="min-w-0">
        <p className="text-label-sm font-label-sm text-on-surface-variant uppercase mb-xs">{label}</p>
        <p className="text-on-surface font-body-md text-body-md wrap-break-word">{value}</p>
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  const { user, ready } = useAuth();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [logs, setLogs] = useState<StatusLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (!user) { router.replace(`/masuk?from=/orders/${params.id}`); return; }

    Promise.all([
      api.get<{ data: OrderDetail }>(`/orders/${params.id}`),
      api.get<{ data: StatusLog[] }>(`/orders/${params.id}/logs`),
    ])
      .then(([orderRes, logsRes]) => {
        setOrder(orderRes.data);
        setLogs(logsRes.data);
      })
      .catch((err) => {
        if (err instanceof ApiError && (err.status === 404 || err.status === 403)) setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [ready, user, router, params.id]);

  if (!ready || !user) return null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="material-symbols-outlined text-[48px] text-primary animate-spin">progress_activity</span>
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-lg px-xl text-center">
        <span className="material-symbols-outlined text-[64px] text-outline">receipt_long</span>
        <h1 className="font-headline-md text-headline-md text-forest-deep">Pesanan tidak ditemukan</h1>
        <p className="text-on-surface-variant font-body-md">Pesanan ini tidak ada atau bukan milik Anda.</p>
        <Link href="/riwayat-pesanan" className="px-4xl py-md rounded-full bg-primary text-on-primary font-bold hover:bg-primary-container transition-all">
          Lihat Riwayat Pesanan
        </Link>
      </main>
    );
  }

  const cfg = STATUS_CONFIG[order.status];
  const tanggalFormatted = new Date(order.tanggal).toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <>
      <header className="bg-surface sticky top-0 z-50 border-b border-cream-dark">
        <nav className="flex items-center h-20 px-xl md:px-5xl max-w-360 mx-auto w-full gap-lg">
          <Link href="/riwayat-pesanan" className="text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <span className="text-headline-md font-display font-black text-primary tracking-tight">Nyambi</span>
        </nav>
      </header>

      <main className="py-4xl px-xl md:px-5xl max-w-144 mx-auto">
        <div className="flex items-center justify-between mb-2xl flex-wrap gap-md">
          <div>
            <p className="text-label-sm font-label-sm text-on-surface-variant uppercase mb-xs">Nomor Pesanan</p>
            <p className="font-mono text-sm text-forest-deep tracking-wider">INV-{order.id.slice(0, 8).toUpperCase()}</p>
          </div>
          <span className={`${cfg.color} px-md py-xs rounded-full font-bold text-label-sm flex items-center gap-xs`}>
            <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>{cfg.icon}</span>
            {cfg.label}
          </span>
        </div>

        <div className="bg-surface-container-lowest rounded-xl border border-cream-dark overflow-hidden mb-2xl">
          {order.worker && (
            <Row icon="person" label="Pekerja" value={`${order.worker.nama} · ${order.worker.specialty}`} />
          )}
          <Row icon="calendar_today" label="Jadwal" value={`${tanggalFormatted}, ${order.waktu} WIB`} />
          {order.deskripsi && <Row icon="description" label="Deskripsi Pekerjaan" value={order.deskripsi} />}
          <Row icon="location_on" label="Alamat" value={order.alamat} />
          <Row icon="call" label="Nomor Telepon" value={`+62 ${order.telepon}`} />
        </div>

        {logs.length > 0 && (
          <div className="mb-2xl">
            <h2 className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-lg">Riwayat Status</h2>
            <div className="relative">
              <div className="absolute left-2.75 top-0 bottom-0 w-px bg-cream-dark" />
              <div className="space-y-lg">
                {logs.map((log, i) => {
                  const toCfg = STATUS_CONFIG[log.to_status];
                  return (
                    <div key={i} className="flex gap-lg items-start relative">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 ${toCfg.color}`}>
                        <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>{toCfg.icon}</span>
                      </div>
                      <div className="pt-xs flex-1 min-w-0">
                        <p className="font-body-md text-body-md text-on-surface font-bold">{toCfg.label}</p>
                        {log.note && (
                          <p className="text-on-surface-variant font-body-sm text-body-sm mt-xs">"{log.note}"</p>
                        )}
                        <p className="text-on-surface-variant font-label-sm text-label-sm mt-xs">
                          {log.actor} · {new Date(log.created_at).toLocaleDateString("id-ID", {
                            day: "numeric", month: "short", year: "numeric",
                            hour: "2-digit", minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-lg">
          {order.worker && (
            <Link
              href={`/pekerja/${order.worker.id}`}
              className="flex-1 py-md rounded-full border border-primary text-primary font-bold hover:bg-primary hover:text-on-primary transition-all text-center"
            >
              Lihat Profil Pekerja
            </Link>
          )}
          <Link
            href="/riwayat-pesanan"
            className="flex-1 py-md rounded-full bg-primary text-on-primary font-bold hover:bg-primary-container transition-all text-center"
          >
            Riwayat Pesanan
          </Link>
        </div>
      </main>
    </>
  );
}
