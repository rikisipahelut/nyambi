import Link from "next/link";
import { categories } from "@/data/categories";
import CategoryCard from "@/components/ui/CategoryCard";
import SearchBar from "@/app/cari/SearchBar";

export const metadata = {
  title: "Semua Kategori - Nyambi",
  description: "Temukan semua kategori jasa pekerja terampil di Nyambi.",
};

export default function KategoriPage() {
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
          <h1 className="font-headline-lg text-headline-lg text-forest-deep">Semua Kategori</h1>
          <p className="text-text-mid font-body-md mt-xs">
            Temukan ahli terbaik untuk berbagai kebutuhan harian Anda.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-xl">
          {categories.map((category) => (
            <CategoryCard key={category.id} {...category} />
          ))}
        </div>
      </main>
    </>
  );
}
