import { notFound } from "next/navigation";
import Link from "next/link";
import { categories } from "@/data/categories";
import { workers } from "@/data/workers";
import WorkerCard from "@/components/ui/WorkerCard";

export function generateStaticParams() {
  return categories.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = categories.find((c) => c.id === id);
  if (!category) return {};
  return {
    title: `${category.title} - Nyambi`,
    description: `Temukan pekerja ${category.title} terpercaya di Nyambi.`,
  };
}

export default async function KategoriDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = categories.find((c) => c.id === id);
  if (!category) notFound();

  const categoryWorkers = workers.filter((w) => w.categoryId === id);

  return (
    <>
      <header className="bg-surface sticky top-0 z-50 border-b border-cream-dark">
        <nav className="flex items-center h-20 px-xl md:px-5xl max-w-360 mx-auto w-full gap-lg">
          <Link href="/kategori" className="text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <span className="text-headline-md font-display font-black text-primary tracking-tight">
            Nyambi
          </span>
        </nav>
      </header>

      <main className="py-4xl px-xl md:px-5xl max-w-360 mx-auto">
        {/* Category header */}
        <div className="flex items-center gap-lg mb-3xl">
          <div className="w-16 h-16 bg-pale-mint/20 text-primary rounded-full flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[32px]">{category.icon}</span>
          </div>
          <div>
            <h1 className="font-headline-lg text-headline-lg text-forest-deep">{category.title}</h1>
            <p className="text-text-mid font-body-md">{category.workerCount} pekerja tersedia</p>
          </div>
        </div>

        {/* Workers grid */}
        {categoryWorkers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
            {categoryWorkers.map((worker) => (
              <WorkerCard key={worker.id} {...worker} />
            ))}
          </div>
        ) : (
          <div className="text-center py-4xl">
            <span className="material-symbols-outlined text-[48px] text-outline mb-lg block">
              search_off
            </span>
            <p className="font-headline-md text-headline-md text-forest-deep">Belum ada pekerja</p>
            <p className="text-text-mid font-body-md mt-xs">
              Segera hadir — kami sedang merekrut pekerja untuk kategori ini.
            </p>
            <Link
              href="/kategori"
              className="inline-flex items-center gap-xs mt-2xl text-primary font-bold hover:underline"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Lihat Kategori Lain
            </Link>
          </div>
        )}
      </main>
    </>
  );
}
