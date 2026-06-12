import Link from "next/link";
import { categories } from "@/data/categories";
import { workers } from "@/data/workers";
import WorkerCard from "@/components/ui/WorkerCard";
import CategoryCard from "@/components/ui/CategoryCard";
import SearchBar from "./SearchBar";

export default async function CariPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const { q = "", lokasi = "" } = await searchParams;
  const query = q.toLowerCase().trim();
  const lokasiQuery = lokasi.toLowerCase().trim();

  const matchedCategories = query
    ? categories.filter((c) => c.title.toLowerCase().includes(query))
    : [];

  const matchedWorkers = query
    ? workers.filter((w) => {
        const inQuery =
          w.name.toLowerCase().includes(query) ||
          w.specialty.toLowerCase().includes(query) ||
          w.tags.some((t) => t.toLowerCase().includes(query)) ||
          w.services.some((s) => s.toLowerCase().includes(query)) ||
          w.bio.toLowerCase().includes(query);
        const inLokasi = lokasiQuery
          ? w.location.toLowerCase().includes(lokasiQuery)
          : true;
        return inQuery && inLokasi;
      })
    : [];

  const totalResults = matchedCategories.length + matchedWorkers.length;

  return (
    <>
      <header className="bg-surface sticky top-0 z-50 border-b border-cream-dark">
        <nav className="flex items-center h-20 px-xl md:px-5xl max-w-360 mx-auto w-full gap-lg">
          <Link href="/" className="text-on-surface-variant hover:text-primary transition-colors shrink-0">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <SearchBar initialQuery={q} initialLokasi={lokasi} />
        </nav>
      </header>

      <main className="py-4xl px-xl md:px-5xl max-w-360 mx-auto">
        {query ? (
          <>
            <p className="text-text-mid font-body-md mb-3xl">
              {totalResults > 0 ? (
                <>
                  Menampilkan <strong className="text-forest-deep">{totalResults} hasil</strong>{" "}
                  untuk &ldquo;<strong className="text-primary">{q}</strong>&rdquo;
                  {lokasi && (
                    <> di <strong className="text-forest-deep">{lokasi}</strong></>
                  )}
                </>
              ) : (
                <>
                  Tidak ada hasil untuk &ldquo;<strong className="text-primary">{q}</strong>&rdquo;
                </>
              )}
            </p>

            {/* Kategori */}
            {matchedCategories.length > 0 && (
              <section className="mb-4xl">
                <h2 className="font-headline-md text-headline-md text-forest-deep mb-xl">
                  Kategori
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-xl">
                  {matchedCategories.map((cat) => (
                    <CategoryCard key={cat.id} {...cat} />
                  ))}
                </div>
              </section>
            )}

            {/* Pekerja */}
            {matchedWorkers.length > 0 && (
              <section className="mb-4xl">
                <h2 className="font-headline-md text-headline-md text-forest-deep mb-xl">
                  Pekerja
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
                  {matchedWorkers.map((worker) => (
                    <WorkerCard key={worker.id} {...worker} />
                  ))}
                </div>
              </section>
            )}

            {/* Empty state */}
            {totalResults === 0 && (
              <div className="text-center py-4xl">
                <span className="material-symbols-outlined text-[56px] text-outline mb-lg block">
                  search_off
                </span>
                <h2 className="font-headline-md text-headline-md text-forest-deep mb-md">
                  Hasil tidak ditemukan
                </h2>
                <p className="text-text-mid font-body-md max-w-144 mx-auto mb-3xl">
                  Coba kata kunci lain atau lihat semua kategori yang tersedia.
                </p>
                <div className="flex flex-col sm:flex-row gap-lg justify-center">
                  <Link
                    href="/kategori"
                    className="px-4xl py-md rounded-full bg-primary text-on-primary font-bold hover:bg-primary-container transition-all"
                  >
                    Lihat Semua Kategori
                  </Link>
                  <Link
                    href="/pekerja"
                    className="px-4xl py-md rounded-full border border-cream-dark text-on-surface font-bold hover:border-primary hover:text-primary transition-all"
                  >
                    Lihat Semua Pekerja
                  </Link>
                </div>
              </div>
            )}
          </>
        ) : (
          /* No query — show suggestions */
          <div className="text-center py-4xl">
            <span className="material-symbols-outlined text-[56px] text-primary mb-lg block">
              search
            </span>
            <h2 className="font-headline-md text-headline-md text-forest-deep mb-md">
              Cari jasa apa hari ini?
            </h2>
            <p className="text-text-mid font-body-md mb-3xl">Coba: Tukang Listrik, Cleaning, Les Privat...</p>
            <div className="flex flex-wrap gap-md justify-center">
              {["Tukang Listrik", "Cleaning Service", "Les Privat", "Tukang Kebun", "Fotografer", "Catering"].map(
                (suggestion) => (
                  <Link
                    key={suggestion}
                    href={`/cari?q=${encodeURIComponent(suggestion)}`}
                    className="px-lg py-sm rounded-full border border-cream-dark text-on-surface-variant font-body-md text-body-md hover:border-primary hover:text-primary transition-all"
                  >
                    {suggestion}
                  </Link>
                )
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
