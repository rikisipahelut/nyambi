import Link from "next/link";
import UbahPasswordClient from "./UbahPasswordClient";

export const metadata = { title: "Ubah Password - Nyambi" };

export default function UbahPasswordPage() {
  return (
    <>
      <header className="bg-surface sticky top-0 z-50 border-b border-cream-dark">
        <nav className="flex items-center h-20 px-xl md:px-5xl max-w-360 mx-auto w-full gap-lg">
          <Link href="/profil" className="text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <span className="text-title-lg font-display font-black text-forest-deep">Ubah Password</span>
        </nav>
      </header>
      <main className="py-4xl px-xl md:px-5xl max-w-360 mx-auto">
        <UbahPasswordClient />
      </main>
    </>
  );
}
