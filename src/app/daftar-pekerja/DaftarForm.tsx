"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Category } from "@/types";

const STEPS = ["Identitas", "Keahlian", "Konfirmasi"] as const;

interface Props {
  categories: Category[];
}

export default function DaftarForm({ categories }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nama: "",
    telepon: "",
    lokasi: "",
    categoryIds: [] as string[],
    pengalaman: "",
    bio: "",
    layanan: "",
  });
  const [categoryError, setCategoryError] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function toggleCategory(id: string) {
    setCategoryError(false);
    setForm((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(id)
        ? prev.categoryIds.filter((c) => c !== id)
        : [...prev.categoryIds, id],
    }));
  }

  function nextStep(e: React.FormEvent) {
    e.preventDefault();
    setStep((s) => s + 1);
  }

  function nextStepKeahlian(e: React.FormEvent) {
    e.preventDefault();
    if (form.categoryIds.length === 0) {
      setCategoryError(true);
      return;
    }
    setStep((s) => s + 1);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const selectedTitles = categories
      .filter((c) => form.categoryIds.includes(c.id))
      .map((c) => c.title)
      .join(", ");
    const params = new URLSearchParams({ nama: form.nama, kategori: selectedTitles });
    router.push(`/daftar-pekerja/sukses?${params.toString()}`);
  }

  const selectedCategoryTitles = categories
    .filter((c) => form.categoryIds.includes(c.id))
    .map((c) => c.title)
    .join(", ");

  return (
    <div className="w-full max-w-144 mx-auto">
      {/* Step indicator */}
      <div className="flex items-center gap-0 mb-3xl">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-xs">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-label-sm transition-all ${
                  i < step
                    ? "bg-secondary text-on-primary"
                    : i === step
                    ? "bg-primary text-on-primary"
                    : "bg-cream-dark text-on-surface-variant"
                }`}
              >
                {i < step ? (
                  <span className="material-symbols-outlined text-[16px]">check</span>
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={`text-label-sm font-label-sm uppercase ${
                  i === step ? "text-primary" : "text-on-surface-variant"
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-sm mb-lg transition-all ${
                  i < step ? "bg-secondary" : "bg-cream-dark"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 0 — Identitas */}
      {step === 0 && (
        <form onSubmit={nextStep} className="space-y-lg">
          <div>
            <label className="block text-label-sm font-label-sm text-on-surface-variant uppercase mb-sm">
              Nama Lengkap
            </label>
            <input
              name="nama"
              required
              value={form.nama}
              onChange={handleChange}
              placeholder="Contoh: Budi Santoso"
              className="w-full bg-surface-container-low border border-cream-dark rounded-xl px-lg py-md text-body-md font-body-md focus:outline-none focus:border-primary transition-all"
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

          <div>
            <label className="block text-label-sm font-label-sm text-on-surface-variant uppercase mb-sm">
              Kota / Wilayah Kerja
            </label>
            <input
              name="lokasi"
              required
              value={form.lokasi}
              onChange={handleChange}
              placeholder="Contoh: Jakarta Selatan"
              className="w-full bg-surface-container-low border border-cream-dark rounded-xl px-lg py-md text-body-md font-body-md focus:outline-none focus:border-primary transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full py-md rounded-full bg-primary text-on-primary font-bold text-body-lg hover:bg-primary-container transition-all active:scale-95"
          >
            Lanjut
          </button>
        </form>
      )}

      {/* Step 1 — Keahlian */}
      {step === 1 && (
        <form onSubmit={nextStepKeahlian} className="space-y-lg">
          <div>
            <div className="flex items-center justify-between mb-sm">
              <label className="block text-label-sm font-label-sm text-on-surface-variant uppercase">
                Kategori Keahlian
              </label>
              {form.categoryIds.length > 0 && (
                <span className="text-primary text-label-sm font-label-sm">
                  {form.categoryIds.length} dipilih
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-md max-h-72 overflow-y-auto pr-xs">
              {categories.map((cat) => {
                const selected = form.categoryIds.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className={`flex items-center gap-md p-lg rounded-xl border cursor-pointer transition-all text-left ${
                      selected
                        ? "border-primary bg-pale-mint/20"
                        : "border-cream-dark hover:border-primary/50"
                    }`}
                  >
                    <span className={`material-symbols-outlined text-[24px] ${selected ? "text-primary" : "text-on-surface-variant"}`}>
                      {selected ? "check_circle" : cat.icon}
                    </span>
                    <span className="font-body-md text-body-md text-on-surface">{cat.title}</span>
                  </button>
                );
              })}
            </div>
            {categoryError && (
              <p className="text-error text-label-sm font-label-sm mt-sm flex items-center gap-xs">
                <span className="material-symbols-outlined text-[14px]">error</span>
                Pilih minimal satu kategori keahlian
              </p>
            )}
          </div>

          <div>
            <label className="block text-label-sm font-label-sm text-on-surface-variant uppercase mb-sm">
              Pengalaman Kerja
            </label>
            <select
              name="pengalaman"
              required
              value={form.pengalaman}
              onChange={handleChange}
              className="w-full bg-surface-container-low border border-cream-dark rounded-xl px-lg py-md text-body-md font-body-md focus:outline-none focus:border-primary transition-all"
            >
              <option value="">Pilih lama pengalaman</option>
              <option value="Kurang dari 1 tahun">Kurang dari 1 tahun</option>
              <option value="1–3 tahun">1–3 tahun</option>
              <option value="3–5 tahun">3–5 tahun</option>
              <option value="5–10 tahun">5–10 tahun</option>
              <option value="Lebih dari 10 tahun">Lebih dari 10 tahun</option>
            </select>
          </div>

          <div>
            <label className="block text-label-sm font-label-sm text-on-surface-variant uppercase mb-sm">
              Tentang Diri Anda
            </label>
            <textarea
              name="bio"
              required
              rows={3}
              value={form.bio}
              onChange={handleChange}
              placeholder="Ceritakan keahlian dan pengalaman Anda secara singkat..."
              className="w-full bg-surface-container-low border border-cream-dark rounded-xl px-lg py-md text-body-md font-body-md focus:outline-none focus:border-primary transition-all resize-none"
            />
          </div>

          <div className="flex gap-lg">
            <button
              type="button"
              onClick={() => setStep(0)}
              className="flex-1 py-md rounded-full border-1.5 border-primary text-primary font-bold hover:bg-surface-container-low transition-all"
            >
              Kembali
            </button>
            <button
              type="submit"
              className="flex-1 py-md rounded-full bg-primary text-on-primary font-bold hover:bg-primary-container transition-all active:scale-95"
            >
              Lanjut
            </button>
          </div>
        </form>
      )}

      {/* Step 2 — Konfirmasi */}
      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-lg">
          <div className="bg-surface-container-lowest rounded-xl border border-cream-dark divide-y divide-cream-dark">
            <ConfirmRow label="Nama" value={form.nama} />
            <ConfirmRow label="Telepon" value={`+62 ${form.telepon}`} />
            <ConfirmRow label="Lokasi" value={form.lokasi} />
            <ConfirmRow label="Kategori" value={selectedCategoryTitles || "-"} />
            <ConfirmRow label="Pengalaman" value={form.pengalaman} />
            <ConfirmRow label="Bio" value={form.bio} />
          </div>

          <div className="bg-pale-mint/20 border border-pale-mint rounded-xl px-xl py-lg flex gap-md">
            <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-xs">
              info
            </span>
            <p className="text-on-surface font-body-md text-body-md">
              Tim Nyambi akan memverifikasi profil Anda dalam{" "}
              <strong className="text-forest-deep">1×24 jam</strong> setelah pendaftaran.
            </p>
          </div>

          <div className="flex gap-lg">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 py-md rounded-full border-1.5 border-primary text-primary font-bold hover:bg-surface-container-low transition-all"
            >
              Kembali
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-md rounded-full bg-primary text-on-primary font-bold hover:bg-primary-container transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-sm"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">
                    progress_activity
                  </span>
                  Mendaftarkan...
                </>
              ) : (
                "Daftar Sekarang"
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function ConfirmRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-xl px-xl py-md">
      <span className="text-on-surface-variant font-body-md text-body-md shrink-0">{label}</span>
      <span className="text-on-surface font-body-md text-body-md text-right">{value}</span>
    </div>
  );
}
