import SubHeader from "@/components/layout/SubHeader";
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
      <SubHeader backHref="/" />

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
