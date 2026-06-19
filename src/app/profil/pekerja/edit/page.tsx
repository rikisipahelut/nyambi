import Link from "next/link";
import EditProfilPekerjaClient from "./EditProfilPekerjaClient";

export const metadata = {
  title: "Edit Profil Pekerja - Nyambi",
};

export default function EditProfilPekerjaPage() {
  return (
    <>
      <header className="bg-surface sticky top-0 z-50 border-b border-cream-dark">
        <nav className="flex items-center h-20 px-xl md:px-5xl max-w-360 mx-auto w-full gap-lg">
          <Link href="/profil" className="text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="font-headline-md text-headline-md text-forest-deep">Edit Profil Pekerja</h1>
        </nav>
      </header>

      <main className="py-4xl px-xl md:px-5xl">
        <EditProfilPekerjaClient />
      </main>
    </>
  );
}
