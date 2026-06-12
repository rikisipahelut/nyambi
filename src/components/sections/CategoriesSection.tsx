import Link from "next/link";
import { categories } from "@/data/categories";
import CategoryCard from "@/components/ui/CategoryCard";

export default function CategoriesSection() {
  return (
    <section className="py-4xl px-xl md:px-5xl max-w-360 mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-3xl gap-lg">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-forest-deep">Kategori Populer</h2>
          <p className="text-text-mid font-body-md">
            Temukan ahli terbaik untuk berbagai kebutuhan harian Anda.
          </p>
        </div>
        <Link
          href="/kategori"
          className="text-primary font-bold flex items-center gap-xs hover:underline transition-all"
        >
          Lihat Semua Kategori{" "}
          <span className="material-symbols-outlined">arrow_right_alt</span>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-xl">
        {categories.slice(0, 4).map((category) => (
          <CategoryCard key={category.id} {...category} />
        ))}
      </div>
    </section>
  );
}
