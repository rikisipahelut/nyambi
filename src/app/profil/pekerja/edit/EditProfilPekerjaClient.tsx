"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { api, ApiError } from "@/lib/api";
import { LocationCombobox } from "@/components/ui/LocationCombobox";
import type { Category } from "@/types";

const EXP_MAP: Record<string, number> = {
  "Kurang dari 1 tahun": 0,
  "1–3 tahun": 1,
  "3–5 tahun": 3,
  "5–10 tahun": 5,
  "Lebih dari 10 tahun": 10,
};

const EXP_REVERSE: Record<number, string> = {
  0: "Kurang dari 1 tahun",
  1: "1–3 tahun",
  3: "3–5 tahun",
  5: "5–10 tahun",
  10: "Lebih dari 10 tahun",
};

interface WorkerData {
  specialty: string;
  bio: string;
  location: string;
  experience_years: number;
  status: "available" | "busy";
  categories: { id: string; title: string }[];
}

export default function EditProfilPekerjaClient() {
  const router = useRouter();
  const { user, ready } = useAuth();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    specialty: "",
    bio: "",
    lokasi: "",
    pengalaman: "",
    categoryIds: [] as string[],
    status: "available" as "available" | "busy",
  });

  // Fetch worker profile + categories setelah auth ready
  useEffect(() => {
    if (!ready) return;
    if (!user) { router.replace("/masuk"); return; }
    if (!user.is_worker) { router.replace("/profil"); return; }

    async function init() {
      try {
        const [workerRes, catRes] = await Promise.all([
          api.get<{ data: WorkerData }>("/workers/me"),
          api.get<{ data: { id: string; icon: string; title: string; worker_count: number }[] }>("/categories"),
        ]);

        const w = workerRes.data;
        setForm({
          specialty: w.specialty ?? "",
          bio: w.bio ?? "",
          lokasi: w.location ?? "",
          pengalaman: EXP_REVERSE[w.experience_years] ?? "",
          categoryIds: w.categories.map((c) => c.id),
          status: w.status ?? "available",
        });

        setCategories(
          catRes.data.map((c) => ({
            id: c.id,
            icon: c.icon,
            title: c.title,
            workerCount: `${c.worker_count}+`,
          }))
        );
      } catch {
        setError("Gagal memuat data profil. Coba muat ulang halaman.");
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [ready, user, router]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function toggleCategory(id: string) {
    setForm((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(id)
        ? prev.categoryIds.filter((c) => c !== id)
        : [...prev.categoryIds, id],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      await Promise.all([
        api.put("/workers/me", {
          specialty: form.specialty,
          bio: form.bio,
          location: form.lokasi,
          experience_years: EXP_MAP[form.pengalaman] ?? 0,
          category_ids: form.categoryIds,
        }),
        api.put("/workers/me/status", { status: form.status }),
      ]);
      setSuccess(true);
      setTimeout(() => router.push("/profil"), 1200);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Gagal menyimpan. Coba lagi.");
      setSaving(false);
    }
  }

  if (!ready || loading) {
    return (
      <div className="w-full max-w-144 mx-auto space-y-lg animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-14 bg-cream-dark rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-144 mx-auto space-y-lg">
      {/* Judul Keahlian */}
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

      {/* Wilayah Kerja */}
      <div>
        <label className="block text-label-sm font-label-sm text-on-surface-variant uppercase mb-sm">
          Kota / Wilayah Kerja
        </label>
        <div className="bg-surface-container-low border border-cream-dark rounded-xl transition-all py-md flex focus-within:border-primary">
          <LocationCombobox
            value={form.lokasi}
            onChange={(val) => setForm((prev) => ({ ...prev, lokasi: val }))}
            placeholder="Cari kota atau provinsi..."
          />
        </div>
      </div>

      {/* Pengalaman */}
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

      {/* Bio */}
      <div>
        <label className="block text-label-sm font-label-sm text-on-surface-variant uppercase mb-sm">
          Tentang Diri Anda
        </label>
        <textarea
          name="bio"
          rows={4}
          value={form.bio}
          onChange={handleChange}
          placeholder="Ceritakan keahlian dan pengalaman Anda secara singkat..."
          className="w-full bg-surface-container-low border border-cream-dark rounded-xl px-lg py-md text-body-md font-body-md focus:outline-none focus:border-primary transition-all resize-none"
        />
      </div>

      {/* Kategori */}
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
                <span
                  className={`material-symbols-outlined text-[24px] ${
                    selected ? "text-primary" : "text-on-surface-variant"
                  }`}
                >
                  {selected ? "check_circle" : cat.icon}
                </span>
                <span className="font-body-md text-body-md text-on-surface">{cat.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Status */}
      <div>
        <label className="block text-label-sm font-label-sm text-on-surface-variant uppercase mb-sm">
          Status Ketersediaan
        </label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full bg-surface-container-low border border-cream-dark rounded-xl px-lg py-md text-body-md font-body-md focus:outline-none focus:border-primary transition-all"
        >
          <option value="available">Tersedia</option>
          <option value="busy">Sedang Sibuk</option>
        </select>
      </div>

      {/* Error / Success */}
      {error && (
        <div className="flex items-center gap-sm bg-error-container/20 border border-error text-error px-lg py-md rounded-xl font-body-md text-body-md">
          <span
            className="material-symbols-outlined text-[18px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            error
          </span>
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-sm bg-pale-mint/20 border border-pale-mint text-secondary px-lg py-md rounded-xl font-body-md text-body-md">
          <span
            className="material-symbols-outlined text-[18px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            check_circle
          </span>
          Profil pekerja berhasil disimpan!
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-lg pt-sm">
        <button
          type="button"
          onClick={() => router.push("/profil")}
          className="flex-1 py-md rounded-full border-1.5 border-primary text-primary font-bold hover:bg-surface-container-low transition-all"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex-1 py-md rounded-full bg-primary text-on-primary font-bold hover:bg-primary-container transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-sm"
        >
          {saving ? (
            <>
              <span className="material-symbols-outlined text-[18px] animate-spin">
                progress_activity
              </span>
              Menyimpan...
            </>
          ) : (
            "Simpan"
          )}
        </button>
      </div>
    </form>
  );
}
