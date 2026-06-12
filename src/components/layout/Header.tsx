"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useScrollShadow } from "@/hooks/useScrollShadow";
import { useAuth } from "@/hooks/useAuth";

function getInitials(nama: string) {
  return nama.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const headerRef = useScrollShadow<HTMLElement>();
  const { user, ready, logout } = useAuth();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function handleLogout() {
    logout();
    setIsDropdownOpen(false);
    router.push("/");
  }

  return (
    <header
      ref={headerRef}
      className="bg-surface full-width top-0 sticky z-50 border-b border-cream-dark transition-shadow"
    >
      <nav className="flex justify-between items-center h-20 px-xl md:px-5xl max-w-360 mx-auto w-full">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-headline-md font-display font-black text-primary tracking-tight">
            Nyambi
          </span>
        </Link>

        <div className="hidden md:flex gap-xl items-center">
          <Link
            href="/cari"
            className="text-primary font-bold border-b-2 border-primary pb-1 font-body-md text-body-md"
          >
            Cari Jasa
          </Link>
          <Link
            href="/daftar-pekerja"
            className="text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md"
          >
            Menjadi Pekerja
          </Link>
          <Link
            href="/tentang-kami"
            className="text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md"
          >
            Tentang Kami
          </Link>
        </div>

        <div className="flex gap-md items-center">
          {ready && user ? (
            /* Logged-in: avatar + dropdown */
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setIsDropdownOpen((v) => !v)}
                className="flex items-center gap-sm px-sm py-xs rounded-full hover:bg-surface-container-low transition-all"
              >
                <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center shrink-0">
                  <span className="text-on-primary font-bold text-label-sm">
                    {getInitials(user.nama)}
                  </span>
                </div>
                <span className="hidden md:block font-body-md text-body-md text-on-surface capitalize max-w-24 truncate">
                  {user.nama}
                </span>
                <span className="material-symbols-outlined text-on-surface-variant text-[18px] transition-transform" style={{ transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
                  expand_more
                </span>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-xs w-52 bg-surface border border-cream-dark rounded-2xl shadow-lg overflow-hidden z-50">
                  <div className="px-xl py-lg border-b border-cream-dark">
                    <p className="font-body-lg text-body-lg text-forest-deep capitalize truncate">{user.nama}</p>
                    <p className="text-on-surface-variant text-label-sm font-label-sm truncate">{user.email}</p>
                  </div>
                  {[
                    { icon: "person", label: "Profil Saya", href: "/profil" },
                    { icon: "shopping_bag", label: "Riwayat Pesanan", href: "/riwayat-pesanan" },
                    { icon: "favorite", label: "Pekerja Favorit", href: "/pekerja-favorit" },
                  ].map(({ icon, label, href }) => (
                    <Link
                      key={label}
                      href={href}
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-md px-xl py-md hover:bg-surface-container-low transition-colors"
                    >
                      <span className="material-symbols-outlined text-on-surface-variant text-[18px]">{icon}</span>
                      <span className="font-body-md text-body-md text-on-surface">{label}</span>
                    </Link>
                  ))}
                  <div className="border-t border-cream-dark">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-md px-xl py-md hover:bg-error-container/20 transition-colors"
                    >
                      <span className="material-symbols-outlined text-error text-[18px]">logout</span>
                      <span className="font-body-md text-body-md text-error">Keluar</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Logged-out: Masuk + Daftar */
            <>
              <Link
                href="/masuk"
                className="hidden md:block px-lg py-sm rounded-full text-primary font-bold hover:bg-surface-container-low transition-all"
              >
                Masuk
              </Link>
              <Link
                href="/daftar"
                className="px-lg py-sm rounded-full bg-primary text-on-primary font-bold hover:bg-primary-container transition-all active:scale-95"
              >
                Daftar
              </Link>
            </>
          )}
          <button
            className="md:hidden p-2 text-primary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined">{isMenuOpen ? "close" : "menu"}</span>
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="md:hidden bg-surface border-t border-cream-dark px-xl py-lg flex flex-col gap-lg">
          <Link href="/cari" className="text-primary font-bold font-body-md text-body-md" onClick={() => setIsMenuOpen(false)}>
            Cari Jasa
          </Link>
          <Link href="/daftar-pekerja" className="text-on-surface-variant font-body-md text-body-md" onClick={() => setIsMenuOpen(false)}>
            Menjadi Pekerja
          </Link>
          <Link href="/tentang-kami" className="text-on-surface-variant font-body-md text-body-md" onClick={() => setIsMenuOpen(false)}>
            Tentang Kami
          </Link>
          {ready && user ? (
            <>
              <Link href="/profil" className="text-on-surface-variant font-body-md text-body-md" onClick={() => setIsMenuOpen(false)}>
                Profil Saya
              </Link>
              <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="text-error font-body-md text-body-md text-left">
                Keluar
              </button>
            </>
          ) : (
            <Link href="/masuk" className="text-on-surface-variant font-body-md text-body-md" onClick={() => setIsMenuOpen(false)}>
              Masuk
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
