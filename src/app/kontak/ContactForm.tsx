"use client";

import { useState } from "react";

const TOPICS = [
  "Pertanyaan Umum",
  "Masalah Pemesanan",
  "Masalah Pembayaran",
  "Laporan Pekerja",
  "Pendaftaran Pekerja",
  "Saran & Masukan",
  "Lainnya",
];

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ nama: "", email: "", topik: "", pesan: "" });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1000);
  }

  if (sent) {
    return (
      <div className="text-center py-3xl">
        <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-xl">
          <span
            className="material-symbols-outlined text-secondary text-[40px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            mark_email_read
          </span>
        </div>
        <h3 className="font-headline-md text-headline-md text-forest-deep mb-md">
          Pesan Terkirim!
        </h3>
        <p className="text-text-mid font-body-md max-w-128 mx-auto mb-2xl">
          Terima kasih, <strong className="text-forest-deep">{form.nama}</strong>. Tim kami akan
          membalas ke <strong className="text-forest-deep">{form.email}</strong> dalam 1×24 jam.
        </p>
        <button
          onClick={() => { setSent(false); setForm({ nama: "", email: "", topik: "", pesan: "" }); }}
          className="px-4xl py-md rounded-full border border-primary text-primary font-bold hover:bg-primary hover:text-on-primary transition-all"
        >
          Kirim Pesan Lain
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-lg">
        <div>
          <label className="block text-label-sm font-label-sm text-on-surface-variant uppercase mb-sm">
            Nama Lengkap
          </label>
          <input
            name="nama"
            required
            value={form.nama}
            onChange={handleChange}
            placeholder="Nama Anda"
            className="w-full bg-surface-container-lowest border border-cream-dark rounded-xl px-lg py-md text-body-md font-body-md focus:outline-none focus:border-primary transition-all"
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
            placeholder="email@contoh.com"
            className="w-full bg-surface-container-lowest border border-cream-dark rounded-xl px-lg py-md text-body-md font-body-md focus:outline-none focus:border-primary transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-label-sm font-label-sm text-on-surface-variant uppercase mb-sm">
          Topik
        </label>
        <select
          name="topik"
          required
          value={form.topik}
          onChange={handleChange}
          className="w-full bg-surface-container-lowest border border-cream-dark rounded-xl px-lg py-md text-body-md font-body-md focus:outline-none focus:border-primary transition-all"
        >
          <option value="">Pilih topik pesan</option>
          {TOPICS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-label-sm font-label-sm text-on-surface-variant uppercase mb-sm">
          Pesan
        </label>
        <textarea
          name="pesan"
          required
          rows={5}
          value={form.pesan}
          onChange={handleChange}
          placeholder="Tuliskan pertanyaan atau kendala Anda secara detail..."
          className="w-full bg-surface-container-lowest border border-cream-dark rounded-xl px-lg py-md text-body-md font-body-md focus:outline-none focus:border-primary transition-all resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-md rounded-full bg-primary text-on-primary font-bold text-body-lg hover:bg-primary-container transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-sm"
      >
        {loading ? (
          <>
            <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
            Mengirim...
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-[18px]">send</span>
            Kirim Pesan
          </>
        )}
      </button>
    </form>
  );
}
