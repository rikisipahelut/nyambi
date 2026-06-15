"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/lib/api";

export default function DaftarUserForm() {
  const router = useRouter();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ nama: "", email: "", telepon: "", password: "", konfirmasi: "" });
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError("");
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.konfirmasi) { setError("Password dan konfirmasi tidak cocok."); return; }
    if (form.password.length < 8) { setError("Password minimal 8 karakter."); return; }

    setLoading(true);
    setError("");
    try {
      await register({ nama: form.nama, email: form.email, telepon: form.telepon, password: form.password });
      const params = new URLSearchParams({ nama: form.nama });
      router.push(`/daftar/sukses?${params.toString()}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Pendaftaran gagal. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-120 mx-auto space-y-lg">
      <div>
        <label className="block text-label-sm font-label-sm text-on-surface-variant uppercase mb-sm">Nama Lengkap</label>
        <input name="nama" required value={form.nama} onChange={handleChange} placeholder="Contoh: Andi Pratama"
          className="w-full bg-surface-container-low border border-cream-dark rounded-xl px-lg py-md text-body-md font-body-md focus:outline-none focus:border-primary transition-all" />
      </div>

      <div>
        <label className="block text-label-sm font-label-sm text-on-surface-variant uppercase mb-sm">Email</label>
        <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="contoh@email.com"
          className="w-full bg-surface-container-low border border-cream-dark rounded-xl px-lg py-md text-body-md font-body-md focus:outline-none focus:border-primary transition-all" />
      </div>

      <div>
        <label className="block text-label-sm font-label-sm text-on-surface-variant uppercase mb-sm">Nomor Telepon</label>
        <div className="flex items-center bg-surface-container-low border border-cream-dark rounded-xl overflow-hidden focus-within:border-primary transition-all">
          <span className="px-lg py-md text-on-surface-variant font-body-md border-r border-cream-dark">+62</span>
          <input type="tel" name="telepon" required value={form.telepon} onChange={handleChange} placeholder="812-3456-7890"
            className="flex-1 bg-transparent px-lg py-md text-body-md font-body-md focus:outline-none" />
        </div>
      </div>

      <div>
        <label className="block text-label-sm font-label-sm text-on-surface-variant uppercase mb-sm">Password</label>
        <div className="flex items-center bg-surface-container-low border border-cream-dark rounded-xl overflow-hidden focus-within:border-primary transition-all">
          <input type={showPassword ? "text" : "password"} name="password" required value={form.password} onChange={handleChange} placeholder="Minimal 8 karakter"
            className="flex-1 bg-transparent px-lg py-md text-body-md font-body-md focus:outline-none" />
          <button type="button" onClick={() => setShowPassword((v) => !v)} className="px-lg text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-[20px]">{showPassword ? "visibility_off" : "visibility"}</span>
          </button>
        </div>
      </div>

      <div>
        <label className="block text-label-sm font-label-sm text-on-surface-variant uppercase mb-sm">Konfirmasi Password</label>
        <input type="password" name="konfirmasi" required value={form.konfirmasi} onChange={handleChange} placeholder="Ulangi password"
          className="w-full bg-surface-container-low border border-cream-dark rounded-xl px-lg py-md text-body-md font-body-md focus:outline-none focus:border-primary transition-all" />
      </div>

      {error && (
        <div className="flex items-center gap-sm bg-error-container/20 border border-error text-error px-lg py-md rounded-xl text-body-md font-body-md">
          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
          {error}
        </div>
      )}

      <button type="submit" disabled={loading}
        className="w-full py-md rounded-full bg-primary text-on-primary font-bold text-body-lg hover:bg-primary-container transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-sm">
        {loading ? (
          <><span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>Mendaftarkan...</>
        ) : "Buat Akun"}
      </button>

      <p className="text-center text-on-surface-variant font-body-md text-body-md">
        Sudah punya akun?{" "}
        <Link href="/masuk" className="text-primary font-bold hover:underline">Masuk</Link>
      </p>

      <div className="relative flex items-center gap-md">
        <div className="flex-1 h-px bg-cream-dark" />
        <span className="text-on-surface-variant text-label-sm font-label-sm uppercase">atau</span>
        <div className="flex-1 h-px bg-cream-dark" />
      </div>

      <Link href="/daftar-pekerja"
        className="block w-full py-md rounded-full border-1.5 border-primary text-primary font-bold text-body-md hover:bg-surface-container-low transition-all text-center">
        Daftar sebagai Pekerja
      </Link>
    </form>
  );
}
