import Link from "next/link";
import { workers } from "@/data/workers";
import { categories } from "@/data/categories";
import WorkerCard from "@/components/ui/WorkerCard";
import SearchBar from "@/app/cari/SearchBar";

export const metadata = {
  title: "Semua Pekerja - Nyambi",
  description: "Temukan semua pekerja terampil terpercaya di Nyambi.",
};

export default function PekerjaPage() {
  return (
    <>
      <header className="bg-surface sticky top-0 z-50 border-b border-cream-dark">
        <nav className="flex items-center h-20 px-xl md:px-5xl max-w-360 mx-auto w-full gap-lg">
          <Link href="/" className="text-on-surface-variant hover:text-primary transition-colors shrink-0">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <SearchBar />
        </nav>
      </header>

      <main className="py-4xl px-xl md:px-5xl max-w-360 mx-auto">
        <div className="mb-3xl">
          <h1 className="font-headline-lg text-headline-lg text-forest-deep">Semua Pekerja</h1>
          <p className="text-text-mid font-body-md mt-xs">
            {workers.length} pekerja terverifikasi siap membantu Anda.
          </p>
        </div>

        {/* Filter by category */}
        <div className="flex flex-wrap gap-md mb-3xl">
          <Link
            href="/pekerja"
            className="px-lg py-sm rounded-full bg-primary text-on-primary font-bold text-body-md"
          >
            Semua
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/kategori/${cat.id}`}
              className="px-lg py-sm rounded-full border border-cream-dark text-on-surface-variant font-body-md text-body-md hover:border-primary hover:text-primary transition-all"
            >
              {cat.title}
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
          {workers.map((worker) => (
            <WorkerCard key={worker.id} {...worker} />
          ))}
        </div>
      </main>
    </>
  );
}
