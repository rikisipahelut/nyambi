import Link from "next/link";
import DaftarForm from "./DaftarForm";
import type { Category } from "@/types";

export const metadata = {
  title: "Daftar Jadi Pekerja - Nyambi",
  description: "Bergabunglah dengan ribuan pekerja terpercaya di Nyambi.",
};

async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data.map((c: { id: string; icon: string; title: string; worker_count: number }) => ({
      id: c.id,
      icon: c.icon,
      title: c.title,
      workerCount: `${c.worker_count}+`,
    }));
  } catch {
    return [];
  }
}

export default async function DaftarPekerjaPage() {
  const categories = await fetchCategories();

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
          <h1 className="font-headline-lg text-headline-lg text-forest-deep">Daftar Jadi Pekerja</h1>
          <p className="text-text-mid font-body-md mt-xs">
            Isi data di bawah dan mulai terima pesanan hari ini.
          </p>
        </div>

        <DaftarForm categories={categories} />
      </main>
    </>
  );
}
