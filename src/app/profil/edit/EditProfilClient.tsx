"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function EditProfilClient() {
  const { user, ready, login } = useAuth();
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ nama: "", email: "", telepon: "" });

  useEffect(() => {
    if (ready && !user) { router.replace("/masuk"); return; }
    if (user) setForm({ nama: user.nama, email: user.email, telepon: user.telepon ?? "" });
  }, [ready, user, router]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    login({ ...user, nama: form.nama, email: form.email, telepon: form.telepon });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (!ready || !user) return null;

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-120 space-y-lg">
      {/* Avatar preview */}
      <div className="flex items-center gap-xl mb-xl">
        <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center shrink-0">
          <span className="text-on-primary font-bold text-headline-md">
            {form.nama.slice(0, 2).toUpperCase() || "?"}
          </span>
        </div>
        <div>
          <p className="font-body-lg text-body-lg text-forest-deep capitalize">{form.nama || "Nama Anda"}</p>
          <p className="text-on-surface-variant font-body-md text-body-md">{form.email}</p>
        </div>
      </div>

      <div>
        <label className="block text-label-sm font-label-sm text-on-surface-variant uppercase mb-sm">
          Nama Lengkap
        </label>
        <input
          name="nama"
          required
          value={form.nama}
          onChange={handleChange}
          className="w-full bg-surface-container-low border border-cream-dark rounded-xl px-lg py-md text-body-md font-body-md focus:outline-none focus:border-primary transition-all"
        />
      </div>

      <div>
        <label className="block text-label-sm font-label-sm text-on-surface-variant uppercase mb-sm">
          Email
        </label>
        <input
          type="email"
          name="email"
          required
          value={form.email}
          onChange={handleChange}
          className="w-full bg-surface-container-low border border-cream-dark rounded-xl px-lg py-md text-body-md font-body-md focus:outline-none focus:border-primary transition-all"
        />
      </div>

      <div>
        <label className="block text-label-sm font-label-sm text-on-surface-variant uppercase mb-sm">
          Nomor Telepon
        </label>
        <div className="flex items-center bg-surface-container-low border border-cream-dark rounded-xl overflow-hidden focus-within:border-primary transition-all">
          <span className="px-lg py-md text-on-surface-variant font-body-md border-r border-cream-dark">+62</span>
          <input
            type="tel"
            name="telepon"
            value={form.telepon}
            onChange={handleChange}
            placeholder="812-3456-7890"
            className="flex-1 bg-transparent px-lg py-md text-body-md font-body-md focus:outline-none"
          />
        </div>
      </div>

      {saved && (
        <div className="flex items-center gap-sm bg-pale-mint/30 border border-pale-mint text-secondary px-lg py-md rounded-xl font-body-md text-body-md">
          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          Profil berhasil diperbarui!
        </div>
      )}

      <div className="flex gap-lg pt-md">
        <button
          type="button"
          onClick={() => router.push("/profil")}
          className="flex-1 py-md rounded-full border border-cream-dark text-on-surface font-bold hover:border-primary hover:text-primary transition-all"
        >
          Batal
        </button>
        <button
          type="submit"
          className="flex-1 py-md rounded-full bg-primary text-on-primary font-bold hover:bg-primary-container transition-all active:scale-95"
        >
          Simpan
        </button>
      </div>
    </form>
  );
}
