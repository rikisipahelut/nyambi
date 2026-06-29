"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { api, ApiError } from "@/lib/api";

interface ComplaintResponse {
  id: string;
  sent_as: "customer" | "worker";
  author_name: string;
  pesan: string;
  created_at: string;
}

interface ComplaintData {
  id: string;
  order_id: string;
  filed_as: "customer" | "worker";
  filer_name: string;
  tipe: string;
  deskripsi: string;
  status: "terbuka" | "diselesaikan" | "ditutup" | "diselesaikan_admin";
  created_at: string;
  responses: ComplaintResponse[];
}

const TIPE_LABELS: Record<string, string> = {
  pekerjaan_tidak_sesuai:  "Pekerjaan tidak sesuai deskripsi",
  pekerja_tidak_hadir:     "Pekerja tidak hadir sesuai jadwal",
  pekerjaan_tidak_selesai: "Pekerjaan tidak selesai",
  customer_tidak_ada:      "Customer tidak ada di lokasi",
  lainnya:                 "Lainnya",
};

const STATUS_CONFIG = {
  terbuka:           { label: "Aktif",          color: "bg-cta-amber/15 text-cta-amber",              icon: "gavel" },
  diselesaikan:      { label: "Diselesaikan",    color: "bg-primary/10 text-primary",                  icon: "check_circle" },
  ditutup:           { label: "Ditutup",         color: "bg-surface-container text-on-surface-variant",icon: "cancel" },
  diselesaikan_admin:{ label: "Diselesaikan Admin", color: "bg-pale-mint/30 text-secondary",           icon: "admin_panel_settings" },
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export default function KomplainClient({ orderId }: { orderId: string }) {
  const { user, ready } = useAuth();
  const router = useRouter();
  const [complaint, setComplaint] = useState<ComplaintData | null | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [replying, setReplying] = useState(false);
  const [actionLoading, setActionLoading] = useState<"resolve" | "close" | null>(null);
  const [replyError, setReplyError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ready) return;
    if (!user) { router.replace(`/masuk?from=/komplain/${orderId}`); return; }

    api.get<{ data: ComplaintData | null }>(`/orders/${orderId}/complaint`)
      .then((res) => setComplaint(res.data))
      .catch(() => setComplaint(null))
      .finally(() => setLoading(false));
  }, [ready, user, router, orderId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [complaint?.responses?.length]);

  async function handleReply() {
    if (!replyText.trim()) return;
    setReplying(true);
    setReplyError("");
    try {
      const res = await api.post<{ data: ComplaintResponse }>(`/orders/${orderId}/complaint/responses`, { pesan: replyText.trim() });
      setComplaint((prev) => prev ? { ...prev, responses: [...prev.responses, res.data] } : prev);
      setReplyText("");
    } catch (err) {
      setReplyError(err instanceof ApiError ? err.message : "Gagal mengirim balasan.");
    } finally {
      setReplying(false);
    }
  }

  async function handleAction(action: "resolve" | "close") {
    setActionLoading(action);
    try {
      await api.put(`/orders/${orderId}/complaint/${action}`);
      setComplaint((prev) => prev ? { ...prev, status: action === "resolve" ? "diselesaikan" : "ditutup" } : prev);
    } catch { /* biarkan */ } finally {
      setActionLoading(null);
    }
  }

  if (!ready || !user) return null;

  if (loading || complaint === undefined) {
    return (
      <div className="space-y-xl">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-surface-container-low border border-cream-dark rounded-2xl h-24 animate-pulse" />
        ))}
      </div>
    );
  }

  if (complaint === null) {
    return (
      <div className="text-center py-5xl">
        <div className="w-24 h-24 bg-surface-container-low rounded-full flex items-center justify-center mx-auto mb-2xl">
          <span className="material-symbols-outlined text-outline text-[48px]">gavel</span>
        </div>
        <h2 className="font-headline-md text-headline-md text-forest-deep mb-md">Belum ada komplain</h2>
        <p className="text-on-surface-variant font-body-md mb-3xl max-w-xs mx-auto">
          Jika ada masalah dengan pesanan ini, Anda dapat mengajukan komplain.
        </p>
        <Link
          href={`/komplain/${orderId}/buat`}
          className="inline-block px-4xl py-md rounded-full bg-error text-on-primary font-bold hover:opacity-90 transition-all"
        >
          Ajukan Komplain
        </Link>
      </div>
    );
  }

  const cfg = STATUS_CONFIG[complaint.status];

  return (
    <div className="space-y-xl">
      {/* Header komplain */}
      <div className="bg-surface-container-lowest border border-cream-dark rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-xl py-lg border-b border-cream-dark">
          <div>
            <p className="text-label-sm font-label-sm text-on-surface-variant uppercase">Jenis Komplain</p>
            <p className="font-body-lg text-body-lg text-forest-deep font-bold">
              {TIPE_LABELS[complaint.tipe] ?? complaint.tipe}
            </p>
          </div>
          <span className={`${cfg.color} px-md py-xs rounded-full font-bold text-label-sm flex items-center gap-xs shrink-0`}>
            <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>{cfg.icon}</span>
            {cfg.label}
          </span>
        </div>
        <div className="px-xl py-lg">
          <p className="font-body-md text-body-md text-on-surface whitespace-pre-wrap">{complaint.deskripsi}</p>
          <p className="text-label-sm font-label-sm text-on-surface-variant mt-md">
            Diajukan oleh <span className="font-bold">{complaint.filer_name}</span> ({complaint.filed_as === "customer" ? "Pelanggan" : "Pekerja"}) · {formatTime(complaint.created_at)}
          </p>
        </div>
      </div>

      {/* Thread respons */}
      {complaint.responses.length > 0 && (
        <div className="space-y-md">
          <p className="text-label-sm font-label-sm text-on-surface-variant uppercase">Balasan</p>
          {complaint.responses.map((resp) => {
            const isMe = resp.sent_as === complaint.filed_as
              ? complaint.filer_name === resp.author_name  // approximate; could use user id if exposed
              : false;
            return (
              <div key={resp.id} className="bg-surface-container-low border border-cream-dark rounded-xl px-xl py-lg">
                <div className="flex items-center justify-between mb-sm">
                  <span className="font-bold text-body-md text-on-surface">{resp.author_name}</span>
                  <span className="text-label-sm font-label-sm text-on-surface-variant">
                    {resp.sent_as === "customer" ? "Pelanggan" : "Pekerja"} · {formatTime(resp.created_at)}
                  </span>
                </div>
                <p className="font-body-md text-body-md text-on-surface whitespace-pre-wrap">{resp.pesan}</p>
              </div>
            );
          })}
        </div>
      )}
      <div ref={bottomRef} />

      {/* Form balas + aksi — hanya jika komplain masih terbuka */}
      {complaint.status === "terbuka" && (
        <>
          <div className="bg-surface-container-lowest border border-cream-dark rounded-xl p-xl space-y-md">
            <p className="text-label-sm font-label-sm text-on-surface-variant uppercase">Tambah Balasan</p>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={3}
              placeholder="Tulis balasan Anda..."
              className="w-full bg-surface-container-low border border-cream-dark rounded-xl px-lg py-md font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary transition-all resize-none"
            />
            {replyError && (
              <p className="text-error text-label-sm font-label-sm">{replyError}</p>
            )}
            <button
              onClick={handleReply}
              disabled={!replyText.trim() || replying}
              className="w-full py-sm rounded-full bg-primary text-on-primary font-bold font-body-md hover:bg-primary-container transition-all disabled:opacity-40 flex items-center justify-center gap-sm"
            >
              {replying ? (
                <><span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span> Mengirim...</>
              ) : "Kirim Balasan"}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-md">
            <button
              onClick={() => handleAction("resolve")}
              disabled={!!actionLoading}
              className="py-md rounded-full bg-secondary text-on-primary font-bold font-body-md hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-sm"
            >
              {actionLoading === "resolve" ? (
                <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
              ) : (
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              )}
              Tandai Selesai
            </button>
            <button
              onClick={() => handleAction("close")}
              disabled={!!actionLoading}
              className="py-md rounded-full border border-cream-dark text-on-surface-variant font-bold font-body-md hover:bg-surface-container transition-all disabled:opacity-50 flex items-center justify-center gap-sm"
            >
              {actionLoading === "close" ? (
                <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
              ) : (
                <span className="material-symbols-outlined text-[18px]">cancel</span>
              )}
              Tutup Komplain
            </button>
          </div>
        </>
      )}

      <Link
        href={`/orders/${orderId}`}
        className="block w-full text-center py-md rounded-full border border-primary text-primary font-bold font-body-md hover:bg-primary hover:text-on-primary transition-all"
      >
        Lihat Detail Pesanan
      </Link>
    </div>
  );
}
