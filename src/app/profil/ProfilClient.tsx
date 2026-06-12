"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

const MENU = [
  { icon: "shopping_bag", label: "Riwayat Pesanan", href: "/riwayat-pesanan", count: "3" },
  { icon: "favorite", label: "Pekerja Favorit", href: "/pekerja-favorit", count: "5" },
  { icon: "rate_review", label: "Ulasan Saya", href: "/ulasan-saya", count: "2" },
  { icon: "notifications", label: "Notifikasi", href: "/notifikasi", count: "1" },
];

const SETTINGS = [
  { icon: "manage_accounts", label: "Edit Profil", href: "/profil/edit" },
  { icon: "lock", label: "Ubah Password", href: "/profil/ubah-password" },
  { icon: "help", label: "Pusat Bantuan", href: "/bantuan" },
  { icon: "gavel", label: "Syarat & Ketentuan", href: "/syarat-ketentuan" },
  { icon: "shield", label: "Kebijakan Privasi", href: "/kebijakan-privasi" },
];

function getInitials(nama: string) {
  return nama
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function ProfilClient() {
  const { user, ready, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && !user) router.replace("/masuk");
  }, [ready, user, router]);

  if (!ready || !user) return null;

  return (
    <main className="py-4xl px-xl md:px-5xl max-w-360 mx-auto">
      <div className="flex flex-col md:flex-row gap-4xl items-start">
        {/* Left — profile card */}
        <div className="w-full md:w-72 shrink-0 space-y-xl">
          {/* Avatar + info */}
          <div className="bg-surface-container-low border border-cream-dark rounded-2xl p-xl text-center">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-lg">
              <span className="text-on-primary font-bold text-headline-md">{getInitials(user.nama)}</span>
            </div>
            <h2 className="font-headline-md text-headline-md text-forest-deep capitalize">{user.nama}</h2>
            <p className="text-on-surface-variant font-body-md text-body-md mt-xs">{user.email}</p>
            {user.telepon && (
              <p className="text-on-surface-variant font-body-md text-body-md">+62 {user.telepon}</p>
            )}
            <p className="text-on-surface-variant text-label-sm font-label-sm mt-md">
              Bergabung {formatDate(user.joinedAt)}
            </p>
            <Link
              href="/profil/edit"
              className="mt-lg inline-flex items-center gap-xs px-lg py-xs rounded-full border border-primary text-primary font-bold text-label-sm hover:bg-primary hover:text-on-primary transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">edit</span>
              Edit Profil
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-md">
            {[
              { label: "Pesanan", value: "3" },
              { label: "Ulasan", value: "2" },
              { label: "Favorit", value: "5" },
            ].map(({ label, value }) => (
              <div key={label} className="bg-surface-container-low border border-cream-dark rounded-xl p-md text-center">
                <p className="font-headline-md text-headline-md text-primary">{value}</p>
                <p className="text-on-surface-variant text-label-sm font-label-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right — menu & settings */}
        <div className="flex-1 space-y-xl">
          {/* Activity */}
          <section>
            <h3 className="font-headline-md text-headline-md text-forest-deep mb-md">Aktivitas</h3>
            <div className="bg-surface-container-low border border-cream-dark rounded-2xl divide-y divide-cream-dark">
              {MENU.map(({ icon, label, href, count }) => (
                <Link
                  key={label}
                  href={href}
                  className="flex items-center justify-between px-xl py-lg hover:bg-surface-container transition-colors group"
                >
                  <div className="flex items-center gap-md">
                    <span className="material-symbols-outlined text-primary text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {icon}
                    </span>
                    <span className="font-body-lg text-body-lg text-on-surface">{label}</span>
                  </div>
                  <div className="flex items-center gap-sm">
                    <span className="bg-primary text-on-primary text-label-sm font-label-sm px-sm py-xs rounded-full min-w-5.5 text-center">
                      {count}
                    </span>
                    <span className="material-symbols-outlined text-on-surface-variant text-[18px] group-hover:text-primary transition-colors">
                      chevron_right
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Settings */}
          <section>
            <h3 className="font-headline-md text-headline-md text-forest-deep mb-md">Pengaturan</h3>
            <div className="bg-surface-container-low border border-cream-dark rounded-2xl divide-y divide-cream-dark">
              {SETTINGS.map(({ icon, label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="flex items-center justify-between px-xl py-lg hover:bg-surface-container transition-colors group"
                >
                  <div className="flex items-center gap-md">
                    <span className="material-symbols-outlined text-on-surface-variant text-[22px]">{icon}</span>
                    <span className="font-body-lg text-body-lg text-on-surface">{label}</span>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant text-[18px] group-hover:text-primary transition-colors">
                    chevron_right
                  </span>
                </Link>
              ))}

              {/* Logout */}
              <button
                onClick={() => { logout(); router.push("/"); }}
                className="w-full flex items-center gap-md px-xl py-lg hover:bg-error-container/30 transition-colors text-left"
              >
                <span className="material-symbols-outlined text-error text-[22px]">logout</span>
                <span className="font-body-lg text-body-lg text-error">Keluar</span>
              </button>
            </div>
          </section>

          {/* Upgrade banner */}
          <div className="bg-forest-deep rounded-2xl p-xl flex items-center justify-between gap-lg relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-cta-amber/10 rounded-full blur-2xl" aria-hidden="true" />
            <div className="z-10">
              <p className="font-body-lg text-body-lg text-surface-container-lowest">Punya keahlian?</p>
              <p className="text-pale-mint font-body-md text-body-md">Daftarkan diri sebagai pekerja dan mulai terima pesanan.</p>
            </div>
            <Link
              href="/daftar-pekerja"
              className="shrink-0 z-10 bg-cta-amber text-forest-deep px-xl py-sm rounded-full font-bold text-body-md hover:scale-105 transition-all"
            >
              Daftar
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
