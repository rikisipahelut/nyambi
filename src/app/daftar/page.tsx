import Link from "next/link";
import DaftarUserForm from "./DaftarUserForm";

export const metadata = {
  title: "Daftar - Nyambi",
  description: "Buat akun Nyambi dan mulai temukan jasa terdekat.",
};

export default function DaftarPage() {
  return (
    <>
      <header className="bg-surface sticky top-0 z-50 border-b border-cream-dark">
        <nav className="flex items-center h-20 px-xl md:px-5xl max-w-360 mx-auto w-full gap-lg">
          <Link href="/" className="text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <span className="text-headline-md font-display font-black text-primary tracking-tight">
            Nyambi
          </span>
        </nav>
      </header>

      <main className="py-4xl px-xl md:px-5xl">
        <div className="text-center mb-3xl">
          <h1 className="font-headline-lg text-headline-lg text-forest-deep">Buat Akun</h1>
          <p className="text-text-mid font-body-md mt-xs">
            Temukan jasa terbaik di sekitar Anda dengan mudah dan cepat.
          </p>
        </div>

        <DaftarUserForm />
      </main>
    </>
  );
}
