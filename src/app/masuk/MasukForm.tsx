"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function MasukForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login({
        nama: form.email.split("@")[0],
        email: form.email,
        joinedAt: new Date().toISOString(),
      });
      router.push("/profil");
    }, 800);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-120 mx-auto space-y-lg">
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
          placeholder="contoh@email.com"
          className="w-full bg-surface-container-low border border-cream-dark rounded-xl px-lg py-md text-body-md font-body-md focus:outline-none focus:border-primary transition-all"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-sm">
          <label className="block text-label-sm font-label-sm text-on-surface-variant uppercase">
            Password
          </label>
          <a href="#" className="text-primary text-label-sm font-label-sm hover:underline">
            Lupa password?
          </a>
        </div>
        <div className="flex items-center bg-surface-container-low border border-cream-dark rounded-xl overflow-hidden focus-within:border-primary transition-all">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            required
            value={form.password}
            onChange={handleChange}
            placeholder="Password Anda"
            className="flex-1 bg-transparent px-lg py-md text-body-md font-body-md focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="px-lg text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">
              {showPassword ? "visibility_off" : "visibility"}
            </span>
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-md rounded-full bg-primary text-on-primary font-bold text-body-lg hover:bg-primary-container transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-sm"
      >
        {loading ? (
          <>
            <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
            Masuk...
          </>
        ) : (
          "Masuk"
        )}
      </button>

      <p className="text-center text-on-surface-variant font-body-md text-body-md">
        Belum punya akun?{" "}
        <Link href="/daftar" className="text-primary font-bold hover:underline">
          Daftar sekarang
        </Link>
      </p>
    </form>
  );
}
