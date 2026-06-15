"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/lib/api";

export default function UbahPasswordClient() {
  const { user, ready, updatePassword } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [show, setShow] = useState({ current: false, next: false, confirm: false });
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ready && !user) router.replace("/masuk");
  }, [ready, user, router]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  }

  function toggleShow(field: keyof typeof show) {
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.next.length < 6) { setError("Password baru minimal 6 karakter."); return; }
    if (form.next !== form.confirm) { setError("Konfirmasi password tidak cocok."); return; }

    setLoading(true);
    setError("");
    try {
      await updatePassword({ current_password: form.current, new_password: form.next });
      setSaved(true);
      setForm({ current: "", next: "", confirm: "" });
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Gagal mengubah password. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  if (!ready || !user) return null;

  const fields = [
    { name: "current", label: "Password Saat Ini", key: "current" as const },
    { name: "next",    label: "Password Baru",      key: "next"    as const },
    { name: "confirm", label: "Konfirmasi Password Baru", key: "confirm" as const },
  ];

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-120 space-y-lg">
      <p className="text-on-surface-variant font-body-md text-body-md mb-xl">
        Buat password yang kuat dan unik untuk mengamankan akun Anda.
      </p>

      {fields.map(({ name, label, key }) => (
        <div key={name}>
          <label className="block text-label-sm font-label-sm text-on-surface-variant uppercase mb-sm">{label}</label>
          <div className="flex items-center bg-surface-container-low border border-cream-dark rounded-xl overflow-hidden focus-within:border-primary transition-all">
            <input type={show[key] ? "text" : "password"} name={name} required
              value={form[key as keyof typeof form]} onChange={handleChange}
              className="flex-1 bg-transparent px-lg py-md text-body-md font-body-md focus:outline-none" />
            <button type="button" onClick={() => toggleShow(key)}
              className="px-lg text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-[20px]">
                {show[key] ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
        </div>
      ))}

      {error && (
        <div className="flex items-center gap-sm bg-error-container/20 border border-error text-error px-lg py-md rounded-xl font-body-md text-body-md">
          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
          {error}
        </div>
      )}

      {saved && (
        <div className="flex items-center gap-sm bg-pale-mint/30 border border-pale-mint text-secondary px-lg py-md rounded-xl font-body-md text-body-md">
          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          Password berhasil diperbarui!
        </div>
      )}

      <div className="flex gap-lg pt-md">
        <button type="button" onClick={() => router.push("/profil")}
          className="flex-1 py-md rounded-full border border-cream-dark text-on-surface font-bold hover:border-primary hover:text-primary transition-all">
          Batal
        </button>
        <button type="submit" disabled={loading}
          className="flex-1 py-md rounded-full bg-primary text-on-primary font-bold hover:bg-primary-container transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-sm">
          {loading ? <><span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>Menyimpan...</> : "Simpan"}
        </button>
      </div>
    </form>
  );
}
