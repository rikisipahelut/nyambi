"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { api, ApiError } from "@/lib/api";
import { LocationCombobox } from "@/components/ui/LocationCombobox";
import type { Category } from "@/types";

const STEPS = ["Identitas", "Keahlian", "Konfirmasi"] as const;

const EXP_MAP: Record<string, number> = {
  "Kurang dari 1 tahun": 0,
  "1–3 tahun": 1,
  "3–5 tahun": 3,
  "5–10 tahun": 5,
  "Lebih dari 10 tahun": 10,
};

interface Props {
  categories: Category[];
}

export default function DaftarForm({ categories }: Props) {
  const router = useRouter();
  const { user, ready } = useAuth();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [form, setForm] = useState({
    nama: "",
    telepon: "",
    lokasi: "",
    specialty: "",
    categoryIds: [] as string[],
    pengalaman: "",
    bio: "",
    layanan: "",
  });
  const [categoryError, setCategoryError] = useState(false);
  const [lokasiError, setLokasiError] = useState(false);

  useEffect(() => {
    if (ready && !user) router.replace("/masuk");
    if (user) {
      setForm((prev) => ({
        ...prev,
        nama: user.nama,
        telepon: user.telepon ?? "",
      }));
    }
  }, [ready, user, router]);

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
    if (!form.lokasi) {
      setLokasiError(true);
      return;
    }
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
    setSubmitError("");
    try {
      // Update user profile jika nama/telepon berubah
      if (user && (form.nama !== user.nama || form.telepon !== (user.telepon ?? ""))) {
        await api.put("/users/me", { nama: form.nama, telepon: form.telepon });
      }

      // Buat worker profile
      await api.post("/workers", {
        specialty: form.specialty,
        bio: form.bio,
        location: form.lokasi,
        experience_years: EXP_MAP[form.pengalaman] ?? 0,
        category_ids: form.categoryIds,
        services: form.layanan.trim()
          ? [{ name: form.layanan.trim() }]
          : [],
      });

      const selectedTitles = categories
        .filter((c) => form.categoryIds.includes(c.id))
        .map((c) => c.title)
        .join(", ");
      const params = new URLSearchParams({ nama: form.nama, kategori: selectedTitles });
      router.push(`/daftar-pekerja/sukses?${params.toString()}`);
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : "Gagal mendaftar. Coba lagi.");
      setLoading(false);
    }
  }

  const selectedCategoryTitles = categories
    .filter((c) => form.categoryIds.includes(c.id))
    .map((c) => c.title)
    .join(", ");

  if (!ready || !user) return null;

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
            <div
              className={`bg-surface-container-low border rounded-xl transition-all py-md flex ${
                lokasiError ? "border-error" : "border-cream-dark focus-within:border-primary"
              }`}
            >
              <LocationCombobox
                value={form.lokasi}
                onChange={(val) => {
                  setForm((prev) => ({ ...prev, lokasi: val }));
                  setLokasiError(false);
                }}
                placeholder="Cari kota atau provinsi..."
              />
            </div>
            {lokasiError && (
              <p className="text-error text-label-sm font-label-sm mt-sm flex items-center gap-xs">
                <span className="material-symbols-outlined text-[14px]">error</span>
                Pilih kota atau wilayah kerja
              </p>
            )}
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
            <label className="block text-label-sm font-label-sm text-on-surface-variant uppercase mb-sm">
              Judul Keahlian
            </label>
            <input
              name="specialty"
              required
              value={form.specialty}
              onChange={handleChange}
              placeholder="Contoh: Tukang Listrik, Fotografer Pernikahan..."
              className="w-full bg-surface-container-low border border-cream-dark rounded-xl px-lg py-md text-body-md font-body-md focus:outline-none focus:border-primary transition-all"
            />
          </div>

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

          <div>
            <label className="block text-label-sm font-label-sm text-on-surface-variant uppercase mb-sm">
              Layanan Utama <span className="normal-case text-on-surface-variant/60">(opsional)</span>
            </label>
            <input
              name="layanan"
              value={form.layanan}
              onChange={handleChange}
              placeholder="Contoh: Instalasi listrik rumah"
              className="w-full bg-surface-container-low border border-cream-dark rounded-xl px-lg py-md text-body-md font-body-md focus:outline-none focus:border-primary transition-all"
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
            <ConfirmRow label="Keahlian" value={form.specialty} />
            <ConfirmRow label="Kategori" value={selectedCategoryTitles || "-"} />
            <ConfirmRow label="Pengalaman" value={form.pengalaman} />
            <ConfirmRow label="Bio" value={form.bio} />
            {form.layanan && <ConfirmRow label="Layanan" value={form.layanan} />}
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

          {submitError && (
            <div className="flex items-center gap-sm bg-error-container/20 border border-error text-error px-lg py-md rounded-xl font-body-md text-body-md">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
              {submitError}
            </div>
          )}

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
