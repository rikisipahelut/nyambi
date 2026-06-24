"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addOrder } from "@/hooks/useOrders";
import { ApiError } from "@/lib/api";

interface BookingModalProps {
  workerId: string;
  workerName: string;
  specialty: string;
}

type FormState = {
  tanggal: string;
  waktu: string;
  deskripsi: string;
  alamat: string;
  telepon: string;
};

export default function BookingModal({ workerId, workerName, specialty }: BookingModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<FormState>({
    tanggal: "",
    waktu: "",
    deskripsi: "",
    alamat: "",
    telepon: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    if (name === "telepon") {
      const digits = value.replace(/\D/g, "").slice(0, 12);
      let formatted = digits;
      if (digits.length > 7)      formatted = `${digits.slice(0,3)}-${digits.slice(3,7)}-${digits.slice(7)}`;
      else if (digits.length > 3) formatted = `${digits.slice(0,3)}-${digits.slice(3)}`;
      setForm((prev) => ({ ...prev, telepon: formatted }));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleClose() {
    setIsOpen(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const rawDigits = form.telepon.replace(/\D/g, "");
    if (rawDigits.length < 9) {
      setError("Nomor telepon minimal 9 angka.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const order = await addOrder({
        worker_id: workerId,
        tanggal: form.tanggal,
        waktu: form.waktu,
        deskripsi: form.deskripsi,
        alamat: form.alamat,
        telepon: form.telepon.replace(/\D/g, ""),
      });

      const params = new URLSearchParams({
        worker: workerName,
        specialty,
        workerId,
        ...form,
      });

      router.push(`/pesanan/${order.orderId}?${params.toString()}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Gagal membuat pesanan. Coba lagi.");
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full py-md rounded-full bg-primary text-on-primary font-bold text-body-lg hover:bg-primary-container transition-all active:scale-95"
      >
        Hubungi Sekarang
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-xl">
          <div
            className="absolute inset-0 bg-forest-deep/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          <div className="relative bg-surface-container-lowest w-full md:max-w-168 rounded-t-4xl md:rounded-xl border border-cream-dark shadow-lg overflow-hidden">
            <div className="flex justify-center pt-md pb-xs md:hidden">
              <div className="w-10 h-1 rounded-full bg-outline-variant" />
            </div>

            <div className="flex items-center justify-between px-xl pt-lg pb-md border-b border-cream-dark">
              <div>
                <h2 className="font-headline-md text-headline-md text-forest-deep">Buat Pesanan</h2>
                <p className="text-on-surface-variant text-body-md font-body-md">
                  {workerName} · {specialty}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-sm rounded-full hover:bg-surface-container-low transition-all text-on-surface-variant"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="px-xl py-lg max-h-[70vh] overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-lg">
                <div className="grid grid-cols-2 gap-lg">
                  <div>
                    <label className="block text-label-sm font-label-sm text-on-surface-variant uppercase mb-sm">
                      Tanggal
                    </label>
                    <input
                      type="date"
                      name="tanggal"
                      required
                      value={form.tanggal}
                      onChange={handleChange}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full bg-surface-container-low border border-cream-dark rounded-xl px-lg py-md text-body-md font-body-md focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-label-sm font-label-sm text-on-surface-variant uppercase mb-sm">
                      Waktu
                    </label>
                    <input
                      type="time"
                      name="waktu"
                      required
                      value={form.waktu}
                      onChange={handleChange}
                      className="w-full bg-surface-container-low border border-cream-dark rounded-xl px-lg py-md text-body-md font-body-md focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-label-sm font-label-sm text-on-surface-variant uppercase mb-sm">
                    Deskripsi Pekerjaan
                  </label>
                  <textarea
                    name="deskripsi"
                    required
                    rows={3}
                    value={form.deskripsi}
                    onChange={handleChange}
                    placeholder="Contoh: Rumput halaman belakang perlu dipotong, luas ± 50m²"
                    className="w-full bg-surface-container-low border border-cream-dark rounded-xl px-lg py-md text-body-md font-body-md focus:outline-none focus:border-primary transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-label-sm font-label-sm text-on-surface-variant uppercase mb-sm">
                    Alamat Lengkap
                  </label>
                  <textarea
                    name="alamat"
                    required
                    rows={2}
                    value={form.alamat}
                    onChange={handleChange}
                    placeholder="Jl. Contoh No. 12, Kelurahan, Kecamatan, Kota"
                    className="w-full bg-surface-container-low border border-cream-dark rounded-xl px-lg py-md text-body-md font-body-md focus:outline-none focus:border-primary transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-label-sm font-label-sm text-on-surface-variant uppercase mb-sm">
                    Nomor Telepon
                  </label>
                  <div className="flex items-center bg-surface-container-low border border-cream-dark rounded-xl overflow-hidden focus-within:border-primary transition-all">
                    <span className="px-lg py-md text-on-surface-variant font-body-md border-r border-cream-dark">
                      +62
                    </span>
                    <input
                      type="tel"
                      name="telepon"
                      required
                      value={form.telepon}
                      onChange={handleChange}
                      placeholder="812-3456-7890"
                      className="flex-1 bg-transparent px-lg py-md text-body-md font-body-md focus:outline-none"
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-sm bg-error-container/20 border border-error text-error px-lg py-md rounded-xl font-body-md text-body-md">
                    <span className="material-symbols-outlined text-[18px] shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
                    {error}
                  </div>
                )}

                <div className="flex gap-lg pt-md pb-lg">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 py-md rounded-full border-1.5 border-primary text-primary font-bold hover:bg-surface-container-low transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-md rounded-full bg-primary text-on-primary font-bold hover:bg-primary-container transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-sm"
                  >
                    {loading ? (
                      <>
                        <span className="material-symbols-outlined text-[18px] animate-spin">
                          progress_activity
                        </span>
                        Memproses...
                      </>
                    ) : (
                      "Kirim Pesanan"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
