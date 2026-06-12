import Link from "next/link";
import type { Category } from "@/types";

export default function CategoryCard({ id, icon, title, workerCount }: Category) {
  return (
    <Link href={`/kategori/${id}`} className="group bg-surface-container-lowest p-xl rounded-xl border border-cream-dark hover:border-primary transition-all text-center block">
      <div className="w-16 h-16 bg-pale-mint/20 text-primary rounded-full flex items-center justify-center mx-auto mb-lg group-hover:scale-110 transition-transform">
        <span className="material-symbols-outlined text-[32px]">{icon}</span>
      </div>
      <h3 className="font-headline-md text-body-lg text-forest-deep">{title}</h3>
      <p className="text-on-surface-variant text-label-sm uppercase mt-xs">{workerCount} Pekerja</p>
    </Link>
  );
}
