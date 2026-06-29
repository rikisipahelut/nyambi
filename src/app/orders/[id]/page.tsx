"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { api, ApiError } from "@/lib/api";
import SubHeader from "@/components/layout/SubHeader";
import type { OrderStatus } from "@/hooks/useOrders";

interface ProofPhoto {
  id: string;
  url: string;
}

interface OrderDetail {
  id: string;
  worker: { id: string; user_id: string; nama: string; specialty: string; image_url: string | null } | null;
  tanggal: string;
  waktu: string;
  deskripsi: string | null;
  alamat: string;
  telepon: string;
  status: OrderStatus;
  has_complaint: boolean;
  proof_photos: ProofPhoto[];
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

  // Proof photo upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

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

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const existing = order?.proof_photos.length ?? 0;
    const files = Array.from(e.target.files).slice(0, 5 - existing);
    setPendingFiles(files);
    setUploadError("");
    e.target.value = "";
  }

  async function handleUpload() {
    if (!pendingFiles.length || !order) return;
    setUploading(true);
    setUploadError("");
    const form = new FormData();
    pendingFiles.forEach((f) => form.append("photos[]", f));
    try {
      const res = await api.post<{ data: ProofPhoto[] }>(`/orders/${order.id}/proof`, form);
      setOrder((prev) => prev ? { ...prev, proof_photos: [...prev.proof_photos, ...res.data] } : prev);
      setPendingFiles([]);
    } catch (err) {
      setUploadError(err instanceof ApiError ? err.message : "Gagal mengupload foto.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(photoId: string) {
    if (!order) return;
    setDeletingId(photoId);
    try {
      await api.delete(`/orders/${order.id}/proof/${photoId}`);
      setOrder((prev) => prev ? { ...prev, proof_photos: prev.proof_photos.filter((p) => p.id !== photoId) } : prev);
    } catch { /* biarkan */ } finally {
      setDeletingId(null);
    }
  }

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

  const isWorkerView = !!(order.worker && user.id === order.worker.user_id);
  const canUpload = isWorkerView && (order.status === "dikonfirmasi" || order.status === "selesai");
  const maxPhotos = 5;
  const photoSlots = maxPhotos - (order.proof_photos.length + pendingFiles.length);

  return (
    <>
      <SubHeader backHref={isWorkerView ? "/pesanan-masuk" : "/riwayat-pesanan"} />

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

        {/* ── Foto Bukti Pekerjaan ── */}
        {(order.proof_photos.length > 0 || canUpload) && (
          <div className="mb-2xl">
            <div className="flex items-center justify-between mb-lg">
              <h2 className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                Foto Bukti Pekerjaan
              </h2>
              {order.proof_photos.length > 0 && (
                <span className="text-label-sm font-label-sm text-on-surface-variant">
                  {order.proof_photos.length}/{maxPhotos}
                </span>
              )}
            </div>

            {/* Grid foto yang sudah diupload */}
            {order.proof_photos.length > 0 && (
              <div className="grid grid-cols-3 gap-sm mb-md">
                {order.proof_photos.map((photo) => (
                  <div key={photo.id} className="relative group aspect-square rounded-xl overflow-hidden bg-surface-container-low">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.url}
                      alt="Bukti pekerjaan"
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => setLightboxUrl(photo.url)}
                    />
                    {isWorkerView && (
                      <button
                        onClick={() => handleDelete(photo.id)}
                        disabled={deletingId === photo.id}
                        className="absolute top-xs right-xs bg-error/90 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-60"
                        title="Hapus foto"
                      >
                        {deletingId === photo.id ? (
                          <span className="material-symbols-outlined text-[14px] animate-spin">progress_activity</span>
                        ) : (
                          <span className="material-symbols-outlined text-[14px]">close</span>
                        )}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Preview foto yang belum diupload */}
            {pendingFiles.length > 0 && (
              <div className="grid grid-cols-3 gap-sm mb-md">
                {pendingFiles.map((file, i) => (
                  <div key={i} className="relative group aspect-square rounded-xl overflow-hidden bg-surface-container-low border-2 border-dashed border-primary/40">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Preview"
                      className="w-full h-full object-cover opacity-80"
                    />
                    <button
                      onClick={() => setPendingFiles((prev) => prev.filter((_, j) => j !== i))}
                      className="absolute top-xs right-xs bg-surface/90 text-on-surface rounded-full w-7 h-7 flex items-center justify-center hover:bg-error hover:text-white transition-colors"
                    >
                      <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                    <div className="absolute bottom-xs left-xs right-xs text-center">
                      <span className="text-[10px] bg-surface/80 text-on-surface rounded px-xs py-0.5">Belum diupload</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Area upload (worker only) */}
            {canUpload && (
              <div className="space-y-sm">
                {photoSlots > 0 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="w-full flex items-center justify-center gap-md border-2 border-dashed border-cream-dark rounded-xl py-lg hover:border-primary hover:text-primary transition-all text-on-surface-variant disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[20px]">add_photo_alternate</span>
                    <span className="font-body-md text-body-md font-bold">
                      Tambah Foto {photoSlots > 0 ? `(maks. ${photoSlots} lagi)` : ""}
                    </span>
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />

                {uploadError && (
                  <div className="flex items-center gap-sm text-error font-label-sm text-label-sm bg-error-container/20 border border-error px-md py-sm rounded-lg">
                    <span className="material-symbols-outlined text-[16px] shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
                    {uploadError}
                  </div>
                )}

                {pendingFiles.length > 0 && (
                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="w-full py-md rounded-full bg-secondary text-on-primary font-bold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-sm"
                  >
                    {uploading ? (
                      <><span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span> Mengupload...</>
                    ) : (
                      <><span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>cloud_upload</span> Upload {pendingFiles.length} Foto</>
                    )}
                  </button>
                )}
              </div>
            )}

            {order.proof_photos.length === 0 && !canUpload && (
              <p className="text-on-surface-variant font-body-md text-body-md text-center py-lg">
                Belum ada foto bukti pekerjaan.
              </p>
            )}
          </div>
        )}

        {/* ── Riwayat Status ── */}
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

        {/* ── Banner Komplain ── */}
        {order.has_complaint && (
          <Link
            href={`/komplain/${order.id}`}
            className="flex items-center gap-md bg-cta-amber/10 border border-cta-amber/40 text-cta-amber px-xl py-lg rounded-xl mb-2xl hover:bg-cta-amber/20 transition-all"
          >
            <span className="material-symbols-outlined text-[20px] shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>gavel</span>
            <div className="flex-1 min-w-0">
              <p className="font-bold font-body-md text-body-md">Komplain Aktif</p>
              <p className="font-label-sm text-label-sm text-cta-amber/80">Ada komplain terbuka untuk pesanan ini. Klik untuk melihat thread.</p>
            </div>
            <span className="material-symbols-outlined text-[18px] shrink-0">chevron_right</span>
          </Link>
        )}

        {(order.status === "dikonfirmasi" || order.status === "selesai") && !order.has_complaint && (
          <Link
            href={`/komplain/${order.id}/buat`}
            className="flex items-center gap-md border border-cream-dark text-on-surface-variant px-xl py-lg rounded-xl mb-2xl hover:border-error hover:text-error transition-all"
          >
            <span className="material-symbols-outlined text-[20px] shrink-0">report</span>
            <span className="flex-1 font-body-md text-body-md font-bold">Ajukan Komplain</span>
            <span className="material-symbols-outlined text-[18px] shrink-0">chevron_right</span>
          </Link>
        )}

        <div className="flex flex-col sm:flex-row gap-lg">
          {order.worker && !isWorkerView && (
            <Link
              href={`/pekerja/${order.worker.id}`}
              className="flex-1 py-md rounded-full border border-primary text-primary font-bold hover:bg-primary hover:text-on-primary transition-all text-center"
            >
              Lihat Profil Pekerja
            </Link>
          )}
          <Link
            href={isWorkerView ? "/pesanan-masuk" : "/riwayat-pesanan"}
            className="flex-1 py-md rounded-full bg-primary text-on-primary font-bold hover:bg-primary-container transition-all text-center"
          >
            {isWorkerView ? "Pesanan Masuk" : "Riwayat Pesanan"}
          </Link>
        </div>
      </main>

      {/* Lightbox */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-xl"
          onClick={() => setLightboxUrl(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightboxUrl}
            alt="Foto bukti"
            className="max-w-full max-h-full object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setLightboxUrl(null)}
            className="absolute top-xl right-xl bg-surface/20 hover:bg-surface/40 text-white rounded-full w-11 h-11 flex items-center justify-center transition-all"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      )}
    </>
  );
}
