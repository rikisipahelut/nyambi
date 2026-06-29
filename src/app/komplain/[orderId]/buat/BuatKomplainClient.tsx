"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { api, ApiError } from "@/lib/api";

const TIPE_OPTIONS = [
  { value: "pekerjaan_tidak_sesuai", label: "Pekerjaan tidak sesuai deskripsi" },
  { value: "pekerja_tidak_hadir",    label: "Pekerja tidak hadir sesuai jadwal" },
  { value: "pekerjaan_tidak_selesai",label: "Pekerjaan tidak selesai" },
  { value: "customer_tidak_ada",     label: "Customer tidak ada di lokasi" },
  { value: "lainnya",                label: "Lainnya" },
];

export default function BuatKomplainClient({ orderId }: { orderId: string }) {
  const { user, ready } = useAuth();
  const router = useRouter();
  const [tipe, setTipe] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!ready) return;
    if (!user) { router.replace(`/masuk?from=/komplain/${orderId}/buat`); return; }

    // Redirect ke thread jika sudah ada komplain aktif
    api.get(`/orders/${orderId}/complaint`)
      .then((res: any) => { if (res.data) router.replace(`/komplain/${orderId}`); })
      .catch(() => {});
  }, [ready, user, router, orderId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!tipe || deskripsi.trim().length < 10) return;
    setSubmitting(true);
    setError("");
    try {
      await api.post(`/orders/${orderId}/complaint`, { tipe, deskripsi: deskripsi.trim() });
      router.replace(`/komplain/${orderId}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Gagal mengajukan komplain.");
      setSubmitting(false);
    }
  }

  if (!ready || !user) return null;

  return (
    <div className="space-y-2xl">
      <div>
        <h1 className="font-headline-lg text-headline-lg text-forest-deep">Ajukan Komplain</h1>
        <p className="text-on-surface-variant font-body-md text-body-md mt-xs">
          Jelaskan masalah yang Anda alami. Pihak lain akan mendapat notifikasi dan bisa merespons.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-xl">
        <div>
          <p className="text-label-sm font-label-sm text-on-surface-variant uppercase mb-md">Jenis Komplain</p>
          <div className="space-y-sm">
            {TIPE_OPTIONS.map((opt) => (
              <label key={opt.value} className="flex items-center gap-md cursor-pointer group">
                <input
                  type="radio"
                  name="tipe"
                  value={opt.value}
                  checked={tipe === opt.value}
                  onChange={() => setTipe(opt.value)}
                  className="accent-primary w-4 h-4 shrink-0"
                />
                <span className="font-body-md text-body-md text-on-surface group-hover:text-primary transition-colors">
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-label-sm font-label-sm text-on-surface-variant uppercase mb-sm">
            Deskripsi
          </label>
          <textarea
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            rows={5}
            required
            minLength={10}
            maxLength={2000}
            placeholder="Ceritakan secara detail apa yang terjadi..."
            className="w-full bg-surface-container-low border border-cream-dark rounded-xl px-lg py-md font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary transition-all resize-none"
          />
          <p className="text-label-sm font-label-sm text-on-surface-variant mt-xs text-right">
            {deskripsi.length}/2000
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-sm bg-error-container/20 border border-error text-error px-lg py-md rounded-xl font-body-md text-body-md">
            <span className="material-symbols-outlined text-[18px] shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
            {error}
          </div>
        )}

        <div className="flex gap-lg pt-md">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 py-md rounded-full border border-cream-dark text-on-surface-variant font-bold hover:bg-surface-container transition-all"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={!tipe || deskripsi.trim().length < 10 || submitting}
            className="flex-1 py-md rounded-full bg-error text-on-primary font-bold hover:opacity-90 transition-all disabled:opacity-40 flex items-center justify-center gap-sm"
          >
            {submitting ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                Mengajukan...
              </>
            ) : "Ajukan Komplain"}
          </button>
        </div>
      </form>
    </div>
  );
}
