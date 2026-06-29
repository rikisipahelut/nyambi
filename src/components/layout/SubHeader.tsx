"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

function getInitials(nama: string) {
  return nama.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

interface SubHeaderProps {
  backHref?: string;
  title?: string;
  children?: React.ReactNode;
}

export default function SubHeader({ backHref, title, children }: SubHeaderProps) {
  const { user, ready, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function handleBack() {
    if (backHref) router.push(backHref);
    else router.back();
  }

  function handleLogout() {
    logout();
    setOpen(false);
    router.push("/");
  }

  return (
    <header className="bg-surface sticky top-0 z-50 border-b border-cream-dark">
      <nav className="flex items-center h-20 px-xl md:px-5xl max-w-360 mx-auto w-full gap-lg">
        <button
          onClick={handleBack}
          className="text-on-surface-variant hover:text-primary transition-colors shrink-0"
          aria-label="Kembali"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>

        {children ? (
          <div className="flex-1 min-w-0">{children}</div>
        ) : title ? (
          <span className="flex-1 text-title-lg font-display font-black text-forest-deep truncate">
            {title}
          </span>
        ) : (
          <span className="flex-1 text-headline-md font-display font-black text-primary tracking-tight">
            Nyambi
          </span>
        )}

        {ready && user && (
          <div ref={dropdownRef} className="relative shrink-0">
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-xs px-xs py-xs rounded-full hover:bg-surface-container-low transition-all"
            >
              <div className="w-9 h-9 rounded-full overflow-hidden shrink-0">
                {user.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.avatar} alt={user.nama} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-primary flex items-center justify-center">
                    <span className="text-on-primary font-bold text-label-sm">{getInitials(user.nama)}</span>
                  </div>
                )}
              </div>
              <span className="hidden md:block font-body-md text-body-md text-on-surface capitalize max-w-24 truncate">
                {user.nama}
              </span>
              <span
                className="material-symbols-outlined text-on-surface-variant text-[18px] transition-transform"
                style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
              >
                expand_more
              </span>
            </button>

            {open && (
              <div className="absolute right-0 top-full mt-xs w-52 bg-surface border border-cream-dark rounded-2xl shadow-lg overflow-hidden z-50">
                <div className="px-xl py-lg border-b border-cream-dark">
                  <p className="font-body-lg text-body-lg text-forest-deep capitalize truncate">{user.nama}</p>
                  <p className="text-on-surface-variant text-label-sm font-label-sm truncate">{user.email}</p>
                </div>
                {[
                  { icon: "person",       label: "Profil Saya",      href: "/profil"          },
                  { icon: "shopping_bag", label: "Riwayat Pesanan",  href: "/riwayat-pesanan" },
                  { icon: "favorite",     label: "Pekerja Favorit",  href: "/pekerja-favorit" },
                ].map(({ icon, label, href }) => (
                  <Link
                    key={label}
                    href={href}
                    onClick={() => setOpen(false)}
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
        )}
      </nav>
    </header>
  );
}
