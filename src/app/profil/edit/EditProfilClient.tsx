"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/lib/api";

export default function EditProfilClient() {
  const { user, ready, updateProfile, updateAvatar } = useAuth();
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ nama: "", email: "", telepon: "" });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ready && !user) { router.replace("/masuk"); return; }
    if (user) setForm({ nama: user.nama, email: user.email, telepon: user.telepon ?? "" });
  }, [ready, user, router]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (avatarFile) {
        await updateAvatar(avatarFile);
        setAvatarFile(null);
      }
      await updateProfile({ nama: form.nama, email: form.email, telepon: form.telepon });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Gagal menyimpan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  if (!ready || !user) return null;

  const avatarSrc = avatarPreview ?? user.avatar ?? null;
  const initials = (form.nama || user.nama).slice(0, 2).toUpperCase() || "?";

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-120 space-y-lg">
      {/* Avatar upload */}
      <div className="flex flex-col items-center gap-md mb-xl">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="relative w-24 h-24 rounded-full overflow-hidden group cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="Ubah foto profil"
        >
          {avatarSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-primary flex items-center justify-center">
              <span className="text-on-primary font-bold text-headline-md">{initials}</span>
            </div>
          )}
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-forest-deep/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="material-symbols-outlined text-surface-container-lowest text-[24px]">photo_camera</span>
          </div>
        </button>
        <p className="text-label-sm text-on-surface-variant">
          {avatarFile ? avatarFile.name : "Klik foto untuk mengubah"}
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleAvatarChange}
          className="hidden"
        />
      </div>

      <div>
        <label className="block text-label-sm font-label-sm text-on-surface-variant uppercase mb-sm">Nama Lengkap</label>
        <input name="nama" required value={form.nama} onChange={handleChange}
          className="w-full bg-surface-container-low border border-cream-dark rounded-xl px-lg py-md text-body-md font-body-md focus:outline-none focus:border-primary transition-all" />
      </div>

      <div>
        <label className="block text-label-sm font-label-sm text-on-surface-variant uppercase mb-sm">Email</label>
        <input type="email" name="email" required value={form.email} onChange={handleChange}
          className="w-full bg-surface-container-low border border-cream-dark rounded-xl px-lg py-md text-body-md font-body-md focus:outline-none focus:border-primary transition-all" />
      </div>

      <div>
        <label className="block text-label-sm font-label-sm text-on-surface-variant uppercase mb-sm">Nomor Telepon</label>
        <div className="flex items-center bg-surface-container-low border border-cream-dark rounded-xl overflow-hidden focus-within:border-primary transition-all">
          <span className="px-lg py-md text-on-surface-variant font-body-md border-r border-cream-dark">+62</span>
          <input type="tel" name="telepon" value={form.telepon} onChange={handleChange} placeholder="812-3456-7890"
            className="flex-1 bg-transparent px-lg py-md text-body-md font-body-md focus:outline-none" />
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-sm bg-error-container/20 border border-error text-error px-lg py-md rounded-xl font-body-md text-body-md">
          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
          {error}
        </div>
      )}

      {saved && (
        <div className="flex items-center gap-sm bg-pale-mint/30 border border-pale-mint text-secondary px-lg py-md rounded-xl font-body-md text-body-md">
          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          Profil berhasil diperbarui!
        </div>
      )}

      <div className="flex gap-lg pt-md">
        <button type="button" onClick={() => router.push("/profil")}
          className="flex-1 py-md rounded-full border border-cream-dark text-on-surface font-bold hover:border-primary hover:text-primary transition-all">
          Batal
        </button>
        <button type="submit" disabled={loading}
          className="flex-1 py-md rounded-full bg-primary text-on-primary font-bold hover:bg-primary-container transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-sm">
          {loading
            ? <><span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>Menyimpan...</>
            : "Simpan"}
        </button>
      </div>
    </form>
  );
}
